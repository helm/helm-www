---
title: "流控制"
description: "模板中流结构的快速概述"
weight: 7
---

控制结构(在模板语言中称为"actions")提供给你和模板作者控制模板迭代流的能力。
Helm的模板语言提供了以下控制结构：

- `if`/`else`， 用来创建条件语句
- `with`， 用来指定范围
- `range`， 提供"for each"类型的循环

除了这些之外，还提供了一些声明和使用命名模板的关键字：

- `define` 在模板中声明一个新的命名模板
- `template` 导入一个命名模板
- `block` 声明一种特殊的可填充的模板块

该部分，我们会讨论关于`if`，`with`，和 `range`。其他部分会在该指南的“命名模板”部分说明。

## If/Else

第一个控制结构是在按照条件在一个模板中包含一个块文本。即`if`/`else`块。

基本的条件结构看起来像这样：

```yaml
{{ if PIPELINE }}
  # Do something
{{ else if OTHER PIPELINE }}
  # Do something else
{{ else }}
  # Default case
{{ end }}
```

注意我们讨论的是 _管道_ 而不是值。这样做的原因是要清楚地说明控制结构可以执行整个管道，而不仅仅是计算一个值。

如果是以下值时，管道会被设置为 _false_：

- 布尔false
- 数字0
- 空字符串
- `nil` (空或null)
- 空集合(`map`, `slice`, `tuple`, `dict`, `array`)

在所有其他条件下，条件都为true。

让我们先在配置映射中添加一个简单的条件。如果饮品是coffee会添加另一个配置：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}mug: "true"{{ end }}
```

由于我们在最后一个例子中注释了`drink: coffee`，输出中就不会包含`mug: "true"`标识。但如果将这行添加到`values.yaml`
文件中，输入就会是这样：

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

## 控制空格

查看条件时，我们需要快速了解一下模板中控制空白的方式，格式化之前的例子，使其更易于阅读：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
    mug: "true"
  {{ end }}
```

初始情况下，看起来没问题。但是如果通过模板引擎运行时，我们将得到一个不幸的结果：

```console
$ helm install --dry-run --debug ./mychart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart
Error: YAML parse error on mychart/templates/configmap.yaml: error converting YAML to JSON: yaml: line 9: did not find expected key
```

发生了啥？因为空格导致生成了错误的YAML。

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
    mug: "true"
```

`mug`的缩进是不对的。取消缩进重新执行一下：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{ end }}
```

这个就得到了合法的YAML，但是看起来还是有点滑稽：

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: telling-chimp-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"

  mug: "true"

```

注意在YAML中有一个空行，为什么？当模板引擎运行时，它 _移除了_ `{{` 和 `}}` 里面的内容，但是留下的空白完全保持原样。

YAML认为空白是有意义的，因此管理空白变得很重要。幸运的是，Helm模板有些工具可以处理此类问题。

首先，模板声明的大括号语法可以通过特殊的字符修改，并通知模板引擎取消空白。`{{- `(包括添加的横杠和空格)表示向左删除空白，
而` -}}`表示右边的空格应该被去掉。 _一定注意空格就是换行_

> 要确保`-`和其他命令之间有一个空格。
> `{{- 3 }}` 表示“删除左边空格并打印3”，而`{{-3 }}`表示“打印-3”。

使用这个语法，我们就可修改我们的模板，去掉新加的空白行：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{- end }}
```

