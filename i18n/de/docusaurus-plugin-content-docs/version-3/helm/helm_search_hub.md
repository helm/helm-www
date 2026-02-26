---
title: helm search hub
---

Durchsucht den Artifact Hub oder Ihre eigene Hub-Instanz nach Charts

### Zusammenfassung


Dieser Befehl sucht nach Helm Charts im Artifact Hub oder in Ihrer eigenen Hub-Instanz.

Artifact Hub ist eine webbasierte Anwendung zum Finden, Installieren und
Veröffentlichen von Paketen und Konfigurationen für CNCF-Projekte, einschließlich
öffentlich verfügbarer Helm Charts. Es handelt sich um ein Sandbox-Projekt der
Cloud Native Computing Foundation. Sie können den Hub unter https://artifacthub.io/
durchsuchen.

Das [KEYWORD]-Argument akzeptiert entweder einen Suchbegriff oder eine in
Anführungszeichen gesetzte erweiterte Suchanfrage (Rich Query). Die Dokumentation
zu erweiterten Suchoptionen finden Sie unter
https://artifacthub.github.io/hub/api/?urls.primaryName=Monocular%20compatible%20search%20API#/Monocular/get_api_chartsvc_v1_charts_search

Frühere Versionen von Helm verwendeten eine Monocular-Instanz als Standard-
'endpoint'. Zur Abwärtskompatibilität ist Artifact Hub mit der Monocular-Such-API
kompatibel. Beim Setzen des 'endpoint'-Flags muss der angegebene Endpunkt
ebenfalls eine Monocular-kompatible Such-API bereitstellen. Beachten Sie, dass
bei Verwendung einer Monocular-Instanz als 'endpoint' erweiterte Suchanfragen
nicht unterstützt werden. API-Details finden Sie unter https://github.com/helm/monocular


```
helm search hub [KEYWORD] [flags]
```

### Optionen

```
      --endpoint string      Hub instance to query for charts (default "https://hub.helm.sh")
      --fail-on-no-result    search fails if no results are found
  -h, --help                 help for hub
      --list-repo-url        print charts repository URL
      --max-col-width uint   maximum column width for output table (default 50)
  -o, --output format        prints the output in the specified format. Allowed values: table, json, yaml (default table)
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
