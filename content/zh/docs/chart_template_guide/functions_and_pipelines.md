---
title: "模板函数和流水线"
description: "使用函数和管道"
weight: 5
---

到目前为止，我们已经知道了如何将信息传到模板中。 但是传入的信息并不能被修改。
有时我们希望以一种更有用的方式来转换所提供的数据。

让我们从一个最佳实践开始：可以通过调用模板指令中的`quote`函数把`.Values`对象中的字符串属性用引号引起来，然后放到模板中。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ quote .Values.favorite.drink }}
  food: {{ quote .Values.favorite.food }}
```

模板函数的语法是 `functionName arg1 arg2...`。在上面的代码片段中，`quote .Values.favorite.drink`调用了`quote`函数并传递了一个参数(`.Values.favorite.drink`)。

Helm 有超过60个可用函数。其中有些通过[Go模板语言](https://godoc.org/text/template)本身定义。其他大部分都是[Sprig 模板库](https://masterminds.github.io/sprig/)。我们可以在示例看到其中很多函数。

> 当我们讨论"Helm模板语言"时，感觉它是Helm专属的，实际上他是Go模板语言、一些额外的函数和用于
向模板暴露某些对象的装饰器组合而成的。很多Go模板的资料也有助于你学习模板。

## 管道符

模板语言其中一个强大功能是 **管道** 概念。借鉴UNIX中的概念，管道符是将一系列的模板语言紧凑地将多个流式处理结果合并的工具。换句话说，管道符是按顺序完成一系列任务的方式。
现在用管道符重写上述示例：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | quote }}
```

在这个示例中，并不是调用`quote 参数`，而是倒置了命令。使用管道符(`|`)将参数“发送”给函数：
`.Values.favorite.drink | quote`。使用管道符可以将很多函数链接在一起：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

> 倒置命令是模板中的常见做法。可以经常看到 `.val | quote` 而不是 `quote .val`。实际上两种操作都是可以的。

模板会生成以下内容：

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: trendsetting-p-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

注意原有的`pizza`现在已经被转换成了`"PIZZA"`。当管道符参数类似这样的时候，第一个表达式的结果(`.Values.favorite.drink | upper` 的结果) 作为了`quote`的最后一个参数。也可以修改上述示例，用两个参数的函数来阐述： `repeat COUNT STRING`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | repeat 5 | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

`repeat`函数会返回给定参数特定的次数，则可以得到以下结果：

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: melting-porcup-configmap
data:
  myvalue: "Hello World"
  drink: "coffeecoffeecoffeecoffeecoffee"
  food: "PIZZA"
```

## 使用`default`函数

模板中频繁使用的一个函数是`default`： `default DEFAULT_VALUE GIVEN_VALUE`。
这个函数允许你在模板中指定一个默认值，以防这个值被忽略。现在使用它修改上述示例：

```yaml
drink: {{ .Values.favorite.drink | default "tea" | quote }}
```

如果运行，会得到 `coffee`:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: virtuous-mink-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

现在，从`values.yaml`中移除设置：

```yaml
favorite:
  #drink: coffee
  food: pizza
```

现在重新运行 `helm install --dry-run --debug fair-worm ./mychart` 会生成如下内容：

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fair-worm-configmap
data:
  myvalue: "Hello World"
  drink: "tea"
  food: "PIZZA"
```

在实际的chart中，所有的静态默认值应该设置在 `values.yaml` 文件中，且不应该重复使用 `default` 命令
(否则会出现冗余)。然而这个`default` 命令很适合计算值，其不能声明在`values.yaml`文件中，比如：

```yaml
drink: {{ .Values.favorite.drink | default (printf "%s-tea" (include "fullname" .)) }}
```

有些场景，`if`条件比`default`更加适合。在下一章节我们就会看到。

模板函数和管道符是转换信息然后将其插入到YAML中的强有力方式。但是有些时候我们需要插入一些内容之前进行一些逻辑判断，而不仅仅是插入一个字符串。
下一章节，我们会看到模板语言提供的控制结构。

## 使用`lookup`函数

`lookup` 函数可以用于在运行的集群中 _查找_ 资源。lookup函数简述为查找 `apiVersion, kind, namespace,name -> 资源或者资源列表`。

| parameter  | type   |
|------------|--------|
| apiVersion | string |
| kind       | string |
| namespace  | string |
| name       | string |

`name` 和 `namespace` 都是选填的，且可以传空字符串(`""`)作为空。

以下是可能的参数组合：

| 命令                                   | Lookup 函数                            |
|----------------------------------------|--------------------------------------------|
| `kubectl get pod mypod -n mynamespace` | `lookup "v1" "Pod" "mynamespace" "mypod"`  |
| `kubectl get pods -n mynamespace`      | `lookup "v1" "Pod" "mynamespace" ""`       |
| `kubectl get pods --all-namespaces`    | `lookup "v1" "Pod" "" ""`                  |
| `kubectl get namespace mynamespace`    | `lookup "v1" "Namespace" "" "mynamespace"` |
| `kubectl get namespaces`               | `lookup "v1" "Namespace" "" ""`            |

当`lookup`返回一个对象，它会返回一个字典。这个字典可以进一步被引导以获取特定值。

下面的例子将返回`mynamespace`对象的annotations属性：

```go
(lookup "v1" "Namespace" "" "mynamespace").metadata.annotations
```

当`lookup`返回一个对象列表时，可以通过`items`字段访问对象列表：

```go
{{ range $index, $service := (lookup "v1" "Service" "mynamespace" "").items }}
    {{/* do something with each service */}}
{{ end }}
```

当对象未找到时，会返回空值。可以用来检测对象是否存在。

`lookup`函数使用Helm已有的Kubernetes连接配置查询Kubernetes。当与调用API服务交互时返回了错误
（比如缺少资源访问的权限），helm 的模板操作会失败。

请记住，Helm在`helm template`或者`helm install|upgrade|delete|rollback --dry-run`时，
不应该请求Kubernetes API服务。由此，`lookup`函数在该案例中会返回空列表（即字典）。

## 运算符也是函数

对于模板来说，运算符(`eq`, `ne`, `lt`, `gt`, `and`, `or`等等) 都是作为函数来实现的。
在管道符中，操作可以按照圆括号分组。

现在我们可以从函数和管道符返回到条件控制流，循环和范围修饰符。
