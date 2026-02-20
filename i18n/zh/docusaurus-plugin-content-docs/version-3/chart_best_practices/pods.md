---
title: Pod 和 PodTemplate
description: 讨论在 chart 清单中格式化 Pod 和 PodTemplate 部分。
sidebar_position: 6
---

最佳实践指南的这部分讨论在 chart 清单中格式化 Pod 和 PodTemplate 部分。

以下（非详尽的）资源列表使用 PodTemplate：

- Deployment
- ReplicationController
- ReplicaSet
- DaemonSet
- StatefulSet

## 镜像

容器镜像应该使用固定的 tag 或镜像的 SHA。不应该使用 `latest`、`head`、`canary` 等标签或其他被设计为"浮动的"标签。

镜像**可以**定义在 `values.yaml` 文件中，便于切换镜像。

```yaml
image: {{ .Values.redisImage | quote }}
```

镜像和 tag **可以**在 `values.yaml` 中定义为两个独立的字段：

```yaml
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

## 镜像拉取策略

`helm create` 通过以下方式在 `deployment.yaml` 中将 `imagePullPolicy` 默认设置为 `IfNotPresent`：

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

以及 `values.yaml`：

```yaml
image:
  pullPolicy: IfNotPresent
```

类似地，如果 Kubernetes 根本没有定义，默认会将 `imagePullPolicy` 设置为 `IfNotPresent`。如果想设置一个值而不是 `IfNotPresent`，只需在 `values.yaml` 中更新为需要的值即可。

## PodTemplate 应该声明选择器

所有的 PodTemplate 部分应该指定一个 selector。例如：

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

这是一个很好的实践，因为它建立了资源集合和 Pod 之间的关系。

但这一点对于 Deployment 等资源来说更加重要。如果没有指定选择器，系统会使用**所有**标签来匹配 Pod，当你使用了会变化的标签（比如版本或发布日期）时，这会导致匹配失败。
