---
title: "Examples"
description: "Examples various features if the Helm SDK"
weight: 2
---

This document runs though a series of examples of using the Helm SDK.
Intended to document various SDK functionalities.

The final example shows `main.go` driver ([link](#driver)). That runs the below actions and includes necessary helper functions.

The code for the examples lives in the [helm/helm-www/sdkexamples/](https://github.com/helm/helm-www/sdkexamples) directory.
And is intended to be fully functional.

## Actions


### Install Action

This example installs the given chart/release, for the given version and values:

{{< highlightexamplego file="sdkexamples/install.go" >}}

### Upgrade Action

This example upgrades the given release, with the given chart, version and values:

{{< highlightexamplego file="sdkexamples/upgrade.go" >}}

### Uninstall Action

This example uninstalls the given release

{{< highlightexamplego file="sdkexamples/uninstall.go" >}}

### List Action

This example lists all released charts (in the currently configured namespace)

{{< highlightexamplego file="sdkexamples/list.go" >}}

### Pull Action

This example pulls a chart from an OCI repository

{{< highlightexamplego file="sdkexamples/pull.go" >}}

## Driver

The driver here shows the necessary auxillary functions needed for the Helm SDK actions to function. And shows the above examples in action, to pull, install, update, and uninstall the 'podinfo' chart from an OCI repository.

{{< highlightexamplego file="sdkexamples/main.go" >}}
