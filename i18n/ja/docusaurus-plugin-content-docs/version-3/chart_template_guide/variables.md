---
title: 変数
description: テンプレートでの変数の使い方を解説します。
sidebar_position: 8
---

これまでに関数、パイプライン、オブジェクト、制御構造について解説してきました。ここでは、多くのプログラミング言語で基本的な概念である変数について説明します。テンプレートでの使用頻度は高くありませんが、コードを簡潔にしたり、`with` や `range` をより効果的に使ったりするのに役立ちます。

前の例で、以下のコードが失敗することを確認しました:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

`Release.Name` は `with` ブロックで制限されたスコープの外にあります。スコープの問題を回避する方法の 1 つは、現在のスコープに関係なくアクセスできる変数にオブジェクトを代入することです。

Helm テンプレートにおける変数は、別のオブジェクトへの名前付き参照です。変数は `$name` という形式で記述します。変数への代入には、特別な代入演算子 `:=` を使用します。上記を変数を使って書き直してみましょう。`Release.Name` を変数に格納できます:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- $relname := .Release.Name -}}
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $relname }}
  {{- end }}
```

`with` ブロックの開始前に `$relname := .Release.Name` で代入していることに注目してください。これにより、`with` ブロック内でも `$relname` 変数は引き続き release 名を参照できます。

上記を実行すると、以下の出力が得られます:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: viable-badger-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  release: viable-badger
```

変数は `range` ループで特に便利です。リスト型のオブジェクトに対して、インデックスと値の両方を取得できます:

```yaml
  toppings: |-
    {{- range $index, $topping := .Values.pizzaToppings }}
      {{ $index }}: {{ $topping }}
    {{- end }}

```

`range` が最初に来て、次に変数、代入演算子、リストの順になることに注意してください。これにより、整数のインデックス（0 から開始）が `$index` に、値が `$topping` に代入されます。実行結果は次のとおりです:

```yaml
  toppings: |-
      0: mushrooms
      1: cheese
      2: peppers
      3: onions
```

キーと値の両方を持つデータ構造に対しても、`range` で両方を取得できます。たとえば、`.Values.favorite` を以下のようにループできます:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

最初のイテレーションでは `$key` が `drink`、`$val` が `coffee` になり、2 回目のイテレーションでは `$key` が `food`、`$val` が `pizza` になります。上記を実行すると、以下の出力が生成されます:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eager-rabbit-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

変数は通常「グローバル」ではありません。宣言されたブロック内でのみ有効です。先ほどの例では、`$relname` をテンプレートのトップレベルで代入しました。この変数はテンプレート全体で有効です。しかし、最後の例の `$key` と `$val` は `{{ range... }}{{ end }}` ブロック内でのみ有効です。

ただし、常にルートコンテキストを参照する変数が 1 つあります: `$` です。これは、range でループしているときに chart の release 名を取得したい場合などに非常に便利です。

以下に使用例を示します:

```yaml
{{- range .Values.tlsSecrets }}
---
apiVersion: v1
kind: Secret
metadata:
  name: {{ .name }}
  labels:
    # 多くの Helm テンプレートでは下記で `.` を使いますが、それでは動作しません。
    # しかし、`$` を使えば動作します
    app.kubernetes.io/name: {{ template "fullname" $ }}
    # .Chart.Name は参照できませんが、$.Chart.Name は参照できます
    helm.sh/chart: "{{ $.Chart.Name }}-{{ $.Chart.Version }}"
    app.kubernetes.io/instance: "{{ $.Release.Name }}"
    # Chart.yaml の appVersion から取得した値
    app.kubernetes.io/version: "{{ $.Chart.AppVersion }}"
    app.kubernetes.io/managed-by: "{{ $.Release.Service }}"
type: kubernetes.io/tls
data:
  tls.crt: {{ .certificate }}
  tls.key: {{ .key }}
{{- end }}
```

ここまでは、1 つのファイルで宣言された 1 つのテンプレートのみを扱ってきました。しかし、Helm テンプレート言語の強力な機能の 1 つは、複数のテンプレートを宣言し、それらを組み合わせて使用できることです。次のセクションでその方法を説明します。
