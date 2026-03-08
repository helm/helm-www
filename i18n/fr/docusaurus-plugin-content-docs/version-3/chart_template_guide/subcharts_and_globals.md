---
title: Sous-charts et Valeurs Globales
description: Interaction avec les valeurs d'un sous-chart et les valeurs globales.
sidebar_position: 11
---

Jusqu'à présent, nous avons travaillé uniquement avec un seul chart. Cependant, les charts peuvent avoir des dépendances, appelées _sous-charts_, qui possèdent également leurs propres valeurs et templates. Dans cette section, nous allons créer un sous-chart et découvrir les différentes façons d'accéder aux valeurs depuis les templates.

Avant de plonger dans le code, voici quelques détails importants à connaître sur les sous-charts d'application.

1. Un sous-chart est considéré comme « autonome », ce qui signifie qu'il ne peut jamais dépendre explicitement de son chart parent.
2. Pour cette raison, un sous-chart ne peut pas accéder aux valeurs de son chart parent.
3. Un chart parent peut remplacer les valeurs des sous-charts.
4. Helm dispose d'un concept de _valeurs globales_ accessibles par tous les charts.

> Ces limitations ne s'appliquent pas nécessairement aux [charts de bibliothèque](/topics/library_charts.md), qui sont conçus pour fournir des fonctionnalités d'aide standardisées.

Au fil des exemples de cette section, ces concepts deviendront plus clairs.

## Création d'un Sous-chart

Pour ces exercices, nous partirons du chart `mychart/` que nous avons créé au début de ce guide, et nous ajouterons un nouveau chart à l'intérieur.

```console
$ cd mychart/charts
$ helm create mysubchart
Creating mysubchart
$ rm -rf mysubchart/templates/*
```

Remarquez que, comme précédemment, nous avons supprimé tous les templates de base afin de repartir de zéro. Dans ce guide, nous nous concentrons sur le fonctionnement des templates, et non sur la gestion des dépendances. Cependant, le [Guide des Charts](/topics/charts.md) contient plus d'informations sur le fonctionnement des sous-charts.

## Ajout de Valeurs et d'un Template au Sous-chart

Ensuite, créons un simple template et un fichier values pour notre chart `mysubchart`. Un fichier `values.yaml` devrait déjà exister dans `mychart/charts/mysubchart`. Configurons-le ainsi :

```yaml
dessert: cake
```

Ensuite, nous allons créer un nouveau template ConfigMap dans `mychart/charts/mysubchart/templates/configmap.yaml` :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
```

Comme chaque sous-chart est un _chart autonome_, nous pouvons tester `mysubchart` indépendamment :

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

## Remplacement des Valeurs depuis un Chart Parent

Notre chart original, `mychart`, est maintenant le _chart parent_ de `mysubchart`. Cette relation est entièrement basée sur le fait que `mysubchart` se trouve dans `mychart/charts`.

Puisque `mychart` est un parent, nous pouvons spécifier une configuration dans `mychart` et la propager dans `mysubchart`. Par exemple, nous pouvons modifier `mychart/values.yaml` ainsi :

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

Notez les deux dernières lignes. Toute directive à l'intérieur de la section `mysubchart` sera envoyée au chart `mysubchart`. Donc, si nous exécutons `helm install --generate-name --dry-run --debug mychart`, l'une des choses que nous verrons est le ConfigMap de `mysubchart` :

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

Il y a un détail important à noter ici. Nous n'avons pas modifié le template de `mychart/charts/mysubchart/templates/configmap.yaml` pour pointer vers `.Values.mysubchart.dessert`. Du point de vue de ce template, la valeur se trouve toujours à `.Values.dessert`. Lorsque le moteur de templates transmet les valeurs, il définit la portée. Ainsi, pour les templates de `mysubchart`, seules les valeurs spécifiquement destinées à `mysubchart` seront disponibles dans `.Values`.

Parfois, cependant, vous souhaitez que certaines valeurs soient disponibles pour tous les templates. Cela s'accomplit en utilisant les valeurs globales de chart.

## Valeurs Globales de Chart

Les valeurs globales sont des valeurs accessibles depuis n'importe quel chart ou sous-chart avec exactement le même nom. Les valeurs globales nécessitent une déclaration explicite. Vous ne pouvez pas utiliser une valeur non globale existante comme si elle était globale.

Le type de données Values possède une section réservée appelée `Values.global` où les valeurs globales peuvent être définies. Définissons-en une dans notre fichier `mychart/values.yaml`.

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

Grâce au fonctionnement des valeurs globales, `mychart/templates/configmap.yaml` et `mysubchart/templates/configmap.yaml` devraient pouvoir accéder à cette valeur via `{{ .Values.global.salad }}`.

`mychart/templates/configmap.yaml` :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  salad: {{ .Values.global.salad }}
```

`mysubchart/templates/configmap.yaml` :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
  salad: {{ .Values.global.salad }}
```

Maintenant, si nous effectuons une installation dry-run, nous verrons la même valeur dans les deux sorties :

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

Les valeurs globales sont utiles pour transmettre ce type d'information, bien qu'elles nécessitent une certaine planification pour s'assurer que les bons templates sont configurés pour les utiliser.

## Partage de Templates avec les Sous-charts

Les charts parents et les sous-charts peuvent partager des templates. Tout bloc défini dans n'importe quel chart est disponible pour les autres charts.

Par exemple, nous pouvons définir un simple template comme ceci :

```yaml
{{- define "labels" }}from: mychart{{ end }}
```

Rappelez-vous que les labels sur les templates sont _partagés globalement_. Ainsi, le chart `labels` peut être inclus depuis n'importe quel autre chart.

Bien que les développeurs de charts aient le choix entre `include` et `template`, un avantage d'utiliser `include` est que `include` peut référencer dynamiquement des templates :

```yaml
{{ include $mytemplate }}
```

L'exemple ci-dessus déréférencera `$mytemplate`. La fonction `template`, en revanche, n'accepte qu'une chaîne littérale.

## Éviter l'Utilisation des Blocs

Le langage de template Go fournit un mot-clé `block` qui permet aux développeurs de fournir une implémentation par défaut qui sera remplacée ultérieurement. Dans les charts Helm, les blocs ne sont pas le meilleur outil pour le remplacement car si plusieurs implémentations du même bloc sont fournies, celle sélectionnée est imprévisible.

Nous recommandons d'utiliser `include` à la place.
