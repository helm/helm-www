---
title: "Labels et Annotations"
description: "Couvre les bonnes pratiques pour l'utilisation des labels et des annotations dans votre Chart."
weight: 5
---

Cette partie du Guide des Bonnes Pratiques discute des meilleures pratiques pour l'utilisation des labels et des annotations dans votre chart.

## Est-ce un Label ou une Annotation ?

Un élément de métadonnées doit être un label dans les conditions suivantes :

- Il est utilisé par Kubernetes pour identifier cette ressource.
- Il est utile de l'exposer aux opérateurs pour interroger le système.

Par exemple, nous suggérons d'utiliser `helm.sh/chart: NAME-VERSION` comme label afin que les opérateurs puissent facilement trouver toutes les instances d'un chart particulier à utiliser.

Si un élément de métadonnées n'est pas utilisé pour les requêtes, il doit être défini comme une annotation à la place.

Les hooks de Helm sont toujours des annotations.

## Labels standards

Le tableau suivant définit les labels couramment utilisés dans les charts Helm. Helm ne requiert jamais la présence d'un label particulier. Les labels marqués REC sont recommandés et _devraient_ être placés sur un chart pour une cohérence globale. Ceux marqués OPT sont optionnels. Ils sont idiomatiques ou couramment utilisés, mais ne sont pas souvent indispensables à des fins opérationnelles.

Nom | Statut | Description  
----- | ------ | ----------  
`app.kubernetes.io/name` | REC | Ce label doit correspondre au nom de l'application, reflétant l'ensemble de l'application. Habituellement, `{{ template "name" . }}` est utilisé pour cela. Ce label est utilisé par de nombreux manifests Kubernetes et n'est pas spécifique à Helm.  
`helm.sh/chart` | REC | Ce label doit contenir le nom du chart et la version : `{{ .Chart.Name }}-{{ .Chart.Version \| replace "+" "_" }}`.  
`app.kubernetes.io/managed-by` | REC | Ce label doit toujours être défini sur `{{ .Release.Service }}`. Il permet de trouver tous les éléments gérés par Helm.  
`app.kubernetes.io/instance` | REC | Ce label doit correspondre à `{{ .Release.Name }}`. Il aide à différencier les différentes instances de la même application.  
`app.kubernetes.io/version` | OPT | La version de l'application, qui peut être définie sur `{{ .Chart.AppVersion }}`.  
`app.kubernetes.io/component` | OPT | Ce label est couramment utilisé pour marquer les différents rôles que peuvent jouer les éléments d'une application. Par exemple, `app.kubernetes.io/component: frontend`.  
`app.kubernetes.io/part-of` | OPT | Utilisé lorsque plusieurs charts ou éléments logiciels sont utilisés ensemble pour créer une application. Par exemple, un logiciel applicatif et une base de données pour produire un site web. Ce label peut être défini pour l'application principale soutenue.

Vous pouvez trouver plus d'informations sur les labels Kubernetes, les prefix en `app.kubernetes.io`, dans la [documentation Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/).
