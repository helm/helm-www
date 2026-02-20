---
title: 安装 Helm
description: 了解如何安装并运行 Helm。
sidebar_position: 2
---

本指南介绍如何安装 Helm CLI。Helm 可以通过源码或预构建的二进制版本安装。

## 通过 Helm 项目安装

Helm 项目提供了两种获取和安装 Helm 的方式，这是官方提供的获取 Helm 发布版本的方法。此外，Helm 社区提供了通过不同包管理器安装 Helm 的方法，这些方法可以在下面的官方方法之后看到。

### 通过二进制版本安装

每个 Helm [版本](https://github.com/helm/helm/releases)都提供了各种操作系统的二进制版本，这些版本可以手动下载和安装。

1. 下载[需要的版本](https://github.com/helm/helm/releases)
2. 解压（`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`）
3. 在解压目录中找到 `helm` 程序，移动到需要的目录中（`mv linux-amd64/helm /usr/local/bin/helm`）

完成后，你可以运行客户端程序并[添加稳定仓库](./quickstart.md#初始化-helm-chart-仓库)：`helm help`。

**注意：** Helm 的自动化测试仅在 GitHub Actions 构建和发布时针对 Linux AMD64 执行。其他操作系统的测试由对应平台的社区负责。

### 使用脚本安装

Helm 提供了一个安装脚本，可以自动拉取最新版本并[在本地安装](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3)。

你可以下载这个脚本并在本地执行。脚本有详细的注释，建议在运行前阅读了解其功能。

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

如果想直接执行安装，运行 `curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash`。

## 通过包管理器安装

Helm 社区提供了通过操作系统包管理器安装 Helm 的方式。但 Helm 项目不支持这些方式，且不认为是可信的第三方。

### 使用 Homebrew (macOS)

Helm 社区成员贡献了一种在 Homebrew 构建 Helm 的方案，这个方案通常是最新的。

```console
brew install helm
```

（注意：还有一个 emacs-helm 的方案，当然这是另一个项目了。）

### 使用 Chocolatey (Windows)

Helm 社区成员贡献了一个 [Helm 包](https://chocolatey.org/packages/kubernetes-helm)在 [Chocolatey](https://chocolatey.org/) 中构建，该包通常是最新的。

```console
choco install kubernetes-helm
```

### 使用 Scoop (Windows)

Helm 社区成员贡献了一个针对 [Scoop](https://scoop.sh) 的 [Helm 包](https://github.com/ScoopInstaller/Main/blob/master/bucket/helm.json)，该包通常是最新的。

```console
scoop install helm
```

### 使用 Winget (Windows)

Helm 社区成员贡献了一个针对 [Winget](https://learn.microsoft.com/en-us/windows/package-manager/) 的 [Helm 包](https://github.com/microsoft/winget-pkgs/tree/master/manifests/h/Helm/Helm)，该包通常是最新的。

```console
winget install Helm.Helm
```

### 使用 Apt (Debian/Ubuntu)

Helm 社区成员贡献了 Debian/Ubuntu 的 Apt 包，通常会保持最新。感谢 [Buildkite](https://buildkite.com/organizations/helm-linux/packages/registries/helm-debian) 托管此仓库。

```console
sudo apt-get install curl gpg apt-transport-https --yes
curl -fsSL https://packages.buildkite.com/helm-linux/helm-debian/gpgkey | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/helm.gpg] https://packages.buildkite.com/helm-linux/helm-debian/any/ any main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### 使用 dnf/yum (Fedora)

从 Fedora 35 开始，官方仓库可以使用 Helm 了，可以调用以下命令安装 Helm：

```console
sudo dnf install helm
```

### 使用 Snap

[Snapcrafters](https://github.com/snapcrafters) 社区维护了 [Helm 包](https://snapcraft.io/helm)的 Snap 版本：

```console
sudo snap install helm --classic
```

### 使用 pkg (FreeBSD)

FreeBSD 社区成员贡献了一个 [Helm 包](https://www.freshports.org/sysutils/helm)来构建 [FreeBSD 端口集](https://man.freebsd.org/ports)。该包通常是最新的。

```console
pkg install helm
```

### 开发版本构建

除了正式版本，你还可以下载和安装 Helm 的开发版本。

### 使用 Canary 构建

"Canary" 版本是从 Helm 最新的 `main` 分支构建的。这些不是官方版本，可能不稳定，但可以用于测试最新特性。

Canary Helm 二进制包存储在 [get.helm.sh](https://get.helm.sh)。以下是常用构建的链接：

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [实验性 Windows AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### 使用源码构建 (Linux, macOS)

从源码构建 Helm 的工作要稍微多一点，但如果你想测试最新（预发布）的 Helm 版本，这是最好的方式。

你必须有可用的 Go 环境。

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

如果需要，会拉取依赖并缓存，然后验证配置。然后会编译 `helm` 并放在 `bin/helm`。

## 总结

大多数情况下，安装只需获取一个构建好的 `helm` 二进制包。本文档涵盖了一些进阶安装场景。

一旦你成功安装了 Helm 客户端，就可以继续使用 Helm 管理 chart 和[添加稳定的仓库](./quickstart.md#初始化-helm-chart-仓库)。
