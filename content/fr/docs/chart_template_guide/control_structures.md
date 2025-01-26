---
title: "Contrôle de flux"
description: "Un aperçu rapide sur la structure du flux dans les modèles"
weight: 7
---

Les structures de contrôle (appelées « actions » dans le langage des modèles) te permettent, en tant qu'auteur de modèle, de contrôler le flux de génération d'un modèle. Le langage de modèle de Helm propose les structures de contrôle suivantes :

- `if`/`else` pour créer des blocs conditionnels
- `with` pour spécifier un contexte
- `range`, qui fournit une boucle de type « pour chaque »

En plus de cela, il fournit quelques actions pour déclarer et utiliser des segments de modèle nommés :

- `define` déclare un nouveau modèle nommé à l'intérieur de votre modèle
- `template` importe un modèle nommé
- `block` déclare une sorte de zone de modèle remplissable spéciale

Dans cette section, nous parlerons de `if`, `with` et `range`. Les autres sont abordées dans la section [Modèles nommés](named_templates.md) plus loin dans ce guide.

## If/Else

La première structure de contrôle que nous allons examiner est celle permettant d'inclure conditionnellement des blocs de texte dans un modèle. Il s'agit du bloc `if`/`else` (si/sinon).

La structure de base pour une conditionnelle ressemble à ceci :

```
{{ if PIPELINE }}
  # Fais quelque chose
{{ else if OTHER PIPELINE }}
  # Fais autre chose
{{ else }}
  # Cas par défaut
{{ end }}
```

Remarque que nous parlons maintenant de _pipelines_ au lieu de valeurs. La raison en est de préciser que les structures de contrôle peuvent exécuter un pipeline entier, et pas seulement évaluer une valeur.

Un pipeline est évalué comme _faux_ si la valeur est :

- un booléen faux
- un zéro numérique
- une chaîne vide
- un `nil` (vide ou nul)
- une collection vide (`map`, `slice`, `tuple`, `dict`, `array`)

Dans toutes les autres conditions, la condition est vraie.

Ajoutons une conditionnelle simple à notre ConfigMap. Nous ajouterons un autre paramètre si la boisson est définie sur café :

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

Puisque nous avons commenté `drink: coffee` dans notre dernier exemple, la sortie ne devrait pas inclure un flag `mug: "true"`. Mais si nous ajoutons cette ligne dans notre fichier `values.yaml`, la sortie devrait ressembler à ceci :

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

## Contrôle des espaces

Tout en examinant les conditionnelles, nous devrions jeter un coup d'œil rapide à la façon dont les espaces sont contrôlés dans les modèles. Prenons l'exemple précédent et formatons-le pour le rendre un peu plus lisible :

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

Au départ, cela semble bien. Mais si nous le passons par le moteur de modèle, nous obtiendrons un mauvais résultat :

```console
$ helm install --dry-run --debug ./mychart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart
Error: YAML parse error on mychart/templates/configmap.yaml: error converting YAML to JSON: yaml: line 9: did not find expected key
```

Que s'est-il passé ? Nous avons généré un YAML incorrect en raison des espaces ci-dessus.

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

`mug` est mal indenté. Retirons simplement cette ligne de l'indentation et exécutons à nouveau :

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

Lorsque nous envoyons cela, nous obtiendrons un YAML valide, mais qui semble encore un peu étrange :

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

Remarque que nous avons reçu quelques lignes vides dans notre YAML. Pourquoi ? Lorsque le moteur de modèle s'exécute, il _supprime_ le contenu à l'intérieur de `{{` et `}}`, mais il laisse les espaces restants tels quels.

YAML attribue une signification aux espaces, donc gérer ces espaces devient assez important. Heureusement, les modèles Helm disposent de quelques outils pour aider.

Tout d'abord, la syntaxe des accolades des déclarations de modèle peut être modifiée avec des caractères spéciaux pour indiquer au moteur de modèle de supprimer les espaces. `{{- ` (avec le tiret et l'espace ajoutés) indique que les espaces blancs à gauche doivent être supprimés, tandis que ` -}}` signifie que les espaces à droite doivent être consommés. _Faites attention ! Les nouvelles lignes sont des espaces !_

> Assurez-vous qu'il y a un espace entre le `-` et le reste de votre directive.  
> `{{- 3 }}` signifie "supprimer les espaces à gauche et imprimer 3", tandis que `{{-3 }}` signifie "imprimer -3".

En utilisant cette syntaxe, nous pouvons modifier notre modèle pour supprimer ces nouvelles lignes :

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

Pour clarifier ce point, ajustons ce qui précède et substituons un `*` pour chaque espace qui sera supprimé selon cette règle. Un `*` à la fin de la ligne indique un caractère de nouvelle ligne qui serait supprimé.

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

En gardant cela à l'esprit, nous pouvons exécuter notre modèle à travers Helm et voir le résultat :

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

Faites attention aux modificateurs de suppression. Il est facile de faire accidentellement des choses comme ceci :

```yaml
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" -}}
  mug: "true"
  {{- end -}}

```

Cela produira `food: "PIZZA"mug: "true"` car il a consommé les nouvelles lignes des deux côtés.

