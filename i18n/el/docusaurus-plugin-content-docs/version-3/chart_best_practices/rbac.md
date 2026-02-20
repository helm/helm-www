---
title: Έλεγχος Πρόσβασης Βασισμένος σε Ρόλους (RBAC)
description: Συζητά τη δημιουργία και τη μορφοποίηση πόρων RBAC στα manifests των Charts.
sidebar_position: 8
---

Αυτό το μέρος του Οδηγού Βέλτιστων Πρακτικών ασχολείται με τη δημιουργία και τη
μορφοποίηση πόρων RBAC στα manifests των charts.

Οι πόροι RBAC είναι:

- ServiceAccount (namespaced)
- Role (namespaced)
- ClusterRole
- RoleBinding (namespaced)
- ClusterRoleBinding

## Διαμόρφωση YAML

Η διαμόρφωση RBAC και ServiceAccount θα πρέπει να γίνεται σε ξεχωριστά κλειδιά.
Είναι διαφορετικά πράγματα. Ο διαχωρισμός τους στο YAML αποσαφηνίζει τις έννοιες
και τις κάνει πιο κατανοητές.

```yaml
rbac:
  # Specifies whether RBAC resources should be created
  create: true

serviceAccount:
  # Specifies whether a ServiceAccount should be created
  create: true
  # The name of the ServiceAccount to use.
  # If not set and create is true, a name is generated using the fullname template
  name:
```

Αυτή η δομή μπορεί να επεκταθεί για πιο σύνθετα charts που απαιτούν πολλαπλά
ServiceAccounts.

```yaml
someComponent:
  serviceAccount:
    create: true
    name:
anotherComponent:
  serviceAccount:
    create: true
    name:
```

## Οι Πόροι RBAC Θα Πρέπει να Δημιουργούνται από Προεπιλογή

Το `rbac.create` θα πρέπει να είναι μια boolean τιμή που ελέγχει αν θα δημιουργηθούν
πόροι RBAC. Η προεπιλεγμένη τιμή θα πρέπει να είναι `true`. Οι χρήστες που επιθυμούν
να διαχειριστούν οι ίδιοι τους ελέγχους πρόσβασης RBAC μπορούν να ορίσουν αυτή την
τιμή σε `false` (δείτε παρακάτω).

## Χρήση Πόρων RBAC

Το `serviceAccount.name` θα πρέπει να οριστεί στο όνομα του ServiceAccount που θα
χρησιμοποιηθεί από τους πόρους με έλεγχο πρόσβασης που δημιουργεί το chart. Αν το
`serviceAccount.create` είναι true, τότε θα πρέπει να δημιουργηθεί ένα ServiceAccount
με αυτό το όνομα. Αν το όνομα δεν έχει οριστεί, τότε δημιουργείται ένα όνομα
χρησιμοποιώντας το template `fullname`. Αν το `serviceAccount.create` είναι false,
τότε δεν θα πρέπει να δημιουργηθεί, αλλά θα πρέπει να συσχετίζεται με τους ίδιους
πόρους ώστε οι πόροι RBAC που δημιουργούνται χειροκίνητα αργότερα και αναφέρονται
σε αυτό να λειτουργούν σωστά. Αν το `serviceAccount.create` είναι false και το όνομα
δεν έχει καθοριστεί, τότε χρησιμοποιείται το προεπιλεγμένο ServiceAccount.

Χρησιμοποιήστε το παρακάτω βοηθητικό template για το ServiceAccount.

```yaml
{{/*
Create the name of the service account to use
*/}}
{{- define "mychart.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "mychart.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}
```
