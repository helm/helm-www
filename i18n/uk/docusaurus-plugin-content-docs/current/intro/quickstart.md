---
title: Швидкий старт
description: Як встановити та розпочати роботу з Helm, включаючи інструкції для дистрибутивів, поширені запитання та втулки.
sidebar_position: 2
default_lang_commit: 5b891dc41e2912a6ffed8d478a1bd371e5921d4b
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

## Знаходження чартів для встановлення {#find-charts-to-install}

[Artifact Hub](https://artifacthub.io/packages/search?kind=0) — найкраще місце для пошуку Helm-чартів. Він обʼєднує чарти з сотень репозиторіїв і надає пошук, метадані та інформацію про безпеку.

Популярні джерела чартів:

- **OCI-реєстри**: Багато організацій публікують чарти в контейнерних реєстрах, таких як GitHub Container Registry, Docker Hub або реєстри хмарних провайдерів. Їх можна встановити безпосередньо за допомогою префікса `oci://`.
- **Репозиторії чартів**: Традиційні Helm-репозиторії можна додати командою `helm repo add` і шукати в них за допомогою `helm search repo`.

Щоб шукати Artifact Hub з командного рядка:

```console
$ helm search hub podinfo
URL                                                 CHART VERSION  APP VERSION  DESCRIPTION
https://artifacthub.io/packages/helm/podinfo/po...  6.11.2         6.11.2       Podinfo Helm chart for Kubernetes
```

## Встановлення чарту з OCI-реєстру {#install-a-chart-from-an-oci-registry}

Helm може встановлювати чарти безпосередньо з контейнерних реєстрів, сумісних з OCI. Для цього не потрібно спочатку додавати репозиторій.

Щоб встановити чарт з OCI-реєстру, використовуйте префікс `oci://`:

```console
$ helm install my-podinfo oci://ghcr.io/stefanprodan/charts/podinfo --version 6.11.2
Pulled: ghcr.io/stefanprodan/charts/podinfo:6.11.2
NAME: my-podinfo
LAST DEPLOYED: Sat May  3 12:05:00 2026
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES: ...
```

Щоб перевірити, чи працює встановлення, перенаправте порт сервісу й перевірте точку доступу:

```console
$ kubectl port-forward svc/my-podinfo 9898:9898 &
$ curl http://localhost:9898
{
  "hostname": "podinfo-6f89b4c6b5-xvwtb",
  "version": "6.7.1",
  "message": "greetings from podinfo v6.7.1",
  "goos": "linux",
  "goarch": "amd64",
  ...
}
```

Перед встановленням можна переглянути вміст чарту:

```console
$ helm show chart oci://ghcr.io/stefanprodan/charts/podinfo --version 6.11.2
```

Докладніше про роботу з OCI-реєстрами див. у розділі [Використання реєстрів на основі OCI](/docs/topics/registries).

## Дізнайтеся про релізи {#learn-about-releases}

За допомогою Helm легко побачити, що було встановлено:

```console
$ helm list
NAME       	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART         	APP VERSION
my-podinfo 	default  	1       	2026-05-03 12:05:00.000000 +0000 UTC	deployed	podinfo-6.11.2	6.7.1
```

Команда `helm list` (або `helm ls`) покаже список усіх розгорнутих релізів.

## Видалення релізу {#uninstall-a-release}

Щоб видалити реліз, скористайтеся командою `helm uninstall`:

```console
$ helm uninstall my-podinfo
release "my-podinfo" uninstalled
```

Це видалить `my-podinfo` з Kubernetes разом з усіма повʼязаними з релізом ресурсами та історією релізу.

Якщо вказано прапорець `--keep-history`, історія релізів буде збережена. Ви зможете запитувати інформацію про цей реліз:

```console
$ helm status my-podinfo
Status: UNINSTALLED
...
```

Оскільки Helm відстежує релізи навіть після їх видалення, ви можете переглядати історію кластера й навіть відновити реліз за допомогою `helm rollback`.

## Ознайомлення з довідкою {#reading-the-help-text}

Щоб дізнатися більше про доступні команди Helm, скористайтеся командою `helm help` або введіть команду, додавши до неї прапорець `-h`:

```console
$ helm get -h
```
