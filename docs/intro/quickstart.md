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

## Find Charts to Install

[Artifact Hub](https://artifacthub.io/packages/search?kind=0) is the best place to discover Helm charts. It aggregates charts from hundreds of repositories and provides search, metadata, and security information.

Popular chart sources include:

- **OCI registries**: Many organizations publish charts to container registries like GitHub Container Registry, Docker Hub, or cloud provider registries. You can install these directly with the `oci://` prefix.
- **Chart repositories**: Traditional Helm repositories can be added with `helm repo add` and searched with `helm search repo`.

To search Artifact Hub from the command line:

```console
$ helm search hub podinfo
URL                                                 CHART VERSION  APP VERSION  DESCRIPTION
https://artifacthub.io/packages/helm/podinfo/po...  6.11.2         6.11.2       Podinfo Helm chart for Kubernetes
```

## Install a Chart from an OCI Registry

Helm can install charts directly from OCI-compliant container registries. This approach doesn't require adding a repository first.

To install a chart from an OCI registry, use the `oci://` prefix:

```console
$ helm install my-podinfo oci://ghcr.io/stefanprodan/charts/podinfo --version 6.11.2
Pulled: ghcr.io/stefanprodan/charts/podinfo:6.11.2
NAME: my-podinfo
LAST DEPLOYED: Sat May  3 12:05:00 2026
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES: ...
```

To verify the installation works, forward the service port and test the endpoint:

```console
$ kubectl port-forward svc/my-podinfo 9898:9898 &
$ curl http://localhost:9898
{
  "hostname": "podinfo-6f89b4c6b5-xvwtb",
  "version": "6.7.1",
  "message": "greetings from podinfo v6.7.1",
  "goos": "linux",
  "goarch": "amd64",
  ...
}
```

You can preview what a chart contains before installing:

```console
$ helm show chart oci://ghcr.io/stefanprodan/charts/podinfo --version 6.11.2
```

For more details on working with OCI registries, see [Use OCI-based registries](/docs/topics/registries).

## Learn About Releases

It's easy to see what has been released using Helm:

```console
$ helm list
NAME       	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART         	APP VERSION
my-podinfo 	default  	1       	2026-05-03 12:05:00.000000 +0000 UTC	deployed	podinfo-6.11.2	6.7.1
```

The `helm list` (or `helm ls`) function will show you a list of all deployed releases.

## Uninstall a Release

To uninstall a release, use the `helm uninstall` command:

```console
$ helm uninstall my-podinfo
release "my-podinfo" uninstalled
```

This will uninstall `my-podinfo` from Kubernetes, which will remove all
resources associated with the release as well as the release history.

If the flag `--keep-history` is provided, release history will be kept. You will
be able to request information about that release:

```console
$ helm status my-podinfo
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
