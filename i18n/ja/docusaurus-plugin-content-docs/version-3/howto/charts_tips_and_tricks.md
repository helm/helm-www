---
title: "チャート開発のヒントとコツ"
description: "Helm チャート開発者がプロダクション品質のチャートを構築する際に学んだヒントやコツを紹介しています。"
weight: 1
---

このガイドでは、
Helm チャート開発者がプロダクション品質のチャートを構築する際に学んだヒントやコツを紹介しています。

## テンプレートの関数を知る

Helm はリソースファイルのテンプレートに [Go テンプレート](https://godoc.org/text/template)を使用します。
Go にはいくつかの組み込み機能がありますが、
他にも多くの機能が追加されています。

まず、
[Sprig ライブラリ](https://masterminds.github.io/sprig/)の関数をすべて追加しました。

また、`include` と `required` の2つの特別なテンプレート関数を追加しました。
`include` 関数では、別のテンプレートを持ち込んで、
その結果を他のテンプレート関数に渡すことができます。

例えば、このテンプレートスニペットは `mytpl` というテンプレートを含み、
その結果を小文字にして二重引用符で囲んでいます。

```yaml
value: {{ include "mytpl" . | lower | quote }}
```

`required` 関数では、テンプレートレンダリングに必要な特定の値のエントリを宣言することができます。
値が空の場合、テンプレートのレンダリングは
ユーザーが送信したエラーメッセージで失敗します。

以下の `required` 関数の例は、.Values.who のエントリが必須であることを宣言し、
そのエントリが見つからない場合に
エラーメッセージを表示します。

```yaml
value: {{ required "A valid .Values.who entry required!" .Values.who }}
```

## 文字列を引用する、整数を引用しない

文字列データを扱う際には、文字列をそのままにしておくよりも、
引用符で囲んだ方が安全です。

```yaml
name: {{ .Values.MyName | quote }}
```

しかし、整数で作業するときは _値を引用しないでください_。
これは多くの場合、Kubernetes 内部で parse エラーを引き起こす可能性があります。

```yaml
port: {{ .Values.Port }}
```

この注意事項は、たとえそれが整数を表す場合でも、
文字列であることが予想される env 変数の値には適用されません。

```yaml
env:
  - name: HOST
    value: "http://host"
  - name: PORT
    value: "1234"
```

## 'include' 関数の使用

Go は、組み込みの `template` ディレクティブを使って、
あるテンプレートを別のテンプレートに含める方法を提供しています。
しかし、組み込み関数はGoテンプレートパイプラインでは使用できません。

テンプレートをインクルードして、そのテンプレートの出力に対して操作を行うことができるようにするために、
Helm には特別な `include` 関数があります。

```
{{ include "toYaml" $value | indent 2 }}
```

上記には `toYaml` というテンプレートが含まれており、それに `$value` を渡し、
そのテンプレートの出力を `indent` 関数に渡しています。

YAML はインデントレベルと空白に意味を与えるので、
これはコードのスニペットをインクルードし、
関連するコンテキストでインデントを処理するための素晴らしい方法です。

## 'required' 関数を使う

Go では、マップに存在しないキーでマップがインデックス付けされている場合の動作を制御するために、
テンプレートオプションを設定する方法を提供しています。
通常、これは `template.Options("missingkey=option")` で設定され、
`option` には `default`、`zero`、または `error` を指定できます。
このオプションをエラーに設定すると、エラーで実行が停止しますが、
これはマップ内に存在しないすべてのキーに適用されます。
チャート開発者が `values.yaml` ファイル内の選択値にこの動作を適用したい場合があるかもしれません。

`required` 関数は、
テンプレートのレンダリングに必要な値エントリを宣言する機能を開発者に提供します。
`values.yaml` のエントリが空の場合、
テンプレートはレンダリングされず、開発者によって提供されたエラーメッセージを返します。

例えば

```
{{ required "A valid foo is required!" .Values.foo }}
```

上記は `.Values.foo` が定義されている場合はテンプレートをレンダリングしますが、
`.Values.foo` が未定義の場合はレンダリングに失敗して終了します。

## 'tpl' 関数の使用

`tpl` 関数は、開発者がテンプレート内のテンプレートとして文字列を評価することを可能にします。
これは、テンプレートの文字列を値としてチャートに渡したり、外部の設定ファイルをレンダリングしたりするのに便利です。
構文は次の通りです: `{{ tpl TEMPLATE_STRING VALUES }}`

例:

```yaml
# values
template: "{{ .Values.name }}"
name: "Tom"

# template
{{ tpl .Values.template . }}

# output
Tom
```

外部設定ファイルをレンダリングします。

```yaml
# 外部設定ファイル conf/app.conf
firstName={{ .Values.firstName }}
lastName={{ .Values.lastName }}

# values
firstName: Peter
lastName: Parker

# template
{{ tpl (.Files.Get "conf/app.conf") . }}

# output
firstName=Peter
lastName=Parker
```

## イメージプルの Secret の作成
イメージプルの Secret は、基本的には _registry_、_username_、_password_ の組み合わせです。
デプロイするアプリケーションで必要になるかもしれませんが、
それらを作成するには `base64` を数回実行する必要があります。
シークレットのペイロードとして使用するために、Docker の設定ファイルを構成するヘルパーテンプレートを書くことができます。
以下に例を示します。

まず、`values.yaml` ファイルに
以下のようにクレデンシャルが定義されているとします。
```yaml
imageCredentials:
  registry: quay.io
  username: someone
  password: sillyness
  email: someone@host.com
```

次に、ヘルパーテンプレートを以下のように定義します。
```
{{- define "imagePullSecret" }}
{{- with .Values.imageCredentials }}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":\"%s\",\"email\":\"%s\",\"auth\":\"%s\"}}}" .registry .username .password .email (printf "%s:%s" .username .password | b64enc) | b64enc }}
{{- end }}
{{- end }}
```

最後に、より大きなテンプレートでヘルパーテンプレートを使用して、
Secret マニフェストを作成します。
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: {{ template "imagePullSecret" . }}
```

## デプロイメントの自動ロール

ConfigMaps や Secrets がコンテナ内の設定ファイルとして注入されていたり、
他の外部依存関係の変更があってローリングポッドを必要としたりすることがよくあります。
アプリケーションによっては、後続の `helm upgrade` でこれらが更新された場合、
再起動が必要になるかもしれませんが、デプロイの仕様自体が変更されていない場合、
アプリケーションは古い設定で実行され続け、
結果として一貫性のないデプロイになってしまいます。

`sha256sum` 関数を使用すると、
別のファイルが変更された場合にデプロイメントの annotations セクションを確実に更新することができます。

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
[...]
```

デプロイメントを常にロールさせたい場合は、上記と同様の annotation ステップを使用できますが、
代わりにランダムな文字列に置き換えて、
常に変化してデプロイメントがロールするようにします。

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        rollme: {{ randAlphaNum 5 | quote }}
[...]
```

これらの方法はどちらも、ダウンタイムを回避するために、
デプロイメントに組み込まれた更新戦略ロジックを活用することができます。

NOTE: 過去には別のオプションとして `--recreate-pods` フラグの使用を推奨していました。
このフラグは Helm 3 で非推奨とされ、
上記のより宣言的な方法が採用されました。

## リソースをアンインストールしないように Helm に伝える

Helm が `helm uninstall` を実行したときに、アンインストールしてはいけないリソースが存在することがあります。
チャート開発者は、リソースがアンインストールされないように、
リソースに annotation を追加することができます。


```yaml
kind: Secret
metadata:
  annotations:
    "helm.sh/resource-policy": keep
[...]
```

(引用符が必要です。)

`"helm.sh/resource-policy": keep` アノテーションは、
Helm の操作 (`helm uninstall`, `helm upgrade`, `helm rollback` など) によってこのリソースが削除されてしまう場合に、
削除をスキップするように指示します。
_しかし_、このリソースは孤立します。
Helm はもはやどのような方法でもこのリソースを管理することはできません。
これは、既にアンインストールされていてリソースを保持しているリリースで `helm install --replace` を使用した場合に問題が発生する可能性があります。

## "Partials" とテンプレートのインクルードの使用

ブロックでもテンプレートの Partials でも、
チャートの中に再利用可能なパーツを作成したいと思うことがあります。
そして、多くの場合、これらを独自のファイルに保存しておいた方がすっきりします。

`templates/` ディレクトリにおいて、アンダースコア (`_`) で始まるファイルは、
Kubernetes のマニフェストファイルを出力することは期待されていません。
そのため、慣習的にヘルパーテンプレートと Partials は `_helpers.tpl` ファイルに配置されます。

## 多くの依存関係を持つ複雑なチャート

[公式のチャートリポジトリ](https://github.com/helm/charts) にあるチャートの多くは、
より高度なアプリケーションを作成するための「ビルディングブロック」です。
しかし、チャートは大規模なアプリケーションのインスタンスを作成するために使用されることもあります。
そのような場合、1つのアンブレラチャートが複数のサブチャートを持ち、
それぞれが全体の一部として機能することがあります。

離散的なパーツから複雑なアプリケーションを構成するための現在のベストプラクティスは、
グローバルな構成を公開するトップレベルのアンブレラチャートを作成し、
`charts/` サブディレクトリを使用して
各コンポーネントを埋め込むことです。

## YAML は JSON のスーパーセット

YAML の仕様によると、YAML は JSON のスーパーセットです。
つまり、どんな有効な JSON 構造も YAML で有効でなければなりません。

これには長所があります。
時にテンプレート開発者は、YAML の空白感度に対処するよりも、
JSON ライクな構文でデータ構造を表現する方が簡単だと思うかもしれません。

ベストプラクティスとして、JSON 構文が書式問題のリスクを大幅に軽減 _しない限り_、
テンプレートは YAML ライクな構文に従うべきです。

## ランダムな値の生成には注意が必要

Helm にはランダムなデータや暗号鍵などを生成する機能があります。
これらは使っても問題ありません。
しかし、アップグレード中にテンプレートが再実行されることに注意してください。
テンプレートの実行で前回の実行とは異なるデータが生成されると、そのリソースの更新がトリガーされます。

## 1つのコマンドでリリースをインストールまたはアップグレード

Helm は、インストールやアップグレードを単一のコマンドで実行する方法を提供します。
`helm upgrade` コマンドで `--install` を付けて使ってください。
これにより、Helm はリリースが既にインストールされているかどうかを確認します。
インストールされていない場合は、インストールを実行します。されている場合は、既存のリリースがアップグレードされます。

```console
$ helm upgrade --install <release name> --values <values file> <chart directory>
```