> Pour les détails sur le contrôle des espaces dans les modèles, consultez la [documentation officielle des modèles Go](https://godoc.org/text/template).

Enfin, il est parfois plus facile de laisser le système de modèles gérer l'indentation à votre place plutôt que d'essayer de maîtriser l'espacement des directives de modèle. Pour cette raison, il peut parfois être utile d'utiliser la fonction `indent` (`{{ indent 2 "mug:true" }}` par exemple).

## Modifier le contexte en utilisant `with`.

La prochaine structure de contrôle à examiner est l'action `with`. Cela contrôle la portée des variables. Rappelons que `.` est une référence à _la portée actuelle_. Ainsi, `.Values` indique au modèle de trouver l'objet `Values` dans la portée actuelle.

La syntaxe de `with` est similaire à celle d'une simple instruction `if` :

```
{{ with PIPELINE }}
  # Portée restreinte
{{ end }}
```

Les portées peuvent être modifiées. `with` permet de définir la portée actuelle (`.`) sur un objet particulier. Par exemple, nous avons travaillé avec `.Values.favorite`. Réécrivons notre ConfigMap pour modifier la portée `.` afin de pointer vers `.Values.favorite` :

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

Note que nous avons supprimé la conditionnelle `if` de l'exercice précédent car elle n'est plus nécessaire : le bloc après `with` s'exécute uniquement si la valeur de `PIPELINE` n'est pas vide.

Remarque que maintenant nous pouvons référencer `.drink` et `.food` sans les qualifier. Cela est dû au fait que l'instruction `with` définit `.` pour pointer vers `.Values.favorite`. Le `.` est réinitialisé à sa portée précédente après `{{ end }}`.

Mais voici un avertissement ! À l'intérieur de la portée restreinte, vous ne pourrez pas accéder aux autres objets de la portée parente en utilisant `.`. Cela, par exemple, échouera :

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

Cela produira une erreur car `Release.Name` n'est pas à l'intérieur de la portée restreinte de `.`. Cependant, si nous échangeons les deux dernières lignes, tout fonctionnera comme prévu car la portée est réinitialisée après `{{ end }}`.

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  release: {{ .Release.Name }}
```

Ou, nous pouvons utiliser `$` pour accéder à l'objet `Release.Name` depuis la portée parente. `$` est mappé à la portée racine lorsque l'exécution du modèle commence et il ne change pas pendant l'exécution du modèle. Ce qui suit fonctionnerait également :

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $.Release.Name }}
  {{- end }}
```

Après avoir examiné `range`, nous allons jeter un œil aux variables de modèle, qui offrent une solution au problème de portée mentionné ci-dessus.

## Boucler avec l'action `range`.

De nombreux langages de programmation prennent en charge les boucles à l'aide de boucles `for`, `foreach` ou des mécanismes fonctionnels similaires. Dans le langage des modèles de Helm, la façon d'itérer à travers une collection est d'utiliser l'opérateur `range`.

Pour commencer, ajoutons une liste de garnitures à pizza dans notre fichier `values.yaml` :

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

Nous avons maintenant une liste (appelée `slice` dans les modèles) de `pizzaToppings`. Nous pouvons modifier notre modèle pour imprimer cette liste dans notre ConfigMap :

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
Nous pouvons utiliser `$` pour accéder à la liste `Values.pizzaToppings` depuis la portée parente. `$` est mappé à la portée racine lorsque l'exécution du modèle commence et il ne change pas pendant l'exécution du modèle. Ce qui suit fonctionnerait également :

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

Examinons de plus près la liste `toppings:`. La fonction `range` va "parcourir" (itérer) la liste `pizzaToppings`. Mais maintenant, quelque chose d'intéressant se produit. Tout comme `with` définit la portée de `.`, le fonctionnement de `range` fait de même. À chaque passage dans la boucle, `.` est défini sur la garniture de pizza actuelle. C'est-à-dire qu'à la première itération, `.` est défini sur `mushrooms`. À la deuxième itération, il est défini sur `cheese`, et ainsi de suite.

Nous pouvons envoyer la valeur de `.` directement dans un pipeline, donc lorsque nous faisons `{{ . | title | quote }}`, cela envoie `.` à `title` (fonction de mise en majuscule) puis à `quote`. Si nous exécutons ce modèle, la sortie sera :

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

Dans cet exemple, nous avons fait quelque chose de subtil. La ligne `toppings: |-` déclare une chaîne multi-lignes. Donc, notre liste de garnitures n'est en réalité pas une liste YAML. C'est une grande chaîne de caractères. Pourquoi ferions-nous cela ? Parce que les données dans les `ConfigMaps` `data` sont composées de paires clé/valeur, où la clé et la valeur sont toutes deux des chaînes simples. Pour comprendre pourquoi c'est le cas, consultez la [documentation des ConfigMaps Kubernetes](https://kubernetes.io/docs/concepts/configuration/configmap/). Pour nous, cependant, ce détail n'a pas beaucoup d'importance.

> Le marqueur `|-` en YAML prend une chaîne multi-lignes. C'est une technique utile pour intégrer de gros blocs de données à l'intérieur de vos manifests, comme illustré ici.

Parfois, il est utile de pouvoir créer rapidement une liste à l'intérieur de votre modèle, puis d'itérer sur cette liste. Les modèles Helm disposent d'une fonction pour faciliter cela : `tuple`. En informatique, un tuple est une collection de taille fixe ressemblant à une liste, mais avec des types de données arbitraires. Cela décrit en gros la façon dont un `tuple` est utilisé.

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

En plus des listes et des tuples, `range` peut être utilisé pour itérer sur des collections qui ont une clé et une valeur (comme un `map` ou un `dict`). Nous verrons comment faire cela dans la section suivante lorsque nous introduirons les variables de modèle.
