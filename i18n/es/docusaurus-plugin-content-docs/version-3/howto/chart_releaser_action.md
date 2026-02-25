---
title: "Chart Releaser Action para automatizar la publicación de Charts en GitHub Pages"
description: "Describe cómo utilizar Chart Releaser Action para automatizar la publicación de charts a través de GitHub Pages."
sidebar_position: 3
---

Esta guía describe cómo utilizar [Chart Releaser
Action](https://github.com/marketplace/actions/helm-chart-releaser) para automatizar
la publicación de charts a través de GitHub Pages. Chart Releaser Action es un workflow
de GitHub Action para convertir un proyecto de GitHub en un repositorio de Helm charts
autoalojado, utilizando la herramienta CLI
[helm/chart-releaser](https://github.com/helm/chart-releaser).

## Cambios en el Repositorio

Cree un repositorio Git en su organización de GitHub. Puede nombrar el repositorio
como `helm-charts`, aunque otros nombres también son aceptables. El código fuente
de todos los charts puede colocarse en la rama `main`. Los charts deben ubicarse
en el directorio `/charts` en el nivel superior del árbol de directorios.

Debe existir otra rama llamada `gh-pages` para publicar los charts. Los cambios en
esa rama serán creados automáticamente por Chart Releaser Action como se describe
aquí. Sin embargo, puede crear esa rama `gh-pages` y añadir un archivo `README.md`,
que será visible para los usuarios que visiten la página.

Puede añadir instrucciones en el `README.md` para la instalación de charts de la
siguiente manera (reemplace `<alias>`, `<orgname>` y `<chart-name>`):

```
## Uso

[Helm](https://helm.sh) debe estar instalado para usar los charts. Consulte la
[documentación](https://helm.sh/docs) de Helm para comenzar.

Una vez que Helm esté configurado correctamente, añada el repositorio de la siguiente manera:

  helm repo add <alias> https://<orgname>.github.io/helm-charts

Si ya añadió este repositorio anteriormente, ejecute `helm repo update` para obtener
las últimas versiones de los paquetes. Luego puede ejecutar `helm search repo
<alias>` para ver los charts.

Para instalar el chart <chart-name>:

    helm install my-<chart-name> <alias>/<chart-name>

Para desinstalar el chart:

    helm uninstall my-<chart-name>
```

Los charts se publicarán en un sitio web con una URL como esta:

    https://<orgname>.github.io/helm-charts

## GitHub Actions Workflow

Cree un archivo de workflow de GitHub Actions en la rama `main` en
`.github/workflows/release.yml`

```yaml
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

La configuración anterior utiliza
[@helm/chart-releaser-action](https://github.com/helm/chart-releaser-action) para
convertir su proyecto de GitHub en un repositorio de Helm charts autoalojado. Esto
funciona de la siguiente manera: durante cada push a main, verifica cada chart en
su proyecto y, cuando hay una nueva versión de chart, crea un release de GitHub
correspondiente con el nombre de la versión del chart, añade los artefactos del
Helm chart al release, y crea o actualiza un archivo `index.yaml` con metadatos
sobre esos releases, que luego se alojan en GitHub Pages.

La versión de Chart Releaser Action utilizada en el ejemplo anterior es `v1.6.0`.
Puede cambiarla por la [última versión
disponible](https://github.com/helm/chart-releaser-action/releases).

Nota: Chart Releaser Action se utiliza casi siempre junto con [Helm Testing
Action](https://github.com/marketplace/actions/helm-chart-testing) y [Kind
Action](https://github.com/marketplace/actions/kind-cluster).
