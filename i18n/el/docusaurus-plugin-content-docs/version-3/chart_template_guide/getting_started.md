---
title: Ξεκινώντας
description: Ένας γρήγορος οδηγός για τα Chart templates.
sidebar_position: 2
---

Σε αυτήν την ενότητα του οδηγού, θα δημιουργήσουμε ένα chart και στη συνέχεια
θα προσθέσουμε ένα πρώτο template. Το chart που θα δημιουργήσουμε εδώ θα
χρησιμοποιηθεί σε όλο τον υπόλοιπο οδηγό.

Για να ξεκινήσουμε, ας ρίξουμε μια σύντομη ματιά σε ένα Helm chart.

## Charts {#charts}

Όπως περιγράφεται στον [Οδηγό Charts](/topics/charts.md), τα Helm charts έχουν
την εξής δομή:

```
mychart/
  Chart.yaml
  values.yaml
  charts/
  templates/
  ...
```

Ο κατάλογος `templates/` προορίζεται για αρχεία template. Όταν το Helm
αξιολογεί ένα chart, στέλνει όλα τα αρχεία του καταλόγου `templates/` μέσω της
μηχανής απόδοσης template. Στη συνέχεια συλλέγει τα αποτελέσματα αυτών των
templates και τα στέλνει στο Kubernetes.

Το αρχείο `values.yaml` είναι επίσης σημαντικό για τα templates. Αυτό το αρχείο
περιέχει τις _προεπιλεγμένες τιμές_ για ένα chart. Αυτές οι τιμές μπορούν να
παρακαμφθούν από τους χρήστες κατά τη διάρκεια του `helm install` ή του
`helm upgrade`.

Το αρχείο `Chart.yaml` περιέχει μια περιγραφή του chart. Μπορείτε να έχετε
πρόσβαση σε αυτό μέσα από ένα template.

Ο κατάλογος `charts/` _μπορεί_ να περιέχει άλλα charts (τα οποία ονομάζουμε
_subcharts_). Αργότερα σε αυτόν τον οδηγό θα δούμε πώς λειτουργούν αυτά κατά
την απόδοση των templates.

## Ένα Αρχικό Chart {#a-starter-chart}

Για αυτόν τον οδηγό, θα δημιουργήσουμε ένα απλό chart με το όνομα `mychart`,
και στη συνέχεια θα δημιουργήσουμε μερικά templates μέσα σε αυτό.

```console
$ helm create mychart
Creating mychart
```

### Μια Γρήγορη Ματιά στο `mychart/templates/` {#a-quick-glimpse-of-mycharttemplates}

Αν ρίξετε μια ματιά στον κατάλογο `mychart/templates/`, θα παρατηρήσετε ότι
υπάρχουν ήδη μερικά αρχεία.

- `NOTES.txt`: Το «κείμενο βοήθειας» για το chart σας. Θα εμφανίζεται στους
  χρήστες όταν εκτελούν την εντολή `helm install`.
