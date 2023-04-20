---
title: "子chart和全局值"
description: "与子chart和全局值进行交互"
weight: 12
---

到目前为止，我们只使用了一个chart。但chart可以使用依赖，称为 _子chart_，且有自己的值和模板。
该章节我们会创建一个子chart并能看到访问模板中的值的不同方式。

在深入研究代码之前，需要了解一些应用的子chart的重要细节：

1. 子chart被认为是“独立的”，意味着子chart从来不会显示依赖它的父chart。
2. 因此，子chart无法访问父chart的值。
3. 父chart可以覆盖子chart的值。
4. Helm有一个 _全局值_ 的概念，所有的chart都可以访问。

> 这些限制不一定都适用于提供标准化辅助功能的 [library charts](https://helm.sh/zh/docs/topics/library_charts)。

浏览本节的示例之后，这些概念会变得更加清晰。

## 创建子chart

为了做这些练习，我们可以从本指南开始时创建的`mychart/`开始，并在其中添加一个新的chart。

```console
$ cd mychart/charts
$ helm create mysubchart
Creating mysubchart
$ rm -rf mysubchart/templates/*
```

注意，和以前一样，我们删除了所有的基本模板，然后从头开始，在这个指南中，我们聚焦于模板如何工作，而不是管理依赖。
但[Chart指南](https://helm.sh/zh/docs/topics/charts)提供了更多子chart运行的信息。

## 在子chart中添加值和模板

下一步，为`mysubchart`创建一个简单的模板和values文件。`mychart/charts/mysubchart`应该已经有一个`values.yaml`。
设置如下：

```yaml
dessert: cake
```

下一步，在`mychart/charts/mysubchart/templates/configmap.yaml`中创建一个新的配置映射模板：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
```

因为每个子chart都是 _独立的chart_，可以单独测试`mysubchart`：

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

## 用父chart的值来覆盖

原始chart，`mychart`现在是`mysubchart`的 _父_。这种关系是基于`mysubchart`在`mychart/charts`中这一事实。

因为`mychart`是父级，可以在`mychart`指定配置并将配置推送到`mysubchart`。比如可以修改`mychart/values.yaml`如下：

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

注意最后两行，在`mysubchart`中的所有指令会被发送到`mysubchart`chart中。因此如果运行`helm install --dry-run --debug
mychart`，会看到一项`mysubchart`的配置：

```yaml
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: unhinged-bee-cfgmap2
data:
  dessert: ice cream
```

现在，子chart的值已经被顶层的值覆盖了。

这里需要注意个重要细节。我们不会改变`mychart/charts/mysubchart/templates/configmap.yaml`模板到
`.Values.mysubchart.dessert`的指向。从模板的角度来看，值依然是在`.Values.dessert`。当模板引擎传递值时，会设置范围。
因此对于`mysubchart`模板，`.Values`中只提供专门用于`mysubchart`的值。

但是有时确实希望某些值对所有模板都可用。这是使用全局chart值完成的。

## 全局Chart值

全局值是使用完全一样的名字在所有的chart及子chart中都能访问的值。全局变量需要显式声明。不能将现有的非全局值作为全局值使用。

这些值数据类型有个保留部分叫`Values.global`，可以用来设置全局值。在`mychart/values.yaml`文件中设置一个值如下：

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

因为全局的工作方式，`mychart/templates/configmap.yaml`和`mysubchart/templates/configmap.yaml`
应该都能以`{{ .Values.global.salad }}`进行访问。

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

现在如果预安装，两个输出会看到相同的值：

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

全局值在类似这样传递信息时很有用，不过要确保使用全局值配置正确的模板，确实需要一些计划。

## 与子chart共享模板

父chart和子chart可以共享模板。在任意chart中定义的块在其他chart中也是可用的。

比如，我们可以这样定义一个简单的模板：

```yaml
{{- define "labels" }}from: mychart{{ end }}
```

回想一下模板标签时如何 _全局共享的_。因此，`标签`chart可以包含在任何其他chart中。

当chart开发者在`include` 和 `template` 之间选择时，使用`include`的一个优势是`include`可以动态引用模板：

```yaml
{{ include $mytemplate }}
```

上述会取消对`$mytemplate`的引用，相反，`template`函数只接受字符串字符。

## 避免使用块

Go 模板语言提供了一个 `block` 关键字允许开发者提供一个稍后会被重写的默认实现。在Helm chart中，
块并不是用于覆盖的最好工具，因为如果提供了同一个块的多个实现，无法预测哪个会被选定。

建议改为使用`include`。
