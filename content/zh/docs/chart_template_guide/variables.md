---
title: "变量"
description: "在模板中使用变量。"
weight: 8
---

函数、管道符、对象和控制结构都可以控制，我们转向很多编程语言中更基本的思想之一：变量。
在模板中，很少被使用。但是我们可以使用变量简化代码，并更好地使用`with`和`range`。

在之前的例子中，我们看到下面的代码会失败：

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

`Release.Name` 不在`with`块的限制范围内。解决作用域问题的一种方法是将对象分配给可以不考虑当前作用域而访问的变量。

Helm模板中，变量是对另一个对象的命名引用。遵循`$name`变量的格式且指定了一个特殊的赋值运算符：`:=`。
我们可以使用针对`Release.Name`的变量重写上述内容。

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

注意在`with`块开始之前，赋值`$relname := .Release.Name`。
现在在`with`块中，`$relname`变量仍会执行版本名称。

运行之后会生成以下内容：

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

变量在`range`循环中特别有用。可以用于类似列表的对象，以捕获索引和值：

```yaml
  toppings: |-
    {{- range $index, $topping := .Values.pizzaToppings }}
      {{ $index }}: {{ $topping }}
    {{- end }}

```

注意先是`range`，然后是变量，然后是赋值运算符，然后是列表。会将整型索引（从0开始）赋值给`$index`并将值赋值给`$topping`。
执行会生成：

```yaml
  toppings: |-
      0: mushrooms
      1: cheese
      2: peppers
      3: onions
```

对于数据结构有key和value，可以使用`range`获取key和value。比如，可以通过`.Values.favorite`进行循环：

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

第一次迭代，`$key`会是`drink`且`$val`会是`coffee`，第二次迭代`$key`会是`food`且`$val`会是`pizza`。
运行之后会生成：

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

变量一般不是"全局的"。作用域是其声明所在的块。上面我们在模板的顶层赋值了`$relname`。变量的作用域会是整个模板。
但在最后一个例子中`$key`和`$val`作用域会在`{{ range... }}{{ end }}`块内。

但有个变量一直是全局的 - `$` - 这个变量一直是指向根的上下文。当在一个范围内循环时会很有用，同时你要知道chart的版本名称。

举例说明如下：

```yaml
{{- range .Values.tlsSecrets }}
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
---
{{- end }}
```

到目前为止，我们只看到在一个文件声明的一个模板。但是Helm模板语言一个很强大的特性是能够声明多个模板并将它们一起使用。
我们将在下一节讨论这个问题。
