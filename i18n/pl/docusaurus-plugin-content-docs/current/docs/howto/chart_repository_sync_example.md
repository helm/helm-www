---
title: Synchronizacja repozytorium chartów
description: Opisuje, jak synchronizować lokalne i zdalne repozytoria chartów.
sidebar_position: 2
---

*Uwaga: Ten przykład dotyczy konkretnie zasobnika Google Cloud Storage (GCS), który pełni rolę repozytorium chartów.*


## Wymagania wstępne {#prerequisites}
* Zainstaluj narzędzie [gsutil](https://cloud.google.com/storage/docs/gsutil).
  *Silnie polegamy na funkcjonalności gsutil rsync*
* Upewnij się, że masz dostęp do pliku wykonywalnego Helma
* _Opcjonalne: Zalecamy włączenie [wersjonowania obiektów](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#top_of_page)
  w
  Twoim zasobie GCS na wypadek przypadkowego usunięcia czegoś._

## Skonfiguruj lokalny katalog repozytorium chartów {#set-up-a-local-chart-repository-directory}
Utwórz lokalny katalog, tak jak to zrobiliśmy w
[przewodniku po repozytorium chartów](/topics/chart_repository.md), i umieść w nim swoje zapakowane charty.

Na przykład:
```console
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
```

## Wygeneruj zaktualizowany plik index.yaml {#generate-an-updated-indexyaml}
Użyj Helma do wygenerowania zaktualizowanego pliku index.yaml, przekazując ścieżkę do
katalogu oraz adres URL zdalnego repozytorium do polecenia `helm repo index` w następujący sposób:

```console
$ helm repo index fantastic-charts/ --url https://fantastic-charts.storage.googleapis.com
```
To wygeneruje zaktualizowany plik
index.yaml i umieści go w katalogu `fantastic-charts/`.

## Synchronizuj swoje lokalne i zdalne repozytoria chartów. {#sync-your-local-and-remote-chart-repositories}
Prześlij zawartość katalogu do swojego repozytorium GCS,
uruchamiając `scripts/sync-repo.sh` i podając nazwę
lokalnego katalogu oraz nazwę repozytorium GCS.

Na przykład:
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
## Aktualizowanie repozytorium chartów {#updating-your-chart-repository}
Warto zachować lokalną kopię zawartości swojego
repozytorium chartów lub użyć `gsutil rsync`, aby skopiować
zawartość zdalnego repozytorium chartów do lokalnego katalogu.

Na przykład:
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

Przydatne linki:
* Dokumentacja dotycząca [gsutil rsync](https://cloud.google.com/storage/docs/gsutil/commands/rsync#description)
  
* [Przewodnik po Repozytorium Chartów](/topics/chart_repository.md)
* Dokumentacja na temat [wersjonowania obiektów i kontroli współbieżności](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#overview)
  w
  Google Cloud Storage
