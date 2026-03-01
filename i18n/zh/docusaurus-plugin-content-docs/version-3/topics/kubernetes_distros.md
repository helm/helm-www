---
title: Kubernetes 发行版指南
description: 介绍在特定 Kubernetes 环境中使用 Helm 的相关信息。
sidebar_position: 10
---

Helm 可以在任何[符合标准的 Kubernetes 版本](https://github.com/cncf/k8s-conformance)上运行（无论是否经过[认证](https://www.cncf.io/certification/software-conformance/)）。

本文档介绍在特定 Kubernetes 环境中使用 Helm 的相关信息。如有需要，欢迎补充更多发行版的详细信息（按字母顺序排列）。


## AKS

Helm 可以在 [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm) 上使用。

## DC/OS

Helm 已在 Mesosphere DC/OS 1.11 Kubernetes 平台上测试通过，无需额外配置。

## EKS

Helm 可以在 Amazon Elastic Kubernetes Service (Amazon EKS) 上使用：[在 Amazon EKS 上使用 Helm](https://docs.aws.amazon.com/eks/latest/userguide/helm.html)。

## GKE

Google 的 GKE 托管 Kubernetes 平台可以正常使用 Helm，无需额外配置。

## `scripts/local-cluster` 和 Hyperkube

通过 `scripts/local-cluster.sh` 配置的 Hyperkube 可以正常使用。对于原始 Hyperkube，可能需要进行一些手动配置。

## IKS

Helm 可以在 [IBM Cloud Kubernetes Service](https://cloud.ibm.com/docs/containers?topic=containers-helm) 上使用。

## KIND (Kubernetes IN Docker)

Helm 会定期在 [KIND](https://github.com/kubernetes-sigs/kind) 上进行测试。

## KubeOne

Helm 可以在 KubeOne 配置的集群中正常使用，无需特殊配置。

## Kubermatic

Helm 可以在 Kubermatic 创建的用户集群中正常使用，无需特殊配置。由于种子集群的配置方式可能不同，Helm 的支持情况取决于具体配置。

## MicroK8s

可以使用以下命令在 [MicroK8s](https://microk8s.io) 中启用 Helm：`microk8s.enable helm3`

## Minikube

Helm 已在 [Minikube](https://github.com/kubernetes/minikube) 上测试通过，无需额外配置。

## Openshift

Helm 可以在 OpenShift Online、OpenShift Dedicated、OpenShift Container Platform（版本 >= 3.6）或 OpenShift Origin（版本 >= 3.6）上直接使用。更多信息请参阅[这篇博客文章](https://blog.openshift.com/getting-started-helm-openshift/)。

## Platform9

Helm 已预装在 [Platform9 Managed Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=helm_distro_notes) 中。Platform9 通过 App Catalog UI 和原生 Kubernetes CLI 提供对所有官方 Helm chart 的访问。也可以手动添加其他仓库。更多详情请参阅 [Platform9 App Catalog 文档](https://platform9.com/support/deploying-kubernetes-apps-platform9-managed-kubernetes/?utm_source=helm_distro_notes)。

## 使用 `kubeadm` 的 Ubuntu

通过 `kubeadm` 引导的 Kubernetes 可以在以下 Linux 发行版上正常运行：

- Ubuntu 16.04
- Fedora release 25

某些 Helm 版本（v2.0.0-beta2）需要执行 `export KUBECONFIG=/etc/kubernetes/admin.conf` 或创建 `~/.kube/config` 文件。

## VMware Tanzu Kubernetes Grid

Helm 可以在 VMware Tanzu Kubernetes Grid (TKG) 上运行，无需更改配置。Tanzu CLI 可以管理 [helm-controller](https://fluxcd.io/flux/components/helm/) 的安装包，支持以声明式方式管理 Helm chart release。更多详情请参阅 TKG 文档中的 [CLI 管理包](https://docs.vmware.com/en/VMware-Tanzu-Kubernetes-Grid/1.6/vmware-tanzu-kubernetes-grid-16/GUID-packages-user-managed-index.html#package-locations-and-dependencies-5)部分。
