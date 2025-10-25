---
title: 基于角色的访问控制
description: 讨论在chart清单中创建和格式化RBAC资源。
sidebar_position: 8
---

最佳实践的这部分讨论在chart清单中创建和格式化RBAC资源。

RBAC 资源有：

- ServiceAccount (namespaced)
- Role (namespaced)
- ClusterRole
- RoleBinding (namespaced)
- ClusterRoleBinding

## YAML 配置

RBAC和服务账户配置应该使用独立的key。它们是独立的内容。在YAML中将这两个概念分开可以消除歧义使其更加清晰。

```yaml
rbac:
  # Specifies whether RBAC resources should be created
  create: true

serviceAccount:
  # Specifies whether a ServiceAccount should be created
  create: true
  # The name of the ServiceAccount to use.
  # If not set and create is true, a name is generated using the fullname template
  name:
```

这个结构可以在更加复杂的需要多个服务账户的chart中扩展。

```yaml
someComponent:
  serviceAccount:
    create: true
    name:
anotherComponent:
  serviceAccount:
    create: true
    name:
```

## RBAC 资源应该默认创建

`rbac.create` 应该是布尔值，用于控制RBAC资源是否被创建。默认是 `true`。用户想自己管理RBAC访问控制时可以设置为`false`
(示例如下)。

## 使用RBAC资源

`serviceAccount.name` 要设置为由chart创建的访问控制资源的ServiceAccount的名称。
如果`serviceAccount.create`是true，则使用该名称的ServiceAccount会被创建。如果没有设置名称，
则会使用`fullname`模板生成一个名称。如果`serviceAccount.create`是false，则不会被创建，但仍然会与相同的资源关联，
以便后续手动创建的引用它的RBAC资源可以正常工作。如果`serviceAccount.create`是false且没有指定名称，
会使用默认的ServiceAccount。

以下辅助模板应用于ServiceAccount。

```yaml
{{/*
Create the name of the service account to use
*/}}
{{- define "mychart.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "mychart.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}
```
