---
title: Έλεγχος Ροής
description: Μια γρήγορη επισκόπηση της δομής ροής στα templates.
sidebar_position: 7
---

Οι δομές ελέγχου (που ονομάζονται «actions» στην ορολογία των templates) σας
δίνουν τη δυνατότητα να ελέγχετε τη ροή παραγωγής ενός template. Η γλώσσα
template του Helm παρέχει τις ακόλουθες δομές ελέγχου:

- `if`/`else` για τη δημιουργία blocks υπό συνθήκη
- `with` για τον καθορισμό εύρους (scope)
- `range`, που παρέχει έναν βρόχο τύπου «for each»

Επιπλέον, παρέχει μερικές ενέργειες για τη δήλωση και χρήση ονομασμένων
τμημάτων template:

- `define` δηλώνει ένα νέο ονομασμένο template μέσα στο template σας
- `template` εισάγει ένα ονομασμένο template
- `block` δηλώνει έναν ειδικό τύπο περιοχής template που μπορεί να συμπληρωθεί

Σε αυτήν την ενότητα, θα μιλήσουμε για τα `if`, `with` και `range`. Τα υπόλοιπα
καλύπτονται στην ενότητα «Ονομασμένα Templates» αργότερα σε αυτόν τον οδηγό.

## If/Else {#ifelse}

Η πρώτη δομή ελέγχου που θα εξετάσουμε είναι για τη συμπερίληψη blocks κειμένου
υπό συνθήκη σε ένα template. Πρόκειται για το block `if`/`else`.

Η βασική δομή για μια συνθήκη έχει την εξής μορφή:

```
{{ if PIPELINE }}
  # Do something
{{ else if OTHER PIPELINE }}
  # Do something else
{{ else }}
  # Default case
{{ end }}
```

Παρατηρήστε ότι τώρα μιλάμε για _pipelines_ αντί για τιμές. Ο λόγος είναι
να γίνει σαφές ότι οι δομές ελέγχου μπορούν να εκτελέσουν ένα ολόκληρο
pipeline, όχι απλά να αξιολογήσουν μια τιμή.

Ένα pipeline αξιολογείται ως _false_ αν η τιμή είναι:

- boolean false
- αριθμητικό μηδέν
- κενό string
- `nil` (κενό ή null)
- κενή συλλογή (`map`, `slice`, `tuple`, `dict`, `array`)

Σε όλες τις άλλες περιπτώσεις, η συνθήκη είναι true.

Ας προσθέσουμε μια απλή συνθήκη στο ConfigMap μας. Θα προσθέσουμε μια ακόμη
ρύθμιση αν το drink έχει οριστεί σε coffee:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}mug: "true"{{ end }}
```

Επειδή σχολιάσαμε το `drink: coffee` στο προηγούμενο παράδειγμά μας, η έξοδος
δεν θα πρέπει να περιλαμβάνει τη σημαία `mug: "true"`. Αλλά αν προσθέσουμε
ξανά αυτή τη γραμμή στο αρχείο `values.yaml`, η έξοδος θα πρέπει να μοιάζει
με αυτό:

```yaml
# Source: mychart/templates/configmap.yaml {#source-mycharttemplatesconfigmapyaml} {#source-mycharttemplatesconfigmapyaml} {#source-mycharttemplatesconfigmapyaml} {#source-mycharttemplatesconfigmapyaml} {#source-mycharttemplatesconfigmapyaml} {#source-mycharttemplatesconfigmapyaml} {#source-mycharttemplatesconfigmapyaml} {#source-mycharttemplatesconfigmapyaml} {#source-mycharttemplatesconfigmapyaml}
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

## Έλεγχος Κενών Χαρακτήρων {#controlling-whitespace}

Ενώ εξετάζουμε τις συνθήκες, ας δούμε γρήγορα πώς ελέγχονται οι κενοί
χαρακτήρες (whitespace) στα templates. Ας πάρουμε το προηγούμενο παράδειγμα
και ας το μορφοποιήσουμε για να είναι πιο ευανάγνωστο:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
    mug: "true"
  {{ end }}
