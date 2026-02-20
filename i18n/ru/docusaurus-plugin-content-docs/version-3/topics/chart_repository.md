---
title: Руководство по репозиториям чартов
description: Как создавать репозитории чартов Helm и работать с ними.
sidebar_position: 6
---

В этом разделе объясняется, как создавать репозитории чартов Helm и работать с ними. Репозиторий чартов — это место, где можно хранить и распространять упакованные чарты.

Распределённый репозиторий чартов сообщества Helm находится на [Artifact Hub](https://artifacthub.io/packages/search?kind=0) и открыт для участия. Однако Helm также позволяет создавать и запускать собственный репозиторий чартов. Это руководство объясняет, как это сделать. Если вы планируете создать репозиторий чартов, возможно, стоит рассмотреть использование [OCI-реестра](/topics/registries.md).

## Предварительные требования

* Пройдите [Руководство по быстрому старту](/intro/quickstart.md)
* Ознакомьтесь с документом [Чарты](/topics/charts.md)

## Создание репозитория чартов

_Репозиторий чартов_ — это HTTP-сервер, содержащий файл `index.yaml` и, опционально, упакованные чарты. Когда вы готовы поделиться своими чартами, предпочтительный способ — загрузить их в репозиторий чартов.

Начиная с Helm 2.2.0 поддерживается клиентская SSL-аутентификация к репозиторию. Другие протоколы аутентификации могут быть доступны через плагины.

Поскольку репозиторий чартов может быть любым HTTP-сервером, способным отдавать YAML и tar-файлы и отвечать на GET-запросы, у вас есть множество вариантов для размещения собственного репозитория чартов. Например, вы можете использовать бакет Google Cloud Storage (GCS), бакет Amazon S3, GitHub Pages или даже создать собственный веб-сервер.

### Структура репозитория чартов

Репозиторий чартов состоит из упакованных чартов и специального файла `index.yaml`, содержащего индекс всех чартов в репозитории. Часто чарты, описанные в `index.yaml`, размещаются на том же сервере, что и [файлы происхождения](/topics/provenance.md).

Например, структура репозитория `https://example.com/charts` может выглядеть так:

```
charts/
  |
  |- index.yaml
  |
  |- alpine-0.1.2.tgz
  |
  |- alpine-0.1.2.tgz.prov
```

В этом случае индексный файл будет содержать информацию об одном чарте — Alpine — и предоставлять URL для скачивания `https://example.com/charts/alpine-0.1.2.tgz` для этого чарта.

Не обязательно, чтобы пакет чарта находился на том же сервере, что и файл `index.yaml`. Однако часто это самый простой вариант.

### Индексный файл

Индексный файл — это YAML-файл с именем `index.yaml`. Он содержит метаданные о пакете, включая содержимое файла `Chart.yaml` чарта. Валидный репозиторий чартов должен иметь индексный файл. Индексный файл содержит информацию о каждом чарте в репозитории чартов. Команда `helm repo index` генерирует индексный файл на основе заданного локального каталога, содержащего упакованные чарты.

Вот пример индексного файла:

```yaml
apiVersion: v1
entries:
  alpine:
    - created: 2016-10-06T16:23:20.499814565-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 99c76e403d752c84ead610644d4b1c2f2b453a74b921f422b9dcb8a7c8b559cd
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.2.0.tgz
      version: 0.2.0
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 515c58e5f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cd78727
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.1.0.tgz
      version: 0.1.0
  nginx:
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Create a basic nginx HTTP server
      digest: aaff4545f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cdffffff
      home: https://helm.sh/helm
      name: nginx
      sources:
      - https://github.com/helm/charts
      urls:
      - https://technosophos.github.io/tscharts/nginx-1.1.0.tgz
      version: 1.1.0
generated: 2016-10-06T16:23:20.499029981-06:00
```

## Размещение репозиториев чартов

В этой части показаны несколько способов размещения репозитория чартов.

### Google Cloud Storage

Первый шаг — **создать бакет GCS**. Назовём его `fantastic-charts`.

![Создание бакета GCS](/img/helm2/create-a-bucket.png)

Затем сделайте бакет публичным, **отредактировав права доступа**.

![Редактирование прав](/img/helm2/edit-permissions.png)

Добавьте эту запись, чтобы **сделать бакет публичным**:

![Сделать бакет публичным](/img/helm2/make-bucket-public.png)

Поздравляем, теперь у вас есть пустой бакет GCS, готовый для размещения чартов!

Вы можете загружать репозиторий чартов с помощью командной строки Google Cloud Storage или через веб-интерфейс GCS. Публичный бакет GCS доступен по простому HTTPS-адресу: `https://bucket-name.storage.googleapis.com/`.

### Cloudsmith

Вы также можете настроить репозитории чартов с помощью Cloudsmith. Подробнее о репозиториях чартов с Cloudsmith читайте [здесь](https://help.cloudsmith.io/docs/helm-chart-repository).

### JFrog Artifactory

Аналогично вы можете настроить репозитории чартов с помощью JFrog Artifactory. Подробнее о репозиториях чартов с JFrog Artifactory читайте [здесь](https://www.jfrog.com/confluence/display/RTF/Helm+Chart+Repositories).

### Пример с GitHub Pages

Аналогичным образом можно создать репозиторий чартов с помощью GitHub Pages.

GitHub позволяет размещать статические веб-страницы двумя способами:

- Настроив проект для обслуживания содержимого каталога `docs/`
- Настроив проект для обслуживания определённой ветки

Мы используем второй подход, хотя первый столь же прост.

Первый шаг — **создать ветку gh-pages**. Вы можете сделать это локально:

```console
$ git checkout -b gh-pages
```

Или через веб-браузер, используя кнопку **Branch** в вашем репозитории GitHub:

![Создание ветки GitHub Pages](/img/helm2/create-a-gh-page-button.png)

Далее убедитесь, что ваша **ветка gh-pages** настроена как GitHub Pages. Перейдите в **Settings** репозитория и прокрутите вниз до раздела **GitHub Pages**, настроив его следующим образом:

![Настройка ветки GitHub Pages](/img/helm2/set-a-gh-page.png)

По умолчанию **Source** обычно устанавливается на **gh-pages branch**. Если это не так, выберите её.

При желании вы можете использовать **собственный домен**.

Также убедитесь, что включена опция **Enforce HTTPS**, чтобы при обслуживании чартов использовался **HTTPS**.

При такой настройке вы можете использовать основную ветку для хранения кода чартов, а **ветку gh-pages** — как репозиторий чартов, например: `https://USERNAME.github.io/REPONAME`. Демонстрационный репозиторий [TS Charts](https://github.com/technosophos/tscharts) доступен по адресу `https://technosophos.github.io/tscharts/`.

Если вы решили использовать GitHub Pages для размещения репозитория чартов, ознакомьтесь с [Chart Releaser Action](/howto/chart_releaser_action.md). Chart Releaser Action — это рабочий процесс GitHub Action для превращения проекта GitHub в самостоятельный репозиторий чартов Helm с использованием CLI-инструмента [helm/chart-releaser](https://github.com/helm/chart-releaser).

### Обычные веб-серверы

Чтобы настроить обычный веб-сервер для обслуживания чартов Helm, вам нужно сделать следующее:

- Поместите индекс и чарты в каталог, который может обслуживать сервер
- Убедитесь, что файл `index.yaml` доступен без аутентификации
- Убедитесь, что файлы `yaml` отдаются с правильным типом содержимого (`text/yaml` или `text/x-yaml`)

Например, если вы хотите обслуживать чарты из `$WEBROOT/charts`, создайте каталог `charts/` в корне веб-сервера и поместите индексный файл и чарты в эту папку.

### Сервер репозитория ChartMuseum

ChartMuseum — это сервер репозитория чартов Helm с открытым исходным кодом, написанный на Go (Golang), с поддержкой облачных хранилищ, включая [Google Cloud Storage](https://cloud.google.com/storage/), [Amazon S3](https://aws.amazon.com/s3/), [Microsoft Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/), [Alibaba Cloud OSS Storage](https://www.alibabacloud.com/product/oss), [Openstack Object Storage](https://developer.openstack.org/api-ref/object-store/), [Oracle Cloud Infrastructure Object Storage](https://cloud.oracle.com/storage), [Baidu Cloud BOS Storage](https://cloud.baidu.com/product/bos.html), [Tencent Cloud Object Storage](https://intl.cloud.tencent.com/product/cos), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/), [Minio](https://min.io/) и [etcd](https://etcd.io/).

Вы также можете использовать сервер [ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage) для размещения репозитория чартов в локальной файловой системе.

### GitLab Package Registry

С помощью GitLab вы можете публиковать чарты Helm в Package Registry вашего проекта. Подробнее о настройке репозитория пакетов Helm с GitLab читайте [здесь](https://docs.gitlab.com/ee/user/packages/helm_repository/).

## Управление репозиториями чартов

Теперь, когда у вас есть репозиторий чартов, в последней части этого руководства объясняется, как поддерживать чарты в этом репозитории.

### Хранение чартов в репозитории

Теперь загрузим чарт и индексный файл в репозиторий. Чарты в репозитории должны быть упакованы (`helm package chart-name/`) и правильно версионированы (в соответствии с рекомендациями [SemVer 2](https://semver.org/)).

Следующие шаги представляют пример рабочего процесса, но вы можете использовать любой удобный вам процесс для хранения и обновления чартов в репозитории.

Когда у вас есть готовый упакованный чарт, создайте новый каталог и переместите упакованный чарт в него.

```console
$ helm package docs/examples/alpine/
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
$ helm repo index fantastic-charts --url https://fantastic-charts.storage.googleapis.com
```

Последняя команда принимает путь к только что созданному локальному каталогу и URL вашего удалённого репозитория чартов, создавая файл `index.yaml` в указанном каталоге.

Теперь вы можете загрузить чарт и индексный файл в репозиторий с помощью инструмента синхронизации или вручную. Если вы используете Google Cloud Storage, посмотрите этот [пример рабочего процесса](/howto/chart_repository_sync_example.md) с использованием клиента gsutil. Для GitHub просто поместите чарты в соответствующую целевую ветку.

### Добавление новых чартов в существующий репозиторий

Каждый раз, когда вы хотите добавить новый чарт в репозиторий, необходимо заново сгенерировать индекс. Команда `helm repo index` полностью перестраивает файл `index.yaml` с нуля, включая только те чарты, которые находятся локально.

Однако вы можете использовать флаг `--merge` для инкрементального добавления новых чартов в существующий файл `index.yaml` (отличный вариант при работе с удалённым репозиторием, таким как GCS). Выполните `helm repo index --help`, чтобы узнать больше.

Убедитесь, что вы загружаете как обновлённый файл `index.yaml`, так и чарт. И если вы сгенерировали файл происхождения, загрузите и его.

### Распространение чартов

Когда вы готовы поделиться своими чартами, просто сообщите кому-нибудь URL вашего репозитория.

Оттуда они добавят репозиторий в свой клиент Helm с помощью команды `helm repo add [NAME] [URL]`, используя любое имя для ссылки на репозиторий.

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

Если чарты защищены HTTP-аутентификацией (Basic Auth), вы также можете указать имя пользователя и пароль:

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

**Примечание:** Репозиторий не будет добавлен, если он не содержит валидного файла `index.yaml`.

**Примечание:** Если ваш репозиторий Helm использует, например, самоподписанный сертификат, вы можете использовать `helm repo add --insecure-skip-tls-verify ...`, чтобы пропустить проверку CA.

После этого ваши пользователи смогут искать ваши чарты. После обновления репозитория они могут использовать команду `helm repo update` для получения актуальной информации о чартах.

*Под капотом команды `helm repo add` и `helm repo update` загружают файл index.yaml и сохраняют его в каталоге `$XDG_CACHE_HOME/helm/repository/cache/`. Именно там функция `helm search` находит информацию о чартах.*
