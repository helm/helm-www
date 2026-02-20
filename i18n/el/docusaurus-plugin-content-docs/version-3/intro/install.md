---
title: Εγκατάσταση του Helm
description: Μάθετε πώς να εγκαταστήσετε και να ξεκινήσετε με το Helm.
sidebar_position: 2
---

Αυτός ο οδηγός δείχνει πώς να εγκαταστήσετε το Helm CLI. Το Helm μπορεί να
εγκατασταθεί είτε από τον πηγαίο κώδικα είτε από έτοιμα binary releases.

## Από το Helm Project

Το Helm project παρέχει δύο τρόπους για λήψη και εγκατάσταση του Helm. Αυτές
είναι οι επίσημες μέθοδοι για απόκτηση εκδόσεων του Helm. Επιπλέον, η κοινότητα
του Helm παρέχει μεθόδους εγκατάστασης μέσω διαφορετικών διαχειριστών πακέτων.
Η εγκατάσταση μέσω αυτών των μεθόδων περιγράφεται παρακάτω, μετά τις επίσημες
μεθόδους.

### Από τα Binary Releases

Κάθε [release](https://github.com/helm/helm/releases) του Helm παρέχει binary
releases για διάφορα λειτουργικά συστήματα. Αυτές οι binary εκδόσεις μπορούν
να ληφθούν και να εγκατασταθούν χειροκίνητα.

1. Κατεβάστε την [επιθυμητή έκδοση](https://github.com/helm/helm/releases)
2. Αποσυμπιέστε την (`tar -zxvf helm-v3.0.0-linux-amd64.tar.gz`)
3. Βρείτε το `helm` binary στον αποσυμπιεσμένο φάκελο και μετακινήστε το στην
   επιθυμητή τοποθεσία (`mv linux-amd64/helm /usr/local/bin/helm`)

Από εκεί, θα πρέπει να μπορείτε να εκτελέσετε τον client και να [προσθέσετε το
stable chart repository](/intro/quickstart.md#initialize-a-helm-chart-repository):
`helm help`.

**Σημείωση:** Τα αυτοματοποιημένα tests του Helm εκτελούνται μόνο για Linux AMD64
κατά τη διάρκεια των builds και releases στο GitHub Actions. Η δοκιμή άλλων
λειτουργικών συστημάτων είναι ευθύνη της κοινότητας που ζητά το Helm για το
συγκεκριμένο λειτουργικό σύστημα.

### Από Script

Το Helm έχει πλέον ένα script εγκατάστασης που κατεβάζει αυτόματα την τελευταία
έκδοση του Helm και την [εγκαθιστά
τοπικά](https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3).

Μπορείτε να κατεβάσετε αυτό το script και μετά να το εκτελέσετε τοπικά. Είναι
καλά τεκμηριωμένο ώστε να μπορείτε να το διαβάσετε και να καταλάβετε τι κάνει
πριν το εκτελέσετε.

```console
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
```

Ναι, μπορείτε να εκτελέσετε `curl
https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash` αν
θέλετε να ζήσετε επικίνδυνα.

## Μέσω Διαχειριστών Πακέτων

Η κοινότητα του Helm παρέχει τη δυνατότητα εγκατάστασης του Helm μέσω
πακέτων λειτουργικών συστημάτων. Αυτοί δεν υποστηρίζονται από το Helm project
διαχειριστών πακέτων λειτουργικών συστημάτων. Αυτοί δεν υποστηρίζονται από το

### Από το Homebrew (macOS)

Μέλη της κοινότητας του Helm έχουν συνεισφέρει ένα Helm formula στο Homebrew.
Αυτό το formula είναι γενικά ενημερωμένο.

```console
brew install helm
```

(Σημείωση: Υπάρχει επίσης ένα formula για το emacs-helm, που είναι διαφορετικό project.)

### Από το Chocolatey (Windows)

Μέλη της κοινότητας του Helm έχουν συνεισφέρει ένα [Helm
package](https://chocolatey.org/packages/kubernetes-helm) στο
[Chocolatey](https://chocolatey.org/). Αυτό το package είναι γενικά ενημερωμένο.

```console
choco install kubernetes-helm
```

### Από το Scoop (Windows)

Μέλη της κοινότητας του Helm έχουν συνεισφέρει ένα [Helm
package](https://github.com/ScoopInstaller/Main/blob/master/bucket/helm.json) στο [Scoop](https://scoop.sh). Αυτό το package είναι γενικά ενημερωμένο.

```console
scoop install helm
```

### Από το Winget (Windows)

Μέλη της κοινότητας του Helm έχουν συνεισφέρει ένα [Helm
package](https://github.com/microsoft/winget-pkgs/tree/master/manifests/h/Helm/Helm) στο [Winget](https://learn.microsoft.com/en-us/windows/package-manager/). Αυτό το package είναι γενικά ενημερωμένο.

```console
winget install Helm.Helm
```

### Από το Apt (Debian/Ubuntu)

Μέλη της κοινότητας του Helm έχουν συνεισφέρει ένα Apt package για Debian/Ubuntu.
Αυτό το package είναι γενικά ενημερωμένο. Ευχαριστούμε το [Buildkite](https://buildkite.com/organizations/helm-linux/packages/registries/helm-debian) για τη φιλοξενία του repository.

```console
sudo apt-get install curl gpg apt-transport-https --yes
curl -fsSL https://packages.buildkite.com/helm-linux/helm-debian/gpgkey | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/helm.gpg] https://packages.buildkite.com/helm-linux/helm-debian/any/ any main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### Από το dnf/yum (Fedora)

Από το Fedora 35, το Helm είναι διαθέσιμο στο επίσημο repository.
Μπορείτε να εγκαταστήσετε το Helm εκτελώντας:

```console
sudo dnf install helm
```

### Από το Snap

Η κοινότητα [Snapcrafters](https://github.com/snapcrafters) συντηρεί την Snap
έκδοση του [Helm package](https://snapcraft.io/helm):

```console
sudo snap install helm --classic
```

### Από το pkg (FreeBSD)

Μέλη της κοινότητας FreeBSD έχουν συνεισφέρει ένα [Helm
package](https://www.freshports.org/sysutils/helm) στη
[FreeBSD Ports Collection](https://man.freebsd.org/ports).
Αυτό το package είναι γενικά ενημερωμένο.

```console
pkg install helm
```

### Development Builds

Εκτός από τα releases, μπορείτε να κατεβάσετε ή να εγκαταστήσετε development
snapshots του Helm.

### Από Canary Builds

Τα "Canary" builds είναι εκδόσεις του λογισμικού Helm που δημιουργούνται από τον
τελευταίο `main` branch. Δεν είναι επίσημα releases και μπορεί να μην είναι
σταθερά. Ωστόσο, προσφέρουν τη δυνατότητα να δοκιμάσετε τα πιο πρόσφατα
χαρακτηριστικά.

Τα Canary Helm binaries αποθηκεύονται στο `get.helm.sh`. Ακολουθούν σύνδεσμοι
για τα συνηθισμένα builds:

- [Linux AMD64](https://get.helm.sh/helm-canary-linux-amd64.tar.gz)
- [macOS AMD64](https://get.helm.sh/helm-canary-darwin-amd64.tar.gz)
- [Experimental Windows
  AMD64](https://get.helm.sh/helm-canary-windows-amd64.zip)

### Από τον Πηγαίο Κώδικα (Linux, macOS)

Η μεταγλώττιση του Helm από τον πηγαίο κώδικα απαιτεί λίγο περισσότερη δουλειά,
αλλά είναι ο καλύτερος τρόπος αν θέλετε να δοκιμάσετε την τελευταία (pre-release)
έκδοση του Helm.

Πρέπει να έχετε ένα λειτουργικό περιβάλλον Go.

```console
$ git clone https://github.com/helm/helm.git
$ cd helm
$ make
```

Αν απαιτείται, θα κατεβάσει τις εξαρτήσεις, θα τις αποθηκεύσει στην cache και
θα επικυρώσει τη ρύθμιση. Στη συνέχεια θα μεταγλωττίσει το `helm` και θα το
τοποθετήσει στο `bin/helm`.

## Συμπέρασμα

Στις περισσότερες περιπτώσεις, η εγκατάσταση είναι τόσο απλή όσο η λήψη ενός
έτοιμου `helm` binary. Αυτό το έγγραφο καλύπτει πρόσθετες περιπτώσεις για
περιπτώσεις για όσους θέλουν να κάνουν πιο εξελιγμένα πράγματα με το Helm.

Μόλις εγκαταστήσετε επιτυχώς τον Helm Client, μπορείτε να προχωρήσετε στη
χρήση του Helm για τη διαχείριση charts και να [προσθέσετε το stable
chart repository](/intro/quickstart.md#initialize-a-helm-chart-repository).
