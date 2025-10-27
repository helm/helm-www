---
title: Вступ
description: Представляємо Helm Go SDK
aliases:
  - /docs/gosdk
sidebar_position: 1
---
Go SDK Helm дозволяє програмному забезпеченню користувача використовувати чарти Helm та функціональність Helm для керування розгортанням програмного забезпечення Kubernetes
(Насправді, інтерфейс командного рядка Helm — це просто один з таких інструментів!)

Зараз SDK функціонально відокремлений від CLI Helm. І SDK може використовуватися (і використовується) окремими інструментами. Проєкт Helm зобовʼязується зберігати стабільність API для SDK. Варто зауважити, що SDK все ще має деякі шорсткості, що залишилися від початкової роботи з відокремлення CLI та SDK. Проєкт Helm має на меті покращити це з часом.

Повну документацію API можна знайти за посиланням [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3).

Нижче наведено короткий огляд основних типів пакетів та простий приклад. Дивіться розділ [Приклади](/sdk/examples.mdx) для більшої кількості прикладів та більш повнофункціонального 'драйвера'.

## Огляд основних пакетів {#main-package-overview}

- [pkg/action](https://pkg.go.dev/helm.sh/helm/v3/pkg/action): Містить основний "клієнт" для виконання дій Helm. Це той самий пакет, який використовує CLI під капотом. Якщо вам потрібно виконувати базові команди Helm з іншої Go програми, цей пакет для вас
- [pkg/chart](https://pkg.go.dev/helm.sh/helm/v3/pkg/chart), [pkg/chartutil](https://pkg.go.dev/helm.sh/helm/v3/pkg/chartutil): Методи та допоміжні функції для завантаження та маніпулювання чартами
- [pkg/cli](https://pkg.go.dev/helm.sh/helm/v3/pkg/cli) та його підпакети: Містить усі обробники для стандартних змінних середовища Helm, а його підпакети містять обробку виводу та файлів значень
- [pkg/release](https://pkg.go.dev/helm.sh/helm/v3/pkg/release): Визначає обʼєкт `Release` та статуси

Окрім цих є ще багато інших пакетів, тож перегляньте документацію для отримання додаткової інформації!

### Простий приклад {#simple-example}

Це простий приклад виконання команди `helm list` за допомогою Go SDK. Дивіться розділ [Приклади](/sdk/examples.mdx) для більш повнофункціональних прикладів.

```go
package main

import (
    "log"
    "os"

    "helm.sh/helm/v3/pkg/action"
    "helm.sh/helm/v3/pkg/cli"
)

func main() {
    settings := cli.New()

    actionConfig := new(action.Configuration)
    // Ви можете передати порожній рядок замість settings.Namespace(), щоб
    // перелічити всі простори імен
    if err := actionConfig.Init(settings.RESTClientGetter(), settings.Namespace(), os.Getenv("HELM_DRIVER"), log.Printf); err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    client := action.NewList(actionConfig)
    // Вивести перелік тільки розгорнутих
    client.Deployed = true
    results, err := client.Run()
    if err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    for _, rel := range results {
        log.Printf("%+v", rel)
    }
}

```

## Сумісність {#compatibility}

Helm SDK чітко дотримується гарантій зворотної сумісності Helm:

<https://github.com/helm/community/blob/main/hips/hip-0004.md>

Тобто, значні зміни буде внесено лише в основних (major) версіях.
