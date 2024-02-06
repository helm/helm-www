---
title: "Use OCI-based registries"
description: "Describes how to use OCI for Chart distribution."
aliases: ["/docs/registries/"]
weight: 7
---

Beginning in Helm 3, you can use container registries with [OCI](https://www.opencontainers.org/) support to store and share chart packages. Beginning in Helm v3.8.0, OCI support is enabled by default. 


## OCI support prior to v3.8.0

OCI support graduated from experimental to general availability with Helm v3.8.0. In prior versions of Helm, OCI support behaved differently. If you were using OCI support prior to Helm v3.8.0, its important to understand what has changed with different versions of Helm.

### Enabling OCI support prior to v3.8.0

Prior to Helm v3.8.0, OCI support is *experimental* and must be enabled.

To enable OCI experimental support for Helm versions prior to v3.8.0, set `HELM_EXPERIMENTAL_OCI` in your environment. For example:

```console
export HELM_EXPERIMENTAL_OCI=1
```

### OCI feature deprecation and behavior changes with v3.8.0

The release of [Helm v3.8.0](https://github.com/helm/helm/releases/tag/v3.8.0), the following features and behaviors are different from previous versions of Helm:

- When setting a chart in the dependencies as OCI, the version can be set to a range like other dependencies.
- SemVer tags that include build information can be pushed and used. OCI registries don't support `+` as a tag character. Helm translates the `+` to `_` when stored as a tag.
- The `helm registry login` command now follows the same structure as the Docker CLI for storing credentials. The same location for registry configuration can be passed to both Helm and the Docker CLI.

### OCI feature deprecation and behavior changes with v3.7.0

The release of [Helm v3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0) included the implementation of [HIP 6](https://github.com/helm/community/blob/main/hips/hip-0006.md) for OCI support. As a result, the following features and behaviors are different from previous versions of Helm:

- The `helm chart` subcommand has been removed.
- The chart cache has been removed (no `helm chart list` etc.).
- OCI registry references are now always prefixed with `oci://`.
- The basename of the registry reference must *always* match the chart's name.
- The tag of the registry reference must *always* match the chart's semantic version (i.e. no `latest` tags).
- The chart layer media type was switched from `application/tar+gzip` to `application/vnd.cncf.helm.chart.content.v1.tar+gzip`.


## Using an OCI-based registry

### Helm repositories in OCI-based registries

A [Helm repository]({{< ref "chart_repository.md" >}}) is a way to house and distribute packaged Helm charts. An OCI-based registry can contain zero or more Helm repositories and each of those repositories can contain zero or more packaged Helm charts.

### Use hosted registries

There are several hosted container registries with OCI support that you can use for your Helm charts. For example:

- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-helm-repos#push-chart-to-registry-as-oci-artifact)
- [Docker Hub](https://docs.docker.com/docker-hub/oci-artifacts/)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/helm/manage-charts)
- [Harbor](https://goharbor.io/docs/main/administration/user-defined-oci-artifact/)
- [IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_helm_charts)
- [JFrog Artifactory](https://www.jfrog.com/confluence/display/JFROG/Docker+Registry)

Follow the hosted container registry provider's documentation to create and configure a registry with OCI support. 

**Note:**  You can run [Docker Registry](https://docs.docker.com/registry/deploying/) or [`zot`](https://github.com/project-zot/zot), which are OCI-based registries, on your development computer. Running an OCI-based registry on your development computer should only be used for testing purposes.

### Using sigstore to sign OCI-based charts

The [`helm-sigstore`](https://github.com/sigstore/helm-sigstore) plugin allows using [Sigstore](https://sigstore.dev/) to sign Helm charts with the same tools used to sign container images.  This provides an alternative to the [GPG-based provenance]({{< ref "provenance.md" >}}) supported by classic [chart repositories]({{< ref "chart_repository.md" >}}).

For more details on using the `helm sigstore` plugin, see [that project's documentation](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md).

## Commands for working with registries

### The `registry` subcommand

#### `login`

login to a registry (with manual password entry)

```console
$ helm registry login -u myuser localhost:5000
Password:
Login succeeded
```

#### `logout`

logout from a registry

```console
$ helm registry logout localhost:5000
Logout succeeded
```

### The `push` subcommand

Upload a chart to an OCI-based registry:

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

The `push` subcommand can only be used against `.tgz` files
created ahead of time using `helm package`.

When using `helm push` to upload a chart an OCI registry, the reference
must be prefixed with `oci://` and must not contain the basename or tag.

The registry reference basename is inferred from the chart's name,
and the tag is inferred from the chart's semantic version. This is
currently a strict requirement.

Certain registries require the repository and/or namespace (if specified)
to be created beforehand. Otherwise, an error will be produced during the
 `helm push` operation.

If you have created a [provenance file]({{< ref "provenance.md" >}}) (`.prov`), and it is present next to the chart `.tgz` file, it will
automatically be uploaded to the registry upon `push`. This results in
an extra layer on [the Helm chart manifest](#helm-chart-manifest).

Users of the [helm-push plugin](https://github.com/chartmuseum/helm-push) (for uploading charts to [ChartMuseum]({{< ref "chart_repository.md" >}}#chartmuseum-repository-server))
may experience issues, since the plugin conflicts with the new, built-in `push`.
As of version v0.10.0, the plugin has been renamed to `cm-push`.

### Other subcommands

Support for the `oci://` protocol is also available in various other subcommands.
Here is a complete list:

- `helm pull`
- `helm show `
- `helm template`
- `helm install`
- `helm upgrade`

The basename (chart name) of the registry reference *is*
included for any type of action involving chart download
(vs. `helm push` where it is omitted).

Here are a few examples of using the subcommands listed above against
OCI-based charts:

```
$ helm pull oci://localhost:5000/helm-charts/mychart --version 0.1.0
Pulled: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:0be7ec9fb7b962b46d81e4bb74fdcdb7089d965d3baca9f85d64948b05b402ff

$ helm show all oci://localhost:5000/helm-charts/mychart --version 0.1.0
apiVersion: v2
appVersion: 1.16.0
description: A Helm chart for Kubernetes
name: mychart
...

$ helm template myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
---
# Source: mychart/templates/serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
...

$ helm install myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...

$ helm upgrade myrelease oci://localhost:5000/helm-charts/mychart --version 0.2.0
Release "myrelease" has been upgraded. Happy Helming!
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:12:05 2021
NAMESPACE: default
STATUS: deployed
REVISION: 2
NOTES:
...
```

## Specifying dependencies

Dependencies of a chart can be pulled from a registry using the `dependency update` subcommand.

The `repository` for a given entry in `Chart.yaml` is specified as the registry reference without the basename:

```
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```
This will fetch `oci://localhost:5000/myrepo/mychart:2.7.0` when `dependency update` is executed.

## Helm chart manifest

Example Helm chart manifest as represented in a registry
(note the `mediaType` fields):
```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    }
  ]
}
```

The following example contains a
[provenance file]({{< ref "provenance.md" >}})
(note the extra layer):

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    },
    {
      "mediaType": "application/vnd.cncf.helm.chart.provenance.v1.prov",
      "digest": "sha256:3e207b409db364b595ba862cdc12be96dcdad8e36c59a03b7b3b61c946a5741a",
      "size": 643
    }
  ]
}
```

## Migrating from chart repos

Migrating from classic [chart repositories]({{< ref "chart_repository.md" >}})
(index.yaml-based repos) is as simple using `helm pull`, then using `helm push` to upload the resulting `.tgz` files to a registry.


