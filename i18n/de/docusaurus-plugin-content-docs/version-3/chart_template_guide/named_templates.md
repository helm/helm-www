---
title: Benannte Templates
description: Wie man benannte Templates definiert.
sidebar_position: 9
---

Nun ist es an der Zeit, über ein einzelnes Template hinauszugehen und weitere zu
erstellen. In diesem Abschnitt werden wir sehen, wie man _benannte Templates_ in
einer Datei definiert und sie an anderer Stelle verwendet. Ein _benanntes
Template_ (manchmal auch _Partial_ oder _Subtemplate_ genannt) ist einfach ein
Template, das innerhalb einer Datei definiert und mit einem Namen versehen wird.
Wir werden zwei Möglichkeiten kennenlernen, sie zu erstellen, und verschiedene
Wege, sie zu verwenden.

Im Abschnitt [Kontrollstrukturen](./control_structures.md) haben wir drei
Aktionen zur Deklaration und Verwaltung von Templates vorgestellt: `define`,
`template` und `block`. In diesem Abschnitt werden wir diese drei Aktionen
behandeln und auch eine spezielle `include`-Funktion vorstellen, die ähnlich wie
die `template`-Aktion funktioniert.

Ein wichtiges Detail beim Benennen von Templates: **Template-Namen sind
global**. Wenn Sie zwei Templates mit demselben Namen deklarieren, wird
dasjenige verwendet, das zuletzt geladen wurde. Da Templates in Subcharts
zusammen mit Top-Level-Templates kompiliert werden, sollten Sie Ihre Templates
mit _chart-spezifischen Namen_ versehen.

Eine beliebte Namenskonvention besteht darin, jedem definierten Template den
Namen des Charts voranzustellen: `{{ define "mychart.labels" }}`. Durch die
Verwendung des spezifischen Chart-Namens als Präfix können Konflikte vermieden
werden, die entstehen könnten, wenn zwei verschiedene Charts Templates mit
demselben Namen implementieren.

Dieses Verhalten gilt auch für verschiedene Versionen eines Charts. Wenn Sie
`mychart` Version `1.0.0` haben, die ein Template auf eine bestimmte Weise
definiert, und eine `mychart` Version `2.0.0`, die das vorhandene benannte
Template modifiziert, wird dasjenige verwendet, das zuletzt geladen wurde. Sie
können dieses Problem umgehen, indem Sie auch eine Version im Namen des Charts
hinzufügen: `{{ define "mychart.v1.labels" }}` und
`{{ define "mychart.v2.labels" }}`.

## Partials und `_`-Dateien

Bisher haben wir eine Datei verwendet, und diese eine Datei enthielt ein
einzelnes Template. Aber die Template-Sprache von Helm ermöglicht es Ihnen,
benannte eingebettete Templates zu erstellen, auf die an anderer Stelle per
Name zugegriffen werden kann.

Bevor wir uns mit den Details des Schreibens dieser Templates befassen, gibt es
eine Dateibenennungskonvention, die erwähnt werden sollte:

* Die meisten Dateien in `templates/` werden so behandelt, als ob sie
  Kubernetes-Manifeste enthalten
* Die `NOTES.txt` ist eine Ausnahme
* Aber Dateien, deren Name mit einem Unterstrich (`_`) beginnt, enthalten
  annahmegemäß _kein_ Manifest. Diese Dateien werden nicht als
  Kubernetes-Objektdefinitionen gerendert, sind aber überall in anderen
  Chart-Templates zur Verwendung verfügbar.

Diese Dateien werden verwendet, um Partials und Hilfsfunktionen zu speichern.
Tatsächlich haben wir bei der Erstellung von `mychart` eine Datei namens
`_helpers.tpl` gesehen. Diese Datei ist der Standardspeicherort für
Template-Partials.

## Templates mit `define` und `template` deklarieren und verwenden

Die `define`-Aktion ermöglicht es uns, ein benanntes Template innerhalb einer
Template-Datei zu erstellen. Die Syntax sieht folgendermaßen aus:

```yaml
{{- define "MY.NAME" }}
  # body of template here
{{- end }}
```

Zum Beispiel können wir ein Template definieren, um einen Block von
Kubernetes-Labels zu kapseln:

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

Jetzt können wir dieses Template in unsere vorhandene ConfigMap einbetten und es
dann mit der `template`-Aktion einbinden:

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

Wenn die Template-Engine diese Datei liest, speichert sie die Referenz auf
`mychart.labels`, bis `template "mychart.labels"` aufgerufen wird. Dann wird
dieses Template inline gerendert. Das Ergebnis sieht so aus:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: running-panda-configmap
  labels:
    generator: helm
    date: 2016-11-02
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

Hinweis: Ein `define` erzeugt keine Ausgabe, es sei denn, es wird mit template
aufgerufen, wie in diesem Beispiel.

Konventionell legen Helm Charts diese Templates in einer Partials-Datei ab,
üblicherweise `_helpers.tpl`. Verschieben wir diese Funktion dorthin:

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

Konventionsgemäß sollten `define`-Funktionen einen einfachen Dokumentationsblock
(`{{/* ... */}}`) haben, der beschreibt, was sie tun.

Obwohl diese Definition in `_helpers.tpl` steht, kann sie dennoch in
`configmap.yaml` verwendet werden:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

Wie oben erwähnt, **sind Template-Namen global**. Wenn daher zwei Templates mit
demselben Namen deklariert werden, wird das zuletzt vorkommende verwendet. Da
Templates in Subcharts zusammen mit Top-Level-Templates kompiliert werden, ist
es am besten, Ihre Templates mit _chart-spezifischen Namen_ zu versehen. Eine
beliebte Namenskonvention besteht darin, jedem definierten Template den Namen
des Charts voranzustellen: `{{ define "mychart.labels" }}`.

