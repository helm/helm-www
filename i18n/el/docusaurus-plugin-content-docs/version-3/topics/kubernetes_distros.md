---
title: Οδηγός Διανομών Kubernetes
description: Πληροφορίες σχετικά με τη χρήση του Helm σε συγκεκριμένα περιβάλλοντα Kubernetes.
sidebar_position: 10
---

Το Helm λειτουργεί με οποιαδήποτε [συμβατή έκδοση του
Kubernetes](https://github.com/cncf/k8s-conformance) (είτε είναι
[πιστοποιημένη](https://www.cncf.io/certification/software-conformance/) είτε όχι).

Αυτό το έγγραφο περιέχει πληροφορίες σχετικά με τη χρήση του Helm σε συγκεκριμένα
περιβάλλοντα Kubernetes. Μπορείτε να συνεισφέρετε περισσότερες λεπτομέρειες για
οποιαδήποτε διανομή (ταξινομημένες αλφαβητικά) αν θέλετε.


## AKS {#aks}

Το Helm λειτουργεί με το [Azure Kubernetes
Service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm).

## DC/OS {#dcos}

Το Helm έχει δοκιμαστεί και λειτουργεί στην πλατφόρμα Kubernetes του Mesosphere
DC/OS 1.11, και δεν απαιτεί πρόσθετη διαμόρφωση.

## EKS {#eks}

Το Helm λειτουργεί με το Amazon Elastic Kubernetes Service (Amazon EKS):
[Χρήση του Helm με το Amazon
EKS](https://docs.aws.amazon.com/eks/latest/userguide/helm.html).

## GKE {#gke}

Η πλατφόρμα GKE της Google λειτουργεί με το Helm και δεν απαιτεί πρόσθετη
διαμόρφωση.

## `scripts/local-cluster` και Hyperkube {#scriptslocal-cluster-and-hyperkube}

Το Hyperkube ρυθμισμένο μέσω του `scripts/local-cluster.sh` λειτουργεί κανονικά.
Για το Hyperkube χωρίς script μπορεί να χρειαστεί χειροκίνητη διαμόρφωση.

## IKS {#iks}

Το Helm λειτουργεί με το [IBM Cloud Kubernetes
Service](https://cloud.ibm.com/docs/containers?topic=containers-helm).

## KIND (Kubernetes IN Docker) {#kind-kubernetes-in-docker}

Το Helm δοκιμάζεται τακτικά στο [KIND](https://github.com/kubernetes-sigs/kind).

## KubeOne {#kubeone}

Το Helm λειτουργεί σε cluster που δημιουργούνται με το KubeOne χωρίς ιδιαίτερες
προϋποθέσεις.

## Kubermatic {#kubermatic}

Το Helm λειτουργεί σε user cluster που δημιουργούνται από το Kubermatic χωρίς
ιδιαίτερες προϋποθέσεις. Καθώς τα seed cluster μπορούν να ρυθμιστούν με
διαφορετικούς τρόπους, η υποστήριξη του Helm εξαρτάται από τη διαμόρφωσή τους.

## MicroK8s {#microk8s}

Το Helm μπορεί να ενεργοποιηθεί στο [MicroK8s](https://microk8s.io) με την εντολή:
`microk8s.enable helm3`

## Minikube {#minikube}

Το Helm έχει δοκιμαστεί και λειτουργεί με το
[Minikube](https://github.com/kubernetes/minikube). Δεν απαιτεί πρόσθετη
διαμόρφωση.

## Openshift {#openshift}

Το Helm λειτουργεί απευθείας στο OpenShift Online, OpenShift Dedicated,
OpenShift Container Platform (έκδοση >= 3.6) ή OpenShift Origin (έκδοση >= 3.6).
Για περισσότερες πληροφορίες διαβάστε [αυτό το
άρθρο](https://blog.openshift.com/getting-started-helm-openshift/).

## Platform9 {#platform9}

Το Helm είναι προεγκατεστημένο στο [Platform9 Managed
Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=helm_distro_notes).
Η Platform9 παρέχει πρόσβαση σε όλα τα επίσημα Helm chart μέσω του App Catalog
UI και του native Kubernetes CLI. Μπορείτε επίσης να προσθέσετε χειροκίνητα
πρόσθετα repository. Περισσότερες λεπτομέρειες είναι διαθέσιμες σε αυτό το
[άρθρο για το Platform9 App Catalog](https://platform9.com/support/deploying-kubernetes-apps-platform9-managed-kubernetes/?utm_source=helm_distro_notes).

## Ubuntu με `kubeadm` {#ubuntu-with-kubeadm}

Το Kubernetes που έχει ρυθμιστεί με το `kubeadm` λειτουργεί στις ακόλουθες
διανομές Linux:

- Ubuntu 16.04
- Fedora release 25

Ορισμένες εκδόσεις του Helm (v2.0.0-beta2) απαιτούν να εκτελέσετε `export
KUBECONFIG=/etc/kubernetes/admin.conf` ή να δημιουργήσετε ένα `~/.kube/config`.

## VMware Tanzu Kubernetes Grid {#vmware-tanzu-kubernetes-grid}

Το Helm λειτουργεί στο VMware Tanzu Kubernetes Grid, TKG, χωρίς να χρειάζονται
αλλαγές στη διαμόρφωση. Το Tanzu CLI μπορεί να διαχειριστεί την εγκατάσταση
πακέτων για το [helm-controller](https://fluxcd.io/flux/components/helm/),
επιτρέποντας τη δηλωτική διαχείριση των Helm chart release. Περισσότερες
λεπτομέρειες είναι διαθέσιμες στην τεκμηρίωση του TKG για τα
[CLI-Managed Packages](https://docs.vmware.com/en/VMware-Tanzu-Kubernetes-Grid/1.6/vmware-tanzu-kubernetes-grid-16/GUID-packages-user-managed-index.html#package-locations-and-dependencies-5).
