---
title: Chart Releaser Action для автоматизации публикации чартов на GitHub Pages
description: Как использовать Chart Releaser Action для автоматической публикации чартов через GitHub Pages.
sidebar_position: 3
---

Это руководство описывает, как использовать [Chart Releaser
Action](https://github.com/marketplace/actions/helm-chart-releaser) для автоматической
публикации чартов через GitHub Pages. Chart Releaser Action — это GitHub Action,
который превращает проект GitHub в собственный репозиторий Helm-чартов с помощью
CLI-инструмента [helm/chart-releaser](https://github.com/helm/chart-releaser).

## Изменения в репозитории

Создайте Git-репозиторий в вашей организации GitHub. Вы можете назвать репозиторий
`helm-charts`, хотя допустимы и другие имена. Исходные файлы всех чартов можно
разместить в ветке `main`. Чарты должны находиться в каталоге `/charts` в корне
дерева каталогов.

Также необходима отдельная ветка `gh-pages` для публикации чартов. Изменения в этой
ветке будут автоматически создаваться Chart Releaser Action, описанным здесь.
Однако вы можете создать ветку `gh-pages` и добавить файл `README.md`, который
будет виден пользователям, посещающим страницу.

Вы можете добавить инструкции по установке чартов в `README.md` следующим образом
(замените `<alias>`, `<orgname>` и `<chart-name>`):

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

Чарты будут опубликованы на сайте с URL вида:

    https://<orgname>.github.io/helm-charts

## Рабочий процесс GitHub Actions

Создайте файл рабочего процесса GitHub Actions в ветке `main` по пути
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

Эта конфигурация использует
[@helm/chart-releaser-action](https://github.com/helm/chart-releaser-action),
чтобы превратить ваш проект GitHub в собственный репозиторий Helm-чартов.
При каждом push в ветку `main` он проверяет все чарты в проекте и при обнаружении
новой версии чарта выполняет следующие действия:

- Создаёт GitHub-релиз с именем, соответствующим версии чарта
- Добавляет артефакты Helm-чарта к релизу
- Создаёт или обновляет файл `index.yaml` с метаданными об этих релизах

Файл `index.yaml` затем размещается на GitHub Pages.

В примере выше используется Chart Releaser Action версии `v1.6.0`.
Вы можете заменить её на [последнюю доступную
версию](https://github.com/helm/chart-releaser-action/releases).

Примечание: Chart Releaser Action почти всегда используется совместно с
[Helm Testing Action](https://github.com/marketplace/actions/helm-chart-testing) и
[Kind Action](https://github.com/marketplace/actions/kind-cluster).
