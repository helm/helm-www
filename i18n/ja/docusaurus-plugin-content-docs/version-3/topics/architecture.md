---
title: Helm アーキテクチャ
description: Helm アーキテクチャの概要を説明します。
sidebar_position: 8
---

# Helm アーキテクチャ

このドキュメントでは、Helm アーキテクチャの概要を説明します。

## Helm の目的

Helm は _chart_ と呼ばれる Kubernetes パッケージを管理するツールです。Helm では以下のことができます。

- 新しい chart をゼロから作成する
- chart を chart アーカイブ（tgz）ファイルにパッケージ化する
- chart が保存されている chart リポジトリと連携する
- 既存の Kubernetes クラスターに chart をインストール・アンインストールする
- Helm でインストールした chart の release サイクルを管理する

Helm には 3 つの重要な概念があります。

1. _chart_ は、Kubernetes アプリケーションのインスタンスを作成するために必要な情報をまとめたものです。
2. _config_ は、パッケージ化された chart にマージしてリリース可能なオブジェクトを作成するための設定情報です。
3. _release_ は、特定の _config_ と組み合わせた _chart_ の実行中のインスタンスです。

## コンポーネント

Helm は 2 つの部分で構成される実行可能ファイルです。

**Helm クライアント**は、エンドユーザー向けのコマンドラインクライアントです。クライアントは以下を担当します。

- ローカルでの chart 開発
- リポジトリの管理
- release の管理
- Helm ライブラリとの連携
  - インストールする chart の送信
  - 既存 release のアップグレードまたはアンインストールのリクエスト

**Helm ライブラリ**は、すべての Helm 操作を実行するロジックを提供します。Kubernetes API サーバーと連携し、以下の機能を提供します。

- chart と config を組み合わせて release を構築する
- chart を Kubernetes にインストールし、release オブジェクトを提供する
- Kubernetes と連携して chart のアップグレードとアンインストールを行う

スタンドアロンの Helm ライブラリは Helm のロジックをカプセル化しており、さまざまなクライアントから利用できます。

## 実装

Helm クライアントとライブラリは Go プログラミング言語で記述されています。

ライブラリは Kubernetes クライアントライブラリを使用して Kubernetes と通信します。現在、このライブラリは REST+JSON を使用しています。情報は Kubernetes 内の Secret に保存されます。独自のデータベースは必要ありません。

設定ファイルは、可能な限り YAML で記述されます。
