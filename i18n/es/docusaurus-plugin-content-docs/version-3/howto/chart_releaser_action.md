---
title: "Chart Releaser Action para automatizar página GitHub de Charts"
description: "Describe como utilizar Chart Releaser Action para automatizar releasing charts a través de la páginas de GitHub."
sidebar_position: 3
---

Esta guía describe cómo utilizar [Chart Releaser
Action](https://github.com/marketplace/actions/helm-chart-releaser) para automatizar
el releasing charts a través de las páginas GitHub.  Chart Releaser Action es una GitHub Action
workflow para converitrun proyecto GitHub en un repositorio de chart de Helm autoalojados, utilizando la herramienta
[helm/chart-releaser](https://github.com/helm/chart-releaser) CLI.

## Cambios en el repositorio

Crear un repositorio Git en tu organización GitHub. Puedes dar el nombre del repositorio como `helm-charts`, aunque también son aceptables otros nombres. Las fuentes de todos los Charts pueden colocarse en la rama `main`. Los charts deben colocarse en el directorio `/charts` en el nivel superior del árbol de directorios.

Debe haber otra rama llamada `gh-pages` para publicar los charts. Los cambios en esa rama serán creados automáticamente por Chart Releaser Action como se describe a continuación. Sin embargo, puede crear esa `gh-branch` y añadir el fichero `README.md`, que será visible para los usuarios que visiten la página.

Puedes añadir instrucciones en el `README.md` para la instalación de charts de la siguiente manera
(sustituye `<alias>`, `<orgname>`, y `<chart-name>`):


## Uso

[Helm](https://helm.sh) debe estar instalado para usar los charts.  Por favor, consulte la [documentación](https://helm.sh/docs) de Helm para emprezar.

Una vez que Helm ha sido configurado correctamente, añada el repo como sigue:
```
helm repo add <alias> https://<orgname>.github.io/helm-charts
```
Si ya ha añadido este repositorio anteriormente, ejecute `helm repo update` para recuperar
las últimas versiones de los paquetes.  A continuación, puede ejecutar `helm search repo
<alias>` para ver los gráficos.

Para instalar el chart <chart-name>:
```
helm install my-<chart-name> <alias>/<chart-name>
```
Para desinstalar el chart:
```
helm uninstall my-<chart-name>
```

Los charts se publicarán en un sitio web con una URL como esta:
```
https://<orgname>.github.io/helm-charts
```

## GitHub Actions Workflow

Crear fichero de GitHub Actions workflow en la rama `main` en
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

La configuración anterior utiliza [@helm/chart-releaser-action](https://github.com/helm/chart-releaser-action) para converitr su proyecto GitHub en un repositorio de Helm chart autoalojado. Lo hace - durante cada push a main - comprobando cada chart en su proyecto, y siempre que la nueva versión de chart, crea una versión correspondiente en GitHub con el nombre de la versión del chart, añade artefactos de Helm chart al release, y crea o actualiza un fichero `index.yaml` con metadatos sobre esas releases, que luego se alojan en la páginas de GitHub.

El número de versión de la Chart Releaser Action utilizado en el ejemplo anterior es `v1.6.0`.
Puedes cambiarlo por la [última versión disponible](https://github.com/helm/chart-releaser-action/releases).

Nota: El Chart Releaser Action se utiliza casi siempre junto con [Helm Testing
Action](https://github.com/marketplace/actions/helm-chart-testing) y [Kind
Action](https://github.com/marketplace/actions/kind-cluster).
