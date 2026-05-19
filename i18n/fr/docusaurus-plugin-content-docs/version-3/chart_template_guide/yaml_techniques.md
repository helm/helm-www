---
title: "Annexe : Techniques YAML"
description: Un examen approfondi de la spécification YAML et de son application dans Helm.
sidebar_position: 15
---

Ce guide s'est principalement concentré sur l'écriture du langage de template. Ici,
nous allons examiner le format YAML. YAML possède des fonctionnalités utiles que nous,
en tant qu'auteurs de templates, pouvons utiliser pour rendre nos templates moins sujets aux erreurs
et plus faciles à lire.

## Scalaires et collections

Selon la [spécification YAML](https://yaml.org/spec/1.2/spec.html), il existe deux
types de collections et de nombreux types scalaires.

Les deux types de collections sont les maps et les séquences :

```yaml
map:
  one: 1
  two: 2
  three: 3

sequence:
  - one
  - two
  - three
```

Les valeurs scalaires sont des valeurs individuelles (par opposition aux collections).

### Types scalaires en YAML

Dans le dialecte YAML de Helm, le type de données scalaire d'une valeur est déterminé par un
ensemble de règles complexes, incluant le schéma Kubernetes pour les définitions de ressources.
Mais lors de l'inférence des types, les règles suivantes tendent à s'appliquer.

Si un entier ou un flottant est un mot non quoté, il est généralement traité comme
un type numérique :

```yaml
count: 1
size: 2.34
```

Mais s'ils sont entre guillemets, ils sont traités comme des chaînes :

```yaml
count: "1" # <-- chaîne, pas int
size: '2.34' # <-- chaîne, pas float
```

Il en va de même pour les booléens :

```yaml
isGood: true   # bool
answer: "true" # chaîne
```

Le mot pour une valeur vide est `null` (pas `nil`).

Notez que `port: "80"` est du YAML valide, et passera à travers le moteur de template
et l'analyseur YAML, mais échouera si Kubernetes attend que `port` soit un
entier.

Dans certains cas, vous pouvez forcer une inférence de type particulière en utilisant les balises de nœud YAML :

```yaml
coffee: "yes, please"
age: !!str 21
port: !!int "80"
```

Dans l'exemple ci-dessus, `!!str` indique à l'analyseur que `age` est une chaîne, même s'il ressemble
à un entier. Et `port` est traité comme un entier, même s'il est entre guillemets.


## Les chaînes de caractères en YAML

Une grande partie des données que nous plaçons dans les documents YAML sont des chaînes de caractères. YAML propose plus d'une
façon de représenter une chaîne. Cette section explique les différentes méthodes et montre
comment en utiliser certaines.

Il existe trois façons « en ligne » de déclarer une chaîne :

```yaml
way1: bare words
way2: "double-quoted strings"
way3: 'single-quoted strings'
```

Tous les styles en ligne doivent tenir sur une seule ligne.

- Les mots non quotés (*bare words*) ne sont pas échappés. Pour cette raison, vous devez
  faire attention aux caractères que vous utilisez.
- Les chaînes entre guillemets doubles peuvent avoir des caractères spécifiques échappés avec `\`. Par
  exemple `"\"Hello\", she said"`. Vous pouvez échapper les sauts de ligne avec `\n`.
- Les chaînes entre guillemets simples sont des chaînes « littérales » et n'utilisent pas le `\` pour échapper
  les caractères. La seule séquence d'échappement est `''`, qui est décodée comme un seul
  `'`.

En plus des chaînes sur une seule ligne, vous pouvez déclarer des chaînes multi-lignes :

```yaml
coffee: |
  Latte
  Cappuccino
  Espresso
```

L'exemple ci-dessus traitera la valeur de `coffee` comme une chaîne unique équivalente à
`Latte\nCappuccino\nEspresso\n`.

Notez que la première ligne après le `|` doit être correctement indentée. Nous pourrions
donc casser l'exemple ci-dessus en faisant ceci :

```yaml
coffee: |
         Latte
  Cappuccino
  Espresso

```

Comme `Latte` est incorrectement indenté, nous obtiendrions une erreur comme celle-ci :

```
Error parsing file: error converting YAML to JSON: yaml: line 7: did not find expected key
```

Dans les templates, il est parfois plus sûr de mettre une fausse « première ligne » de contenu dans un
document multi-lignes juste pour se protéger de l'erreur ci-dessus :

```yaml
coffee: |
  # Commented first line
         Latte
  Cappuccino
  Espresso

```

Notez que quelle que soit cette première ligne, elle sera conservée dans la sortie de la
chaîne. Donc si vous utilisez, par exemple, cette technique pour injecter le contenu d'un fichier
dans un ConfigMap, le commentaire doit être du type attendu par
ce qui lit cette entrée.

### Contrôler les espaces dans les chaînes multi-lignes

Dans l'exemple ci-dessus, nous avons utilisé `|` pour indiquer une chaîne multi-lignes. Mais remarquez
que le contenu de notre chaîne était suivi d'un `\n` final. Si nous voulons que
le processeur YAML supprime le saut de ligne final, nous pouvons ajouter un `-` après le
`|` :

```yaml
coffee: |-
  Latte
  Cappuccino
  Espresso
```

Maintenant la valeur de `coffee` sera : `Latte\nCappuccino\nEspresso` (sans `\n`
final).

D'autres fois, nous pourrions vouloir préserver tous les espaces blancs finaux. Nous pouvons le faire
avec la notation `|+` :

```yaml
coffee: |+
  Latte
  Cappuccino
  Espresso


another: value
```

Maintenant la valeur de `coffee` sera `Latte\nCappuccino\nEspresso\n\n\n`.

L'indentation à l'intérieur d'un bloc de texte est préservée, et entraîne également la préservation
des sauts de ligne :

```yaml
coffee: |-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

Dans le cas ci-dessus, `coffee` sera `Latte\n  12 oz\n  16
oz\nCappuccino\nEspresso`.

### Indentation et templates

Lors de l'écriture de templates, vous pourriez vouloir injecter le contenu d'un
fichier dans le template. Comme nous l'avons vu dans les chapitres précédents, il existe deux façons
de le faire :

- Utilisez `{{ .Files.Get "FILENAME" }}` pour obtenir le contenu d'un fichier dans le chart.
- Utilisez `{{ include "TEMPLATE" . }}` pour rendre un template et ensuite placer son
  contenu dans le chart.

Lors de l'insertion de fichiers dans du YAML, il est bon de comprendre les règles multi-lignes
ci-dessus. Souvent, la façon la plus simple d'insérer un fichier statique est de faire quelque chose
comme ceci :

```yaml
myfile: |
{{ .Files.Get "myfile.txt" | indent 2 }}
```

Notez comment nous faisons l'indentation ci-dessus : `indent 2` indique au moteur de template d'indenter
chaque ligne de « myfile.txt » avec deux espaces. Notez que nous n'indentons pas
cette ligne de template. C'est parce que si nous le faisions, le contenu du fichier de la première ligne
serait indenté deux fois.

### Chaînes multi-lignes repliées

Parfois vous voulez représenter une chaîne dans votre YAML avec plusieurs lignes, mais
vous voulez qu'elle soit traitée comme une longue ligne lors de l'interprétation. Cela s'appelle
le « repliement ». Pour déclarer un bloc replié, utilisez `>` au lieu de `|` :

```yaml
coffee: >
  Latte
  Cappuccino
  Espresso


```

La valeur de `coffee` ci-dessus sera `Latte Cappuccino Espresso\n`. Notez que tous
les sauts de ligne sauf le dernier seront convertis en espaces. Vous pouvez combiner les
contrôles d'espaces blancs avec le marqueur de texte replié, donc `>-` remplacera ou supprimera
tous les sauts de ligne.

Notez que dans la syntaxe repliée, l'indentation du texte entraînera la préservation des lignes.

```yaml
coffee: >-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

L'exemple ci-dessus produira `Latte\n  12 oz\n  16 oz\nCappuccino Espresso`. Notez que
les espaces et les sauts de ligne sont toujours présents.

## Intégrer plusieurs documents dans un seul fichier

Il est possible de placer plus d'un document YAML dans un seul fichier. Cela se fait
en préfixant un nouveau document avec `---` et en terminant le document avec
`...`

```yaml

---
document: 1
...
---
document: 2
...
```

Dans de nombreux cas, le `---` ou le `...` peuvent être omis.

Certains fichiers dans Helm ne peuvent pas contenir plus d'un document. Si, par exemple, plus d'un
document est fourni à l'intérieur d'un fichier `values.yaml`, seul le premier sera
utilisé.

Les fichiers de template, cependant, peuvent avoir plus d'un document. Lorsque c'est le cas, le
fichier (et tous ses documents) est traité comme un seul objet pendant le rendu du
template. Mais ensuite le YAML résultant est divisé en plusieurs documents avant
d'être envoyé à Kubernetes.

Nous recommandons de n'utiliser plusieurs documents par fichier que lorsque c'est absolument
nécessaire. Avoir plusieurs documents dans un fichier peut être difficile à déboguer.

## YAML est un sur-ensemble de JSON

Parce que YAML est un sur-ensemble de JSON, tout document JSON valide _devrait_ être du YAML valide.

```json
{
  "coffee": "yes, please",
  "coffees": [
    "Latte", "Cappuccino", "Espresso"
  ]
}
```

L'exemple ci-dessus est une autre façon de représenter ceci :

```yaml
coffee: yes, please
coffees:
- Latte
- Cappuccino
- Espresso
```

Et les deux peuvent être mélangés (avec précaution) :

```yaml
coffee: "yes, please"
coffees: [ "Latte", "Cappuccino", "Espresso"]
```

Ces trois exemples devraient être analysés vers la même représentation interne.

Bien que cela signifie que des fichiers comme `values.yaml` peuvent contenir des données JSON, Helm
ne traite pas l'extension de fichier `.json` comme un suffixe valide.

## Ancres YAML

La spécification YAML fournit un moyen de stocker une référence à une valeur, et plus tard de se référer
à cette valeur par référence. YAML appelle cela l'« ancrage » :

```yaml
coffee: "yes, please"
favorite: &favoriteCoffee "Cappuccino"
coffees:
  - Latte
  - *favoriteCoffee
  - Espresso
```

Dans l'exemple ci-dessus, `&favoriteCoffee` définit une référence à `Cappuccino`. Plus tard, cette
référence est utilisée comme `*favoriteCoffee`. Donc `coffees` devient `Latte, Cappuccino,
Espresso`.

Bien qu'il existe quelques cas où les ancres sont utiles, il y a un aspect qui
peut causer des bugs subtils : la première fois que le YAML est consommé, la
référence est développée puis supprimée.

Donc si nous devions décoder puis ré-encoder l'exemple ci-dessus, le YAML résultant
serait :

```yaml
coffee: yes, please
favorite: Cappuccino
coffees:
- Latte
- Cappuccino
- Espresso
```

Parce que Helm et Kubernetes lisent, modifient et réécrivent souvent les fichiers YAML, les
ancres seront perdues.
