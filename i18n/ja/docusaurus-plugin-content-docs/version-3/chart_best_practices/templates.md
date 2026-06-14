---
title: テンプレート
description: テンプレートに関するベストプラクティスを詳しく解説します。
sidebar_position: 3
---

ベストプラクティスガイドのこの部分では、テンプレートについて焦点を当てます。

## `templates/` の構造

`templates/` ディレクトリは次のように構造化してください:

- YAML を出力するテンプレートファイルには `.yaml` 拡張子を使用します。
  フォーマットされた内容を出力しないテンプレートファイルには `.tpl` 拡張子を使用できます。
- テンプレートファイル名はキャメルケースではなく、ダッシュ記法（`my-example-configmap.yaml`）
  を使用します。
- 各リソース定義は個別のテンプレートファイルに配置します。
- テンプレートファイル名にはリソースの種類を含めます。
  例: `foo-pod.yaml`、`bar-svc.yaml`

## 定義済みテンプレートの名前

定義済みテンプレート（`{{ define }}` ディレクティブ内で作成されたテンプレート）は
グローバルにアクセス可能です。つまり、chart とそのすべてのサブチャートから、
`{{ define }}` で作成されたすべてのテンプレートにアクセスできます。

そのため、_すべての定義済みテンプレート名には namespace を含めてください。_

正しい書き方:

```yaml
{{- define "nginx.fullname" }}
{{/* ... */}}
{{ end -}}
```

正しくない書き方:

```yaml
{{- define "fullname" -}}
{{/* ... */}}
{{ end -}}
```

新しい chart は `helm create` コマンドで作成することを強く推奨します。
このコマンドを使用すると、テンプレート名がこのベストプラクティスに従って自動的に定義されます。

## テンプレートのフォーマット

テンプレートは _2 つのスペース_ でインデントします（タブは使用しません）。

テンプレートディレクティブでは、開き中括弧の後と閉じ中括弧の前にスペースを入れます:

正しい書き方:
```
{{ .foo }}
{{ print "foo" }}
{{- print "bar" -}}
```

正しくない書き方:
```
{{.foo}}
{{print "foo"}}
{{-print "bar"-}}
```

可能な場合、テンプレートでは空白を削除します:

```yaml
foo:
  {{- range .Values.items }}
  {{ . }}
  {{ end -}}
```

ブロック（制御構造など）は、テンプレートコードのフローを示すために
インデントできます。

```
{{ if $foo -}}
  {{- with .Bar }}Hello{{ end -}}
{{- end -}}
```

ただし、YAML は空白に依存する言語であるため、コードのインデントが
この規則に従えない場合もあります。

## 生成されるテンプレートの空白

生成されるテンプレートに含まれる空白の量は最小限に抑えるのが望ましいです。
特に、複数の空行が連続して並ぶべきではありません。
ただし、論理的なセクション間などで時折空行を入れることは問題ありません。

ベストな書き方:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example
  labels:
    first: first
    second: second
```

問題のない書き方:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example

  labels:
    first: first
    second: second

```

避けるべき書き方:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example





  labels:
    first: first

    second: second

```

## コメント（YAML コメント vs. テンプレートコメント）

YAML と Helm テンプレートの両方にコメント記法があります。

YAML コメント:
```yaml
# This is a comment
type: sprocket
```

テンプレートコメント:
```yaml
{{- /*
This is a comment.
*/}}
type: frobnitz
```

テンプレートコメントは、テンプレートの機能を文書化する際に使用します。
たとえば、定義済みテンプレートを説明する場合:

```yaml
{{- /*
mychart.shortname provides a 6 char truncated version of the release name.
*/}}
{{ define "mychart.shortname" -}}
{{ .Release.Name | trunc 6 }}
{{- end -}}

```

テンプレート内で YAML コメントを使用するのは、Helm ユーザーがデバッグ中に
そのコメントを見ると便利な場合です。

```yaml
# This may cause problems if the value is more than 100Gi
memory: {{ .Values.maxMem | quote }}
```

上記のコメントは、ユーザーが `helm install --debug` を実行したときに表示されます。
一方、`{{- /* */}}` セクションで指定されたコメントは表示されません。

特定のテンプレート関数で必要になる可能性のある Helm 値を含むテンプレートセクションに
`#` YAML コメントを追加する際は注意してください。

たとえば、上記の例に `required` 関数を導入し、`maxMem` が設定されていない場合、
`#` YAML コメントはレンダリングエラーを引き起こします。

正しい書き方: `helm template` はこのブロックをレンダリングしません
```yaml
{{- /*
# This may cause problems if the value is more than 100Gi
memory: {{ required "maxMem must be set" .Values.maxMem | quote }}
*/ -}}
```

正しくない書き方: `helm template` は `Error: execution error at (templates/test.yaml:2:13): maxMem must be set` を返します
```yaml
# This may cause problems if the value is more than 100Gi
# memory: {{ required .Values.maxMem "maxMem must be set" | quote }}
```

YAML コメントがそのまま残される動作の別の例については、
[テンプレートのデバッグ](/chart_template_guide/debugging.md)を参照してください。

## テンプレートとテンプレート出力での JSON の使用

YAML は JSON のスーパーセットです。場合によっては、JSON 構文の方が
他の YAML 表現よりも読みやすいことがあります。

たとえば、この YAML は通常の YAML のリスト表現方法に近いです:

```yaml
arguments:
  - "--dirname"
  - "/foo"
```

しかし、JSON リストスタイルに折りたたむと読みやすくなります:

```yaml
arguments: ["--dirname", "/foo"]
```

可読性を高めるために JSON を使用することは良い方法です。ただし、JSON 構文は
より複雑な構造を表現するために使用すべきではありません。

YAML 内に純粋な JSON を埋め込む場合（init コンテナの設定など）は、
もちろん JSON フォーマットを使用するのが適切です。
