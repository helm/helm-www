---
title: Synchroniser votre dépôt de charts
description: Explique comment synchroniser vos dépôts de charts locaux et distants.
sidebar_position: 2
---

*Remarque : cet exemple est spécifiquement conçu pour un bucket Google Cloud Storage (GCS) qui héberge un dépôt de charts.*

## Prérequis
* Installez l'outil [gsutil](https://cloud.google.com/storage/docs/gsutil). *Nous nous appuyons fortement sur la fonctionnalité rsync de gsutil*
* Assurez-vous d'avoir accès au binaire Helm
* _Optionnel : nous vous recommandons d'activer le [versionnement des objets](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#top_of_page) sur votre bucket GCS en cas de suppression accidentelle._

## Configurer un répertoire local pour le dépôt de charts
Créez un répertoire local comme nous l'avons fait dans [le guide des dépôts de charts](/topics/chart_repository.md), et placez vos charts empaquetés dans ce répertoire.

Par exemple :
```console
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
```

## Générer un fichier index.yaml mis à jour
Utilisez Helm pour générer un fichier index.yaml mis à jour en passant le chemin du répertoire et l'URL du dépôt distant à la commande `helm repo index` comme ceci :

```console
$ helm repo index fantastic-charts/ --url https://fantastic-charts.storage.googleapis.com
```
Cela générera un fichier index.yaml mis à jour et le placera dans le répertoire `fantastic-charts/`.

## Synchroniser vos dépôts de charts local et distant
Téléversez le contenu du répertoire vers votre bucket GCS en exécutant `scripts/sync-repo.sh` et en passant le nom du répertoire local et le nom du bucket GCS.

Par exemple :
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
## Mettre à jour votre dépôt de charts
Vous devriez conserver une copie locale du contenu de votre dépôt de charts ou utiliser `gsutil rsync` pour copier le contenu de votre dépôt de charts distant vers un répertoire local.

Par exemple :
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

Liens utiles :
* Documentation sur [gsutil rsync](https://cloud.google.com/storage/docs/gsutil/commands/rsync#description)
* [Le guide des dépôts de charts](/topics/chart_repository.md)
* Documentation sur le [versionnement des objets et le contrôle de concurrence](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#overview) dans Google Cloud Storage
