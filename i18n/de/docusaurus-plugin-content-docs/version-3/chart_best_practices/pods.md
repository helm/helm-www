---
title: Pods und PodTemplates
description: Behandelt die Formatierung von Pod- und PodTemplate-Bereichen in Chart-Manifesten.
sidebar_position: 6
---

Dieser Teil des Best-Practices-Leitfadens behandelt die Formatierung von Pod- und PodTemplate-Bereichen in Chart-Manifesten.

Die folgende (nicht vollständige) Liste von Ressourcen verwendet PodTemplates:

- Deployment
- ReplicationController
- ReplicaSet
- DaemonSet
- StatefulSet

## Images

Ein Container-Image sollte einen festen Tag oder den SHA des Images verwenden. Es sollte nicht die Tags `latest`, `head`, `canary` oder andere „Floating Tags" verwenden, die auf wechselnde Versionen verweisen.

Images _können_ in der `values.yaml`-Datei definiert werden, um Images einfach auszutauschen.

```yaml
image: {{ .Values.redisImage | quote }}
```

Ein Image und ein Tag _können_ in `values.yaml` als zwei separate Felder definiert werden:

```yaml
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

## ImagePullPolicy

`helm create` setzt die `imagePullPolicy` standardmäßig auf `IfNotPresent` durch folgenden Eintrag in Ihrer `deployment.yaml`:

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

Und in `values.yaml`:

```yaml
image:
  pullPolicy: IfNotPresent
```

Ebenso setzt Kubernetes die `imagePullPolicy` standardmäßig auf `IfNotPresent`, wenn sie überhaupt nicht definiert ist. Wenn Sie einen anderen Wert als `IfNotPresent` wünschen, aktualisieren Sie einfach den Wert in `values.yaml` auf den gewünschten Wert.

## PodTemplates sollten Selektoren deklarieren

Alle PodTemplate-Bereiche sollten einen Selektor angeben. Zum Beispiel:

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

Dies ist eine gute Praxis, da sie die Beziehung zwischen Set und Pod deutlich macht.

Bei Sets wie Deployment ist dies besonders wichtig. Ohne Selektor werden _alle_ Labels verwendet, um passende Pods zu finden. Das führt zu Problemen, wenn Sie Labels verwenden, die sich ändern, wie Version oder Release-Datum.
