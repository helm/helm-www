---
title: "Registries"
description: "Describes how to use OCI for Chart distribution."
aliases: ["/docs/registries/"]
weight: 7
---

Helm 3 supports <a href="https://www.opencontainers.org/"
target="_blank">OCI</a> for package distribution. Chart packages are able to be
stored and shared across OCI-based registries.

## Enabling OCI Support

Prior to Helm v3.8.0, OCI support was considered *experimental* and needed to be
enabled. As of v3.8.0 it is enabled by default.

To enable OCI experimental support for Helm versions prior to v3.8.0, please set
`HELM_EXPERIMENTAL_OCI` in the environment:

```console
export HELM_EXPERIMENTAL_OCI=1
```

## Running a registry

Starting a registry for test purposes is trivial. As long as you have Docker
installed, run the following command:
```console
docker run -dp 5000:5000 --restart=always --name registry registry
```

This will start a registry server at `localhost:5000`.

Use `docker logs -f registry` to see the logs and `docker rm -f registry` to
stop.

If you wish to persist storage, you can add `-v
$(pwd)/registry:/var/lib/registry` to the command above.

For more configuration options, please see [the
docs](https://docs.docker.com/registry/deploying/).

Note: on macOS, port `5000` may be occupied by "AirPlay Receiver".
You can either choose a different local port (e.g. `-p 5001:5000`), or disable this under 
Syetem Preferences > Sharing.

### Auth

If you wish to enable auth on the registry, you can do the following-

First, create file `auth.htpasswd` with username and password combo:
```console
htpasswd -cB -b auth.htpasswd myuser mypass
```

Then, start the server, mounting that file and setting the `REGISTRY_AUTH` env
var:
```console
docker run -dp 5000:5000 --restart=always --name registry \
  -v $(pwd)/auth.htpasswd:/etc/docker/registry/auth.htpasswd \
  -e REGISTRY_AUTH="{htpasswd: {realm: localhost, path: /etc/docker/registry/auth.htpasswd}}" \
  registry
```

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

upload a chart to a registry

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

#### Extra notes on the `push` subcommand

The `push` subcommand can only be used against `.tgz` files
created ahead of time using `helm package`.

When using `helm push` to upload a chart an OCI registry, the reference
must be prefixed with `oci://` and must not contain the basename or tag.

The registry reference basename is inferred from from the chart's name,
and the tag is inferred from the chart's semantic version. This is
currently a strict requirement ([more info here](#deprecated-features-and-strict-naming-policies)).

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

## Deprecated features and strict naming policies

Prior to Helm [3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0),
Helm's OCI support was slightly different.
As a result of [HIP 6](https://github.com/helm/community/blob/main/hips/hip-0006.md), in an effort to simplify and stabilize this feature set,
several changes have been implemented:

- The `helm chart` subcommand has been removed
- The chart cache has been removed (no `helm chart list` etc.)
- OCI registry references are now always prefixed with `oci://`
- The basename of the registry reference must *always* match the chart's name
- The tag of the registry reference must *always* match the chart's semantic version (i.e. no `latest` tags)
- The chart layer media type was switched from `application/tar+gzip` to `application/vnd.cncf.helm.chart.content.v1.tar+gzip`

Thank you for your patience as the Helm team continues to work on
stabilizing native support for OCI registries.
