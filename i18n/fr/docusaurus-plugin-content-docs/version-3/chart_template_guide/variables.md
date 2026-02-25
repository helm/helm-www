---
title: Variables
description: Utilisation des variables dans les templates.
sidebar_position: 8
---

Après avoir abordé les fonctions, les pipelines, les objets et les structures de contrôle, nous pouvons nous tourner vers l'un des concepts les plus fondamentaux de nombreux langages de programmation : les variables. Dans les templates, elles sont moins fréquemment utilisées. Mais nous allons voir comment les utiliser pour simplifier le code et mieux exploiter `with` et `range`.

Dans un exemple précédent, nous avons vu que ce code échouera :

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

`Release.Name` n'est pas dans la portée restreinte du bloc `with`. Une façon de contourner les problèmes de portée est d'assigner des objets à des variables qui peuvent être accédées indépendamment de la portée actuelle.

Dans les templates Helm, une variable est une référence nommée vers un autre objet. Elle suit la forme `$name`. Les variables sont assignées avec un opérateur d'assignation spécial : `:=`. Nous pouvons réécrire l'exemple ci-dessus en utilisant une variable pour `Release.Name`.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- $relname := .Release.Name -}}
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $relname }}
  {{- end }}
```

Notez qu'avant de commencer le bloc `with`, nous assignons `$relname := .Release.Name`. Maintenant, à l'intérieur du bloc `with`, la variable `$relname` pointe toujours vers le nom de la release.

L'exécution de ce code produira :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: viable-badger-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  release: viable-badger
```

Les variables sont particulièrement utiles dans les boucles `range`. Elles peuvent être utilisées sur des objets de type liste pour capturer à la fois l'index et la valeur :

```yaml
  toppings: |-
    {{- range $index, $topping := .Values.pizzaToppings }}
      {{ $index }}: {{ $topping }}
    {{- end }}

```

Notez que `range` vient en premier, puis les variables, puis l'opérateur d'assignation, et enfin la liste. Cela assignera l'index entier (à partir de zéro) à `$index` et la valeur à `$topping`. L'exécution produira :

```yaml
  toppings: |-
      0: mushrooms
      1: cheese
      2: peppers
      3: onions
```

Pour les structures de données qui ont à la fois une clé et une valeur, nous pouvons utiliser `range` pour obtenir les deux. Par exemple, nous pouvons parcourir `.Values.favorite` comme ceci :

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

Lors de la première itération, `$key` sera `drink` et `$val` sera `coffee`, et lors de la seconde, `$key` sera `food` et `$val` sera `pizza`. L'exécution du code ci-dessus générera :

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eager-rabbit-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

Les variables ne sont normalement pas « globales ». Elles sont limitées au bloc dans lequel elles sont déclarées. Plus tôt, nous avons assigné `$relname` au niveau supérieur du template. Cette variable sera dans la portée de l'ensemble du template. Mais dans notre dernier exemple, `$key` et `$val` ne seront dans la portée qu'à l'intérieur du bloc `{{ range... }}{{ end }}`.

Cependant, il existe une variable qui pointe toujours vers le contexte racine : `$`. Cela peut être très utile lorsque vous itérez dans une boucle `range` et que vous avez besoin de connaître le nom de la release du chart.

Voici un exemple illustrant cela :

```yaml
{{- range .Values.tlsSecrets }}
---
apiVersion: v1
kind: Secret
metadata:
  name: {{ .name }}
  labels:
    # De nombreux templates Helm utiliseraient `.` ci-dessous, mais cela ne fonctionnera pas,
    # cependant `$` fonctionnera ici
    app.kubernetes.io/name: {{ template "fullname" $ }}
    # Je ne peux pas référencer .Chart.Name, mais je peux faire $.Chart.Name
    helm.sh/chart: "{{ $.Chart.Name }}-{{ $.Chart.Version }}"
    app.kubernetes.io/instance: "{{ $.Release.Name }}"
    # Valeur de appVersion dans Chart.yaml
    app.kubernetes.io/version: "{{ $.Chart.AppVersion }}"
    app.kubernetes.io/managed-by: "{{ $.Release.Service }}"
type: kubernetes.io/tls
data:
  tls.crt: {{ .certificate }}
  tls.key: {{ .key }}
{{- end }}
```

Jusqu'ici, nous n'avons examiné qu'un seul template déclaré dans un seul fichier. Mais l'une des fonctionnalités puissantes du langage de template Helm est sa capacité à déclarer plusieurs templates et à les utiliser ensemble. Nous aborderons cela dans la prochaine section.
