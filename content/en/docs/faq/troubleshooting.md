---
title: "Troubleshooting"
weight: 4
aliases: [
  "/docs/topics/faq/troubleshooting",
  "/docs/faq/troubleshooting"
]
---

## Troubleshooting

### I am getting a warning about "Unable to get an update from the "stable" chart repository"

Run `helm repo list`. If it shows your `stable` repository pointing to a `storage.googleapis.com` URL, you
will need to update that repository. On November 13, 2020, the Helm Charts repo [became unsupported](https://github.com/helm/charts#deprecation-timeline) after a year-long deprecation. An archive has been made available at
`https://charts.helm.sh/stable` but will no longer receive updates. 

You can run the following command to fix your repository:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

The same goes for the `incubator` repository, which has an archive available at https://charts.helm.sh/incubator.
You can run the following command to repair it:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### I am getting the warning 'WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.'

The old Google helm chart repository has been replaced by a new Helm chart repository.

Run the following command to permanently fix this:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

If you get a similar error for `incubator`, run this command:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### When I add a Helm repo, I get the error 'Error: Repo "https://kubernetes-charts.storage.googleapis.com" is no longer available'

The Helm Chart repositories are no longer supported after [a year-long deprecation period](https://github.com/helm/charts#deprecation-timeline). 
Archives for these repositories are available at `https://charts.helm.sh/stable` and `https://charts.helm.sh/incubator`, however they will no longer receive updates. The command
`helm repo add` will not let you add the old URLs unless you specify `--use-deprecated-repos`.

### On GKE (Google Container Engine) I get "No SSH tunnels currently open"

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

Another variation of the error message is:


```
Unable to connect to the server: x509: certificate signed by unknown authority
```

The issue is that your local Kubernetes config file must have the correct
credentials.

When you create a cluster on GKE, it will give you credentials, including SSL
certificates and certificate authorities. These need to be stored in a
Kubernetes config file (Default: `~/.kube/config`) so that `kubectl` and `helm`
can access them.

### After migration from Helm 2, `helm list` shows only some (or none) of my releases

It is likely that you have missed the fact that Helm 3 now uses cluster
namespaces throughout to scope releases. This means that for all commands
referencing a release you must either:

* rely on the current namespace in the active kubernetes context (as described
  by the `kubectl config view --minify` command),
* specify the correct namespace using the `--namespace`/`-n` flag, or
* for the `helm list` command, specify the `--all-namespaces`/`-A` flag

This applies to `helm ls`, `helm uninstall`, and all other `helm` commands
referencing a release.


### On macOS, the file `/etc/.mdns_debug` is accessed. Why?

We are aware of a case on macOS where Helm will try to access a file named
`/etc/.mdns_debug`. If the file exists, Helm holds the file handle open while it
executes.

This is caused by macOS's MDNS library. It attempts to load that file to read
debugging settings (if enabled). The file handle probably should not be held open, and
this issue has been reported to Apple. However, it is macOS, not Helm, that causes this
behavior.

If you do not want Helm to load this file, you may be able to compile Helm to as
a static library that does not use the host network stack. Doing so will inflate the
binary size of Helm, but will prevent the file from being open.

This issue was originally flagged as a potential security problem. But it has since
been determined that there is no flaw or vulnerability caused by this behavior.

### helm repo add fails when it used to work

In helm 3.3.1 and before, the command `helm repo add <reponame> <url>` will give
no output if you attempt to add a repo which already exists. The flag
`--no-update` would raise an error if the repo was already registered.

In helm 3.3.2 and beyond, an attempt to add an existing repo will error:

`Error: repository name (reponame) already exists, please specify a different name`

The default behavior is now reversed. `--no-update` is now ignored, while if you
want to replace (overwrite) an existing repo, you can use `--force-update`.

This is due to a breaking change for a security fix as explained in the [Helm
3.3.2 release notes](https://github.com/helm/helm/releases/tag/v3.3.2).

### Enabling Kubernetes client logging

Printing log messages for debugging the Kubernetes client can be enabled using
the [klog](https://pkg.go.dev/k8s.io/klog) flags. Using the `-v` flag to set
verbosity level will be enough for most cases.

For example:

```
helm list -v 6
```

