---
title: "차트 테스트"
description: "차트를 실행하고 테스트 하는 방법을 설명한다."

weight: 3
---

차트에는 함께 작동하는 여러 쿠버네티스 리소스 및 구성요소가 포함되어
있다. 차트 작성자는 차트가 설치될 때 예상대로 작동하는지 확인하는 몇 가지
테스트를 작성할 수 있다. 이러한 테스트는 차트 사용자가 차트에 따라 수행될
작업을 이해하는 데에도 도움이 된다.

헬름 차트의 **테스트** 는 `template/` 디렉토리에 있으며 실행하기 위해
주어진 명령어로 컨테이너를 지정하는 작업 정의이다. 테스트가 성공한 것으로
판정되려면 컨테이너가 성공적으로 종료되어야 한다(exit 0). 작업 정의에는
헬름 테스트 훅 어노테이션(`helm.sh/hook: test`)이 반드시 포함되어야 한다.

헬름 v3 까지는, 작업 정의에 `helm.sh/hook: test-success` 또는 `helm.sh/hook: test-failure` 와
같은 헬름 테스트 훅 어노테이션 중 하나가 포함되어야 했다.
`helm.sh/hook: test-success` 는 여전히 `helm.sh/hook: test` 과
하위 호환되는 대안으로 허용된다.

예제 테스트:

- values.yaml 파일의 구성이 제대로 삽입되었는지
  확인
  - 사용자 이름과 비밀번호가 올바르게 작동하는지 확인
  - 잘못된 사용자 이름과 비밀번호가 작동하지는 않는지 확인
- 서비스가 작동하고 올바르게 로드 밸런싱 되는지 확인
- 기타

helm test <RELEASE_NAME> 명령어를 사용하여 헬름에서 릴리스에 대한 사전
정의된 테스트를 실행할 수 있다. 이렇게 하면 차트 사용자가 차트(또는 애플리케이션)의 릴리스가
기대한대로 작동하는지 확인할 수 있다.

## 예제 테스트

다음은 [비트나미(bitnami) 워드프레스 차트](https://hub.helm.sh/charts/bitnami/wordpress)에
있는 헬름 테스트 파드의 정의에 대한 예이다. 차트 사본을 다운로드하면
파일을 로컬에서 확인할 수 있다.

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm pull bitnami/wordpress --untar
```

```
wordpress/
  Chart.yaml
  README.md
  values.yaml
  charts/
  templates/
  templates/tests/test-mariadb-connection.yaml
```

`wordpress/templates/tests/test-mariadb-connection.yaml` 에서,
해 볼 수 있는 테스트를 확인할 수 있다.

```yaml
{{- if .Values.mariadb.enabled }}
apiVersion: v1
kind: Pod
metadata:
  name: "{{ .Release.Name }}-credentials-test"
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: {{ .Release.Name }}-credentials-test
      image: {{ template "wordpress.image" . }}
      imagePullPolicy: {{ .Values.image.pullPolicy | quote }}
      {{- if .Values.securityContext.enabled }}
      securityContext:
        runAsUser: {{ .Values.securityContext.runAsUser }}
      {{- end }}
      env:
        - name: MARIADB_HOST
          value: {{ template "mariadb.fullname" . }}
        - name: MARIADB_PORT
          value: "3306"
        - name: WORDPRESS_DATABASE_NAME
          value: {{ default "" .Values.mariadb.db.name | quote }}
        - name: WORDPRESS_DATABASE_USER
          value: {{ default "" .Values.mariadb.db.user | quote }}
        - name: WORDPRESS_DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: {{ template "mariadb.fullname" . }}
              key: mariadb-password
      command:
        - /bin/bash
        - -ec
        - |
          mysql --host=$MARIADB_HOST --port=$MARIADB_PORT --user=$WORDPRESS_DATABASE_USER --password=$WORDPRESS_DATABASE_PASSWORD
  restartPolicy: Never
{{- end }}
```

## 릴리스에서 테스트 스위트를 실행하는 단계

먼저 클러스터에 차트를 설치하여 릴리스를 만든다. 모든 파드가
활성화될 때까지 기다려야 할 수도 있다. 설치 직후 바로 테스트하는 경우,
일시적인 오류가 발생할 수도 있고, 다시 테스트해야 할 수도 있다.

```console
$ helm install quirky-walrus wordpress --namespace default
$ helm test quirky-walrus
Pod quirky-walrus-credentials-test pending
Pod quirky-walrus-credentials-test pending
Pod quirky-walrus-credentials-test pending
Pod quirky-walrus-credentials-test succeeded
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 succeeded
NAME: quirky-walrus
LAST DEPLOYED: Mon Jun 22 17:24:31 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE:     quirky-walrus-mariadb-test-dqas5
Last Started:   Mon Jun 22 17:27:19 2020
Last Completed: Mon Jun 22 17:27:21 2020
Phase:          Succeeded
TEST SUITE:     quirky-walrus-credentials-test
Last Started:   Mon Jun 22 17:27:17 2020
Last Completed: Mon Jun 22 17:27:19 2020
Phase:          Succeeded
[...]
```

## 참고

- 테스트를 정의할 때는 단일 yaml 파일에 하거나 또는 `template/` 디렉토리의 여러 
  yaml 파일에 분산하여 할 수도 있다.
- 따로 분리하기 위해 `<차트-이름>/templates/tests/` 와 같은 `tests/` 디렉토리 아래에
  테스트 스위트를 넣어둘 수도 있다.
- 테스트는 [헬름 훅](/docs/charts_hooks/) 이므로, 
  `helm.sh/hook-weight` 나 `helm.sh/hook-delete-policy` 와 같은 어노테이션을 테스트
  리소스와 함께 사용할 수 있다.
