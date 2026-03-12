---
title: はじめに
description: Helm Go SDK の概要
sidebar_position: 1
---
Helm の Go SDK を使用すると、カスタムソフトウェアから Helm chart と Helm の機能を活用して Kubernetes ソフトウェアのデプロイを管理できます（実際、Helm CLI もそのようなツールの一つです！）。

現在、SDK は Helm CLI から機能的に分離されており、独立したツールから利用できます。Helm プロジェクトは SDK の API 安定性を約束しています。ただし、CLI と SDK の分離作業で残っている未整備な部分があることに注意してください。Helm プロジェクトはこれらを時間をかけて改善していく予定です。

完全な API ドキュメントは [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3) で確認できます。

以下では、主要なパッケージの概要と簡単な使用例を紹介します。より多くの例や、より充実した機能を持つ「ドライバー」については、[サンプル](/sdk/examples.mdx)セクションを参照してください。

## 主要パッケージの概要

- [pkg/action](https://pkg.go.dev/helm.sh/helm/v3/pkg/action):
  Helm アクションを実行するためのメイン「クライアント」を含みます。CLI が内部で使用しているパッケージと同じです。別の Go プログラムから基本的な Helm コマンドを実行するだけであれば、このパッケージが適しています。
- [pkg/chart](https://pkg.go.dev/helm.sh/helm/v3/pkg/chart)、[pkg/chartutil](https://pkg.go.dev/helm.sh/helm/v3/pkg/chartutil):
  chart の読み込みと操作に使用するメソッドとヘルパー関数
- [pkg/cli](https://pkg.go.dev/helm.sh/helm/v3/pkg/cli) およびそのサブパッケージ:
  標準の Helm 環境変数のすべてのハンドラーを含み、サブパッケージには出力と values ファイルの処理が含まれています
- [pkg/release](https://pkg.go.dev/helm.sh/helm/v3/pkg/release):
  `Release` オブジェクトとステータスを定義します

ここで紹介したもの以外にも多くのパッケージがありますので、詳細はドキュメントを確認してください！

### 簡単な使用例
これは Go SDK を使用して `helm list` を実行する簡単な例です。
より充実した例については、[サンプル](/sdk/examples.mdx)セクションを参照してください。

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


## 互換性

Helm SDK は Helm の後方互換性ガイドラインに明示的に従っています。

<https://github.com/helm/community/blob/main/hips/hip-0004.md>

つまり、破壊的変更はメジャーバージョンの更新時にのみ行われます。
