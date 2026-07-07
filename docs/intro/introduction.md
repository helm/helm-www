---
title: Introduction to Helm
description: A conceptual overview of what Helm is, why you use it, who it is for, and how it works.
sidebar_position: 1
---

# Introduction to Helm

Helm is the package manager for Kubernetes.
It helps you define, install, and upgrade applications on a Kubernetes cluster,
from a single container to an application with many interdependent parts.

Deploying an application to Kubernetes means writing and maintaining many
manifests: Deployments, Services, ConfigMaps, and more.
Managing those files by hand across environments and versions is repetitive and
error prone.
Helm packages these related manifests into a single unit called a _chart_,
which you can version, share, install, and roll back as one release.
This lets you treat an application the way a system package manager such as
Homebrew, apt, or yum treats software on an operating system.

## What can Helm do?

You can use Helm to:

- **Install and manage applications.** Deploy off-the-shelf applications, such
  as databases, monitoring stacks, and ingress controllers, from a chart
  instead of assembling manifests yourself.
- **Package and share your own applications.** Bundle your Kubernetes resources
  into a chart, version it, and distribute it to your team or the wider
  community.
- **Configure applications per environment.** Supply different values to the
  same chart to deploy to development, staging, and production without
  duplicating manifests.
- **Upgrade and roll back safely.** Move a release to a new version, and return
  to a previous revision when an upgrade does not go as planned.
- **Manage dependencies.** Declare the other charts your application needs, and
  let Helm install them together.

## Who is Helm For?

A Helm user often performs one of several roles.
One person can perform more than one of these roles, and how the roles map to
people varies between organizations.
These roles are drawn from the Helm [User Profiles](/community/user-profiles).

- **Application operator.** You take an application and run it inside a
  Kubernetes cluster, such as operating WordPress and its MySQL database.
  This role differs from a cluster operator, who runs the cluster itself.
- **Application distributor.** You package an application so that someone else
  can operate it, as the maintainers of community charts do.
- **Application developer.** You write the software for an application, and are
  typically not concerned with where it runs.
- **Supporting tool developer.** You build tools that work alongside Helm, such
  as a linter or a Helm plugin.

Helm focuses on the application running in the cluster rather than the cluster
itself.
Standing up and operating a Kubernetes cluster, including its control plane and
nodes, is the work of a cluster operator and falls outside Helm's scope.

## Key Components

Three components describe how Helm works: charts, repositories, and releases.
Helm installs charts into Kubernetes, creating a new release for each
installation, and you find new charts by searching Helm chart repositories.

### Chart

A _chart_ is a Helm package.
It contains all of the resource definitions needed to run an application, tool,
or service inside a Kubernetes cluster.
Think of it as the Kubernetes equivalent of a Homebrew formula, an apt `dpkg`,
or a yum RPM file.
To learn how to build one, see the [Charts guide](/topics/charts.mdx).

### Repository

A _repository_ is the place where charts are collected and shared.
It works like Perl's [CPAN archive](https://www.cpan.org) or the
[Fedora Package Database](https://src.fedoraproject.org/), but for Kubernetes
packages.
You can find publicly available charts on [Artifact Hub](https://artifacthub.io),
which lists charts from many repositories.
For more information about hosting charts, see the
[Chart Repository guide](/topics/chart_repository.md).

### Release

A _release_ is an instance of a chart running in a Kubernetes cluster.
You can install one chart many times into the same cluster, and each
installation creates a new release with its own release name.
For example, if you want two databases running in your cluster, you can install
a MySQL chart twice, and each installation is tracked as a separate release.

When Helm creates a release, it merges a _configuration_ into the chart:
the set of values, typically from a `values.yaml` file.
Supplying different values to the same chart produces different releases.

## Architecture

Helm is a command-line tool that runs on your local machine and talks to the
[Kubernetes API server](https://kubernetes.io/docs/concepts/overview/kubernetes-api/).

Helm is built in two distinct parts:

- **The Helm client** is the command-line tool for end users.
  It handles local chart development, manages repositories, manages releases,
  and sends charts to the Helm library to be installed, upgraded, or
  uninstalled.
- **The Helm library** provides the logic that carries out Helm operations.
  It creates releases, and it installs, upgrades, and uninstalls charts by
  interacting with the Kubernetes API server.
  Because the library is standalone, other clients can reuse the same logic.

The Helm client and library are written in the [Go](https://go.dev) programming
language, and the library uses the Kubernetes client library to communicate with
Kubernetes over REST and JSON.
Helm stores release information in Kubernetes
[Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) inside the
cluster, so it does not need its own database.
Configuration files are written in [YAML](https://yaml.org) where possible.

## Next Steps

- Follow the [Quickstart Guide](/intro/quickstart.md) to install Helm and deploy
  your first chart.
- Read [Using Helm](/intro/using_helm.mdx) for a walkthrough of the everyday
  Helm commands.
- Explore the [Chart Template Guide](/chart_template_guide/index.mdx) to start
  building your own charts.
