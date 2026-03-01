---
title: Chart Releaser Action으로 GitHub Pages 차트 릴리스 자동화하기
description: Chart Releaser Action을 사용하여 GitHub Pages를 통해 차트 릴리스를 자동화하는 방법을 설명합니다.
sidebar_position: 3
---

이 가이드는 [Chart Releaser Action](https://github.com/marketplace/actions/helm-chart-releaser)을 사용하여 GitHub Pages를 통해 차트 릴리스를 자동화하는 방법을 설명합니다. Chart Releaser Action은 [helm/chart-releaser](https://github.com/helm/chart-releaser) CLI 도구를 활용하여 GitHub 프로젝트를 자체 호스팅 Helm 차트 리포지토리로 전환해 주는 GitHub Action 워크플로우입니다.

## 리포지토리 설정

GitHub 조직 아래에 Git 리포지토리를 생성합니다. 리포지토리 이름은 `helm-charts`로 지정할 수 있지만, 다른 이름도 사용 가능합니다. 모든 차트의 소스는 `main` 브랜치에 배치할 수 있습니다. 차트는 최상위 `/charts` 디렉터리에 위치해야 합니다.

차트를 게시하려면 `gh-pages`라는 이름의 별도 브랜치가 필요합니다. 이 브랜치에 대한 변경 사항은 Chart Releaser Action이 자동으로 생성합니다. 단, 해당 `gh-pages` 브랜치를 직접 생성하고 `README.md` 파일을 추가할 수도 있으며, 이 파일은 페이지 방문자에게 표시됩니다.

`README.md`에 다음과 같은 차트 설치 안내를 추가할 수 있습니다(`<alias>`, `<orgname>`, `<chart-name>`을 실제 값으로 바꿔주세요):

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

차트는 다음과 같은 URL의 웹사이트에 게시됩니다:

    https://<orgname>.github.io/helm-charts

## GitHub Actions 워크플로우

`main` 브랜치의 `.github/workflows/release.yml` 경로에 GitHub Actions 워크플로우 파일을 생성합니다.

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

위 설정은 [@helm/chart-releaser-action](https://github.com/helm/chart-releaser-action)을 사용하여 GitHub 프로젝트를 자체 호스팅 Helm 차트 리포지토리로 전환합니다. main 브랜치에 푸시할 때마다 프로젝트의 각 차트를 확인하고, 새로운 차트 버전이 발견되면 해당 버전 이름으로 GitHub 릴리스를 생성합니다. 그런 다음 Helm 차트 아티팩트를 릴리스에 추가하고, 릴리스 메타데이터가 포함된 `index.yaml` 파일을 생성하거나 업데이트합니다. 이 파일은 GitHub Pages에서 호스팅됩니다.

위 예제에서 사용된 Chart Releaser Action 버전은 `v1.6.0`입니다. [최신 버전](https://github.com/helm/chart-releaser-action/releases)으로 변경할 수 있습니다.

참고: Chart Releaser Action은 거의 항상 [Helm Testing Action](https://github.com/marketplace/actions/helm-chart-testing) 및 [Kind Action](https://github.com/marketplace/actions/kind-cluster)과 함께 사용됩니다.
