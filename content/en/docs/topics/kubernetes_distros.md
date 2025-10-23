---
title: "Kubernetes Distribution Guide"
description: "Captures information about using Helm in specific Kubernetes environments."
aliases: ["/docs/kubernetes_distros/"]
weight: 10
---

Helm should work with any [conformant version of
Kubernetes](https://github.com/cncf/k8s-conformance) (whether
[certified](https://www.cncf.io/certification/software-conformance/) or not).

This document captures information about using Helm in specific Kubernetes
environments. Please contribute more details about any distros (sorted
alphabetically) if desired.


## AKS

Helm works with [Azure Kubernetes
Service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm).

## DC/OS

Helm has been tested and is working on Mesospheres DC/OS 1.11 Kubernetes
platform, and requires no additional configuration.

## EKS

Helm works with Amazon Elastic Kubernetes Service (Amazon EKS):
[Using Helm with Amazon
EKS](https://docs.aws.amazon.com/eks/latest/userguide/helm.html).

## GKE

Google's GKE hosted Kubernetes platform is known to work with Helm, and requires
no additional configuration.

## `scripts/local-cluster` and Hyperkube

Hyperkube configured via `scripts/local-cluster.sh` is known to work. For raw
Hyperkube you may need to do some manual configuration.

## IKS

Helm works with [IBM Cloud Kubernetes
Service](https://cloud.ibm.com/docs/containers?topic=containers-helm).

## KIND (Kubernetes IN Docker)

Helm is regularly tested on [KIND](https://github.com/kubernetes-sigs/kind).

## KubeOne

Helm works in clusters that are set up by KubeOne without caveats.

## Kubermatic

Helm works in user clusters that are created by Kubermatic without caveats.
Since seed cluster can be set up in different ways Helm support depends on their
configuration.

## MicroK8s

Helm can be enabled in [MicroK8s](https://microk8s.io) using the command:
`microk8s.enable helm3`

## Minikube

Helm is tested and known to work with
[Minikube](https://github.com/kubernetes/minikube). It requires no additional
configuration.

## Openshift

Helm works straightforward on OpenShift Online, OpenShift Dedicated, OpenShift
Container Platform (version >= 3.6) or OpenShift Origin (version >= 3.6). To
learn more read [this
blog](https://blog.openshift.com/getting-started-helm-openshift/) post.

## Platform9

Helm is pre-installed with [Platform9 Managed
Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=helm_distro_notes).
Platform9 provides access to all official Helm charts through the App Catalog UI
and native Kubernetes CLI. Additional repositories can be manually added.
Further details are available in this [Platform9 App Catalog
article](https://platform9.com/support/deploying-kubernetes-apps-platform9-managed-kubernetes/?utm_source=helm_distro_notes).

## Ubuntu with `kubeadm`

Kubernetes bootstrapped with `kubeadm` is known to work on the following Linux
distributions:

- Ubuntu 16.04
- Fedora release 25

Some versions of Helm (v2.0.0-beta2) require you to `export
KUBECONFIG=/etc/kubernetes/admin.conf` or create a `~/.kube/config`.

## VMware Tanzu Kubernetes Grid

Helm runs on VMware Tanzu Kubernetes Grid, TKG, without needing configuration changes.
The Tanzu CLI can manage installing packages for [helm-controller](https://fluxcd.io/flux/components/helm/) allowing for declaratively managing Helm chart releases.
Further details available in the TKG documentation for [CLI-Managed Packages](https://docs.vmware.com/en/VMware-Tanzu-Kubernetes-Grid/1.6/vmware-tanzu-kubernetes-grid-16/GUID-packages-user-managed-index.html#package-locations-and-dependencies-5).
