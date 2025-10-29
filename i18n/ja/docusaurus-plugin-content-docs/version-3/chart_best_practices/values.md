---
title: 値
description: どのように値を設定するかを解説します。
sidebar_position: 2
---

ベストプラクティスガイドのこの部分では、値の設定方法を解説します。
チャートの`values.yaml`の書き方に重点を置いて、値を構造化して利用するおすすめの方法を解説します。

## 命名規則

変数名は小文字で始める必要があります。また、単語はキャメルケースで区切ってください。

正しい書き方:

```yaml
chicken: true
chickenNoodleSoup: true
```

正しくない書き方:

```yaml
Chicken: true  # 最初を大文字にすると予約語と衝突することがあります
chicken-noodle-soup: true # ハイフンは使わないでください
```

ユーザー定義のパラメータと区別しやすくするため、Helmの全ての予約語は大文字で始まります。
例) `.Release.Name`, `.Capabilities.KubeVersion`

## フラット・ネスト構造の値

YAMLは柔軟な形式なので、値を深くネストすることも、フラットにすることもできます。

ネスト:

```yaml
server:
  name: nginx
  port: 80
```

フラット:

```yaml
serverName: nginx
serverPort: 80
```

ほとんどの場合、ネストよりフラットな方が好まれます。フラットな方がテンプレートの開発者・ユーザーがよりシンプルに理解できるからです。

ネストされた値を安全に扱うためには、全ての階層で値をチェックする必要があります。

```
{{ if .Values.server }}
  {{ default "none" .Values.server.name }}
{{ end }}
```

ネストされた全ての階層では値が存在するかをチェックする必要があります。
その一方でフラット構成の場合、このようなチェックをせずにテンプレートを読みやすく、使いやすくすることができます。

```
{{ default "none" .Values.serverName }}
```

関連する変数が多数あり、そのうちの少なくとも1つが必須の変数である場合は、
読みやすさを向上させるためにネストされた値を使うことがあります。

## 型の明確化

YAMLの型強制ルールは直感に反することがあります。例えば `foo: false`と 
`foo: "false"`は同じではありません。`foo: 12345678` のように大きな整数は、
科学的表記に変換される場合があります。

型変換エラーを回避する最も簡単な方法は、文字列は明示的に扱い、その他全ては暗黙的に扱うことです。
簡潔に言えば、_すべての文字列を引用する_ ということです。

多くの場合、整数キャストの問題を回避するには整数を文字列として格納し、
テンプレートで`{{ int $value }}`のように使用して文字列から整数に戻すと便利です。

ほとんどの場合、明示的な型のタグが優先されるため、`foo: !!string 1234`は文字列の`1234`として扱われます。
_ただし_、YAMLパーサーはタグを消費してしまうので、パースされた後は型情報が失われます。

## ユーザーがどのように値を扱うかについて考える

値は3つの方法で設定することができます。

- チャートの`values.yaml`ファイル
- `helm install -f`、`helm upgrade -f`で渡されるファイル
- `helm install`、`helm upgrade`の`--set`、`--set-string` フラグで渡される値

値の構造を設計するときは、ユーザーが`-f`フラグや`--set`オプションで
値を上書きしたい場合があることに注意してください。

`--set`が一番表現力が制限されているので、`values.yaml`を書くにあたって最初に考えるべきことは、
`--set`で簡単に上書きできるようにすることです。

そのような理由から、大抵の場合はマップを使用して値を構造化するほうがよいです。

`--set`の利用が難しい例:

```yaml
servers:
  - name: foo
    port: 80
  - name: bar
    port: 81
```

上の例は、Helm `<=2.4` では `--set` で表現できません。Helm 2.5では fooのportを
`--set servers[0].port=80`と書くことができます。ユーザーが理解しにくいだけでなく、
後に`servers`の順番が変更されたときにエラーが発生しやすくなります。

使いやすい例:

```yaml
servers:
  foo:
    port: 80
  bar:
    port: 81
```

`--set servers.foo.port=80`
このように、fooのportをより明確に扱うことができます。

## `values.yaml`のドキュメント

`values.yaml`で定義された全てのプロパティは文書化されているべきです。
説明文は説明するプロパティ名で始めて、少なくとも1文以上書いてください。

正しくない例:

```yaml
# the host name for the webserver
serverHost: example
serverPort: 9191
```

正しい例:

```yaml
# serverHost is the host name for the webserver
serverHost: example
# serverPort is the HTTP listener port for the webserver
serverPort: 9191
```

各コメントをパラメータ名で始めるとドキュメントをgrepするのが簡単になるのに加え、
文書化ツールが説明文をパラメータと確実に紐付けることができるようになります。
