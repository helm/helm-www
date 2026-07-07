---
title: "사용 중단된 쿠버네티스 APIs"
description: "헬름에서 사용 중단된 쿠버네티스 API에 대해 설명한다."
---

쿠버네티스는 API 주도 시스템이며, 시간이 지남에 따라
문제 공간(problem space)에 대한 이해가 깊어지면서 이를 반영하기 위해 API 도 진화한다.
이는 어떤 시스템이나 그에 따른 API에서 나타나는 일반적인 관행이다.
진화하는 API에서 중요한 것은, 적절한 지원 중단 정책과
구현된 API의 변화를 사용자에게 알리는 프로세스이다. 다시 말해서,
API 소비자는 사전에 API 가 제거되거나 변경되는 릴리스에 대하여 알 수 있어야 한다.
그렇게 해야 소비자는 예상하지 못한 부분이나 규모가 단절적(breaking) 변화의 요소를 방지할 수 있다.

[쿠버네티스 사용
중단 정책](https://kubernetes.io/docs/reference/using-api/deprecation-policy/)은
쿠버네티스가 API 버전의 변경 사항을 처리하는 방법을 담은 문서이다.
지원 중단 정책에는 지원 중단 발표 후 API
버전이 지원되는 기간이 명시되어 있다. 따라서 영향도를 최소화하려면
지원 중단 공지를 주시하고 API 버전이 제거되는 시기를 알아두는 것이
중요하다.

이것은 [쿠버네티스 1.16에서
더 이상 사용되지 않는 API
버전을 제거하기 위한](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/) 발표의 예시이며
릴리스 몇 달 전에 발표되었다. 이러한 API 버전은
지원중단에 앞서 한번 더 안내되었다.
이는 API 버전 지원을 소비자에게 알리는 적절한 정책이 있음을 나타낸다.

헬름 템플릿은 쿠버네티스 메니페스트 파일과 유사하게
쿠버네티스 객체를 정의할 때 [쿠버네티스 API
그룹](https://kubernetes.io/docs/concepts/overview/kubernetes-api/#api-groups)을 지정한다.
템플릿의 `apiVersion` 필드에 지정되며 쿠버네티스 객체의
API 버전을 식별한다. 즉, 헬름 사용자와 차트 유지관리자는
쿠버네티스 API 버전이 언제 사용 중단(deprecated)되고
어느 쿠버네티스 버전에서 제거되는지를 알고 있어야 한다.

## 차트 관리자

차트에 있는 쿠버네티스 API 버전이 어느 쿠버네티스 버전에서
사용중단되거나 제거되는지를 감사(audit)해야 한다.
지원 중단이 예정되어 있거나 이미 중단된 API 버전은 지원되는 버전으로 바꾸고
출시되는 차트도 새로운 버전으로 업데이트해야 한다. API 버전은 `kind` 및
`apiVersion` 필드로 정의된다. 예를 들어 쿠버네티스 1.16
에서 제거된 `Deployment` 객체의 API 버전은 다음과 같다.

```yaml
apiVersion: apps/v1beta1
kind: Deployment
```

## 헬름 사용자

사용자는 ([차트 관리자](#차트-관리자)와 유사하게) 사용하는
차트를 감사(audit)하고, 쿠버네티스 버전에서 API 버전이
사용중단되거나 제거된 차트를 식별해야 한다.
식별된 차트의 경우 최신 버전의 차트(API 버전을 지원하는)가 있는지
확인하거나 직접 차트를 업데이트해야 한다.

또한, 배포된 모든 차트(예: 헬름 릴리스)를 감사(audit)하여
사용중단되거나 제거된 API 버전을 다시 확인해야 한다.
`helm get manifest` 명령어를 사용하여 릴리스의 세부사항을 보면 된다.

확인한 바에 따라, 헬름 릴리스를 지원되는 API로 업데이트하는 방법은
다음과 같다.

1. 지원 중단된 API 버전만을 찾는 경우,
  - 지원되는 쿠버네티스 API 버전이 포함된 차트 버전으로 `helm upgrade`
    수행
  - 현재 버전 이전의 헬름 버전으로 롤백되지 않도록
    업그레이드에 대한 설명(description) 추가
2.  쿠버네티스 버전에서 제거된 API 버전을 찾는
    경우,
  - API 버전을 계속 사용할 수 있는 쿠버네티스 버전을 실행 중이라면(예: 쿠버네티스 1.15 에 있고, 쿠버네티스 1.16 에서 제거될 API를 사용하는 경우):
    - 1 단계 절차를 수행한다.
  - 그렇지 않다면(예: `helm get manifest` 에서 나온 API 버전을
    더 이상 사용할 수 없는 쿠버네티스 버전을 사용 중인 경우):
    - API 버전을 지원되는 API로 업데이트하려면 클러스터에
  	  저장된 릴리스 매니페스트를 편집해야 한다.
  	  자세한 내용은 [릴리스 매니페스트의 api 버전 업데이트](#릴리스-매니페스트의-api-버전-업데이트)를
  	  참조하자.

> 참고: 지원되는 API로 헬름 릴리스를 업데이트하는 모든 경우에,
지원되는 API 가 있는 릴리스 버전 이전 버전으로 릴리스를
롤백해서는 안된다.

> 권고: 해당 API 버전이 제거되는 쿠버네티스 클러스터 업그레이드 작업 전에,
사용중단된 API 버전을 사용하는 릴리스를
지원되는 API 버전으로 업그레이드하는 것이 모범사례이다.

위와 같이 릴리스를 업데이트하지 않으면, API 버전이
제거된 쿠버네티스 버전에서 릴리스를 업그레이드하려고 할 때
다음과 유사한 오류가 발생할 수 있다.

```
Error: UPGRADE FAILED: current release manifest contains removed kubernetes api(s)
for this kubernetes version and it is therefore unable to build the kubernetes
objects for performing the diff. error from kubernetes: unable to recognize "":
no matches for kind "Deployment" in version "apps/v1beta1"
```

헬름은 업데이트/지원되는 API 버전과 함께
전달받은 차트를 가지고, 현재 배포된 릴리스간의
diff 패치(이 쿠버네티스 버전에서 제거된 쿠버네티스 API를 포함)를
만드려고 하기 때문에 이 시나리오는 실패하게 된다.
실패의 근본적인 이유는, 쿠버네티스가 API 버전을 제거하면
쿠버네티스 Go 클라이언트 라이브러리가 더 이상 지원 중단된
객체를 파싱할 수 없기 때문에 헬름이 라이브러리를
호출할 수 없기 때문이다. 헬름은 안타깝게도 이 상황을
복구할 수 없으며 더 이상 이러한 릴리스는 관리할 수 없다. 이 시나리오에서 복구하는 방법에 대한 자세한 내용은
[릴리스 매니페스트의 api 버전 업데이트](#릴리스-매니페스트의-api-버전-업데이트)를 참조하자.

## 릴리스 매니페스트의 api 버전 업데이트

매니페스트는 클러스터에서 시크릿(기본값) 또는 컨피그맵의 데이터 필드에 저장되는
헬름 릴리스 객체의 속성이다. 데이터 필드에는 base 64 로 인코딩되어
gzip 으로 압축된 객체가 담겨 있다. (시크릿에는 추가적인 base 64 인코딩이
적용된다.) 릴리스의 네임스페이스에는 릴리스 버전/리비전마다의
시크릿/컨피그맵들이 있게 된다.

사용자는 헬름 [mapkubeapis](https://github.com/helm/helm-mapkubeapis) 플러그인을
사용하여 지원되는 API에 대한 릴리스 업데이트를
수행할 수 있다. 자세한 내용은 readme 를 확인하자.

또는 다음의 단계에 따라 수동으로 릴리스 매니페스트의 API 버전
업데이트를 수행할 수 있다. 구성에 따라 시크릿 또는 컨피그맵 백엔드에 대한
작업단계를 따라야 한다.

- 배포된 최신 릴리스와 관련된 시크릿 또는 컨피그맵의 이름을
  가져온다.
  - 시크릿 백엔드: `kubectl get secret -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
  - 컨피그맵 백엔드: `kubectl get configmap -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
- 배포된 최신 릴리스 정보를 가져온다.
  - 시크릿 백엔드: `kubectl get secret <release_secret_name> -n
    <release_namespace> -o yaml > release.yaml`
  - 컨피그맵 백엔드: `kubectl get configmap <release_configmap_name> -n
    <release_namespace> -o yaml > release.yaml`
- 문제가 발생하여 복원해야 하는 경우 릴리스를 백업한다.:
  - `cp release.yaml release.bak`
  - 비상시에 복구해야 할 경우: `kubectl apply -f release.bak -n
    <release_namespace>`
- 릴리스 객체를 디코딩한다:
  - 시크릿 백엔드:`cat release.yaml | grep -oP '(?<=release: ).*' | base64 -d
    | base64 -d | gzip -d > release.data.decoded`
  - 컨피그맵 백엔드: `cat release.yaml | grep -oP '(?<=release: ).*' | base64
    -d | gzip -d > release.data.decoded`
- 매니페스트의 API 버전을 변경한다. 모든 도구(예: 편집기)를 사용하여
  변경할 수 있다. 이것은 디코딩 된 릴리스
  객체의 (`release.data.decoded`)의 `manifest` 필드에 존재한다.
- 릴리스 객체를 인코딩한다:
  - 시크릿 백엔드: `cat release.data.decoded | gzip | base64 | base64`
  - 컨피그맵 백엔드: `cat release.data.decoded | gzip | base64`
- 배포된 릴리스 파일(`release.yaml`)의
  `data.release` 속성 값을 인코딩 된 새 릴리스 객체로 변경한다.
- 파일을 네임스페이스에 적용한다: `kubectl apply -f release.yaml -n
  <release_namespace>`
- 지원되는 쿠버네티스 API 버전이 있는 차트 버전으로 `helm upgrade` 를
  수행한다.
- 현재 버전 이전의 헬름 버전으로 롤백하지 않도록 업그레이드에
  설명을 추가한다.
