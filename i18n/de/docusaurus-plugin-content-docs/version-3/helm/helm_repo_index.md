---
title: helm repo index
---

Erstellt eine Indexdatei aus einem Verzeichnis mit gepackten Charts

### Zusammenfassung

Liest das aktuelle Verzeichnis und erstellt basierend auf den gefundenen Charts eine Indexdatei.
Das Ergebnis wird in 'index.yaml' im aktuellen Verzeichnis geschrieben.

Dieses Werkzeug wird verwendet, um eine 'index.yaml'-Datei für ein Chart Repository zu erstellen.
Um eine absolute URL für die Charts festzulegen, verwenden Sie das Flag '--url'.

Um den generierten Index mit einer bestehenden Indexdatei zusammenzuführen, verwenden Sie das
Flag '--merge'. In diesem Fall werden die Charts aus dem aktuellen Verzeichnis mit dem
übergebenen Index zusammengeführt, wobei lokale Charts Vorrang vor bestehenden Charts haben.


```
helm repo index [DIR] [flags]
```

### Optionen

```
  -h, --help           help for index
      --json           output in JSON format
      --merge string   merge the generated index into the given index
      --url string     url of chart repository
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

* [helm repo](/helm/helm_repo.md)	 - Chart Repositories hinzufügen, auflisten, entfernen, aktualisieren und indizieren

###### Automatisch generiert von spf13/cobra am 14-Jan-2026
