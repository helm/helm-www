---
title: "Action Chart Releaser pour automatiser les charts via GitHub pages"
description: "Décrit comment utiliser l'action Chart Releaser pour automatiser la publication de charts via GitHub pages."
weight: 3
---

Ce guide décrit comment utiliser l'[Action Chart Releaser](https://github.com/marketplace/actions/helm-chart-releaser) pour automatiser la publication de charts via GitHub. L'Action Chart Releaser est un workflow GitHub Action qui transforme un projet GitHub en un dépôt de charts Helm auto-hébergé, en utilisant l'outil CLI [helm/chart-releaser](https://github.com/helm/chart-releaser).

## Modifications du dépôt 

Créez un dépôt Git dans votre organisation GitHub. Vous pouvez nommer le dépôt `helm-charts`, bien que d'autres noms soient également acceptables. Les sources de tous les charts peuvent être placées sous la branche `main`. Les charts doivent être placés sous le dossier `/charts` à la racine de l'arborescence des répertoires.

Il doit y avoir une autre branche nommée `gh-pages` pour publier les charts. Les modifications apportées à cette branche seront automatiquement créées par l'Action Chart Releaser décrite ici. Cependant, vous pouvez créer cette branche `gh-pages` et ajouter un fichier `README.md`, qui sera visible par les utilisateurs visitant la page.

Vous pouvez ajouter des instructions dans le `README.md` pour l'installation des charts comme ceci.
(remplacez `<alias>`, `<orgname>`, et `<chart-name>`):

```
## Utilisation

[Helm](https://helm.sh) doit être installé pour utiliser les charts.  
Référez-vous à la [documentation Helm](https://helm.sh/docs) pour commencer.

Une fois Helm à correctement été configuré, ajoutez le dépôt comme suit :

  helm repo add <alias> https://<orgname>.github.io/helm-charts

Si vous avez déjà ajouté ce dépôt précédemment, exécutez la commande `helm repo update` pour recevoir les dernières versions des packages. Vous pouvez également exécuter la commande `helm search repo <alias>` pour consulter les charts.

Pour installer le chart <chart-name> :

    helm install my-<chart-name> <alias>/<chart-name>

Pour désinstaller le chart :

    helm delete my-<chart-name>
```

Les charts seront publiés sur un site web avec une URL comme celle-ci :

    https://<orgname>.github.io/helm-charts

## Workflow GitHub Actions 

Créez un fichier de workflow GitHub Actions dans la branche `main` à l'emplacement `.github/workflows/release.yml`

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

La configuration ci-dessus utilise [@helm/chart-releaser-action](https://github.com/helm/chart-releaser-action) pour transformer votre projet GitHub en un dépôt de charts Helm auto-hébergé. Cela se fait - à chaque push vers `main` - en vérifiant chaque chart dans votre projet, et chaque fois qu'il y a une nouvelle version de chart, elle crée une release GitHub correspondante nommée selon la version du chart, ajoute les artefacts de chart Helm à la release, et crée ou met à jour un fichier `index.yaml` avec les métadonnées sur ces releases, qui est ensuite hébergé sur GitHub Pages.

Le numéro de version de l'Action Chart Releaser utilisé dans l'exemple ci-dessus est `v1.6.0`. Vous pouvez le changer pour la [dernière version disponible](https://github.com/helm/chart-releaser-action/releases).

Remarque : L'Action Chart Releaser est presque toujours utilisée en tandem avec l'[Action Helm Testing](https://github.com/marketplace/actions/helm-chart-testing) et l'[Action Kind](https://github.com/marketplace/actions/kind-cluster).
