---
title: ライブラリ chart
description: ライブラリ chart の概要と使用例を説明します
sidebar_position: 4
---

ライブラリ chart は、[Helm chart](/topics/charts.md) の一種で、他の chart の Helm テンプレートで共有できる chart プリミティブや定義を提供します。これにより、chart 間で再利用可能なコードスニペットを共有でき、繰り返しを避けて chart を [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) に保つことができます。

ライブラリ chart は Helm 3 で導入され、Helm 2 時代から chart メンテナーが使用してきた共通 chart やヘルパー chart を正式に認識するためのものです。chart タイプとして含めることで、以下のことが可能になります:

- 共通 chart とアプリケーション chart を明確に区別する手段の提供
- 共通 chart のインストールを防止するロジック
- リリースアーティファクトを含む可能性のある共通 chart 内のテンプレートをレンダリングしない
- 依存 chart がインポーター側のコンテキストを使用できるようにする

chart メンテナーは、共通 chart をライブラリ chart として定義できるようになり、Helm が標準的で一貫した方法で chart を処理することを確信できます。また、chart タイプを変更するだけで、アプリケーション chart 内の定義を共有できるようになります。

## シンプルなライブラリ chart の作成

前述のとおり、ライブラリ chart は [Helm chart](/topics/charts.md) の一種です。つまり、スキャフォールド chart を作成することから始められます:

```console
$ helm create mylibchart
Creating mylibchart
```

この例では独自のテンプレート定義を作成するため、まず `templates` ディレクトリ内のすべてのファイルを削除します。

```console
$ rm -rf mylibchart/templates/*
```

values ファイルも不要です。

```console
$ rm -f mylibchart/values.yaml
```

共通コードの作成に入る前に、関連する Helm の概念を簡単に確認しておきましょう。[名前付きテンプレート](/chart_template_guide/named_templates.md)（パーシャルまたはサブテンプレートとも呼ばれます）は、ファイル内で定義され、名前が付けられたテンプレートです。`templates/` ディレクトリでは、アンダースコア（`_`）で始まるファイルは Kubernetes マニフェストファイルを出力しないことが期待されます。そのため、慣例としてヘルパーテンプレートやパーシャルは `_*.tpl` または `_*.yaml` ファイルに配置されます。

この例では、空の ConfigMap リソースを作成する共通 ConfigMap をコーディングします。共通 ConfigMap を `mylibchart/templates/_configmap.yaml` ファイルに以下のように定義します:

```yaml
{{- define "mylibchart.configmap.tpl" -}}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data: {}
{{- end -}}
{{- define "mylibchart.configmap" -}}
{{- include "mylibchart.util.merge" (append . "mylibchart.configmap.tpl") -}}
{{- end -}}
```

ConfigMap 構造体は名前付きテンプレート `mylibchart.configmap.tpl` で定義されています。これは空のリソース `data` を持つシンプルな ConfigMap です。このファイル内には `mylibchart.configmap` という別の名前付きテンプレートがあります。この名前付きテンプレートは `mylibchart.util.merge` という別の名前付きテンプレートをインクルードし、2 つの名前付きテンプレートを引数として受け取ります: `mylibchart.configmap` を呼び出すテンプレートと `mylibchart.configmap.tpl` です。

