---
title: "Variables"
description: "Utilisation des variables dans les modèles"
weight: 8
---

Avec les fonctions, pipelines, objets et structures de contrôle à notre disposition, nous pouvons aborder l'une des idées les plus basiques de nombreux langages de programmation : les variables. Dans les modèles, elles sont moins fréquemment utilisées. Cependant, nous verrons comment les utiliser pour simplifier le code et optimiser l'utilisation de `with` et `range`.

Dans un exemple précédent, nous avons vu que ce code échouera :

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

`Release.Name` n'est pas dans le scope restreint du bloc `with`. Une façon de contourner les problèmes de portée est d'assigner des objets à des variables qui peuvent être accessibles indépendamment du scope actuel.

Dans les modèles Helm, une variable est une référence nommée à un autre objet. Elle suit la forme `$name`. Les variables sont assignées avec un opérateur d'affectation spécial : `:=`. Nous pouvons réécrire l'exemple ci-dessus en utilisant une variable pour `Release.Name`.

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

Remarquez qu'avant de commencer le bloc `with`, nous assignons `$relname := .Release.Name`. Maintenant, à l'intérieur du bloc `with`, la variable `$relname` pointe toujours vers le nom de la release.

Running that will produce this:

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

Notez que `range` vient en premier, puis les variables, ensuite l'opérateur d'affectation, et enfin la liste. Cela assignera l'index entier (à partir de zéro) à `$index` et la valeur à `$topping`. L'exécution de ce code produira :

```yaml
  toppings: |-
      0: mushrooms
      1: cheese
      2: peppers
      3: onions
```

Pour les structures de données qui ont à la fois une clé et une valeur, nous pouvons utiliser `range` pour obtenir les deux. Par exemple, nous pouvons boucler sur `.Values.favorite` comme ceci :

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

Lors de la première itération, `$key` sera à `drink` et `$val` sera à `coffee` et lors de la seconde, `$key` sera à `food` et `$val` sera à `pizza`. L'exécution de ce qui précède générera ceci :

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

Les variables ne sont généralement pas "globales". Elles sont limitées au bloc dans lequel elles sont déclarées. Plus tôt, nous avons assigné `$relname` au niveau supérieur du modèle. Cette variable sera accessible dans l'ensemble du modèle. Cependant, dans notre dernier exemple, `$key` et `$val` ne seront accessibles qu'à l'intérieur du bloc `{{ range... }}{{ end }}`.

Cependant, il existe une variable qui est toujours globale - `$` - cette variable pointera toujours vers le contexte racine. Cela peut être très utile lorsque vous bouclez dans une plage et que vous avez besoin de connaître le nom de la release du chart.

Un exemple illustrant cela :
```yaml
{{- range .Values.tlsSecrets }}
apiVersion: v1
kind: Secret
metadata:
  name: {{ .name }}
  labels:
    # De nombreux modèles Helm utiliseraient `.` ci-dessous, mais cela ne fonctionnera pas, 
    # cependant, `$` fonctionnera ici
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
---
{{- end }}
```

Jusqu'à présent, nous avons examiné un seul modèle déclaré dans un seul fichier. Mais l'une des fonctionnalités puissantes du langage de modèle Helm est sa capacité à déclarer plusieurs modèles et à les utiliser ensemble. Nous nous pencherons sur cela dans la prochaine section.
