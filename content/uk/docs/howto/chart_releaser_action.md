---
title: "Chart Releaser Action для автоматизації випуску чартів на GitHub Pages"
description: "Описує, як використовувати Chart Releaser Action для автоматизації випуску чартів через GitHub Pages."
weight: 3
---

Цей посібник описує, як використовувати [Chart Releaser Action](https://github.com/marketplace/actions/helm-chart-releaser) для автоматизації випуску чартів через GitHub Pages. Chart Releaser Action — це GitHub Action workflow, який перетворює GitHub проєкт на репозиторій чартів Helm, використовуючи CLI-інструмент [helm/chart-releaser](https://github.com/helm/chart-releaser).

## Зміни в репозиторії {#repository-changes}

Створіть Git-репозиторій у вашій організації на GitHub. Ви можете назвати репозиторій `helm-charts`, хоча також прийнятні інші назви. Джерела всіх чартів можуть бути розміщені на гілці `main`. Чарти повинні бути розміщені в теці `/charts` на верхньому рівні дерева тек.

Також має бути інша гілка з назвою `gh-pages`, щоб публікувати чарти. Зміни в цій гілці будуть автоматично створюватися за допомогою Chart Releaser Action, описаного тут. Крім створення гілку `gh-pages` ви можете додати файл `README.md` до неї, який буде видимим користувачам, що відвідують сторінку.

Ви можете додати інструкції в `README.md` щодо встановлення чартів, як показано нижче (замініть `<alias>`, `<orgname>`, і `<chart-name>`):

```md
## Використання

Щоб використовувати чарти, необхідно встановити [Helm](https://helm.sh). Будь ласка, ознайомтеся з [документацією Helm](https://helm.sh/docs), щоб розпочати.

Як тільки Helm буде налаштовано правильно, додайте репозиторій наступним чином:

  helm repo add <alias> https://<orgname>.github.io/helm-charts

Якщо ви вже додавали цей репозиторій раніше, виконайте команду `helm repo update`, щоб отримати останні версії пакетів. Потім ви можете виконати `helm search repo <alias>`, щоб побачити чарти.

Щоб встановити чарт `<chart-name>`:

    helm install my-<chart-name> <alias>/<chart-name>

Щоб видалити чарт:

    helm delete my-<chart-name>
```

Чарти будуть опубліковані на вебсайті з URL-адресою типу:

    https://<orgname>.github.io/helm-charts

## GitHub Actions Workflow {#github-actions-workflow}

Створіть файл GitHub Actions workflow в гілці `main` за адресою `.github/workflows/release.yml`:

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

Наведена конфігурація використовує [@helm/chart-releaser-action](https://github.com/helm/chart-releaser-action), щоб перетворити ваш GitHub проєкт на самостійний репозиторій чартів Helm. Вона виконує це під час кожної операції push в гілку `main` шляхом перевірки кожного чарту у вашому проєкті, і коли знаходить нову версію чарту, створює відповідний реліз GitHub, додає артефакти Helm чарту до релізу і створює або оновлює файл `index.yaml` з метаданими про ці релізи, який потім хоститься на GitHub Pages.

Версія Chart Releaser Action, використана в наведеному прикладі, — `v1.6.0`. Ви можете змінити її на [останню доступну версію](https://github.com/helm/chart-releaser-action/releases).

Примітка: Chart Releaser Action майже завжди використовується в парі з [Helm Testing Action](https://github.com/marketplace/actions/helm-chart-testing) та [Kind Action](https://github.com/marketplace/actions/kind-cluster).
