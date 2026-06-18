---
title: 使用基于 OCI 的注册中心
description: 描述如何使用 OCI 进行 chart 的分发。
sidebar_position: 7
---

从 Helm 3 开始，可以使用具有 [OCI](https://www.opencontainers.org/)支持的容器注册中心来存储和共享 chart 包。从 Helm v3.8.0 开始，默认启用 OCI 支持。

## v3.8.0 版本之前对 OCI 的支持

OCI 支持在 Helm v3.8.0 版本从试验阶段过渡成为普遍可用。在之前版本中，OCI 支持会有不同的地方。如果你在 v3.8.0 之前的版本使用 OCI，需要着重了解不同Helm 版本之间 OCI 的变化。

### 在 v3.8.0 之前的版本启用 OCI 支持

Helm v3.8.0 版本之前，OCI 支持是*试验性*的且必须显式启用。

为了在之前版本中启用 OCI 试验性支持，需要在环境变量中设置 `HELM_EXPERIMENTAL_OCI`，例如：

```console
export HELM_EXPERIMENTAL_OCI=1
```

### OCI 在 v3.8.0 中的弃用和行为变化

[Helm v3.8.0](https://github.com/helm/helm/releases/tag/v3.8.0) 版本中，以下行为和特性与之前版本不同：

- 在依赖中将 chart 设置为 OCI 时，版本号可以像其他依赖一样设置成范围。
- 包含构建信息的SemVer tag 可以被推送和使用。OCI 注册中心的 tag 字符不支持 `+`。如果有，Helm 会将 `+` 转成 `_`。
- `helm registry login` 命令现在采用与 Docker CLI 相同的结构存储凭证。Helm 和 Docker CLI 的注册表配置使用一样的路径。

### OCI 在 v3.7.0 中的弃用和行为变化

[Helm v3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0) 版本包含了针对支持 OCI 的 [HIP 6](https://github.com/helm/community/blob/main/hips/hip-0006.md) 实现方案。因此以下行为和特性与之前版本不同：

- 移除了 `helm chart` 子命令。
- 移除了 chart 缓存（没有了 `helm chart list` 等等）。
- OCI 注册引用现在需要以 `oci://` 开头。
- 注册引用的基础名称*必须*和 chart 名称匹配。
- 注册引用的tag*必须*和 chart 的语义版本匹配（比如没有 `latest` 这种 tag）。
- chart 层的媒体类型从 `application/tar+gzip`转换成了 `application/vnd.cncf.helm.chart.content.v1.tar+gzip`。

## 使用基于 OCI 的注册中心

### 基于 OCI 注册中心的 Helm 仓库

[Helm 仓库](./chart_repository.md)是一种制作和分发打包好的 Helm chart 的方式。基于 OCI 的注册中心包含零个或多个 Helm 仓库，且每个都会有零个或多个 Helm chart。

### 使用托管的注册中心

以下是几种 chart 可以使用的托管容器注册中心，都支持 OCI，例如：

- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-helm-repos#push-chart-to-registry-as-oci-artifact)
- [Cloudsmith](https://help.cloudsmith.io/docs/oci-repository)
- [Docker Hub](https://docs.docker.com/docker-hub/oci-artifacts/)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/helm/manage-charts)
- [Harbor](https://goharbor.io/docs/main/administration/user-defined-oci-artifact/)
- [IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_helm_charts)
- [JFrog Artifactory](https://jfrog.com/help/r/jfrog-artifactory-documentation/helm-oci-repositories)
- [RepoFlow](https://docs.repoflow.io/PackageTypes/helm#oci-helm-support)

参照托管平台提供的文档来创建和配置支持 OCI 的注册中心。

**注意：** 你可以在开发电脑上运行基于 OCI 的注册中心 [Docker Registry](https://docs.docker.com/registry/deploying/) 或者 [`zot`](https://github.com/project-zot/zot)。在开发电脑上运行只能用于测试目的。

### 使用 sigstore 签名基于 OCI 的 chart

[`helm-sigstore`](https://github.com/sigstore/helm-sigstore) 插件支持使用 [Sigstore](https://sigstore.dev/) 签名 Helm chart，与签名容器镜像使用相同的工具。这为经典 [chart 仓库](./chart_repository.md)支持的[基于 GPG 的来源验证](./provenance.md)提供了替代方案。

有关 `helm sigstore` 插件的详细用法，请参阅[该项目的文档](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md)。

## 用于处理注册中心的命令

### `registry` 子命令

#### `login`

登录到注册中心 (手动输入密码)

```console
$ helm registry login -u myuser localhost:5000
Password:
Login succeeded
```

#### `logout`

从注册中心注销

```console
$ helm registry logout localhost:5000
Logout succeeded
```

### `push` 子命令

上传 chart 到基于 OCI 的注册中心：

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

`push` 子命令只能用于 `helm package` 提前创建的 `.tgz` 文件。

使用 `helm push` 上传 chart 到 OCI 注册表时，引用必须以 `oci://` 开头，且不能包含基础名称或 tag。

注册表引用的基础名称由 chart 名称推断而来，tag 由 chart 语义版本推断而来。这是强制要求。

某些注册表（如果指定）要求事先创建仓库或者命名空间，或者两者都需要创建。否则，`helm push` 会出现错误。

如果你已经创建了[来源文件](./provenance.md)（`.prov`），且与 `.tgz` 文件位于同一目录下，该文件会在 `push` 时自动上传到注册表，并在 [Helm chart manifest](#helm-chart-manifest) 中生成一个额外的层。

[helm-push plugin](https://github.com/chartmuseum/helm-push) 用户（用于上传 chart 到 [ChartMuseum](./chart_repository.md#chartmuseum-repository-server)）可能会遇到问题，因为该插件与内置的新 `push` 命令有冲突。从 v0.10.0 版本开始，该插件已更名为 `cm-push`。

### 其他命令

对 `oci://` 协议的支持同样适用于很多其他子命令。以下是完整列表：

- `helm pull`
- `helm push`
- `helm show`
- `helm template`
- `helm install`
- `helm upgrade`

注册表的基础名称（chart name）*包含*了涉及 chart 下载的任意类型的操作（相对于 `helm push` 被省略的位置）。

下面是一些基于 OCI 的 chart 使用上述子命令的示例：

```console
$ helm pull oci://localhost:5000/helm-charts/mychart --version 0.1.0
Pulled: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:0be7ec9fb7b962b46d81e4bb74fdcdb7089d965d3baca9f85d64948b05b402ff

$ helm show all oci://localhost:5000/helm-charts/mychart --version 0.1.0
apiVersion: v2
appVersion: 1.16.0
description: A Helm chart for Kubernetes
name: mychart
...

$ helm template myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
---
# Source: mychart/templates/serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
...

$ helm install myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...

$ helm upgrade myrelease oci://localhost:5000/helm-charts/mychart --version 0.2.0
Release "myrelease" has been upgraded. Happy Helming!
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:12:05 2021
NAMESPACE: default
STATUS: deployed
REVISION: 2
NOTES:
...
```

## 使用摘要安装 chart

使用摘要安装 chart 比使用 tag 更安全，因为摘要是不可变的。摘要在 chart URI 中指定：

```
$ helm install myrelease oci://localhost:5000/helm-charts/mychart@sha256:52ccaee6d4dd272e54bfccda77738b42e1edf0e4a20c27e23f0b6c15d01aef79
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...
```

## 指定依赖项

chart 的依赖项可以从注册中心拉取，使用 `dependency update` 命令。

`Chart.yaml` 中给定的 `repository` 被指定为不含基础名称的注册表引用：

```yaml
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```

执行 `dependency update` 时会获取 `oci://localhost:5000/myrepo/mychart:2.7.0`。

## Helm chart manifest

以下是在注册表中表示的 Helm chart manifest 示例（注意 `mediaType` 字段）：

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    }
  ]
}
```

下面的示例包含一个[来源文件](./provenance.md)（注意额外层）：

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    },
    {
      "mediaType": "application/vnd.cncf.helm.chart.provenance.v1.prov",
      "digest": "sha256:3e207b409db364b595ba862cdc12be96dcdad8e36c59a03b7b3b61c946a5741a",
      "size": 643
    }
  ]
}
```

## 从 chart 仓库迁移

从经典 [chart 仓库](./chart_repository.md)（基于 index.yaml）的迁移非常简单，只需使用 `helm pull` 拉取 chart，然后使用 `helm push` 上传生成的 `.tgz` 文件到注册表即可。