只是为了把这一点搞清楚，我们来调整上述内容，用一个`*`来代替每个遵循此规则被删除的空白，
在行尾的`*`表示删除新行的字符：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}*
**{{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"*
**{{- end }}

```

记住这一点，我们可以通过Helm运行模板并查看结果：

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: clunky-cat-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

要注意这个删除字符的更改，很容易意外地出现情况：

```yaml
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" -}}
  mug: "true"
  {{- end -}}

```

这样会变成`food: "PIZZA"mug:"true"`，因为这把两边的新行都删除了。

> 关于模板中的空白控制，请查看[官方Go模板文档](https://godoc.org/text/template)

最终，有时这更容易告诉模板系统如何缩进，而不是试图控制模板指令间的间距。因此，您有时会发现使用`indent`方法(`{{ indent 2
"mug:true" }}`)会很有用。

## 修改使用`with`的范围

下一个控制结构是`with`操作。这个用来控制变量范围。回想一下，`.`是对 _当前作用域_ 的引用。因此
`.Values`就是告诉模板在当前作用域查找`Values`对象。

`with`的语法与`if`语句类似：

```yaml
{{ with PIPELINE }}
  # restricted scope
{{ end }}
```

作用域可以被改变。`with`允许你为特定对象设定当前作用域(`.`)。比如，我们已经在使用`.Values.favorite`。
修改配置映射中的`.`的作用域指向`.Values.favorite`：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
```

注意我们从之前的练习中移除了`if`条件，因为现在不需要了——`with`后面的块只有在 `PIPELINE` 的值不为空时才会执行。

注意现在我们可以引用`.drink`和`.food`了，而不必限定他们。因为`with`语句设置了`.`指向`.Values.favorite`。
`.`被重置为`{{ end }}`之后的上一个作用域。

但是这里有个注意事项，在限定的作用域内，无法使用`.`访问父作用域的对象。错误示例如下：

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

这样会报错因为`Release.Name`不在`.`限定的作用域内。但是如果对调最后两行就是正常的，
因为在`{{ end }}`之后作用域被重置了。

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  release: {{ .Release.Name }}
```

或者，我们可以使用`$`从父作用域中访问`Release.Name`对象。当模板开始执行后`$`会被映射到根作用域，且执行过程中不会更改。
下面这种方式也可以正常工作：

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $.Release.Name }}
  {{- end }}
```

在介绍了`range`之后，我们会看看模板变量，提供了上述作用域问题的另一种解决方案。

## 使用`range`操作循环

很多编程语言支持使用`for`循环，`foreach`循环，或者类似的方法机制。
在Helm的模板语言中，在一个集合中迭代的方式是使用`range`操作符。

开始之前，我们先在`values.yaml`文件添加一个披萨的配料列表：

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions
```

现在我们有了一个`pizzaToppings`列表（模板中称为切片）。修改模板把这个列表打印到配置映射中：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  toppings: |-
    {{- range .Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}

```

我可以使用`$`从父作用域访问`Values.pizzaToppings`列表。当模板开始执行后`$`会被映射到根作用域，
且执行过程中不会更改。下面这种方式也可以正常工作：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  toppings: |-
    {{- range $.Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}
  {{- end }}
```

让我们仔细看看`toppings:`列表。`range`方法“涵盖”（迭代）`pizzaToppings`列表。但现在发生了有意思的事情。
就像`with`设置了`.`的作用域，`range`操作符也做了同样的事。每一次循环，`.`都会设置为当前的披萨配料。
也就是说，第一次`.`设置成了`mushrooms`，第二次迭代设置成了`cheese`，等等。

我们可以直接发送`.`的值给管道，因此当我们执行`{{ . | title | quote }}`时，它会发送`.`到`title`然后发送到`quote`。
如果执行这个模板，输出是这样的：

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-dragonfly-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  toppings: |-
    - "Mushrooms"
    - "Cheese"
    - "Peppers"
    - "Onions"
```

现在，我们已经处理了一些棘手的事情。`toppings: |-`行是声明的多行字符串。所以这个配料列表实际上不是YAML列表，
是个大字符串。为什么要这样做？因为在配置映射`data`中的数据是由键值对组成，key和value都是简单的字符串。
要理解这个示例，请查看[Kubernetes ConfigMap 文档](https://kubernetes.io/docs/user-guide/configmap/)。
但对于我们来说，这个细节并不重要。

> 正如例子中所示，`|-`标识在YAML中是指多行字符串。这在清单列表中嵌入大块数据是很有用的技术。

有时能在模板中快速创建列表然后迭代很有用，Helm模板的`tuple`可以很容易实现该功能。在计算机科学中，
元组表示一个有固定大小的类似列表的集合，但可以是任意数据类型。这大致表达了`tuple`的用法。

```yaml
  sizes: |-
    {{- range tuple "small" "medium" "large" }}
    - {{ . }}
    {{- end }}
```

上述模板会生成以下内容：

```yaml
  sizes: |-
    - small
    - medium
    - large
```

除了列表和元组，`range`可被用于迭代有键值对的集合（像`map`或`dict`）。我们会在下一部分介绍模板变量是看到它是如何应用的。
