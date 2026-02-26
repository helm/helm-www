---
title: OCI-basierte Registries verwenden
description: Beschreibt die Verwendung von OCI für die Chart-Verteilung.
sidebar_position: 7
---

Seit Helm 3 können Sie Container-Registries mit [OCI](https://www.opencontainers.org/)-Unterstützung verwenden, um Chart-Pakete zu speichern und zu teilen. Ab Helm v3.8.0 ist die OCI-Unterstützung standardmäßig aktiviert.


## OCI-Unterstützung vor v3.8.0

Die OCI-Unterstützung wurde mit Helm v3.8.0 von experimentell auf allgemein verfügbar umgestellt. In früheren Versionen von Helm verhielt sich die OCI-Unterstützung anders. Wenn Sie die OCI-Unterstützung vor Helm v3.8.0 verwendet haben, ist es wichtig zu verstehen, was sich mit den verschiedenen Helm-Versionen geändert hat.

### Aktivierung der OCI-Unterstützung vor v3.8.0

Vor Helm v3.8.0 ist die OCI-Unterstützung *experimentell* und muss aktiviert werden.

Um die experimentelle OCI-Unterstützung für Helm-Versionen vor v3.8.0 zu aktivieren, setzen Sie `HELM_EXPERIMENTAL_OCI` in Ihrer Umgebung. Zum Beispiel:

```console
export HELM_EXPERIMENTAL_OCI=1
```

### Veraltete OCI-Funktionen und Verhaltensänderungen mit v3.8.0

Mit der Veröffentlichung von [Helm v3.8.0](https://github.com/helm/helm/releases/tag/v3.8.0) unterscheiden sich folgende Funktionen und Verhaltensweisen von früheren Helm-Versionen:

- Wenn ein Chart in den Abhängigkeiten als OCI gesetzt wird, kann die Version wie bei anderen Abhängigkeiten als Bereich angegeben werden.
- SemVer-Tags, die Build-Informationen enthalten, können gepusht und verwendet werden. OCI-Registries unterstützen das Zeichen `+` nicht in Tags. Helm übersetzt das `+` bei der Speicherung als Tag in `_`.
- Der Befehl `helm registry login` folgt nun derselben Struktur wie die Docker-CLI zum Speichern von Anmeldedaten. Derselbe Speicherort für die Registry-Konfiguration kann sowohl an Helm als auch an die Docker-CLI übergeben werden.

### Veraltete OCI-Funktionen und Verhaltensänderungen mit v3.7.0

Mit der Veröffentlichung von [Helm v3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0) wurde [HIP 6](https://github.com/helm/community/blob/main/hips/hip-0006.md) für die OCI-Unterstützung implementiert. Dadurch unterscheiden sich folgende Funktionen und Verhaltensweisen von früheren Helm-Versionen:

- Der Unterbefehl `helm chart` wurde entfernt.
- Der Chart-Cache wurde entfernt (kein `helm chart list` usw.).
- OCI-Registry-Referenzen werden jetzt immer mit `oci://` präfixiert.
- Der Basisname der Registry-Referenz muss *immer* mit dem Namen des Charts übereinstimmen.
- Das Tag der Registry-Referenz muss *immer* mit der semantischen Version des Charts übereinstimmen (d.h. keine `latest`-Tags).
- Der Medientyp der Chart-Schicht wurde von `application/tar+gzip` auf `application/vnd.cncf.helm.chart.content.v1.tar+gzip` geändert.


## Verwendung einer OCI-basierten Registry

### Helm-Repositories in OCI-basierten Registries

Ein [Helm-Repository](/topics/chart_repository.md) ist eine Möglichkeit, gepackte Helm-Charts zu speichern und zu verteilen. Eine OCI-basierte Registry kann null oder mehr Helm-Repositories enthalten, und jedes dieser Repositories kann null oder mehr gepackte Helm-Charts enthalten.

### Gehostete Registries verwenden

Es stehen Ihnen mehrere gehostete Container-Registries mit OCI-Unterstützung zur Verfügung, die Sie für Ihre Helm-Charts nutzen können. Zum Beispiel:

- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-helm-repos#push-chart-to-registry-as-oci-artifact)
- [Cloudsmith](https://help.cloudsmith.io/docs/oci-repository)
- [Docker Hub](https://docs.docker.com/docker-hub/oci-artifacts/)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/helm/manage-charts)
- [Harbor](https://goharbor.io/docs/main/administration/user-defined-oci-artifact/)
- [IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_helm_charts)
- [JFrog Artifactory](https://jfrog.com/help/r/jfrog-artifactory-documentation/helm-oci-repositories)
- [RepoFlow](https://docs.repoflow.io/PackageTypes/helm#oci-helm-support)
  

Folgen Sie der Dokumentation Ihres Container-Registry-Anbieters, um eine Registry mit OCI-Unterstützung zu erstellen und zu konfigurieren.

**Hinweis:** Sie können [Docker Registry](https://docs.docker.com/registry/deploying/) oder [`zot`](https://github.com/project-zot/zot) ausführen, die OCI-basierte Registries sind, auf Ihrem Entwicklungsrechner. Das Ausführen einer OCI-basierten Registry auf Ihrem Entwicklungsrechner sollte nur zu Testzwecken verwendet werden.

### Sigstore zum Signieren von OCI-basierten Charts verwenden

Das [`helm-sigstore`](https://github.com/sigstore/helm-sigstore)-Plugin ermöglicht die Verwendung von [Sigstore](https://sigstore.dev/) zum Signieren von Helm-Charts mit denselben Werkzeugen, die zum Signieren von Container-Images verwendet werden. Dies bietet eine Alternative zur [GPG-basierten Provenienz](/topics/provenance.md), die von klassischen [Chart-Repositories](/topics/chart_repository.md) unterstützt wird.

Weitere Informationen zur Verwendung des `helm sigstore`-Plugins finden Sie in der [Dokumentation dieses Projekts](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md).

## Befehle für die Arbeit mit Registries

### Der Unterbefehl `registry`

#### `login`

Bei einer Registry anmelden (mit manueller Passworteingabe)

```console
$ helm registry login -u myuser localhost:5000
Password:
Login succeeded
```

#### `logout`

Von einer Registry abmelden

```console
$ helm registry logout localhost:5000
Logout succeeded
```

### Der Unterbefehl `push`

Ein Chart in eine OCI-basierte Registry hochladen:

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

Der Unterbefehl `push` kann nur für `.tgz`-Dateien verwendet werden, die zuvor mit `helm package` erstellt wurden.

Wenn Sie `helm push` verwenden, um ein Chart in eine OCI-Registry hochzuladen, muss die Referenz mit `oci://` präfixiert sein und darf weder den Basisnamen noch das Tag enthalten.

Der Basisname der Registry-Referenz wird aus dem Namen des Charts abgeleitet, und das Tag wird aus der semantischen Version des Charts abgeleitet. Dies ist derzeit eine strenge Anforderung.

Bestimmte Registries erfordern, dass das Repository und/oder der Namespace (falls angegeben) vorab erstellt werden. Andernfalls wird während des `helm push`-Vorgangs ein Fehler erzeugt.

Wenn Sie eine [Provenance-Datei](/topics/provenance.md) (`.prov`) erstellt haben und diese sich neben der Chart-`.tgz`-Datei befindet, wird sie beim `push` automatisch in die Registry hochgeladen. Dies führt zu einer zusätzlichen Schicht im [Helm-Chart-Manifest](#helm-chart-manifest).

Benutzer des [helm-push-Plugins](https://github.com/chartmuseum/helm-push) (zum Hochladen von Charts nach [ChartMuseum](/topics/chart_repository.md#chartmuseum-repository-server)) könnten Probleme haben, da das Plugin mit dem neuen, integrierten `push` in Konflikt steht. Ab Version v0.10.0 wurde das Plugin in `cm-push` umbenannt.

### Weitere Unterbefehle

Die Unterstützung für das `oci://`-Protokoll ist auch in verschiedenen anderen Unterbefehlen verfügbar. Hier ist eine vollständige Liste:

- `helm pull`
- `helm push`
- `helm show `
- `helm template`
- `helm install`
- `helm upgrade`

Der Basisname (Chart-Name) der Registry-Referenz *wird* bei jeder Art von Aktion einbezogen, die einen Chart-Download beinhaltet (im Gegensatz zu `helm push`, wo er weggelassen wird).

Hier sind einige Beispiele für die Verwendung der oben aufgeführten Unterbefehle mit OCI-basierten Charts:

```
$ helm pull oci://localhost:5000/helm-charts/mychart --version 0.1.0
Pulled: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:0be7ec9fb7b962b46d81e4bb74fdcdb7089d965d3baca9f85d64948b05b402ff

$ helm show all oci://localhost:5000/helm-charts/mychart --version 0.1.0
apiVersion: v2
appVersion: 1.16.0
description: A Helm chart for Kubernetes
name: mychart
...

$ helm template myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
---
# Source: mychart/templates/serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
...

$ helm install myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...

$ helm upgrade myrelease oci://localhost:5000/helm-charts/mychart --version 0.2.0
Release "myrelease" has been upgraded. Happy Helming!
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:12:05 2021
NAMESPACE: default
STATUS: deployed
REVISION: 2
NOTES:
...
```

## Charts mit Digest installieren

Das Installieren eines Charts mit einem Digest ist sicherer als mit einem Tag, da Digests unveränderlich sind. Der Digest wird in der Chart-URI angegeben:

```
$ helm install myrelease oci://localhost:5000/helm-charts/mychart@sha256:52ccaee6d4dd272e54bfccda77738b42e1edf0e4a20c27e23f0b6c15d01aef79
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...
```

## Abhängigkeiten angeben

Abhängigkeiten eines Charts können mit dem Unterbefehl `dependency update` aus einer Registry geholt werden.

Das `repository` für einen Eintrag in `Chart.yaml` wird als Registry-Referenz ohne den Basisnamen angegeben:

```
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```
Dies ruft `oci://localhost:5000/myrepo/mychart:2.7.0` ab, wenn `dependency update` ausgeführt wird.

## Helm-Chart-Manifest

Beispiel eines Helm-Chart-Manifests, wie es in einer Registry dargestellt wird (beachten Sie die `mediaType`-Felder):
```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    }
  ]
}
```

Das folgende Beispiel enthält eine [Provenance-Datei](/topics/provenance.md) (beachten Sie die zusätzliche Schicht):

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    },
    {
      "mediaType": "application/vnd.cncf.helm.chart.provenance.v1.prov",
      "digest": "sha256:3e207b409db364b595ba862cdc12be96dcdad8e36c59a03b7b3b61c946a5741a",
      "size": 643
    }
  ]
}
```

## Migration von Chart-Repos

Die Migration von klassischen [Chart-Repositories](/topics/chart_repository.md) (index.yaml-basierte Repos) ist unkompliziert: Verwenden Sie `helm pull`, um Charts herunterzuladen, und anschließend `helm push`, um die resultierenden `.tgz`-Dateien in eine Registry hochzuladen.
