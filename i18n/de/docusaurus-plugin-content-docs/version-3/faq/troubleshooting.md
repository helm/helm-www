---
title: "Fehlersuche"
sidebar_position: 4
---

## Fehlersuche

### Ich bekomme eine Warnung "Unable to get an update from the "stable" chart repository"

Starten Sie `helm repo list`. Wenn Ihr `stable` Repository zu `storage.googleapis.com` zeigt,
benötigen Sie eine Aktualisierung. Am 13.11.2020 wurde das Helm Chart Verzeichnis
[unsupported](https://github.com/helm/charts#deprecation-timeline), nachdem es ein Jahr lang
als veraltet gekennzeichnet wurde. Ein Archiv ist verfügbar auf
`https://charts.helm.sh/stable`, aber es bekommt keine Aktualisierungen mehr.

Sie können folgendes tun, um Ihr Repository zu reparieren:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Dasselbe gilt für das `incubator` Repository, dessen Archiv verfügbar ist bei
https://charts.helm.sh/incubator.
Zur Reparatur können Sie folgendes Kommando verwenden:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Ich bekomme die Warnung 'WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.'

Das alte Google Helm Chart Repository wurde ersetzt durch ein neues.

Starten Sie folgendes Kommando, um das dauerhaft zu beheben:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Wenn Sie einen ähnlichen Fehler für `incubator` bekommen, machen Sie folgendes:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Wenn ich ein Helm Repo hinzufüge, bekomme ich den Fehler 'Error: Repo "https://kubernetes-charts.storage.googleapis.com" is no longer available'

Das Helm Chart Repository wird nach [einem Jahr Abschaltperiode](https://github.com/helm/charts#deprecation-timeline)
nicht mehr unterstützt.
Archive für diese Verzeichnisse sind verfügbar unter `https://charts.helm.sh/stable`
und `https://charts.helm.sh/incubator`, aber es werden keine Aktualisierungen mehr
hinzugefügt. Das Kommando `helm repo add` wird das Hinzufügen der alten URLs nicht
erlauben, ausser man verwendet die Option `--use-deprecated-repos`.

### Auf GKE (Google Container Engine) bekomme ich "No SSH tunnels currently open"

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

Eine andere Variante des Fehler ist:

```
Unable to connect to the server: x509: certificate signed by unknown authority
```

Das Problem ist, dass Ihre lokale Kubernetes Konfigurationsdatei die richtigen
Anmeldeinformationen beinhalten muss.

Wenn Sie in GKE einen Cluster erstellen, werden Sie die Anmeldeinformation incl.
SSL Zertifikate bekommen. Diese müssen in einer Kubernetes Konfigurationsdatei
gespeichert werden (Default: `~/.kube/config`), sodass `kubectl` und `helm`
darauf zugreifen können.

### Nach der Migration von Helm 2 zeigt `helm list` nur sehr wenige oder gar keine Versionen an

Es scheint so, dass Sie einige Fakten übersehen haben, dass Helm 3
nur Versionen im Skope des Cluster Namespaces anzeigt. Das heisst, dass
Sie an allen Kommandos, die eine Version betreffen, diese Optionen
hinzufügen müssen:

* im derzeitigen Namespace mit aktivem Kontext bleiben (wie beschrieben im
  Kommando `kubectl config view --minify`),
* den richtigen Namespace angeben mit der Option `--namespace`/`-n` oder
* für das `helm list` Kommando die Option `--all-namespaces`/`-A` angeben

Dies wird zu allen Kommandos wie `helm ls`, `helm uninstall` und allen anderen
`helm` Befehlen referenziert zu einer Version hinzugefügt.

### In macOS kann man auf die Dateie `/etc/.mdns_debug` zugreifen. Warum?

Wir wissen davon, dass Helm auf macOS versucht, auf eine Datei namens
`/etc/.mdns_debug` zuzugreifen. Wenn die Datei existiert, hält Helm
ein Dateihandle offen, während es ausgeführt wird.

Das wird durch die macOS MDNS Bibliothek verursacht. Es erwartet, dass die
Datei zur Fehlersuche geladen wird (wenn verfügbar). Das Dateihandle sollte
nicht offen gehalten werden und der Fehler wurde bei Apple gemeldet.
Der Fehler liegt an macOS und nicht Helm.

Wenn Sie nicht möchten, dass Helm die Datei lädt, könnten Sie Helm selber
übersetzen als statische Bibliothek, dass das Hostnetzwerk nicht benutzt.
Wenn Sie das tun, wird sich die Dateigrösse von Helm stark vergrössern, aber
Sie sind das Problem los.

Der Fehler war ursächlich als Sicherheitsproblem gemeldet. Aber es hat sich
mittlerweile herausgestellt, dass es kein Problem darstellt.

### helm repo add schlägt fehl, wenn es schon mal benutzt war

In Helm 3.3.1 und davor gab das Kommando `helm repo add <reponame> <url>`
keine Ausgabe, wenn Sie versucht haben, dass Verzeichnis hinzuzufügen,
wenn es schon vorhanden war. Die Option
`--no-update` würde eine Fehlermeldung ausgeben, wenn das Verzeichnis
schon registriert war.

In Helm 3.3.2 und davor gibt es beim Versuch das Verzeichnis hinzuzufügen einen
Fehler:

`Error: repository name (reponame) already exists, please specify a different name`

Das Standardverhalten ist jetzt umgekehrt. `--no-update` wird jetzt ignoriert,
wenn Sie ein existierendes Verzeichnis ersetzen (überschreiben) wollen.
Sie können die Option `--force-update` verwenden.

Das ist wegen einer unterbrochenden Änerung für ein Sicherheitsupdate wie
erklärt ist in [Helm 3.3.2 release notes](https://github.com/helm/helm/releases/tag/v3.3.2).

### Kubernetes Programmprotokoll aktivieren

Die Ausgabe von Protokollmeldungen zur Fehlersuche können durch die
[klog](https://pkg.go.dev/k8s.io/klog) Option aktiviert werden.
Verwenden Sie die Option `-v` zur Stärke der Ausgabe.

Zum Beispiel:

```
helm list -v 6
```
