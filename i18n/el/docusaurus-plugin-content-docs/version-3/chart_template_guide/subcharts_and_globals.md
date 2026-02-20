---
title: Subcharts και Global Values
description: Αλληλεπίδραση με τα values ενός subchart και τα global values.
sidebar_position: 11
---

Μέχρι τώρα δουλεύαμε μόνο με ένα chart. Όμως τα charts μπορούν να έχουν
εξαρτήσεις, που ονομάζονται _subcharts_, τα οποία επίσης έχουν τα δικά τους
values και templates. Σε αυτή την ενότητα θα δημιουργήσουμε ένα subchart και θα
δούμε τους διαφορετικούς τρόπους πρόσβασης στα values μέσα από τα templates.

Πριν εμβαθύνουμε στον κώδικα, υπάρχουν μερικές σημαντικές λεπτομέρειες που
πρέπει να γνωρίζετε σχετικά με τα subcharts εφαρμογών.

1. Ένα subchart θεωρείται "αυτόνομο", που σημαίνει ότι ένα subchart δεν μπορεί
   ποτέ να εξαρτάται ρητά από το γονικό chart.
2. Για αυτόν τον λόγο, ένα subchart δεν μπορεί να έχει πρόσβαση στα values του
   γονικού chart.
3. Ένα γονικό chart μπορεί να παρακάμψει τα values των subcharts.
4. Το Helm έχει την έννοια των _global values_ που είναι προσβάσιμα από όλα τα
   charts.

> Αυτοί οι περιορισμοί δεν ισχύουν απαραίτητα για τα [library charts](/topics/library_charts.md), τα οποία έχουν σχεδιαστεί για να παρέχουν τυποποιημένη βοηθητική λειτουργικότητα.

Καθώς προχωράμε στα παραδείγματα αυτής της ενότητας, πολλές από αυτές τις
έννοιες θα γίνουν πιο ξεκάθαρες.

## Δημιουργία Subchart

Για αυτές τις ασκήσεις, θα ξεκινήσουμε με το chart `mychart/` που δημιουργήσαμε
στην αρχή αυτού του οδηγού και θα προσθέσουμε ένα νέο chart μέσα σε αυτό.

```console
$ cd mychart/charts
$ helm create mysubchart
Creating mysubchart
$ rm -rf mysubchart/templates/*
```

Παρατηρήστε ότι όπως και πριν, διαγράψαμε όλα τα βασικά templates ώστε να
μπορέσουμε να ξεκινήσουμε από την αρχή. Σε αυτόν τον οδηγό επικεντρωνόμαστε
στον τρόπο λειτουργίας των templates, όχι στη διαχείριση εξαρτήσεων. Ο
[Οδηγός Charts](/topics/charts.md) περιέχει περισσότερες πληροφορίες σχετικά με
τον τρόπο λειτουργίας των subcharts.

## Προσθήκη Values και Template στο Subchart

Στη συνέχεια, ας δημιουργήσουμε ένα απλό template και αρχείο values για το
chart `mysubchart`. Θα πρέπει να υπάρχει ήδη ένα `values.yaml` στο
`mychart/charts/mysubchart`. Θα το ρυθμίσουμε ως εξής:

```yaml
dessert: cake
```

Στη συνέχεια, θα δημιουργήσουμε ένα νέο ConfigMap template στο
`mychart/charts/mysubchart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
```

Επειδή κάθε subchart είναι ένα _αυτόνομο chart_, μπορούμε να δοκιμάσουμε το
`mysubchart` μόνο του:

```console
$ helm install --generate-name --dry-run --debug mychart/charts/mysubchart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart/charts/mysubchart
NAME:   newbie-elk
TARGET NAMESPACE:   default
CHART:  mysubchart 0.1.0
MANIFEST:
---
# Source: mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: newbie-elk-cfgmap2
data:
  dessert: cake
```

## Παράκαμψη Values από Γονικό Chart

Το αρχικό μας chart, `mychart`, είναι τώρα το _γονικό chart_ του `mysubchart`.
Αυτή η σχέση βασίζεται αποκλειστικά στο γεγονός ότι το `mysubchart` βρίσκεται
μέσα στο `mychart/charts`.

Επειδή το `mychart` είναι γονικό, μπορούμε να καθορίσουμε ρυθμίσεις στο
`mychart` και να τις περάσουμε στο `mysubchart`. Για παράδειγμα, μπορούμε να
τροποποιήσουμε το `mychart/values.yaml` ως εξής:

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream
```

Προσέξτε τις δύο τελευταίες γραμμές. Οποιαδήποτε οδηγία μέσα στην ενότητα
`mysubchart` θα σταλεί στο chart `mysubchart`. Έτσι, αν εκτελέσουμε
`helm install --generate-name --dry-run --debug mychart`, ένα από τα πράγματα
που θα δούμε είναι το ConfigMap του `mysubchart`:

```yaml
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: unhinged-bee-cfgmap2
data:
  dessert: ice cream
