---
title: "附录：YAML 技术"
description: 深入了解 YAML 规范及其在 Helm 中的应用。
sidebar_position: 15
---

本指南大部分内容聚焦于模板语言的编写。这里我们来看看 YAML 格式。YAML 有一些实用的特性，作为模板作者，可以利用这些特性让模板更不易出错、更易阅读。

## 标量和集合

根据 [YAML 规范](https://yaml.org/spec/1.2/spec.html)，有两种集合类型和多种标量类型。

两种集合类型分别是映射（map）和序列（sequence）：

```yaml
map:
  one: 1
  two: 2
  three: 3

sequence:
  - one
  - two
  - three
```

标量值是单个值（与集合相对）。

### YAML 中的标量类型

在 Helm 使用的 YAML 方言中，值的标量数据类型由一组复杂规则决定，包括 Kubernetes 资源定义的 schema。但在类型推断时，以下规则通常成立。

如果整数或浮点数是不带引号的裸字，通常会被视为数字类型：

```yaml
count: 1
size: 2.34
```

但如果用引号括起来，则会被视为字符串：

```yaml
count: "1" # <-- string, not int
size: '2.34' # <-- string, not float
```

布尔值也是如此：

```yaml
isGood: true   # bool
answer: "true" # string
```

空值的关键字是 `null`（不是 `nil`）。

注意 `port: "80"` 是合法的 YAML，可以通过模板引擎和 YAML 解析器，但如果 Kubernetes 期望 `port` 是整数，则会失败。

在某些场景中，可以使用 YAML 节点标签强制指定类型：

```yaml
coffee: "yes, please"
age: !!str 21
port: !!int "80"
```

上例中，`!!str` 告诉解析器 `age` 是字符串，即使它看起来像整数。而 `port` 虽然用引号括起来，也会被视为整数。

## YAML 中的字符串

YAML 文档中的大部分数据都是字符串。YAML 有多种表示字符串的方式。本节介绍这些方式并演示其中一些的用法。

有三种"内联"方式声明字符串：

```yaml
way1: bare words
way2: "double-quoted strings"
way3: 'single-quoted strings'
```

所有内联样式必须在一行内。

- 裸字不带引号，也不进行转义。因此，使用时需要注意字符的选择。
- 双引号字符串可以使用 `\` 转义特定字符。例如 `"\"Hello\", she said"`。可以用 `\n` 转义换行。
- 单引号字符串是"字面"字符串，不使用 `\` 转义字符。唯一的转义序列是 `''`，表示单个 `'`。

除了单行字符串，还可以声明多行字符串：

```yaml
coffee: |
  Latte
  Cappuccino
  Espresso
```

上例会将 `coffee` 的值视为单个字符串，等同于 `Latte\nCappuccino\nEspresso\n`。

注意 `|` 后的第一行必须正确缩进。如果这样写就会破坏上面的示例：

```yaml
coffee: |
         Latte
  Cappuccino
  Espresso

```

由于 `Latte` 缩进不正确，会遇到这样的错误：

```
Error parsing file: error converting YAML to JSON: yaml: line 7: did not find expected key
```

在模板中，为了避免上述错误，在多行文档中添加一个虚拟的"第一行"内容会更安全：

```yaml
coffee: |
  # Commented first line
         Latte
  Cappuccino
  Espresso

```

注意无论第一行是什么，都会保留在字符串输出中。因此，如果你用这种技术将文件内容注入到 ConfigMap 中，注释应该是读取该条目的程序所期望的类型。

### 控制多行字符串中的空格

在上面的示例中，我们用 `|` 表示多行字符串。但注意字符串内容后面有一个尾随的 `\n`。如果希望 YAML 处理器去掉尾随换行符，可以在 `|` 后添加 `-`：

```yaml
coffee: |-
  Latte
  Cappuccino
  Espresso
```

现在 `coffee` 的值是：`Latte\nCappuccino\nEspresso`（没有尾随的 `\n`）。

有时我们希望保留所有尾随空白。可以使用 `|+` 符号：

```yaml
coffee: |+
  Latte
  Cappuccino
  Espresso


another: value
```

现在 `coffee` 的值是 `Latte\nCappuccino\nEspresso\n\n\n`。

文本块内的缩进会被保留，换行符也会保留：

```yaml
coffee: |-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

上例中，`coffee` 的值是 `Latte\n  12 oz\n  16 oz\nCappuccino\nEspresso`。

### 缩进和模板

编写模板时，你可能想将文件内容注入到模板中。如前面章节所述，有两种方法：

- 使用 `{{ .Files.Get "FILENAME" }}` 获取 chart 中的文件内容。
- 使用 `{{ include "TEMPLATE" . }}` 渲染模板并将其内容放入 chart。

将文件插入 YAML 时，理解上面的多行规则很重要。通常，插入静态文件最简单的方式是这样：

```yaml
myfile: |
{{ .Files.Get "myfile.txt" | indent 2 }}
```

注意上面的缩进方式：`indent 2` 告诉模板引擎将 "myfile.txt" 的每一行缩进两个空格。注意模板行本身没有缩进。因为如果缩进了，文件内容的第一行会被缩进两次。

### 折叠多行字符串

有时你想在 YAML 中用多行表示一个字符串，但希望解析时将其视为一个长行。这称为"折叠"。要声明折叠块，使用 `>` 代替 `|`：

```yaml
coffee: >
  Latte
  Cappuccino
  Espresso


```

上例中 `coffee` 的值是：`Latte Cappuccino Espresso\n`。注意除了最后一个换行符外，所有换行符都会转换为空格。可以将空白控制符与折叠文本标记组合使用，`>-` 会替换或去除所有换行符。

注意在折叠语法中，缩进的文本会保留行。

```yaml
coffee: >-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

上例的结果是 `Latte\n  12 oz\n  16 oz\nCappuccino Espresso`。注意空格和换行符都保留了。

## 在一个文件中嵌入多个文档

可以将多个 YAML 文档放在单个文件中。方法是在新文档前加 `---`，在文档结尾加 `...`：

```yaml

---
document: 1
...
---
document: 2
...
```

很多情况下，`---` 或 `...` 可以省略。

Helm 中有些文件不能包含多个文档。例如，如果 `values.yaml` 文件中提供了多个文档，只会使用第一个。

但模板文件可以有多个文档。这种情况下，文件（及其所有文档）在模板渲染时被视为一个对象。但生成的 YAML 在传给 Kubernetes 之前会被拆分成多个文档。

我们建议只在确实需要时才在单个文件中使用多个文档。单个文件中有多个文档会难以调试。

## YAML 是 JSON 的超集

由于 YAML 是 JSON 的超集，任何合法的 JSON 文档 _都应该_ 是合法的 YAML。

```json
{
  "coffee": "yes, please",
  "coffees": [
    "Latte", "Cappuccino", "Espresso"
  ]
}
```

上面是以下内容的另一种表示方式：

```yaml
coffee: yes, please
coffees:
- Latte
- Cappuccino
- Espresso
```

两者也可以混合使用（但要小心）：

```yaml
coffee: "yes, please"
coffees: [ "Latte", "Cappuccino", "Espresso"]
```

这三种写法都会解析为相同的内部表示。

虽然这意味着 `values.yaml` 等文件可以包含 JSON 数据，但 Helm 不会将 `.json` 后缀的文件视为有效文件。

## YAML 锚点

YAML 规范提供了一种存储值引用、然后通过引用使用该值的方式。YAML 将此称为"锚定"：

```yaml
coffee: "yes, please"
favorite: &favoriteCoffee "Cappuccino"
coffees:
  - Latte
  - *favoriteCoffee
  - Espresso
```

上例中，`&favoriteCoffee` 设置了对 `Cappuccino` 的引用。之后通过 `*favoriteCoffee` 使用该引用。这样 `coffees` 就变成了 `Latte, Cappuccino, Espresso`。

锚点在某些场景中很有用，但有一个方面可能会导致微妙的 bug：第一次解析 YAML 时，引用会被展开然后丢弃。

因此，如果我们解码再重新编码上面的示例，生成的 YAML 会是这样：

```yaml
coffee: yes, please
favorite: Cappuccino
coffees:
- Latte
- Cappuccino
- Espresso
```

由于 Helm 和 Kubernetes 经常读取、修改然后重写 YAML 文件，锚点会丢失。
