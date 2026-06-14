---
title: helm lint
---

Untersucht ein Chart auf mögliche Probleme

### Zusammenfassung

Dieser Befehl erwartet einen Pfad zu einem Chart und führt eine Reihe von Tests durch, um zu überprüfen, ob das Chart korrekt aufgebaut ist.

Wenn der Linter Probleme findet, die die Installation des Charts zum Scheitern bringen würden, gibt er [ERROR]-Meldungen aus. Wenn er auf Probleme stößt, die gegen Konventionen oder Empfehlungen verstoßen, gibt er [WARNING]-Meldungen aus.


```
helm lint PATH [flags]
```

### Optionen

```
  -h, --help                      help for lint
      --kube-version string       Kubernetes version used for capabilities and deprecation checks
      --quiet                     print only warnings and errors
      --set stringArray           set values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --set-file stringArray      set values from respective files specified via the command line (can specify multiple or separate values with commas: key1=path1,key2=path2)
      --set-json stringArray      set JSON values on the command line (can specify multiple or separate values with commas: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray   set a literal STRING value on the command line
      --set-string stringArray    set STRING values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --skip-schema-validation    if set, disables JSON schema validation
      --strict                    fail on lint warnings
  -f, --values strings            specify values in a YAML file or a URL (can specify multiple)
      --with-subcharts            lint dependent charts
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
