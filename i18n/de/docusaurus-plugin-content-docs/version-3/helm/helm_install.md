---
title: helm install
---

Installiert ein Chart

### Zusammenfassung

Dieser Befehl installiert ein Chart-Archiv.

Als Argument für die Installation können Sie angeben: eine Chart-Referenz, einen Pfad zu einem gepackten Chart, einen Pfad zu einem entpackten Chart-Verzeichnis oder eine URL.

Zum Überschreiben von Werten in einem Chart verwenden Sie das '--values'-Flag mit einer Datei oder das '--set'-Flag für Konfiguration über die Befehlszeile. Um String-Werte zu erzwingen, verwenden Sie '--set-string'. Mit '--set-file' können Sie einzelne Werte aus einer Datei setzen, wenn der Wert zu lang für die Befehlszeile ist oder dynamisch generiert wird. Mit '--set-json' können Sie JSON-Werte (Skalare/Objekte/Arrays) über die Befehlszeile setzen.

    $ helm install -f myvalues.yaml myredis ./redis

oder

    $ helm install --set name=prod myredis ./redis

oder

    $ helm install --set-string long_int=1234567890 myredis ./redis

oder

    $ helm install --set-file my_script=dothings.sh myredis ./redis

oder

    $ helm install --set-json 'master.sidecars=[{"name":"sidecar","image":"myImage","imagePullPolicy":"Always","ports":[{"name":"portname","containerPort":1234}]}]' myredis ./redis


Das '--values'/'-f'-Flag kann mehrfach angegeben werden. Dabei hat die zuletzt angegebene Datei (ganz rechts) Vorrang. Wenn beispielsweise sowohl myvalues.yaml als auch override.yaml einen Schlüssel namens 'Test' enthalten, hat der in override.yaml gesetzte Wert Vorrang:

    $ helm install -f myvalues.yaml -f override.yaml  myredis ./redis

Das '--set'-Flag kann ebenfalls mehrfach angegeben werden. Dabei hat der zuletzt angegebene Wert (ganz rechts) Vorrang. Wenn beispielsweise sowohl 'bar' als auch 'newbar' als Werte für einen Schlüssel namens 'foo' gesetzt werden, hat der Wert 'newbar' Vorrang:

    $ helm install --set foo=bar --set foo=newbar  myredis ./redis

Im folgenden Beispiel wird 'foo' entsprechend auf '["four"]' gesetzt:

    $ helm install --set-json='foo=["one", "two", "three"]' --set-json='foo=["four"]' myredis ./redis

Und im folgenden Beispiel wird 'foo' auf '{"key1":"value1","key2":"bar"}' gesetzt:

    $ helm install --set-json='foo={"key1":"value1","key2":"value2"}' --set-json='foo.key2="bar"' myredis ./redis

Um die generierten Manifeste eines Releases zu prüfen, ohne das Chart zu installieren, können die Flags --debug und --dry-run kombiniert werden.

Das --dry-run-Flag zeigt alle generierten Chart-Manifeste an – auch Secrets mit möglicherweise sensiblen Werten. Um Kubernetes Secrets auszublenden, verwenden Sie das --hide-secret-Flag. Bitte bedenken Sie sorgfältig, wie und wann diese Flags verwendet werden.

Wenn --verify gesetzt ist, MUSS das Chart eine Provenance-Datei haben, und die Provenance-Datei MUSS alle Verifizierungsschritte bestehen.

Es gibt sechs verschiedene Möglichkeiten, das zu installierende Chart anzugeben:

1. Per Chart-Referenz: helm install mymaria example/mariadb
2. Per Pfad zu einem gepackten Chart: helm install mynginx ./nginx-1.2.3.tgz
3. Per Pfad zu einem entpackten Chart-Verzeichnis: helm install mynginx ./nginx
4. Per absolute URL: helm install mynginx https://example.com/charts/nginx-1.2.3.tgz
5. Per Chart-Referenz und Repository-URL: helm install --repo https://example.com/charts/ mynginx nginx
6. Per OCI-Registry: helm install mynginx --version 1.2.3 oci://example.com/charts/nginx

CHART-REFERENZEN

Eine Chart-Referenz ist eine praktische Methode, um auf ein Chart in einem Chart-Repository zu verweisen.

