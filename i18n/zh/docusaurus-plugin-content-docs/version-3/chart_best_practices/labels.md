---
title: 标签和注释
description: 介绍在 chart 中使用标签和注释的最佳实践。
sidebar_position: 5
---

最佳实践指南的这部分介绍在 chart 中使用标签和注释的最佳实践。

## 是标签还是注释？

满足以下条件时，元数据项应该使用标签：

- Kubernetes 用它来识别资源
- 便于运维人员查询系统

例如，建议使用 `helm.sh/chart: NAME-VERSION` 作为标签，这样运维人员可以方便地找到特定 chart 的所有实例。

如果元数据不用于查询，应该设置为注释。

Helm hook 始终是注释。

## 标准标签

下表定义了 Helm chart 使用的通用标签。Helm 本身不强制要求任何特定标签。标记为 REC 的是推荐标签，**应该** 添加到 chart 中以保持全局一致性。标记为 OPT 的是可选标签，虽然常用且符合惯例，但在实际操作中并不经常依赖。

名称|状态|描述
----|----|----
`app.kubernetes.io/name` | REC | 应用名称，反映整个应用。通常使用 `{{ template "name" . }}`。许多 Kubernetes 清单会使用这个标签，它不是 Helm 特有的。
`helm.sh/chart` | REC | chart 的名称和版本：`{{ .Chart.Name }}-{{ .Chart.Version \| replace "+" "_" }}`。
`app.kubernetes.io/managed-by` | REC | 应始终设置为 `{{ .Release.Service }}`。用于查找所有由 Helm 管理的资源。
`app.kubernetes.io/instance` | REC | 应设置为 `{{ .Release.Name }}`。有助于区分同一应用的不同实例。
`app.kubernetes.io/version` | OPT | 应用版本，可设置为 `{{ .Chart.AppVersion }}`。
`app.kubernetes.io/component` | OPT | 用于标记组件在应用中扮演的角色。例如 `app.kubernetes.io/component: frontend`。
`app.kubernetes.io/part-of` | OPT | 当多个 chart 或软件组合成一个应用时使用。例如，应用程序和数据库共同构建一个网站。可设置为顶层支撑应用。

关于以 `app.kubernetes.io` 为前缀的 Kubernetes 标签的更多信息，请参阅 [Kubernetes 文档](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/)。
