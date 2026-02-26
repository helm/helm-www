---
title: Chart Releaser Action zur Automatisierung von GitHub Pages Charts
description: Beschreibt, wie Sie die Chart Releaser Action verwenden, um die Veröffentlichung von Charts über GitHub Pages zu automatisieren.
sidebar_position: 3
---

Diese Anleitung beschreibt, wie Sie die [Chart Releaser
Action](https://github.com/marketplace/actions/helm-chart-releaser) verwenden,
um die Veröffentlichung von Charts über GitHub Pages zu automatisieren. Die Chart Releaser
Action ist ein GitHub Action Workflow, der Ihr GitHub-Projekt in ein selbst-gehostetes
Helm Chart Repository verwandelt, unter Verwendung des CLI-Werkzeugs
[helm/chart-releaser](https://github.com/helm/chart-releaser).

## Repository-Änderungen

Erstellen Sie ein Git-Repository unter Ihrer GitHub-Organisation. Sie können das
Repository beispielsweise `helm-charts` nennen, andere Namen sind aber auch möglich.
Die Quelldateien aller Charts können im `main` Branch liegen. Die Charts sollten
unter dem Verzeichnis `/charts` auf oberster Verzeichnisebene abgelegt werden.

Es sollte einen weiteren Branch namens `gh-pages` geben, um die Charts zu veröffentlichen.
Die Änderungen an diesem Branch werden automatisch von der hier beschriebenen Chart
Releaser Action erstellt. Sie können jedoch den `gh-pages` Branch erstellen und eine
`README.md` Datei hinzufügen, die für Besucher der Seite sichtbar sein wird.

Sie können in der `README.md` Installationsanweisungen für die Charts hinzufügen,
etwa so (ersetzen Sie `<alias>`, `<orgname>` und `<chart-name>`):

```
## Verwendung

[Helm](https://helm.sh) muss installiert sein, um die Charts zu verwenden.
Bitte lesen Sie die Helm [Dokumentation](https://helm.sh/docs) für den Einstieg.

Sobald Helm eingerichtet ist, fügen Sie das Repository wie folgt hinzu:

  helm repo add <alias> https://<orgname>.github.io/helm-charts

Falls Sie dieses Repository bereits früher hinzugefügt haben, führen Sie
`helm repo update` aus, um die neuesten Versionen der Pakete abzurufen.
Mit `helm search repo <alias>` können Sie dann die Charts anzeigen.

Um das <chart-name> Chart zu installieren:

    helm install my-<chart-name> <alias>/<chart-name>

Um das Chart zu deinstallieren:

    helm uninstall my-<chart-name>
```

Die Charts werden auf einer Website mit einer URL wie dieser veröffentlicht:

    https://<orgname>.github.io/helm-charts

## GitHub Actions Workflow

Erstellen Sie eine GitHub Actions Workflow-Datei im `main` Branch unter
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

Die obige Konfiguration verwendet
[@helm/chart-releaser-action](https://github.com/helm/chart-releaser-action),
um Ihr GitHub-Projekt in ein selbst-gehostetes Helm Chart Repository zu verwandeln.
Bei jedem Push auf main prüft die Action jedes Chart in Ihrem Projekt. Wenn eine
neue Chart-Version vorliegt, wird ein entsprechendes GitHub Release erstellt, das
nach der Chart-Version benannt ist. Die Helm Chart Artefakte werden dem Release
hinzugefügt und eine `index.yaml` Datei mit Metadaten über diese Releases wird
erstellt oder aktualisiert. Diese wird dann auf GitHub Pages gehostet.

Die im obigen Beispiel verwendete Versionsnummer der Chart Releaser Action ist `v1.6.0`.
Sie können diese zur [neuesten verfügbaren Version](https://github.com/helm/chart-releaser-action/releases)
ändern.

Hinweis: Die Chart Releaser Action wird fast immer zusammen mit der [Helm Testing
Action](https://github.com/marketplace/actions/helm-chart-testing) und der [Kind
Action](https://github.com/marketplace/actions/kind-cluster) verwendet.
