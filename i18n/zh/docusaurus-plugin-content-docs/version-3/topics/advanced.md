---
title: Helm 高级技术
description: 为 Helm 高级用户说明各种高级特性
sidebar_position: 9
---

本节介绍使用 Helm 的各种高级特性和技术。这些内容主要面向希望对 chart 和 release 进行高度自定义和操作的 Helm 高级用户。每个高级特性都有各自的权衡利弊，因此使用时需要具备深厚的 Helm 知识并谨慎操作。换言之，请谨记 [Peter Parker 原则](https://en.wikipedia.org/wiki/With_great_power_comes_great_responsibility)。

## 后置渲染 {#post-rendering}

后置渲染允许 chart 安装者在 Helm 安装渲染后的 manifest 之前，手动操作、配置或验证这些 manifest。这使得有高级配置需求的用户可以使用 [`kustomize`](https://kustomize.io) 等工具来应用配置更改，而无需 fork 公共 chart 或要求 chart 维护者为软件指定所有配置选项。此外，还有一些场景用于在企业环境中注入常用工具和 sidecar，或在部署前对 manifest 进行分析。

### 前提条件

- Helm 3.1+

### 使用

后置渲染器可以是任意可执行文件，只要能在 STDIN 接收渲染后的 Kubernetes manifest 并在 STDOUT 返回有效的 Kubernetes manifest 即可。遇到失败时应返回非零退出码。这是两个组件之间唯一的"API"，为后置渲染过程提供了极大的灵活性。

后置渲染器可以与 `install`、`upgrade` 和 `template` 命令一起使用。使用后置渲染器时，通过 `--post-renderer` 参数指定渲染器可执行文件的路径：

```shell
$ helm install mychart stable/wordpress --post-renderer ./path/to/executable
```

如果路径中不包含任何分隔符，会在 $PATH 中搜索；否则会将相对路径解析为完整路径。

如果需要使用多个后置渲染器，可以在脚本中调用它们，或者在构建的二进制工具中组合调用。在 bash 中，只需像 `renderer1 | renderer2 | renderer3` 这样简单地串联即可。

可以在[这里](https://github.com/thomastaylor312/advanced-helm-demos/tree/master/post-render)查看使用 `kustomize` 作为后置渲染器的示例。

### 注意事项

使用后置渲染器时，有几点需要注意。最重要的是，当使用后置渲染器时，所有修改该 release 的人**必须**使用相同的渲染器，以确保构建的可重复性。此功能允许用户切换或停止使用渲染器，但应谨慎操作，以避免意外修改或数据丢失。

另一个重要注意事项是安全性。如果你使用后置渲染器，应确保它来自可信来源（任何可执行文件都应如此）。不建议使用不受信任或未经验证的渲染器，因为它们可以完全访问渲染后的模板，而这些模板通常包含敏感数据。

### 自定义后置渲染器

在 Go SDK 中使用时，后置渲染器可以提供更大的灵活性。任何后置渲染器只需实现以下 Go 接口：

```go
type PostRenderer interface {
    // Run expects a single buffer filled with Helm rendered manifests. It
    // expects the modified results to be returned on a separate buffer or an
    // error if there was an issue or failure while running the post render step
    Run(renderedManifests *bytes.Buffer) (modifiedManifests *bytes.Buffer, err error)
}
```

有关 Go SDK 的更多信息，请参阅 [Go SDK 部分](#go-sdk)。

## Go SDK

Helm 3 引入了全新重构的 Go SDK，为构建基于 Helm 的软件和工具提供更好的体验。完整文档可在 [Go SDK 部分](/zh/docs/sdk/gosdk/)查看。

## 后端存储 {#storage-backends}

Helm 3 将默认的 release 信息存储方式更改为存储在 release 所在命名空间中的 Secret。Helm 2 默认将 release 信息作为 ConfigMap 存储在 Tiller 实例所在的命名空间中。以下小节介绍如何配置不同的存储后端。配置基于 `HELM_DRIVER` 环境变量，可设置为以下值之一：`[configmap, secret, sql]`。

### ConfigMap 后端存储

要启用 ConfigMap 后端，需要将环境变量 `HELM_DRIVER` 设置为 `configmap`。

可以在 shell 中如下设置：

```shell
export HELM_DRIVER=configmap
```

如果要从默认后端切换到 ConfigMap 后端，需要自行进行迁移。可以使用以下命令获取 release 信息：

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```

**生产环境说明**：release 信息包含 chart 和 values 文件的内容，因此可能包含需要防止未授权访问的敏感数据（如密码、私钥和其他凭证）。在管理 Kubernetes 授权时（例如使用 [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)），可能会授予 ConfigMap 资源较宽泛的访问权限，同时限制对 Secret 资源的访问。例如，默认的[面向用户的角色](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)"view"授予大多数资源的访问权限，但不包括 Secret。此外，Secret 数据可以配置为[加密存储](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)。如果决定切换到 ConfigMap 后端，请注意这一点，因为它可能会暴露应用程序的敏感数据。

### SQL 后端存储

这是一个 ***beta*** 版本的 SQL 存储后端，将 release 信息存储在 SQL 数据库中。

如果 release 信息超过 1MB，这种存储后端会特别有用（此时由于 Kubernetes 底层 etcd 键值存储的内部限制，无法存储在 ConfigMap/Secret 中）。

要启用 SQL 后端，需要部署 SQL 数据库并将环境变量 `HELM_DRIVER` 设置为 `sql`。数据库详细信息通过环境变量 `HELM_DRIVER_SQL_CONNECTION_STRING` 设置。

可以在 shell 中如下设置：

```shell
export HELM_DRIVER=sql
export HELM_DRIVER_SQL_CONNECTION_STRING=postgresql://helm-postgres:5432/helm?user=helm&password=changeme
```

> 注意：目前仅支持 PostgreSQL。

**生产环境说明**：建议：
- 确保数据库可用于生产环境。对于 PostgreSQL，请参阅 [Server Administration](https://www.postgresql.org/docs/12/admin.html) 文档了解更多详情
- 启用[权限管理](/zh/docs/topics/permissions_sql_storage_backend/)，以镜像 Kubernetes RBAC 来控制 release 信息的访问权限

如果要从默认后端切换到 SQL 后端，需要自行进行迁移。可以使用以下命令获取 release 信息：

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```
