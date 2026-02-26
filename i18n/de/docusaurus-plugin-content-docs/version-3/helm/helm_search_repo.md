---
title: helm search repo
---

Durchsucht Repositories nach Charts anhand eines Suchbegriffs

### Zusammenfassung

Dieser Befehl durchsucht alle auf dem System konfigurierten Repositories und sucht nach Übereinstimmungen. Die Suche verwendet die auf dem System gespeicherten Metadaten.

Standardmäßig werden die neuesten stabilen Versionen der gefundenen Charts angezeigt. Mit dem Flag --devel enthält die Ausgabe auch Vorabversionen. Um mit einer Versionsbeschränkung zu suchen, verwenden Sie --version.

Beispiele:

    # Stabile Versionen mit Suchbegriff "nginx" suchen
    $ helm search repo nginx

    # Versionen mit Suchbegriff "nginx" suchen, einschließlich Vorabversionen
    $ helm search repo nginx --devel

    # Neuestes stabiles Release für nginx-ingress mit Hauptversion 1 suchen
    $ helm search repo nginx-ingress --version ^1.0.0

Repositories werden mit 'helm repo'-Befehlen verwaltet.


```
helm search repo [keyword] [flags]
```

### Optionen

```
      --devel                use development versions (alpha, beta, and release candidate releases), too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored
      --fail-on-no-result    search fails if no results are found
  -h, --help                 help for repo
      --max-col-width uint   maximum column width for output table (default 50)
  -o, --output format        prints the output in the specified format. Allowed values: table, json, yaml (default table)
  -r, --regexp               use regular expressions for searching repositories you have added
      --version string       search using semantic versioning constraints on repositories you have added
  -l, --versions             show the long listing, with each version of each chart on its own line, for repositories you have added
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

* [helm search](/helm/helm_search.md)	 - Durchsucht Charts nach einem Suchbegriff

###### Automatisch generiert von spf13/cobra am 14-Jan-2026
