---
title: helm version
---

εμφανίζει την έκδοση του client

### Σύνοψη

Εμφανίζει την έκδοση του Helm.

Αυτή η εντολή εκτυπώνει μια αναπαράσταση της έκδοσης του Helm.
Η έξοδος θα μοιάζει κάπως έτσι:

version.BuildInfo{Version:"v3.2.1", GitCommit:"fe51cd1e31e6a202cba7dead9552a6d418ded79a", GitTreeState:"clean", GoVersion:"go1.13.10"}

- Version είναι η semantic version του release.
- GitCommit είναι το SHA για το commit από το οποίο δημιουργήθηκε αυτή η έκδοση.
- GitTreeState είναι "clean" αν δεν υπάρχουν τοπικές αλλαγές κώδικα κατά τη δημιουργία
  αυτού του binary, και "dirty" αν το binary δημιουργήθηκε από τοπικά τροποποιημένο κώδικα.
- GoVersion είναι η έκδοση της Go που χρησιμοποιήθηκε για τη μεταγλώττιση του Helm.

Όταν χρησιμοποιείτε την επιλογή --template, οι παρακάτω ιδιότητες είναι διαθέσιμες
για χρήση στο template:

- .Version περιέχει τη semantic version του Helm
- .GitCommit είναι το git commit
- .GitTreeState είναι η κατάσταση του git tree κατά τη δημιουργία του Helm
- .GoVersion περιέχει την έκδοση της Go με την οποία μεταγλωττίστηκε το Helm

Για παράδειγμα, η επιλογή --template='Version: {{.Version}}' εμφανίζει 'Version: v3.2.1'.


```
helm version [flags]
```

### Επιλογές

```
  -h, --help              help for version
      --short             print the version number
      --template string   template for version string format
```

### Επιλογές που κληρονομούνται από γονικές εντολές

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

### ΔΕΙΤΕ ΕΠΙΣΗΣ

* [helm](/helm/helm.md)	 - Ο διαχειριστής πακέτων Helm για Kubernetes.

###### Δημιουργήθηκε αυτόματα από spf13/cobra στις 14-Jan-2026
