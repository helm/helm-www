---
title: Chart 仓库指南
description: 如何创建和使用 Helm chart 仓库。
sidebar_position: 6
---

本节介绍如何创建和使用 Helm chart 仓库。从较高层面来说，chart 仓库是用来存储和共享打包好的 chart 的位置。

社区的 Helm chart 仓库位于 [Artifact Hub](https://artifacthub.io/packages/search?kind=0)，欢迎参与贡献。不过 Helm 也支持创建和运行你自己的 chart 仓库。本指南将介绍如何操作。如果你正在考虑创建 chart 仓库，也可以考虑使用 [OCI 注册中心](/zh/docs/topics/registries/)作为替代方案。

## 先决条件

* 阅读[快速开始](/zh/docs/intro/quickstart/)指南
* 阅读 [Charts](/zh/docs/topics/charts/) 文档

## 创建 chart 仓库

_chart 仓库_ 是一个配置了 `index.yaml` 文件和一些已打包 chart 的 HTTP 服务器。当你准备好分享 chart 时，最好的方式是将 chart 上传到 chart 仓库。

从 Helm 2.2.0 开始，客户端支持对仓库进行 SSL 身份认证。其他身份验证协议可以通过插件提供。

由于 chart 仓库可以是任何能够提供 YAML 和 tar 文件并响应 GET 请求的 HTTP 服务器，托管你自己的 chart 仓库时有很多选择。比如可以使用 Google Cloud Storage (GCS) bucket、Amazon S3 bucket、GitHub Pages，甚至创建你自己的 web 服务器。

### chart 仓库结构

chart 仓库由 chart 包和一个名为 `index.yaml` 的特殊文件组成，该文件包含了仓库中所有 chart 的索引。通常 `index.yaml` 所描述的 chart 也托管在同一服务器上，[来源文件](/zh/docs/topics/provenance/)也是如此。

例如，仓库 `https://example.com/charts` 的布局可能是这样的：

```
charts/
  |
  |- index.yaml
  |
  |- alpine-0.1.2.tgz
  |
  |- alpine-0.1.2.tgz.prov
```

在这个例子中，index 文件包含了 Alpine 这一个 chart 的信息，并提供了下载地址 `https://example.com/charts/alpine-0.1.2.tgz`。

chart 包不一定要与 `index.yaml` 文件放在同一服务器上，但这样做通常是最简单的。

### index 文件

index 文件是一个名为 `index.yaml` 的 YAML 文件。它包含了 chart 包的一些元信息，包括 chart 的 `Chart.yaml` 文件内容。一个有效的 chart 仓库必须有 index 文件。index 文件包含了 chart 仓库中每个 chart 的信息。`helm repo index` 命令会基于给定的包含 chart 包的本地目录生成 index 文件。

以下是一个 index 文件示例：

```yaml
apiVersion: v1
entries:
  alpine:
    - created: 2016-10-06T16:23:20.499814565-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 99c76e403d752c84ead610644d4b1c2f2b453a74b921f422b9dcb8a7c8b559cd
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.2.0.tgz
      version: 0.2.0
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 515c58e5f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cd78727
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.1.0.tgz
      version: 0.1.0
  nginx:
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Create a basic nginx HTTP server
      digest: aaff4545f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cdffffff
      home: https://helm.sh/helm
      name: nginx
      sources:
      - https://github.com/helm/charts
      urls:
      - https://technosophos.github.io/tscharts/nginx-1.1.0.tgz
      version: 1.1.0
generated: 2016-10-06T16:23:20.499029981-06:00
```

## 托管 chart 仓库

本部分介绍几种提供 chart 仓库服务的方法。

### Google Cloud Storage

第一步是**创建你的 GCS bucket**。我们将其命名为 `fantastic-charts`。

![Create a GCS Bucket](/img/helm2/create-a-bucket.png)

然后通过**编辑 bucket 权限**将其设为公开。

![Edit Permissions](/img/helm2/edit-permissions.png)

插入以下条目**将 bucket 设为公开**：

![Make Bucket Public](/img/helm2/make-bucket-public.png)

恭喜，现在你有了一个可以提供 chart 服务的空 GCS bucket！

你可以使用 Google Cloud Storage 命令行工具或 GCS web 界面上传 chart 仓库。公开的 GCS bucket 可以通过简单的 HTTPS 地址访问：`https://bucket-name.storage.googleapis.com/`。

### Cloudsmith

你也可以使用 Cloudsmith 设置 chart 仓库。在[这里](https://help.cloudsmith.io/docs/helm-chart-repository)了解更多关于 Cloudsmith 配置 chart 仓库的信息。

### JFrog Artifactory

同样，你也可以使用 JFrog Artifactory 设置 chart 仓库。在[这里](https://www.jfrog.com/confluence/display/RTF/Helm+Chart+Repositories)了解更多关于 JFrog Artifactory 配置 chart 仓库的信息。

### GitHub Pages 示例

你可以用类似的方式使用 GitHub Pages 创建 chart 仓库。

GitHub 允许你通过两种方式提供静态网页：

- 配置项目以提供 `docs/` 目录的内容
- 配置项目以提供特定分支的内容

我们将采用第二种方式，不过第一种方式也很简单。

第一步是**创建 gh-pages 分支**。你可以在本地创建：

```console
$ git checkout -b gh-pages
```

或者在 GitHub 仓库中通过 web 界面使用 **Branch** 按钮：

![Create GitHub Pages branch](/img/helm2/create-a-gh-page-button.png)

然后，确保将 **gh-pages branch** 设置为 GitHub Pages。点击仓库的 **Settings**，向下滚动到 **GitHub pages** 部分，按如下设置：

![Create GitHub Pages branch](/img/helm2/set-a-gh-page.png)

默认情况下，**Source** 通常设置为 **gh-pages branch**。如果没有默认设置，请手动选择。

如果需要，你可以在这里使用**自定义域名**。

然后确保勾选了 **Enforce HTTPS**，这样提供 chart 时会使用 **HTTPS**。

在这种配置下，你可以使用默认分支存储 chart 代码，并使用 **gh-pages branch** 作为 chart 仓库，例如：`https://USERNAME.github.io/REPONAME`。演示仓库 [TS Charts](https://github.com/technosophos/tscharts) 可以通过 `https://technosophos.github.io/tscharts/` 访问。

如果你想使用 GitHub Pages 托管 chart 仓库，请查看 [Chart Releaser Action](/zh/docs/howto/chart_releaser_action/)。Chart Releaser Action 是一个 GitHub Action 工作流，可以使用 [helm/chart-releaser](https://github.com/helm/chart-releaser) CLI 工具将 GitHub 项目转换为自托管的 Helm chart 仓库。

### 普通 web 服务器

配置普通 web 服务器来提供 Helm chart，你只需要执行以下操作：

- 将 index 文件和 chart 放在服务器可以提供服务的目录中
- 确保 `index.yaml` 文件可以无需认证即可访问
- 确保 `yaml` 文件以正确的内容类型提供（`text/yaml` 或 `text/x-yaml`）

例如，如果你想在 `$WEBROOT/charts` 提供 chart，确保 web 根目录下有一个 `charts/` 目录，并将 index 文件和 chart 放在该目录中。

### ChartMuseum 仓库服务器

ChartMuseum 是一个用 Go (Golang) 编写的开源 Helm chart 仓库服务器，支持多种云存储后端，包括 [Google Cloud Storage](https://cloud.google.com/storage/)、[Amazon S3](https://aws.amazon.com/s3/)、[Microsoft Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)、[Alibaba Cloud OSS Storage](https://www.alibabacloud.com/product/oss)、[Openstack Object Storage](https://developer.openstack.org/api-ref/object-store/)、[Oracle Cloud Infrastructure Object Storage](https://cloud.oracle.com/storage)、[Baidu Cloud BOS Storage](https://cloud.baidu.com/product/bos.html)、[Tencent Cloud Object Storage](https://intl.cloud.tencent.com/product/cos)、[DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/)、[Minio](https://min.io/) 以及 [etcd](https://etcd.io/)。

你也可以使用 [ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage) 服务器从本地文件系统托管 chart 仓库。

### GitLab Package Registry

使用 GitLab 可以在项目的 Package Registry 中发布 Helm chart。在[这里](https://docs.gitlab.com/ee/user/packages/helm_repository/)了解更多关于使用 GitLab 设置 Helm 包仓库的信息。

## 管理 chart 仓库

现在你有了 chart 仓库，本指南的最后一部分将介绍如何在仓库中维护 chart。

### 在 chart 仓库中存储 chart

现在你有了 chart 仓库，让我们上传 chart 和 index 文件到仓库。chart 仓库中的 chart 必须打包（`helm package chart-name/`）且遵循正确的版本号规范（参照 [SemVer 2](https://semver.org/) 指南）。

以下步骤构成一个示例工作流，但你可以使用任何你喜欢的工作流来存储和更新 chart 仓库中的 chart。

准备好打包的 chart 后，创建一个新目录，然后将打包的 chart 移动到该目录中。

```console
$ helm package docs/examples/alpine/
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
$ helm repo index fantastic-charts --url https://fantastic-charts.storage.googleapis.com
```

最后一条命令获取刚创建的本地目录路径和远程 chart 仓库的 URL，并在给定的目录路径中生成 `index.yaml` 文件。

现在你可以使用同步工具或手动方式将 chart 和 index 文件上传到 chart 仓库。如果使用 Google Cloud Storage，可以使用 gsutil 客户端查看[示例工作流](/zh/docs/howto/chart_repository_sync_example/)。对于 GitHub，你可以简单地将 chart 放在合适的目标分支中。

### 向现有仓库添加新 chart

每次你想向仓库添加新 chart 时，必须重新生成 index。`helm repo index` 命令会从头完全重建 `index.yaml` 文件，只包含它在本地找到的 chart。

不过，你可以使用 `--merge` 参数增量添加新 chart 到现有的 `index.yaml` 文件中（在使用类似 GCS 的远程仓库时很有用）。运行 `helm repo index --help` 了解更多信息。

确保修订后的 `index.yaml` 文件和 chart 都已上传。如果生成了来源文件，也要一并上传。

### 与他人分享你的 chart

当你准备好分享 chart 时，只需告诉别人你的仓库 URL 即可。

用户可以通过 `helm repo add [NAME] [URL]` 命令将仓库添加到他们的 Helm 客户端，并使用任何他们想要的名称来引用该仓库。

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

如果 chart 使用 HTTP 基本认证，你也可以在这里提供用户名和密码：

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

**注意：** 如果仓库不包含有效的 `index.yaml`，则无法添加。

**注意：** 如果你的 Helm 仓库使用了自签名证书，你可以使用 `helm repo add --insecure-skip-tls-verify ...` 来跳过 CA 验证。

之后，你的用户就可以搜索你的 chart 了。更新仓库后，他们可以使用 `helm repo update` 命令获取最新的 chart 信息。

*在底层，`helm repo add` 和 `helm repo update` 命令会获取 index.yaml 文件并将其存储在 `$XDG_CACHE_HOME/helm/repository/cache/` 目录中。这是 `helm search` 功能查找 chart 信息的位置。*
