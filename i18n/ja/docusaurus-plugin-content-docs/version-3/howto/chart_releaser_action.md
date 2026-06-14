---
title: Chart Releaser Action による GitHub Pages での chart 自動公開
description: Chart Releaser Action を使用して GitHub Pages で chart を自動公開する方法について説明します。
sidebar_position: 3
---

このガイドでは、[Chart Releaser Action](https://github.com/marketplace/actions/helm-chart-releaser) を使用して GitHub Pages で chart を自動公開する方法について説明します。Chart Releaser Action は、[helm/chart-releaser](https://github.com/helm/chart-releaser) CLI ツールを使用して、GitHub プロジェクトをセルフホスト型の Helm chart リポジトリに変換する GitHub Action ワークフローです。

## リポジトリの構成

GitHub 組織の下に Git リポジトリを作成します。リポジトリ名は `helm-charts` などが考えられますが、他の名前でも問題ありません。すべての chart のソースは `main` ブランチに配置できます。chart はディレクトリツリーのトップレベルにある `/charts` ディレクトリに配置してください。

chart の公開用に `gh-pages` という別のブランチが必要です。このブランチへの変更は、後述する Chart Releaser Action によって自動的に作成されます。ただし、事前に `gh-pages` ブランチを作成し、ページを訪れるユーザーに表示される `README.md` ファイルを追加することもできます。

`README.md` に chart のインストール手順を追加できます（`<alias>`、`<orgname>`、`<chart-name>` を適切な値に置き換えてください）:

```
## Usage

[Helm](https://helm.sh) must be installed to use the charts.  Please refer to
Helm's [documentation](https://helm.sh/docs) to get started.

Once Helm has been set up correctly, add the repo as follows:

  helm repo add <alias> https://<orgname>.github.io/helm-charts

If you had already added this repo earlier, run `helm repo update` to retrieve
the latest versions of the packages.  You can then run `helm search repo
<alias>` to see the charts.

To install the <chart-name> chart:

    helm install my-<chart-name> <alias>/<chart-name>

To uninstall the chart:

    helm uninstall my-<chart-name>
```

chart は次のような URL の Web サイトに公開されます:

    https://<orgname>.github.io/helm-charts

## GitHub Actions ワークフロー

`main` ブランチの `.github/workflows/release.yml` に GitHub Actions ワークフローファイルを作成します。

```
name: Release Charts

on:
  push:
    branches:
      - main

jobs:
  release:
    permissions:
      contents: write
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Configure Git
        run: |
          git config user.name "$GITHUB_ACTOR"
          git config user.email "$GITHUB_ACTOR@users.noreply.github.com"

      - name: Run chart-releaser
        uses: helm/chart-releaser-action@v1.6.0
        env:
          CR_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
```

上記の設定では、[@helm/chart-releaser-action](https://github.com/helm/chart-releaser-action) を使用して GitHub プロジェクトをセルフホスト型の Helm chart リポジトリに変換します。main ブランチへのプッシュのたびに、プロジェクト内の各 chart をチェックします。新しい chart バージョンがある場合は、chart バージョンを名前とする GitHub release を作成し、Helm chart アーティファクトをその release に追加します。さらに、リリースに関するメタデータを含む `index.yaml` ファイルを作成または更新し、GitHub Pages でホストします。

上記の例で使用している Chart Releaser Action のバージョンは `v1.6.0` です。[最新の利用可能なバージョン](https://github.com/helm/chart-releaser-action/releases)に変更できます。

補足: Chart Releaser Action は、ほぼ常に [Helm Testing Action](https://github.com/marketplace/actions/helm-chart-testing) および [Kind Action](https://github.com/marketplace/actions/kind-cluster) と組み合わせて使用されます。
