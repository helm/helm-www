---
title: Οδηγός Γρήγορης Εκκίνησης
description: Πώς να εγκαταστήσετε και να ξεκινήσετε με το Helm, συμπεριλαμβανομένων οδηγιών για διανομές, συχνές ερωτήσεις και plugins.
sidebar_position: 1
---

Αυτός ο οδηγός καλύπτει πώς μπορείτε να ξεκινήσετε γρήγορα με το Helm.

## Προαπαιτούμενα {#prerequisites}

Τα ακόλουθα προαπαιτούμενα είναι απαραίτητα για μια επιτυχημένη και ασφαλή
χρήση του Helm:

1. Ένα Kubernetes cluster
2. Επιλογή ρυθμίσεων ασφαλείας για την εγκατάσταση, αν απαιτούνται
3. Εγκατάσταση και ρύθμιση του Helm

### Εγκαταστήστε το Kubernetes ή αποκτήστε πρόσβαση σε cluster {#install-kubernetes-or-have-access-to-a-cluster}

- Πρέπει να έχετε εγκατεστημένο το Kubernetes. Για την τελευταία έκδοση του Helm,
  προτείνουμε την πιο πρόσφατη σταθερή έκδοση του Kubernetes, η οποία στις
  περισσότερες περιπτώσεις είναι η προτελευταία minor έκδοση.
- Θα πρέπει επίσης να έχετε ένα τοπικά ρυθμισμένο αντίγραφο του `kubectl`.

Δείτε την [Πολιτική Υποστήριξης Εκδόσεων του Helm](https://helm.sh/docs/topics/version_skew/) για τη μέγιστη υποστηριζόμενη απόκλιση εκδόσεων μεταξύ Helm και Kubernetes.

## Εγκατάσταση του Helm {#install-helm}

Κατεβάστε μια binary έκδοση του Helm client. Μπορείτε να χρησιμοποιήσετε εργαλεία
όπως το `homebrew`, ή να δείτε [την επίσημη σελίδα εκδόσεων](https://github.com/helm/helm/releases).

Για περισσότερες λεπτομέρειες, ή για άλλες επιλογές, δείτε [τον οδηγό εγκατάστασης](/intro/install.md).

## Αρχικοποίηση ενός Helm Chart Repository {#initialize-a-helm-chart-repository}

Μόλις έχετε έτοιμο το Helm, μπορείτε να προσθέσετε ένα chart repository. Ελέγξτε
το [Artifact Hub](https://artifacthub.io/packages/search?kind=0) για διαθέσιμα
Helm chart repositories.

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

Μόλις προστεθεί, θα μπορείτε να δείτε τη λίστα με τα charts που μπορείτε να εγκαταστήσετε:

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... και πολλά άλλα {#and-many-more}
```

## Εγκατάσταση ενός Παραδείγματος Chart {#install-an-example-chart}

Για να εγκαταστήσετε ένα chart, μπορείτε να εκτελέσετε την εντολή `helm install`.
Το Helm προσφέρει διάφορους τρόπους για να βρείτε και να εγκαταστήσετε ένα chart,
αλλά ο ευκολότερος είναι να χρησιμοποιήσετε τα `bitnami` charts.

```console
$ helm repo update              # Make sure we get the latest list of charts
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

Στο παραπάνω παράδειγμα, εγκαταστάθηκε το chart `bitnami/mysql` και το όνομα
του νέου release είναι `mysql-1612624192`.

Μπορείτε να δείτε μια απλή περιγραφή των χαρακτηριστικών αυτού του MySQL chart
εκτελώντας `helm show chart bitnami/mysql`. Ή μπορείτε να εκτελέσετε
`helm show all bitnami/mysql` για να δείτε όλες τις πληροφορίες για το chart.

Κάθε φορά που εγκαθιστάτε ένα chart, δημιουργείται ένα νέο release. Έτσι, ένα
chart μπορεί να εγκατασταθεί πολλές φορές στο ίδιο cluster. Και κάθε release
μπορεί να διαχειρίζεται και να αναβαθμίζεται ανεξάρτητα.

Η εντολή `helm install` είναι μια πολύ ισχυρή εντολή με πολλές δυνατότητες. Για
να μάθετε περισσότερα, δείτε τον [Οδηγό Χρήσης του Helm](/intro/using_helm.md).

## Μάθετε για τα Releases {#learn-about-releases}

Είναι εύκολο να δείτε τι έχει εγκατασταθεί με το Helm:

```console
$ helm list
NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

Η εντολή `helm list` (ή `helm ls`) θα σας δείξει τη λίστα με όλα τα deployed releases.

## Απεγκατάσταση ενός Release {#uninstall-a-release}

Για να απεγκαταστήσετε ένα release, χρησιμοποιήστε την εντολή `helm uninstall`:

```console
$ helm uninstall mysql-1612624192
release "mysql-1612624192" uninstalled
```

Αυτό θα απεγκαταστήσει το `mysql-1612624192` από το Kubernetes, αφαιρώντας όλους
τους πόρους που σχετίζονται με το release καθώς και το ιστορικό του release.

Αν χρησιμοποιηθεί η flag `--keep-history`, το ιστορικό του release θα διατηρηθεί.
Θα μπορείτε να ζητήσετε πληροφορίες για αυτό το release:

```console
$ helm status mysql-1612624192
Status: UNINSTALLED
...
```

Επειδή το Helm παρακολουθεί τα releases σας ακόμα και μετά την απεγκατάστασή
τους, μπορείτε να ελέγξετε το ιστορικό ενός cluster και ακόμα να επαναφέρετε
ένα release (με την εντολή `helm rollback`).

## Ανάγνωση του Κειμένου Βοήθειας {#reading-the-help-text}

Για να μάθετε περισσότερα για τις διαθέσιμες εντολές του Helm, χρησιμοποιήστε
`helm help` ή πληκτρολογήστε μια εντολή ακολουθούμενη από τη flag `-h`:

```console
$ helm get -h
```
