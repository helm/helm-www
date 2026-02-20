---
title: Dépendances
description: Couvre les bonnes pratiques pour les dépendances de chart.
sidebar_position: 4
---

Cette partie du guide des bonnes pratiques couvre les `dependencies` déclarées dans
`Chart.yaml`.

## Versions

Lorsque c'est possible, utilisez des plages de versions plutôt que de figer une version exacte. Par défaut, il est recommandé d'utiliser une correspondance au niveau du patch :

```yaml
version: ~1.2.3
```

Cela correspondra à la version `1.2.3` et à tous les patches de cette release. En d'autres termes, `~1.2.3` équivaut à `>= 1.2.3, < 1.3.0`

Pour la syntaxe complète de correspondance des versions, veuillez consulter la [documentation semver](https://github.com/Masterminds/semver#checking-version-constraints).

### Versions préliminaires

Les contraintes de version ci-dessus ne correspondent pas aux versions préliminaires (pre-release).
Par exemple, `version: ~1.2.3` correspondra à `version: ~1.2.4` mais pas à `version: ~1.2.3-1`.
La syntaxe suivante permet une correspondance pour les pre-release ainsi qu'au niveau du patch :

```yaml
version: ~1.2.3-0
```

### URLs de dépôt

Lorsque c'est possible, utilisez des URLs de dépôt en `https://`, puis en `http://` comme alternative.

Si le dépôt a été ajouté au fichier d'index des dépôts, le nom du dépôt peut être utilisé comme alias de l'URL. Utilisez `alias:` ou `@` suivi du nom du dépôt.

Les URLs de fichiers (`file://...`) sont considérées comme un "cas particulier" pour les charts qui sont assemblés par un pipeline de déploiement fixe.

Lors de l'utilisation de [plugins de téléchargement](../topics/plugins.md#downloader-plugins), le schéma d'URL sera spécifique au plugin. Notez qu'un utilisateur du chart devra avoir installé un plugin prenant en charge ce schéma pour mettre à jour ou construire la dépendance.

Si le champ `repository` est vide, Helm ne pourra pas effectuer d'opérations de gestion des dépendances. Dans ce cas, Helm supposera que la dépendance se trouve dans un sous-répertoire du dossier `charts` avec un nom identique à la propriété `name` de la dépendance.

## Conditions et Tags

Des conditions ou des tags doivent être ajoutés à toutes les dépendances qui **sont optionnelles**. Notez que par défaut, une `condition` est évaluée à `true`.

La forme préférée d'une condition est :

```yaml
condition: somechart.enabled
```

Où `somechart` est le nom du chart de la dépendance.

Lorsque plusieurs sous-charts (dépendances) fournissent ensemble une fonctionnalité optionnelle ou interchangeable, ces charts doivent partager les mêmes tags.

Par exemple, si `nginx` et `memcached` fournissent ensemble des optimisations de performance pour l'application principale du chart, et doivent être tous les deux présents lorsque cette fonctionnalité est activée, ils doivent avoir une section tags comme celle-ci :

```yaml
tags:
  - webaccelerator
```

Cela permet à l'utilisateur d'activer ou de désactiver cette fonctionnalité avec un seul tag.
