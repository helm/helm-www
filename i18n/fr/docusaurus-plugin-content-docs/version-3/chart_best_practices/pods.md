---
title: Pods et PodTemplates
description: Bonnes pratiques pour le formatage des sections Pod et PodTemplate dans les manifestes de chart.
sidebar_position: 6
---

Cette partie du guide des bonnes pratiques aborde le formatage des sections Pod et
PodTemplate dans les manifestes de chart.

La liste suivante (non exhaustive) de ressources utilise des PodTemplates :

- Deployment
- ReplicationController
- ReplicaSet
- DaemonSet
- StatefulSet

## Images

Une image de conteneur doit utiliser un tag fixe ou le SHA de l'image. Elle ne doit pas
utiliser les tags `latest`, `head`, `canary`, ou d'autres tags conçus pour être
« flottants ».

Les images _peuvent_ être définies dans le fichier `values.yaml` pour faciliter le
remplacement des images.

```yaml
image: {{ .Values.redisImage | quote }}
```

Une image et un tag _peuvent_ être définis dans `values.yaml` comme deux champs séparés :

```yaml
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

## ImagePullPolicy

`helm create` définit `imagePullPolicy` sur `IfNotPresent` par défaut en ajoutant
ce qui suit dans votre `deployment.yaml` :

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

Et dans `values.yaml` :

```yaml
image:
  pullPolicy: IfNotPresent
```

De la même façon, Kubernetes définit par défaut `imagePullPolicy` sur `IfNotPresent` s'il
n'est pas défini du tout. Si vous souhaitez une valeur autre que `IfNotPresent`, modifiez
simplement la valeur dans `values.yaml` pour la valeur souhaitée.

## Les PodTemplates doivent déclarer des sélecteurs

Toutes les sections PodTemplate doivent spécifier un sélecteur. Par exemple :

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

C'est une bonne pratique car elle établit clairement la relation entre l'ensemble et
le pod.

Mais cela est encore plus important pour les ressources comme Deployment. Sans cela,
_l'ensemble complet_ des labels est utilisé pour sélectionner les pods correspondants,
ce qui peut poser problème si vous utilisez des labels qui changent, comme la version
ou la date de release.
