---
title: Erste Schritte
description: Eine Kurzanleitung zu Chart-Templates.
sidebar_position: 2
---

In diesem Abschnitt der Anleitung erstellen wir ein Chart und fügen dann ein
erstes Template hinzu. Das hier erstellte Chart wird im Rest der Anleitung
verwendet.

Um loszulegen, werfen wir einen kurzen Blick auf ein Helm Chart.

## Charts

Wie in der [Charts-Anleitung](/topics/charts.md) beschrieben, sind Helm Charts
folgendermaßen strukturiert:

```
mychart/
  Chart.yaml
  values.yaml
  charts/
  templates/
  ...
```

Das Verzeichnis `templates/` ist für Template-Dateien vorgesehen. Wenn Helm ein
Chart auswertet, sendet es alle Dateien im Verzeichnis `templates/` durch die
Template-Rendering-Engine. Anschließend sammelt es die Ergebnisse dieser
Templates und sendet sie an Kubernetes.

Die Datei `values.yaml` ist ebenfalls wichtig für Templates. Diese Datei enthält
die _Standardwerte_ für ein Chart. Diese Werte können von Benutzern während
`helm install` oder `helm upgrade` überschrieben werden.

Die Datei `Chart.yaml` enthält eine Beschreibung des Charts. Sie können aus
einem Template heraus darauf zugreifen.

Das Verzeichnis `charts/` _kann_ andere Charts enthalten (die wir _Subcharts_
nennen). Später in dieser Anleitung werden wir sehen, wie diese beim
Template-Rendering funktionieren.

## Ein Starter-Chart

Für diese Anleitung erstellen wir ein einfaches Chart namens `mychart` und dann
einige Templates darin.

```console
$ helm create mychart
Creating mychart
```

### Ein kurzer Blick auf `mychart/templates/`

Wenn Sie sich das Verzeichnis `mychart/templates/` ansehen, werden Sie einige
Dateien bemerken, die bereits vorhanden sind.

- `NOTES.txt`: Der "Hilfetext" für Ihr Chart. Dieser wird Ihren Benutzern
  angezeigt, wenn sie `helm install` ausführen.
