---
title: Χρήση Μητρώων OCI
description: Περιγράφει τη χρήση του OCI για τη διανομή Charts.
sidebar_position: 7
---

Από το Helm 3, μπορείτε να χρησιμοποιείτε container registries με υποστήριξη [OCI](https://www.opencontainers.org/) για την αποθήκευση και διαμοιρασμό πακέτων chart. Από το Helm v3.8.0, η υποστήριξη OCI είναι ενεργοποιημένη από προεπιλογή.


## Υποστήριξη OCI πριν από την v3.8.0

Η υποστήριξη OCI πέρασε από πειραματικό σε γενικά διαθέσιμο στάδιο με το Helm v3.8.0. Σε προηγούμενες εκδόσεις του Helm, η υποστήριξη OCI λειτουργούσε διαφορετικά. Αν χρησιμοποιούσατε υποστήριξη OCI πριν από το Helm v3.8.0, είναι σημαντικό να κατανοήσετε τι έχει αλλάξει στις διάφορες εκδόσεις του Helm.

### Ενεργοποίηση υποστήριξης OCI πριν από την v3.8.0

Πριν από το Helm v3.8.0, η υποστήριξη OCI είναι *πειραματική* και πρέπει να ενεργοποιηθεί χειροκίνητα.

Για να ενεργοποιήσετε την πειραματική υποστήριξη OCI σε εκδόσεις Helm πριν από την v3.8.0, ορίστε τη μεταβλητή `HELM_EXPERIMENTAL_OCI` στο περιβάλλον σας. Για παράδειγμα:

```console
export HELM_EXPERIMENTAL_OCI=1
```

### Απόσυρση λειτουργιών και αλλαγές συμπεριφοράς στην v3.8.0

Με την κυκλοφορία του [Helm v3.8.0](https://github.com/helm/helm/releases/tag/v3.8.0), οι ακόλουθες λειτουργίες και συμπεριφορές διαφέρουν από προηγούμενες εκδόσεις του Helm:

- Όταν ορίζετε ένα chart στις εξαρτήσεις ως OCI, η έκδοση μπορεί να οριστεί ως εύρος, όπως και στις υπόλοιπες εξαρτήσεις.
- Μπορείτε πλέον να αποστέλλετε και να χρησιμοποιείτε SemVer tags που περιλαμβάνουν πληροφορίες build. Τα OCI registries δεν υποστηρίζουν τον χαρακτήρα `+` στα tags. Το Helm μετατρέπει το `+` σε `_` κατά την αποθήκευση ως tag.
- Η εντολή `helm registry login` ακολουθεί πλέον την ίδια δομή με το Docker CLI για την αποθήκευση διαπιστευτηρίων. Μπορείτε να χρησιμοποιήσετε την ίδια τοποθεσία διαμόρφωσης registry τόσο για το Helm όσο και για το Docker CLI.

### Απόσυρση λειτουργιών και αλλαγές συμπεριφοράς στην v3.7.0

Με την κυκλοφορία του [Helm v3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0) υλοποιήθηκε το [HIP 6](https://github.com/helm/community/blob/main/hips/hip-0006.md) για την υποστήριξη OCI. Ως αποτέλεσμα, οι ακόλουθες λειτουργίες και συμπεριφορές διαφέρουν από προηγούμενες εκδόσεις του Helm:

- Η υποεντολή `helm chart` αφαιρέθηκε.
- Η προσωρινή μνήμη (cache) των charts αφαιρέθηκε (δεν υπάρχει πλέον `helm chart list` κτλ.).
- Οι αναφορές σε OCI registry ξεκινούν πλέον πάντα με το πρόθεμα `oci://`.
- Το basename της αναφοράς στο registry πρέπει *πάντα* να ταιριάζει με το όνομα του chart.
- Το tag της αναφοράς στο registry πρέπει *πάντα* να ταιριάζει με τη σημασιολογική έκδοση του chart (δηλαδή δεν επιτρέπονται `latest` tags).
- Ο media type του επιπέδου chart άλλαξε από `application/tar+gzip` σε `application/vnd.cncf.helm.chart.content.v1.tar+gzip`.


## Χρήση Μητρώου OCI

### Αποθετήρια Helm σε Μητρώα OCI

Ένα [αποθετήριο Helm](/topics/chart_repository.md) είναι ένας τρόπος φιλοξενίας και διανομής πακέτων Helm charts. Ένα μητρώο OCI μπορεί να περιέχει μηδέν ή περισσότερα αποθετήρια Helm, και κάθε αποθετήριο μπορεί να περιέχει μηδέν ή περισσότερα πακέτα Helm charts.

### Χρήση Φιλοξενούμενων Μητρώων

Υπάρχουν αρκετά φιλοξενούμενα container registries με υποστήριξη OCI που μπορείτε να χρησιμοποιήσετε για τα Helm charts σας. Για παράδειγμα:

- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-helm-repos#push-chart-to-registry-as-oci-artifact)
- [Cloudsmith](https://help.cloudsmith.io/docs/oci-repository)
- [Docker Hub](https://docs.docker.com/docker-hub/oci-artifacts/)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/helm/manage-charts)
- [Harbor](https://goharbor.io/docs/main/administration/user-defined-oci-artifact/)
- [IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_helm_charts)
- [JFrog Artifactory](https://jfrog.com/help/r/jfrog-artifactory-documentation/helm-oci-repositories)
- [RepoFlow](https://docs.repoflow.io/PackageTypes/helm#oci-helm-support)
  

Ακολουθήστε την τεκμηρίωση του παρόχου για να δημιουργήσετε και να διαμορφώσετε ένα registry με υποστήριξη OCI.

**Σημείωση:** Μπορείτε να εκτελέσετε τοπικά το [Docker Registry](https://docs.docker.com/registry/deploying/) ή το [`zot`](https://github.com/project-zot/zot), που είναι μητρώα OCI, στον υπολογιστή ανάπτυξής σας. Η τοπική εκτέλεση μητρώου OCI πρέπει να χρησιμοποιείται μόνο για δοκιμές.

### Χρήση sigstore για Υπογραφή Charts OCI

Το plugin [`helm-sigstore`](https://github.com/sigstore/helm-sigstore) επιτρέπει τη χρήση του [Sigstore](https://sigstore.dev/) για την υπογραφή Helm charts με τα ίδια εργαλεία που χρησιμοποιούνται για την υπογραφή container images. Αυτό αποτελεί εναλλακτική στην [προέλευση βασισμένη σε GPG](/topics/provenance.md) που υποστηρίζουν τα κλασικά [αποθετήρια chart](/topics/chart_repository.md).

Για περισσότερες λεπτομέρειες σχετικά με τη χρήση του plugin `helm sigstore`, ανατρέξτε στην [τεκμηρίωση του έργου](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md).

## Εντολές για Εργασία με Μητρώα

### Η Υποεντολή `registry`

#### `login`

Σύνδεση σε registry (με χειροκίνητη εισαγωγή κωδικού):

```console
$ helm registry login -u myuser localhost:5000
Password:
Login succeeded
```

#### `logout`

Αποσύνδεση από registry:

```console
$ helm registry logout localhost:5000
Logout succeeded
```

### Η Υποεντολή `push`

Αποστολή chart σε μητρώο OCI:

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

Η υποεντολή `push` μπορεί να χρησιμοποιηθεί μόνο με αρχεία `.tgz` που έχουν δημιουργηθεί προηγουμένως με το `helm package`.

Κατά τη χρήση του `helm push` για αποστολή chart σε OCI registry, η αναφορά πρέπει να ξεκινά με `oci://` και δεν πρέπει να περιέχει το basename ή το tag.

Το basename της αναφοράς στο registry εξάγεται από το όνομα του chart, και το tag εξάγεται από τη σημασιολογική έκδοση του chart. Αυτή είναι προς το παρόν αυστηρή απαίτηση.

Ορισμένα registries απαιτούν το repository ή/και το namespace (αν υπάρχει) να δημιουργηθεί εκ των προτέρων. Διαφορετικά, θα εμφανιστεί σφάλμα κατά την εκτέλεση του `helm push`.

Αν έχετε δημιουργήσει [αρχείο προέλευσης](/topics/provenance.md) (`.prov`) και βρίσκεται δίπλα στο αρχείο `.tgz` του chart, θα αποσταλεί αυτόματα στο registry κατά το `push`. Αυτό προσθέτει ένα επιπλέον επίπεδο στο [manifest του Helm chart](#manifest-helm-chart).

Οι χρήστες του [plugin helm-push](https://github.com/chartmuseum/helm-push) (για αποστολή charts στο [ChartMuseum](/topics/chart_repository.md#chartmuseum-repository-server)) μπορεί να αντιμετωπίσουν προβλήματα, καθώς το plugin συγκρούεται με τη νέα ενσωματωμένη εντολή `push`. Από την έκδοση v0.10.0, το plugin μετονομάστηκε σε `cm-push`.

### Άλλες Υποεντολές

Η υποστήριξη για το πρωτόκολλο `oci://` είναι διαθέσιμη και σε άλλες υποεντολές. Ακολουθεί η πλήρης λίστα:

- `helm pull`
- `helm push`
- `helm show `
- `helm template`
- `helm install`
- `helm upgrade`

Το basename (όνομα chart) της αναφοράς στο registry *συμπεριλαμβάνεται* σε κάθε ενέργεια που περιλαμβάνει λήψη chart (σε αντίθεση με το `helm push` όπου παραλείπεται).

Ακολουθούν μερικά παραδείγματα χρήσης των παραπάνω υποεντολών με charts OCI:

```
$ helm pull oci://localhost:5000/helm-charts/mychart --version 0.1.0
Pulled: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:0be7ec9fb7b962b46d81e4bb74fdcdb7089d965d3baca9f85d64948b05b402ff

$ helm show all oci://localhost:5000/helm-charts/mychart --version 0.1.0
apiVersion: v2
appVersion: 1.16.0
description: A Helm chart for Kubernetes
name: mychart
...

$ helm template myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
---
# Source: mychart/templates/serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
...

$ helm install myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...

$ helm upgrade myrelease oci://localhost:5000/helm-charts/mychart --version 0.2.0
Release "myrelease" has been upgraded. Happy Helming!
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:12:05 2021
NAMESPACE: default
STATUS: deployed
REVISION: 2
NOTES:
...
```

## Εγκατάσταση Charts με Digest

Η εγκατάσταση chart με digest είναι πιο ασφαλής από τη χρήση tag, επειδή τα digests είναι αμετάβλητα. Το digest καθορίζεται στο URI του chart:

```
$ helm install myrelease oci://localhost:5000/helm-charts/mychart@sha256:52ccaee6d4dd272e54bfccda77738b42e1edf0e4a20c27e23f0b6c15d01aef79
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...
```

## Καθορισμός Εξαρτήσεων

Μπορείτε να λάβετε εξαρτήσεις ενός chart από registry χρησιμοποιώντας την υποεντολή `dependency update`.

Το `repository` για μια καταχώρηση στο `Chart.yaml` καθορίζεται ως η αναφορά στο registry χωρίς το basename:

```
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```
Αυτό θα ανακτήσει το `oci://localhost:5000/myrepo/mychart:2.7.0` κατά την εκτέλεση του `dependency update`.

## Manifest Helm Chart

Παράδειγμα manifest Helm chart όπως αναπαρίσταται σε registry
(σημειώστε τα πεδία `mediaType`):
```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    }
  ]
}
```

Το ακόλουθο παράδειγμα περιέχει [αρχείο προέλευσης](/topics/provenance.md)
(σημειώστε το επιπλέον επίπεδο):

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    },
    {
      "mediaType": "application/vnd.cncf.helm.chart.provenance.v1.prov",
      "digest": "sha256:3e207b409db364b595ba862cdc12be96dcdad8e36c59a03b7b3b61c946a5741a",
      "size": 643
    }
  ]
}
```

## Μετάβαση από Αποθετήρια Chart

Η μετάβαση από κλασικά [αποθετήρια chart](/topics/chart_repository.md)
(αποθετήρια με index.yaml) είναι απλή: χρησιμοποιήστε το `helm pull` για λήψη και στη συνέχεια το `helm push` για αποστολή των αρχείων `.tgz` σε ένα registry.
