---
title: "Fonctions de Modèle et Pipelines."
description: "Utiliser des fonctions dans les modèles"
weight: 5
---

Jusqu'à présent, nous avons vu comment insérer des informations dans un modèle. Mais ces informations sont placées dans le modèle sans modification. Parfois, nous souhaitons transformer les données fournies d'une manière qui les rend plus utilisables pour nous.

Commençons par une bonne pratique : lorsque nous injectons des chaînes à partir de l'objet `.Values` dans le modèle, nous devrions entourer ces chaînes de guillemets. Nous pouvons le faire en appelant la fonction `quote` dans la directive du modèle :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ quote .Values.favorite.drink }}
  food: {{ quote .Values.favorite.food }}
```

Les fonctions de modèle suivent la syntaxe `nomDeFonction arg1 arg2...`. Dans l'extrait ci-dessus, `quote .Values.favorite.drink` appelle la fonction `quote` et lui passe un seul argument.

Helm dispose de plus de 60 fonctions disponibles. Certaines d'entre elles sont définies par le [langage de modèle Go](https://godoc.org/text/template) lui-même. La plupart des autres font partie de la [bibliothèque de modèles Sprig](https://masterminds.github.io/sprig/). Nous en verrons beaucoup au fur et à mesure de notre progression dans les exemples.

> Bien que nous parlions du "langage de modèle Helm" comme s'il était spécifique à Helm, il s'agit en réalité d'une combinaison du langage de modèle Go, de certaines fonctions supplémentaires et d'une variété d'enveloppes pour exposer certains objets aux modèles. De nombreuses ressources sur les modèles Go peuvent être utiles lors de votre apprentissage des modèles.

## Pipelines

L'une des fonctionnalités puissantes du langage de modèle est son concept de _pipelines_. S'inspirant d'un concept UNIX, les pipelines sont un outil pour enchaîner une série de commandes de modèle afin d'exprimer de manière concise une série de transformations. En d'autres termes, les pipelines constituent un moyen efficace d'effectuer plusieurs opérations en séquence. Réécrivons l'exemple ci-dessus en utilisant un pipeline.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | quote }}
```

Dans cet exemple, au lieu d'appeler `quote ARGUMENT`, nous avons inversé l'ordre. Nous avons "envoyé" l'argument à la fonction en utilisant un pipe (`|`): `.Values.favorite.drink | quote`. Grâce aux pipes, nous pouvons enchaîner plusieurs fonctions ensemble :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

> Inverser l'ordre est une pratique courante dans les templates. Vous verrez plus souvent `.val | quote` que `quote .val`. Les deux pratiques sont acceptables.

Lorsque ce template sera évalué, il produira ceci :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: trendsetting-p-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

Notez que notre `pizza` d'origine a maintenant été transformé en `"PIZZA"`.

Lors du passage des arguments de cette manière, le résultat de la première évaluation (`.Values.favorite.drink`) est envoyé comme le _dernier argument à la fonction_. Nous pouvons modifier l'exemple de boisson pour illustrer cela avec une fonction qui prend deux arguments : `repeat COUNT STRING` :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | repeat 5 | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

La fonction `repeat` va répéter la chaîne donnée le nombre de fois indiqué, donc nous obtiendrons ceci comme sortie :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: melting-porcup-configmap
data:
  myvalue: "Hello World"
  drink: "coffeecoffeecoffeecoffeecoffee"
  food: "PIZZA"
```

## Utilisation de la fonction `default`

Une fonction souvent utilisée dans les modèles est la fonction `default` : `default DEFAULT_VALUE GIVEN_VALUE`. Cette fonction vous permet de spécifier une valeur par défaut à l'intérieur du modèle, au cas où la valeur serait omise. Utilisons-la pour modifier l'exemple de boisson ci-dessus :

```yaml
drink: {{ .Values.favorite.drink | default "tea" | quote }}
```

Si nous exécutons cela normalement, nous obtiendrons notre `coffee` :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: virtuous-mink-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

Maintenant, nous allons supprimer le paramètre de boisson préférée de `values.yaml` :

```yaml
favorite:
  #drink: coffee
  food: pizza
