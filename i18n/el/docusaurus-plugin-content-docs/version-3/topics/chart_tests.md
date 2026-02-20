---
title: Δοκιμές Charts
description: Περιγράφει τον τρόπο εκτέλεσης και δοκιμής των charts σας.
sidebar_position: 3
---

Ένα chart περιέχει πολλούς πόρους Kubernetes και components που λειτουργούν
μαζί. Ως δημιουργός chart, μπορεί να θέλετε να γράψετε κάποιες δοκιμές που
επαληθεύουν ότι το chart σας λειτουργεί όπως αναμένεται κατά την εγκατάσταση.
Αυτές οι δοκιμές βοηθούν επίσης τους χρήστες του chart να κατανοήσουν τι
υποτίθεται ότι κάνει το chart σας.

Μια **δοκιμή** σε ένα Helm chart βρίσκεται στον φάκελο `templates/` και είναι
ένας ορισμός Job που καθορίζει ένα container με μια συγκεκριμένη εντολή προς
εκτέλεση. Το container πρέπει να τερματίσει επιτυχώς (exit 0) για να θεωρηθεί
η δοκιμή επιτυχής. Ο ορισμός του Job πρέπει να περιέχει το annotation hook
δοκιμής του Helm: `helm.sh/hook: test`.

Σημειώστε ότι μέχρι το Helm v3, ο ορισμός του Job έπρεπε να περιέχει ένα από τα
παρακάτω annotations hook δοκιμής του Helm: `helm.sh/hook: test-success` ή
`helm.sh/hook: test-failure`. Το `helm.sh/hook: test-success` εξακολουθεί να
γίνεται αποδεκτό ως εναλλακτική επιλογή συμβατή προς τα πίσω αντί του
`helm.sh/hook: test`.

Παραδείγματα δοκιμών:

- Επαλήθευση ότι η ρύθμιση παραμέτρων από το αρχείο values.yaml εισήχθη σωστά.
  - Βεβαιωθείτε ότι το όνομα χρήστη και ο κωδικός πρόσβασης λειτουργούν σωστά
  - Βεβαιωθείτε ότι ένα εσφαλμένο όνομα χρήστη και κωδικός πρόσβασης δεν
    λειτουργεί
- Επιβεβαίωση ότι οι υπηρεσίες σας είναι ενεργές και κατανέμουν σωστά το φορτίο
- κ.λπ.

Μπορείτε να εκτελέσετε τις προκαθορισμένες δοκιμές του Helm σε ένα release
χρησιμοποιώντας την εντολή `helm test <RELEASE_NAME>`. Για τους χρήστες ενός
chart, αυτός είναι ένας εξαιρετικός τρόπος να ελέγξουν ότι το release του chart
(ή της εφαρμογής) λειτουργεί όπως αναμένεται.

## Παράδειγμα Δοκιμής

Η εντολή [helm create](/helm/helm_create.md) δημιουργεί αυτόματα έναν αριθμό
φακέλων και αρχείων. Για να δοκιμάσετε τη λειτουργικότητα του helm test,
δημιουργήστε πρώτα ένα demo Helm chart.

```console
$ helm create demo
```

Θα μπορείτε πλέον να δείτε την ακόλουθη δομή στο demo Helm chart σας.

```
demo/
  Chart.yaml
  values.yaml
  charts/
  templates/
  templates/tests/test-connection.yaml
```

Στο `demo/templates/tests/test-connection.yaml` θα βρείτε μια δοκιμή που μπορείτε
να δοκιμάσετε. Παρακάτω μπορείτε να δείτε τον ορισμό του pod δοκιμής του Helm:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "demo.fullname" . }}-test-connection"
  labels:
    {{- include "demo.labels" . | nindent 4 }}
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['{{ include "demo.fullname" . }}:{{ .Values.service.port }}']
  restartPolicy: Never

```

## Βήματα για την Εκτέλεση μιας Σουίτας Δοκιμών σε ένα Release

Πρώτα, εγκαταστήστε το chart στο cluster σας για να δημιουργήσετε ένα release.
Μπορεί να χρειαστεί να περιμένετε μέχρι όλα τα pods να γίνουν ενεργά· αν
εκτελέσετε τη δοκιμή αμέσως μετά την εγκατάσταση, μπορεί να εμφανιστεί παροδικό
σφάλμα και θα θέλετε να επαναλάβετε τη δοκιμή.

```console
$ helm install demo demo --namespace default
$ helm test demo
NAME: demo
LAST DEPLOYED: Mon Feb 14 20:03:16 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE:     demo-test-connection
Last Started:   Mon Feb 14 20:35:19 2022
Last Completed: Mon Feb 14 20:35:23 2022
Phase:          Succeeded
[...]
```

## Σημειώσεις

- Μπορείτε να ορίσετε όσες δοκιμές θέλετε σε ένα μόνο αρχείο yaml ή να τις
  κατανείμετε σε πολλά αρχεία yaml στον φάκελο `templates/`.
- Μπορείτε να τοποθετήσετε τη σουίτα δοκιμών σας σε έναν υποφάκελο `tests/`
  όπως `<chart-name>/templates/tests/` για καλύτερη απομόνωση.
- Μια δοκιμή είναι ένα [Helm hook](/topics/charts_hooks.md), επομένως annotations
  όπως `helm.sh/hook-weight` και `helm.sh/hook-delete-policy` μπορούν να
  χρησιμοποιηθούν με τους πόρους δοκιμών.
