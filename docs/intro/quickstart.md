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

## Create Your First Chart

A quick way to get started with Helm is to create your own chart. The `helm create` command scaffolds a chart structure with templates for a basic web application:

```console
$ helm create hello-world
Creating hello-world
```

This creates a `hello-world` directory containing a chart that deploys an nginx container. The chart includes templates for a Deployment, Service, ServiceAccount, and optional Ingress.

You can see what's in the chart:

```console
$ ls hello-world/
Chart.yaml  charts  templates  values.yaml
```

## Install Your Chart

To install your chart, use the `helm install` command with the chart directory:

```console
$ helm install my-release ./hello-world
NAME: my-release
LAST DEPLOYED: Sat May  3 12:00:00 2026
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES: ...
```

Your chart is now installed with the release name `my-release`. Helm tracks this installation so you can upgrade, rollback, or uninstall it later.

Whenever you install a chart, a new release is created. The same chart can be
installed multiple times into the same cluster, and each installation is
independently managed.

The `helm install` command is powerful and flexible. To
learn more about it, check out the [Using Helm Guide](/intro/using_helm.mdx).

## Install a Chart from an OCI Registry

Helm can install charts directly from OCI-compliant container registries. This approach doesn't require adding a repository first.

To install a chart from an OCI registry, use the `oci://` prefix:

```console
$ helm install my-nginx oci://ghcr.io/nginxinc/charts/nginx-ingress --version 2.0.1
Pulled: ghcr.io/nginxinc/charts/nginx-ingress:2.0.1
NAME: my-nginx
LAST DEPLOYED: Sat May  3 12:05:00 2026
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES: ...
```

You can preview what a chart contains before installing:

```console
$ helm show chart oci://ghcr.io/nginxinc/charts/nginx-ingress --version 2.0.1
```

For more details on working with OCI registries, see [Use OCI-based registries](/topics/registries.md).

## Learn About Releases

It's easy to see what has been released using Helm:

```console
$ helm list
NAME       	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART            	APP VERSION
my-release 	default  	1       	2026-05-03 12:00:00.000000 +0000 UTC	deployed	hello-world-0.1.0	1.16.0
```

The `helm list` (or `helm ls`) function will show you a list of all deployed releases.

## Uninstall a Release

To uninstall a release, use the `helm uninstall` command:

```console
$ helm uninstall my-release
release "my-release" uninstalled
```

This will uninstall `my-release` from Kubernetes, which will remove all
resources associated with the release as well as the release history.

If the flag `--keep-history` is provided, release history will be kept. You will
be able to request information about that release:

```console
$ helm status my-release
Status: UNINSTALLED
...
```

Because Helm tracks your releases even after you've uninstalled them, you can
audit a cluster's history, and even undelete a release (with `helm rollback`).

## Find Charts to Install

[Artifact Hub](https://artifacthub.io/packages/search?kind=0) is the best place to discover Helm charts. It aggregates charts from hundreds of repositories and provides search, metadata, and security information.

Popular chart sources include:

- **OCI registries**: Many organizations publish charts to container registries like GitHub Container Registry, Docker Hub, or cloud provider registries. You can install these directly with the `oci://` prefix.
- **Chart repositories**: Traditional Helm repositories can be added with `helm repo add` and searched with `helm search repo`.

To search Artifact Hub from the command line:

```console
$ helm search hub wordpress
URL                                               	CHART VERSION	APP VERSION	DESCRIPTION
https://artifacthub.io/packages/helm/bitnami/...  	15.2.5       	6.1.1      	WordPress is the world's most popular blogging ...
```

## Reading the Help Text

To learn more about the available Helm commands, use `helm help` or type a
command followed by the `-h` flag:

```console
$ helm get -h
```
