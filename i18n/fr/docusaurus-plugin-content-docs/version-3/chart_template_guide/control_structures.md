---
title: Structures de contrôle
description: Un aperçu rapide des structures de contrôle dans les templates.
sidebar_position: 7
---

Les structures de contrôle (appelées « actions » dans le jargon des templates) vous permettent, en tant qu'auteur de template, de contrôler le flux de génération d'un template. Le langage de template de Helm fournit les structures de contrôle suivantes :

- `if`/`else` pour créer des blocs conditionnels
- `with` pour spécifier une portée
- `range`, qui fournit une boucle de type « for each »

En plus de celles-ci, il fournit quelques actions pour déclarer et utiliser des segments de templates nommés :

- `define` déclare un nouveau template nommé à l'intérieur de votre template
- `template` importe un template nommé
- `block` déclare un type spécial de zone de template remplissable

Dans cette section, nous parlerons de `if`, `with` et `range`. Les autres sont couverts dans la section « Templates nommés » plus loin dans ce guide.

## If/Else

La première structure de contrôle que nous allons examiner sert à inclure conditionnellement des blocs de texte dans un template. Il s'agit du bloc `if`/`else`.

La structure de base d'une condition ressemble à ceci :

```
{{ if PIPELINE }}
  # Do something
{{ else if OTHER PIPELINE }}
  # Do something else
{{ else }}
  # Default case
{{ end }}
```

Remarquez que nous parlons maintenant de _pipelines_ plutôt que de valeurs. Cela permet de clarifier que les structures de contrôle peuvent exécuter un pipeline entier, pas seulement évaluer une valeur.

Un pipeline est évalué comme _false_ si la valeur est :

- un booléen false
- un zéro numérique
- une chaîne vide
- un `nil` (vide ou null)
- une collection vide (`map`, `slice`, `tuple`, `dict`, `array`)

Dans toutes les autres conditions, la condition est vraie.

Ajoutons une condition simple à notre ConfigMap. Nous ajouterons un autre paramètre si la boisson est définie sur coffee :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}mug: "true"{{ end }}
```

Puisque nous avons commenté `drink: coffee` dans notre dernier exemple, la sortie ne devrait pas inclure un indicateur `mug: "true"`. Mais si nous ajoutons cette ligne dans notre fichier `values.yaml`, la sortie devrait ressembler à ceci :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

## Contrôle des espaces blancs

En examinant les conditions, nous devrions jeter un coup d'œil rapide à la façon dont les espaces blancs sont contrôlés dans les templates. Prenons l'exemple précédent et formatons-le pour le rendre plus lisible :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
    mug: "true"
  {{ end }}
```

Initialement, cela semble correct. Mais si nous l'exécutons via le moteur de template, nous obtiendrons un résultat malheureux :

```console
$ helm install --dry-run --debug ./mychart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart
Error: YAML parse error on mychart/templates/configmap.yaml: error converting YAML to JSON: yaml: line 9: did not find expected key
```

Que s'est-il passé ? Nous avons généré du YAML incorrect à cause des espaces blancs ci-dessus.

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
    mug: "true"
```

`mug` est mal indenté. Réduisons l'indentation de cette ligne et relançons :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{ end }}
```

Lorsque nous envoyons cela, nous obtiendrons du YAML valide, mais qui a toujours l'air un peu étrange :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: telling-chimp-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"

  mug: "true"

```

Remarquez que nous avons reçu quelques lignes vides dans notre YAML. Pourquoi ? Lorsque le moteur de template s'exécute, il _supprime_ le contenu à l'intérieur de `{{` et `}}`, mais il laisse les espaces blancs restants exactement tels quels.

YAML attribue une signification aux espaces blancs, donc la gestion des espaces blancs devient assez importante. Heureusement, les templates Helm ont quelques outils pour aider.

Premièrement, la syntaxe des accolades des déclarations de template peut être modifiée avec des caractères spéciaux pour indiquer au moteur de template de supprimer les espaces blancs. `{{- ` (avec le tiret et l'espace ajoutés) indique que les espaces blancs à gauche doivent être supprimés, tandis que ` -}}` signifie que les espaces blancs à droite doivent être consommés. _Attention ! Les retours à la ligne sont des espaces blancs !_

> Assurez-vous qu'il y a un espace entre le `-` et le reste de votre directive.
> `{{- 3 }}` signifie « supprimer les espaces blancs à gauche et afficher 3 » tandis que `{{-3 }}` signifie « afficher -3 ».

En utilisant cette syntaxe, nous pouvons modifier notre template pour nous débarrasser de ces nouvelles lignes :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{- end }}
```

