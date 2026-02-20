---
title: 高度な Helm テクニック
description: Helm パワーユーザー向けのさまざまな高度な機能について説明します
sidebar_position: 9
---

このセクションでは、Helm を使用するためのさまざまな高度な機能とテクニックについて説明します。ここで紹介する内容は、chart や release の高度なカスタマイズや操作を行いたい Helm の「パワーユーザー」を対象としています。これらの高度な機能にはそれぞれトレードオフや注意点があり、Helm の深い知識を持って慎重に使用する必要があります。言い換えれば、[ピーター・パーカーの原則](https://en.wikipedia.org/wiki/With_great_power_comes_great_responsibility)を心に留めておいてください。

## ポストレンダリング

ポストレンダリングは、chart インストーラーに対し、Helm がインストールする前にレンダリング済みマニフェストを手動で操作、設定、または検証する機能を提供します。これにより、高度な設定ニーズを持つユーザーは、パブリック chart をフォークしたり、chart メンテナーがソフトウェアのすべての設定オプションを指定したりする必要なく、[`kustomize`](https://kustomize.io) などのツールを使用して設定変更を適用できます。また、エンタープライズ環境で共通ツールやサイドカーを注入したり、デプロイ前にマニフェストを分析したりするユースケースもあります。

### 前提条件

- Helm 3.1 以上

### 使用方法

ポストレンダラーは、STDIN でレンダリングされた Kubernetes マニフェストを受け取り、STDOUT で有効な Kubernetes マニフェストを返す任意の実行可能ファイルです。失敗した場合は、0 以外の終了コードを返す必要があります。これが 2 つのコンポーネント間の唯一の「API」です。これにより、ポストレンダリング処理で実行できる操作に大きな柔軟性がもたらされます。

ポストレンダラーは `install`、`upgrade`、`template` で使用できます。ポストレンダラーを使用するには、使用したいレンダラー実行可能ファイルへのパスを `--post-renderer` フラグで指定します。

```shell
$ helm install mychart stable/wordpress --post-renderer ./path/to/executable
```

パスにセパレータが含まれていない場合は $PATH から検索されます。それ以外の場合は、相対パスが絶対パスに解決されます。

複数のポストレンダラーを使用したい場合は、スクリプト内ですべて呼び出すか、ビルドしたバイナリツールで一緒に呼び出します。bash では、`renderer1 | renderer2 | renderer3` のように簡単に記述できます。

`kustomize` をポストレンダラーとして使用する例は[こちら](https://github.com/thomastaylor312/advanced-helm-demos/tree/master/post-render)で確認できます。

### 注意事項

ポストレンダラーを使用する際には、いくつかの重要な点に注意してください。最も重要なのは、ポストレンダラーを使用する場合、その release を変更するすべてのユーザーが再現可能なビルドを実現するために**同じレンダラーを使用しなければならない**ということです。この機能は、ユーザーが使用するレンダラーを切り替えたり、レンダラーの使用を停止したりできるように意図的に構築されていますが、偶発的な変更やデータ損失を避けるために慎重に行う必要があります。

もう一つの重要な注意点はセキュリティに関するものです。ポストレンダラーを使用する場合は、他の実行可能ファイルと同様に、信頼できるソースからのものであることを確認してください。信頼できない、または検証されていないレンダラーの使用は推奨しません。レンダリングされたテンプレートへの完全なアクセス権があり、機密データが含まれている可能性があるためです。

### カスタムポストレンダラー

ポストレンダリングステップは、Go SDK で使用するとさらに柔軟性が高まります。ポストレンダラーは、以下の Go インターフェースを実装するだけで済みます。

```go
type PostRenderer interface {
    // Run expects a single buffer filled with Helm rendered manifests. It
    // expects the modified results to be returned on a separate buffer or an
    // error if there was an issue or failure while running the post render step
    Run(renderedManifests *bytes.Buffer) (modifiedManifests *bytes.Buffer, err error)
}
```

Go SDK の使用方法の詳細については、[Go SDK セクション](#go-sdk)を参照してください。

## Go SDK

Helm 3 では、Helm を活用したソフトウェアやツールを構築する際の体験を向上させるため、完全に再構築された Go SDK が導入されました。詳細なドキュメントは [Go SDK セクション](/sdk/gosdk.md)を参照してください。

## ストレージバックエンド

Helm 3 では、デフォルトの release 情報ストレージが release の namespace 内の Secret に変更されました。Helm 2 では、デフォルトで release 情報を Tiller インスタンスの namespace 内の ConfigMap として保存していました。以下のサブセクションでは、異なるバックエンドの設定方法を示します。この設定は環境変数 `HELM_DRIVER` に基づいています。`[configmap, secret, sql]` のいずれかの値を設定できます。

### ConfigMap ストレージバックエンド

ConfigMap バックエンドを有効にするには、環境変数 `HELM_DRIVER` を `configmap` に設定する必要があります。

シェルで次のように設定できます。

```shell
export HELM_DRIVER=configmap
```

デフォルトのバックエンドから ConfigMap バックエンドに切り替える場合は、自分でマイグレーションを行う必要があります。release 情報は以下のコマンドで取得できます。

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```

**本番環境に関する注意**: release 情報には chart や values ファイルの内容が含まれているため、不正アクセスから保護する必要がある機密データ（パスワード、秘密鍵、その他の認証情報など）が含まれている可能性があります。[RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) などで Kubernetes の認可を管理する場合、Secret リソースへのアクセスを制限しつつ、ConfigMap リソースへのより広いアクセスを許可できます。たとえば、デフォルトの[ユーザー向けロール](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)「view」は、ほとんどのリソースへのアクセスを許可しますが、Secret へのアクセスは許可しません。さらに、Secret データは[暗号化ストレージ](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)を設定できます。ConfigMap バックエンドに切り替える場合は、アプリケーションの機密データが公開される可能性があることに注意してください。

### SQL ストレージバックエンド

release 情報を SQL データベースに保存する ***ベータ版*** の SQL ストレージバックエンドがあります。

このストレージバックエンドは、release 情報が 1MB を超える場合に特に便利です（Kubernetes の基盤となる etcd キーバリューストアの内部制限により、ConfigMap や Secret には保存できないため）。

SQL バックエンドを有効にするには、SQL データベースをデプロイし、環境変数 `HELM_DRIVER` を `sql` に設定する必要があります。データベースの詳細は環境変数 `HELM_DRIVER_SQL_CONNECTION_STRING` で設定します。

シェルで次のように設定できます。

```shell
export HELM_DRIVER=sql
export HELM_DRIVER_SQL_CONNECTION_STRING=postgresql://helm-postgres:5432/helm?user=helm&password=changeme
```

> 注意: 現時点では PostgreSQL のみがサポートされています。

**本番環境に関する注意**: 以下を推奨します。
- データベースを本番環境向けに準備すること。PostgreSQL の場合は、[Server Administration](https://www.postgresql.org/docs/12/admin.html) ドキュメントを参照してください
- release 情報に対して Kubernetes の RBAC をミラーリングするために[権限管理](/topics/permissions_sql_storage_backend.md)を有効にすること

デフォルトのバックエンドから SQL バックエンドに切り替える場合は、自分でマイグレーションを行う必要があります。release 情報は以下のコマンドで取得できます。

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```
