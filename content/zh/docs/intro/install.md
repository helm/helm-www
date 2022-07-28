---
title: "安裝 Helm"
description: "了解如何安裝并运行Helm"
weight: 2
---

該指南展示了如何安裝 Helm CLI。Helm 可以用程式碼或建構的二進制版本進行安裝。

## 用 Helm 項目安裝

Helm 項目提供了兩種取得和安裝 Helm 的方式。這是官方提供的取得 Helm 發佈版本的方法。另外，
Helm 社區提供了通過不同套件管理工具安裝 Helm 的方法。这些方法可以在下面的官方方法看到。

### 用二進制版本安裝

每个 Helm[版本](https://github.com/helm/helm/releases)都提供了各種操作系统的二進制版本，这些版本可以手動下载和安裝。

1. 下载[需要的版本](https://github.com/helm/helm/releases)
2. 解壓(`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. 在解壓目錄中找到`helm`程序，移動到需要的目錄中(`mv linux-amd64/helm /usr/local/bin/helm`)

然後就可以執行客戶端程式並[添加穩定倉庫](https://helm.sh/zh/docs/intro/quickstart/#初始化): `helm help`.

**注意** 針對 Linux AMD64，Helm 的自動測試只有在 CircleCi 建構和發佈時才會執行。測試其他操作系统是社區針對系統問題請求 Helm 的責任。

### 使用腳本安裝

Helm 現在有个安裝腳本可以自動拉取最新的 Helm 版本並在[本地安裝](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3)。

您可以獲取這個腳本並在本地執行。它良好的文件會讓您在執行之前知道腳本都做了什麼。

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

如果想直接直接安裝，運行`curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash`。

## 通過套件管理工具安裝

Helm 社區提供了通過操作系統套件管理工具安裝 Helm 的方式。但 Helm 項目不支持且不認為是可信的第三方。

### 使用 Homebrew (macOS)

Helm 社區成員貢獻了一種在 Homebrew 構建 Helm 的方案，這個方案通常是最新的。

```console
brew install helm
```

(注意：還有一個 emacs-helm 的方案，當然這個是另一個項目了。)

### 使用 Chocolatey (Windows)

Helm 社區成員貢獻了一個[Helm](https://chocolatey.org/packages/kubernetes-helm) 在 [Chocolatey](https://chocolatey.org/)中建構，這個方案通常是最新的。

```console
choco install kubernetes-helm
```

### 使用 Scoop (Windows)

Helm 社區成員貢獻了一個針對 [Scoop](https://scoop.sh) 的[Helm](https://github.com/ScoopInstaller/Main/blob/master/bucket/helm.json)，這個方案通常是最新的。

```console
scoop install helm
```

### 使用 Apt (Debian/Ubuntu)

Helm 社區成員貢獻了針對 Apt 的一個[Helm](https://helm.baltorepo.com/stable/debian/)，這個方案通常是最新的。

```console
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### 使用 Snap

[Snapcrafters](https://github.com/snapcrafters)社區維護了[Helm](https://snapcraft.io/helm)的 Snap 版本：

```console
sudo snap install helm --classic
```

### 使用 pkg (FreeBSD)

FreeBSD 社區成員貢獻了一个[Helm 頁面](https://www.freshports.org/sysutils/helm)来建構[FreeBSD
端口集](https://man.freebsd.org/ports)。這個方案通常是最新的。

```console
pkg install helm
```

### 開發版本建構

另外您可以下載和安裝 Helm 的開發版本。

### 使用 Canary 構建

"Canary"版本是從 Helm 最新的`main`分支構建。这些不是官方版本，可能會不稳定。但是這提供測試邊緣特性的條件。

Canary Helm 二進制版本儲存在[get.helm.sh](https://get.helm.sh)。以下是一般構建的連結：

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [實驗性 Windows AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### 使用原始碼 (Linux, macOS)

從原始碼構建 Helm 的工作要稍微多一點，但如果你想測試最新（預發佈）的 Helm 版本，這是最好的方式。

您必須有可用的 Go 環境。

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

如果需要，會拉取依賴並緩存，然後驗證配置。會編譯`helm`並放在`bin/helm`。

## 總結

大多數情况下，安裝只需要簡單地獲取一個構建好的`helm`二進制版本。本文件為想使用 Helm 做更複雜事情的人提供額外的範例。

一旦你成功安裝了 Helm 客戶端，就可以繼續使用 Helm 管理 chart 和[添加穩定的倉庫](https://helm.sh/zh/docs/intro/quickstart/#初始化)。
