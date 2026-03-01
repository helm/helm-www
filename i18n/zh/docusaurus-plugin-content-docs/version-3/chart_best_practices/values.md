---
title: Values
description: 聚焦于如何构建和使用你的 values。
sidebar_position: 2
---

最佳实践指南的这部分介绍 values 的使用。本节提供关于如何构建和使用 values 的建议，重点讨论 chart 的 `values.yaml` 文件设计。

## 命名规范

变量名称应以小写字母开头，单词之间使用驼峰命名法：

正确：

```yaml
chicken: true
chickenNoodleSoup: true
```

错误：

```yaml
Chicken: true  # initial caps may conflict with built-ins
chicken-noodle-soup: true # do not use hyphens in the name
```

注意 Helm 的所有内置变量都以大写字母开头，以便与用户定义的 values 区分：`.Release.Name`、`.Capabilities.KubeVersion`。

## 扁平或嵌套的 Values

YAML 是一种灵活的格式，值可以嵌套很深，也可以是扁平的。

嵌套：

```yaml
server:
  name: nginx
  port: 80
```

扁平：

```yaml
serverName: nginx
serverPort: 80
```

大多数情况下，扁平结构优于嵌套结构。原因是对模板开发者和用户来说更简单。

为了保证安全性，嵌套值的每一层都必须检查：

```yaml
{{ if .Values.server }}
  {{ default "none" .Values.server.name }}
{{ end }}
```

每一层嵌套都必须进行存在性检查。但扁平配置可以跳过这些检查，使模板更易于阅读和使用。

```yaml
{{ default "none" .Values.serverName }}
```

当存在大量相关变量，且其中至少有一个是必填的时，可以使用嵌套值来提高可读性。

## 明确类型

YAML 的类型强制转换规则有时不太直观。例如，`foo: false` 和 `foo: "false"` 是不同的。大整数如 `foo: 12345678` 在某些情况下会被转换成科学计数法。

避免类型转换错误最简单的方法是：字符串显式声明，其他类型隐式声明。简而言之，_给所有字符串加引号_。

通常，为了避免整数转换问题，将整数也存储为字符串是个好做法，然后在模板中使用 `{{ int $value }}` 将字符串转回整数。

大多数情况下，显式类型标记会被正确识别，因此 `foo: !!string 1234` 会将 `1234` 当作字符串处理。_但是_，YAML 解析器会消耗这些标记，因此类型数据在一次解析后会丢失。

## 考虑用户如何使用 Values

values 有三种潜在来源：

- chart 的 `values.yaml` 文件
- 由 `helm install -f` 或 `helm upgrade -f` 提供的 values 文件
- 执行 `helm install` 或 `helm upgrade` 时通过 `--set` 或 `--set-string` 参数传递的值

设计 values 结构时，要记住 chart 用户可能会通过 `-f` 参数或 `--set` 选项覆盖它们。

由于 `--set` 的表达能力更有限，编写 `values.yaml` 文件的第一条准则是 _确保它易于被 `--set` 覆盖_。

因此，使用 map 来构建 values 文件通常更好。

难以配合 `--set` 使用：

```yaml
servers:
  - name: foo
    port: 80
  - name: bar
    port: 81
```

上述结构在 Helm `<=2.4` 中无法配合 `--set` 表达。在 Helm 2.5 中，访问 foo 的端口是 `--set servers[0].port=80`。这不仅让用户更难理解，而且如果以后 `servers` 的顺序发生变化，很容易出错。

易于使用：

```yaml
servers:
  foo:
    port: 80
  bar:
    port: 81
```

这样访问 foo 的端口就很明显：`--set servers.foo.port=80`。

## 给 `values.yaml` 写文档

`values.yaml` 中定义的每个属性都应该有文档说明。文档字符串应该以它描述的属性名称开头，然后至少给出一句描述。

错误：

```yaml
# the host name for the webserver
serverHost: example
serverPort: 9191
```

正确：

```yaml
# serverHost is the host name for the webserver
serverHost: example
# serverPort is the HTTP listener port for the webserver
serverPort: 9191
```

在注释开头写上参数名称，便于整理文档，也能让文档工具可靠地将文档字符串与其描述的参数关联起来。
