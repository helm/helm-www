---
title: Έλεγχος Πρόσβασης Βασισμένος σε Ρόλους
description: Εξηγεί πώς το Helm αλληλεπιδρά με τον Έλεγχο Πρόσβασης Βασισμένο σε Ρόλους (RBAC) του Kubernetes.
sidebar_position: 11
---

Στο Kubernetes, η εκχώρηση ρόλων σε έναν χρήστη ή σε ένα service account της
εφαρμογής σας αποτελεί βέλτιστη πρακτική για να διασφαλίσετε ότι η εφαρμογή σας
λειτουργεί εντός του πεδίου που έχετε ορίσει. Διαβάστε περισσότερα σχετικά με
τα δικαιώματα service account [στην επίσημη τεκμηρίωση του
Kubernetes](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#service-account-permissions).

Από το Kubernetes 1.6 και μετά, ο Έλεγχος Πρόσβασης Βασισμένος σε Ρόλους είναι
ενεργοποιημένος από προεπιλογή. Το RBAC σας επιτρέπει να καθορίσετε ποιοι τύποι
ενεργειών επιτρέπονται ανάλογα με τον χρήστη και τον ρόλο του στον οργανισμό σας.

Με το RBAC, μπορείτε να:

- εκχωρήσετε προνομιούχες λειτουργίες (δημιουργία πόρων σε επίπεδο cluster, όπως
  νέοι ρόλοι) σε διαχειριστές
- περιορίσετε τη δυνατότητα ενός χρήστη να δημιουργεί πόρους (pods, persistent
  volumes, deployments) σε συγκεκριμένα namespaces ή σε επίπεδο cluster (resource
  quotas, roles, custom resource definitions)
- περιορίσετε τη δυνατότητα ενός χρήστη να βλέπει πόρους είτε σε συγκεκριμένα
  namespaces είτε σε επίπεδο cluster.

Αυτός ο οδηγός είναι για διαχειριστές που θέλουν να περιορίσουν το πεδίο
αλληλεπίδρασης ενός χρήστη με το Kubernetes API.

## Διαχείριση λογαριασμών χρηστών {#managing-user-accounts}

Όλα τα clusters του Kubernetes έχουν δύο κατηγορίες χρηστών: service accounts που
διαχειρίζεται το Kubernetes και κανονικούς χρήστες.

Οι κανονικοί χρήστες θεωρείται ότι διαχειρίζονται από μια εξωτερική, ανεξάρτητη
υπηρεσία. Μπορεί να είναι ένας διαχειριστής που διανέμει ιδιωτικά κλειδιά, ένα
σύστημα αποθήκευσης χρηστών όπως το Keystone ή τα Google Accounts, ακόμα και ένα
αρχείο με λίστα ονομάτων χρηστών και κωδικών πρόσβασης. Σε αυτό το πλαίσιο, το
Kubernetes δεν διαθέτει αντικείμενα που αντιπροσωπεύουν λογαριασμούς κανονικών
χρηστών. Οι κανονικοί χρήστες δεν μπορούν να προστεθούν σε ένα cluster μέσω
κλήσης API.

Αντίθετα, τα service accounts είναι χρήστες που διαχειρίζεται το Kubernetes API.
Είναι δεσμευμένα σε συγκεκριμένα namespaces και δημιουργούνται αυτόματα από τον
API server ή χειροκίνητα μέσω κλήσεων API. Τα service accounts συνδέονται με ένα
σύνολο διαπιστευτηρίων που αποθηκεύονται ως Secrets, τα οποία προσαρτώνται σε
pods επιτρέποντας στις διεργασίες εντός του cluster να επικοινωνούν με το
Kubernetes API.

Τα αιτήματα API συνδέονται είτε με έναν κανονικό χρήστη είτε με ένα service
account, ή αντιμετωπίζονται ως ανώνυμα αιτήματα. Αυτό σημαίνει ότι κάθε διεργασία
εντός ή εκτός του cluster, από έναν χρήστη που πληκτρολογεί `kubectl` σε έναν
σταθμό εργασίας, μέχρι τα kubelets στους κόμβους, μέχρι τα μέλη του control
plane, πρέπει να πιστοποιηθεί όταν κάνει αιτήματα στον API server, ή θα
αντιμετωπιστεί ως ανώνυμος χρήστης.

## Roles, ClusterRoles, RoleBindings και ClusterRoleBindings {#roles-clusterroles-rolebindings-and-clusterrolebindings}

Στο Kubernetes, οι λογαριασμοί χρηστών και τα service accounts μπορούν να βλέπουν
και να επεξεργάζονται μόνο πόρους στους οποίους τους έχει εκχωρηθεί πρόσβαση.
Αυτή η πρόσβαση εκχωρείται μέσω της χρήσης Roles και RoleBindings. Τα Roles και
τα RoleBindings είναι δεσμευμένα σε ένα συγκεκριμένο namespace, το οποίο παρέχει
στους χρήστες τη δυνατότητα να βλέπουν ή/και να επεξεργάζονται πόρους εντός αυτού
του namespace στο οποίο το Role τους παρέχει πρόσβαση.

Σε επίπεδο cluster, αυτά ονομάζονται ClusterRoles και ClusterRoleBindings.
Η εκχώρηση ενός ClusterRole σε έναν χρήστη του παρέχει πρόσβαση για προβολή ή/και
επεξεργασία πόρων σε ολόκληρο το cluster. Απαιτείται επίσης για την προβολή ή/και
επεξεργασία πόρων σε επίπεδο cluster (namespaces, resource quotas, nodes).

Τα ClusterRoles μπορούν να δεσμευτούν σε ένα συγκεκριμένο namespace μέσω αναφοράς
σε ένα RoleBinding. Τα προεπιλεγμένα ClusterRoles `admin`, `edit` και `view`
χρησιμοποιούνται συχνά με αυτόν τον τρόπο.

Υπάρχουν μερικά ClusterRoles διαθέσιμα από προεπιλογή στο Kubernetes.
Προορίζονται ως ρόλοι για τους χρήστες. Περιλαμβάνουν ρόλους υπερχρήστη
(`cluster-admin`) και ρόλους με πιο λεπτομερή πρόσβαση (`admin`, `edit`, `view`).

| Προεπιλεγμένο ClusterRole | Προεπιλεγμένο ClusterRoleBinding | Περιγραφή
|---------------------------|----------------------------------|------------
| `cluster-admin`           | ομάδα `system:masters`           | Επιτρέπει πρόσβαση υπερχρήστη για εκτέλεση οποιασδήποτε ενέργειας σε οποιονδήποτε πόρο. Όταν χρησιμοποιείται σε ένα ClusterRoleBinding, παρέχει πλήρη έλεγχο σε κάθε πόρο του cluster και σε όλα τα namespaces. Όταν χρησιμοποιείται σε ένα RoleBinding, παρέχει πλήρη έλεγχο σε κάθε πόρο του namespace του rolebinding, συμπεριλαμβανομένου του ίδιου του namespace.
| `admin`                   | Κανένα                           | Επιτρέπει πρόσβαση διαχειριστή, προορίζεται να εκχωρηθεί εντός ενός namespace χρησιμοποιώντας ένα RoleBinding. Αν χρησιμοποιηθεί σε ένα RoleBinding, επιτρέπει πρόσβαση ανάγνωσης/εγγραφής στους περισσότερους πόρους ενός namespace, συμπεριλαμβανομένης της δυνατότητας δημιουργίας roles και rolebindings εντός του namespace. Δεν επιτρέπει πρόσβαση εγγραφής στα resource quotas ή στο ίδιο το namespace.
| `edit`                    | Κανένα                           | Επιτρέπει πρόσβαση ανάγνωσης/εγγραφής στους περισσότερους πόρους ενός namespace. Δεν επιτρέπει την προβολή ή τροποποίηση roles ή rolebindings.
| `view`                    | Κανένα                           | Επιτρέπει πρόσβαση μόνο για ανάγνωση στους περισσότερους πόρους ενός namespace. Δεν επιτρέπει την προβολή roles ή rolebindings. Δεν επιτρέπει την προβολή secrets, καθώς αυτό θα αποτελούσε κλιμάκωση δικαιωμάτων.

## Περιορισμός πρόσβασης λογαριασμού χρήστη με χρήση RBAC {#restricting-a-user-accounts-access-using-rbac}

Τώρα που κατανοούμε τα βασικά του Ελέγχου Πρόσβασης Βασισμένου σε Ρόλους, ας
δούμε πώς ένας διαχειριστής μπορεί να περιορίσει το πεδίο πρόσβασης ενός χρήστη.

### Παράδειγμα: Εκχώρηση πρόσβασης ανάγνωσης/εγγραφής σε ένα συγκεκριμένο namespace {#example-grant-a-user-readwrite-access-to-a-particular-namespace}

Για να περιορίσετε την πρόσβαση ενός χρήστη σε ένα συγκεκριμένο namespace,
μπορείτε να χρησιμοποιήσετε είτε τον ρόλο `edit` είτε τον ρόλο `admin`. Αν τα
charts σας δημιουργούν ή αλληλεπιδρούν με Roles και Rolebindings, θα θέλετε να
χρησιμοποιήσετε το ClusterRole `admin`.

Επιπλέον, μπορείτε επίσης να δημιουργήσετε ένα RoleBinding με πρόσβαση
`cluster-admin`. Η εκχώρηση πρόσβασης `cluster-admin` σε έναν χρήστη σε επίπεδο
namespace παρέχει πλήρη έλεγχο σε κάθε πόρο του namespace, συμπεριλαμβανομένου
του ίδιου του namespace.

Για αυτό το παράδειγμα, θα δημιουργήσουμε έναν χρήστη με τον ρόλο `edit`. Πρώτα,
δημιουργήστε το namespace:

```console
$ kubectl create namespace foo
```

Τώρα, δημιουργήστε ένα RoleBinding σε αυτό το namespace, εκχωρώντας στον χρήστη
τον ρόλο `edit`.

```console
$ kubectl create rolebinding sam-edit
    --clusterrole edit \​
    --user sam \​
    --namespace foo
```

### Παράδειγμα: Εκχώρηση πρόσβασης ανάγνωσης/εγγραφής σε επίπεδο cluster {#example-grant-a-user-readwrite-access-at-the-cluster-scope}

Αν ένας χρήστης επιθυμεί να εγκαταστήσει ένα chart που εγκαθιστά πόρους σε
επίπεδο cluster (namespaces, roles, custom resource definitions, κ.λπ.), θα
χρειαστεί πρόσβαση εγγραφής σε επίπεδο cluster.

Για να το κάνετε αυτό, εκχωρήστε στον χρήστη πρόσβαση `admin` ή `cluster-admin`.

Η εκχώρηση πρόσβασης `cluster-admin` σε έναν χρήστη του παρέχει πρόσβαση σε
απολύτως κάθε διαθέσιμο πόρο στο Kubernetes, συμπεριλαμβανομένης της πρόσβασης σε
κόμβους με `kubectl drain` και άλλες διαχειριστικές εργασίες. Συνιστάται ιδιαίτερα
να εξετάσετε το ενδεχόμενο να παρέχετε στον χρήστη πρόσβαση `admin` αντί αυτού,
ή να δημιουργήσετε ένα προσαρμοσμένο ClusterRole προσαρμοσμένο στις ανάγκες του.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

### Παράδειγμα: Εκχώρηση πρόσβασης μόνο για ανάγνωση σε ένα συγκεκριμένο namespace {#example-grant-a-user-read-only-access-to-a-particular-namespace}

Μπορεί να έχετε παρατηρήσει ότι δεν υπάρχει διαθέσιμο ClusterRole για την προβολή
secrets. Το ClusterRole `view` δεν παρέχει στον χρήστη πρόσβαση ανάγνωσης στα
Secrets λόγω ανησυχιών για κλιμάκωση δικαιωμάτων. Το Helm αποθηκεύει τα
μεταδεδομένα των releases ως Secrets από προεπιλογή.

Για να μπορέσει ένας χρήστης να εκτελέσει `helm list`, πρέπει να μπορεί να
διαβάσει αυτά τα secrets. Για αυτό, θα δημιουργήσουμε ένα ειδικό ClusterRole
`secret-reader`.

Δημιουργήστε το αρχείο `cluster-role-secret-reader.yaml` και γράψτε το ακόλουθο
περιεχόμενο σε αυτό:

```yaml
apiVersion: rbac.authorization.k8s.io/v1​
kind: ClusterRole​
metadata:​
  name: secret-reader​
rules:​
- apiGroups: [""]​
  resources: ["secrets"]​
  verbs: ["get", "watch", "list"]
```

Στη συνέχεια, δημιουργήστε το ClusterRole χρησιμοποιώντας:

```console
$ kubectl create -f clusterrole-secret-reader.yaml​
```

Μόλις ολοκληρωθεί αυτό, μπορούμε να εκχωρήσουμε σε έναν χρήστη πρόσβαση ανάγνωσης
στους περισσότερους πόρους, και στη συνέχεια να του εκχωρήσουμε πρόσβαση ανάγνωσης
στα secrets:

```console
$ kubectl create namespace foo

$ kubectl create rolebinding sam-view
    --clusterrole view \​
    --user sam \​
    --namespace foo

$ kubectl create rolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam \​
    --namespace foo
```

### Παράδειγμα: Εκχώρηση πρόσβασης μόνο για ανάγνωση σε επίπεδο cluster {#example-grant-a-user-read-only-access-at-the-cluster-scope}

Σε ορισμένα σενάρια, μπορεί να είναι ωφέλιμο να εκχωρηθεί σε έναν χρήστη πρόσβαση
σε επίπεδο cluster. Για παράδειγμα, αν ένας χρήστης θέλει να εκτελέσει την εντολή
`helm list --all-namespaces`, το API απαιτεί ο χρήστης να έχει πρόσβαση ανάγνωσης
σε επίπεδο cluster.

Για να το κάνετε αυτό, εκχωρήστε στον χρήστη πρόσβαση τόσο `view` όσο και
`secret-reader` όπως περιγράφηκε παραπάνω, αλλά με ένα ClusterRoleBinding.

```console
$ kubectl create clusterrolebinding sam-view
    --clusterrole view \​
    --user sam

$ kubectl create clusterrolebinding sam-secret-reader
    --clusterrole secret-reader \​
    --user sam
```

## Επιπλέον Σκέψεις {#additional-thoughts}

Τα παραπάνω παραδείγματα χρησιμοποιούν τα προεπιλεγμένα ClusterRoles που παρέχει
το Kubernetes. Για πιο λεπτομερή έλεγχο των πόρων στους οποίους οι χρήστες έχουν
πρόσβαση, ανατρέξτε στην [τεκμηρίωση του
Kubernetes](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) για τη
δημιουργία προσαρμοσμένων Roles και ClusterRoles.
