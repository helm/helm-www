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

For more details, or for other options, see [the installation guide](/intro/install.md).

## Initialize a Helm Chart Repository

Once you have Helm ready, you can add a chart repository. Check [Artifact
Hub](https://artifacthub.io/packages/search?kind=0) for available Helm chart
repositories.

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

Once this is installed, you will be able to list the charts you can install:

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... and many more
```

## Install an Example Chart

To install a chart, you can run the `helm install` command. Helm has several
ways to find and install a chart, but the easiest is to use the `bitnami`
charts.

```console
$ helm repo update              # Make sure we get the latest list of charts
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

In the example above, the `bitnami/mysql` chart was released, and the name of
our new release is `mysql-1612624192`.

You get a simple idea of the features of this MySQL chart by running `helm show
chart bitnami/mysql`. Or you could run `helm show all bitnami/mysql` to get all
information about the chart.

Whenever you install a chart, a new release is created. So one chart can be
installed multiple times into the same cluster. And each can be independently
managed and upgraded.

The `helm install` command is a very powerful command with many capabilities. To
learn more about it, check out the [Using Helm Guide](/intro/using_helm.md)

## Learn About Releases

It's easy to see what has been released using Helm:

```console
$ helm list
NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

The `helm list` (or `helm ls`) function will show you a list of all deployed releases.

## Uninstall a Release

To uninstall a release, use the `helm uninstall` command:

```console
$ helm uninstall mysql-1612624192
release "mysql-1612624192" uninstalled
```

This will uninstall `mysql-1612624192` from Kubernetes, which will remove all
resources associated with the release as well as the release history.

If the flag `--keep-history` is provided, release history will be kept. You will
be able to request information about that release:

```console
$ helm status mysql-1612624192
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
