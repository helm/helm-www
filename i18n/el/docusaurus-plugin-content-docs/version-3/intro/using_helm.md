---
title: Χρήση του Helm
description: Εξηγεί τα βασικά του Helm.
sidebar_position: 3
---

Αυτός ο οδηγός εξηγεί τα βασικά της χρήσης του Helm για τη διαχείριση πακέτων
στο Kubernetes cluster σας. Προϋποθέτει ότι έχετε ήδη [εγκαταστήσει](/intro/install.md) τον Helm client.

Αν απλά θέλετε να εκτελέσετε μερικές γρήγορες εντολές, μπορείτε να ξεκινήσετε
με τον [Οδηγό Γρήγορης Εκκίνησης](/intro/quickstart.md). Αυτό το κεφάλαιο
καλύπτει τις λεπτομέρειες των εντολών του Helm και εξηγεί πώς να το χρησιμοποιείτε.

## Τρεις Βασικές Έννοιες {#three-big-concepts}

Ένα *Chart* είναι ένα πακέτο Helm. Περιέχει όλους τους ορισμούς πόρων
που απαιτούνται για την εκτέλεση μιας εφαρμογής, εργαλείου ή υπηρεσίας μέσα σε
ένα Kubernetes cluster. Σκεφτείτε το σαν το αντίστοιχο του Kubernetes για ένα
Homebrew formula, ένα Apt dpkg ή ένα Yum RPM αρχείο.

