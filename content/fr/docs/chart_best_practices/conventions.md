---
title: "Conventions Générales"
description: "Conventions générales pour les charts."
weight: 1
---

Cette partie du Guide des Bonnes Pratiques présente les conventions générales

## Nommages des Charts

Les noms de charts doivent être constitués de lettres minuscules et de chiffres. Les mots _peuvent_ être séparés par des tirets (-) :

Exemples :

```
drupal
nginx-lego
aws-cluster-autoscaler
```

Ni les majuscules ni les traits de soulignement ne peuvent être utilisés dans les noms de charts. Les points ne doivent pas être utilisés dans les noms de charts.

## Numérotation de Version

Dans la mesure du possible, Helm utilise [SemVer 2](https://semver.org) pour représenter les numéros de version. (Notez que les tags des images Docker ne suivent pas nécessairement SemVer et et sont donc considérées comme une malheureuse exception à la règle.)

Quand les versions SemVer sont stockées dans les labels Kubernetes, nous remplaçons conventionnellement le caractère `+` par un `_` car les labels n'autorisent pas le signe `+` comme valeur.

## Formatage YAML

Les fichiers YAML doivent être indentés en utilisant _deux espaces_ (et non avec des tabulations).

## Utilisation des mots Helm et Chart

Il existe  plusieurs conventions pour utiliser les mots _Helm_ et _helm_.

- _Helm_ fait référence au projet dans son ensemble
- `helm` fait référence à la commande côté client
- Le terme `chart` n'a pas besoin d'être majuscule, car ce n'est pas un nom propre
- Cependant, `Chart.yaml` doit être en majuscule car le nom du fichier est sensible à la casse

En cas de doute, utilisez _Helm_ (avec un 'H' majuscule).
