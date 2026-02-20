---
title: helm rollback
---

επαναφέρει ένα release σε προηγούμενη αναθεώρηση

### Σύνοψη

Αυτή η εντολή επαναφέρει ένα release σε μια προηγούμενη αναθεώρηση.

Το πρώτο όρισμα της εντολής rollback είναι το όνομα ενός release, και το
δεύτερο είναι ένας αριθμός αναθεώρησης (έκδοσης). Αν αυτό το όρισμα παραλειφθεί
ή οριστεί σε 0, θα γίνει επαναφορά στο προηγούμενο release.

Για να δείτε τους αριθμούς αναθεωρήσεων, εκτελέστε 'helm history RELEASE'.


```
helm rollback <RELEASE> [REVISION] [flags]
```

### Επιλογές

```
      --cleanup-on-fail    allow deletion of new resources created in this rollback when rollback fails
      --dry-run            simulate a rollback
      --force              force resource update through delete/recreate if needed
  -h, --help               help for rollback
      --history-max int    limit the maximum number of revisions saved per release. Use 0 for no limit (default 10)
      --no-hooks           prevent hooks from running during rollback
      --recreate-pods      performs pods restart for the resource if applicable
      --timeout duration   time to wait for any individual Kubernetes operation (like Jobs for hooks) (default 5m0s)
      --wait               if set, will wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful. It will wait for as long as --timeout
      --wait-for-jobs      if set and --wait enabled, will wait until all Jobs have been completed before marking the release as successful. It will wait for as long as --timeout
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
