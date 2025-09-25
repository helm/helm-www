---
title: "Guide de distribution Kubernetes"
description: "Contient des informations sur l'utilisation de Helm dans des environnements Kubernetes spécifiques."
weight: 10
---

Helm devrait fonctionner avec toute [version conforme de Kubernetes](https://github.com/cncf/k8s-conformance) (qu'elle soit [certifiée](https://www.cncf.io/certification/software-conformance/) ou non).

Ce document contient des informations sur l'utilisation de Helm dans des environnements Kubernetes spécifiques. Veuillez contribuer avec plus de détails sur les différentes distributions (triées par ordre alphabétique) si souhaité.


## AKS

Helm fonctionne avec [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm).

## DC/OS

Helm a été testé et fonctionne sur la plateforme Kubernetes Mesospheres DC/OS 1.11, sans nécessiter de configuration supplémentaire.

## EKS

Helm fonctionne avec Amazon Elastic Kubernetes Service (Amazon EKS) : [Utilisation de Helm avec Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/helm.html).

## GKE

La plateforme Kubernetes hébergée GKE de Google est connue pour fonctionner avec Helm et ne nécessite aucune configuration supplémentaire.

## `scripts/local-cluster` et Hyperkube

Hyperkube configuré via `scripts/local-cluster.sh` est connu pour fonctionner avec Helm. Pour une installation brute de Hyperkube, vous pourriez avoir besoin d'effectuer quelques configurations manuelles.

## IKS

Helm fonctionne avec [IBM Cloud Kubernetes Service](https://cloud.ibm.com/docs/containers?topic=containers-helm).

## KIND (Kubernetes IN Docker)

Helm est régulièrement testé sur [KIND](https://github.com/kubernetes-sigs/kind).

## KubeOne

Helm fonctionne dans les clusters configurés par KubeOne sans réserve.

## Kubermatic

Helm fonctionne dans les clusters utilisateurs créés par Kubermatic sans réserve. Étant donné que le cluster de seed peut être configuré de différentes manières, le support de Helm dépend de leur configuration.

## MicroK8s

Helm peut être activé dans [MicroK8s](https://microk8s.io) en utilisant la commande :
`microk8s.enable helm3`

## Minikube

Helm est testé et fonctionne avec [Minikube](https://github.com/kubernetes/minikube). Il ne nécessite aucune configuration supplémentaire.

## Openshift

Helm fonctionne simplement sur OpenShift Online, OpenShift Dedicated, OpenShift Container Platform (version >= 3.6) ou OpenShift Origin (version >= 3.6). Pour en savoir plus, lisez [cet article de blog](https://blog.openshift.com/getting-started-helm-openshift/).

## Platform9

Helm est préinstallé avec [Platform9 Managed Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=helm_distro_notes). Platform9 offre l'accès à tous les charts Helm officiels via l'interface App Catalog et la CLI Kubernetes native. Des dépôts supplémentaires peuvent être ajoutés manuellement. Pour plus de détails, consultez [cet article sur le catalogue d'applications Platform9](https://platform9.com/support/deploying-kubernetes-apps-platform9-managed-kubernetes/?utm_source=helm_distro_notes).

## Ubuntu avec `kubeadm`

Kubernetes bootstrappé avec `kubeadm` est connu pour fonctionner sur les distributions Linux suivantes :

- Ubuntu 16.04
- Fedora release 25

Certaines versions de Helm (v2.0.0-beta2) nécessitent que vous exécutiez `export KUBECONFIG=/etc/kubernetes/admin.conf` ou que vous créiez un fichier `~/.kube/config`.

## VMware Tanzu Kubernetes Grid

Helm fonctionne sur VMware Tanzu Kubernetes Grid (TKG) sans nécessiter de modifications de configuration. La CLI Tanzu peut gérer l'installation des packages pour [helm-controller](https://fluxcd.io/flux/components/helm/), permettant une gestion déclarative des releases de charts Helm. Pour plus de détails, consultez la documentation de TKG sur les [Packages Gérés par la CLI](https://docs.vmware.com/en/VMware-Tanzu-Kubernetes-Grid/1.6/vmware-tanzu-kubernetes-grid-16/GUID-packages-user-managed-index.html#package-locations-and-dependencies-5).
