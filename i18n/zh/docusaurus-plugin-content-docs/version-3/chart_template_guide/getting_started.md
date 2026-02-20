---
title: 入门
description: Chart 模板的快速指南。
sidebar_position: 2
---

本节我们会创建一个 chart 并添加第一个模板。这里创建的 chart 会在后续指南中用到。

接下来，让我们简单看一下 Helm chart。

## Charts

如 [Charts 指南](/docs/topics/charts.md)所述，Helm chart 的结构如下：

```
mychart/
  Chart.yaml
  values.yaml
  charts/
  templates/
  ...
```

`templates/` 目录用于存放模板文件。当 Helm 处理 chart 时，会将 `templates/` 目录中的所有文件传递给模板渲染引擎，然后收集渲染结果并发送到 Kubernetes。

`values.yaml` 文件对模板也很重要。这个文件包含 chart 的**默认值**。用户可以在执行 `helm install` 或 `helm upgrade` 时覆盖这些值。

`Chart.yaml` 文件包含 chart 的描述信息，可以在模板中访问它。

`charts/` 目录**可以**包含其他 chart（称为**子 chart**）。稍后我们会介绍它们在模板渲染时的工作方式。

## 入门 Chart

在本指南中我们会创建一个名为 `mychart` 的 chart，然后在其中创建一些模板。

```console
$ helm create mychart
Creating mychart
```

### 快速查看 `mychart/templates/`

查看 `mychart/templates/` 目录，你会发现一些已有的文件：

- `NOTES.txt`：chart 的"帮助文本"，用户执行 `helm install` 时会显示。
- `deployment.yaml`：创建 Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) 的基础清单
- `service.yaml`：为 Deployment 创建 [Service](https://kubernetes.io/docs/concepts/services-networking/service/) 端点的基础清单
- `_helpers.tpl`：存放可在整个 chart 中复用的模板辅助函数

接下来我们要做的是……**把它们全部删掉！** 这样我们就可以从头开始学习。我们会在后续教程中创建自己的 `NOTES.txt` 和 `_helpers.tpl`。

```console
$ rm -rf mychart/templates/*
```

编写生产级别的 chart 时，保留这些基础文件会很有用。因此在日常开发中，你可能不会删除它们。

## 第一个模板

我们要创建的第一个模板是 ConfigMap。在 Kubernetes 中，ConfigMap 是一个用于存储配置数据的对象。其他组件（如 Pod）可以访问 ConfigMap 中的数据。

因为 ConfigMap 是基础资源，很适合作为我们的起点。

首先创建文件 `mychart/templates/configmap.yaml`：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

**提示：** 模板名称没有严格的命名规范。不过建议 YAML 文件使用 `.yaml` 扩展名，辅助模板使用 `.tpl` 扩展名。

上面的 YAML 文件是一个简单的 ConfigMap，包含了最基本的必需字段。由于该文件位于 `mychart/templates/` 目录中，它会经过模板引擎处理。

将这样的普通 YAML 文件放在 `mychart/templates/` 目录中是完全可以的。当 Helm 读取这个模板时，会原样发送给 Kubernetes。

有了这个简单的模板，现在我们有了一个可安装的 chart。安装方式如下：

```console
$ helm install full-coral ./mychart
NAME: full-coral
LAST DEPLOYED: Tue Nov  1 17:36:01 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

使用 Helm，我们可以检索 release 并查看实际加载的模板。

```console
$ helm get manifest full-coral

---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

`helm get manifest` 命令接受一个 release 名称（`full-coral`），然后输出所有上传到服务器的 Kubernetes 资源。每个文件以 `---` 开头（表示 YAML 文档的开始），后面跟着自动生成的注释行，说明该 YAML 文档由哪个模板文件生成。

从输出可以看到，YAML 数据正是我们在 `configmap.yaml` 文件中定义的内容。

现在卸载 release：`helm uninstall full-coral`。

### 添加简单的模板调用

将 `name:` 硬编码到资源中不是好的做法。名称应该是唯一的，因此我们可能希望通过插入 release 名称来生成名称字段。

**提示：** 由于 DNS 系统的限制，`name:` 字段长度限制为 63 个字符。因此 release 名称限制为 53 个字符。Kubernetes 1.3 及更早版本限制为 24 个字符（即名称为 14 个字符）。

修改 `configmap.yaml`：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
```

主要变化是 `name:` 字段的值，现在是 `{{ .Release.Name }}-configmap`。

> 模板指令用 `{{` 和 `}}` 括起来。

模板指令 `{{ .Release.Name }}` 会将 release 名称注入模板。传递给模板的值可以理解为**命名空间对象**，用点（`.`）分隔各个命名空间元素。

`Release` 前面的点表示从当前作用域的顶层命名空间开始（稍后会讨论作用域）。因此 `.Release.Name` 可以理解为"从顶层命名空间开始，找到 `Release` 对象，然后在其中查找名为 `Name` 的对象"。

`Release` 是 Helm 的内置对象之一，稍后会深入讨论。现在只需要知道它可以显示分配给 release 的名称。

现在安装资源，可以立即看到模板指令的效果：

```console
$ helm install clunky-serval ./mychart
NAME: clunky-serval
LAST DEPLOYED: Tue Nov  1 17:45:37 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

可以运行 `helm get manifest clunky-serval` 查看生成的完整 YAML。

注意 Kubernetes 中的 ConfigMap 名称现在是 `clunky-serval-configmap`，而不是之前的 `mychart-configmap`。

至此我们已经了解了最基本的模板：嵌入了 `{{` 和 `}}` 模板指令的 YAML 文件。下一部分我们会深入了解模板。但在继续之前，有一个小技巧可以加快模板开发速度：如果你想测试模板渲染结果但不实际安装，可以使用 `helm install --debug --dry-run goodly-guppy ./mychart`。这会渲染模板但不安装 chart，而是将渲染后的模板输出到控制台：

```console
$ helm install --debug --dry-run goodly-guppy ./mychart
install.go:149: [debug] Original chart version: ""
install.go:166: [debug] CHART PATH: /Users/ninja/mychart

NAME: goodly-guppy
LAST DEPLOYED: Thu Dec 26 17:24:13 2019
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
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: goodly-guppy-configmap
data:
  myvalue: "Hello World"

```

使用 `--dry-run` 可以更方便地测试代码，但无法保证 Kubernetes 会接受你生成的模板。不要仅因为 `--dry-run` 正常运行就认为 chart 可以成功安装。

在 [Chart 模板指南](/docs/chart_template_guide/index.mdx)中，我们会以这里定义的基础 chart 为例，详细介绍 Helm 模板语言。接下来从内置对象开始。
