---
title: helm registry
---

σύνδεση ή αποσύνδεση από ένα registry

### Σύνοψη


Αυτή η εντολή αποτελείται από πολλές υποεντολές για αλληλεπίδραση με registries.


### Επιλογές

```
  -h, --help   help for registry
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
* [helm registry login](/helm/helm_registry_login.md)	 - σύνδεση σε ένα registry
* [helm registry logout](/helm/helm_registry_logout.md)	 - αποσύνδεση από ένα registry

###### Δημιουργήθηκε αυτόματα από spf13/cobra στις 14-Jan-2026
