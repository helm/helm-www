---
title: helm repo update
---

ενημερώνει τοπικά τις πληροφορίες για διαθέσιμα charts από τα αποθετήρια chart

### Σύνοψη {#synopsis}

Η εντολή update ανακτά τις πιο πρόσφατες πληροφορίες για charts από τα αντίστοιχα
αποθετήρια chart. Οι πληροφορίες αποθηκεύονται τοπικά στην προσωρινή μνήμη (cache),
όπου χρησιμοποιούνται από εντολές όπως η 'helm search'.

Μπορείτε προαιρετικά να καθορίσετε μια λίστα αποθετηρίων που θέλετε να ενημερώσετε.
	$ helm repo update <repo_name> ...
Για να ενημερώσετε όλα τα αποθετήρια, χρησιμοποιήστε 'helm repo update'.


```
helm repo update [REPO1 [REPO2 ...]] [flags]
```

### Επιλογές {#options}

```
      --fail-on-repo-update-fail   update fails if any of the repository updates fail
  -h, --help                       help for update
      --timeout duration           time to wait for the index file download to complete (default 2m0s)
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

* [helm repo](/helm/helm_repo.md)	 - προσθέτει, εμφανίζει, αφαιρεί, ενημερώνει και δημιουργεί ευρετήριο για αποθετήρια chart

###### Δημιουργήθηκε αυτόματα από spf13/cobra στις 14-Jan-2026 {#auto-generated-by-spf13cobra-on-14-jan-2026}
