---
title: helm create
---

Erstellt ein neues Chart mit dem angegebenen Namen

### Zusammenfassung

Dieser Befehl erstellt ein Chart-Verzeichnis mit den üblichen Dateien und Verzeichnissen, die in einem Chart verwendet werden.

Beispielsweise erstellt 'helm create foo' eine Verzeichnisstruktur, die in etwa so aussieht:

    foo/
    ├── .helmignore   # Enthält Muster für Dateien, die beim Packen von Helm-Charts ignoriert werden sollen.
    ├── Chart.yaml    # Informationen über Ihr Chart
    ├── values.yaml   # Die Standardwerte für Ihre Templates
    ├── charts/       # Charts, von denen dieses Chart abhängt
    └── templates/    # Die Template-Dateien
        └── tests/    # Die Testdateien

'helm create' erwartet einen Pfad als Argument. Falls Verzeichnisse im angegebenen Pfad nicht existieren, versucht Helm diese während der Ausführung anzulegen. Wenn das angegebene Zielverzeichnis existiert und Dateien enthält, werden kollidierende Dateien überschrieben, andere Dateien bleiben jedoch unverändert.


```
helm create NAME [flags]
```

### Optionen

```
  -h, --help             Hilfe für create
  -p, --starter string   Name oder absoluter Pfad zu einer Helm-Starter-Vorlage
```

### Optionen von übergeordneten Befehlen

```
      --burst-limit int                 Client-seitiges Standard-Throttling-Limit (Standard: 100)
      --debug                           Ausführliche Ausgabe aktivieren
      --kube-apiserver string           Adresse und Port des Kubernetes-API-Servers
      --kube-as-group stringArray       Gruppe, die für die Operation imitiert werden soll. Dieses Flag kann wiederholt werden, um mehrere Gruppen anzugeben.
      --kube-as-user string             Benutzername, der für die Operation imitiert werden soll
      --kube-ca-file string             Zertifizierungsstellen-Datei für die Kubernetes-API-Server-Verbindung
      --kube-context string             Name des kubeconfig-Kontexts, der verwendet werden soll
      --kube-insecure-skip-tls-verify   Falls true, wird das Zertifikat des Kubernetes-API-Servers nicht auf Gültigkeit geprüft. Dadurch werden Ihre HTTPS-Verbindungen unsicher.
      --kube-tls-server-name string     Servername für die Zertifikatsvalidierung des Kubernetes-API-Servers. Falls nicht angegeben, wird der Hostname verwendet, mit dem der Server kontaktiert wird.
      --kube-token string               Bearer-Token für die Authentifizierung
      --kubeconfig string               Pfad zur kubeconfig-Datei
  -n, --namespace string                Namespace-Geltungsbereich für diese Anfrage
      --qps float32                     Abfragen pro Sekunde bei der Kommunikation mit der Kubernetes-API (ohne Bursting)
      --registry-config string          Pfad zur Registry-Konfigurationsdatei (Standard: "~/.config/helm/registry/config.json")
      --repository-cache string         Pfad zum Verzeichnis mit zwischengespeicherten Repository-Indizes (Standard: "~/.cache/helm/repository")
      --repository-config string        Pfad zur Datei mit Repository-Namen und URLs (Standard: "~/.config/helm/repositories.yaml")
```

### SIEHE AUCH

* [helm](/helm/helm.md)	 - Der Helm-Paketmanager für Kubernetes.

###### Automatisch generiert von spf13/cobra am 14-Jan-2026
