---
title: "Руководство по дистрибутивам Kubernetes"
description: "Содержит информацию об использовании Helm в различных средах Kubernetes."
sidebar_position: 10
---

Helm должен работать с любой [совместимой версией
Kubernetes](https://github.com/cncf/k8s-conformance) (как
[сертифицированной](https://www.cncf.io/certification/software-conformance/), так и нет).

В этом документе собрана информация об использовании Helm в конкретных средах
Kubernetes. Пожалуйста, добавляйте информацию о других дистрибутивах
(в алфавитном порядке) при необходимости.


## AKS

Helm работает с [Azure Kubernetes
Service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm).

## DC/OS

Helm протестирован и работает на платформе Kubernetes в Mesosphere DC/OS 1.11,
дополнительная настройка не требуется.

## EKS

Helm работает с Amazon Elastic Kubernetes Service (Amazon EKS):
[Использование Helm с Amazon
EKS](https://docs.aws.amazon.com/eks/latest/userguide/helm.html).

## GKE

Облачная платформа Google GKE работает с Helm и не требует дополнительной
настройки.

## `scripts/local-cluster` и Hyperkube

Hyperkube, настроенный через `scripts/local-cluster.sh`, работает без проблем.
Для чистого Hyperkube может потребоваться ручная настройка.

## IKS

Helm работает с [IBM Cloud Kubernetes
Service](https://cloud.ibm.com/docs/containers?topic=containers-helm).

## KIND (Kubernetes IN Docker)

Helm регулярно тестируется на [KIND](https://github.com/kubernetes-sigs/kind).

## KubeOne

Helm работает в кластерах, созданных KubeOne, без ограничений.

## Kubermatic

Helm работает в пользовательских кластерах, созданных Kubermatic, без ограничений.
Поскольку seed-кластер может быть настроен различными способами, поддержка Helm
зависит от его конфигурации.

## MicroK8s

Helm можно включить в [MicroK8s](https://microk8s.io) с помощью команды:
`microk8s.enable helm3`

## Minikube

Helm протестирован и работает с
[Minikube](https://github.com/kubernetes/minikube). Дополнительная настройка
не требуется.

## OpenShift

Helm работает на OpenShift Online, OpenShift Dedicated, OpenShift Container
Platform (версия >= 3.6) и OpenShift Origin (версия >= 3.6). Подробнее читайте
в [этой статье в блоге](https://blog.openshift.com/getting-started-helm-openshift/).

## Platform9

Helm предустановлен в [Platform9 Managed
Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=helm_distro_notes).
Platform9 предоставляет доступ ко всем официальным чартам Helm через интерфейс
App Catalog и CLI Kubernetes. Дополнительные репозитории можно добавить вручную.
Подробнее см. в [статье о Platform9 App
Catalog](https://platform9.com/support/deploying-kubernetes-apps-platform9-managed-kubernetes/?utm_source=helm_distro_notes).

## Ubuntu с `kubeadm`

Kubernetes, развёрнутый с помощью `kubeadm`, работает на следующих дистрибутивах
Linux:

- Ubuntu 16.04
- Fedora release 25

Некоторые версии Helm (v2.0.0-beta2) требуют выполнения `export
KUBECONFIG=/etc/kubernetes/admin.conf` или создания файла `~/.kube/config`.

## VMware Tanzu Kubernetes Grid

Helm работает на VMware Tanzu Kubernetes Grid (TKG) без дополнительной настройки.
Tanzu CLI позволяет управлять установкой пакетов для [helm-controller](https://fluxcd.io/flux/components/helm/),
что обеспечивает декларативное управление релизами чартов Helm.
Подробнее см. в документации TKG по [пакетам, управляемым через CLI](https://docs.vmware.com/en/VMware-Tanzu-Kubernetes-Grid/1.6/vmware-tanzu-kubernetes-grid-16/GUID-packages-user-managed-index.html#package-locations-and-dependencies-5).
