---
title: 基于角色的访问控制
description: 解释Helm如何与Kubernetes基于角色的访问控制交互。
sidebar_position: 11
---

在Kubernetes中，向用户或应用程序特定的服务账户授予角色是确保你的应用程序在指定范围运行的最佳实践。
有关服务账户权限的更多信息请查看[官方Kubernetes文档](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#service-account-permissions)。

从Kubernetes 1.6开始，基于角色的访问控制默认是启用的。RBAC允许你根据你组织中的用户和角色指定行为类型。

有了RBAC，您可以：

- 授权特殊操作 (创建集群范围内的资源，比如新角色) 给管理员
- 限制用户在指定命名空间创建资源的能力 (pod，持久卷，工作负载)，或者是集群范围内(资源配额，角色，自定义资源)
- 限制用户在特定命名空间或集群范围内查看资源的能力

该指南适用于希望限制用户与Kubernetes API交互范围的管理员。

## 管理用户账户

所有的Kubernetes集群有两类用户：Kubernetes管理的服务账户和普通用户。

普通用户被认为是有外部独立的服务管理。一个管理员分发私钥，用户的Keystone或者Google账户，甚至用户名密码列表的文件。
在这方面，Kubernetes没有表示普通用户账户的对象。普通用户无法通过API调用添加到集群中。

相反，服务账户是由Kubernetes API管理的账户。被绑定到指定的命名空间，且有API服务或手动调用API自动创建。
服务账户绑定到了一组作为密钥存储的凭据。它们被挂载到pod中，允许集群内进程与Kubernetes API交互。

API请求被绑定到了普通用户或者服务账户，或者被视作匿名请求。意味着集群内或外部的每个来自人类用户使用`kubectl`的进程，
到node的kubelet，或到control plane的成员，向API server 发送请求时必须进行身份验证。否则被视为匿名用户。

## 角色，集群角色，角色绑定，及集群角色绑定

在Kubernetes中，用户账户和服务账户只能查看和编辑允许他们访问的资源。通过使用角色和角色绑定授予访问权限。
角色和角色绑定是绑定在特定的命名空间，授予用户查看和/或编辑角色提供访问的命名空间的资源。

在集群范围内，称为集群角色和集群角色绑定。授予用户集群角色则允许他们有查看和编辑整个集群资源的权限。同样也需要查看和编辑
集群范围的资源（命名空间，资源配额，节点）。

集群角色可以通过角色绑定中引用被绑定到一个特定的命名空间，通常以这种方式使用管理`admin`，编辑`edit`和查看`view`默认的集群角色。

有一些集群中默认可用的集群角色。旨在成为面向用户的角色。包括超级用户角色(`cluster-admin`)， 以及具有更细粒度访问权限的角色 (`admin`,
`edit`,`view`)。

| 默认集群角色 | 默认集群角色绑定 | 描述
|---------------------|----------------------------|-------------
| `cluster-admin`     | `system:masters` group     | 允许超级用户访问任意资源并执行任意操作。在集群角色绑定中使用时，它提供了对集群和所有命名空间中的每个资源的完全控制。在角色绑定中使用时，提供了对角色绑定的命名空间的每个资源完全控制，包括命名空间本身。
| `admin`             | None                       | 允许管理员访问，旨在使用角色绑定在命名空间中授权。如果使用一个角色绑定，允许对命名空间中的大部分资源进行读、写，包括在命名空间中创建角色和角色绑定。不允许对资源配额或命名空间本身进行写操作。
| `edit`              | None                       | 允许对命名空间中大部分的对象进行读写。不允许查看或修改角色或角色绑定。
| `view`              | None                       | 允许对命名空间中大部分的对象进行读操作。不允许查看角色或角色绑定。由于密钥需要升级查看，所以不允许该角色查看。

## 使用RBAC限制用户账户的访问

现在我们明白了基本的基于角色的访问控制，让我们讨论一下管理员如何限制用户的访问范围。

### 示例：授权用户特定命名空间的读写操作

限制用户访问特定的命名空间，可以使用`edit`或`admin`角色。如果你的chart是用角色或角色绑定创建或交互，应该使用`admin`集群角色。

另外，也可以用`cluster-admin`创建个角色绑定。授予用户命名空间范围内的`cluster-admin`操作，提供了命名空间内每个资源的完全访问，包括命名空间本身。

对于这个示例，我们可以使用`edit`角色创建一个用户。首先，创建一个命名空间：

```console
$ kubectl create namespace foo
```

现在在命名空间中创建一个角色绑定，授予用户 `edit` 角色。

```console
$ kubectl create rolebinding sam-edit
    --clusterrole edit \​
    --user sam \​
    --namespace foo
```

### 示例：授予用户集群范围内的读写操作

如果用户希望安装一个chart来安装集群范围的资源（命名空间，角色，自定义资源等等），则需要集群范围的写操作。

这样需要授予用户`admin`或者`cluster-admin`权限。

授予用户`cluster-admin`访问权限允许他们访问Kubernetes的所有可用资源，包括使用`kubectl drain`访问节点和其他管理员任务。
强烈推荐考虑用`admin`权限代替，或者创建一个量身定做的自定义集群角色。

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

### 示例：授予用户特定命名空间的只读权限

你可能已经留意到没有查看密钥的集群角色。处于升级的考虑，`view`集群角色不允许用户读取密钥。Helm默认将版本元数据作为密钥存储。

为了用户可以运行`helm list`，他们需要读取这些密钥。为此我们创建一个特殊的 `secret-reader` 集群角色。

创建 `cluster-role-secret-reader.yaml`文件并写入以下内容：

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

然后创建集群角色使用：

```console
$ kubectl create -f clusterrole-secret-reader.yaml​
```

创建完成之后，我们就可以授予一个用户大多数资源的读权限，然后授予他们读取密钥的权限：

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

在某些情况下，授予用户集群范围的访问权限是有益的。比如，如果一个用户想运行 `helm list --all-namespaces`，
API需要用户有集群范围的访问权限。

授予用户上述的 `view` 和 `secret-reader`访问权限，但使用集群角色绑定。

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

## 其他想法

上述示例使用了Kubernetes提供的默认集群角色。The examples shown above utilize the default ClusterRoles provided with
Kubernetes. 对用户授予更细粒度的资源访问权限，请查看创建自定义的角色和集群角色的[Kubernetes
文档](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)。