```

Αρχικά, αυτό φαίνεται καλό. Αλλά αν το περάσουμε από τη μηχανή template, θα
πάρουμε ένα ατυχές αποτέλεσμα:

```console
$ helm install --dry-run --debug ./mychart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart
Error: YAML parse error on mychart/templates/configmap.yaml: error converting YAML to JSON: yaml: line 9: did not find expected key
```

Τι συνέβη; Δημιουργήσαμε λανθασμένο YAML λόγω των κενών χαρακτήρων παραπάνω.

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
    mug: "true"
```

Το `mug` έχει λανθασμένη εσοχή. Ας αφαιρέσουμε απλά την εσοχή από αυτή τη
γραμμή και ας ξανατρέξουμε:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{ end }}
```

Όταν το στείλουμε, θα πάρουμε YAML που είναι έγκυρο, αλλά εξακολουθεί να
φαίνεται λίγο περίεργο:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: telling-chimp-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"

  mug: "true"

```

Παρατηρήστε ότι πήραμε μερικές κενές γραμμές στο YAML μας. Γιατί; Όταν η μηχανή
template εκτελείται, _αφαιρεί_ τα περιεχόμενα μέσα από τα `{{` και `}}`, αλλά
αφήνει τους υπόλοιπους κενούς χαρακτήρες ακριβώς όπως είναι.

Το YAML αποδίδει νόημα στους κενούς χαρακτήρες, οπότε η διαχείρισή τους
γίνεται αρκετά σημαντική. Ευτυχώς, τα Helm templates έχουν μερικά εργαλεία
για να βοηθήσουν.

Πρώτον, η σύνταξη με άγκιστρα των δηλώσεων template μπορεί να τροποποιηθεί
με ειδικούς χαρακτήρες για να ενημερώσει τη μηχανή template να «κόψει»
(chomp) τους κενούς χαρακτήρες. Το `{{- ` (με παύλα και κενό) υποδεικνύει
ότι οι κενοί χαρακτήρες αριστερά πρέπει να αφαιρεθούν, ενώ το ` -}}`
σημαίνει ότι οι κενοί χαρακτήρες δεξιά πρέπει να καταναλωθούν. _Προσοχή!
Οι αλλαγές γραμμής (newlines) είναι κενοί χαρακτήρες!_

> Βεβαιωθείτε ότι υπάρχει ένα κενό ανάμεσα στην `-` και το υπόλοιπο της
> οδηγίας σας. Το `{{- 3 }}` σημαίνει «κόψε τους κενούς χαρακτήρες αριστερά
> και τύπωσε 3», ενώ το `{{-3 }}` σημαίνει «τύπωσε -3».

Χρησιμοποιώντας αυτή τη σύνταξη, μπορούμε να τροποποιήσουμε το template μας
για να απαλλαγούμε από αυτές τις νέες γραμμές:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{- end }}
```

Για να γίνει αυτό το σημείο ξεκάθαρο, ας προσαρμόσουμε τα παραπάνω και
ας αντικαταστήσουμε με ένα `*` κάθε κενό χαρακτήρα που θα διαγραφεί
ακολουθώντας αυτόν τον κανόνα. Ένα `*` στο τέλος της γραμμής υποδεικνύει
έναν χαρακτήρα αλλαγής γραμμής που θα αφαιρεθεί

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}*
**{{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"*
**{{- end }}

```

Έχοντας αυτό υπόψη, μπορούμε να περάσουμε το template μας μέσω του Helm και
να δούμε το αποτέλεσμα:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: clunky-cat-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

Να είστε προσεκτικοί με τους τροποποιητές κοπής (chomping modifiers). Είναι
εύκολο να κάνετε κατά λάθος πράγματα όπως αυτό:

```yaml
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" -}}
  mug: "true"
  {{- end -}}

```

Αυτό θα παράγει `food: "PIZZA"mug: "true"` επειδή κατανάλωσε τις αλλαγές
γραμμής και στις δύο πλευρές.

