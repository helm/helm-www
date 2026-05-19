---
title: 故障排查
sidebar_position: 4
---

## 故障排查

### 我收到"Unable to get an update from the "stable" chart repository"警告

运行 `helm repo list`。如果显示你的 `stable` 仓库指向 `storage.googleapis.com` URL，则需要更新该仓库。2020 年 11 月 13 日，Helm Charts 仓库经过一年的弃用期后[已停止支持](https://github.com/helm/charts#deprecation-timeline)。归档版本已在 `https://charts.helm.sh/stable` 提供，但不再接收更新。

你可以运行以下命令修复仓库：

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

`incubator` 仓库也是同样的情况，其归档版本在 https://charts.helm.sh/incubator。你可以运行以下命令修复：

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### 我收到警告 'WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.'

旧的 Google Helm chart 仓库已被新的 Helm chart 仓库替代。

运行以下命令可永久解决此问题：

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

如果 `incubator` 出现类似错误，运行以下命令：

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### 添加 Helm 仓库时收到错误 'Error: Repo "https://kubernetes-charts.storage.googleapis.com" is no longer available'

Helm Chart 仓库经过[一年的弃用期](https://github.com/helm/charts#deprecation-timeline)后已停止支持。这些仓库的归档版本在 `https://charts.helm.sh/stable` 和 `https://charts.helm.sh/incubator`，但不再接收更新。除非指定 `--use-deprecated-repos`，否则 `helm repo add` 命令不允许添加旧的 URL。

### 在 GKE（Google Container Engine）上收到 "No SSH tunnels currently open" 错误

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

错误信息的另一种形式是：

```
Unable to connect to the server: x509: certificate signed by unknown authority
```

原因是本地 Kubernetes 配置文件必须具有正确的凭据。

在 GKE 上创建集群时，会提供凭据（包括 SSL 证书和证书颁发机构）。这些信息需要存储在 Kubernetes 配置文件中（默认位置：`~/.kube/config`），以便 `kubectl` 和 `helm` 能够访问。

### 从 Helm 2 迁移后，`helm list` 只显示部分（或不显示）release

这很可能是因为 Helm 3 现在使用集群 namespace 来区分 release 的作用域。这意味着所有涉及 release 的命令必须满足以下条件之一：

* 依赖当前 Kubernetes 上下文中的活动 namespace（使用 `kubectl config view --minify` 命令可查看）
* 使用 `--namespace`/`-n` 参数指定正确的 namespace
* 对于 `helm list` 命令，指定 `--all-namespaces`/`-A` 参数

这适用于 `helm ls`、`helm uninstall` 以及所有涉及 release 的 `helm` 命令。

### 在 macOS 上访问了文件 `/etc/.mdns_debug`，这是为什么？

在 macOS 上存在一种情况：Helm 会尝试访问名为 `/etc/.mdns_debug` 的文件。如果该文件存在，Helm 会在执行期间保持文件句柄处于打开状态。

这是由 macOS 的 MDNS 库导致的。该库会尝试加载此文件以读取调试设置（如果已启用）。文件句柄可能不应该保持打开状态，此问题已报告给 Apple。但这是 macOS 的行为，而非 Helm 导致的。

如果你不希望 Helm 加载此文件，可以将 Helm 编译为不使用主机网络栈的静态库。这样做会增加 Helm 的二进制文件大小，但可以防止打开该文件。

此问题最初被标记为潜在的安全问题，但后来确定此行为不会导致任何缺陷或漏洞。

### helm repo add 失败，但以前可以正常使用

在 Helm 3.3.1 及更早版本中，如果尝试添加已存在的仓库，`helm repo add <reponame> <url>` 命令不会有任何输出。使用 `--no-update` 参数时，如果仓库已注册则会报错。

在 Helm 3.3.2 及更高版本中，尝试添加已存在的仓库会报错：

`Error: repository name (reponame) already exists, please specify a different name`

现在默认行为已更改。`--no-update` 现在被忽略，如果要替换（覆盖）已存在的仓库，可以使用 `--force-update`。

这是一项安全修复导致的破坏性更改，详见 [Helm 3.3.2 发布说明](https://github.com/helm/helm/releases/tag/v3.3.2)。

### 启用 Kubernetes 客户端日志

可以使用 [klog](https://pkg.go.dev/k8s.io/klog) 参数来启用 Kubernetes 客户端的调试日志消息输出。在大多数情况下，使用 `-v` 参数设置详细级别即可。

例如：

```
helm list -v 6
```

### Tiller 安装停止工作并且访问被拒绝

以前可以从 <https://storage.googleapis.com/kubernetes-helm/> 获取 Helm 发布版本。正如 ["Announcing get.helm.sh"](https://helm.sh/blog/get-helm-sh/) 中所述，官方地址已于 2019 年 6 月更改。[GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller) 提供了所有旧的 Tiller 镜像。

如果你尝试从过去使用的存储桶下载旧版本的 Helm，可能会发现它们已被移除：

```
<Error>
    <Code>AccessDenied</Code>
    <Message>Access denied.</Message>
    <Details>Anonymous caller does not have storage.objects.get access to the Google Cloud Storage object.</Details>
</Error>
```

[旧版 Tiller 镜像位置](https://gcr.io/kubernetes-helm/tiller)从 2021 年 8 月开始移除镜像。我们已将这些镜像托管到 [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller)。例如，要下载 v2.17.0 版本，将：

`https://storage.googleapis.com/kubernetes-helm/helm-v2.17.0-linux-amd64.tar.gz`

替换为：

`https://get.helm.sh/helm-v2.17.0-linux-amd64.tar.gz`

使用 Helm v2.17.0 初始化：

`helm init —upgrade`

或者如果需要其他版本，使用 --tiller-image 参数覆盖默认位置并安装特定的 Helm v2 版本：

`helm init --tiller-image ghcr.io/helm/tiller:v2.16.9`

**注意：** Helm 维护者建议迁移到当前支持的 Helm 版本。Helm v2.17.0 是 Helm v2 的最终版本；Helm v2 自 2020 年 11 月起不再受支持，详见 [Helm 2 和 Charts 项目不再受支持](https://helm.sh/blog/helm-2-becomes-unsupported/)。此后已标记了多个针对 Helm 的 CVE，这些漏洞已在 Helm v3 中修补，但永远不会在 Helm v2 中修补。请参阅[当前已发布的 Helm 安全公告列表](https://github.com/helm/helm/security/advisories?state=published)，并制定[迁移到 Helm v3](/topics/v2_v3_migration.md)的计划。
