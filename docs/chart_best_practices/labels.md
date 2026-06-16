---
title: Labels and Annotations
description: Covers best practices for using labels and annotations in your Chart.
sidebar_position: 5
---

This part of the Best Practices Guide discusses the best practices for using
labels and annotations in your chart.

## Is it a Label or an Annotation?

An item of metadata should be a label under the following conditions:

- It is used by Kubernetes to identify this resource
- It is useful to expose to operators for the purpose of querying the system.

For example, we suggest using `helm.sh/chart: NAME-VERSION` as a label so that
operators can conveniently find all of the instances of a particular chart to
use.

If an item of metadata is not used for querying, it should be set as an
annotation instead.

Helm hooks are always annotations.

## Standard Labels

The following table defines common labels that Helm charts use. Helm itself
never requires that a particular label be present. Labels that are marked REC
are recommended, and _should_ be placed onto a chart for global consistency.
Those marked OPT are optional. These are idiomatic or commonly in use, but are
not relied upon frequently for operational purposes.

Name|Status|Description
-----|------|----------
`app.kubernetes.io/name` | REC | This should be the app name, reflecting the entire app. Usually `{{ template "name" . }}` is used for this. This is used by many Kubernetes manifests, and is not Helm-specific.
`helm.sh/chart` | REC | This should be the chart name and version: `{{ .Chart.Name }}-{{ .Chart.Version \| replace "+" "_" }}`.
`app.kubernetes.io/managed-by` | REC | This should always be set to `{{ .Release.Service }}`. It is for finding all things managed by Helm.
`app.kubernetes.io/instance` | REC | This should be the `{{ .Release.Name }}`. It aids in differentiating between different instances of the same application.
`app.kubernetes.io/version` | OPT | The version of the app and can be set to `{{ .Chart.AppVersion }}`.
`app.kubernetes.io/component` | OPT | This is a common label for marking the different roles that pieces may play in an application. For example, `app.kubernetes.io/component: frontend`.
`app.kubernetes.io/part-of` | OPT | When multiple charts or pieces of software are used together to make one application. For example, application software and a database to produce a website. This can be set to the top level application being supported.

You can find more information on the Kubernetes labels, prefixed with
`app.kubernetes.io`, in the [Kubernetes
documentation](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/).

## Helm Ownership Annotations

Along with the labels above, Helm adds two annotations to every resource it
manages. Together with the `app.kubernetes.io/managed-by=Helm` label, Helm uses
these annotations to record which release owns a resource and to confirm that
ownership before upgrading or uninstalling it.

Name|Description
-----|----------
`meta.helm.sh/release-name` | The name of the release that owns the resource.
`meta.helm.sh/release-namespace` | The namespace of the release that owns the resource.

Helm sets these annotations for you, so there is no need to add them to your
chart templates. If you install or upgrade a release and Helm encounters a
pre-existing resource that lacks these annotations (for example, one created
with `kubectl apply`), the operation fails because the resource is not owned by
the release. To skip the ownership check, pass the `--take-ownership` flag to
`helm install` or `helm upgrade`. Helm then adds these annotations and adopts
the existing resource into the release.
