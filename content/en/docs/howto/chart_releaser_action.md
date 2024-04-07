---
title: "Chart Releaser Action to Automate GitHub Page Charts"
description: "Describe how to use Chart Releaser Action to automate releasing charts through GitHub pages."
weight: 3
---

This guide describes how to use [Chart Releaser
Action](https://github.com/marketplace/actions/helm-chart-releaser) to automate
releasing charts through GitHub pages.  Chart Releaser Action is a GitHub Action
workflow to turn a GitHub project into a self-hosted Helm chart repo, using
[helm/chart-releaser](https://github.com/helm/chart-releaser) CLI tool.

## Repository Changes

Create a Git repository under your GitHub organization.  You could give the name
of the repository as `helm-charts`, though other names are also acceptable.  The
sources of all the charts can be placed under the `main` branch.  The charts
should be placed under `/charts` directory at the top-level of the directory
tree.

There should be another branch named `gh-pages` to publish the charts.  The
changes to that branch will be automatically created by the Chart Releaser
Action described here.  However, you can create that `gh-branch` and add
`README.md` file, which is going to be visible to the users visiting the page.

You can add instruction in the `README.md` for charts installation like this
(replace `<alias>`, `<orgname>`, and `<chart-name>`):

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

    helm delete my-<chart-name>
```

The charts will be published to a website with URL like this:

    https://<orgname>.github.io/helm-charts

## GitHub Actions Workflow

Create GitHub Actions workflow file in the `main` branch at
`.github/workflows/release.yml`

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

The above configuration uses
[@helm/chart-releaser-action](https://github.com/helm/chart-releaser-action) to
turn your GitHub project into a self-hosted Helm chart repo.  It does this -
during every push to main - by checking each chart in your project, and whenever
there's a new chart version, creates a corresponding GitHub release named for
the chart version, adds Helm chart artifacts to the release, and creates or
updates an `index.yaml` file with metadata about those releases, which is then
hosted on GitHub pages.

The Chart Releaser Action version number used in the above example is `v1.6.0`.
You can change it to the [latest available
version](https://github.com/helm/chart-releaser-action/releases).

Note: The Chart Releaser Action is almost always used in tandem with the [Helm Testing
Action](https://github.com/marketplace/actions/helm-chart-testing) and [Kind
Action](https://github.com/marketplace/actions/kind-cluster).
