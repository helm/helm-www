---
title: helm completion bash
---

Generiert das Autovervollständigungsskript für bash

### Zusammenfassung

Generiert das Helm-Autovervollständigungsskript für die bash-Shell.

Um die Vervollständigungen in Ihrer aktuellen Shell-Sitzung zu laden:

    source <(helm completion bash)

Um die Vervollständigungen für jede neue Sitzung zu laden, führen Sie einmalig aus:
- Linux:

      helm completion bash > /etc/bash_completion.d/helm

- MacOS:

      helm completion bash > /usr/local/etc/bash_completion.d/helm


```
helm completion bash [flags]
```

### Optionen

```
  -h, --help              Hilfe für bash
      --no-descriptions   Vervollständigungsbeschreibungen deaktivieren
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

* [helm completion](/helm/helm_completion.md)	 - Generiert Autovervollständigungsskripte für die angegebene Shell

###### Automatisch generiert von spf13/cobra am 14-Jan-2026
