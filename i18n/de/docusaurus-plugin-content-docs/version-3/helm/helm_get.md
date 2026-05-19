---
title: helm get
---

Lädt erweiterte Informationen für ein benanntes Release herunter

### Zusammenfassung

Dieser Befehl besteht aus mehreren Unterbefehlen, um erweiterte
Informationen über ein Release abzurufen, darunter:

- Die zur Generierung des Releases verwendeten Values
- Die generierte Manifest-Datei
- Die vom Chart bereitgestellten Notizen zum Release
- Die mit dem Release verbundenen Hooks
- Die Metadaten des Releases


### Optionen

```
  -h, --help   help for get
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
* [helm get all](/helm/helm_get_all.md)	 - Lädt alle Informationen für ein benanntes Release herunter
* [helm get hooks](/helm/helm_get_hooks.md)	 - Lädt alle Hooks für ein benanntes Release herunter
* [helm get manifest](/helm/helm_get_manifest.md)	 - Lädt das Manifest für ein benanntes Release herunter
* [helm get metadata](/helm/helm_get_metadata.md)	 - Ruft Metadaten für ein bestimmtes Release ab
* [helm get notes](/helm/helm_get_notes.md)	 - Lädt die Notizen für ein benanntes Release herunter
* [helm get values](/helm/helm_get_values.md)	 - Lädt die Values-Datei für ein benanntes Release herunter

###### Automatisch generiert von spf13/cobra am 14-Jan-2026
