---
title: "How to migrate from Helm v2 to Helm v3"
slug: "migrate-to-helm-v3"
authorname: "Rimas Mocevicius"
author: "@rimusz"
authorlink: "https://rimusz.net"
date: "2019-09-11"
---

One of the most important parts of upgrading to a new major release of Helm is the migration of data. This is especially true of Helm v2 to v3 considering the architectural changes between the releases. This is where the [helm-2to3](https://github.com/helm/helm-2to3) plugin comes in.

## Setting up Helm v3

As we do not want to override Helm v2 CLI binary, we need to perform an additional step to ensure that both CLI versions can co-exist until we are ready to remove Helm v2 CLI and all it's related data:

Download latest Helm v3 beta release from [here](https://github.com/helm/helm/releases), rename the binary to `helm3` and store it in your path.

We are ready to use `helm3`:

```
$ helm3 repo list
Error: no repositories to show
```

As you see there are no repositories set, let's fix it up.

## helm-2to3 plugin

`helm-2to3` plugin will allow us to migrate Helm v2 configuration and releases to Helm v3 in-place.

Installed Kubernetes objects will not be modified or removed.

### Installing

Let's install it:

```
$ helm3 plugin install https://github.com/helm/helm-2to3
Downloading and installing helm-2to3 v0.1.0 ...
https://github.com/helm/helm-2to3/releases/download/v0.1.0/helm-2to3_0.1.0_darwin_amd64.tar.gz
Installed plugin: 2to3
```

```
$ helm3 plugin list
NAME	VERSION	DESCRIPTION
2to3	0.1.0  	migrate Helm v2 configuration and releases in-place to Helm v3
```

```
$ helm3 2to3
Migrate Helm v2 configuration and releases in-place to Helm v3

Usage:
  2to3 [command]

Available Commands:
  convert     migrate Helm v2 release in-place to Helm v3
  help        Help about any command
  move        migrate Helm v2 configuration in-place to Helm v3

Flags:
  -h, --help   help for 2to3

Use "2to3 [command] --help" for more information about a command.
```

Awesome.

### Plugin features

Currently plugin supports:

- Migration of Helm v2 configuration
- Migration of Helm v2 releases

## Migrate Helm v2 configuration

First we need to migrate Helm v2 config and data folders:

```
$ helm3 2to3 move config
```

It will migrate:

- Chart starters
- Repositories
- Plugins

**Note:** Please check that all Helm v2 plugins work fine with the Helm v3, and remove plugins that do not work.

Now let's run `helm3 repo list` again:

```
$ helm3 repo list
NAME       	URL
stable     	https://kubernetes-charts.storage.googleapis.com
jfrog      	https://charts.jfrog.io
rimusz     	https://charts.rimusz.net
buildkite  	https://buildkite.github.io/charts
jetstack   	https://charts.jetstack.io
odavid     	https://odavid.github.io/k8s-helm-charts
elastic    	https://helm.elastic.co
appscode   	https://charts.appscode.com/stable

$ helm3 plugin list
NAME   	VERSION	DESCRIPTION
2to3   	0.1.0  	migrate Helm v2 configuration and releases in-place to Helm v3
edit   	0.3.0  	Edit a release.
gcs    	0.2.0  	Provides Google Cloud Storage protocol support.
       	       	https://github.com/vigles...
linter 	0.1.1  	Helm plugin to find hardcoded passwords in values.yaml files
monitor	0.3.0  	Query at a given interval a Prometheus, ElasticSearch or Sentry instance...
```

Nice, now I can use the same Helm repositories and plugins which I have in Helm v2.

The move config will create the Helm v3 `config` and `data` folders if they don't exist, and will override the `repositories.yaml` file if it does exist.

The plugin also supports non default Helm v2 `home` and Helm v3 `config` and `data` folders, an example of it's use:

```
$ export HELM_V2_HOME=$HOME/.helm2
$ export HELM_V3_CONFIG=$HOME/.helm3
$ export HELM_V3_DATA=$PWD/.helm3
$ helm3 2to3 move config
```

## Migrate Helm v2 releases

Now we are ready to start migrating releases.

Let's check available options:

```
$ helm3 2to3 convert -h
migrate Helm v2 release in-place to Helm v3

Usage:
  2to3 convert [flags] RELEASE

Flags:
      --delete-v2-releases       v2 releases are deleted after migration. By default, the v2 releases are retained
      --dry-run                  simulate a convert
  -h, --help                     help for convert
  -l, --label string             label to select tiller resources by (default "OWNER=TILLER")
  -s, --release-storage string   v2 release storage type/object. It can be 'secrets' or 'configmaps'. This is only used with the 'tiller-out-cluster' flag (default "secrets")
  -t, --tiller-ns string         namespace of Tiller (default "kube-system")
      --tiller-out-cluster       when  Tiller is not running in the cluster e.g. Tillerless
```

Nice, the plugin even supports the [Tillerless Helm v2](https://github.com/rimusz/helm-tiller).

Let's check out for Helm v2 releases and pick one to test out the migration:

```
$ helm list

NAME    	REVISION	UPDATED                 	STATUS  	CHART           	APP VERSION	NAMESPACE
postgres	1       	Wed Sep 11 14:52:32 2019	DEPLOYED	postgresql-6.3.5	11.5.0     	postgres
redis   	1       	Wed Sep 11 14:52:57 2019	DEPLOYED	redis-9.1.7     	5.0.5      	redis
```

The safest way of course to start with `--dry-run` flag:

```
$ helm3 2to3 convert --dry-run postgres
NOTE: This is in dry-run mode, the following actions will not be executed.
Run without --dry-run to take the actions described below:

Release "postgres" will be converted from Helm 2 to Helm 3.
[Helm 3] Release "postgres" will be created.
[Helm 3] ReleaseVersion "postgres.v1" will be created.
```

Now, let's run the actual migration:

```
$ helm3 2to3 convert postgres
Release "postgres" will be converted from Helm 2 to Helm 3.
[Helm 3] Release "postgres" will be created.
[Helm 3] ReleaseVersion "postgres.v1" will be created.
[Helm 3] ReleaseVersion "postgres.v1" created.
[Helm 3] Release "postgres" created.
Release "postgres" was converted successfully from Helm 2 to Helm 3. Note: the v2 releases still remain and should be removed to avoid conflicts with the migrated v3 releases.
```

Check out whether it was succesful:

```
$ helm list
NAME    	REVISION	UPDATED                 	STATUS  	CHART           	APP VERSION	NAMESPACE
postgres	1       	Wed Sep 11 14:52:32 2019	DEPLOYED	postgresql-6.3.5	11.5.0     	postgres
redis   	1       	Wed Sep 11 14:52:57 2019	DEPLOYED	redis-9.1.7     	5.0.5      	redis

$ helm3 list
NAME    	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART
postgres	postgres 	1       	2019-09-11 12:52:32.529413 +0000 UTC	deployed	postgresql-6.3.5
```

**Note:** As we did not specify `--delete-v2-releases` flag Helm v2 `postgres` release information was left in-tact, it can be deleted with `kubectl` later on.

When are you ready to move all your releases, you can automate it with running `helm list` in a loop and applying `helm3 2to3 convert RELEASE` for each Helm v2 release.

If you are using Tillerless Helm v2, just add `--tiller-out-cluster` to migrate the release:

```
$ helm3 2to3 convert postgres --tiller-out-cluster
```

Very cool and simple, right :-)

**Happy Helm v3 sailing**
