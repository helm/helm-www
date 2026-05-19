---
title: Chart 开发提示和技巧
description: 介绍 Helm chart 开发者在构建生产级 chart 时积累的一些提示和技巧。
sidebar_position: 1
---

本指南介绍 Helm chart 开发者在构建生产级 chart 时积累的一些提示和技巧。

## 了解模板函数

Helm 使用 [Go 模板](https://godoc.org/text/template) 来渲染资源文件。Go 自带了一些内置函数，我们还额外添加了许多其他函数。

首先，我们添加了 [Sprig 库](https://masterminds.github.io/sprig/) 中的所有函数，出于安全原因，`env` 和 `expandenv` 除外。

我们还添加了两个特殊的模板函数：`include` 和 `required`。`include` 函数允许你引入另一个模板，并将结果传递给其他模板函数。

例如，以下模板片段引入了名为 `mytpl` 的模板，然后将结果转为小写，并用双引号括起来：

```yaml
value: {{ include "mytpl" . | lower | quote }}
```

`required` 函数允许你声明模板渲染所需的特定值。如果该值为空，模板渲染将失败并显示用户指定的错误信息。

以下 `required` 函数示例声明 `.Values.who` 条目是必需的，如果缺少该条目将打印错误信息：

```yaml
value: {{ required "A valid .Values.who entry required!" .Values.who }}
```

## 字符串要加引号，整数不要

处理字符串数据时，用引号括起来总是更安全：

```yaml
name: {{ .Values.MyName | quote }}
```

但处理整数时，_不要加引号_。这在很多情况下会导致 Kubernetes 解析错误。

```yaml
port: {{ .Values.Port }}
```

这条规则不适用于环境变量值——即使表示整数，环境变量也应该是字符串：

```yaml
env:
  - name: HOST
    value: "http://host"
  - name: PORT
    value: "1234"
```

## 使用 'include' 函数

Go 提供了一种使用内置 `template` 指令在模板中包含另一个模板的方法。但是，内置函数无法在 Go 模板管道中使用。

为了包含模板并处理其输出，Helm 提供了特殊的 `include` 函数：

```
{{ include "toYaml" $value | indent 2 }}
```

上面的代码引入了名为 `toYaml` 的模板，将 `$value` 传递给它，然后将该模板的输出传递给 `indent` 函数。

由于 YAML 对缩进级别和空白敏感，这是一种很好的方式来包含代码片段，同时在相关上下文中处理缩进。

## 使用 'required' 函数

Go 提供了一种设置模板选项的方法，用于控制当使用不存在的键索引 map 时的行为。通常使用 `template.Options("missingkey=option")` 来设置，其中 `option` 可以是 `default`、`zero` 或 `error`。虽然将此选项设置为 error 会在遇到缺失键时停止执行并报错，但这会应用于 map 中的每个缺失键。在某些情况下，chart 开发者可能希望对 `values.yaml` 文件中的特定值强制执行此行为。

`required` 函数允许开发者声明模板渲染必需的值条目。如果该条目在 `values.yaml` 中为空，模板将不会渲染，并返回开发者指定的错误信息。

例如：

```
{{ required "A valid foo is required!" .Values.foo }}
```

上面的代码在 `.Values.foo` 有定义时会正常渲染模板，但如果 `.Values.foo` 未定义则会渲染失败并退出。

## 使用 'tpl' 函数

`tpl` 函数允许开发者在模板内部将字符串作为模板进行求值。这在将模板字符串作为值传递给 chart 或渲染外部配置文件时非常有用。语法：`{{ tpl TEMPLATE_STRING VALUES }}`

示例：

```yaml
# values
template: "{{ .Values.name }}"
name: "Tom"

# template
{{ tpl .Values.template . }}

# output
Tom
```

渲染外部配置文件：

```yaml
# external configuration file conf/app.conf
firstName={{ .Values.firstName }}
lastName={{ .Values.lastName }}

# values
firstName: Peter
lastName: Parker

# template
{{ tpl (.Files.Get "conf/app.conf") . }}

# output
firstName=Peter
lastName=Parker
```

## 创建镜像拉取 Secret

镜像拉取 Secret 本质上是 _registry_、_username_ 和 _password_ 的组合。在部署应用时可能需要它，但创建时需要多次运行 `base64`。我们可以编写一个辅助模板来生成 Docker 配置文件，作为 Secret 的数据载荷。示例如下：

首先，假设凭据在 `values.yaml` 文件中定义如下：

```yaml
imageCredentials:
  registry: quay.io
  username: someone
  password: sillyness
  email: someone@host.com
```

然后定义辅助模板：

```
{{- define "imagePullSecret" }}
{{- with .Values.imageCredentials }}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":%s,\"email\":\"%s\",\"auth\":\"%s\"}}}" .registry .username (.password | quote) .email (printf "%s:%s" .username .password | b64enc) | b64enc }}
{{- end }}
{{- end }}
```

最后，在更大的模板中使用辅助模板来创建 Secret 清单：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: {{ template "imagePullSecret" . }}
```

## 自动滚动更新 Deployment

ConfigMap 或 Secret 经常作为配置文件注入容器，或者存在其他外部依赖变更需要滚动更新 Pod。根据应用的不同，如果这些内容在后续 `helm upgrade` 时更新了，可能需要重启应用。但如果 Deployment spec 本身没有变化，应用会继续使用旧配置运行，导致部署不一致。

可以使用 `sha256sum` 函数确保当其他文件发生变化时，Deployment 的注解部分会被更新：

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
[...]
```

注意：如果要将此添加到库 chart 中，你将无法使用 `$.Template.BasePath` 访问你的文件。作为替代，可以使用 `{{ include ("mylibchart.configmap") . | sha256sum }}` 引用你的定义。

如果你希望始终触发 Deployment 滚动更新，可以使用类似的注解方式，但用随机字符串替换，这样每次都会变化并触发滚动更新：

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        rollme: {{ randAlphaNum 5 | quote }}
[...]
```

每次调用模板函数都会生成唯一的随机字符串。这意味着如果需要同步多个资源使用的随机字符串，所有相关资源都需要放在同一个模板文件中。

这两种方法都允许你的 Deployment 利用内置的更新策略逻辑来避免停机。

注意：过去我们推荐使用 `--recreate-pods` 参数作为另一种选择。该参数在 Helm 3 中已被标记为弃用，请使用上面更具声明性的方法。

## 告诉 Helm 不要卸载资源

有时某些资源在 Helm 执行 `helm uninstall` 时不应该被卸载。chart 开发者可以在资源上添加注解来防止其被卸载。

```yaml
kind: Secret
metadata:
  annotations:
    helm.sh/resource-policy: keep
[...]
```

注解 `helm.sh/resource-policy: keep` 指示 Helm 在执行会导致资源删除的操作（如 `helm uninstall`、`helm upgrade` 或 `helm rollback`）时跳过该资源。_但是_，该资源会变成孤立状态。Helm 将不再以任何方式管理它。如果在已卸载但保留了资源的 release 上使用 `helm install --replace`，可能会导致问题。

## 使用 Partial 和模板引用

有时你想在 chart 中创建一些可复用的部分，无论是代码块还是模板片段。通常，将这些内容放在单独的文件中会更清晰。

在 `templates/` 目录中，任何以下划线（`_`）开头的文件都不会输出 Kubernetes 清单文件。因此按照惯例，辅助模板和 partial 会放在 `_helpers.tpl` 文件中。

## 包含多个依赖的复杂 Chart

CNCF [Artifact Hub](https://artifacthub.io/packages/search?kind=0) 中的许多 chart 是创建更高级应用的"构建块"。但 chart 也可能用于创建大规模应用的实例。在这种情况下，一个总体 chart 可能有多个子 chart，每个子 chart 都是整体的一部分。

目前从离散组件组合复杂应用的最佳实践是：创建一个顶层总体 chart 来暴露全局配置，然后使用 `charts/` 子目录来嵌入各个组件。

## YAML 是 JSON 的超集

根据 YAML 规范，YAML 是 JSON 的超集。这意味着任何有效的 JSON 结构在 YAML 中也应该是有效的。

好处是：有时模板开发者可能发现使用类 JSON 语法来表达数据结构比处理 YAML 的空白敏感性更容易。

作为最佳实践，模板应遵循类 YAML 语法，_除非_ JSON 语法能显著降低格式问题的风险。

## 生成随机值时要小心

Helm 中有一些函数允许你生成随机数据、加密密钥等。这些函数用起来很方便。但要注意，在升级过程中模板会重新执行。当模板运行生成的数据与上次运行不同时，会触发该资源的更新。

## 一条命令安装或升级 Release

Helm 提供了将安装或升级合并为单个命令的方式。使用 `helm upgrade` 加上 `--install` 参数。这会让 Helm 检查该 release 是否已安装。如果没有，则执行安装。如果已存在，则升级现有 release。

```console
$ helm upgrade --install <release name> --values <values file> <chart directory>
```
