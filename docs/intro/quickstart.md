---
title: Quickstart Guide
description: How to install and get started with Helm including instructions for distros, FAQs, and plugins.
sidebar_position: 1
---

This guide covers how you can quickly get started using Helm.

## Prerequisites

The following prerequisites are required for a successful and properly secured
use of Helm.

1. A Kubernetes cluster
2. Deciding what security configurations to apply to your installation, if any
3. Installing and configuring Helm.

### Install Kubernetes or have access to a cluster

- You must have Kubernetes installed. For the latest release of Helm, we
  recommend the latest stable release of Kubernetes, which in most cases is the
  second-latest minor release.
- You should also have a local configured copy of `kubectl`.

See the [Helm Version Support Policy](https://helm.sh/docs/topics/version_skew/) for the maximum version skew supported between Helm and Kubernetes.

## Install Helm

Download a binary release of the Helm client. You can use tools like `homebrew`,
or look at [the official releases page](https://github.com/helm/helm/releases).

For more details, or for other options, see [the installation guide](/intro/install.mdx).

## Initialize a Helm Chart Repository

Once you have Helm ready, you typically add a chart repository. Check [Artifact
Hub](https://artifacthub.io/packages/search?kind=0) for available Helm chart
repositories.

> **Note:** Popular repositories include Bitnami and other third-party providers. While these are excellent sources for production-ready charts, this guide will focus on creating a local chart or using an OCI-based chart to ensure a stable, self-contained quickstart experience.

## Install an Example Chart

To install a chart, you can run the `helm install` command. Helm has several
ways to find and install a chart, including directly from OCI registries or local files.

For this guide, we will generate a simple chart using `helm create`, which produces a basic NGINX chart:

```console
$ helm create hello-world
Creating hello-world
```

Now, install the chart:

```console
$ helm install my-nginx ./hello-world
NAME: my-nginx
LAST DEPLOYED: Tue Jan 13 15:07:42 2026
NAMESPACE: default
STATUS: deployed
REVISION: 1
DESCRIPTION: Install complete
NOTES: ...
```

In the example above, the `hello-world` chart was installed, and the name of
our new release is `my-nginx`.

You get a simple idea of the features of this chart by running `helm show
chart ./hello-world`. Or you could run `helm show all ./hello-world` to get all
information about the chart.

Whenever you install a chart, a new release is created. So one chart can be
installed multiple times into the same cluster. And each can be independently
managed and upgraded.

The `helm install` command is a very powerful command with many capabilities. To
learn more about it, check out the [Using Helm Guide](/intro/using_helm.mdx)

## Learn About Releases

It's easy to see what has been released using Helm:

```console
$ helm list
NAME    	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART            	APP VERSION
my-nginx	default  	1       	2026-01-13 15:07:42.283059 +0100 CET	deployed	hello-world-0.1.0	1.16.0
```

The `helm list` (or `helm ls`) function will show you a list of all deployed releases.

## Uninstall a Release

To uninstall a release, use the `helm uninstall` command:

```console
$ helm uninstall my-nginx
release "my-nginx" uninstalled
```

This will uninstall `my-nginx` from Kubernetes, which will remove all
resources associated with the release as well as the release history.

If the flag `--keep-history` is provided, release history will be kept. You will
be able to request information about that release:

```console
$ helm status my-nginx
Status: UNINSTALLED
...
```

Because Helm tracks your releases even after you've uninstalled them, you can
audit a cluster's history, and even undelete a release (with `helm rollback`).

## Reading the Help Text

To learn more about the available Helm commands, use `helm help` or type a
command followed by the `-h` flag:

```console
$ helm get -h
```
