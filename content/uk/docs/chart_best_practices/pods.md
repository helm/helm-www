---
title: "Pods та PodTemplates"
description: "Обговорює форматування частин Pod та PodTemplate у маніфестах Chart."
weight: 6
---

Цей розділ посібника з найкращих практик обговорює форматування частин Pod та PodTemplate у маніфестах чарту.

Наступний (неповний) список ресурсів використовує PodTemplates:

- Deployment
- ReplicationController
- ReplicaSet
- DaemonSet
- StatefulSet

## Образи {#images}

Образи контейнера повинні використовувати фіксовану мітку або SHA образу. Не слід використовувати мітки `latest`, `head`, `canary` або інші мітки, які призначені для "плаваючих" версій.

Образи _можуть_ бути визначені у файлі `values.yaml`, щоб спростити заміну образів.

```yaml
image: {{ .Values.redisImage | quote }}
```

Образи та мітка _можуть_ бути визначені в `values.yaml` як два окремих поля:

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

## PodTemplates повинні оголошувати селектори

Усі секції PodTemplate повинні вказувати селектор. Наприклад:

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

Це гарна практика, оскільки вона робить відносини між набором і pod чіткішими.

Але це ще важливіше для таких наборів, як Deployment. Без цього, _весь_ набір міток використовується для вибору відповідних pod, і це може зламатися, якщо ви використовуєте мітки, які змінюються, такі як версія або дата релізу.
