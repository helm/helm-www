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

### The `chart` subcommand

#### `save`

save a chart directory to local cache

```console
$ helm chart save mychart/ localhost:5000/myrepo/mychart:2.7.0
ref:     localhost:5000/myrepo/mychart:2.7.0
digest:  1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
size:    2.4 KiB
name:    mychart
version: 0.1.0
2.7.0: saved
```

#### `list`

list all saved charts

```console
$ helm chart list
REF                                                     NAME                    VERSION DIGEST  SIZE            CREATED
localhost:5000/myrepo/mychart:2.7.0                     mychart                 2.7.0   84059d7 454 B           27 seconds
localhost:5000/stable/acs-engine-autoscaler:2.2.2       acs-engine-autoscaler   2.2.2   d8d6762 4.3 KiB         2 hours
localhost:5000/stable/aerospike:0.2.1                   aerospike               0.2.1   4aff638 3.7 KiB         2 hours
localhost:5000/stable/airflow:0.13.0                    airflow                 0.13.0  c46cc43 28.1 KiB        2 hours
localhost:5000/stable/anchore-engine:0.10.0             anchore-engine          0.10.0  3f3dcd7 34.3 KiB        2 hours
...
```

#### `export`

export a chart to directory

```console
$ helm chart export localhost:5000/myrepo/mychart:2.7.0
ref:     localhost:5000/myrepo/mychart:2.7.0
digest:  1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
size:    2.4 KiB
name:    mychart
version: 0.1.0
Exported chart to mychart/
```

#### `push`

push a chart to remote

```console
$ helm chart push localhost:5000/myrepo/mychart:2.7.0
The push refers to repository [localhost:5000/myrepo/mychart]
ref:     localhost:5000/myrepo/mychart:2.7.0
digest:  1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
size:    2.4 KiB
name:    mychart
version: 0.1.0
2.7.0: pushed to remote (1 layer, 2.4 KiB total)
```

#### `remove`

remove a chart from cache

```console
$ helm chart remove localhost:5000/myrepo/mychart:2.7.0
2.7.0: removed
```

#### `pull`

pull a chart from remote

```console
$ helm chart pull localhost:5000/myrepo/mychart:2.7.0
2.7.0: Pulling from localhost:5000/myrepo/mychart
ref:     localhost:5000/myrepo/mychart:2.7.0
digest:  1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
size:    2.4 KiB
name:    mychart
version: 0.1.0
Status: Downloaded newer chart for localhost:5000/myrepo/mychart:2.7.0
```

## Where are my charts?

Charts stored using the commands above will be cached on the filesystem.

The [OCI Image Layout
Specification](https://github.com/opencontainers/image-spec/blob/master/image-layout.md)
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
