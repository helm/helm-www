---
title: 在模板内部访问文件
description: 如何从模板中访问文件
sidebar_position: 10
---

在上一节中，我们介绍了创建和访问命名模板的几种方法。这使得在模板之间相互导入变得很容易。但有时你需要导入的是一个**非模板文件**，并直接注入其内容，而不经过模板渲染引擎处理。

Helm 通过 `.Files` 对象提供对文件的访问。不过在使用模板示例之前，有几点需要注意：

- 可以在 chart 中添加额外的文件，这些文件会被一起打包。但要注意，由于 Kubernetes 对象的存储限制，chart 大小必须小于 1M。
- 出于安全考虑，某些文件无法通过 `.Files` 对象访问：
  - 无法访问 `templates/` 目录中的文件。
  - 无法访问被 `.helmignore` 排除的文件。
  - 无法访问 Helm 应用 [子 chart](./subcharts_and_globals.md) 之外的文件，包括父 chart 中的文件。
- chart 不保留 UNIX 模式信息，因此文件级权限不会影响 `.Files` 对象对文件的可用性。

<!-- (see https://github.com/jonschlinkert/markdown-toc) -->

<!-- toc -->

- [基本示例](#基本示例)
- [路径辅助函数](#路径辅助函数)
- [Glob 模式](#glob-模式)
- [ConfigMap 和 Secret 实用函数](#configmap-和-secret-实用函数)
- [编码](#编码)
- [逐行读取](#逐行读取)

<!-- tocstop -->

## 基本示例

了解了这些注意事项后，让我们编写一个模板，将三个文件读取到 ConfigMap 中。首先，在 chart 中添加三个文件，直接放在 `mychart/` 目录下。

`config1.toml`：

```toml
message = "Hello from config 1"
```

`config2.toml`：

```toml
message = "This is config 2"
```

`config3.toml`：

```toml
message = "Goodbye from config 3"
```

每个文件都是简单的 TOML 文件（类似于早期 Windows 的 INI 文件）。我们知道这些文件的名称，因此可以使用 `range` 函数遍历它们，并将内容注入到 ConfigMap 中。

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

这个 ConfigMap 使用了前面章节讨论过的技术。例如，我们创建了一个 `$files` 变量来保存对 `.Files` 对象的引用，并使用 `tuple` 函数创建了要遍历的文件列表。然后打印每个文件名（`{{ . }}: |-`），接着通过 `{{ $files.Get . }}` 打印文件内容。

执行这个模板会生成一个包含所有三个文件内容的 ConfigMap：

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

## 路径辅助函数

处理文件时，对文件路径执行一些标准操作会很有用。为此，Helm 从 Go 的 [path](https://golang.org/pkg/path/) 包中导入了一些函数供你使用。这些函数使用与 Go 包相同的名称，但首字母小写。例如 `Base` 变成 `base`，以此类推。

导入的函数包括：
- Base
- Dir
- Ext
- IsAbs
- Clean

## Glob 模式

随着 chart 规模增长，你可能需要更好地组织文件。为此我们提供了 `Files.Glob(pattern string)` 方法，它支持使用 [glob 模式](https://godoc.org/github.com/gobwas/glob) 灵活地提取特定文件。

`.Glob` 返回一个 `Files` 类型，因此你可以在返回的对象上调用任何 `Files` 方法。

例如，假设有以下目录结构：

```
foo/:
  foo.txt foo.yaml

bar/:
  bar.go bar.conf baz.yaml
```

使用 Glob 有多种方式：

```yaml
{{ $currentScope := .}}
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
    {{- with $currentScope}}
        {{ .Files.Get $path }}
    {{- end }}
{{ end }}
```

或者

```yaml
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
      {{ $.Files.Get $path }}
{{ end }}
```

## ConfigMap 和 Secret 实用函数

（Helm 2.0.2 及更高版本可用）

将文件内容放入 ConfigMap 和 Secret 以便在运行时挂载到 Pod 是很常见的需求。为此，我们在 `Files` 类型上提供了一些实用方法。

结合 `Glob` 方法使用这些方法可以更好地组织文件。

使用上面 [Glob 模式](#glob-模式) 示例中的目录结构：

```yaml
---
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

## 编码

你可以导入文件并使用 base64 编码，以确保传输成功：

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

上面的模板使用之前的 `config1.toml` 文件并对其进行编码：

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

## 逐行读取

有时需要在模板中逐行访问文件内容。我们为此提供了便捷的 `Lines` 方法。

你可以使用 `range` 函数遍历 `Lines`：

```yaml
data:
  some-file.txt: {{ range .Files.Lines "foo/bar.txt" }}
    {{ . }}{{ end }}
```

在 `helm install` 过程中无法将 chart 外部的文件传入。因此，如果需要用户提供数据，必须使用 `helm install -f` 或 `helm install --set` 加载。

本节总结了编写 Helm 模板所需工具和技术的深入讨论。下一节我们将介绍如何使用特殊文件 `templates/NOTES.txt` 向 chart 用户发送安装后说明。
