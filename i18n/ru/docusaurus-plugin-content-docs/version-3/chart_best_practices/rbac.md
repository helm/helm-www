---
title: Управление доступом на основе ролей
description: Рекомендации по созданию и форматированию ресурсов RBAC в манифестах чартов.
sidebar_position: 8
---

Эта часть руководства по лучшим практикам посвящена созданию и форматированию
ресурсов RBAC в манифестах чартов.

К ресурсам RBAC относятся:

- ServiceAccount (namespaced)
- Role (namespaced)
- ClusterRole
- RoleBinding (namespaced)
- ClusterRoleBinding

## Конфигурация YAML

Настройки RBAC и ServiceAccount должны располагаться в отдельных ключах. Это разные
сущности. Разделение этих концепций в YAML устраняет неоднозначность и делает
конфигурацию более понятной.

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

Эту структуру можно расширить для более сложных чартов, требующих несколько
ServiceAccount.

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

## Ресурсы RBAC должны создаваться по умолчанию

Параметр `rbac.create` должен быть булевым значением, управляющим созданием ресурсов
RBAC. Значение по умолчанию должно быть `true`. Пользователи, которые хотят
управлять доступом RBAC самостоятельно, могут установить это значение в `false`
(в этом случае см. ниже).

## Использование ресурсов RBAC

В параметре `serviceAccount.name` должно быть указано имя ServiceAccount, который
будет использоваться ресурсами с контролем доступа, создаваемыми чартом. Если
`serviceAccount.create` равен true, то ServiceAccount с этим именем должен быть
создан. Если имя не указано, оно генерируется с помощью шаблона `fullname`. Если
`serviceAccount.create` равен false, то ServiceAccount не создаётся, но он всё
равно должен быть связан с теми же ресурсами, чтобы вручную созданные ресурсы RBAC,
ссылающиеся на него, работали корректно. Если `serviceAccount.create` равен false
и имя не указано, используется ServiceAccount по умолчанию.

Для ServiceAccount следует использовать следующий вспомогательный шаблон.

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
