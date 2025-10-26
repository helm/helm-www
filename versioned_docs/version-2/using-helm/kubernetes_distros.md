---
sidebar_position: 5
sidebar_label: "Kubernetes Distro Notes"
slug: kubernetes-distribution-guide
---

# Kubernetes Distribution Guide

This document captures information about using Helm in specific Kubernetes
environments.

We are trying to add more details to this document. Please contribute via Pull
Requests if you can.

## MicroK8s

Helm can be enabled in [MicroK8s](https://microk8s.io) using the command: `microk8s.enable helm`

## MiniKube

Helm is tested and known to work with [minikube](https://github.com/kubernetes/minikube).
It requires no additional configuration.

## `scripts/local-cluster` and Hyperkube

Hyperkube configured via `scripts/local-cluster.sh` is known to work. For raw
Hyperkube you may need to do some manual configuration.

## GKE

Google's GKE hosted Kubernetes platform enables RBAC by default. You will need to create a service account for tiller, and use the --service-account flag when initializing the helm server.

See [Tiller and role-based access control](https://docs.helm.sh/using_helm/#role-based-access-control) for more information.

## AKS

Helm works with [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm). If using an RBAC-enabled AKS cluster, you need [a service account and role binding for the Tiller service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm#create-a-service-account).

## IKS

Helm works with [IBM Cloud Kubernetes Service](https://cloud.ibm.com/docs/containers?topic=containers-getting-started). IKS cluster enables RBAC by default and this means you will need [a service account and role binding for the Tiller service](https://cloud.ibm.com/docs/containers?topic=containers-helm#public_helm_install).

## Ubuntu with 'kubeadm'

Kubernetes bootstrapped with `kubeadm` is known to work on the following Linux
distributions:

- Arch Linux
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

## Kubermatic

Helm works in user clusters that are created by Kubermatic without caveats. Since seed cluster can be setup up in different ways Helm support depends on them.

## KubeOne

Helm works in clusters that are set up by KubeOne without caveats.
