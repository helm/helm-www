---
title: helm dependency
---

Verwaltet die Abhängigkeiten eines Charts

### Zusammenfassung

Verwaltet die Abhängigkeiten eines Charts.

Helm Charts speichern ihre Abhängigkeiten im Verzeichnis 'charts/'. Für Chart-Entwickler
ist es oft einfacher, die Abhängigkeiten in der 'Chart.yaml' zu verwalten, die alle
Abhängigkeiten deklariert.

Die Dependency-Befehle arbeiten mit dieser Datei und erleichtern die Synchronisation
zwischen den gewünschten Abhängigkeiten und den tatsächlich im Verzeichnis 'charts/'
gespeicherten Abhängigkeiten.

Beispielsweise deklariert diese Chart.yaml zwei Abhängigkeiten:

    # Chart.yaml
    dependencies:
    - name: nginx
      version: "1.2.3"
      repository: "https://example.com/charts"
    - name: memcached
      version: "3.2.1"
      repository: "https://another.example.com/charts"


Das Feld 'name' sollte den Namen eines Charts enthalten. Dieser muss mit dem Eintrag
in der 'Chart.yaml'-Datei des jeweiligen Charts übereinstimmen.

Das Feld 'version' sollte eine semantische Version oder einen Versionsbereich enthalten.

Die 'repository'-URL sollte auf ein Chart Repository verweisen. Helm erwartet, dass
durch Anhängen von '/index.yaml' an die URL der Index des Chart Repositorys abgerufen
werden kann. Hinweis: 'repository' kann ein Alias sein. Der Alias muss mit 'alias:'
oder '@' beginnen.

Ab Version 2.2.0 kann repository auch als Pfad zum Verzeichnis der lokal gespeicherten
Abhängigkeits-Charts definiert werden. Der Pfad sollte mit dem Präfix "file://" beginnen.
Zum Beispiel:

    # Chart.yaml
    dependencies:
    - name: nginx
      version: "1.2.3"
      repository: "file://../dependency_chart/nginx"

Wenn das Abhängigkeits-Chart lokal abgerufen wird, ist es nicht erforderlich, das
Repository mit "helm repo add" zu Helm hinzuzufügen. Auch der Versionsabgleich wird
in diesem Fall unterstützt.


### Optionen

```
  -h, --help   help for dependency
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
* [helm dependency build](/helm/helm_dependency_build.md)	 - Erstellt das Verzeichnis charts/ basierend auf der Chart.lock-Datei neu
* [helm dependency list](/helm/helm_dependency_list.md)	 - Listet die Abhängigkeiten für das angegebene Chart auf
* [helm dependency update](/helm/helm_dependency_update.md)	 - Aktualisiert charts/ entsprechend dem Inhalt von Chart.yaml

###### Automatisch generiert von spf13/cobra am 14-Jan-2026
