---
title: helm dependency build
---

ανακατασκευή του καταλόγου charts/ με βάση το αρχείο Chart.lock

### Σύνοψη


Κατασκευάζει τον κατάλογο charts/ από το αρχείο Chart.lock.

Η εντολή build χρησιμοποιείται για την ανακατασκευή των εξαρτήσεων ενός chart
στην κατάσταση που καθορίζεται στο αρχείο lock. Δεν θα επαναδιαπραγματευτεί
τις εξαρτήσεις, όπως κάνει η εντολή 'helm dependency update'.

Αν δεν βρεθεί αρχείο lock, η 'helm dependency build' θα συμπεριφερθεί όπως
η 'helm dependency update'.


```
helm dependency build CHART [flags]
```

### Επιλογές

```
      --ca-file string             verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string           identify HTTPS client using this SSL certificate file
  -h, --help                       help for build
      --insecure-skip-tls-verify   skip tls certificate checks for the chart download
      --key-file string            identify HTTPS client using this SSL key file
      --keyring string             keyring containing public keys (default "~/.gnupg/pubring.gpg")
      --password string            chart repository password where to locate the requested chart
      --plain-http                 use insecure HTTP connections for the chart download
      --skip-refresh               do not refresh the local repository cache
      --username string            chart repository username where to locate the requested chart
      --verify                     verify the packages against signatures
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

* [helm dependency](./helm_dependency.md)	 - διαχείριση εξαρτήσεων ενός chart

###### Δημιουργήθηκε αυτόματα από spf13/cobra στις 14-Jan-2026
