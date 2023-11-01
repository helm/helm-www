---
title: "附录： YAML技术"
description: "详细描述了YAML规范以及如何应用于Helm。"
weight: 16
---

本指南大部分都聚焦于编写模板语言。这里，我们要看看YAML格式。作为模板作者，YAML有一些有用的特性
使我们的模板不易出错，更易阅读。

## 标量和集合

根据 [YAML 规范](https://yaml.org/spec/1.2/spec.html)，有两种集合类型和很多标量类型。

两种集合类型是map和sequence：

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

标量值是单个值，（与集合相反）

### YAML中的标量类型

在Helm内部的YAML语言中，一个标量值的数据类型是由一组复杂的规则决定的，包含了资源定义的Kubernetes模式。
但在推断类型时，以下规则往往是正确的。

如果整型或浮点型数字没有引号，通常被视为数字类型：

```yaml
count: 1
size: 2.34
```

但是如果被引号引起来，会被当做字符串：

```yaml
count: "1" # <-- string, not int
size: '2.34' # <-- string, not float
```

布尔函数也是如此：

```yaml
isGood: true   # bool
answer: "true" # string
```

空字符串是 `null` （不是 `nil`）。

注意 `port: "80"`是合法的YAML，可以通过模板引擎和YAML解释器传值，但是如果Kubernetes希望`port`是整型，就会失败。

在一些场景中，可以使用YAML节点标签强制推断特定类型：

```yaml
coffee: "yes, please"
age: !!str 21
port: !!int "80"
```

如上所示，`!!str`告诉解释器`age`是一个字符串，即使它看起来像是整型。即使`port`被引号括起来，也会被视为int。

## YAML中的字符串

YAML中的大多数数据都是字符串。YAML有多种表示字符串的方法。本节解释这些方法并演示如何使用其中一些方法。

有三种单行方式声明一个字符串：

```yaml
way1: bare words
way2: "double-quoted strings"
way3: 'single-quoted strings'
```

单行样式必须在一行：

- 裸字没有引号，也没有转义，因此，必须小心使用字符。
- 双引号字符串可以使用`\`转义指定字符。比如，`"\"Hello\", she said"`。可以使用`\n`转义换行。
- 单引号字符串是字面意义的字符串，不用`\`转义，只有单引号`''`需要转义，转成单个`'`。

除了单行字符串，可以声明多行字符串：

```yaml
coffee: |
  Latte
  Cappuccino
  Espresso
```

上述会被当作`coffee`的字符串值，等同于`Latte\nCappuccino\nEspresso\n`。

注意在第一行`|`后面必须正确缩进。可以这样破坏上述示例：

```yaml
coffee: |
         Latte
  Cappuccino
  Espresso

```

由于`Latte`没有正确缩进，会遇到这样的错误：

```shell
Error parsing file: error converting YAML to JSON: yaml: line 7: did not find expected key
```

模板中，有时候为了避免上述错误，在多行文本中添加一个假的“第一行”会更加安全：

```yaml
coffee: |
  # Commented first line
         Latte
  Cappuccino
  Espresso

```

注意无论第一行是什么，都会保存在字符串的输出中。比如你要这样把文件内容注入到配置映射中，注释应该是读取该条目需要的类型。

### 控制多行字符串中的空格

在上述示例中，使用了 `|` 来表示多行字符串。但是注意字符串后面有一个尾随的`\n`。如果需要YAML处理器去掉末尾的换行符，在`|`
后面添加`-`：

```yaml
coffee: |-
  Latte
  Cappuccino
  Espresso
```

现在 `coffee`的值变成了： `Latte\nCappuccino\nEspresso` (没有末尾的`\n`)。

其他时候，可能希望保留尾随空格。可以使用 `|+`符号：

```yaml
coffee: |+
  Latte
  Cappuccino
  Espresso


another: value
```

现在`coffee`的值是 `Latte\nCappuccino\nEspresso\n\n\n`。

文本块中的缩进会被保留，也会保留换行符：

```yaml
coffee: |-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

上述示例中，`coffee`会变成 `Latte\n  12 oz\n  16 oz\nCappuccino\nEspresso`。

### 缩进和模板

编写模板时，你可能会想将文件内容插入到模板中。正如在之前的章节中看到的，有两种方法处理：

- 使用 `{{ .Files.Get "FILENAME" }}` 获取chart中的文件内容。
- 使用 `{{ include "TEMPLATE" . }}` 渲染模板并将其放到chart中。

把文件插入到YAML时，就很好理解上面的多行规则了。通常，插入一个静态文件最简单的方式是像这样：

```yaml
myfile: |
{{ .Files.Get "myfile.txt" | indent 2 }}
```

注意上面是怎么做缩进的： `indent 2` 告诉模板引擎在文件"myfile.txt"中每行缩进两个空格。注意我们没有缩进模板的行。
因为如果缩进了，文件内容的第一行会缩进两次。

### 折叠多行字符串

有时您想在 YAML 中用多行表示一个字符串，但希望在解释时将其视为一个长行。这被称为"折叠"。要声明一个折叠块，使用 `>` 代替 `|`：

```yaml
coffee: >
  Latte
  Cappuccino
  Espresso


```

上面`coffee`的值是： `Latte Cappuccino Espresso\n`。 注意，除了最后一个换行符之外，所有的换行符都将转换成空格。
可以组合空格控制符和折叠字符标记 `>-` 来替换或取消所有的新行。

注意在折叠语法中，缩进文本将导致保留行。

```yaml
coffee: >-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

上述结果为：`Latte\n  12 oz\n  16 oz\nCappuccino Espresso`。注意空格和换行都保存下来了。

## 在一个文件中嵌入多个文档

可以将多个YAML文档放在单个文件中。 文档前使用 `---`，文档后使用 `...`

```yaml

---
document:1
...
---
document: 2
...
```

很多情况下，可以省略`---`或者`...`。

Helm中的有些文件无法包含多个文档。比如，如果`values.yaml`文件提供了多个文档，只会使用第一个。

但是模板文件可以有多个文档。这种情况下，文件会被当做一个对象进行渲染。但是将结果YAML提供给Kubernetes时，会被分成多个文档。

我们建议在确实需要时才将多个文档写入单个文件。单个文件中的多个文档会变得很难调试。

## YAML是JSON的超集

由于YAML是一个JSON的超集，任何合法的JSON文档 _都应该_ 是合法的YAML。

```json
{
  "coffee": "yes, please",
  "coffees": [
    "Latte", "Cappuccino", "Espresso"
  ]
}
```

上述json的另一种表述方式是：

```yaml
coffee: yes, please
coffees:
- Latte
- Cappuccino
- Espresso
```

而且两种可以混合（要小心）：

```yaml
coffee: "yes, please"
coffees: [ "Latte", "Cappuccino", "Espresso"]
```

所有这三个都应该解析为相同的内部表示形式。

这意味着类似 `values.yaml` 可能包含JSON数据，Helm将`.json`后缀文件视为不合法的文件。

## YAML 锚点

YAML规范存储了一种引用值的方法，然后通过引用指向该值。YAML称之为“锚定”：

```yaml
coffee: "yes, please"
favorite: &favoriteCoffee "Cappuccino"
coffees:
  - Latte
  - *favoriteCoffee
  - Espresso
```

上面示例中，`&favoriteCoffee` 设置成了`Cappuccino`的引用。之后，通过`*favoriteCoffee`使用引用。
这样`coffees` 就变成了 `Latte, Cappuccino, Espresso`。

锚点在一些场景中很有用，但另一方面，锚点可能会引起细微的错误：第一次使用YAML时，将展开引用，然后将其丢弃。

因此，如果我们解码再重新编码上述示例，产生的YAML就会时这样：

```yaml
coffee: yes, please
favorite: Cappuccino
coffees:
- Latte
- Cappuccino
- Espresso
```

因为Helm和Kubernetes经常读取，修改和重写YAML文件，锚点会丢失。
