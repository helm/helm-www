---
title: Введение
description: Введение в Helm Go SDK
sidebar_position: 1
---
Helm Go SDK позволяет пользовательскому программному обеспечению использовать чарты Helm и функциональность Helm для управления развёртыванием программного обеспечения в Kubernetes.
(На самом деле, CLI Helm — это всего лишь один из таких инструментов!)

В настоящее время SDK функционально отделён от CLI Helm.
SDK может использоваться (и используется) автономными инструментами.
Проект Helm гарантирует стабильность API для SDK.
Следует отметить, что в SDK всё ещё есть некоторые шероховатости, оставшиеся после первоначальной работы по отделению CLI и SDK. Проект Helm намерен улучшить их со временем.

Полная документация API доступна по адресу [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3).

Ниже приведён краткий обзор основных типов пакетов и простой пример.
Дополнительные примеры и более полнофункциональный драйвер смотрите в разделе [Примеры](/sdk/examples.mdx).

## Обзор основных пакетов

- [pkg/action](https://pkg.go.dev/helm.sh/helm/v3/pkg/action):
  Содержит основной «клиент» для выполнения операций Helm.
  Это тот же пакет, который CLI использует «под капотом».
  Если вам нужно просто выполнять базовые команды Helm из другой программы на Go, этот пакет для вас
- [pkg/chart](https://pkg.go.dev/helm.sh/helm/v3/pkg/chart), [pkg/chartutil](https://pkg.go.dev/helm.sh/helm/v3/pkg/chartutil):
  Методы и вспомогательные функции для загрузки и работы с чартами
- [pkg/cli](https://pkg.go.dev/helm.sh/helm/v3/pkg/cli) и его подпакеты:
  Содержит все обработчики для стандартных переменных окружения Helm, а подпакеты отвечают за обработку вывода и файлов values
- [pkg/release](https://pkg.go.dev/helm.sh/helm/v3/pkg/release):
  Определяет объект `Release` и статусы

Помимо этих существует множество других пакетов, поэтому обратитесь к документации за дополнительной информацией!

### Простой пример
Это простой пример выполнения `helm list` с использованием Go SDK.
Дополнительные примеры смотрите в разделе [Примеры](/sdk/examples.mdx).

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
    // You can pass an empty string instead of settings.Namespace() to list
    // all namespaces
    if err := actionConfig.Init(settings.RESTClientGetter(), settings.Namespace(), os.Getenv("HELM_DRIVER"), log.Printf); err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    client := action.NewList(actionConfig)
    // Only list deployed
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


## Совместимость

Helm SDK явно следует гарантиям обратной совместимости Helm:

<https://github.com/helm/community/blob/main/hips/hip-0004.md>

То есть несовместимые изменения будут вноситься только при смене мажорных версий.
