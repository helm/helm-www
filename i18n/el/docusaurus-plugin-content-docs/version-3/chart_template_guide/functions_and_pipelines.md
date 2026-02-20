---
title: Συναρτήσεις Template και Pipelines
description: Χρήση συναρτήσεων στα templates.
sidebar_position: 5
---

Μέχρι τώρα, έχουμε δει πώς να τοποθετούμε πληροφορίες σε ένα template. Αλλά
αυτές οι πληροφορίες τοποθετούνται στο template χωρίς τροποποίηση. Μερικές
φορές θέλουμε να μετασχηματίσουμε τα παρεχόμενα δεδομένα με τρόπο που να μας
είναι πιο χρήσιμα.

Ας ξεκινήσουμε με μια καλή πρακτική: Όταν εισάγουμε strings από το αντικείμενο
`.Values` στο template, θα πρέπει να τα περικλείουμε σε εισαγωγικά. Μπορούμε να
το κάνουμε αυτό καλώντας τη συνάρτηση `quote` στην οδηγία του template:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ quote .Values.favorite.drink }}
  food: {{ quote .Values.favorite.food }}
```

Οι συναρτήσεις template ακολουθούν τη σύνταξη `functionName arg1 arg2...`. Στο
παραπάνω απόσπασμα, η `quote .Values.favorite.drink` καλεί τη συνάρτηση `quote`
και της περνάει ένα μόνο όρισμα.

Το Helm διαθέτει περισσότερες από 60 συναρτήσεις. Μερικές από αυτές ορίζονται
από την ίδια τη [γλώσσα template της Go](https://godoc.org/text/template). Οι
περισσότερες από τις υπόλοιπες είναι μέρος της [βιβλιοθήκης Sprig
template](https://masterminds.github.io/sprig/). Θα δούμε πολλές από αυτές
καθώς προχωράμε στα παραδείγματα.

> Ενώ μιλάμε για τη «γλώσσα template του Helm» σαν να είναι συγκεκριμένη για το
> Helm, στην πραγματικότητα είναι ένας συνδυασμός της γλώσσας template της Go,
> μερικών επιπλέον συναρτήσεων και διάφορων wrappers για την έκθεση
> συγκεκριμένων αντικειμένων στα templates. Πολλοί πόροι για τα Go templates
> μπορεί να είναι χρήσιμοι καθώς μαθαίνετε για τη δημιουργία templates.

## Pipelines

Ένα από τα ισχυρά χαρακτηριστικά της γλώσσας template είναι η έννοια των
_pipelines_. Βασιζόμενοι σε μια ιδέα από το UNIX, τα pipelines είναι ένα
εργαλείο για την αλυσίδωση μιας σειράς εντολών template ώστε να εκφράσουμε
συνοπτικά μια σειρά μετασχηματισμών. Με άλλα λόγια, τα pipelines είναι ένας
αποδοτικός τρόπος για να κάνουμε πολλά πράγματα διαδοχικά. Ας ξαναγράψουμε το
παραπάνω παράδειγμα χρησιμοποιώντας ένα pipeline.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | quote }}
```

Σε αυτό το παράδειγμα, αντί να καλέσουμε `quote ARGUMENT`, αντιστρέψαμε τη
σειρά. «Στείλαμε» το όρισμα στη συνάρτηση χρησιμοποιώντας ένα pipeline (`|`):
`.Values.favorite.drink | quote`. Χρησιμοποιώντας pipelines, μπορούμε να
αλυσιδώσουμε πολλές συναρτήσεις μαζί:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

> Η αντιστροφή της σειράς είναι μια συνήθης πρακτική στα templates. Θα δείτε
> πιο συχνά `.val | quote` παρά `quote .val`. Και οι δύο τρόποι είναι αποδεκτοί.

Όταν αξιολογηθεί, αυτό το template θα παράγει:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: trendsetting-p-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

Παρατηρήστε ότι το αρχικό μας `pizza` έχει μετατραπεί τώρα σε `"PIZZA"`.

Όταν περνάμε ορίσματα με pipeline, το αποτέλεσμα της πρώτης αξιολόγησης
(`.Values.favorite.drink`) στέλνεται ως _τελευταίο όρισμα στη συνάρτηση_.
Μπορούμε να τροποποιήσουμε το παράδειγμα με το ποτό παραπάνω για να δείξουμε
μια συνάρτηση που δέχεται δύο ορίσματα: `repeat COUNT STRING`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | repeat 5 | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

Η συνάρτηση `repeat` θα επαναλάβει το δοσμένο string τον καθορισμένο αριθμό
φορών, οπότε θα λάβουμε αυτό ως έξοδο:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: melting-porcup-configmap
data:
  myvalue: "Hello World"
  drink: "coffeecoffeecoffeecoffeecoffee"
  food: "PIZZA"
```

## Χρήση της συνάρτησης `default`

Μια συνάρτηση που χρησιμοποιείται συχνά στα templates είναι η `default`:
`default DEFAULT_VALUE GIVEN_VALUE`. Αυτή η συνάρτηση σας επιτρέπει να ορίσετε
μια προεπιλεγμένη τιμή μέσα στο template, σε περίπτωση που η τιμή παραλείπεται.
Ας τη χρησιμοποιήσουμε για να τροποποιήσουμε το παράδειγμα με το ποτό παραπάνω:

```yaml
drink: {{ .Values.favorite.drink | default "tea" | quote }}
```

Αν το εκτελέσουμε κανονικά, θα πάρουμε τον `coffee` μας:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: virtuous-mink-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

Τώρα, θα αφαιρέσουμε τη ρύθμιση για το αγαπημένο ποτό από το `values.yaml`:

```yaml
favorite:
  #drink: coffee
  food: pizza
