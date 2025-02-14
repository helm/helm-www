---
title: "Приклади"
description: "Приклади різних функцій Helm SDK"
weight: 2
---

Цей документ містить серію прикладів використання Helm SDK. Призначений для документування різних функціональних можливостей SDK.

Останній приклад показує драйвер `main.go` ([посилання](#driver)). Він виконує наведені нижче дії та включає необхідні допоміжні функції.

Код для прикладів знаходиться в директорії [helm/helm-www/sdkexamples/](https://github.com/helm/helm-www/tree/main/sdkexamples). І він повністю функціональний.

## Дії {#actions}

### Встановлення (Install) {#install-action}

Цей приклад встановлює вказаний чарт/реліз для вказаної версії та значень:

{{< highlightexamplego file="sdkexamples/install.go" >}}

### Оновлення (Upgrade) {#upgrade-action}

Цей приклад оновлює вказаний реліз з вказаним чартом, версією та значеннями:

{{< highlightexamplego file="sdkexamples/upgrade.go" >}}

### Видалення (Uninstall) {#uninstall-action}

Цей приклад видаляє вказаний реліз

{{< highlightexamplego file="sdkexamples/uninstall.go" >}}

### Виводу списку чартів (List) {#list-action}

Цей приклад показує всі чарти (в поточному налаштованому просторі імен)

{{< highlightexamplego file="sdkexamples/list.go" >}}

### Завантаження чартів (Pull) {#pull-action}

Цей приклад завантажує чарт з OCI репозиторію

{{< highlightexamplego file="sdkexamples/pull.go" >}}

## Драйвер {#driver}

Тут драйвер показує необхідні допоміжні функції, потрібні для роботи дій Helm SDK. І показує наведені вище приклади в дії, щоб завантажити, встановити, оновити та видалити чарт 'podinfo' з OCI репозиторію.

{{< highlightexamplego file="sdkexamples/main.go" >}}
