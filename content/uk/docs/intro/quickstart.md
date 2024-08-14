---
title: "Швидкий старт"
description: "Як встановити та почати роботу з Helm, включаючи інструкції для дистрибутивів, поширені запитання та втулки."
weight: 1
---

У цьому посібнику ви дізнаєтеся, як швидко почати користуватися Helm.

## Попередні умови {#prerequisites}

Для успішного та належного використання Helm потрібні наступні умови.

1. Кластер Kubernetes
2. Визначення, які конфігурації безпеки застосувати до вашої інсталяції, якщо такі є
3. Встановлення та налаштування Helm.

### Встановлення Kubernetes або доступ до кластера {#install-kubernetes-or-have-access-to-a-cluster}

- У вас повинен бути встановлений Kubernetes. Для останньої версії Helm ми рекомендуємо використовувати останню стабільну версію Kubernetes, що в більшості випадків є передостанньою мінорною версією.
- У вас також має бути локально налаштована копія `kubectl`.

Дивіться [Політику підтримки версій Helm](https://helm.sh/docs/topics/version_skew/) щодо максимальної підтримуваної різниці версій між Helm і Kubernetes.

## Встановлення Helm {#install-helm}

Завантажте бінарний реліз клієнта Helm. Ви можете використовувати такі інструменти, як `homebrew`, або перегляньте [сторінку офіційних релізів](https://github.com/helm/helm/releases).

Для отримання більш детальної інформації або інших варіантів, дивіться [посібник з встановлення]({{< ref "install.md" >}}).

## Ініціалізація репозиторію Helm Chart {#initialize-a-helm-chart-repository}

Як тільки Helm буде готовий, ви можете додати репозиторій чартів. Перевірте [Artifact Hub](https://artifacthub.io/packages/search?kind=0) для доступних репозиторіїв чартів Helm.

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

Після цього ви зможете переглянути доступні для встановлення чарти:

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... і багато інших
```

## Встановлення прикладу чарту {#install-an-example-chart}

Для встановлення чарту можна використати команду `helm install`. Helm пропонує кілька способів знаходження та встановлення чарту, але найпростіший — це використання чартів від `bitnami`.

```console
$ helm repo update              # Переконайтеся, що ви отримали останній список чартів
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

У наведеному вище прикладі чарт `bitnami/mysql` було розгорнуто, а імʼя нашого нового релізу — `mysql-1612624192`.

Ви можете отримати уявлення про можливості цього чарту MySQL, виконавши команду `helm show chart bitnami/mysql`. Або ви можете виконати `helm show all bitnami/mysql`, щоб отримати всю інформацію про чарт.

Кожного разу, коли ви встановлюєте чарт, створюється новий реліз. Отже, один чарт може бути встановлений кілька разів у тому ж кластері. І кожен може керуватися та оновлюватися незалежно.

Команда `helm install` є дуже потужною з багатьма можливостями. Щоб дізнатися більше про неї, перегляньте
[Посібник з використання Helm]({{< ref "using_helm.md" >}}).

## Дізнайтеся про релізи {#learn-about-releases}

Дуже просто побачити, що було розгорнуто за допомогою Helm:

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

Це видалить `mysql-1612624192` з Kubernetes, що видалить всі ресурси, повʼязані з релізом, а також історію релізу.

Якщо буде надано прапорець `--keep-history`, історія релізу буде збережена. Ви зможете запитувати інформацію про цей реліз:

```console
$ helm status mysql-1612624192
Status: UNINSTALLED
...
```

Оскільки Helm відстежує ваші релізи навіть після того, як ви їх видалили, ви можете переглядати історію кластера і навіть відновити реліз (за допомогою `helm rollback`).

## Ознайомлення з довідкою {#reading-the-help-text}

Щоб дізнатися більше про доступні команди Helm, використовуйте `helm help` або введіть команду з прапорцем `-h`:

```console
$ helm get -h
```