Juste pour clarifier ce point, ajustons ce qui précède et substituons un `*` pour chaque espace blanc qui sera supprimé selon cette règle. Un `*` à la fin de la ligne indique un caractère de nouvelle ligne qui serait supprimé

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}*
**{{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"*
**{{- end }}

```

En gardant cela à l'esprit, nous pouvons exécuter notre template via Helm et voir le résultat :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: clunky-cat-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

Soyez prudent avec les modificateurs de suppression. Il est facile de faire accidentellement des choses comme ceci :

```yaml
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" -}}
  mug: "true"
  {{- end -}}

```

Cela produira `food: "PIZZA"mug: "true"` car cela a consommé les nouvelles lignes des deux côtés.

> Pour les détails sur le contrôle des espaces blancs dans les templates, consultez la [documentation officielle de Go template](https://godoc.org/text/template)

Enfin, il est parfois plus facile d'indiquer au système de template comment indenter pour vous au lieu d'essayer de maîtriser l'espacement des directives de template. Pour cette raison, vous pouvez parfois trouver utile d'utiliser la fonction `indent` (`{{ indent 2 "mug:true" }}`).

## Modification de la portée avec `with`

La prochaine structure de contrôle à examiner est l'action `with`. Elle contrôle la portée des variables. Rappelez-vous que `.` est une référence à _la portée actuelle_. Ainsi, `.Values` indique au template de trouver l'objet `Values` dans la portée actuelle.

La syntaxe de `with` est similaire à une simple instruction `if` :

```
{{ with PIPELINE }}
  # restricted scope
{{ end }}
```

Les portées peuvent être modifiées. `with` peut vous permettre de définir la portée actuelle (`.`) sur un objet particulier. Par exemple, nous avons travaillé avec `.Values.favorite`. Réécrivons notre ConfigMap pour modifier la portée de `.` afin qu'elle pointe vers `.Values.favorite` :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
```

Notez que nous avons supprimé la condition `if` de l'exercice précédent car elle n'est plus nécessaire - le bloc après `with` ne s'exécute que si la valeur du `PIPELINE` n'est pas vide.

Remarquez que nous pouvons maintenant référencer `.drink` et `.food` sans les qualifier. C'est parce que l'instruction `with` définit `.` pour pointer vers `.Values.favorite`. Le `.` est réinitialisé à sa portée précédente après `{{ end }}`.

Mais voici une mise en garde ! À l'intérieur de la portée restreinte, vous ne pourrez pas accéder aux autres objets de la portée parente en utilisant `.`. Ceci, par exemple, échouera :

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

Cela produira une erreur car `Release.Name` n'est pas à l'intérieur de la portée restreinte pour `.`. Cependant, si nous échangeons les deux dernières lignes, tout fonctionnera comme prévu car la portée est réinitialisée après `{{ end }}`.

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  release: {{ .Release.Name }}
```

Ou, nous pouvons utiliser `$` pour accéder à l'objet `Release.Name` depuis la portée parente. `$` est mappé à la portée racine lorsque l'exécution du template commence et ne change pas pendant l'exécution du template. Ce qui suit fonctionnerait également :

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $.Release.Name }}
  {{- end }}
```

Après avoir examiné `range`, nous examinerons les variables de template, qui offrent une solution au problème de portée ci-dessus.

## Boucle avec l'action `range`

De nombreux langages de programmation prennent en charge les boucles utilisant des boucles `for`, des boucles `foreach` ou des mécanismes fonctionnels similaires. Dans le langage de template de Helm, la façon d'itérer sur une collection est d'utiliser l'opérateur `range`.

Pour commencer, ajoutons une liste de garnitures de pizza à notre fichier `values.yaml` :

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions
  - pineapple
```

Maintenant, nous avons une liste (appelée `slice` dans les templates) de `pizzaToppings`. Nous pouvons modifier notre template pour imprimer cette liste dans notre ConfigMap :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  toppings: |-
    {{- range .Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}

```

Nous pouvons utiliser `$` pour accéder à la liste `Values.pizzaToppings` depuis la portée parente. `$` est mappé à la portée racine lorsque l'exécution du template commence et ne change pas pendant l'exécution du template. Ce qui suit fonctionnerait également :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  toppings: |-
    {{- range $.Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}
  {{- end }}
```

Examinons de plus près la liste `toppings:`. La fonction `range` va « parcourir » (itérer sur) la liste `pizzaToppings`. Mais maintenant, quelque chose d'intéressant se produit. Tout comme `with` définit la portée de `.`, l'opérateur `range` fait de même. À chaque passage dans la boucle, `.` est défini sur la garniture de pizza actuelle. C'est-à-dire, la première fois, `.` est défini sur `mushrooms`. La deuxième itération, il est défini sur `cheese`, et ainsi de suite.

Nous pouvons envoyer la valeur de `.` directement dans un pipeline, donc quand nous faisons `{{ . | title | quote }}`, cela envoie `.` à `title` (fonction de mise en majuscule des titres) puis à `quote`. Si nous exécutons ce template, la sortie sera :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-dragonfly-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  toppings: |-
    - "Mushrooms"
    - "Cheese"
    - "Peppers"
    - "Onions"
    - "Pineapple"
```

Maintenant, dans cet exemple, nous avons fait quelque chose d'astucieux. La ligne `toppings: |-` déclare une chaîne multi-lignes. Donc notre liste de garnitures n'est en fait pas une liste YAML. C'est une grande chaîne. Pourquoi ferions-nous cela ? Parce que les données dans `data` d'un ConfigMap sont composées de paires clé/valeur, où la clé et la valeur sont des chaînes simples. Pour comprendre pourquoi c'est le cas, consultez la [documentation ConfigMap de Kubernetes](https://kubernetes.io/docs/concepts/configuration/configmap/). Pour nous, cependant, ce détail n'a pas beaucoup d'importance.

> Le marqueur `|-` en YAML prend une chaîne multi-lignes. Cela peut être une technique utile pour intégrer de gros blocs de données dans vos manifests, comme illustré ici.

Parfois, il est utile de pouvoir créer rapidement une liste à l'intérieur de votre template, puis d'itérer sur cette liste. Les templates Helm ont une fonction pour faciliter cela : `tuple`. En informatique, un tuple est une collection de type liste de taille fixe, mais avec des types de données arbitraires. Cela traduit approximativement la façon dont un `tuple` est utilisé.

```yaml
  sizes: |-
    {{- range tuple "small" "medium" "large" }}
    - {{ . }}
    {{- end }}
```

Ce qui précède produira ceci :

```yaml
  sizes: |-
    - small
    - medium
    - large
```

En plus des listes et des tuples, `range` peut être utilisé pour itérer sur des collections qui ont une clé et une valeur (comme un `map` ou `dict`). Nous verrons comment faire cela dans la prochaine section lorsque nous introduirons les variables de template.
