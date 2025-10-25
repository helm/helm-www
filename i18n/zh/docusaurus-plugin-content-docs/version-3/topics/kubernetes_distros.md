---
title: Kubernetes分发指南
description: 捕获在特定Kubernetes环境中使用Helm的有关信息
sidebar_position: 10
---


Helm 应该适用于任何[符合标准的Kubernetes版本](https://github.com/cncf/k8s-conformance)（无论是否经过[认证](https://www.cncf.io/certification/software-conformance/)）。

该文档捕获在特定Kubernetes环境中使用Helm的有关信息。如果需要，请提供更多有关发行版的详细信息（按字母排序）。

## AKS

Helm 使用 [Azure Kubernetes
Service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm)。

## DC/OS

Helm 已经测试并工作在 Mesospheres DC/OS 1.11 Kubernetes平台，且不需要额外的配置。

## EKS

Helm 使用Amazon Elastic Kubernetes Service (Amazon EKS):
[Helm 使用 Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/helm.html)。

## GKE

Google的GKE托管的Kubernetes平台可以使用Helm工作，且不需要额外配置。

## `scripts/local-cluster` 和 Hyperkube

Hyperkube 通过`scripts/local-cluster.sh`配置的可以正常工作。对于原始Hyperkube你可能需要一些手动配置。

## IKS

Helm 使用[IBM Cloud Kubernetes Service](https://cloud.ibm.com/docs/containers?topic=containers-helm)。

## KIND (Docker中Kubernetes)

Helm 会在 [KIND](https://github.com/kubernetes-sigs/kind) 上定期测试。

## KubeOne

Helm 在用KubeOne配置的集群中可以无警告地工作。

## Kubermatic

Helm在用Kubermatic配置的用户集群中可以无警告地工作。由于种子集群可以以不同的方式建立，因此Helm的支持取决于它们的配置。

## MicroK8s

Helm 可以在[MicroK8s](https://microk8s.io) 使用命令启用：`microk8s.enable helm3`

## Minikube

Helm经过测试可以与[Minikube](https://github.com/kubernetes/minikube)一起使用，不需要额外配置。

## Openshift

Helm 在OpenShift Online上工作非常简单， OpenShift Dedicated, OpenShift
Container Platform (version >= 3.6) 或 OpenShift Origin (version >= 3.6)。通过
[blog](https://blog.openshift.com/getting-started-helm-openshift/)了解更多。

## Platform9

Helm 预装在 [Platform9 Managed Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=helm_distro_notes)。
Platform9 通过App Catalog UI和本地Kubernetes CLI访问所有的官方Helm chart。可以手动添加其他仓库。
更多细节可以参考 [Platform9 App
Catalog](https://platform9.com/support/deploying-kubernetes-apps-platform9-managed-kubernetes/?utm_source=helm_distro_notes)。

## Ubuntu 和 `kubeadm`

Kubernetes 已知在以下Linux分发版本中由`kubeadm`引导启动：

- Ubuntu 16.04
- Fedora release 25

有些Helm版本 (v2.0.0-beta2) 需要 `export KUBECONFIG=/etc/kubernetes/admin.conf`
或创建一个`~/.kube/config`。

## VMware Tanzu Kubernetes Grid

Helm在VMware Tanzu Kubernetes Grid即TKG上运行时不需要改变配置。
Tanzu CLI可以管理 [helm-controller](https://fluxcd.io/flux/components/helm/) 的安装包，
允许以声明的方式管理Helm chart 版本。
TKG文档提供了关于[CLI-Managed Packages](https://docs.vmware.com/en/VMware-Tanzu-Kubernetes-Grid/1.6/vmware-tanzu-kubernetes-grid-16/GUID-packages-user-managed-index.html#package-locations-and-dependencies-5) 的更多详细内容。
