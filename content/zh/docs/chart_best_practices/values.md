---
title: "values"
description: "聚焦于如何构建和使用你的values。"
weight: 2
---

最佳实践的该部分包括了values的使用。这部分指南中，我们提供了关于你如何构建和使用values的建议，以及专注于设计chart的 `values.yaml`文件。

## 命名规范

变量名称以小写字母开头，单词按驼峰区分：

正确的：

```yaml
chicken: true
chickenNoodleSoup: true
```

错误的：

```yaml
Chicken: true  # initial caps may conflict with built-ins
chicken-noodle-soup: true # do not use hyphens in the name
```

注意所有的Helm内置变量以大写字母开头，以便与用户定义的value进行区分：`.Release.Name`，`.Capabilities.KubeVersion`。

## 扁平或嵌套的Value

YAML是一种灵活格式，值可以嵌套得很深，也可以是扁平的。

嵌套的：

```yaml
server:
  name: nginx
  port: 80
```

扁平的

```yaml
serverName: nginx
serverPort: 80
```

大多数场景中，扁平的优于嵌套的。因为对模板开发者和用户来说更加简单。

为了最佳的安全性，嵌套值的每一层都必须检查：

```yaml
{{ if .Values.server }}
  {{ default "none" .Values.server.name }}
{{ end }}
```

对于每个嵌套层，都必须进行存在性检查。但对于扁平的配置，使得模板更易于阅读和使用，这个检查可以跳过。

```yaml
{{ default "none" .Values.serverName }}
```

当有大量的相关变量时，其中至少有一个是非选择性的，嵌套的值可以改善可读性。

## 搞清楚类型

YAML的类型强制规则有时候是很反常的。比如，`foo: false` 和 `foo: "false"` 是不一样的。大整型数如：`foo: 12345678`
有时会被转换成科学计数法。

避免类型强制规则错误最简单的方式是字符串明确定义，其他都是不明确的。或者，简单来讲， _给所有字符串打引号_。

通常，为了避免整数转换问题，将整型存储为字符串更好，并用 `{{ int $value }}` 在模板中将字符串转回整型。

在大多数场景中，显式的类型标记更好，所以 `foo: !!string 1234` 会将`1234`作为字符串对待。
_但是_，YAML解析器会消耗标记，因此类型数据在一次解析后会丢失。

## 考虑用户如何使用你的value

有三种潜在的value来源:

- chart的`values.yaml`文件
- 由`helm install -f` 或 `helm upgrade -f`提供的values文件
- 在执行`helm install` 或 `helm upgrade` 时传递给`--set` 或 `--set-string` 参数的values

当设计values的结构时，记得你的chart用户可能会通过`-f` 参数或`--set`选项覆盖他们。

由于`--set`在表现上更有限，编写你`values.yaml`文件的第一指导原则是 _确保它容易被`--set`覆盖_。

因此使用map构建values文件更好。

很难与`--set`一起使用：

```yaml
servers:
  - name: foo
    port: 80
  - name: bar
    port: 81
```

上述在Helm `<=2.4`的版本中无法和`--set`一起表达。在Helm 2.5中，访问foo上的端口是
`--set servers[0].port=80`。用户不仅更难理解，而且以后更改`servers`顺序之后更易出错。

易于使用：

```yaml
servers:
  foo:
    port: 80
  bar:
    port: 81
```

这样访问foo的port更加明显： `--set servers.foo.port=80`。

## 给`values.yaml`写文档

`values.yaml`中每个定义的属性都应该文档化。文档字符串应该以它要描述的属性开头，并至少给出一句描述。

不正确的：

```yaml
# the host name for the webserver
serverHost: example
serverPort: 9191
```

正确的：

```yaml
# serverHost is the host name for the webserver
serverHost: example
# serverPort is the HTTP listener port for the webserver
serverPort: 9191
```

以它描述的参数名称开始每个注释可以很容易整理文档，并使文档工具能可靠地将文档字符串与其描述的参数关联起来。
