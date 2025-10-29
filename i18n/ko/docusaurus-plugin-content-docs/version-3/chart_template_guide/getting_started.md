---
title: 시작하기
description: 차트 템플릿에 관한 빠른 가이드
sidebar_position: 2
---

이 섹션에서는 차트를 만든 다음 첫 번째 템플릿을 추가할 것이다.
우리가 여기서 만든 차트는 가이드의 나머지 부분에서 쭉 사용될 것이다.

시작하기 위해 헬름 차트를 간단히 살펴보자.

## 차트

[차트 가이드](/topics/charts.md)에 설명된 대로,
헬름 차트는 다음과 같이 구성된다:

```
mychart/
  Chart.yaml
  values.yaml
  charts/
  templates/
  ...
```

`templates/` 디렉토리는 템플릿 파일을 위한 것이다.
헬름이 차트를 평가할 때,
`templates/` 디렉토리의 모든 파일을 템플릿 렌더링 엔진으로 전달한다.
그리고 나서 처리 결과를 모아 쿠버네티스로 보낸다.

`values.yaml` 파일도 템플릿에 중요하다.
이 파일은 차트의 _기본값_ 을 포함한다.
이 값들은 `helm install` 또는 `helm upgrade` 하는 중에 사용자가 재정의할 수 있다.

`Chart.yaml` 파일은 차트에 대한 설명을 포함한다.
템플릿 안에서 접근할 수 있다.
`charts/` 디렉토리는 다른 차트(_하위차트_ 라고 함)를 포함 _할 수도_ 있다.
본 가이드의 뒷부분에서 템플릿 렌더링과 관련하여 이러한 기능이 어떻게 작동하는지 알아볼 것이다.

## 스타터 차트

본 가이드를 위해 `mychart` 라는 간단한 차트를 만든 다음,
차트 안에 템플릿을 만들 것이다.

```console
$ helm create mychart
mychart 생성
```

### `mychart/templates/` 훑어보기

`mychart/templates/` 를 보면 이미 몇 개의 파일이 있는 것을 알 수 있다.

