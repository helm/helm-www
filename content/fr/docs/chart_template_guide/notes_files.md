---
title: "Créer un fichier NOTES.txt"
description: "Comment fournir des instructions à vos utilisateurs de Chart"
weight: 10
---

Dans cette section, nous allons examiner l'outil de Helm pour fournir des instructions à vos utilisateurs de Chart. À la fin d'une commande `helm install` ou `helm upgrade`, Helm peut imprimer un bloc d'informations utiles pour les utilisateurs. Ces informations sont hautement personnalisables à l'aide de modèles.

Pour ajouter des notes d'installation à votre chart, il vous suffit de créer un fichier `templates/NOTES.txt`. Ce fichier est un texte brut, mais il est traité comme un modèle et dispose de toutes les fonctions et objets de modèle habituels disponibles.

Créons un simple fichier `NOTES.txt` :

```
Merci d'avoir installé {{ .Chart.Name }}.

Votre nom de release est {{ .Release.Name }}.

Pour en savoir plus sur cette release, essayez :

  $ helm status {{ .Release.Name }}
  $ helm get all {{ .Release.Name }}

```

Maintenant, si nous exécutons `helm install rude-cardinal ./mychart`, nous verrons ce message en bas :

```
RESOURCES:
==> v1/Secret
NAME                   TYPE      DATA      AGE
rude-cardinal-secret   Opaque    1         0s

==> v1/ConfigMap
NAME                      DATA      AGE
rude-cardinal-configmap   3         0s


NOTES:
Merci d'avoir installé mychart.

Votre nom de release est rude-cardinal.

Pour en savoir plus sur cette release, essayez :

  $ helm status rude-cardinal
  $ helm get all rude-cardinal
```

Utiliser `NOTES.txt` de cette manière est un excellent moyen de fournir à vos utilisateurs des informations détaillées sur la façon d'utiliser leur chart nouvellement installé. La création d'un fichier `NOTES.txt` est fortement recommandée, bien qu'elle ne soit pas obligatoire.
