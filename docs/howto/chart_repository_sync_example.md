---
title: Syncing Your Chart Repository
description: Describes how to synchronize your local and remote chart repositories.
sidebar_position: 2
---

*Note: This example is specifically for a Google Cloud Storage (GCS) bucket
which serves a chart repository.*

## Prerequisites
* Install the [gcloud CLI](https://docs.cloud.google.com/sdk/docs/install-sdk). *We
  rely heavily on the gcloud storage rsync functionality*
* Be sure to have access to the Helm binary
* _Optional: We recommend you set [object
  versioning](https://cloud.google.com/storage/docs/object-versioning)
  on your GCS bucket in case you accidentally delete something._

## Set up a local chart repository directory
Create a local directory like we did in [the chart repository guide](/topics/chart_repository.md), and place your packaged charts in that
directory.

For example:
```console
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
```

## Generate an updated index.yaml
Use Helm to generate an updated index.yaml file by passing in the directory path
and the url of the remote repository to the `helm repo index` command like this:

```console
$ helm repo index fantastic-charts/ --url https://fantastic-charts.storage.googleapis.com
```
This will generate an updated index.yaml file and place it in the
`fantastic-charts/` directory.

## Sync your local and remote chart repositories
Upload the contents of the directory to your GCS bucket by running the
[sync-repo.sh](https://github.com/helm/helm-www/blob/main/scriptexamples/sync-repo.sh) script and pass in the local
directory name and the GCS bucket name.

For example:
```console
$ ./sync-repo.sh fantastic-charts/ fantastic-charts
Getting ready to sync your local directory (fantastic-charts/) to a remote repository at gs://fantastic-charts
Verifying Prerequisites....
Thumbs up! Looks like you have gcloud. Let's continue.
Building synchronization state...
Starting synchronization
Would copy file://fantastic-charts/alpine-0.1.0.tgz to gs://fantastic-charts/alpine-0.1.0.tgz
Would copy file://fantastic-charts/index.yaml to gs://fantastic-charts/index.yaml
Are you sure you would like to continue with these changes? [y/N] y
Building synchronization state...
Starting synchronization
Copying file://fantastic-charts/alpine-0.1.0.tgz [Content-Type=application/x-tar]...
Uploading   gs://fantastic-charts/alpine-0.1.0.tgz:              740 B/740 B
Copying file://fantastic-charts/index.yaml [Content-Type=application/octet-stream]...
Uploading   gs://fantastic-charts/index.yaml:                    347 B/347 B
Congratulations your remote chart repository now matches the contents of fantastic-charts/
```
## Updating your chart repository
You'll want to keep a local copy of the contents of your chart repository or use
`gcloud storage rsync` to copy the contents of your remote chart repository to a local
directory.

For example:
```console
$ gcloud storage rsync --delete-unmatched-destination-objects --dry-run gs://bucket-name local-dir/
Building synchronization state...
Starting synchronization
Would copy gs://bucket-name/alpine-0.1.0.tgz to file://local-dir/alpine-0.1.0.tgz
Would copy gs://bucket-name/index.yaml to file://local-dir/index.yaml

$ gcloud storage rsync --delete-unmatched-destination-objects gs://bucket-name local-dir/
Building synchronization state...
Starting synchronization
Copying gs://bucket-name/alpine-0.1.0.tgz...
Downloading file://local-dir/alpine-0.1.0.tgz:                        740 B/740 B
Copying gs://bucket-name/index.yaml...
Downloading file://local-dir/index.yaml:                              346 B/346 B
```

Helpful Links:
* Documentation on [gcloud storage
  rsync](https://cloud.google.com/sdk/gcloud/reference/storage/rsync)
* [The Chart Repository Guide](/topics/chart_repository.md)
* Documentation on [object versioning](https://cloud.google.com/storage/docs/object-versioning)
  in Google Cloud Storage
