---
title: 标签和注释
description: 涵盖了在chart中使用标签和注释的最佳实践。
sidebar_position: 5
---

最佳实践的这部分讨论关于在chart中使用标签和注释的最佳方式。

## 是标签还是注释？

在以下条件下，元数据项应该是标签：

- Kubernetes使用它来识别这种资源
- 为了查询系统，暴露给操作员会很有用

比如，我们建议使用 `helm.sh/chart: NAME-VERSION` 作为标签，以便操作员可以找到特定chart的所有实例。

如果元数据项不是用于查询，就应该设置为注释。

Helm钩子都是注释。

## 标准标签

以下表格定义了Helm chart使用的通用标签。Helm本身从不要求出现特定标签。标记为REC的是推荐标签。且 _应该_ 放置在chart之上保持全局一致性。
标记为OPT的是可选的。 这些是惯用的和常用的，但操作时并不经常依赖。

名称| 状态 | 描述
-----|-------|----------
`app.kubernetes.io/name` | REC | app名称，反应整个app。`{{ template "name" . }}`经常用于此。很多Kubernetes清单会使用这个，但不是Helm指定的。
`helm.sh/chart` | REC | chart的名称和版本： `{{ .Chart.Name }}-{{ .Chart.Version \| replace "+" "_" }}`。
`app.kubernetes.io/managed-by` | REC | 此值应始终设置为 `{{ .Release.Service }}`。 用来查找被Helm管理的所有内容。
`app.kubernetes.io/instance` | REC | 这个应该是`{{ .Release.Name }}`。 有助于在同一应用程序中区分不同的实例。
`app.kubernetes.io/version` | OPT | app的版本，且被设置为 `{{ .Chart.AppVersion }}`.
`app.kubernetes.io/component` | OPT | 这是通用标签，用于标记块在应用程序中可能扮演的不同角色。比如 `app.kubernetes.io/component: frontend`。
`app.kubernetes.io/part-of` | OPT | 当多个chart或块用于构建一个应用程序时。比如，应用软件和数据库生成一个网站。这可以设置为受支持的顶级应用程序。

你可以在[Kubernetes documentation](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/)找到更多
`app.kubernetes.io`作为前缀的Kubernetes标签。
