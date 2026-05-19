---
title: Pods y PodTemplates
description: Discute el formato de las secciones Pod y PodTemplate en los manifiestos de Chart.
sidebar_position: 6
---

Esta parte de la Guía de Mejores Prácticas discute el formato de las secciones
Pod y PodTemplate en los manifiestos de chart.

La siguiente lista (no exhaustiva) de recursos utilizan PodTemplates:

- Deployment
- ReplicationController
- ReplicaSet
- DaemonSet
- StatefulSet

## Imágenes

Una imagen de contenedor debe usar un tag fijo o el SHA de la imagen. No debe
usar los tags `latest`, `head`, `canary`, u otros tags diseñados para ser
_flotantes_.

Las imágenes _pueden_ definirse en el archivo `values.yaml` para facilitar el
cambio de imágenes.

```yaml
image: {{ .Values.redisImage | quote }}
```

Una imagen y un tag _pueden_ definirse en `values.yaml` como dos campos separados:

```yaml
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

## ImagePullPolicy

`helm create` establece el `imagePullPolicy` en `IfNotPresent` por defecto
haciendo lo siguiente en su `deployment.yaml`:

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

Y en `values.yaml`:

```yaml
image:
  pullPolicy: IfNotPresent
```

De manera similar, Kubernetes establece por defecto el `imagePullPolicy` en
`IfNotPresent` si no está definido. Si desea un valor diferente a `IfNotPresent`,
simplemente actualice el valor en `values.yaml` a su valor deseado.

## Los PodTemplates Deben Declarar Selectores

Todas las secciones de PodTemplate deben especificar un selector. Por ejemplo:

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

Esta es una buena práctica porque establece claramente la relación entre el
recurso y el pod.

Pero esto es aún más importante para recursos como Deployment. Sin esto, se
utiliza el conjunto _completo_ de etiquetas para seleccionar los pods
coincidentes, y esto causará problemas si usa etiquetas que cambian, como
versión o fecha de lanzamiento.
