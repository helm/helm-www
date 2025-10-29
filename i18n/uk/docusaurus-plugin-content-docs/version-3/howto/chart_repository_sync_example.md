---
title: Синхронізація вашого репозиторію чартів
description: Описує, як синхронізувати ваші локальні та віддалені репозиторії чартів.
sidebar_position: 2
---

*Примітка: Цей приклад для хмарного сховища Google (GCS), яке обслуговує репозиторій чартів.*

## Попередні умови {#prerequisites}

* Встановіть інструмент [gsutil](https://cloud.google.com/storage/docs/gsutil). *Ми значною мірою покладаємося на функціональність gsutil rsync.*
* Переконайтеся, що у вас є доступ до бінарного файлу Helm.
* *Необовʼязково: Ми рекомендуємо встановити [версіювання обʼєктів](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#top_of_page) у вашому сховищі GCS, на випадок, якщо ви випадково щось видалите.*

## Налаштування теки локального репозиторію чартів {#set-up-a-local-chart-repository-directory}

Створіть локальну теку, як ми це робили в [керівництві з репозиторію чартів](/topics/chart_repository.md), і помістіть ваші упаковані чарти в цю теку.

Наприклад:

```console
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
```

## Генерація оновленого файлу index.yaml {#generate-an-updated-index.yaml}

Використовуйте Helm для генерації оновленого файлу index.yaml, передавши шлях до теки та URL-адресу віддаленого репозиторію команді `helm repo index`, як показано нижче:

```console
$ helm repo index fantastic-charts/ --url https://fantastic-charts.storage.googleapis.com
```

Це згенерує оновлений файл index.yaml і помістить його в теку `fantastic-charts/`.

## Синхронізація ваших локальних та віддалених репозиторіїв чартів {#sync-your-local-and-remote-chart-repositories}

Завантажте вміст теки у ваше сховище GCS, запустивши `scripts/sync-repo.sh` та передавши назву локальної теки та назву сховища GCS.

Наприклад:

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

## Оновлення вашого репозиторію чартів {#updating-your-chart-repository}

Ви захочете зберегти локальну копію вмісту вашого репозиторію чартів або використати `gsutil rsync` для копіювання вмісту вашого віддаленого репозиторію чартів до локальної теки.

Наприклад:

```console
$ gsutil rsync -d -n gs://bucket-name local-dir/    # прапорець -n виконує пробний запуск
Building synchronization state...
Starting synchronization
Would copy gs://bucket-name/alpine-0.1.0.tgz to file://local-dir/alpine-0.1.0.tgz
Would copy gs://bucket-name/index.yaml to file://local-dir/index.yaml

$ gsutil rsync -d gs://bucket-name local-dir/       # виконує дії копіювання
Building synchronization state...
Starting synchronization
Copying gs://bucket-name/alpine-0.1.0.tgz...
Downloading file://local-dir/alpine-0.1.0.tgz:                        740 B/740 B
Copying gs://bucket-name/index.yaml...
Downloading file://local-dir/index.yaml:                              346 B/346 B
```

Корисні посилання:

* Документація щодо [gsutil rsync](https://cloud.google.com/storage/docs/gsutil/commands/rsync#description)
* [Керівництво репозиторію чартів](/topics/chart_repository.md)
* Документація щодо [версіювання обʼєктів та керування паралельністю](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#overview) у хмарному сховищі Google
