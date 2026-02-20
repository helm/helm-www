---
title: Ονομασμένα Templates
description: Πώς να ορίζετε ονομασμένα templates.
sidebar_position: 9
---

Ήρθε η ώρα να ξεπεράσουμε τη χρήση ενός μόνο template και να αρχίσουμε να
δημιουργούμε και άλλα. Σε αυτή την ενότητα θα δούμε πώς να ορίζουμε _ονομασμένα
templates_ σε ένα αρχείο και πώς να τα χρησιμοποιούμε αλλού. Ένα _ονομασμένο
template_ (μερικές φορές αποκαλείται _partial_ ή _subtemplate_) είναι απλά ένα
template που ορίζεται μέσα σε ένα αρχείο και έχει ένα όνομα. Θα δούμε δύο
τρόπους δημιουργίας τους και αρκετούς διαφορετικούς τρόπους χρήσης τους.

Στην ενότητα [Δομές Ελέγχου Ροής](./control_structures.md) παρουσιάσαμε τρεις
ενέργειες για τη δήλωση και διαχείριση templates: `define`, `template` και
`block`. Σε αυτή την ενότητα θα καλύψουμε αυτές τις τρεις ενέργειες και επίσης
θα παρουσιάσουμε μια ειδική συνάρτηση `include` που λειτουργεί παρόμοια με την
ενέργεια `template`.

Μια σημαντική λεπτομέρεια που πρέπει να έχετε υπόψη όταν ονομάζετε templates:
**τα ονόματα των templates είναι global**. Αν δηλώσετε δύο templates με το ίδιο
όνομα, θα χρησιμοποιηθεί αυτό που φορτώθηκε τελευταίο. Επειδή τα templates στα
subcharts μεταγλωττίζονται μαζί με τα templates του ανώτερου επιπέδου, θα πρέπει
να είστε προσεκτικοί να ονομάζετε τα templates σας με _ονόματα ειδικά για το
chart_.

Μια δημοφιλής σύμβαση ονομασίας είναι να προσθέτετε ως πρόθεμα σε κάθε ορισμένο
template το όνομα του chart: `{{ define "mychart.labels" }}`. Χρησιμοποιώντας το
συγκεκριμένο όνομα του chart ως πρόθεμα, μπορούμε να αποφύγουμε τυχόν διενέξεις
που μπορεί να προκύψουν από δύο διαφορετικά charts που υλοποιούν templates με το
ίδιο όνομα.

Αυτή η συμπεριφορά ισχύει επίσης για διαφορετικές εκδόσεις ενός chart. Αν έχετε
το `mychart` έκδοση `1.0.0` που ορίζει ένα template με έναν τρόπο, και ένα
`mychart` έκδοση `2.0.0` που τροποποιεί το υπάρχον ονομασμένο template, θα
χρησιμοποιηθεί αυτό που φορτώθηκε τελευταίο. Μπορείτε να αντιμετωπίσετε αυτό το
πρόβλημα προσθέτοντας επίσης μια έκδοση στο όνομα του chart:
`{{ define "mychart.v1.labels" }}` και `{{ define "mychart.v2.labels" }}`.

## Partials και αρχεία `_`

Μέχρι στιγμής έχουμε χρησιμοποιήσει ένα αρχείο, και αυτό το αρχείο περιέχει ένα
μόνο template. Όμως η γλώσσα template του Helm σας επιτρέπει να δημιουργείτε
ονομασμένα ενσωματωμένα templates, τα οποία μπορούν να προσπελαστούν με το όνομά
τους οπουδήποτε αλλού.

Πριν ασχοληθούμε με τις λεπτομέρειες της σύνταξης αυτών των templates, υπάρχει
μια σύμβαση ονομασίας αρχείων που αξίζει να αναφερθεί:

* Τα περισσότερα αρχεία στο `templates/` αντιμετωπίζονται σαν να περιέχουν
  Kubernetes manifests
* Το `NOTES.txt` αποτελεί εξαίρεση
* Όμως τα αρχεία των οποίων το όνομα ξεκινά με κάτω παύλα (`_`) θεωρείται ότι
  _δεν_ περιέχουν manifest. Αυτά τα αρχεία δεν αποδίδονται ως ορισμοί
  αντικειμένων Kubernetes, αλλά είναι διαθέσιμα παντού μέσα σε άλλα chart
  templates για χρήση.

