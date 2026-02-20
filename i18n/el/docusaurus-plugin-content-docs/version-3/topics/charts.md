---
title: Charts
description: Εξηγεί τη μορφή των charts και παρέχει βασικές οδηγίες για τη δημιουργία charts με το Helm.
sidebar_position: 1
---

Το Helm χρησιμοποιεί μια μορφή πακεταρίσματος που ονομάζεται _charts_. Ένα chart είναι μια
συλλογή αρχείων που περιγράφουν ένα σύνολο σχετικών πόρων του Kubernetes. Ένα
chart μπορεί να χρησιμοποιηθεί για να αναπτύξει κάτι απλό, όπως ένα memcached pod, ή
κάτι πολύπλοκο, όπως μια πλήρη στοίβα web εφαρμογής με HTTP servers, βάσεις δεδομένων,
caches κ.λπ.

Τα charts δημιουργούνται ως αρχεία διατεταγμένα σε μια συγκεκριμένη δομή καταλόγων.
Μπορούν να πακεταριστούν σε versioned αρχεία για ανάπτυξη.

Αν θέλετε να κατεβάσετε και να δείτε τα αρχεία ενός δημοσιευμένου chart, χωρίς να
το εγκαταστήσετε, μπορείτε να το κάνετε με την εντολή `helm pull chartrepo/chartname`.

Αυτό το έγγραφο εξηγεί τη μορφή των charts και παρέχει βασικές οδηγίες για
τη δημιουργία charts με το Helm.

## Η Δομή Αρχείων του Chart

Ένα chart είναι οργανωμένο ως μια συλλογή αρχείων μέσα σε έναν κατάλογο. Το
όνομα του καταλόγου είναι το όνομα του chart (χωρίς πληροφορίες έκδοσης). Έτσι,
ένα chart που περιγράφει το WordPress θα αποθηκευόταν σε έναν κατάλογο `wordpress/`.

Μέσα σε αυτόν τον κατάλογο, το Helm αναμένει μια δομή που ταιριάζει με αυτή:

```text
wordpress/
  Chart.yaml          # A YAML file containing information about the chart
  LICENSE             # OPTIONAL: A plain text file containing the license for the chart
  README.md           # OPTIONAL: A human-readable README file
  values.yaml         # The default configuration values for this chart
  values.schema.json  # OPTIONAL: A JSON Schema for imposing a structure on the values.yaml file
  charts/             # A directory containing any charts upon which this chart depends.
  crds/               # Custom Resource Definitions
  templates/          # A directory of templates that, when combined with values,
                      # will generate valid Kubernetes manifest files.
  templates/NOTES.txt # OPTIONAL: A plain text file containing short usage notes
```

Το Helm δεσμεύει τη χρήση των καταλόγων `charts/`, `crds/` και `templates/`, καθώς
και των αρχείων με τα παραπάνω ονόματα. Τα υπόλοιπα αρχεία θα παραμείνουν ως έχουν.

## Το Αρχείο Chart.yaml

Το αρχείο `Chart.yaml` είναι απαραίτητο για ένα chart. Περιέχει τα εξής πεδία:

```yaml
apiVersion: The chart API version (required)
name: The name of the chart (required)
version: The version of the chart (required)
kubeVersion: A SemVer range of compatible Kubernetes versions (optional)
description: A single-sentence description of this project (optional)
type: The type of the chart (optional)
keywords:
  - A list of keywords about this project (optional)
home: The URL of this projects home page (optional)
sources:
  - A list of URLs to source code for this project (optional)
dependencies: # A list of the chart requirements (optional)
  - name: The name of the chart (nginx)
    version: The version of the chart ("1.2.3")
    repository: (optional) The repository URL ("https://example.com/charts") or alias ("@repo-name")
    condition: (optional) A yaml path that resolves to a boolean, used for enabling/disabling charts (e.g. subchart1.enabled )
    tags: # (optional)
      - Tags can be used to group charts for enabling/disabling together
    import-values: # (optional)
      - ImportValues holds the mapping of source values to parent key to be imported. Each item can be a string or pair of child/parent sublist items.
    alias: (optional) Alias to be used for the chart. Useful when you have to add the same chart multiple times
maintainers: # (optional)
  - name: The maintainers name (required for each maintainer)
    email: The maintainers email (optional for each maintainer)
    url: A URL for the maintainer (optional for each maintainer)
icon: A URL to an SVG or PNG image to be used as an icon (optional).
appVersion: The version of the app that this contains (optional). Needn't be SemVer. Quotes recommended.
deprecated: Whether this chart is deprecated (optional, boolean)
annotations:
  example: A list of annotations keyed by name (optional).
```

