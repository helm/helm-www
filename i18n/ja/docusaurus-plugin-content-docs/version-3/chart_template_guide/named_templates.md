---
title: 名前付きテンプレート
description: 名前付きテンプレートの定義方法を解説します。
sidebar_position: 9
---

ここからは 1 つのテンプレートを超えて、複数のテンプレートを作成していきます。このセクションでは、1 つのファイル内で _名前付きテンプレート_ を定義し、それを他の場所で使用する方法を説明します。_名前付きテンプレート_（_partial_ や _subtemplate_ とも呼ばれます）は、ファイル内で定義され、名前が付けられたテンプレートです。作成方法を 2 つ、使用方法をいくつか紹介します。

[フロー制御](/chart_template_guide/control_structures.md)のセクションでは、テンプレートの宣言と管理のための 3 つのアクションを紹介しました: `define`、`template`、`block` です。このセクションでは、これら 3 つのアクションに加えて、`template` アクションと同様に機能する特別な `include` 関数も取り上げます。

テンプレートに名前を付ける際に覚えておくべき重要な点があります: **テンプレート名はグローバルです**。同じ名前のテンプレートを 2 つ宣言した場合、最後に読み込まれたものが使用されます。サブチャートのテンプレートはトップレベルのテンプレートと一緒にコンパイルされるため、_chart 固有の名前_ でテンプレートに名前を付けるように注意してください。

一般的な命名規則として、定義した各テンプレートに chart 名をプレフィックスとして付ける方法があります: `{{ define "mychart.labels" }}`。chart 固有の名前をプレフィックスとして使用することで、同じ名前のテンプレートを実装している異なる chart 間での衝突を回避できます。

この動作は、chart の異なるバージョン間でも同様に適用されます。`mychart` のバージョン `1.0.0` で特定の方法でテンプレートを定義し、`mychart` のバージョン `2.0.0` で既存の名前付きテンプレートを変更した場合、最後に読み込まれたものが使用されます。この問題を回避するには、chart 名にバージョンを含めるという方法もあります: `{{ define "mychart.v1.labels" }}` や `{{ define "mychart.v2.labels" }}` のようにします。

## Partial と `_` ファイル

ここまでは 1 つのファイルを使用し、そのファイルには単一のテンプレートが含まれていました。しかし、Helm のテンプレート言語では、名前付きの埋め込みテンプレートを作成し、他の場所から名前でアクセスすることができます。

これらのテンプレートの書き方の詳細に入る前に、ファイルの命名規則について説明します:

* `templates/` 内のほとんどのファイルは、Kubernetes マニフェストを含むものとして扱われます
* `NOTES.txt` は例外です
* ファイル名がアンダースコア（`_`）で始まるファイルは、マニフェストを含んでいないと見なされます。これらのファイルは Kubernetes オブジェクト定義としてはレンダリングされませんが、他の chart テンプレート内のどこからでも使用できます

これらのファイルは、partial やヘルパーを格納するために使用されます。実際、最初に `mychart` を作成したときに、`_helpers.tpl` というファイルがあったことを思い出してください。このファイルがテンプレート partial のデフォルトの保存場所です。

## `define` と `template` によるテンプレートの宣言と使用

`define` アクションを使用すると、テンプレートファイル内で名前付きテンプレートを作成できます。構文は以下のとおりです:

```yaml
{{- define "MY.NAME" }}
  # body of template here
{{- end }}
```

たとえば、Kubernetes のラベルブロックをカプセル化するテンプレートを定義できます:

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

このテンプレートを既存の ConfigMap に埋め込み、`template` アクションで呼び出すことができます:

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

テンプレートエンジンがこのファイルを読み込むと、`mychart.labels` への参照を保存し、`template "mychart.labels"` が呼び出されるまで待機します。そして、そのテンプレートをインラインでレンダリングします。結果は以下のようになります:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: running-panda-configmap
  labels:
    generator: helm
    date: 2016-11-02
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

注意: この例のように template で呼び出されない限り、`define` は出力を生成しません。

慣例として、Helm chart ではこれらのテンプレートを partial ファイル（通常は `_helpers.tpl`）に配置します。この関数をそこに移動してみましょう:

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

慣例として、`define` 関数には何をするかを説明する簡単なドキュメントブロック（`{{/* ... */}}`）を付けるべきです。

この定義は `_helpers.tpl` にありますが、`configmap.yaml` からも引き続きアクセスできます:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

前述のとおり、**テンプレート名はグローバルです**。そのため、同じ名前で 2 つのテンプレートが宣言された場合、最後に読み込まれたものが使用されます。サブチャートのテンプレートはトップレベルのテンプレートと一緒にコンパイルされるため、_chart 固有の名前_ でテンプレートに名前を付けるのがベストプラクティスです。一般的な命名規則として、定義した各テンプレートに chart 名をプレフィックスとして付ける方法があります: `{{ define "mychart.labels" }}`。

