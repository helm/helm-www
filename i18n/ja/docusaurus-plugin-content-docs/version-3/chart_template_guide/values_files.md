---
title: Values ファイル
description: --values フラグの使い方について解説します。
sidebar_position: 4
---

前のセクションで、Helm テンプレートが提供する組み込みオブジェクトについて説明しました。組み込みオブジェクトの 1 つに `Values` があります。このオブジェクトは、chart に渡された値へのアクセスを提供します。`Values` の内容は複数のソースから取得されます:

- chart 内の `values.yaml` ファイル
- サブ chart の場合は、親 chart の `values.yaml` ファイル
- `helm install` または `helm upgrade` で `-f` フラグを使用して渡された values ファイル（`helm install -f myvals.yaml ./mychart`）
- `--set` で渡された個別のパラメータ（`helm install --set foo=bar ./mychart` など）

上記のリストは具体性の高い順に並んでいます。`values.yaml` がデフォルト値となり、親 chart の `values.yaml` で上書きできます。さらにユーザー指定の values ファイルで上書きでき、最終的に `--set` パラメータで上書きできます。

values ファイルは単純な YAML ファイルです。`mychart/values.yaml` を編集し、続いて ConfigMap テンプレートを編集してみましょう。

`values.yaml` のデフォルト値を削除し、1 つのパラメータだけを設定します:

```yaml
favoriteDrink: coffee
```

これをテンプレート内で使用できます:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favoriteDrink }}
```

最後の行で `favoriteDrink` を `Values` の属性としてアクセスしていることに注目してください: `{{ .Values.favoriteDrink }}`。

レンダリング結果を確認します。

```console
$ helm install geared-marsupi ./mychart --dry-run --debug
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: geared-marsupi
LAST DEPLOYED: Wed Feb 19 23:21:13 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
favoriteDrink: coffee

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: geared-marsupi-configmap
data:
  myvalue: "Hello World"
  drink: coffee
```

デフォルトの `values.yaml` ファイルで `favoriteDrink` が `coffee` に設定されているため、テンプレートにはその値が表示されています。`helm install` の呼び出しに `--set` フラグを追加することで、簡単に上書きできます:

```console
$ helm install solid-vulture ./mychart --dry-run --debug --set favoriteDrink=slurm
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: solid-vulture
LAST DEPLOYED: Wed Feb 19 23:25:54 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
favoriteDrink: slurm

COMPUTED VALUES:
favoriteDrink: slurm

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: solid-vulture-configmap
data:
  myvalue: "Hello World"
  drink: slurm
```

`--set` はデフォルトの `values.yaml` ファイルよりも優先順位が高いため、テンプレートは `drink: slurm` を生成します。

values ファイルにはより構造化されたコンテンツを含めることもできます。たとえば、`values.yaml` ファイルに `favorite` セクションを作成し、その中に複数のキーを追加できます:

```yaml
favorite:
  drink: coffee
  food: pizza
```

テンプレートを少し修正する必要があります:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink }}
  food: {{ .Values.favorite.food }}
```

このようにデータを構造化することは可能ですが、values ツリーは浅く保ち、フラットな構造を優先することを推奨します。サブ chart への値の割り当てについて説明するときに、ツリー構造を使用した値の命名方法を確認します。

## デフォルトキーの削除

デフォルト値からキーを削除する必要がある場合は、キーの値を `null` に上書きできます。これにより、Helm はマージされた値からそのキーを削除します。

たとえば、stable Drupal chart ではカスタムイメージを使用する場合に liveness probe を設定できるようになっています。デフォルト値は以下のとおりです:
```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  initialDelaySeconds: 120
```

`--set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt]` を使用して livenessProbe ハンドラを `httpGet` から `exec` に上書きしようとすると、Helm はデフォルト値と上書き値のキーをマージし、以下の YAML が生成されます:
```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  exec:
    command:
    - cat
    - docroot/CHANGELOG.txt
  initialDelaySeconds: 120
```

しかし、Kubernetes では複数の livenessProbe ハンドラを宣言できないため、これは失敗します。この問題を解決するには、`livenessProbe.httpGet` を null に設定して Helm に削除を指示します:
```sh
helm install stable/drupal --set image=my-registry/drupal:0.1.0 --set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt] --set livenessProbe.httpGet=null
```

ここまでで、いくつかの組み込みオブジェクトを確認し、それらを使用してテンプレートに情報を注入する方法を解説しました。次は、テンプレートエンジンのもう 1 つの側面である関数とパイプラインについて説明します。
