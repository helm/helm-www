---
title: 库类型Chart
description: 阐述库类型chart及使用案例
sidebar_position: 4
---

库类型chart是一种[Helm chart](https://helm.sh/zh/docs/topics/charts)，定义了可以由其他chart中Helm
模板共享的chart原语或定义。这允许用户通过chart分享可复用得代码片段来避免重复并保持chart
[干燥](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)。

在Helm 3中引用了库chart，从形式上区别于Helm 2中chart维护的通用或辅助chart。
作为一个chart类型引入，可以提供：

- 一种明确区分通用和应用chart的方法
- 逻辑上阻止安装通用chart
- 通用chart中的未渲染模板可以包含版本组件
- 允许依赖的chart使用导入的上下文

chart维护者可以定义一个通用的chart作为库并且现在可以确信Helm将以标准一致的方式处理chart。
也意味着通过改变chart类型来分享应用chart中的定义。

## 创建一个简单的库chart

像之前提到的，库chart是一种[Helm chart](https://helm.sh/zh/docs/topics/charts)类型。意味着你可以从创建脚手架chart开始：

```console
$ helm create mylibchart
Creating mylibchart
```

本示例中创建自己的模板需要先删除`templates`目录中的所有文件。

```console
$ rm -rf mylibchart/templates/*
```

不再需要values文件。

```console
$ rm -f mylibchart/values.yaml
```

在创建通用代码之前，先快速回顾一下相关Helm概念。[已命名的模板](https://helm.sh/zh/docs/chart_template_guide/named_templates/)
(有时称为局部模板或子模板)是定义在一个文件中的简单模板，并分配了一个名称。在`templates/`目录中，
所有以下划线开始的文件(_)不会输出到Kubernetes清单文件中。因此依照惯例，辅助模板和局部模板被放置在`_*.tpl`或`_*.yaml`文件中。

这个示例中，我们要写一个通用的配置映射来创建一个空的配置映射源。在`mylibchart/templates/_configmap.yaml`文件中定义如下：

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

这个配置映射结构被定义在名为`mylibchart.configmap.tpl`的模板文件中。`data`是一个空源的配置映射，
这个文件中另一个命名的模板是`mylibchart.configmap`。这个模板包含了另一个模板`mylibchart.util.merge`，
会使用两个命名的模板作为参数，称为`mylibchart.configmap`和`mylibchart.configmap.tpl`。

复制方法`mylibchart.util.merge`是`mylibchart/templates/_util.yaml`文件中的一个命名模板。
是[通用Helm辅助Chart](#the-common-helm-helper-chart)的实用工具。因为它合并了两个模板并覆盖了两个模板的公共部分。

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

当chart希望使用通过配置自定义其通用代码时，这一点就非常重要。

最后，将chart类型修改为`library`。需要按以下方式编辑`mylibchart/Chart.yaml`：

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

这个库chart现在可以分享了，并且配置映射定义可以复用了。

此时，有必要去检测一下chart是否变成了库chart：

```console
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

## 使用简单的库chart

现在可以使用库chart了，这意味着要创建另一个脚手架chart：

```console
$ helm create mychart
Creating mychart
```

只需创建一个配置映射，需要再次清空模板文件：

```console
$ rm -rf mychart/templates/*
```

我们需要在Helm模板中创建简单的配置映射，看起来类似下面这样：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data:
  myvalue: "Hello World"
```

我们将复用已经在`mylibchart`中创建的公共代码。在`mychart/templates/configmap.yaml`文件中构建配置映射如下：

```yaml
{{- include "mylibchart.configmap" (list . "mychart.configmap") -}}
{{- define "mychart.configmap" -}}
data:
  myvalue: "Hello World"
{{- end -}}
```

可以看到这简化了我们通过继承为添加了标准属性的公共配置映射定义必须要做的事情。在模板中添加了配置，在这个示例中的数据key
`myvalue`和值。这个配置会覆盖公共配置映射中的空源。因为我们在上一节中提到的辅助方法`mylibchart.util.merge`，这是可行的。

为了能使用通用代码，我们需要添加`mylibchart`作为依赖。将以下内容添加到`mychart/Chart.yaml`文件的末尾：

```yaml
# My common code in my library chart
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

这包含了作为文件系统动态依赖的库chart，和我们的应用chart位于同一父路径下。由于将库chart作为动态依赖，
我们需要执行`helm dependency update`，它会拷贝库chart到你的`charts/`目录。

```console
$ helm dependency update mychart/
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 1 charts
Deleting outdated charts
```

现在我们准备好部署chart了。安装之前，需要先检测渲染过的模板。

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

这个看起来像是我们需要的用`myvalue: Hello World`覆盖的配置映射。现在安装：

```console
$ helm install mydemo mychart/
NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:52:40 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

我们可以检索这个版本并看到实际的版本已经加载。

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

## Library Chart Benefits

由于它们不能作为独立的chart，库chart可以利用一下功能：

- `.Files` 对象引用父chart的文件路径，而不是库chart的本地路径
- `.Values` 对象与父chart相同，但与[subcharts](https://helm.sh/zh/docs/chart_template_guide/subcharts_and_globals)（接收在父级的header中配置的值）相反。

## The Common Helm Helper Chart

```markdown
注意：GitHub上的公共Helm辅助Chart不再被积极维护了，且该仓库已弃用并归档。
```

这个[chart](https://github.com/helm/charts/tree/master/incubator/common)是公共chart的初始模式。
它提供的应用程序反映了Kubernetes chart开发的最佳实践。最棒的是你开发chart时可以立即使用易用的共享代码。

这里有一种快速使用它的方法。更多细节请查看[README](https://github.com/helm/charts/blob/master/incubator/common/README.md)。

再创建一个脚手架：

```console
$ helm create demo
Creating demo
```

使用辅助chart中的公共代码。首先编辑负载文件`demo/templates/deployment.yaml`如下：

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

现在这个service文件`demo/templates/service.yaml`变成了下面这样：

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

这些模板显示了如何从辅助模板中继承公共代码来将你的代码简化到资源的配置或自定义。

为了能使用公共代码，我们需要添加一个`common`依赖。在`demo/Chart.yaml`文件最后啊添加以下内容：

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"
```

注意：需要添加`incubator`仓库到Helm仓库列表中(`helm repo add`)。

由于我们引用了一个chart作为动态依赖，需要执行`helm dependency update`。这样会将辅助chart拷贝到你的`charts/`目录。

由于辅助chart使用了一些Helm2的结构，所以需要在`demo/values.yaml`中添加以下内容，确保在Helm
3脚手架中chart更新时可以加载`nginx`镜像：

```yaml
image:
  tag: 1.16.0
```

在部署之前可以使用 `helm lint` 和 `helm template` 命令测试chart模板是否正确。

如果可以正常运行，使用 `helm install` 部署。