- `NOTES.txt` : 차트의 "도움말". 이것은 `helm install` 을 실행할 때 사용자에게 표시될 것이다.
- `deployment.yaml` : 쿠버네티스
  [디플로이먼트](https://kubernetes.io/ko/docs/concepts/workloads/controllers/deployment/)를
  생성하기 위한 기본 매니페스트
- `service.yaml` : 디플로이먼트의 [서비스
  엔드포인트](https://kubernetes.io/ko/docs/concepts/services-networking/service/)를
  생성하기 위한 기본 매니페스트
- `_helpers.tpl` : 차트 전체에서 다시 사용할 수 있는 템플릿 헬퍼를 지정하는 공간

그리고 우리가 할 일은... _전부 제거하자!_
그렇게 하면 우리는 튜토리얼의 맨 처음부터 끝까지 실행할 수 있다.
실제로 우리만의 `NOTES.txt` 와 `_helpers.tpl` 을 만들 것이다.

```console
$ rm -rf mychart/templates/*
```

프로덕션용 차트를 작성할 때는 차트의 기본 버전을 사용하는 것이 매우 유용할 수 있다.
따라서 매일 차트를 작성할 때는 차트를 삭제하는 것을 원하지 않을 수도 있다.

## 첫 번째 템플릿

우리가 만들 첫 번째 템플릿은 `ConfigMap` 이 될 것이다.
쿠버네티스에서 컨피그맵은 단순히 환경 설정 데이터를 저장하는 컨테이너일 뿐이다.
파드 같은 다른 것들은 컨피그맵의 데이터에 접근할 수 있다.

컨피그맵은 기본 리소스이기 때문에 우리에게 좋은 출발점이 된다.

먼저 `mychart/templates/configmap.yaml` 이라는 파일을 만들어 보자.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

템플릿 이름은 엄격한 명명 패턴을 따르지 않는다.
단, YAML 파일에는 접미사 `.yaml` 을, 헬퍼에는 `.tpl` 을 사용하는 것이 좋다.

위의 YAML 파일은 최소한의 필수 필드를 가진 가장 기본적인 컨피그맵이다.
이 파일은 `mychart/template/` 디렉토리에 있기 때문에 템플릿 엔진으로 전달된다.

`mychart/template/` 디렉토리에 이와 같이 평범한 YAML 파일을 넣는 것은 괜찮다.
헬름이 이 템플릿을 읽으면 쿠버네티스에게 그대로 보낼 뿐이다.

이 간단한 템플릿으로 우리는 이제 설치 가능한 차트를 가지고 있다.
이렇게 설치하면 된다:

```console
$ helm install full-coral ./mychart
NAME: full-coral
LAST DEPLOYED: Tue Nov  1 17:36:01 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

헬름을 사용하면 릴리스를 검색해 실제 전송된 템플릿을 볼 수 있다.

```console
$ helm get manifest full-coral

---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

`helt get manifest` 명령은 릴리스 이름(`full-coral`)을 가지고
서버에 업로드된 쿠버네티스 리소스를 모두 출력한다.
각 파일은 `---`로 시작하여 YAML 문서의 시작을 표시한 다음
자동으로 생성된 주석이 나타나 이 YAML 문서를 생성한 템플릿 파일을 알려준다.

여기서 이 YAML 데이터가 정확히 `configmap.yaml` 파일에 입력한 것임을 알 수 있다.

이제 릴리스를 제거해도 된다: `helm uninstall full-coral`.

### 단순한 템플릿 호출 추가하기

`name:` 을 리소스 안에 하드 코딩하는 것은 보통 좋지 못한 관행으로 간주된다.
이름은 릴리스에 고유해야 한다.
그래서 릴리스 이름을 삽입하여 이름 필드를 생성하기를 원할 수 있다.

**TIP:** DNS 시스템에 대한 제한 때문에 `name:` 필드가 63자로 제한된다.
이 때문에 릴리스 이름은 53자로 제한한다.
쿠버네티스 1.3 이하에서는 단 24자(즉, 14자 이름)로 제한하였다.

이에 따라 `configmap.yaml` 을 바꾸자.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
```

`name:` 필드의 값에서 `{{ .Release.Name }}-configmap` 이라고 큰 변화가 일어났다.

> 템플릿 지시문은 `{{` 와 `}}` 으로 감싼다.

템플릿 지시문 `{{ .Release.Name }}` 은 템플릿에 릴리스 이름을 주입한다.
템플릿으로 전달되는 값은 _네임스페이스 객체_ 로 생각할 수 있으며,
여기서 점(`.`)이 각 네임스페이스 요소를 구분한다.

`Release` 앞의 점은 해당 스코프(조금 있으면 스코프에 대해 설명하겠다)의
최상위 네임스페이스부터 시작한다는 것을 나타낸다.
그래서 우리는 `.Release.Name`을
"최상위 네임스페이스에서부터 시작하여 `Release` 객체를 찾은 다음
`Name`이라는 객체를 찾아보라"로 읽을 수 있다.

`Release` 객체는 헬름의 내장 객체 중 하나이며, 이후에 좀 더 심층적으로 다룰 것이다.
현재로서는 헬름 라이브러리가 릴리스에 할당한 이름을 나타내는 것이라고 말해도
손색이 없다.

이제 리소스를 설치할 때 이 템플릿 지시어를 사용한 결과를 바로 볼 수 있다.

```console
$ helm install clunky-serval ./mychart
NAME: clunky-serval
LAST DEPLOYED: Tue Nov  1 17:45:37 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

쿠버네티스 안에 컨피그맵은 이전의 `mychart-configmap` 이 아닌
`clunky-serval-configmap` 이라는 점에 주목하자.

`helm get manifest clunky-serval`을 실행하여 생성된 전체 YAML을 볼 수 있다.

이때 템플릿은 가장 기본적인 것으로, `{{` 와 `}}` 에 내장된 템플릿 지시문을 가진 YAML 파일이다.
다음 단계에서는 템플릿에 대해 더 자세히 살펴보도록 하겠다.
그러나 다음 단계로 넘어가기 전에 템플릿을 더 빨리 만들 수 있는 한 가지 요령을 보자:
실제로 아무것도 설치하지 않지만 템플릿 렌더링을 테스트하고 싶다면
`helm install --debug --dry-run goodly-guppy ./mychart` 를 사용할 수 있다.
이렇게 하면 템플릿이 렌더링된다.
그러나 차트를 설치하는 대신 렌더링 된 템플릿을 반환하여 이러한 출력을 볼 수 있다:

```console
$ helm install --debug --dry-run goodly-guppy ./mychart
install.go:149: [debug] Original chart version: ""
install.go:166: [debug] CHART PATH: /Users/ninja/mychart

NAME: goodly-guppy
LAST DEPLOYED: Thu Dec 26 17:24:13 2019
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: nginx
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: false
  hosts:
  - host: chart-example.local
    paths: []
  tls: []
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 1
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: goodly-guppy-configmap
data:
  myvalue: "Hello World"

```

`--dry-run` 을 사용하면 코드를 쉽게 테스트할 수 있지만,
쿠버네티스가 당신이 만든 템플릿을 받아들일지는 확신할 수 없을 것이다.
`--dry-run` 이 작동됐다는 이유로 차트가 설치될 것이라고 생각하지 않는 것이 가장 좋다.

[차트 템플릿 가이드](/chart_template_guide/index.mdx)에서는 여기서 정의한 기본 차트를 가지고 헬름 템플릿 언어를 자세히 살펴본다.
그럼 내장 객체부터 시작하자.
