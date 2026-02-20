---
title: helm status
---

Zeigt den Status eines benannten Releases an

### Zusammenfassung

Dieser Befehl zeigt den Status eines benannten Releases an.
Der Status umfasst:
- Zeitpunkt des letzten Deployments
- Kubernetes-Namespace, in dem sich das Release befindet
- Zustand des Releases (mögliche Werte: unknown, deployed, uninstalled, superseded, failed, uninstalling, pending-install, pending-upgrade oder pending-rollback)
- Revision des Releases
- Beschreibung des Releases (kann eine Abschlussmeldung oder Fehlermeldung sein, erfordert --show-desc)
- Liste der Ressourcen, aus denen dieses Release besteht (erfordert --show-resources)
- Details zum letzten Testlauf, falls zutreffend
- Zusätzliche Hinweise des Charts


```
helm status RELEASE_NAME [flags]
```

### Optionen

```
  -h, --help             help for status
  -o, --output format    prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --revision int     if set, display the status of the named release with revision
      --show-desc        if set, display the description message of the named release
      --show-resources   if set, display the resources of the named release
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
