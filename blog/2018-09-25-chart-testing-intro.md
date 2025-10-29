---
title: "Using the Community Chart Testing Tools Yourself"
slug: "chart-testing-intro"
date: "2018-09-25"
---

The Helm community charts, [available as the stable and incubator repositories](https://github.com/helm/charts), have long had testing. That testing has grown and improved a significant amount in the past year; from Helm linting and testing if an application runs in a cluster to now include YAML linting, some validation on maintainers, `Chart.yaml` schema validation, tests on chart version increments, and more.  <!-- truncate -->

These testing tools are useful for more than the community charts. They could be used in development workflows, in other testing systems, and for private charts. To make the testing more accessible we (mostly [Reinhard Nägele](https://github.com/unguiculus/)) refactored the tools into a container image that can be run outside of the community charts testing infrastructure.

This new image is now available as the [Chart Testing project](https://github.com/helm/chart-testing). This project is built and maintained by the Helm Charts Maintainers, powers the community chart testing process, and is being used elsewhere.

## Example: Locally on Mac

One of the easiest ways to take a look at it is to try it out locally. To aid with that, one of the [examples provided by the project shows you how to use it with Docker for Mac](https://github.com/helm/chart-testing/tree/main/examples/docker-for-mac) with the [charts repository](https://github.com/helm/charts). An easy way to try it out is to make a change to a chart and run the following command from the root of the charts directory:

    $ /path/to/chart-testing/examples/docker-for-mac/my_test.sh

To illustrate this I added a tag in the `Chart.yaml` file of the mariadb chart without incrementing the chart version. Running the test produced the following output:

    Cluster "docker-for-desktop-cluster" set.
    Cluster "docker-for-desktop-cluster" set.
    Switched to context "docker-for-desktop".

    --------------------------------------------------------------------------------
    Environment:
    REMOTE=k8s
    TARGET_BRANCH=master
    CHART_DIRS=stable incubator
    EXCLUDED_CHARTS=common
    CHART_REPOS=incubator=https://kubernetes-charts-incubator.storage.googleapis.com/
    TIMEOUT=600
    LINT_CONF=/testing/etc/lintconf.yaml
    CHART_YAML_SCHEMA=/testing/etc/chart_schema.yaml
    VALIDATE_MAINTAINERS=true
    GITHUB_INSTANCE=https://github.com
    CHECK_VERSION_INCREMENT=true
    --------------------------------------------------------------------------------

    Charts to be installed and tested: stable/mariadb
    Initializing Helm client...
    Creating /root/.helm
    Creating /root/.helm/repository
    Creating /root/.helm/repository/cache
    Creating /root/.helm/repository/local
    Creating /root/.helm/plugins
    Creating /root/.helm/starters
    Creating /root/.helm/cache/archive
    Creating /root/.helm/repository/repositories.yaml
    Adding stable repo with URL: https://kubernetes-charts.storage.googleapis.com
    Adding local repo with URL: http://127.0.0.1:8879/charts
    $HELM_HOME has been configured at /root/.helm.
    Not installing Tiller due to 'client-only' flag having been set
    Happy Helming!
    "incubator" has been added to your repositories

    --------------------------------------------------------------------------------
    Processing chart 'stable/mariadb'...
    --------------------------------------------------------------------------------

    Validating chart 'stable/mariadb'...
    Checking chart 'stable/mariadb' for a version bump...
    Chart version on k8s/master : 5.0.3
    New chart version:  5.0.3
    ERROR: Chart version not ok. Needs a version bump.
    Linting 'stable/mariadb/Chart.yaml'...
    Linting 'stable/mariadb/values.yaml'...
    Validating Chart.yaml
    Validating /workdir/stable/mariadb/Chart.yaml...
    Validation success! 👍
    Validating maintainers
    Verifying maintainer 'bitnami-bot'...
    ERROR: Chart validation failed.
    Building dependencies for chart 'stable/mariadb'...
    No requirements found in stable/mariadb/charts.
    Chart does not provide test values. Using defaults...
    Linting chart 'stable/mariadb'...
    ==> Linting stable/mariadb
    Lint OK

    1 chart(s) linted, no failures
    --------------------------------------------------------------------------------
    ✖︎ stable/mariadb
    --------------------------------------------------------------------------------

You'll notice the chart failed to pass testing because the version was not incremented.

## Configurable

While the testing image contains defaults, it is configurable so it can be used without any association to the community charts setup. The [configuration is handled via environment variables which are documented in the README.md file](https://github.com/helm/chart-testing/blob/main/README.md#configuration).

For example, if you wanted to skip checking for a version increment on the chart for every change you can set `CHECK_VERSION_INCREMENT` to `false`. This will skip that check and is useful for cases where every change to a chart is not released.

## Example: Using It with CircleCI

Linting, without trying to operate the chart, is easy to incorporate into a workflow. The following is a simple example CircleCI configuration to do so:

    version: 2
    jobs:
      lint-charts:
        docker:
          - image: quay.io/helmpack/chart-testing:v1.1.0
        steps:
          - checkout
          - run:
              name: lint
              command: |
                chart_test.sh --config .testenv --no-install
    workflows:
      version: 2
      lint:
        jobs:
          - lint-charts

In this case the environment variables for the configuration are stored in a file name `.testenv`. This file holds the environment variables and is sourced into the environment. The following is an example from the community charts:

    # The name of the Git remote
    REMOTE=k8s

    # The name of the Git target branch
    TARGET_BRANCH=master

    # Chart directories separated by a space
    CHART_DIRS=(
        stable
        incubator
    )

    # Charts that should be skipped
    EXCLUDED_CHARTS=(
        common
    )

    # Additional chart repos to add (<name>=<url>), separated by a space
    CHART_REPOS=(
        incubator=https://kubernetes-charts-incubator.storage.googleapis.com/
    )

    TIMEOUT=600

## Try It in Your Workflow

This toolchain, wrapped in a container image, is meant to be used in a wide variety of workflows. Please take it for a spin, give it a try, use it in your workflows, and provide feedback.
