---
title: フロー制御
description: テンプレート内のフロー構造について概説します。
sidebar_position: 7
---

制御構造（テンプレート用語では「アクション」と呼ばれます）を使うと、テンプレートの生成フローを制御できます。Helm のテンプレート言語では、以下の制御構造を提供しています:

- `if`/`else`: 条件分岐ブロックの作成
- `with`: スコープの指定
- `range`: 「for each」スタイルのループ

これらに加えて、名前付きテンプレートセグメントを宣言・使用するためのアクションもあります:

- `define`: テンプレート内で新しい名前付きテンプレートを宣言
- `template`: 名前付きテンプレートをインポート
- `block`: 埋め込み可能な特殊なテンプレート領域を宣言

このセクションでは、`if`、`with`、`range` について解説します。その他のアクションについては、本ガイドの後半にある「名前付きテンプレート」セクションで説明します。

## If/Else

最初に紹介する制御構造は、テンプレート内で条件付きのテキストブロックを含めるためのものです。これが `if`/`else` ブロックです。

条件分岐の基本構文は次のとおりです:

```
{{ if PIPELINE }}
  # Do something
{{ else if OTHER PIPELINE }}
  # Do something else
{{ else }}
  # Default case
{{ end }}
```

ここでは値ではなく _パイプライン_ について説明しています。これは、制御構造が単に値を評価するだけでなく、パイプライン全体を実行できることを明示するためです。

パイプラインは以下の場合に _false_ として評価されます:

- boolean の false
- 数値のゼロ
- 空文字列
- `nil`（空または null）
- 空のコレクション（`map`、`slice`、`tuple`、`dict`、`array`）

これら以外の条件では、すべて true として評価されます。

ConfigMap に簡単な条件分岐を追加してみましょう。drink が coffee に設定されている場合に、別の設定を追加します:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}mug: "true"{{ end }}
```

前の例で `drink: coffee` をコメントアウトしていたため、出力には `mug: "true"` フラグは含まれません。しかし、`values.yaml` ファイルにその行を戻すと、出力は次のようになります:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

## ホワイトスペースの制御

条件分岐を見ているうちに、テンプレート内でホワイトスペースがどのように制御されるかを簡単に確認しておきましょう。前の例を読みやすいように整形してみます:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
    mug: "true"
  {{ end }}
```

一見よさそうに見えます。しかし、テンプレートエンジンを通すと、残念な結果になります:

```console
$ helm install --dry-run --debug ./mychart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart
Error: YAML parse error on mychart/templates/configmap.yaml: error converting YAML to JSON: yaml: line 9: did not find expected key
```

何が起きたのでしょうか? 上記のホワイトスペースが原因で、不正な YAML が生成されました。

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
    mug: "true"
```

`mug` のインデントが正しくありません。この行のインデントを減らして、再実行してみましょう:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{ end }}
```

これを実行すると、有効な YAML が得られますが、まだ少し見た目がおかしいです:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: telling-chimp-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"

  mug: "true"

```

YAML に空行がいくつか含まれています。なぜでしょうか? テンプレートエンジンは `{{` と `}}` の間の内容を _削除_ しますが、残りのホワイトスペースはそのまま残します。

YAML ではホワイトスペースに意味があるため、その管理は非常に重要です。幸い、Helm テンプレートにはこれを支援するツールがいくつかあります。

まず、テンプレート宣言の波括弧構文を特殊文字で修飾して、テンプレートエンジンにホワイトスペースを削除するよう指示できます。`{{- `（ダッシュとスペースを追加）は左側のホワイトスペースを削除することを示し、` -}}` は右側のホワイトスペースを削除することを意味します。_注意: 改行もホワイトスペースです!_

> `-` とディレクティブの残りの部分の間には必ずスペースを入れてください。`{{- 3 }}` は「左側のホワイトスペースを削除して 3 を出力する」ことを意味しますが、`{{-3 }}` は「-3 を出力する」ことを意味します。

この構文を使って、テンプレートを修正して空行を削除しましょう:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{- end }}
```

