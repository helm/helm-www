---
title: Role-Based Access Control
description: Розглядається створення та форматування ресурсів RBAC у маніфестах чартів.
sidebar_position: 8
---

У цій частині Посібника з найкращих практик розглядається створення та форматування ресурсів RBAC у маніфестах чартів.

Ресурси RBAC це:

- ServiceAccount (обмежений простором імен)
- Role (обмежений простором імен)
- ClusterRole
- RoleBinding (обмежений простором імен)
- ClusterRoleBinding

## Конфігурація YAML {#yaml-configuration}

Конфігурація RBAC та ServiceAccount повинна здійснюватися під окремими ключами. Це окремі речі. Розділення цих двох концепцій у YAML знімає неоднозначність і робить це яснішим.

```yaml
rbac:
  # Вказує, чи повинні бути створені ресурси RBAC
  create: true

serviceAccount:
  # Вказує, чи повинен бути створений ServiceAccount
  create: true
  # Імʼя ServiceAccount для використання.
  # Якщо не вказано і create дорівнює true, імʼя генерується за допомогою шаблону fullname
  name:
```

Цю структуру можна розширити для комплексних чартів, які потребують кількох ServiceAccount.

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

## Ресурси RBAC повинні бути стандартно створені {#rbac-resources-should-be-created-by-default}

`rbac.create` має бути булевим значенням, яке контролює, чи створюються ресурси RBAC. Стандартне значення має бути `true`. Користувачі, які бажають самостійно управляти контролем доступу RBAC, можуть встановити це значення в `false` (у цьому випадку дивіться нижче).

## Using RBAC Resources

`serviceAccount.name` має бути встановлено на імʼя ServiceAccount, яке буде використовуватися доступними ресурсами, створеними чартом. Якщо `serviceAccount.create` дорівнює true, то ServiceAccount з цим імʼям має бути створено. Якщо імʼя не вказано, то імʼя генерується за допомогою шаблону `fullname`. Якщо `serviceAccount.create` дорівнює false, то ServiceAccount не створюється, але він має бути асоційований з тими ж ресурсами, щоб пізніше створені вручну ресурси RBAC, що посилаються на нього, функціонували правильно. Якщо `serviceAccount.create` дорівнює false та імʼя не вказано, то використовується стандартний ServiceAccount.

Для ServiceAccount слід використовувати наступний допоміжний шаблон.

```go
{{/*
Створення імені службового облікового запису, який буде використовуватися
*/}}
{{- define "mychart.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "mychart.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}
```
