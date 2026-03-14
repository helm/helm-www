---
title: helm
slug: helm
---

Der Helm-Paketmanager für Kubernetes.

### Zusammenfassung

Der Kubernetes-Paketmanager

Häufige Aktionen für Helm:

- helm search:    Suche nach Charts
- helm pull:      Ein Chart in Ihr lokales Verzeichnis herunterladen, um es anzuzeigen
- helm install:   Das Chart nach Kubernetes hochladen
- helm list:      Releases von Charts auflisten

Umgebungsvariablen:

| Name                               | Beschreibung                                                                                               |
|------------------------------------|------------------------------------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | Alternativen Speicherort für zwischengespeicherte Dateien festlegen.                                       |
| $HELM_CONFIG_HOME                  | Alternativen Speicherort für die Helm-Konfiguration festlegen.                                             |
| $HELM_DATA_HOME                    | Alternativen Speicherort für Helm-Daten festlegen.                                                         |
| $HELM_DEBUG                        | Gibt an, ob Helm im Debug-Modus ausgeführt wird.                                                           |
| $HELM_DRIVER                       | Backend-Speichertreiber festlegen. Mögliche Werte: configmap, secret, memory, sql.                         |
| $HELM_DRIVER_SQL_CONNECTION_STRING | Verbindungszeichenfolge für den SQL-Speichertreiber festlegen.                                             |
| $HELM_MAX_HISTORY                  | Maximale Anzahl der Helm-Release-Historie festlegen.                                                       |
| $HELM_NAMESPACE                    | Namespace für Helm-Operationen festlegen.                                                                  |
| $HELM_NO_PLUGINS                   | Plugins deaktivieren. Setzen Sie HELM_NO_PLUGINS=1, um Plugins zu deaktivieren.                            |
| $HELM_PLUGINS                      | Pfad zum Plugins-Verzeichnis festlegen.                                                                    |
| $HELM_REGISTRY_CONFIG              | Pfad zur Registry-Konfigurationsdatei festlegen.                                                           |
| $HELM_REPOSITORY_CACHE             | Pfad zum Repository-Cache-Verzeichnis festlegen.                                                           |
| $HELM_REPOSITORY_CONFIG            | Pfad zur Repositories-Datei festlegen.                                                                     |
| $KUBECONFIG                        | Alternative Kubernetes-Konfigurationsdatei festlegen (Standard: "~/.kube/config")                          |
| $HELM_KUBEAPISERVER                | Kubernetes-API-Server-Endpunkt für die Authentifizierung festlegen.                                        |
| $HELM_KUBECAFILE                   | Kubernetes-Zertifizierungsstellen-Datei festlegen.                                                         |
| $HELM_KUBEASGROUPS                 | Gruppen für die Identitätsannahme festlegen (kommagetrennte Liste).                                        |
| $HELM_KUBEASUSER                   | Benutzername für die Identitätsannahme bei der Operation festlegen.                                        |
| $HELM_KUBECONTEXT                  | Name des kubeconfig-Kontexts festlegen.                                                                    |
| $HELM_KUBETOKEN                    | Bearer-KubeToken für die Authentifizierung festlegen.                                                      |
| $HELM_KUBEINSECURE_SKIP_TLS_VERIFY | Gibt an, ob die Zertifikatsvalidierung des Kubernetes-API-Servers übersprungen werden soll (unsicher).     |
| $HELM_KUBETLS_SERVER_NAME          | Servernamen zur Validierung des Kubernetes-API-Server-Zertifikats festlegen.                               |
| $HELM_BURST_LIMIT                  | Standard-Burst-Limit festlegen, falls der Server viele CRDs enthält (Standard: 100, -1 zum Deaktivieren).  |
| $HELM_QPS                          | Abfragen pro Sekunde festlegen, wenn eine hohe Anzahl von Aufrufen höhere Burst-Werte erfordert.           |

Helm speichert Cache, Konfiguration und Daten in folgender Konfigurationsreihenfolge:

