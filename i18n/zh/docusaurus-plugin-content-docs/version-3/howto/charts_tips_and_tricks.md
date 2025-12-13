---
title: chart开发提示和技巧
description: 涵盖了Helm chart开发人员在构建产品质量chart时学到的一些提示和技巧
sidebar_position: 1
---

本指南涵盖了Helm chart的开发人员在构建生产环境质量的chart时学到的一些提示和技巧。

## 了解你的模板功能

Helm使用了[Go模板](https://godoc.org/text/template)将你的自由文件构建成模板。
Go塑造了一些内置方法，我们增加了一些其他的。

首先，我们添加了[Sprig库](https://masterminds.github.io/sprig/)中所有的方法，出于安全原因，“env”和“expandenv”除外。

我们也添加了两个特殊的模板方法：`include`和`required`。`include`方法允许你引入另一个模板，并将结果传递给其他模板方法。

比如，这个模板片段包含了一个叫`mytpl`的模板，然后将其转成小写，并使用双引号括起来。

```yaml
value: {{ include "mytpl" . | lower | quote }}
```

`required`方法可以让你声明模板渲染所需的特定值。如果这个值是空的，模板渲染会出错并打印用户提交的错误信息。

下面这个`required`方法的例子声明了一个`.Values.who`需要的条目，并且当这个条目不存在时会打印错误信息：

```yaml
value: {{ required "A valid .Values.who entry required!" .Values.who }}
```

## 字符串引号括起来，但整型不用

使用字符串数据时，你总是更安全地将字符串括起来而不是露在外面：

```yaml
name: {{ .Values.MyName | quote }}
```

但是使用整型时 _不要把值括起来_。在很多场景中那样会导致Kubernetes内解析失败。

```yaml
port: {{ .Values.Port }}
```

这个说明不适用于环境变量是字符串的情况，即使表现为整型：

```yaml
env:
  - name: HOST
    value: "http://host"
  - name: PORT
    value: "1234"
```

## 使用'include'方法

Go提供了一种使用内置模板将一个模板包含在另一个模板中的方法。然而内置方法并不适用于Go模板流水线。

为使包含模板成为可能，然后对该模板的输出执行操作，Helm有一个特殊的`include`方法：

```yaml
{{ include "toYaml" $value | indent 2 }}
```

上面这个包含的模板称为`toYaml`，传值给`$value`，然后将这个模板的输出传给`indent`方法。

由于YAML将重要性归因于缩进级别和空白，使其在包含代码片段时变成了一种好方法。但是在相关的上下文中要处理缩进。

## 使用 'required' 方法

Go提供了一种设置模板选项的方法去控制不在映射中的key来索引映射的行为。通常设置为`template.Options("missingkey=option")`，
`option`是`default`，`zero`，或 `error`。 将此项设置为error时会停止执行并出现错误，这会应用到map中的每一个缺失的key中。
某些情况下chart的开发人员希望在`values.yaml`中选择值强制执行此操作。

`required`方法允许开发者声明一个模板渲染需要的值。如果在`values.yaml`中这个值是空的，模板就不会渲染并返回开发者提供的错误信息。

例如：

```yaml
{{ required "A valid foo is required!" .Values.foo }}
```

上述示例表示当`.Values.foo`被定义时模板会被渲染，但是未定义时渲染会失败并退出。

## 使用'tpl'方法

`tpl`方法允许开发者在模板中使用字符串作为模板。将模板字符串作为值传给chart或渲染额外的配置文件时会很有用。
语法： `{{ tpl TEMPLATE_STRING VALUES }}`

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

渲染额外的配置文件：

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

## 创建镜像拉取密钥

镜像拉取密钥本质上是 _注册表_， _用户名_ 和 _密码_ 的组合。在正在部署的应用程序中你可能需要它，
但创建时需要用`base64`跑一会儿。我们可以写一个辅助模板来编写Docker的配置文件，用来承载密钥。示例如下：

首先，假定`values.yaml`文件中定义了证书如下：

```yaml
imageCredentials:
  registry: quay.io
  username: someone
  password: sillyness
  email: someone@host.com
```

然后定义下面的辅助模板：

```yaml
{{- define "imagePullSecret" }}
{{- with .Values.imageCredentials }}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":%s,\"email\":\"%s\",\"auth\":\"%s\"}}}" .registry .username (.password | quote) .email (printf "%s:%s" .username .password | b64enc) | b64enc }}
{{- end }}
{{- end }}
```

最终，我们使用辅助模板在更大的模板中创建了密钥清单：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: {{ template "imagePullSecret" . }}
```

## 自动滚动部署

由于配置映射或密钥作为配置文件注入容器以及其他外部依赖更新导致经常需要滚动部署pod。
随后的`helm upgrade`更新基于这个应用可能需要重新启动，但如果负载本身没有更改并使用原有配置保持运行，会导致部署不一致。

`sha256sum`方法保证在另一个文件发生更改时更新负载说明：

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
[...]
```

注意：如果要将这些添加到库chart中，就无法使用`$.Template.BasePath`访问你的文件。相反你可以使用
`{{ include ("mylibchart.configmap") . | sha256sum }}` 引用你的定义。

这个场景下你通常想滚动更新你的负载，可以使用类似的说明步骤，而不是使用随机字符串替换，因而经常更改并导致负载滚动更新：

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        rollme: {{ randAlphaNum 5 | quote }}
[...]
```

每次调用模板方法会生成一个唯一的随机字符串。这意味着如果需要同步多种资源使用的随机字符串，所有的相对资源都要在同一个模板文件中。

这两种方法都允许你的部署利用内置的更新策略逻辑来避免停机。

注意：过去我们推荐使用`--recreate-pods`参数作为另一个选项。这个参数在Helm 3中不推荐使用，而支持上面更具声明性的方法。

## 告诉Helm不要卸载资源

有时在执行`helm uninstall`时有些资源不应该被卸载。Chart的开发者可以在资源中添加额外的说明避免被卸载。

```yaml
kind: Secret
metadata:
  annotations:
    "helm.sh/resource-policy": keep
[...]
```

（需要引号）

这个说明`"helm.sh/resource-policy": keep`指示Helm操作(比如`helm uninstall`，`helm upgrade`
或`helm rollback`)要删除时跳过删除这个资源，_然而_，这个资源会变成孤立的。Helm不再以任何方式管理它。
如果在已经卸载的但保留资源的版本上使用`helm install --replace`会出问题。

## 使用"Partials"和模板引用

有时你想在chart中创建可以重复利用的部分，不管是块还是局部模板。通常将这些文件保存在自己的文件中会更干净。

在`templates/`目录中，任何以下划线(`_`)开始的文件不希望输出到Kubernetes清单文件中。因此按照惯例，辅助模板和局部模板会被放在`_helpers.tpl`文件中。

## 使用很多依赖的复杂Chart

在CNCF的[Artifact Hub](https://artifacthub.io/packages/search?kind=0)中的很多chart是创建更先进应用的“组成部分”。但是chart可能被用于创建大规模应用实例。
在这种场景中，一个总的chart会有很多子chart，每一个是整体功能的一部分。

当前从离散组件组成一个复杂应用的最佳实践是创建一个顶层总体chart构建全局配置，然后使用`charts/`子目录嵌入每个组件。

## YAML是JSON的超集

根据YAML规范，YAML是JSON的超集。这意味着任意的合法JSON结构在YAML中应该是合法的。

这有个优势：有时候模板开发者会发现使用类JSON语法更容易表达数据结构而不是处理YAML的空白敏感度。

作为最佳实践，模板应遵循类YAML语法 _除非_ JSON语法大大降低了格式问题的风险。

## 生成随机值时留神

Helm中有的方法允许你生成随机数据，加密密钥等等。这些很好用，但是在升级，模板重新执行时要注意，
当模板运行与最后一次运行不一样的生成数据时，会触发资源升级。

## 一条命令安装或升级版本

Helm提供了一种简单命令执行安装或升级的方法。使用`helm upgrade`和`--install`命令，这会是Helm查看是否已经安装版本，
如果没有，会执行安装；如果版本存在，会进行升级

```console
$ helm upgrade --install <release name> --values <values file> <chart directory>
```
