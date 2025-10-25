---
title: Helm のインストール
description: Helm をインストールして実行する方法を学びます。
sidebar_position: 2
---

このガイドでは、Helm CLI のインストール方法を示します。Helm はソースから、またはビルド済みのバイナリリリースから
インストールできます。

## Helm プロジェクトから

Helm プロジェクトは、Helm をフェッチしてインストールする2つの方法を提供します。
これらは Helm リリースを取得するための公式の方法です。さらに、Helm コミュニティは、
さまざまなパッケージマネージャーを通じて Helm をインストールする方法を提供しています。
これらの方法によるインストールは、公式の方法の下にあります。

### バイナリリリースから

Helm のすべての [リリース](https://github.com/helm/helm/releases) は、さまざまな OS のバイナリリリースを提供します。
これらのバイナリバージョンは、手動でダウンロードして
インストールできます。

1. [任意のバージョン](https://github.com/helm/helm/releases)をダウンロードします
2. ダウンロードしたパッケージを展開します (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. 展開したディレクトリで `helm` バイナリを見つけ、
   目的の場所に移動します (`mv linux-amd64/helm /usr/local/bin/helm`)

そこから、クライアントを実行し、[Stable リポジトリを追加](/intro/quickstart.md#initialize-a-helm-chart-repository)できるはずです: `helm help` を参考

**注**: Helm 自動テストは、GitHub Actions のビルドとリリース中にのみLinux AMD64 に対して実行されます。
他の OS のテストは、
対象の OS の Helm を要求するコミュニティの責任の元で行われています。

### スクリプトから

Helm に、最新バージョンの Helm を自動的に取得して
[ローカルにインストールする](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3)
インストーラースクリプトが追加されました。

そのスクリプトをフェッチして、ローカルで実行できます。
十分に文書化されているため、実行する前にそれを読んで何が行われているかを理解できます。

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

もちろん、
最新版で実施したい場合は、
`curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash` を使用できます。


## パッケージマネージャーを使用したインストール

Helm コミュニティは、オペレーティングシステムのパッケージマネージャーを介して Helm をインストールする機能を提供します。
これらは Helm プロジェクトではサポートされておらず、
信頼できるサードパーティとは見なされません。

### Homebrew から (macOS)

Helm コミュニティのメンバーは、Homebrew に Helm フォーミュラビルドを提供しています。
この式は一般に最新です。

```console
brew install helm
```

(注: 別のプロジェクトである emacs-helm の式もあります。)

### Chocolatey から (Windows)

Helm コミュニティのメンバーが [Chocolatey](https://chocolatey.org/) に
[Helm パッケージ](https://chocolatey.org/packages/kubernetes-helm) のビルドを提供しました。
このパッケージは一般に最新です。

```console
choco install kubernetes-helm
```

### Winget から (Windows)

Helm コミュニティのメンバーが [Winget](https://learn.microsoft.com/en-us/windows/package-manager/) に
[Helm パッケージ](https://github.com/microsoft/winget-pkgs/tree/master/manifests/h/Helm/Helm) のビルドを提供しました。
このパッケージは一般に最新です。

```console
winget install Helm.Helm
```

### Apt から (Debian/Ubuntu)

Helm コミュニティのメンバーは、Apt の Helm パッケージ を提供しています。
このパッケージは一般に最新です。

```console
sudo apt-get install curl gpg apt-transport-https --yes
curl -fsSL https://packages.buildkite.com/helm-linux/helm-debian/gpgkey | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/helm.gpg] https://packages.buildkite.com/helm-linux/helm-debian/any/ any main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### Snap から

[Snapcrafters](https://github.com/snapcrafters) コミュニティは、
[Helm パッケージ](https://snapcraft.io/helm)の Snap バージョンを維持しています。

```console
sudo snap install helm --classic
```

### Development ビルド

リリースに加えて、Helm の開発スナップショットをダウンロードまたはインストールできます。

### Canary ビルドから

"Canary" ビルドは、最新のマスターブランチからビルドされた Helm ソフトウェアのバージョンです。
これらは公式リリースではなく、安定しない可能性があります。
ただし、これらは最先端の機能をテストする機会を提供します。

Canary Helm バイナリは [get.helm.sh](https://get.helm.sh) に保存されます。
一般的なビルドへのリンクは次のとおりです。

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [Experimental Windows
  AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### Source から (Linux, macOS)

ソースか Helm をビルドするのは少し手間がかかりますが、
最新の (プレリリース) Helm バージョンをテストする場合に最適な方法です。

Go 環境が動作している必要があります。

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

必要に応じて、依存関係をフェッチしてキャッシュし、構成を検証します。
次に、`helm` をコンパイルして `bin/helm` に配置します。

## まとめ

ほとんどの場合、インストールは、事前に構築された `helm` バイナリを取得するのと同じくらい簡単です。
このドキュメントでは、Helm でより高度なことを実行したい人のための
追加のケースについて説明します。

Helm クライアントが正常にインストールされたら、Helm を使用してチャートを管理し、
[Stable リポジトリを追加](/intro/quickstart.md#initialize-a-helm-chart-repository) できます。
