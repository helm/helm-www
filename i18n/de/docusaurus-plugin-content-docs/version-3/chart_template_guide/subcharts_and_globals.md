---
title: Subcharts und globale Werte
description: Arbeiten mit Subchart-Werten und globalen Werten.
sidebar_position: 11
---

Bis zu diesem Punkt haben wir nur mit einem einzelnen Chart gearbeitet. Aber
Charts können Abhängigkeiten haben, sogenannte _Subcharts_, die ebenfalls eigene
Werte und Templates besitzen. In diesem Abschnitt werden wir ein Subchart
erstellen und die verschiedenen Möglichkeiten kennenlernen, wie wir innerhalb
von Templates auf Werte zugreifen können.

Bevor wir uns dem Code widmen, gibt es einige wichtige Details über Subcharts zu
beachten:

1. Ein Subchart gilt als "eigenständig", was bedeutet, dass ein Subchart niemals
   explizit von seinem übergeordneten Chart abhängig sein kann.
2. Aus diesem Grund kann ein Subchart nicht auf die Werte seines übergeordneten
   Charts zugreifen.
3. Ein übergeordnetes Chart kann Werte für Subcharts überschreiben.
4. Helm kennt das Konzept von _globalen Werten_, auf die alle Charts zugreifen
   können.

> Diese Einschränkungen gelten nicht unbedingt für [Library Charts](/topics/library_charts.md), die darauf ausgelegt sind, standardisierte Hilfsfunktionen bereitzustellen.

Beim Durcharbeiten der Beispiele in diesem Abschnitt werden viele dieser
Konzepte deutlicher.

## Erstellen eines Subcharts

Für diese Übungen beginnen wir mit dem `mychart/`-Chart, das wir am Anfang
dieses Leitfadens erstellt haben, und fügen ein neues Chart darin hinzu.

```console
$ cd mychart/charts
$ helm create mysubchart
Creating mysubchart
$ rm -rf mysubchart/templates/*
```

Beachten Sie, dass wir wie zuvor alle Basis-Templates gelöscht haben, damit wir
von Grund auf neu beginnen können. In diesem Leitfaden konzentrieren wir uns auf
die Funktionsweise von Templates, nicht auf die Verwaltung von Abhängigkeiten.
Der [Charts-Leitfaden](/topics/charts.md) enthält weitere Informationen darüber,
wie Subcharts funktionieren.

## Hinzufügen von Werten und einem Template zum Subchart

Als Nächstes erstellen wir ein einfaches Template und eine Values-Datei für
unser `mysubchart`-Chart. Es sollte bereits eine `values.yaml` in
`mychart/charts/mysubchart` vorhanden sein. Wir richten sie wie folgt ein:

```yaml
dessert: cake
```

Als Nächstes erstellen wir ein neues ConfigMap-Template in
`mychart/charts/mysubchart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
```

Da jedes Subchart ein _eigenständiges Chart_ ist, können wir `mysubchart`
einzeln testen:

```console
$ helm install --generate-name --dry-run --debug mychart/charts/mysubchart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart/charts/mysubchart
NAME:   newbie-elk
TARGET NAMESPACE:   default
CHART:  mysubchart 0.1.0
MANIFEST:
---
# Source: mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: newbie-elk-cfgmap2
data:
  dessert: cake
```

## Überschreiben von Werten aus einem übergeordneten Chart

Unser ursprüngliches Chart `mychart` ist nun das _übergeordnete Chart_ von
`mysubchart`. Diese Beziehung ergibt sich ausschließlich daraus, dass sich
`mysubchart` im Verzeichnis `mychart/charts` befindet.

