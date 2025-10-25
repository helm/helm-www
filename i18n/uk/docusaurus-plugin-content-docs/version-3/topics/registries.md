---
title: Використання реєстрів на основі OCI
description: Описує, як використовувати OCI для розповсюдження чартів.
sidebar_position: 7
---

Починаючи з Helm 3, ви можете використовувати реєстри контейнерів з підтримкою [OCI](https://www.opencontainers.org/) для зберігання та обміну пакетами чартів. Починаючи з Helm v3.8.0, підтримка OCI є стандартно увімкнено.

## Підтримка OCI до v3.8.0 {#oci-support-prior-to-v3.8.0}

Підтримка OCI перейшла з експериментального статусу в загальну доступність з Helm v3.8.0. У попередніх версіях Helm підтримка OCI працювала інакше. Якщо ви використовували підтримку OCI до Helm v3.8.0, важливо зрозуміти, що змінилося в Helm.

### Увімкнення підтримки OCI до v3.8.0 {#enabling-oci-support-prior-to-v3.8.0}

До Helm v3.8.0 підтримка OCI є *експериментальною* і має бути увімкнена вручну.

Щоб увімкнути експериментальну підтримку OCI для версій Helm до v3.8.0, задайте `HELM_EXPERIMENTAL_OCI` у вашому середовищі. Наприклад:

```console
export HELM_EXPERIMENTAL_OCI=1
```

### Визнання застарілою функції OCI та зміни поведінки з v3.8.0 {#oci-deprecation-and-behavior-changes-with-v3.8.0}

З виходом [Helm v3.8.0](https://github.com/helm/helm/releases/tag/v3.8.0) наступні функції та поведінка відрізняються від попередніх версій Helm:

- При встановленні chart у залежностях як OCI, версію можна задати у вигляді діапазону, як і для інших залежностей.
- Теги SemVer, які містять інформацію про збірку, можна публікувати та використовувати. Реєстри OCI не підтримують `+` як символ теґу. Helm перетворює `+` на `_`, коли він зберігається як теґ.
- Команда `helm registry login` тепер дотримується тієї ж структури, що й Docker CLI для зберігання облікових даних. Те ж місце для конфігурації реєстру може бути передане як Helm, так і Docker CLI.

### Визнання застарілою функції OCI та зміни поведінки з v3.7.0

Випуск [Helm v3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0) включав реалізацію [HIP 6](https://github.com/helm/community/blob/main/hips/hip-0006.md) для підтримки OCI. Як результат, наступні функції та поведінка відрізняються від попередніх версій Helm:

- Субкоманда `helm chart` була видалена.
- Кеш chart був видалений (немає `helm chart list` тощо).
- Посилання на реєстри OCI тепер завжди починаються з `oci://`.
- Базове імʼя посилання на реєстр має *завжди* відповідати імені chart.
- Тег посилання на реєстр має *завжди* відповідати семантичній версії chart (тобто без тегів `latest`).
- Тип медіа шару chart був змінений з `application/tar+gzip` на `application/vnd.cncf.helm.chart.content.v1.tar+gzip`.

## Використання реєстру на основі OCI {#using-an-oci-based-registry}

### Репозиторії Helm у реєстрах на основі OCI {#helm-repositories-in-oci-based-registries}

[Репозиторій Helm](/topics/chart_repository.md) — це спосіб зберігання та розподілу упакованих Helm chart. Реєстр на основі OCI може містити нуль або більше репозиторіїв Helm, і кожен з цих репозиторіїв може містити нуль або більше упакованих Helm chart.

### Використання послуг реєстрів {#use-hosted-registries}

Існує кілька реєстрів контейнерів з підтримкою OCI, які ви можете використовувати для ваших Helm chart. Наприклад:

- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-helm-repos#push-chart-to-registry-as-oci-artifact)
- [Docker Hub](https://docs.docker.com/docker-hub/oci-artifacts/)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/helm/manage-charts)
- [Harbor](https://goharbor.io/docs/main/administration/user-defined-oci-artifact/)
- [IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_helm_charts)
- [JFrog Artifactory](https://jfrog.com/help/r/jfrog-artifactory-documentation/helm-oci-repositories)

Щоб створити та налаштувати реєстр з підтримкою OCI, дотримуйтесь документації постачальника реєстру контейнерів на хостингу.

**Примітка:** Ви можете запускати [Docker Registry](https://docs.docker.com/registry/deploying/) або [`zot`](https://github.com/project-zot/zot), які є реєстрами на основі OCI, на вашому компʼютері для розробки. Запуск реєстру на основі OCI на вашому компʼютері, де відбувається розробка, слід використовувати лише для тестування.

### Використання sigstore для підписування чартів на основі OCI {#using-sigstore-to-sign-oci-charts}

Втулок [`helm-sigstore`](https://github.com/sigstore/helm-sigstore) дозволяє використовувати [Sigstore](https://sigstore.dev/) для підписування Helm чартів тими ж інструментами, які використовуються для підписування контейнерних образів. Це є альтернативою [перевірки походження](/topics/provenance.md), що використовує GPD, яке підтримується класичними [репозиторіями чартів](/topics/chart_repository.md).

Для отримання додаткової інформації про використання втулка `helm sigstore`, дивіться [документацію цього проєкту](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md).

## Команди для роботи з реєстрами {#commands-for-working-with-registries}

### Команда `registry` {#the-registry-subcommand}

#### `login`

Вхід до реєстру (зручний варіант з ручним введенням пароля)

```console
$ helm registry login -u myuser localhost:5000
Password:
Login succeeded
```

#### `logout`

Вийти з реєстру

```console
$ helm registry logout localhost:5000
Logout succeeded
```

### Команда `push` {#the-push-subcommand}

Завантажити чарт до реєстру на основі OCI:

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

Команда `push` може використовуватися тільки для `.tgz` файлів, створених заздалегідь за допомогою `helm package`.

При використанні `helm push` для завантаження чарту до реєстру OCI, посилання має починатися з `oci://` і не повинно містити базове імʼя або теґ.

Базове імʼя посилання на реєстр визначається з імені чарту, а теґ визначається з семантичної версії чарту. Це наразі є строгими вимогами.

Деякі реєстри вимагають, щоб репозиторій та/або простір імен (якщо вказано) були створені заздалегідь. В іншому випадку під час операції `helm push` буде згенеровано помилку.

Якщо ви створили [файл походження](/topics/provenance.md) (`.prov`), і він присутній поруч з файлом чарту `.tgz`, він автоматично буде завантажено до реєстру при виконанні `push`. Це призводить до появи додаткового шару у [маніфесті Helm chart](#helm-chart-manifest).

Користувачі втулка [helm-push](https://github.com/chartmuseum/helm-push) (для завантаження chart до [ChartMuseum](/topics/chart_repository.md#chartmuseum-repository-server)) можуть стикатися з проблемами, оскільки втулок конфліктує з новою вбудованою командою `push`. З версії v0.10.0 втулок був перейменований на `cm-push`.

### Інші підкоманди {#other-subcommands}

Підтримка протоколу `oci://` також доступна в різних інших підкомандах. Ось повний список:

- `helm pull`
- `helm show `
- `helm template`
- `helm install`
- `helm upgrade`

Базове імʼя (імʼя chart) посилання на реєстр *включено* для будь-якого типу дії, що стосується завантаження chart (на відміну від `helm push`, де воно пропущене).

Ось кілька прикладів використання наведених вище підкоманд для chart на основі OCI:

```shell
$ helm pull oci://localhost:5000/helm-charts/mychart --version 0.1.0
Pulled: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:0be7ec9fb7b962b46d81e4bb74fdcdb7089d965d3baca9f85d64948b05b402ff

$ helm show all oci://localhost:5000/helm-charts/mychart --version 0.1.0
apiVersion: v2
appVersion: 1.16.0
description: A Helm chart for Kubernetes
name: mychart
...

$ helm template myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
---
# Source: mychart/templates/serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
...

$ helm install myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...

$ helm upgrade myrelease oci://localhost:5000/helm-charts/mychart --version 0.2.0
Release "myrelease" has been upgraded. Happy Helming!
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:12:05 2021
NAMESPACE: default
STATUS: deployed
REVISION: 2
NOTES:
...
```

## Вказання залежностей {#specifying-dependencies}

Залежності chart можна завантажити з реєстру за допомогою підкоманди `dependency update`.

`repository` для певного запису в `Chart.yaml` вказується як посилання на реєстр без базового імені:

```yaml
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```

Це завантажить `oci://localhost:5000/myrepo/mychart:2.7.0`, коли виконується `dependency update`.

## Маніфест Helm чарту {#helm-chart-manifest}

Приклад маніфесту Helm чарту, представленого в реєстрі (зверніть увагу на поля `mediaType`):

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    }
  ]
}
```

Наступний приклад містить [файл походження](/topics/provenance.md) (зверніть увагу на додатковий шар):

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    },
    {
      "mediaType": "application/vnd.cncf.helm.chart.provenance.v1.prov",
      "digest": "sha256:3e207b409db364b595ba862cdc12be96dcdad8e36c59a03b7b3b61c946a5741a",
      "size": 643
    }
  ]
}
```

## Міграція з репозиторіїв чартів

Міграція з класичних [репозиторіїв чартів](/topics/chart_repository.md)
(репозиторії на основі index.yaml) є простою: використовуйте `helm pull`, а потім `helm push`, щоб завантажити отримані файли `.tgz` до реєстру.
