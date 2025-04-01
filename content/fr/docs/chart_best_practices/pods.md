---
title: "Pods et PodTemplates"
description: "Formatage des parties Pod et PodTemplate dans les manifests de Chart."
weight: 6
---

Cette partie du Guide des Bonnes Pratiques discute du formatage des sections Pod et PodTemplate dans les manifests de chart.

La liste (non-exhaustive) des ressources suivantes, utilise des PodTemplates :

- Deployment
- ReplicationController
- ReplicaSet
- DaemonSet
- StatefulSet

## Images

Une image de conteneur devrait utiliser un tag fixe ou le SHA de l'image. Elle ne devrait pas utiliser les tags `latest`, `head`, `canary`, ou d'autres tags conçus pour être "flottants".


Les images _peuvent_ être définies dans le fichier `values.yaml` pour faciliter le remplacement des images.

```yaml
image: {{ .Values.redisImage | quote }}
```

Une image et un tag _peuvent_ être définie dans le fichier `values.yaml` séparé en deux champs distincts :

```yaml
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

## ImagePullPolicy

`helm create` définit par défaut la `imagePullPolicy` sur `IfNotPresent` en faisant ce qui suit dans votre `deployment.yaml` :

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

Et dans le fichier `values.yaml` :

```yaml
image:
  pullPolicy: IfNotPresent
```

De même, Kubernetes définit par défaut la `imagePullPolicy` sur `IfNotPresent` si elle n'est pas du tout définie. Si vous souhaitez une valeur autre que `IfNotPresent`, il vous suffit de mettre à jour la valeur dans `values.yaml` selon vos besoins.


## Les PodTemplates devraient déclarer des sélecteurs

Toutes les sections PodTemplate devraient spécifier un sélecteur. Par exemple :

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

C'est une bonne pratique car cela établit clairement la relation entre le set et le pod.

Mais c'est encore plus important pour des ensembles comme les Deployments. Sans cela, l'_ensemble_ des labels est utilisé pour sélectionner les pods correspondants, et cela peut échouer si vous utilisez des labels qui changent, comme la version ou la date de publication.
