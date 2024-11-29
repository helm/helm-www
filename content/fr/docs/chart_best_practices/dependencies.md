---
title: "Dépendances"
description: "Couvre les meilleures pratiques pour les dépendances des Charts."
weight: 4
---

Cette section du guide couvre les bonne pratiques pour les `dependencies` déclarées dans `Chart.yaml`.

## Versions

Dans la mesure du possible, utilisez des plages de versions au lieu d’épingler une version exacte. La valeur par défaut suggérée consiste à utiliser une correspondance de version au niveau du correctif :

```yaml
version: ~1.2.3
```

Cela correspondra à la version `1.2.3`et tous les correctifs de cette version.  Autrement dit, `~1.2.3` est équivalent à `>= 1.2.3, < 1.3.0`

Pour la syntaxe complète de correspondance de version, veuillez consulter la [documentation semver](https://github.com/Masterminds/semver#checking-version-constraints).

### Versions préliminaires

Les contraintes de version ci-dessus ne correspondront pas aux versions préliminaires. Par exemple, `version: ~1.2.3` correspondra à `version: ~1.2.4` mais pas à `version: ~1.2.3-1`. Ce qui suit permet de faire correspondre à la fois les versions préliminaires et les niveaux de correctifs :

```yaml
version: ~1.2.3-0
```

### URL de dépots

Dans la mesure du possible, utilisez des URLs de dépots en `https://`, suivie des URLs en `http://`.

Si le dépôt a été ajouté au fichier d'index des dépôts, le nom du dépôt peut être utilisé comme un alias de l'URL. Utilisez `alias:` ou `@` suivi des noms de dépôt.

Les URLs de type `file://...` sont considérées comme un "cas spécial" pour les charts qui sont assemblés par un pipeline de déploiement fixe.

Lorsque vous utilisez des [plugins de téléchargement]({{< ref "../topics/plugins#plugins-de-téléchargement" >}}), le schéma de l'URL sera spécifique au plugin. Notez qu'un utilisateur du chart devra avoir un plugin prenant en charge le schéma installé pour mettre à jour ou construire la dépendance.

Helm ne peut pas effectuer d'opérations de gestion des dépendances sur la dépendance lorsque le champ `repository` est laissé vide. Dans ce cas, Helm supposera que la dépendance se trouve dans un sous-répertoire du dossier `charts`, avec un nom identique à la propriété `name` de la dépendance.

## Conditions et Tags

Les conditions ou les tags doivent être ajoutés à toutes les dépendances qui _sont optionnelles_.

La forme préférée pour une condition est :

```yaml
condition: somechart.enabled
```

Où `somechart` est le nom d'un chart de la dépendance.

Lorsque plusieurs sous-charts (dépendances) fournissent ensemble une fonctionnalité optionnelle ou interchangeable, ces charts devraient partager les mêmes tags.

Par exemple, si à la fois `nginx` et `memcached` fournissent ensemble des optimisations de performance pour l'application principale du chart, et qu'ils doivent tous deux être présents lorsque cette fonctionnalité est activée, alors ils devraient tous les deux avoir une section de tags comme ceci :

```yaml
tags:
  - webaccelerator
```

Cela permet à un utilisateur d'activer ou de désactiver cette fonctionnalité avec un seul tag.
