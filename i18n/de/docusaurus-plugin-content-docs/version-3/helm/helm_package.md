---
title: helm package
---

Ein Chart-Verzeichnis in ein Chart-Archiv paketieren

### Zusammenfassung

Dieser Befehl paketiert ein Chart in ein versioniertes Chart-Archiv. Bei Angabe eines Pfads wird dort nach einem Chart gesucht (das eine Chart.yaml-Datei enthalten muss), und dieses Verzeichnis wird dann paketiert.

Versionierte Chart-Archive werden von Helm-Repositorys verwendet.

Um ein Chart zu signieren, verwenden Sie das Flag '--sign'. In den meisten Fällen sollten Sie auch '--keyring path/to/secret/keys' und '--key keyname' angeben.

  $ helm package --sign ./mychart --key mykey --keyring ~/.gnupg/secring.gpg

Wenn '--keyring' nicht angegeben wird, verwendet Helm standardmäßig den öffentlichen Schlüsselbund, es sei denn, Ihre Umgebung ist anders konfiguriert.


```
helm package [CHART_PATH] [...] [flags]
```

### Optionen

```
      --app-version string         set the appVersion on the chart to this version
      --ca-file string             verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string           identify HTTPS client using this SSL certificate file
  -u, --dependency-update          update dependencies from "Chart.yaml" to dir "charts/" before packaging
  -d, --destination string         location to write the chart. (default ".")
      -h, --help                       help for package
      --insecure-skip-tls-verify   skip tls certificate checks for the chart download
      --key string                 name of the key to use when signing. Used if --sign is true
      --key-file string            identify HTTPS client using this SSL key file
      --keyring string             location of a public keyring (default "~/.gnupg/pubring.gpg")
      --passphrase-file string     location of a file which contains the passphrase for the signing key. Use "-" in order to read from stdin.
      --password string            chart repository password where to locate the requested chart
      --plain-http                 use insecure HTTP connections for the chart download
      --sign                       use a PGP private key to sign this package
      --username string            chart repository username where to locate the requested chart
      --version string             set the version on the chart to this semver version
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
