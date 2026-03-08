---
title: Дистрибутиви Kubernetes
description: Зберігає інформацію про використання Helm у конкретних середовищах Kubernetes.
sidebar_position: 10
---

Helm повинен працювати з будь-якою [сумісною версією Kubernetes](https://github.com/cncf/k8s-conformance) (незалежно від того, чи є вона [сертифікованою](https://www.cncf.io/certification/software-conformance/) чи ні).

Цей документ містить інформацію про використання Helm у специфічних середовищах Kubernetes. Будь ласка, додайте більше деталей про будь-які дистрибутиви (відсортовано за алфавітом), якщо це потрібно.

## AKS

Helm працює з [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm).

## DC/OS

Helm було протестовано і він працює на платформі Kubernetes Mesosphere DC/OS 1.11, і не вимагає додаткової конфігурації.

## EKS

Helm працює з Amazon Elastic Kubernetes Service (Amazon EKS): [Використання Helm з Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/helm.html).

## GKE

Платформа Kubernetes, що розміщена на GKE від Google, відома тим, що працює з Helm і не вимагає додаткової конфігурації.

## `scripts/local-cluster` та Hyperkube {#scriptslocal-cluster-and-hyperkube}

Hyperkube, налаштований за допомогою `scripts/local-cluster.sh`, працює без проблем. Для використання Hyperkube у початковому вигляді може знадобитися ручне налаштування.

## IKS

Helm працює з [IBM Cloud Kubernetes Service](https://cloud.ibm.com/docs/containers?topic=containers-helm).

## KIND (Kubernetes IN Docker)

Helm регулярно тестується з [KIND](https://github.com/kubernetes-sigs/kind).

## KubeOne

Helm працює у кластерах, які налаштовані за допомогою KubeOne без обмежень.

## Kubermatic

Helm працює в кластерах користувачів, які створюються Kubermatic без застережень. Оскільки початковий кластер можна налаштувати різними способами, підтримка Helm залежить від їх конфігурації.

## MicroK8s

Helm можна активувати в [MicroK8s](https://microk8s.io) за допомогою команди: `microk8s.enable helm3`

## Minikube

Helm протестований і відомий своєю сумісністю з [Minikube](https://github.com/kubernetes/minikube). Додаткової конфігурації не потребує.

## Openshift

Helm працює безпосередньо на OpenShift Online, OpenShift Dedicated, OpenShift Container Platform (версія >= 3.6) або OpenShift Origin (версія >= 3.6). Дізнайтеся більше в [цьому блозі](https://blog.openshift.com/getting-started-helm-openshift/).

## Platform9

Helm попередньо встановлений у [Platform9 Managed Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=helm_distro_notes). Platform9 надає доступ до всіх офіційних чартів Helm через інтерфейс App Catalog та вбудований Kubernetes CLI. Додаткові репозиторії можна додати вручну. Більш детальна інформація доступна в цій [статті про Platform9 App Catalog](https://platform9.com/support/deploying-kubernetes-apps-platform9-managed-kubernetes/?utm_source=helm_distro_notes).

## Ubuntu з `kubeadm` {#ubuntu-with-kubeadm}

Kubernetes, налаштований за допомогою `kubeadm`, відомий своєю сумісністю з наступними дистрибутивами Linux:

- Ubuntu 16.04
- Fedora release 25

Деякі версії Helm (v2.0.0-beta2) вимагають від вас `export KUBECONFIG=/etc/kubernetes/admin.conf` або створення `~/.kube/config`.

## VMware Tanzu Kubernetes Grid

Helm працює на VMware Tanzu Kubernetes Grid, TKG, без необхідності змінювати конфігурацію. Tanzu CLI може управляти встановленням пакетів для [helm-controller](https://fluxcd.io/flux/components/helm/), що дозволяє декларативно управляти релізами чартів Helm. Додаткові відомості доступні в документації TKG для [CLI-Managed Packages](https://docs.vmware.com/en/VMware-Tanzu-Kubernetes-Grid/1.6/vmware-tanzu-kubernetes-grid-16/GUID-packages-user-managed-index.html#package-locations-and-dependencies-5).
