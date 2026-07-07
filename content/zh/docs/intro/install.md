---
title: "安装Helm"
description: "了解如何安装并运行Helm"
weight: 2
---

该指南展示了如何安装Helm CLI。Helm可以用源码或构建的二进制版本安装。

## 用Helm项目安装

Helm项目提供了两种获取和安装Helm的方式。这是官方提供的获取Helm发布版本的方法。另外，
Helm社区提供了通过不同包管理器安装Helm的方法。这些方法可以在下面的官方方法之后看到。

### 用二进制版本安装

每个Helm[版本](https://github.com/helm/helm/releases)都提供了各种操作系统的二进制版本，这些版本可以手动下载和安装。

1. 下载[需要的版本](https://github.com/helm/helm/releases)
2. 解压(`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. 在解压目录中找到`helm`程序，移动到需要的目录中(`mv linux-amd64/helm /usr/local/bin/helm`)

然后就可以执行客户端程序并[添加稳定仓库](https://helm.sh/zh/docs/intro/quickstart/#初始化): `helm help`.

**注意** 针对Linux AMD64，Helm的自动测试只有在CircleCi构建和发布时才会执行。测试其他操作系统是社区针对系统问题请求Helm的责任。

### 使用脚本安装

Helm现在有个安装脚本可以自动拉取最新的Helm版本并在[本地安装](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3)。

您可以获取这个脚本并在本地执行。它良好的文档会让您在执行之前知道脚本都做了什么。

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

如果想直接执行安装，运行`curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
| bash`。

## 通过包管理器安装

Helm社区提供了通过操作系统包管理器安装Helm的方式。但Helm项目不支持且不认为是可信的第三方。

### 使用Homebrew (macOS)

Helm社区成员贡献了一种在Homebrew构建Helm的方案，这个方案通常是最新的。

```console
brew install helm
```

(注意：还有一个emacs-helm的方案，当然这是另一个项目了。)

### 使用Chocolatey (Windows)

Helm社区成员贡献了一个[Helm包](https://chocolatey.org/packages/kubernetes-helm)在[Chocolatey](https://chocolatey.org/)中构建，
包通常是最新的。

```console
choco install kubernetes-helm
```

### 使用Scoop (Windows)

Helm社区成员贡献了一个针对 [Scoop](https://scoop.sh) 的[Helm包](https://github.com/ScoopInstaller/Main/blob/master/bucket/helm.json)，该包通常是最新的。

```console
scoop install helm
```

### 使用Apt (Debian/Ubuntu)

Helm社区成员贡献了针对Apt的一个[Helm包](https://helm.baltorepo.com/stable/debian/)，包通常是最新的。

```console
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### 使用 dnf/yum (fedora)

从Fedora 35开始， 官方仓库可以使用helm了，可以调用以下命令安装helm：

```console
sudo dnf install helm
```

### 使用Snap

[Snapcrafters](https://github.com/snapcrafters)社区维护了[Helm 包](https://snapcraft.io/helm)的Snap版本：

```console
sudo snap install helm --classic
```

### 使用 pkg (FreeBSD)

FreeBSD社区成员贡献了一个[Helm页面](https://www.freshports.org/sysutils/helm)来构建[FreeBSD
端口集](https://man.freebsd.org/ports)。通常都是最新的包。

```console
pkg install helm
```

### 开发版本构建

另外您可以下载和安装Helm的开发版本。

### 使用Canary构建

"Canary"版本是从Helm最新的`main`分支构建。这些不是官方版本，可能不稳定。但是这提供测试边缘特性的条件。

Canary Helm二进制包存储在[get.helm.sh](https://get.helm.sh)。以下是一般构建的链接：

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [实验性Windows AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### 使用源码Source (Linux, macOS)

从源码构建Helm的工作要稍微多一点，但如果你想测试最新（预发布）的Helm版本，这是最好的方式。

您必须有可用的Go环境。

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

如果需要，会拉取依赖并缓存，然后验证配置。然后会编译`helm`并放在`bin/helm`。

## 总结

大多数情况下，安装只需要简单地获取一个构建好的`helm`二进制包。本文档为想使用Helm做更复杂事情的人提供额外示例。

一旦你成功安装了Helm客户端，就可以继续使用Helm管理chart和[添加稳定的仓库](https://helm.sh/zh/docs/intro/quickstart/#初始化)。
