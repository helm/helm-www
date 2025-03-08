---
title: "Introduction"
description: "Introduces the Helm Go SDK"
aliases: ["/docs/gosdk"]
weight: 1
---
Helm's Go SDK enables custom software to leverage Helm charts and Helm's functionality for managing Kubernetes software deployment
(In fact, the Helm CLI is effectively just one such tool!)

Currently, the SDK has been functionally separated from the Helm CLI.
And the SDK can (and is) used by standalone tooling.
The Helm project has committed to API stability for the SDK.
As a warning, the SDK has some rough edges remaining from the initial work to separate the CLI and the SDK. Which the Helm project aims to improve and over time.

Full API documentation can be found at [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3).

A brief overview of some of the main types of packages and a simple example follows below.
See the [Examples](./examples.md) section for more examples and a more full featured 'driver'.

## Main package overview

- [pkg/action](https://pkg.go.dev/helm.sh/helm/v3/pkg/action):
  Contains the main “client” for performing Helm actions.
  This is the same package that the CLI is using underneath the hood.
  If you just need to perform basic Helm commands from another Go program, this package is for you
- [pkg/chart](https://pkg.go.dev/helm.sh/helm/v3/pkg/chart), [pkg/chartutil](https://pkg.go.dev/helm.sh/helm/v3/pkg/chartutil):
  Methods and helpers used for loading and manipulating charts
- [pkg/cli](https://pkg.go.dev/helm.sh/helm/v3/pkg/cli) and its subpackages:
  Contains all the handlers for the standard Helm environment variables and its subpackages contain output and values file handling
- [pkg/release](https://pkg.go.dev/helm.sh/helm/v3/pkg/release):
  Defines the `Release` object and statuses

There are many more packages besides these, so go check out the documentation for more information!

### Simple example
This is a simple example of doing a `helm list` using the Go SDK.
See the [Examples](./examples.md) section for more full featured examples.

```go
package main

import (
    "log"
    "os"

    "helm.sh/helm/v3/pkg/action"
    "helm.sh/helm/v3/pkg/cli"
)

func main() {
    settings := cli.New()

    actionConfig := new(action.Configuration)
    // You can pass an empty string instead of settings.Namespace() to list
    // all namespaces
    if err := actionConfig.Init(settings.RESTClientGetter(), settings.Namespace(), os.Getenv("HELM_DRIVER"), log.Printf); err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    client := action.NewList(actionConfig)
    // Only list deployed
    client.Deployed = true
    results, err := client.Run()
    if err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    for _, rel := range results {
        log.Printf("%+v", rel)
    }
}

```


## Compatibility

The Helm SDK explicitly follows the Helm backwards compatibility guarantees:

<https://github.com/helm/community/blob/main/hips/hip-0004.md>

That is, break changes will only be made over major versions.
