---
title: "Guía de distribución de Kubernetes"
description: "Captura información sobre el uso de Helm en entornos específicos de Kubernetes"
aliases: ["/docs/kubernetes_distros/"]
weight: 10
---

Helm debería funcionar con cualquier [versión conforme de Kubernetes](https://github.com/cncf/k8s-conformance) (ya sea [certificada](https://www.cncf.io/certification/software-conformance/) o no).

Este documento recoge información sobre el uso de Helm en entornos Kubernetes específicos. Por favor, contribuya con más detalles sobre cualquier distro (ordenados alfabéticamente).


## AKS

Helm funciona con [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm).

## DC/OS

Helm ha sido probado y funciona en la plataforma Mesospheres DC/OS 1.11 Kubernetes, y no requiere ninguna configuración adicional.

## EKS

Helm funciona con Amazon Elastic Kubernetes Service (Amazon EKS): [Uso de Helm con Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/helm.html).

## GKE

Se sabe que la plataforma Kubernetes alojada en GKE de Google funciona con Helm, y no requiere ninguna configuración adicional.

## `scripts/local-cluster` and Hyperkube    

Se sabe que Hyperkube configurado a través de `scripts/local-cluster.sh` funciona. Para raw Hyperkube es posible que tenga que hacer alguna configuración manual.

## IKS

Helm funciona con [IBM Cloud Kubernetes
Service](https://cloud.ibm.com/docs/containers?topic=containers-helm).

## KIND (Kubernetes IN Docker)

Helm se prueba regularmente en [KIND](https://github.com/kubernetes-sigs/kind).

## KubeOne

Helm funciona en clusters configurados por KubeOne sin advertencias.

## Kubermatic

Helm funciona en clusters de usuarios que son creados por Kubermatic sin advertencias. Dado que el cluster de semillas puede ser configurado de diferentes maneras el soporte de Helm depende de su configuración.

## MicroK8s

Helm puede ser habilitado en [MicroK8s](https://microk8s.io) usando el comando: `microk8s.enable helm3`

## Minikube

Helm está probado y se sabe que funciona con [Minikube](https://github.com/kubernetes/minikube). No requiere configuración configuración adicional.

## Openshift

Helm funciona sin problemas en OpenShift Online, OpenShift Dedicated, OpenShift Container Platform (version >= 3.6) o OpenShift Origin (version >= 3.6). Para obtener más información, lea [este artículo](https://blog.openshift.com/getting-started-helm-openshift/).

## Platform9

Helm está preinstalado con [Platform9 Managed Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=helm_distro_notes). Platform9 proporciona acceso a todas las Charts oficiales de Helm a través de la App Catalog UI y la CLI nativa de Kubernetes. Se pueden añadir manualmente repositorios adicionales. Encontrará más detalles en este  [artículo de Platform9 App Catalog](https://platform9.com/support/deploying-kubernetes-apps-platform9-managed-kubernetes/?utm_source=helm_distro_notes).

## Ubuntu con `kubeadm`

Se sabe que Kubernetes arrancado con `kubeadm` funciona en las siguientes distribuciones de Linux:

- Ubuntu 16.04
- Fedora release 25

Algunas versiones de Helm (v2.0.0-beta2) requieren que el comando `export KUBECONFIG=/etc/kubernetes/admin.conf` o crear el fichero `~/.kube/config`.

## VMware Tanzu Kubernetes Grid

Helm se ejecuta en VMware Tanzu Kubernetes Grid, TKG, sin necesidad de cambios en la configuración. La CLI de Tanzu puede gestionar la instalación de paquetes para [helm-controller](https://fluxcd.io/flux/components/helm/) permitiendo gestionar de forma declarativa las liberaciones de charts de Helm. Más detalles disponibles en la documentación de TKG para [CLI-Managed Packages](https://docs.vmware.com/en/VMware-Tanzu-Kubernetes-Grid/1.6/vmware-tanzu-kubernetes-grid-16/GUID-packages-user-managed-index.html#package-locations-and-dependencies-5).
