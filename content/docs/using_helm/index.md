# Quickstart Guide

This guide covers how you can quickly get started using Helm.

## Prerequisites

The following prerequisites are required for a successful and properly secured use of Helm.

1. A Kubernetes cluster
2. Deciding what security configurations to apply to your installation, if any
3. Installing and configuring Helm and Tiller, the cluster-side service.


### Install Kubernetes or have access to a cluster
- You must have Kubernetes installed. For the latest release of Helm, we recommend the latest stable release of Kubernetes, which in most cases is the second-latest minor release.
- You should also have a local configured copy of `kubectl`.

NOTE: Kubernetes versions prior to 1.6 have limited or no support for role-based access controls (RBAC).

Helm will figure out where to install Tiller by reading your Kubernetes
configuration file (usually `$HOME/.kube/config`). This is the same file
that `kubectl` uses.

To find out which cluster Tiller would install to, you can run
`kubectl config current-context` or `kubectl cluster-info`.

```console
$ kubectl config current-context
my-cluster
```

### Understand your Security Context

As with all powerful tools, ensure you are installing it correctly for your scenario.

If you're using Helm on a cluster that you completely control, like minikube or a cluster on a private network in which sharing is not a concern, the default installation -- which applies no security configuration -- is fine, and it's definitely the easiest. To install Helm without additional security steps, [install Helm](#installing-helm) and then [initialize Helm](#initialize-helm-and-install-tiller).

However, if your cluster is exposed to a larger network or if you share your cluster with others -- production clusters fall into this category -- you must take extra steps to secure your installation to prevent careless or malicious actors from damaging the cluster or its data. To apply configurations that secure Helm for use in production environments and other multi-tenant scenarios, see [Securing a Helm installation](./#securing-your-helm-installation)

If your cluster has Role-Based Access Control (RBAC) enabled, you may want
to [configure a service account and rules](./#role-based-access-control) before proceeding.

## Install Helm

Download a binary release of the Helm client. You can use tools like
`homebrew`, or look at [the official releases page](https://github.com/helm/helm/releases).

For more details, or for other options, see [the installation
guide](./#installing-helm).

## Initialize Helm and Install Tiller

Once you have Helm ready, you can initialize the local CLI and also
install Tiller into your Kubernetes cluster in one step:

```console
$ helm init
```

This will install Tiller into the Kubernetes cluster you saw with
`kubectl config current-context`.

**TIP:** Want to install into a different cluster? Use the
`--kube-context` flag.

**TIP:** When you want to upgrade Tiller, just run `helm init --upgrade`.

By default, when Tiller is installed, it does not have authentication enabled.
To learn more about configuring strong TLS authentication for Tiller, consult
[the Tiller TLS guide](./#using-ssl-between-helm-and-tiller).

## Install an Example Chart

To install a chart, you can run the `helm install` command. Helm has
several ways to find and install a chart, but the easiest is to use one
of the official `stable` charts.

```console
$ helm repo update              # Make sure we get the latest list of charts
$ helm install stable/mysql
NAME:   wintering-rodent
LAST DEPLOYED: Thu Oct 18 14:21:18 2018
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/Secret
NAME                    AGE
wintering-rodent-mysql  0s

==> v1/ConfigMap
wintering-rodent-mysql-test  0s

==> v1/PersistentVolumeClaim
wintering-rodent-mysql  0s

==> v1/Service
wintering-rodent-mysql  0s

==> v1beta1/Deployment
wintering-rodent-mysql  0s

==> v1/Pod(related)

NAME                                    READY  STATUS   RESTARTS  AGE
wintering-rodent-mysql-6986fd6fb-988x7  0/1    Pending  0         0s


NOTES:
MySQL can be accessed via port 3306 on the following DNS name from within your cluster:
wintering-rodent-mysql.default.svc.cluster.local

To get your root password run:

    MYSQL_ROOT_PASSWORD=$(kubectl get secret --namespace default wintering-rodent-mysql -o jsonpath="{.data.mysql-root-password}" | base64 --decode; echo)

To connect to your database:

1. Run an Ubuntu pod that you can use as a client:

    kubectl run -i --tty ubuntu --image=ubuntu:16.04 --restart=Never -- bash -il

2. Install the mysql client:

    $ apt-get update && apt-get install mysql-client -y

3. Connect using the mysql cli, then provide your password:
    $ mysql -h wintering-rodent-mysql -p

To connect to your database directly from outside the K8s cluster:
    MYSQL_HOST=127.0.0.1
    MYSQL_PORT=3306

    # Execute the following command to route the connection:
    kubectl port-forward svc/wintering-rodent-mysql 3306

    mysql -h ${MYSQL_HOST} -P${MYSQL_PORT} -u root -p${MYSQL_ROOT_PASSWORD}

```

In the example above, the `stable/mysql` chart was released, and the name of
our new release is `wintering-rodent`. You get a simple idea of the
features of this MySQL chart by running `helm inspect stable/mysql`.

Whenever you install a chart, a new release is created. So one chart can
be installed multiple times into the same cluster. And each can be
independently managed and upgraded.

The `helm install` command is a very powerful command with many
capabilities. To learn more about it, check out the [Using Helm
Guide](./#using-helm)

## Learn About Releases

It's easy to see what has been released using Helm:

```console
$ helm ls
NAME            	REVISION	UPDATED                 	STATUS  	CHART       	APP VERSION	NAMESPACE
wintering-rodent	1       	Thu Oct 18 15:06:58 2018	DEPLOYED	mysql-0.10.1	5.7.14     	default
```

The `helm list` function will show you a list of all deployed releases.

## Uninstall a Release

To uninstall a release, use the `helm delete` command:

```console
$ helm delete wintering-rodent
release "wintering-rodent" deleted
```

This will uninstall `wintering-rodent` from Kubernetes, but you will
still be able to request information about that release:

```console
$ helm status wintering-rodent
LAST DEPLOYED: Thu Oct 18 14:21:18 2018
NAMESPACE: default
STATUS: DELETED

NOTES:
MySQL can be accessed via port 3306 on the following DNS name from within your cluster:
wintering-rodent-mysql.default.svc.cluster.local

To get your root password run:

    MYSQL_ROOT_PASSWORD=$(kubectl get secret --namespace default wintering-rodent-mysql -o jsonpath="{.data.mysql-root-password}" | base64 --decode; echo)

To connect to your database:

1. Run an Ubuntu pod that you can use as a client:

    kubectl run -i --tty ubuntu --image=ubuntu:16.04 --restart=Never -- bash -il

2. Install the mysql client:

    $ apt-get update && apt-get install mysql-client -y

3. Connect using the mysql cli, then provide your password:
    $ mysql -h wintering-rodent-mysql -p

To connect to your database directly from outside the K8s cluster:
    MYSQL_HOST=127.0.0.1
    MYSQL_PORT=3306

    # Execute the following command to route the connection:
    kubectl port-forward svc/wintering-rodent-mysql 3306

    mysql -h ${MYSQL_HOST} -P${MYSQL_PORT} -u root -p${MYSQL_ROOT_PASSWORD}
```

Because Helm tracks your releases even after you've deleted them, you
can audit a cluster's history, and even undelete a release (with `helm
rollback`).

## Reading the Help Text

To learn more about the available Helm commands, use `helm help` or type
a command followed by the `-h` flag:

```console
$ helm get -h
```

# Installing Helm

There are two parts to Helm: The Helm client (`helm`) and the Helm
server (Tiller). This guide shows how to install the client, and then
proceeds to show two ways to install the server.

**IMPORTANT**: If you are responsible for ensuring your cluster is a controlled environment, especially when resources are shared, it is strongly recommended installing Tiller using a secured configuration. For guidance, see [Securing your Helm Installation](./#securing-your-helm-installation).

## Installing the Helm Client

The Helm client can be installed either from source, or from pre-built binary
releases.

### From the Binary Releases

Every [release](https://github.com/helm/helm/releases) of Helm
provides binary releases for a variety of OSes. These binary versions
can be manually downloaded and installed.

1. Download your [desired version](https://github.com/helm/helm/releases)
2. Unpack it (`tar -zxvf helm-v2.0.0-linux-amd64.tgz`)
3. Find the `helm` binary in the unpacked directory, and move it to its
   desired destination (`mv linux-amd64/helm /usr/local/bin/helm`)

From there, you should be able to run the client: `helm help`.

### From Snap (Linux)

The Snap package for Helm is maintained by
[Snapcrafters](https://github.com/snapcrafters/helm).

```
$ sudo snap install helm --classic
```

### From Homebrew (macOS)

Members of the Kubernetes community have contributed a Helm formula build to
Homebrew. This formula is generally up to date.

```
brew install kubernetes-helm
```

(Note: There is also a formula for emacs-helm, which is a different
project.)

### From Chocolatey (Windows)

Members of the Kubernetes community have contributed a [Helm package](https://chocolatey.org/packages/kubernetes-helm) build to
[Chocolatey](https://chocolatey.org/). This package is generally up to date.

```
choco install kubernetes-helm
```

## From Script

Helm now has an installer script that will automatically grab the latest version
of the Helm client and [install it locally](https://raw.githubusercontent.com/helm/helm/master/scripts/get).

You can fetch that script, and then execute it locally. It's well documented so
that you can read through it and understand what it is doing before you run it.

```
$ curl https://raw.githubusercontent.com/helm/helm/master/scripts/get > get_helm.sh
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

Yes, you can `curl https://raw.githubusercontent.com/helm/helm/master/scripts/get | bash` that if you want to live on the edge.

### From Canary Builds

"Canary" builds are versions of the Helm software that are built from
the latest master branch. They are not official releases, and may not be
stable. However, they offer the opportunity to test the cutting edge
features.

Canary Helm binaries are stored in the [Kubernetes Helm GCS bucket](https://kubernetes-helm.storage.googleapis.com).
Here are links to the common builds:

- [Linux AMD64](https://kubernetes-helm.storage.googleapis.com/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://kubernetes-helm.storage.googleapis.com/helm-canary-darwin-amd64.tar.gz)
- [Experimental Windows AMD64](https://kubernetes-helm.storage.googleapis.com/helm-canary-windows-amd64.zip)

### From Source (Linux, macOS)

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

Check the [Kubernetes Distribution Guide](./#kubernetes_distros.md) to see if there's any further points of interest on using Helm with your cloud provider. Also check out the guide on [Tiller and Role-Based Access Control](#role-based-access-control) for more information on how to run Tiller in an RBAC-enabled Kubernetes cluster.

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
- Install Tiller with a Service Account with `--service-account` (for [RBAC enabled clusters](#rbac))
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
$ kubectl --namespace=kube-system set image deployments/tiller-deploy tiller=gcr.io/kubernetes-helm/tiller:$TILLER_TAG
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
apiVersion: extensions/v1beta1
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
"apiVersion": "extensions/v1beta1",
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
where it is running. As of Helm 2.7.0, there is now a beta storage backend that
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

## Conclusion

In most cases, installation is as simple as getting a pre-built `helm` binary
and running `helm init`. This document covers additional cases for those
who want to do more sophisticated things with Helm.

Once you have the Helm Client and Tiller successfully installed, you can
move on to using Helm to manage charts.

# Kubernetes Distribution Guide

This document captures information about using Helm in specific Kubernetes
environments.

We are trying to add more details to this document. Please contribute via Pull
Requests if you can.

## MiniKube

Helm is tested and known to work with [minikube](https://github.com/kubernetes/minikube).
It requires no additional configuration.

## `scripts/local-cluster` and Hyperkube

Hyperkube configured via `scripts/local-cluster.sh` is known to work. For raw
Hyperkube you may need to do some manual configuration.

## GKE

Google's GKE hosted Kubernetes platform enables RBAC by default. You will need to create a service account for tiller, and use the --service-account flag when initializing the helm server.

See [Tiller and role-based access control](https://docs.helm.sh/using_helm/#role-based-access-control) for more information.

## Ubuntu with 'kubeadm'

Kubernetes bootstrapped with `kubeadm` is known to work on the following Linux
distributions:

- Ubuntu 16.04
- Fedora release 25

Some versions of Helm (v2.0.0-beta2) require you to `export KUBECONFIG=/etc/kubernetes/admin.conf`
or create a `~/.kube/config`.

## Container Linux by CoreOS

Helm requires that kubelet have access to a copy of the `socat` program to proxy connections to the Tiller API. On Container Linux the Kubelet runs inside of a [hyperkube](https://github.com/kubernetes/kubernetes/tree/master/cluster/images/hyperkube) container image that has socat. So, even though Container Linux doesn't ship `socat` the container filesystem running kubelet does have socat. To learn more read the [Kubelet Wrapper](https://coreos.com/kubernetes/docs/latest/kubelet-wrapper.html) docs.

## Openshift

Helm works straightforward on OpenShift Online, OpenShift Dedicated, OpenShift Container Platform (version >= 3.6) or OpenShift Origin (version >= 3.6). To learn more read [this blog](https://blog.openshift.com/getting-started-helm-openshift/) post.

## Platform9

Helm Client and Helm Server (Tiller) are pre-installed with [Platform9 Managed Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=helm_distro_notes). Platform9 provides access to all official Helm charts through the App Catalog UI and native Kubernetes CLI. Additional repositories can be manually added. Further details are available in this [Platform9 App Catalog article](https://platform9.com/support/deploying-kubernetes-apps-platform9-managed-kubernetes/?utm_source=helm_distro_notes).

## DC/OS

Helm (both client and server) has been tested and is working on Mesospheres DC/OS 1.11 Kubernetes platform, and requires
no additional configuration.

# Installation: Frequently Asked Questions

This section tracks some of the more frequently encountered issues with installing
or getting started with Helm.

**We'd love your help** making this document better. To add, correct, or remove
information, [file an issue](https://github.com/helm/helm/issues) or
send us a pull request.

## Downloading

I want to know more about my downloading options.

**Q: I can't get to GitHub releases of the newest Helm. Where are they?**

A: We no longer use GitHub releases. Binaries are now stored in a
[GCS public bucket](https://kubernetes-helm.storage.googleapis.com).

**Q: Why aren't there Debian/Fedora/... native packages of Helm?**

We'd love to provide these or point you toward a trusted provider. If you're
interested in helping, we'd love it. This is how the Homebrew formula was
started.

**Q: Why do you provide a `curl ...|bash` script?**

A: There is a script in our repository (`scripts/get`) that can be executed as
a `curl ..|bash` script. The transfers are all protected by HTTPS, and the script
does some auditing of the packages it fetches. However, the script has all the
usual dangers of any shell script.

We provide it because it is useful, but we suggest that users carefully read the
script first. What we'd really like, though, are better packaged releases of
Helm.

## Installing

I'm trying to install Helm/Tiller, but something is not right.

**Q: How do I put the Helm client files somewhere other than ~/.helm?**

Set the `$HELM_HOME` environment variable, and then run `helm init`:

```console
export HELM_HOME=/some/path
helm init --client-only
```

Note that if you have existing repositories, you will need to re-add them
with `helm repo add...`.

**Q: How do I configure Helm, but not install Tiller?**

A: By default, `helm init` will ensure that the local `$HELM_HOME` is configured,
and then install Tiller on your cluster. To locally configure, but not install
Tiller, use `helm init --client-only`.

**Q: How do I manually install Tiller on the cluster?**

A: Tiller is installed as a Kubernetes `deployment`. You can get the manifest
by running `helm init --dry-run --debug`, and then manually install it with
`kubectl`. It is suggested that you do not remove or change the labels on that
deployment, as they are sometimes used by supporting scripts and tools.

**Q: Why do I get `Error response from daemon: target is unknown` during Tiller install?**

A: Users have reported being unable to install Tiller on Kubernetes instances that
are using Docker 1.13.0. The root cause of this was a bug in Docker that made
that one version incompatible with images pushed to the Docker registry by
earlier versions of Docker.

This [issue](https://github.com/docker/docker/issues/30083) was fixed shortly
after the release, and is available in Docker 1.13.1-RC1 and later.

## Getting Started

I successfully installed Helm/Tiller but I can't use it.

**Q: Trying to use Helm, I get the error "client transport was broken"**

```
E1014 02:26:32.885226   16143 portforward.go:329] an error occurred forwarding 37008 -> 44134: error forwarding port 44134 to pod tiller-deploy-2117266891-e4lev_kube-system, uid : unable to do port forwarding: socat not found.
2016/10/14 02:26:32 transport: http2Client.notifyError got notified that the client transport was broken EOF.
Error: transport is closing
```

A: This is usually a good indication that Kubernetes is not set up to allow port forwarding.

Typically, the missing piece is `socat`. If you are running CoreOS, we have been
told that it may have been misconfigured on installation. The CoreOS team
recommends reading this:

- https://coreos.com/kubernetes/docs/latest/kubelet-wrapper.html

Here are a few resolved issues that may help you get started:

- https://github.com/helm/helm/issues/1371
- https://github.com/helm/helm/issues/966

**Q: Trying to use Helm, I get the error "lookup XXXXX on 8.8.8.8:53: no such host"**

```
Error: Error forwarding ports: error upgrading connection: dial tcp: lookup kube-4gb-lon1-02 on 8.8.8.8:53: no such host
```

A: We have seen this issue with Ubuntu and Kubeadm in multi-node clusters. The
issue is that the nodes expect certain DNS records to be obtainable via global
DNS. Until this is resolved upstream, you can work around the issue as
follows. On each of the control plane nodes:

1) Add entries to `/etc/hosts`, mapping your hostnames to their public IPs
2) Install `dnsmasq` (e.g. `apt install -y dnsmasq`)
3) Remove the k8s api server container (kubelet will recreate it)
4) Then `systemctl restart docker` (or reboot the node) for it to pick up the /etc/resolv.conf changes

See this issue for more information: https://github.com/helm/helm/issues/1455

**Q: On GKE (Google Container Engine) I get "No SSH tunnels currently open"**

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

Another variation of the error message is:


```
Unable to connect to the server: x509: certificate signed by unknown authority

```

A: The issue is that your local Kubernetes config file must have the correct credentials.

When you create a cluster on GKE, it will give you credentials, including SSL
certificates and certificate authorities. These need to be stored in a Kubernetes
config file (Default: `~/.kube/config` so that `kubectl` and `helm` can access
them.

**Q: When I run a Helm command, I get an error about the tunnel or proxy**

A: Helm uses the Kubernetes proxy service to connect to the Tiller server.
If the command `kubectl proxy` does not work for you, neither will Helm.
Typically, the error is related to a missing `socat` service.

**Q: Tiller crashes with a panic**

When I run a command on Helm, Tiller crashes with an error like this:

```
Tiller is listening on :44134
Probes server is listening on :44135
Storage driver is ConfigMap
Cannot initialize Kubernetes connection: the server has asked for the client to provide credentials 2016-12-20 15:18:40.545739 I | storage.go:37: Getting release "bailing-chinchilla" (v1) from storage
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x0 pc=0x8053d5]

goroutine 77 [running]:
panic(0x1abbfc0, 0xc42000a040)
        /usr/local/go/src/runtime/panic.go:500 +0x1a1
k8s.io/helm/vendor/k8s.io/kubernetes/pkg/client/unversioned.(*ConfigMaps).Get(0xc4200c6200, 0xc420536100, 0x15, 0x1ca7431, 0x6, 0xc42016b6a0)
        /home/ubuntu/.go_workspace/src/k8s.io/helm/vendor/k8s.io/kubernetes/pkg/client/unversioned/configmap.go:58 +0x75
k8s.io/helm/pkg/storage/driver.(*ConfigMaps).Get(0xc4201d6190, 0xc420536100, 0x15, 0xc420536100, 0x15, 0xc4205360c0)
        /home/ubuntu/.go_workspace/src/k8s.io/helm/pkg/storage/driver/cfgmaps.go:69 +0x62
k8s.io/helm/pkg/storage.(*Storage).Get(0xc4201d61a0, 0xc4205360c0, 0x12, 0xc400000001, 0x12, 0x0, 0xc420200070)
        /home/ubuntu/.go_workspace/src/k8s.io/helm/pkg/storage/storage.go:38 +0x160
k8s.io/helm/pkg/tiller.(*ReleaseServer).uniqName(0xc42002a000, 0x0, 0x0, 0xc42016b800, 0xd66a13, 0xc42055a040, 0xc420558050, 0xc420122001)
        /home/ubuntu/.go_workspace/src/k8s.io/helm/pkg/tiller/release_server.go:577 +0xd7
k8s.io/helm/pkg/tiller.(*ReleaseServer).prepareRelease(0xc42002a000, 0xc42027c1e0, 0xc42002a001, 0xc42016bad0, 0xc42016ba08)
        /home/ubuntu/.go_workspace/src/k8s.io/helm/pkg/tiller/release_server.go:630 +0x71
k8s.io/helm/pkg/tiller.(*ReleaseServer).InstallRelease(0xc42002a000, 0x7f284c434068, 0xc420250c00, 0xc42027c1e0, 0x0, 0x31a9, 0x31a9)
        /home/ubuntu/.go_workspace/src/k8s.io/helm/pkg/tiller/release_server.go:604 +0x78
k8s.io/helm/pkg/proto/hapi/services._ReleaseService_InstallRelease_Handler(0x1c51f80, 0xc42002a000, 0x7f284c434068, 0xc420250c00, 0xc42027c190, 0x0, 0x0, 0x0, 0x0, 0x0)
        /home/ubuntu/.go_workspace/src/k8s.io/helm/pkg/proto/hapi/services/tiller.pb.go:747 +0x27d
k8s.io/helm/vendor/google.golang.org/grpc.(*Server).processUnaryRPC(0xc4202f3ea0, 0x28610a0, 0xc420078000, 0xc420264690, 0xc420166150, 0x288cbe8, 0xc420250bd0, 0x0, 0x0)
        /home/ubuntu/.go_workspace/src/k8s.io/helm/vendor/google.golang.org/grpc/server.go:608 +0xc50
k8s.io/helm/vendor/google.golang.org/grpc.(*Server).handleStream(0xc4202f3ea0, 0x28610a0, 0xc420078000, 0xc420264690, 0xc420250bd0)
        /home/ubuntu/.go_workspace/src/k8s.io/helm/vendor/google.golang.org/grpc/server.go:766 +0x6b0
k8s.io/helm/vendor/google.golang.org/grpc.(*Server).serveStreams.func1.1(0xc420124710, 0xc4202f3ea0, 0x28610a0, 0xc420078000, 0xc420264690)
        /home/ubuntu/.go_workspace/src/k8s.io/helm/vendor/google.golang.org/grpc/server.go:419 +0xab
created by k8s.io/helm/vendor/google.golang.org/grpc.(*Server).serveStreams.func1
        /home/ubuntu/.go_workspace/src/k8s.io/helm/vendor/google.golang.org/grpc/server.go:420 +0xa3
```

A: Check your security settings for Kubernetes.

A panic in Tiller is almost always the result of a failure to negotiate with the
Kubernetes API server (at which point Tiller can no longer do anything useful, so
it panics and exits).

Often, this is a result of authentication failing because the Pod in which Tiller
is running does not have the right token.

To fix this, you will need to change your Kubernetes configuration. Make sure
that `--service-account-private-key-file` from `controller-manager` and
`--service-account-key-file` from apiserver point to the _same_ x509 RSA key.


## Upgrading

My Helm used to work, then I upgrade. Now it is broken.

**Q: After upgrade, I get the error "Client version is incompatible". What's wrong?**

Tiller and Helm have to negotiate a common version to make sure that they can safely
communicate without breaking API assumptions. That error means that the version
difference is too great to safely continue. Typically, you need to upgrade
Tiller manually for this.

The [Installation Guide](./#installing-helm) has definitive information about safely
upgrading Helm and Tiller.

The rules for version numbers are as follows:

- Pre-release versions are incompatible with everything else. `Alpha.1` is incompatible with `Alpha.2`.
- Patch revisions _are compatible_: 1.2.3 is compatible with 1.2.4
- Minor revisions _are not compatible_: 1.2.0 is not compatible with 1.3.0,
  though we may relax this constraint in the future.
- Major revisions _are not compatible_: 1.0.0 is not compatible with 2.0.0.

## Uninstalling

I am trying to remove stuff.

**Q: When I delete the Tiller deployment, how come all the releases are still there?**

Releases are stored in ConfigMaps inside of the `kube-system` namespace. You will
have to manually delete them to get rid of the record, or use ```helm delete --purge```.

**Q: I want to delete my local Helm. Where are all its files?**

Along with the `helm` binary, Helm stores some files in `$HELM_HOME`, which is
located by default in `~/.helm`.

# Using Helm

This guide explains the basics of using Helm (and Tiller) to manage
packages on your Kubernetes cluster. It assumes that you have already
[installed](./#installing-helm) the Helm client and the Tiller server (typically by `helm
init`).

If you are simply interested in running a few quick commands, you may
wish to begin with the [Quickstart Guide](./#quickstart). This chapter
covers the particulars of Helm commands, and explains how to use Helm.

## Three Big Concepts

A *Chart* is a Helm package. It contains all of the resource definitions
necessary to run an application, tool, or service inside of a Kubernetes
cluster. Think of it like the Kubernetes equivalent of a Homebrew formula,
an Apt dpkg, or a Yum RPM file.

A *Repository* is the place where charts can be collected and shared.
It's like Perl's [CPAN archive](http://www.cpan.org) or the
[Fedora Package Database](https://admin.fedoraproject.org/pkgdb/), but for
Kubernetes packages.

A *Release* is an instance of a chart running in a Kubernetes cluster.
One chart can often be installed many times into the same cluster. And
each time it is installed, a new _release_ is created. Consider a MySQL
chart. If you want two databases running in your cluster, you can
install that chart twice. Each one will have its own _release_, which
will in turn have its own _release name_.

With these concepts in mind, we can now explain Helm like this:

Helm installs _charts_ into Kubernetes, creating a new _release_ for
each installation. And to find new charts, you can search Helm chart
_repositories_.

## 'helm search': Finding Charts

When you first install Helm, it is preconfigured to talk to the official
Kubernetes charts repository. This repository contains a number of
carefully curated and maintained charts. This chart repository is named
`stable` by default.

You can see which charts are available by running `helm search`:

```console
$ helm search
NAME                 	VERSION 	DESCRIPTION
stable/drupal   	0.3.2   	One of the most versatile open source content m...
stable/jenkins  	0.1.0   	A Jenkins Helm chart for Kubernetes.
stable/mariadb  	0.5.1   	Chart for MariaDB
stable/mysql    	0.1.0   	Chart for MySQL
...
```

With no filter, `helm search` shows you all of the available charts. You
can narrow down your results by searching with a filter:

```console
$ helm search mysql
NAME               	VERSION	DESCRIPTION
stable/mysql  	0.1.0  	Chart for MySQL
stable/mariadb	0.5.1  	Chart for MariaDB
```

Now you will only see the results that match your filter.

Why is
`mariadb` in the list? Because its package description relates it to
MySQL. We can use `helm inspect chart` to see this:

```console
$ helm inspect stable/mariadb
Fetched stable/mariadb to mariadb-0.5.1.tgz
description: Chart for MariaDB
engine: gotpl
home: https://mariadb.org
keywords:
- mariadb
- mysql
- database
- sql
...
```

Search is a good way to find available packages. Once you have found a
package you want to install, you can use `helm install` to install it.

## 'helm install': Installing a Package

To install a new package, use the `helm install` command. At its
simplest, it takes only one argument: The name of the chart.

```console
$ helm install stable/mariadb
Fetched stable/mariadb-0.3.0 to /Users/mattbutcher/Code/Go/src/k8s.io/helm/mariadb-0.3.0.tgz
NAME: happy-panda
LAST DEPLOYED: Wed Sep 28 12:32:28 2016
NAMESPACE: default
STATUS: DEPLOYED

Resources:
==> extensions/Deployment
NAME                     DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
happy-panda-mariadb   1         0         0            0           1s

==> v1/Secret
NAME                     TYPE      DATA      AGE
happy-panda-mariadb   Opaque    2         1s

==> v1/Service
NAME                     CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
happy-panda-mariadb   10.0.0.70    <none>        3306/TCP   1s


Notes:
MariaDB can be accessed via port 3306 on the following DNS name from within your cluster:
happy-panda-mariadb.default.svc.cluster.local

To connect to your database run the following command:

   kubectl run happy-panda-mariadb-client --rm --tty -i --image bitnami/mariadb --command -- mysql -h happy-panda-mariadb
```

Now the `mariadb` chart is installed. Note that installing a chart
creates a new _release_ object. The release above is named
`happy-panda`. (If you want to use your own release name, simply use the
`--name` flag on `helm install`.)

During installation, the `helm` client will print useful information
about which resources were created, what the state of the release is,
and also whether there are additional configuration steps you can or
should take.

Helm does not wait until all of the resources are running before it
exits. Many charts require Docker images that are over 600M in size, and
may take a long time to install into the cluster.

To keep track of a release's state, or to re-read configuration
information, you can use `helm status`:

```console
$ helm status happy-panda
Last Deployed: Wed Sep 28 12:32:28 2016
Namespace: default
Status: DEPLOYED

Resources:
==> v1/Service
NAME                     CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
happy-panda-mariadb   10.0.0.70    <none>        3306/TCP   4m

==> extensions/Deployment
NAME                     DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
happy-panda-mariadb   1         1         1            1           4m

==> v1/Secret
NAME                     TYPE      DATA      AGE
happy-panda-mariadb   Opaque    2         4m


Notes:
MariaDB can be accessed via port 3306 on the following DNS name from within your cluster:
happy-panda-mariadb.default.svc.cluster.local

To connect to your database run the following command:

   kubectl run happy-panda-mariadb-client --rm --tty -i --image bitnami/mariadb --command -- mysql -h happy-panda-mariadb
```

The above shows the current state of your release.

### Customizing the Chart Before Installing

Installing the way we have here will only use the default configuration
options for this chart. Many times, you will want to customize the chart
to use your preferred configuration.

To see what options are configurable on a chart, use `helm inspect
values`:

```console
helm inspect values stable/mariadb
Fetched stable/mariadb-0.3.0.tgz to /Users/mattbutcher/Code/Go/src/k8s.io/helm/mariadb-0.3.0.tgz
## Bitnami MariaDB image version
## ref: https://hub.docker.com/r/bitnami/mariadb/tags/
##
## Default: none
imageTag: 10.1.14-r3

## Specify a imagePullPolicy
## Default to 'Always' if imageTag is 'latest', else set to 'IfNotPresent'
## ref: http://kubernetes.io/docs/user-guide/images/#pre-pulling-images
##
# imagePullPolicy:

## Specify password for root user
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#setting-the-root-password-on-first-run
##
# mariadbRootPassword:

## Create a database user
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#creating-a-database-user-on-first-run
##
# mariadbUser:
# mariadbPassword:

## Create a database
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#creating-a-database-on-first-run
##
# mariadbDatabase:
```

You can then override any of these settings in a YAML formatted file,
and then pass that file during installation.

```console
$ echo '{mariadbUser: user0, mariadbDatabase: user0db}' > config.yaml
$ helm install -f config.yaml stable/mariadb
```

The above will create a default MariaDB user with the name `user0`, and
grant this user access to a newly created `user0db` database, but will
accept all the rest of the defaults for that chart.

There are two ways to pass configuration data during install:

- `--values` (or `-f`): Specify a YAML file with overrides. This can be specified multiple times
  and the rightmost file will take precedence
- `--set` (and its variants `--set-string` and `--set-file`): Specify overrides on the command line.

If both are used, `--set` values are merged into `--values` with higher precedence.
Overrides specified with `--set` are persisted in a configmap. Values that have been
`--set` can be viewed for a given release with `helm get values <release-name>`.
Values that have been `--set` can be cleared by running `helm upgrade` with `--reset-values`
specified.

#### The Format and Limitations of `--set`

The `--set` option takes zero or more name/value pairs. At its simplest, it is
used like this: `--set name=value`. The YAML equivalent of that is:

```yaml
name: value
```

Multiple values are separated by `,` characters. So `--set a=b,c=d` becomes:

```yaml
a: b
c: d
```

More complex expressions are supported. For example, `--set outer.inner=value` is
translated into this:
```yaml
outer:
  inner: value
```

Lists can be expressed by enclosing values in `{` and `}`. For example,
`--set name={a, b, c}` translates to:

```yaml
name:
  - a
  - b
  - c
```

As of Helm 2.5.0, it is possible to access list items using an array index syntax.
For example, `--set servers[0].port=80` becomes:

```yaml
servers:
  - port: 80
```

Multiple values can be set this way. The line `--set servers[0].port=80,servers[0].host=example` becomes:

```yaml
servers:
  - port: 80
    host: example
```

Sometimes you need to use special characters in your `--set` lines. You can use
a backslash to escape the characters; `--set name="value1\,value2"` will become:

```yaml
name: "value1,value2"
```

Similarly, you can escape dot sequences as well, which may come in handy when charts use the
`toYaml` function to parse annotations, labels and node selectors. The syntax for
`--set nodeSelector."kubernetes\.io/role"=master` becomes:

```yaml
nodeSelector:
  kubernetes.io/role: master
```

Deeply nested data structures can be difficult to express using `--set`. Chart
designers are encouraged to consider the `--set` usage when designing the format
of a `values.yaml` file.

Helm will cast certain values specified with `--set` to integers.
For example, `--set foo=true` results Helm to cast `true` into an int64 value.
In case you want a string, use a `--set`'s variant named `--set-string`. `--set-string foo=true` results in a string value of `"true"`.

`--set-file key=filepath` is another variant of `--set`.
It reads the file and use its content as a value.
An example use case of it is to inject a multi-line text into values without dealing with indentation in YAML.
Say you want to create a [brigade](https://github.com/Azure/brigade) project with certain value containing 5 lines JavaScript code, you might write a `values.yaml` like:

```yaml
defaultScript: |
  const { events, Job } = require("brigadier")
  function run(e, project) {
    console.log("hello default script")
  }
  events.on("run", run)
```

Being embedded in a YAML, this makes it harder for you to use IDE features and testing framework and so on that supports writing code.
Instead, you can use `--set-file defaultScript=brigade.js` with `brigade.js` containing:

```javascript
const { events, Job } = require("brigadier")
function run(e, project) {
  console.log("hello default script")
}
events.on("run", run)
```

### More Installation Methods

The `helm install` command can install from several sources:

- A chart repository (as we've seen above)
- A local chart archive (`helm install foo-0.1.1.tgz`)
- An unpacked chart directory (`helm install path/to/foo`)
- A full URL (`helm install https://example.com/charts/foo-1.2.3.tgz`)

## 'helm upgrade' and 'helm rollback': Upgrading a Release, and Recovering on Failure

When a new version of a chart is released, or when you want to change
the configuration of your release, you can use the `helm upgrade`
command.

An upgrade takes an existing release and upgrades it according to the
information you provide. Because Kubernetes charts can be large and
complex, Helm tries to perform the least invasive upgrade. It will only
update things that have changed since the last release.

```console
$ helm upgrade -f panda.yaml happy-panda stable/mariadb
Fetched stable/mariadb-0.3.0.tgz to /Users/mattbutcher/Code/Go/src/k8s.io/helm/mariadb-0.3.0.tgz
happy-panda has been upgraded. Happy Helming!
Last Deployed: Wed Sep 28 12:47:54 2016
Namespace: default
Status: DEPLOYED
...
```

In the above case, the `happy-panda` release is upgraded with the same
chart, but with a new YAML file:

```yaml
mariadbUser: user1
```

We can use `helm get values` to see whether that new setting took
effect.

```console
$ helm get values happy-panda
mariadbUser: user1
```

The `helm get` command is a useful tool for looking at a release in the
cluster. And as we can see above, it shows that our new values from
`panda.yaml` were deployed to the cluster.

Now, if something does not go as planned during a release, it is easy to
roll back to a previous release using `helm rollback [RELEASE] [REVISION]`.

```console
$ helm rollback happy-panda 1
```

The above rolls back our happy-panda to its very first release version.
A release version is an incremental revision. Every time an install,
upgrade, or rollback happens, the revision number is incremented by 1.
The first revision number is always 1. And we can use `helm history [RELEASE]`
to see revision numbers for a certain release.

## Helpful Options for Install/Upgrade/Rollback
There are several other helpful options you can specify for customizing the
behavior of Helm during an install/upgrade/rollback. Please note that this
is not a full list of cli flags. To see a description of all flags, just run
`helm <command> --help`.

- `--timeout`: A value in seconds to wait for Kubernetes commands to complete
  This defaults to 300 (5 minutes)
- `--wait`: Waits until all Pods are in a ready state, PVCs are bound, Deployments
  have minimum (`Desired` minus `maxUnavailable`) Pods in ready state and
  Services have an IP address (and Ingress if a `LoadBalancer`) before
  marking the release as successful. It will wait for as long as the
  `--timeout` value. If timeout is reached, the release will be marked as
  `FAILED`. Note: In scenario where Deployment has `replicas` set to 1 and
  `maxUnavailable` is not set to 0 as part of rolling update strategy,
  `--wait` will return as ready as it has satisfied the minimum Pod in ready condition.
- `--no-hooks`: This skips running hooks for the command
- `--recreate-pods` (only available for `upgrade` and `rollback`): This flag
  will cause all pods to be recreated (with the exception of pods belonging to
  deployments)

## 'helm delete': Deleting a Release

When it is time to uninstall or delete a release from the cluster, use
the `helm delete` command:

```console
$ helm delete happy-panda
```

This will remove the release from the cluster. You can see all of your
currently deployed releases with the `helm list` command:

```console
$ helm list
NAME           	VERSION	UPDATED                        	STATUS         	CHART
inky-cat       	1      	Wed Sep 28 12:59:46 2016       	DEPLOYED       	alpine-0.1.0
```

From the output above, we can see that the `happy-panda` release was
deleted.

However, Helm always keeps records of what releases happened. Need to
see the deleted releases? `helm list --deleted` shows those, and `helm
list --all` shows all of the releases (deleted and currently deployed,
as well as releases that failed):

```console
⇒  helm list --all
NAME           	VERSION	UPDATED                        	STATUS         	CHART
happy-panda   	2      	Wed Sep 28 12:47:54 2016       	DELETED        	mariadb-0.3.0
inky-cat       	1      	Wed Sep 28 12:59:46 2016       	DEPLOYED       	alpine-0.1.0
kindred-angelf 	2      	Tue Sep 27 16:16:10 2016       	DELETED        	alpine-0.1.0
```

Because Helm keeps records of deleted releases, a release name cannot be
re-used. (If you _really_ need to re-use a release name, you can use the
`--replace` flag, but it will simply re-use the existing release and
replace its resources.)

Note that because releases are preserved in this way, you can rollback a
deleted resource, and have it re-activate.

## 'helm repo': Working with Repositories

So far, we've been installing charts only from the `stable` repository.
But you can configure `helm` to use other repositories. Helm provides
several repository tools under the `helm repo` command.

You can see which repositories are configured using `helm repo list`:

```console
$ helm repo list
NAME           	URL
stable         	https://kubernetes-charts.storage.googleapis.com
local          	http://localhost:8879/charts
mumoshu        	https://mumoshu.github.io/charts
```

And new repositories can be added with `helm repo add`:

```console
$ helm repo add dev https://example.com/dev-charts
```

Because chart repositories change frequently, at any point you can make
sure your Helm client is up to date by running `helm repo update`.

## Creating Your Own Charts

The [Chart Development Guide](./#charts) explains how to develop your own
charts. But you can get started quickly by using the `helm create`
command:

```console
$ helm create deis-workflow
Creating deis-workflow
```

Now there is a chart in `./deis-workflow`. You can edit it and create
your own templates.

As you edit your chart, you can validate that it is well-formatted by
running `helm lint`.

When it's time to package the chart up for distribution, you can run the
`helm package` command:

```console
$ helm package deis-workflow
deis-workflow-0.1.0.tgz
```

And that chart can now easily be installed by `helm install`:

```console
$ helm install ./deis-workflow-0.1.0.tgz
...
```

Charts that are archived can be loaded into chart repositories. See the
documentation for your chart repository server to learn how to upload.

Note: The `stable` repository is managed on the [Helm Charts
GitHub repository](https://github.com/helm/charts). That project
accepts chart source code, and (after audit) packages those for you.

## Tiller, Namespaces and RBAC
In some cases you may wish to scope Tiller or deploy multiple Tillers to a single cluster. Here are some best practices when operating in those circumstances.

1. Tiller can be [installed](./#installing-helm) into any namespace. By default, it is installed into kube-system. You can run multiple Tillers provided they each run in their own namespace.
2. Limiting Tiller to only be able to install into specific namespaces and/or resource types is controlled by Kubernetes [RBAC](https://kubernetes.io/docs/admin/authorization/rbac/) roles and rolebindings. You can add a service account to Tiller when configuring Helm via `helm init --service-account <NAME>`. You can find more information about that [here](./#role-based-access-control).
3. Release names are unique PER TILLER INSTANCE.
4. Charts should only contain resources that exist in a single namespace.
5. It is not recommended to have multiple Tillers configured to manage resources in the same namespace.

## Conclusion

This chapter has covered the basic usage patterns of the `helm` client,
including searching, installation, upgrading, and deleting. It has also
covered useful utility commands like `helm status`, `helm get`, and
`helm repo`.

For more information on these commands, take a look at Helm's built-in
help: `helm help`.

In the next chapter, we look at the process of developing charts.

# The Helm Plugins Guide

Helm 2.1.0 introduced the concept of a client-side Helm _plugin_. A plugin is a
tool that can be accessed through the `helm` CLI, but which is not part of the
built-in Helm codebase.

Existing plugins can be found on [related](../related/#helm-plugins) section or by searching [Github](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories).

This guide explains how to use and create plugins.

## An Overview

Helm plugins are add-on tools that integrate seamlessly with Helm. They provide
a way to extend the core feature set of Helm, but without requiring every new
feature to be written in Go and added to the core tool.

Helm plugins have the following features:

- They can be added and removed from a Helm installation without impacting the
  core Helm tool.
- They can be written in any programming language.
- They integrate with Helm, and will show up in `helm help` and other places.

Helm plugins live in `$(helm home)/plugins`.

The Helm plugin model is partially modeled on Git's plugin model. To that end,
you may sometimes hear `helm` referred to as the _porcelain_ layer, with
plugins being the _plumbing_. This is a shorthand way of suggesting that
Helm provides the user experience and top level processing logic, while the
plugins do the "detail work" of performing a desired action.

## Installing a Plugin

Plugins are installed using the `$ helm plugin install <path|url>` command. You can pass in a path to a plugin on your local file system or a url of a remote VCS repo. The `helm plugin install` command clones or copies the plugin at the path/url given into `$ (helm home)/plugins`

```console
$ helm plugin install https://github.com/technosophos/helm-template
```

If you have a plugin tar distribution, simply untar the plugin into the
`$(helm home)/plugins` directory.

You can also install tarball plugins directly from url by issuing `helm plugin install http://domain/path/to/plugin.tar.gz`

## Building Plugins

In many ways, a plugin is similar to a chart. Each plugin has a top-level
directory, and then a `plugin.yaml` file.

```
$(helm home)/plugins/
  |- keybase/
      |
      |- plugin.yaml
      |- keybase.sh

```

In the example above, the `keybase` plugin is contained inside of a directory
named `keybase`. It has two files: `plugin.yaml` (required) and an executable
script, `keybase.sh` (optional).

The core of a plugin is a simple YAML file named `plugin.yaml`.
Here is a plugin YAML for a plugin that adds support for Keybase operations:

```
name: "keybase"
version: "0.1.0"
usage: "Integrate Keybase.io tools with Helm"
description: |-
  This plugin provides Keybase services to Helm.
ignoreFlags: false
useTunnel: false
command: "$HELM_PLUGIN_DIR/keybase.sh"
```

The `name` is the name of the plugin. When Helm executes it plugin, this is the
name it will use (e.g. `helm NAME` will invoke this plugin).

_`name` should match the directory name._ In our example above, that means the
plugin with `name: keybase` should be contained in a directory named `keybase`.

Restrictions on `name`:

- `name` cannot duplicate one of the existing `helm` top-level commands.
- `name` must be restricted to the characters ASCII a-z, A-Z, 0-9, `_` and `-`.

`version` is the SemVer 2 version of the plugin.
`usage` and `description` are both used to generate the help text of a command.

The `ignoreFlags` switch tells Helm to _not_ pass flags to the plugin. So if a
plugin is called with `helm myplugin --foo` and `ignoreFlags: true`, then `--foo`
is silently discarded.

The `useTunnel` switch indicates that the plugin needs a tunnel to Tiller. This
should be set to `true` _anytime a plugin talks to Tiller_. It will cause Helm
to open a tunnel, and then set `$TILLER_HOST` to the right local address for that
tunnel. But don't worry: if Helm detects that a tunnel is not necessary because
Tiller is running locally, it will not create the tunnel.

Finally, and most importantly, `command` is the command that this plugin will
execute when it is called. Environment variables are interpolated before the plugin
is executed. The pattern above illustrates the preferred way to indicate where
the plugin program lives.

There are some strategies for working with plugin commands:

- If a plugin includes an executable, the executable for a `command:` should be
  packaged in the plugin directory.
- The `command:` line will have any environment variables expanded before
  execution. `$HELM_PLUGIN_DIR` will point to the plugin directory.
- The command itself is not executed in a shell. So you can't oneline a shell script.
- Helm injects lots of configuration into environment variables. Take a look at
  the environment to see what information is available.
- Helm makes no assumptions about the language of the plugin. You can write it
  in whatever you prefer.
- Commands are responsible for implementing specific help text for `-h` and `--help`.
  Helm will use `usage` and `description` for `helm help` and `helm help myplugin`,
  but will not handle `helm myplugin --help`.

## Downloader Plugins
By default, Helm is able to fetch Charts using HTTP/S. As of Helm 2.4.0, plugins
can have a special capability to download Charts from arbitrary sources.

Plugins shall declare this special capability in the `plugin.yaml` file (top level):

```
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

If such plugin is installed, Helm can interact with the repository using the specified
protocol scheme by invoking the `command`. The special repository shall be added
similarly to the regular ones: `helm repo add favorite myprotocol://example.com/`
The rules for the special repos are the same to the regular ones: Helm must be able
to download the `index.yaml` file in order to discover and cache the list of
available Charts.

The defined command will be invoked with the following scheme:
`command certFile keyFile caFile full-URL`. The SSL credentials are coming from the
repo definition, stored in `$HELM_HOME/repository/repositories.yaml`. Downloader
plugin is expected to dump the raw content to stdout and report errors on stderr.

## Environment Variables

When Helm executes a plugin, it passes the outer environment to the plugin, and
also injects some additional environment variables.

Variables like `KUBECONFIG` are set for the plugin if they are set in the
outer environment.

The following variables are guaranteed to be set:

- `HELM_PLUGIN`: The path to the plugins directory
- `HELM_PLUGIN_NAME`: The name of the plugin, as invoked by `helm`. So
  `helm myplug` will have the short name `myplug`.
- `HELM_PLUGIN_DIR`: The directory that contains the plugin.
- `HELM_BIN`: The path to the `helm` command (as executed by the user).
- `HELM_HOME`: The path to the Helm home.
- `HELM_PATH_*`: Paths to important Helm files and directories are stored in
  environment variables prefixed by `HELM_PATH`.
- `TILLER_HOST`: The `domain:port` to Tiller. If a tunnel is created, this
  will point to the local endpoint for the tunnel. Otherwise, it will point
  to `$HELM_HOST`, `--host`, or the default host (according to Helm's rules of
  precedence).

While `HELM_HOST` _may_ be set, there is no guarantee that it will point to the
correct Tiller instance. This is done to allow plugin developer to access
`HELM_HOST` in its raw state when the plugin itself needs to manually configure
a connection.

## A Note on `useTunnel`

If a plugin specifies `useTunnel: true`, Helm will do the following (in order):

1. Parse global flags and the environment
2. Create the tunnel
3. Set `TILLER_HOST`
4. Execute the plugin
5. Close the tunnel

The tunnel is removed as soon as the `command` returns. So, for example, a
command cannot background a process and assume that process will be able
to use the tunnel.

## A Note on Flag Parsing

When executing a plugin, Helm will parse global flags for its own use. Some of
these flags are _not_ passed on to the plugin.

- `--debug`: If this is specified, `$HELM_DEBUG` is set to `1`
- `--home`: This is converted to `$HELM_HOME`
- `--host`: This is converted to `$HELM_HOST`
- `--kube-context`: This is simply dropped. If your plugin uses `useTunnel`, this
  is used to set up the tunnel for you.

Plugins _should_ display help text and then exit for `-h` and `--help`. In all
other cases, plugins may use flags as appropriate.

# Role-based Access Control

In Kubernetes, granting a role to an application-specific service account is a best practice to ensure that your application is operating in the scope that you have specified. Read more about service account permissions [in the official Kubernetes docs](https://kubernetes.io/docs/admin/authorization/rbac/#service-account-permissions).

Bitnami also has a fantastic guide for [configuring RBAC in your cluster](https://docs.bitnami.com/kubernetes/how-to/configure-rbac-in-your-kubernetes-cluster/) that takes you through RBAC basics.

This guide is for users who want to restrict Tiller's capabilities to install resources to certain namespaces, or to grant a Helm client running access to a Tiller instance.

## Tiller and Role-based Access Control

You can add a service account to Tiller using the `--service-account <NAME>` flag while you're configuring Helm. As a prerequisite, you'll have to create a role binding which specifies a [role](https://kubernetes.io/docs/admin/authorization/rbac/#role-and-clusterrole) and a [service account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) name that have been set up in advance.

Once you have satisfied the pre-requisite and have a service account with the correct permissions, you'll run a command like this: `helm init --service-account <NAME>`

### Example: Service account with cluster-admin role

In `rbac-config.yaml`:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: tiller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: tiller
    namespace: kube-system
```

_Note: The cluster-admin role is created by default in a Kubernetes cluster, so you don't have to define it explicitly._

```console
$ kubectl create -f rbac-config.yaml
serviceaccount "tiller" created
clusterrolebinding "tiller" created
$ helm init --service-account tiller
```

### Example: Deploy Tiller in a namespace, restricted to deploying resources only in that namespace

In the example above, we gave Tiller admin access to the entire cluster. You are not at all required to give Tiller cluster-admin access for it to work. Instead of specifying a ClusterRole or a ClusterRoleBinding, you can specify a Role and RoleBinding to limit Tiller's scope to a particular namespace.

```console
$ kubectl create namespace tiller-world
namespace "tiller-world" created
$ kubectl create serviceaccount tiller --namespace tiller-world
serviceaccount "tiller" created
```

Define a Role that allows Tiller to manage all resources in `tiller-world` like in `role-tiller.yaml`:

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: tiller-manager
  namespace: tiller-world
rules:
- apiGroups: ["", "batch", "extensions", "apps"]
  resources: ["*"]
  verbs: ["*"]
```

```console
$ kubectl create -f role-tiller.yaml
role "tiller-manager" created
```

In `rolebinding-tiller.yaml`,

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: tiller-binding
  namespace: tiller-world
subjects:
- kind: ServiceAccount
  name: tiller
  namespace: tiller-world
roleRef:
  kind: Role
  name: tiller-manager
  apiGroup: rbac.authorization.k8s.io
```

```console
$ kubectl create -f rolebinding-tiller.yaml
rolebinding "tiller-binding" created
```

Afterwards you can run `helm init` to install Tiller in the `tiller-world` namespace.

```console
$ helm init --service-account tiller --tiller-namespace tiller-world
$HELM_HOME has been configured at /Users/awesome-user/.helm.

Tiller (the Helm server side component) has been installed into your Kubernetes Cluster.
Happy Helming!

$ helm install nginx --tiller-namespace tiller-world --namespace tiller-world
NAME:   wayfaring-yak
LAST DEPLOYED: Mon Aug  7 16:00:16 2017
NAMESPACE: tiller-world
STATUS: DEPLOYED

RESOURCES:
==> v1/Pod
NAME                  READY  STATUS             RESTARTS  AGE
wayfaring-yak-alpine  0/1    ContainerCreating  0         0s
```

### Example: Deploy Tiller in a namespace, restricted to deploying resources in another namespace

In the example above, we gave Tiller admin access to the namespace it was deployed inside. Now, let's limit Tiller's scope to deploy resources in a different namespace!

For example, let's install Tiller in the namespace `myorg-system` and allow Tiller to deploy resources in the namespace `myorg-users`.

```console
$ kubectl create namespace myorg-system
namespace "myorg-system" created
$ kubectl create serviceaccount tiller --namespace myorg-system
serviceaccount "tiller" created
```

Define a Role that allows Tiller to manage all resources in `myorg-users` like in `role-tiller.yaml`:

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: tiller-manager
  namespace: myorg-users
rules:
- apiGroups: ["", "batch", "extensions", "apps"]
  resources: ["*"]
  verbs: ["*"]
```

```console
$ kubectl create -f role-tiller.yaml
role "tiller-manager" created
```

Bind the service account to that role. In `rolebinding-tiller.yaml`,

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: tiller-binding
  namespace: myorg-users
subjects:
- kind: ServiceAccount
  name: tiller
  namespace: myorg-system
roleRef:
  kind: Role
  name: tiller-manager
  apiGroup: rbac.authorization.k8s.io
```

```console
$ kubectl create -f rolebinding-tiller.yaml
rolebinding "tiller-binding" created
```

We'll also need to grant Tiller access to read configmaps in myorg-system so it can store release information. In `role-tiller-myorg-system.yaml`:

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: myorg-system
  name: tiller-manager
rules:
- apiGroups: ["", "extensions", "apps"]
  resources: ["configmaps"]
  verbs: ["*"]
```

```console
$ kubectl create -f role-tiller-myorg-system.yaml
role "tiller-manager" created
```

And the respective role binding. In `rolebinding-tiller-myorg-system.yaml`:

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: tiller-binding
  namespace: myorg-system
subjects:
- kind: ServiceAccount
  name: tiller
  namespace: myorg-system
roleRef:
  kind: Role
  name: tiller-manager
  apiGroup: rbac.authorization.k8s.io
```

```console
$ kubectl create -f rolebinding-tiller-myorg-system.yaml
rolebinding "tiller-binding" created
```

## Helm and Role-based Access Control

When running a Helm client in a pod, in order for the Helm client to talk to a Tiller instance, it will need certain privileges to be granted. Specifically, the Helm client will need to be able to create pods, forward ports and be able to list pods in the namespace where Tiller is running (so it can find Tiller).

### Example: Deploy Helm in a namespace, talking to Tiller in another namespace

In this example, we will assume Tiller is running in a namespace called `tiller-world` and that the Helm client is running in a namespace called `helm-world`. By default, Tiller is running in the `kube-system` namespace.

In `helm-user.yaml`:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: helm
  namespace: helm-world
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: tiller-user
  namespace: tiller-world
rules:
- apiGroups:
  - ""
  resources:
  - pods/portforward
  verbs:
  - create
- apiGroups:
  - ""
  resources:
  - pods
  verbs:
  - list
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: tiller-user-binding
  namespace: tiller-world
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: tiller-user
subjects:
- kind: ServiceAccount
  name: helm
  namespace: helm-world
```

```console
$ kubectl create -f helm-user.yaml
serviceaccount "helm" created
role "tiller-user" created
rolebinding "tiller-user-binding" created
```

# Using SSL Between Helm and Tiller

This document explains how to create strong SSL/TLS connections between Helm and
Tiller. The emphasis here is on creating an internal CA, and using both the
cryptographic and identity functions of SSL.

> Support for TLS-based auth was introduced in Helm 2.3.0

Configuring SSL is considered an advanced topic, and knowledge of Helm and Tiller
is assumed.

## Overview

The Tiller authentication model uses client-side SSL certificates. Tiller itself
verifies these certificates using a certificate authority. Likewise, the client
also verifies Tiller's identity by certificate authority.

There are numerous possible configurations for setting up certificates and authorities,
but the method we cover here will work for most situations.

> As of Helm 2.7.2, Tiller _requires_ that the client certificate be validated
> by its CA. In prior versions, Tiller used a weaker validation strategy that
> allowed self-signed certificates.

In this guide, we will show how to:

- Create a private CA that is used to issue certificates for Tiller clients and
  servers.
- Create a certificate for Tiller
- Create a certificate for the Helm client
- Create a Tiller instance that uses the certificate
- Configure the Helm client to use the CA and client-side certificate

By the end of this guide, you should have a Tiller instance running that will
only accept connections from clients who can be authenticated by SSL certificate.

## Generating Certificate Authorities and Certificates

One way to generate SSL CAs is via the `openssl` command line tool. There are many
guides and best practices documents available online. This explanation is focused
on getting ready within a small amount of time. For production configurations,
we urge readers to read [the official documentation](https://www.openssl.org) and
consult other resources.

### Generate a Certificate Authority

The simplest way to generate a certificate authority is to run two commands:

```console
$ openssl genrsa -out ./ca.key.pem 4096
$ openssl req -key ca.key.pem -new -x509 -days 7300 -sha256 -out ca.cert.pem -extensions v3_ca
Enter pass phrase for ca.key.pem:
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:CO
Locality Name (eg, city) []:Boulder
Organization Name (eg, company) [Internet Widgits Pty Ltd]:tiller
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:tiller
Email Address []:tiller@example.com
```

Note that the data input above is _sample data_. You should customize to your own
specifications.

The above will generate both a secret key and a CA. Note that these two files are
very important. The key in particular should be handled with particular care.

Often, you will want to generate an intermediate signing key. For the sake of brevity,
we will be signing keys with our root CA.

### Generating Certificates

We will be generating two certificates, each representing a type of certificate:

- One certificate is for Tiller. You will want one of these _per tiller host_ that
  you run.
- One certificate is for the user. You will want one of these _per helm user_.

Since the commands to generate these are the same, we'll be creating both at the
same time. The names will indicate their target.

First, the Tiller key:

```console
$ openssl genrsa -out ./tiller.key.pem 4096
Generating RSA private key, 4096 bit long modulus
..........................................................................................................................................................................................................................................................................................................................++
............................................................................++
e is 65537 (0x10001)
Enter pass phrase for ./tiller.key.pem:
Verifying - Enter pass phrase for ./tiller.key.pem:
```

Next, generate the Helm client's key:

```console
$ openssl genrsa -out ./helm.key.pem 4096
Generating RSA private key, 4096 bit long modulus
.....++
......................................................................................................................................................................................++
e is 65537 (0x10001)
Enter pass phrase for ./helm.key.pem:
Verifying - Enter pass phrase for ./helm.key.pem:
```

Again, for production use you will generate one client certificate for each user.

Next we need to create certificates from these keys. For each certificate, this is
a two-step process of creating a CSR, and then creating the certificate.

```console
$ openssl req -key tiller.key.pem -new -sha256 -out tiller.csr.pem
Enter pass phrase for tiller.key.pem:
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:CO
Locality Name (eg, city) []:Boulder
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Tiller Server
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:tiller-server
Email Address []:

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```

And we repeat this step for the Helm client certificate:

```console
$ openssl req -key helm.key.pem -new -sha256 -out helm.csr.pem
# Answer the questions with your client user's info
```

(In rare cases, we've had to add the `-nodes` flag when generating the request.)

Now we sign each of these CSRs with the CA certificate we created (adjust the days parameter to suit your requirements):

```console
$ openssl x509 -req -CA ca.cert.pem -CAkey ca.key.pem -CAcreateserial -in tiller.csr.pem -out tiller.cert.pem -days 365
Signature ok
subject=/C=US/ST=CO/L=Boulder/O=Tiller Server/CN=tiller-server
Getting CA Private Key
Enter pass phrase for ca.key.pem:
```

And again for the client certificate:

```console
$ openssl x509 -req -CA ca.cert.pem -CAkey ca.key.pem -CAcreateserial -in helm.csr.pem -out helm.cert.pem  -days 365
```

At this point, the important files for us are these:

```
# The CA. Make sure the key is kept secret.
ca.cert.pem
ca.key.pem
# The Helm client files
helm.cert.pem
helm.key.pem
# The Tiller server files.
tiller.cert.pem
tiller.key.pem
```

Now we're ready to move on to the next steps.

## Creating a Custom Tiller Installation

Helm includes full support for creating a deployment configured for SSL. By specifying
a few flags, the `helm init` command can create a new Tiller installation complete
with all of our SSL configuration.

To take a look at what this will generate, run this command:

```console
$ helm init --dry-run --debug --tiller-tls --tiller-tls-cert ./tiller.cert.pem --tiller-tls-key ./tiller.key.pem --tiller-tls-verify --tls-ca-cert ca.cert.pem
```

The output will show you a Deployment, a Secret, and a Service. Your SSL information
will be preloaded into the Secret, which the Deployment will mount to pods as they
start up.

If you want to customize the manifest, you can save that output to a file and then
use `kubectl create` to load it into your cluster.

> We strongly recommend enabling RBAC on your cluster and adding [service accounts](./#role-based-access-control)
> with RBAC.

Otherwise, you can remove the `--dry-run` and `--debug` flags. We also recommend
putting Tiller in a non-system namespace (`--tiller-namespace=something`) and enable
a service account (`--service-account=somename`). But for this example we will stay
with the basics:

```console
$ helm init --tiller-tls --tiller-tls-cert ./tiller.cert.pem --tiller-tls-key ./tiller.key.pem --tiller-tls-verify --tls-ca-cert ca.cert.pem
```

In a minute or two it should be ready. We can check Tiller like this:

```console
$ kubectl -n kube-system get deployment
NAME            DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
... other stuff
tiller-deploy   1         1         1            1           2m
```

If there is a problem, you may want to use `kubectl get pods -n kube-system` to
find out what went wrong. With the SSL/TLS support, the most common problems all
have to do with improperly generated TLS certificates or accidentally swapping the
cert and the key.

At this point, you should get a _failure_ when you run basic Helm commands:

```console
$ helm ls
Error: transport is closing
```

This is because your Helm client does not have the correct certificate to authenticate
to Tiller.

## Configuring the Helm Client

The Tiller server is now running with TLS protection. It's time to configure the
Helm client to also perform TLS operations.

For a quick test, we can specify our configuration manually. We'll run a normal
Helm command (`helm ls`), but with SSL/TLS enabled.

```console
helm ls --tls --tls-ca-cert ca.cert.pem --tls-cert helm.cert.pem --tls-key helm.key.pem
```

This configuration sends our client-side certificate to establish identity, uses
the client key for encryption, and uses the CA certificate to validate the remote
Tiller's identity.

Typing a line that is cumbersome, though. The shortcut is to move the key,
cert, and CA into `$HELM_HOME`:

```console
$ cp ca.cert.pem $(helm home)/ca.pem
$ cp helm.cert.pem $(helm home)/cert.pem
$ cp helm.key.pem $(helm home)/key.pem
```

With this, you can simply run `helm ls --tls` to enable TLS.

### Troubleshooting

*Running a command, I get `Error: transport is closing`*

This is almost always due to a configuration error in which the client is missing
a certificate (`--tls-cert`) or the certificate is bad.

*I'm using a certificate, but get `Error: remote error: tls: bad certificate`*

This means that Tiller's CA cannot verify your certificate. In the examples above,
we used a single CA to generate both the client and server certificates. In these
examples, the CA has _signed_ the client's certificate. We then load that CA
up to Tiller. So when the client certificate is sent to the server, Tiller
checks the client certificate against the CA.

*If I use `--tls-verify` on the client, I get `Error: x509: certificate is valid for tiller-server, not localhost`*

If you plan to use `--tls-verify` on the client, you will need to make sure that
the host name that Helm connects to matches the host name on the certificate. In
some cases this is awkward, since Helm will connect over localhost, or the FQDN is
not available for public resolution.

*If I use `--tls-verify` on the client, I get `Error: x509: cannot validate certificate for 127.0.0.1 because it doesn't contain any IP SANs`*

By default, the Helm client connects to Tiller via tunnel (i.e. kube proxy) at 127.0.0.1. During the TLS handshake,
a target, usually provided as a hostname (e.g. example.com), is checked against the subject and subject alternative
names of the certificate (i.e. hostname verficiation). However, because of the tunnel, the target is an IP address.
Therefore, to validate the certificate, the IP address 127.0.0.1 must be listed as an IP subject alternative name
(IP SAN) in the Tiller certificate.

For example, to list 127.0.0.1 as an IP SAN when generating the Tiller certificate:

```console
$ echo subjectAltName=IP:127.0.0.1 > extfile.cnf
$ openssl x509 -req -CA ca.cert.pem -CAkey ca.key.pem -CAcreateserial -in tiller.csr.pem -out tiller.cert.pem -days 365 -extfile extfile.cnf
```

Alternatively, you can override the expected hostname of the tiller certificate using the `--tls-hostname` flag.

*If I use `--tls-verify` on the client, I get `Error: x509: certificate has expired or is not yet valid`*

Your helm certificate has expired, you need to sign a new certificate using your private key and the CA (and consider increasing the number of days)

If your tiller certificate has expired, you'll need to sign a new certificate, base64 encode it and update the Tiller Secret:
`kubectl edit secret tiller-secret`

## References

https://github.com/denji/golang-tls
https://www.openssl.org/docs/
https://jamielinux.com/docs/openssl-certificate-authority/sign-server-and-client-certificates.html

# Securing your Helm Installation

Helm is a powerful and flexible package-management and operations tool for Kubernetes. Installing it using the default installation command -- `helm init` -- quickly and easily installs **Tiller**, the server-side component with which Helm corresponds.

This default installation applies **_no security configurations_**, however. It's completely appropriate to use this type of installation when you are working against a cluster with no or very few security concerns, such as local development with Minikube or with a cluster that is well-secured in a private network with no data-sharing or no other users or teams. If this is the case, then the default installation is fine, but remember: With great power comes great responsibility. Always use due diligence when deciding to use the default installation.

## Who Needs Security Configurations?

For the following types of clusters we strongly recommend that you apply the proper security configurations to Helm and Tiller to ensure the safety of the cluster, the data in it, and the network to which it is connected.

- Clusters that are exposed to uncontrolled network environments: either untrusted network actors can access the cluster, or untrusted applications that can access the network environment.
- Clusters that are for many people to use -- _multitenant_ clusters -- as a shared environment
- Clusters that have access to or use high-value data or networks of any type

Often, environments like these are referred to as _production grade_ or _production quality_ because the damage done to any company by misuse of the cluster can be profound for either customers, the company itself, or both. Once the risk of damage becomes high enough, you need to ensure the integrity of your cluster no matter what the actual risk.

To configure your installation properly for your environment, you must:

- Understand the security context of your cluster
- Choose the Best Practices you should apply to your helm installation

The following assumes you have a Kubernetes configuration file (a _kubeconfig_ file) or one was given to you to access a cluster.

## Understanding the Security Context of your Cluster

`helm init` installs Tiller into the cluster in the `kube-system` namespace and without any RBAC rules applied. This is appropriate for local development and other private scenarios because it enables you to be productive immediately. It also enables you to continue running Helm with existing Kubernetes clusters that do not have role-based access control (RBAC) support until you can move your workloads to a more recent Kubernetes version.

There are four main areas to consider when securing a tiller installation:

1. Role-based access control, or RBAC
2. Tiller's gRPC endpoint and its usage by Helm
3. Tiller release information
4. Helm charts

### RBAC

Recent versions of Kubernetes employ a [role-based access control (or RBAC)](https://en.wikipedia.org/wiki/Role-based_access_control) system (as do modern operating systems) to help mitigate the damage that can be done if credentials are misused or bugs exist. Even where an identity is hijacked, the identity has only so many permissions to a controlled space. This effectively adds a layer of security to limit the scope of any attack with that identity.

Helm and Tiller are designed to install, remove, and modify logical applications that can contain many services interacting together. As a result, often its usefulness involves cluster-wide operations, which in a multitenant cluster means that great care must be taken with access to a cluster-wide Tiller installation to prevent improper activity.

Specific users and teams -- developers, operators, system and network administrators -- will need their own portion of the cluster in which they can use Helm and Tiller without risking other portions of the cluster. This means using a Kubernetes cluster with RBAC enabled and Tiller configured to enforce them. For more information about using RBAC in Kubernetes, see [Using RBAC Authorization](./#role-based-access-control).

#### Tiller and User Permissions

Tiller in its current form does not provide a way to map user credentials to specific permissions within Kubernetes. When Tiller is running inside of the cluster, it operates with the permissions of its service account. If no service account name is supplied to Tiller, it runs with the default service account for that namespace. This means that all Tiller operations on that server are executed using the Tiller pod's credentials and permissions.

To properly limit what Tiller itself can do, the standard Kubernetes RBAC mechanisms must be attached to Tiller, including Roles and RoleBindings that place explicit limits on what things a Tiller instance can install, and where.

This situation may change in the future. While the community has several methods that might address this, at the moment performing actions using the rights of the client, instead of the rights of Tiller, is contingent upon the outcome of the Pod Identity Working Group, which has taken on the task of solving the problem in a general way.

### The Tiller gRPC Endpoint

In the default installation the gRPC endpoint that Tiller offers is available inside the cluster (not external to the cluster) without authentication configuration applied. Without applying authentication, any process in the cluster can use the gRPC endpoint to perform operations inside the cluster. In a local or secured private cluster, this enables rapid usage and is normal. (When running outside the cluster, Helm authenticates through the Kubernetes API server to reach Tiller, leveraging existing Kubernetes authentication support.)

The following two sub-sections describe options of how to setup Tiller so there isn't an unauthenticated endpoint (i.e. gRPC) in your cluster.

#### Enabling TLS

(Note that out of the two options, this is the recommended one for Helm 2.)

Shared and production clusters -- for the most part -- should use Helm 2.7.2 at a minimum and configure TLS for each Tiller gRPC endpoint to ensure that within the cluster usage of gRPC endpoints is only for the properly authenticated identity for that endpoint (i.e. configure each endpoint to use a separate TLS certificate). Doing so enables any number of Tiller instances to be deployed in any number of namespaces and yet no unauthenticated usage of any gRPC endpoint is possible. Finally, use Helm `init` with the `--tiller-tls-verify` option to install Tiller with TLS enabled and to verify remote certificates, and all other Helm commands should use the `--tls` option.

For more information about the proper steps to configure Tiller and use Helm properly with TLS configured, see the [Best Practices](./#best-practices-for-securing-helm-and-tiller) section below, and [Using SSL between Helm and Tiller](#using-ssl-between-helm-and-tiller).

When Helm clients are connecting from outside of the cluster, the security between the Helm client and the API server is managed by Kubernetes itself. You may want to ensure that this link is secure. Note that if you are using the TLS configuration recommended above, not even the Kubernetes API server has access to the encrypted messages between the client and Tiller.

#### Running Tiller Locally

Contrary to the previous [Enabling TLS](./##enabling-tls) section, this section does not involve running a tiller server pod in your cluster (for what it's worth, that lines up with the current [helm v3 proposal](https://github.com/helm/community/blob/master/helm-v3/000-helm-v3)), thus there is no gRPC endpoint (and thus there's no need to create & manage TLS certificates to secure each gRPC endpoint).

Steps:
 * Fetch the latest helm release tarball from the [GitHub release page](https://github.com/helm/helm/releases), and extract and move `helm` and `tiller` somewhere on your `$PATH`.
 * "Server": Run `tiller --storage=secret`. (Note that `tiller` has a default value of ":44134" for the `--listen` argument.)
 * Client: In another terminal (and on the same host that the aforementioned `tiller` command was run for the previous bullet): Run `export HELM_HOST=:44134`, and then run `helm` commands as usual.

### Tiller's Release Information

For historical reasons, Tiller stores its release information in ConfigMaps. We suggest changing the default to Secrets.

Secrets are the Kubernetes accepted mechanism for saving configuration data that is considered sensitive. While secrets don't themselves offer many protections, Kubernetes cluster management software often treats them differently than other objects. Thus, we suggest using secrets to store releases.

Enabling this feature currently requires setting the `--storage=secret` flag in the tiller-deploy deployment. This entails directly modifying the deployment or using `helm init --override 'spec.template.spec.containers[0].command'='{/tiller,--storage=secret}'`, as no helm init flag is currently available to do this for you.

### Thinking about Charts

Because of the relative longevity of Helm, the Helm chart ecosystem evolved without the immediate concern for cluster-wide control, and especially in the developer space this makes complete sense. However, charts are a kind of package that not only installs containers you may or may not have validated yourself, but it may also install into more than one namespace.

As with all shared software, in a controlled or shared environment you must validate all software you install yourself _before_ you install it. If you have secured Tiller with TLS and have installed it with permissions to only one or a subset of namespaces, some charts may fail to install -- but in these environments, that is exactly what you want. If you need to use the chart, you may have to work with the creator or modify it yourself in order to use it securely in a multitenant cluster with proper RBAC rules applied. The `helm template` command renders the chart locally and displays the output.

Once vetted, you can use Helm's provenance tools to [ensure the provenance and integrity of charts](./#helm-provenance-and-integrity) that you use.

### gRPC Tools and Secured Tiller Configurations

Many very useful tools use the gRPC interface directly, and having been built against the default installation -- which provides cluster-wide access -- may fail once security configurations have been applied. RBAC policies are controlled by you or by the cluster operator, and either can be adjusted for the tool, or the tool can be configured to work properly within the constraints of specific RBAC policies applied to Tiller. The same may need to be done if the gRPC endpoint is secured: the tools need their own secure TLS configuration in order to use a specific Tiller instance. The combination of RBAC policies and a secured gRPC endpoint configured in conjunction with gRPC tools enables you to control your cluster environment as you should.

## Best Practices for Securing Helm and Tiller

The following guidelines reiterate the Best Practices for securing Helm and Tiller and using them correctly.

1. Create a cluster with RBAC enabled
2. Configure each Tiller gRPC endpoint to use a separate TLS certificate
3. Release information should be a Kubernetes Secret
4. Install one Tiller per user, team, or other organizational entity with the `--service-account` flag, Roles, and RoleBindings
5. Use the `--tiller-tls-verify` option with `helm init` and the `--tls` flag with other Helm commands to enforce verification

If these steps are followed, an example `helm init` command might look something like this:
```bash
$ helm init \
--override 'spec.template.spec.containers[0].command'='{/tiller,--storage=secret}' \
--tiller-tls \
--tiller-tls-verify \
--tiller-tls-cert=cert.pem \
--tiller-tls-key=key.pem \
--tls-ca-cert=ca.pem \
--service-account=accountname
```

This command will start Tiller with strong authentication over gRPC, release information stored in a Kubernetes Secret, and a service account to which RBAC policies have been applied.
