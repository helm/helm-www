---
title: 퀵스타트 가이드
description: 배포판, FAQ, 플러그인의 설명을 포함한 헬름 설치 및 시작 방법
sidebar_position: 1
---

이 가이드는 헬름을 빠르게 시작하는 
방법에 대해 다룬다.

## 전제 조건

헬름을 성공적이고 안전하게 사용하려면
다음과 같은 전제 조건들이 필요하다.

1. 쿠버네티스 클러스터
2. 설치를 위해 어떤 보안 구성을 사용할 것인지 결정하기(필요시)
3. 헬름 설치 및 구성

### 쿠버네티스 설치 혹은 클러스터에 접근

- 쿠버네티스가 설치되어 있어야 한다. 최신 릴리스의 헬름을 사용하기 위해서,
  대부분의 경우 두번째 최신 마이너 릴리스 버전인 쿠버네티스 최신 안정(latest stable)
  릴리스 버전 설치를 권장한다.
- 또한 로컬로 구성된 `kubectl` 복사본이 있어야 한다.

헬름과 쿠버네티스 사이의 버전차이정책(skew) 최대 버전은 [헬름 버전 지원 정책](https://helm.sh/docs/topics/version_skew/)을 참고한다. 

## 헬름 설치

헬름 클라이언트의 바이너리 릴리스를 다운로드한다. `homebrew` 와 같은 툴을 사용하거나
[공식 릴리스 페이지](https://github.com/helm/helm/releases)를 참고하면 된다.

자세한 내용이나 다른 옵션에 대해서는 [설치
가이드](/intro/install.md)를 참고한다.

## 헬름 차트 리포지토리 초기화

헬름이 준비되면, 차트 리포지토리를 추가할 수 있다. 가능한 헬름 차트 레포지토리를 위해서 [Artifact 
Hub](https://artifacthub.io/packages/search?kind=0)를 
확인한다. 

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

차트 리포지토리 추가가 완료되면 설치할 수 있는 차트들의 목록을 볼 수 있다.

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... and many more
```

## 예제 차트 설치

차트를 설치하기 위해서, `helm install` 커맨드를 실행한다.
헬름은 차트를 설치하기 위한 몇가지 방법들이 존재하는데, 
가장 쉬운 방법은 `bitnami` 차트들을 이용하는 것이다.

```console
$ helm repo update              # Make sure we get the latest list of charts
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

위의 예에서, `bitnami/mysql` 차트가 릴리스되었고,
새로운 릴리스의 이름은 `mysql-1612624192` 이다.

MySQL 차트에 대한 간단한 정보를 보려면
`helm show chart bitnami/mysql` 를 실행한다. 또는 차트에 대한 모든 정보를 보려면 `helm show all bitnami/mysql`
를 실행할 수도 있다.

차트를 설치할 때마다, 새로운 릴리스가 생성된다. 따라서 하나의 차트를
동일한 클러스터에 여러 번 설치할 수 있다. 각각을 독립적으로
관리 및 업그레이드 할 수 있다.

`helm install` 커맨드는 다양한 기능을 가진 매우 강력한 커맨드이다. 
더 많은 정보를 얻으려면, 이곳을 확인하면 된다. 
[헬름 사용 가이드](/intro/using_helm.md)

## 릴리스에 대해 알아보기

헬름을 사용하여 릴리스된 내용을 쉽게 확인할 수 있다.

```console
$ helm list
NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

`helm list` (or `helm ls`) 함수는 배포된 모든 릴리스 목록을 보여준다.

## 릴리스 설치 제거

릴리스를 설치 제거하려면, `helm uninstall` 커맨드를 사용한다.

```console
$ helm uninstall mysql-1612624192
release "mysql-1612624192" uninstalled
```

쿠버네티스에서 `mysql-1612624192` 를 설치 제거하면, 릴리스 이력 뿐 아니라
릴리스와 관련된 리소스들도 모두 제거된다.

`--keep-history` 플래그가 제공되면, 릴리스 이력은 유지된다. 그러면
릴리스에 대한 정보를 요청할 수 있다.

```console
$ helm status mysql-1612624192
Status: UNINSTALLED
...
```

헬름은 릴리스를 제거한 후에도 릴리스를 추적하므로, 클러스터 이력을
감사(audit)할 수 있고, 릴리스 삭제 취소도 가능하다. (`helm rollback`을 사용)

## 도움말 읽기

헬름 커맨드 사용법에 대해 더 배우려면, `helm help` 을 사용하거나
커맨드 뒤에 `-h` 플래그를 사용한다.

```console
$ helm get -h
```