## Den Gültigkeitsbereich eines Templates festlegen

In dem oben definierten Template haben wir keine Objekte verwendet, sondern nur
Funktionen. Ändern wir unser definiertes Template so, dass es den Chart-Namen
und die Chart-Version enthält:

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
    chart: {{ .Chart.Name }}
    version: {{ .Chart.Version }}
{{- end }}
```

Wenn wir dies rendern, erhalten wir einen Fehler wie diesen:

```console
$ helm install --dry-run moldy-jaguar ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [unknown object type "nil" in ConfigMap.metadata.labels.chart, unknown object type "nil" in ConfigMap.metadata.labels.version]
```

Um zu sehen, was gerendert wurde, führen Sie den Befehl mit
`--disable-openapi-validation` erneut aus:
`helm install --dry-run --disable-openapi-validation moldy-jaguar ./mychart`.
Das Ergebnis wird nicht dem entsprechen, was wir erwarten:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: moldy-jaguar-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart:
    version:
```

Was ist mit dem Namen und der Version passiert? Sie waren nicht im
Gültigkeitsbereich unseres definierten Templates. Wenn ein benanntes Template
(erstellt mit `define`) gerendert wird, erhält es den Gültigkeitsbereich, der
vom `template`-Aufruf übergeben wird. In unserem Beispiel haben wir das Template
so eingebunden:

```yaml
{{- template "mychart.labels" }}
```

Es wurde kein Gültigkeitsbereich übergeben, daher können wir innerhalb des
Templates auf nichts in `.` zugreifen. Das lässt sich aber leicht beheben. Wir
übergeben einfach einen Gültigkeitsbereich an das Template:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" . }}
```

Beachten Sie, dass wir `.` am Ende des `template`-Aufrufs übergeben. Wir könnten
genauso gut `.Values` oder `.Values.favorite` oder einen beliebigen anderen
Gültigkeitsbereich übergeben. Aber wir möchten den Top-Level-Gültigkeitsbereich.
Im Kontext des benannten Templates verweist `$` auf den Gültigkeitsbereich, den
Sie übergeben haben, und nicht auf einen globalen Gültigkeitsbereich.

Wenn wir dieses Template nun mit `helm install --dry-run --debug
plinking-anaco ./mychart` ausführen, erhalten wir folgendes:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: plinking-anaco-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart: mychart
    version: 0.1.0
```

Jetzt wird `{{ .Chart.Name }}` zu `mychart` aufgelöst und `{{ .Chart.Version }}`
zu `0.1.0`.

## Die `include`-Funktion

Nehmen wir an, wir haben ein einfaches Template definiert, das so aussieht:

```yaml
{{- define "mychart.app" -}}
app_name: {{ .Chart.Name }}
app_version: "{{ .Chart.Version }}"
{{- end -}}
```

Nehmen wir nun an, ich möchte dies sowohl in den `labels:`-Abschnitt meines
Templates als auch in den `data:`-Abschnitt einfügen:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
    {{ template "mychart.app" . }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ template "mychart.app" . }}
```

Wenn wir dies rendern, erhalten wir einen Fehler wie diesen:

```console
$ helm install --dry-run measly-whippet ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [ValidationError(ConfigMap): unknown field "app_name" in io.k8s.api.core.v1.ConfigMap, ValidationError(ConfigMap): unknown field "app_version" in io.k8s.api.core.v1.ConfigMap]
```

Um zu sehen, was gerendert wurde, führen Sie den Befehl mit
`--disable-openapi-validation` erneut aus:
`helm install --dry-run --disable-openapi-validation measly-whippet ./mychart`.
Die Ausgabe wird nicht dem entsprechen, was wir erwarten:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: measly-whippet-configmap
  labels:
    app_name: mychart
app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
app_name: mychart
app_version: "0.1.0"
```

Beachten Sie, dass die Einrückung bei `app_version` an beiden Stellen falsch
ist. Warum? Weil das eingefügte Template den Text linksbündig ausgerichtet hat.
Da `template` eine Aktion und keine Funktion ist, gibt es keine Möglichkeit, die
Ausgabe eines `template`-Aufrufs an andere Funktionen zu übergeben; die Daten
werden einfach inline eingefügt.

Um diesen Fall zu umgehen, bietet Helm eine Alternative zu `template`, die den
Inhalt eines Templates in die aktuelle Pipeline importiert, wo er an andere
Funktionen in der Pipeline weitergegeben werden kann.

Hier ist das obige Beispiel, korrigiert mit `indent`, um das `mychart.app`-
Template korrekt einzurücken:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
{{ include "mychart.app" . | indent 4 }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ include "mychart.app" . | indent 2 }}
```

Jetzt ist das erzeugte YAML für jeden Abschnitt korrekt eingerückt:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-mole-configmap
  labels:
    app_name: mychart
    app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
  app_name: mychart
  app_version: "0.1.0"
```

> In Helm Templates wird die Verwendung von `include` gegenüber `template`
> bevorzugt, einfach weil die Ausgabeformatierung für YAML-Dokumente besser
> gehandhabt werden kann.

Manchmal möchten wir Inhalte importieren, aber nicht als Templates. Das heißt,
wir möchten Dateien unverändert importieren. Dies können wir erreichen, indem
wir über das `.Files`-Objekt auf Dateien zugreifen, das im nächsten Abschnitt
beschrieben wird.