## テンプレートのスコープ設定

上記で定義したテンプレートでは、オブジェクトを一切使用せず、関数のみを使用しました。定義したテンプレートを修正して、chart 名と chart バージョンを含めてみましょう:

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
    chart: {{ .Chart.Name }}
    version: {{ .Chart.Version }}
{{- end }}
```

これをレンダリングすると、以下のようなエラーが発生します:

```console
$ helm install --dry-run moldy-jaguar ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [unknown object type "nil" in ConfigMap.metadata.labels.chart, unknown object type "nil" in ConfigMap.metadata.labels.version]
```

レンダリング結果を確認するには、`--disable-openapi-validation` を付けて再実行します:
`helm install --dry-run --disable-openapi-validation moldy-jaguar ./mychart`。
結果は期待どおりではありません:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: moldy-jaguar-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart:
    version:
```

名前とバージョンはどうなったのでしょうか？定義したテンプレートのスコープ内になかったのです。名前付きテンプレート（`define` で作成されたもの）がレンダリングされると、`template` 呼び出しで渡されたスコープを受け取ります。この例では、テンプレートを以下のように呼び出していました:

```yaml
{{- template "mychart.labels" }}
```

スコープが渡されていないため、テンプレート内では `.` の中の何にもアクセスできません。これは簡単に修正できます。テンプレートにスコープを渡すだけです:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" . }}
```

`template` 呼び出しの最後に `.` を渡していることに注目してください。`.Values` や `.Values.favorite` など、任意のスコープを渡すこともできますが、ここではトップレベルのスコープが必要です。名前付きテンプレートのコンテキスト内では、`$` は渡されたスコープを参照し、グローバルスコープを参照するわけではありません。

このテンプレートを `helm install --dry-run --debug plinking-anaco ./mychart` で実行すると、以下の結果が得られます:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: plinking-anaco-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart: mychart
    version: 0.1.0
```

これで `{{ .Chart.Name }}` は `mychart` に、`{{ .Chart.Version }}` は `0.1.0` に解決されます。

## `include` 関数

以下のような単純なテンプレートを定義したとします:

```yaml
{{- define "mychart.app" -}}
app_name: {{ .Chart.Name }}
app_version: "{{ .Chart.Version }}"
{{- end -}}
```

このテンプレートをテンプレートの `labels:` セクションと `data:` セクションの両方に挿入したいとします:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
    {{ template "mychart.app" . }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ template "mychart.app" . }}
```

これをレンダリングすると、以下のようなエラーが発生します:

```console
$ helm install --dry-run measly-whippet ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [ValidationError(ConfigMap): unknown field "app_name" in io.k8s.api.core.v1.ConfigMap, ValidationError(ConfigMap): unknown field "app_version" in io.k8s.api.core.v1.ConfigMap]
```

レンダリング結果を確認するには、`--disable-openapi-validation` を付けて再実行します:
`helm install --dry-run --disable-openapi-validation measly-whippet ./mychart`。
出力は期待どおりではありません:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: measly-whippet-configmap
  labels:
    app_name: mychart
app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
app_name: mychart
app_version: "0.1.0"
```

両方の場所で `app_version` のインデントがおかしいことに注目してください。なぜでしょうか？置換されたテンプレートのテキストが左揃えになっているからです。`template` はアクションであり関数ではないため、`template` 呼び出しの出力を他の関数に渡す方法がありません。データは単にインラインで挿入されるだけです。

この問題を回避するため、Helm には `template` の代わりとなる方法が用意されています。テンプレートの内容を現在のパイプラインにインポートし、パイプライン内の他の関数に渡すことができます。

以下は、`indent` を使用して `mychart.app` テンプレートを正しくインデントするように修正した例です:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
{{ include "mychart.app" . | indent 4 }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ include "mychart.app" . | indent 2 }}
```

これで生成される YAML は各セクションで正しくインデントされます:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-mole-configmap
  labels:
    app_name: mychart
    app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
  app_name: mychart
  app_version: "0.1.0"
```

> Helm テンプレートでは、`template` よりも `include` を使用することが推奨されます。これにより、YAML ドキュメントの出力フォーマットをより適切に処理できるためです。

場合によっては、テンプレートとしてではなく、コンテンツをそのままインポートしたいことがあります。つまり、ファイルをそのまま取り込みたい場合です。これは、次のセクションで説明する `.Files` オブジェクトを通じてファイルにアクセスすることで実現できます。