Αυτά τα αρχεία χρησιμοποιούνται για την αποθήκευση partials και helpers. Στην
πραγματικότητα, όταν δημιουργήσαμε για πρώτη φορά το `mychart`, είδαμε ένα
αρχείο με το όνομα `_helpers.tpl`. Αυτό το αρχείο είναι η προεπιλεγμένη
τοποθεσία για τα template partials.

## Δήλωση και χρήση templates με `define` και `template`

Η ενέργεια `define` μας επιτρέπει να δημιουργούμε ένα ονομασμένο template μέσα
σε ένα αρχείο template. Η σύνταξή της είναι η εξής:

```yaml
{{- define "MY.NAME" }}
  # body of template here
{{- end }}
```

Για παράδειγμα, μπορούμε να ορίσουμε ένα template που ενθυλακώνει ένα block
labels του Kubernetes:

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

Τώρα μπορούμε να ενσωματώσουμε αυτό το template μέσα στο υπάρχον ConfigMap και
στη συνέχεια να το συμπεριλάβουμε με την ενέργεια `template`:

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

Όταν ο μηχανισμός template διαβάσει αυτό το αρχείο, θα αποθηκεύσει την αναφορά
στο `mychart.labels` μέχρι να κληθεί το `template "mychart.labels"`. Τότε θα
αποδώσει αυτό το template στη θέση του. Επομένως το αποτέλεσμα θα είναι:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: running-panda-configmap
  labels:
    generator: helm
    date: 2016-11-02
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

Σημείωση: ένα `define` δεν παράγει έξοδο εκτός αν κληθεί με ένα template, όπως
σε αυτό το παράδειγμα.

Συνήθως, τα Helm charts τοποθετούν αυτά τα templates μέσα σε ένα αρχείο
partials, συνήθως το `_helpers.tpl`. Ας μεταφέρουμε αυτή τη συνάρτηση εκεί:

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

Κατά σύμβαση, οι συναρτήσεις `define` θα πρέπει να έχουν ένα απλό block
τεκμηρίωσης (`{{/* ... */}}`) που περιγράφει τι κάνουν.

Παρόλο που αυτός ο ορισμός βρίσκεται στο `_helpers.tpl`, μπορεί ακόμα να
προσπελαστεί από το `configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

Όπως αναφέρθηκε παραπάνω, **τα ονόματα των templates είναι global**. Ως
αποτέλεσμα, αν δύο templates δηλωθούν με το ίδιο όνομα, θα χρησιμοποιηθεί η
τελευταία εμφάνιση. Δεδομένου ότι τα templates στα subcharts μεταγλωττίζονται
μαζί με τα templates του ανώτερου επιπέδου, είναι καλύτερο να ονομάζετε τα
templates σας με _ονόματα ειδικά για το chart_. Μια δημοφιλής σύμβαση ονομασίας
είναι να προσθέτετε ως πρόθεμα σε κάθε ορισμένο template το όνομα του chart:
`{{ define "mychart.labels" }}`.

## Ορισμός του εύρους (scope) ενός template

Στο template που ορίσαμε παραπάνω, δεν χρησιμοποιήσαμε κανένα αντικείμενο.
Χρησιμοποιήσαμε μόνο συναρτήσεις. Ας τροποποιήσουμε το ορισμένο template ώστε
να συμπεριλάβει το όνομα και την έκδοση του chart:

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
    chart: {{ .Chart.Name }}
    version: {{ .Chart.Version }}
{{- end }}
```

Αν αποδώσουμε αυτό, θα λάβουμε ένα σφάλμα όπως αυτό:

```console
$ helm install --dry-run moldy-jaguar ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [unknown object type "nil" in ConfigMap.metadata.labels.chart, unknown object type "nil" in ConfigMap.metadata.labels.version]
```

Για να δείτε τι αποδόθηκε, εκτελέστε ξανά με `--disable-openapi-validation`:
`helm install --dry-run --disable-openapi-validation moldy-jaguar ./mychart`.
Το αποτέλεσμα δεν θα είναι αυτό που περιμέναμε:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: moldy-jaguar-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart:
    version:
```

Τι συνέβη με το όνομα και την έκδοση; Δεν βρίσκονταν μέσα στο εύρος (scope) του
ορισμένου template. Όταν ένα ονομασμένο template (που δημιουργήθηκε με `define`)
αποδίδεται, θα λάβει το εύρος που μεταβιβάστηκε από την κλήση `template`. Στο
παράδειγμά μας, συμπεριλάβαμε το template ως εξής:

```yaml
{{- template "mychart.labels" }}
```

Δεν μεταβιβάστηκε κανένα εύρος, οπότε μέσα στο template δεν μπορούμε να έχουμε
πρόσβαση σε τίποτα στο `.`. Αυτό διορθώνεται εύκολα. Απλά μεταβιβάζουμε ένα
εύρος στο template:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" . }}
```

