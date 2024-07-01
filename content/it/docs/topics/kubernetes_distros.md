---
title: "Guida alle distribuzioni di Kubernetes"
description: "Raccoglie informazioni sull'utilizzo di Helm in ambienti Kubernetes specifici."
aliases: ["/docs/kubernetes_distros/"]
weight: 10
---

Helm dovrebbe funzionare con qualsiasi [versione conforme di
Kubernetes](https://github.com/cncf/k8s-conformance) (che sia
[certificato](https://www.cncf.io/certification/software-conformance/) o meno).

Questo documento raccoglie informazioni sull'uso di Helm in specifici ambienti Kubernetes. 
Si prega di contribuire con ulteriori dettagli su qualsiasi distro (ordinata
in ordine alfabetico) se lo si desidera.

## AKS

Helm funziona con [Azure Kubernetes
Service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm).

## DC/OS

Helm è stato testato e funziona sulla piattaforma Mesospheres DC/OS 1.11 Kubernetes,
e non richiede alcuna configurazione aggiuntiva.

## EKS

Helm funziona con Amazon Elastic Kubernetes Service (Amazon EKS):
[Utilizzo di Helm con Amazon
EKS](https://docs.aws.amazon.com/eks/latest/userguide/helm.html).

## GKE

La piattaforma Kubernetes in hosting GKE di Google è nota per funzionare con Helm e non richiede 
nessuna configurazione aggiuntiva.

## `scripts/local-cluster` e Hyperkube

È noto che Hyperkube configurato tramite `scripts/local-cluster.sh` funziona. Per 
Hyperkube raw potrebbe essere necessario eseguire una configurazione manuale.

## IKS

Helm funziona con [IBM Cloud Kubernetes
Service](https://cloud.ibm.com/docs/containers?topic=containers-helm).

## KIND (Kubernetes IN Docker)

Helm è regolarmente testato su [KIND](https://github.com/kubernetes-sigs/kind).

## KubeOne

Helm funziona senza problemi nei cluster impostati da KubeOne.

## Kubermatic

Helm funziona senza problemi nei cluster utente creati da Kubermatic.
Poiché i seed cluster possono essere impostati in modi diversi, il supporto di Helm dipende dalla loro configurazione.

## MicroK8s

Helm può essere abilitato in [MicroK8s](https://microk8s.io) usando il comando:
`microk8s.enable helm3`

## Minikube

Helm è testato e noto per funzionare con
[Minikube](https://github.com/kubernetes/minikube). Non richiede alcuna
configurazione aggiuntiva.

## Openshift

Helm funziona direttamente su OpenShift Online, OpenShift Dedicated, OpenShift 
Container Platform (versione >= 3.6) o OpenShift Origin (versione >= 3.6). Per
saperne di più leggete [questo
blog](https://blog.openshift.com/getting-started-helm-openshift/) post.

## Platform9

Helm è preinstallato con [Platform9 Managed
Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=helm_distro_notes).
Platform9 fornisce l'accesso a tutti i chart ufficiali di Helm attraverso l'interfaccia utente dell'App Catalog
e la CLI nativa di Kubernetes. È possibile aggiungere manualmente altri repository. 
Ulteriori dettagli sono disponibili in questo [articolo Platform9 App Catalog](https://platform9.com/support/deploying-kubernetes-apps-platform9-managed-kubernetes/?utm_source=helm_distro_notes).

## Ubuntu con `kubeadm`

Kubernetes avviato con `kubeadm` è noto per funzionare sulle seguenti distribuzioni Linux:

- Ubuntu 16.04
- Fedora release 25

Alcune versioni di Helm (v2.0.0-beta2) richiedono di `esportare
KUBECONFIG=/etc/kubernetes/admin.conf` o creare un `~/.kube/config`.

## VMware Tanzu Kubernetes Grid

Helm funziona su VMware Tanzu Kubernetes Grid, TKG, senza bisogno di modifiche alla configurazione. 
La Tanzu CLI può gestire l'installazione di pacchetti per [helm-controller](https://fluxcd.io/flux/components/helm/), consentendo di gestire in modo dichiarativo i rilasci dei chart Helm. 
Ulteriori dettagli sono disponibili nella documentazione di TKG per [CLI-Managed Packages](https://docs.vmware.com/en/VMware-Tanzu-Kubernetes-Grid/1.6/vmware-tanzu-kubernetes-grid-16/GUID-packages-user-managed-index.html#package-locations-and-dependencies-5).
