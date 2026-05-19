---
title: はじめに
description: chart テンプレートのクイックガイドです。
sidebar_position: 2
---

このガイドのセクションでは、chart を作成し、最初のテンプレートを追加します。ここで作成する chart は、ガイドの残りの部分を通して使用します。

まず、Helm chart について簡単に見ていきましょう。

## Chart の構造

[Chart ガイド](/topics/charts.md)で説明されているように、Helm chart は次のような構造になっています:

```
mychart/
  Chart.yaml
  values.yaml
  charts/
  templates/
  ...
```

`templates/` ディレクトリはテンプレートファイル用です。Helm が chart を評価すると、`templates/` ディレクトリ内のすべてのファイルをテンプレートレンダリングエンジンに通して処理します。その後、テンプレートの処理結果を収集し、Kubernetes に送信します。

`values.yaml` ファイルもテンプレートにとって重要です。このファイルには chart の _デフォルト値_ が含まれています。これらの値は、`helm install` や `helm upgrade` の実行時にユーザーが上書きできます。

`Chart.yaml` ファイルには chart の説明が含まれています。テンプレート内からこの情報にアクセスできます。

`charts/` ディレクトリには他の chart（_サブチャート_ と呼びます）を含めることが _できます_。このガイドの後半で、テンプレートレンダリング時にサブチャートがどのように動作するかを説明します。

## スターター Chart の作成

このガイドでは、`mychart` というシンプルな chart を作成し、その中にいくつかのテンプレートを作成します。

```console
$ helm create mychart
Creating mychart
```

### `mychart/templates/` の概要

`mychart/templates/` ディレクトリを見ると、すでにいくつかのファイルがあることに気づきます。

