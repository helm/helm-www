---
title: "Chart发布操作用以自动化GitHub的页面Chart"
description: "描述如何使用Chart发布操作通过GitHub页面自动发布chart。"
weight: 3
---

该指南描述了如何使用[Chart发布操作](https://github.com/marketplace/actions/helm-chart-releaser)
通过GitHub页面自动发布chart。Chart发布操作是一个将GitHub项目转换成自托管Helm chart仓库的GitHub操作流。使用了
[helm/chart-releaser](https://github.com/helm/chart-releaser) CLI 工具。

## 仓库变化

在你的GitHub组织下创建一个Git仓库。可以将其命名为`helm-charts`，当然其他名称也可以接受。所有chart的资源都可以放在主分支。
chart应该放在根目录下的`/charts`目录中。

还应该有另一个分支 `gh-pages` 用于发布chart。这个分支的更改会通过Chart发布操作自动创建。同时可以创建一个
`gh-branch`分支并添加`README.md`文件，其对访问该页面的用户是可见的。

你可以在`README.md`中为chart的安装添加说明，像这样：
（替换 `<alias>`， `<orgname>` 和 `<chart-name>`）:

```text
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

    helm delete my-<chart-name>
```

发布后的chart的url类似这样：

`https://<orgname>.github.io/helm-charts`

## GitHub 操作流

在主分支创建一个GitHub操作流文件 `.github/workflows/release.yml`

```text
name: Release Charts

on:
  push:
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Configure Git
        run: |
          git config user.name "$GITHUB_ACTOR"
          git config user.email "$GITHUB_ACTOR@users.noreply.github.com"

      - name: Run chart-releaser
        uses: helm/chart-releaser-action@v1.5.0
        env:
          CR_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
```

上述配置使用了[@helm/chart-releaser-action](https://github.com/helm/chart-releaser-action)
将GitHub项目转换成自托管的Helm chart仓库。在每次想主分支推送后会通过检查项目中的每个chart来执行次操作，
且每当有新的chart版本时，会创建一个与chart版本对应的GitHub版本，添加Helm chart组件到这个版本中，
并用该版本的元数据创建或更新一个`index.yaml`文件，然后托管在GitHub页面上。

上述Chart发布操作示例使用的版本号是`v1.5.0`。你可以将其改成[最新可用版本](https://github.com/helm/chart-releaser-action/releases)。

注意：Chart发布操作程序几乎总是和 [Helm测试操作Action](https://github.com/marketplace/actions/helm-chart-testing)
以及[Kind操作](https://github.com/marketplace/actions/kind-cluster)。
