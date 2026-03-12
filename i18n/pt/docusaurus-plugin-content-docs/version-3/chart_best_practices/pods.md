---
title: Pods e PodTemplates
description: Discute a formatação das seções Pod e PodTemplate nos manifestos de charts.
sidebar_position: 6
---

Esta parte do guia de boas práticas discute a formatação das seções Pod e
PodTemplate nos manifestos de charts.

A seguinte lista (não exaustiva) de recursos utiliza PodTemplates:

- Deployment
- ReplicationController
- ReplicaSet
- DaemonSet
- StatefulSet

## Imagens

Uma imagem de container deve usar uma tag fixa ou o SHA da imagem. Não deve
usar as tags `latest`, `head`, `canary`, ou outras tags flutuantes.

Imagens _podem_ ser definidas no arquivo `values.yaml` para facilitar a troca
de imagens.

```yaml
image: {{ .Values.redisImage | quote }}
```

Uma imagem e uma tag _podem_ ser definidas no `values.yaml` como dois campos
separados:

```yaml
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

## ImagePullPolicy

`helm create` define a `imagePullPolicy` como `IfNotPresent` por padrão,
fazendo o seguinte no seu `deployment.yaml`:

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

E no `values.yaml`:

```yaml
image:
  pullPolicy: IfNotPresent
```

Da mesma forma, o Kubernetes assume por padrão a `imagePullPolicy` como
`IfNotPresent` se ela não for definida. Se você quiser um valor diferente de
`IfNotPresent`, simplesmente atualize o valor em `values.yaml` para o valor
desejado.

## PodTemplates Devem Declarar Selectors

Todas as seções de PodTemplate devem especificar um selector. Por exemplo:

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

Esta é uma boa prática porque torna explícita a relação entre o conjunto de
workload e o pod.

Mas isto é ainda mais importante para conjuntos como Deployment. Sem isso, o
conjunto _inteiro_ de labels é usado para selecionar pods correspondentes, e
isso pode falhar se você usar labels que mudam, como versão ou data de
lançamento.
