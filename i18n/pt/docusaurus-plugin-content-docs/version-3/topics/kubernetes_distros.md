---
title: Guia de Distribuições Kubernetes
description: Informações sobre o uso do Helm em ambientes Kubernetes específicos.
sidebar_position: 10
---

O Helm deve funcionar com qualquer [versão conforme do
Kubernetes](https://github.com/cncf/k8s-conformance) (seja ela
[certificada](https://www.cncf.io/certification/software-conformance/) ou não).

Este documento contém informações sobre o uso do Helm em ambientes Kubernetes
específicos. Contribua com mais detalhes sobre quaisquer distribuições
(ordenadas alfabeticamente), se desejar.


## AKS

O Helm funciona com o [Azure Kubernetes
Service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm).

## DC/OS

O Helm foi testado e funciona na plataforma Kubernetes do DC/OS 1.11 da
Mesosphere, e não requer configuração adicional.

## EKS

O Helm funciona com o Amazon Elastic Kubernetes Service (Amazon EKS):
[Usando o Helm com o Amazon
EKS](https://docs.aws.amazon.com/eks/latest/userguide/helm.html).

## GKE

A plataforma Kubernetes hospedada do Google, GKE, funciona com o Helm e não
requer configuração adicional.

## `scripts/local-cluster` e Hyperkube

O Hyperkube configurado via `scripts/local-cluster.sh` funciona corretamente.
Para o Hyperkube direto, pode ser necessário realizar alguma configuração manual.

## IKS

O Helm funciona com o [IBM Cloud Kubernetes
Service](https://cloud.ibm.com/docs/containers?topic=containers-helm).

## KIND (Kubernetes IN Docker)

O Helm é testado regularmente no [KIND](https://github.com/kubernetes-sigs/kind).

## KubeOne

O Helm funciona em clusters configurados pelo KubeOne sem ressalvas.

## Kubermatic

O Helm funciona em clusters de usuário criados pelo Kubermatic sem ressalvas.
Como o seed cluster pode ser configurado de diferentes maneiras, o suporte ao
Helm depende da configuração específica.

## MicroK8s

O Helm pode ser habilitado no [MicroK8s](https://microk8s.io) usando o comando:
`microk8s.enable helm3`

## Minikube

O Helm é testado e funciona com o
[Minikube](https://github.com/kubernetes/minikube). Não requer configuração
adicional.

## Openshift

O Helm funciona diretamente no OpenShift Online, OpenShift Dedicated, OpenShift
Container Platform (versão >= 3.6) ou OpenShift Origin (versão >= 3.6). Para
saber mais, leia esta [postagem no
blog](https://blog.openshift.com/getting-started-helm-openshift/).

## Platform9

O Helm vem pré-instalado no [Platform9 Managed
Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=helm_distro_notes).
O Platform9 fornece acesso a todos os charts oficiais do Helm através da
interface App Catalog e da CLI nativa do Kubernetes. Repositórios adicionais
podem ser adicionados manualmente. Mais detalhes estão disponíveis neste [artigo
do Platform9 App
Catalog](https://platform9.com/support/deploying-kubernetes-apps-platform9-managed-kubernetes/?utm_source=helm_distro_notes).

## Ubuntu com `kubeadm`

O Kubernetes inicializado com `kubeadm` funciona nas seguintes distribuições
Linux:

- Ubuntu 16.04
- Fedora release 25

Algumas versões do Helm (v2.0.0-beta2) requerem que você execute `export
KUBECONFIG=/etc/kubernetes/admin.conf` ou crie um arquivo `~/.kube/config`.

## VMware Tanzu Kubernetes Grid

O Helm funciona no VMware Tanzu Kubernetes Grid, TKG, sem necessidade de
alterações na configuração. A CLI do Tanzu pode gerenciar a instalação de
pacotes para o [helm-controller](https://fluxcd.io/flux/components/helm/),
permitindo o gerenciamento declarativo de releases de charts Helm. Mais detalhes
estão disponíveis na documentação do TKG para [CLI-Managed
Packages](https://docs.vmware.com/en/VMware-Tanzu-Kubernetes-Grid/1.6/vmware-tanzu-kubernetes-grid-16/GUID-packages-user-managed-index.html#package-locations-and-dependencies-5).
