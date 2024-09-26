---
title: "内置对象"
description: "模板可用的内置对象"
weight: 3
---

对象可以通过模板引擎传递到模板中。 当然你的代码也可以传递对象。（我们在使用`with`和`range`语句时，会看到示例）。有几种方式可以在模板中创建新对象，比如说我们后面会看到的`tuple`功能。

对象可以是非常简单的:仅有一个值。或者可以包含其他对象或方法。比如，`Release`对象可以包含其他对象（比如：`Release.Name`）和`Files`对象有一组方法。

在上一部分中，我们用`{{ .Release.Name }}`在模板中插入版本名称。`Release`是你可以在模板中访问的顶层对象之一。 

- `Release`： `Release`对象描述了版本发布本身。包含了以下对象：
  - `Release.Name`： release名称
  - `Release.Namespace`： 版本中包含的命名空间(如果manifest没有覆盖的话)
  - `Release.IsUpgrade`： 如果当前操作是升级或回滚的话，该值将被设置为`true`
  - `Release.IsInstall`： 如果当前操作是安装的话，该值将被设置为`true`
  - `Release.Revision`： 此次修订的版本号。安装时是1，每次升级或回滚都会自增
  - `Release.Service`： 该service用来渲染当前模板。Helm里始终`Helm`
- `Values`： `Values`对象是从`values.yaml`文件和用户提供的文件传进模板的。默认为空
- `Chart`： `Chart.yaml`文件内容。 `Chart.yaml`里的所有数据在这里都可以可访问的。比如
`{{ .Chart.Name }}-{{ .Chart.Version }}` 会打印出 `mychart-0.1.0`
  - 在[Chart 指南](https://helm.sh/zh/docs/topics/charts#Chart-yaml-文件) 中列出了可获得属性
- `Files`： 在chart中提供访问所有的非特殊文件的对象。你不能使用它访问`Template`对象，只能访问其他文件。
请查看这个[文件访问](https://helm.sh/zh/docs/chart_template_guide/accessing_files)部分了解更多信息
  - `Files.Get` 通过文件名获取文件的方法。 （`.Files.Getconfig.ini`）
  - `Files.GetBytes` 用字节数组代替字符串获取文件内容的方法。 对图片之类的文件很有用
  - `Files.Glob` 用给定的shell glob模式匹配文件名返回文件列表的方法
  - `Files.Lines` 逐行读取文件内容的方法。迭代文件中每一行时很有用
  - `Files.AsSecrets` 使用Base 64编码字符串返回文件体的方法
  - `Files.AsConfig` 使用YAML格式返回文件体的方法
- `Capabilities`： 提供关于Kubernetes集群支持功能的信息
  - `Capabilities.APIVersions` 是一个版本列表
  - `Capabilities.APIVersions.Has $version` 说明集群中的版本 (比如,`batch/v1`) 或是资源 (比如, `apps/v1/Deployment`) 是否可用
  - `Capabilities.KubeVersion` 和`Capabilities.KubeVersion.Version` 是Kubernetes的版本号
  - `Capabilities.KubeVersion.Major` Kubernetes的主版本
  - `Capabilities.KubeVersion.Minor` Kubernetes的次版本
  - `Capabilities.HelmVersion` 包含Helm版本详细信息的对象，和 `helm version` 的输出一致
  - `Capabilities.HelmVersion.Version` 是当前Helm语义格式的版本
  - `Capabilities.HelmVersion.GitCommit` Helm的git sha1值
  - `Capabilities.HelmVersion.GitTreeState` 是Helm git树的状态
  - `Capabilities.HelmVersion.GoVersion` 是使用的Go编译器版本
- `Template`： 包含当前被执行的当前模板信息
  - `Template.Name`: 当前模板的命名空间文件路径 (e.g. `mychart/templates/mytemplate.yaml`)
  - `Template.BasePath`: 当前chart模板目录的路径 (e.g. `mychart/templates`)

内置的值都是以大写字母开始。 这是符合Go的命名惯例。当你创建自己的名称时，可以按照团队约定自由设置。
就像很多你在 [Artifact Hub](https://artifacthub.io/packages/search?kind=0) 中看到的chart，其团队选择使用首字母小写将本地名称与内置对象区分开，本指南中我们也遵循该惯例。
