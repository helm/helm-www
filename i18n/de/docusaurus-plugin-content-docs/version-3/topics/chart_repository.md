---
title: Leitfaden für Chart Repositories
description: So erstellen und arbeiten Sie mit Helm Chart Repositories.
sidebar_position: 6
---

Dieser Abschnitt erklärt, wie Sie Chart Repositories erstellen und damit arbeiten.
Grundsätzlich ist ein Chart Repository ein Ort, an dem gepackte Charts gespeichert
und geteilt werden können.

Das verteilte Community-Repository für Helm Charts befindet sich bei
[Artifact Hub](https://artifacthub.io/packages/search?kind=0) und begrüßt
Teilnahme. Aber Helm ermöglicht es auch, eigene Chart Repositories zu erstellen und zu
betreiben. Dieser Leitfaden erklärt, wie das geht. Falls Sie erwägen, ein Chart
Repository zu erstellen, sollten Sie stattdessen die Verwendung einer
[OCI-Registry](/topics/registries.md) in Betracht ziehen.

## Voraussetzungen

* Arbeiten Sie den [Schnellstart](/intro/quickstart.md)-Leitfaden durch
* Lesen Sie das [Charts](/topics/charts.md)-Dokument

## Ein Chart Repository erstellen

Ein _Chart Repository_ ist ein HTTP-Server, der eine `index.yaml`-Datei und optional
einige gepackte Charts hostet. Wenn Sie bereit sind, Ihre Charts zu teilen, ist der
bevorzugte Weg, sie in ein Chart Repository hochzuladen.

Seit Helm 2.2.0 wird clientseitige SSL-Authentifizierung für Repositories unterstützt.
Andere Authentifizierungsprotokolle können als Plugins verfügbar sein.

Da ein Chart Repository jeder HTTP-Server sein kann, der YAML- und tar-Dateien
bereitstellen und GET-Anfragen beantworten kann, haben Sie zahlreiche Optionen beim
Hosten Ihres eigenen Chart Repositories. Zum Beispiel können Sie einen Google Cloud
Storage (GCS) Bucket, einen Amazon S3 Bucket, GitHub Pages verwenden oder sogar Ihren
eigenen Webserver erstellen.

### Die Struktur eines Chart Repositories

Ein Chart Repository besteht aus gepackten Charts und einer speziellen Datei namens
`index.yaml`, die einen Index aller Charts im Repository enthält. Häufig werden die
Charts, die `index.yaml` beschreibt, auch auf demselben Server gehostet, ebenso wie
die [Provenienz-Dateien](/topics/provenance.md).

Das Layout des Repositories `https://example.com/charts` könnte beispielsweise so
aussehen:

```
charts/
  |
  |- index.yaml
  |
  |- alpine-0.1.2.tgz
  |
  |- alpine-0.1.2.tgz.prov
```

In diesem Fall würde die Index-Datei Informationen über ein Chart enthalten, das
Alpine-Chart, und die Download-URL `https://example.com/charts/alpine-0.1.2.tgz`
für dieses Chart bereitstellen.

Es ist nicht erforderlich, dass ein Chart-Paket auf demselben Server wie die
`index.yaml`-Datei liegt. Allerdings ist dies oft am einfachsten.

### Die Index-Datei

Die Index-Datei ist eine YAML-Datei namens `index.yaml`. Sie enthält einige Metadaten
über das Paket, einschließlich des Inhalts der `Chart.yaml`-Datei eines Charts. Ein
gültiges Chart Repository muss eine Index-Datei haben. Die Index-Datei enthält
Informationen über jedes Chart im Chart Repository. Der Befehl `helm repo index`
generiert eine Index-Datei basierend auf einem gegebenen lokalen Verzeichnis, das
gepackte Charts enthält.

Dies ist ein Beispiel einer Index-Datei:

```yaml
apiVersion: v1
entries:
  alpine:
    - created: 2016-10-06T16:23:20.499814565-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 99c76e403d752c84ead610644d4b1c2f2b453a74b921f422b9dcb8a7c8b559cd
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.2.0.tgz
      version: 0.2.0
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 515c58e5f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cd78727
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.1.0.tgz
      version: 0.1.0
  nginx:
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Create a basic nginx HTTP server
      digest: aaff4545f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cdffffff
      home: https://helm.sh/helm
      name: nginx
      sources:
      - https://github.com/helm/charts
      urls:
      - https://technosophos.github.io/tscharts/nginx-1.1.0.tgz
      version: 1.1.0
generated: 2016-10-06T16:23:20.499029981-06:00
```

## Hosten von Chart Repositories

Dieser Teil zeigt verschiedene Möglichkeiten, ein Chart Repository bereitzustellen.

### Google Cloud Storage

Der erste Schritt ist das **Erstellen Ihres GCS-Buckets**. Wir nennen unseren
`fantastic-charts`.

![Create a GCS Bucket](/img/helm2/create-a-bucket.png)

Als Nächstes machen Sie Ihren Bucket öffentlich, indem Sie die **Bucket-Berechtigungen
bearbeiten**.

![Edit Permissions](/img/helm2/edit-permissions.png)

Fügen Sie diese Zeile hinzu, um **Ihren Bucket öffentlich zu machen**:

![Make Bucket Public](/img/helm2/make-bucket-public.png)

Herzlichen Glückwunsch! Jetzt haben Sie einen leeren GCS-Bucket, der bereit ist, Charts
bereitzustellen.

Sie können Ihr Chart Repository mit dem Google Cloud Storage-Kommandozeilentool oder
über die GCS-Weboberfläche hochladen. Ein öffentlicher GCS-Bucket kann über einfaches
HTTPS unter dieser Adresse erreicht werden: `https://bucket-name.storage.googleapis.com/`.

### Cloudsmith

Sie können auch Chart Repositories mit Cloudsmith einrichten. Lesen Sie mehr über
Chart Repositories mit Cloudsmith
[hier](https://help.cloudsmith.io/docs/helm-chart-repository)

### JFrog Artifactory

Ebenso können Sie Chart Repositories mit JFrog Artifactory einrichten. Lesen Sie mehr
über Chart Repositories mit JFrog Artifactory
[hier](https://www.jfrog.com/confluence/display/RTF/Helm+Chart+Repositories)

### GitHub Pages-Beispiel

Auf ähnliche Weise können Sie ein Chart Repository mit GitHub Pages erstellen.

GitHub ermöglicht es Ihnen, statische Webseiten auf zwei verschiedene Arten
bereitzustellen:

- Indem Sie ein Projekt so konfigurieren, dass es den Inhalt seines `docs/`-Verzeichnisses bereitstellt
- Indem Sie ein Projekt so konfigurieren, dass es einen bestimmten Branch bereitstellt

Wir nehmen den zweiten Ansatz, obwohl der erste genauso einfach ist.

Der erste Schritt ist das **Erstellen Ihres gh-pages-Branches**. Sie können dies
lokal wie folgt tun:

```console
$ git checkout -b gh-pages
```

Oder über den Webbrowser mit dem **Branch**-Button in Ihrem GitHub-Repository:

![Create GitHub Pages branch](/img/helm2/create-a-gh-page-button.png)

Als Nächstes sollten Sie sicherstellen, dass Ihr **gh-pages-Branch** als GitHub Pages
eingestellt ist. Klicken Sie auf die **Settings** Ihres Repositories und scrollen Sie
zum Abschnitt **GitHub Pages** und stellen Sie es wie unten gezeigt ein:

![Create GitHub Pages branch](/img/helm2/set-a-gh-page.png)

Standardmäßig wird die **Source** normalerweise auf **gh-pages branch** gesetzt. Falls
dies nicht standardmäßig eingestellt ist, wählen Sie es aus.

Sie können dort bei Bedarf eine **benutzerdefinierte Domain** verwenden.

Stellen Sie außerdem sicher, dass **Enforce HTTPS** aktiviert ist, damit **HTTPS**
verwendet wird, wenn Charts bereitgestellt werden.

Mit dieser Einrichtung können Sie Ihren Standard-Branch zum Speichern Ihres
Chart-Codes verwenden und den **gh-pages-Branch** als Chart Repository, z.B.:
`https://USERNAME.github.io/REPONAME`. Das Demonstrations-Repository [TS
Charts](https://github.com/technosophos/tscharts) ist erreichbar unter
`https://technosophos.github.io/tscharts/`.

Wenn Sie sich entschieden haben, GitHub Pages zum Hosten des Chart Repositories zu
verwenden, schauen Sie sich die [Chart Releaser Action](/howto/chart_releaser_action.md)
an. Die Chart Releaser Action ist ein GitHub Action-Workflow, der ein GitHub-Projekt
in ein selbst gehostetes Helm Chart Repository verwandelt, unter Verwendung des
[helm/chart-releaser](https://github.com/helm/chart-releaser) CLI-Tools.

### Gewöhnliche Webserver

Um einen gewöhnlichen Webserver für Helm Charts zu konfigurieren, müssen Sie lediglich
Folgendes tun:

- Legen Sie Ihren Index und Ihre Charts in ein Verzeichnis, das der Server bereitstellen kann
- Stellen Sie sicher, dass die `index.yaml`-Datei ohne Authentifizierungsanforderung zugänglich ist
- Stellen Sie sicher, dass `yaml`-Dateien mit dem korrekten Content-Type bereitgestellt werden (`text/yaml` oder `text/x-yaml`)

Wenn Sie beispielsweise Ihre Charts aus `$WEBROOT/charts` bereitstellen möchten,
stellen Sie sicher, dass ein `charts/`-Verzeichnis in Ihrem Web-Root existiert, und
legen Sie die Index-Datei und die Charts in diesen Ordner.

### ChartMuseum Repository-Server

ChartMuseum ist ein Open-Source Helm Chart Repository-Server, der in Go (Golang)
geschrieben ist, mit Unterstützung für Cloud-Storage-Backends, einschließlich
[Google Cloud Storage](https://cloud.google.com/storage/),
[Amazon S3](https://aws.amazon.com/s3/),
[Microsoft Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/),
[Alibaba Cloud OSS Storage](https://www.alibabacloud.com/product/oss),
[Openstack Object Storage](https://developer.openstack.org/api-ref/object-store/),
[Oracle Cloud Infrastructure Object Storage](https://cloud.oracle.com/storage),
[Baidu Cloud BOS Storage](https://cloud.baidu.com/product/bos.html),
[Tencent Cloud Object Storage](https://intl.cloud.tencent.com/product/cos),
[DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/),
[Minio](https://min.io/) und [etcd](https://etcd.io/).

Sie können auch den
[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)-Server
verwenden, um ein Chart Repository aus einem lokalen Dateisystem zu hosten.

### GitLab Package Registry

Mit GitLab können Sie Helm Charts in der Package Registry Ihres Projekts
veröffentlichen. Lesen Sie mehr über das Einrichten eines Helm Package Repositories
mit GitLab [hier](https://docs.gitlab.com/ee/user/packages/helm_repository/).

## Verwalten von Chart Repositories

Da Sie nun ein Chart Repository haben, erklärt der letzte Teil dieses Leitfadens, wie
Sie Charts in diesem Repository pflegen.

### Charts in Ihrem Chart Repository speichern

Laden wir nun ein Chart und eine Index-Datei in das Repository hoch. Charts in einem
Chart Repository müssen gepackt (`helm package chart-name/`) und korrekt versioniert
sein (gemäß den [SemVer 2](https://semver.org/)-Richtlinien).

Die folgenden Schritte bilden einen Beispiel-Workflow, aber Sie können jeden beliebigen
Workflow verwenden, den Sie zum Speichern und Aktualisieren von Charts in Ihrem Chart
Repository bevorzugen.

Sobald Sie ein gepacktes Chart bereit haben, erstellen Sie ein neues Verzeichnis und
verschieben Sie Ihr gepacktes Chart in dieses Verzeichnis.

```console
$ helm package docs/examples/alpine/
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
$ helm repo index fantastic-charts --url https://fantastic-charts.storage.googleapis.com
```

Der letzte Befehl nimmt den Pfad des lokalen Verzeichnisses, das Sie gerade erstellt
haben, und die URL Ihres Remote-Chart-Repositories und erstellt eine `index.yaml`-Datei
im angegebenen Verzeichnispfad.

Jetzt können Sie das Chart und die Index-Datei mit einem Synchronisierungstool oder
manuell in Ihr Chart Repository hochladen. Wenn Sie Google Cloud Storage verwenden,
schauen Sie sich diesen
[Beispiel-Workflow](/howto/chart_repository_sync_example.md) mit dem gsutil-Client an.
Für GitHub können Sie die Charts einfach in den entsprechenden Ziel-Branch legen.

### Neue Charts zu einem bestehenden Repository hinzufügen

Jedes Mal, wenn Sie ein neues Chart zu Ihrem Repository hinzufügen möchten, müssen Sie
den Index neu generieren. Der Befehl `helm repo index` baut die `index.yaml`-Datei
vollständig von Grund auf neu auf und nimmt nur die Charts auf, die er lokal findet.

Sie können jedoch das Flag `--merge` verwenden, um neue Charts inkrementell zu einer
bestehenden `index.yaml`-Datei hinzuzufügen (eine großartige Option bei der Arbeit mit
einem Remote-Repository wie GCS). Führen Sie `helm repo index --help` aus, um mehr zu
erfahren.

Stellen Sie sicher, dass Sie sowohl die überarbeitete `index.yaml`-Datei als auch das
Chart hochladen. Und falls Sie eine Provenienz-Datei generiert haben, laden Sie diese
ebenfalls hoch.

### Ihre Charts mit anderen teilen

Wenn Sie bereit sind, Ihre Charts zu teilen, teilen Sie einfach jemandem die URL Ihres
Repositories mit.

Von dort aus können sie das Repository mit dem Befehl `helm repo add [NAME] [URL]` zu
ihrem Helm-Client hinzufügen, mit einem beliebigen Namen, den sie für die Referenzierung
des Repositories verwenden möchten.

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

Wenn die Charts durch HTTP-Basic-Authentifizierung geschützt sind, können Sie hier
auch Benutzername und Passwort angeben:

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

**Hinweis:** Ein Repository wird nicht hinzugefügt, wenn es keine gültige
`index.yaml` enthält.

**Hinweis:** Wenn Ihr Helm-Repository z.B. ein selbstsigniertes Zertifikat verwendet,
können Sie `helm repo add --insecure-skip-tls-verify ...` verwenden, um die
CA-Verifizierung zu überspringen.

Danach können Ihre Benutzer Ihre Charts durchsuchen. Nachdem Sie das Repository
aktualisiert haben, können sie den Befehl `helm repo update` verwenden, um die
neuesten Chart-Informationen zu erhalten.

*Unter der Haube rufen die Befehle `helm repo add` und `helm repo update` die
index.yaml-Datei ab und speichern sie im Verzeichnis
`$XDG_CACHE_HOME/helm/repository/cache/`. Hier findet die Funktion `helm search`
Informationen über Charts.*
