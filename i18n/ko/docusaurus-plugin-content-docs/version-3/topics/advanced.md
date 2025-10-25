---
title: 고급 헬름 기법
description: 헬름의 숙련된 사용자를 위한 다양한 고급 기능을 설명한다.
sidebar_position: 9
---

이 섹션에서는 헬름 사용에 관한 다양한 고급 기능과 기법을 설명한다. 
이 섹션의 정보는 차트 및 릴리스의 고급 사용자 정의 및 조작을 
수행하려는 헬름의 "숙련 사용자"를 위한 것이다. 이러한 각 
고급 기능에는 고유한 장단점 및 주의사항이 있으므로, 각 기능은 
헬름에 대해 충분한 지식을 가지고 신중하게 사용해야한다. 
바꿔 말해서, [Peter Parker 
원칙](https://en.wikipedia.org/wiki/With_great_power_comes_great_responsibility)을 유념하자.

## 포스트 렌더링
포스트 렌더링은 차트 설치 프로그램이 헬름으로 설치하기 전에
렌더링된 매니페스트를 수동으로 조작, 구성 및 유효성 검사를 할 수 있는 기능을 제공한다.
이를 통해 [`kustomize`](https://kustomize.io) 같은 도구를 사용하는 고급 구성 사용자들이, 
공개 차트를 포크하거나 차트 유지관리자에게 소프트웨어에 대한
모든 최종 구성옵션을 지정하도록 요구하지 않고도
구성 변경사항을 적용할 수 있도록 해준다. 또한 엔터프라이즈 환경이나
배포 전 매니페스트 분석시에 공통 도구와 사이트카를 주입하는
사용 사례도 있다.

### 전제 조건
- 헬름 버전 3.1 이상

### 사용법
포스트 렌더러는 STDIN 에서 렌더링된 쿠버네티스 매니페스트를 받고
STDOUT 으로 유효한 쿠버네티스 매니페스트를 반환하는 실행파일이면 된다.
실패 시에는 0이 아닌 종료 코드를 반환해야 한다. 
이것은 두 구성 요소 사이의 유일한 "API" 이다. 
이러한 구조는 포스트 렌더 프로세스로 수행할 수 있는 작업에 유연성을 제공한다.

포스트 렌더러는 `install`, `upgrade`, `template` 과 함께 사용할 수 있다. 포스트 
렌더러를 사용하려면 렌더러 실행파일의 경로와 함께 
`--post-renderer` 플래그를 사용한다.

```shell
$ helm install mychart stable/wordpress --post-renderer ./path/to/executable
```

경로에 구분자가 없으면 $PATH 에서 검색하고, 그렇지 않으면 상대경로를 
완전한 전체 경로로 풀어낸다.

여러 개의 포스트 렌더러를 사용하려면 스크립트에서 모두 호출하거나 빌드한 
바이너리 도구에서 함께 호출해야 한다. bash의 경우, 
`renderer1 | renderer2 | renderer3` 와 같이 간단하게 표현할 수 있다.

`kustomize` 를 포스트 렌더러로 사용하는 예는
[이곳](https://github.com/thomastaylor312/advanced-helm-demos/tree/master/post-render)에서 확인할 수 있다.

### 주의사항
포스트 렌더러를 사용할 때 유의해야 하는 몇 가지 중요한 사항들이 있다.
포스트 렌더러를 사용할 때 가장 중요한 것은, 해당 릴리스를 
수정하는 모든 사람들이 반복 가능한 빌드를 갖기 위해서는 **반드시** 동일한 
렌더러를 사용해야 한다는 것이다. 이 기능은 사용자가 사용 중인 
렌더러를 전환하거나 렌더러 사용을 중지할 수 있게 하려고 만들어졌지만 
우발적인 수정이나 데이터 손실을 방지하기 위해서는 신중하게 수행해야 한다.

또 다른 중요한 사항은 보안에 관한 것이다. 포스트 렌더러를 사용하는 
경우 다른 임의의 실행 파일의 경우와 마찬가지로 신뢰할 수 있는 
소스에서 가져온 것인지 확인해야 한다. 신뢰할 수 없거나 확인되지 
않은 렌더러를 사용하는 것은 종종 시크릿 데이터를 포함하는 렌더링 
된 템플릿에 대한 전체 접근 권한을 갖게 되므로 권장되지 않는다.

### 사용자 정의 포스트 렌더러
포스트 렌더러 단계는 Go SDK에서 사용할 때 훨씬 더 많은 유연성을 제공한다.
모든 포스트 렌더러는 다음 Go 인터페이스만 구현하면 된다.

```go
type PostRenderer interface {
    // Run 함수는 헬름 렌더링 매니페스트로 채워진 단일 버퍼가 필요하다. 
    // 수정된 결과가 별도의 버퍼에 반환되거나 포스트 렌더링 단계를 실행하는 
    // 동안 이슈나 실패가 발생한 경우 오류가 반환된다.
    Run(renderedManifests *bytes.Buffer) (modifiedManifests *bytes.Buffer, err error)
}
```

Go SDK 사용에 대한 자세한 내용은 [Go SDK 섹션](#go-sdk)를 참조하자.

## Go SDK
헬름 3는 헬름을 활용하는 소프트웨어 및 도구를 
빌드할 때 더 나은 경험을 제공하기 위해 완전 
재구성된 Go SDK를 선보였다. 
전체 문서는 [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3)에서 
찾을 수 있지만 가장 일반적인 패키지 중 일부와 간단한 예제는 다음과 같다.

### 패키지 개요
다음은 가장 널리 사용되는 패키지들의 목록과
그에 관한 간단한 설명이다.

- `pkg/action`: 헬름 작업을 수행하기 위한 기본 "클라이언트"를 
  포함해야 한다. 이것은 CLI가 내부적으로 사용하는 것과 
  동일한 패키지이다. 다른 Go 프로그램에서 기본 헬름 명령어만 
  수행하고자 하는 경우 이 패키지가 적합하다.
- `pkg/{chart,chartutil}`: 차트를 로드하고 조작하는데 사용되는 메서드 및 
  헬퍼이다.
- `pkg/cli` 및 해당 하위 패키지: 표준 헬름 환경 변수에 대한 모든 
  핸들러를 포함하고 하위 패키지에는 출력 및 값 파일 
  처리를 포함한다.
- `pkg/release`: `Release` 오브젝트 및 상태를 정의한다.

이 외에도 더 많은 패키지가 있으므로, 자세한 내용은 설명서를 확인하자!

### 간단한 예
다음은 Go SDK를 사용하여 `helm list` 를 수행하는 간단한 예이다.

```go
package main

import (
    "log"
    "os"

    "helm.sh/helm/v3/pkg/action"
    "helm.sh/helm/v3/pkg/cli"
)

func main() {
    settings := cli.New()

    actionConfig := new(action.Configuration)
    // You can pass an empty string instead of settings.Namespace() to list
    // all namespaces
    if err := actionConfig.Init(settings.RESTClientGetter(), settings.Namespace(), os.Getenv("HELM_DRIVER"), log.Printf); err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    client := action.NewList(actionConfig)
    // Only list deployed
    client.Deployed = true
    results, err := client.Run()
    if err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    for _, rel := range results {
        log.Printf("%+v", rel)
    }
}

```

## 스토리지 백엔드 {#storage-backends}

헬름 3는 기본 릴리스 정보 저장소를 릴리스의 네임스페이스에서 
시크릿으로 변경하였다. 헬름 2는 기본적으로 릴리스 정보를 
틸러(Tiller) 인스턴스 네임스페이스의 컨피그맵으로 저장한다. 
다음 하위 섹션에서는 다양한 백엔드를 구성하는 방법을 보여준다. 
이 구성은 `HELM_DRIVER` 환경 변수를 기반으로 한다. 
값은 `[configmap, secret, sql]` 중 하나로 설정될 수 있다.

### 컨피그맵 스토리지 백엔드

컨피그맵 백엔드를 활성화 하려면 환경 변수를 `HELM_DRIVER` 에서 `configmap` 로 
설정해야 한다.

다음과 같이 셸에서 설정할 수 있다.

```shell
export HELM_DRIVER=configmap
```

기본 백엔드에서 컨피그맵 백엔드로 전환하려면 
직접 마이그레이션을 수행해야 한다. 다음 명령어를 
사용하여 릴리스 정보를 검색할 수 있다.

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```

**운영 참고사항**: 출시 정보에는 무단 접근으로부터 
보호해야 하는 민감한 데이터(예: 비밀번호, 개인키 및 
기타 자격증명)가 포함될 수 있다. 예를 들어 
[RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)을 
사용하여 쿠버네티스 인증을 관리할 때 컨피그맵 
리소스에 대한 광범위한 접근 권한을 부여하는 
동시에 시크릿 리소스에 대한 접근을 제한할 수 있다.
예를 들어 기본 [사용자 대면 역할](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles) 보기 
권한은 대부분의 리소스에 접근 권한을 부여하지만, 보안 시크릿에는 부여하지 않는다. 
또한 [암호화 된 저장소](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)에 
대해 시크릿 데이터를 구성할 수 있다.
컨피그맵 백엔드로 전환하기로 결정한 경우 애플리케이션의 민감한 데이터가 노출될 수 있으므로 유의해야 한다.

### SQL 스토리지 백엔드

SQL 데이터베이스에 릴리스 정보를 저장하는 ***베타*** SQL 
스토리지 백엔드가 있다.

이러한 스토리지 백엔드는 릴리스 정보의 무게가 1MB를 초과하는 경우에 사용하면 
특히 유용하다. (이 경우 쿠버네티스의 기본 etcd 키-값 저장소의 
내부 제한으로 인해 컨피그맵/시크릿에 저장할 수 없다.)

SQL 백엔드를 활성화하려면 SQL 데이터베이스를 배포하고 환경변수 
`HELM_DRIVER` 에서 `sql` 로 설정해야 한다. DB 세부 정보는 
환경변수 `HELM_DRIVER_SQL_CONNECTION_STRING` 으로 설정된다.

다음과 같이 셸에서 설정할 수 있다.

```shell
export HELM_DRIVER=sql
export HELM_DRIVER_SQL_CONNECTION_STRING=postgresql://helm-postgres:5432/helm?user=helm&password=changeme
```

> 참고: 현재 PostgreSQL 만 지원된다.

**운영 참고사항**: 다음을 권장한다.
- 운영 데이터베이스를 준비하자. PostgreSQL에 대한 자세한 내용은 [서버 관리](https://www.postgresql.org/docs/12/admin.html) 문서를 참조하자.
- 릴리스 정보를 위해 쿠버네티스 RBAC를 미러링하도록 [권한 관리](/topics/permissions_sql_storage_backend.md)를 
활성화하자.

기본 백엔드에서 SQL 백엔드로 전환하려면 
직접 마이그레이션을 수행해야 한다. 다음 
명령어를 통해 릴리스 정보를 검색할 수 있다.

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```
