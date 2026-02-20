---
title: Краткое руководство
description: Как установить и начать работу с Helm, включая инструкции для дистрибутивов, FAQ и плагины.
sidebar_position: 1
---

Это руководство описывает, как быстро начать использовать Helm.

## Предварительные требования

Для успешного и безопасного использования Helm необходимо:

1. Кластер Kubernetes
2. Определение настроек безопасности для вашей установки (если требуется)
3. Установка и настройка Helm

### Установите Kubernetes или получите доступ к кластеру

- У вас должен быть установлен Kubernetes. Для последней версии Helm мы рекомендуем последнюю стабильную версию Kubernetes, которая в большинстве случаев является предпоследней минорной версией.
- Также у вас должна быть локально настроенная копия `kubectl`.

Смотрите [Политику поддержки версий Helm](https://helm.sh/docs/topics/version_skew/), чтобы узнать максимально допустимое расхождение версий между Helm и Kubernetes.

## Установка Helm

Загрузите бинарный релиз клиента Helm. Вы можете использовать такие инструменты, как `homebrew`, или посмотреть [официальную страницу релизов](https://github.com/helm/helm/releases).

Для получения более подробной информации или других вариантов смотрите [руководство по установке](/intro/install.md).

## Инициализация репозитория чартов Helm

После установки Helm вы можете добавить репозиторий чартов. Смотрите [Artifact Hub](https://artifacthub.io/packages/search?kind=0) для поиска доступных репозиториев чартов Helm.

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

После этого вы сможете посмотреть список чартов, которые можно установить:

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... and many more
```

## Пример установки чарта

Чтобы установить чарт, используйте команду `helm install`. У Helm есть несколько способов найти и установить чарт, но самый простой — использовать чарты `bitnami`.

```console
$ helm repo update              # Make sure we get the latest list of charts
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

В приведённом выше примере был установлен чарт `bitnami/mysql`, а имя нашего нового релиза — `mysql-1612624192`.

Чтобы получить представление о возможностях этого чарта MySQL, выполните команду `helm show chart bitnami/mysql`. Или выполните `helm show all bitnami/mysql`, чтобы получить всю информацию о чарте.

При каждой установке чарта создаётся новый релиз. Таким образом, один чарт можно установить несколько раз в один и тот же кластер. И каждый из них может управляться и обновляться независимо.

Команда `helm install` очень мощная и имеет множество возможностей. Чтобы узнать больше, смотрите [Руководство по использованию Helm](/intro/using_helm.md).

## Информация о релизах

С помощью Helm легко увидеть, что было развёрнуто:

```console
$ helm list
NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

Функция `helm list` (или `helm ls`) покажет вам список всех развёрнутых релизов.

## Удаление релиза

Чтобы удалить релиз, используйте команду `helm uninstall`:

```console
$ helm uninstall mysql-1612624192
release "mysql-1612624192" uninstalled
```

Эта команда удалит `mysql-1612624192` из Kubernetes, а также удалит все ресурсы, связанные с этим релизом, и историю релизов.

Если указать флаг `--keep-history`, история релизов будет сохранена. В этом случае вы сможете запросить информацию об этом релизе:

```console
$ helm status mysql-1612624192
Status: UNINSTALLED
...
```

Поскольку Helm отслеживает ваши релизы даже после их удаления, вы можете проверить историю кластера и даже восстановить релиз с помощью команды `helm rollback`.

## Чтение справки

Чтобы узнать больше о доступных командах Helm, используйте `helm help` или введите команду с флагом `-h`:

```console
$ helm get -h
```
