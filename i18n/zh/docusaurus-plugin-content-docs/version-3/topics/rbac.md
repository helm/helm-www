---
title: 基于角色的访问控制
description: 解释 Helm 如何与 Kubernetes 基于角色的访问控制交互。
sidebar_position: 11
---

在 Kubernetes 中，向用户或应用程序特定的服务账户授予角色是确保应用程序在指定范围内运行的最佳实践。
有关服务账户权限的更多信息，请查看[官方 Kubernetes 文档](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#service-account-permissions)。

从 Kubernetes 1.6 开始，基于角色的访问控制默认是启用的。RBAC 允许你根据组织中的用户及其角色来指定允许的操作类型。

有了 RBAC，你可以：

- 授权特殊操作（创建集群范围内的资源，比如新角色）给管理员
- 限制用户在指定命名空间创建资源的能力（Pod、持久卷、Deployment），或者在集群范围内创建资源的能力（资源配额、角色、自定义资源定义）
- 限制用户在特定命名空间或集群范围内查看资源的能力

本指南适用于希望限制用户与 Kubernetes API 交互范围的管理员。

## 管理用户账户

所有 Kubernetes 集群有两类用户：Kubernetes 管理的服务账户和普通用户。

普通用户被认为是由外部独立服务管理的，例如管理员分发私钥、Keystone 或 Google 账户等用户存储、甚至是包含用户名和密码列表的文件。
在这方面，Kubernetes 没有表示普通用户账户的对象。普通用户无法通过 API 调用添加到集群中。

相反，服务账户是由 Kubernetes API 管理的用户。它们被绑定到指定的命名空间，并由 API 服务器自动创建或通过 API 调用手动创建。
服务账户绑定到一组作为 Secret 存储的凭据。这些凭据被挂载到 Pod 中，允许集群内进程与 Kubernetes API 交互。

API 请求要么绑定到普通用户或服务账户，要么被视为匿名请求。这意味着集群内或外部的每个进程——从人类用户在工作站上使用 `kubectl`，
到节点上的 kubelet，再到控制平面的成员——向 API 服务器发送请求时都必须进行身份验证，否则被视为匿名用户。

## Role、ClusterRole、RoleBinding 和 ClusterRoleBinding

在 Kubernetes 中，用户账户和服务账户只能查看和编辑被授权访问的资源。访问权限通过 Role 和 RoleBinding 授予。
Role 和 RoleBinding 绑定到特定的命名空间，授予用户查看和/或编辑该命名空间中 Role 允许访问的资源的能力。

在集群范围内，它们被称为 ClusterRole 和 ClusterRoleBinding。授予用户 ClusterRole 后，用户可以查看和/或编辑整个集群的资源。
查看和/或编辑集群范围的资源（命名空间、资源配额、节点）也需要 ClusterRole。

ClusterRole 可以通过在 RoleBinding 中引用来绑定到特定的命名空间。`admin`、`edit` 和 `view` 这些默认 ClusterRole 通常以这种方式使用。

Kubernetes 默认提供了一些 ClusterRole，它们旨在成为面向用户的角色。包括超级用户角色（`cluster-admin`）以及具有更细粒度访问权限的角色（`admin`、`edit`、`view`）。

| 默认 ClusterRole | 默认 ClusterRoleBinding | 描述
|---------------------|----------------------------|-------------
| `cluster-admin`     | `system:masters` group     | 允许超级用户访问任意资源并执行任意操作。在 ClusterRoleBinding 中使用时，它提供对集群和所有命名空间中每个资源的完全控制。在 RoleBinding 中使用时，提供对该 RoleBinding 所在命名空间中每个资源的完全控制，包括命名空间本身。
| `admin`             | 无                       | 允许管理员访问，旨在使用 RoleBinding 在命名空间中授权。如果在 RoleBinding 中使用，允许对命名空间中的大部分资源进行读写，包括在命名空间中创建 Role 和 RoleBinding。不允许对资源配额或命名空间本身进行写操作。
| `edit`              | 无                       | 允许对命名空间中大部分对象进行读写。不允许查看或修改 Role 或 RoleBinding。
| `view`              | 无                       | 允许对命名空间中大部分对象进行只读访问。不允许查看 Role 或 RoleBinding。由于存在权限升级风险，也不允许查看 Secret。

## 使用 RBAC 限制用户账户的访问

现在我们了解了基于角色的访问控制的基础知识，让我们讨论一下管理员如何限制用户的访问范围。

### 示例：授予用户特定命名空间的读写权限

要限制用户访问特定的命名空间，可以使用 `edit` 或 `admin` 角色。如果你的 chart 创建或使用 Role 和 RoleBinding，应该使用 `admin` ClusterRole。

另外，也可以使用 `cluster-admin` 访问权限创建 RoleBinding。在命名空间范围内授予用户 `cluster-admin` 访问权限，可以提供对该命名空间内每个资源的完全控制，包括命名空间本身。

在这个示例中，我们将使用 `edit` Role 创建一个用户。首先，创建一个命名空间：

```console
$ kubectl create namespace foo
```

现在在该命名空间中创建一个 RoleBinding，授予用户 `edit` 角色。

```console
$ kubectl create rolebinding sam-edit
    --clusterrole edit \​
    --user sam \​
    --namespace foo
```

### 示例：授予用户集群范围内的读写权限

如果用户希望安装一个包含集群范围资源（命名空间、角色、自定义资源定义等）的 chart，则需要集群范围的写权限。

这需要授予用户 `admin` 或 `cluster-admin` 访问权限。

授予用户 `cluster-admin` 访问权限意味着他们可以访问 Kubernetes 中所有可用的资源，包括使用 `kubectl drain` 访问节点以及执行其他管理任务。
强烈建议考虑使用 `admin` 权限代替，或者创建一个针对其需求量身定制的自定义 ClusterRole。

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

### 示例：授予用户特定命名空间的只读权限

你可能已经注意到没有用于查看 Secret 的 ClusterRole。出于权限升级的考虑，`view` ClusterRole 不允许用户读取 Secret。Helm 默认将 release 元数据存储为 Secret。

为了让用户可以运行 `helm list`，他们需要能够读取这些 Secret。为此，我们需要创建一个特殊的 `secret-reader` ClusterRole。

创建 `cluster-role-secret-reader.yaml` 文件并写入以下内容：

```yaml
apiVersion: rbac.authorization.k8s.io/v1​
kind: ClusterRole​
metadata:​
  name: secret-reader​
rules:​
- apiGroups: [""]​
  resources: ["secrets"]​
  verbs: ["get", "watch", "list"]
```

然后使用以下命令创建该 ClusterRole：

```console
$ kubectl create -f clusterrole-secret-reader.yaml​
```

完成后，我们可以授予用户对大多数资源的读权限，然后再授予他们读取 Secret 的权限：

```console
$ kubectl create namespace foo

$ kubectl create rolebinding sam-view
    --clusterrole view \​
    --user sam \​
    --namespace foo

$ kubectl create rolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam \​
    --namespace foo
```

### 示例：授予用户集群范围的只读权限

在某些情况下，授予用户集群范围的访问权限是有益的。例如，如果用户想运行 `helm list --all-namespaces`，
API 需要用户具有集群范围的读权限。

可以按照上述方式授予用户 `view` 和 `secret-reader` 访问权限，但使用 ClusterRoleBinding。

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

## 其他说明

上述示例使用了 Kubernetes 提供的默认 ClusterRole。如需对用户授予更细粒度的资源访问控制，请查看 [Kubernetes 文档](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)了解如何创建自定义的 Role 和 ClusterRole。
