---
title: 内置对象
description: 模板可用的内置对象
sidebar_position: 3
---

对象可以通过模板引擎传递到模板中，你的代码也可以传递对象（使用 `with` 和 `range` 语句时会看到示例）。还有几种方式可以在模板中创建新对象，比如后面会介绍的 `tuple` 函数。

对象可以是非常简单的，仅有一个值；也可以包含其他对象或方法。比如，`Release` 对象包含多个子对象（如 `Release.Name`），而 `Files` 对象则有一组方法。

在上一节中，我们用 `{{ .Release.Name }}` 在模板中插入 release 名称。`Release` 是你可以在模板中访问的顶层对象之一。

- `Release`：该对象描述 release 本身，包含以下子对象：
  - `Release.Name`：release 名称
  - `Release.Namespace`：release 的命名空间（如果 manifest 没有覆盖的话）
  - `Release.IsUpgrade`：如果当前操作是升级或回滚，该值为 `true`
  - `Release.IsInstall`：如果当前操作是安装，该值为 `true`
  - `Release.Revision`：此次修订的版本号。安装时为 1，每次升级或回滚都会自增
  - `Release.Service`：渲染当前模板的服务名称，在 Helm 中始终是 `Helm`
- `Values`：从 `values.yaml` 文件和用户提供的文件传入模板的值，默认为空。
- `Chart`：`Chart.yaml` 文件的内容。该文件中的所有数据都可以访问。例如 `{{ .Chart.Name }}-{{ .Chart.Version }}` 会输出 `mychart-0.1.0`
  - 在 [Chart 指南](/docs/topics/charts.md#the-chartyaml-file) 中列出了可用属性
- `Subcharts`：提供对子 chart 作用域（.Values、.Charts、.Releases 等）的访问。例如 `.Subcharts.mySubChart.myValue` 可以访问 `mySubChart` chart 中的 `myValue`。
- `Files`：在 chart 中提供访问所有非特殊文件的对象。你不能使用它访问模板，只能访问其他文件。请查看 [文件访问](./accessing_files.md) 部分了解更多信息。
  - `Files.Get` 通过文件名获取文件的方法（`.Files.Get config.ini`）
  - `Files.GetBytes` 以字节数组而非字符串形式获取文件内容的方法，对图片之类的文件很有用
  - `Files.Glob` 用给定的 shell glob 模式匹配文件名并返回文件列表的方法
  - `Files.Lines` 逐行读取文件内容的方法，迭代文件中每一行时很有用
  - `Files.AsSecrets` 以 Base64 编码字符串形式返回文件内容的方法
  - `Files.AsConfig` 以 YAML 格式返回文件内容的方法
- `Capabilities`：提供关于 Kubernetes 集群支持功能的信息
  - `Capabilities.APIVersions` 是一个版本集合
  - `Capabilities.APIVersions.Has $version` 表示集群中某个版本（如 `batch/v1`）或资源（如 `apps/v1/Deployment`）是否可用
  - `Capabilities.KubeVersion` 和 `Capabilities.KubeVersion.Version` 是 Kubernetes 版本号
  - `Capabilities.KubeVersion.Major` Kubernetes 主版本号
  - `Capabilities.KubeVersion.Minor` Kubernetes 次版本号
  - `Capabilities.HelmVersion` 包含 Helm 版本详细信息的对象，与 `helm version` 的输出一致
  - `Capabilities.HelmVersion.Version` 当前 Helm 版本（语义化版本格式）
  - `Capabilities.HelmVersion.GitCommit` Helm 的 git sha1 值
  - `Capabilities.HelmVersion.GitTreeState` Helm git 树的状态
  - `Capabilities.HelmVersion.GoVersion` 使用的 Go 编译器版本
- `Template`：包含当前正在执行的模板信息
  - `Template.Name`：当前模板的命名空间文件路径（例如 `mychart/templates/mytemplate.yaml`）
  - `Template.BasePath`：当前 chart 模板目录的路径（例如 `mychart/templates`）

内置对象的名称都以大写字母开头，这符合 Go 的命名惯例。当你创建自己的名称时，可以按照团队约定自由设置。就像很多你在 [Artifact Hub](https://artifacthub.io/packages/search?kind=0) 中看到的 chart，其团队选择使用首字母小写将本地名称与内置对象区分开，本指南中我们也遵循该惯例。
