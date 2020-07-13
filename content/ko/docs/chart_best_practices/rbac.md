---
title: "역할 기반 접근 제어"
description: "차트 매니페스트에 있는 RBAC 리소스의 생성과 형식을 논한다."
weight: 8
---

이 부분은 모범사례 가이드의 일부로서 차트 매니페스트에 있는 RBAC 리소스의 생성과 형식을 논한다.

RBAC 리소스는 다음과 같다.

- ServiceAccount (네임스페이스 구분)
- Role (네임스페이스 구분)
- ClusterRole
- RoleBinding (네임스페이스 구분)
- ClusterRoleBinding

## YAML 설정

RBAC과 서비스어카운트(ServiceAccount) 설정은 개별 키로 되어야 한다.
둘은 별개의 것이다.
이 두가지 개념을 YAML 내에서 구분함으로써 둘 사이의 애매함을 없애고 명확히 할 수 있다.

```yaml
rbac:
  # RBAC 리소스를 생성할지 지정
  create: true

serviceAccount:
  # 서비스어카운트를 생성할지 지정
  create: true
  # 사용할 서비스어카운트 이름
  # create가 true인데 이름이 지정되지 않으면, 풀네임 템플릿에 따라 이름이 생성됨
  name:
```

이 구조는 여러 개의 서비스어카운트를 필요로 하는 더 복잡한 차트로 확장할 수 있다.

```yaml
someComponent:
  serviceAccount:
    create: true
    name:
anotherComponent:
  serviceAccount:
    create: true
    name:
```

## RBAC 리소스는 기본값으로 생성해야 한다

`rbac.create`는 RBAC 리소스를 생성할지를 컨트롤하는 불리언 값이어야 한다.
기본값은 `true`여야 한다.
RBAC 접근 제어를 직접 관리하려는 사용자는
이 값을 `false`로 지정할 수 있다. (아래의 사례 참고)

## RBAC 리소스 사용하기

`serviceAccount.name`는 차트로 생성된 접근제어 리소스가 사용할
ServiceAccount 이름으로 설정해야 한다.
`serviceAccount.create`가 true이면, 그 이름으로 서비스어카운트가 생성된다.
이름이 설정되지 않았다면 `fullname` 템플릿을 사용하여 이름이 생성된다.
`serviceAccount.create`이 false이면, 서비스어카운트가 생성되지는 않지만,
나중에 RBAC 리소스를 수동으로 생성하고 참조하여 정상 작동하게 하려면 동일한 리소스들과 연계되어야 한다.
`serviceAccount.create`가 false이고 이름이 지정되지 않으면, 기본 서비스어카운트를 사용한다.

서비스어카운트에 다음 헬퍼 템플릿을 사용해야 한다.

```yaml
{{/*
사용할 서비스어카운트 이름 생성
*/}}
{{- define "mychart.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "mychart.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}
```
