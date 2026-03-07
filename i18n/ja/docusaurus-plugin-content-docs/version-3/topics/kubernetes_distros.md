---
title: Kubernetes ディストリビューションガイド
description: 特定の Kubernetes 環境での Helm の使用に関する情報をまとめています。
sidebar_position: 10
---

Helm は [CNCF 適合 Kubernetes](https://github.com/cncf/k8s-conformance)（[認定の有無](https://www.cncf.io/certification/software-conformance/)を問わず）で動作します。

このドキュメントでは、特定の Kubernetes 環境での Helm の使用に関する情報をまとめています。各ディストリビューションに関する情報の追加・更新にご協力いただけると幸いです。


## AKS

Helm は [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm) で動作します。

## DC/OS

Helm は Mesosphere の DC/OS 1.11 Kubernetes プラットフォームでテストされており、追加の設定なしで動作します。

## EKS

Helm は Amazon Elastic Kubernetes Service（Amazon EKS）で動作します。詳細は [Using Helm with Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/helm.html) を参照してください。

## GKE

Google の GKE ホステッド Kubernetes プラットフォームは、Helm で動作することが確認されており、追加の設定は不要です。

## `scripts/local-cluster` と Hyperkube

`scripts/local-cluster.sh` で構成された Hyperkube は動作することが確認されています。Hyperkube を直接使用する場合は、手動での設定が必要になることがあります。

## IKS

Helm は [IBM Cloud Kubernetes Service](https://cloud.ibm.com/docs/containers?topic=containers-helm) で動作します。

## KIND（Kubernetes IN Docker）

Helm は [KIND](https://github.com/kubernetes-sigs/kind) で定期的にテストされています。

## KubeOne

Helm は KubeOne によって構築されたクラスターで問題なく動作します。

## Kubermatic

Helm は Kubermatic によって作成されたユーザークラスターで問題なく動作します。シードクラスターはさまざまな方法で構築できるため、Helm のサポートはその構成に依存します。

## MicroK8s

Helm は [MicroK8s](https://microk8s.io) で以下のコマンドを使用して有効化できます。
`microk8s.enable helm3`

## Minikube

Helm は [Minikube](https://github.com/kubernetes/minikube) でテストされており、動作することが確認されています。追加の設定は不要です。

## Openshift

Helm は OpenShift Online、OpenShift Dedicated、OpenShift Container Platform（バージョン 3.6 以上）、または OpenShift Origin（バージョン 3.6 以上）で問題なく動作します。詳細は[こちらのブログ記事](https://blog.openshift.com/getting-started-helm-openshift/)を参照してください。

## Platform9

Helm は [Platform9 Managed Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=helm_distro_notes) にプリインストールされています。Platform9 は App Catalog UI とネイティブの Kubernetes CLI を通じて、すべての公式 Helm chart へのアクセスを提供しています。追加のリポジトリを手動で追加することも可能です。詳細については、[Platform9 App Catalog に関する記事](https://platform9.com/support/deploying-kubernetes-apps-platform9-managed-kubernetes/?utm_source=helm_distro_notes)を参照してください。

## Ubuntu と `kubeadm`

`kubeadm` でブートストラップされた Kubernetes は、以下の Linux ディストリビューションで動作することが確認されています。

- Ubuntu 16.04
- Fedora release 25

Helm の一部のバージョン（v2.0.0-beta2）では、`export KUBECONFIG=/etc/kubernetes/admin.conf` を実行するか、`~/.kube/config` を作成する必要があります。

## VMware Tanzu Kubernetes Grid

Helm は VMware Tanzu Kubernetes Grid（TKG）で設定変更なしに動作します。Tanzu CLI は [helm-controller](https://fluxcd.io/flux/components/helm/) のパッケージインストールを管理でき、Helm chart リリースを宣言的に管理できます。詳細は TKG ドキュメントの [CLI-Managed Packages](https://docs.vmware.com/en/VMware-Tanzu-Kubernetes-Grid/1.6/vmware-tanzu-kubernetes-grid-16/GUID-packages-user-managed-index.html#package-locations-and-dependencies-5) を参照してください。
