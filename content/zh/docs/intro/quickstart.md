---
title: "Quickstart Guide"
description: "How to install and get started with Helm including instructions for distros, FAQs, and plugins."
weight: 1
aliases: ["/docs/quickstart/"]
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

NOTE: Kubernetes versions prior to 1.6 have limited or no support for role-based
access controls (RBAC).

## Install Helm

Download a binary release of the Helm client. You can use tools like `homebrew`,
or look at [the official releases page](https://github.com/helm/helm/releases).

For more details, or for other options, see [the installation guide]({{< ref
"install.md" >}}).

## Initialize a Helm Chart Repository

Once you have Helm ready, you can add a chart repository. One popular starting
location is the official Helm stable charts:

```console
$ helm repo add stable https://kubernetes-charts.storage.googleapis.com/
```

Once this is installed, you will be able to list the charts you can install:

```console
$ helm search repo stable
NAME                                    CHART VERSION   APP VERSION                     DESCRIPTION
stable/acs-engine-autoscaler            2.2.2           2.1.1                           DEPRECATED Scales worker nodes within agent pools
stable/aerospike                        0.2.8           v4.5.0.5                        A Helm chart for Aerospike in Kubernetes
stable/airflow                          4.1.0           1.10.4                          Airflow is a platform to programmatically autho...
stable/ambassador                       4.1.0           0.81.0                          A Helm chart for Datawire Ambassador
# ... and many more
```

## Install an Example Chart

To install a chart, you can run the `helm install` command. Helm has several
ways to find and install a chart, but the easiest is to use one of the official
`stable` charts.

```console
$ helm repo update              # Make sure we get the latest list of charts
$ helm install stable/mysql --generate-name
Released smiling-penguin
```

In the example above, the `stable/mysql` chart was released, and the name of our
new release is `smiling-penguin`.

You get a simple idea of the features of this MySQL chart by running `helm show
chart stable/mysql`. Or you could run `helm show all stable/mysql` to get all
information about the chart.

Whenever you install a chart, a new release is created. So one chart can be
installed multiple times into the same cluster. And each can be independently
managed and upgraded.

The `helm install` command is a very powerful command with many capabilities. To
learn more about it, check out the [Using Helm Guide]({{< ref "using_helm.md"
>}})

## Learn About Releases

It's easy to see what has been released using Helm:

```console
$ helm ls
NAME             VERSION   UPDATED                   STATUS    CHART
smiling-penguin  1         Wed Sep 28 12:59:46 2016  DEPLOYED  mysql-0.1.0
```

The `helm list` function will show you a list of all deployed releases.

## Uninstall a Release

To uninstall a release, use the `helm uninstall` command:

```console
$ helm uninstall smiling-penguin
Removed smiling-penguin
```

This will uninstall `smiling-penguin` from Kubernetes, which will remove all
resources associated with the release as well as the release history.

If the flag `--keep-history` is provided, release history will be kept. You will
be able to request information about that release:

```console
$ helm status smiling-penguin
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
