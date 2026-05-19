---
title: Templates
description: Μια πιο προσεκτική ματιά στις βέλτιστες πρακτικές που αφορούν τα templates.
sidebar_position: 3
---

Αυτό το μέρος του Οδηγού Βέλτιστων Πρακτικών εστιάζει στα templates.

## Δομή του `templates/` {#structure-of-templates}

Ο φάκελος `templates/` θα πρέπει να είναι δομημένος ως εξής:

- Τα αρχεία template θα πρέπει να έχουν την επέκταση `.yaml` αν παράγουν έξοδο YAML.
  Η επέκταση `.tpl` μπορεί να χρησιμοποιηθεί για αρχεία template που δεν παράγουν
  μορφοποιημένο περιεχόμενο.
- Τα ονόματα των αρχείων template θα πρέπει να χρησιμοποιούν παύλες (`my-example-configmap.yaml`),
  όχι camelcase.
- Κάθε ορισμός πόρου θα πρέπει να βρίσκεται στο δικό του αρχείο template.
- Τα ονόματα των αρχείων template θα πρέπει να αντικατοπτρίζουν τον τύπο του πόρου, π.χ.
  `foo-pod.yaml`, `bar-svc.yaml`

## Ονόματα Καθορισμένων Templates {#names-of-defined-templates}

Τα καθορισμένα templates (templates που δημιουργούνται μέσα σε μια οδηγία `{{ define }}`) είναι
προσβάσιμα από οπουδήποτε. Αυτό σημαίνει ότι ένα chart και όλα τα subcharts του θα έχουν
πρόσβαση σε όλα τα templates που δημιουργήθηκαν με `{{ define }}`.

Για αυτόν τον λόγο, _όλα τα ονόματα καθορισμένων templates θα πρέπει να έχουν namespace._

Σωστό:

```yaml
{{- define "nginx.fullname" }}
{{/* ... */}}
{{ end -}}
```

Λάθος:

```yaml
{{- define "fullname" -}}
{{/* ... */}}
{{ end -}}
```
Συνιστάται ιδιαίτερα να δημιουργούνται νέα charts μέσω της εντολής `helm create`,
καθώς τα ονόματα των templates ορίζονται αυτόματα σύμφωνα με αυτή τη βέλτιστη πρακτική.

## Μορφοποίηση Templates {#formatting-templates}

Τα templates θα πρέπει να έχουν εσοχή με _δύο κενά_ (ποτέ tabs).

Οι οδηγίες template θα πρέπει να έχουν κενό μετά τα αρχικά άγκιστρα και πριν τα
τελικά άγκιστρα:

Σωστό:
```
{{ .foo }}
{{ print "foo" }}
{{- print "bar" -}}
```

Λάθος:
```
{{.foo}}
{{print "foo"}}
{{-print "bar"-}}
```

Τα templates θα πρέπει να περικόπτουν τα κενά όπου είναι δυνατόν:

```yaml
foo:
  {{- range .Values.items }}
  {{ . }}
  {{ end -}}
```

Τα blocks (όπως οι δομές ελέγχου) μπορούν να έχουν εσοχή για να υποδεικνύουν τη ροή του
κώδικα του template.

```
{{ if $foo -}}
  {{- with .Bar }}Hello{{ end -}}
{{- end -}}
```

Ωστόσο, δεδομένου ότι το YAML είναι μια γλώσσα που βασίζεται στα κενά, συχνά δεν είναι δυνατό
η εσοχή του κώδικα να ακολουθεί αυτή τη σύμβαση.

## Κενά στα Παραγόμενα Templates {#whitespace-in-generated-templates}

Είναι προτιμότερο να κρατάτε τον αριθμό των κενών στα παραγόμενα templates στο
ελάχιστο. Ειδικότερα, δεν θα πρέπει να εμφανίζονται πολλές κενές γραμμές διαδοχικά.
Αλλά περιστασιακά κενές γραμμές (ιδιαίτερα μεταξύ λογικών ενοτήτων) είναι αποδεκτές.

Αυτό είναι το καλύτερο:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example
  labels:
    first: first
    second: second
```

Αυτό είναι αποδεκτό:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example

  labels:
    first: first
    second: second

```

Αλλά αυτό θα πρέπει να αποφεύγεται:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example





  labels:
    first: first

    second: second

