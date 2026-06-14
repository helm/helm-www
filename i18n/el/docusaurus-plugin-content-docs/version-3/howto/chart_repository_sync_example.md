---
title: Συγχρονισμός Αποθετηρίου Chart
description: Περιγράφει πώς να συγχρονίσετε τα τοπικά και απομακρυσμένα αποθετήρια chart.
sidebar_position: 2
---

*Σημείωση: Αυτό το παράδειγμα αφορά συγκεκριμένα ένα bucket Google Cloud Storage (GCS)
που εξυπηρετεί ένα αποθετήριο chart.*

## Προαπαιτούμενα {#prerequisites}
* Εγκαταστήστε το εργαλείο [gsutil](https://cloud.google.com/storage/docs/gsutil). *Βασιζόμαστε
  σε μεγάλο βαθμό στη λειτουργικότητα rsync του gsutil*
* Βεβαιωθείτε ότι έχετε πρόσβαση στο εκτελέσιμο του Helm
* _Προαιρετικό: Συνιστούμε να ενεργοποιήσετε την [εκδοσιοποίηση αντικειμένων](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#top_of_page)
  στο GCS bucket σας, σε περίπτωση που διαγράψετε κατά λάθος κάτι._

## Δημιουργία τοπικού καταλόγου αποθετηρίου chart {#set-up-a-local-chart-repository-directory}
Δημιουργήστε έναν τοπικό κατάλογο όπως κάναμε στον [οδηγό αποθετηρίου chart](/topics/chart_repository.md), και τοποθετήστε τα πακεταρισμένα charts σας σε αυτόν τον κατάλογο.

Για παράδειγμα:
```console
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
```

## Δημιουργία ενημερωμένου index.yaml {#generate-an-updated-indexyaml}
Χρησιμοποιήστε το Helm για να δημιουργήσετε ένα ενημερωμένο αρχείο index.yaml, περνώντας τη διαδρομή
του καταλόγου και το URL του απομακρυσμένου αποθετηρίου στην εντολή `helm repo index`, ως εξής:

```console
$ helm repo index fantastic-charts/ --url https://fantastic-charts.storage.googleapis.com
```
Αυτό θα δημιουργήσει ένα ενημερωμένο αρχείο index.yaml και θα το τοποθετήσει στον
κατάλογο `fantastic-charts/`.

## Συγχρονισμός τοπικού και απομακρυσμένου αποθετηρίου chart {#sync-your-local-and-remote-chart-repositories}
Ανεβάστε τα περιεχόμενα του καταλόγου στο GCS bucket σας εκτελώντας
`scripts/sync-repo.sh` και περνώντας το όνομα του τοπικού καταλόγου και το όνομα του GCS bucket.

Για παράδειγμα:
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
## Ενημέρωση του αποθετηρίου chart {#updating-your-chart-repository}
Καλό είναι να διατηρείτε ένα τοπικό αντίγραφο των περιεχομένων του αποθετηρίου chart σας ή να
χρησιμοποιείτε το `gsutil rsync` για να αντιγράψετε τα περιεχόμενα του απομακρυσμένου αποθετηρίου
chart σε έναν τοπικό κατάλογο.

Για παράδειγμα:
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

Χρήσιμοι σύνδεσμοι:
* Τεκμηρίωση για το [gsutil
  rsync](https://cloud.google.com/storage/docs/gsutil/commands/rsync#description)
* [Ο οδηγός αποθετηρίου chart](/topics/chart_repository.md)
* Τεκμηρίωση για την [εκδοσιοποίηση αντικειμένων και τον έλεγχο ταυτοχρονισμού](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#overview)
  στο Google Cloud Storage
