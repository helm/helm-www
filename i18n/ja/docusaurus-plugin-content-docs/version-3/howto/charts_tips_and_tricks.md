---
title: Chart 開発のヒントとコツ
description: Helm chart 開発者がプロダクション品質の chart を構築する際に学んだヒントとコツを紹介します。
sidebar_position: 1
---

このガイドでは、Helm chart 開発者がプロダクション品質の chart を構築する際に学んだヒントとコツを紹介します。

## テンプレート関数を知る

Helm はリソースファイルのテンプレート化に [Go テンプレート](https://godoc.org/text/template)を使用します。Go にはいくつかの組み込み関数がありますが、Helm ではさらに多くの関数を追加しています。

まず、[Sprig ライブラリ](https://masterminds.github.io/sprig/)のすべての関数を追加しました。ただし、セキュリティ上の理由から `env` と `expandenv` は除外されています。

また、`include` と `required` という 2 つの特別なテンプレート関数も追加しました。`include` 関数を使用すると、別のテンプレートを取り込んで、その結果を他のテンプレート関数に渡すことができます。

たとえば、次のテンプレートスニペットは `mytpl` というテンプレートを取り込み、その結果を小文字に変換し、二重引用符で囲みます。

```yaml
value: {{ include "mytpl" . | lower | quote }}
```

`required` 関数を使用すると、テンプレートのレンダリングに必要な特定の values エントリを宣言できます。値が空の場合、テンプレートのレンダリングはユーザーが指定したエラーメッセージとともに失敗します。

次の `required` 関数の例では、`.Values.who` エントリが必須であることを宣言し、そのエントリがない場合にエラーメッセージを表示します。

```yaml
value: {{ required "A valid .Values.who entry required!" .Values.who }}
```

## 文字列は引用符で囲み、整数は囲まない

文字列データを扱う場合は、そのまま記述するよりも引用符で囲む方が安全です。

```yaml
name: {{ .Values.MyName | quote }}
```

ただし、整数を扱う場合は _値を引用符で囲まないでください_。多くの場合、Kubernetes 内でパースエラーを引き起こす可能性があります。

```yaml
port: {{ .Values.Port }}
```

この注意点は、整数を表す場合でも文字列として期待される環境変数の値には適用されません。

```yaml
env:
  - name: HOST
    value: "http://host"
  - name: PORT
    value: "1234"
```

## 'include' 関数の使用

Go には、組み込みの `template` ディレクティブを使用して、あるテンプレートを別のテンプレートに含める方法があります。しかし、この組み込み関数は Go テンプレートのパイプラインでは使用できません。

テンプレートを含め、その出力に対して操作を行えるようにするため、Helm には特別な `include` 関数があります。

```
{{ include "toYaml" $value | indent 2 }}
```

上記では `toYaml` というテンプレートを含め、それに `$value` を渡し、そのテンプレートの出力を `indent` 関数に渡しています。

YAML ではインデントレベルと空白が意味を持つため、これはコードスニペットを含めつつ、適切なコンテキストでインデントを処理する優れた方法です。

## 'required' 関数の使用

Go には、マップに存在しないキーでインデックス付けされた場合の動作を制御するためのテンプレートオプションを設定する方法があります。通常、これは `template.Options("missingkey=option")` で設定し、`option` には `default`、`zero`、または `error` を指定できます。このオプションを error に設定するとエラーで実行が停止しますが、これはマップ内のすべての欠落キーに適用されます。chart 開発者が `values.yaml` ファイル内の選択した値に対してのみこの動作を強制したい場合があるかもしれません。

`required` 関数は、テンプレートのレンダリングに必要な値エントリを宣言する機能を開発者に提供します。`values.yaml` でそのエントリが空の場合、テンプレートはレンダリングされず、開発者が指定したエラーメッセージを返します。

例:

```
{{ required "A valid foo is required!" .Values.foo }}
```

上記では、`.Values.foo` が定義されている場合はテンプレートをレンダリングしますが、`.Values.foo` が未定義の場合はレンダリングに失敗して終了します。

## 'tpl' 関数の使用

`tpl` 関数を使用すると、開発者はテンプレート内で文字列をテンプレートとして評価できます。これは、テンプレート文字列を値として chart に渡したり、外部設定ファイルをレンダリングしたりする場合に便利です。構文: `{{ tpl TEMPLATE_STRING VALUES }}`

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

外部設定ファイルのレンダリング:

```yaml
# external configuration file conf/app.conf
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

## イメージプル Secret の作成

イメージプル Secret は、基本的に _registry_、_username_、_password_ の組み合わせです。デプロイするアプリケーションで必要になる場合がありますが、作成するには `base64` を数回実行する必要があります。Secret のペイロードとして使用する Docker 設定ファイルを構成するヘルパーテンプレートを作成できます。以下に例を示します。

まず、`values.yaml` ファイルで認証情報が次のように定義されていると仮定します。

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
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":%s,\"email\":\"%s\",\"auth\":\"%s\"}}}" .registry .username (.password | quote) .email (printf "%s:%s" .username .password | b64enc) | b64enc }}
{{- end }}
{{- end }}
```

最後に、より大きなテンプレート内でヘルパーテンプレートを使用して Secret マニフェストを作成します。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: {{ template "imagePullSecret" . }}
```

## Deployment の自動ロール

ConfigMap や Secret がコンテナ内の設定ファイルとして注入されている場合や、その他の外部依存関係の変更により Pod のローリングが必要になる場合があります。アプリケーションによっては、後続の `helm upgrade` でこれらが更新された場合に再起動が必要になることがありますが、Deployment の spec 自体が変更されていない場合、アプリケーションは古い設定のまま実行され続け、一貫性のないデプロイメントが発生します。

`sha256sum` 関数を使用すると、別のファイルが変更された場合に Deployment の annotation セクションを確実に更新できます。

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
[...]
```

NOTE: これを library chart に追加する場合、`$.Template.BasePath` でファイルにアクセスできません。代わりに、`{{ include ("mylibchart.configmap") . | sha256sum }}` のように定義を参照してください。

常に Deployment をロールさせたい場合は、上記と同様の annotation ステップを使用しますが、代わりにランダムな文字列に置き換えて常に変化させ、Deployment がロールするようにします。

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        rollme: {{ randAlphaNum 5 | quote }}
[...]
```

テンプレート関数の呼び出しごとに一意のランダム文字列が生成されます。つまり、複数のリソースで使用するランダム文字列を同期させる必要がある場合、関連するすべてのリソースを同じテンプレートファイルに配置する必要があります。

これらの方法はどちらも、Deployment に組み込まれた更新戦略ロジックを活用し、ダウンタイムを回避できます。

NOTE: 以前は別のオプションとして `--recreate-pods` フラグの使用を推奨していました。このフラグは Helm 3 で非推奨となり、上記のより宣言的な方法が推奨されています。

## リソースをアンインストールしないように Helm に指示する

Helm が `helm uninstall` を実行する際にアンインストールすべきでないリソースが存在する場合があります。chart 開発者は、リソースに annotation を追加して、アンインストールされないようにすることができます。

```yaml
kind: Secret
metadata:
  annotations:
    helm.sh/resource-policy: keep
[...]
```

annotation `helm.sh/resource-policy: keep` は、Helm の操作（`helm uninstall`、`helm upgrade`、`helm rollback` など）によってこのリソースが削除される場合に、削除をスキップするよう Helm に指示します。_ただし_、このリソースは孤立した状態になります。Helm はこのリソースをいかなる方法でも管理しなくなります。これは、既にアンインストールされているがリソースを保持している release に対して `helm install --replace` を使用する場合に問題を引き起こす可能性があります。

## 「Partials」とテンプレートのインクルードの使用

chart 内でブロックやテンプレートの部分的なパーツなど、再利用可能なパーツを作成したい場合があります。多くの場合、これらを独自のファイルに保持する方が整理しやすくなります。

`templates/` ディレクトリでは、アンダースコア（`_`）で始まるファイルは Kubernetes マニフェストファイルを出力しないものと見なされます。そのため、慣例としてヘルパーテンプレートや Partials は `_helpers.tpl` ファイルに配置されます。

## 多くの依存関係を持つ複雑な Chart

CNCF の [Artifact Hub](https://artifacthub.io/packages/search?kind=0) にある多くの chart は、より高度なアプリケーションを作成するための「ビルディングブロック」です。ただし、chart は大規模なアプリケーションのインスタンスを作成するために使用されることもあります。そのような場合、単一のアンブレラ chart が複数のサブチャートを持ち、それぞれが全体の一部として機能することがあります。

個別のパーツから複雑なアプリケーションを構成するための現在のベストプラクティスは、グローバル設定を公開するトップレベルのアンブレラ chart を作成し、`charts/` サブディレクトリを使用して各コンポーネントを埋め込むことです。

## YAML は JSON のスーパーセット

YAML 仕様によると、YAML は JSON のスーパーセットです。つまり、有効な JSON 構造はすべて YAML でも有効です。

これには利点があります。テンプレート開発者は、YAML の空白の扱いに対処するよりも、JSON ライクな構文でデータ構造を表現する方が簡単だと感じることがあります。

ベストプラクティスとして、JSON 構文がフォーマットの問題のリスクを大幅に軽減する場合を _除き_、テンプレートは YAML ライクな構文に従うべきです。

## ランダム値の生成に注意する

Helm にはランダムデータや暗号鍵などを生成する関数があります。これらを使用することは問題ありません。ただし、アップグレード中にテンプレートが再実行されることに注意してください。テンプレートの実行で前回の実行と異なるデータが生成されると、そのリソースの更新がトリガーされます。

## 1 つのコマンドで release をインストールまたはアップグレード

Helm では、インストールまたはアップグレードを単一のコマンドで実行できます。`helm upgrade` に `--install` オプションを付けて使用してください。これにより、Helm は release が既にインストールされているかどうかを確認します。インストールされていない場合はインストールを実行し、インストールされている場合は既存の release をアップグレードします。

```console
$ helm upgrade --install <release name> --values <values file> <chart directory>
```
