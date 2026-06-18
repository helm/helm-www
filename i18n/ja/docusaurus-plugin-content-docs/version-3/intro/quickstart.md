---
title: クイックスタートガイド
description: Helm をインストールして使い始めるためのガイドです。
sidebar_position: 1
---

このガイドでは、Helm をすぐに使い始める方法を説明します。

## 前提条件

Helm を正しく安全に使用するには、以下の前提条件が必要です。

1. Kubernetes クラスター
2. インストールに適用するセキュリティ構成の決定（必要な場合）
3. Helm のインストールと設定

### Kubernetes をインストールするか、クラスターにアクセスする

- Kubernetes がインストールされている必要があります。Helm の最新リリースには、Kubernetes の最新の安定リリースを推奨します。ほとんどの場合、これは2番目に新しいマイナーリリースです。
- ローカルに設定された `kubectl` も必要です。

Helm と Kubernetes 間でサポートされる最大バージョン差については、[Helm バージョンサポートポリシー](https://helm.sh/docs/topics/version_skew/)を参照してください。

## Helm のインストール

Helm クライアントのバイナリリリースをダウンロードします。`homebrew` などのツールを使用するか、[公式リリースページ](https://github.com/helm/helm/releases)を参照してください。

詳細やその他のオプションについては、[インストールガイド](/intro/install.md)を参照してください。

## Helm chart リポジトリを初期化する {#initialize-a-helm-chart-repository}

Helm の準備ができたら、chart リポジトリを追加できます。利用可能な Helm chart リポジトリについては、[Artifact Hub](https://artifacthub.io/packages/search?kind=0) を確認してください。

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

リポジトリを追加すると、インストールできる chart を一覧表示できます。

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... and many more
```

## サンプル chart をインストールする

chart をインストールするには、`helm install` コマンドを実行します。Helm には chart を見つけてインストールする方法がいくつかありますが、最も簡単なのは `bitnami` chart を使用する方法です。

```console
$ helm repo update              # Make sure we get the latest list of charts
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

上記の例では、`bitnami/mysql` chart がリリースされ、新しい release の名前は `mysql-1612624192` です。

`helm show chart bitnami/mysql` を実行すると、この MySQL chart の機能の概要を確認できます。`helm show all bitnami/mysql` を実行すると、chart に関するすべての情報を取得できます。

chart をインストールするたびに、新しい release が作成されます。そのため、1つの chart を同じクラスターに複数回インストールできます。各 release は個別に管理およびアップグレードできます。

`helm install` コマンドは多くの機能を備えた強力なコマンドです。詳細については、[Helm の使い方ガイド](/intro/using_helm.md)を参照してください。

## release について学ぶ

Helm を使用してリリースした内容は簡単に確認できます。

```console
$ helm list
NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

`helm list`（または `helm ls`）を実行すると、デプロイ済みのすべての release の一覧が表示されます。

## release をアンインストールする

release をアンインストールするには、`helm uninstall` コマンドを使用します。

```console
$ helm uninstall mysql-1612624192
release "mysql-1612624192" uninstalled
```

これにより、Kubernetes から `mysql-1612624192` がアンインストールされ、release に関連するすべてのリソースと release 履歴が削除されます。

`--keep-history` フラグを指定すると、release 履歴が保持されます。その release に関する情報を取得できます。

```console
$ helm status mysql-1612624192
Status: UNINSTALLED
...
```

Helm はアンインストール後も release を追跡するため、クラスターの履歴を監査したり、`helm rollback` で release を復元したりできます。

## ヘルプテキストを読む

利用可能な Helm コマンドの詳細については、`helm help` を使用するか、コマンドに `-h` フラグを付けて実行してください。

```console
$ helm get -h
```
