---
title: "Fehlersuche"
sidebar_position: 4
---

## Fehlersuche

### Ich bekomme eine Warnung "Unable to get an update from the "stable" chart repository"

Führen Sie `helm repo list` aus. Wenn Ihr `stable` Repository auf eine `storage.googleapis.com` URL zeigt, müssen Sie dieses Repository aktualisieren. Am 13.11.2020 wurde das Helm Charts Repository [nicht mehr unterstützt](https://github.com/helm/charts#deprecation-timeline), nachdem es ein Jahr lang als veraltet gekennzeichnet war. Ein Archiv ist verfügbar unter `https://charts.helm.sh/stable`, erhält aber keine Aktualisierungen mehr.

Mit folgendem Befehl können Sie Ihr Repository reparieren:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Dasselbe gilt für das `incubator` Repository, dessen Archiv unter https://charts.helm.sh/incubator verfügbar ist. Zur Reparatur können Sie folgenden Befehl verwenden:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Ich bekomme die Warnung 'WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.'

Das alte Google Helm Chart Repository wurde durch ein neues Helm Chart Repository ersetzt.

Führen Sie folgenden Befehl aus, um das dauerhaft zu beheben:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Wenn Sie einen ähnlichen Fehler für `incubator` bekommen, führen Sie diesen Befehl aus:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Wenn ich ein Helm Repo hinzufüge, bekomme ich den Fehler 'Error: Repo "https://kubernetes-charts.storage.googleapis.com" is no longer available'

Die Helm Chart Repositories werden nach [einer einjährigen Übergangsphase](https://github.com/helm/charts#deprecation-timeline) nicht mehr unterstützt. Archive für diese Repositories sind unter `https://charts.helm.sh/stable` und `https://charts.helm.sh/incubator` verfügbar, erhalten jedoch keine Aktualisierungen mehr. Der Befehl `helm repo add` erlaubt das Hinzufügen der alten URLs nicht, außer Sie verwenden die Option `--use-deprecated-repos`.

### Auf GKE (Google Container Engine) bekomme ich "No SSH tunnels currently open"

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

Eine andere Variante dieser Fehlermeldung ist:

```
Unable to connect to the server: x509: certificate signed by unknown authority
```

Das Problem ist, dass Ihre lokale Kubernetes Konfigurationsdatei die richtigen Anmeldeinformationen enthalten muss.

Wenn Sie in GKE einen Cluster erstellen, erhalten Sie Anmeldeinformationen, einschließlich SSL-Zertifikate und Zertifizierungsstellen. Diese müssen in einer Kubernetes Konfigurationsdatei (Standard: `~/.kube/config`) gespeichert werden, damit `kubectl` und `helm` darauf zugreifen können.

### Nach der Migration von Helm 2 zeigt `helm list` nur wenige oder gar keine Releases an

Wahrscheinlich haben Sie übersehen, dass Helm 3 nun Cluster-Namespaces verwendet, um Releases zu gruppieren. Das bedeutet, dass Sie bei allen Befehlen, die sich auf ein Release beziehen, eine der folgenden Optionen verwenden müssen:

* den aktuellen Namespace im aktiven Kubernetes-Kontext verwenden (wie vom Befehl `kubectl config view --minify` beschrieben),
* den korrekten Namespace mit der Option `--namespace`/`-n` angeben, oder
* beim `helm list` Befehl die Option `--all-namespaces`/`-A` verwenden

Dies gilt für `helm ls`, `helm uninstall` und alle anderen `helm` Befehle, die sich auf ein Release beziehen.

### In macOS wird auf die Datei `/etc/.mdns_debug` zugegriffen. Warum?

Wir wissen, dass Helm auf macOS versucht, auf eine Datei namens `/etc/.mdns_debug` zuzugreifen. Wenn die Datei existiert, hält Helm ein Dateihandle offen, während es ausgeführt wird.

Dies wird durch die macOS MDNS-Bibliothek verursacht. Sie versucht, diese Datei zu laden, um Debug-Einstellungen zu lesen (falls aktiviert). Das Dateihandle sollte eigentlich nicht offen gehalten werden, und dieses Problem wurde an Apple gemeldet. Es ist jedoch macOS und nicht Helm, das dieses Verhalten verursacht.

Wenn Sie nicht möchten, dass Helm diese Datei lädt, können Sie Helm möglicherweise selbst als statische Bibliothek kompilieren, die den Host-Netzwerkstack nicht verwendet. Dadurch wird die Binärgröße von Helm zunehmen, aber die Datei wird nicht mehr geöffnet.

Dieses Problem wurde ursprünglich als potenzielles Sicherheitsproblem gemeldet. Es wurde jedoch festgestellt, dass dieses Verhalten keine Schwachstelle oder Sicherheitslücke darstellt.

### helm repo add schlägt fehl, obwohl es früher funktioniert hat

In Helm 3.3.1 und früher gab der Befehl `helm repo add <reponame> <url>` keine Ausgabe, wenn Sie versuchten, ein bereits existierendes Repository hinzuzufügen. Die Option `--no-update` hätte einen Fehler ausgelöst, wenn das Repository bereits registriert war.

In Helm 3.3.2 und später führt der Versuch, ein existierendes Repository hinzuzufügen, zu einem Fehler:

`Error: repository name (reponame) already exists, please specify a different name`

Das Standardverhalten ist nun umgekehrt. `--no-update` wird jetzt ignoriert. Wenn Sie ein existierendes Repository ersetzen (überschreiben) möchten, können Sie die Option `--force-update` verwenden.

Dies ist auf eine Breaking Change für ein Sicherheitsupdate zurückzuführen, wie in den [Helm 3.3.2 Release Notes](https://github.com/helm/helm/releases/tag/v3.3.2) erklärt wird.

### Kubernetes-Client-Protokollierung aktivieren

Die Ausgabe von Protokollmeldungen zur Fehlersuche im Kubernetes-Client kann mit den [klog](https://pkg.go.dev/k8s.io/klog)-Flags aktiviert werden. Die Verwendung der `-v` Option zum Festlegen der Ausführlichkeit ist für die meisten Fälle ausreichend.

Zum Beispiel:

```
helm list -v 6
```

### Tiller-Installationen funktionieren nicht mehr und der Zugriff wird verweigert

Helm-Releases waren früher unter <https://storage.googleapis.com/kubernetes-helm/> verfügbar. Wie in ["Announcing get.helm.sh"](https://helm.sh/blog/get-helm-sh/) erklärt, wurde der offizielle Speicherort im Juni 2019 geändert. Die [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller) stellt alle alten Tiller-Images zur Verfügung.

Wenn Sie versuchen, ältere Versionen von Helm aus dem Storage Bucket herunterzuladen, den Sie früher verwendet haben, stellen Sie möglicherweise fest, dass diese fehlen:

```
<Error>
    <Code>AccessDenied</Code>
    <Message>Access denied.</Message>
    <Details>Anonymous caller does not have storage.objects.get access to the Google Cloud Storage object.</Details>
</Error>
```

Der [ursprüngliche Tiller-Image-Speicherort](https://gcr.io/kubernetes-helm/tiller) begann im August 2021 mit der Entfernung von Images. Wir haben diese Images in der [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller) zur Verfügung gestellt. Um beispielsweise Version v2.17.0 herunterzuladen, ersetzen Sie:

`https://storage.googleapis.com/kubernetes-helm/helm-v2.17.0-linux-amd64.tar.gz`

durch:

`https://get.helm.sh/helm-v2.17.0-linux-amd64.tar.gz`

Um mit Helm v2.17.0 zu initialisieren:

`helm init —upgrade`

Oder wenn eine andere Version benötigt wird, verwenden Sie die --tiller-image Option, um den Standardspeicherort zu überschreiben und eine bestimmte Helm v2-Version zu installieren:

`helm init --tiller-image ghcr.io/helm/tiller:v2.16.9`

**Hinweis:** Die Helm-Maintainer empfehlen die Migration zu einer aktuell unterstützten Version von Helm. Helm v2.17.0 war die letzte Version von Helm v2; Helm v2 wird seit November 2020 nicht mehr unterstützt, wie in [Helm 2 and the Charts Project Are Now Unsupported](https://helm.sh/blog/helm-2-becomes-unsupported/) beschrieben. Seit dieser Zeit wurden viele CVEs gegen Helm gemeldet, und diese Exploits sind in Helm v3 behoben, werden aber niemals in Helm v2 behoben werden. Sehen Sie sich die [aktuelle Liste der veröffentlichten Helm-Sicherheitshinweise](https://github.com/helm/helm/security/advisories?state=published) an und planen Sie noch heute die [Migration zu Helm v3](/topics/v2_v3_migration.md).