Από την έκδοση [v3.3.2](https://github.com/helm/helm/releases/tag/v3.3.2), δεν
επιτρέπονται επιπλέον πεδία. Η προτεινόμενη προσέγγιση είναι να προσθέσετε
προσαρμοσμένα metadata στο πεδίο `annotations`.

### Charts και Εκδοσιοποίηση

Κάθε chart πρέπει να έχει έναν αριθμό έκδοσης. Μια έκδοση πρέπει να ακολουθεί
το πρότυπο [SemVer 2](https://semver.org/spec/v2.0.0.html), αλλά δεν επιβάλλεται
αυστηρά. Σε αντίθεση με το Helm Classic, το Helm v2 και μεταγενέστερα χρησιμοποιεί
τους αριθμούς έκδοσης ως δείκτες release. Τα πακέτα στα repositories
αναγνωρίζονται από το όνομα συν την έκδοση.

Για παράδειγμα, ένα `nginx` chart του οποίου το πεδίο version έχει οριστεί σε
`version: 1.2.3` θα ονομάζεται:

```text
nginx-1.2.3.tgz
```

Υποστηρίζονται επίσης πιο σύνθετα ονόματα SemVer 2, όπως
`version: 1.2.3-alpha.1+ef365`. Ωστόσο, τα μη-SemVer ονόματα απορρίπτονται ρητά
από το σύστημα. Εξαίρεση αποτελούν εκδόσεις στη μορφή `x` ή `x.y`.
Για παράδειγμα, αν υπάρχει ένα πρόθεμα v ή μια έκδοση χωρίς και τα 3 μέρη
(π.χ. v1.2), το σύστημα θα προσπαθήσει να τη μετατρέψει σε έγκυρη σημασιολογική
έκδοση (π.χ. v1.2.0).

**ΣΗΜΕΙΩΣΗ:** Ενώ το Helm Classic και το Deployment Manager ήταν πολύ
προσανατολισμένα στο GitHub όσον αφορά τα charts, το Helm v2 και μεταγενέστερα
δεν βασίζεται ούτε απαιτεί GitHub ή ακόμα και Git. Κατά συνέπεια, δεν χρησιμοποιεί
καθόλου Git SHAs για εκδοσιοποίηση.

Το πεδίο `version` μέσα στο `Chart.yaml` χρησιμοποιείται από πολλά εργαλεία του Helm,
συμπεριλαμβανομένου του CLI. Κατά τη δημιουργία πακέτου, η εντολή `helm package`
χρησιμοποιεί την έκδοση που βρίσκει στο `Chart.yaml` ως τμήμα του ονόματος του
πακέτου. Το σύστημα υποθέτει ότι ο αριθμός έκδοσης στο όνομα του πακέτου chart
ταιριάζει με τον αριθμό έκδοσης στο `Chart.yaml`. Η αποτυχία ικανοποίησης αυτής
της υπόθεσης θα προκαλέσει σφάλμα.

### Το Πεδίο `apiVersion`

Το πεδίο `apiVersion` πρέπει να είναι `v2` για Helm charts που απαιτούν
τουλάχιστον Helm 3. Τα charts που υποστηρίζουν προηγούμενες εκδόσεις του Helm
έχουν `apiVersion` ορισμένο σε `v1` και εξακολουθούν να είναι εγκαταστάσιμα
από το Helm 3.

Αλλαγές από `v1` σε `v2`:

- Ένα πεδίο `dependencies` που ορίζει τις εξαρτήσεις του chart, οι οποίες
  βρίσκονταν σε ξεχωριστό αρχείο `requirements.yaml` για τα `v1` charts
  (δείτε [Εξαρτήσεις Chart](#εξαρτήσεις-chart)).
- Το πεδίο `type`, που διακρίνει τα application και library charts (δείτε
  [Τύποι Chart](#τύποι-chart)).

### Το Πεδίο `appVersion`

Σημειώστε ότι το πεδίο `appVersion` δεν σχετίζεται με το πεδίο `version`. Είναι
ένας τρόπος να προσδιορίσετε την έκδοση της εφαρμογής. Για παράδειγμα, το chart
`drupal` μπορεί να έχει `appVersion: "8.2.1"`, υποδεικνύοντας ότι η έκδοση
του Drupal που περιλαμβάνεται στο chart (από προεπιλογή) είναι `8.2.1`. Αυτό
το πεδίο είναι πληροφοριακό και δεν επηρεάζει τους υπολογισμούς έκδοσης του chart.
Συνιστάται ιδιαίτερα να περικλείετε την έκδοση σε εισαγωγικά. Αναγκάζει τον YAML
parser να αντιμετωπίσει τον αριθμό έκδοσης ως string. Αν το αφήσετε χωρίς
εισαγωγικά, μπορεί να προκληθούν προβλήματα parsing σε ορισμένες περιπτώσεις.
Για παράδειγμα, το YAML ερμηνεύει το `1.0` ως floating point τιμή, και ένα
git commit SHA όπως `1234e10` ως επιστημονική σημειογραφία.

Από το Helm v3.5.0, η εντολή `helm create` περικλείει το προεπιλεγμένο πεδίο
`appVersion` σε εισαγωγικά.

### Το Πεδίο `kubeVersion`

Το προαιρετικό πεδίο `kubeVersion` μπορεί να ορίσει semver περιορισμούς για τις
υποστηριζόμενες εκδόσεις Kubernetes. Το Helm θα επικυρώσει τους περιορισμούς
έκδοσης κατά την εγκατάσταση του chart και θα αποτύχει αν το cluster τρέχει μη
υποστηριζόμενη έκδοση Kubernetes.

Οι περιορισμοί έκδοσης μπορεί να αποτελούνται από AND συγκρίσεις διαχωρισμένες
με κενά, όπως
```
>= 1.13.0 < 1.15.0
```
οι οποίες μπορούν να συνδυαστούν με τον OR τελεστή `||` όπως στο παρακάτω
παράδειγμα
```
>= 1.13.0 < 1.14.0 || >= 1.14.1 < 1.15.0
```
Σε αυτό το παράδειγμα η έκδοση `1.14.0` εξαιρείται, κάτι που μπορεί να έχει
νόημα αν ένα bug σε συγκεκριμένες εκδόσεις είναι γνωστό ότι εμποδίζει τη
σωστή λειτουργία του chart.

Εκτός από περιορισμούς έκδοσης με τελεστές `=` `!=` `>` `<` `>=` `<=`,
υποστηρίζονται και οι εξής συντομεύσεις:

 * hyphen ranges για κλειστά διαστήματα, όπου `1.1 - 2.3.4` ισοδυναμεί με
   `>= 1.1 <= 2.3.4`.
 * wildcards `x`, `X` και `*`, όπου `1.2.x` ισοδυναμεί με `>= 1.2.0 < 1.3.0`.
 * tilde ranges (επιτρέπονται αλλαγές patch version), όπου `~1.2.3` ισοδυναμεί
   με `>= 1.2.3 < 1.3.0`.
 * caret ranges (επιτρέπονται αλλαγές minor version), όπου `^1.2.3` ισοδυναμεί
   με `>= 1.2.3 < 2.0.0`.

Για λεπτομερή εξήγηση των υποστηριζόμενων semver περιορισμών, δείτε το
[Masterminds/semver](https://github.com/Masterminds/semver).

### Απόσυρση Charts

Κατά τη διαχείριση charts σε ένα Chart Repository, μερικές φορές είναι απαραίτητο
να αποσύρετε ένα chart. Το προαιρετικό πεδίο `deprecated` στο `Chart.yaml`
μπορεί να χρησιμοποιηθεί για να επισημάνει ένα chart ως απoσυρμένο. Αν η
**τελευταία** έκδοση ενός chart στο repository είναι επισημασμένη ως αποσυρμένη,
τότε το chart στο σύνολό του θεωρείται αποσυρμένο. Το όνομα του chart μπορεί
να επαναχρησιμοποιηθεί αργότερα δημοσιεύοντας μια νεότερη έκδοση που δεν είναι
επισημασμένη ως αποσυρμένη. Η ροή εργασίας για την απόσυρση charts είναι:

1. Ενημερώστε το `Chart.yaml` του chart για να επισημάνετε το chart ως
   αποσυρμένο, αυξάνοντας την έκδοση
2. Δημοσιεύστε τη νέα έκδοση chart στο Chart Repository
3. Αφαιρέστε το chart από το source repository (π.χ. git)

### Τύποι Chart

Το πεδίο `type` ορίζει τον τύπο του chart. Υπάρχουν δύο τύποι: `application`
και `library`. Ο application είναι ο προεπιλεγμένος τύπος και είναι το τυπικό
chart που μπορεί να λειτουργήσει πλήρως. Το [library chart](/topics/library_charts.md)
παρέχει εργαλεία ή συναρτήσεις για τον κατασκευαστή chart. Ένα library chart
διαφέρει από ένα application chart επειδή δεν είναι εγκαταστάσιμο και συνήθως
δεν περιέχει αντικείμενα πόρων.

**Σημείωση:** Ένα application chart μπορεί να χρησιμοποιηθεί ως library chart.
Αυτό ενεργοποιείται ορίζοντας τον τύπο σε `library`. Το chart θα αποδοθεί τότε
ως library chart όπου όλα τα εργαλεία και οι συναρτήσεις μπορούν να αξιοποιηθούν.
Όλα τα αντικείμενα πόρων του chart δεν θα αποδοθούν.

## Chart LICENSE, README και NOTES

Τα charts μπορούν επίσης να περιέχουν αρχεία που περιγράφουν την εγκατάσταση,
τη διαμόρφωση, τη χρήση και την άδεια ενός chart.

Ένα LICENSE είναι ένα απλό αρχείο κειμένου που περιέχει την
[άδεια χρήσης](https://en.wikipedia.org/wiki/Software_license) για το chart.
Το chart μπορεί να περιέχει άδεια καθώς μπορεί να έχει προγραμματιστική λογική
στα templates και επομένως να μην είναι μόνο διαμόρφωση. Μπορεί επίσης να
υπάρχουν ξεχωριστές άδειες για την εφαρμογή που εγκαθίσταται από το chart,
αν απαιτείται.

Ένα README για ένα chart πρέπει να είναι μορφοποιημένο σε Markdown (README.md)
και γενικά να περιέχει:

- Μια περιγραφή της εφαρμογής ή υπηρεσίας που παρέχει το chart
- Τυχόν προαπαιτούμενα ή απαιτήσεις για την εκτέλεση του chart
- Περιγραφές των επιλογών στο `values.yaml` και τις προεπιλεγμένες τιμές
- Οποιαδήποτε άλλη πληροφορία που μπορεί να είναι σχετική με την εγκατάσταση
  ή τη διαμόρφωση του chart

Όταν τα hubs και άλλα περιβάλλοντα χρήστη εμφανίζουν λεπτομέρειες για ένα chart,
αυτές οι λεπτομέρειες λαμβάνονται από το περιεχόμενο του αρχείου `README.md`.

Το chart μπορεί επίσης να περιέχει ένα σύντομο αρχείο κειμένου
`templates/NOTES.txt` που θα εκτυπώνεται μετά την εγκατάσταση και κατά την
προβολή της κατάστασης ενός release. Αυτό το αρχείο αξιολογείται ως
[template](#templates-και-values) και μπορεί να χρησιμοποιηθεί για να εμφανίσει
σημειώσεις χρήσης, επόμενα βήματα, ή οποιαδήποτε άλλη πληροφορία σχετική με
ένα release του chart. Για παράδειγμα, θα μπορούσαν να παρασχεθούν οδηγίες
για σύνδεση σε μια βάση δεδομένων ή πρόσβαση σε ένα web UI. Δεδομένου ότι αυτό
το αρχείο εκτυπώνεται στο STDOUT κατά την εκτέλεση `helm install` ή `helm status`,
συνιστάται να διατηρείτε το περιεχόμενο σύντομο και να παραπέμπετε στο README
για περισσότερες λεπτομέρειες.

## Εξαρτήσεις Chart

Στο Helm, ένα chart μπορεί να εξαρτάται από οποιονδήποτε αριθμό άλλων charts.
Αυτές οι εξαρτήσεις μπορούν να συνδεθούν δυναμικά χρησιμοποιώντας το πεδίο
`dependencies` στο `Chart.yaml` ή να εισαχθούν στον κατάλογο `charts/` και
να διαχειριστούν χειροκίνητα.

### Διαχείριση Εξαρτήσεων με το Πεδίο `dependencies`

Τα charts που απαιτούνται από το τρέχον chart ορίζονται ως λίστα στο πεδίο
`dependencies`.

```yaml
dependencies:
  - name: apache
    version: 1.2.3
    repository: https://example.com/charts
  - name: mysql
    version: 3.2.1
    repository: https://another.example.com/charts
```

- Το πεδίο `name` είναι το όνομα του chart που θέλετε.
- Το πεδίο `version` είναι η έκδοση του chart που θέλετε.
- Το πεδίο `repository` είναι το πλήρες URL του chart repository. Σημειώστε
  ότι πρέπει επίσης να χρησιμοποιήσετε `helm repo add` για να προσθέσετε αυτό
  το repo τοπικά.
- Μπορείτε να χρησιμοποιήσετε το όνομα του repo αντί για URL

```console
$ helm repo add fantastic-charts https://charts.helm.sh/incubator
```

```yaml
dependencies:
  - name: awesomeness
    version: 1.0.0
    repository: "@fantastic-charts"
```

Αφού ορίσετε τις εξαρτήσεις, μπορείτε να εκτελέσετε `helm dependency update`
και θα χρησιμοποιήσει το αρχείο εξαρτήσεων για να κατεβάσει όλα τα καθορισμένα
charts στον κατάλογο `charts/` για εσάς.

```console
$ helm dep up foochart
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "local" chart repository
...Successfully got an update from the "stable" chart repository
...Successfully got an update from the "example" chart repository
...Successfully got an update from the "another" chart repository
Update Complete. Happy Helming!
Saving 2 charts
Downloading apache from repo https://example.com/charts
Downloading mysql from repo https://another.example.com/charts
```

Όταν η `helm dependency update` ανακτά charts, θα τα αποθηκεύσει ως chart
archives στον κατάλογο `charts/`. Για το παραπάνω παράδειγμα, θα περιμένατε
να δείτε τα εξής αρχεία στον κατάλογο charts:

```text
charts/
  apache-1.2.3.tgz
  mysql-3.2.1.tgz
```

#### Πεδίο Alias στις Εξαρτήσεις

Επιπλέον των άλλων πεδίων παραπάνω, κάθε εγγραφή εξαρτήσεων μπορεί να περιέχει
το προαιρετικό πεδίο `alias`.

Η προσθήκη ενός alias για ένα chart εξάρτησης θα τοποθετήσει ένα chart στις
εξαρτήσεις χρησιμοποιώντας το alias ως όνομα της νέας εξάρτησης.

Μπορείτε να χρησιμοποιήσετε το `alias` σε περιπτώσεις όπου χρειάζεται να
προσπελάσετε ένα chart με άλλο όνομα(τα).

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-1
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-2
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
```

Στο παραπάνω παράδειγμα θα πάρουμε συνολικά 3 εξαρτήσεις για το `parentchart`:

```text
subchart
new-subchart-1
new-subchart-2
```

Ο χειροκίνητος τρόπος για να επιτευχθεί αυτό είναι με copy/paste του ίδιου
chart στον κατάλογο `charts/` πολλές φορές με διαφορετικά ονόματα.

#### Πεδία Tags και Condition στις Εξαρτήσεις

Επιπλέον των άλλων πεδίων παραπάνω, κάθε εγγραφή εξαρτήσεων μπορεί να περιέχει
τα προαιρετικά πεδία `tags` και `condition`.

Όλα τα charts φορτώνονται από προεπιλογή. Αν υπάρχουν πεδία `tags` ή `condition`,
θα αξιολογηθούν και θα χρησιμοποιηθούν για τον έλεγχο φόρτωσης του/των chart(s)
στα οποία εφαρμόζονται.

Condition - Το πεδίο condition περιέχει μία ή περισσότερες διαδρομές YAML
(διαχωρισμένες με κόμμα). Αν αυτή η διαδρομή υπάρχει στα values του ανώτερου
γονικού και επιλύεται σε boolean τιμή, το chart θα ενεργοποιηθεί ή
απενεργοποιηθεί βάσει αυτής της boolean τιμής. Μόνο η πρώτη έγκυρη διαδρομή
που βρέθηκε στη λίστα αξιολογείται και αν δεν υπάρχουν διαδρομές, τότε η
condition δεν έχει αποτέλεσμα.

Tags - Το πεδίο tags είναι μια YAML λίστα ετικετών που σχετίζονται με αυτό
το chart. Στα values του ανώτερου γονικού, όλα τα charts με tags μπορούν να
ενεργοποιηθούν ή να απενεργοποιηθούν καθορίζοντας το tag και μια boolean τιμή.

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart1.enabled,global.subchart1.enabled
    tags:
      - front-end
      - subchart1
  - name: subchart2
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart2.enabled,global.subchart2.enabled
    tags:
      - back-end
      - subchart2
```

```yaml
# parentchart/values.yaml

subchart1:
  enabled: true
tags:
  front-end: false
  back-end: true
```

Στο παραπάνω παράδειγμα, όλα τα charts με το tag `front-end` θα απενεργοποιηθούν,
αλλά επειδή η διαδρομή `subchart1.enabled` αξιολογείται ως 'true' στα values
του γονικού, η condition θα υπερισχύσει του tag `front-end` και το `subchart1`
θα ενεργοποιηθεί.

Δεδομένου ότι το `subchart2` έχει tag `back-end` και αυτό το tag αξιολογείται
σε `true`, το `subchart2` θα ενεργοποιηθεί. Επίσης σημειώστε ότι παρόλο που
το `subchart2` έχει καθορισμένη condition, δεν υπάρχει αντίστοιχη διαδρομή
και τιμή στα values του γονικού, οπότε αυτή η condition δεν έχει αποτέλεσμα.

##### Χρήση του CLI με Tags και Conditions

Η παράμετρος `--set` μπορεί να χρησιμοποιηθεί όπως συνήθως για να αλλάξει
τις τιμές tag και condition.

```console
helm install --set tags.front-end=true --set subchart2.enabled=false
```

##### Επίλυση Tags και Conditions

- **Οι conditions (όταν ορίζονται στα values) υπερισχύουν πάντα των tags.**
  Η πρώτη διαδρομή condition που υπάρχει κερδίζει και οι επόμενες για αυτό
  το chart αγνοούνται.
- Τα tags αξιολογούνται ως 'αν οποιοδήποτε από τα tags του chart είναι true,
  τότε ενεργοποίησε το chart'.
- Οι τιμές tags και conditions πρέπει να οριστούν στα values του ανώτερου
  γονικού.
- Το κλειδί `tags:` στα values πρέπει να είναι κλειδί ανώτατου επιπέδου.
  Τα globals και εμφωλευμένοι πίνακες `tags:` δεν υποστηρίζονται προς το παρόν.

#### Εισαγωγή Τιμών Θυγατρικών μέσω Εξαρτήσεων

Σε ορισμένες περιπτώσεις είναι επιθυμητό να επιτρέπεται στις τιμές ενός
θυγατρικού chart να διαδοθούν στο γονικό chart και να μοιραστούν ως κοινές
προεπιλογές. Ένα επιπλέον πλεονέκτημα της χρήσης της μορφής `exports` είναι
ότι θα επιτρέψει σε μελλοντικά εργαλεία να εξετάζουν τις ρυθμιζόμενες τιμές
χρήστη.

Τα κλειδιά που περιέχουν τις τιμές προς εισαγωγή μπορούν να καθοριστούν στο
`dependencies` του γονικού chart στο πεδίο `import-values` χρησιμοποιώντας
μια λίστα YAML. Κάθε στοιχείο στη λίστα είναι ένα κλειδί που εισάγεται από
το πεδίο `exports` του θυγατρικού chart.

Για να εισάγετε τιμές που δεν περιέχονται στο κλειδί `exports`, χρησιμοποιήστε
τη μορφή [child-parent](#χρήση-της-μορφής-child-parent). Παραδείγματα και
των δύο μορφών περιγράφονται παρακάτω.

##### Χρήση της Μορφής Exports

Αν το αρχείο `values.yaml` ενός θυγατρικού chart περιέχει ένα πεδίο `exports`
στη ρίζα, τα περιεχόμενά του μπορούν να εισαχθούν απευθείας στα values του
γονικού καθορίζοντας τα κλειδιά προς εισαγωγή όπως στο παρακάτω παράδειγμα:

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    import-values:
      - data
```

```yaml
# child's values.yaml file

exports:
  data:
    myint: 99
```

Δεδομένου ότι καθορίζουμε το κλειδί `data` στη λίστα εισαγωγών, το Helm ψάχνει
στο πεδίο `exports` του θυγατρικού chart για το κλειδί `data` και εισάγει
τα περιεχόμενά του.

Τα τελικά values του γονικού θα περιέχουν το εξαγόμενο πεδίο:

```yaml
# parent's values

myint: 99
```

Σημειώστε ότι το γονικό κλειδί `data` δεν περιέχεται στα τελικά values του
γονικού. Αν χρειάζεστε να καθορίσετε το γονικό κλειδί, χρησιμοποιήστε τη
μορφή 'child-parent'.

##### Χρήση της Μορφής Child-Parent

Για να προσπελάσετε τιμές που δεν περιέχονται στο κλειδί `exports` των values
του θυγατρικού chart, θα πρέπει να καθορίσετε το κλειδί πηγή των τιμών
προς εισαγωγή (`child`) και τη διαδρομή προορισμού στα values του γονικού
chart (`parent`).

Το `import-values` στο παρακάτω παράδειγμα δίνει εντολή στο Helm να πάρει
οποιεσδήποτε τιμές βρεθούν στη διαδρομή `child:` και να τις αντιγράψει
στα values του γονικού στη διαδρομή που καθορίζεται στο `parent:`

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    ...
    import-values:
      - child: default.data
        parent: myimports
```

Στο παραπάνω παράδειγμα, οι τιμές που βρίσκονται στο `default.data` στα values
του subchart1 θα εισαχθούν στο κλειδί `myimports` στα values του γονικού
chart όπως περιγράφεται παρακάτω:

```yaml
# parent's values.yaml file

myimports:
  myint: 0
  mybool: false
  mystring: "helm rocks!"
```

```yaml
# subchart1's values.yaml file

default:
  data:
    myint: 999
    mybool: true
```

Τα τελικά values του γονικού chart θα είναι:

```yaml
# parent's final values

myimports:
  myint: 999
  mybool: true
  mystring: "helm rocks!"
```

Τα τελικά values του γονικού περιέχουν τώρα τα πεδία `myint` και `mybool`
που εισήχθησαν από το subchart1.

### Χειροκίνητη Διαχείριση Εξαρτήσεων μέσω του Καταλόγου `charts/`

Αν επιθυμείται περισσότερος έλεγχος στις εξαρτήσεις, αυτές οι εξαρτήσεις
μπορούν να εκφραστούν ρητά αντιγράφοντας τα charts εξαρτήσεων στον κατάλογο
`charts/`.

Μια εξάρτηση πρέπει να είναι ένας μη συμπιεσμένος κατάλογος chart, αλλά το
όνομά του δεν μπορεί να ξεκινά με `_` ή `.`. Τέτοια αρχεία αγνοούνται από
τον φορτωτή chart.

Για παράδειγμα, αν το WordPress chart εξαρτάται από το Apache chart, το Apache
chart (της σωστής έκδοσης) παρέχεται στον κατάλογο `charts/` του WordPress
chart:

```yaml
wordpress:
  Chart.yaml
  # ...
  charts/
    apache/
      Chart.yaml
      # ...
    mysql/
      Chart.yaml
      # ...
```

Το παραπάνω παράδειγμα δείχνει πώς το WordPress chart εκφράζει την εξάρτησή
του από το Apache και το MySQL συμπεριλαμβάνοντας αυτά τα charts μέσα στον
κατάλογο `charts/` του.

**ΣΥΜΒΟΥΛΗ:** _Για να τοποθετήσετε μια εξάρτηση στον κατάλογο `charts/`,
χρησιμοποιήστε την εντολή `helm pull`_

### Λειτουργικές Πτυχές της Χρήσης Εξαρτήσεων

Οι παραπάνω ενότητες εξηγούν πώς να καθορίσετε εξαρτήσεις chart, αλλά πώς
επηρεάζει αυτό την εγκατάσταση chart χρησιμοποιώντας `helm install` και
`helm upgrade`;

Υποθέστε ότι ένα chart με όνομα "A" δημιουργεί τα εξής αντικείμενα Kubernetes:

- namespace "A-Namespace"
- statefulset "A-StatefulSet"
- service "A-Service"

Επιπλέον, το A εξαρτάται από το chart B που δημιουργεί αντικείμενα:

- namespace "B-Namespace"
- replicaset "B-ReplicaSet"
- service "B-Service"

Μετά την εγκατάσταση/αναβάθμιση του chart A, δημιουργείται/τροποποιείται ένα
μόνο Helm release. Το release θα δημιουργήσει/ενημερώσει όλα τα παραπάνω
αντικείμενα Kubernetes με την εξής σειρά:

- A-Namespace
- B-Namespace
- A-Service
- B-Service
- B-ReplicaSet
- A-StatefulSet

Αυτό συμβαίνει επειδή όταν το Helm εγκαθιστά/αναβαθμίζει charts, τα αντικείμενα
Kubernetes από τα charts και όλες τις εξαρτήσεις τους:

- συγκεντρώνονται σε ένα ενιαίο σύνολο· στη συνέχεια
- ταξινομούνται κατά τύπο και έπειτα κατά όνομα· και τέλος
- δημιουργούνται/ενημερώνονται με αυτή τη σειρά.

Επομένως, δημιουργείται ένα μόνο release με όλα τα αντικείμενα για το chart
και τις εξαρτήσεις του.

Η σειρά εγκατάστασης των τύπων Kubernetes δίνεται από την απαρίθμηση InstallOrder
στο kind_sorter.go (δείτε [τον πηγαίο κώδικα του Helm](https://github.com/helm/helm/blob/484d43913f97292648c867b56768775a55e4bba6/pkg/releaseutil/kind_sorter.go)).

## Templates και Values

Τα Helm Chart templates γράφονται στη [γλώσσα template της Go](https://golang.org/pkg/text/template/), με την προσθήκη 50 και πλέον
συναρτήσεων template [από τη βιβλιοθήκη Sprig](https://github.com/Masterminds/sprig) και μερικές άλλες [εξειδικευμένες συναρτήσεις](/howto/charts_tips_and_tricks.md).

Όλα τα αρχεία template αποθηκεύονται στον φάκελο `templates/` ενός chart.
Όταν το Helm αποδίδει τα charts, θα περάσει κάθε αρχείο σε αυτόν τον κατάλογο
μέσω της μηχανής template.

Οι τιμές για τα templates παρέχονται με δύο τρόπους:

- Οι προγραμματιστές chart μπορούν να παρέχουν ένα αρχείο με όνομα `values.yaml`
  μέσα σε ένα chart. Αυτό το αρχείο μπορεί να περιέχει προεπιλεγμένες τιμές.
- Οι χρήστες chart μπορούν να παρέχουν ένα αρχείο YAML που περιέχει τιμές.
  Αυτό μπορεί να παρασχεθεί στη γραμμή εντολών με `helm install`.

Όταν ένας χρήστης παρέχει προσαρμοσμένες τιμές, αυτές οι τιμές θα υπερισχύσουν
των τιμών στο αρχείο `values.yaml` του chart.

### Αρχεία Template

Τα αρχεία template ακολουθούν τις τυπικές συμβάσεις για τη σύνταξη Go templates
(δείτε την [τεκμηρίωση του πακέτου text/template της Go](https://golang.org/pkg/text/template/)
για λεπτομέρειες). Ένα παράδειγμα αρχείου template μπορεί να μοιάζει κάπως έτσι:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

Το παραπάνω παράδειγμα, βασισμένο χαλαρά στο
[https://github.com/deis/charts](https://github.com/deis/charts), είναι ένα
template για έναν Kubernetes replication controller. Μπορεί να χρησιμοποιήσει
τις εξής τέσσερις τιμές template (συνήθως ορίζονται σε ένα αρχείο `values.yaml`):

- `imageRegistry`: Το source registry για το Docker image.
- `dockerTag`: Το tag για το docker image.
- `pullPolicy`: Η Kubernetes pull policy.
- `storage`: Το storage backend, του οποίου η προεπιλογή ορίζεται σε `"minio"`

Όλες αυτές οι τιμές ορίζονται από τον συγγραφέα template. Το Helm δεν απαιτεί
ούτε επιβάλλει παραμέτρους.

Για να δείτε πολλά λειτουργικά charts, δείτε το [Artifact Hub](https://artifacthub.io/packages/search?kind=0) του CNCF.

### Προκαθορισμένες Τιμές

Οι τιμές που παρέχονται μέσω ενός αρχείου `values.yaml` (ή μέσω της σημαίας
`--set`) είναι προσβάσιμες από το αντικείμενο `.Values` σε ένα template.
Αλλά υπάρχουν και άλλα προκαθορισμένα δεδομένα που μπορείτε να προσπελάσετε
στα templates σας.

Οι ακόλουθες τιμές είναι προκαθορισμένες, είναι διαθέσιμες σε κάθε template
και δεν μπορούν να παρακαμφθούν. Όπως με όλες τις τιμές, τα ονόματα είναι
_case sensitive_.

- `Release.Name`: Το όνομα του release (όχι του chart)
- `Release.Namespace`: Το namespace στο οποίο εκδόθηκε το chart.
- `Release.Service`: Η υπηρεσία που διεξήγαγε το release.
- `Release.IsUpgrade`: Ορίζεται σε true αν η τρέχουσα λειτουργία είναι
  αναβάθμιση ή rollback.
- `Release.IsInstall`: Ορίζεται σε true αν η τρέχουσα λειτουργία είναι
  εγκατάσταση.
- `Chart`: Τα περιεχόμενα του `Chart.yaml`. Έτσι, η έκδοση chart είναι
  διαθέσιμη ως `Chart.Version` και οι maintainers στο `Chart.Maintainers`.
- `Files`: Ένα map-like αντικείμενο που περιέχει όλα τα μη ειδικά αρχεία
  στο chart. Αυτό δεν θα σας δώσει πρόσβαση στα templates, αλλά θα σας δώσει
  πρόσβαση σε επιπλέον αρχεία που υπάρχουν (εκτός αν εξαιρούνται χρησιμοποιώντας
  `.helmignore`). Τα αρχεία μπορούν να προσπελαστούν χρησιμοποιώντας
  `{{ index .Files "file.name" }}` ή χρησιμοποιώντας τη συνάρτηση
  `{{.Files.Get name }}`. Μπορείτε επίσης να προσπελάσετε τα περιεχόμενα
  του αρχείου ως `[]byte` χρησιμοποιώντας `{{ .Files.GetBytes }}`
- `Capabilities`: Ένα map-like αντικείμενο που περιέχει πληροφορίες για τις
  εκδόσεις του Kubernetes (`{{ .Capabilities.KubeVersion }}`) και τις
  υποστηριζόμενες εκδόσεις Kubernetes API
  (`{{ .Capabilities.APIVersions.Has "batch/v1" }}`)

**ΣΗΜΕΙΩΣΗ:** Οποιαδήποτε άγνωστα πεδία του `Chart.yaml` θα απορριφθούν.
Δεν θα είναι προσβάσιμα μέσα στο αντικείμενο `Chart`. Επομένως, το `Chart.yaml`
δεν μπορεί να χρησιμοποιηθεί για να περάσετε αυθαίρετα δομημένα δεδομένα
στο template. Το αρχείο values όμως μπορεί να χρησιμοποιηθεί για αυτό.

### Αρχεία Values

Λαμβάνοντας υπόψη το template στην προηγούμενη ενότητα, ένα αρχείο `values.yaml`
που παρέχει τις απαραίτητες τιμές θα έμοιαζε έτσι:

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "s3"
```

Ένα αρχείο values είναι μορφοποιημένο σε YAML. Ένα chart μπορεί να περιλαμβάνει
ένα προεπιλεγμένο αρχείο `values.yaml`. Η εντολή helm install επιτρέπει στον
χρήστη να παρακάμψει τιμές παρέχοντας επιπλέον τιμές YAML:

```console
$ helm install --generate-name --values=myvals.yaml wordpress
```

Όταν οι τιμές περνιούνται με αυτόν τον τρόπο, θα συγχωνευτούν με το προεπιλεγμένο
αρχείο values. Για παράδειγμα, θεωρήστε ένα αρχείο `myvals.yaml` που μοιάζει
έτσι:

```yaml
storage: "gcs"
```

Όταν αυτό συγχωνευτεί με το `values.yaml` στο chart, το τελικό περιεχόμενο
θα είναι:

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "gcs"
```

Σημειώστε ότι μόνο το τελευταίο πεδίο παρακάμφθηκε.

**ΣΗΜΕΙΩΣΗ:** Το προεπιλεγμένο αρχείο values που περιλαμβάνεται μέσα σε ένα
chart _πρέπει_ να ονομάζεται `values.yaml`. Αλλά τα αρχεία που καθορίζονται
στη γραμμή εντολών μπορούν να έχουν οποιοδήποτε όνομα.

**ΣΗΜΕΙΩΣΗ:** Αν χρησιμοποιηθεί η σημαία `--set` στο `helm install` ή
`helm upgrade`, αυτές οι τιμές απλά μετατρέπονται σε YAML στην πλευρά
του client.

**ΣΗΜΕΙΩΣΗ:** Αν υπάρχουν απαιτούμενες εγγραφές στο αρχείο values, μπορούν
να δηλωθούν ως υποχρεωτικές στο template του chart χρησιμοποιώντας τη
[συνάρτηση 'required'](/howto/charts_tips_and_tricks.md)

Οποιαδήποτε από αυτές τις τιμές είναι στη συνέχεια προσβάσιμες μέσα σε templates
χρησιμοποιώντας το αντικείμενο `.Values`:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

### Εμβέλεια, Εξαρτήσεις και Values

Τα αρχεία values μπορούν να δηλώσουν τιμές για το chart ανώτατου επιπέδου,
καθώς και για οποιοδήποτε από τα charts που περιλαμβάνονται στον κατάλογο
`charts/` αυτού του chart. Ή, για να το θέσουμε διαφορετικά, ένα αρχείο values
μπορεί να παρέχει τιμές στο chart καθώς και σε οποιαδήποτε από τις εξαρτήσεις
του. Για παράδειγμα, το επιδεικτικό WordPress chart παραπάνω έχει τόσο
`mysql` όσο και `apache` ως εξαρτήσεις. Το αρχείο values θα μπορούσε να παρέχει
τιμές σε όλα αυτά τα στοιχεία:

```yaml
title: "My WordPress Site" # Sent to the WordPress template

mysql:
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  port: 8080 # Passed to Apache
```

Τα charts σε ανώτερο επίπεδο έχουν πρόσβαση σε όλες τις μεταβλητές που ορίζονται
από κάτω. Έτσι το WordPress chart μπορεί να προσπελάσει τον κωδικό MySQL ως
`.Values.mysql.password`. Αλλά τα charts χαμηλότερου επιπέδου δεν μπορούν να
προσπελάσουν πράγματα στα γονικά charts, οπότε το MySQL δεν θα μπορεί να
προσπελάσει την ιδιότητα `title`. Ούτε, εξάλλου, μπορεί να προσπελάσει το
`apache.port`.

Οι τιμές έχουν namespaces, αλλά τα namespaces περικόπτονται. Έτσι για το
WordPress chart, μπορεί να προσπελάσει το πεδίο κωδικού MySQL ως
`.Values.mysql.password`. Αλλά για το MySQL chart, η εμβέλεια των τιμών
έχει μειωθεί και το πρόθεμα namespace έχει αφαιρεθεί, οπότε θα δει το πεδίο
κωδικού απλά ως `.Values.password`.

#### Global Values

Από την έκδοση 2.0.0-Alpha.2, το Helm υποστηρίζει ειδικές "global" τιμές.
Θεωρήστε αυτή την τροποποιημένη έκδοση του προηγούμενου παραδείγματος:

```yaml
title: "My WordPress Site" # Sent to the WordPress template

global:
  app: MyWordPress

mysql:
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  port: 8080 # Passed to Apache
```

Τα παραπάνω προσθέτουν μια ενότητα `global` με την τιμή `app: MyWordPress`.
Αυτή η τιμή είναι διαθέσιμη σε _όλα_ τα charts ως `.Values.global.app`.

Για παράδειγμα, τα templates του `mysql` μπορούν να προσπελάσουν το `app` ως
`{{ .Values.global.app}}`, και το ίδιο μπορεί να κάνει και το chart `apache`.
Ουσιαστικά, το αρχείο values παραπάνω αναπαράγεται έτσι:

```yaml
title: "My WordPress Site" # Sent to the WordPress template

global:
  app: MyWordPress

mysql:
  global:
    app: MyWordPress
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  global:
    app: MyWordPress
  port: 8080 # Passed to Apache
```

Αυτό παρέχει έναν τρόπο κοινής χρήσης μιας μεταβλητής ανώτατου επιπέδου με
όλα τα subcharts, κάτι που είναι χρήσιμο για ρύθμιση ιδιοτήτων `metadata`
όπως labels.

Αν ένα subchart δηλώνει μια global μεταβλητή, αυτή η global θα περάσει
_προς τα κάτω_ (στα subcharts του subchart), αλλά όχι _προς τα πάνω_ στο
γονικό chart. Δεν υπάρχει τρόπος για ένα subchart να επηρεάσει τις τιμές
του γονικού chart.

Επίσης, οι global μεταβλητές των γονικών charts υπερισχύουν των global
μεταβλητών από τα subcharts.

### Αρχεία Schema

Μερικές φορές, ένας συντηρητής chart μπορεί να θέλει να ορίσει μια δομή
για τα values του. Αυτό μπορεί να γίνει ορίζοντας ένα schema στο αρχείο
`values.schema.json`. Ένα schema αναπαρίσταται ως
[JSON Schema](https://json-schema.org/). Μπορεί να μοιάζει κάπως έτσι:

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "properties": {
    "image": {
      "description": "Container Image",
      "properties": {
        "repo": {
          "type": "string"
        },
        "tag": {
          "type": "string"
        }
      },
      "type": "object"
    },
    "name": {
      "description": "Service name",
      "type": "string"
    },
    "port": {
      "description": "Port",
      "minimum": 0,
      "type": "integer"
    },
    "protocol": {
      "type": "string"
    }
  },
  "required": [
    "protocol",
    "port"
  ],
  "title": "Values",
  "type": "object"
}
```

Αυτό το schema θα εφαρμοστεί στα values για να τα επικυρώσει. Η επικύρωση
πραγματοποιείται όταν καλούνται οποιεσδήποτε από τις εξής εντολές:

- `helm install`
- `helm upgrade`
- `helm lint`
- `helm template`

Ένα παράδειγμα αρχείου `values.yaml` που πληροί τις απαιτήσεις αυτού του
schema μπορεί να μοιάζει κάπως έτσι:

```yaml
name: frontend
protocol: https
port: 443
```

Σημειώστε ότι το schema εφαρμόζεται στο τελικό αντικείμενο `.Values` και
όχι μόνο στο αρχείο `values.yaml`. Αυτό σημαίνει ότι το ακόλουθο αρχείο
yaml είναι έγκυρο, δεδομένου ότι το chart εγκαθίσταται με την κατάλληλη
επιλογή `--set` που φαίνεται παρακάτω.

```yaml
name: frontend
protocol: https
```

```console
helm install --set port=443
```

Επιπλέον, το τελικό αντικείμενο `.Values` ελέγχεται έναντι *όλων* των schemas
των subcharts. Αυτό σημαίνει ότι οι περιορισμοί σε ένα subchart δεν μπορούν
να παρακαμφθούν από ένα γονικό chart. Αυτό λειτουργεί και αντίστροφα - αν
ένα subchart έχει μια απαίτηση που δεν ικανοποιείται στο αρχείο `values.yaml`
του subchart, το γονικό chart *πρέπει* να ικανοποιήσει αυτούς τους περιορισμούς
για να είναι έγκυρο.

Η επικύρωση schema μπορεί να απενεργοποιηθεί ορίζοντας την παρακάτω επιλογή.
Αυτό είναι ιδιαίτερα χρήσιμο σε περιβάλλοντα air-gapped όταν το αρχείο
JSON Schema ενός chart περιέχει απομακρυσμένες αναφορές.
```console
helm install --skip-schema-validation
```

### Αναφορές

Όσον αφορά τη σύνταξη templates, values και αρχείων schema, υπάρχουν αρκετές
τυπικές αναφορές που θα σας βοηθήσουν.

- [Go templates](https://godoc.org/text/template)
- [Επιπλέον συναρτήσεις template](https://godoc.org/github.com/Masterminds/sprig)
- [Η μορφή YAML](https://yaml.org/spec/)
- [JSON Schema](https://json-schema.org/)

## Custom Resource Definitions (CRDs)

Το Kubernetes παρέχει έναν μηχανισμό για τη δήλωση νέων τύπων αντικειμένων
Kubernetes. Χρησιμοποιώντας CustomResourceDefinitions (CRDs), οι προγραμματιστές
Kubernetes μπορούν να δηλώσουν προσαρμοσμένους τύπους πόρων.

Στο Helm 3, τα CRDs αντιμετωπίζονται ως ειδικός τύπος αντικειμένου.
Εγκαθίστανται πριν από το υπόλοιπο chart και υπόκεινται σε ορισμένους
περιορισμούς.

Τα αρχεία YAML CRD πρέπει να τοποθετούνται στον κατάλογο `crds/` μέσα
σε ένα chart. Πολλά CRDs (διαχωρισμένα με δείκτες αρχής και τέλους YAML)
μπορούν να τοποθετηθούν στο ίδιο αρχείο. Το Helm θα προσπαθήσει να φορτώσει
_όλα_ τα αρχεία στον κατάλογο CRD στο Kubernetes.

Τα αρχεία CRD _δεν μπορούν να είναι templated_. Πρέπει να είναι απλά
έγγραφα YAML.

Όταν το Helm εγκαθιστά ένα νέο chart, θα ανεβάσει τα CRDs, θα περιμένει
μέχρι τα CRDs να γίνουν διαθέσιμα από τον API server, και μετά θα ξεκινήσει
τη μηχανή template, θα αποδώσει το υπόλοιπο chart και θα το ανεβάσει στο
Kubernetes. Λόγω αυτής της σειράς, οι πληροφορίες CRD είναι διαθέσιμες
στο αντικείμενο `.Capabilities` στα Helm templates, και τα Helm templates
μπορούν να δημιουργήσουν νέα instances αντικειμένων που δηλώθηκαν σε CRDs.

Για παράδειγμα, αν το chart σας είχε ένα CRD για `CronTab` στον κατάλογο
`crds/`, μπορείτε να δημιουργήσετε instances του είδους `CronTab` στον
κατάλογο `templates/`:

```text
crontabs/
  Chart.yaml
  crds/
    crontab.yaml
  templates/
    mycrontab.yaml
```

Το αρχείο `crontab.yaml` πρέπει να περιέχει το CRD χωρίς οδηγίες template:

```yaml
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
```

Στη συνέχεια, το template `mycrontab.yaml` μπορεί να δημιουργήσει ένα νέο
`CronTab` (χρησιμοποιώντας templates ως συνήθως):

```yaml
apiVersion: stable.example.com
kind: CronTab
metadata:
  name: {{ .Values.name }}
spec:
   # ...
```

Το Helm θα διασφαλίσει ότι το είδος `CronTab` έχει εγκατασταθεί και είναι
διαθέσιμο από τον Kubernetes API server πριν προχωρήσει στην εγκατάσταση
των πραγμάτων στο `templates/`.

### Περιορισμοί στα CRDs

Σε αντίθεση με τα περισσότερα αντικείμενα στο Kubernetes, τα CRDs εγκαθίστανται
globally. Για αυτό τον λόγο, το Helm ακολουθεί μια πολύ προσεκτική προσέγγιση
στη διαχείριση CRDs. Τα CRDs υπόκεινται στους εξής περιορισμούς:

- Τα CRDs δεν επανεγκαθίστανται ποτέ. Αν το Helm διαπιστώσει ότι τα CRDs
  στον κατάλογο `crds/` υπάρχουν ήδη (ανεξαρτήτως έκδοσης), το Helm δεν
  θα προσπαθήσει να τα εγκαταστήσει ή να τα αναβαθμίσει.
- Τα CRDs δεν εγκαθίστανται ποτέ κατά την αναβάθμιση ή το rollback.
  Το Helm θα δημιουργήσει CRDs μόνο κατά τις λειτουργίες εγκατάστασης.
- Τα CRDs δεν διαγράφονται ποτέ. Η διαγραφή ενός CRD διαγράφει αυτόματα
  όλα τα περιεχόμενα του CRD σε όλα τα namespaces στο cluster.
  Κατά συνέπεια, το Helm δεν θα διαγράψει CRDs.

Οι διαχειριστές που θέλουν να αναβαθμίσουν ή να διαγράψουν CRDs ενθαρρύνονται
να το κάνουν χειροκίνητα και με μεγάλη προσοχή.

## Χρήση του Helm για Διαχείριση Charts

Το εργαλείο `helm` έχει αρκετές εντολές για εργασία με charts.

Μπορεί να δημιουργήσει ένα νέο chart για εσάς:

```console
$ helm create mychart
Created mychart/
```

Αφού επεξεργαστείτε ένα chart, το `helm` μπορεί να το πακετάρει σε ένα
chart archive για εσάς:

```console
$ helm package mychart
Archived mychart-0.1.-.tgz
```

Μπορείτε επίσης να χρησιμοποιήσετε το `helm` για να σας βοηθήσει να βρείτε
προβλήματα με τη μορφοποίηση ή τις πληροφορίες του chart σας:

```console
$ helm lint mychart
No issues found
```

## Chart Repositories

Ένα _chart repository_ είναι ένας HTTP server που φιλοξενεί ένα ή περισσότερα
πακεταρισμένα charts. Ενώ το `helm` μπορεί να χρησιμοποιηθεί για τη διαχείριση
τοπικών καταλόγων chart, όταν πρόκειται για κοινή χρήση charts, ο προτιμώμενος
μηχανισμός είναι ένα chart repository.

Οποιοσδήποτε HTTP server που μπορεί να εξυπηρετεί αρχεία YAML και tar και
μπορεί να απαντά σε αιτήματα GET μπορεί να χρησιμοποιηθεί ως server
repository. Η ομάδα του Helm έχει δοκιμάσει ορισμένους servers, συμπεριλαμβανομένου
του Google Cloud Storage με ενεργοποιημένη τη λειτουργία website και του
S3 με ενεργοποιημένη τη λειτουργία website.

Ένα repository χαρακτηρίζεται κυρίως από την παρουσία ενός ειδικού αρχείου
που ονομάζεται `index.yaml` που έχει μια λίστα με όλα τα πακέτα που παρέχονται
από το repository, μαζί με metadata που επιτρέπουν την ανάκτηση και επαλήθευση
αυτών των πακέτων.

Στην πλευρά του client, τα repositories διαχειρίζονται με τις εντολές
`helm repo`. Ωστόσο, το Helm δεν παρέχει εργαλεία για την αποστολή charts
σε απομακρυσμένους servers repository. Αυτό συμβαίνει επειδή κάτι τέτοιο
θα πρόσθετε σημαντικές απαιτήσεις σε έναν server υλοποίησης, και επομένως
θα αύξανε το εμπόδιο για τη δημιουργία ενός repository.

## Chart Starter Packs

Η εντολή `helm create` δέχεται μια προαιρετική επιλογή `--starter` που σας
επιτρέπει να καθορίσετε ένα "starter chart". Επίσης, η επιλογή starter έχει
ένα σύντομο alias `-p`.

Παραδείγματα χρήσης:

```console
helm create my-chart --starter starter-name
helm create my-chart -p starter-name
helm create my-chart -p /absolute/path/to/starter-name
```

Τα starters είναι απλά κανονικά charts, αλλά βρίσκονται στο
`$XDG_DATA_HOME/helm/starters`. Ως προγραμματιστής chart, μπορείτε να
δημιουργήσετε charts που είναι ειδικά σχεδιασμένα για χρήση ως starters.
Τέτοια charts πρέπει να σχεδιάζονται με τις εξής σκέψεις στο μυαλό:

- Το `Chart.yaml` θα αντικατασταθεί από τον generator.
- Οι χρήστες θα αναμένουν να τροποποιήσουν τα περιεχόμενα ενός τέτοιου chart,
  οπότε η τεκμηρίωση πρέπει να υποδεικνύει πώς μπορούν οι χρήστες να το κάνουν.
- Όλες οι εμφανίσεις του `<CHARTNAME>` θα αντικατασταθούν με το καθορισμένο
  όνομα chart, ώστε τα starter charts να μπορούν να χρησιμοποιηθούν ως templates,
  εκτός από ορισμένα αρχεία μεταβλητών. Για παράδειγμα, αν χρησιμοποιείτε
  προσαρμοσμένα αρχεία στον κατάλογο `vars` ή ορισμένα αρχεία `README.md`,
  το `<CHARTNAME>` ΔΕΝ θα αντικατασταθεί μέσα σε αυτά. Επιπλέον, η περιγραφή
  chart δεν κληρονομείται.

Προς το παρόν, ο μόνος τρόπος να προσθέσετε ένα chart στο
`$XDG_DATA_HOME/helm/starters` είναι να το αντιγράψετε χειροκίνητα εκεί.
Στην τεκμηρίωση του chart σας, μπορεί να θέλετε να εξηγήσετε αυτή τη διαδικασία.
