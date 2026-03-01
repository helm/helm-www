---
title: サブ chart とグローバル値
description: サブ chart およびグローバル値との連携について解説します。
sidebar_position: 11
---

これまで 1 つの chart のみを扱ってきました。しかし chart には依存関係を持たせることができ、依存先の chart は _サブ chart_ と呼ばれます。サブ chart も独自の values とテンプレートを持ちます。このセクションでは、サブ chart を作成し、テンプレート内から values にアクセスするさまざまな方法を説明します。

実際のコードに入る前に、アプリケーションのサブ chart に関する重要な点をいくつか説明します。

1. サブ chart は「スタンドアロン」とみなされ、親 chart に明示的に依存することはできません。
2. そのため、サブ chart は親の values にアクセスできません。
3. 親 chart はサブ chart の values を上書きできます。
4. Helm には、すべての chart からアクセスできる _グローバル値_ という概念があります。

> これらの制限は、標準化されたヘルパー機能を提供するために設計された [library chart](/topics/library_charts.md) にはすべて当てはまるわけではありません。

このセクションの例を進めていくうちに、これらの概念がより明確になります。

## サブ chart の作成

この演習では、ガイドの冒頭で作成した `mychart/` chart を使用し、その中に新しい chart を追加します。

```console
$ cd mychart/charts
$ helm create mysubchart
Creating mysubchart
$ rm -rf mysubchart/templates/*
```

以前と同様に、ゼロから始めるためベーステンプレートをすべて削除しました。このガイドでは、依存関係の管理ではなく、テンプレートの仕組みに焦点を当てています。サブ chart の詳細については、[Charts ガイド](/topics/charts.md)を参照してください。

## サブ chart への Values とテンプレートの追加

次に、`mysubchart` chart 用のシンプルなテンプレートと values ファイルを作成します。`mychart/charts/mysubchart` にはすでに `values.yaml` があるはずです。以下のように設定します:

```yaml
dessert: cake
```

次に、`mychart/charts/mysubchart/templates/configmap.yaml` に新しい ConfigMap テンプレートを作成します:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
```

サブ chart は _スタンドアロン_ であるため、`mysubchart` を単独でテストできます:

```console
$ helm install --generate-name --dry-run --debug mychart/charts/mysubchart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart/charts/mysubchart
NAME:   newbie-elk
TARGET NAMESPACE:   default
CHART:  mysubchart 0.1.0
MANIFEST:
---
# Source: mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: newbie-elk-cfgmap2
data:
  dessert: cake
```

## 親 chart からの Values の上書き

元の chart である `mychart` は、`mysubchart` の _親 chart_ になりました。この関係は、`mysubchart` が `mychart/charts` 内にあるという事実のみに基づいています。

`mychart` が親であるため、`mychart` で設定を指定し、その設定を `mysubchart` にプッシュできます。たとえば、`mychart/values.yaml` を以下のように変更できます:

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream
```

最後の 2 行に注目してください。`mysubchart` セクション内のディレクティブはすべて `mysubchart` chart に送信されます。`helm install --generate-name --dry-run --debug mychart` を実行すると、`mysubchart` の ConfigMap が出力に含まれます:

```yaml
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: unhinged-bee-cfgmap2
data:
  dessert: ice cream
```

トップレベルの値がサブ chart の値を上書きしています。

ここで重要な点に注目してください。`mychart/charts/mysubchart/templates/configmap.yaml` のテンプレートを `.Values.mysubchart.dessert` を参照するように変更していません。そのテンプレートの視点からは、値は依然として `.Values.dessert` に配置されています。テンプレートエンジンが values を渡す際にスコープを設定するため、`mysubchart` テンプレートでは `mysubchart` に固有の値のみが `.Values` で利用可能になります。

しかし、特定の値をすべてのテンプレートで利用可能にしたい場合もあります。これはグローバル chart 値で実現できます。

## グローバル chart 値

グローバル値は、すべての chart またはサブ chart から同じ名前でアクセスできる値です。グローバル値は明示的な宣言が必要です。既存の非グローバル値をグローバルであるかのように使用することはできません。

Values データ型には `Values.global` という予約されたセクションがあり、ここでグローバル値を設定できます。`mychart/values.yaml` ファイルで設定してみましょう。

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream

global:
  salad: caesar
```

グローバル値の仕組みにより、`mychart/templates/configmap.yaml` と `mysubchart/templates/configmap.yaml` の両方から `{{ .Values.global.salad }}` としてこの値にアクセスできます。

`mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  salad: {{ .Values.global.salad }}
```

`mysubchart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
  salad: {{ .Values.global.salad }}
```

dry-run インストールを実行すると、両方の出力で同じ値が確認できます:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-configmap
data:
  salad: caesar

---
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-cfgmap2
data:
  dessert: ice cream
  salad: caesar
```

グローバル値はこのような情報を共有するのに便利ですが、使用するテンプレートを適切に設計する必要があります。

## サブ chart とのテンプレートの共有

親 chart とサブ chart はテンプレートを共有できます。任意の chart で定義されたブロックは、他の chart から利用可能です。

たとえば、以下のようなシンプルなテンプレートを定義できます:

```yaml
{{- define "labels" }}from: mychart{{ end }}
```

テンプレートのラベルは _グローバルに共有される_ ことを思い出してください。したがって、`labels` chart は他の任意の chart からインクルードできます。

chart 開発者は `include` と `template` のどちらかを選択できますが、`include` を使用する利点の 1 つは、テンプレートを動的に参照できることです:

```yaml
{{ include $mytemplate }}
```

上記は `$mytemplate` を参照解決します。一方、`template` 関数は文字列リテラルのみを受け付けます。

## Blocks の使用を避ける

Go テンプレート言語には、開発者がデフォルトの実装を提供し、後でオーバーライドできるようにする `block` キーワードがあります。Helm chart では、同じ block の複数の実装が提供された場合に選択されるものが予測できないため、blocks はオーバーライドに最適なツールではありません。

代わりに `include` の使用を推奨します。
