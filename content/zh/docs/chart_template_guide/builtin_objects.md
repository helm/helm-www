---
title: "内置对象"
description: "模板可用的内置对象"
weight: 3
---

&emsp;&emsp;对象从模板引擎传递到模板中。 你的代码也可以传递对象。（我们在使用`with`和`range`语句时，会看到示例）。甚至于有几种方式可以在你的模板中创建新对象，比如说我们后面会看到的`tuple`功能。

&emsp;&emsp;对象可以是简单的且仅有一个值。或者可以包含其他对象或方法。比如，`Release`对象包含一些对象（比如：`Release.Name`）和`Files`对象有一组方法。

&emsp;&emsp;在上一部分中，我们用`{{ .Release.Name }}`在模板中插入版本名称。`Release`是你可以在模板中访问的高级对象之一。 

- `Release`： 该对象描述了版本发布本身。包含了以下对象：
  - `Release.Name`： release名称
  - `Release.Namespace`： 版本中包含的命名空间(如果manifest没有覆盖的话)
  - `Release.IsUpgrade`： 如果当前操作是升级或回滚的话，需要将该值设置为`true`
  - `Release.IsInstall`： 如果当前操作是安装的话，需要将该值设置为`true`
  - `Release.Revision`： 此次修订的版本号。安装时是1，每次升级或回滚都会自增
  - `Release.Service`： 该service用来渲染当前模板。Helm里一般是`Helm`
- `Values`： Values是从`values.yaml`文件和用户提供的文件传进模板的。`Values`默认为空
- `Chart`： `Chart.yaml`文件内容。 `Chart.yaml`里的任意数据在这里都可以可访问的。比如 `{{ .Chart.Name }}-{{ .Chart.Version }}` 会打印出 `mychart-0.1.0`
  - [Chart 指南](http://docs.helm.sh/zh/docs/topics/charts.md#Chart-yaml-文件) 中列出了可用字段
- `Files`： 在chart中提供访问所有的非特殊文件。当你不能使用它访问模板时，你可以访问其他文件。请查看这个部分 [文件访问](http://docs.helm.sh/zh/docs/chart_template_guide/accessing_files.md) 了解跟多信息
  - `Files.Get` 通过文件名获取文件的方法。 （`.Files.Getconfig.ini`）
  - `Files.GetBytes` 用字节数组代替字符串获取文件内容的方法。 对图片之类的文件很有用
  - `Files.Glob` 用给定的shell glob模式匹配文件名返回文件列表的方法
  - `Files.Lines` 逐行读取文件内容的方法。迭代文件中每一行时很有用
  - `Files.AsSecrets` 使用Base 64编码字符串返回文件体的方法
  - `Files.AsConfig` 使用YAML格式返回文件体的方法
- `Capabilities`： 提供关于Kubernetes集群支持功能的信息
  - `Capabilities.APIVersions` 是一个版本集合
  - `Capabilities.APIVersions.Has $version` 说明集群中的版本 (e.g.,
    `batch/v1`) 或是资源 (e.g., `apps/v1/Deployment`) 是否可用
  - `Capabilities.KubeVersion` 和 `Capabilities.KubeVersion.Version` 是Kubernetes的版本号
  - `Capabilities.KubeVersion.Major` Kubernetes的主版本
  - `Capabilities.KubeVersion.Minor` Kubernetes的次版本
- `Template`： 包含了已经被执行的当前模板信息
  - `Template.Name`: 当前模板的命名空间文件路径 (e.g. `mychart/templates/mytemplate.yaml`)
  - `Template.BasePath`: 当前chart模板目录的路径 (e.g. `mychart/templates`)

&emsp;&emsp;内置的值都是以大写字母开始。 这是符合Go的命名惯例。当你创建自己的名称时，可以按照团队约定自由设置。
就像 [Kubernetes Charts](https://github.com/helm/charts) 团队，选择使用首字母小写与内置对象区分开，本指南中我们遵循该惯例。