Wenn Sie eine Chart-Referenz mit einem Repository-Präfix verwenden ('beispiel/mariadb'), sucht Helm in der lokalen Konfiguration nach einem Chart-Repository namens 'beispiel' und dann nach einem Chart mit dem Namen 'mariadb' in diesem Repository. Es wird die neueste stabile Version dieses Charts installiert, sofern Sie nicht das '--devel'-Flag setzen, um auch Entwicklungsversionen (Alpha-, Beta- und Release-Candidate-Versionen) einzubeziehen, oder eine Versionsnummer mit dem '--version'-Flag angeben.

Um die Liste der Chart-Repositories anzuzeigen, verwenden Sie 'helm repo list'. Um nach Charts in einem Repository zu suchen, verwenden Sie 'helm search'.


```
helm install [NAME] [CHART] [flags]
```

### Optionen

```
      --atomic                                     if set, the installation process deletes the installation on failure. The --wait flag will be set automatically if --atomic is used
      --ca-file string                             verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string                           identify HTTPS client using this SSL certificate file
      --create-namespace                           create the release namespace if not present
      --dependency-update                          update dependencies if they are missing before installing the chart
      --description string                         add a custom description
      --devel                                      use development versions, too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored
      --disable-openapi-validation                 if set, the installation process will not validate rendered templates against the Kubernetes OpenAPI Schema
      --dry-run string[="client"]                  simulate an install. If --dry-run is set with no option being specified or as '--dry-run=client', it will not attempt cluster connections. Setting '--dry-run=server' allows attempting cluster connections.
      --enable-dns                                 enable DNS lookups when rendering templates
      --force                                      force resource updates through a replacement strategy
  -g, --generate-name                              generate the name (and omit the NAME parameter)
  -h, --help                                       help for install
      --hide-notes                                 if set, do not show notes in install output. Does not affect presence in chart metadata
      --hide-secret                                hide Kubernetes Secrets when also using the --dry-run flag
      --insecure-skip-tls-verify                   skip tls certificate checks for the chart download
      --key-file string                            identify HTTPS client using this SSL key file
      --keyring string                             location of public keys used for verification (default "~/.gnupg/pubring.gpg")
  -l, --labels stringToString                      Labels that would be added to release metadata. Should be divided by comma. (default [])
      --name-template string                       specify template used to name the release
      --no-hooks                                   prevent hooks from running during install
  -o, --output format                              prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --pass-credentials                           pass credentials to all domains
      --password string                            chart repository password where to locate the requested chart
      --plain-http                                 use insecure HTTP connections for the chart download
      --post-renderer postRendererString           the path to an executable to be used for post rendering. If it exists in $PATH, the binary will be used, otherwise it will try to look for the executable at the given path
      --post-renderer-args postRendererArgsSlice   an argument to the post-renderer (can specify multiple) (default [])
      --render-subchart-notes                      if set, render subchart notes along with the parent
      --replace                                    re-use the given name, only if that name is a deleted release which remains in the history. This is unsafe in production
      --repo string                                chart repository url where to locate the requested chart
      --set stringArray                            set values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --set-file stringArray                       set values from respective files specified via the command line (can specify multiple or separate values with commas: key1=path1,key2=path2)
      --set-json stringArray                       set JSON values on the command line (can specify multiple or separate values with commas: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    set a literal STRING value on the command line
      --set-string stringArray                     set STRING values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --skip-crds                                  if set, no CRDs will be installed. By default, CRDs are installed if not already present
      --skip-schema-validation                     if set, disables JSON schema validation
      --take-ownership                             if set, install will ignore the check for helm annotations and take ownership of the existing resources
      --timeout duration                           time to wait for any individual Kubernetes operation (like Jobs for hooks) (default 5m0s)
      --username string                            chart repository username where to locate the requested chart
  -f, --values strings                             specify values in a YAML file or a URL (can specify multiple)
      --verify                                     verify the package before using it
      --version string                             specify a version constraint for the chart version to use. This constraint can be a specific tag (e.g. 1.1.1) or it may reference a valid range (e.g. ^2.0.0). If this is not specified, the latest version is used
      --wait                                       if set, will wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful. It will wait for as long as --timeout
      --wait-for-jobs                              if set and --wait enabled, will wait until all Jobs have been completed before marking the release as successful. It will wait for as long as --timeout
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
