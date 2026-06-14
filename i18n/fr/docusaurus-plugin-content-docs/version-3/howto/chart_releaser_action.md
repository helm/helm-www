---
title: Action Chart Releaser pour automatiser les charts via GitHub Pages
description: Décrit comment utiliser l'action Chart Releaser pour automatiser la publication de charts via GitHub Pages.
sidebar_position: 3
---

Ce guide décrit comment utiliser [Chart Releaser
Action](https://github.com/marketplace/actions/helm-chart-releaser) pour
automatiser la publication de charts via GitHub Pages. Chart Releaser Action est
un workflow GitHub Action qui transforme un projet GitHub en dépôt Helm chart
auto-hébergé, en utilisant l'outil CLI
[helm/chart-releaser](https://github.com/helm/chart-releaser).

## Configuration du dépôt

Créez un dépôt Git sous votre organisation GitHub. Vous pouvez nommer le dépôt
`helm-charts`, bien que d'autres noms soient également acceptables. Les sources
de tous les charts peuvent être placées dans la branche `main`. Les charts
doivent être placés dans le répertoire `/charts` à la racine de l'arborescence.

Une autre branche nommée `gh-pages` est nécessaire pour publier les charts. Les
modifications apportées à cette branche seront automatiquement créées par
l'action Chart Releaser décrite ici. Vous pouvez cependant créer cette branche
`gh-pages` et y ajouter un fichier `README.md`, qui sera visible aux
utilisateurs qui visitent la page.

Vous pouvez ajouter des instructions dans le `README.md` pour l'installation des
charts comme ceci (remplacez `<alias>`, `<orgname>` et `<chart-name>`) :

```
## Utilisation

[Helm](https://helm.sh) doit être installé pour utiliser les charts. Veuillez
consulter la [documentation](https://helm.sh/docs) de Helm pour commencer.

Une fois Helm correctement configuré, ajoutez le dépôt comme suit :

  helm repo add <alias> https://<orgname>.github.io/helm-charts

Si vous avez déjà ajouté ce dépôt précédemment, exécutez `helm repo update` pour
récupérer les dernières versions des packages. Vous pouvez ensuite exécuter
`helm search repo <alias>` pour voir les charts disponibles.

Pour installer le chart <chart-name> :

    helm install my-<chart-name> <alias>/<chart-name>

Pour désinstaller le chart :

    helm uninstall my-<chart-name>
```

Les charts seront publiés sur un site web avec une URL comme celle-ci :

    https://<orgname>.github.io/helm-charts

## Workflow GitHub Actions

Créez un fichier de workflow GitHub Actions dans la branche `main` à l'emplacement
`.github/workflows/release.yml`

```
name: Release Charts

on:
  push:
    branches:
      - main

jobs:
  release:
    permissions:
      contents: write
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Configure Git
        run: |
          git config user.name "$GITHUB_ACTOR"
          git config user.email "$GITHUB_ACTOR@users.noreply.github.com"

      - name: Run chart-releaser
        uses: helm/chart-releaser-action@v1.6.0
        env:
          CR_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
```

La configuration ci-dessus utilise
[@helm/chart-releaser-action](https://github.com/helm/chart-releaser-action)
pour transformer votre projet GitHub en dépôt Helm chart auto-hébergé. À chaque
push sur main, l'action vérifie chaque chart de votre projet. Lorsqu'une
nouvelle version est détectée, elle crée une release GitHub correspondante
nommée d'après la version du chart, y ajoute les artefacts Helm chart, puis crée
ou met à jour un fichier `index.yaml` contenant les métadonnées de ces releases.
Ce fichier est ensuite hébergé sur GitHub Pages.

Le numéro de version de Chart Releaser Action utilisé dans l'exemple ci-dessus
est `v1.6.0`. Vous pouvez le remplacer par la [dernière version
disponible](https://github.com/helm/chart-releaser-action/releases).

Remarque : Chart Releaser Action est presque toujours utilisée conjointement avec
[Helm Testing Action](https://github.com/marketplace/actions/helm-chart-testing)
et [Kind Action](https://github.com/marketplace/actions/kind-cluster).
