---
title: Chart Releaser Action για Αυτοματοποίηση Charts σε GitHub Pages
description: Περιγράφει πώς να χρησιμοποιήσετε το Chart Releaser Action για την αυτοματοποίηση δημοσίευσης charts μέσω GitHub pages.
sidebar_position: 3
---

Αυτός ο οδηγός περιγράφει πώς να χρησιμοποιήσετε το [Chart Releaser
Action](https://github.com/marketplace/actions/helm-chart-releaser) για την
αυτοματοποίηση δημοσίευσης charts μέσω GitHub pages. Το Chart Releaser Action
είναι ένα GitHub Action workflow που μετατρέπει ένα project στο GitHub σε
αυτοφιλοξενούμενο αποθετήριο Helm chart, χρησιμοποιώντας το εργαλείο CLI
[helm/chart-releaser](https://github.com/helm/chart-releaser).

## Αλλαγές στο Αποθετήριο {#repository-changes}

Δημιουργήστε ένα Git αποθετήριο στον οργανισμό σας στο GitHub. Μπορείτε να
ονομάσετε το αποθετήριο `helm-charts`, αν και άλλα ονόματα είναι επίσης
αποδεκτά. Ο πηγαίος κώδικας όλων των charts μπορεί να τοποθετηθεί στον κλάδο
`main`. Τα charts θα πρέπει να τοποθετηθούν στον κατάλογο `/charts` στο
ανώτατο επίπεδο της δομής καταλόγων.

Θα πρέπει να υπάρχει ένας άλλος κλάδος με όνομα `gh-pages` για τη δημοσίευση
των charts. Οι αλλαγές σε αυτόν τον κλάδο θα δημιουργούνται αυτόματα από το
Chart Releaser Action που περιγράφεται εδώ. Ωστόσο, μπορείτε να δημιουργήσετε
τον κλάδο `gh-pages` και να προσθέσετε ένα αρχείο `README.md`, το οποίο θα
είναι ορατό στους χρήστες που επισκέπτονται τη σελίδα.

Μπορείτε να προσθέσετε οδηγίες στο `README.md` για την εγκατάσταση charts ως
εξής (αντικαταστήστε τα `<alias>`, `<orgname>` και `<chart-name>`):

```
## Usage {#usage}

[Helm](https://helm.sh) must be installed to use the charts.  Please refer to
Helm's [documentation](https://helm.sh/docs) to get started.

Once Helm has been set up correctly, add the repo as follows:

  helm repo add <alias> https://<orgname>.github.io/helm-charts

If you had already added this repo earlier, run `helm repo update` to retrieve
the latest versions of the packages.  You can then run `helm search repo
<alias>` to see the charts.

To install the <chart-name> chart:

    helm install my-<chart-name> <alias>/<chart-name>

To uninstall the chart:

    helm uninstall my-<chart-name>
```

Τα charts θα δημοσιεύονται σε μια ιστοσελίδα με URL όπως αυτό:

    https://<orgname>.github.io/helm-charts

## GitHub Actions Workflow {#github-actions-workflow}

Δημιουργήστε ένα αρχείο GitHub Actions workflow στον κλάδο `main` στη διαδρομή
`.github/workflows/release.yml`

```
name: Release Charts

on:
  push:
    branches:
      - main

jobs:
  release:
    permissions:
      contents: write
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Configure Git
        run: |
          git config user.name "$GITHUB_ACTOR"
          git config user.email "$GITHUB_ACTOR@users.noreply.github.com"

      - name: Run chart-releaser
        uses: helm/chart-releaser-action@v1.6.0
        env:
          CR_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
```

Η παραπάνω διαμόρφωση χρησιμοποιεί το
[@helm/chart-releaser-action](https://github.com/helm/chart-releaser-action)
για να μετατρέψει το project σας στο GitHub σε αυτοφιλοξενούμενο αποθετήριο
Helm chart. Σε κάθε push στο main, το action ελέγχει κάθε chart στο project
σας. Όταν εντοπίσει νέα έκδοση chart, δημιουργεί μια αντίστοιχη release στο
GitHub με όνομα που αντιστοιχεί στην έκδοση του chart, προσθέτει τα αρχεία
Helm chart στη release, και δημιουργεί ή ενημερώνει ένα αρχείο `index.yaml` με
μεταδεδομένα για αυτές τις releases. Το αρχείο αυτό φιλοξενείται στη συνέχεια
στο GitHub pages.

Ο αριθμός έκδοσης του Chart Releaser Action που χρησιμοποιείται στο παραπάνω
παράδειγμα είναι `v1.6.0`. Μπορείτε να τον αλλάξετε στην [τελευταία διαθέσιμη
έκδοση](https://github.com/helm/chart-releaser-action/releases).

Σημείωση: Το Chart Releaser Action χρησιμοποιείται σχεδόν πάντα σε συνδυασμό με
το [Helm Testing Action](https://github.com/marketplace/actions/helm-chart-testing)
και το [Kind Action](https://github.com/marketplace/actions/kind-cluster).
