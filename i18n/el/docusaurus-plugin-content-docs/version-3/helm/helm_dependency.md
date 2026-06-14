---
title: helm dependency
---

διαχείριση εξαρτήσεων ενός chart

### Σύνοψη {#synopsis}


Διαχείριση των εξαρτήσεων ενός chart.

Τα Helm charts αποθηκεύουν τις εξαρτήσεις τους στον κατάλογο 'charts/'. Για τους
προγραμματιστές charts, είναι συχνά πιο εύκολο να διαχειρίζονται τις εξαρτήσεις
μέσω του 'Chart.yaml', το οποίο δηλώνει όλες τις εξαρτήσεις.

Οι εντολές dependency λειτουργούν με αυτό το αρχείο, διευκολύνοντας τον
συγχρονισμό μεταξύ των επιθυμητών εξαρτήσεων και των πραγματικών εξαρτήσεων
που αποθηκεύονται στον κατάλογο 'charts/'.

Για παράδειγμα, το παρακάτω Chart.yaml δηλώνει δύο εξαρτήσεις:

    # Chart.yaml
    dependencies:
    - name: nginx
      version: "1.2.3"
      repository: "https://example.com/charts"
    - name: memcached
      version: "3.2.1"
      repository: "https://another.example.com/charts"


Το πεδίο 'name' πρέπει να είναι το όνομα ενός chart, και αυτό το όνομα πρέπει
να ταιριάζει με αυτό στο αρχείο 'Chart.yaml' του εν λόγω chart.

Το πεδίο 'version' πρέπει να περιέχει μια σημασιολογική έκδοση (SemVer) ή
εύρος εκδόσεων.

Το URL του 'repository' πρέπει να δείχνει σε ένα Chart Repository. Το Helm
αναμένει ότι προσθέτοντας '/index.yaml' στο URL, θα μπορεί να ανακτήσει το
ευρετήριο του αποθετηρίου. Σημείωση: το 'repository' μπορεί να είναι ψευδώνυμο.
Το ψευδώνυμο πρέπει να ξεκινά με 'alias:' ή '@'.

Από την έκδοση 2.2.0 και μετά, το repository μπορεί να οριστεί ως διαδρομή
προς τον κατάλογο των εξαρτημένων charts που είναι αποθηκευμένα τοπικά. Η
διαδρομή πρέπει να ξεκινά με το πρόθεμα "file://". Για παράδειγμα,

    # Chart.yaml
    dependencies:
    - name: nginx
      version: "1.2.3"
      repository: "file://../dependency_chart/nginx"

Αν το εξαρτημένο chart ανακτάται τοπικά, δεν απαιτείται να έχει προστεθεί το
αποθετήριο στο Helm μέσω της εντολής "helm repo add". Η αντιστοίχιση εκδόσεων
υποστηρίζεται και σε αυτήν την περίπτωση.


### Επιλογές {#options}

```
  -h, --help   help for dependency
```

### Επιλογές που κληρονομούνται από γονικές εντολές {#options-inherited-from-parent-commands}

```
      --burst-limit int                 client-side default throttling limit (default 100)
      --debug                           enable verbose output
      --kube-apiserver string           the address and the port for the Kubernetes API server
      --kube-as-group stringArray       group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --kube-as-user string             username to impersonate for the operation
      --kube-ca-file string             the certificate authority file for the Kubernetes API server connection
      --kube-context string             name of the kubeconfig context to use
      --kube-insecure-skip-tls-verify   if true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kube-tls-server-name string     server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used
      --kube-token string               bearer token used for authentication
      --kubeconfig string               path to the kubeconfig file
  -n, --namespace string                namespace scope for this request
      --qps float32                     queries per second used when communicating with the Kubernetes API, not including bursting
      --registry-config string          path to the registry config file (default "~/.config/helm/registry/config.json")
      --repository-cache string         path to the directory containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string        path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### ΔΕΙΤΕ ΕΠΙΣΗΣ {#see-also}

* [helm](./helm.md)	 - Ο διαχειριστής πακέτων Helm για το Kubernetes.
* [helm dependency build](./helm_dependency_build.md)	 - ανακατασκευή του καταλόγου charts/ με βάση το αρχείο Chart.lock
* [helm dependency list](./helm_dependency_list.md)	 - εμφάνιση των εξαρτήσεων για ένα συγκεκριμένο chart
* [helm dependency update](./helm_dependency_update.md)	 - ενημέρωση του καταλόγου charts/ με βάση τα περιεχόμενα του Chart.yaml

###### Δημιουργήθηκε αυτόματα από spf13/cobra στις 14-Jan-2026 {#auto-generated-by-spf13cobra-on-14-jan-2026}
