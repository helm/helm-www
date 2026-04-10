---
title: helm uninstall
---

Deinstalliert ein Release

### Zusammenfassung

Dieser Befehl nimmt einen Release-Namen entgegen und deinstalliert das Release.

Er entfernt alle Ressourcen, die mit der letzten Version des Charts verbunden sind, sowie den Release-Verlauf und gibt ihn damit für zukünftige Verwendung frei.

Verwenden Sie das '--dry-run'-Flag, um zu sehen, welche Releases deinstalliert werden, ohne sie tatsächlich zu deinstallieren.


```
helm uninstall RELEASE_NAME [...] [flags]
```

### Optionen

```
      --cascade string       Must be "background", "orphan", or "foreground". Selects the deletion cascading strategy for the dependents. Defaults to background. (default "background")
      --description string   add a custom description
      --dry-run              simulate a uninstall
  -h, --help                 help for uninstall
      --ignore-not-found     Treat "release not found" as a successful uninstall
      --keep-history         remove all associated resources and mark the release as deleted, but retain the release history
      --no-hooks             prevent hooks from running during uninstallation
      --timeout duration     time to wait for any individual Kubernetes operation (like Jobs for hooks) (default 5m0s)
      --wait                 if set, will wait until all the resources are deleted before returning. It will wait for as long as --timeout
```

### Optionen von übergeordneten Befehlen

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

### SIEHE AUCH

* [helm](/helm/helm.md)	 - Der Helm-Paketmanager für Kubernetes.

###### Automatisch generiert von spf13/cobra am 14-Jan-2026
