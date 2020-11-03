---
title: "차트 훅(hooks)"
description: "차트 훅을 이용하여 작업하는 방법을 설명한다."
weight: 2
---

헬름은 차트 개발자가 릴리스 수명주기의 특정 지점에 개입할 수 있도록 _hook_ 매커니즘을 제공한다.
예를 들어 다음과 같은 것들을 하기 위해 훅을 사용할 수 있다.

- 설치 시 다른 차트가 로드되기 전에 컨피그맵이나 시크릿을 로드한다.
- 새 차트를 설치하기 전에 데이터베이스를 백업하는 작업을 실행하고, 
  데이터 복원을 위해 업그레이드 후 2번째 작업을 수행한다. 
- 릴리스를 제거하기 전에 서비스를 순환에서 안전하게 제거하기 위하여,
  릴리스 삭제 전에 작업을 수행한다.

훅은 일반적인 템플릿처럼 작동하지만 헬름이 다른 방식으로 
처리하도록 하는 특수한 어노테이션이 있다.
이 섹션에서는 훅의 기본 사용 패턴을 다룬다.

## 사용 가능한 훅

훅은 다음과 같이 정의되어 있다.

| 어노테이션 값	       | 설명                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `pre-install`    | 템플릿은 렌더링되었지만, 쿠버네티스에서 아직 아무 리소스도 생성되기 전에 실행된다. |                                          |
| `post-install`   | 쿠버네티스에 모든 리소스가 로드된 후에 실행된다.                                                                   |
| `pre-delete`     | 삭제 요청 중에서, 쿠버네티스에서 리소스가 삭제되기 전에 실행된다.                                                         |
| `post-delete`    | 삭제 요청 중에서, 릴리스의 모든 리소스가 삭제된 후 실행된다.                                                            |
| `pre-upgrade`    | 업그레이드 요청 중에서, 템플릿은 렌더링되었지만 리소스는 업데이트되기 전에 실행된다.                                            |
| `post-upgrade`   | 업그레이드 요청 중에서, 모든 리소스가 업그레이드된 후 실행된다.                                                             |
| `pre-rollback`   | 롤백 요청 중에서, 템플릿은 렌더링되었지만 아직 아무 리소스도 롤백되지 않은 시점에 실행된다.                                                    |
| `post-rollback`  | 롤백 요청 중에서, 모든 리소스가 수정된 후에 실행된다.                                                                 |
| `test`           | 헬름 test 하위 명령어가 호출될 때 실행된다. ([테스트 문서 보기](/docs/chart_tests/))                                  |

_헬름 3에서는 `crd-install` 훅은 제거되었고 대신 `crds/` 디렉터리를 
사용한다는 점을 잊지 말자._ 

## 훅과 릴리스 수명주기

훅을 사용하면 차트 개발자는 릴리스 수명주기 상의 중요 시점에서 
작업이 수행되도록 할 수 있다. 예를 들어 `helm install` 의 수명주기를 
생각해보자. 기본적으로 수명주기는 다음과 같다.

1. 사용자가 `helm install foo` 를 실행한다.
2. 헬름 라이브러리 설치 API가 호출된다.
3. 검증 후, 라이브러리는 `foo` 템플릿을 렌더링한다.
4. 라이브러리는 결과로 나온 리소스를 쿠버네티스에 로드한다.
5. 라이브러리는 릴리스 객체(및 다른 데이터)를 클라이언트에 반환한다.
6. 클라이언트가 종료된다.

헬름은 `install` 수명주기에 대해 `pre-install` 및 `post-install` 
의 두 가지 훅을 정의한다. `foo` 차트의 개발자가 두 훅을 모두 구현하면 수명주기는 
다음과 같이 바뀐다.

1. 사용자가 `helm install foo` 를 실행한다.
2. 헬름 라이브러리 설치 API가 호출된다.
3. `crds/` 디렉터리의 CRD가 설치된다.
4. 검증 후 라이브러리는 `foo` 템플릿을 렌더링한다.
5. 라이브러리는 `pre-install` 훅 실행을 준비한다. (쿠버네티스에
   훅 리소스 로딩)
6. 라이브러리는 가중치(기본값으로는 0을 할당), 리소스 종류, 
   이름을 기준으로 훅을 오름차순으로 정렬한다.
7. 라이브러리는 가장 낮은 가중치의 훅을 먼저 로드한다.(음수에서 
   양수로)
8. 라이브러리는 훅이 "Ready" 될 때까지 대기한다(CRD 제외).
9. 라이브러리는 결과로 나온 리소스를 쿠버네티스에 로드한다. 
   `--wait` 플래그가 설정된 경우 라이브러리는 모든 리소스가 "Ready" 상태가 될 때까지 대기하고, 
   준비가 될 때까지 `post-install` 훅을 실행하지 않는다.
10. 라이브러리는 `post-install` 훅을 실행한다. (훅 리소스 로딩)
11. 라이브러리는 훅이 "Ready" 될 때까지 기다린다.
12. 라이브러리는 릴리스 객체(및 다른 데이터)를 클라이언트에 반환한다.
13. 클라이언트가 종료된다.

훅이 준비될 때까지 기다린다는 것은 무엇을 의미하는가? 이것은 
훅에 선언된 리소스에 따라 다르다. 리소스가 `Job` 또는 `Pod` 종류인 경우 
헬름은 성공적으로 실행 완료될 때까지 기다린다. 훅이 실패하면 릴리스는 실패하게 된다. 
이것은 _블로킹(blocking) 작업_이므로 작업이 실행되는 
동안 헬름 클라이언트는 일시정지될 것이다.