Ένα *Repository* είναι ο χώρος όπου τα charts μπορούν να συγκεντρωθούν και να
μοιραστούν. Είναι σαν το [αρχείο CPAN](https://www.cpan.org) της Perl ή τη
[Βάση Δεδομένων Πακέτων Fedora](https://src.fedoraproject.org/), αλλά για
πακέτα Kubernetes.

Ένα *Release* είναι μια υπόσταση ενός chart που εκτελείται σε ένα Kubernetes
cluster. Ένα chart μπορεί συχνά να εγκατασταθεί πολλές φορές στο ίδιο cluster.
Και κάθε φορά που εγκαθίσταται, δημιουργείται ένα νέο _release_. Σκεφτείτε ένα
MySQL chart. Αν θέλετε δύο βάσεις δεδομένων στο cluster σας, μπορείτε να
εγκαταστήσετε αυτό το chart δύο φορές. Κάθε μία θα έχει το δικό της _release_,
το οποίο με τη σειρά του θα έχει το δικό του _release name_.

Με αυτά υπόψη, μπορούμε τώρα να εξηγήσουμε το Helm ως εξής:

Το Helm εγκαθιστά _charts_ στο Kubernetes, δημιουργώντας ένα νέο _release_ για
κάθε εγκατάσταση. Και για να βρείτε νέα charts, μπορείτε να αναζητήσετε σε
_repositories_ charts του Helm.

## 'helm search': Εύρεση Charts {#helm-search-finding-charts}

Το Helm διαθέτει μια ισχυρή εντολή αναζήτησης. Μπορεί να χρησιμοποιηθεί για
αναζήτηση σε δύο διαφορετικούς τύπους πηγών:

- Η `helm search hub` αναζητά στο [Artifact Hub](https://artifacthub.io), το
  οποίο παραθέτει helm charts από δεκάδες διαφορετικά repositories.
- Η `helm search repo` αναζητά στα repositories που έχετε προσθέσει στον τοπικό
  σας helm client (με την εντολή `helm repo add`). Αυτή η αναζήτηση γίνεται σε
  τοπικά δεδομένα και δεν απαιτείται σύνδεση δημόσιου δικτύου.

Μπορείτε να βρείτε δημόσια διαθέσιμα charts εκτελώντας `helm search hub`:

```console
$ helm search hub wordpress
URL                                                 CHART VERSION APP VERSION DESCRIPTION
https://hub.helm.sh/charts/bitnami/wordpress        7.6.7         5.2.4       Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.6.3        v0.6.3      Presslabs WordPress Operator Helm Chart
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.7.1        v0.7.1      A Helm chart for deploying a WordPress site on ...
```

Η παραπάνω εντολή αναζητά όλα τα charts `wordpress` στο Artifact Hub.

Χωρίς φίλτρο, η `helm search hub` σας δείχνει όλα τα διαθέσιμα charts.

Η `helm search hub` εμφανίζει τη διεύθυνση URL στη θέση στο [artifacthub.io](https://artifacthub.io/) αλλά όχι το πραγματικό Helm repo. Η `helm search hub --list-repo-url` εμφανίζει την πραγματική διεύθυνση URL του Helm repo, κάτι που είναι χρήσιμο όταν θέλετε να προσθέσετε ένα νέο repo: `helm repo add [NAME] [URL]`.

Χρησιμοποιώντας την `helm search repo`, μπορείτε να βρείτε τα ονόματα των charts
στα repositories που έχετε ήδη προσθέσει:

```console
$ helm repo add brigade https://brigadecore.github.io/charts
"brigade" has been added to your repositories
$ helm search repo brigade
NAME                          CHART VERSION APP VERSION DESCRIPTION
brigade/brigade               1.3.2         v1.2.1      Brigade provides event-driven scripting of Kube...
brigade/brigade-github-app    0.4.1         v0.2.1      The Brigade GitHub App, an advanced gateway for...
brigade/brigade-github-oauth  0.2.0         v0.20.0     The legacy OAuth GitHub Gateway for Brigade
brigade/brigade-k8s-gateway   0.1.0                     A Helm chart for Kubernetes
brigade/brigade-project       1.0.0         v1.0.0      Create a Brigade project
brigade/kashti                0.4.0         v0.4.0      A Helm chart for Kubernetes
```

Η αναζήτηση Helm χρησιμοποιεί έναν αλγόριθμο ασαφούς αντιστοίχισης συμβολοσειρών,
οπότε μπορείτε να πληκτρολογήσετε μέρη λέξεων ή φράσεων:

```console
$ helm search repo kash
NAME            CHART VERSION APP VERSION DESCRIPTION
brigade/kashti  0.4.0         v0.4.0      A Helm chart for Kubernetes
```

Η αναζήτηση είναι ένας καλός τρόπος για να βρείτε διαθέσιμα πακέτα. Μόλις βρείτε
ένα πακέτο που θέλετε να εγκαταστήσετε, μπορείτε να χρησιμοποιήσετε την
`helm install` για να το εγκαταστήσετε.

## 'helm install': Εγκατάσταση Πακέτου {#helm-install-installing-a-package}

Για να εγκαταστήσετε ένα νέο πακέτο, χρησιμοποιήστε την εντολή `helm install`.
Στην απλούστερη μορφή της, δέχεται δύο ορίσματα: Ένα release name της επιλογής
σας και το όνομα του chart που θέλετε να εγκαταστήσετε.

```console
$ helm install happy-panda bitnami/wordpress
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

Τώρα το chart `wordpress` έχει εγκατασταθεί. Σημειώστε ότι η εγκατάσταση ενός
chart δημιουργεί ένα νέο αντικείμενο _release_. Το παραπάνω release ονομάζεται
`happy-panda`. (Αν θέλετε το Helm να δημιουργήσει ένα όνομα για εσάς, παραλείψτε
το release name και χρησιμοποιήστε `--generate-name`.)

Κατά την εγκατάσταση, ο `helm` client θα εκτυπώσει χρήσιμες πληροφορίες σχετικά
με τους πόρους που δημιουργήθηκαν, την κατάσταση του release, καθώς και αν
υπάρχουν επιπλέον βήματα ρύθμισης παραμέτρων που μπορείτε ή πρέπει να κάνετε.

Το Helm εγκαθιστά πόρους με την ακόλουθη σειρά:

- Namespace
- NetworkPolicy
- ResourceQuota
- LimitRange
- PodSecurityPolicy
- PodDisruptionBudget
- ServiceAccount
- Secret
- SecretList
- ConfigMap
- StorageClass
- PersistentVolume
- PersistentVolumeClaim
- CustomResourceDefinition
- ClusterRole
- ClusterRoleList
- ClusterRoleBinding
- ClusterRoleBindingList
- Role
- RoleList
- RoleBinding
- RoleBindingList
- Service
- DaemonSet
- Pod
- ReplicationController
- ReplicaSet
- Deployment
- HorizontalPodAutoscaler
- StatefulSet
- Job
- CronJob
- Ingress
- APIService
- MutatingWebhookConfiguration
- ValidatingWebhookConfiguration

Το Helm δεν περιμένει μέχρι να εκτελούνται όλοι οι πόροι πριν τερματίσει. Πολλά
charts απαιτούν Docker images που είναι πάνω από 600MB σε μέγεθος και μπορεί να
χρειαστεί πολύς χρόνος για να εγκατασταθούν στο cluster.

Για να παρακολουθήσετε την κατάσταση ενός release ή για να ξαναδιαβάσετε
πληροφορίες ρύθμισης παραμέτρων, μπορείτε να χρησιμοποιήσετε την `helm status`:

```console
$ helm status happy-panda
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

Τα παραπάνω δείχνουν την τρέχουσα κατάσταση του release σας.

### Προσαρμογή του Chart Πριν την Εγκατάσταση {#customizing-the-chart-before-installing}

Η εγκατάσταση με τον τρόπο που δείξαμε θα χρησιμοποιήσει μόνο τις προεπιλεγμένες
επιλογές ρύθμισης παραμέτρων για αυτό το chart. Πολλές φορές θα θέλετε να
προσαρμόσετε το chart ώστε να χρησιμοποιεί τη ρύθμιση παραμέτρων της προτίμησής σας.

Για να δείτε ποιες επιλογές είναι παραμετροποιήσιμες σε ένα chart, χρησιμοποιήστε
την `helm show values`:

```console
$ helm show values bitnami/wordpress
## Global Docker image parameters {#global-docker-image-parameters}
## Please, note that this will override the image parameters, including dependencies, configured to use the global value {#please-note-that-this-will-override-the-image-parameters-including-dependencies-configured-to-use-the-global-value}
## Current available global Docker image parameters: imageRegistry and imagePullSecrets {#current-available-global-docker-image-parameters-imageregistry-and-imagepullsecrets}
## # global: {#global}
# imageRegistry: myRegistryName {#imageregistry-myregistryname}
# imagePullSecrets: {#imagepullsecrets}
# - myRegistryKeySecretName {#myregistrykeysecretname}
# storageClass: myStorageClass {#storageclass-mystorageclass}

## Bitnami WordPress image version {#bitnami-wordpress-image-version}
## ref: https://hub.docker.com/r/bitnami/wordpress/tags/ {#ref-httpshubdockercomrbitnamiwordpresstags}
## image: {#image}
  registry: docker.io
  repository: bitnami/wordpress
  tag: 5.6.0-debian-10-r35
  [..]
```

Στη συνέχεια μπορείτε να παρακάμψετε οποιαδήποτε από αυτές τις ρυθμίσεις σε ένα
αρχείο μορφής YAML και να περάσετε αυτό το αρχείο κατά την εγκατάσταση.

```console
$ echo '{mariadb.auth.database: user0db, mariadb.auth.username: user0}' > values.yaml
$ helm install -f values.yaml bitnami/wordpress --generate-name
```

Τα παραπάνω θα δημιουργήσουν έναν προεπιλεγμένο χρήστη MariaDB με το όνομα
`user0`, και θα παραχωρήσουν σε αυτόν τον χρήστη πρόσβαση σε μια νέα βάση
δεδομένων `user0db`, αλλά θα αποδεχτεί όλες τις υπόλοιπες προεπιλογές για
αυτό το chart.

Υπάρχουν δύο τρόποι για να περάσετε δεδομένα ρύθμισης παραμέτρων κατά την
εγκατάσταση:

- `--values` (ή `-f`): Καθορίστε ένα αρχείο YAML με παρακάμψεις. Αυτό μπορεί
  να καθοριστεί πολλές φορές και το δεξιότερο αρχείο θα έχει προτεραιότητα
- `--set`: Καθορίστε παρακάμψεις στη γραμμή εντολών.

Αν χρησιμοποιηθούν και τα δύο, οι τιμές `--set` συγχωνεύονται στις τιμές
`--values` με υψηλότερη προτεραιότητα. Οι παρακάμψεις που καθορίζονται με
`--set` αποθηκεύονται σε ένα Secret. Οι τιμές που έχουν οριστεί με `--set`
μπορούν να προβληθούν για ένα συγκεκριμένο release με την `helm get values <release-name>`.
Οι τιμές που έχουν οριστεί με `--set` μπορούν να διαγραφούν εκτελώντας
`helm upgrade` με την επιλογή `--reset-values`.

#### Η Μορφή και οι Περιορισμοί του `--set` {#the-format-and-limitations-of-set}

Η επιλογή `--set` δέχεται μηδέν ή περισσότερα ζεύγη ονόματος/τιμής. Στην
απλούστερη μορφή της, χρησιμοποιείται ως εξής: `--set name=value`. Το
αντίστοιχο σε YAML είναι:

```yaml
name: value
```

Πολλαπλές τιμές διαχωρίζονται με χαρακτήρες `,`. Έτσι το `--set a=b,c=d` γίνεται:

```yaml
a: b
c: d
```

Υποστηρίζονται πιο σύνθετες εκφράσεις. Για παράδειγμα, το `--set outer.inner=value`
μεταφράζεται σε αυτό:
```yaml
outer:
  inner: value
```

Οι λίστες μπορούν να εκφραστούν περικλείοντας τιμές με `{` και `}`. Για
παράδειγμα, το `--set name={a, b, c}` μεταφράζεται σε:

```yaml
name:
  - a
  - b
  - c
```

Ορισμένα ονόματα/κλειδιά μπορούν να οριστούν σε `null` ή σε κενό πίνακα `[]`.
Για παράδειγμα, το `--set name=[],a=null` μεταφράζει

```yaml
name:
  - a
  - b
  - c
a: b
```

σε

```yaml
name: []
a: null
```

Από το Helm 2.5.0, είναι δυνατή η πρόσβαση σε στοιχεία λίστας χρησιμοποιώντας
σύνταξη δείκτη πίνακα. Για παράδειγμα, το `--set servers[0].port=80` γίνεται:

```yaml
servers:
  - port: 80
```

Πολλαπλές τιμές μπορούν να οριστούν με αυτόν τον τρόπο. Η γραμμή `--set
servers[0].port=80,servers[0].host=example` γίνεται:

```yaml
servers:
  - port: 80
    host: example
```

Μερικές φορές χρειάζεται να χρησιμοποιήσετε ειδικούς χαρακτήρες στις γραμμές
`--set`. Μπορείτε να χρησιμοποιήσετε backslash για να διαφύγετε τους χαρακτήρες·
το `--set name=value1\,value2` θα γίνει:

```yaml
name: "value1,value2"
```

Ομοίως, μπορείτε να διαφύγετε ακολουθίες τελειών, κάτι που μπορεί να είναι
χρήσιμο όταν τα charts χρησιμοποιούν τη συνάρτηση `toYaml` για ανάλυση
annotations, labels και node selectors. Η σύνταξη για το
`--set nodeSelector."kubernetes\.io/role"=master` γίνεται:

```yaml
nodeSelector:
  kubernetes.io/role: master
```

Βαθιά ένθετες δομές δεδομένων μπορεί να είναι δύσκολο να εκφραστούν με το
`--set`. Οι σχεδιαστές charts ενθαρρύνονται να λαμβάνουν υπόψη τη χρήση του
`--set` κατά τον σχεδιασμό της μορφής ενός αρχείου `values.yaml` (διαβάστε
περισσότερα για τα [Αρχεία Values](/chart_template_guide/values_files.md)).

### Περισσότεροι Τρόποι Εγκατάστασης {#more-installation-methods}

Η εντολή `helm install` μπορεί να εγκαταστήσει από διάφορες πηγές:

- Ένα chart repository (όπως είδαμε παραπάνω)
- Ένα τοπικό αρχείο chart (`helm install foo foo-0.1.1.tgz`)
- Έναν αποσυμπιεσμένο φάκελο chart (`helm install foo path/to/foo`)
- Μια πλήρη διεύθυνση URL (`helm install foo https://example.com/charts/foo-1.2.3.tgz`)

## 'helm upgrade' και 'helm rollback': Αναβάθμιση Release και Ανάκτηση από Αποτυχία {#helm-upgrade-and-helm-rollback-upgrading-a-release-and-recovering-on-failure}

Όταν κυκλοφορεί μια νέα έκδοση ενός chart, ή όταν θέλετε να αλλάξετε τη ρύθμιση
παραμέτρων του release σας, μπορείτε να χρησιμοποιήσετε την εντολή `helm upgrade`.

Μια αναβάθμιση παίρνει ένα υπάρχον release και το αναβαθμίζει σύμφωνα με τις
πληροφορίες που παρέχετε. Επειδή τα Kubernetes charts μπορεί να είναι μεγάλα
και σύνθετα, το Helm προσπαθεί να εκτελέσει την ελάχιστα παρεμβατική αναβάθμιση.
Θα ενημερώσει μόνο πράγματα που έχουν αλλάξει από το τελευταίο release.

```console
$ helm upgrade -f panda.yaml happy-panda bitnami/wordpress
```

Στην παραπάνω περίπτωση, το release `happy-panda` αναβαθμίζεται με το ίδιο
chart, αλλά με ένα νέο αρχείο YAML:

```yaml
mariadb.auth.username: user1
```

Μπορούμε να χρησιμοποιήσουμε την `helm get values` για να δούμε αν αυτή η νέα
ρύθμιση εφαρμόστηκε.

```console
$ helm get values happy-panda
mariadb:
  auth:
    username: user1
```

Η εντολή `helm get` είναι ένα χρήσιμο εργαλείο για την εξέταση ενός release στο
cluster. Και όπως βλέπουμε παραπάνω, δείχνει ότι οι νέες τιμές μας από το
`panda.yaml` εγκαταστάθηκαν στο cluster.

Τώρα, αν κάτι δεν πάει σύμφωνα με το σχέδιο κατά τη διάρκεια ενός release, είναι
εύκολο να επιστρέψετε σε ένα προηγούμενο release χρησιμοποιώντας
`helm rollback [RELEASE] [REVISION]`.

```console
$ helm rollback happy-panda 1
```

Τα παραπάνω επαναφέρουν το happy-panda στην πρώτη του έκδοση release. Μια
έκδοση release είναι μια αυξητική αναθεώρηση. Κάθε φορά που γίνεται εγκατάσταση,
αναβάθμιση ή rollback, ο αριθμός αναθεώρησης αυξάνεται κατά 1. Ο πρώτος αριθμός
αναθεώρησης είναι πάντα 1. Και μπορούμε να χρησιμοποιήσουμε την `helm history [RELEASE]`
για να δούμε τους αριθμούς αναθεώρησης για ένα συγκεκριμένο release.

## Χρήσιμες Επιλογές για Install/Upgrade/Rollback {#helpful-options-for-installupgraderollback}

Υπάρχουν αρκετές άλλες χρήσιμες επιλογές που μπορείτε να καθορίσετε για την
προσαρμογή της συμπεριφοράς του Helm κατά τη διάρκεια μιας εγκατάστασης/αναβάθμισης/rollback.
Παρακαλούμε σημειώστε ότι αυτή δεν είναι μια πλήρης λίστα flags του cli. Για να
δείτε μια περιγραφή όλων των flags, απλά εκτελέστε `helm <command> --help`.

- `--timeout`: Μια τιμή [Go duration](https://golang.org/pkg/time/#ParseDuration)
  για να περιμένετε την ολοκλήρωση των εντολών Kubernetes. Η προεπιλογή είναι `5m0s`.
- `--wait`: Περιμένει μέχρι όλα τα Pods να είναι σε κατάσταση ready, τα PVCs
  να είναι bound, τα Deployments να έχουν τον ελάχιστο αριθμό (`Desired` μείον
  `maxUnavailable`) Pods σε κατάσταση ready και τα Services να έχουν μια
  διεύθυνση IP (και Ingress αν είναι `LoadBalancer`) πριν σημειώσει το release
  ως επιτυχημένο. Θα περιμένει για όσο χρόνο ορίζει η τιμή `--timeout`. Αν
  φτάσει το timeout, το release θα σημειωθεί ως `FAILED`. Σημείωση: Σε σενάρια
  όπου το Deployment έχει `replicas` ορισμένο σε 1 και το `maxUnavailable` δεν
  είναι ορισμένο σε 0 ως μέρος της στρατηγικής rolling update, το `--wait` θα
  επιστρέψει ως ready καθώς έχει ικανοποιηθεί η ελάχιστη συνθήκη Pod σε ready.
- `--no-hooks`: Παρακάμπτει την εκτέλεση hooks για την εντολή
- `--recreate-pods` (διαθέσιμο μόνο για `upgrade` και `rollback`): Αυτό το flag
  θα προκαλέσει την αναδημιουργία όλων των pods (με εξαίρεση τα pods που ανήκουν
  σε deployments). (ΚΑΤΑΡΓΗΜΕΝΟ στο Helm 3)

## 'helm uninstall': Απεγκατάσταση ενός Release {#helm-uninstall-uninstalling-a-release}

Όταν έρθει η ώρα να απεγκαταστήσετε ένα release από το cluster, χρησιμοποιήστε
την εντολή `helm uninstall`:

```console
$ helm uninstall happy-panda
```

Αυτό θα αφαιρέσει το release από το cluster. Μπορείτε να δείτε όλα τα τρέχοντα
εγκατεστημένα releases σας με την εντολή `helm list`:

```console
$ helm list
NAME            VERSION UPDATED                         STATUS          CHART
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
```

Από την παραπάνω έξοδο, μπορούμε να δούμε ότι το release `happy-panda`
απεγκαταστάθηκε.

Σε προηγούμενες εκδόσεις του Helm, όταν διαγραφόταν ένα release, παρέμενε
μια εγγραφή της διαγραφής του. Στο Helm 3, η διαγραφή αφαιρεί και την εγγραφή
του release. Αν θέλετε να διατηρήσετε μια εγγραφή διαγραφής του release,
χρησιμοποιήστε `helm uninstall --keep-history`. Η χρήση της `helm list --uninstalled`
θα εμφανίσει μόνο releases που απεγκαταστάθηκαν με το flag `--keep-history`.

Το flag `helm list --all` θα σας δείξει όλες τις εγγραφές release που έχει
διατηρήσει το Helm, συμπεριλαμβανομένων εγγραφών για αποτυχημένα ή διαγραμμένα
στοιχεία (αν είχε καθοριστεί το `--keep-history`):

```console
$  helm list --all
NAME            VERSION UPDATED                         STATUS          CHART
happy-panda     2       Wed Sep 28 12:47:54 2016        UNINSTALLED     wordpress-10.4.5.6.0
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
kindred-angelf  2       Tue Sep 27 16:16:10 2016        UNINSTALLED     alpine-0.1.0
```

Σημειώστε ότι επειδή τα releases πλέον διαγράφονται από προεπιλογή, δεν είναι
πλέον δυνατό να κάνετε rollback σε έναν απεγκατεστημένο πόρο.

## 'helm repo': Εργασία με Repositories {#helm-repo-working-with-repositories}

Το Helm 3 δεν αποστέλλεται πλέον με ένα προεπιλεγμένο chart repository. Η ομάδα
εντολών `helm repo` παρέχει εντολές για προσθήκη, εμφάνιση λίστας και αφαίρεση
repositories.

Μπορείτε να δείτε ποια repositories είναι ρυθμισμένα χρησιμοποιώντας `helm repo list`:

```console
$ helm repo list
NAME            URL
stable          https://charts.helm.sh/stable
mumoshu         https://mumoshu.github.io/charts
```

Και νέα repositories μπορούν να προστεθούν με `helm repo add [NAME] [URL]`:

```console
$ helm repo add dev https://example.com/dev-charts
```

Επειδή τα chart repositories αλλάζουν συχνά, ανά πάσα στιγμή μπορείτε να
βεβαιωθείτε ότι ο Helm client σας είναι ενημερωμένος εκτελώντας `helm repo update`.

Τα repositories μπορούν να αφαιρεθούν με την `helm repo remove`.

## Δημιουργία των Δικών σας Charts {#creating-your-own-charts}

Ο [Οδηγός Ανάπτυξης Chart](/topics/charts.md) εξηγεί πώς
να αναπτύξετε τα δικά σας charts. Αλλά μπορείτε να ξεκινήσετε γρήγορα
χρησιμοποιώντας την εντολή `helm create`:

```console
$ helm create deis-workflow
Creating deis-workflow
```

Τώρα υπάρχει ένα chart στο `./deis-workflow`. Μπορείτε να το επεξεργαστείτε
και να δημιουργήσετε τα δικά σας templates.

Καθώς επεξεργάζεστε το chart σας, μπορείτε να επικυρώσετε ότι είναι σωστά
διαμορφωμένο εκτελώντας `helm lint`.

Όταν έρθει η ώρα να πακετάρετε το chart για διανομή, μπορείτε να εκτελέσετε
την εντολή `helm package`:

```console
$ helm package deis-workflow
deis-workflow-0.1.0.tgz
```

Και αυτό το chart μπορεί πλέον εύκολα να εγκατασταθεί με `helm install`:

```console
$ helm install deis-workflow ./deis-workflow-0.1.0.tgz
...
```

Τα πακεταρισμένα charts μπορούν να φορτωθούν σε chart repositories. Δείτε την
τεκμηρίωση για τα [chart repositories του Helm](/topics/chart_repository.md)
για περισσότερες λεπτομέρειες.

## Συμπέρασμα {#conclusion}

Αυτό το κεφάλαιο κάλυψε τα βασικά μοτίβα χρήσης του `helm` client,
συμπεριλαμβανομένης της αναζήτησης, εγκατάστασης, αναβάθμισης και απεγκατάστασης.
Κάλυψε επίσης χρήσιμες βοηθητικές εντολές όπως `helm status`, `helm get` και
`helm repo`.

Για περισσότερες πληροφορίες σχετικά με αυτές τις εντολές, ρίξτε μια ματιά στη
ενσωματωμένη βοήθεια του Helm: `helm help`.

Στο [επόμενο κεφάλαιο](/howto/charts_tips_and_tricks.md), εξετάζουμε τη
διαδικασία ανάπτυξης charts.
