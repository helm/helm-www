---
title: Ο Οδηγός Plugins του Helm
description: Εισάγει τον τρόπο χρήσης και δημιουργίας plugins για την επέκταση της λειτουργικότητας του Helm.
sidebar_position: 12
---

Ένα plugin του Helm είναι ένα εργαλείο που είναι προσβάσιμο μέσω του CLI του `helm`, αλλά δεν αποτελεί μέρος του ενσωματωμένου κώδικα του Helm.

Υπάρχοντα plugins μπορείτε να βρείτε στην ενότητα [σχετικά](/community/related#helm-plugins) ή αναζητώντας στο [GitHub](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories).

Αυτός ο οδηγός εξηγεί πώς να χρησιμοποιήσετε και να δημιουργήσετε plugins.

## Επισκόπηση

Τα plugins του Helm είναι πρόσθετα εργαλεία που ενσωματώνονται απρόσκοπτα με το Helm. Παρέχουν έναν τρόπο επέκτασης του βασικού συνόλου λειτουργιών του Helm, χωρίς να απαιτείται κάθε νέα λειτουργία να είναι γραμμένη σε Go και να προστεθεί στο βασικό εργαλείο.

Τα plugins του Helm έχουν τα ακόλουθα χαρακτηριστικά:

- Μπορούν να προστεθούν και να αφαιρεθούν από μια εγκατάσταση Helm χωρίς να επηρεάζεται το βασικό εργαλείο Helm.
- Μπορούν να γραφτούν σε οποιαδήποτε γλώσσα προγραμματισμού.
- Ενσωματώνονται με το Helm και εμφανίζονται στο `helm help` και σε άλλα σημεία.

Τα plugins του Helm βρίσκονται στο `$HELM_PLUGINS`. Μπορείτε να βρείτε την τρέχουσα τιμή αυτού, συμπεριλαμβανομένης της προεπιλεγμένης τιμής όταν δεν έχει οριστεί στο περιβάλλον, χρησιμοποιώντας την εντολή `helm env`.

Το μοντέλο plugins του Helm βασίζεται εν μέρει στο μοντέλο plugins του Git. Για αυτό τον λόγο, μπορεί μερικές φορές να ακούσετε το `helm` να αναφέρεται ως το επίπεδο _porcelain_, με τα plugins να είναι το _plumbing_. Αυτός είναι ένας συντομευμένος τρόπος για να υποδηλωθεί ότι το Helm παρέχει την εμπειρία χρήστη και τη λογική επεξεργασίας υψηλού επιπέδου, ενώ τα plugins εκτελούν τη "λεπτομερή εργασία" για την πραγματοποίηση μιας επιθυμητής ενέργειας.

## Εγκατάσταση ενός Plugin

Τα plugins εγκαθίστανται χρησιμοποιώντας την εντολή `$ helm plugin install <path|url>`. Μπορείτε να περάσετε μια διαδρομή προς ένα plugin στο τοπικό σας σύστημα αρχείων ή ένα url ενός απομακρυσμένου VCS αποθετηρίου. Η εντολή `helm plugin install` κλωνοποιεί ή αντιγράφει το plugin από τη διαδρομή/url που δίνεται στο `$HELM_PLUGINS`. Αν εγκαθιστάτε από VCS, μπορείτε να καθορίσετε την έκδοση με το όρισμα `--version`.

```console
$ helm plugin install https://github.com/adamreese/helm-env
```

Αν έχετε μια διανομή plugin σε μορφή tar, απλώς αποσυμπιέστε το plugin στον κατάλογο `$HELM_PLUGINS`. Μπορείτε επίσης να εγκαταστήσετε plugins σε μορφή tarball απευθείας από url εκτελώντας `helm plugin install https://domain/path/to/plugin.tar.gz`

## Η Δομή Αρχείων του Plugin

Από πολλές απόψεις, ένα plugin είναι παρόμοιο με ένα chart. Κάθε plugin έχει έναν κατάλογο ανώτατου επιπέδου που περιέχει ένα αρχείο `plugin.yaml`. Μπορεί να υπάρχουν πρόσθετα αρχεία, αλλά μόνο το αρχείο `plugin.yaml` είναι απαραίτητο.

```console
$HELM_PLUGINS/
  |- last/
      |- plugin.yaml
```

## Το Αρχείο plugin.yaml

Το αρχείο plugin.yaml είναι απαραίτητο για ένα plugin. Περιέχει τα ακόλουθα πεδία:

```yaml
name: The name of the plugin (REQUIRED)
version: A SemVer 2 version (REQUIRED)
usage: Single line usage text shown in help
description: Long description shown in places like helm help
ignoreFlags: Ignore flags passed in from Helm
platformCommand: # Configure command to run based on the platform
  - os: OS match, can be empty or omitted to match all OS'
    arch: Architecture match, can be empty or omitted to match all architectures
    command: Plugin command to execute
    args: Plugin command arguments
command: (DEPRECATED) Plugin command, use platformCommand instead
platformHooks: # Configure plugin lifecycle hooks based on the platform
  install: # Install lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin install command to execute
      args: Plugin install command arguments
  update: # Update lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin update command to execute
      args: Plugin update command arguments
  delete: # Delete lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin delete command to execute
      args: Plugin delete command arguments
hooks: # (Deprecated) Plugin lifecycle hooks, use platformHooks instead
  install: Command to install plugin
  update: Command to update plugin
  delete: Command to delete plugin
downloaders: # Configure downloaders capability
  - command: Command to invoke
    protocols:
      - Protocol schema supported
```

### Το Πεδίο `name`

Το `name` είναι το όνομα του plugin. Όταν το Helm εκτελεί αυτό το plugin, αυτό είναι το όνομα που θα χρησιμοποιήσει (π.χ. η εντολή `helm NAME` θα καλέσει αυτό το plugin).

_Το `name` πρέπει να ταιριάζει με το όνομα του καταλόγου._ Στο παράδειγμά μας παραπάνω, αυτό σημαίνει ότι το plugin με `name: last` πρέπει να περιέχεται σε έναν κατάλογο με όνομα `last`.

Περιορισμοί στο `name`:

- Το `name` δεν μπορεί να αντιγράφει μία από τις υπάρχουσες εντολές ανώτατου επιπέδου του `helm`.
- Το `name` πρέπει να περιορίζεται στους χαρακτήρες ASCII a-z, A-Z, 0-9, `_` και `-`.

### Το Πεδίο `version`

Το `version` είναι η έκδοση SemVer 2 του plugin. Τα πεδία `usage` και `description` χρησιμοποιούνται και τα δύο για τη δημιουργία του κειμένου βοήθειας μιας εντολής.

### Το Πεδίο `ignoreFlags`

Ο διακόπτης `ignoreFlags` λέει στο Helm να _μην_ περάσει τις σημαίες στο plugin. Επομένως, αν ένα plugin κληθεί με `helm myplugin --foo` και `ignoreFlags: true`, τότε η σημαία `--foo` απορρίπτεται σιωπηλά.

### Το Πεδίο `platformCommand`

Το `platformCommand` ρυθμίζει την εντολή που θα εκτελέσει το plugin όταν κληθεί. Δεν μπορείτε να ορίσετε ταυτόχρονα και `platformCommand` και `command` καθώς αυτό θα οδηγήσει σε σφάλμα. Οι ακόλουθοι κανόνες ισχύουν για τον καθορισμό της εντολής που θα χρησιμοποιηθεί:

- Αν υπάρχει το `platformCommand`, θα χρησιμοποιηθεί.
  - Αν τόσο το `os` όσο και το `arch` ταιριάζουν με την τρέχουσα πλατφόρμα, η αναζήτηση θα σταματήσει και η εντολή θα χρησιμοποιηθεί.
  - Αν το `os` ταιριάζει και το `arch` είναι κενό, η εντολή θα χρησιμοποιηθεί.
  - Αν και το `os` και το `arch` είναι κενά, η εντολή θα χρησιμοποιηθεί.
  - Αν δεν υπάρχει αντιστοιχία, το Helm θα τερματίσει με σφάλμα.
- Αν το `platformCommand` δεν υπάρχει και υπάρχει η καταργημένη εντολή `command`, θα χρησιμοποιηθεί αυτή.
  - Αν η εντολή είναι κενή, το Helm θα τερματίσει με σφάλμα.

### Το Πεδίο `platformHooks`

Το `platformHooks` ρυθμίζει τις εντολές που θα εκτελέσει το plugin για συμβάντα κύκλου ζωής. Δεν μπορείτε να ορίσετε ταυτόχρονα και `platformHooks` και `hooks` καθώς αυτό θα οδηγήσει σε σφάλμα. Οι ακόλουθοι κανόνες ισχύουν για τον καθορισμό της εντολής hook που θα χρησιμοποιηθεί:

- Αν υπάρχει το `platformHooks`, θα χρησιμοποιηθεί και οι εντολές για το συμβάν κύκλου ζωής θα επεξεργαστούν.
  - Αν τόσο το `os` όσο και το `arch` ταιριάζουν με την τρέχουσα πλατφόρμα, η αναζήτηση θα σταματήσει και η εντολή θα χρησιμοποιηθεί.
  - Αν το `os` ταιριάζει και το `arch` είναι κενό, η εντολή θα χρησιμοποιηθεί.
  - Αν και το `os` και το `arch` είναι κενά, η εντολή θα χρησιμοποιηθεί.
  - Αν δεν υπάρχει αντιστοιχία, το Helm θα παραλείψει το συμβάν.
- Αν το `platformHooks` δεν υπάρχει και υπάρχει το καταργημένο `hooks`, θα χρησιμοποιηθεί η εντολή για το συμβάν κύκλου ζωής.
  - Αν η εντολή είναι κενή, το Helm θα παραλείψει το συμβάν.

## Δημιουργία Plugin

Ακολουθεί το αρχείο YAML του plugin για ένα απλό plugin που βοηθά να ληφθεί το όνομα της τελευταίας έκδοσης:

```yaml
name: last
version: 0.1.0
usage: get the last release name
description: get the last release name
ignoreFlags: false
platformCommand:
  - command: ${HELM_BIN}
    args:
      - list
      - --short
      - --max=1
      - --date
      - -r
```

Τα plugins μπορεί να απαιτούν πρόσθετα scripts και εκτελέσιμα. Τα scripts μπορούν να συμπεριληφθούν στον κατάλογο του plugin και τα εκτελέσιμα μπορούν να ληφθούν μέσω ενός hook. Ακολουθεί ένα παράδειγμα plugin:

```console
$HELM_PLUGINS/
  |- myplugin/
    |- scripts/
      |- install.ps1
      |- install.sh
    |- plugin.yaml
```

```yaml
name: myplugin
version: 0.1.0
usage: example plugin
description: example plugin
ignoreFlags: false
platformCommand:
  - command: ${HELM_PLUGIN_DIR}/bin/myplugin
  - os: windows
    command: ${HELM_PLUGIN_DIR}\bin\myplugin.exe
platformHooks:
  install:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
  update:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
      args:
        - -u
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
        - -Update
```

Οι μεταβλητές περιβάλλοντος αντικαθίστανται πριν από την εκτέλεση του plugin. Το παραπάνω μοτίβο δείχνει τον προτιμώμενο τρόπο για να υποδειχθεί πού βρίσκεται το πρόγραμμα του plugin.

### Εντολές Plugin

Υπάρχουν ορισμένες στρατηγικές για την εργασία με εντολές plugin:

- Αν ένα plugin περιλαμβάνει ένα εκτελέσιμο, το εκτελέσιμο για το `platformCommand:` πρέπει να είναι πακεταρισμένο στον κατάλογο του plugin ή να εγκαθίσταται μέσω ενός hook.
- Η γραμμή `platformCommand:` ή `command:` θα έχει όλες τις μεταβλητές περιβάλλοντος επεκταμένες πριν από την εκτέλεση. Η μεταβλητή `$HELM_PLUGIN_DIR` θα δείχνει στον κατάλογο του plugin.
- Η ίδια η εντολή δεν εκτελείται σε shell. Επομένως, δεν μπορείτε να γράψετε ένα shell script σε μία γραμμή.
- Το Helm εισάγει πολλές ρυθμίσεις σε μεταβλητές περιβάλλοντος. Εξετάστε το περιβάλλον για να δείτε ποιες πληροφορίες είναι διαθέσιμες.
- Το Helm δεν κάνει υποθέσεις για τη γλώσσα του plugin. Μπορείτε να το γράψετε σε ό,τι προτιμάτε.
- Οι εντολές είναι υπεύθυνες για την υλοποίηση συγκεκριμένου κειμένου βοήθειας για τις σημαίες `-h` και `--help`. Το Helm θα χρησιμοποιήσει τα πεδία `usage` και `description` για τις εντολές `helm help` και `helm help myplugin`, αλλά δεν θα χειριστεί την εντολή `helm myplugin --help`.

### Δοκιμή ενός Τοπικού Plugin

Αρχικά πρέπει να βρείτε τη διαδρομή `HELM_PLUGINS`. Για να το κάνετε αυτό, εκτελέστε την ακόλουθη εντολή:

``` bash
helm env
```

Αλλάξτε τον τρέχοντα κατάλογο στον κατάλογο που έχει οριστεί στο `HELM_PLUGINS`.

Τώρα μπορείτε να προσθέσετε έναν συμβολικό σύνδεσμο προς την έξοδο build του plugin σας. Σε αυτό το παράδειγμα το κάνουμε για το `mapkubeapis`.

``` bash
ln -s ~/GitHub/helm-mapkubeapis ./helm-mapkubeapis
```

## Plugins Λήψης

Από προεπιλογή, το Helm μπορεί να κατεβάσει Charts χρησιμοποιώντας HTTP/S. Από το Helm 2.4.0, τα plugins μπορούν να έχουν μια ειδική δυνατότητα λήψης Charts από αυθαίρετες πηγές.

Τα plugins πρέπει να δηλώσουν αυτή την ειδική δυνατότητα στο αρχείο `plugin.yaml` (στο ανώτατο επίπεδο):

```yaml
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

Αν ένα τέτοιο plugin είναι εγκατεστημένο, το Helm μπορεί να αλληλεπιδράσει με το αποθετήριο χρησιμοποιώντας το καθορισμένο σχήμα πρωτοκόλλου καλώντας την εντολή `command`. Το ειδικό αποθετήριο πρέπει να προστεθεί παρόμοια με τα κανονικά: `helm repo add favorite myprotocol://example.com/` Οι κανόνες για τα ειδικά αποθετήρια είναι ίδιοι με τα κανονικά: Το Helm πρέπει να μπορεί να κατεβάσει το αρχείο `index.yaml` για να ανακαλύψει και να αποθηκεύσει προσωρινά τη λίστα των διαθέσιμων Charts.

Η καθορισμένη εντολή θα κληθεί με το ακόλουθο σχήμα: `command certFile keyFile caFile full-URL`. Τα διαπιστευτήρια SSL προέρχονται από τον ορισμό του αποθετηρίου, που αποθηκεύεται στο `$HELM_REPOSITORY_CONFIG` (δηλαδή `$HELM_CONFIG_HOME/repositories.yaml`). Ένα plugin λήψης αναμένεται να εκτυπώσει το ακατέργαστο περιεχόμενο στο stdout και να αναφέρει σφάλματα στο stderr.

Η εντολή λήψης υποστηρίζει επίσης υποεντολές ή ορίσματα, επιτρέποντάς σας να καθορίσετε για παράδειγμα `bin/mydownloader subcommand -d` στο `plugin.yaml`. Αυτό είναι χρήσιμο αν θέλετε να χρησιμοποιήσετε το ίδιο εκτελέσιμο τόσο για την κύρια εντολή του plugin όσο και για την εντολή λήψης, αλλά με διαφορετική υποεντολή για κάθε μία.

## Μεταβλητές Περιβάλλοντος

Όταν το Helm εκτελεί ένα plugin, περνάει το εξωτερικό περιβάλλον στο plugin, και επίσης εισάγει ορισμένες πρόσθετες μεταβλητές περιβάλλοντος.

Μεταβλητές όπως η `KUBECONFIG` ορίζονται για το plugin αν έχουν οριστεί στο εξωτερικό περιβάλλον.

Οι ακόλουθες μεταβλητές είναι εγγυημένο ότι θα οριστούν:

- `HELM_PLUGINS`: Η διαδρομή προς τον κατάλογο plugins.
- `HELM_PLUGIN_NAME`: Το όνομα του plugin, όπως κλήθηκε από το `helm`. Έτσι η εντολή `helm myplug` θα έχει το σύντομο όνομα `myplug`.
- `HELM_PLUGIN_DIR`: Ο κατάλογος που περιέχει το plugin.
- `HELM_BIN`: Η διαδρομή προς την εντολή `helm` (όπως εκτελέστηκε από τον χρήστη).
- `HELM_DEBUG`: Υποδεικνύει αν η σημαία debug ήταν ενεργοποιημένη από το helm.
- `HELM_REGISTRY_CONFIG`: Η τοποθεσία για τη ρύθμιση του registry (αν χρησιμοποιείται). Σημειώστε ότι η χρήση του Helm με registries είναι μια πειραματική λειτουργία.
- `HELM_REPOSITORY_CACHE`: Η διαδρομή προς τα αρχεία προσωρινής μνήμης του αποθετηρίου.
- `HELM_REPOSITORY_CONFIG`: Η διαδρομή προς το αρχείο ρύθμισης του αποθετηρίου.
- `HELM_NAMESPACE`: Το namespace που δόθηκε στην εντολή `helm` (συνήθως χρησιμοποιώντας τη σημαία `-n`).
- `HELM_KUBECONTEXT`: Το όνομα του Kubernetes config context που δόθηκε στην εντολή `helm`.

Επιπλέον, αν ένα αρχείο ρύθμισης Kubernetes καθορίστηκε ρητά, θα οριστεί ως μεταβλητή `KUBECONFIG`.

## Σημείωση για την Ανάλυση Σημαιών

Όταν εκτελείται ένα plugin, το Helm αναλύει τις καθολικές σημαίες για δική του χρήση. Καμία από αυτές τις σημαίες δεν περνάει στο plugin.
- `--burst-limit`: Μετατρέπεται σε `$HELM_BURST_LIMIT`
- `--debug`: Αν καθοριστεί, η `$HELM_DEBUG` ορίζεται σε `1`
- `--kube-apiserver`: Μετατρέπεται σε `$HELM_KUBEAPISERVER`
- `--kube-as-group`: Μετατρέπονται σε `$HELM_KUBEASGROUPS`
- `--kube-as-user`: Μετατρέπεται σε `$HELM_KUBEASUSER`
- `--kube-ca-file`: Μετατρέπεται σε `$HELM_KUBECAFILE`
- `--kube-context`: Μετατρέπεται σε `$HELM_KUBECONTEXT`
- `--kube-insecure-skip-tls-verify`: Μετατρέπεται σε `$HELM_KUBEINSECURE_SKIP_TLS_VERIFY`
- `--kube-tls-server-name`: Μετατρέπεται σε `$HELM_KUBETLS_SERVER_NAME`
- `--kube-token`: Μετατρέπεται σε `$HELM_KUBETOKEN`
- `--kubeconfig`: Μετατρέπεται σε `$KUBECONFIG`
- `--namespace` και `-n`: Μετατρέπεται σε `$HELM_NAMESPACE`
- `--qps`: Μετατρέπεται σε `$HELM_QPS`
- `--registry-config`: Μετατρέπεται σε `$HELM_REGISTRY_CONFIG`
- `--repository-cache`: Μετατρέπεται σε `$HELM_REPOSITORY_CACHE`
- `--repository-config`: Μετατρέπεται σε `$HELM_REPOSITORY_CONFIG`

Τα plugins _πρέπει_ να εμφανίζουν κείμενο βοήθειας και στη συνέχεια να τερματίζουν για τις σημαίες `-h` και `--help`. Σε όλες τις άλλες περιπτώσεις, τα plugins μπορούν να χρησιμοποιούν σημαίες όπως κρίνουν κατάλληλο.

## Παροχή Αυτόματης Συμπλήρωσης Shell

Από το Helm 3.2, ένα plugin μπορεί προαιρετικά να παρέχει υποστήριξη για αυτόματη συμπλήρωση shell ως μέρος του υπάρχοντος μηχανισμού αυτόματης συμπλήρωσης του Helm.

### Στατική Αυτόματη Συμπλήρωση

Αν ένα plugin παρέχει τις δικές του σημαίες ή/και υποεντολές, μπορεί να ενημερώσει το Helm γι' αυτές έχοντας ένα αρχείο `completion.yaml` στον ριζικό κατάλογο του plugin. Το αρχείο `completion.yaml` έχει την ακόλουθη μορφή:

```yaml
name: <pluginName>
flags:
- <flag 1>
- <flag 2>
validArgs:
- <arg value 1>
- <arg value 2>
commands:
  name: <commandName>
  flags:
  - <flag 1>
  - <flag 2>
  validArgs:
  - <arg value 1>
  - <arg value 2>
  commands:
     <and so on, recursively>
```

Σημειώσεις:

1. Όλες οι ενότητες είναι προαιρετικές αλλά πρέπει να παρέχονται αν ισχύουν.
1. Οι σημαίες δεν πρέπει να περιλαμβάνουν το πρόθεμα `-` ή `--`.
1. Τόσο οι σύντομες όσο και οι μακριές σημαίες μπορούν και πρέπει να καθοριστούν. Μια σύντομη σημαία δεν χρειάζεται να συσχετιστεί με την αντίστοιχη μακριά μορφή της, αλλά και οι δύο μορφές πρέπει να αναφέρονται.
1. Οι σημαίες δεν χρειάζεται να είναι ταξινομημένες με συγκεκριμένο τρόπο, αλλά πρέπει να αναφέρονται στο σωστό σημείο στην ιεραρχία υποεντολών του αρχείου.
1. Οι υπάρχουσες καθολικές σημαίες του Helm διαχειρίζονται ήδη από τον μηχανισμό αυτόματης συμπλήρωσης του Helm, επομένως τα plugins δεν χρειάζεται να καθορίσουν τις ακόλουθες σημαίες: `--debug`, `--namespace` ή `-n`, `--kube-context` και `--kubeconfig`, ή οποιαδήποτε άλλη καθολική σημαία.
1. Η λίστα `validArgs` παρέχει μια στατική λίστα πιθανών συμπληρώσεων για την πρώτη παράμετρο μετά από μια υποεντολή. Δεν είναι πάντα δυνατό να παρασχεθεί μια τέτοια λίστα εκ των προτέρων (δείτε την ενότητα [Δυναμική Συμπλήρωση](#δυναμική-συμπλήρωση) παρακάτω), οπότε η ενότητα `validArgs` μπορεί να παραλειφθεί.

Το αρχείο `completion.yaml` είναι εντελώς προαιρετικό. Αν δεν παρέχεται, το Helm απλώς δεν θα παρέχει αυτόματη συμπλήρωση shell για το plugin (εκτός αν υποστηρίζεται [Δυναμική Συμπλήρωση](#δυναμική-συμπλήρωση) από το plugin). Επίσης, η προσθήκη ενός αρχείου `completion.yaml` είναι συμβατή προς τα πίσω και δεν θα επηρεάσει τη συμπεριφορά του plugin σε παλαιότερες εκδόσεις του Helm.

Ως παράδειγμα, για το [`fullstatus plugin`](https://github.com/marckhouzam/helm-fullstatus) που δεν έχει υποεντολές αλλά δέχεται τις ίδιες σημαίες με την εντολή `helm status`, το αρχείο `completion.yaml` είναι:

```yaml
name: fullstatus
flags:
- o
- output
- revision
```

Ένα πιο περίπλοκο παράδειγμα για το [`2to3 plugin`](https://github.com/helm/helm-2to3), έχει ένα αρχείο `completion.yaml`:

```yaml
name: 2to3
commands:
- name: cleanup
  flags:
  - config-cleanup
  - dry-run
  - l
  - label
  - release-cleanup
  - s
  - release-storage
  - tiller-cleanup
  - t
  - tiller-ns
  - tiller-out-cluster
- name: convert
  flags:
  - delete-v2-releases
  - dry-run
  - l
  - label
  - s
  - release-storage
  - release-versions-max
  - t
  - tiller-ns
  - tiller-out-cluster
- name: move
  commands:
  - name: config
    flags:
    - dry-run
```

### Δυναμική Συμπλήρωση

Επίσης από το Helm 3.2, τα plugins μπορούν να παρέχουν τη δική τους δυναμική αυτόματη συμπλήρωση shell. Η δυναμική αυτόματη συμπλήρωση shell είναι η συμπλήρωση τιμών παραμέτρων ή σημαιών που δεν μπορούν να οριστούν εκ των προτέρων. Για παράδειγμα, η συμπλήρωση ονομάτων helm releases που είναι διαθέσιμα αυτή τη στιγμή στο cluster.

Για να υποστηρίξει το plugin τη δυναμική αυτόματη συμπλήρωση, πρέπει να παρέχει ένα **εκτελέσιμο** αρχείο με όνομα `plugin.complete` στον ριζικό του κατάλογο. Όταν το script συμπλήρωσης του Helm απαιτεί δυναμικές συμπληρώσεις για το plugin, θα εκτελέσει το αρχείο `plugin.complete`, περνώντας του τη γραμμή εντολών που χρειάζεται συμπλήρωση. Το εκτελέσιμο `plugin.complete` θα πρέπει να έχει τη λογική για να καθορίσει ποιες είναι οι κατάλληλες επιλογές συμπλήρωσης και να τις εξάγει στην τυπική έξοδο για να καταναλωθούν από το script συμπλήρωσης του Helm.

Το αρχείο `plugin.complete` είναι εντελώς προαιρετικό. Αν δεν παρέχεται, το Helm απλώς δεν θα παρέχει δυναμική αυτόματη συμπλήρωση για το plugin. Επίσης, η προσθήκη ενός αρχείου `plugin.complete` είναι συμβατή προς τα πίσω και δεν θα επηρεάσει τη συμπεριφορά του plugin σε παλαιότερες εκδόσεις του Helm.

Η έξοδος του script `plugin.complete` πρέπει να είναι μια λίστα διαχωρισμένη με νέες γραμμές, όπως:

```console
rel1
rel2
rel3
```

Όταν καλείται το `plugin.complete`, το περιβάλλον του plugin ορίζεται όπως όταν καλείται το κύριο script του plugin. Επομένως, οι μεταβλητές `$HELM_NAMESPACE`, `$HELM_KUBECONTEXT` και όλες οι άλλες μεταβλητές plugin θα έχουν ήδη οριστεί, και οι αντίστοιχες καθολικές σημαίες τους θα έχουν αφαιρεθεί.

Το αρχείο `plugin.complete` μπορεί να είναι σε οποιαδήποτε εκτελέσιμη μορφή· μπορεί να είναι ένα shell script, ένα πρόγραμμα Go ή οποιοδήποτε άλλο είδος προγράμματος που μπορεί να εκτελέσει το Helm. Το αρχείο `plugin.complete` ***πρέπει*** να έχει δικαιώματα εκτέλεσης για τον χρήστη. Το αρχείο `plugin.complete` ***πρέπει*** να τερματίζει με κωδικό επιτυχίας (τιμή 0).

Σε ορισμένες περιπτώσεις, η δυναμική συμπλήρωση θα απαιτεί τη λήψη πληροφοριών από το Kubernetes cluster. Για παράδειγμα, το plugin `helm fullstatus` απαιτεί ένα όνομα release ως είσοδο. Στο plugin `fullstatus`, για να παρέχει το script `plugin.complete` συμπληρώσεις για τρέχοντα ονόματα release, μπορεί απλώς να εκτελέσει `helm list -q` και να εξάγει το αποτέλεσμα.

Αν επιθυμείτε να χρησιμοποιήσετε το ίδιο εκτελέσιμο τόσο για την εκτέλεση του plugin όσο και για τη συμπλήρωση του plugin, το script `plugin.complete` μπορεί να κάνει κλήση στο κύριο εκτελέσιμο του plugin με κάποια ειδική παράμετρο ή σημαία· όταν το κύριο εκτελέσιμο του plugin ανιχνεύσει την ειδική παράμετρο ή σημαία, θα γνωρίζει ότι πρέπει να εκτελέσει τη συμπλήρωση. Στο παράδειγμά μας, το `plugin.complete` θα μπορούσε να υλοποιηθεί ως εξής:

```sh
#!/usr/bin/env sh

# "$@" is the entire command-line that requires completion.
# It is important to double-quote the "$@" variable to preserve a possibly empty last parameter.
$HELM_PLUGIN_DIR/status.sh --complete "$@"
```

Το πραγματικό script του plugin `fullstatus` (`status.sh`) πρέπει τότε να αναζητήσει τη σημαία `--complete` και αν βρεθεί, να εκτυπώσει τις κατάλληλες συμπληρώσεις.

### Συμβουλές και Κόλπα

1. Το shell θα φιλτράρει αυτόματα τις επιλογές συμπλήρωσης που δεν ταιριάζουν με την είσοδο του χρήστη. Ένα plugin μπορεί επομένως να επιστρέφει όλες τις σχετικές συμπληρώσεις χωρίς να αφαιρεί αυτές που δεν ταιριάζουν με την είσοδο του χρήστη. Για παράδειγμα, αν η γραμμή εντολών είναι `helm fullstatus ngin<TAB>`, το script `plugin.complete` μπορεί να εκτυπώσει *όλα* τα ονόματα release (του namespace `default`), όχι μόνο αυτά που αρχίζουν με `ngin`· το shell θα διατηρήσει μόνο αυτά που αρχίζουν με `ngin`.
1. Για να απλοποιήσετε την υποστήριξη δυναμικής συμπλήρωσης, ειδικά αν έχετε ένα πολύπλοκο plugin, μπορείτε να κάνετε το script `plugin.complete` να καλέσει το κύριο script του plugin σας και να ζητήσει επιλογές συμπλήρωσης. Δείτε την ενότητα [Δυναμική Συμπλήρωση](#δυναμική-συμπλήρωση) παραπάνω για ένα παράδειγμα.
1. Για να αποσφαλματώσετε τη δυναμική συμπλήρωση και το αρχείο `plugin.complete`, μπορείτε να εκτελέσετε τα ακόλουθα για να δείτε τα αποτελέσματα συμπλήρωσης:
    - `helm __complete <pluginName> <arguments to complete>`. Για παράδειγμα:
    - `helm __complete fullstatus --output js<ENTER>`,
    - `helm __complete fullstatus -o json ""<ENTER>`