```

Η τιμή στο ανώτερο επίπεδο έχει τώρα παρακάμψει την τιμή του subchart.

Υπάρχει μια σημαντική λεπτομέρεια που πρέπει να παρατηρήσουμε εδώ. Δεν
αλλάξαμε το template του `mychart/charts/mysubchart/templates/configmap.yaml`
ώστε να δείχνει στο `.Values.mysubchart.dessert`. Από την οπτική γωνία αυτού
του template, η τιμή εξακολουθεί να βρίσκεται στο `.Values.dessert`. Καθώς η
μηχανή template περνά τα values, ορίζει το εύρος (scope). Έτσι, για τα
templates του `mysubchart`, μόνο τα values που προορίζονται συγκεκριμένα για
το `mysubchart` θα είναι διαθέσιμα στο `.Values`.

Μερικές φορές, όμως, θέλετε ορισμένα values να είναι διαθέσιμα σε όλα τα
templates. Αυτό επιτυγχάνεται με τα global chart values.

## Global Chart Values

Τα global values είναι τιμές που είναι προσβάσιμες από οποιοδήποτε chart ή
subchart με ακριβώς το ίδιο όνομα. Τα globals απαιτούν ρητή δήλωση. Δεν μπορείτε
να χρησιμοποιήσετε ένα υπάρχον μη-global value σαν να ήταν global.

Ο τύπος δεδομένων Values έχει μια δεσμευμένη ενότητα που ονομάζεται
`Values.global` όπου μπορούν να οριστούν global values. Ας ορίσουμε ένα στο
αρχείο `mychart/values.yaml`.

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream

global:
  salad: caesar
```

Λόγω του τρόπου λειτουργίας των globals, τόσο το
`mychart/templates/configmap.yaml` όσο και το
`mysubchart/templates/configmap.yaml` θα πρέπει να μπορούν να έχουν πρόσβαση σε
αυτή την τιμή ως `{{ .Values.global.salad }}`.

`mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  salad: {{ .Values.global.salad }}
```

`mysubchart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
  salad: {{ .Values.global.salad }}
```

Τώρα αν εκτελέσουμε μια dry run εγκατάσταση, θα δούμε την ίδια τιμή και στις δύο
εξόδους:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-configmap
data:
  salad: caesar

---
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-cfgmap2
data:
  dessert: ice cream
  salad: caesar
```

Τα globals είναι χρήσιμα για τη μετάδοση τέτοιων πληροφοριών, αν και απαιτείται
κάποιος σχεδιασμός για να βεβαιωθείτε ότι τα σωστά templates είναι ρυθμισμένα
να χρησιμοποιούν globals.

## Κοινή Χρήση Templates με Subcharts

Τα γονικά charts και τα subcharts μπορούν να μοιράζονται templates. Οποιοδήποτε
block ορίζεται σε οποιοδήποτε chart είναι διαθέσιμο σε άλλα charts.

Για παράδειγμα, μπορούμε να ορίσουμε ένα απλό template ως εξής:

```yaml
{{- define "labels" }}from: mychart{{ end }}
```

Θυμηθείτε ότι τα labels στα templates είναι _παγκοσμίως κοινόχρηστα_. Επομένως,
το chart `labels` μπορεί να συμπεριληφθεί από οποιοδήποτε άλλο chart.

Ενώ οι developers charts έχουν την επιλογή μεταξύ `include` και `template`, ένα
πλεονέκτημα της χρήσης του `include` είναι ότι μπορεί να αναφέρεται δυναμικά σε
templates:

```yaml
{{ include $mytemplate }}
```

Το παραπάνω θα αποαναφέρει (dereference) τη μεταβλητή `$mytemplate`. Η συνάρτηση
`template`, αντίθετα, δέχεται μόνο string literal.

## Αποφύγετε τη Χρήση Blocks

Η γλώσσα Go template παρέχει τη λέξη-κλειδί `block` που επιτρέπει στους
developers να παρέχουν μια προεπιλεγμένη υλοποίηση η οποία μπορεί να
παρακαμφθεί αργότερα. Στα Helm charts, τα blocks δεν είναι το καλύτερο εργαλείο
για παράκαμψη, επειδή αν παρέχονται πολλαπλές υλοποιήσεις του ίδιου block, η
επιλογή είναι απρόβλεπτη.

Η σύσταση είναι να χρησιμοποιείτε αντ' αυτού το `include`.
