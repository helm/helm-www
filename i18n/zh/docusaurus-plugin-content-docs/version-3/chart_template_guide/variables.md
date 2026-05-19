---
title: 变量
description: 在模板中使用变量。
sidebar_position: 8
---

掌握了函数、管道符、对象和控制结构之后，我们来看看许多编程语言中更基本的概念之一：变量。在模板中，变量的使用频率较低，但我们会看到如何用它来简化代码，以及更好地配合 `with` 和 `range` 使用。

在之前的例子中，我们看到下面的代码会失败：

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

`Release.Name` 不在 `with` 块限制的作用域内。解决作用域问题的一种方法是：将对象赋值给一个变量，这样就可以在任何作用域中访问它。

在 Helm 模板中，变量是对另一个对象的命名引用，格式为 `$name`。变量使用特殊的赋值运算符 `:=` 进行赋值。我们可以用一个变量来保存 `Release.Name`，重写上面的例子：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- $relname := .Release.Name -}}
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $relname }}
  {{- end }}
```

注意，在 `with` 块开始之前，我们先赋值 `$relname := .Release.Name`。这样在 `with` 块内部，`$relname` 变量仍然指向 release 名称。

运行后会生成：

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: viable-badger-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  release: viable-badger
```

变量在 `range` 循环中特别有用。可以用于类似列表的对象，同时捕获索引和值：

```yaml
  toppings: |-
    {{- range $index, $topping := .Values.pizzaToppings }}
      {{ $index }}: {{ $topping }}
    {{- end }}

```

注意语法顺序：先是 `range`，然后是变量，然后是赋值运算符，最后是列表。这会将整数索引（从 0 开始）赋值给 `$index`，将值赋值给 `$topping`。运行后会生成：

```yaml
  toppings: |-
      0: mushrooms
      1: cheese
      2: peppers
      3: onions
```

对于同时具有键和值的数据结构，可以使用 `range` 获取两者。例如，可以这样遍历 `.Values.favorite`：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

第一次迭代时，`$key` 是 `drink`，`$val` 是 `coffee`；第二次迭代时，`$key` 是 `food`，`$val` 是 `pizza`。运行后会生成：

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eager-rabbit-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

变量通常不是"全局的"，它们的作用域限定在声明所在的块内。前面我们在模板顶层赋值了 `$relname`，因此该变量在整个模板中都有效。但在最后一个例子中，`$key` 和 `$val` 只在 `{{ range... }}{{ end }}` 块内有效。

不过，有一个变量始终指向根上下文：`$`。当你在 `range` 循环中需要获取 chart 的 release 名称时，这会非常有用。

示例如下：

```yaml
{{- range .Values.tlsSecrets }}
---
apiVersion: v1
kind: Secret
metadata:
  name: {{ .name }}
  labels:
    # Many helm templates would use `.` below, but that will not work,
    # however `$` will work here
    app.kubernetes.io/name: {{ template "fullname" $ }}
    # I cannot reference .Chart.Name, but I can do $.Chart.Name
    helm.sh/chart: "{{ $.Chart.Name }}-{{ $.Chart.Version }}"
    app.kubernetes.io/instance: "{{ $.Release.Name }}"
    # Value from appVersion in Chart.yaml
    app.kubernetes.io/version: "{{ $.Chart.AppVersion }}"
    app.kubernetes.io/managed-by: "{{ $.Release.Service }}"
type: kubernetes.io/tls
data:
  tls.crt: {{ .certificate }}
  tls.key: {{ .key }}
{{- end }}
```

到目前为止，我们只看了在单个文件中声明的单个模板。但 Helm 模板语言的一个强大特性是能够声明多个模板并组合使用。我们将在下一节讨论这个内容。
