---
title: テンプレート内からファイルにアクセスする
description: テンプレート内からファイルにアクセスする方法について説明します。
sidebar_position: 10
---

前のセクションでは、名前付きテンプレートを作成してアクセスするいくつかの方法を説明しました。これにより、あるテンプレートから別のテンプレートを簡単にインポートできます。しかし、_テンプレートではないファイル_ をインポートして、テンプレートレンダリングエンジンを通さずにその内容を挿入したい場合もあります。

Helm では、`.Files` オブジェクトを通じてファイルにアクセスできます。テンプレートの例に入る前に、この機能の仕組みについていくつか注意事項があります:

- Helm chart に追加のファイルを含めることができます。これらのファイルは chart にバンドルされます。ただし、Kubernetes オブジェクトのストレージ制限があるため、chart は 1M 未満でなければなりません。
- セキュリティ上の理由から、一部のファイルは `.Files` オブジェクトからアクセスできません。
  - `templates/` ディレクトリ内のファイルにはアクセスできません。
  - `.helmignore` で除外されたファイルにはアクセスできません。
  - Helm アプリケーションの[サブチャート](/chart_template_guide/subcharts_and_globals.md)外のファイル（親 chart のファイルを含む）にはアクセスできません。
- chart は UNIX モード情報を保持しません。そのため、ファイルレベルのパーミッションは `.Files` オブジェクトを通じたファイルの利用可否に影響しません。

<!-- (see https://github.com/jonschlinkert/markdown-toc) -->

<!-- toc -->

- [基本的な例](#basic-example)
- [パスヘルパー](#path-helpers)
- [Glob パターン](#glob-patterns)
- [ConfigMap と Secret のユーティリティ関数](#configmap-and-secrets-utility-functions)
- [エンコーディング](#encoding)
- [行ごとの処理](#lines)

<!-- tocstop -->

## 基本的な例 {#basic-example}

以上の注意事項を踏まえ、3 つのファイルを読み込んで ConfigMap に格納するテンプレートを作成します。まず、chart に 3 つのファイルを追加し、すべて `mychart/` ディレクトリ直下に配置します。

`config1.toml`:

```toml
message = "Hello from config 1"
```

`config2.toml`:

```toml
message = "This is config 2"
```

`config3.toml`:

```toml
message = "Goodbye from config 3"
```

これらは簡単な TOML ファイルです（昔の Windows INI ファイルのようなものです）。ファイル名がわかっているので、`range` 関数を使ってループし、内容を ConfigMap に挿入できます。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  {{- $files := .Files }}
  {{- range tuple "config1.toml" "config2.toml" "config3.toml" }}
  {{ . }}: |-
    {{ $files.Get . }}
  {{- end }}
```

この ConfigMap は、前のセクションで説明したいくつかのテクニックを使用しています。たとえば、`.Files` オブジェクトへの参照を保持する `$files` 変数を作成しています。また、`tuple` 関数を使用してループ対象のファイルリストを作成しています。そして、各ファイル名（`{{ . }}: |-`）とその内容（`{{ $files.Get . }}`）を出力しています。

このテンプレートを実行すると、3 つすべてのファイル内容を含む単一の ConfigMap が生成されます:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: quieting-giraf-configmap
data:
  config1.toml: |-
    message = "Hello from config 1"

  config2.toml: |-
    message = "This is config 2"

  config3.toml: |-
    message = "Goodbye from config 3"
```

## パスヘルパー {#path-helpers}

ファイルを扱う際、ファイルパス自体に対して標準的な操作を行うと便利なことがあります。Helm は Go の [path](https://golang.org/pkg/path/) パッケージの関数を多数インポートしており、これらを利用できます。Go パッケージと同じ名前で、先頭の文字が小文字になっています。たとえば、`Base` は `base` になります。

インポートされている関数は以下の通りです:
- Base
- Dir
- Ext
- IsAbs
- Clean

## Glob パターン {#glob-patterns}

chart が大きくなるにつれて、ファイルをより整理する必要が出てくることがあります。そのため、[glob パターン](https://godoc.org/github.com/gobwas/glob)の柔軟性を活かして特定のファイルを抽出できる `Files.Glob(pattern string)` メソッドを提供しています。

`.Glob` は `Files` 型を返すため、返されたオブジェクトに対して `Files` のメソッドを呼び出せます。

たとえば、次のようなディレクトリ構造があるとします:

```
foo/:
  foo.txt foo.yaml

bar/:
  bar.go bar.conf baz.yaml
```

Glob ではいくつかのオプションがあります:

```yaml
{{ $currentScope := .}}
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
    {{- with $currentScope}}
        {{ .Files.Get $path }}
    {{- end }}
{{ end }}
```

または

```yaml
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
      {{ $.Files.Get $path }}
{{ end }}
```

## ConfigMap と Secret のユーティリティ関数 {#configmap-and-secrets-utility-functions}

（Helm 2.0.2 以降で利用可能）

ファイルの内容を ConfigMap と Secret の両方に配置し、実行時に Pod にマウントしたいことがよくあります。これを支援するため、`Files` 型にいくつかのユーティリティメソッドを提供しています。

さらに整理するために、これらのメソッドを `Glob` メソッドと組み合わせて使用すると特に便利です。

[Glob パターン](#glob-patterns)の例で示したディレクトリ構造を使用すると:

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: conf
data:
{{ (.Files.Glob "foo/*").AsConfig | indent 2 }}
---
apiVersion: v1
kind: Secret
metadata:
  name: very-secret
type: Opaque
data:
{{ (.Files.Glob "bar/*").AsSecrets | indent 2 }}
```

## エンコーディング {#encoding}

ファイルをインポートして、転送の成功を確実にするために Base64 エンコードすることができます:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ .Release.Name }}-secret
type: Opaque
data:
  token: |-
    {{ .Files.Get "config1.toml" | b64enc }}
```

上記は、前に使用した同じ `config1.toml` ファイルをエンコードします:

```yaml
# Source: mychart/templates/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: lucky-turkey-secret
type: Opaque
data:
  token: |-
    bWVzc2FnZSA9ICJIZWxsbyBmcm9tIGNvbmZpZyAxIgo=
```

## 行ごとの処理 {#lines}

テンプレート内でファイルの各行にアクセスしたい場合があります。このために便利な `Lines` メソッドを提供しています。

`range` 関数を使用して `Lines` をループ処理できます:

```yaml
data:
  some-file.txt: {{ range .Files.Lines "foo/bar.txt" }}
    {{ . }}{{ end }}
```

`helm install` 時に chart 外部からファイルを渡す方法はありません。そのため、ユーザーにデータを提供してもらう場合は、`helm install -f` または `helm install --set` を使用して読み込む必要があります。

この説明で、Helm テンプレートを作成するためのツールとテクニックの解説は終わりです。次のセクションでは、特別なファイル `templates/NOTES.txt` を使用して、chart のユーザーにインストール後の手順を送信する方法を説明します。
