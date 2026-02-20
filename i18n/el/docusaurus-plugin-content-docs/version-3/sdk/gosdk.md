---
title: Εισαγωγή
description: Εισαγωγή στο Helm Go SDK
sidebar_position: 1
---
Το Go SDK του Helm επιτρέπει σε προσαρμοσμένο λογισμικό να αξιοποιεί τα Helm charts και
τη λειτουργικότητα του Helm για τη διαχείριση εγκατάστασης λογισμικού στο Kubernetes
(το Helm CLI είναι στην πραγματικότητα ένα τέτοιο εργαλείο!).

Επί του παρόντος, το SDK έχει διαχωριστεί λειτουργικά από το Helm CLI.
Το SDK μπορεί να χρησιμοποιηθεί (και χρησιμοποιείται) από αυτόνομα εργαλεία.
Το Helm project έχει δεσμευτεί για τη σταθερότητα του API του SDK.
Ως προειδοποίηση, το SDK διατηρεί ακόμη κάποιες ατέλειες από την αρχική εργασία
διαχωρισμού CLI και SDK, τις οποίες το Helm project στοχεύει να βελτιώσει σταδιακά.

Πλήρης τεκμηρίωση του API μπορεί να βρεθεί στη διεύθυνση [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3).

Μια σύντομη επισκόπηση ορισμένων από τους κύριους τύπους πακέτων και ένα απλό παράδειγμα
ακολουθούν παρακάτω.
Δείτε την ενότητα [Παραδείγματα](./examples.md) για περισσότερα παραδείγματα και έναν
πιο ολοκληρωμένο 'driver'.

## Επισκόπηση των κύριων πακέτων {#main-package-overview}

- [pkg/action](https://pkg.go.dev/helm.sh/helm/v3/pkg/action):
  Περιέχει τον κύριο "client" για την εκτέλεση ενεργειών Helm.
  Αυτό είναι το ίδιο πακέτο που χρησιμοποιεί το CLI εσωτερικά.
  Αν χρειάζεστε απλώς να εκτελέσετε βασικές εντολές Helm από άλλο πρόγραμμα Go, αυτό
  είναι το πακέτο για εσάς
- [pkg/chart](https://pkg.go.dev/helm.sh/helm/v3/pkg/chart), [pkg/chartutil](https://pkg.go.dev/helm.sh/helm/v3/pkg/chartutil):
  Μέθοδοι και βοηθητικά εργαλεία για τη φόρτωση και χειρισμό charts
- [pkg/cli](https://pkg.go.dev/helm.sh/helm/v3/pkg/cli) και τα υποπακέτα του:
  Περιέχει όλους τους handlers για τις τυπικές μεταβλητές περιβάλλοντος του Helm.
  Τα υποπακέτα περιέχουν χειρισμό εξόδου και αρχείων values
- [pkg/release](https://pkg.go.dev/helm.sh/helm/v3/pkg/release):
  Ορίζει το αντικείμενο `Release` και τις καταστάσεις του

Υπάρχουν πολλά περισσότερα πακέτα εκτός από αυτά, οπότε δείτε την τεκμηρίωση για
περισσότερες πληροφορίες!

### Απλό παράδειγμα {#simple-example}
Αυτό είναι ένα απλό παράδειγμα εκτέλεσης `helm list` χρησιμοποιώντας το Go SDK.
Δείτε την ενότητα [Παραδείγματα](./examples.md) για πιο ολοκληρωμένα παραδείγματα.

```go
package main

import (
    "log"
    "os"

    "helm.sh/helm/v3/pkg/action"
    "helm.sh/helm/v3/pkg/cli"
)

func main() {
    settings := cli.New()

    actionConfig := new(action.Configuration)
    // You can pass an empty string instead of settings.Namespace() to list
    // all namespaces
    if err := actionConfig.Init(settings.RESTClientGetter(), settings.Namespace(), os.Getenv("HELM_DRIVER"), log.Printf); err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    client := action.NewList(actionConfig)
    // Only list deployed
    client.Deployed = true
    results, err := client.Run()
    if err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    for _, rel := range results {
        log.Printf("%+v", rel)
    }
}

```


## Συμβατότητα {#compatibility}

Το Helm SDK ακολουθεί ρητά τις εγγυήσεις συμβατότητας προς τα πίσω του Helm:

<https://github.com/helm/community/blob/main/hips/hip-0004.md>

Αυτό σημαίνει ότι αλλαγές που διακόπτουν τη συμβατότητα θα γίνονται μόνο μεταξύ major versions.
