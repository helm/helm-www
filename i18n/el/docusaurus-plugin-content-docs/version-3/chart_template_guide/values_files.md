---
title: Αρχεία Values
description: Οδηγίες για τη χρήση της επιλογής --values.
sidebar_position: 4
---

Στην προηγούμενη ενότητα εξετάσαμε τα ενσωματωμένα αντικείμενα που προσφέρουν
τα Helm templates. Ένα από αυτά είναι το `Values`. Αυτό το αντικείμενο παρέχει
πρόσβαση σε τιμές που μεταβιβάζονται στο chart. Τα περιεχόμενά του προέρχονται
από πολλαπλές πηγές:

- Το αρχείο `values.yaml` μέσα στο chart
- Εάν πρόκειται για subchart, το αρχείο `values.yaml` του γονικού chart
- Ένα αρχείο values που μεταβιβάζεται στο `helm install` ή `helm upgrade` με την
  επιλογή `-f` (`helm install -f myvals.yaml ./mychart`)
- Μεμονωμένες παράμετροι που μεταβιβάζονται με το `--set` (όπως `helm install --set foo=bar
  ./mychart`)

Η παραπάνω λίστα είναι σε σειρά προτεραιότητας: το `values.yaml` είναι η
προεπιλογή, η οποία μπορεί να παρακαμφθεί από το `values.yaml` ενός γονικού
chart. Αυτό μπορεί να παρακαμφθεί από ένα αρχείο values που παρέχει ο χρήστης,
το οποίο τέλος μπορεί να παρακαμφθεί από παραμέτρους `--set`.

Τα αρχεία values είναι απλά αρχεία YAML. Ας τροποποιήσουμε το
`mychart/values.yaml` και στη συνέχεια το template του ConfigMap.

Αφαιρώντας τις προεπιλεγμένες τιμές από το `values.yaml`, θα ορίσουμε μόνο μία
παράμετρο:

```yaml
favoriteDrink: coffee
```

Τώρα μπορούμε να τη χρησιμοποιήσουμε μέσα σε ένα template:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favoriteDrink }}
```

Παρατηρήστε ότι στην τελευταία γραμμή έχουμε πρόσβαση στο `favoriteDrink` ως
ιδιότητα του `Values`: `{{ .Values.favoriteDrink }}`.

Ας δούμε πώς αποδίδεται αυτό.

```console
$ helm install geared-marsupi ./mychart --dry-run --debug
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: geared-marsupi
LAST DEPLOYED: Wed Feb 19 23:21:13 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
favoriteDrink: coffee

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml {#source-mycharttemplatesconfigmapyaml} {#source-mycharttemplatesconfigmapyaml} {#source-mycharttemplatesconfigmapyaml}
apiVersion: v1
kind: ConfigMap
metadata:
  name: geared-marsupi-configmap
data:
  myvalue: "Hello World"
  drink: coffee
```

Επειδή το `favoriteDrink` έχει οριστεί στο προεπιλεγμένο αρχείο `values.yaml` ως
`coffee`, αυτή είναι η τιμή που εμφανίζεται στο template. Μπορούμε εύκολα να την
παρακάμψουμε προσθέτοντας την επιλογή `--set` στην κλήση του `helm install`:

```console
$ helm install solid-vulture ./mychart --dry-run --debug --set favoriteDrink=slurm
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: solid-vulture
LAST DEPLOYED: Wed Feb 19 23:25:54 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
favoriteDrink: slurm

COMPUTED VALUES:
favoriteDrink: slurm

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: solid-vulture-configmap
data:
  myvalue: "Hello World"
  drink: slurm
```

Δεδομένου ότι το `--set` έχει μεγαλύτερη προτεραιότητα από το προεπιλεγμένο
αρχείο `values.yaml`, το template μας παράγει `drink: slurm`.

Τα αρχεία values μπορούν να περιέχουν και πιο δομημένο περιεχόμενο. Για
παράδειγμα, θα μπορούσαμε να δημιουργήσουμε μια ενότητα `favorite` στο αρχείο
`values.yaml` και να προσθέσουμε εκεί αρκετά κλειδιά:

```yaml
favorite:
  drink: coffee
  food: pizza
```

Τώρα θα πρέπει να τροποποιήσουμε ελαφρώς το template:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink }}
  food: {{ .Values.favorite.food }}
```

Αν και η δόμηση δεδομένων με αυτόν τον τρόπο είναι δυνατή, η σύσταση είναι να
διατηρείτε τα δέντρα τιμών σας ρηχά, προτιμώντας την επίπεδη δομή. Όταν
εξετάσουμε την ανάθεση τιμών σε subcharts, θα δούμε πώς οι τιμές
ονομάζονται χρησιμοποιώντας μια ιεραρχική δομή.

## Διαγραφή ενός προεπιλεγμένου κλειδιού {#deleting-a-default-key}

Εάν χρειάζεται να διαγράψετε ένα κλειδί από τις προεπιλεγμένες τιμές, μπορείτε
να θέσετε την τιμή του κλειδιού σε `null`, οπότε το Helm θα αφαιρέσει το κλειδί
κατά τη συγχώνευση των παρακαμφθεισών τιμών.

Για παράδειγμα, το stable Drupal chart επιτρέπει τη ρύθμιση του liveness probe,
σε περίπτωση που διαμορφώνετε μια προσαρμοσμένη εικόνα. Οι προεπιλεγμένες τιμές
είναι:
```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  initialDelaySeconds: 120
```

Εάν προσπαθήσετε να αλλάξετε τον handler του livenessProbe σε `exec` αντί για
`httpGet` χρησιμοποιώντας
`--set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt]`, το Helm θα
συγχωνεύσει τα προεπιλεγμένα και τα παρακαμφθέντα κλειδιά, με αποτέλεσμα το
ακόλουθο YAML:
```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  exec:
    command:
    - cat
    - docroot/CHANGELOG.txt
  initialDelaySeconds: 120
```

Ωστόσο, το Kubernetes θα αποτύχει επειδή δεν μπορείτε να δηλώσετε περισσότερους
από έναν handlers για το livenessProbe. Για να το αντιμετωπίσετε, μπορείτε να
δώσετε εντολή στο Helm να διαγράψει το `livenessProbe.httpGet` θέτοντάς το σε
null:
```sh
helm install stable/drupal --set image=my-registry/drupal:0.1.0 --set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt] --set livenessProbe.httpGet=null
```

Σε αυτό το σημείο, έχουμε δει αρκετά ενσωματωμένα αντικείμενα και τα
χρησιμοποιήσαμε για να εισάγουμε πληροφορίες σε ένα template. Τώρα θα εξετάσουμε
μια άλλη πτυχή της μηχανής template: τις συναρτήσεις και τα pipelines.