ヘルパー関数 `mylibchart.util.merge` は `mylibchart/templates/_util.yaml` にある名前付きテンプレートです。これは [The Common Helm Helper Chart](#the-common-helm-helper-chart) からの便利なユーティリティで、2 つのテンプレートをマージし、両方に共通する部分をオーバーライドします:

```yaml
{{- /*
mylibchart.util.merge will merge two YAML templates and output the result.
This takes an array of three values:
- the top context
- the template name of the overrides (destination)
- the template name of the base (source)
*/}}
{{- define "mylibchart.util.merge" -}}
{{- $top := first . -}}
{{- $overrides := fromYaml (include (index . 1) $top) | default (dict ) -}}
{{- $tpl := fromYaml (include (index . 2) $top) | default (dict ) -}}
{{- toYaml (merge $overrides $tpl) -}}
{{- end -}}
```

これは、chart が自身の設定でカスタマイズする必要のある共通コードを使用したい場合に重要です。

最後に、chart タイプを `library` に変更します。`mylibchart/Chart.yaml` を以下のように編集する必要があります:

```yaml
apiVersion: v2
name: mylibchart
description: A Helm chart for Kubernetes

# A chart can be either an 'application' or a 'library' chart.
#
# Application charts are a collection of templates that can be packaged into versioned archives
# to be deployed.
#
# Library charts provide useful utilities or functions for the chart developer. They're included as
# a dependency of application charts to inject those utilities and functions into the rendering
# pipeline. Library charts do not define any templates and therefore cannot be deployed.
# type: application
type: library

# This is the chart version. This version number should be incremented each time you make changes
# to the chart and its templates, including the app version.
version: 0.1.0

# This is the version number of the application being deployed. This version number should be
# incremented each time you make changes to the application and it is recommended to use it with quotes.
appVersion: "1.16.0"
```

ライブラリ chart は共有の準備ができ、その ConfigMap 定義を再利用できるようになりました。

先に進む前に、Helm がこの chart をライブラリ chart として認識しているかどうかを確認する価値があります:

```console
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

## シンプルなライブラリ chart の使用

ライブラリ chart を使用する番です。これは再度スキャフォールド chart を作成することを意味します:

```console
$ helm create mychart
Creating mychart
```

ConfigMap のみを作成したいので、テンプレートファイルを再度クリーンアップします:

```console
$ rm -rf mychart/templates/*
```

Helm テンプレートでシンプルな ConfigMap を作成する場合、以下のようになります:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data:
  myvalue: "Hello World"
```

しかし、ここでは `mylibchart` で作成済みの共通コードを再利用します。ConfigMap は `mychart/templates/configmap.yaml` ファイルに以下のように作成できます:

```yaml
{{- include "mylibchart.configmap" (list . "mychart.configmap") -}}
{{- define "mychart.configmap" -}}
data:
  myvalue: "Hello World"
{{- end -}}
```

ConfigMap の標準プロパティを追加する共通 ConfigMap 定義を継承することで、作業が簡略化されていることがわかります。テンプレートでは設定（この場合は data キー `myvalue` とその値）を追加しています。この設定は共通 ConfigMap の空のリソースをオーバーライドします。これは前のセクションで説明したヘルパー関数 `mylibchart.util.merge` によって実現されています。

共通コードを使用するには、`mylibchart` を依存関係として追加する必要があります。`mychart/Chart.yaml` ファイルの末尾に以下を追加します:

```yaml
# My common code in my library chart
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

これにより、アプリケーション chart と同じ親パスにあるファイルシステムから、ライブラリ chart が動的依存関係としてインクルードされます。ライブラリ chart を動的依存関係としてインクルードしているため、`helm dependency update` を実行する必要があります。これにより、ライブラリ chart が `charts/` ディレクトリにコピーされます。

```console
$ helm dependency update mychart/
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 1 charts
Deleting outdated charts
```

chart をデプロイする準備ができました。インストール前に、まずレンダリングされたテンプレートを確認する価値があります。

```console
$ helm install mydemo mychart/ --debug --dry-run
install.go:159: [debug] Original chart version: ""
install.go:176: [debug] CHART PATH: /root/test/helm-charts/mychart

NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:48:47 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: nginx
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: false
  hosts:
  - host: chart-example.local
    paths: []
  tls: []
mylibchart:
  global: {}
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 1
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  annotations: {}
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
```

これは `myvalue: Hello World` のデータオーバーライドを持つ、期待どおりの ConfigMap です。インストールしましょう:

```console
$ helm install mydemo mychart/
NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:52:40 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

release を取得して、実際のテンプレートがロードされたことを確認できます。

```console
$ helm get manifest mydemo
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
  ```

## ライブラリ chart の利点

ライブラリ chart はスタンドアロン chart として動作できないため、以下の機能を活用できます:

- `.Files` オブジェクトは、ライブラリ chart のローカルパスではなく、親 chart のファイルパスを参照します
- `.Values` オブジェクトは親 chart と同じです。これは、親の設定でヘッダー以下に設定された values セクションを受け取るアプリケーション [subchart](/chart_template_guide/subcharts_and_globals.md) とは対照的です


## The Common Helm Helper Chart

```markdown
Note: The Common Helm Helper Chart repo on Github is no longer actively maintained, and the repo has been deprecated and archived.
```

この [chart](https://github.com/helm/charts/tree/master/incubator/common) は、共通 chart の元となったパターンです。Kubernetes chart 開発のベストプラクティスを反映したユーティリティを提供します。最大の利点は、chart を開発する際にすぐに使用でき、便利な共有コードを利用できることです。

ここでは簡単な使用方法を示します。詳細については、[README](https://github.com/helm/charts/blob/master/incubator/common/README.md) を参照してください。

再度スキャフォールド chart を作成します:

```console
$ helm create demo
Creating demo
```

ヘルパー chart の共通コードを使用しましょう。まず、deployment の `demo/templates/deployment.yaml` を以下のように編集します:

```yaml
{{- template "common.deployment" (list . "demo.deployment") -}}
{{- define "demo.deployment" -}}
## Define overrides for your Deployment resource here, e.g.
apiVersion: apps/v1
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "demo.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "demo.selectorLabels" . | nindent 8 }}

{{- end -}}
```

次に、service ファイル `demo/templates/service.yaml` を以下のように編集します:

```yaml
{{- template "common.service" (list . "demo.service") -}}
{{- define "demo.service" -}}
## Define overrides for your Service resource here, e.g.
# metadata:
#   labels:
#     custom: label
# spec:
#   ports:
#   - port: 8080
{{- end -}}
```

これらのテンプレートは、ヘルパー chart から共通コードを継承することで、コーディングがリソースの設定やカスタマイズに簡略化されることを示しています。

共通コードを使用するには、`common` を依存関係として追加する必要があります。`demo/Chart.yaml` ファイルの末尾に以下を追加します:

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"
```

注意: Helm リポジトリリストに `incubator` リポジトリを追加する必要があります（`helm repo add`）。

chart を動的依存関係としてインクルードしているため、`helm dependency update` を実行する必要があります。これにより、ヘルパー chart が `charts/` ディレクトリにコピーされます。

ヘルパー chart は一部の Helm 2 構造を使用しているため、Helm 3 のスキャフォールド chart で更新された `nginx` イメージをロードできるように、`demo/values.yaml` に以下を追加する必要があります:

```yaml
image:
  tag: 1.16.0
```

デプロイ前に `helm lint` と `helm template` コマンドを使用して、chart テンプレートが正しいかテストできます。

問題なければ、`helm install` でデプロイしてください！
