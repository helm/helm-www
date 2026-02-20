---
title: Αντιμετώπιση Προβλημάτων
sidebar_position: 4
---

## Αντιμετώπιση Προβλημάτων

### Λαμβάνω μια προειδοποίηση σχετικά με "Unable to get an update from the "stable" chart repository"

Εκτελέστε `helm repo list`. Αν το αποθετήριο `stable` χρησιμοποιεί URL από το `storage.googleapis.com`, θα πρέπει να το ενημερώσετε. Στις 13 Νοεμβρίου 2020, το αποθετήριο Helm Charts [έπαψε να υποστηρίζεται](https://github.com/helm/charts#deprecation-timeline) μετά από μια περίοδο κατάργησης ενός έτους. Ένα αρχείο είναι διαθέσιμο στο `https://charts.helm.sh/stable` αλλά δεν θα λαμβάνει πλέον ενημερώσεις.

Μπορείτε να εκτελέσετε την ακόλουθη εντολή για να διορθώσετε το αποθετήριο σας:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Το ίδιο ισχύει για το αποθετήριο `incubator`, το οποίο έχει ένα αρχείο διαθέσιμο στο https://charts.helm.sh/incubator. Μπορείτε να εκτελέσετε την ακόλουθη εντολή για να το επιδιορθώσετε:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Λαμβάνω την προειδοποίηση 'WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.'

Το παλιό αποθετήριο chart της Google έχει αντικατασταθεί από ένα νέο αποθετήριο Helm chart.

Εκτελέστε την ακόλουθη εντολή για να διορθώσετε αυτό μόνιμα:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Αν λάβετε παρόμοιο σφάλμα για το `incubator`, εκτελέστε αυτή την εντολή:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Όταν προσθέτω ένα Helm repo, λαμβάνω το σφάλμα 'Error: Repo "https://kubernetes-charts.storage.googleapis.com" is no longer available'

Τα αποθετήρια Helm Chart δεν υποστηρίζονται πλέον μετά από [μια περίοδο κατάργησης ενός έτους](https://github.com/helm/charts#deprecation-timeline). Τα αρχεία για αυτά τα αποθετήρια είναι διαθέσιμα στο `https://charts.helm.sh/stable` και `https://charts.helm.sh/incubator`, ωστόσο δεν θα λαμβάνουν πλέον ενημερώσεις. Η εντολή `helm repo add` δεν θα σας επιτρέψει να προσθέσετε τα παλιά URLs εκτός αν καθορίσετε `--use-deprecated-repos`.

### Στο GKE (Google Container Engine) λαμβάνω "No SSH tunnels currently open"

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

Μια άλλη παραλλαγή του μηνύματος σφάλματος είναι:


```
Unable to connect to the server: x509: certificate signed by unknown authority
```

Το πρόβλημα είναι ότι το τοπικό σας αρχείο ρυθμίσεων Kubernetes πρέπει να έχει τα σωστά credentials.

Όταν δημιουργείτε ένα cluster στο GKE, θα λάβετε credentials, συμπεριλαμβανομένων πιστοποιητικών SSL και αρχών πιστοποίησης. Αυτά πρέπει να αποθηκευτούν σε ένα αρχείο ρυθμίσεων Kubernetes (Προεπιλογή: `~/.kube/config`) ώστε οι `kubectl` και `helm` να έχουν πρόσβαση σε αυτά.

### Μετά τη μετάβαση από το Helm 2, το `helm list` εμφανίζει μόνο μερικά (ή κανένα) από τα releases μου

Πιθανώς δεν έχετε λάβει υπόψη ότι το Helm 3 χρησιμοποιεί πλέον τα namespaces του cluster για τον περιορισμό των releases. Αυτό σημαίνει ότι για όλες τις εντολές που αναφέρονται σε ένα release πρέπει είτε:

* να βασίζεστε στο τρέχον namespace στο ενεργό kubernetes context (όπως περιγράφεται από την εντολή `kubectl config view --minify`),
* να καθορίσετε το σωστό namespace χρησιμοποιώντας το flag `--namespace`/`-n`, ή
* για την εντολή `helm list`, να καθορίσετε το flag `--all-namespaces`/`-A`

Αυτό ισχύει για τα `helm ls`, `helm uninstall`, και όλες τις άλλες εντολές `helm` που αναφέρονται σε ένα release.


### Σε macOS, γίνεται πρόσβαση στο αρχείο `/etc/.mdns_debug`. Γιατί;

Γνωρίζουμε μια περίπτωση σε macOS όπου το Helm προσπαθεί να αποκτήσει πρόσβαση σε ένα αρχείο με όνομα `/etc/.mdns_debug`. Αν το αρχείο υπάρχει, το Helm κρατά το file handle ανοιχτό κατά την εκτέλεση.

Αυτό προκαλείται από τη βιβλιοθήκη MDNS του macOS. Προσπαθεί να φορτώσει αυτό το αρχείο για να διαβάσει ρυθμίσεις debugging (αν είναι ενεργοποιημένες). Το file handle πιθανώς δεν θα έπρεπε να παραμένει ανοιχτό, και αυτό το ζήτημα έχει αναφερθεί στην Apple. Ωστόσο, είναι το macOS, όχι το Helm, που προκαλεί αυτή τη συμπεριφορά.

Αν δεν θέλετε το Helm να φορτώνει αυτό το αρχείο, μπορείτε ίσως να μεταγλωττίσετε το Helm ως static library που δεν χρησιμοποιεί τη στοίβα δικτύου του host. Αυτό θα αυξήσει το μέγεθος του binary του Helm, αλλά θα αποτρέψει το άνοιγμα του αρχείου.

Αυτό το ζήτημα αρχικά επισημάνθηκε ως πιθανό πρόβλημα ασφάλειας. Ωστόσο, έχει διαπιστωθεί ότι δεν υπάρχει κανένα ελάττωμα ή ευπάθεια που προκαλείται από αυτή τη συμπεριφορά.

### Το helm repo add αποτυγχάνει ενώ λειτουργούσε παλιότερα

Στο helm 3.3.1 και παλαιότερα, η εντολή `helm repo add <reponame> <url>` δεν έδινε καμία έξοδο αν προσπαθούσατε να προσθέσετε ένα αποθετήριο που υπήρχε ήδη. Το flag `--no-update` θα προκαλούσε σφάλμα αν το αποθετήριο ήταν ήδη καταχωρημένο.

Στο helm 3.3.2 και μεταγενέστερα, μια προσπάθεια προσθήκης υπάρχοντος αποθετηρίου θα προκαλέσει σφάλμα:

`Error: repository name (reponame) already exists, please specify a different name`

Η προεπιλεγμένη συμπεριφορά έχει πλέον αντιστραφεί. Το `--no-update` αγνοείται πλέον, ενώ αν θέλετε να αντικαταστήσετε ένα υπάρχον αποθετήριο, μπορείτε να χρησιμοποιήσετε το `--force-update`.

Αυτό οφείλεται σε μια breaking change για διόρθωση ασφαλείας, όπως εξηγείται στις [σημειώσεις έκδοσης του Helm 3.3.2](https://github.com/helm/helm/releases/tag/v3.3.2).

### Ενεργοποίηση της καταγραφής του Kubernetes client

Η εκτύπωση μηνυμάτων καταγραφής για τον εντοπισμό σφαλμάτων του Kubernetes client μπορεί να ενεργοποιηθεί χρησιμοποιώντας τα flags του [klog](https://pkg.go.dev/k8s.io/klog). Η χρήση του flag `-v` για να ορίσετε το επίπεδο λεπτομέρειας θα είναι αρκετή για τις περισσότερες περιπτώσεις.

Για παράδειγμα:

```
helm list -v 6
```

### Οι εγκαταστάσεις Tiller σταμάτησαν να λειτουργούν και η πρόσβαση απορρίπτεται

Τα releases του Helm ήταν διαθέσιμα από το <https://storage.googleapis.com/kubernetes-helm/>. Όπως εξηγείται στο ["Announcing get.helm.sh"](https://helm.sh/blog/get-helm-sh/), η επίσημη τοποθεσία άλλαξε τον Ιούνιο του 2019. Το [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller) διαθέτει όλα τα παλιά Tiller images.


Αν προσπαθείτε να κατεβάσετε παλαιότερες εκδόσεις του Helm από το storage bucket που χρησιμοποιούσατε στο παρελθόν, μπορεί να διαπιστώσετε ότι λείπουν:

```
<Error>
    <Code>AccessDenied</Code>
    <Message>Access denied.</Message>
    <Details>Anonymous caller does not have storage.objects.get access to the Google Cloud Storage object.</Details>
</Error>
```

Η [παλιά τοποθεσία Tiller image](https://gcr.io/kubernetes-helm/tiller) ξεκίνησε την αφαίρεση images τον Αύγουστο του 2021. Έχουμε διαθέσει αυτά τα images στην τοποθεσία [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller). Για παράδειγμα, για να κατεβάσετε την έκδοση v2.17.0, αντικαταστήστε:

`https://storage.googleapis.com/kubernetes-helm/helm-v2.17.0-linux-amd64.tar.gz`

με:

`https://get.helm.sh/helm-v2.17.0-linux-amd64.tar.gz`

Για να αρχικοποιήσετε με το Helm v2.17.0:

`helm init —upgrade`

Ή αν χρειάζεται διαφορετική έκδοση, χρησιμοποιήστε το flag --tiller-image για να αντικαταστήσετε την προεπιλεγμένη τοποθεσία και να εγκαταστήσετε μια συγκεκριμένη έκδοση Helm v2:

`helm init --tiller-image ghcr.io/helm/tiller:v2.16.9`

**Σημείωση:** Οι συντηρητές του Helm συνιστούν τη μετάβαση σε μια τρέχουσα υποστηριζόμενη έκδοση του Helm. Το Helm v2.17.0 ήταν η τελική έκδοση του Helm v2· το Helm v2 δεν υποστηρίζεται από τον Νοέμβριο του 2020, όπως αναφέρεται στο [Helm 2 and the Charts Project Are Now Unsupported](https://helm.sh/blog/helm-2-becomes-unsupported/). Πολλά CVE έχουν αναφερθεί για το Helm από τότε, και αυτές οι ευπάθειες έχουν διορθωθεί στο Helm v3 αλλά δεν θα διορθωθούν ποτέ στο Helm v2. Δείτε την [τρέχουσα λίστα δημοσιευμένων Helm advisories](https://github.com/helm/helm/security/advisories?state=published) και σχεδιάστε τη [μετάβαση στο Helm v3](./v2_v3_migration.md) σήμερα.
