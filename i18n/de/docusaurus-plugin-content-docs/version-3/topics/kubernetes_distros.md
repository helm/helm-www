---
title: Leitfaden für Kubernetes-Distributionen
description: Enthält Informationen zur Verwendung von Helm in bestimmten Kubernetes-Umgebungen.
sidebar_position: 10
---

Helm sollte mit jeder [konformen Version von
Kubernetes](https://github.com/cncf/k8s-conformance) funktionieren (ob
[zertifiziert](https://www.cncf.io/certification/software-conformance/) oder nicht).

Dieses Dokument enthält Informationen zur Verwendung von Helm in bestimmten
Kubernetes-Umgebungen. Bitte tragen Sie weitere Details zu beliebigen Distributionen
(alphabetisch sortiert) bei, falls gewünscht.


## AKS

Helm funktioniert mit [Azure Kubernetes
Service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm).

## DC/OS

Helm wurde auf der Mesosphere DC/OS 1.11 Kubernetes-Plattform getestet und
funktioniert ohne zusätzliche Konfiguration.

## EKS

Helm funktioniert mit Amazon Elastic Kubernetes Service (Amazon EKS):
[Verwendung von Helm mit Amazon
EKS](https://docs.aws.amazon.com/eks/latest/userguide/helm.html).

## GKE

Googles gehostete Kubernetes-Plattform GKE funktioniert nachweislich mit Helm
und erfordert keine zusätzliche Konfiguration.

## `scripts/local-cluster` und Hyperkube

Hyperkube, konfiguriert über `scripts/local-cluster.sh`, funktioniert nachweislich.
Bei reinem Hyperkube ist möglicherweise eine manuelle Konfiguration erforderlich.

## IKS

Helm funktioniert mit [IBM Cloud Kubernetes
Service](https://cloud.ibm.com/docs/containers?topic=containers-helm).

## KIND (Kubernetes IN Docker)

Helm wird regelmäßig auf [KIND](https://github.com/kubernetes-sigs/kind) getestet.

## KubeOne

Helm funktioniert in Clustern, die mit KubeOne eingerichtet wurden, ohne
Einschränkungen.

## Kubermatic

Helm funktioniert in Benutzer-Clustern, die von Kubermatic erstellt wurden, ohne
Einschränkungen. Da Seed-Cluster auf verschiedene Arten eingerichtet werden können,
hängt die Helm-Unterstützung von deren Konfiguration ab.

## MicroK8s

Helm kann in [MicroK8s](https://microk8s.io) mit dem folgenden Befehl aktiviert werden:
`microk8s.enable helm3`

## Minikube

Helm wurde mit [Minikube](https://github.com/kubernetes/minikube) getestet und
funktioniert nachweislich. Es ist keine zusätzliche Konfiguration erforderlich.

## Openshift

Helm funktioniert problemlos auf OpenShift Online, OpenShift Dedicated,
OpenShift Container Platform (Version >= 3.6) oder OpenShift Origin (Version >= 3.6).
Weitere Informationen finden Sie in diesem
[Blogbeitrag](https://blog.openshift.com/getting-started-helm-openshift/).

## Platform9

Helm ist bei [Platform9 Managed
Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=helm_distro_notes)
vorinstalliert. Platform9 bietet Zugang zu allen offiziellen Helm-Charts über die
App-Katalog-Benutzeroberfläche und die native Kubernetes-CLI. Zusätzliche Repositories
können manuell hinzugefügt werden. Weitere Details finden Sie in diesem [Platform9
App-Katalog-Artikel](https://platform9.com/support/deploying-kubernetes-apps-platform9-managed-kubernetes/?utm_source=helm_distro_notes).

## Ubuntu mit `kubeadm`

Kubernetes, das mittels `kubeadm` eingerichtet wurde, funktioniert nachweislich auf
folgenden Linux-Distributionen:

- Ubuntu 16.04
- Fedora release 25

Bei einigen Helm-Versionen (v2.0.0-beta2) müssen Sie `export
KUBECONFIG=/etc/kubernetes/admin.conf` ausführen oder eine `~/.kube/config` erstellen.

## VMware Tanzu Kubernetes Grid

Helm läuft auf VMware Tanzu Kubernetes Grid (TKG) ohne Konfigurationsänderungen.
Die Tanzu CLI kann die Installation von Paketen für [helm-controller](https://fluxcd.io/flux/components/helm/)
verwalten und ermöglicht so die deklarative Verwaltung von Helm-Chart-Releases.
Weitere Details finden Sie in der TKG-Dokumentation für [CLI-verwaltete
Pakete](https://docs.vmware.com/en/VMware-Tanzu-Kubernetes-Grid/1.6/vmware-tanzu-kubernetes-grid-16/GUID-packages-user-managed-index.html#package-locations-and-dependencies-5).