- `NOTES.txt`: chart の「ヘルプテキスト」です。ユーザーが `helm install` を実行したときに表示されます。
- `deployment.yaml`: Kubernetes の [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) を作成するための基本的なマニフェストです。
- `service.yaml`: Deployment のための [Service エンドポイント](https://kubernetes.io/docs/concepts/services-networking/service/)を作成する基本的なマニフェストです。
- `_helpers.tpl`: chart 全体で再利用できるテンプレートヘルパーを記述する場所です。

これから行うことは... _これらをすべて削除することです！_ そうすることで、チュートリアルを最初から進められます。実際には、ガイドを進めながら独自の `NOTES.txt` と `_helpers.tpl` を作成していきます。

```console
$ rm -rf mychart/templates/*
```

本番環境用の chart を作成する場合、これらの基本バージョンがあると非常に便利です。そのため、日常的な chart 作成では削除したくないでしょう。

## 最初のテンプレート

最初に作成するテンプレートは ConfigMap です。Kubernetes では、ConfigMap は設定データを格納するためのオブジェクトです。Pod などの他のリソースから ConfigMap 内のデータにアクセスできます。

ConfigMap は基本的なリソースなので、最初のテンプレートとして最適です。

まず、`mychart/templates/configmap.yaml` というファイルを作成します:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

**TIP:** テンプレート名には厳密な命名パターンはありません。ただし、YAML ファイルには `.yaml` 拡張子を、ヘルパーには `.tpl` を使用することを推奨します。

上記の YAML ファイルは、最小限の必須フィールドだけを持つ基本的な ConfigMap です。このファイルは `mychart/templates/` ディレクトリにあるため、テンプレートエンジンを通して処理されます。

`mychart/templates/` ディレクトリにこのようなプレーンな YAML ファイルを配置しても問題ありません。Helm がこのテンプレートを読み込むと、そのまま Kubernetes に送信します。

このシンプルなテンプレートで、インストール可能な chart ができました。次のようにインストールできます:

```console
$ helm install full-coral ./mychart
NAME: full-coral
LAST DEPLOYED: Tue Nov  1 17:36:01 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

Helm を使用して release を取得し、実際に読み込まれたテンプレートを確認できます。

```console
$ helm get manifest full-coral

---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

`helm get manifest` コマンドは release 名（`full-coral`）を受け取り、サーバーにアップロードされたすべての Kubernetes リソースを出力します。各ファイルは YAML ドキュメントの開始を示す `---` で始まり、その後にどのテンプレートファイルがこの YAML ドキュメントを生成したかを示す自動生成されたコメント行が続きます。

そこから先を見ると、YAML データは `configmap.yaml` ファイルに記述したものとまったく同じであることがわかります。

では、release をアンインストールしましょう: `helm uninstall full-coral`

### シンプルなテンプレート呼び出しの追加

リソースに `name:` をハードコーディングするのは、一般的に良くないプラクティスと考えられています。名前は release ごとに一意であるべきです。そのため、release 名を挿入して name フィールドを生成したいと思うかもしれません。

**TIP:** `name:` フィールドは DNS システムの制限により 63 文字に制限されています。そのため、release 名は 53 文字に制限されています。Kubernetes 1.3 以前では 24 文字（つまり名前は 14 文字）に制限されていました。

`configmap.yaml` を次のように変更します。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
```

大きな変更は `name:` フィールドの値です。現在は `{{ .Release.Name }}-configmap` となっています。

> テンプレートディレクティブは `{{` と `}}` ブロックで囲まれています。

テンプレートディレクティブ `{{ .Release.Name }}` は release 名をテンプレートに挿入します。テンプレートに渡される値は _名前空間付きオブジェクト_ と考えることができ、ドット（`.`）が各名前空間要素を区切ります。

`Release` の前の先頭のドットは、このスコープの最上位の名前空間から開始することを示します（スコープについては後で説明します）。つまり、`.Release.Name` は「最上位の名前空間から開始し、`Release` オブジェクトを見つけ、その中の `Name` というオブジェクトを探す」と読むことができます。

`Release` オブジェクトは Helm の組み込みオブジェクトの 1 つで、後で詳しく説明します。今のところは、これが Helm ライブラリが release に割り当てる release 名を表示するということだけ理解しておいてください。

このテンプレートディレクティブを使用してリソースをインストールすると、すぐに結果が確認できます:

```console
$ helm install clunky-serval ./mychart
NAME: clunky-serval
LAST DEPLOYED: Tue Nov  1 17:45:37 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

`helm get manifest clunky-serval` を実行すると、生成された YAML 全体を確認できます。

Kubernetes 内の ConfigMap の名前が、以前の `mychart-configmap` ではなく `clunky-serval-configmap` になっていることに注目してください。

これで、テンプレートの最も基本的な形を見てきました: `{{` と `}}` にテンプレートディレクティブが埋め込まれた YAML ファイルです。次のパートでは、テンプレートについてさらに深く見ていきます。しかし先に進む前に、テンプレートの構築を速くする 1 つのテクニックがあります: テンプレートのレンダリングをテストしたいが、実際には何もインストールしたくない場合は、`helm install --debug --dry-run goodly-guppy ./mychart` を使用できます。これによりテンプレートがレンダリングされます。しかし、chart をインストールする代わりに、レンダリングされたテンプレートを返すので、出力を確認できます:

```console
$ helm install --debug --dry-run goodly-guppy ./mychart
install.go:149: [debug] Original chart version: ""
install.go:166: [debug] CHART PATH: /Users/ninja/mychart

NAME: goodly-guppy
LAST DEPLOYED: Thu Dec 26 17:24:13 2019
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: nginx
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: false
  hosts:
  - host: chart-example.local
    paths: []
  tls: []
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 1
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: goodly-guppy-configmap
data:
  myvalue: "Hello World"

```

`--dry-run` を使用するとコードのテストが簡単になりますが、Kubernetes 自体が生成されたテンプレートを受け入れることは保証されません。`--dry-run` が動作するからといって、chart がインストールされると想定しないでください。

[Chart テンプレートガイド](/chart_template_guide/index.mdx)では、ここで定義した基本的な chart を使用して、Helm テンプレート言語を詳しく探っていきます。そして、組み込みオブジェクトから始めます。
