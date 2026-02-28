---
title: Синхронизация репозитория чартов
description: Как синхронизировать локальный и удалённый репозитории чартов.
sidebar_position: 2
---

*Примечание: этот пример предназначен специально для бакета Google Cloud Storage (GCS),
используемого в качестве репозитория чартов.*

## Предварительные требования
* Установите инструмент [gsutil](https://cloud.google.com/storage/docs/gsutil). *Основная
  часть работы выполняется через gsutil rsync*
* Убедитесь, что Helm установлен и доступен
* _Опционально: мы рекомендуем включить [версионирование объектов](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#top_of_page)
  в вашем GCS-бакете на случай случайного удаления данных._

## Настройка локального каталога репозитория чартов
Создайте локальный каталог, как описано в [руководстве по репозиториям чартов](/topics/chart_repository.md), и поместите в него упакованные чарты.

Например:
```console
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
```

## Генерация обновлённого index.yaml
Используйте Helm для генерации обновлённого файла index.yaml, передав путь к каталогу
и URL удалённого репозитория команде `helm repo index`:

```console
$ helm repo index fantastic-charts/ --url https://fantastic-charts.storage.googleapis.com
```
Эта команда сгенерирует обновлённый файл index.yaml и поместит его в каталог
`fantastic-charts/`.

## Синхронизация локального и удалённого репозиториев чартов
Загрузите содержимое каталога в ваш GCS-бакет, запустив скрипт
`scripts/sync-repo.sh` с указанием имени локального каталога и имени GCS-бакета.

Например:
```console
$ pwd
/Users/me/code/go/src/helm.sh/helm
$ scripts/sync-repo.sh fantastic-charts/ fantastic-charts
Getting ready to sync your local directory (fantastic-charts/) to a remote repository at gs://fantastic-charts
Verifying Prerequisites....
Thumbs up! Looks like you have gsutil. Let's continue.
Building synchronization state...
Starting synchronization
Would copy file://fantastic-charts/alpine-0.1.0.tgz to gs://fantastic-charts/alpine-0.1.0.tgz
Would copy file://fantastic-charts/index.yaml to gs://fantastic-charts/index.yaml
Are you sure you would like to continue with these changes?? [y/N]} y
Building synchronization state...
Starting synchronization
Copying file://fantastic-charts/alpine-0.1.0.tgz [Content-Type=application/x-tar]...
Uploading   gs://fantastic-charts/alpine-0.1.0.tgz:              740 B/740 B
Copying file://fantastic-charts/index.yaml [Content-Type=application/octet-stream]...
Uploading   gs://fantastic-charts/index.yaml:                    347 B/347 B
Congratulations your remote chart repository now matches the contents of fantastic-charts/
```
## Обновление репозитория чартов
Храните локальную копию содержимого вашего репозитория чартов или используйте
`gsutil rsync` для копирования содержимого удалённого репозитория чартов
в локальный каталог.

Например:
```console
$ gsutil rsync -d -n gs://bucket-name local-dir/    # the -n flag does a dry run
Building synchronization state...
Starting synchronization
Would copy gs://bucket-name/alpine-0.1.0.tgz to file://local-dir/alpine-0.1.0.tgz
Would copy gs://bucket-name/index.yaml to file://local-dir/index.yaml

$ gsutil rsync -d gs://bucket-name local-dir/       # performs the copy actions
Building synchronization state...
Starting synchronization
Copying gs://bucket-name/alpine-0.1.0.tgz...
Downloading file://local-dir/alpine-0.1.0.tgz:                        740 B/740 B
Copying gs://bucket-name/index.yaml...
Downloading file://local-dir/index.yaml:                              346 B/346 B
```

Полезные ссылки:
* Документация по [gsutil rsync](https://cloud.google.com/storage/docs/gsutil/commands/rsync#description)
* [Руководство по репозиториям чартов](/topics/chart_repository.md)
* Документация по [версионированию объектов и управлению конкурентным доступом](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#overview)
  в Google Cloud Storage
