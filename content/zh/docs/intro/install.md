---
title: "Helm 安装"
description: "了解如何安装和运行 Helm"
weight: 2
aliases: ["/docs/install/"]
---

本向导展示如何安装 Helm CLI 客户端。 Helm 可以通过源码安装，或者通过已编译过的二进制发行版进行安装。

## Helm 官方安装方式

Helm 项目提供了两种途径获取和安装 Helm。一种途径是通过 Helm 官方提供的方式获取 Helm 版本，
另外一种方式是通过社区提供不同的包管理器安装 Helm。以下部分是介绍通过官方提供的方式安装。

### 通过二进制发行版安装

Helm 所有的版本均提供了适用于多种操作系统的 [二进制发行版](https://github.com/helm/helm/releases)。
这些二进制版本可以手动下载并安装。
1. 下载您[需要的版本](https://github.com/helm/helm/releases)
2. 解压压缩包 (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. 在解压后的目录中找到 `helm` 二进制文件，并将其移动到目标路径上 (`mv linux-amd64/helm /usr/local/bin/helm`)

此时，你应该能够运行客户端并 [添加稳定的 repo](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository): 
`helm help`。

**提示：** Helm 仅在 Linux AMD64 平台执行过自动化测试，以及 CircleCi 级别的构建和发布。其他 OS 平台的测试可以向 Helm 社区寻求帮助。

### 通过脚本安装

目前 Helm 具有一个安装脚本，能够自动获取最新的 Helm 版本并[安装到本地](https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3)。

您可以获取该脚本并在本地执行。脚本本身也是一个较好的文档说明，在运行脚本前可以通过阅读使您理解它具体做了什么:

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

直接执行该命令具有同样的效果： 
```console
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
```

## 通过包管理器进行安装

Helm 社区提供使用操作系统上的包管理器安装的能力。Helm 官方不提供支持，他们也不是可信任的第三方。

### 通过 Homebrew (macOS) 安装

Helm 社区的成员为 Homebrew 贡献了 Helm 的安装方法。该方法安装的版本通常是最新的发行版本。

```console
brew install helm
```

(注意: emacs-helm 也是一个软件，但他和 Helm 是不同的项目。)

### 通过 Chocolatey (Windows) 安装

Helm 社区成员为 [Chocolatey](https://chocolatey.org/) 贡献了 [Helm 安装](https://chocolatey.org/packages/kubernetes-helm) 支持。 该方法安装的版本通常是最新的发行版本。

```console
choco install kubernetes-helm
```

### 通过 Apt (Debian/Ubuntu) 安装
Helm 社区成员为 Apt 贡献了 [Helm 安装](https://helm.baltorepo.com/stable/debian/) 支持。该方法安装的版本通常是最新的发行版本。

```console
curl https://helm.baltorepo.com/organization/signing.asc | sudo apt-key add -
sudo apt-get install apt-transport-https --yes
echo "deb https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### 通过 Snap 安装

[Snapcrafters](https://github.com/snapcrafters) 社区维护 Snap 版本的 [Helm package](https://snapcraft.io/helm):

```console
sudo snap install helm --classic
```

## 开发版本安装

除了稳定的发行版，您还可以通过一下方法下载或安装开发版本。


### 通过 Canary 构建

"Canary" 编译的 Helm 版本是从最新的 master 分支构建的。他们不是正式的发行版本，也可能不稳定。但是，他们提供测试最新功能的机会。

Canary Helm 的二进制文件存储在 [get.helm.sh](https://get.helm.sh) 。通常构建的最新版本链接：

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [Experimental Windows
  AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### 通过源码构建 (Linux, macOS)

从源代码构建 Helm 的工作稍微复杂一些，但如果你想测试最新的（预发布）Helm 版本，那么这是最好的方法。

你必须有一个安装 Go 工作环境 。

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```
如果有依赖，他将自动化获取依赖并缓存下来，并验证配置。编译将生成二进制文件 `helm`，并存放在 `bin/helm` 路径。

## 总结

在大多数情况下， 安装已经编译好的二进制文件 `helm` 是比较简单的。本文档为那些想要使用多样方式安装 Helm 的人提供了案例描述。

一旦你成功安装了 Helm 客户端，就可以使用 Helm 来管理 charts 和 [添加稳定的repo](https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository)。