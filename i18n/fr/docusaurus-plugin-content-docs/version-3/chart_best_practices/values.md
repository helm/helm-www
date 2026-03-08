---
title: Values
description: Se concentre sur la façon de structurer et d'utiliser vos values.
sidebar_position: 2
---

Cette partie du guide des bonnes pratiques couvre l'utilisation des values. Dans cette section, nous fournissons des recommandations sur la façon de structurer et d'utiliser vos values, en mettant l'accent sur la conception du fichier `values.yaml` d'un chart.

## Conventions de nommage

Les noms de variables doivent commencer par une lettre minuscule, et les mots doivent être séparés en camelCase :

Correct :

```yaml
chicken: true
chickenNoodleSoup: true
```

Incorrect :

```yaml
Chicken: true  # les majuscules initiales peuvent entrer en conflit avec les variables intégrées
chicken-noodle-soup: true # n'utilisez pas de tirets dans le nom
```

Notez que toutes les variables intégrées de Helm commencent par une lettre majuscule pour les distinguer facilement des valeurs définies par l'utilisateur : `.Release.Name`, `.Capabilities.KubeVersion`.

## Values plates ou imbriquées

YAML est un format flexible, et les values peuvent être profondément imbriquées ou aplaties.

Imbriquées :

```yaml
server:
  name: nginx
  port: 80
```

Plates :

```yaml
serverName: nginx
serverPort: 80
```

Dans la plupart des cas, les values plates sont préférables aux values imbriquées. La raison est que c'est plus simple pour les développeurs de templates et les utilisateurs.

Pour une sécurité optimale, une value imbriquée doit être vérifiée à chaque niveau :

```
{{ if .Values.server }}
  {{ default "none" .Values.server.name }}
{{ end }}
```

Pour chaque niveau d'imbrication, une vérification d'existence doit être effectuée. Mais pour une configuration plate, ces vérifications peuvent être ignorées, rendant le template plus facile à lire et à utiliser.

```
{{ default "none" .Values.serverName }}
```

Lorsqu'il y a un grand nombre de variables liées, et qu'au moins l'une d'entre elles est obligatoire, les values imbriquées peuvent être utilisées pour améliorer la lisibilité.

## Rendre les types explicites

Les règles de conversion de type de YAML sont parfois contre-intuitives. Par exemple, `foo: false` n'est pas la même chose que `foo: "false"`. Les grands entiers comme `foo: 12345678` seront convertis en notation scientifique dans certains cas.

La façon la plus simple d'éviter les erreurs de conversion de type est d'être explicite avec les chaînes de caractères, et implicite avec tout le reste. Autrement dit, _mettez toutes les chaînes entre guillemets_.

Souvent, pour éviter les problèmes de conversion d'entiers, il est avantageux de stocker vos entiers sous forme de chaînes également, et d'utiliser `{{ int $value }}` dans le template pour convertir une chaîne en entier.

Dans la plupart des cas, les balises de type explicites sont respectées, donc `foo: !!string 1234` devrait traiter `1234` comme une chaîne. _Cependant_, le parseur YAML consomme les balises, donc les données de type sont perdues après un premier parsing.

## Considérez comment les utilisateurs utiliseront vos values

Il existe trois sources potentielles de values :

- Le fichier `values.yaml` d'un chart
- Un fichier de values fourni par `helm install -f` ou `helm upgrade -f`
- Les values passées via les options `--set` ou `--set-string` de `helm install` ou `helm upgrade`

Lors de la conception de la structure de vos values, gardez à l'esprit que les utilisateurs de votre chart peuvent vouloir les remplacer soit via l'option `-f`, soit avec l'option `--set`.

Étant donné que `--set` est plus limité en termes d'expressivité, la première règle pour écrire votre fichier `values.yaml` est de _le rendre facile à remplacer avec `--set`_.

Pour cette raison, il est souvent préférable de structurer votre fichier de values en utilisant des maps.

Difficile à utiliser avec `--set` :

```yaml
servers:
  - name: foo
    port: 80
  - name: bar
    port: 81
```

L'exemple ci-dessus ne peut pas être exprimé avec `--set` dans Helm `<=2.4`. Dans Helm 2.5, accéder au port de foo se fait avec `--set servers[0].port=80`. Non seulement c'est plus difficile à comprendre pour l'utilisateur, mais cela est aussi sujet aux erreurs si l'ordre des `servers` est modifié ultérieurement.

Facile à utiliser :

```yaml
servers:
  foo:
    port: 80
  bar:
    port: 81
```

Accéder au port de foo est beaucoup plus évident : `--set servers.foo.port=80`.

## Documenter `values.yaml`

Chaque propriété définie dans `values.yaml` devrait être documentée. La chaîne de documentation devrait commencer par le nom de la propriété qu'elle décrit, puis donner au moins une phrase de description.

Incorrect :

```yaml
# le nom d'hôte du serveur web
serverHost: example
serverPort: 9191
```

Correct :

```yaml
# serverHost est le nom d'hôte du serveur web
serverHost: example
# serverPort est le port d'écoute HTTP du serveur web
serverPort: 9191
```

Commencer chaque commentaire par le nom du paramètre qu'il documente facilite l'extraction de la documentation avec grep, et permettra aux outils de documentation de corréler de manière fiable les chaînes de documentation avec les paramètres qu'elles décrivent.