- `deployment.yaml`: Ein einfaches Manifest zum Erstellen eines Kubernetes
  [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- `service.yaml`: Ein einfaches Manifest zum Erstellen eines [Service-
  Endpunkts](https://kubernetes.io/docs/concepts/services-networking/service/)
  für Ihr Deployment
- `_helpers.tpl`: Ein Ort für Template-Hilfsfunktionen, die Sie im gesamten
  Chart wiederverwenden können

Und was wir jetzt tun werden, ist... _sie alle löschen!_ Auf diese Weise können
wir unser Tutorial von Grund auf durcharbeiten. Wir werden tatsächlich unsere
eigene `NOTES.txt` und `_helpers.tpl` erstellen, während wir fortschreiten.

```console
$ rm -rf mychart/templates/*
```

Wenn Sie produktionsreife Charts schreiben, kann es sehr nützlich sein,
Grundversionen dieser Charts zu haben. In Ihrem täglichen Chart-Authoring werden
Sie diese wahrscheinlich nicht entfernen wollen.

## Ein erstes Template

Das erste Template, das wir erstellen werden, ist eine `ConfigMap`. In
Kubernetes ist eine ConfigMap einfach ein Objekt zum Speichern von
Konfigurationsdaten. Andere Dinge, wie Pods, können auf die Daten in einer
ConfigMap zugreifen.

Da ConfigMaps grundlegende Ressourcen sind, bieten sie uns einen guten
Ausgangspunkt.

Beginnen wir mit der Erstellung einer Datei namens
`mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

**TIPP:** Template-Namen folgen keinem strengen Benennungsmuster. Wir empfehlen
jedoch, die Erweiterung `.yaml` für YAML-Dateien und `.tpl` für Hilfsfunktionen
zu verwenden.

Die obige YAML-Datei ist eine einfache ConfigMap mit den minimal erforderlichen
Feldern. Aufgrund der Tatsache, dass sich diese Datei im Verzeichnis
`mychart/templates/` befindet, wird sie durch die Template-Engine gesendet.

Sie können problemlos eine einfache YAML-Datei wie diese im Verzeichnis
`mychart/templates/` ablegen. Wenn Helm dieses Template liest, sendet es das
Template unverändert an Kubernetes.

Mit diesem einfachen Template haben wir jetzt ein installierbares Chart. Wir
können es so installieren:

```console
$ helm install full-coral ./mychart
NAME: full-coral
LAST DEPLOYED: Tue Nov  1 17:36:01 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

Mit Helm können wir das Release abrufen und das tatsächlich geladene Template
sehen.

```console
$ helm get manifest full-coral

---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

Der Befehl `helm get manifest` nimmt einen Release-Namen (`full-coral`) und gibt
alle Kubernetes-Ressourcen aus, die auf den Server hochgeladen wurden. Jede
Datei beginnt mit `---`, um den Anfang eines YAML-Dokuments anzuzeigen, gefolgt
von einer automatisch generierten Kommentarzeile, die uns sagt, welche
Template-Datei dieses YAML-Dokument generiert hat.

Von dort an können wir sehen, dass die YAML-Daten genau das sind, was wir in
unsere `configmap.yaml`-Datei eingefügt haben.

Jetzt können wir unser Release deinstallieren: `helm uninstall full-coral`.

### Hinzufügen eines einfachen Template-Aufrufs

Das Hardcodieren des `name:`-Felds in eine Ressource wird normalerweise als
schlechte Praxis angesehen. Namen sollten für ein Release eindeutig sein.
Deshalb möchten wir vielleicht ein Namensfeld generieren, indem wir den
Release-Namen einfügen.

**TIPP:** Das `name:`-Feld ist aufgrund von Einschränkungen des DNS-Systems auf
63 Zeichen begrenzt. Aus diesem Grund sind Release-Namen auf 53 Zeichen
begrenzt. Kubernetes 1.3 und früher war auf nur 24 Zeichen beschränkt (somit 14
Zeichen für Namen).

Ändern wir `configmap.yaml` entsprechend.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
```

Die wesentliche Änderung betrifft den Wert des `name:`-Felds, das jetzt
`{{ .Release.Name }}-configmap` ist.

> Eine Template-Direktive ist in `{{` und `}}` Blöcken eingeschlossen.

Die Template-Direktive `{{ .Release.Name }}` fügt den Release-Namen in das
Template ein. Die Werte, die in ein Template übergeben werden, können als
_Namespace-Objekte_ betrachtet werden, wobei ein Punkt (`.`) jedes
Namespace-Element trennt.

Der führende Punkt vor `Release` zeigt an, dass wir mit dem obersten Namespace
für diesen Geltungsbereich beginnen (wir werden den Geltungsbereich gleich
besprechen). Wir könnten `.Release.Name` also lesen als "beginne im obersten
Namespace, finde das `Release`-Objekt, dann suche darin nach einem Objekt
namens `Name`".

Das `Release`-Objekt ist eines der eingebauten Objekte von Helm, und wir werden
es später ausführlicher behandeln. Für den Moment reicht es zu sagen, dass dies
den Release-Namen anzeigt, den die Bibliothek unserem Release zuweist.

Wenn wir jetzt unsere Ressource installieren, sehen wir sofort das Ergebnis der
Verwendung dieser Template-Direktive:

```console
$ helm install clunky-serval ./mychart
NAME: clunky-serval
LAST DEPLOYED: Tue Nov  1 17:45:37 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

Sie können `helm get manifest clunky-serval` ausführen, um das gesamte
generierte YAML zu sehen.

Beachten Sie, dass die ConfigMap innerhalb von Kubernetes nun
`clunky-serval-configmap` heißt statt wie zuvor `mychart-configmap`.

An diesem Punkt haben wir Templates in ihrer einfachsten Form gesehen:
YAML-Dateien mit Template-Direktiven, die in `{{` und `}}` eingebettet sind. Im
nächsten Teil werden wir uns Templates genauer ansehen. Aber bevor wir
weitergehen, gibt es einen schnellen Trick, der das Erstellen von Templates
beschleunigen kann: Wenn Sie das Template-Rendering testen möchten, ohne
tatsächlich etwas zu installieren, können Sie `helm install --debug --dry-run
goodly-guppy ./mychart` verwenden. Dies rendert die Templates. Aber anstatt das
Chart zu installieren, wird das gerenderte Template an Sie zurückgegeben, damit
Sie die Ausgabe sehen können:

```console
$ helm install --debug --dry-run goodly-guppy ./mychart
install.go:149: [debug] Original chart version: ""
install.go:166: [debug] CHART PATH: /Users/ninja/mychart

NAME: goodly-guppy
LAST DEPLOYED: Thu Dec 26 17:24:13 2019
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: nginx
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: false
  hosts:
  - host: chart-example.local
    paths: []
  tls: []
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 1
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: goodly-guppy-configmap
data:
  myvalue: "Hello World"

```

Die Verwendung von `--dry-run` erleichtert das Testen Ihres Codes, garantiert
aber nicht, dass Kubernetes selbst die von Ihnen generierten Templates
akzeptiert. Es ist am besten, nicht davon auszugehen, dass Ihr Chart
installiert wird, nur weil `--dry-run` funktioniert.

In der [Chart-Template-Anleitung](/chart_template_guide/index.mdx) nehmen wir
das hier definierte grundlegende Chart und erkunden die Helm-Template-Sprache im
Detail. Und wir werden mit den eingebauten Objekten beginnen.
