---
title: Library Charts
description: Erläutert Library Charts und zeigt Anwendungsbeispiele
sidebar_position: 4
---

Ein Library Chart ist ein spezieller Typ von [Helm Chart](/topics/charts.md),
der Chart-Primitive oder -Definitionen bereitstellt, die von Helm-Templates
in anderen Charts verwendet werden können. So lassen sich Code-Snippets
über mehrere Charts hinweg gemeinsam nutzen, wodurch Wiederholungen vermieden
und Charts [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) gehalten werden.

Das Library Chart wurde in Helm 3 eingeführt, um offiziell gemeinsam genutzte Charts
oder Helper Charts anzuerkennen, die von Chart-Maintainern bereits seit Helm 2
verwendet werden. Durch die Definition als eigener Chart-Typ bietet es:
- Eine Möglichkeit zur expliziten Unterscheidung zwischen gemeinsam genutzten Charts
  und Anwendungs-Charts
- Logik zur Verhinderung der Installation eines gemeinsam genutzten Charts
- Kein Rendering von Templates in einem gemeinsam genutzten Chart, die Release-Artefakte
  enthalten könnten
- Die Möglichkeit für abhängige Charts, den Kontext des importierenden Charts zu nutzen

Ein Chart-Maintainer kann ein gemeinsam genutztes Chart als Library Chart definieren
und sicher sein, dass Helm das Chart auf eine standardisierte und konsistente Weise
behandelt. Darüber hinaus können Definitionen aus einem Anwendungs-Chart geteilt werden,
indem einfach der Chart-Typ geändert wird.

## Ein einfaches Library Chart erstellen

Wie bereits erwähnt, ist ein Library Chart ein spezieller Typ von
[Helm Chart](/topics/charts.md). Das bedeutet, dass Sie mit der Erstellung
eines Grundgerüst-Charts beginnen können:

```console
$ helm create mylibchart
Creating mylibchart
```

Zunächst entfernen Sie alle Dateien im Verzeichnis `templates`, da wir in diesem
Beispiel eigene Template-Definitionen erstellen werden.

```console
$ rm -rf mylibchart/templates/*
```

Die Values-Datei wird ebenfalls nicht benötigt.

```console
$ rm -f mylibchart/values.yaml
```

Bevor wir mit dem Erstellen von gemeinsam genutztem Code beginnen, gehen wir kurz
einige relevante Helm-Konzepte durch. Ein
[benanntes Template](/chart_template_guide/named_templates.md)
(manchmal auch Partial oder Subtemplate genannt) ist einfach ein Template, das in
einer Datei definiert und mit einem Namen versehen wird. Im Verzeichnis `templates/`
wird jede Datei, die mit einem Unterstrich (_) beginnt, nicht als Kubernetes-Manifest
ausgegeben. Daher werden Hilfs-Templates und Partials üblicherweise in
`_*.tpl`- oder `_*.yaml`-Dateien abgelegt.

In diesem Beispiel erstellen wir eine gemeinsam nutzbare ConfigMap, die eine leere
ConfigMap-Ressource definiert. Wir definieren die gemeinsame ConfigMap in der Datei
`mylibchart/templates/_configmap.yaml` wie folgt:

```yaml
{{- define "mylibchart.configmap.tpl" -}}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data: {}
{{- end -}}
{{- define "mylibchart.configmap" -}}
{{- include "mylibchart.util.merge" (append . "mylibchart.configmap.tpl") -}}
{{- end -}}
```

Das ConfigMap-Konstrukt wird im benannten Template `mylibchart.configmap.tpl` definiert.
Es handelt sich um eine einfache ConfigMap mit einer leeren Ressource, `data`. In
dieser Datei gibt es ein weiteres benanntes Template namens `mylibchart.configmap`.
Dieses benannte Template bindet ein anderes benanntes Template `mylibchart.util.merge`
ein, das 2 benannte Templates als Argumente entgegennimmt: das Template, das
`mylibchart.configmap` aufruft, und `mylibchart.configmap.tpl`.

