---
title: Использование реестров на базе OCI
description: Описывает, как использовать OCI для распространения чартов.
sidebar_position: 7
---

Начиная с Helm 3, вы можете использовать контейнерные реестры с поддержкой [OCI](https://www.opencontainers.org/) для хранения и распространения пакетов чартов. Начиная с Helm v3.8.0, поддержка OCI включена по умолчанию.


## Поддержка OCI до версии v3.8.0

Поддержка OCI перешла из экспериментальной стадии в общедоступную в Helm v3.8.0. В более ранних версиях Helm поддержка OCI работала иначе. Если вы использовали поддержку OCI до Helm v3.8.0, важно понимать, что изменилось в разных версиях Helm.

### Включение поддержки OCI до версии v3.8.0

До версии Helm v3.8.0 поддержка OCI была *экспериментальной* и требовала явного включения.

Чтобы включить экспериментальную поддержку OCI для версий Helm до v3.8.0, установите переменную окружения `HELM_EXPERIMENTAL_OCI`. Например:

```console
export HELM_EXPERIMENTAL_OCI=1
```

### Устаревшие возможности OCI и изменения поведения в v3.8.0

В релизе [Helm v3.8.0](https://github.com/helm/helm/releases/tag/v3.8.0) следующие возможности и поведение отличаются от предыдущих версий Helm:

- При указании чарта в зависимостях как OCI версию можно задавать в виде диапазона, как и для других зависимостей.
- Теги SemVer, содержащие информацию о сборке, можно отправлять и использовать. Реестры OCI не поддерживают символ `+` в тегах. Helm преобразует `+` в `_` при сохранении в виде тега.
- Команда `helm registry login` теперь следует той же структуре, что и Docker CLI для хранения учётных данных. Одно и то же расположение конфигурации реестра можно использовать как для Helm, так и для Docker CLI.

### Устаревшие возможности OCI и изменения поведения в v3.7.0

В релизе [Helm v3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0) была реализована поддержка OCI согласно [HIP 6](https://github.com/helm/community/blob/main/hips/hip-0006.md). В результате следующие возможности и поведение отличаются от предыдущих версий Helm:

- Подкоманда `helm chart` удалена.
- Кеш чартов удалён (нет `helm chart list` и т.д.).
- Ссылки на реестры OCI теперь всегда должны иметь префикс `oci://`.
- Базовое имя ссылки на реестр *всегда* должно совпадать с именем чарта.
- Тег ссылки на реестр *всегда* должен совпадать с семантической версией чарта (т.е. теги `latest` не поддерживаются).
- Медиатип слоя чарта изменён с `application/tar+gzip` на `application/vnd.cncf.helm.chart.content.v1.tar+gzip`.


## Использование реестров на базе OCI

### Репозитории Helm в реестрах на базе OCI

[Репозиторий Helm](/topics/chart_repository.md) — это способ размещения и распространения упакованных чартов Helm. Реестр на базе OCI может содержать ноль или более репозиториев Helm, и каждый из этих репозиториев может содержать ноль или более упакованных чартов Helm.

### Использование облачных реестров

Существует несколько облачных контейнерных реестров с поддержкой OCI, которые вы можете использовать для своих чартов Helm. Например:

- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-helm-repos#push-chart-to-registry-as-oci-artifact)
- [Cloudsmith](https://help.cloudsmith.io/docs/oci-repository)
- [Docker Hub](https://docs.docker.com/docker-hub/oci-artifacts/)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/helm/manage-charts)
- [Harbor](https://goharbor.io/docs/main/administration/user-defined-oci-artifact/)
- [IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_helm_charts)
- [JFrog Artifactory](https://jfrog.com/help/r/jfrog-artifactory-documentation/helm-oci-repositories)
- [RepoFlow](https://docs.repoflow.io/PackageTypes/helm#oci-helm-support)
  

Следуйте документации вашего провайдера облачных контейнерных реестров для создания и настройки реестра с поддержкой OCI.

**Примечание:** Вы можете запустить [Docker Registry](https://docs.docker.com/registry/deploying/) или [`zot`](https://github.com/project-zot/zot) — реестры на базе OCI — на локальном компьютере. Локальные реестры следует использовать только для тестирования.

### Использование sigstore для подписи чартов на базе OCI

Плагин [`helm-sigstore`](https://github.com/sigstore/helm-sigstore) позволяет использовать [Sigstore](https://sigstore.dev/) для подписи чартов Helm теми же инструментами, что используются для подписи контейнерных образов. Это альтернатива [происхождению на основе GPG](/topics/provenance.md), поддерживаемому классическими [репозиториями чартов](/topics/chart_repository.md).

Подробнее об использовании плагина `helm sigstore` см. в [документации проекта](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md).

## Команды для работы с реестрами

### Подкоманда `registry`

#### `login`

вход в реестр (с ручным вводом пароля)

```console
$ helm registry login -u myuser localhost:5000
Password:
Login succeeded
```

#### `logout`

выход из реестра

```console
$ helm registry logout localhost:5000
Logout succeeded
```

### Подкоманда `push`

Загрузка чарта в реестр на базе OCI:

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

Подкоманда `push` работает только с файлами `.tgz`,
предварительно созданными с помощью `helm package`.

При использовании `helm push` для загрузки чарта в реестр OCI ссылка
должна иметь префикс `oci://` и не должна содержать базовое имя или тег.

Базовое имя берётся из имени чарта, а тег — из семантической версии чарта.
это строгое требование.

Некоторые реестры требуют предварительного создания репозитория и/или namespace (если указан).
В противном случае во время операции `helm push` возникнет ошибка.

Если вы создали [файл происхождения](/topics/provenance.md) (`.prov`) и он находится рядом с файлом чарта `.tgz`, он будет автоматически загружен в реестр при выполнении `push`. Это приводит к появлению дополнительного слоя в [манифесте чарта Helm](#манифест-чарта-helm).

Пользователи [плагина helm-push](https://github.com/chartmuseum/helm-push) (для загрузки чартов в [ChartMuseum](/topics/chart_repository.md#chartmuseum-repository-server))
могут столкнуться с проблемами, поскольку плагин конфликтует с новой встроенной командой `push`.
Начиная с версии v0.10.0, плагин был переименован в `cm-push`.

### Другие подкоманды

Поддержка протокола `oci://` также доступна в различных других подкомандах.
Вот полный список:

- `helm pull`
- `helm push`
- `helm show`
- `helm template`
- `helm install`
- `helm upgrade`

Базовое имя (имя чарта) ссылки на реестр *включается*
для любых действий, связанных с загрузкой чарта
(в отличие от `helm push`, где оно опускается).

Примеры использования подкоманд с OCI-чартами:

```
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

## Установка чартов с использованием дайджеста

Установка чарта с использованием дайджеста более безопасна, чем с использованием тега, поскольку дайджесты неизменяемы.
Дайджест указывается в URI чарта:

```
$ helm install myrelease oci://localhost:5000/helm-charts/mychart@sha256:52ccaee6d4dd272e54bfccda77738b42e1edf0e4a20c27e23f0b6c15d01aef79
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...
```

## Указание зависимостей

Зависимости чарта можно загружать из реестра с помощью подкоманды `dependency update`.

Значение `repository` для записи в `Chart.yaml` указывается как ссылка на реестр без базового имени:

```
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```
При выполнении `dependency update` будет загружен `oci://localhost:5000/myrepo/mychart:2.7.0`.

## Манифест чарта Helm

Пример манифеста чарта Helm в том виде, как он представлен в реестре
(обратите внимание на поля `mediaType`):
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

Следующий пример содержит
[файл происхождения](/topics/provenance.md)
(обратите внимание на дополнительный слой):

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

## Миграция с репозиториев чартов

Миграция с классических [репозиториев чартов](/topics/chart_repository.md)
(репозиториев на основе index.yaml) выполняется просто: используйте `helm pull`, а затем `helm push` для загрузки полученных файлов `.tgz` в реестр.