> Για λεπτομέρειες σχετικά με τον έλεγχο κενών χαρακτήρων στα templates, δείτε
> την [Επίσημη τεκμηρίωση των Go templates](https://godoc.org/text/template)

Τέλος, μερικές φορές είναι ευκολότερο να πείτε στο σύστημα template πώς να
κάνει εσοχή για εσάς αντί να προσπαθείτε να κατακτήσετε τη διαστημάτωση των
οδηγιών template. Για αυτόν τον λόγο, μπορεί να βρείτε χρήσιμο να
χρησιμοποιήσετε τη συνάρτηση `indent` (`{{ indent 2 "mug:true" }}`).

## Τροποποίηση εύρους με το `with` {#modifying-scope-using-with}

Η επόμενη δομή ελέγχου που θα εξετάσουμε είναι η ενέργεια `with`. Αυτή
ελέγχει το εύρος (scoping) των μεταβλητών. Θυμηθείτε ότι η `.` είναι μια
αναφορά στο _τρέχον εύρος_. Έτσι, το `.Values` λέει στο template να βρει
το αντικείμενο `Values` στο τρέχον εύρος.

Η σύνταξη για το `with` είναι παρόμοια με μια απλή δήλωση `if`:

```
{{ with PIPELINE }}
  # restricted scope
{{ end }}
```

Τα εύρη μπορούν να αλλάξουν. Το `with` μπορεί να σας επιτρέψει να ορίσετε
το τρέχον εύρος (`.`) σε ένα συγκεκριμένο αντικείμενο. Για παράδειγμα, έχουμε
δουλέψει με το `.Values.favorite`. Ας ξαναγράψουμε το ConfigMap μας για να
αλλάξουμε το εύρος της `.` ώστε να δείχνει στο `.Values.favorite`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
```

Σημειώστε ότι αφαιρέσαμε τη συνθήκη `if` από την προηγούμενη άσκηση επειδή
δεν είναι πλέον απαραίτητη - το block μετά το `with` εκτελείται μόνο αν η
τιμή του `PIPELINE` δεν είναι κενή.

Παρατηρήστε ότι τώρα μπορούμε να αναφερθούμε στα `.drink` και `.food` χωρίς
να τα προσδιορίσουμε πλήρως. Αυτό συμβαίνει επειδή η δήλωση `with` ορίζει
τη `.` να δείχνει στο `.Values.favorite`. Η `.` επαναφέρεται στο προηγούμενο
εύρος της μετά το `{{ end }}`.

Αλλά εδώ υπάρχει μια προειδοποίηση! Μέσα στο περιορισμένο εύρος, δεν θα
μπορείτε να έχετε πρόσβαση στα άλλα αντικείμενα από το γονικό εύρος
χρησιμοποιώντας τη `.`. Αυτό, για παράδειγμα, θα αποτύχει:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

Θα παράγει σφάλμα επειδή το `Release.Name` δεν βρίσκεται μέσα στο περιορισμένο
εύρος της `.`. Ωστόσο, αν εναλλάξουμε τις δύο τελευταίες γραμμές, όλα θα
λειτουργήσουν όπως αναμένεται επειδή το εύρος επαναφέρεται μετά το `{{ end }}`.

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  release: {{ .Release.Name }}
```

Ή, μπορούμε να χρησιμοποιήσουμε το `$` για πρόσβαση στο αντικείμενο
`Release.Name` από το γονικό εύρος. Το `$` αντιστοιχίζεται στο αρχικό (root)
εύρος όταν ξεκινά η εκτέλεση του template και δεν αλλάζει κατά την εκτέλεση.
Το παρακάτω θα λειτουργούσε επίσης:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $.Release.Name }}
  {{- end }}
```

Αφού δούμε το `range`, θα ρίξουμε μια ματιά στις μεταβλητές template, που
προσφέρουν μια λύση στο πρόβλημα εύρους παραπάνω.

## Βρόχοι με την ενέργεια `range` {#looping-with-the-range-action}

Πολλές γλώσσες προγραμματισμού υποστηρίζουν βρόχους με `for` loops, `foreach`
loops ή παρόμοιους μηχανισμούς. Στη γλώσσα template του Helm, ο τρόπος για να
επαναλάβετε μια συλλογή είναι να χρησιμοποιήσετε τον τελεστή `range`.

Για να ξεκινήσουμε, ας προσθέσουμε μια λίστα με υλικά πίτσας στο αρχείο
`values.yaml`:

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions
  - pineapple
```

