---
title: 在模板内部访问文件
description: 如何从模板中访问文件
sidebar_position: 10
---


在上一节中，我们研究了几种创建和访问模板的方法。这样可以很容易从一个模板导入到另一个模板中。
但有时想导入的是不是模板的文件并注入其内容，而无需通过模板渲染发送内容。

Helm 提供了通过`.Files`对象访问文件的方法。不过，在我们使用模板示例之前，有些事情需要注意：

- 可以添加额外的文件到chart中。虽然这些文件会被绑定。但是要小心，由于Kubernetes对象的限制，Chart必须小于1M。
- 通常处于安全考虑，一些文件无法通过`.Files`对象访问：
  - 无法访问`templates/`中的文件
  - 无法访问使用`.helmignore`排除的文件
  - helm应用[subchart](https://helm.sh/zh/docs/chart_template_guide/subcharts_and_globals)之外的文件，包括父级中的，不能被访问的
- Chart不能保留UNIX模式信息，因此当文件涉及到`.Files`对象时，文件级权限不会影响文件的可用性。

<!-- (see https://github.com/jonschlinkert/markdown-toc) -->

<!-- toc -->

- [基本示例](#basic-example)
- [Path辅助对象](#path-helpers)
- [全局模式](#glob-patterns)
- [ConfigMap和密钥的实用功能](#configmap-and-secrets-utility-functions)
- [编码](#encoding)
- [文件行](#lines)

<!-- tocstop -->

## Basic example

先不管警告，我们来写一个读取三个文件到配置映射ConfigMap的模板。开始之前，我们会在chart中添加三个文件，
直接放到`mychart/`目录中。

`config1.toml`:

```toml
message = "Hello from config 1"
```

`config2.toml`:

```toml
message = "This is config 2"
```

`config3.toml`:

```toml
message = "Goodbye from config 3"
```

每个都是简单的TOML文件（类似于windows老式的INI文件）。我们知道这些文件的名称，因此我们使用`range`功能遍历它们并将它们的内容注入到我们的ConfigMap中。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  {{- $files := .Files }}
  {{- range tuple "config1.toml" "config2.toml" "config3.toml" }}
  {{ . }}: |-
    {{ $files.Get . }}
  {{- end }}
```

这个配置映射使用了之前章节讨论过的技术。比如，我们创建了一个`$files`变量来引用`.Files`对象。我们也使用了`tuple`方法创建了一个可遍历的文件列表。
然后我们打印每个文件的名字(`{{ . }}: |-`)，然后通过`{{ $files.Get . }}`打印文件内容。

执行这个模板会生成包含了三个文件所有内容的单个配置映射：

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: quieting-giraf-configmap
data:
  config1.toml: |-
    message = "Hello from config 1"

  config2.toml: |-
    message = "This is config 2"

  config3.toml: |-
    message = "Goodbye from config 3"
```

## Path helpers

使用文件时，对文件路径本身执行一些标准操作会很有用。为了实现这些，Helm从Go的[path](https://golang.org/pkg/path/)包中导入了一些功能。
都使用了与Go包中一样的名称就可以访问。但是第一个字符使用了小写，比如`Base`变成了`base`等等。

导入的功能包括：
- Base
- Dir
- Ext
- IsAbs
- Clean

## Glob patterns

当你的chart不断变大时，你会发现你强烈需要组织你的文件，所以我们提供了一个
`Files.Glob(pattern string)`方法来使用[全局模式](https://godoc.org/github.com/gobwas/glob)的灵活性读取特定文件。

`.Glob`返回一个`Files`类型，因此你可以在返回对象上调用任意的`Files`方法。

比如，假设有这样的目录结构：

```
foo/:
  foo.txt foo.yaml

bar/:
  bar.go bar.conf baz.yaml
```

全局模式下您有多种选择：


```yaml
{{ $currentScope := .}}
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
    {{- with $currentScope}}
        {{ .Files.Get $path }}
    {{- end }}
{{ end }}
```

Or

```yaml
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
      {{ $.Files.Get $path }}
{{ end }}
```

## ConfigMap and Secrets utility functions

（在Helm 2.0.2及后续版本可用）

把文件内容放入配置映射和密钥是很普遍的功能，为了运行时挂载到你的pod上。为了实现它，我们提供了一些基于`Files`类型的实用方法。

为了进一步组织文件，这些方法结合`Glob`方法使用时尤其有用。

上面的文件结构使用[Glob](#glob-patterns)时的示例如下：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: conf
data:
{{ (.Files.Glob "foo/*").AsConfig | indent 2 }}
---
apiVersion: v1
kind: Secret
metadata:
  name: very-secret
type: Opaque
data:
{{ (.Files.Glob "bar/*").AsSecrets | indent 2 }}
```

## Encoding

您可以导入一个文件并使用模板的base-64方式对其进行编码来保证成功传输：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ .Release.Name }}-secret
type: Opaque
data:
  token: |-
    {{ .Files.Get "config1.toml" | b64enc }}
```

上面的内容使用我们之前使用的相同的`config1.toml`文件进行编码：

```yaml
# Source: mychart/templates/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: lucky-turkey-secret
type: Opaque
data:
  token: |-
    bWVzc2FnZSA9ICJIZWxsbyBmcm9tIGNvbmZpZyAxIgo=
```

## Lines

有时需要访问模板中的文件的每一行。我们提供了一个方便的`Lines`方法。

你可以使用`range`方法遍历`Lines`：

```yaml
data:
  some-file.txt: {{ range .Files.Lines "foo/bar.txt" }}
    {{ . }}{{ end }}
```

在`helm install`过程中无法将文件传递到chart外。因此如果你想请求用户提供数据，必须使用`helm install -f`或`helm install --set`加载。

该部分讨论整合了我们对编写Helm模板的工具和技术的深入研究。下个章节我们会看到如何使用特殊文件`templates/NOTES.txt`，
向chart的用户发送安装后的说明。
