---
title: Pods та PodTemplates
description: Розглядається форматування частин Pod і PodTemplate в маніфестах чартів.
sidebar_position: 6
---

У цій частині посібника з найкращих практик розглядається форматування частин Pod і PodTemplate у маніфестах чартів.

Наступний (неповний) список ресурсів використовує PodTemplates:

- Deployment
- ReplicationController
- ReplicaSet
- DaemonSet
- StatefulSet

## Образи {#images}

Образ контейнера повинен використовувати фіксований теґ або SHA образу. Він не повинен використовувати теги `latest`, `head`, `canary` або інші теґи, які призначені для "плаваючих" версій.

Образи _можуть_ бути визначені у файлі `values.yaml`, щоб спростити заміну образів.

```yaml
image: {{ .Values.redisImage | quote }}
```

Образ та теґ можуть бути визначені у файлі `values.yaml` як два окремі поля:

```yaml
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

## ImagePullPolicy

`helm create` стандартно встановлює `imagePullPolicy` на `IfNotPresent`, роблячи це у вашому `deployment.yaml`:

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

А у `values.yaml`:

```yaml
image:
  pullPolicy: IfNotPresent
```

Аналогічно, Kubernetes стандартно встановлює `imagePullPolicy` на `IfNotPresent`, якщо він зовсім не визначений. Якщо вам потрібне інше значення, просто оновіть його в `values.yaml` на потрібне значення.

## PodTemplates повинні оголошувати селектори {#podtemplates-should-declare-selectors}

Усі розділи PodTemplate повинні містити селектор. Наприклад:

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

Це хороша практика, оскільки вона встановлює звʼязок між набором і podʼом.

Але це ще важливіше для таких наборів, як Deployment. Без цього, _весь_ набір міток використовується для вибору відповідних podʼів, і це може зламатися, якщо ви використовуєте мітки, які змінюються, такі як версія або дата релізу.
