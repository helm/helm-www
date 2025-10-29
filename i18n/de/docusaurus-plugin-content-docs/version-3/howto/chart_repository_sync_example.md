---
title: "Synchronisieren Ihres Chart Repository"
description: "Beschreibt wie Sie lokale und entfernte Chart Repositories synchronisieren."
sidebar_position: 2
---

*Hinweis: Dieses Beispiel richtet sich an einen Google Cloud Storage (GCS) Bucket,
welcher ein Chart Repository bereitstellt.*

## Vorbedingungen
* Installieren Sie das [gsutil](https://cloud.google.com/storage/docs/gsutil) Werkzeug.
  *Wir lehnen uns stark an die gsutil rsync Funktionalität*
* Stellen Sie sicher, dass Sie Zugriff auf das Helm Programm haben
* _Optional: Wir empfehlen, dass Sie die [Objektversionierung](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#top_of_page) in Ihrem GCS Bucket gesetzt haben, falls Sie etwas versehentlich löschen._

## Ein lokales Chart Repository Verzeichnis aufsetzen
Erstellen Sie ein lokales Verzeichnis wie wir es im [Chart Repository Handbuch](/topics/chart_repository.md) gemacht haben und legen Sie Ihr Chart Paket
in das Verzeichnis.

Zum Beispiel:
```console
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
```

## Generieren einer aktualisierten index.yaml
Benutzen Sie Helm zum Generieren einer aktualisierten index.yaml Datei durch Aufruf des
Verzeichnisses und der URL des entfernten Repositorry durch das `helm repo index` Kommando wie:

```console
$ helm repo index fantastic-charts/ --url https://fantastic-charts.storage.googleapis.com
```
Dies wird eine aktualisierte index.yaml Datei erstellen und in das Verzeichnis
`fantastic-charts/` legen.

## Synchronisieren Ihrer lokalen und entfernten Chart Repositories
Laden Sie den Inhalt des Verzeichnisses in Ihren GCS Bucket, indem Sie das Programm
`scripts/sync-repo.sh` aufrufen und im lokalen Verzeichnis den Verzeichnisnamen und den
Namen des GCS Bucket angeben.

Zum Beispiel:
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
## Aktualisieren Ihres Chart Repository
Sie möchten eine lokale Kopie des Inhalts Ihres Chart Repository behalten oder
`gsutil rsync` zum Kopieren des Inhalts Ihres entfernten Chart Repository zu Ihrem lokalen
Verzeichnis verwenden.

Zum Beispiel:
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

Hilfreiche Links:
* Dokumentation von [gsutil
  rsync](https://cloud.google.com/storage/docs/gsutil/commands/rsync#description)
* [Das Chart Repository Handbuch](/topics/chart_repository.md)
* Documentation von [Objekt Versionierung und parallele Zugriffe](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#overview) in Google Cloud Storage
