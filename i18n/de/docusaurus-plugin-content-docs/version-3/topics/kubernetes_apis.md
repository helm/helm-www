---
title: Veraltete Kubernetes-APIs
description: Erläutert veraltete Kubernetes-APIs im Kontext von Helm
---

Kubernetes ist ein API-gesteuertes System. Die API entwickelt sich im Laufe der
Zeit weiter, um das wachsende Verständnis des Problembereichs widerzuspiegeln.
Dies ist gängige Praxis bei Systemen und ihren APIs. Ein wichtiger Teil der
API-Weiterentwicklung ist eine gute Deprecation-Richtlinie und ein entsprechender
Prozess, um Benutzer über Änderungen zu informieren. Die Nutzer Ihrer API müssen
im Voraus wissen, in welchem Release eine API entfernt oder geändert wird. So
werden Überraschungen und unerwartete Änderungen vermieden.

Die [Kubernetes-Deprecation-Richtlinie](https://kubernetes.io/docs/reference/using-api/deprecation-policy/)
dokumentiert, wie Kubernetes Änderungen an seinen API-Versionen handhabt. Die
Richtlinie legt fest, wie lange API-Versionen nach einer Deprecation-Ankündigung
unterstützt werden. Achten Sie daher auf Deprecation-Ankündigungen und informieren
Sie sich, wann API-Versionen entfernt werden, um die Auswirkungen zu minimieren.

Ein Beispiel für eine solche Ankündigung ist [die Entfernung veralteter
API-Versionen in Kubernetes 1.16](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/).
Diese wurde einige Monate vor dem Release veröffentlicht. Die betroffenen
API-Versionen waren zuvor bereits als veraltet angekündigt worden. Dies zeigt,
dass eine gute Richtlinie existiert, die Nutzer über die Unterstützung von
API-Versionen informiert.

Helm-Templates geben eine [Kubernetes-API-Gruppe](https://kubernetes.io/docs/concepts/overview/kubernetes-api/#api-groups)
an, wenn ein Kubernetes-Objekt definiert wird – ähnlich wie eine
Kubernetes-Manifest-Datei. Die API-Gruppe wird im Feld `apiVersion` des Templates
angegeben und identifiziert die API-Version des Kubernetes-Objekts. Helm-Benutzer
und Chart-Maintainer müssen daher wissen, wann Kubernetes-API-Versionen als
veraltet markiert wurden und in welcher Kubernetes-Version sie entfernt werden.

## Chart-Maintainer

Überprüfen Sie Ihre Charts auf Kubernetes-API-Versionen, die veraltet sind oder
in einer Kubernetes-Version entfernt wurden. Aktualisieren Sie API-Versionen,
die veraltet oder nicht mehr unterstützt werden, auf die aktuelle Version und
veröffentlichen Sie eine neue Chart-Version. Die API-Version wird durch die
Felder `kind` und `apiVersion` definiert. Hier ein Beispiel für eine in
Kubernetes 1.16 entfernte `Deployment`-API-Version:

```yaml
apiVersion: apps/v1beta1
kind: Deployment
```

## Helm-Benutzer

Überprüfen Sie die von Ihnen verwendeten Charts (ähnlich wie
[Chart-Maintainer](#chart-maintainer)) und identifizieren Sie alle Charts mit
veralteten oder entfernten API-Versionen. Prüfen Sie für die identifizierten
Charts, ob eine neuere Chart-Version mit unterstützten API-Versionen verfügbar
ist, oder aktualisieren Sie das Chart selbst.

Überprüfen Sie zusätzlich alle bereitgestellten Charts (d. h. Helm-Releases)
auf veraltete oder entfernte API-Versionen. Verwenden Sie dazu den Befehl
`helm get manifest`, um die Details eines Releases abzurufen.

Die Vorgehensweise zur Aktualisierung eines Helm-Releases auf unterstützte APIs
hängt von Ihren Ergebnissen ab:

1. Wenn Sie nur veraltete API-Versionen finden:
   - Führen Sie ein `helm upgrade` mit einer Chart-Version durch, die
     unterstützte Kubernetes-API-Versionen verwendet
   - Fügen Sie eine Beschreibung hinzu, die darauf hinweist, kein Rollback auf
     eine frühere Helm-Version durchzuführen
2. Wenn Sie API-Versionen finden, die in einer Kubernetes-Version entfernt wurden:
   - Falls Sie eine Kubernetes-Version verwenden, in der die API-Versionen noch
     verfügbar sind (z. B. Sie nutzen Kubernetes 1.15 und haben APIs gefunden,
     die in Kubernetes 1.16 entfernt werden):
     - Befolgen Sie die Schritte aus Punkt 1
   - Andernfalls (z. B. Sie nutzen bereits eine Kubernetes-Version, in der einige
     von `helm get manifest` gemeldete API-Versionen nicht mehr verfügbar sind):
     - Bearbeiten Sie das im Cluster gespeicherte Release-Manifest, um die
       API-Versionen zu aktualisieren. Weitere Details finden Sie unter
       [API-Versionen eines Release-Manifests aktualisieren](#api-versionen-eines-release-manifests-aktualisieren)

> Hinweis: Führen Sie in keinem Fall ein Rollback auf eine Version vor der
Release-Version mit den unterstützten APIs durch.

> Empfehlung: Aktualisieren Sie Releases mit veralteten API-Versionen auf
unterstützte API-Versionen, bevor Sie auf einen Kubernetes-Cluster upgraden,
der diese API-Versionen entfernt.

Wenn Sie ein Release nicht wie empfohlen aktualisieren, erhalten Sie beim
Upgrade-Versuch in einer Kubernetes-Version, in der die API-Versionen entfernt
wurden, einen Fehler wie diesen:

```
Error: UPGRADE FAILED: current release manifest contains removed kubernetes api(s)
for this kubernetes version and it is therefore unable to build the kubernetes
objects for performing the diff. error from kubernetes: unable to recognize "":
no matches for kind "Deployment" in version "apps/v1beta1"
```

Helm schlägt in diesem Szenario fehl, weil es versucht, einen Diff-Patch zwischen
dem aktuell bereitgestellten Release (mit den entfernten Kubernetes-APIs) und dem
Chart mit den aktualisierten API-Versionen zu erstellen. Der eigentliche Grund:
Wenn Kubernetes eine API-Version entfernt, kann die Kubernetes-Go-Client-Bibliothek
die veralteten Objekte nicht mehr parsen. Helm schlägt daher beim Aufruf der
Bibliothek fehl und kann sich von dieser Situation nicht erholen. Weitere Details
zur Behebung finden Sie unter [API-Versionen eines Release-Manifests aktualisieren](#api-versionen-eines-release-manifests-aktualisieren).

## API-Versionen eines Release-Manifests aktualisieren

Das Manifest ist eine Eigenschaft des Helm-Release-Objekts und wird im Datenfeld
eines Secrets (Standard) oder einer ConfigMap im Cluster gespeichert. Das Datenfeld
enthält ein gzipptes Objekt, das Base64-kodiert ist (bei einem Secret gibt es eine
zusätzliche Base64-Kodierung). Pro Release-Version/Revision existiert ein Secret
bzw. eine ConfigMap im Namespace des Releases.

Verwenden Sie das Helm-Plugin [mapkubeapis](https://github.com/helm/helm-mapkubeapis),
um ein Release auf unterstützte APIs zu aktualisieren. Weitere Details finden Sie
in der Readme-Datei.

Alternativ können Sie die folgenden manuellen Schritte durchführen, um die
API-Versionen eines Release-Manifests zu aktualisieren. Je nach Konfiguration
folgen Sie den Schritten für das Secret- oder ConfigMap-Backend.

- Namen des Secrets oder der ConfigMap abrufen, das/die mit dem zuletzt
  bereitgestellten Release verknüpft ist:
  - Secrets-Backend: `kubectl get secret -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
  - ConfigMap-Backend: `kubectl get configmap -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
- Details des zuletzt bereitgestellten Releases abrufen:
  - Secrets-Backend: `kubectl get secret <release_secret_name> -n
    <release_namespace> -o yaml > release.yaml`
  - ConfigMap-Backend: `kubectl get configmap <release_configmap_name> -n
    <release_namespace> -o yaml > release.yaml`
- Release sichern:
  - `cp release.yaml release.bak`
  - Im Notfall wiederherstellen: `kubectl apply -f release.bak -n
    <release_namespace>`
- Release-Objekt dekodieren:
  - Secrets-Backend: `cat release.yaml | grep -oP '(?<=release: ).*' | base64 -d
    | base64 -d | gzip -d > release.data.decoded`
  - ConfigMap-Backend: `cat release.yaml | grep -oP '(?<=release: ).*' | base64
    -d | gzip -d > release.data.decoded`
- API-Versionen der Manifeste ändern. Verwenden Sie ein beliebiges Werkzeug
  (z. B. einen Editor) für die Änderungen. Die Manifeste befinden sich im Feld
  `manifest` Ihres dekodierten Release-Objekts (`release.data.decoded`)
- Release-Objekt kodieren:
  - Secrets-Backend: `cat release.data.decoded | gzip | base64 | base64`
  - ConfigMap-Backend: `cat release.data.decoded | gzip | base64`
- Den Wert der Eigenschaft `data.release` in der Release-Datei (`release.yaml`)
  durch das neue kodierte Release-Objekt ersetzen
- Datei auf den Namespace anwenden: `kubectl apply -f release.yaml -n
  <release_namespace>`
- Ein `helm upgrade` mit einer Chart-Version durchführen, die unterstützte
  Kubernetes-API-Versionen verwendet
- Eine Beschreibung hinzufügen, die darauf hinweist, kein Rollback auf eine
  frühere Helm-Version durchzuführen