Da `mychart` ein übergeordnetes Chart ist, können wir Konfigurationen in
`mychart` festlegen und diese an `mysubchart` weitergeben. Zum Beispiel können
wir `mychart/values.yaml` wie folgt ändern:

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream
```

Beachten Sie die letzten beiden Zeilen. Alle Anweisungen innerhalb des
`mysubchart`-Abschnitts werden an das `mysubchart`-Chart gesendet. Wenn wir also
`helm install --generate-name --dry-run --debug mychart` ausführen, werden wir
unter anderem die `mysubchart`-ConfigMap sehen:

```yaml
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: unhinged-bee-cfgmap2
data:
  dessert: ice cream
```

Der Wert auf der obersten Ebene hat nun den Wert des Subcharts überschrieben.

Hier gibt es ein wichtiges Detail zu beachten. Wir haben das Template von
`mychart/charts/mysubchart/templates/configmap.yaml` nicht geändert, um auf
`.Values.mysubchart.dessert` zu verweisen. Aus Sicht dieses Templates befindet
sich der Wert weiterhin unter `.Values.dessert`. Da die Template-Engine Werte
weiterreicht, legt sie den Gültigkeitsbereich fest. Für die `mysubchart`-Templates
sind also nur Werte verfügbar, die speziell für `mysubchart` bestimmt sind.

Manchmal möchten Sie jedoch, dass bestimmte Werte für alle Templates verfügbar
sind. Dies wird durch globale Chart-Werte erreicht.

## Globale Chart-Werte

Globale Werte sind Werte, auf die von jedem Chart oder Subchart unter genau
demselben Namen zugegriffen werden kann. Globale Werte erfordern eine explizite
Deklaration. Sie können einen vorhandenen nicht-globalen Wert nicht verwenden,
als wäre er global.

Der Values-Datentyp hat einen reservierten Abschnitt namens `Values.global`, in
dem globale Werte gesetzt werden können. Fügen wir einen in unserer
`mychart/values.yaml`-Datei hinzu.

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream

global:
  salad: caesar
```

Aufgrund der Funktionsweise von globalen Werten sollten sowohl
`mychart/templates/configmap.yaml` als auch
`mysubchart/templates/configmap.yaml` auf diesen Wert als
`{{ .Values.global.salad }}` zugreifen können.

`mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  salad: {{ .Values.global.salad }}
```

`mysubchart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
  salad: {{ .Values.global.salad }}
```

Wenn wir nun eine Testinstallation durchführen, sehen wir denselben Wert in
beiden Ausgaben:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-configmap
data:
  salad: caesar

---
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-cfgmap2
data:
  dessert: ice cream
  salad: caesar
```

Globale Werte sind nützlich, um solche Informationen weiterzugeben, erfordern
jedoch eine gewisse Planung, um sicherzustellen, dass die richtigen Templates
für die Verwendung globaler Werte konfiguriert sind.

## Templates mit Subcharts teilen

Übergeordnete Charts und Subcharts können Templates gemeinsam nutzen. Jeder
definierte Block in einem Chart ist auch für andere Charts verfügbar.

Zum Beispiel können wir ein einfaches Template wie dieses definieren:

```yaml
{{- define "labels" }}from: mychart{{ end }}
```

Erinnern Sie sich daran, dass Labels in Templates _global geteilt_ werden.
Daher kann das `labels`-Template von jedem anderen Chart eingebunden werden.

Obwohl Chart-Entwickler zwischen `include` und `template` wählen können, hat
`include` den Vorteil, dass es Templates dynamisch referenzieren kann:

```yaml
{{ include $mytemplate }}
```

Das obige Beispiel dereferenziert `$mytemplate`. Die `template`-Funktion
hingegen akzeptiert nur ein String-Literal.

## Vermeiden von Blocks

Die Go-Template-Sprache bietet ein `block`-Schlüsselwort, mit dem Entwickler
eine Standardimplementierung bereitstellen können, die später überschrieben
wird. In Helm Charts sind Blocks nicht das beste Werkzeug zum Überschreiben,
da bei mehreren Implementierungen desselben Blocks nicht vorhersehbar ist,
welche ausgewählt wird.

Die Empfehlung ist, stattdessen `include` zu verwenden.
