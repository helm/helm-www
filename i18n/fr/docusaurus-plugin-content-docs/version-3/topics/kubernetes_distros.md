---
title: Guide des Distributions Kubernetes
description: Fournit des informations sur l'utilisation de Helm dans des environnements Kubernetes spécifiques.
sidebar_position: 10
---

Helm devrait fonctionner avec toute [version conforme de
Kubernetes](https://github.com/cncf/k8s-conformance) (qu'elle soit
[certifiée](https://www.cncf.io/certification/software-conformance/) ou non).

Ce document fournit des informations sur l'utilisation de Helm dans des
environnements Kubernetes spécifiques. Vous pouvez contribuer des informations
supplémentaires sur d'autres distributions (triées par ordre alphabétique) si
vous le souhaitez.


## AKS

Helm fonctionne avec [Azure Kubernetes
Service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm).

## DC/OS

Helm a été testé et fonctionne sur la plateforme Kubernetes de Mesosphere DC/OS
1.11, sans configuration supplémentaire.

## EKS

Helm fonctionne avec Amazon Elastic Kubernetes Service (Amazon EKS) :
[Utilisation de Helm avec Amazon
EKS](https://docs.aws.amazon.com/eks/latest/userguide/helm.html).

## GKE

La plateforme Kubernetes hébergée de Google, GKE, fonctionne avec Helm et ne
nécessite aucune configuration supplémentaire.

## `scripts/local-cluster` et Hyperkube

Hyperkube configuré via `scripts/local-cluster.sh` fonctionne correctement. Pour
Hyperkube en mode natif, une configuration manuelle peut être nécessaire.

## IKS

Helm fonctionne avec [IBM Cloud Kubernetes
Service](https://cloud.ibm.com/docs/containers?topic=containers-helm).

## KIND (Kubernetes IN Docker)

Helm est régulièrement testé avec [KIND](https://github.com/kubernetes-sigs/kind).

## KubeOne

Helm fonctionne dans les clusters configurés par KubeOne sans difficulté.

## Kubermatic

Helm fonctionne dans les clusters utilisateurs créés par Kubermatic sans
difficulté. Étant donné que les seed clusters peuvent être configurés de
différentes manières, la prise en charge de Helm dépend de leur configuration.

## MicroK8s

Helm peut être activé dans [MicroK8s](https://microk8s.io) avec la commande :
`microk8s.enable helm3`

## Minikube

Helm est testé et fonctionne avec
[Minikube](https://github.com/kubernetes/minikube). Aucune configuration
supplémentaire n'est requise.

## Openshift

Helm fonctionne directement sur OpenShift Online, OpenShift Dedicated, OpenShift
Container Platform (version >= 3.6) ou OpenShift Origin (version >= 3.6). Pour
en savoir plus, consultez [cet article de
blog](https://blog.openshift.com/getting-started-helm-openshift/).

## Platform9

Helm est préinstallé avec [Platform9 Managed
Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=helm_distro_notes).
Platform9 donne accès à tous les charts Helm officiels via l'interface App
Catalog et la CLI Kubernetes native. Des dépôts supplémentaires peuvent être
ajoutés manuellement. Plus de détails sont disponibles dans cet [article sur
Platform9 App
Catalog](https://platform9.com/support/deploying-kubernetes-apps-platform9-managed-kubernetes/?utm_source=helm_distro_notes).

## Ubuntu avec `kubeadm`

Kubernetes déployé avec `kubeadm` fonctionne sur les distributions Linux
suivantes :

- Ubuntu 16.04
- Fedora release 25

Certaines versions de Helm (v2.0.0-beta2) nécessitent d'exécuter `export
KUBECONFIG=/etc/kubernetes/admin.conf` ou de créer un fichier `~/.kube/config`.

## VMware Tanzu Kubernetes Grid

Helm fonctionne sur VMware Tanzu Kubernetes Grid, TKG, sans modification de
configuration. La CLI Tanzu permet de gérer l'installation de packages pour
[helm-controller](https://fluxcd.io/flux/components/helm/), permettant une
gestion déclarative des releases de charts Helm. Plus de détails sont
disponibles dans la documentation TKG concernant les [packages gérés via
CLI](https://docs.vmware.com/en/VMware-Tanzu-Kubernetes-Grid/1.6/vmware-tanzu-kubernetes-grid-16/GUID-packages-user-managed-index.html#package-locations-and-dependencies-5).