```

Maintenant, relançons la commande `helm install --dry-run --debug fair-worm ./mychart` ce qui produira ce YAML :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fair-worm-configmap
data:
  myvalue: "Hello World"
  drink: "tea"
  food: "PIZZA"
```

Dans un véritable chart, toutes les valeurs par défaut statiques doivent résider dans le fichier `values.yaml` et ne doivent pas être répétées à l'aide de la commande `default` (sinon, elles seraient redondantes). Cependant, la commande `default` est parfaite pour les valeurs calculées, qui ne peuvent pas être déclarées dans `values.yaml`. Par exemple :

```yaml
drink: {{ .Values.favorite.drink | default (printf "%s-tea" (include "fullname" .)) }}
```

Dans certains cas, une conditionnelle `if` peut être mieux adaptée que `default`. Nous verrons cela dans la section suivante.

Les fonctions de template et les pipelines sont un moyen puissant de transformer des informations puis de les insérer dans votre YAML. Mais parfois, il est nécessaire d'ajouter une logique de template qui est un peu plus sophistiquée que simplement insérer une chaîne. Dans la section suivante, nous examinerons les structures de contrôle fournies par le langage de template.

## Utilisation de la fonction `lookup`

La fonction `lookup` peut être utilisée pour _chercher_ des ressources dans un cluster en cours d'exécution. La syntaxe de la fonction lookup est `lookup apiVersion, kind, namespace, name -> ressource ou liste de ressources`.

| paramètre  | type   |
|------------|--------|
| apiVersion | string |
| kind       | string |
| namespace  | string |
| name       | string |

À la fois `name` et `namespace` sont optionnels et peuvent être passés comme une chaîne vide (`""`).

Les combinaisons de paramètres suivantes sont possibles :

| Commandes                               | Fonction Lookup                            |
|----------------------------------------|--------------------------------------------|
| `kubectl get pod mypod -n mynamespace` | `lookup "v1" "Pod" "mynamespace" "mypod"`  |
| `kubectl get pods -n mynamespace`      | `lookup "v1" "Pod" "mynamespace" ""`       |
| `kubectl get pods --all-namespaces`    | `lookup "v1" "Pod" "" ""`                  |
| `kubectl get namespace mynamespace`    | `lookup "v1" "Namespace" "" "mynamespace"` |
| `kubectl get namespaces`               | `lookup "v1" "Namespace" "" ""`            |

Lorsque `lookup` renvoie un objet, il renvoie un dictionnaire. Ce dictionnaire peut être navigué davantage pour extraire des valeurs spécifiques.

L'exemple suivant renverra les annotations présentes pour l'objet `mynamespace` :

```go
(lookup "v1" "Namespace" "" "mynamespace").metadata.annotations
```

Lorsque `lookup` renvoie une liste d'objets, il est possible d'accéder à la liste des objets via le champ `items` :

```go
{{ range $index, $service := (lookup "v1" "Service" "mynamespace" "").items }}
    {{/* fait quelque chose avec chaque service */}}
{{ end }}
```

Lorsque aucun objet n'est trouvé, une valeur vide est renvoyée. Cela peut être utilisé pour vérifier l'existence d'un objet.

La fonction `lookup` utilise la configuration de connexion Kubernetes existante de Helm pour interroger Kubernetes. Si une erreur est renvoyée lors de l'interaction avec l'API (par exemple, en raison d'un manque de permission pour accéder à une ressource), le traitement des modèles de Helm échouera.

Gardez à l'esprit que Helm n'est pas censé contacter le serveur API Kubernetes pendant une opération `helm template|install|upgrade|delete|rollback --dry-run`. Pour tester `lookup` contre un cluster en cours d'exécution, il est conseillé d'utiliser `helm template|install|upgrade|delete|rollback --dry-run=server` afin de permettre la connexion au cluster.

## Les opérateurs sont des fonctions

Pour les modèles, les opérateurs (`eq`, `ne`, `lt`, `gt`, `and`, `or`, etc.) sont tous implémentés en tant que fonctions. Dans les pipelines, les opérations peuvent être regroupées avec des parenthèses (`(` and `)`).

Nous pouvons maintenant passer des fonctions et des pipelines au contrôle de flux avec des conditions, des boucles et des modificateurs de portée.
