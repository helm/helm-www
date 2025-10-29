---
title: クイックスタートガイド
description: ディストリビューション、FAQ、プラグインの手順を含む、Helm のインストール方法と使用方法。
sidebar_position: 1
---

このガイドでは、Helm をすぐに使い始める方法について説明します。

## 前提条件

Helm を正しく安全に使用するには、
次の前提条件が必要です。

1. Kubernetes クラスター
2. インストールに適用するセキュリティ構成がある場合は、それを決定する
3. Helm のインストールと構成

### Kubernetes をインストールするか、クラスターにアクセスする

- Kubernetes がインストールされている必要があります。
  Helm の最新リリースには、Kubernetesの最新の安定リリースをお勧めします。
  これは、ほとんどの場合、2番目に新しいマイナーリリースです。
- ローカルに設定された `kubectl` のコピーも必要です。

注: 1.6 より前のバージョンの Kubernetes では、ロールベースのアクセス制御 (RBAC) のサポートが制限されているか、
サポートされていません。

## Helm のインストール

Helm クライアントのバイナリリリースをダウンロードします。`homebrew` のようなツールを使うか、
[公式リリースページ](https://github.com/helm/helm/releases) を見ることができます。

詳細またはその他のオプションについては、
[インストールガイド](/intro/install.md) を参照してください。

## Helm チャートリポジトリを初期化する

Helm の準備ができたら、チャートリポジトリを追加できます。
ポピュラーな開始場所の1つは、公式の Helm Stable チャートです。

```console
$ helm repo add stable https://charts.helm.sh/stable
```

これがインストールされると、インストールできるチャートを一覧表示できるようになります。

```console
helm search repo stable
NAME                                    CHART VERSION   APP VERSION                     DESCRIPTION
stable/acs-engine-autoscaler            2.2.2           2.1.1                           DEPRECATED Scales worker nodes within agent pools
stable/aerospike                        0.2.8           v4.5.0.5                        A Helm chart for Aerospike in Kubernetes
stable/airflow                          4.1.0           1.10.4                          Airflow is a platform to programmatically autho...
stable/ambassador                       4.1.0           0.81.0                          A Helm chart for Datawire Ambassador
# ... and many more
```

## サンプルチャートをインストールする

チャートをインストールするには、`helm install` コマンドを実行します。
Helm には、チャートを見つけてインストールする方法がいくつかありますが、最も簡単なのは、
公式の `stable` チャートの1つを使用することです。

```console
$ helm repo update              # チャートの最新のリストを取得していることを確認してください
$ helm install stable/mysql --generate-name
Released smiling-penguin
```

上記の例では、`stable/mysql` チャートがリリースされており、
新しいリリースの名前は `smiling-penguin` です。

`helm show chart stable/mysql` を実行すると、この MySQL チャートの機能の簡単なアイデアが得られます。
または `helm show all stable/mysql` を実行して、
チャートに関するすべての情報を取得することもできます。

チャートをインストールするたびに、新しいリリースが作成されます。
したがって、1つのチャートを同じクラスターに複数回インストールできます。
また、それぞれを個別に管理およびアップグレードできます。

`helm install` コマンドは、多くの機能を備えた非常に強力なコマンドです。
詳細については、[Helm の使用ガイド](/intro/using_helm.md) をご覧ください。

## リリースについて学ぶ

Helm を使用してリリースされた内容を簡単に確認できます。

```console
$ helm ls
NAME             VERSION   UPDATED                   STATUS    CHART
smiling-penguin  1         Wed Sep 28 12:59:46 2016  DEPLOYED  mysql-0.1.0
```

`helm list` 機能は、デプロイされたすべてのリリースのリストを表示します。

## リリースをアンインストールする

リリースをアンインストールするには、`helm uninstall` コマンドを使用します。

```console
$ helm uninstall smiling-penguin
Removed smiling-penguin
```

これにより、Kubernetes から `smiling-penguin` がアンインストールされ、
リリースに関連するすべてのリソースとリリース履歴が削除されます。

`--keep-history` フラグを指定すると、リリース履歴が保持されます。
そのリリースに関する情報をリクエストできます。

```console
$ helm status smiling-penguin
Status: UNINSTALLED
...
```

Helm はリリースをアンインストールした後でもリリースを追跡するため、クラスターの履歴を監査したり、
(`helm rollback` を使用して) リリースを元に戻したりすることができます。

## ヘルプテキストを読む

使用可能な Helm コマンドの詳細については、`helm help` を使用するか、
コマンドに続けて `-h` フラグを入力してください。

```console
$ helm get -h
```
