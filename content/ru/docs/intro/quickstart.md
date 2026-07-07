---
title: "Краткое Руководство"
description: "How to install and get started with Helm including instructions for distros, FAQs, and plugins."
weight: 1
---

Это руководство описывает, как вы можете быстро начать использовать Helm.

## Необходимые компоненты

Для успешного и надежного использования Helm необходимо

1. Kubernetes кластер
2. Принятие решения о том, какие конфигурации безопасности должны применяться к вашей установке, если таковые имеются.
3. Установка и настройка Helm

### Установите Kubernetes или получите доступ к кластеру

- У вас должен быть установлен Kubernetes. Для последней версии Helm мы
  рекомендуем последнюю стабильную версию Kubernetes, которая в большинстве случаев является
  второй последней минорной версией.
- Вы также должны иметь локально настроенную копию `kubectl`.

Смотрите [Политику поддержки версий Helm](https://helm.sh/docs/topics/version_skew/) для того, что бы понимать максимальную версию поддержки между Helm и Kubernetes.

## Установка Helm

Загрузите binary релиз клиента Helm. Вы можете использовать такие инструменты, как `homebrew`,
или посмотрите на [официальную страницу релизов](https://github.com/helm/helm/releases).

Для получения более подробной информации или других вариантов смотрите [руководство по установке]({{< ref
"install.md" >}}).

## Инициализация Helm Chart Repository

Как только у вас будет готов Helm, вы можете добавить chart репозиторий. Смотрите [Artifact
Hub](https://artifacthub.io/packages/search?kind=0) для проверки доступности Helm chart
репозиториев.

```console
$ helm repo add stable https://charts.helm.sh/stable
```

После установки, вы сможете посмотреть charts, которые вы можете установить:

```console
$ helm search repo stable
NAME                                    CHART VERSION   APP VERSION                     DESCRIPTION
stable/acs-engine-autoscaler            2.2.2           2.1.1                           DEPRECATED Scales worker nodes within agent pools
stable/aerospike                        0.2.8           v4.5.0.5                        A Helm chart for Aerospike in Kubernetes
stable/airflow                          4.1.0           1.10.4                          Airflow is a platform to programmatically autho...
stable/ambassador                       4.1.0           0.81.0                          A Helm chart for Datawire Ambassador
# ... and many more
```

## Пример Установки Chart

Чтобы установить chart, вы необходимо использовать команду `helm install`.
У Helm есть несколько способов найти и установить chart, но самый простой – это использовать один из официальных `stable` chart-ов.

```console
$ helm repo update              # Убедитесь, что мы получили последний список chart-ов
$ helm install stable/mysql --generate-name
Released smiling-penguin
```

В приведенном выше примере был выпущен `stable/mysql` chart, а имя нашего нового релиза: `smiling-penguin`.

Вы получите простое представление о возможностях этого MySQL chart-а, запустив `helm show
chart stable/mysql`.
Или вы можете запустить `helm show all stable/mysql` чтобы получить всю информацию о chart-е.

Всякий раз, когда вы устанавливаете chart, создается новая версия. 
Таким образом, один chart можно установить несколько раз в один и тот же кластер. 
И каждый из них может управляться и обновляться независимо.

`helm install` очень мощная команда со многими возможностями.
Узнать больше можно в [Руководстве по эксплуатации Helm]({{< ref "using_helm.md"
>}})

## Подробнее О Релизах

Всегда с легкостью можно увидеть, что было выпущено с помощью Helm:

```console
$ helm ls
NAME             VERSION   UPDATED                   STATUS    CHART
smiling-penguin  1         Wed Sep 28 12:59:46 2016  DEPLOYED  mysql-0.1.0
```

Функция `helm list` покажет вам список всех развернутых релизов.

## Удаление Релиза

Чтобы деинсталлировать релиз, используйте команду `helm uninstall`:

```console
$ helm uninstall smiling-penguin
Removed smiling-penguin
```

В данном случае, это удалит `smiling-penguin` из Kubernetes, 
а так же удалит все ресурсы, связанные с этим релизом и саму историю релизов.

If the flag `--keep-history` is provided, release history will be kept. You will
be able to request information about that release:
Если использовать флаг `--keep-history`, то история релизов будет сохранена.
В этом случае, у Вас остается возможность запросить информацию о удаленном ранее релизе.

```console
$ helm status smiling-penguin
Status: UNINSTALLED
... 
```

Так как Helm отслеживает ваши релизы даже после того, как вы их деинсталлировали, 
вы можете проверить историю кластера и даже восстановить релиз используя `helm rollback`.

## Чтение Текста Справки

Чтобы узнать больше о доступных Helm командах, используйте `helm help` или введите
команду за которой следует флаг `-h`:

```console
$ helm get -h
```
