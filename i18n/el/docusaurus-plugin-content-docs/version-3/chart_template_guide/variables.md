---
title: Μεταβλητές
description: Χρήση μεταβλητών στα templates.
sidebar_position: 8
---

Αφού έχουμε δει τις συναρτήσεις, τα pipelines, τα αντικείμενα και τις δομές
ελέγχου, μπορούμε να περάσουμε σε μια από τις πιο βασικές έννοιες σε πολλές
γλώσσες προγραμματισμού: τις μεταβλητές. Στα templates, χρησιμοποιούνται λιγότερο
συχνά. Θα δούμε όμως πώς μπορούν να απλοποιήσουν τον κώδικα και να αξιοποιήσουν
καλύτερα τα `with` και `range`.

Σε ένα προηγούμενο παράδειγμα, είδαμε ότι αυτός ο κώδικας θα αποτύχει:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

Το `Release.Name` δεν βρίσκεται μέσα στο εύρος (scope) που περιορίζεται από το
block `with`. Ένας τρόπος για να αντιμετωπίσουμε προβλήματα εύρους είναι να
αναθέτουμε αντικείμενα σε μεταβλητές, στις οποίες μπορούμε να έχουμε πρόσβαση
ανεξάρτητα από το τρέχον εύρος.

Στα Helm templates, μια μεταβλητή είναι μια ονομασμένη αναφορά σε ένα άλλο
αντικείμενο. Ακολουθεί τη μορφή `$name`. Οι μεταβλητές αναθέτονται με έναν
ειδικό τελεστή ανάθεσης: `:=`. Μπορούμε να ξαναγράψουμε τα παραπάνω
χρησιμοποιώντας μια μεταβλητή για το `Release.Name`.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- $relname := .Release.Name -}}
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $relname }}
  {{- end }}
```

Παρατηρήστε ότι πριν ξεκινήσουμε το block `with`, αναθέτουμε `$relname :=
.Release.Name`. Τώρα μέσα στο block `with`, η μεταβλητή `$relname` εξακολουθεί
να δείχνει στο όνομα του release.

Η εκτέλεση αυτού θα παράγει:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: viable-badger-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  release: viable-badger
```

Οι μεταβλητές είναι ιδιαίτερα χρήσιμες στους βρόχους `range`. Μπορούν να
χρησιμοποιηθούν σε λίστες για να πάρουν τόσο τον δείκτη (index) όσο και
την τιμή:

```yaml
  toppings: |-
    {{- range $index, $topping := .Values.pizzaToppings }}
      {{ $index }}: {{ $topping }}
    {{- end }}

```

Παρατηρήστε ότι το `range` έρχεται πρώτο, μετά οι μεταβλητές, στη συνέχεια ο
τελεστής ανάθεσης και τέλος η λίστα. Αυτό θα αναθέσει τον ακέραιο δείκτη
(ξεκινώντας από το μηδέν) στην `$index` και την τιμή στην `$topping`. Η
εκτέλεση θα παράγει:

```yaml
  toppings: |-
      0: mushrooms
      1: cheese
      2: peppers
      3: onions
```

Για δομές δεδομένων που έχουν τόσο κλειδί όσο και τιμή, μπορούμε να
χρησιμοποιήσουμε το `range` για να λάβουμε και τα δύο. Για παράδειγμα,
μπορούμε να κάνουμε βρόχο στο `.Values.favorite` ως εξής:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

Στην πρώτη επανάληψη, το `$key` θα είναι `drink` και το `$val` θα είναι `coffee`,
και στη δεύτερη, το `$key` θα είναι `food` και το `$val` θα είναι `pizza`. Η
εκτέλεση των παραπάνω θα δημιουργήσει:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eager-rabbit-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

Οι μεταβλητές κανονικά δεν είναι "καθολικές" (global). Έχουν εύρος μόνο στο
block στο οποίο δηλώνονται. Προηγουμένως, αναθέσαμε την `$relname` στο
ανώτατο επίπεδο του template. Αυτή η μεταβλητή θα είναι διαθέσιμη σε όλο
το template. Όμως στο τελευταίο παράδειγμα, οι `$key` και `$val` θα είναι
διαθέσιμες μόνο μέσα στο block `{{ range... }}{{ end }}`.

Ωστόσο, υπάρχει μια μεταβλητή που δείχνει πάντα στο αρχικό context: `$`.
Αυτό μπορεί να είναι πολύ χρήσιμο όταν κάνουμε βρόχο με `range` και
χρειαζόμαστε το όνομα του release του chart.

Ένα παράδειγμα:

```yaml
{{- range .Values.tlsSecrets }}
---
apiVersion: v1
kind: Secret
metadata:
  name: {{ .name }}
  labels:
    # Many helm templates would use `.` below, but that will not work,
    # however `$` will work here
    app.kubernetes.io/name: {{ template "fullname" $ }}
    # I cannot reference .Chart.Name, but I can do $.Chart.Name
    helm.sh/chart: "{{ $.Chart.Name }}-{{ $.Chart.Version }}"
    app.kubernetes.io/instance: "{{ $.Release.Name }}"
    # Value from appVersion in Chart.yaml
    app.kubernetes.io/version: "{{ $.Chart.AppVersion }}"
    app.kubernetes.io/managed-by: "{{ $.Release.Service }}"
type: kubernetes.io/tls
data:
  tls.crt: {{ .certificate }}
  tls.key: {{ .key }}
{{- end }}
```

Μέχρι τώρα έχουμε δει μόνο ένα template που δηλώνεται σε ένα μόνο αρχείο. Αλλά
μια από τις ισχυρές δυνατότητες της γλώσσας template του Helm είναι η
ικανότητά της να δηλώνει πολλαπλά templates και να τα χρησιμοποιεί μαζί.
Θα περάσουμε σε αυτό στην επόμενη ενότητα.
