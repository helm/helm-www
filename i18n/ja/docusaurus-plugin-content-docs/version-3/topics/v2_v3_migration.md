---
title: Helm v2 から v3 への移行
description: Helm v2 から v3 への移行方法について説明します。
sidebar_position: 13
---

このガイドでは、Helm v2 から v3 への移行方法について説明します。Helm v2 がインストールされており、1 つ以上のクラスターで release を管理している環境が前提です。

## Helm 3 の変更点の概要

Helm 2 から 3 への変更点の完全なリストは、[FAQ セクション](/faq/changes_since_helm2.md)に記載されています。以下は、移行前および移行中にユーザーが認識しておくべき主な変更点の概要です。

1. Tiller の廃止:
   - クライアント/サーバー アーキテクチャからクライアント/ライブラリ アーキテクチャに変更（`helm` バイナリのみ）
   - セキュリティはユーザー単位で管理（Kubernetes ユーザーのクラスターセキュリティに委任）
   - release はクラスター内の Secret として保存され、release オブジェクトのメタデータが変更
   - release は Tiller の namespace ではなく、release ごとの namespace 単位で永続化
2. chart リポジトリの更新:
   - `helm search` がローカルリポジトリ検索と Artifact Hub への検索クエリの両方をサポート
3. chart の apiVersion が「v2」に更新され、以下の仕様変更を含む:
   - 動的にリンクされる chart の依存関係が `Chart.yaml` に移動（`requirements.yaml` は廃止、requirements → dependencies に変更）
   - ライブラリ chart（ヘルパー/共通 chart）を動的にリンクされた chart の依存関係として追加可能
   - chart に `type` メタデータフィールドが追加され、`application` または `library` chart として定義可能。デフォルトは application で、レンダリングおよびインストールが可能
   - Helm 2 の chart（apiVersion=v1）も引き続きインストール可能
4. XDG ディレクトリ仕様の追加:
   - Helm home が廃止され、構成ファイルの保存には XDG ディレクトリ仕様を使用
   - Helm の初期化が不要に
   - `helm init` と `helm home` は廃止
5. その他の変更:
   - Helm のインストール/セットアップが簡素化:
     - Helm クライアント（helm バイナリ）のみ（Tiller 不要）
     - インストール後すぐに使用可能
   - `local` や `stable` リポジトリはデフォルトで設定されない
   - `crd-install` hook は廃止され、chart 内の `crds` ディレクトリに置き換え。このディレクトリで定義されたすべての CRD は、chart のレンダリング前にインストールされる
   - `test-failure` hook のアノテーション値は廃止、`test-success` は非推奨。代わりに `test` を使用
   - コマンドの廃止/置き換え/追加:
       - delete → uninstall：デフォルトですべての release 履歴を削除（以前は `--purge` が必要）
       - fetch → pull
       - home（廃止）
       - init（廃止）
       - install：release 名または `--generate-name` 引数が必須
       - inspect → show
       - reset（廃止）
       - serve（廃止）
       - template：`-x`/`--execute` 引数が `-s`/`--show-only` に名称変更
       - upgrade：`--history-max` 引数が追加され、release ごとに保存されるリビジョンの最大数を制限可能（0 で無制限）
   - Helm 3 の Go ライブラリは大幅に変更されており、Helm 2 ライブラリとは互換性がない
   - リリースバイナリは `get.helm.sh` でホストされています

## 移行のユースケース

移行のユースケースは以下のとおりです。

1. Helm v2 と v3 で同じクラスターを管理する場合:
   - このユースケースは、Helm v2 を段階的に廃止する予定があり、v3 で v2 がデプロイした release を管理する必要がない場合にのみ推奨されます。新しい release はすべて v3 でデプロイし、既存の v2 でデプロイされた release は v2 のみで更新/削除してください
   - Helm v2 と v3 は同じクラスターを問題なく管理できます。両方のバージョンは同じシステムまたは別々のシステムにインストールできます
   - Helm v3 を同じシステムにインストールする場合、Helm v2 クライアントを削除する準備ができるまで、両方のクライアントバージョンが共存できるように追加の手順が必要です。競合を避けるため、Helm v3 バイナリの名前を変更するか、別のフォルダに配置してください
   - それ以外の場合、以下の理由により両バージョン間で競合は発生しません:
     - v2 と v3 の release（履歴）ストレージは互いに独立しています。変更点には、ストレージ用の Kubernetes リソースと、リソースに含まれる release オブジェクトのメタデータが含まれます。release は Tiller の namespace ではなく、ユーザーの namespace ごとに保存されます（例: v2 のデフォルト Tiller namespace は kube-system）。v2 は Tiller namespace 下の「ConfigMaps」または「Secrets」を使用し、`TILLER` 所有権を持ちます。v3 はユーザーの namespace 内の「Secrets」を使用し、`helm` 所有権を持ちます。release は v2 と v3 の両方でインクリメンタルです
     - 唯一の問題は、Kubernetes クラスタースコープのリソース（例: `clusterroles.rbac`）が chart で定義されている場合です。リソースが競合するため、namespace 内でユニークであっても v3 のデプロイは失敗します
     - v3 の構成は `$HELM_HOME` を使用せず、代わりに XDG ディレクトリ仕様を使用します。また、必要に応じてオンデマンドで作成されます。そのため、v2 の構成とは独立しています。これは両方のバージョンが同じシステムにインストールされている場合にのみ適用されます

2. Helm v2 から Helm v3 への移行:
   - このユースケースは、Helm v3 で既存の Helm v2 release を管理したい場合に適用されます
   - Helm v2 クライアントには以下の特徴があることに注意してください:
     - 1 つ以上の Kubernetes クラスターを管理可能
     - クラスターごとに 1 つ以上の Tiller インスタンスに接続可能
   - つまり、release は Tiller とその namespace によってクラスターにデプロイされるため、移行時にはこの点を認識する必要があります。したがって、Helm v2 クライアントインスタンスが管理する各クラスターと各 Tiller インスタンスについて移行を行う必要があります
   - 推奨されるデータ移行パスは以下のとおりです:
     1. v2 データのバックアップ
     2. Helm v2 構成の移行
     3. Helm v2 release の移行
     4. Helm v3 がすべての Helm v2 データ（Helm v2 クライアントインスタンスのすべてのクラスターと Tiller インスタンス）を期待どおりに管理していることを確認したら、Helm v2 データをクリーンアップ
   - 移行プロセスは Helm v3 の [2to3](https://github.com/helm/helm-2to3) プラグインによって自動化されています

## 参照

- Helm v3 [2to3](https://github.com/helm/helm-2to3) プラグイン
- `2to3` プラグインの使用例を説明したブログ[記事](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)
