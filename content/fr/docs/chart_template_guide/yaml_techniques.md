---
title: "Annexe : Techniques YAML"
description: "Un examen plus approfondi de la spécification YAML et de son application à Helm"
weight: 15
---

La plupart de ce guide s'est concentrée sur l'écriture du langage de modèle. Ici, nous allons examiner le format YAML. YAML possède certaines fonctionnalités utiles que nous, en tant qu'auteurs de modèles, pouvons utiliser pour rendre nos modèles moins sujets aux erreurs et plus faciles à lire.

## Scalaires et Collections

Selon la [spécification YAML](https://yaml.org/spec/1.2/spec.html), il existe deux types de collections et de nombreux types scalaires.

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

### Types Scalaires en YAML

Dans le dialecte YAML de Helm, le type de données scalaire d'une valeur est déterminé par un ensemble complexe de règles, y compris le schéma Kubernetes pour les définitions de ressources. Mais lors de l'inférence des types, les règles suivantes tendent à être vraies.

Si un entier ou un flottant est non cité, il est généralement traité comme un type numérique :

```yaml
count: 1
size: 2.34
```

Mais s'ils sont cités, ils sont traités comme des chaînes de caractères :

```yaml
count: "1" # <-- chaîne, pas un entier
size: '2.34' # <-- chaîne, pas un floattant
```

Il en va de même pour les booléens :

```yaml
isGood: true   # booléen
answer: "true" # chaîne
```

Le mot pour une valeur vide est `null` (et non `nil`).

Notez que `port: "80"` est un YAML valide et passera à travers à la fois le moteur de modèles et le parseur YAML, mais échouera si Kubernetes s'attend à ce que `port` soit un entier.

Dans certains cas, vous pouvez forcer une inférence de type particulière en utilisant des tags de nœud YAML :

```yaml
coffee: "yes, please"
age: !!str 21
port: !!int "80"
```

Dans ce qui précède, `!!str` indique au parseur que `age` est une chaîne, même s'il ressemble à un entier. Et `port` est traité comme un entier, même s'il est cité.


## Les Chaînes en YAML

Une grande partie des données que nous plaçons dans les documents YAML sont des chaînes. YAML a plus d'une manière de représenter une chaîne. Cette section explique les différentes façons et démontre comment les utiliser.

Il existe trois manières "en ligne" de déclarer une chaîne :

```yaml
way1: bare words
way2: "double-quoted strings"
way3: 'single-quoted strings'
```

Tous les styles en ligne doivent être sur une seule ligne.

- Les mots non cités ne sont pas entre guillemets et ne sont pas échappés. Pour cette raison, vous devez faire attention aux caractères que vous utilisez.
- Les chaînes entre guillemets doubles peuvent avoir des caractères spécifiques échappés avec `\`. Par exemple, `"\"Bonjour\", a-t-elle dit"`. Vous pouvez échapper les retours à la ligne avec `\n`.
- Les chaînes entre guillemets simples sont des chaînes "littérales" et n'utilisent pas le `\` pour échapper les caractères. La seule séquence d'échappement est `''`, qui est décodée comme un seul `'`.

En plus des chaînes sur une seule ligne, vous pouvez déclarer des chaînes multilignes :

```yaml
coffee: |
  Latte
  Cappuccino
  Espresso
```

Cela traitera la valeur de `coffee` comme une seule chaîne équivalente à `Latte\nCappuccino\nEspresso\n`.

Notez que la première ligne après le `|` doit être correctement indentée. Donc, nous pourrions casser l'exemple ci-dessus en procédant ainsi :

```yaml
coffee: |
         Latte
  Cappuccino
  Espresso

```

Parce que `Latte` est mal indenté, nous obtiendrions une erreur comme ceci :

```
Error parsing file: error converting YAML to JSON: yaml: line 7: did not find expected key
```

Dans les modèles, il est parfois plus sûr d'inclure une "première ligne" fictive de contenu dans un document multi-lignes juste pour se protéger contre l'erreur ci-dessus :

```yaml
coffee: |
  # Commented first line
         Latte
  Cappuccino
  Espresso

```

Notez que quelle que soit cette première ligne, elle sera préservée dans la sortie de la chaîne. Ainsi, si vous utilisez cette technique pour injecter le contenu d'un fichier dans un ConfigMap, le commentaire doit être du type attendu par le lecteur de cette entrée.

### Contrôle des Espaces dans les Chaînes Multi-Lignes

Dans l'exemple ci-dessus, nous avons utilisé `|` pour indiquer une chaîne multi-lignes. Mais notez que le contenu de notre chaîne était suivi d'un `\n` à la fin. Si nous voulons que le processeur YAML supprime le saut de ligne à la fin, nous pouvons ajouter un `-` après le `|` :

```yaml
coffee: |-
  Latte
  Cappuccino
  Espresso
```

Maintenant, la valeur de `coffee` sera : `Latte\nCappuccino\nEspresso` (sans le saut de ligne final `\n`).

D'autres fois, nous pourrions vouloir que tous les espaces blancs à la fin soient préservés. Nous pouvons le faire avec la notation `|+` :

```yaml
coffee: |+
  Latte
  Cappuccino
  Espresso


another: value
```

Maintenant, la valeur de `coffee` sera `Latte\nCappuccino\nEspresso\n\n\n`.

L'indentation à l'intérieur d'un bloc de texte est préservée, ce qui entraîne également la préservation des sauts de ligne.

```yaml
coffee: |-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

Dans le cas ci-dessus, `coffee` sera `Latte\n  12 oz\n  16 oz\nCappuccino\nEspresso`.

### Indentation et Templates

Lors de l'écriture de templates, vous pourriez vouloir injecter le contenu d'un fichier dans le template. Comme nous l'avons vu dans les chapitres précédents, il existe deux façons de le faire :

- Utilisez `{{ .Files.Get "NOM_DU_FICHIER" }}` pour obtenir le contenu d'un fichier dans le chart.
- Utilisez `{{ include "TEMPLATE" . }}` pour rendre un template et ensuite placer son contenu dans le chart.

Lors de l'insertion de fichiers dans du YAML, il est bon de comprendre les règles des chaînes multi-lignes mentionnées ci-dessus. Souvent, la manière la plus simple d'insérer un fichier statique est de faire quelque chose comme ceci :

```yaml
myfile: |
{{ .Files.Get "myfile.txt" | indent 2 }}
```

Notez comment nous effectuons l'indentation ci-dessus : `indent 2` indique au moteur de template d'indiquer chaque ligne de "myfile.txt" avec deux espaces. Remarquez que nous n'indiquons pas cette ligne de template. Si nous le faisions, le contenu du fichier de la première ligne serait indenté deux fois.

### Chaînes multi-lignes pliées

Parfois, vous souhaitez représenter une chaîne dans votre YAML avec plusieurs lignes, mais vous voulez qu'elle soit traitée comme une longue ligne lorsqu'elle est interprétée. Cela s'appelle le "pliage". Pour déclarer un bloc plié, utilisez `>` au lieu de `|` :

```yaml
coffee: >
  Latte
  Cappuccino
  Espresso


```

La valeur de `coffee` ci-dessus sera `Latte Cappuccino Espresso\n`. Notez que toutes les nouvelles lignes sauf la dernière seront converties en espaces. Vous pouvez combiner les contrôles d'espacement avec le marqueur de texte plié, donc `>-` remplacera ou supprimera toutes les nouvelles lignes.

Notez qu'avec la syntaxe pliée, l'indentation du texte entraînera la préservation des lignes.

```yaml
coffee: >-
  Latte
    12 oz
    16 oz
  Cappuccino
  Espresso
```

Ce qui précède produira `Latte\n  12 oz\n  16 oz\nCappuccino Espresso`. Notez que les espaces et les sauts de ligne sont toujours présents.

## Incorporer Plusieurs Documents dans un Seul Fichier.

Il est possible d'insérer plus d'un document YAML dans un seul fichier. Cela se fait en préfixant un nouveau document avec `---` et en terminant le document par `...`.

```yaml

---
document: 1
...
---
document: 2
...
```

Dans de nombreux cas, il est possible d'omettre soit le `---`, soit le `...`.

Certains fichiers dans Helm ne peuvent pas contenir plus d'un document. Par exemple, si plusieurs documents sont fournis dans un fichier `values.yaml`, seul le premier sera utilisé.

Les fichiers de modèle, en revanche, peuvent contenir plus d'un document. Dans ce cas, le fichier (et tous ses documents) est traité comme un seul objet lors du rendu du modèle. Cependant, le YAML résultant est ensuite divisé en plusieurs documents avant d'être transmis à Kubernetes.

Nous recommandons d'utiliser plusieurs documents par fichier uniquement lorsque cela est absolument nécessaire. Avoir plusieurs documents dans un fichier peut rendre le débogage difficile.

## YAML est un sur-ensemble de JSON.

Parce que YAML est un sur-ensemble de JSON, tout document JSON valide _devrait_ être un YAML valide.

```json
{
  "coffee": "yes, please",
  "coffees": [
    "Latte", "Cappuccino", "Espresso"
  ]
}
```

Ce qui précède est une autre façon de représenter cela :

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

Ces trois éléments devraient tous être analysés en la même représentation interne.

Bien que cela signifie que des fichiers tels que `values.yaml` puissent contenir des données JSON, Helm ne considère pas l'extension de fichier `.json` comme un suffixe valide.

## Ancrages YAML

La spécification YAML fournit un moyen de stocker une référence à une valeur, puis de faire référence à cette valeur par référence. YAML appelle cela "ancrage" :

```yaml
coffee: "yes, please"
favorite: &favoriteCoffee "Cappuccino"
coffees:
  - Latte
  - *favoriteCoffee
  - Espresso
```

Dans ce qui précède, `&favoriteCoffee` définit une référence à `Cappuccino`. Plus tard, cette référence est utilisée sous la forme `*favoriteCoffee`. Ainsi, `coffees` devient `Latte, Cappuccino, Espresso`.

Bien qu'il existe quelques cas où les ancrages sont utiles, il y a un aspect qui peut causer des bogues subtils : la première fois que le YAML est consommé, la référence est développée puis rejetée.

Ainsi, si nous devions décoder puis réencoder l'exemple ci-dessus, le YAML résultant serait :

```yaml
coffee: yes, please
favorite: Cappuccino
coffees:
- Latte
- Cappuccino
- Espresso
```

Parce que Helm et Kubernetes lisent souvent, modifient puis réécrivent des fichiers YAML, les ancrages seront perdus.