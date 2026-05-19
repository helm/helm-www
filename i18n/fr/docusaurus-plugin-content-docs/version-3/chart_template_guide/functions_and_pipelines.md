---
title: Fonctions de template et pipelines
description: Utilisation des fonctions dans les templates.
sidebar_position: 5
---

Jusqu'à présent, nous avons vu comment insérer des informations dans un template. Mais ces informations sont insérées sans modification. Parfois, nous voulons transformer les données fournies de manière plus exploitable.

Commençons par une bonne pratique : lorsque vous injectez des chaînes de caractères provenant de l'objet `.Values` dans le template, vous devriez les mettre entre guillemets. Vous pouvez le faire en appelant la fonction `quote` dans la directive de template :

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

Les fonctions de template suivent la syntaxe `nomFonction arg1 arg2...`. Dans l'extrait ci-dessus, `quote .Values.favorite.drink` appelle la fonction `quote` et lui passe un unique argument.

Helm dispose de plus de 60 fonctions disponibles. Certaines sont définies par le [langage de template Go](https://godoc.org/text/template) lui-même. La plupart des autres font partie de la [bibliothèque de templates Sprig](https://masterminds.github.io/sprig/). Nous en verrons plusieurs au fil des exemples.

> Même si nous parlons du « langage de template Helm » comme s'il était spécifique à Helm, il s'agit en réalité d'une combinaison du langage de template Go, de fonctions supplémentaires et de divers wrappers pour exposer certains objets aux templates. De nombreuses ressources sur les templates Go peuvent vous aider dans votre apprentissage.

## Pipelines

L'une des fonctionnalités puissantes du langage de template est son concept de _pipelines_. S'inspirant d'un concept d'UNIX, les pipelines sont un outil permettant d'enchaîner une série de commandes de template pour exprimer de manière compacte une série de transformations. Autrement dit, les pipelines sont un moyen efficace d'accomplir plusieurs choses en séquence. Réécrivons l'exemple ci-dessus en utilisant un pipeline.

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

Dans cet exemple, au lieu d'appeler `quote ARGUMENT`, nous avons inversé l'ordre. Nous avons « envoyé » l'argument à la fonction en utilisant un pipeline (`|`) : `.Values.favorite.drink | quote`. Avec les pipelines, nous pouvons enchaîner plusieurs fonctions :

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

> Inverser l'ordre est une pratique courante dans les templates. Vous verrez `.val | quote` plus souvent que `quote .val`. Les deux pratiques sont valables.

Lorsque ce template est évalué, il produira le résultat suivant :

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

Notez que notre `pizza` d'origine a été transformée en `"PIZZA"`.

Lorsque vous utilisez des arguments en pipeline de cette façon, le résultat de la première évaluation (`.Values.favorite.drink`) est envoyé comme _dernier argument de la fonction_. Nous pouvons modifier l'exemple de la boisson ci-dessus pour illustrer cela avec une fonction qui prend deux arguments : `repeat COUNT STRING` :

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

La fonction `repeat` répétera la chaîne donnée le nombre de fois spécifié, nous obtiendrons donc ce résultat :

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

Une fonction fréquemment utilisée dans les templates est la fonction `default` : `default VALEUR_PAR_DEFAUT VALEUR_DONNEE`. Cette fonction vous permet de spécifier une valeur par défaut à l'intérieur du template, au cas où la valeur serait omise. Utilisons-la pour modifier l'exemple de la boisson ci-dessus :

```yaml
drink: {{ .Values.favorite.drink | default "tea" | quote }}
```

Si nous exécutons ceci normalement, nous obtiendrons notre `coffee` :

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

Maintenant, supprimons le paramètre de boisson favorite dans `values.yaml` :

```yaml
favorite:
  #drink: coffee
  food: pizza
```

En réexécutant `helm install --dry-run --debug fair-worm ./mychart`, nous obtiendrons ce YAML :

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

Dans un vrai chart, toutes les valeurs par défaut statiques devraient se trouver dans `values.yaml` et ne devraient pas être répétées avec la commande `default` (sinon elles seraient redondantes). Cependant, la commande `default` est parfaite pour les valeurs calculées, qui ne peuvent pas être déclarées dans `values.yaml`. Par exemple :

```yaml
drink: {{ .Values.favorite.drink | default (printf "%s-tea" (include "fullname" .)) }}
```

Dans certains cas, une condition `if` peut être mieux adaptée que `default`. Nous les verrons dans la section suivante.

Les fonctions et les pipelines de template sont un moyen puissant de transformer des informations puis de les insérer dans votre YAML. Mais parfois, il est nécessaire d'ajouter une logique de template un peu plus sophistiquée que la simple insertion d'une chaîne. Dans la section suivante, nous examinerons les structures de contrôle fournies par le langage de template.

## Utilisation de la fonction `lookup`

La fonction `lookup` peut être utilisée pour _rechercher_ des ressources dans un cluster en cours d'exécution. La syntaxe de la fonction lookup est `lookup apiVersion, kind, namespace, name -> ressource ou liste de ressources`.

| paramètre  | type   |
|------------|--------|
| apiVersion | string |
| kind       | string |
| namespace  | string |
| name       | string |

`name` et `namespace` sont optionnels et peuvent être passés comme chaîne vide (`""`). Cependant, si vous travaillez avec une ressource à portée de namespace, `name` et `namespace` doivent tous deux être spécifiés.

Les combinaisons de paramètres suivantes sont possibles :

| Comportement                           | Fonction lookup                            |
|----------------------------------------|--------------------------------------------|
| `kubectl get pod mypod -n mynamespace` | `lookup "v1" "Pod" "mynamespace" "mypod"`  |
| `kubectl get pods -n mynamespace`      | `lookup "v1" "Pod" "mynamespace" ""`       |
| `kubectl get pods --all-namespaces`    | `lookup "v1" "Pod" "" ""`                  |
| `kubectl get namespace mynamespace`    | `lookup "v1" "Namespace" "" "mynamespace"` |
| `kubectl get namespaces`               | `lookup "v1" "Namespace" "" ""`            |

Lorsque `lookup` retourne un objet, il renvoie un dictionnaire. Ce dictionnaire peut être parcouru pour extraire des valeurs spécifiques.

L'exemple suivant renverra les annotations présentes pour l'objet `mynamespace` :

```go
(lookup "v1" "Namespace" "" "mynamespace").metadata.annotations
```

Lorsque `lookup` retourne une liste d'objets, il est possible d'accéder à la liste d'objets via le champ `items` :

```go
{{ range $index, $service := (lookup "v1" "Service" "mynamespace" "").items }}
    {{/* faire quelque chose avec chaque service */}}
{{ end }}
```

Lorsqu'aucun objet n'est trouvé, une valeur vide est retournée. Cela peut être utilisé pour vérifier l'existence d'un objet.

La fonction `lookup` utilise la configuration de connexion Kubernetes existante de Helm pour interroger Kubernetes. Si une erreur est retournée lors de l'interaction avec le serveur API (par exemple en raison d'un manque de permission pour accéder à une ressource), le traitement du template par Helm échouera.

Notez que Helm ne doit pas contacter le serveur API Kubernetes lors d'une opération `helm template|install|upgrade|delete|rollback --dry-run`. Pour tester `lookup` contre un cluster en cours d'exécution, utilisez plutôt `helm template|install|upgrade|delete|rollback --dry-run=server` afin de permettre la connexion au cluster.

## Les opérateurs sont des fonctions

Pour les templates, les opérateurs (`eq`, `ne`, `lt`, `gt`, `and`, `or`, etc.) sont tous implémentés comme des fonctions. Dans les pipelines, les opérations peuvent être regroupées avec des parenthèses (`(` et `)`).

Passons maintenant aux structures de contrôle : conditions, boucles et modificateurs de portée.
