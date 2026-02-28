---
title: Pod и PodTemplate
description: Рекомендации по форматированию секций Pod и PodTemplate в манифестах чартов.
sidebar_position: 6
---

Эта часть руководства по лучшим практикам посвящена форматированию секций Pod и
PodTemplate в манифестах чартов.

Следующий (неполный) список ресурсов использует PodTemplate:

- Deployment
- ReplicationController
- ReplicaSet
- DaemonSet
- StatefulSet

## Образы

Образ контейнера должен использовать фиксированный тег или SHA образа. Не следует
использовать теги `latest`, `head`, `canary` или другие теги, которые являются
«плавающими».

Образы _могут_ быть определены в файле `values.yaml` для удобной замены образов.

```yaml
image: {{ .Values.redisImage | quote }}
```

Образ и тег _могут_ быть определены в `values.yaml` как два отдельных поля:

```yaml
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

## ImagePullPolicy

Команда `helm create` устанавливает `imagePullPolicy` в значение `IfNotPresent`
по умолчанию, добавляя следующее в ваш `deployment.yaml`:

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

И в `values.yaml`:

```yaml
image:
  pullPolicy: IfNotPresent
```

Аналогично, Kubernetes устанавливает `imagePullPolicy` в значение `IfNotPresent`
по умолчанию, если оно не задано вообще. Если вам нужно значение, отличное от
`IfNotPresent`, просто обновите значение в `values.yaml` на желаемое.

## Секции PodTemplate должны объявлять селекторы

Все секции PodTemplate должны указывать селектор. Например:

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

Это хорошая практика, поскольку она явно определяет связь между набором и Pod.

Но это ещё более важно для таких ресурсов, как Deployment. Без этого для выбора
соответствующих Pod будет использоваться _весь_ набор меток, что приведёт к сбоям,
если вы используете метки, которые изменяются, например версию или дату релиза.
