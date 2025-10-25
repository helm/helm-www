---
title: テンプレート
description: テンプレートについての一般的な慣習です。
sidebar_position: 3
---

ベストプラクティスガイドのこの部分では、テンプレートについて焦点を合わせます。

## `templates/`の構造

`templates/`ディレクトリは次のように構造化されるべきです:

- テンプレートファイルは、YAMLを出力するのであれば、`.yaml`の拡張子をつけるべきです。
  `.tpl`拡張子はフォーマットされない内容を出力するテンプレートファイルに使用することができます。
- テンプレートファイルの名前はキャメルケースではなく、ハイフン区切り（`my-example-configmap.yaml`）
  で命名すべきです。
- それぞれのリソース定義は、テンプレートファイル毎に独立したものにすべきです。
- テンプレートファイルの名前は、そのリソースの種類を名前に含めるべきです。e.g.
  `foo-pod.yaml`, `bar-svc.yaml`

## 定義されたテンプレートの名前

定義されたテンプレート（`{{ define }} `ディレクティブの中に作られたテンプレート）は
グローバルにアクセス可能です。つまり、チャートとそのサブチャート全てが、`{{ define }}`
で作成されたテンプレートにアクセスすることができます。

そのため、_定義されたテンプレート名は全て、名前空間を含んでいるべきです。_

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
新しいチャートは常に、自動的にテンプレート名をベストプラクティスに応じて定義するため、
`helm create`コマンド経由で作成することを強く推奨します。

## テンプレートのフォーマット

テンプレートは _二つのスペース_ でインデントするべきです。（タブではなく）

テンプレートディレクティブは、中括弧の開始の後と終わりの前にスペースを入れるべきです。

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

可能な場合、テンプレートはスペースを詰めるべきです:

```yaml
foo:
  {{- range .Values.items }}
  {{ . }}
  {{ end -}}
```

ブロック（制御文など）は、テンプレートコードのフローを示すために
インデントすることができます。

```
{{ if $foo -}}
  {{- with .Bar }}Hello{{ end -}}
{{- end -}}
```

しかし、YAMLはスペース指向の言語のため、時折その慣習に従うことができません。

## 生成されたテンプレートのスペース

生成されるテンプレートに含まれるスペースの量は最小限に抑えるのが望ましいです。
特に、多数の空行が互いに隣接するべきではありません。
しかし、時には（特に論理的なセクションの間の）空行は使っても良いでしょう。

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

書いても良いコード:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example

  labels:
    first: first
    second: second

```

しかし、この書き方は避けるべきです:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example





  labels:
    first: first

    second: second

```

## コメント（YAMLコメント vs. テンプレートコメント）

YAMLとHelmテンプレートにはどちらもコメントの書き方があります。

YAMLコメント:
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

テンプレートコメントは、テンプレートの機能を文書化する際に使用されるべきで、例えば、
定義されたテンプレートを説明する際に使用されます:

```yaml
{{- /*
mychart.shortname provides a 6 char truncated version of the release name.
*/}}
{{ define "mychart.shortname" -}}
{{ .Release.Name | trunc 6 }}
{{- end -}}

```

Helm使用者にとって（おそらく）デバッグ中に見るコメントとして便利な場合、テンプレートの中で、
YAMLコメントが使われることがあります。

```yaml
# This may cause problems if the value is more than 100Gi
memory: {{ .Values.maxMem | quote }}
```

上のコメントは、ユーザーが`helm install --debug`を実行した時に見ることができますが、
一方、`{{- /* */}}`の中のコメントは見ることができません。

## テンプレートとテンプレートの出力でのJSONの使用

YAMLはJSONのスーパーセットです。いくつかの場合、JSONの書き方は他のYAMLの表現よりも
読みやすい場合があります。

例えば、このYAMLは通常のYAMLのリストの表現方法に近いです:

```yaml
arguments:
  - "--dirname"
  - "/foo"
```

しかし、JSONのリスト表現に落とし込んだ方が読みやすいでしょう:

```yaml
arguments: ["--dirname", "/foo"]
```

JSONを読みやすさの向上のために使うことは良いことです。しかし、JSONの文法はより複雑な
構造を表現するために使うべきではありません。

YAMLの中に純粋なJSONを埋め込む（初期化コンテナの設定のような）必要がある場合は、
もちろんJSONのフォーマットを使うのは適切でしょう。
