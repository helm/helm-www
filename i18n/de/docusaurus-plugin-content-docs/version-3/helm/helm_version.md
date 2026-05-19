---
title: helm version
---

Gibt die Client-Versionsinformationen aus

### Zusammenfassung

Zeigt die Version von Helm an.

Dieser Befehl gibt die Helm-Versionsinformationen aus.
Die Ausgabe sieht etwa so aus:

version.BuildInfo{Version:"v3.2.1", GitCommit:"fe51cd1e31e6a202cba7dead9552a6d418ded79a", GitTreeState:"clean", GoVersion:"go1.13.10"}

- Version ist die semantische Version des Releases.
- GitCommit ist der SHA des Commits, aus dem diese Version erstellt wurde.
- GitTreeState ist "clean", wenn beim Erstellen dieser Binary keine lokalen Code-Änderungen vorhanden waren, und "dirty", wenn die Binary aus lokal modifiziertem Code erstellt wurde.
- GoVersion ist die Go-Version, mit der Helm kompiliert wurde.

Bei Verwendung des Flags --template stehen folgende Eigenschaften für das Template zur Verfügung:

- .Version enthält die semantische Version von Helm
- .GitCommit ist der Git-Commit
- .GitTreeState ist der Zustand des Git-Baums beim Erstellen von Helm
- .GoVersion enthält die Go-Version, mit der Helm kompiliert wurde

Beispiel: --template='Version: {{.Version}}' gibt 'Version: v3.2.1' aus.


```
helm version [flags]
```

### Optionen

```
  -h, --help              help for version
      --short             print the version number
      --template string   template for version string format
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
