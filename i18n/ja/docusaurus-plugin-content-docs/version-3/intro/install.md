---
title: Helm のインストール
description: Helm をインストールして実行する方法を学びます。
sidebar_position: 2
---

このガイドでは、Helm CLI のインストール方法を説明します。Helm はソースから、またはビルド済みのバイナリリリースからインストールできます。

## Helm プロジェクトから

Helm プロジェクトは、Helm を取得してインストールするための 2 つの公式の方法を提供しています。これに加えて、Helm コミュニティがさまざまなパッケージマネージャーを通じたインストール方法を提供しており、それらは公式の方法の後で説明します。

### バイナリリリースから

Helm のすべての[リリース](https://github.com/helm/helm/releases)は、さまざまな OS 向けのバイナリを提供しています。これらのバイナリは手動でダウンロードしてインストールできます。

1. [任意のバージョン](https://github.com/helm/helm/releases)をダウンロードします
2. 展開します（`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`）
3. 展開したディレクトリ内の `helm` バイナリを目的の場所に移動します（`mv linux-amd64/helm /usr/local/bin/helm`）

これでクライアントを実行し、[chart リポジトリを初期化](/intro/quickstart.md#initialize-a-helm-chart-repository)できます。`helm help` を実行して確認してください。

**注:** Helm の自動テストは、GitHub Actions のビルドおよびリリース時に Linux AMD64 に対してのみ実行されます。他の OS のテストは、その OS 向けの Helm を必要とするコミュニティの責任で行われます。

### スクリプトから

Helm には、最新バージョンの Helm を自動的に取得して[ローカルにインストールする](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3)インストーラースクリプトがあります。

このスクリプトを取得し、ローカルで実行できます。十分にドキュメント化されているため、実行前に内容を確認できます。

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

手軽に済ませたい場合は、`curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash` も使用できます。

## パッケージマネージャー経由

Helm コミュニティは、オペレーティングシステムのパッケージマネージャーを通じて Helm をインストールする方法を提供しています。これらは Helm プロジェクトによるサポート対象ではなく、信頼されたサードパーティとは見なされません。

### Homebrew から（macOS）

Helm コミュニティのメンバーが Homebrew に Helm フォーミュラを提供しています。このフォーミュラは一般的に最新の状態に保たれています。

```console
brew install helm
```

（注：emacs-helm という別のプロジェクトのフォーミュラも存在します。）

### Chocolatey から（Windows）

Helm コミュニティのメンバーが [Chocolatey](https://chocolatey.org/) に [Helm パッケージ](https://chocolatey.org/packages/kubernetes-helm)を提供しています。このパッケージは一般的に最新の状態に保たれています。

```console
choco install kubernetes-helm
```

### Scoop から（Windows）

Helm コミュニティのメンバーが [Scoop](https://scoop.sh) に [Helm パッケージ](https://github.com/ScoopInstaller/Main/blob/master/bucket/helm.json)を提供しています。このパッケージは一般的に最新の状態に保たれています。

```console
scoop install helm
```

### Winget から（Windows）

Helm コミュニティのメンバーが [Winget](https://learn.microsoft.com/en-us/windows/package-manager/) に [Helm パッケージ](https://github.com/microsoft/winget-pkgs/tree/master/manifests/h/Helm/Helm)を提供しています。このパッケージは一般的に最新の状態に保たれています。

```console
winget install Helm.Helm
```

### Apt から（Debian/Ubuntu）

Helm コミュニティのメンバーが Debian/Ubuntu 向けに Apt パッケージを提供しています。このパッケージは一般的に最新の状態に保たれています。リポジトリをホスティングしている [Buildkite](https://buildkite.com/organizations/helm-linux/packages/registries/helm-debian) に感謝します。

```console
sudo apt-get install curl gpg apt-transport-https --yes
curl -fsSL https://packages.buildkite.com/helm-linux/helm-debian/gpgkey | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/helm.gpg] https://packages.buildkite.com/helm-linux/helm-debian/any/ any main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### dnf/yum から（Fedora）

Fedora 35 以降、Helm は公式リポジトリから利用可能です。次のコマンドでインストールできます。

```console
sudo dnf install helm
```

### Snap から

[Snapcrafters](https://github.com/snapcrafters) コミュニティが [Helm パッケージ](https://snapcraft.io/helm)の Snap バージョンをメンテナンスしています。

```console
sudo snap install helm --classic
```

### pkg から（FreeBSD）

FreeBSD コミュニティのメンバーが [FreeBSD Ports Collection](https://man.freebsd.org/ports) に [Helm パッケージ](https://www.freshports.org/sysutils/helm)を提供しています。このパッケージは一般的に最新の状態に保たれています。

```console
pkg install helm
```

### 開発ビルド

リリースバージョンに加えて、Helm の開発スナップショットをダウンロードまたはインストールできます。

### Canary ビルドから

「Canary」ビルドは、最新の `main` ブランチからビルドされた Helm のバージョンです。これらは公式リリースではなく、安定していない可能性があります。ただし、最新機能をテストする機会を提供します。

Canary Helm バイナリは `get.helm.sh` にあります。一般的なビルドへのリンクは次のとおりです。

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [Experimental Windows AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### ソースから（Linux、macOS）

ソースから Helm をビルドするには多少の手間がかかりますが、最新の（プレリリース）Helm バージョンをテストする場合には最適な方法です。

動作する Go 環境が必要です。

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

必要に応じて依存関係を取得してキャッシュし、設定を検証します。その後、`helm` をコンパイルして `bin/helm` に配置します。

## まとめ

ほとんどの場合、インストールはビルド済みの `helm` バイナリを取得するだけで完了します。このドキュメントでは、Helm でより高度なことを行いたい方向けの追加オプションについて説明しました。

Helm クライアントのインストールが完了したら、Helm を使用して chart を管理し、[chart リポジトリを初期化](/intro/quickstart.md#initialize-a-helm-chart-repository)できます。
