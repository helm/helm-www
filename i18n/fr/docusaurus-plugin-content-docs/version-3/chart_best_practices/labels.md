---
title: Labels et annotations
description: Couvre les bonnes pratiques pour l'utilisation des labels et annotations dans votre chart.
sidebar_position: 5
---

Cette partie du guide des bonnes pratiques traite de l'utilisation des labels et
annotations dans votre chart.

## Est-ce un label ou une annotation ?

Un élément de métadonnées doit être un label dans les conditions suivantes :

- Il est utilisé par Kubernetes pour identifier cette ressource
- Il est utile de l'exposer aux opérateurs pour permettre l'interrogation du système.

Par exemple, nous suggérons d'utiliser `helm.sh/chart: NAME-VERSION` comme label afin
que les opérateurs puissent facilement trouver toutes les instances d'un chart particulier.

Si un élément de métadonnées n'est pas utilisé pour l'interrogation, il devrait être
défini comme une annotation.

Les hooks Helm sont toujours des annotations.

## Labels standards

Le tableau suivant définit les labels courants utilisés par les charts Helm. Helm lui-même
n'exige jamais qu'un label particulier soit présent. Les labels marqués REC sont
recommandés et **devraient** être placés sur un chart pour une cohérence globale.
Ceux marqués OPT sont optionnels. Ils sont idiomatiques ou couramment utilisés, mais
ne sont pas fréquemment utilisés à des fins opérationnelles.

Nom|Statut|Description
-----|------|----------
`app.kubernetes.io/name` | REC | Doit être le nom de l'application, reflétant l'application entière. Généralement `{{ template "name" . }}` est utilisé pour cela. Utilisé par de nombreux manifestes Kubernetes, non spécifique à Helm.
`helm.sh/chart` | REC | Doit être le nom et la version du chart : `{{ .Chart.Name }}-{{ .Chart.Version \| replace "+" "_" }}`.
`app.kubernetes.io/managed-by` | REC | Doit toujours être défini à `{{ .Release.Service }}`. Permet de trouver tout ce qui est géré par Helm.
`app.kubernetes.io/instance` | REC | Doit être `{{ .Release.Name }}`. Aide à différencier les différentes instances de la même application.
`app.kubernetes.io/version` | OPT | La version de l'application, peut être défini à `{{ .Chart.AppVersion }}`.
`app.kubernetes.io/component` | OPT | Un label courant pour marquer les différents rôles que les composants peuvent jouer dans une application. Par exemple, `app.kubernetes.io/component: frontend`.
`app.kubernetes.io/part-of` | OPT | Utilisé lorsque plusieurs charts ou logiciels sont combinés pour former une application. Par exemple, un logiciel applicatif et une base de données pour produire un site web. Peut être défini sur l'application principale prise en charge.

Pour plus d'informations sur les labels Kubernetes préfixés par `app.kubernetes.io`,
consultez la [documentation Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/).
