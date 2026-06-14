---
title: helm repo
---

Chart Repositories hinzufügen, auflisten, entfernen, aktualisieren und indizieren

### Zusammenfassung


Dieser Befehl besteht aus mehreren Unterbefehlen zur Interaktion mit Chart Repositories.

Mit diesem Befehl können Sie Chart Repositories hinzufügen, entfernen, auflisten und indizieren.


### Optionen

```
  -h, --help   help for repo
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
* [helm repo add](/helm/helm_repo_add.md)	 - Fügt ein Chart Repository hinzu
* [helm repo index](/helm/helm_repo_index.md)	 - Erstellt eine Indexdatei für ein Verzeichnis mit gepackten Charts
* [helm repo list](/helm/helm_repo_list.md)	 - Listet Chart Repositories auf
* [helm repo remove](/helm/helm_repo_remove.md)	 - Entfernt ein oder mehrere Chart Repositories
* [helm repo update](/helm/helm_repo_update.md)	 - Aktualisiert lokal die Informationen über verfügbare Charts aus den Chart Repositories

###### Automatisch generiert von spf13/cobra am 14-Jan-2026
