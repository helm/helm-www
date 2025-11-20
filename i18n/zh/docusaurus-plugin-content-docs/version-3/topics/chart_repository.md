---
title: Chart仓库指南
description: 如何创建和使用Helm chart 仓库
sidebar_position: 6
---

本节介绍如何创建和使用chart仓库。在高层级中，chart仓库是打包的chart存储和分享的位置。

社区的Helm chart仓库位于[Artifact Hub](https://artifacthub.io/packages/search?kind=0)，欢迎加入。
不过Helm也可以创建并运行你自己的chart仓库。该指南将介绍如何操作。

## 先决条件

* 先阅读[快速开始](https://helm.sh/zh/docs/intro/quickstart/)
* 阅读[Charts](https://helm.sh/zh/docs/topics/charts/)文档

## 创建一个chart仓库

_chart仓库_ 是一个配置了`index.yaml`文件和一些已经打包chart的HTTP服务器。当你准备好分享chart时，最好的方法是将chart上传到chart仓库。

**注意：** 从Helm 2.2.0开始，客户端支持对仓库进行SSL身份认证。其他身份验证协议可以通过插件提供。

由于chart仓库可以是任何服务于YAML和tar文件并响应GET请求的HTTP服务器，托管你自己的chart仓库时就有很多选择。比如可以使用Google
Cloud Storage(GCS)， Amazon S3，GitHub页面，甚至创建自己的web服务器。

### chart仓库结构

chart仓库由chart包和包含了仓库中所有chart索引的特殊文件`index.yaml`。
通常描述chart的`index.yaml`也托管在同一个服务器上作为[来源文件](https://helm.sh/zh/docs/topics/provenance/)。

比如，`https://example.com/charts`仓库布局可能看起来像这样：

```console
charts/
  |
  |- index.yaml
  |
  |- alpine-0.1.2.tgz
  |
  |- alpine-0.1.2.tgz.prov
```

在这个案例中，index文件包含了Alpine这一个chart的信息，并提供了下载地址：`https://example.com/charts/alpine-0.1.2.tgz`。

`index.yaml`文件不是必须和chart包放在同一个服务器上，但是这样是最方便的。

### index文件

`index.yaml`文件是一个yaml格式的文件。包含了一些包的元信息，包括chart中`Chart.yaml`文件的内容。
一个合法的chart仓库必须有一个index文件，包含了chart仓库中每一个chart的信息。
`helm repo index`命令会基于给定的包含chart包的本地目录生成一个index文件。

index文件类似于这样：

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

## 托管chart仓库

这部分展示了几种提供chart仓库的方法

### Google Cloud存储

第一步是**create your GCS bucket**。我们会调用`fantastic-charts`。

![Create a GCS Bucket](/img/helm2/create-a-bucket.png)

然后使用**editing the bucket permissions**保证你的bucket是公开的。

![Edit Permissions](/img/helm2/edit-permissions.png)

插入这一行 **保证你的bucket是公开的**:

![Make Bucket Public](/img/helm2/make-bucket-public.png)

恭喜，您现在准备好了一个提供chart的空GCS bucket！

你可以使用Google Cloud Storage命令行工具上传你的chart仓库，或者使用GCS的web页面。
一个公共的GCS bucket可以通过简单的HTTPS地址访问：`https://bucket-name.storage.googleapis.com/`。

### Cloudsmith

也可以使用Cloudsmith设置chart仓库。在 [这里](https://help.cloudsmith.io/docs/helm-chart-repository)
阅读更多关于Cloudsmith配置chart仓库的内容。

### JFrog Artifactory

同样，也可以使用JFrog Artifactory配置chart仓库。 在 [这里](https://www.jfrog.com/confluence/display/RTF/Helm+Chart+Repositories)
阅读更多关于JFrog Artifactory配置chart仓库的内容。

### GitHub页面示例

你可以用GitHub页面以类似的方式创建chart仓库。

GitHub允许你使用两种方式提供静态web页面：

* 通过`docs/`目录配置项目
* 通过特定的分支配置项目

我们将使用第二种方式，不过第一种方式也很简单。

第一步是**创建你的gh-pages分支**。可以在本地创建：

```console
$ git checkout -b gh-pages
```

或者在你的GitHub仓库通过web页面使用 **Branch** 按钮：

![Create GitHub Pages branch](/img/helm2/create-a-gh-page-button.png)

然后，你要保证你的**gh-pages branch**设置为GitHub页面，点击你仓库的**Settings**并相信找到**GitHub pages**部分并设置如下：

![Create GitHub Pages branch](/img/helm2/set-a-gh-page.png)

默认**Source**一般设置为**gh-pages branch**。如果不是默认，把它选上。

如果想使用自定义域名使用**custom domain**。

然后确保勾选了**Enforce HTTPS**， 这样提供chart时会使用**HTTPS**。

在这个配置中，你可以使用你的默认分支存储你的chart代码，并使用**gh-pages branch**作为chart仓库，比如：
`https://USERNAME.github.io/REPONAME`。[TS Charts](https://github.com/technosophos/tscharts)示范仓库可以访问
`https://technosophos.github.io/tscharts/`。

如果你想使用GitHub页面托管chart仓库，请查看[Chart发布操作](https://helm.sh/zh/docs/howto/chart_releaser_action)。
Chart 发布操作是GitHub的操作流，可以将GitHub项目转换成自托管的Helm chart仓库，可以使用使用
[helm/chart-releaser](https://github.com/helm/chart-releaser) CLI工具。

### 普通web服务器

配置一个一般的服务器来提供Helm chart，您只需执行以下操作：

* 将index和chart放置在可提供服务的服务器目录中
* 确保`index.yaml`文件无需验证即可访问
* 确保`yaml`文件是正确的内容类型(`text/yaml`或`text/x-yaml`)

比如，如果你想在`$WEBROOT/charts`提供你的chart，要保证在web的root目录有一个`charts/`目录，并将index文件和chart放在这个目录中。

### ChartMuseum 仓库服务器

ChartMuseum 是一个用Go写的开源的Helm Chart仓库服务器，支持云存储后端，包括[Google Cloud Storage](https://cloud.google.com/storage/)，
[Amazon S3](https://aws.amazon.com/s3/)，[Microsoft Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)，
[Alibaba Cloud OSS Storage](https://www.alibabacloud.com/product/oss)，
[Openstack Object Storage](https://developer.openstack.org/api-ref/object-store/)，
[Oracle Cloud Infrastructure Object Storage](https://cloud.oracle.com/storage)，
[Baidu Cloud BOS Storage](https://cloud.baidu.com/product/bos.html)，
[Tencent Cloud Object Storage](https://intl.cloud.tencent.com/product/cos)，
[DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/)，
[Minio](https://min.io/)，以及[etcd](https://etcd.io/)。

你也可以使用[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)服务从本地文件系统托管一个chart仓库。

### GitLab 包注册表

使用GitLab你可以在你的项目包注册表中发布Helm chart。在[这里](https://docs.gitlab.com/ee/user/packages/helm_repository/)查看更多使用GitLab设置helm包仓库的信息。

## 管理chart仓库

现在你拥有了一个chart仓库，最后一部分知道介绍如何下仓库中维护chart。

### 在chart仓库中存储chart

现在你拥有了一个chart仓库，上传一个chart和index文件到仓库中。仓库中的chart必须打包(`helm package chart-name/`)
且使用正确的版本号(参照[SemVer 2](https://semver.org/)指导)。

下一步构建一个简单的示例工作流，不过欢迎你使用自己喜欢的工作流来存储和更新你的chart仓库。

一旦你准备好了打包的chart，创建一个新目录，然后将包移动到这个目录中。

```console
$ helm package docs/examples/alpine/
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
$ helm repo index fantastic-charts --url https://fantastic-charts.storage.googleapis.com
```

最后一条命令会用刚才创建的本地路径和远程仓库url构建一个`index.yaml`文件放在给定的目录路径中。

现在你可以使用同步工具或手动上传chart和index文件到chart仓库中。如果使用的是Google Cloud Storage，使用gsutil客户端检查
[示范工作流](https://helm.sh/zh/docs/howto/chart_repository_sync_example/)。针对于GitHub，你可以简单地将chart放在合适的目标分支中。

### 添加一个新的chart到已有仓库中

每次你想在仓库中添加一个新的chart时，你必须重新生成index。`helm repo index`命令会完全无痕重建`index.yaml`文件。只包括在本地找到的chart。

不过你可以使用`--merge`参数增量添加新的chart到现有`index.yaml`文件中（使用类似GCS的远程仓库时很有用）。执行
`helm repo index --help`了解更多。

确保修订过的`index.yaml`文件和chart都上传了，如果生成了源文件，也要上传。

### 与别人分享你的chart

准备好分享你的chart时，只需要告诉别人你的仓库地址就可以了。

他们会通过`helm repo add [NAME] [URL]`命令将仓库添加到他们的客户端，并使用想引用仓库的任何名称。

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

如果chart支持HTTP的基础验证，你也需要提供用户名和密码：

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

**注意：** 如果不存在有效的`index.yaml`就无法添加仓库。

**注意：** 如果你的helm仓库使用了类似于自签名的证书，为了跳过CA认证，可以使用
`helm repo add --insecure-skip-tls-verify ...`。

然后，你的用户就可以通过你的chart进行搜索。更新了仓库之后，他们可以使用`helm repo update`命令获取最新的chart信息。

*在内部 `helm repo add` 和 `helm repo update` 命令会检索index.yaml文件并将其存储在
`$XDG_CACHE_HOME/helm/repository/cache/`目录中。这里是`helm search`方法查找chart信息的位置。*
