---
title: helm verify
---

επαληθεύει ότι ένα chart στη δεδομένη διαδρομή έχει υπογραφεί και είναι έγκυρο

### Σύνοψη {#synopsis}

Επαληθεύει ότι το δεδομένο chart έχει έγκυρο αρχείο provenance.

Τα αρχεία provenance παρέχουν κρυπτογραφική επαλήθευση ότι ένα chart δεν έχει
παραποιηθεί και δημιουργήθηκε από έναν αξιόπιστο πάροχο.

Αυτή η εντολή μπορεί να χρησιμοποιηθεί για την επαλήθευση ενός τοπικού chart.
Πολλές άλλες εντολές παρέχουν flags '--verify' που εκτελούν την ίδια επικύρωση.
Για να δημιουργήσετε ένα υπογεγραμμένο πακέτο, χρησιμοποιήστε την εντολή
'helm package --sign'.


```
helm verify PATH [flags]
```

### Επιλογές {#options}

```
  -h, --help             help for verify
      --keyring string   keyring containing public keys (default "~/.gnupg/pubring.gpg")
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

* [helm](/helm/helm.md)	 - Ο διαχειριστής πακέτων Helm για Kubernetes.

###### Δημιουργήθηκε αυτόματα από spf13/cobra στις 14-Jan-2026 {#auto-generated-by-spf13cobra-on-14-jan-2026}