- Falls eine HELM_*_HOME-Umgebungsvariable gesetzt ist, wird diese verwendet
- Andernfalls werden auf Systemen, die die XDG-Base-Directory-Spezifikation unterstützen, die XDG-Variablen verwendet
- Wenn kein anderer Speicherort festgelegt ist, wird ein Standardspeicherort basierend auf dem Betriebssystem verwendet

Standardmäßig hängen die Standardverzeichnisse vom Betriebssystem ab. Die Standardwerte sind unten aufgeführt:

| Betriebssystem   | Cache-Pfad                | Konfigurations-Pfad            | Daten-Pfad              |
|------------------|---------------------------|--------------------------------|-------------------------|
| Linux            | $HOME/.cache/helm         | $HOME/.config/helm             | $HOME/.local/share/helm |
| macOS            | $HOME/Library/Caches/helm | $HOME/Library/Preferences/helm | $HOME/Library/helm      |
| Windows          | %TEMP%\helm               | %APPDATA%\helm                 | %APPDATA%\helm          |


### Optionen

```
      --burst-limit int                 client-side default throttling limit (default 100)
      --debug                           enable verbose output
  -h, --help                            help for helm
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

* [helm completion](/helm/helm_completion.md)	 - Generiert Autovervollständigungsskripte für die angegebene Shell
* [helm create](/helm/helm_create.md)	 - Erstellt ein neues Chart mit dem angegebenen Namen
* [helm dependency](/helm/helm_dependency.md)	 - Verwaltet die Abhängigkeiten eines Charts
* [helm env](/helm/helm_env.md)	 - Informationen zur Helm-Client-Umgebung
* [helm get](/helm/helm_get.md)	 - Lädt erweiterte Informationen für ein benanntes Release herunter
* [helm history](/helm/helm_history.md)	 - Ruft die Release-Historie ab
* [helm install](/helm/helm_install.md)	 - Installiert ein Chart
* [helm lint](/helm/helm_lint.md)	 - Untersucht ein Chart auf mögliche Probleme
* [helm list](/helm/helm_list.md)	 - Listet Releases auf
* [helm package](/helm/helm_package.md)	 - Packt ein Chart-Verzeichnis in ein Chart-Archiv
* [helm plugin](/helm/helm_plugin.md)	 - Installiert, listet oder deinstalliert Helm-Plugins
* [helm pull](/helm/helm_pull.md)	 - Lädt ein Chart aus einem Repository herunter und entpackt es optional im lokalen Verzeichnis
* [helm push](/helm/helm_push.md)	 - Pusht ein Chart zu einem Remote-Repository
* [helm registry](/helm/helm_registry.md)	 - An- oder Abmeldung bei einer Registry
* [helm repo](/helm/helm_repo.md)	 - Hinzufügen, Auflisten, Entfernen, Aktualisieren und Indizieren von Chart-Repositories
* [helm rollback](/helm/helm_rollback.md)	 - Setzt ein Release auf eine frühere Revision zurück
* [helm search](/helm/helm_search.md)	 - Durchsucht Charts nach einem Suchbegriff
* [helm show](/helm/helm_show.md)	 - Zeigt Informationen eines Charts an
* [helm status](/helm/helm_status.md)	 - Zeigt den Status des benannten Releases an
* [helm template](/helm/helm_template.md)	 - Rendert Templates lokal
* [helm test](/helm/helm_test.md)	 - Führt Tests für ein Release aus
* [helm uninstall](/helm/helm_uninstall.md)	 - Deinstalliert ein Release
* [helm upgrade](/helm/helm_upgrade.md)	 - Aktualisiert ein Release
* [helm verify](/helm/helm_verify.md)	 - Überprüft, ob ein Chart am angegebenen Pfad signiert und gültig ist
* [helm version](/helm/helm_version.md)	 - Gibt die Client-Versionsinformationen aus

###### Automatisch generiert von spf13/cobra am 14-Jan-2026
