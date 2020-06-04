---
title: "역할 기반 접근 제어"
description: "차트 매니페스트에 있는 RBAC 리소스의 생성과 형식을 논한다."
weight: 8
aliases: ["/docs/topics/chart_best_practices/rbac/"]
---

이 부분은 모범사례 가이드의 일부로서 차트 매니페스트에 있는 RBAC 리소스의 생성과 형식을 논한다.

RBAC resources are:

- ServiceAccount (namespaced)
- Role (namespaced)
- ClusterRole
- RoleBinding (namespaced)
- ClusterRoleBinding

## YAML 설정

RBAC and ServiceAccount configuration should happen under separate keys. They
are separate things. Splitting these two concepts out in the YAML disambiguates
them and make this clearer.

```yaml
rbac:
  # Specifies whether RBAC resources should be created
  create: true

serviceAccount:
  # Specifies whether a ServiceAccount should be created
  create: true
  # The name of the ServiceAccount to use.
  # If not set and create is true, a name is generated using the fullname template
  name:
```

This structure can be extended for more complex charts that require multiple
ServiceAccounts.

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

`rbac.create` should be a boolean value controlling whether RBAC resources are
created.  The default should be `true`.  Users who wish to manage RBAC access
controls themselves can set this value to `false` (in which case see below).

## RBAC 리소스 사용하기

`serviceAccount.name` should set to the name of the ServiceAccount to be used by
access-controlled resources created by the chart.  If `serviceAccount.create` is
true, then a ServiceAccount with this name should be created.  If the name is
not set, then a name is generated using the `fullname` template, If
`serviceAccount.create` is false, then it should not be created, but it should
still be associated with the same resources so that manually-created RBAC
resources created later that reference it will function correctly.  If
`serviceAccount.create` is false and the name is not specified, then the default
ServiceAccount is used.

The following helper template should be used for the ServiceAccount.

```yaml
{{/*
Create the name of the service account to use
*/}}
{{- define "mychart.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "mychart.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}
```