```

## Σχόλια (Σχόλια YAML έναντι Σχολίων Template) {#comments-yaml-comments-vs-template-comments}

Τόσο το YAML όσο και τα Helm Templates έχουν δείκτες σχολίων.

Σχόλια YAML:
```yaml
# This is a comment {#this-is-a-comment}
type: sprocket
```

Σχόλια Template:
```yaml
{{- /*
This is a comment.
*/}}
type: frobnitz
```

Τα σχόλια template θα πρέπει να χρησιμοποιούνται όταν τεκμηριώνετε χαρακτηριστικά ενός template,
όπως για να εξηγήσετε ένα καθορισμένο template:

```yaml
{{- /*
mychart.shortname provides a 6 char truncated version of the release name.
*/}}
{{ define "mychart.shortname" -}}
{{ .Release.Name | trunc 6 }}
{{- end -}}

```

Μέσα στα templates, τα σχόλια YAML μπορούν να χρησιμοποιηθούν όταν είναι χρήσιμο για τους
χρήστες του Helm να (πιθανώς) δουν τα σχόλια κατά την αποσφαλμάτωση.

```yaml
# This may cause problems if the value is more than 100Gi {#this-may-cause-problems-if-the-value-is-more-than-100gi} {#this-may-cause-problems-if-the-value-is-more-than-100gi} {#this-may-cause-problems-if-the-value-is-more-than-100gi} {#this-may-cause-problems-if-the-value-is-more-than-100gi} {#this-may-cause-problems-if-the-value-is-more-than-100gi}
memory: {{ .Values.maxMem | quote }}
```

Το παραπάνω σχόλιο είναι ορατό όταν ο χρήστης εκτελεί `helm install --debug`, ενώ
τα σχόλια που καθορίζονται σε ενότητες `{{- /* */}}` δεν είναι.

Να είστε προσεκτικοί όταν προσθέτετε σχόλια YAML με `#` σε ενότητες template που περιέχουν τιμές Helm που μπορεί να απαιτούνται από ορισμένες συναρτήσεις template.

Για παράδειγμα, αν η συνάρτηση `required` χρησιμοποιηθεί στο παραπάνω παράδειγμα και το `maxMem` δεν έχει οριστεί, τότε ένα σχόλιο YAML με `#` θα προκαλέσει σφάλμα rendering.

Σωστό: το `helm template` δεν κάνει render αυτό το block
```yaml
{{- /*
# This may cause problems if the value is more than 100Gi
memory: {{ required "maxMem must be set" .Values.maxMem | quote }}
*/ -}}
```

Λάθος: το `helm template` επιστρέφει `Error: execution error at (templates/test.yaml:2:13): maxMem must be set`
```yaml
# This may cause problems if the value is more than 100Gi
# memory: {{ required .Values.maxMem "maxMem must be set" | quote }} {#memory-required-valuesmaxmem-maxmem-must-be-set-quote}
```

Δείτε το [Αποσφαλμάτωση Templates](../chart_template_guide/debugging.md) για ένα ακόμη παράδειγμα αυτής της συμπεριφοράς όπου τα σχόλια YAML παραμένουν άθικτα.

## Χρήση JSON σε Templates και Έξοδο Template {#use-of-json-in-templates-and-template-output}

Το YAML είναι ένα υπερσύνολο του JSON. Σε ορισμένες περιπτώσεις, η χρήση σύνταξης JSON μπορεί να είναι
πιο ευανάγνωστη από άλλες αναπαραστάσεις YAML.

Για παράδειγμα, αυτό το YAML είναι πιο κοντά στον κανονικό τρόπο YAML για την έκφραση λιστών:

```yaml
arguments:
  - "--dirname"
  - "/foo"
```

Αλλά είναι ευκολότερο να διαβαστεί όταν συμπτύσσεται σε στυλ λίστας JSON:

```yaml
arguments: ["--dirname", "/foo"]
```

Η χρήση JSON για βελτιωμένη αναγνωσιμότητα είναι καλή. Ωστόσο, η σύνταξη JSON δεν θα πρέπει να
χρησιμοποιείται για την αναπαράσταση πιο σύνθετων δομών.

Όταν αντιμετωπίζετε καθαρό JSON ενσωματωμένο μέσα σε YAML (όπως διαμόρφωση init container),
είναι φυσικά κατάλληλο να χρησιμοποιείτε τη μορφή JSON.
