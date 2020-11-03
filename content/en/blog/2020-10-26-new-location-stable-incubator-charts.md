---
title: "New Location For Stable and Incubator Charts"
slug: "new-location-stable-incubator-charts"
authorname: "Matt Farina"
author: "@mattfarina"
authorlink: "https://mattfarina.com"
date: "2020-10-26"
---

[As previously announced](https://helm.sh/blog/helm-turns-five/), the stable and incubator repositories have moved to a new location. This post will update you on the new locations and provide directions to start using them.

_**Important Note:** This does not affect the obsolescence timeline for the stable and incubator repositories that was announced in 2019. On November 13, 2020 the stable and incubator charts repository will reach the end of development and become archives. You can find that many of the charts have moved to other, community managed, repositories. You can discover these on the [Artifact Hub](https://artifacthub.io/). More information on the obsolescence will follow in future blog posts and communications._

The new location for the stable repository is https://charts.helm.sh/stable and the new location for the incubator repository is https://charts.helm.sh/incubator. If you use charts in either of these old locations below you MUST update the repositories you use before November 13, 2020. The new locations are hosted using GitHub pages.

| Name      | Old Location | New Location |
| --------- | ------------ | ------------ |
| stable    | https://kubernetes-charts.storage.googleapis.com | https://charts.helm.sh/stable |
| incubator | https://kubernetes-charts-incubator.storage.googleapis.com | https://charts.helm.sh/incubator |


Along with the new locations, Helm v2.17.0 and v3.4.0 have been released to help you use the new location. You are encouraged to upgrade to the latest versions.<!--more-->

## Helm v3.4.0

Helm v3.4.0 will now detect if you have the stable and incubator repository configured with the old location and warn you that you need to update your configuration to the new location. You can do this using a single command. For example, to update the stable repository that was set with the name `stable` you can run:

```
helm repo add stable https://charts.helm.sh/stable --force-update
```

This command will also work on Helm v3 versions prior to v3.4.0. You can use it without updating to the latest Helm v3 release.

In addition to that, if you try to use `helm repo add` to add one of the repositories at the old location Helm v3.4.0 and newer will fail to add the repository and warn you to use the new location. Instead of making it automatically add the new location we wanted to make people aware of the location change. If you have a reason to use one of the old locations you can use the new `--allow-deprecated-repos` flag to allow them to be used. The flag will only be useful for as long as the previous location is still operating.

## Helm v2.17.0

Helm v2 added the stable repository by default when `helm init` was run. This has led to a different solution for Helm v2, starting in v2.17.0.

If you do not need the stable or local repositories, you can use the `--skip-repos` flag when running `helm init`. This is a new flag in v2.17.0. This can have some performance benefits in some use cases such as CI systems where you aren't using the stable repository.

In v2.17.0, when `helm init` is run the new location is used instead of the old location. This is what will happen in CI systems that regularly run `helm init`. If you need to continue to use the old location, you can pass the new `--use-deprecated-stable-repository` flag to `helm init`. This will only work for as long as the old locations continue to operate.

If you already have an old location configured for the stable or incubator repository, Helm will warn you that you need to switch to the new location. Doing this in Helm v2 is a little different from v3. You will need to use two commands. For example, to change the `stable` repository you can run:

```
helm repo rm stable
helm repo add stable https://charts.helm.sh/stable
```

This command will work on Helm v2 versions prior to v2.17.0. You can use it without updating to the latest Helm v2 release.

_Note: In addition to the stable and incubator repositories moving to GitHub Pages, the default location for [Tiller has moved to GitHub Container Repository (ghcr.io)](https://github.com/orgs/helm/packages/container/package/tiller). [Tiller is still available from GCR](https://gcr.io/kubernetes-helm/tiller) (its previous home). You can also get Tiller from [Docker Hub](https://hub.docker.com/r/helmpack/tiller) and [Quay](http://quay.io/helmpack/tiller). To specify a non-default location for Tiller you can use the `-i` or `--tiller-image` flag when running `helm init`._

## Host Your Own Copy

There are cases where you may control where Helm can make network calls to and you do not want Helm to make calls to GitHub pages. One option, if you need some charts from the stable or incubator repository, is to host a copy of the chart and chart versions you need in your own repository. You could host this repository with [ChartMuseum](https://github.com/helm/chartmuseum), [Harbor](https://goharbor.io/), a static web server, or another system.

Scott Rigby, one of the Helm Org and Charts maintainers, has created [a script that can copy all or some of the charts and their histories](https://github.com/scottrigby/helm-adopt-package-history) (previous chart versions). This tool, and those like it, can be used to make copies of the charts you use. This can be served from an alternative location.

In Helm v2, you can specify an alternative location for the stable repository when running `helm init` by using the `--stable-repo-url` flag.
