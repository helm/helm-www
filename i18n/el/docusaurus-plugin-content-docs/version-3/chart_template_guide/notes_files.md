---
title: Δημιουργία αρχείου NOTES.txt
description: Πώς να παρέχετε οδηγίες στους χρήστες του Chart σας.
sidebar_position: 10
---

Σε αυτή την ενότητα θα εξετάσουμε το εργαλείο του Helm για την παροχή οδηγιών
στους χρήστες του chart σας. Στο τέλος μιας εντολής `helm install` ή `helm
upgrade`, το Helm μπορεί να εμφανίσει ένα μπλοκ χρήσιμων πληροφοριών για τους
χρήστες. Αυτές οι πληροφορίες είναι πλήρως προσαρμόσιμες μέσω templates.

Για να προσθέσετε σημειώσεις εγκατάστασης στο chart σας, απλά δημιουργήστε ένα
αρχείο `templates/NOTES.txt`. Αυτό το αρχείο είναι απλό κείμενο, αλλά
επεξεργάζεται σαν template και έχει πρόσβαση σε όλες τις συνήθεις συναρτήσεις
και αντικείμενα template.

Ας δημιουργήσουμε ένα απλό αρχείο `NOTES.txt`:

```
Thank you for installing {{ .Chart.Name }}.

Your release is named {{ .Release.Name }}.

To learn more about the release, try:

  $ helm status {{ .Release.Name }}
  $ helm get all {{ .Release.Name }}

```

Αν εκτελέσουμε τώρα `helm install rude-cardinal ./mychart`, θα δούμε αυτό το
μήνυμα στο τέλος:

```
RESOURCES:
==> v1/Secret
NAME                   TYPE      DATA      AGE
rude-cardinal-secret   Opaque    1         0s

==> v1/ConfigMap
NAME                      DATA      AGE
rude-cardinal-configmap   3         0s


NOTES:
Thank you for installing mychart.

Your release is named rude-cardinal.

To learn more about the release, try:

  $ helm status rude-cardinal
  $ helm get all rude-cardinal
```

Η χρήση του `NOTES.txt` με αυτόν τον τρόπο είναι εξαιρετική για να παρέχετε στους
χρήστες σας λεπτομερείς πληροφορίες σχετικά με τη χρήση του chart που μόλις
εγκατέστησαν. Η δημιουργία ενός αρχείου `NOTES.txt` συνιστάται ιδιαίτερα, αν και
δεν είναι υποχρεωτική.