Τώρα έχουμε μια λίστα (που ονομάζεται `slice` στα templates) με `pizzaToppings`.
Μπορούμε να τροποποιήσουμε το template μας για να εκτυπώσει αυτή τη λίστα
στο ConfigMap μας:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  toppings: |-
    {{- range .Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}

```

Μπορούμε να χρησιμοποιήσουμε το `$` για πρόσβαση στη λίστα `Values.pizzaToppings`
από το γονικό εύρος. Το `$` αντιστοιχίζεται στο αρχικό (root) εύρος όταν ξεκινά
η εκτέλεση του template και δεν αλλάζει κατά την εκτέλεση. Το παρακάτω θα
λειτουργούσε επίσης:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  toppings: |-
    {{- range $.Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}
  {{- end }}
```

Ας δούμε πιο προσεκτικά τη λίστα `toppings:`. Η συνάρτηση `range` θα «διατρέξει»
(επαναλάβει) τη λίστα `pizzaToppings`. Αλλά τώρα συμβαίνει κάτι ενδιαφέρον.
Όπως ακριβώς το `with` ορίζει το εύρος της `.`, έτσι και ο τελεστής `range`.
Κάθε φορά που περνάμε τον βρόχο, η `.` ορίζεται στο τρέχον υλικό πίτσας.
Δηλαδή, την πρώτη φορά, η `.` ορίζεται σε `mushrooms`. Στη δεύτερη επανάληψη
ορίζεται σε `cheese`, και ούτω καθεξής.

Μπορούμε να στείλουμε την τιμή της `.` απευθείας σε ένα pipeline, οπότε
όταν κάνουμε `{{ . | title | quote }}`, στέλνει τη `.` στην `title` (συνάρτηση
κεφαλαιοποίησης τίτλου) και στη συνέχεια στην `quote`. Αν εκτελέσουμε αυτό
το template, η έξοδος θα είναι:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-dragonfly-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  toppings: |-
    - "Mushrooms"
    - "Cheese"
    - "Peppers"
    - "Onions"
    - "Pineapple"
```

Σε αυτό το παράδειγμα κάναμε κάτι δύσκολο. Η γραμμή `toppings: |-` δηλώνει
ένα string πολλαπλών γραμμών. Επομένως, η λίστα υλικών μας δεν είναι στην
πραγματικότητα μια λίστα YAML. Είναι ένα μεγάλο string. Γιατί να το κάνουμε
αυτό; Επειδή τα δεδομένα στο `data` των ConfigMaps αποτελούνται από ζεύγη
κλειδιού/τιμής, όπου τόσο το κλειδί όσο και η τιμή είναι απλά strings. Για
να καταλάβετε γιατί συμβαίνει αυτό, δείτε την
[τεκμηρίωση Kubernetes ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/).
Για εμάς, όμως, αυτή η λεπτομέρεια δεν έχει μεγάλη σημασία.

> Ο δείκτης `|-` στο YAML λαμβάνει ένα string πολλαπλών γραμμών. Αυτό μπορεί
> να είναι μια χρήσιμη τεχνική για την ενσωμάτωση μεγάλων blocks δεδομένων
> μέσα στα manifests σας, όπως φαίνεται εδώ.

Μερικές φορές είναι χρήσιμο να μπορείτε να δημιουργήσετε γρήγορα μια λίστα
μέσα στο template σας, και στη συνέχεια να επαναλάβετε αυτή τη λίστα. Τα
Helm templates έχουν μια συνάρτηση για να το κάνουν εύκολο: την `tuple`. Στην
επιστήμη των υπολογιστών, μια tuple είναι μια συλλογή τύπου λίστας με
σταθερό μέγεθος, αλλά με αυθαίρετους τύπους δεδομένων. Αυτό αποδίδει κατά
προσέγγιση τον τρόπο χρήσης της `tuple`.

```yaml
  sizes: |-
    {{- range tuple "small" "medium" "large" }}
    - {{ . }}
    {{- end }}
```

Το παραπάνω θα παράγει:

```yaml
  sizes: |-
    - small
    - medium
    - large
```

Εκτός από λίστες και tuples, το `range` μπορεί να χρησιμοποιηθεί για
επανάληψη πάνω σε συλλογές που έχουν κλειδί και τιμή (όπως ένα `map` ή
`dict`). Θα δούμε πώς να το κάνουμε αυτό στην επόμενη ενότητα όταν
εισαγάγουμε τις μεταβλητές template.
