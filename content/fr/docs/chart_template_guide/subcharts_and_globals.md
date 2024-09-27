---
title: "Sous-charts et Valeurs Globales"
description: "Interaction avec les sous-charts et les valeurs globales"
weight: 11
---

Jusqu'à présent, nous avons travaillé uniquement avec un chart. Cependant, les charts peuvent avoir des dépendances, appelées _sous-charts_, qui possèdent également leurs propres valeurs et modèles. Dans cette section, nous allons créer un sous-chart et examiner les différentes manières d'accéder aux valeurs depuis les modèles.

Avant de plonger dans le code, il y a quelques détails importants à connaître concernant les sous-charts d'application.

1. Un sous-chart est considéré comme "autonome", ce qui signifie qu'un sous-chart ne peut jamais dépendre explicitement de son chart parent.
2. Pour cette raison, un sous-chart ne peut pas accéder aux valeurs de son parent.
3. Un chart parent peut remplacer les valeurs des sous-charts.
4. Helm possède un concept de _valeurs globales_ qui peuvent être accessibles par tous les charts.

> Ces limitations ne s'appliquent pas forcément aux [charts librairies]({{< ref "/docs/topics/library_charts.md" >}}), qui sont conçus pour fournir des fonctionnalités d'assistance standardisées.

Au fur et à mesure que nous parcourrons les exemples de cette section, beaucoup de ces concepts deviendront plus clairs.

## Créer un sous-chart

Pour ces exercices, nous commencerons avec le chart `mychart/` que nous avons créé au début de ce guide, et nous ajouterons un nouveau chart à l'intérieur de celui-ci.

```console
$ cd mychart/charts
$ helm create mysubchart
Creating mysubchart
$ rm -rf mysubchart/templates/*
```

Remarquez que, comme précédemment, nous avons supprimé tous les modèles de base afin de repartir de zéro. Dans ce guide, nous nous concentrons sur le fonctionnement des modèles, et non sur la gestion des dépendances. Cependant, le [Guide des Charts]({{< ref "../topics/charts.md" >}}) contient plus d'informations sur le fonctionnement des sous-charts.

## Ajouter des valeurs et un modèle au sous-chart

Ensuite, créons un modèle simple et un fichier de valeurs pour notre chart `mysubchart`. Il devrait déjà y avoir un fichier `values.yaml` dans `mychart/charts/mysubchart`. Nous allons le configurer comme suit :

```yaml
dessert: cake
```

Ensuite, nous allons créer un nouveau modèle de ConfigMap dans `mychart/charts/mysubchart/templates/configmap.yaml` :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
```

Parce que chaque sous-chart est un _chart autonome_, nous pouvons tester `mysubchart` seul :

```console
$ helm install --generate-name --dry-run --debug mychart/charts/mysubchart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart/charts/mysubchart
NAME:   newbie-elk
TARGET NAMESPACE:   default
CHART:  mysubchart 0.1.0
MANIFEST:
---
# Source: mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: newbie-elk-cfgmap2
data:
  dessert: cake
```

## Remplacer les valeurs d'un chart parent

Notre chart d'origine, `mychart`, est maintenant le chart _parent_ de `mysubchart`. Cette relation est entièrement basée sur le fait que `mysubchart` se trouve dans `mychart/charts`.

Puisque `mychart` est un parent, nous pouvons spécifier la configuration dans `mychart` et faire en sorte que cette configuration soit transmise à `mysubchart`. Par exemple, nous pouvons modifier `mychart/values.yaml` comme suit :

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream
```

Notez les deux dernières lignes. Toutes les directives à l'intérieur de la section `mysubchart` seront envoyées au chart `mysubchart`. Ainsi, si nous exécutons `helm install --generate-name --dry-run --debug mychart`, l'une des choses que nous verrons sera le ConfigMap de `mysubchart` :

```yaml
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: unhinged-bee-cfgmap2
data:
  dessert: ice cream
```

La valeur au niveau supérieur a maintenant remplacé la valeur du sous-chart.

Il y a un détail important à noter ici. Nous n'avons pas modifié le modèle de `mychart/charts/mysubchart/templates/configmap.yaml` pour pointer vers `.Values.mysubchart.dessert`. Du point de vue de ce modèle, la valeur se trouve toujours à `.Values.dessert`. À mesure que le moteur de modèle transmet les valeurs, il définit le contexte. Ainsi, pour les modèles de `mysubchart`, seules les valeurs spécifiquement pour `mysubchart` seront disponibles dans `.Values`.

Parfois, cependant, vous souhaitez que certaines valeurs soient disponibles pour tous les modèles. Cela s'accomplit en utilisant des valeurs globales de chart.

## Valeurs Globales de Chart

Les valeurs globales sont des valeurs qui peuvent être accessibles depuis n'importe quel chart ou sous-chart sous le même nom. Les valeurs globales nécessitent une déclaration explicite. Vous ne pouvez pas utiliser un existant non-global comme s'il s'agissait d'un global.

Le type de données Values a une section réservée appelée `Values.global` où les valeurs globales peuvent être définies. Définissons-en une dans notre fichier `mychart/values.yaml`.

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream

global:
  salad: caesar
```

En raison du fonctionnement des valeurs globales, tant `mychart/templates/configmap.yaml` que `mysubchart/templates/configmap.yaml` devraient pouvoir accéder à cette valeur sous la forme `{{ .Values.global.salad }}`.

`mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  salad: {{ .Values.global.salad }}
```

`mysubchart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
  salad: {{ .Values.global.salad }}
```

Maintenant, si nous exécutons une installation en mode dry run, nous verrons la même valeur dans les deux sorties :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-configmap
data:
  salad: caesar

---
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-cfgmap2
data:
  dessert: ice cream
  salad: caesar
```

Les valeurs globales sont utiles pour transmettre des informations de cette manière, bien qu'il faille un certain planification pour s'assurer que les bons modèles sont configurés pour utiliser les valeurs globales.

## Partager des modèles avec des sous-charts

Les charts parents et les sous-charts peuvent partager des modèles. Tout bloc défini dans un chart est disponible pour les autres charts.

Par exemple, nous pouvons définir un modèle simple comme ceci :

```yaml
{{- define "labels" }}from: mychart{{ end }}
```

Rappelez-vous comment les étiquettes sur les modèles sont _partagées globalement_. Ainsi, le chart `labels` peut être inclus depuis n'importe quel autre chart.

Alors que les développeurs de charts ont le choix entre `include` et `template`, un avantage de l'utilisation de `include` est qu'il peut référencer dynamiquement des modèles :

```yaml
{{ include $mytemplate }}
```

Ce qui précède désaffichera `$mytemplate`. La fonction `template`, en revanche, n'acceptera qu'une chaîne littérale.

## Évitez d'utiliser des blocs

Le langage de template Go fournit un mot-clé `block` qui permet aux développeurs de fournir une implémentation par défaut qui peut être remplacée ultérieurement. Dans les charts Helm, les blocs ne sont pas le meilleur outil pour le remplacement, car si plusieurs implémentations du même bloc sont fournies, celle qui est sélectionnée est imprévisible.

La suggestion est d'utiliser plutôt `include`.
