---
title: pod和pod模板
description: 讨论在chart清单中格式化Pod和Pod模板部分
sidebar_position: 6
---

最佳实践的这部分讨论在chart清单中格式化Pod和Pod模板部分。

以下（非详尽的）资源列表使用Pod模板：

- Deployment
- ReplicationController
- ReplicaSet
- DaemonSet
- StatefulSet

## 镜像

容器镜像应该使用固定的tag或镜像SHA。不应该使用`latest`, `head`, `canary`等标签或其他被设计为“浮动的”标签。

镜像 _可以_ 被定义在 `values.yaml` 文件中是的切换镜像更加容易。

```yaml
image: {{ .Values.redisImage | quote }}
```

镜像和tag _可以_ 在 `values.yaml`中定义为两个独立的字段：

```yaml
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

## 镜像拉取策略

`helm create` 通过以下方式在`deployment.yaml`中将 `imagePullPolicy` 默认设置为 `IfNotPresent`：

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

以及`values.yaml`:

```yaml
image:
  pullPolicy: IfNotPresent
```

类似地，如果Kubernetes根本没有定义，默认会将 `imagePullPolicy` 设置为 `IfNotPresent`。
如果想设置一个值而不是 `IfNotPresent`，只需在 `values.yaml` 中更新为需要的值即可。

## Pod模板应该声明选择器

所有的Pod模板部分应该指定一个selector。比如：

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

这是一个很好的实践，因为它建立了集合和pod之间的关系。

但这一点对于像工作负载这样的集合来说更加重要。如果没有，标签的 _所有_
集合会选择匹配pod，如果你使用了改变的标签，比如版本和发布日期，这个功能会失效。
