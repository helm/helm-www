---
title: helm list
---

Listet Releases auf

### Zusammenfassung

Dieser Befehl listet alle Releases für einen angegebenen Namespace auf. Wird kein Namespace angegeben, wird der aktuelle Namespace-Kontext verwendet.

Standardmäßig werden nur Releases aufgelistet, die deployed oder fehlgeschlagen sind. Flags wie '--uninstalled' und '--all' ändern dieses Verhalten. Diese Flags lassen sich kombinieren: '--uninstalled --failed'.

Standardmäßig werden Elemente alphabetisch sortiert. Verwenden Sie das Flag '-d', um nach Release-Datum zu sortieren.

Wenn das Flag --filter angegeben wird, dient es als Filter. Filter sind reguläre Ausdrücke (Perl-kompatibel), die auf die Liste der Releases angewendet werden. Nur Elemente, die dem Filter entsprechen, werden zurückgegeben.

    $ helm list --filter 'ara[a-z]+'
    NAME                UPDATED                                  CHART
    maudlin-arachnid    2020-06-18 14:17:46.125134977 +0000 UTC  alpine-0.1.0

Wenn keine Ergebnisse gefunden werden, beendet sich 'helm list' mit Exit-Code 0, jedoch ohne Ausgabe (bzw. nur mit Kopfzeilen, wenn das Flag '-q' nicht gesetzt ist).

Standardmäßig können bis zu 256 Elemente zurückgegeben werden. Verwenden Sie das Flag '--max', um dies zu begrenzen. Das Setzen von '--max' auf 0 gibt nicht alle Ergebnisse zurück, sondern den Standardwert des Servers, der möglicherweise viel höher als 256 ist. In Kombination mit dem Flag '--offset' können Sie durch die Ergebnisse blättern.


```
helm list [flags]
```

### Optionen

```
  -a, --all                  show all releases without any filter applied
  -A, --all-namespaces       list releases across all namespaces
  -d, --date                 sort by release date
      --deployed             show deployed releases. If no other is specified, this will be automatically enabled
      --failed               show failed releases
  -f, --filter string        a regular expression (Perl compatible). Any releases that match the expression will be included in the results
  -h, --help                 help for list
  -m, --max int              maximum number of releases to fetch (default 256)
      --no-headers           don't print headers when using the default output format
      --offset int           next release index in the list, used to offset from start value
  -o, --output format        prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --pending              show pending releases
  -r, --reverse              reverse the sort order
  -l, --selector string      Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2). Works only for secret(default) and configmap storage backends.
  -q, --short                output short (quiet) listing format
      --superseded           show superseded releases
      --time-format string   format time using golang time formatter. Example: --time-format "2006-01-02 15:04:05Z0700"
      --uninstalled          show uninstalled releases (if 'helm uninstall --keep-history' was used)
      --uninstalling         show releases that are currently being uninstalled
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
