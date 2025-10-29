---
title: 쿠버네티스 배포판 가이드
description: 특정 쿠버네티스 환경에서 헬름 사용에 대한 정보 정리.
sidebar_position: 10
---

헬름은 ([인증 여부](https://www.cncf.io/certification/software-conformance/)와 
관계 없이) 모든 [쿠버네티스 적합 버전](https://github.com/cncf/k8s-conformance)에서 
작동해야 한다.

이 문서는 특정 쿠버네티스 환경에서 헬름을 사용하는 방법에 대한 정보를 정리한다.
원한다면, 특정 배포판(알파벳순 정렬)에 
대한 추가 내용을 기여하자.


## AKS

헬름은 [Azure 쿠버네티스 서비스](https://docs.microsoft.com/en-us/azure/aks/kubernetes-helm)에서 
동작한다.

## DC/OS

헬름은 Mesospheres DC/OS 1.11 쿠버네티스 플랫폼에서 테스트를 거쳤고 동작하며,
추가 구성이 필요치 않다.

## EKS

헬름은 Amazon Elastic 쿠버네티스 서비스 (Amazon EKS)에서 동작한다.
[Amazon EKS에서 
헬름 사용](https://docs.aws.amazon.com/eks/latest/userguide/helm.html).

## GKE

구글의 GKE 호스팅 쿠버네티스 플랫폼은 헬름이 동작하는 것으로 
알려져 있으며, 추가 구성이 필요치 않다.

## `scripts/local-cluster` 와 Hyperkube

`scripts/local-cluster.sh` 를 통해 구성된 Hyperkube 에서 동작하는 것으로 알려져 있다.
원시(raw) Hyperkube 는 몇 가지 수동 구성이 필요할 수도 있다.

## IKS

헬름은 [IBM 클라우드 쿠버네티스 서비스](https://cloud.ibm.com/docs/containers?topic=containers-helm)에서 
동작한다.

## KIND (Kubernetes IN Docker)

헬름은 [KIND](https://github.com/kubernetes-sigs/kind)에서 정기적으로 테스트된다.

## KubeOne

헬름은 별다른 특이사항 없이 KubeOne 으로 구성된 클러스터에서 동작한다.

## Kubermatic

헬름은 별다른 특이사항 없이 Kubermatic 으로 생성된 사용자 클러스터에서 동작한다.
시드(seed) 클러스터는 다양한 방식으로 설정될 수 있으므로 헬름 지원은 
그 설정에 따라 달라진다.

## MicroK8s

[MicroK8s](https://microk8s.io) 에서는 명령어 `microk8s.enable helm3`를 사용하여 헬름을 활성화할 수 있다.

## Minikube

헬름은 [Minikube](https://github.com/kubernetes/minikube) 에서 테스트를 거쳤고
동작하는 것으로 알려져 있다. 
추가적인 구성이 필요하지 않다.

## Openshift

헬름은 OpenShift Online, OpenShift Dedicated, OpenShift Container Platform (버전 3.6 이상) 또는 
OpenShift Origin (버전 3.6 이상)에서 동작한다.
자세한 내용은 
[이 블로그](https://blog.openshift.com/getting-started-helm-openshift/) 의 게시물을 참조하자.

## Platform9

헬름은 [Platform9 Managed
Kubernetes](https://platform9.com/managed-kubernetes/?utm_source=helm_distro_notes)와 함께 사전 설치된다.
Platform9 은 앱 카탈로그 UI 및 기본 쿠버네티스 CLI를 통해 
모든 공식 헬름 차트에 대한 접근을 제공한다. 추가적인 레포지토리들도 수동으로 추가할 수 있다.
상세한 내용은 [Platform9 App Catalog
article](https://platform9.com/support/deploying-kubernetes-apps-platform9-managed-kubernetes/?utm_source=helm_distro_notes)에서 확인할 수 있다.

## 우분투와 `kubeadm`

`kubeadm` 으로 구성된(bootstrapped) 쿠버네티스는 다음 리눅스 배포판에서 
동작하는 것으로 알려져 있다.

- 우분투 16.04
- 페도라 릴리스 25

헬름 일부 버전(v2.0.0-beta2)은 `export KUBECONFIG=/etc/kubernetes/admin.conf` 를 수행하거나
`~/.kube/config` 를 생성해야 한다.
