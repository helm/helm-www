---
title: Conventions générales
description: Conventions générales pour les charts.
sidebar_position: 1
---

Cette partie du guide des bonnes pratiques explique les conventions générales.

## Noms des charts

Les noms de charts doivent être composés uniquement de lettres minuscules et de chiffres.
Les mots _peuvent_ être séparés par des tirets (-) :

Exemples :

```
drupal
nginx-lego
aws-cluster-autoscaler
```

Les majuscules et les tirets bas (underscores) ne peuvent pas être utilisés dans les noms de charts.
Les points ne devraient pas être utilisés dans les noms de charts.

## Numéros de version

Dans la mesure du possible, Helm utilise [SemVer 2](https://semver.org) pour représenter
les numéros de version. (Notez que les tags d'images Docker ne suivent pas nécessairement
SemVer et sont donc considérés comme une exception regrettable à cette règle.)

Lorsque les versions SemVer sont stockées dans des labels Kubernetes, nous remplaçons
conventionnellement le caractère `+` par un caractère `_`, car les labels n'autorisent pas
le signe `+` comme valeur.

## Formatage YAML

Les fichiers YAML doivent être indentés avec _deux espaces_ (et jamais des tabulations).

## Utilisation des mots Helm et Chart

Il existe quelques conventions pour l'utilisation des mots _Helm_ et _helm_.

- _Helm_ fait référence au projet dans son ensemble
- `helm` fait référence à la commande côté client
- Le terme `chart` n'a pas besoin d'être mis en majuscule, car ce n'est pas un nom propre
- Cependant, `Chart.yaml` doit être mis en majuscule car le nom du fichier est sensible
  à la casse

En cas de doute, utilisez _Helm_ (avec un 'H' majuscule).

## Templates de chart et namespaces

Évitez de définir la propriété `namespace` dans la section `metadata` de vos templates
de chart. Le namespace à appliquer aux templates rendus doit être spécifié lors de l'appel
à un client Kubernetes via un flag comme `--namespace`. Helm rend vos templates tels quels
et les envoie au client Kubernetes, que ce soit Helm lui-même ou un autre programme
(kubectl, flux, spinnaker, etc.).
