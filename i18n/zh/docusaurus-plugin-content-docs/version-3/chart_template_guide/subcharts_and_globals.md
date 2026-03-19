---
title: 子 chart 和全局值
description: 与子 chart 以及全局值进行交互。
sidebar_position: 11
---

到目前为止，我们只使用了一个 chart。但 chart 可以拥有依赖项，称为 _子 chart_，它们拥有自己的值和模板。本节我们会创建一个子 chart，并了解从模板中访问值的不同方式。

在深入代码之前，需要了解一些关于子 chart 的重要细节：

1. 子 chart 被认为是"独立的"，这意味着子 chart 永远不会显式依赖其父 chart。
2. 因此，子 chart 无法访问父 chart 的值。
3. 父 chart 可以覆盖子 chart 的值。
4. Helm 有一个 _全局值_ 的概念，所有的 chart 都可以访问。

> 这些限制不一定都适用于[库类型 chart（library charts）](/topics/library_charts.md)，它们专门用于提供标准化的辅助功能。

浏览本节的示例之后，这些概念会变得更加清晰。

## 创建子 chart

在本练习中，我们从本指南开头创建的 `mychart/` 开始，在其中添加一个新 chart。

```console
$ cd mychart/charts
$ helm create mysubchart
Creating mysubchart
$ rm -rf mysubchart/templates/*
```

注意，和之前一样，我们删除了所有基础模板，从头开始。本指南专注于模板的工作原理，而不是依赖管理。[Chart 指南](/topics/charts.md)提供了更多关于子 chart 运行机制的信息。

## 在子 chart 中添加值和模板

接下来，为 `mysubchart` 创建一个简单的模板和 values 文件。`mychart/charts/mysubchart` 中应该已经有一个 `values.yaml`，将其内容设置如下：

```yaml
dessert: cake
```

然后，在 `mychart/charts/mysubchart/templates/configmap.yaml` 中创建一个新的 ConfigMap 模板：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
```

因为每个子 chart 都是 _独立的 chart_，可以单独测试 `mysubchart`：

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

## 用父 chart 的值来覆盖

原来的 chart `mychart` 现在成为了 `mysubchart` 的 _父 chart_。这种关系完全基于 `mysubchart` 位于 `mychart/charts` 目录中这一事实。

因为 `mychart` 是父 chart，我们可以在 `mychart` 中指定配置，并将其推送到 `mysubchart`。例如，可以像这样修改 `mychart/values.yaml`：

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

注意最后两行。`mysubchart` 部分内的所有指令都会发送到 `mysubchart` chart。因此，如果运行 `helm install --generate-name --dry-run --debug mychart`，会看到 `mysubchart` 的 ConfigMap：

```yaml
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: unhinged-bee-cfgmap2
data:
  dessert: ice cream
```

现在，顶层的值已经覆盖了子 chart 的值。

这里有一个重要细节需要注意：我们并没有将 `mychart/charts/mysubchart/templates/configmap.yaml` 模板改为指向 `.Values.mysubchart.dessert`。从该模板的角度来看，值仍然位于 `.Values.dessert`。模板引擎传递值时会设置作用域，因此对于 `mysubchart` 的模板，`.Values` 中只会包含专门针对 `mysubchart` 的值。

但有时你确实希望某些值能对所有模板可用。这可以通过全局 chart 值来实现。

## 全局 Chart 值

全局值是可以在任何 chart 或子 chart 中以完全相同的名字访问的值。全局值需要显式声明，不能把已有的非全局值当作全局值使用。

Values 数据类型有一个保留部分叫 `Values.global`，可用于设置全局值。我们在 `mychart/values.yaml` 文件中设置一个全局值：

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

由于全局值的工作方式，`mychart/templates/configmap.yaml` 和 `mysubchart/templates/configmap.yaml` 都可以通过 `{{ .Values.global.salad }}` 来访问该值。

`mychart/templates/configmap.yaml`：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  salad: {{ .Values.global.salad }}
```

`mysubchart/templates/configmap.yaml`：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
  salad: {{ .Values.global.salad }}
```

现在如果执行 dry run 安装，两个输出中会看到相同的值：

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

全局值在这种需要传递信息的场景下很有用，不过确实需要一些规划来确保配置了正确的模板使用全局值。

## 与子 chart 共享模板

父 chart 和子 chart 可以共享模板。在任意 chart 中定义的块在其他 chart 中也是可用的。

例如，我们可以这样定义一个简单的模板：

```yaml
{{- define "labels" }}from: mychart{{ end }}
```

回想一下，模板中的标签是 _全局共享的_。因此，`labels` 模板可以从任何其他 chart 中引入。

当 chart 开发者需要在 `include` 和 `template` 之间做选择时，使用 `include` 的一个优势是它可以动态引用模板：

```yaml
{{ include $mytemplate }}
```

上述代码会解引用 `$mytemplate`。而 `template` 函数只接受字符串字面量。

## 避免使用块

Go 模板语言提供了一个 `block` 关键字，允许开发者提供一个默认实现，之后可以被覆盖。在 Helm chart 中，块并不是最佳的覆盖工具，因为如果提供了同一个块的多个实现，无法预测哪个会被选中。

建议改为使用 `include`。
