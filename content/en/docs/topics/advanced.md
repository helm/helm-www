---
title: "Advanced Helm Techniques"
description: "Explains various advanced features for Helm power users"
aliases: ["/docs/advanced_helm_techniques"]
weight: 9
---

This section explains various advanced features and techniques for using Helm.
The information in this section is intended for "power users" of Helm that wish
to do advanced customization and manipulation of their charts and releases. Each
of these advanced features comes with their own tradeoffs and caveats, so each
one must be used carefully and with deep knowledge of Helm. Or in other words,
remember the [Peter Parker
principle](https://en.wikipedia.org/wiki/With_great_power_comes_great_responsibility)

## Post Rendering
Post rendering gives chart installers the ability to manually manipulate,
configure, and/or validate rendered manifests before they are installed by Helm.
This allows users with advanced configuration needs to be able to use tools like
[`kustomize`](https://kustomize.io) to apply configuration changes without the
need to fork a public chart or requiring chart maintainers to specify every last
configuration option for a piece of software. There are also use cases for
injecting common tools and side cars in enterprise environments or analysis of
the manifests before deployment.

### Prerequisites
- Helm 3.1+

### Usage
A post-renderer can be any executable that accepts rendered Kubernetes manifests
on STDIN and returns valid Kubernetes manifests on STDOUT. It should return an
non-0 exit code in the event of a failure. This is the only "API" between the
two components. It allows for great flexibility in what you can do with your
post-render process.

A post renderer can be used with `install`, `upgrade`, and `template`. To use a
post-renderer, use the `--post-renderer` flag with a path to the renderer
executable you wish to use:

```shell
$ helm install mychart stable/wordpress --post-renderer ./path/to/executable
```

If the path does not contain any separators, it will search in $PATH, otherwise
it will resolve any relative paths to a fully qualified path

If you wish to use multiple post-renderers, call all of them in a script or
together in whatever binary tool you have built. In bash, this would be as
simple as `renderer1 | renderer2 | renderer3`.

You can see an example of using `kustomize` as a post renderer
[here](https://github.com/thomastaylor312/advanced-helm-demos/tree/master/post-render).

### Caveats
When using post renderers, there are several important things to keep in mind.
The most important of these is that when using a post-renderer, all people
modifying that release **MUST** use the same renderer in order to have
repeatable builds. This feature is purposefully built to allow any user to
switch out which renderer they are using or to stop using a renderer, but this
should be done deliberately to avoid accidental modification or data loss.

One other important note is around security. If you are using a post-renderer,
you should ensure it is coming from a reliable source (as is the case for any
other arbitrary executable). Using non-trusted or non-verified renderers is NOT
recommended as they have full access to rendered templates, which often contain
secret data.

### Custom Post Renderers
The post render step offers even more flexibility when used in the Go SDK. Any
post renderer only needs to implement the following Go interface:

```go
type PostRenderer interface {
    // Run expects a single buffer filled with Helm rendered manifests. It
    // expects the modified results to be returned on a separate buffer or an
    // error if there was an issue or failure while running the post render step
    Run(renderedManifests *bytes.Buffer) (modifiedManifests *bytes.Buffer, err error)
}
```

For more information on using the Go SDK, See the [Go SDK section](#go-sdk)

## Go SDK
Helm 3 debuted a completely restructured Go SDK for a better experience when
building software and tools that leverage Helm. Full documentation can be found
at [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3), but
a brief overview of some of the most common packages and a simple example follow
below.

### Package overview
This is a list of the most commonly used packages with a simple explanation
about each one:

- `pkg/action`: Contains the main “client” for performing Helm actions. This is
  the same package that the CLI is using underneath the hood. If you just need
  to perform basic Helm commands from another Go program, this package is for
  you
- `pkg/{chart,chartutil}`: Methods and helpers used for loading and manipulating
  charts
- `pkg/cli` and its subpackages: Contains all the handlers for the standard Helm
  environment variables and its subpackages contain output and values file
  handling
- `pkg/release`: Defines the `Release` object and statuses

Obviously there are many more packages besides these, so go check out the
documentation for more information!

### Simple example
This is a simple example of doing a `helm list` using the Go SDK:

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

## Storage backends

Helm 3 changed the default release information storage to Secrets in the
namespace of the release. Helm 2 by default stores release information as
ConfigMaps in the namespace of the Tiller instance. The subsections which follow
show how to configure different backends. This configuration is based on the
`HELM_DRIVER` environment variable. It can be set to one of the values:
`[configmap, secret, sql]`.

### ConfigMap storage backend

To enable the ConfigMap backend, you'll need to set the environmental variable
`HELM_DRIVER` to `configmap`.

You can set it in a shell as follows:

```shell
export HELM_DRIVER=configmap
```

If you want to switch from the default backend to the ConfigMap backend, you'll
have to do the migration for this on your own. You can retrieve release
information with the following command:

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```

**PRODUCTION NOTES**: The release information includes the contents of charts and
values files, and therefore might contain sensitive data (like
passwords, private keys, and other credentials) that needs to be protected from
unauthorized access. When managing Kubernetes authorization, for instance with
[RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/), it is
possible to grant broader access to ConfigMap resources, while restricting
access to Secret resources. For instance, the default [user-facing
role](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)
"view" grants access to most resources, but not to Secrets. Furthermore, secrets
data can be configured for [encrypted
storage](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/).
Please keep that in mind if you decide to switch to the ConfigMap backend, as it
could expose your application's sensitive data.

### SQL storage backend

There is a ***beta*** SQL storage backend that stores release information in an SQL
database.

Using such a storage backend is particularly useful if your release information
weighs more than 1MB (in which case, it can't be stored in ConfigMaps/Secrets
because of internal limits in Kubernetes' underlying etcd key-value store).

To enable the SQL backend, you'll need to deploy a SQL database and set the
environmental variable `HELM_DRIVER` to `sql`. The DB details are set with the
environmental variable `HELM_DRIVER_SQL_CONNECTION_STRING`.

You can set it in a shell as follows:

```shell
export HELM_DRIVER=sql
export HELM_DRIVER_SQL_CONNECTION_STRING=postgresql://helm-postgres:5432/helm?user=helm&password=changeme
```

> Note: Only PostgreSQL is supported at this moment.

**PRODUCTION NOTES**: It is recommended to:
- Make your database production ready. For PostgreSQL, refer to the [Server Administration](https://www.postgresql.org/docs/12/admin.html) docs for more details
- Enable [permission management](/docs/permissions_sql_storage_backend/) to
mirror Kubernetes RBAC for release information

If you want to switch from the default backend to the SQL backend, you'll have
to do the migration for this on your own. You can retrieve release information
with the following command:

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```
