---
title: "Values"
description: "Focussur la manière dont vous devez structurer et utiliser vos valeurs."
weight: 2
---

Cette partie du guide des bonnes pratiques traite de l'utilisation des valeurs. Nous y fournissons des recommandations sur la manière dont vous devriez structurer et utiliser vos valeurs, en mettant l'accent sur la conception du fichier `values.yaml` d'un chart.

## Conventions de nommage

Les noms de variables devraient commencer par une lettre minuscule, et les mots devraient être séparés par camelcase :

Correct :

```yaml
chicken: true
chickenNoodleSoup: true
```

Incorrect :

```yaml
Chicken: true  # Les majuscules au début peuvent entrer en conflit avec les noms réservés intégrés.
chicken-noodle-soup: true # N'utilisez pas de tirets dans les noms.
```

Notez que toutes les variables intégrées de Helm commencent par une lettre majuscule pour les distinguer facilement des valeurs définies par l'utilisateur : `.Release.Name`, `.Capabilities.KubeVersion`.

## Valeurs plates ou imbriquées

YAML est un format flexible, et les valeurs peuvent être profondément imbriquées ou aplaties.

Imbriquée :

```yaml
server:
  name: nginx
  port: 80
```

Plate :

```yaml
serverName: nginx
serverPort: 80
```

Dans la plupart des cas, il est préférable de privilégier les valeurs plates plutôt qu'imbriquées. La raison en est que cela est plus simple pour les développeurs de templates et les utilisateurs.


Pour une sécurité optimale, une valeur imbriquée doit être vérifiée à chaque niveau :

```
{{ if .Values.server }}
  {{ default "none" .Values.server.name }}
{{ end }}
```

Pour chaque niveau d'imbrication, une vérification d'existence doit être effectuée. En revanche, pour une configuration plate, ces vérifications peuvent être omises, ce qui rend le template plus facile à lire et à utiliser.

```
{{ default "none" .Values.serverName }}
```

Lorsque plusieurs variables liées sont présentes et qu'au moins l'une d'elles est obligatoire, des valeurs imbriquées peuvent être utilisées pour améliorer la lisibilité.

## Clarifiez les types

Les règles de coercition des types en YAML sont parfois contre-intuitives. Par exemple, `foo: false` n'est pas la même chose que `foo: "false"`. De grands entiers comme `foo: 12345678` peuvent être convertis en notation scientifique dans certains cas.

La manière la plus simple d'éviter les erreurs de conversion de types est d'être explicite pour les chaînes de caractères, et implicite pour tout le reste. En d'autres termes, _entourez toutes les chaînes de caractères de guillemets_.

Souvent, pour éviter les problèmes de conversion d'entiers, il est avantageux de stocker vos entiers sous forme de chaînes de caractères également, et d'utiliser `{{ int $value }}` dans le template pour convertir une chaîne en entier.

Dans la plupart des cas, les tags de type explicites sont respectés, donc `foo: !!string 1234` devrait traiter `1234` comme une chaîne. _Cependant_, le parseur YAML consomme les tags, donc les données de type sont perdues après un premier parsing.

## Considérez comment les utilisateurs vont utiliser vos valeurs

Il y a trois sources potentielles de valeurs :

- Le fichier `values.yaml` d'un chart
- Un fichier de valeurs fourni par `helm install -f` ou `helm upgrade -f`
- Les valeurs passées avec l'option `--set` ou `--set-string` lors de l'exécution de `helm install` ou `helm upgrade`

Lorsque vous concevez la structure de vos valeurs, gardez à l'esprit que les utilisateurs de votre chart peuvent vouloir les remplacer via l'option `-f` ou avec l'option `--set`.

Comme `--set` est plus limité en termes d'expressivité, la première règle pour rédiger votre fichier `values.yaml` est _de faciliter le remplacement via `--set`_.

Pour cette raison, il est souvent préférable de structurer votre fichier de valeurs en utilisant des cartes (maps).

Difficile à utiliser avec `--set` :

```yaml
servers:
  - name: foo
    port: 80
  - name: bar
    port: 81
```

Ce qui précède ne peut pas être exprimé avec `--set` dans Helm `<=2.4`. Dans Helm 2.5, l'accès au port de foo est `--set servers[0].port=80`. Non seulement il est plus difficile pour l'utilisateur de le comprendre, mais cela est également sujet à des erreurs si, à un moment ultérieur, l'ordre des `servers` est modifié.

Facile à utiliser :

```yaml
servers:
  foo:
    port: 80
  bar:
    port: 81
```

L'accès au port de foo est beaucoup plus évident : `--set servers.foo.port=80`.

## Fichier `values.yaml`

Chaque propriété définie dans `values.yaml` doit être documentée. La chaîne de documentation doit commencer par le nom de la propriété qu'elle décrit, puis fournir au moins une phrase de description.

Incorrect :

```yaml
# le nom d'hôte pour le serveur web
serverHost: example
serverPort: 9191
```

Correct :

```yaml
# serverHost est le nom d'hôte pour le serveur web
serverHost: example
# serverPort est le port d'écoute HTTP pour le serveur web
serverPort: 9191
```

Commencer chaque commentaire par le nom du paramètre qu'il documente facilite la recherche de la documentation avec des outils comme `grep`, et permettra aux outils de documentation de corréler de manière fiable les chaînes de documentation avec les paramètres qu'ils décrivent.
