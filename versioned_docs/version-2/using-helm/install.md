---
sidebar_position: 3
sidebar_label: "Installing Helm"
slug: installing-helm
---

# Installing Helm

There are two parts to Helm: The Helm client (`helm`) and the Helm
server (Tiller). This guide shows how to install the client, and then
proceeds to show two ways to install the server.

**IMPORTANT**: If you are responsible for ensuring your cluster is a controlled environment, especially when resources are shared, it is strongly recommended installing Tiller using a secured configuration. For guidance, see [Securing your Helm Installation](./securing_installation.md).

## Installing the Helm Client

The Helm client can be installed either from source, or from pre-built binary
releases.

### From The Helm Project

The Helm project provides two ways to fetch and install Helm. These are the
official methods to get Helm releases. In addition to that, the Helm community
provides methods to install Helm through different package managers. Installation
through those methods can be found below the official methods.

#### From the Binary Releases

Every [release](https://github.com/helm/helm/releases) of Helm
provides binary releases for a variety of OSes. These binary versions
can be manually downloaded and installed.

1. Download your [desired version](https://github.com/helm/helm/releases)
2. Unpack it (`tar -zxvf helm-v2.0.0-linux-amd64.tgz`)
3. Find the `helm` binary in the unpacked directory, and move it to its
   desired destination (`mv linux-amd64/helm /usr/local/bin/helm`)

From there, you should be able to run the client: `helm help`.

#### From Script

Helm now has an installer script that will automatically grab the latest version
of the Helm client and [install it locally](https://git.io/get_helm.sh).

You can fetch that script, and then execute it locally. It's well documented so
that you can read through it and understand what it is doing before you run it.

```
$ curl -LO https://git.io/get_helm.sh
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

Yes, you can `curl -L https://git.io/get_helm.sh | bash` that if you want to live on the edge.

### Through Package Managers

The Helm community provides the ability to install Helm through operating system
package managers. These are not supported by the Helm project and are not considered
trusted 3rd parties.

#### From Snap (Linux)

The Snap package for Helm is maintained by
[Snapcrafters](https://github.com/snapcrafters/helm).

```
sudo snap install helm --classic
```

#### From Homebrew (macOS)

Members of the Helm community have contributed a Helm formula build to
Homebrew. This formula is generally up to date.

```
brew install kubernetes-helm
```

(Note: There is also a formula for emacs-helm, which is a different
project.)

### #From Chocolatey or scoop (Windows)

Members of the Helm community have contributed a [Helm package](https://chocolatey.org/packages/kubernetes-helm) build to
[Chocolatey](https://chocolatey.org/). This package is generally up to date.

```
choco install kubernetes-helm
```

The binary can also be installed via [`scoop`](https://scoop.sh) command-line installer.

```
scoop install helm
```

#### From Apt (Debian/Ubuntu)

Members of the Helm community have contributed a [Helm
package](https://helm.baltorepo.com/stable/debian/) for Apt. This package is generally up to date.

```
curl https://baltocdn.com/helm/signing.asc | sudo apt-key add -
sudo apt-get install apt-transport-https --yes
echo "deb https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm2
```

### Development Builds

In addition to releases you can download or install development snapshots of Helm.

#### From Canary Builds

"Canary" builds are versions of the Helm software that are built from
the latest master branch. They are not official releases, and may not be
stable. However, they offer the opportunity to test the cutting edge
features.

Canary Helm binaries are stored at [get.helm.sh](https://get.helm.sh).
Here are links to the common builds:

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [Experimental Windows AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

#### From Source (Linux, macOS)

Building Helm from source is slightly more work, but is the best way to
go if you want to test the latest (pre-release) Helm version.

You must have a working Go environment with
[glide](https://github.com/Masterminds/glide) installed.

```console
$ cd $GOPATH
$ mkdir -p src/k8s.io
$ cd src/k8s.io
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make bootstrap build
```

The `bootstrap` target will attempt to install dependencies, rebuild the
`vendor/` tree, and validate configuration.

The `build` target will compile `helm` and place it in `bin/helm`.
Tiller is also compiled, and is placed in `bin/tiller`.

## Installing Tiller

Tiller, the server portion of Helm, typically runs inside of your
Kubernetes cluster. But for development, it can also be run locally, and
configured to talk to a remote Kubernetes cluster.

### Special Note for RBAC Users

Most cloud providers enable a feature called Role-Based Access Control - RBAC for short. If your cloud provider enables this feature, you will need to create a service account for Tiller with the right roles and permissions to access resources.

Check the [Kubernetes Distribution Guide](./kubernetes_distros.md) to see if there's any further points of interest on using Helm with your cloud provider. Also check out the guide on [Tiller and Role-Based Access Control](./rbac.md) for more information on how to run Tiller in an RBAC-enabled Kubernetes cluster.

### Easy In-Cluster Installation

The easiest way to install `tiller` into the cluster is simply to run
`helm init`. This will validate that `helm`'s local environment is set
up correctly (and set it up if necessary). Then it will connect to
whatever cluster `kubectl` connects to by default (`kubectl config
view`). Once it connects, it will install `tiller` into the
`kube-system` namespace.

After `helm init`, you should be able to run `kubectl get pods --namespace
kube-system` and see Tiller running.

You can explicitly tell `helm init` to...

- Install the canary build with the `--canary-image` flag
- Install a particular image (version) with `--tiller-image`
- Install to a particular cluster with `--kube-context`
- Install into a particular namespace with `--tiller-namespace`
- Install Tiller with a Service Account with `--service-account` (for [RBAC enabled clusters](./securing_installation.md#rbac))
- Install Tiller without mounting a service account with `--automount-service-account false`

Once Tiller is installed, running `helm version` should show you both
the client and server version. (If it shows only the client version,
`helm` cannot yet connect to the server. Use `kubectl` to see if any
`tiller` pods are running.)

Helm will look for Tiller in the `kube-system` namespace unless
`--tiller-namespace` or `TILLER_NAMESPACE` is set.

### Installing Tiller Canary Builds

Canary images are built from the `master` branch. They may not be
stable, but they offer you the chance to test out the latest features.

The easiest way to install a canary image is to use `helm init` with the
`--canary-image` flag:

```console
$ helm init --canary-image
```

This will use the most recently built container image. You can always
uninstall Tiller by deleting the Tiller deployment from the
`kube-system` namespace using `kubectl`.

### Running Tiller Locally

For development, it is sometimes easier to work on Tiller locally, and
configure it to connect to a remote Kubernetes cluster.

The process of building Tiller is explained above.

Once `tiller` has been built, simply start it:

```console
$ bin/tiller
Tiller running on :44134
```

When Tiller is running locally, it will attempt to connect to the
Kubernetes cluster that is configured by `kubectl`. (Run `kubectl config
view` to see which cluster that is.)

You must tell `helm` to connect to this new local Tiller host instead of
connecting to the one in-cluster. There are two ways to do this. The
first is to specify the `--host` option on the command line. The second
is to set the `$HELM_HOST` environment variable.

```console
$ export HELM_HOST=localhost:44134
$ helm version # Should connect to localhost.
Client: &version.Version{SemVer:"v2.0.0-alpha.4", GitCommit:"db...", GitTreeState:"dirty"}
Server: &version.Version{SemVer:"v2.0.0-alpha.4", GitCommit:"a5...", GitTreeState:"dirty"}
```

Importantly, even when running locally, Tiller will store release
configuration in ConfigMaps inside of Kubernetes.

## Upgrading Tiller

As of Helm 2.2.0, Tiller can be upgraded using `helm init --upgrade`.

For older versions of Helm, or for manual upgrades, you can use `kubectl` to modify
the Tiller image:

```console
$ export TILLER_TAG=v2.0.0-beta.1        # Or whatever version you want
$ kubectl --namespace=kube-system set image deployments/tiller-deploy tiller=ghcr.io/helm/tiller:$TILLER_TAG
deployment "tiller-deploy" image updated
```

Setting `TILLER_TAG=canary` will get the latest snapshot of master.

## Deleting or Reinstalling Tiller

Because Tiller stores its data in Kubernetes ConfigMaps, you can safely
delete and re-install Tiller without worrying about losing any data. The
recommended way of deleting Tiller is with `kubectl delete deployment
tiller-deploy --namespace kube-system`, or more concisely `helm reset`.

Tiller can then be re-installed from the client with:

```console
$ helm init
```

## Advanced Usage

`helm init` provides additional flags for modifying Tiller's deployment
manifest before it is installed.

### Using `--node-selectors`

The `--node-selectors` flag allows us to specify the node labels required
for scheduling the Tiller pod.

The example below will create the specified label under the nodeSelector
property.

```
helm init --node-selectors "beta.kubernetes.io/os"="linux"
```

The installed deployment manifest will contain our node selector label.

```
...
spec:
  template:
    spec:
      nodeSelector:
        beta.kubernetes.io/os: linux
...
```


### Using `--override`

`--override` allows you to specify properties of Tiller's
deployment manifest. Unlike the `--set` command used elsewhere in Helm,
`helm init --override` manipulates the specified properties of the final
manifest (there is no "values" file). Therefore you may specify any valid
value for any valid property in the deployment manifest.

#### Override annotation

In the example below we use `--override` to add the revision property and set
its value to 1.

```
helm init --override metadata.annotations."deployment\.kubernetes\.io/revision"="1"
```
Output:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    deployment.kubernetes.io/revision: "1"
...
```

#### Override affinity

In the example below we set properties for node affinity. Multiple
`--override` commands may be combined to modify different properties of the
same list item.

```
helm init --override "spec.template.spec.affinity.nodeAffinity.preferredDuringSchedulingIgnoredDuringExecution[0].weight"="1" --override "spec.template.spec.affinity.nodeAffinity.preferredDuringSchedulingIgnoredDuringExecution[0].preference.matchExpressions[0].key"="e2e-az-name"
```

The specified properties are combined into the
"preferredDuringSchedulingIgnoredDuringExecution" property's first
list item.

```
...
spec:
  strategy: {}
  template:
    ...
    spec:
      affinity:
        nodeAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - preference:
              matchExpressions:
              - key: e2e-az-name
                operator: ""
            weight: 1
...
```

### Using `--output`

The `--output` flag allows us skip the installation of Tiller's deployment
manifest and simply output the deployment manifest to stdout in either
JSON or YAML format. The output may then be modified with tools like `jq`
and installed manually with `kubectl`.

In the example below we execute `helm init` with the `--output json` flag.

```
helm init --output json
```

The Tiller installation is skipped and the manifest is output to stdout
in JSON format.

```
"apiVersion": "apps/v1",
"kind": "Deployment",
"metadata": {
    "creationTimestamp": null,
    "labels": {
        "app": "helm",
        "name": "tiller"
    },
    "name": "tiller-deploy",
    "namespace": "kube-system"
},
...
```

### Storage backends
By default, `tiller` stores release information in `ConfigMaps` in the namespace
where it is running.

#### Secret storage backend
As of Helm 2.7.0, there is now a beta storage backend that
uses `Secrets` for storing release information. This was added for additional
security in protecting charts in conjunction with the release of `Secret`
encryption in Kubernetes.

To enable the secrets backend, you'll need to init Tiller with the following
options:

```shell
helm init --override 'spec.template.spec.containers[0].command'='{/tiller,--storage=secret}'
```

Currently, if you want to switch from the default backend to the secrets
backend, you'll have to do the migration for this on your own. When this backend
graduates from beta, there will be a more official path of migration

#### SQL storage backend
As of Helm 2.14.0 there is now a beta SQL storage backend that stores release
information in an SQL database (only postgres has been tested so far).

Using such a storage backend is particularly useful if your release information
weighs more than 1MB (in which case, it can't be stored in ConfigMaps/Secrets
because of internal limits in Kubernetes' underlying etcd key-value store).

To enable the SQL backend, you'll need to deploy a SQL database and init Tiller
with the following options:

```shell
helm init \
  --override \
    'spec.template.spec.containers[0].args'='{--storage=sql,--sql-dialect=postgres,--sql-connection-string=postgresql://tiller-postgres:5432/helm?user=helm&password=changeme}'
```

**PRODUCTION NOTES**: it's recommended to change the username and password of
the SQL database in production deployments. Enabling SSL is also a good idea.
Last, but not least, perform regular backups/snapshots of your SQL database.

Currently, if you want to switch from the default backend to the SQL backend,
you'll have to do the migration for this on your own. When this backend
graduates from beta, there will be a more official migration path.

## Conclusion

In most cases, installation is as simple as getting a pre-built `helm` binary
and running `helm init`. This document covers additional cases for those
who want to do more sophisticated things with Helm.

Once you have the Helm Client and Tiller successfully installed, you can
move on to using Helm to manage charts.
