---
title: 命名模板
description: 如何定义命名模板
sidebar_position: 9
---

此时需要越过模板，开始创建其他内容了。该部分我们会看到如何在一个文件中定义
_命名模板_，并在其他地方使用。_命名模板_ (有时称作一个 _部分_ 或一个
_子模板_)仅仅是在文件内部定义的模板，并使用了一个名字。有两种创建方式和几种不同的使用方法。

在[流控制](https://helm.sh/zh/docs/chart_template_guide/control_structures)部分，
我们介绍了三种声明和管理模板的方法：`define`，`template`，和`block`。在这部分，我们将使用这三种操作并介绍一种特殊用途的
`include`方法，类似于`template`操作。

命名模板时要记住一个重要细节：**模板名称是全局的**。如果您想声明两个相同名称的模板，哪个最后加载就使用哪个。
因为在子chart中的模板和顶层模板一起编译，命名时要注意 _chart特定名称_。

一个常见的命名惯例是用chart名称作为模板前缀：`{{ define "mychart.labels" }}`。使用特定chart名称作为前缀可以避免可能因为
两个不同chart使用了相同名称的模板而引起的冲突。

这个规则同样适用于chart的不同版本。如果有 `mychart` 的 `1.0.0`版本以一种方式定义了模板， `mychart` 的 `2.0.0`
版本修改了已有的命名模板，那就会使用最后加载的版本。也可以在chart名称中添加版本来解决这个问题：
`{{ define "mychart.v1.labels" }}` 和 `{{ define "mychart.v2.labels" }}`。

## 局部的和`_`文件

目前为止，我们已经使用了单个文件，且单个文件中包含了单个模板。但Helm的模板语言允许你创建命名的嵌入式模板，
这样就可以在其他位置按名称访问。

在编写模板细节之前，文件的命名惯例需要注意：

* `templates/`中的大多数文件被视为包含Kubernetes清单
* `NOTES.txt`是个例外
* 命名以下划线(`_`)开始的文件则假定 _没有_ 包含清单内容。这些文件不会渲染为Kubernetes对象定义，但在其他chart模板中都可用。

这些文件用来存储局部和辅助对象，实际上当我们第一次创建`mychart`时，会看到一个名为`_helpers.tpl`的文件，这个文件是模板局部的默认位置。

## 用`define`和`template`声明和使用模板

`define`操作允许我们在模板文件中创建一个命名模板，语法如下：

```yaml
{{- define "MY.NAME" }}
  # body of template here
{{- end }}
```

比如我们可以定义一个模板封装Kubernetes的标签：

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

现在我们将模板嵌入到了已有的配置映射中，然后使用`template`包含进来：

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

当模板引擎读取该文件时，它会存储`mychart.labels`的引用直到`template "mychart.labels"`被调用。
然后会按行渲染模板，因此结果类似这样：

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: running-panda-configmap
  labels:
    generator: helm
    date: 2016-11-02
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

注意：`define`不会有输出，除非像本示例一样用模板调用它。

按照惯例，Helm chart将这些模板放置在局部文件中，一般是`_helpers.tpl`。把这个方法移到那里：

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

按照惯例`define`方法会有个简单的文档块(`{{/* ... */}}`)来描述要做的事。

尽管这个定义是在`_helpers.tpl`中，但它仍能访问`configmap.yaml`：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

如上所述，**模板名称是全局的**。因此，如果两个模板使用相同名字声明，会使用最后出现的那个。由于子chart中的模板和顶层模板一起编译，
最好用 _chart特定名称_ 命名你的模板。常用的命名规则是用chart的名字作为模板的前缀： `{{ define "mychart.labels" }}`。

## 设置模板范围

在上面定义的模板中，我们没有使用任何对象，仅仅使用了方法。修改定义好的模板让其包含chart名称和版本号：

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
    chart: {{ .Chart.Name }}
    version: {{ .Chart.Version }}
{{- end }}
```

如果渲染这个，会得到以下错误：

```console
$ helm install --dry-run moldy-jaguar ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [unknown object type "nil" in ConfigMap.metadata.labels.chart, unknown object type "nil" in ConfigMap.metadata.labels.version]
```

要查看渲染了什么，可以用`--disable-openapi-validation`参数重新执行：
`helm install --dry-run --disable-openapi-validation moldy-jaguar ./mychart`。
结果并不是我们想要的：

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: moldy-jaguar-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart:
    version:
```

名字和版本号怎么了？没有出现在我们定义的模板中。当一个（使用`define`创建的）命名模板被渲染时，会接收被`template`调用传入的内容。
在我们的示例中，包含模板如下：

```yaml
{{- template "mychart.labels" }}
```

没有内容传入，所以模板中无法用`.`访问任何内容。但这个很容易解决，只需要传递一个范围给模板：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" . }}
```

注意这个在`template`调用末尾传入的`.`，我们可以简单传入`.Values`或`.Values.favorite`或其他需要的范围。但一定要是顶层范围。

现在我们可以用`helm install --dry-run --debug plinking-anaco ./mychart`执行模板，然后得到：

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: plinking-anaco-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart: mychart
    version: 0.1.0
```

现在`{{ .Chart.Name }}`解析为`mychart`，`{{ .Chart.Version }}`解析为`0.1.0`。

## `include`方法

假设定义了一个简单模板如下：

```yaml
{{- define "mychart.app" -}}
app_name: {{ .Chart.Name }}
app_version: "{{ .Chart.Version }}"
{{- end -}}
```

现在假设我想把这个插入到模板的`labels:`部分和`data:`部分：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
    {{ template "mychart.app" . }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ template "mychart.app" . }}
```

如果渲染这个，会得到以下错误：

```console
$ helm install --dry-run measly-whippet ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [ValidationError(ConfigMap): unknown field "app_name" in io.k8s.api.core.v1.ConfigMap, ValidationError(ConfigMap): unknown field "app_version" in io.k8s.api.core.v1.ConfigMap]
```

要查看渲染了什么，可以用`--disable-openapi-validation`参数重新执行：
`helm install --dry-run --disable-openapi-validation measly-whippet ./mychart`。
输入不是我们想要的：

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: measly-whippet-configmap
  labels:
    app_name: mychart
app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
app_name: mychart
app_version: "0.1.0"
```

注意两处的`app_version`缩进都不对，为啥？因为被替换的模板中文本是左对齐的。由于`template`是一个行为，不是方法，无法将
`template`调用的输出传给其他方法，数据只是简单地按行插入。

为了处理这个问题，Helm提供了一个`template`的可选项，可以将模板内容导入当前管道，然后传递给管道中的其他方法。

下面这个示例，使用`indent`正确地缩进了`mychart.app`模板：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
{{ include "mychart.app" . | indent 4 }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ include "mychart.app" . | indent 2 }}
```

现在生成的YAML每一部分都可以正确缩进了：

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-mole-configmap
  labels:
    app_name: mychart
    app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
  app_name: mychart
  app_version: "0.1.0"
```

> 相较于使用`template`，在helm中使用`include`被认为是更好的方式
> 只是为了更好地处理YAML文档的输出格式

有时我们需要导入内容，但不是作为模板，也就是按字面意义导入文件内容，可以通过使用`.Files`对象访问文件来实现，
这将在下一部分展开描述。
