---
title: "Syncroniser votre dépôt de charts"
description: "Décrit comment synchroniser vos dépôts de charts locaux et distants."
weight: 2
---

*Remarque : Cet exemple concerne spécifiquement un bucket Google Cloud Storage (GCS) qui sert de dépôt de charts.*

## Prérequis
* Installer l'outil [gsutil](https://cloud.google.com/storage/docs/gsutil). *Nous nous appuyons fortement sur la fonctionnalité gsutil rsync*
* Assurez-vous d'avoir accès au binaire Helm
* _Optionnel : Nous vous recommandons de définir l'[object
  versioning](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#top_of_page)
  sur votre bucket GCS au cas où vous supprimeriez accidentellement quelque chose._

## Mise en place d'un dépôt de charts local
Créez un dépôt local, comme nous l'avons fait dans [le guide des dépôts de charts]({{< ref "/docs/topics/chart_repository.md" >}}), et placez-y vos charts packagés.

Pour exemple :
```console
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
```

## Générer un index.yaml à jour
Utilisez Helm pour générer un fichier `index.yaml` à jour en passant le chemin du répertoire et l'URL du dépôt distant à la commande `helm repo index` comme ceci :

```console
$ helm repo index fantastic-charts/ --url https://fantastic-charts.storage.googleapis.com
```
Cela va générer un fichier index.yaml actualisé et le placer dans le dossier `fantastic-charts/`.

## Synchroniser votre dépôt local et distant
Téléversez le contenu du dossier local, dans votre bucket GCS en exécutant `scripts/sync-repo.sh` et en passant le nom du dossier local et le nom du bucket GCS.

Pour exemple :
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

## Mettre à jour votre dépôt de chart
Vous voudrez garder une copie locale du contenu de votre dépôt de charts ou utiliser `gsutil rsync` pour copier le contenu de votre dépôt de charts distant vers un répertoire local.

Pour exemple :
```console
$ gsutil rsync -d -n gs://bucket-name local-dir/    # l'argument -n fait un essai à blanc
Building synchronization state...
Starting synchronization
Would copy gs://bucket-name/alpine-0.1.0.tgz to file://local-dir/alpine-0.1.0.tgz
Would copy gs://bucket-name/index.yaml to file://local-dir/index.yaml

$ gsutil rsync -d gs://bucket-name local-dir/       # effectue les actions de copie
Building synchronization state...
Starting synchronization
Copying gs://bucket-name/alpine-0.1.0.tgz...
Downloading file://local-dir/alpine-0.1.0.tgz:                        740 B/740 B
Copying gs://bucket-name/index.yaml...
Downloading file://local-dir/index.yaml:                              346 B/346 B
```

Liens utiles :
* Documentation sur [gsutil
  rsync](https://cloud.google.com/storage/docs/gsutil/commands/rsync#description)
* [Guide des dépôts de chart]({{< ref "/docs/topics/chart_repository.md" >}})
* Documentation sur [object versioning and concurrency
  control](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#overview)
  sur Google Cloud Storage
