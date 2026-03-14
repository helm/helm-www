---
title: Chart Releaser Action para Automatizar Charts no GitHub Pages
description: Descreve como usar o Chart Releaser Action para automatizar a publicação de charts através do GitHub Pages.
sidebar_position: 3
---

Este guia descreve como usar o [Chart Releaser
Action](https://github.com/marketplace/actions/helm-chart-releaser) para automatizar
a publicação de charts através do GitHub Pages. O Chart Releaser Action é um workflow
do GitHub Actions para transformar um projeto do GitHub em um repositório de charts do
Helm auto-hospedado, usando a ferramenta CLI
[helm/chart-releaser](https://github.com/helm/chart-releaser).

## Alterações no Repositório

Crie um repositório Git na sua organização do GitHub. Você pode dar ao repositório
o nome `helm-charts`, embora outros nomes também sejam aceitáveis. Os arquivos fonte
de todos os charts podem ser colocados na branch `main`. Os charts devem ser colocados
no diretório `/charts` na raiz da árvore de diretórios.

Você também precisará de uma branch chamada `gh-pages` para publicar os charts. As
alterações nessa branch serão criadas automaticamente pelo Chart Releaser Action descrito aqui.
No entanto, você pode criar a branch `gh-pages` e adicionar um arquivo `README.md`,
que ficará visível para os usuários que visitarem a página.

Você pode adicionar instruções no `README.md` para instalação dos charts assim
(substitua `<alias>`, `<orgname>` e `<chart-name>`):

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

Os charts serão publicados em um site com URL assim:

    https://<orgname>.github.io/helm-charts

## Workflow do GitHub Actions

Crie o arquivo de workflow do GitHub Actions na branch `main` em
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

A configuração acima usa o
[@helm/chart-releaser-action](https://github.com/helm/chart-releaser-action) para
transformar seu projeto do GitHub em um repositório de charts do Helm auto-hospedado.
Ele faz isso — sempre que houver um push para a branch main — verificando cada chart
no seu projeto e, quando encontra uma nova versão, cria uma release correspondente no
GitHub com o nome da versão do chart, adiciona os artefatos do chart do Helm à release
e cria ou atualiza um arquivo `index.yaml` com metadados sobre essas releases, que é
então hospedado no GitHub Pages.

A versão do Chart Releaser Action usada no exemplo acima é `v1.6.0`. Você pode
alterá-la para a [versão mais recente
disponível](https://github.com/helm/chart-releaser-action/releases).

Nota: O Chart Releaser Action é quase sempre usado em conjunto com o [Helm Testing
Action](https://github.com/marketplace/actions/helm-chart-testing) e o [Kind
Action](https://github.com/marketplace/actions/kind-cluster).
