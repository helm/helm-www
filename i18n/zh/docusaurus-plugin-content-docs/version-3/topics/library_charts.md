---
title: 库 chart
description: 介绍库 chart 及其使用示例
sidebar_position: 4
---

库 chart 是一种 [Helm chart](./charts.md)，用于定义可供其他 chart 中的 Helm 模板共享的 chart 原语或定义。这使用户可以共享可复用的代码片段，避免重复，保持 chart [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)。

库 chart 在 Helm 3 中引入，正式承认了自 Helm 2 以来 chart 维护者一直使用的通用或辅助 chart。将其作为一种 chart 类型引入，可以提供：

- 明确区分通用 chart 和应用 chart 的方法
- 阻止安装通用 chart 的逻辑
- 通用 chart 中的模板不会被渲染，这些模板可能包含 release 相关的内容
- 允许依赖的 chart 使用导入者的上下文

chart 维护者可以将通用 chart 定义为库，Helm 会以标准、一致的方式处理该 chart。这也意味着可以通过更改 chart 类型来共享应用 chart 中的定义。

## 创建简单的库 chart

如前所述，库 chart 是一种 [Helm chart](./charts.md) 类型。这意味着你可以从创建脚手架 chart 开始：

```console
$ helm create mylibchart
Creating mylibchart
```

首先删除 `templates` 目录中的所有文件，因为我们将在本示例中创建自己的模板定义。

```console
$ rm -rf mylibchart/templates/*
```

values 文件也不需要。

```console
$ rm -f mylibchart/values.yaml
```

在创建通用代码之前，先快速回顾一些相关的 Helm 概念。[命名模板](../chart_template_guide/named_templates.md)（有时称为局部模板或子模板）是定义在文件中并赋予名称的简单模板。在 `templates/` 目录中，任何以下划线（_）开头的文件都不会输出 Kubernetes 清单文件。因此按照惯例，辅助模板和局部模板放在 `_*.tpl` 或 `_*.yaml` 文件中。

在本示例中，我们将编写一个通用的 ConfigMap，用于创建空的 ConfigMap 资源。在 `mylibchart/templates/_configmap.yaml` 文件中定义如下：

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

ConfigMap 结构定义在名为 `mylibchart.configmap.tpl` 的命名模板中。这是一个简单的 ConfigMap，`data` 为空资源。该文件中还有另一个命名模板 `mylibchart.configmap`，它包含另一个命名模板 `mylibchart.util.merge`，该模板接受 2 个命名模板作为参数：调用 `mylibchart.configmap` 的模板和 `mylibchart.configmap.tpl`。

辅助函数 `mylibchart.util.merge` 是 `mylibchart/templates/_util.yaml` 文件中的一个命名模板。这是来自[通用 Helm 辅助 chart](#通用-helm-辅助-chart) 的实用工具，因为它可以合并两个模板并覆盖两者的公共部分：

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

当 chart 需要使用通用代码并通过配置进行自定义时，这一点非常重要。

最后，将 chart 类型更改为 `library`。需要按如下方式编辑 `mylibchart/Chart.yaml`：

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

库 chart 现在可以共享了，其 ConfigMap 定义可以被复用。

在继续之前，值得检查一下 Helm 是否将该 chart 识别为库 chart：

```console
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

## 使用简单的库 chart

现在可以使用库 chart 了。这意味着需要再次创建一个脚手架 chart：

```console
$ helm create mychart
Creating mychart
```

因为我们只想创建一个 ConfigMap，所以再次清空模板文件：

```console
$ rm -rf mychart/templates/*
```

在 Helm 模板中创建简单的 ConfigMap 时，看起来类似这样：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data:
  myvalue: "Hello World"
```

然而，我们将复用已在 `mylibchart` 中创建的通用代码。可以在 `mychart/templates/configmap.yaml` 文件中创建 ConfigMap，如下所示：

```yaml
{{- include "mylibchart.configmap" (list . "mychart.configmap") -}}
{{- define "mychart.configmap" -}}
data:
  myvalue: "Hello World"
{{- end -}}
```

可以看到，通过继承为 ConfigMap 添加标准属性的通用定义，简化了我们的工作。在模板中添加了配置，本例中是数据键 `myvalue` 及其值。该配置会覆盖通用 ConfigMap 的空资源。这得益于我们在上一节中提到的辅助函数 `mylibchart.util.merge`。

为了能使用通用代码，需要添加 `mylibchart` 作为依赖。在 `mychart/Chart.yaml` 文件末尾添加以下内容：

```yaml
# My common code in my library chart
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

这将库 chart 作为动态依赖包含进来，它位于文件系统中与应用 chart 相同的父路径下。由于将库 chart 作为动态依赖包含，需要运行 `helm dependency update`。它会将库 chart 复制到你的 `charts/` 目录。

```console
$ helm dependency update mychart/
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 1 charts
Deleting outdated charts
```

现在可以部署 chart 了。安装之前，值得先检查渲染后的模板。

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

这看起来正是我们需要的 ConfigMap，数据已被覆盖为 `myvalue: Hello World`。现在安装它：

```console
$ helm install mydemo mychart/
NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:52:40 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

我们可以检索该 release 并查看实际加载的模板。

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

## 库 chart 的优势

由于库 chart 无法作为独立 chart 使用，它们可以利用以下功能：

- `.Files` 对象引用父 chart 的文件路径，而不是库 chart 的本地路径
- `.Values` 对象与父 chart 相同，与应用[子 chart](../chart_template_guide/subcharts_and_globals.md) 不同（子 chart 接收在父 chart 中其标题下配置的值部分）

## 通用 Helm 辅助 chart

```markdown
注意：GitHub 上的通用 Helm 辅助 chart 仓库已不再积极维护，该仓库已被弃用并归档。
```

这个 [chart](https://github.com/helm/charts/tree/master/incubator/common) 是通用 chart 的原始模式。它提供了反映 Kubernetes chart 开发最佳实践的实用工具。最棒的是，在开发 chart 时可以直接使用这些便捷的共享代码。

以下是快速使用它的方法。更多详细信息，请查看 [README](https://github.com/helm/charts/blob/master/incubator/common/README.md)。

再次创建一个脚手架 chart：

```console
$ helm create demo
Creating demo
```

使用辅助 chart 中的通用代码。首先，按如下方式编辑 Deployment 文件 `demo/templates/deployment.yaml`：

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

然后是 Service 文件 `demo/templates/service.yaml`，如下所示：

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

这些模板展示了如何通过从辅助 chart 继承通用代码，将你的代码简化为仅包含资源的配置或自定义部分。

为了能使用通用代码，需要添加 `common` 作为依赖。在 `demo/Chart.yaml` 文件末尾添加以下内容：

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"
```

注意：需要将 `incubator` 仓库添加到 Helm 仓库列表中（`helm repo add`）。

由于将该 chart 作为动态依赖包含，需要运行 `helm dependency update`。这会将辅助 chart 复制到你的 `charts/` 目录。

由于辅助 chart 使用了一些 Helm 2 的结构，需要在 `demo/values.yaml` 中添加以下内容，以便在 Helm 3 脚手架 chart 更新后能够加载 `nginx` 镜像：

```yaml
image:
  tag: 1.16.0
```

在部署之前，可以使用 `helm lint` 和 `helm template` 命令测试 chart 模板是否正确。

如果一切正常，使用 `helm install` 进行部署！
