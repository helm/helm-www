---
title: "高度な Helm のテクニック"
description: "Helm パワーユーザー向けのさまざまな高度な機能について説明します"
weight: 9
---

このセクションでは、Helm を使用するためのさまざまな高度な機能とテクニックについて説明します。
このセクションの情報は、チャートとリリースの高度なカスタマイズと操作を行いたい
Helm の「パワーユーザー」を対象としています。
これらの高度な機能にはそれぞれ独自のトレードオフと警告があり、
Helm の深い知識を駆使して慎重に使用する必要があります。
言い換えれば、[ピーター・パーカーの原則](https://en.wikipedia.org/wiki/With_great_power_comes_great_responsibility)
を覚えておいてください

## ポストレンダリング
ポストレンダリングにより、チャートインストーラーは、Helm によってインストールされる前に、
レンダリングされたマニフェストを手動で操作、構成、または検証することができます。
これにより、高度な構成を持つユーザーは、[`kustomize`](https://kustomize.io) などのツールを使用して、
パブリックチャートをフォークしたり、
チャートのメンテナーがソフトウェアの最後の構成オプションをすべて指定したりする必要なく、
構成の変更を適用できます。
エンタープライズ環境での一般的なツールやサイドカーの注入、
展開前のマニフェストの分析のユースケースもあります。

### 前提条件
- Helm 3.1+

### 使い方
ポストレンダラーは、STDIN でレンダリングされた Kubernetes マニフェストを受け入れ、
STDOUT で有効な Kubernetes マニフェストを返す任意の実行可能ファイルです。
失敗した場合は、0 以外の終了コードを返します。
これは、2つのコンポーネント間の唯一の "API" です。
これにより、ポストレンダリングプロセスで実行できる操作に大きな柔軟性がもたらされます。

ポストレンダラーは、`install`、`upgrade`、および `template` で使用できます。
ポストレンダラーを使用するには、
使用するレンダラー実行可能ファイルへのパスで `--post-renderer` フラグを使用します。

```shell
$ helm install mychart stable/wordpress --post-renderer ./path/to/executable
```

パスにセパレータが含まれていない場合は、$PATH で検索されます。
それ以外の場合は、相対パスが完全修飾パスに解決されます。

複数のポストレンダラーを使用したい場合は、それらをすべてスクリプトで呼び出すか、
ビルドしたバイナリツールで一緒に呼び出します。
bash では、これは `renderer1 | renderer2 | renderer3` のように単純です。

`kustomize` をポストレンダラーとして使用する例は
[here](https://github.com/thomastaylor312/advanced-helm-demos/tree/master/post-render)で見ることができます。

### 警告事項
ポストレンダラーを使用する際には、いくつかの重要なことを覚えておく必要があります。
その中でも最も重要なのは、ポストレンダラーを使用する場合、
そのリリースを変更するすべての人は、ビルドを再現可能にするために、同じレンダラーを使用 **しなければならない** ということです。
この機能は、ユーザーが使用しているレンダラーを切り替えたり、
レンダラーの使用を停止したりできるように意図的に構築されていますが、
これは偶発的な変更やデータの損失を避けるために意図的に行う必要があります。

もう一つの重要な注意点は、セキュリティに関するものです。
ポストレンダラを使用する場合は、
信頼できるソースからのものであることを確認する必要があります (他の任意の実行ファイルの場合と同様です)。
信頼されていない、または検証されていないレンダラーを使用することは推奨されません。
レンダリングされたテンプレートに完全にアクセスできるため、秘密のデータが含まれていることが多いからです。

### カスタムポストレンダラー
ポストレンダラーステップは、Go SDK で使用するとさらに柔軟性が増します。
ポストレンダラーは、以下の Go インターフェースを実装するだけで済みます。

```go
type PostRenderer interface {
    // Run expects a single buffer filled with Helm rendered manifests. It
    // expects the modified results to be returned on a separate buffer or an
    // error if there was an issue or failure while running the post render step
    Run(renderedManifests *bytes.Buffer) (modifiedManifests *bytes.Buffer, err error)
}
```

Go SDK の使用方法については、[Go SDK セクション](#go-sdk)を参照してください。

## Go SDK
Helm 3 では、Helm を活用したソフトウェアやツールを構築する際の操作性を向上させるために、
完全に再構築された Go SDK がデビューしました。
完全なドキュメントは [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3) にありますが、
最も一般的なパッケージの簡単な概要と簡単な例を以下に示します。

### パッケージ概要
よく使われるパッケージを、
それぞれについて簡単に解説します。

- `pkg/action`: Helm のアクションを実行するためのメインの「クライアント」が含まれています。
  これは、CLI がフードの下で使用しているのと同じパッケージです。
  他の Go プログラムから基本的な Helm コマンドを実行する必要がある場合は、
  このパッケージが適しています。
- `pkg/{chart,chartutil}`: チャートの読み込みと操作に使用される
  メソッドとヘルパー
- `pkg/cli` とそのサブパッケージ: 標準 Helm 環境変数のすべてのハンドラを含み、
  そのサブパッケージには
  出力と値のファイル処理が含まれています。
- `pkg/release`: `Release` オブジェクトとステータスを定義します

これら以外にもたくさんのパッケージがあるのは明らかなので、
詳しくはドキュメントをチェックしてみてください。

### 簡単な例
これは、Go SDK を使って `helm list` を実行する簡単な例です。

```go
package main

import (
    "log"
    "os"

    "helm.sh/helm/v3/pkg/action"
    "helm.sh/helm/v3/pkg/cli"
)

func main() {
    settings := cli.New()

    actionConfig := new(action.Configuration)
    // You can pass an empty string instead of settings.Namespace() to list
    // all namespaces
    if err := actionConfig.Init(settings.RESTClientGetter(), settings.Namespace(), os.Getenv("HELM_DRIVER"), log.Printf); err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    client := action.NewList(actionConfig)
    // Only list deployed
    client.Deployed = true
    results, err := client.Run()
    if err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    for _, rel := range results {
        log.Printf("%+v", rel)
    }
}

```

## ストレージバックエンド

Helm 3 はデフォルトでリリース情報をリリースのネームスペースに Secrets として保存するように変更しました。
Helm 2 はデフォルトでリリース情報を ConfigMaps として Tiller インスタンスの名前空間に保存します。
以下のサブセクションでは、異なるバックエンドを設定する方法を示します。
この設定は、環境変数 `HELM_DRIVER` に基づいています。
`[configmap, secret]` のいずれかの値を設定することができます。

### ConfigMap ストレージバックエンド

ConfigMap バックエンドを有効にするには、
環境変数 `HELM_DRIVER` を `configmap` に設定する必要があります。

次のようにシェルで設定します。

```shell
export HELM_DRIVER=configmap
```

デフォルトのバックエンドから ConfigMap バックエンドに切り替えたい場合は、
自分でマイグレーションを行う必要があります。
リリース情報は以下のコマンドで取得できます。

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```

**プロダクションの注意**: リリース情報には、不正アクセスから保護する必要がある機密データ (パスワード、秘密鍵、その他の資格情報など) が含まれている可能性があります。
Kubernetes の認証を管理する際に、
例えば [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) を使用して、
Secret リソースへのアクセスを制限しつつ、
ConfigMap リソースへの幅広いアクセスを許可することができます。
例えば、デフォルトの[ユーザー向けロール](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)「view」では、
ほとんどのリソースへのアクセスを許可しますが、
Secrets へのアクセスは許可しません。
さらに、Secrets データは[encrypted ストレージ](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)に設定することができます。
ConfigMap バックエンドに切り替える場合は、
アプリケーションの機密データが漏洩する可能性があることを念頭に置いてください。