Die Hilfsfunktion `mylibchart.util.merge` ist ein benanntes Template in
`mylibchart/templates/_util.yaml`. Es handelt sich um ein praktisches Hilfsmittel
aus [The Common Helm Helper Chart](#the-common-helm-helper-chart), da es die
2 Templates zusammenführt und gemeinsame Teile in beiden überschreibt:

```yaml
{{- /*
mylibchart.util.merge will merge two YAML templates and output the result.
This takes an array of three values:
- the top context
- the template name of the overrides (destination)
- the template name of the base (source)
*/}}
{{- define "mylibchart.util.merge" -}}
{{- $top := first . -}}
{{- $overrides := fromYaml (include (index . 1) $top) | default (dict ) -}}
{{- $tpl := fromYaml (include (index . 2) $top) | default (dict ) -}}
{{- toYaml (merge $overrides $tpl) -}}
{{- end -}}
```

Dies ist wichtig, wenn ein Chart gemeinsamen Code verwenden möchte, den es mit
seiner eigenen Konfiguration anpassen muss.

Zum Schluss ändern wir den Chart-Typ zu `library`. Dazu muss
`mylibchart/Chart.yaml` wie folgt bearbeitet werden:

```yaml
apiVersion: v2
name: mylibchart
description: A Helm chart for Kubernetes

# A chart can be either an 'application' or a 'library' chart.
#
# Application charts are a collection of templates that can be packaged into versioned archives
# to be deployed.
#
# Library charts provide useful utilities or functions for the chart developer. They're included as
# a dependency of application charts to inject those utilities and functions into the rendering
# pipeline. Library charts do not define any templates and therefore cannot be deployed.
# type: application
type: library

# This is the chart version. This version number should be incremented each time you make changes
# to the chart and its templates, including the app version.
version: 0.1.0

# This is the version number of the application being deployed. This version number should be
# incremented each time you make changes to the application and it is recommended to use it with quotes.
appVersion: "1.16.0"
```

Das Library Chart ist nun bereit zum Teilen und seine ConfigMap-Definition kann
wiederverwendet werden.

Bevor Sie fortfahren, lohnt es sich zu überprüfen, ob Helm das Chart als Library
Chart erkennt:

```console
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

## Das einfache Library Chart verwenden

Es ist nun Zeit, das Library Chart zu verwenden. Das bedeutet, wieder ein
Grundgerüst-Chart zu erstellen:

```console
$ helm create mychart
Creating mychart
```

Entfernen wir wieder die Template-Dateien, da wir nur eine ConfigMap erstellen möchten:

```console
$ rm -rf mychart/templates/*
```

Wenn wir eine einfache ConfigMap in einem Helm-Template erstellen möchten, könnte
sie etwa so aussehen:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data:
  myvalue: "Hello World"
```

Wir werden jedoch den bereits in `mylibchart` erstellten gemeinsamen Code
wiederverwenden. Die ConfigMap kann in der Datei `mychart/templates/configmap.yaml`
wie folgt erstellt werden:

```yaml
{{- include "mylibchart.configmap" (list . "mychart.configmap") -}}
{{- define "mychart.configmap" -}}
data:
  myvalue: "Hello World"
{{- end -}}
```

Sie sehen, dass sich die Arbeit vereinfacht, indem die gemeinsame ConfigMap-Definition
geerbt wird, die Standardeigenschaften für ConfigMaps hinzufügt. In unserem Template
fügen wir die Konfiguration hinzu, in diesem Fall den Datenschlüssel `myvalue` und
seinen Wert. Die Konfiguration überschreibt die leere Ressource der gemeinsamen
ConfigMap. Dies ist möglich dank der Hilfsfunktion `mylibchart.util.merge`, die
wir im vorherigen Abschnitt erwähnt haben.

Um den gemeinsamen Code verwenden zu können, müssen wir `mylibchart` als Abhängigkeit
hinzufügen. Fügen Sie Folgendes am Ende der Datei `mychart/Chart.yaml` hinzu:

```yaml
# My common code in my library chart
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

Dies bindet das Library Chart als dynamische Abhängigkeit aus dem Dateisystem ein,
das sich auf derselben übergeordneten Pfadebene wie unser Anwendungs-Chart befindet.
Da wir das Library Chart als dynamische Abhängigkeit einbinden, müssen wir
`helm dependency update` ausführen. Dieser Befehl kopiert das Library Chart in Ihr
Verzeichnis `charts/`.

```console
$ helm dependency update mychart/
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 1 charts
Deleting outdated charts
```

Wir sind nun bereit, unser Chart zu deployen. Vor der Installation lohnt es sich,
zunächst das gerenderte Template zu überprüfen.

```console
$ helm install mydemo mychart/ --debug --dry-run
install.go:159: [debug] Original chart version: ""
install.go:176: [debug] CHART PATH: /root/test/helm-charts/mychart

NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:48:47 2020
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
mylibchart:
  global: {}
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
  annotations: {}
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
```

Das sieht nach der ConfigMap aus, die wir wollen, mit dem überschriebenen Datenwert
`myvalue: Hello World`. Lassen Sie uns das Chart installieren:

```console
$ helm install mydemo mychart/
NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:52:40 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

Wir können das Release abrufen und sehen, dass das eigentliche Template geladen wurde.

```console
$ helm get manifest mydemo
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
  ```

## Vorteile von Library Charts

Da Library Charts nicht als eigenständige Charts fungieren können, bieten sie
folgende Funktionalität:
- Das `.Files`-Objekt verweist auf die Dateipfade des übergeordneten Charts,
  nicht auf den lokalen Pfad des Library Charts
- Das `.Values`-Objekt ist identisch mit dem des übergeordneten Charts, im
  Gegensatz zu Anwendungs-[Subcharts](/chart_template_guide/subcharts_and_globals.md),
  die den Abschnitt der Values erhalten, der unter ihrem Header im übergeordneten
  Chart konfiguriert ist


## The Common Helm Helper Chart

```markdown
Note: The Common Helm Helper Chart repo on Github is no longer actively maintained, and the repo has been deprecated and archived.
```

Dieses [Chart](https://github.com/helm/charts/tree/master/incubator/common) war
das ursprüngliche Muster für Library Charts. Es bietet Hilfsmittel, die Best
Practices der Kubernetes-Chart-Entwicklung widerspiegeln. Der besondere Vorteil:
Sie können es bei der Entwicklung Ihrer Charts sofort verwenden, um praktischen
gemeinsamen Code zu nutzen.

Hier ist eine schnelle Möglichkeit, es zu verwenden. Weitere Details finden Sie
in der [README](https://github.com/helm/charts/blob/master/incubator/common/README.md).

Erstellen Sie wieder ein Grundgerüst-Chart:

```console
$ helm create demo
Creating demo
```

Verwenden wir den gemeinsamen Code aus dem Helper Chart. Bearbeiten Sie zunächst
das Deployment `demo/templates/deployment.yaml` wie folgt:

```yaml
{{- template "common.deployment" (list . "demo.deployment") -}}
{{- define "demo.deployment" -}}
## Define overrides for your Deployment resource here, e.g.
apiVersion: apps/v1
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "demo.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "demo.selectorLabels" . | nindent 8 }}

{{- end -}}
```

Und nun die Service-Datei `demo/templates/service.yaml` wie folgt:

```yaml
{{- template "common.service" (list . "demo.service") -}}
{{- define "demo.service" -}}
## Define overrides for your Service resource here, e.g.
# metadata:
#   labels:
#     custom: label
# spec:
#   ports:
#   - port: 8080
{{- end -}}
```

Diese Templates zeigen, wie das Erben von gemeinsam genutztem Code aus dem Helper
Chart Ihre Arbeit auf die Konfiguration oder Anpassung der Ressourcen reduziert.

Um den gemeinsamen Code verwenden zu können, müssen wir `common` als Abhängigkeit
hinzufügen. Fügen Sie Folgendes am Ende der Datei `demo/Chart.yaml` hinzu:

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"
```

Hinweis: Sie müssen das `incubator`-Repository zur Helm-Repository-Liste hinzufügen
(`helm repo add`).

Da wir das Chart als dynamische Abhängigkeit einbinden, müssen wir
`helm dependency update` ausführen. Dieser Befehl kopiert das Helper Chart in
Ihr Verzeichnis `charts/`.

Da das Helper Chart einige Helm 2-Konstrukte verwendet, müssen Sie Folgendes zu
`demo/values.yaml` hinzufügen, um das `nginx`-Image zu laden, da dies im
Helm 3-Grundgerüst-Chart aktualisiert wurde:

```yaml
image:
  tag: 1.16.0
```

Sie können mit den Befehlen `helm lint` und `helm template` testen, ob die
Chart-Templates korrekt sind, bevor Sie sie deployen.

Wenn alles in Ordnung ist, deployen Sie mit `helm install`!
