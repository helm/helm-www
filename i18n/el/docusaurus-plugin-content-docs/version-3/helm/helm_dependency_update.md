---
title: helm dependency update
---

ενημέρωση του καταλόγου charts/ με βάση τα περιεχόμενα του Chart.yaml

### Σύνοψη


Ενημερώνει τις εξαρτήσεις στον τοπικό δίσκο σύμφωνα με το Chart.yaml.

Αυτή η εντολή επαληθεύει ότι τα απαιτούμενα charts, όπως ορίζονται στο 'Chart.yaml',
υπάρχουν στον κατάλογο 'charts/' και είναι σε αποδεκτή έκδοση. Θα κατεβάσει τα
πιο πρόσφατα charts που ικανοποιούν τις εξαρτήσεις και θα καθαρίσει τις παλιές
εξαρτήσεις.

Μετά από επιτυχή ενημέρωση, θα δημιουργηθεί ένα αρχείο lock που μπορεί να
χρησιμοποιηθεί για την ανακατασκευή των εξαρτήσεων σε μια ακριβή έκδοση.

Οι εξαρτήσεις δεν απαιτείται να αναπαρίστανται στο 'Chart.yaml'. Για αυτόν
τον λόγο, μια εντολή ενημέρωσης δεν θα αφαιρέσει charts εκτός αν αυτά (α)
υπάρχουν στο αρχείο Chart.yaml, αλλά (β) είναι σε λάθος έκδοση.


```
helm dependency update CHART [flags]
```

### Επιλογές

```
      --ca-file string             verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string           identify HTTPS client using this SSL certificate file
  -h, --help                       help for update
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

* [helm dependency](/helm/helm_dependency.md)	 - διαχείριση εξαρτήσεων ενός chart

###### Δημιουργήθηκε αυτόματα από spf13/cobra στις 14-Jan-2026