- `deployment.yaml`: Ένα βασικό manifest για τη δημιουργία ενός Kubernetes
  [deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- `service.yaml`: Ένα βασικό manifest για τη δημιουργία ενός [service
  endpoint](https://kubernetes.io/docs/concepts/services-networking/service/) για το deployment σας
- `_helpers.tpl`: Ένα μέρος για να τοποθετήσετε template helpers που μπορείτε
  να επαναχρησιμοποιήσετε σε όλο το chart

Και αυτό που θα κάνουμε είναι... _να τα διαγράψουμε όλα!_ Με αυτόν τον τρόπο
μπορούμε να δουλέψουμε τον οδηγό από την αρχή. Θα δημιουργήσουμε στην
πραγματικότητα τα δικά μας `NOTES.txt` και `_helpers.tpl` καθώς προχωράμε.

```console
$ rm -rf mychart/templates/*
```

Όταν γράφετε charts για παραγωγή, η ύπαρξη βασικών εκδόσεων αυτών των αρχείων
μπορεί να είναι πραγματικά χρήσιμη. Επομένως, στην καθημερινή δημιουργία charts,
πιθανότατα δεν θα θέλετε να τα διαγράψετε.

## Ένα Πρώτο Template {#a-first-template}

Το πρώτο template που θα δημιουργήσουμε θα είναι ένα `ConfigMap`. Στο
Kubernetes, ένα ConfigMap είναι απλά ένα αντικείμενο για την αποθήκευση
δεδομένων ρύθμισης. Άλλα στοιχεία, όπως τα pods, μπορούν να έχουν πρόσβαση
στα δεδομένα ενός ConfigMap.

Επειδή τα ConfigMaps είναι βασικοί πόροι, αποτελούν ένα εξαιρετικό σημείο
εκκίνησης για εμάς.

Ας ξεκινήσουμε δημιουργώντας ένα αρχείο με το όνομα
`mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

**ΣΥΜΒΟΥΛΗ:** Τα ονόματα των templates δεν ακολουθούν ένα αυστηρό πρότυπο
ονοματολογίας. Ωστόσο, συνιστούμε τη χρήση της επέκτασης `.yaml` για αρχεία
YAML και `.tpl` για helpers.

Το παραπάνω αρχείο YAML είναι ένα ConfigMap με τα ελάχιστα απαραίτητα πεδία.
Λόγω του ότι αυτό το αρχείο βρίσκεται στον κατάλογο `mychart/templates/`, θα
περάσει από τη μηχανή template.

Είναι απολύτως αποδεκτό να τοποθετήσετε ένα απλό αρχείο YAML όπως αυτό στον
κατάλογο `mychart/templates/`. Όταν το Helm διαβάζει αυτό το template, απλά
το στέλνει στο Kubernetes ως έχει.

Με αυτό το απλό template, έχουμε τώρα ένα chart που μπορεί να εγκατασταθεί.
Και μπορούμε να το εγκαταστήσουμε ως εξής:

```console
$ helm install full-coral ./mychart
NAME: full-coral
LAST DEPLOYED: Tue Nov  1 17:36:01 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

Χρησιμοποιώντας το Helm, μπορούμε να ανακτήσουμε το release και να δούμε το
πραγματικό template που φορτώθηκε.

```console
$ helm get manifest full-coral

---
# Source: mychart/templates/configmap.yaml {#source-mycharttemplatesconfigmapyaml} {#source-mycharttemplatesconfigmapyaml} {#source-mycharttemplatesconfigmapyaml}
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

Η εντολή `helm get manifest` παίρνει ένα όνομα release (`full-coral`) και
εκτυπώνει όλους τους πόρους Kubernetes που ανέβηκαν στον server. Κάθε αρχείο
ξεκινά με `---` για να υποδείξει την αρχή ενός εγγράφου YAML, και ακολουθεί
μια αυτόματα παραγόμενη γραμμή σχολίου που μας λέει ποιο αρχείο template
δημιούργησε αυτό το έγγραφο YAML.

Από εκεί και πέρα, μπορούμε να δούμε ότι τα δεδομένα YAML είναι ακριβώς αυτά
που βάλαμε στο αρχείο `configmap.yaml`.

Τώρα μπορούμε να απεγκαταστήσουμε το release: `helm uninstall full-coral`.

### Προσθήκη μιας Απλής Κλήσης Template {#adding-a-simple-template-call}

Η σκληρή κωδικοποίηση του `name:` σε έναν πόρο θεωρείται γενικά κακή πρακτική.
Τα ονόματα πρέπει να είναι μοναδικά για κάθε release. Επομένως, μπορεί να
θέλουμε να δημιουργήσουμε ένα πεδίο name εισάγοντας το όνομα του release.

**ΣΥΜΒΟΥΛΗ:** Το πεδίο `name:` περιορίζεται σε 63 χαρακτήρες λόγω περιορισμών
του συστήματος DNS. Για αυτόν τον λόγο, τα ονόματα release περιορίζονται σε
53 χαρακτήρες. Το Kubernetes 1.3 και παλαιότερες εκδόσεις περιορίζονταν σε
μόνο 24 χαρακτήρες (άρα 14 χαρακτήρες για τα ονόματα).

Ας τροποποιήσουμε το `configmap.yaml` ανάλογα.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
```

Η μεγάλη αλλαγή έρχεται στην τιμή του πεδίου `name:`, η οποία είναι τώρα
`{{ .Release.Name }}-configmap`.

> Μια οδηγία template περικλείεται σε blocks `{{` και `}}`.

Η οδηγία template `{{ .Release.Name }}` εισάγει το όνομα του release στο
template. Οι τιμές που περνούν σε ένα template μπορούν να θεωρηθούν ως
_αντικείμενα οργανωμένα σε namespaces_, όπου μια τελεία (`.`) διαχωρίζει κάθε
namespace.

Η αρχική τελεία πριν από το `Release` υποδεικνύει ότι ξεκινάμε από το ανώτατο
namespace για αυτό το εύρος (scope) (θα μιλήσουμε για το εύρος αργότερα).
Επομένως, μπορούμε να διαβάσουμε το `.Release.Name` ως «ξεκίνα από
το ανώτατο namespace, βρες το αντικείμενο `Release`, και μετά ψάξε μέσα του
για ένα αντικείμενο με το όνομα `Name`».

Το αντικείμενο `Release` είναι ένα από τα ενσωματωμένα αντικείμενα του Helm,
και θα το καλύψουμε πιο αναλυτικά αργότερα. Αλλά προς το παρόν, αρκεί να
πούμε ότι αυτό θα εμφανίσει το όνομα release που η βιβλιοθήκη αναθέτει στο
release μας.

Τώρα, όταν εγκαταστήσουμε τον πόρο μας, θα δούμε αμέσως το αποτέλεσμα της
χρήσης αυτής της οδηγίας template:

```console
$ helm install clunky-serval ./mychart
NAME: clunky-serval
LAST DEPLOYED: Tue Nov  1 17:45:37 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

Μπορείτε να εκτελέσετε `helm get manifest clunky-serval` για να δείτε ολόκληρο
το παραγόμενο YAML.

Παρατηρήστε ότι το ConfigMap μέσα στο Kubernetes έχει όνομα
`clunky-serval-configmap` αντί για `mychart-configmap` που είχε προηγουμένως.

Σε αυτό το σημείο, έχουμε δει τα templates στην πιο βασική τους μορφή: αρχεία
YAML που έχουν οδηγίες template ενσωματωμένες σε `{{` και `}}`. Στο επόμενο
μέρος, θα ρίξουμε μια πιο βαθιά ματιά στα templates. Αλλά πριν προχωρήσουμε,
υπάρχει ένα γρήγορο κόλπο που μπορεί να κάνει τη δημιουργία templates πιο
γρήγορη: Όταν θέλετε να δοκιμάσετε την απόδοση του template, αλλά όχι να
εγκαταστήσετε πραγματικά κάτι, μπορείτε να χρησιμοποιήσετε `helm install --debug
--dry-run goodly-guppy ./mychart`. Αυτό θα αποδώσει τα templates. Αλλά αντί να
εγκαταστήσει το chart, θα επιστρέψει το αποδοθέν template σε εσάς ώστε να
δείτε την έξοδο:

```console
$ helm install --debug --dry-run goodly-guppy ./mychart
install.go:149: [debug] Original chart version: ""
install.go:166: [debug] CHART PATH: /Users/ninja/mychart

NAME: goodly-guppy
LAST DEPLOYED: Thu Dec 26 17:24:13 2019
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: nginx
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: false
  hosts:
  - host: chart-example.local
    paths: []
  tls: []
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 1
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: goodly-guppy-configmap
data:
  myvalue: "Hello World"

```

Η χρήση του `--dry-run` θα διευκολύνει τον έλεγχο του κώδικά σας, αλλά δεν θα
εξασφαλίσει ότι το ίδιο το Kubernetes θα αποδεχτεί τα templates που παράγετε.
Είναι καλύτερο να μην υποθέτετε ότι το chart σας θα εγκατασταθεί μόνο και
μόνο επειδή το `--dry-run` λειτουργεί.

Στον [Οδηγό Chart Template](./index.md), παίρνουμε το
βασικό chart που ορίσαμε εδώ και εξερευνούμε τη γλώσσα template του Helm
αναλυτικά. Και θα ξεκινήσουμε με τα ενσωματωμένα αντικείμενα.
