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

Currently OCI support is considered *experimental*.

In order to use the commands described below, please set `HELM_EXPERIMENTAL_OCI`
in the environment:

```console
export HELM_EXPERIMENTAL_OCI=1
```

For more information about this feature and plans for general availability, please see the [OCI Support Helm Improvement Proposal](https://github.com/helm/community/blob/main/hips/hip-0006.md).

## Running a registry

Starting a registry for test purposes is trivial. As long as you have Docker
installed, run the following command:
```console
docker run -dp 5000:5000 --restart=always --name registry registry
```

This will start a registry server at `localhost:5000`.

Use `docker logs -f registry` to see the logs and `docker rm -f registry` to
stop.

If you wish to persist storage, you can add `-v$(pwd)/registry:/var/lib/registry` to the command above.

For more configuration options, please see [the
docs](https://docs.docker.com/registry/deploying/).

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

Commands are available under both `helm registry` and `helm chart` that allow
you to work with registries and local cache.

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

Push a chart to registry

```console
$ helm create mychart
Creating mychart

$ helm package mychart/
Successfully packaged chart and saved it to: /home/user/mychart-0.1.0.tgz

$ helm push mychart-0.1.0.tgz oci://example.com/some/root/namespace
The push refers to repository [oci://example.com/some/root/namespace/mychart]
ref:     oci://example.com/some/root/namespace/mychart:0.1.0
digest:  1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
size:    2.4 KiB
name:    mychart
version: 0.1.0
0.1.0: pushed to remote (1 layer, 2.4 KiB total)
```

### The `pull` subcommand

save a chart locally

```console
$ helm pull oci://localhost:5000/some/root/namespace/mychart --version 0.1.0
Pulled: localhost:5000/some/root/namespace/mychart:0.1.0
Digest: 1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
```

## Specifying dependencies

Dependencies of a chart can be pulled from a registry using the `dependency update` subcommand.

To successfully pull dependencies, the image name in the registry must match the chart name and the tag must match the chart version. The repository entry in `Chart.yaml` is specified as the repository name on the registry without the image name.

```
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```
This will fetch `localhost:5000/myrepo/mychart:2.7.0` when `dependency update` is executed.

## Where are my charts?

Charts stored using the commands above will be cached on the filesystem.

The [OCI Image Layout
Specification](https://github.com/opencontainers/image-spec/blob/main/image-layout.md)
is adhered to strictly for filesystem layout, for example:
```console
$ tree ~/Library/Caches/helm/
/Users/myuser/Library/Caches/helm/
└── registry
    ├── cache
    │   ├── blobs
    │   │   └── sha256
    │   │       ├── 1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
    │   │       ├── 31fb454efb3c69fafe53672598006790122269a1b3b458607dbe106aba7059ef
    │   │       └── 8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111
    │   ├── index.json
    │   ├── ingest
    │   └── oci-layout
    └── config.json
```

Example index.json, which contains refs to all Helm chart manifests:
```console
$ cat ~/Library/Caches/helm/registry/cache/index.json  | jq
{
  "schemaVersion": 2,
  "manifests": [
    {
      "mediaType": "application/vnd.oci.image.manifest.v1+json",
      "digest": "sha256:31fb454efb3c69fafe53672598006790122269a1b3b458607dbe106aba7059ef",
      "size": 354,
      "annotations": {
        "org.opencontainers.image.ref.name": "localhost:5000/myrepo/mychart:2.7.0"
      }
    }
  ]
}
```

Example Helm chart manifest (note the `mediaType` fields):
```console
$ cat ~/Library/Caches/helm/registry/cache/blobs/sha256/31fb454efb3c69fafe53672598006790122269a1b3b458607dbe106aba7059ef | jq
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    }
  ]
}
```

## Migrating from chart repos

Migrating from classic [chart repositories]({{< ref "chart_repository.md" >}})
(index.yaml-based repos) is as simple as a `helm fetch` (Helm 2 CLI), `helm
chart save`, `helm chart push`.