```

Τώρα η εκ νέου εκτέλεση της `helm install --dry-run --debug fair-worm ./mychart`
θα παράγει αυτό το YAML:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fair-worm-configmap
data:
  myvalue: "Hello World"
  drink: "tea"
  food: "PIZZA"
```

Σε ένα πραγματικό chart, όλες οι στατικές προεπιλεγμένες τιμές πρέπει να
βρίσκονται στο `values.yaml` και δεν πρέπει να επαναλαμβάνονται με την εντολή
`default` (διαφορετικά θα ήταν περιττές). Ωστόσο, η εντολή `default` είναι
ιδανική για υπολογιζόμενες τιμές, οι οποίες δεν μπορούν να δηλωθούν μέσα στο
`values.yaml`. Για παράδειγμα:

```yaml
drink: {{ .Values.favorite.drink | default (printf "%s-tea" (include "fullname" .)) }}
```

Σε κάποια σημεία, μια συνθήκη `if` μπορεί να είναι πιο κατάλληλη από τη
`default`. Θα δούμε αυτές στην επόμενη ενότητα.

Οι συναρτήσεις και τα pipelines των templates είναι ένας ισχυρός τρόπος για να
μετασχηματίσετε πληροφορίες και στη συνέχεια να τις εισάγετε στο YAML σας. Αλλά
μερικές φορές είναι απαραίτητο να προσθέσουμε κάποια λογική template που είναι
λίγο πιο εξελιγμένη από την απλή εισαγωγή ενός string. Στην επόμενη ενότητα θα
εξετάσουμε τις δομές ελέγχου που παρέχει η γλώσσα template.

## Χρήση της συνάρτησης `lookup`

Η συνάρτηση `lookup` μπορεί να χρησιμοποιηθεί για να _αναζητήσει_ resources σε
ένα cluster που εκτελείται. Η σύνοψη της συνάρτησης lookup είναι
`lookup apiVersion, kind, namespace, name -> resource or resource list`.

| παράμετρος | τύπος  |
|------------|--------|
| apiVersion | string |
| kind       | string |
| namespace  | string |
| name       | string |

Τόσο το `name` όσο και το `namespace` είναι προαιρετικά και μπορούν να περαστούν
ως κενό string (`""`). Ωστόσο, αν εργάζεστε με ένα resource που ανήκει σε
namespace, πρέπει να καθοριστούν και τα δύο, το `name` και το `namespace`.

Οι ακόλουθοι συνδυασμοί παραμέτρων είναι δυνατοί:

| Συμπεριφορά                            | Συνάρτηση lookup                           |
|----------------------------------------|--------------------------------------------|
| `kubectl get pod mypod -n mynamespace` | `lookup "v1" "Pod" "mynamespace" "mypod"`  |
| `kubectl get pods -n mynamespace`      | `lookup "v1" "Pod" "mynamespace" ""`       |
| `kubectl get pods --all-namespaces`    | `lookup "v1" "Pod" "" ""`                  |
| `kubectl get namespace mynamespace`    | `lookup "v1" "Namespace" "" "mynamespace"` |
| `kubectl get namespaces`               | `lookup "v1" "Namespace" "" ""`            |

Όταν η `lookup` επιστρέφει ένα αντικείμενο, θα επιστρέψει ένα dictionary. Αυτό
το dictionary μπορεί να πλοηγηθεί περαιτέρω για να εξαχθούν συγκεκριμένες τιμές.

Το ακόλουθο παράδειγμα θα επιστρέψει τα annotations που υπάρχουν για το
αντικείμενο `mynamespace`:

```go
(lookup "v1" "Namespace" "" "mynamespace").metadata.annotations
```

Όταν η `lookup` επιστρέφει μια λίστα αντικειμένων, είναι δυνατή η πρόσβαση στη
λίστα αντικειμένων μέσω του πεδίου `items`:

```go
{{ range $index, $service := (lookup "v1" "Service" "mynamespace" "").items }}
    {{/* do something with each service */}}
{{ end }}
```

Όταν δεν βρεθεί κανένα αντικείμενο, επιστρέφεται μια κενή τιμή. Αυτό μπορεί να
χρησιμοποιηθεί για τον έλεγχο ύπαρξης ενός αντικειμένου.

Η συνάρτηση `lookup` χρησιμοποιεί την υπάρχουσα ρύθμιση σύνδεσης Kubernetes του
Helm για να κάνει ερωτήματα στο Kubernetes. Αν επιστραφεί οποιοδήποτε σφάλμα
κατά την αλληλεπίδραση με τον API server (για παράδειγμα λόγω έλλειψης
δικαιωμάτων πρόσβασης σε ένα resource), η επεξεργασία template του Helm θα
αποτύχει.

Να έχετε υπόψη ότι το Helm δεν πρέπει να επικοινωνεί με τον Kubernetes API
Server κατά τη διάρκεια μιας λειτουργίας
`helm template|install|upgrade|delete|rollback --dry-run`. Για να δοκιμάσετε
τη `lookup` σε ένα cluster που εκτελείται, θα πρέπει να χρησιμοποιήσετε
`helm template|install|upgrade|delete|rollback --dry-run=server` για να
επιτρέψετε τη σύνδεση με το cluster.

## Οι τελεστές είναι συναρτήσεις

Για τα templates, οι τελεστές (`eq`, `ne`, `lt`, `gt`, `and`, `or` κ.λπ.)
υλοποιούνται όλοι ως συναρτήσεις. Στα pipelines, οι πράξεις μπορούν να
ομαδοποιηθούν με παρενθέσεις (`(` και `)`).

Τώρα μπορούμε να προχωρήσουμε από τις συναρτήσεις και τα pipelines στον έλεγχο
ροής με συνθήκες, βρόχους και τροποποιητές εύρους.
