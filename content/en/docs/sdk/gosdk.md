---
title: "Introduction"
description: "Introduces the Helm Go SDK"
aliases: ["/docs/gosdk"]
weight: 1
---
Helm's Go SDK enables custom software to leverage Helm charts and Helm's functionality for managing Kubernetes software deployment (In fact, the Helm CLI is effectively just one such tool!)

Currently, the SDK has been functionally separated from the Helm CLI, and the SDK can (and is) used by standalone tooling. The Helm project has committed to API stability for the SDK. As a warning, the SDK has some rough edges remaining from the initial work to separate the CLI and the SDK. Which the Helm project aims to improve and over time.

Full API documentation can be found at [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3).

A brief overview of some of the main types of packages follow below.

## Main packages

### Actions

[pkg/action](https://pkg.go.dev/helm.sh/helm/v3/pkg/action) provides the main operations that Helm can action on charts. `install`, `upgrade`, `pull`, etc. These are often used one-to-one by the Helm CLI commands.

### Chartutil

[pkg/chartutil](https://pkg.go.dev/helm.sh/helm/v3/pkg/chartutil) provides high level functionality for working with Helm charts.


## Compatibility

The Helm SDK explicitly follows the Helm backwards compatibility guarantees:

<https://github.com/helm/community/blob/main/hips/hip-0004.md>

That is, break changes will only be made over major versions.
