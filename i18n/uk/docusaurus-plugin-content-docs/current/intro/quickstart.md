---
title: Швидкий старт
description: Як встановити та розпочати роботу з Helm, включаючи інструкції для дистрибутивів, поширені запитання та втулки.
sidebar_position: 1
---

Цей посібник описує, як швидко розпочати роботу з Helm.

## Передумови {#prerequisites}

Для успішного та належного використання Helm необхідні такі передумови.

1. Кластер Kubernetes
2. Визначення конфігурацій безпеки, які слід застосувати до вашого встановлення, якщо такі є
3. Встановлення та налаштування Helm.

### Встановіть Kubernetes або отримайте доступ до кластера {#install-kubernetes-or-have-access-to-a-cluster}

- Ви повинні мати встановлений Kubernetes. Для останньої версії Helm ми рекомендуємо останню стабільну версію Kubernetes, яка в більшості випадків є передостанньою мінорною версією.
- Ви також повинні мати локальну налаштовану копію `kubectl`.

Дивіться [Політику підтримки версій Helm](https://helm.sh/docs/topics/version_skew/) для отримання інформації про максимальну розбіжність версій, що підтримується між Helm і Kubernetes.

## Встановіть Helm {#install-helm}

Завантажте бінарну версію клієнта Helm. Ви можете скористатися такими інструментами, як `homebrew`, або переглянути [офіційну сторінку випусків](https://github.com/helm/helm/releases).

Більш детальну інформацію та інші варіанти дивіться в [посібнику з встановлення](/intro/install.mdx).

## Ініціалізуйте репозиторій чартів Helm {#initialize-a-helm-chart-repository}

Після підготовки Helm ви можете додати репозиторій чартів. Перевірте [Artifact Hub](https://artifacthub.io/packages/search?kind=0), щоб дізнатися про доступні репозиторії чартів Helm.

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

Після встановлення ви зможете переглянути список чартів, які можна встановити:

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... and many more
```

## Встановіть демонстраційний чарт {#install-an-example-chart}

Щоб встановити чарт, можна виконати команду `helm install`. Helm має кілька способів пошуку та встановлення чартів, але найпростіший — це використання чартів `bitnami`.

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

У наведеному вище прикладі було встановлено чарт `bitnami/mysql`, а назва нашого нового релізу — `mysql-1612624192`.

Ви можете отримати загальне уявлення про функції цього чарту MySQL, виконавши команду `helm show chart bitnami/mysql`. Або ви можете виконати команду `helm show all bitnami/mysql`, щоб отримати всю інформацію про чарт.

Кожного разу, коли ви встановлюєте чарт, створюється новий реліз. Отже, один чарт можна встановити кілька разів в один і той самий кластер. І кожним з них можна керувати та оновлювати незалежно.

Команда `helm install` — це дуже потужна команда з багатьма можливостями. Щоб дізнатися більше про неї, перегляньте [Посібник з використання Helm](/intro/using_helm.mdx).

## Дізнайтеся про релізи {#learn-about-releases}

За допомогою Helm легко побачити, що було встановлено:

```console
$ helm list
NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

Функція `helm list` (або `helm ls`) покаже вам список усіх розгорнутих релізів.

## Видалення релізу {#uninstall-a-release}

Щоб видалити реліз, скористайтеся командою `helm uninstall`:

```console
$ helm uninstall mysql-1612624192
release "mysql-1612624192" uninstalled
```

Це видалить `mysql-1612624192` з Kubernetes, що призведе до видалення всіх ресурсів, повʼязаних з релізом, а також історії релізів.

Якщо вказано прапорець `--keep-history`, історія релізів буде збережена. Ви зможете запитувати інформацію про цей реліз:

```console
$ helm status mysql-1612624192
Status: UNINSTALLED
...
```

Оскільки Helm відстежує ваші релізи навіть після їх видалення, ви можете перевіряти історію кластера і навіть відновлювати релізи (за допомогою команди `helm rollback`).

## Ознайомлення з довідкою {#reading-the-help-text}

Щоб дізнатися більше про доступні команди Helm, скористайтеся командою `helm help` або введіть команду, додавши до неї прапорець `-h`:

```console
$ helm get -h
```