Παρατηρήστε ότι μεταβιβάζουμε το `.` στο τέλος της κλήσης `template`. Θα
μπορούσαμε εξίσου εύκολα να μεταβιβάσουμε `.Values` ή `.Values.favorite` ή
όποιο εύρος θέλουμε. Αλλά αυτό που θέλουμε είναι το εύρος ανώτερου επιπέδου.
Στο πλαίσιο του ονομασμένου template, η `$` θα αναφέρεται στο εύρος που
μεταβιβάσατε και όχι σε κάποιο global εύρος.

Τώρα όταν εκτελέσουμε αυτό το template με `helm install --dry-run --debug
plinking-anaco ./mychart`, θα λάβουμε:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: plinking-anaco-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart: mychart
    version: 0.1.0
```

Τώρα το `{{ .Chart.Name }}` επιλύεται σε `mychart` και το `{{ .Chart.Version }}`
επιλύεται σε `0.1.0`.

## Η συνάρτηση `include`

Ας πούμε ότι έχουμε ορίσει ένα απλό template που μοιάζει με αυτό:

```yaml
{{- define "mychart.app" -}}
app_name: {{ .Chart.Name }}
app_version: "{{ .Chart.Version }}"
{{- end -}}
```

Τώρα ας πούμε ότι θέλω να εισάγω αυτό τόσο στην ενότητα `labels:` του template
μου όσο και στην ενότητα `data:`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
    {{ template "mychart.app" . }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ template "mychart.app" . }}
```

Αν αποδώσουμε αυτό, θα λάβουμε ένα σφάλμα όπως αυτό:

```console
$ helm install --dry-run measly-whippet ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [ValidationError(ConfigMap): unknown field "app_name" in io.k8s.api.core.v1.ConfigMap, ValidationError(ConfigMap): unknown field "app_version" in io.k8s.api.core.v1.ConfigMap]
```

Για να δείτε τι αποδόθηκε, εκτελέστε ξανά με `--disable-openapi-validation`:
`helm install --dry-run --disable-openapi-validation measly-whippet ./mychart`.
Η έξοδος δεν θα είναι αυτή που περιμέναμε:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: measly-whippet-configmap
  labels:
    app_name: mychart
app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
app_name: mychart
app_version: "0.1.0"
```

Παρατηρήστε ότι η εσοχή στο `app_version` είναι λάθος και στις δύο θέσεις.
Γιατί; Επειδή το template που αντικαθίσταται έχει το κείμενο στοιχισμένο στα
αριστερά. Επειδή το `template` είναι μια ενέργεια και όχι μια συνάρτηση, δεν
υπάρχει τρόπος να μεταβιβάσουμε την έξοδο μιας κλήσης `template` σε άλλες
συναρτήσεις· τα δεδομένα απλά εισάγονται στη θέση τους.

Για να αντιμετωπίσουμε αυτή την περίπτωση, το Helm παρέχει μια εναλλακτική στο
`template` που θα εισάγει τα περιεχόμενα ενός template στο τρέχον pipeline όπου
μπορούν να μεταβιβαστούν σε άλλες συναρτήσεις στο pipeline.

Ακολουθεί το παράδειγμα παραπάνω, διορθωμένο ώστε να χρησιμοποιεί το `indent`
για να εσοχοποιεί το template `mychart.app` σωστά:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
{{ include "mychart.app" . | indent 4 }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ include "mychart.app" . | indent 2 }}
```

Τώρα το παραγόμενο YAML είναι σωστά εσοχοποιημένο για κάθε ενότητα:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-mole-configmap
  labels:
    app_name: mychart
    app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
  app_name: mychart
  app_version: "0.1.0"
```

> Θεωρείται προτιμότερο να χρησιμοποιείτε το `include` αντί για το `template`
> στα Helm templates, απλά επειδή η μορφοποίηση της εξόδου μπορεί να
> αντιμετωπιστεί καλύτερα για έγγραφα YAML.

Μερικές φορές θέλουμε να εισάγουμε περιεχόμενο, αλλά όχι ως templates. Δηλαδή,
θέλουμε να εισάγουμε αρχεία αυτούσια. Μπορούμε να το επιτύχουμε προσπελαύνοντας
αρχεία μέσω του αντικειμένου `.Files` που περιγράφεται στην επόμενη ενότητα.
