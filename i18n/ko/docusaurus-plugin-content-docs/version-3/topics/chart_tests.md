---
title: 차트 테스트
description: 차트를 실행하고 테스트하는 방법을 설명한다.
sidebar_position: 3
---

차트에는 함께 작동하는 여러 쿠버네티스 리소스 및 구성요소가 포함되어
있다. 차트 작성자는 차트가 설치될 때 예상대로 작동하는지 확인하는 몇 가지
테스트를 작성할 수 있다. 이러한 테스트는 차트 사용자가 차트에 따라 수행될
작업을 이해하는 데에도 도움이 된다.

헬름 차트의 **테스트**는 `templates/` 디렉토리에 있으며 실행하기 위해
주어진 명령어로 컨테이너를 지정하는 작업 정의이다. 테스트가 성공한 것으로
판정되려면 컨테이너가 성공적으로 종료되어야 한다(exit 0). 작업 정의에는
헬름 테스트 훅 어노테이션(`helm.sh/hook: test`)이 반드시 포함되어야 한다.

헬름 v3까지는, 작업 정의에 `helm.sh/hook: test-success` 또는 `helm.sh/hook: test-failure`와
같은 헬름 테스트 훅 어노테이션 중 하나가 포함되어야 했다.
`helm.sh/hook: test-success`는 여전히 `helm.sh/hook: test`과
하위 호환되는 대안으로 허용된다.

예제 테스트:

- values.yaml 파일의 구성이 제대로 삽입되었는지 확인
  - 사용자 이름과 비밀번호가 올바르게 작동하는지 확인
  - 잘못된 사용자 이름과 비밀번호가 작동하지는 않는지 확인
- 서비스가 작동하고 올바르게 로드 밸런싱되는지 확인
- 기타

`helm test <RELEASE_NAME>` 명령어를 사용하여 헬름에서 릴리스에 대한 사전
정의된 테스트를 실행할 수 있다. 이렇게 하면 차트 사용자가 차트(또는 애플리케이션)의 릴리스가
기대한대로 작동하는지 확인할 수 있다.

## 예제 테스트

[helm create](/helm/helm_create.md) 명령어는 자동으로 여러 폴더와 파일을 생성한다. 헬름 테스트 기능을 사용해 보려면 먼저 데모 헬름 차트를 생성한다.

```console
$ helm create demo
```

이제 데모 헬름 차트에서 다음과 같은 구조를 볼 수 있다.

```
demo/
  Chart.yaml
  values.yaml
  charts/
  templates/
  templates/tests/test-connection.yaml
```

`demo/templates/tests/test-connection.yaml`에서 테스트를 확인할 수 있다. 다음은 헬름 테스트 파드 정의이다:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "demo.fullname" . }}-test-connection"
  labels:
    {{- include "demo.labels" . | nindent 4 }}
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['{{ include "demo.fullname" . }}:{{ .Values.service.port }}']
  restartPolicy: Never

```

## 릴리스에서 테스트 스위트를 실행하는 단계

먼저 클러스터에 차트를 설치하여 릴리스를 만든다. 모든 파드가
활성화될 때까지 기다려야 할 수도 있다. 설치 직후 바로 테스트하는 경우,
일시적인 오류가 발생할 수도 있고, 다시 테스트해야 할 수도 있다.

```console
$ helm install demo demo --namespace default
$ helm test demo
NAME: demo
LAST DEPLOYED: Mon Feb 14 20:03:16 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE:     demo-test-connection
Last Started:   Mon Feb 14 20:35:19 2022
Last Completed: Mon Feb 14 20:35:23 2022
Phase:          Succeeded
[...]
```

## 참고

- 테스트를 정의할 때는 단일 yaml 파일에 하거나 또는 `templates/` 디렉토리의 여러
  yaml 파일에 분산하여 할 수도 있다.
- 따로 분리하기 위해 `<차트-이름>/templates/tests/`와 같은 `tests/` 디렉토리 아래에
  테스트 스위트를 넣어둘 수도 있다.
- 테스트는 [헬름 훅](/topics/charts_hooks.md)이므로,
  `helm.sh/hook-weight`나 `helm.sh/hook-delete-policy`와 같은 어노테이션을 테스트
  리소스와 함께 사용할 수 있다.
