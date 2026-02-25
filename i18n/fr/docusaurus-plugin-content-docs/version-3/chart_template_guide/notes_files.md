---
title: Créer un fichier NOTES.txt
description: Comment fournir des instructions aux utilisateurs de votre Chart.
sidebar_position: 10
---

Dans cette section, nous allons examiner l'outil Helm permettant de fournir des instructions aux utilisateurs de votre chart. À la fin d'un `helm install` ou d'un `helm upgrade`, Helm peut afficher un bloc d'informations utiles pour les utilisateurs. Ces informations sont entièrement personnalisables à l'aide des templates.

Pour ajouter des notes d'installation à votre chart, créez simplement un fichier `templates/NOTES.txt`. Ce fichier est en texte brut, mais il est traité comme un template et a accès à toutes les fonctions et objets de template habituels.

Créons un simple fichier `NOTES.txt` :

```
Thank you for installing {{ .Chart.Name }}.

Your release is named {{ .Release.Name }}.

To learn more about the release, try:

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
Thank you for installing mychart.

Your release is named rude-cardinal.

To learn more about the release, try:

  $ helm status rude-cardinal
  $ helm get all rude-cardinal
```

Utiliser `NOTES.txt` de cette manière est un excellent moyen de fournir à vos utilisateurs des informations détaillées sur l'utilisation de leur chart nouvellement installé. La création d'un fichier `NOTES.txt` est fortement recommandée, même si elle n'est pas obligatoire.