このポイントを明確にするために、上記を調整して、このルールに従って削除されるホワイトスペースを `*` で置き換えてみましょう。行末の `*` は削除される改行文字を表します。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}*
**{{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"*
**{{- end }}

```

これを念頭に置いて、テンプレートを Helm で実行すると、結果は次のようになります:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: clunky-cat-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

ホワイトスペース削除修飾子には注意が必要です。次のような間違いをしやすいです:

```yaml
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" -}}
  mug: "true"
  {{- end -}}

```

これは `food: "PIZZA"mug: "true"` を出力します。両側の改行が削除されたためです。

> テンプレートでのホワイトスペース制御の詳細については、[Go テンプレートの公式ドキュメント](https://godoc.org/text/template)を参照してください。

最後に、テンプレートディレクティブのスペースを調整するよりも、テンプレートシステムにインデントを指示する方が簡単な場合があります。そのような場合は、`indent` 関数（`{{ indent 2 "mug:true" }}`）が便利です。

## `with` によるスコープの変更

次に紹介する制御構造は `with` アクションです。これは変数のスコープを制御します。`.` は _現在のスコープ_ への参照であることを思い出してください。したがって `.Values` は、現在のスコープで `Values` オブジェクトを探すようにテンプレートに指示します。

`with` の構文は単純な `if` 文に似ています:

```
{{ with PIPELINE }}
  # restricted scope
{{ end }}
```

スコープは変更できます。`with` を使うと、現在のスコープ（`.`）を特定のオブジェクトに設定できます。たとえば、これまで `.Values.favorite` を使って作業してきました。`.` スコープが `.Values.favorite` を指すように ConfigMap を書き換えてみましょう:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
```

前の演習から `if` 条件を削除しました。`PIPELINE` の値が空でない場合にのみ `with` の後のブロックが実行されるため、もう不要です。

`.drink` と `.food` を修飾なしで参照できるようになったことに注目してください。これは `with` 文が `.` を `.Values.favorite` を指すように設定したためです。`.` は `{{ end }}` の後に元のスコープにリセットされます。

ただし注意が必要です! 制限されたスコープ内では、`.` を使って親スコープの他のオブジェクトにアクセスできません。たとえば、以下のコードは失敗します:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

`Release.Name` が `.` の制限されたスコープ内にないため、エラーが発生します。しかし、最後の 2 行を入れ替えると、`{{ end }}` の後にスコープがリセットされるため、すべて期待どおりに動作します:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  release: {{ .Release.Name }}
```

または、`$` を使って親スコープから `Release.Name` オブジェクトにアクセスできます。`$` はテンプレート実行開始時にルートスコープにマップされ、テンプレート実行中に変更されません。以下のコードも動作します:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $.Release.Name }}
  {{- end }}
```

`range` を見た後、上記のスコープ問題に対する解決策の 1 つであるテンプレート変数について説明します。

## `range` アクションによるループ

多くのプログラミング言語では、`for` ループ、`foreach` ループ、または同様の仕組みを使ったループをサポートしています。Helm のテンプレート言語では、`range` 演算子を使ってコレクションを反復処理します。

まず、`values.yaml` ファイルにピザのトッピングリストを追加しましょう:

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions
  - pineapple
```

これで `pizzaToppings` のリスト（テンプレートでは `slice` と呼ばれます）ができました。このリストを ConfigMap に出力するようにテンプレートを変更しましょう:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  toppings: |-
    {{- range .Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}

```

`$` を使って親スコープから `Values.pizzaToppings` リストにアクセスすることもできます。`$` はテンプレート実行開始時にルートスコープにマップされ、テンプレート実行中に変更されません。以下のコードも動作します:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  toppings: |-
    {{- range $.Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}
  {{- end }}
```

`toppings:` リストを詳しく見てみましょう。`range` 関数は `pizzaToppings` リストを反復処理します。ここで興味深いことが起こります。`with` が `.` のスコープを変更するのと同様に、`range` 演算子もスコープを変更します。ループの各イテレーションで、`.` は現在のピザトッピングに設定されます。最初のイテレーションでは `.` は `mushrooms` になります。2 回目は `cheese`、以降同様に続きます。

`.` の値を直接パイプラインに送ることができるので、`{{ . | title | quote }}` と書くと、`.` を `title`（タイトルケース関数）に送り、次に `quote` に送ります。このテンプレートを実行すると、出力は次のようになります:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-dragonfly-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  toppings: |-
    - "Mushrooms"
    - "Cheese"
    - "Peppers"
    - "Onions"
    - "Pineapple"
```

この例では少しトリッキーなことをしています。`toppings: |-` 行は複数行の文字列を宣言しています。したがって、トッピングのリストは実際には YAML のリストではなく、大きな文字列です。なぜこうするのでしょうか? ConfigMap の `data` はキー/値のペアで構成され、キーと値はどちらも単純な文字列だからです。この詳細については [Kubernetes ConfigMap ドキュメント](https://kubernetes.io/docs/concepts/configuration/configmap/)を参照してください。ただし、ここではそれほど重要ではありません。

> YAML の `|-` マーカーは複数行の文字列を取ります。これは、この例のようにマニフェスト内に大きなデータブロックを埋め込むのに便利なテクニックです。

テンプレート内で素早くリストを作成し、そのリストを反復処理したい場合があります。Helm テンプレートにはこれを簡単にする関数 `tuple` があります。コンピュータサイエンスでは、タプルは固定サイズのリスト形式のコレクションですが、任意のデータ型を持つことができます。これは `tuple` の使い方を大まかに表しています。

```yaml
  sizes: |-
    {{- range tuple "small" "medium" "large" }}
    - {{ . }}
    {{- end }}
```

上記は次のように出力されます:

```yaml
  sizes: |-
    - small
    - medium
    - large
```

リストやタプルに加えて、`range` はキーと値を持つコレクション（`map` や `dict` など）を反復処理するためにも使用できます。次のセクションでテンプレート変数を紹介する際に、その方法を説明します。
