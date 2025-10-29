---
title: 使用基于OCI的注册中心
description: 描述如何使用 OCI 进行Chart的分发。
sidebar_position: 7
---

从Helm 3开始，可以使用具有[OCI](https://www.opencontainers.org/)支持的容器注册中心来存储和共享chart包。从Helm v3.8.0开始，默认启用OCI支持。

## v3.8.0版本之前对 OCI 的支持

OCI 支持在Helm v3.8.0版本从试验阶段过渡成为普遍可用。在之前版本中，对OCI支持会有不同的地方。如果你在v3.8.0之前的版本使用OCI，需要着重了解不同Helm版本之间OCI的变化。

### 在v3.8.0之前的版本启用OCI支持

Helm v3.8.0版本之前, OCI支持是*试验性*的且必须显式启用。

为了在之前版本中启用OCI试验性支持，需要在环境变量中设置`HELM_EXPERIMENTAL_OCI`，例如：

```console
export HELM_EXPERIMENTAL_OCI=1
```

### OCI在v3.8.0中的弃用和行为变化

[Helm v3.8.0](https://github.com/helm/helm/releases/tag/v3.8.0)版本中，以下行为和特性与之前版本不同：

- 在依赖中将chart设置为OCI时，版本号可以像其他依赖一样设置成范围。
- 包含构建信息的SemVer tag可以被推送和使用。OCI注册中心的tag字符不支持`+`。如果有，Helm会将`+` 转成 `_`。
- `helm registry login` 命令现在采用与Docker CLI相同的结构存储凭证。Helm和Docker CLI的注册表配置使用一样的路径。

### OCI在v3.7.0中的弃用和行为变化

[Helm v3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0)版本包含了针对支持OCI的[HIP 
6](https://github.com/helm/community/blob/main/hips/hip-0006.md)执行策略。因此以下行为和特性与之前版本不同：

- 移除了 `helm chart` 子命令。
- 移除了chart缓存(没有了 `helm chart list` 等等)。
- OCI注册引用现在需要以 `oci://` 开头。
- 注册引用的基础名称*必须*和chart名称匹配。
- 注册引用的tag*必须*和chart的语义版本匹配（比如没有`latest`这种tag）。
- chart层的媒体类型从`application/tar+gzip`转换成了`application/vnd.cncf.helm.chart.content.v1.tar+gzip`。

## 使用基于OCI的注册中心

### 基于OCI注册中心的Helm仓库

[Helm 仓库](https://helm.sh/zh/docs/topics/chart_repository)是一种制作和分发打包好的Helm 
chart的方式。基于OCI的的注册中心包含0个或多个Helm仓库，且每个都会有0个或多个Helm chart。

### 使用托管的注册中心

以下是几种chart可以使用的托管容器注册中心，都支持OCI，例如：

- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-helm-repos#push-chart-to-registry-as-oci-artifact)
- [Docker Hub](https://docs.docker.com/docker-hub/oci-artifacts/)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/helm/manage-charts)
- [IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_helm_charts)
- [JFrog Artifactory](https://jfrog.com/help/r/jfrog-artifactory-documentation/helm-oci-repositories)

参照托管平台提供的文档来创建和配置支持OCI的注册中心。

**注：** 你可以在开发电脑上运行基于OCI的注册中心 [Docker Registry](https://docs.docker.com/registry/deploying/)
或者 [`zot`](https://github.com/project-zot/zot)。在开发电脑上运行只能用于测试目的。

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

### The `push` 子命令

上传chart到基于OCI的注册中心

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

`push`子命令只能用于`helm package`提前创建的`.tgz`文件。

使用`helm push`上传chart到OCI注册表时，引用必须以`oci://`开头，且不能包含基础名称或tag。

注册表引用的基础名称是由chart名称推断而来，tag是由chart语义版本推断而来。现在是强制要求。

某些注册表（如果指定）要求事先创建仓库或者命名空间，或者两者都需要创建。否则，`helm push` 会出现错误。

如果您已经创建了一个[源文件](https://helm.sh/zh/docs/topics/provenance) (`.prov`),
且和`.tgz`文件在同一文件下，会通过`push`自动上传到注册表。会在 [Helm chart manifest](#helm-chart-manifest)生成一个额外的层。

[helm-push plugin](https://github.com/chartmuseum/helm-push)的用户 (用于上传chart到
[ChartMuseum](https://helm.sh/zh/docs/topics/provenance#chartmuseum-repository-server))可能会遇到问题，因为与内置的新的`push`插件有冲突。
从v0.10.0版本开始，该插件已被命名为`cm-push`。

### 其他命令

对`oci://`协议的支持同样适用于很多其他子命令。以下是完整列表：

- `helm pull`
- `helm show`
- `helm template`
- `helm install`
- `helm upgrade`

注册表的基础名称(chart name)*包含*了涉及chart下载的任意类型的操作。（相对于`helm push`被省略的位置）。

下面是一些基于OCI的chart使用上述子命令的示例：

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

## 指定依赖项

chart的依赖项可用从使用了`dependency update`命令的注册中心拉取。

`Chart.yaml`中给定的`repository`被指定为没有基础名称注册表引用：

```yaml
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```

这会在执行`dependency update`时获取`oci://localhost:5000/myrepo/mychart:2.7.0`。

## Helm chart manifest

在注册表中表示的Helm chart manifest示例（注意`mediaType`字段）：

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

下面的示例包含一个[源文件](https://helm.sh/zh/docs/topics/provenance)（注意额外层）：

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

## 从chart仓库迁移

从经典 [chart 仓库](https://helm.sh/zh/docs/topics/chart_repository)（基于index.yaml）和使用
`helm pull`一样简单，然后使用`helm push`上传生成的`.tgz`文件到注册表。
