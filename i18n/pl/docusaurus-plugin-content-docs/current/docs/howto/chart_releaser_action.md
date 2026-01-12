---
title: Chart Releaser Action do automatyzacji publikowania chartów na GitHub Pages
description: Opisuje, jak użyć Chart Releaser Action do automatycznego wydawania chartów za pomocą GitHub Pages.
sidebar_position: 3
---

Ten przewodnik opisuje, jak użyć [Chart Releaser Action](https://github.com/marketplace/actions/helm-chart-releaser)
do automatyzacji publikowania chartów za pomocą
GitHub Pages. Chart Releaser Action to workflow GitHub Actions, który pozwala
przekształcić projekt na GitHubie w samodzielnie hostowane repozytorium chartów Helm, z
wykorzystaniem narzędzia CLI [helm/chart-releaser](https://github.com/helm/chart-releaser).

## Zmiany w repozytorium {#repository-changes}

Utwórz repozytorium Git w ramach swojej organizacji
GitHub. Repozytorium może nazywać się `helm-charts`, choć
dopuszczalne są również inne nazwy. Źródła wszystkich chartów
można umieścić w gałęzi `main`. Charty powinny znajdować się w
katalogu `/charts` na najwyższym poziomie struktury katalogów.

Należy utworzyć dodatkową gałąź o nazwie `gh-pages`, służącą do publikowania
chartów. Zmiany w tej gałęzi będą automatycznie tworzone przez opisaną tutaj
akcję Chart Releaser Action. Możesz jednak samodzielnie utworzyć gałąź `gh-pages` i dodać
plik `README.md`, który będzie widoczny dla użytkowników odwiedzających stronę.

Możesz dodać w pliku `README.md` instrukcję instalacji chartów w taki
sposób (zastąp `<alias>`, `<orgname>`, i `<chart-name>` odpowiednimi wartościami):

```
## Usage

[Helm](https://helm.sh) must be installed to use the charts.  Please refer to
Helm's [documentation](https://helm.sh/docs) to get started.

Once Helm has been set up correctly, add the repo as follows:

  helm repo add <alias> https://<orgname>.github.io/helm-charts

If you had already added this repo earlier, run `helm repo update` to retrieve
the latest versions of the packages.  You can then run `helm search repo
<alias>` to see the charts.

To install the <chart-name> chart:

    helm install my-<chart-name> <alias>/<chart-name>

To uninstall the chart:

    helm uninstall my-<chart-name>
```

Charty zostaną opublikowane na stronie internetowej pod adresem URL w następującej formie:

    https://<orgname>.github.io/helm-charts

## GitHub Actions Workflow {#github-actions-workflow}

Utwórz plik workflow GitHub Actions w gałęzi
`main` pod ścieżką `.github/workflows/release.yml`

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

Powyższa konfiguracja wykorzystuje
[@helm/chart-releaser-action](https://github.com/helm/chart-releaser-action) do przekształcenia
projektu GitHub w samodzielnie hostowane repozytorium chartów Helm.
Podczas każdego pushu do gałęzi main akcja sprawdza wszystkie charty
w projekcie, a gdy wykryje nową wersję charta, tworzy odpowiedni
release na GitHubie nazwany zgodnie z wersją charta, dodaje artefakty Helm
do tego release’u oraz tworzy lub aktualizuje plik
`index.yaml` z metadanymi. Plik ten jest następnie publikowany za pomocą GitHub Pages.

W powyższym przykładzie użyto wersji `v1.6.0` Chart
Releaser Action. Możesz zmienić ją na
[najnowszą dostępną wersję](https://github.com/helm/chart-releaser-action/releases).

Uwaga: Chart Releaser Action jest niemal zawsze używana razem z
[Helm Testing Action](https://github.com/marketplace/actions/helm-chart-testing) oraz
[Kind Action](https://github.com/marketplace/actions/kind-cluster).
