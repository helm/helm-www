---
title: Αποσυρμένα API του Kubernetes
description: Επεξηγεί τα αποσυρμένα API του Kubernetes στο Helm
---

Το Kubernetes είναι ένα σύστημα βασισμένο σε API και το API εξελίσσεται με την
πάροδο του χρόνου, αντικατοπτρίζοντας την εξελισσόμενη κατανόηση του πεδίου
προβλημάτων. Αυτό είναι κοινή πρακτική σε συστήματα και τα API τους. Ένα
σημαντικό μέρος της εξέλιξης των API είναι μια καλή πολιτική απόσυρσης και
διαδικασία για να ενημερώνονται οι χρήστες για τις αλλαγές στα API. Δηλαδή, οι
καταναλωτές του API σας πρέπει να γνωρίζουν εκ των προτέρων σε ποια έκδοση θα
έκδοση θα αφαιρεθεί ή θα αλλάξει ένα API. Αυτό αποτρέπει το στοιχείο της
έκπληξης και τις breaking changes για τους καταναλωτές.

Η [πολιτική απόσυρσης του
Kubernetes](https://kubernetes.io/docs/reference/using-api/deprecation-policy/)
τεκμηριώνει τον τρόπο με τον οποίο το Kubernetes χειρίζεται τις αλλαγές στις
εκδόσεις του API. Η πολιτική απόσυρσης καθορίζει το χρονικό πλαίσιο υποστήριξης
των εκδόσεων API μετά από μια ανακοίνωση απόσυρσης. Επομένως, είναι σημαντικό να
παρακολουθείτε τις ανακοινώσεις απόσυρσης και να γνωρίζετε πότε θα αφαιρεθούν οι
εκδόσεις API, ώστε να ελαχιστοποιήσετε τις επιπτώσεις.

Αυτό είναι ένα παράδειγμα ανακοίνωσης [για την αφαίρεση αποσυρμένων εκδόσεων API
στο Kubernetes
1.16](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/) που
δημοσιεύτηκε μερικούς μήνες πριν την κυκλοφορία. Αυτές οι εκδόσεις API θα είχαν
ανακοινωθεί ως αποσυρμένες ακόμα νωρίτερα. Αυτό δείχνει ότι υπάρχει μια καλή
πολιτική που ενημερώνει τους καταναλωτές για την υποστήριξη εκδόσεων API.

Τα templates του Helm καθορίζουν ένα [Kubernetes API
group](https://kubernetes.io/docs/concepts/overview/kubernetes-api/#api-groups)
κατά τον ορισμό ενός αντικειμένου Kubernetes, παρόμοια με ένα αρχείο manifest του
Kubernetes. Καθορίζεται στο πεδίο `apiVersion` του template και προσδιορίζει την
έκδοση API του αντικειμένου Kubernetes. Αυτό σημαίνει ότι οι χρήστες του Helm και
οι συντηρητές chart πρέπει να γνωρίζουν πότε οι εκδόσεις API του Kubernetes έχουν
αποσυρθεί και σε ποια έκδοση Kubernetes θα αφαιρεθούν.

## Συντηρητές Chart

Θα πρέπει να ελέγξετε τα chart σας για εκδόσεις API του Kubernetes που έχουν
αποσυρθεί ή αφαιρεθεί σε κάποια έκδοση Kubernetes. Οι εκδόσεις API που
προβλέπεται να αποσυρθούν ή δεν υποστηρίζονται πλέον, θα πρέπει να ενημερωθούν
στην υποστηριζόμενη έκδοση και να κυκλοφορήσει μια νέα έκδοση του chart. Η
έκδοση API ορίζεται από τα πεδία `kind` και `apiVersion`. Για παράδειγμα, εδώ
είναι μια αφαιρεμένη έκδοση API αντικειμένου `Deployment` στο Kubernetes 1.16:

```yaml
apiVersion: apps/v1beta1
kind: Deployment
```

## Χρήστες του Helm

Θα πρέπει να ελέγξετε τα chart που χρησιμοποιείτε (παρόμοια με τους [συντηρητές
chart](#συντηρητές-chart)) και να εντοπίσετε τυχόν chart με εκδόσεις API που
έχουν αποσυρθεί ή αφαιρεθεί σε κάποια έκδοση Kubernetes. Για τα chart που
εντοπίζετε, πρέπει να ελέγξετε για την τελευταία έκδοση του chart (που έχει
υποστηριζόμενες εκδόσεις API) ή να ενημερώσετε το chart μόνοι σας.

Επιπλέον, πρέπει επίσης να ελέγξετε τα chart που έχετε εγκαταστήσει (δηλαδή τα
Helm releases) για τυχόν αποσυρμένες ή αφαιρεμένες εκδόσεις API. Αυτό μπορεί να
γίνει με τη λήψη λεπτομερειών ενός release χρησιμοποιώντας την εντολή `helm get
manifest`.

Ο τρόπος ενημέρωσης ενός Helm release σε υποστηριζόμενα API εξαρτάται από τα
ευρήματά σας ως εξής:

1. Αν βρείτε μόνο αποσυρμένες εκδόσεις API τότε:
  - Εκτελέστε `helm upgrade` με μια έκδοση του chart που έχει υποστηριζόμενες
    εκδόσεις API του Kubernetes
  - Προσθέστε μια περιγραφή στην αναβάθμιση, που να αναφέρει να μην γίνει
    rollback σε έκδοση Helm πριν από αυτή την τρέχουσα έκδοση
2. Αν βρείτε κάποια έκδοση(εις) API που έχει(ουν) αφαιρεθεί σε κάποια έκδοση
   Kubernetes τότε:
  - Αν εκτελείτε μια έκδοση Kubernetes όπου η(οι) έκδοση(εις) API είναι ακόμα
    διαθέσιμη(ες) (για παράδειγμα, είστε στο Kubernetes 1.15 και βρήκατε ότι
    χρησιμοποιείτε API που θα αφαιρεθούν στο Kubernetes 1.16):
    - Ακολουθήστε τη διαδικασία του βήματος 1
  - Διαφορετικά (για παράδειγμα, εκτελείτε ήδη μια έκδοση Kubernetes όπου
    κάποιες εκδόσεις API που αναφέρονται από το `helm get manifest` δεν είναι
    πλέον διαθέσιμες):
    - Πρέπει να επεξεργαστείτε το manifest του release που είναι αποθηκευμένο
      στο cluster για να ενημερώσετε τις εκδόσεις API σε υποστηριζόμενα API.
      Δείτε [Ενημέρωση Εκδόσεων API ενός Release
      Manifest](#ενημέρωση-εκδόσεων-api-ενός-release-manifest) για
      περισσότερες λεπτομέρειες

> Σημείωση: Σε όλες τις περιπτώσεις ενημέρωσης ενός Helm release με
υποστηριζόμενα API, δεν πρέπει ποτέ να κάνετε rollback του release σε έκδοση
πριν από την έκδοση release με τα υποστηριζόμενα API.

> Σύσταση: Η βέλτιστη πρακτική είναι να αναβαθμίζετε τα releases που
χρησιμοποιούν αποσυρμένες εκδόσεις API σε υποστηριζόμενες εκδόσεις API, πριν
αναβαθμίσετε σε ένα Kubernetes cluster που αφαιρεί αυτές τις εκδόσεις API.

Αν δεν ενημερώσετε ένα release όπως προτείνεται παραπάνω, θα λάβετε ένα σφάλμα
παρόμοιο με το ακόλουθο όταν προσπαθήσετε να αναβαθμίσετε ένα release σε μια
έκδοση Kubernetes όπου η(οι) έκδοση(εις) API του έχει(ουν) αφαιρεθεί:

```
Error: UPGRADE FAILED: current release manifest contains removed kubernetes api(s)
for this kubernetes version and it is therefore unable to build the kubernetes
objects for performing the diff. error from kubernetes: unable to recognize "":
no matches for kind "Deployment" in version "apps/v1beta1"
```

Το Helm αποτυγχάνει σε αυτό το σενάριο επειδή προσπαθεί να δημιουργήσει ένα diff
patch μεταξύ του τρέχοντος εγκατεστημένου release (που περιέχει τα API του
Kubernetes που έχουν αφαιρεθεί σε αυτή την έκδοση Kubernetes) και του chart που
περνάτε με τις ενημερωμένες/υποστηριζόμενες εκδόσεις API. Ο υποκείμενος λόγος
της αποτυχίας είναι ότι όταν το Kubernetes αφαιρεί μια έκδοση API, η βιβλιοθήκη
Go client του Kubernetes δεν μπορεί πλέον να αναλύσει τα αποσυρμένα αντικείμενα
και επομένως το Helm αποτυγχάνει κατά την κλήση της βιβλιοθήκης. Δυστυχώς, το
Helm δεν μπορεί να ανακτήσει από αυτή την κατάσταση και δεν είναι πλέον σε θέση
να διαχειριστεί ένα τέτοιο release. Δείτε [Ενημέρωση Εκδόσεων API ενός Release
Manifest](#ενημέρωση-εκδόσεων-api-ενός-release-manifest) για περισσότερες
λεπτομέρειες σχετικά με τον τρόπο ανάκτησης από αυτό το σενάριο.

## Ενημέρωση Εκδόσεων API ενός Release Manifest

Το manifest είναι μια ιδιότητα του αντικειμένου Helm release που αποθηκεύεται
στο πεδίο data ενός Secret (προεπιλογή) ή ConfigMap στο cluster. Το πεδίο data
περιέχει ένα συμπιεσμένο (gzip) αντικείμενο που είναι κωδικοποιημένο σε base 64
(υπάρχει μια επιπλέον κωδικοποίηση base 64 για τα Secret). Υπάρχει ένα
Secret/ConfigMap ανά έκδοση/αναθεώρηση release στο namespace του release.

Μπορείτε να χρησιμοποιήσετε το plugin
[mapkubeapis](https://github.com/helm/helm-mapkubeapis) του Helm για να
εκτελέσετε την ενημέρωση ενός release σε υποστηριζόμενα API. Ελέγξτε το readme
για περισσότερες λεπτομέρειες.

Εναλλακτικά, μπορείτε να ακολουθήσετε αυτά τα χειροκίνητα βήματα για να
εκτελέσετε μια ενημέρωση των εκδόσεων API ενός release manifest. Ανάλογα με τις
ρυθμίσεις σας, θα ακολουθήσετε τα βήματα για το Secret ή το ConfigMap backend.

- Λήψη του ονόματος του Secret ή ConfigMap που σχετίζεται με το τελευταίο
  εγκατεστημένο release:
  - Secret backend: `kubectl get secret -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
  - ConfigMap backend: `kubectl get configmap -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
- Λήψη λεπτομερειών του τελευταίου εγκατεστημένου release:
  - Secret backend: `kubectl get secret <release_secret_name> -n
    <release_namespace> -o yaml > release.yaml`
  - ConfigMap backend: `kubectl get configmap <release_configmap_name> -n
    <release_namespace> -o yaml > release.yaml`
- Δημιουργία αντιγράφου ασφαλείας του release σε περίπτωση που χρειαστεί
  επαναφορά αν κάτι πάει στραβά:
  - `cp release.yaml release.bak`
  - Σε περίπτωση έκτακτης ανάγκης, επαναφορά: `kubectl apply -f release.bak -n
    <release_namespace>`
- Αποκωδικοποίηση του αντικειμένου release:
  - Secret backend:`cat release.yaml | grep -oP '(?<=release: ).*' | base64 -d
    | base64 -d | gzip -d > release.data.decoded`
  - ConfigMap backend: `cat release.yaml | grep -oP '(?<=release: ).*' | base64
    -d | gzip -d > release.data.decoded`
- Αλλαγή των εκδόσεων API των manifests. Μπορείτε να χρησιμοποιήσετε οποιοδήποτε
  εργαλείο (π.χ. editor) για να κάνετε τις αλλαγές. Αυτό βρίσκεται στο πεδίο
  `manifest` του αποκωδικοποιημένου αντικειμένου release σας
  (`release.data.decoded`)
- Κωδικοποίηση του αντικειμένου release:
  - Secret backend: `cat release.data.decoded | gzip | base64 | base64`
  - ConfigMap backend: `cat release.data.decoded | gzip | base64`
- Αντικατάσταση της τιμής της ιδιότητας `data.release` στο αρχείο του
  εγκατεστημένου release (`release.yaml`) με το νέο κωδικοποιημένο αντικείμενο
  release
- Εφαρμογή του αρχείου στο namespace: `kubectl apply -f release.yaml -n
  <release_namespace>`
- Εκτέλεση `helm upgrade` με μια έκδοση του chart που έχει υποστηριζόμενες
  εκδόσεις API του Kubernetes
- Προσθήκη μιας περιγραφής στην αναβάθμιση, που να αναφέρει να μην γίνει
  rollback σε έκδοση Helm πριν από αυτή την τρέχουσα έκδοση
