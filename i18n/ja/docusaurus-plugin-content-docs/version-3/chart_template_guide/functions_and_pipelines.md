---
title: テンプレート関数とパイプライン
description: テンプレートでの関数の使い方を解説します。
sidebar_position: 5
---

これまでに、テンプレートに情報を配置する方法を見てきました。しかし、その情報はそのまま配置されます。時には、データをより使いやすい形に変換したい場合があります。

まずベストプラクティスから始めましょう: `.Values` オブジェクトからの文字列をテンプレートに挿入する際は、その文字列をクォートで囲むべきです。テンプレートディレクティブ内で `quote` 関数を呼び出すことで実現できます:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ quote .Values.favorite.drink }}
  food: {{ quote .Values.favorite.food }}
```

テンプレート関数は `functionName arg1 arg2...` という構文に従います。上記のスニペットでは、`quote .Values.favorite.drink` が `quote` 関数を呼び出し、1 つの引数を渡しています。

Helm には 60 以上の関数が用意されています。そのうちのいくつかは [Go テンプレート言語](https://godoc.org/text/template)自体で定義されています。その他のほとんどは [Sprig テンプレートライブラリ](https://masterminds.github.io/sprig/)の一部です。これらの関数については、以降の例を進めながら解説していきます。

> 「Helm テンプレート言語」という表現は Helm 固有のものと思われがちですが、実際には Go テンプレート言語、追加の関数、そしてテンプレートに特定のオブジェクトを公開するためのさまざまなラッパーの組み合わせです。Go テンプレートに関する多くのリソースが、テンプレートを学ぶ際に役立ちます。

## パイプライン

テンプレート言語の強力な機能の 1 つに _パイプライン_ の概念があります。UNIX のコンセプトに基づき、パイプラインは一連のテンプレートコマンドを連結して、一連の変換をコンパクトに表現するためのツールです。つまり、複数の処理を順番に効率よく実行できます。上記の例をパイプラインを使って書き直してみましょう。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | quote }}
```

この例では、`quote ARGUMENT` と呼び出す代わりに、順序を逆にしています。パイプライン（`|`）を使って引数を関数に「送って」います: `.Values.favorite.drink | quote`。パイプラインを使用すると、複数の関数を連結できます:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

> 順序を逆にする書き方はテンプレートでよく使われます。`quote .val` よりも `.val | quote` の形式をよく目にするでしょう。どちらでも構いません。

評価されると、このテンプレートは以下のような出力を生成します:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: trendsetting-p-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

元の `pizza` が `"PIZZA"` に変換されていることに注目してください。

このようにパイプラインで引数を渡す場合、最初の評価結果（`.Values.favorite.drink`）は _関数の最後の引数_ として送られます。上記の drink の例を、2 つの引数を取る関数 `repeat COUNT STRING` を使って説明してみましょう:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | repeat 5 | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

`repeat` 関数は与えられた文字列を指定された回数だけ繰り返すので、出力は以下のようになります:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: melting-porcup-configmap
data:
  myvalue: "Hello World"
  drink: "coffeecoffeecoffeecoffeecoffee"
  food: "PIZZA"
```

## `default` 関数の使用

テンプレートで頻繁に使用される関数の 1 つに `default` 関数があります: `default DEFAULT_VALUE GIVEN_VALUE`。この関数を使用すると、値が省略された場合にテンプレート内でデフォルト値を指定できます。上記の drink の例を修正してみましょう:

```yaml
drink: {{ .Values.favorite.drink | default "tea" | quote }}
```

通常どおり実行すると、`coffee` が表示されます:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: virtuous-mink-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

次に、`values.yaml` から favorite drink の設定を削除します:

```yaml
favorite:
  #drink: coffee
  food: pizza
```

`helm install --dry-run --debug fair-worm ./mychart` を再実行すると、以下の YAML が生成されます:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fair-worm-configmap
data:
  myvalue: "Hello World"
  drink: "tea"
  food: "PIZZA"
```

実際の chart では、すべての静的なデフォルト値は `values.yaml` に定義し、`default` コマンドで重複させるべきではありません（冗長になるため）。ただし、`default` コマンドは `values.yaml` 内で宣言できない計算値に最適です。例:

```yaml
drink: {{ .Values.favorite.drink | default (printf "%s-tea" (include "fullname" .)) }}
```

状況によっては、`default` よりも `if` 条件ガードを使用する方が適している場合があります。次のセクションで説明します。

テンプレート関数とパイプラインは、情報を変換して YAML に挿入する強力な方法です。しかし、単に文字列を挿入するだけでなく、より高度なテンプレートロジックが必要な場合もあります。次のセクションでは、テンプレート言語が提供する制御構造について説明します。

## `lookup` 関数の使用

`lookup` 関数を使用すると、実行中のクラスター内のリソースを _ルックアップ_ できます。lookup 関数の構文は `lookup apiVersion, kind, namespace, name -> resource or resource list` です。

| パラメータ  | 型     |
|------------|--------|
| apiVersion | string |
| kind       | string |
| namespace  | string |
| name       | string |

`name` と `namespace` はどちらもオプションで、空文字列（`""`）として渡すことができます。ただし、namespace スコープのリソースを扱う場合は、`name` と `namespace` の両方を指定する必要があります。

以下のパラメータの組み合わせが可能です:

| 動作                                   | lookup 関数                                |
|----------------------------------------|--------------------------------------------|
| `kubectl get pod mypod -n mynamespace` | `lookup "v1" "Pod" "mynamespace" "mypod"`  |
| `kubectl get pods -n mynamespace`      | `lookup "v1" "Pod" "mynamespace" ""`       |
| `kubectl get pods --all-namespaces`    | `lookup "v1" "Pod" "" ""`                  |
| `kubectl get namespace mynamespace`    | `lookup "v1" "Namespace" "" "mynamespace"` |
| `kubectl get namespaces`               | `lookup "v1" "Namespace" "" ""`            |

`lookup` がオブジェクトを返す場合、辞書が返されます。この辞書をさらにナビゲートして特定の値を抽出できます。

以下の例は `mynamespace` オブジェクトに存在するアノテーションを返します:

```go
(lookup "v1" "Namespace" "" "mynamespace").metadata.annotations
```

`lookup` がオブジェクトのリストを返す場合、`items` フィールドを通じてオブジェクトリストにアクセスできます:

```go
{{ range $index, $service := (lookup "v1" "Service" "mynamespace" "").items }}
    {{/* do something with each service */}}
{{ end }}
```

オブジェクトが見つからない場合、空の値が返されます。これを使用してオブジェクトの存在を確認できます。

`lookup` 関数は Helm の既存の Kubernetes 接続設定を使用して Kubernetes に問い合わせを行います。API サーバーとのやり取り中にエラーが返された場合（たとえば、リソースへのアクセス権限がない場合など）、Helm のテンプレート処理は失敗します。

Helm は `helm template|install|upgrade|delete|rollback --dry-run` 操作中に Kubernetes API サーバーに接続しない点に注意してください。実行中のクラスターに対して `lookup` をテストするには、`helm template|install|upgrade|delete|rollback --dry-run=server` を使用してクラスター接続を許可する必要があります。

## 演算子は関数である

テンプレートでは、演算子（`eq`、`ne`、`lt`、`gt`、`and`、`or` など）はすべて関数として実装されています。パイプラインでは、括弧（`(`、`)`）を使用して演算をグループ化できます。

次は関数とパイプラインから離れて、条件、ループ、スコープ修飾子を使用したフロー制御について説明します。