다른 모든 종류의 경우, 쿠버네티스가 리소스를 로드(추가 또는 업데이트)하였다고 
표시하는 즉시, 리소스는 "Ready" 로 간주된다.
훅에 많은 리소스가 선언되면 리소스들은 연속적으로 실행된다.
훅 가중치(아래 참조)가 있으면, 가중치 순서대로 실행된다.
헬름 3.2.0 부터 같은 가중치를 가진 훅 리소스들은 훅이 없는 일반 리소스와 
같은 순서로 설치된다. 그밖의 경우에는 순서가 보장되지 않는다. (헬름 2.3.0 
이상에서는 알파벳순으로 정렬된다. 그러나 이 동작은 바인딩으로 간주되지 않으며 
향후 변경될 수 있다.) 여기까지가 훅 가중치 추가시 고려할 사항이며,
만약 가중치가 중요하지 않다면 `0` 으로 설정하는 것이 
좋다.

### 해당 릴리스에 의해 관리되지 않는 훅 리소스

훅이 생성하는 리소스는 현재 릴리스의 일부로 추적되거나 
관리되지 않는다. 헬름은 훅이 준비 상태까지 도달했는지를 확인했다면
훅 리소스를 그대로 남겨둔다. 향후 헬름 3에 릴리스 삭제시 
훅 리소스에 대한 가비지 수집 기능이 추가될 수 있으므로, 
삭제되면 안되는 모든 훅 리소스에 `helm.sh/resource-policy: keep` 어노테이션을 
추가해야 한다.

실질적으로, 이는 훅 리소스를 만드는 경우 `helm uninstall` 으로 
리소스를 제거할 수 없음을 의미한다. 이러한 리소스를 
삭제하려면 훅 템플릿 파일에 [사용자 지정 `helm.sh/hook-delete-policy` 어노테이션을 추가](#훅-삭제-정책)하거나 
작업(Job) 리소스의 
[time to live(TTL) 필드를 설정](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/)해야 
한다.

## 훅 작성하기

훅은 `metadata` 섹션에 특별한 어노테이션이 있는 
쿠버네티스 매니페스트 파일이다. 템플릿 파일이기 때문에 
`.Values`, `.Release` 및 `.Template` 을 
읽기를 포함한 모든 일반 템플릿 기능을 사용할 수 있다.

예를 들어 `templates/post-install-job.yaml` 에 저장된 템플릿은
`post-install` 에서 실행할 작업을 선언한다.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}"
  labels:
    app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
    app.kubernetes.io/instance: {{ .Release.Name | quote }}
    app.kubernetes.io/version: {{ .Chart.AppVersion }}
    helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
  annotations:
    # This is what defines this resource as a hook. Without this line, the
    # job is considered part of the release.
    "helm.sh/hook": post-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    metadata:
      name: "{{ .Release.Name }}"
      labels:
        app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
        app.kubernetes.io/instance: {{ .Release.Name | quote }}
        helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
    spec:
      restartPolicy: Never
      containers:
      - name: post-install-job
        image: "alpine:3.3"
        command: ["/bin/sleep","{{ default "10" .Values.sleepyTime }}"]

```

다음의 어노테이션으로 이 템플릿을 훅으로 만든다.

```yaml
annotations:
  "helm.sh/hook": post-install
```

하나의 리소스는 여러 개의 훅으로 구현할 수 있다.

```yaml
annotations:
  "helm.sh/hook": post-install,post-upgrade
```

마찬가지로, 주어진 훅을 구현하는 다양한 리소스의 수에는 
제한이 없다. 예를 들어 시크릿과 컨피그맵을 둘다
pre-install 훅으로 선언할 수 있다.

하위 차트에 훅이 선언되면 해당 훅도 평가된다.
최상위 차트가 하위 차트에 선언된 훅을 비활성화할 수 있는 방법은 없다.

결정적 실행순서를 정하는데 도움이 되는 훅에 대한 가중치를 
정의할 수 있다. 가중치는 다음의 어노테이션을 사용하여 
정의한다.

```yaml
annotations:
  "helm.sh/hook-weight": "5"
```

훅 가중치는 양수여도 되고 음수여도 되지만 문자열로 표기해야
한다. 헬름이 특정 종류의 훅 실행주기를 시작하면 해당 훅을
오름차순으로 정렬한다.

### 훅 삭제 정책

대상 훅 리소스를 언제 삭제할지를 결정하는 정책을 정의할 
수 있다. 훅 삭제 정책은 다음과 같은 어노테이션을 사용하여 
정의한다.

```yaml
annotations:
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

한개 혹은 그 이상의 정의된 어노테이션 값을 선택할 수 있다.

| 어노테이션 값              | 설명                                                                  |
| ---------------------- | -------------------------------------------------------------------- |
| `before-hook-creation` | 새 훅이 시작되기 전에 이전 리소스를 삭제한다. (기본값)                             |
| `hook-succeeded`       | 훅이 성공적으로 실행된 후에 리소스를 삭제한다.                                    |
| `hook-failed`          | 실행 중 훅이 실패한 경우 리소스를 삭제한다.                                      |

훅 삭제 정책 어노테이션이 지정되지 않은 경우, 기본적으로 `before-hook-creation` 동작이
적용된다.
