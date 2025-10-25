---
title: 模板
description: 进一步了解围绕模板的最佳实践。
sidebar_position: 3
---

最佳实践指南的这部分聚焦于模板。

## `templates/`结构

`templates/`目录结构应该如下：

- 如果生成YAML输出，模板文件应该有扩展名`.yaml`。
  扩展名是`.tpl`可用于生成非格式化内容的模板文件。
- 模板文件名称应该使用横杠符号(`my-example-configmap.yaml`)，不用驼峰记法。
- 每个资源的定义应该在它自己的模板文件中。
- 模板文件的名称应该反映名称中的资源类型。比如：`foo-pod.yaml`， `bar-svc.yaml`

## 定义模板的名称

定义的模板(在`{{ define }}`命令中定义的模板)是可全局访问的。这就意味着chart和所有的子chart都可以访问用`{{ define }}`创建的所有模板。

因此， _所有定义的模板名称应该被命名空间化。_

正确的：

```yaml
{{- define "nginx.fullname" }}
{{/* ... */}}
{{ end -}}
```

不正确的：

```yaml
{{- define "fullname" -}}
{{/* ... */}}
{{ end -}}
```

强烈建议通过`helm create`命令创建新chart，因为模板名称是根据此最佳实践自动定义的。

## 格式化模板

模板应该使用两个 _空格_ 缩进（永远不要用tab）。

模板命令的大括号前后应该使用空格：

正确的：

```yaml
{{ .foo }}
{{ print "foo" }}
{{- print "bar" -}}
```

不正确的：

```yaml
{{.foo}}
{{print "foo"}}
{{-print "bar"-}}
```

模板应该尽可能多地使用空格：

```yaml
foo:
  {{- range .Values.items }}
  {{ . }}
  {{ end -}}
```

块(例如控制结构) 可以缩进表示模板代码流。

```yaml
{{ if $foo -}}
  {{- with .Bar }}Hello{{ end -}}
{{- end -}}
```

然而，因为YAML是面向空格的语言，代码缩进通常不可能遵守规范。

## 生成模板中的空格

最好在生成的模板中将空格量保持在最小值。尤其是大量的空行不应该相邻出现。但偶尔有空行（尤其在逻辑块之间）是没问题的。

这样是最好的：

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example
  labels:
    first: first
    second: second
```

这样也OK：

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example

  labels:
    first: first
    second: second

```

但避免这样：

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example





  labels:
    first: first

    second: second

```

## 注释 (YAML注释 vs. 模板注释)

YAML和Helm模板都有注释标记符。

YAML注释：

```yaml
# This is a comment
type: sprocket
```

模板注释：

```yaml
{{- /*
This is a comment.
*/}}
type: frobnitz
```

描述模板的特性时应当使用模板注释，比如解释一个定义的模板：

```yaml
{{- /*
mychart.shortname provides a 6 char truncated version of the release name.
*/}}
{{ define "mychart.shortname" -}}
{{ .Release.Name | trunc 6 }}
{{- end -}}

```

在模板中，当有益于Helm用户（可能）在调试时查看注释，可以使用YAML注释。

```yaml
# This may cause problems if the value is more than 100Gi
memory: {{ .Values.maxMem | quote }}
```

以上注释在用户执行`helm install --debug`时是可见的，而在`{{- /* */}}`部分指定注释不会显示。

## 在模板和模板输出中使用JSON

YAML是JSON的超集。在某些情况下，使用JSON语法比其他YAML表示更具可读性。

比如，这个YAML更接近表示列表的普通YAML方法：

```yaml
arguments:
  - "--dirname"
  - "/foo"
```

但是折叠成JSON列表样式时会更易阅读:

```yaml
arguments: ["--dirname", "/foo"]
```

使用JSON可以很好地提高易读性。然而，JSON语法不应用于表示更复杂的结构。

在处理嵌入到YAML中的纯JSON时（比如初始化容器配置），使用JSON格式当然是最合适的。
