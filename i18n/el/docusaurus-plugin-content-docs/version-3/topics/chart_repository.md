---
title: Οδηγός Αποθετηρίου Chart
description: Πώς να δημιουργήσετε και να εργαστείτε με αποθετήρια Helm chart.
sidebar_position: 6
---

Αυτή η ενότητα εξηγεί πώς να δημιουργήσετε και να εργαστείτε με αποθετήρια Helm chart.
Ουσιαστικά, ένα αποθετήριο chart είναι μια τοποθεσία όπου μπορούν να αποθηκεύονται
και να διαμοιράζονται πακεταρισμένα charts.

Το κατανεμημένο κοινοτικό αποθετήριο Helm chart βρίσκεται στο
[Artifact Hub](https://artifacthub.io/packages/search?kind=0) και δέχεται
συνεισφορές. Ωστόσο, το Helm επιτρέπει επίσης τη δημιουργία και λειτουργία του δικού σας
αποθετηρίου chart. Αυτός ο οδηγός εξηγεί πώς να το κάνετε. Αν σκέφτεστε να δημιουργήσετε ένα
αποθετήριο chart, ίσως θέλετε να εξετάσετε τη χρήση ενός
[μητρώου OCI](/topics/registries.md) ως εναλλακτική.

## Προαπαιτούμενα {#prerequisites}

* Ολοκληρώστε τον οδηγό [Γρήγορης Εκκίνησης](/intro/quickstart.md)
* Διαβάστε το έγγραφο [Charts](/topics/charts.md)

## Δημιουργία αποθετηρίου chart {#create-a-chart-repository}

Ένα _αποθετήριο chart_ είναι ένας διακομιστής HTTP που φιλοξενεί ένα αρχείο `index.yaml`
και προαιρετικά κάποια πακεταρισμένα charts. Όταν είστε έτοιμοι να διαμοιραστείτε τα
charts σας, ο προτιμώμενος τρόπος είναι να τα ανεβάσετε σε ένα αποθετήριο chart.

Από το Helm 2.2.0, υποστηρίζεται η αυθεντικοποίηση SSL πελάτη προς ένα αποθετήριο.
Άλλα πρωτόκολλα αυθεντικοποίησης μπορεί να είναι διαθέσιμα ως plugins.

Επειδή ένα αποθετήριο chart μπορεί να είναι οποιοσδήποτε διακομιστής HTTP που μπορεί
να εξυπηρετεί αρχεία YAML και tar και να απαντά σε αιτήματα GET, έχετε πολλές επιλογές
όταν πρόκειται να φιλοξενήσετε το δικό σας αποθετήριο chart. Για παράδειγμα, μπορείτε
να χρησιμοποιήσετε ένα Google Cloud Storage (GCS) bucket, Amazon S3 bucket,
GitHub Pages, ή ακόμα να δημιουργήσετε τον δικό σας διακομιστή ιστού.

### Η δομή του αποθετηρίου chart {#the-chart-repository-structure}

Ένα αποθετήριο chart αποτελείται από πακεταρισμένα charts και ένα ειδικό αρχείο που
ονομάζεται `index.yaml`, το οποίο περιέχει ένα ευρετήριο όλων των charts στο αποθετήριο.
Συχνά, τα charts που περιγράφει το `index.yaml` φιλοξενούνται επίσης στον ίδιο
διακομιστή, όπως και τα [αρχεία προέλευσης](/topics/provenance.md).

Για παράδειγμα, η διάρθρωση του αποθετηρίου `https://example.com/charts` μπορεί
να μοιάζει ως εξής:

```
charts/
  |
  |- index.yaml
  |
  |- alpine-0.1.2.tgz
  |
  |- alpine-0.1.2.tgz.prov
```

Σε αυτή την περίπτωση, το αρχείο ευρετηρίου θα περιέχει πληροφορίες για ένα chart,
το Alpine chart, και θα παρέχει τη διεύθυνση λήψης
`https://example.com/charts/alpine-0.1.2.tgz` για αυτό το chart.

Δεν είναι απαραίτητο το πακέτο chart να βρίσκεται στον ίδιο διακομιστή με το αρχείο
`index.yaml`. Ωστόσο, αυτό είναι συνήθως η ευκολότερη λύση.

### Το αρχείο ευρετηρίου {#the-index-file}

Το αρχείο ευρετηρίου είναι ένα αρχείο yaml που ονομάζεται `index.yaml`. Περιέχει κάποια
μεταδεδομένα για το πακέτο, συμπεριλαμβανομένων των περιεχομένων του αρχείου
`Chart.yaml` ενός chart. Ένα έγκυρο αποθετήριο chart πρέπει να έχει ένα αρχείο ευρετηρίου.
Το αρχείο ευρετηρίου περιέχει πληροφορίες για κάθε chart στο αποθετήριο chart.
Η εντολή `helm repo index` θα δημιουργήσει ένα αρχείο ευρετηρίου βασισμένο σε έναν
τοπικό κατάλογο που περιέχει πακεταρισμένα charts.

Αυτό είναι ένα παράδειγμα αρχείου ευρετηρίου:

```yaml
apiVersion: v1
entries:
  alpine:
    - created: 2016-10-06T16:23:20.499814565-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 99c76e403d752c84ead610644d4b1c2f2b453a74b921f422b9dcb8a7c8b559cd
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.2.0.tgz
      version: 0.2.0
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 515c58e5f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cd78727
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.1.0.tgz
      version: 0.1.0
  nginx:
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Create a basic nginx HTTP server
      digest: aaff4545f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cdffffff
      home: https://helm.sh/helm
      name: nginx
      sources:
      - https://github.com/helm/charts
      urls:
      - https://technosophos.github.io/tscharts/nginx-1.1.0.tgz
      version: 1.1.0
generated: 2016-10-06T16:23:20.499029981-06:00
```

## Φιλοξενία Αποθετηρίων Chart {#hosting-chart-repositories}

Αυτό το μέρος παρουσιάζει διάφορους τρόπους εξυπηρέτησης ενός αποθετηρίου chart.

### Google Cloud Storage {#google-cloud-storage}

Το πρώτο βήμα είναι να **δημιουργήσετε το GCS bucket σας**. Θα ονομάσουμε το δικό μας
`fantastic-charts`.

![Δημιουργία GCS Bucket](/img/helm2/create-a-bucket.png)

Στη συνέχεια, κάντε το bucket σας δημόσιο **επεξεργαζόμενοι τα δικαιώματα του bucket**.

![Επεξεργασία Δικαιωμάτων](/img/helm2/edit-permissions.png)

Εισάγετε αυτή τη γραμμή για να **κάνετε το bucket σας δημόσιο**:

![Κάντε το Bucket Δημόσιο](/img/helm2/make-bucket-public.png)

Συγχαρητήρια, τώρα έχετε ένα κενό GCS bucket έτοιμο να εξυπηρετήσει charts!

Μπορείτε να ανεβάσετε το αποθετήριο chart σας χρησιμοποιώντας το εργαλείο γραμμής
εντολών Google Cloud Storage ή τη διεπαφή ιστού GCS. Ένα δημόσιο GCS bucket μπορεί
να προσπελαστεί μέσω απλού HTTPS στη διεύθυνση: `https://bucket-name.storage.googleapis.com/`.

### Cloudsmith {#cloudsmith}

Μπορείτε επίσης να δημιουργήσετε αποθετήρια chart χρησιμοποιώντας το Cloudsmith.
Διαβάστε περισσότερα για τα αποθετήρια chart με Cloudsmith
[εδώ](https://help.cloudsmith.io/docs/helm-chart-repository).

### JFrog Artifactory {#jfrog-artifactory}

Παρομοίως, μπορείτε να δημιουργήσετε αποθετήρια chart χρησιμοποιώντας το JFrog Artifactory.
Διαβάστε περισσότερα για τα αποθετήρια chart με JFrog Artifactory
[εδώ](https://www.jfrog.com/confluence/display/RTF/Helm+Chart+Repositories).

### Παράδειγμα με GitHub Pages {#github-pages-example}

Με παρόμοιο τρόπο μπορείτε να δημιουργήσετε αποθετήριο charts χρησιμοποιώντας GitHub Pages.

Το GitHub σάς επιτρέπει να εξυπηρετείτε στατικές ιστοσελίδες με δύο διαφορετικούς τρόπους:

- Διαμορφώνοντας ένα έργο να εξυπηρετεί τα περιεχόμενα του καταλόγου `docs/`
- Διαμορφώνοντας ένα έργο να εξυπηρετεί ένα συγκεκριμένο branch

Θα ακολουθήσουμε τη δεύτερη προσέγγιση, αν και η πρώτη είναι εξίσου εύκολη.

Το πρώτο βήμα θα είναι να **δημιουργήσετε το gh-pages branch σας**. Μπορείτε να το
κάνετε τοπικά ως εξής:

```console
$ git checkout -b gh-pages
```

Ή μέσω browser χρησιμοποιώντας το κουμπί **Branch** στο GitHub repository σας:

![Δημιουργία GitHub Pages branch](/img/helm2/create-a-gh-page-button.png)

Στη συνέχεια, θέλετε να βεβαιωθείτε ότι το **gh-pages branch** σας έχει οριστεί ως
GitHub Pages. Κάντε κλικ στις **Settings** του repository σας και μετακινηθείτε
στην ενότητα **GitHub pages** και ρυθμίστε ως εξής:

![Δημιουργία GitHub Pages branch](/img/helm2/set-a-gh-page.png)

Από προεπιλογή, το **Source** συνήθως ορίζεται στο **gh-pages branch**. Αν αυτό
δεν είναι ρυθμισμένο από προεπιλογή, τότε επιλέξτε το.

Μπορείτε να χρησιμοποιήσετε ένα **custom domain** αν θέλετε.

Και βεβαιωθείτε ότι το **Enforce HTTPS** είναι επιλεγμένο, έτσι ώστε το **HTTPS**
να χρησιμοποιείται κατά την εξυπηρέτηση των charts.

Με αυτή τη ρύθμιση μπορείτε να χρησιμοποιήσετε το default branch σας για να
αποθηκεύσετε τον κώδικα των charts σας, και το **gh-pages branch** ως αποθετήριο
charts, π.χ.: `https://USERNAME.github.io/REPONAME`. Το επιδεικτικό αποθετήριο
[TS Charts](https://github.com/technosophos/tscharts) είναι προσβάσιμο στη διεύθυνση
`https://technosophos.github.io/tscharts/`.

Αν έχετε αποφασίσει να χρησιμοποιήσετε GitHub pages για να φιλοξενήσετε το αποθετήριο
chart, δείτε το [Chart Releaser Action](/howto/chart_releaser_action.md).
Το Chart Releaser Action είναι μια ροή εργασίας GitHub Action για τη μετατροπή ενός
GitHub project σε αυτο-φιλοξενούμενο αποθετήριο Helm chart, χρησιμοποιώντας το
εργαλείο CLI [helm/chart-releaser](https://github.com/helm/chart-releaser).

### Απλοί διακομιστές ιστού {#ordinary-web-servers}

Για να διαμορφώσετε έναν απλό διακομιστή ιστού να εξυπηρετεί Helm charts, χρειάζεται
απλώς να κάνετε τα εξής:

- Τοποθετήστε το ευρετήριο και τα charts σας σε έναν κατάλογο που μπορεί να εξυπηρετήσει
  ο διακομιστής
- Βεβαιωθείτε ότι το αρχείο `index.yaml` είναι προσβάσιμο χωρίς απαίτηση
  αυθεντικοποίησης
- Βεβαιωθείτε ότι τα αρχεία `yaml` εξυπηρετούνται με τον σωστό τύπο περιεχομένου
  (`text/yaml` ή `text/x-yaml`)

Για παράδειγμα, αν θέλετε να εξυπηρετήσετε τα charts σας από το `$WEBROOT/charts`,
βεβαιωθείτε ότι υπάρχει ένας κατάλογος `charts/` στο web root σας, και τοποθετήστε
το αρχείο ευρετηρίου και τα charts μέσα σε αυτόν τον φάκελο.

### Διακομιστής Αποθετηρίου ChartMuseum {#chartmuseum-repository-server}

Το ChartMuseum είναι ένας ανοιχτού κώδικα διακομιστής αποθετηρίου Helm Chart
γραμμένος σε Go (Golang), με υποστήριξη για backends αποθήκευσης cloud,
συμπεριλαμβανομένων [Google Cloud Storage](https://cloud.google.com/storage/),
[Amazon S3](https://aws.amazon.com/s3/),
[Microsoft Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/),
[Alibaba Cloud OSS Storage](https://www.alibabacloud.com/product/oss),
[Openstack Object Storage](https://developer.openstack.org/api-ref/object-store/),
[Oracle Cloud Infrastructure Object Storage](https://cloud.oracle.com/storage),
[Baidu Cloud BOS Storage](https://cloud.baidu.com/product/bos.html),
[Tencent Cloud Object Storage](https://intl.cloud.tencent.com/product/cos),
[DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/),
[Minio](https://min.io/), και [etcd](https://etcd.io/).

Μπορείτε επίσης να χρησιμοποιήσετε τον διακομιστή
[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)
για να φιλοξενήσετε ένα αποθετήριο chart από ένα τοπικό σύστημα αρχείων.

### Μητρώο Πακέτων GitLab {#gitlab-package-registry}

Με το GitLab μπορείτε να δημοσιεύσετε Helm charts στο Package Registry του
project σας. Διαβάστε περισσότερα για τη ρύθμιση ενός αποθετηρίου Helm πακέτων
με GitLab [εδώ](https://docs.gitlab.com/ee/user/packages/helm_repository/).

## Διαχείριση Αποθετηρίων Chart {#managing-chart-repositories}

Τώρα που έχετε ένα αποθετήριο chart, το τελευταίο μέρος αυτού του οδηγού εξηγεί
πώς να διατηρείτε τα charts σε αυτό το αποθετήριο.

### Αποθήκευση charts στο αποθετήριο chart σας {#store-charts-in-your-chart-repository}

Τώρα που έχετε ένα αποθετήριο chart, ας ανεβάσουμε ένα chart και ένα αρχείο
ευρετηρίου στο αποθετήριο. Τα charts σε ένα αποθετήριο chart πρέπει να είναι
πακεταρισμένα (`helm package chart-name/`) και σωστά εκδοθέντα (ακολουθώντας τις
οδηγίες [SemVer 2](https://semver.org/)).

Τα επόμενα βήματα αποτελούν ένα παράδειγμα ροής εργασίας, αλλά μπορείτε να
χρησιμοποιήσετε όποια ροή εργασίας προτιμάτε για την αποθήκευση και ενημέρωση
charts στο αποθετήριο chart σας.

Αφού έχετε ένα πακεταρισμένο chart έτοιμο, δημιουργήστε έναν νέο κατάλογο και
μετακινήστε το πακεταρισμένο chart σας σε αυτόν τον κατάλογο.

```console
$ helm package docs/examples/alpine/
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
$ helm repo index fantastic-charts --url https://fantastic-charts.storage.googleapis.com
```

Η τελευταία εντολή παίρνει τη διαδρομή του τοπικού καταλόγου που μόλις δημιουργήσατε
και τη διεύθυνση URL του απομακρυσμένου αποθετηρίου chart σας και συνθέτει ένα αρχείο
`index.yaml` μέσα στη δεδομένη διαδρομή καταλόγου.

Τώρα μπορείτε να ανεβάσετε το chart και το αρχείο ευρετηρίου στο αποθετήριο chart σας
χρησιμοποιώντας ένα εργαλείο συγχρονισμού ή χειροκίνητα. Αν χρησιμοποιείτε Google
Cloud Storage, δείτε αυτό το
[παράδειγμα ροής εργασίας](/howto/chart_repository_sync_example.md)
χρησιμοποιώντας τον gsutil client. Για GitHub, μπορείτε απλά να τοποθετήσετε τα
charts στο κατάλληλο branch προορισμού.

### Προσθήκη νέων charts σε υπάρχον αποθετήριο {#add-new-charts-to-an-existing-repository}

Κάθε φορά που θέλετε να προσθέσετε ένα νέο chart στο αποθετήριό σας, πρέπει να
αναδημιουργήσετε το ευρετήριο. Η εντολή `helm repo index` θα ξαναχτίσει πλήρως
το αρχείο `index.yaml` από την αρχή, συμπεριλαμβάνοντας μόνο τα charts που βρίσκει
τοπικά.

Ωστόσο, μπορείτε να χρησιμοποιήσετε τη σημαία `--merge` για να προσθέσετε
σταδιακά νέα charts σε ένα υπάρχον αρχείο `index.yaml` (μια εξαιρετική επιλογή
όταν εργάζεστε με απομακρυσμένο αποθετήριο όπως το GCS). Εκτελέστε
`helm repo index --help` για να μάθετε περισσότερα.

Βεβαιωθείτε ότι ανεβάζετε τόσο το αναθεωρημένο αρχείο `index.yaml` όσο και το
chart. Και αν δημιουργήσατε αρχείο προέλευσης, ανεβάστε και αυτό.

### Διαμοιρασμός των charts σας με άλλους {#share-your-charts-with-others}

Όταν είστε έτοιμοι να διαμοιραστείτε τα charts σας, απλά ενημερώστε κάποιον ποια
είναι η διεύθυνση URL του αποθετηρίου σας.

Από εκεί, θα προσθέσουν το αποθετήριο στον Helm client τους μέσω της εντολής
`helm repo add [ΟΝΟΜΑ] [URL]` με οποιοδήποτε όνομα θέλουν να χρησιμοποιήσουν για
να αναφέρονται στο αποθετήριο.

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

Αν τα charts υποστηρίζονται από βασική αυθεντικοποίηση HTTP, μπορείτε επίσης να
παρέχετε το όνομα χρήστη και τον κωδικό πρόσβασης εδώ:

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

**Σημείωση:** Ένα αποθετήριο δεν θα προστεθεί αν δεν περιέχει ένα έγκυρο
`index.yaml`.

**Σημείωση:** Αν το αποθετήριο Helm σας χρησιμοποιεί π.χ. αυτο-υπογεγραμμένο
πιστοποιητικό, μπορείτε να χρησιμοποιήσετε `helm repo add --insecure-skip-tls-verify ...`
για να παραλείψετε την επαλήθευση CA.

Μετά από αυτό, οι χρήστες σας θα μπορούν να αναζητούν στα charts σας. Αφού
ενημερώσετε το αποθετήριο, μπορούν να χρησιμοποιήσουν την εντολή `helm repo update`
για να λάβουν τις τελευταίες πληροφορίες charts.

*Εσωτερικά, οι εντολές `helm repo add` και `helm repo update` ανακτούν το αρχείο
index.yaml και το αποθηκεύουν στον κατάλογο `$XDG_CACHE_HOME/helm/repository/cache/`.
Εκεί βρίσκει η συνάρτηση `helm search` πληροφορίες για τα charts.*
