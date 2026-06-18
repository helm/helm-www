---
title: 使用 Chart Releaser Action 自动发布 GitHub Pages Chart
description: 介绍如何使用 Chart Releaser Action 通过 GitHub Pages 自动发布 chart。
sidebar_position: 3
---

本指南介绍如何使用 [Chart Releaser Action](https://github.com/marketplace/actions/helm-chart-releaser) 通过 GitHub Pages 自动发布 chart。Chart Releaser Action 是一个 GitHub Action 工作流，可将 GitHub 项目转换为自托管的 Helm chart 仓库，基于 [helm/chart-releaser](https://github.com/helm/chart-releaser) CLI 工具。

## 仓库配置

在你的 GitHub 组织下创建一个 Git 仓库。可以将仓库命名为 `helm-charts`，当然其他名称也可以。所有 chart 的源代码都放在 `main` 分支，chart 应该位于根目录下的 `/charts` 目录中。

还需要另一个名为 `gh-pages` 的分支来发布 chart。该分支的内容会由 Chart Releaser Action 自动创建和更新。你也可以手动创建 `gh-pages` 分支并添加 `README.md` 文件，该文件会对访问页面的用户可见。

你可以在 `README.md` 中添加 chart 的安装说明，例如（将 `<alias>`、`<orgname>` 和 `<chart-name>` 替换为实际值）：

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

发布后的 chart 会托管在如下 URL：

    https://<orgname>.github.io/helm-charts

## GitHub Actions 工作流

在 `main` 分支创建 GitHub Actions 工作流文件 `.github/workflows/release.yml`：

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

上述配置使用 [@helm/chart-releaser-action](https://github.com/helm/chart-releaser-action) 将 GitHub 项目转换为自托管的 Helm chart 仓库。每次向 `main` 分支推送时，它会检查项目中的每个 chart，当发现新的 chart 版本时，会创建一个以该版本命名的 GitHub Release，将 Helm chart 制品添加到该 Release 中，并创建或更新 `index.yaml` 文件（包含这些 Release 的元数据），然后托管在 GitHub Pages 上。

上述示例使用的 Chart Releaser Action 版本号是 `v1.6.0`。你可以将其更改为[最新可用版本](https://github.com/helm/chart-releaser-action/releases)。

注意：Chart Releaser Action 几乎总是与 [Helm Testing Action](https://github.com/marketplace/actions/helm-chart-testing) 和 [Kind Action](https://github.com/marketplace/actions/kind-cluster) 配合使用。
