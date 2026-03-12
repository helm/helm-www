---
title: Ablaufsteuerung
description: Ein kurzer Überblick über die Ablaufstrukturen in Templates.
sidebar_position: 7
---

Kontrollstrukturen (in der Template-Terminologie "Aktionen" genannt) bieten
Ihnen als Template-Autor die Möglichkeit, den Ablauf der Template-Generierung
zu steuern. Die Template-Sprache von Helm bietet die folgenden
Kontrollstrukturen:

- `if`/`else` zum Erstellen von bedingten Blöcken
- `with` zum Festlegen eines Geltungsbereichs
- `range`, das eine "für jedes"-Schleife bereitstellt

Zusätzlich zu diesen bietet sie einige Aktionen zum Deklarieren und Verwenden
von benannten Template-Segmenten:

- `define` deklariert ein neues benanntes Template innerhalb Ihres Templates
- `template` importiert ein benanntes Template
- `block` deklariert einen speziellen, ausfüllbaren Template-Bereich

In diesem Abschnitt behandeln wir `if`, `with` und `range`. Die anderen werden
im Abschnitt "Benannte Templates" später in dieser Anleitung behandelt.

## If/Else

Die erste Kontrollstruktur, die wir uns ansehen werden, dient zum bedingten
Einbinden von Textblöcken in einem Template. Dies ist der `if`/`else`-Block.

Die grundlegende Struktur für eine Bedingung sieht so aus:

```
{{ if PIPELINE }}
  # Do something
{{ else if OTHER PIPELINE }}
  # Do something else
{{ else }}
  # Default case
{{ end }}
```

Beachten Sie: Hier geht es um _Pipelines_, nicht nur um einzelne Werte. Der
Grund dafür ist, klarzumachen, dass Kontrollstrukturen eine ganze Pipeline
ausführen können – nicht nur einen Wert auswerten.

Eine Pipeline wird als _false_ ausgewertet, wenn der Wert:

- ein boolesches false ist
- eine numerische Null ist
- ein leerer String ist
- `nil` (leer oder null) ist
- eine leere Sammlung (`map`, `slice`, `tuple`, `dict`, `array`) ist

Unter allen anderen Bedingungen ist die Bedingung wahr.

Fügen wir eine einfache Bedingung zu unserer ConfigMap hinzu. Wir fügen eine
weitere Einstellung hinzu, wenn das Getränk auf Kaffee gesetzt ist:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}mug: "true"{{ end }}
```

Da wir `drink: coffee` in unserem letzten Beispiel auskommentiert haben, sollte
die Ausgabe kein `mug: "true"` Flag enthalten. Aber wenn wir diese Zeile in
unsere `values.yaml`-Datei zurücksetzen, sollte die Ausgabe so aussehen:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

## Steuerung von Leerzeichen

Während wir uns mit Bedingungen beschäftigen, sollten wir einen kurzen Blick
darauf werfen, wie Leerzeichen in Templates gesteuert werden. Nehmen wir das
vorherige Beispiel und formatieren es etwas leserlicher:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
    mug: "true"
  {{ end }}
```

Zunächst sieht das gut aus. Aber wenn wir es durch die Template-Engine laufen
lassen, erhalten wir ein unglückliches Ergebnis:

```console
$ helm install --dry-run --debug ./mychart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart
Error: YAML parse error on mychart/templates/configmap.yaml: error converting YAML to JSON: yaml: line 9: did not find expected key
```

Was ist passiert? Wir haben wegen der obigen Leerzeichen ungültiges YAML
generiert.

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
    mug: "true"
```

`mug` ist falsch eingerückt. Lassen Sie uns einfach diese eine Zeile nach links
verschieben und erneut ausführen:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{ end }}
```

Wenn wir das ausführen, erhalten wir YAML, das gültig ist, aber immer noch
etwas seltsam aussieht:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: telling-chimp-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"

  mug: "true"

```

Beachten Sie, dass wir einige Leerzeilen in unserem YAML erhalten haben. Warum?
Wenn die Template-Engine läuft, _entfernt_ sie den Inhalt innerhalb von `{{`
und `}}`, lässt aber die verbleibenden Leerzeichen genau so, wie sie sind.

YAML misst Leerzeichen eine Bedeutung bei, daher wird die Verwaltung von
Leerzeichen ziemlich wichtig. Glücklicherweise haben Helm-Templates einige
Werkzeuge, um dabei zu helfen.

Erstens kann die geschweifte Klammer-Syntax von Template-Deklarationen mit
speziellen Zeichen modifiziert werden, um der Template-Engine mitzuteilen, dass
sie Leerzeichen entfernen soll. `{{- ` (mit dem Bindestrich und Leerzeichen)
zeigt an, dass Leerzeichen links entfernt werden sollen, während ` -}}`
bedeutet, dass Leerzeichen rechts entfernt werden sollen. _Vorsicht! Zeilenumbrüche
sind auch Leerzeichen!_

> Stellen Sie sicher, dass zwischen dem `-` und dem Rest Ihrer Direktive ein
> Leerzeichen steht. `{{- 3 }}` bedeutet "entferne Leerzeichen links und gib 3 aus",
> während `{{-3 }}` "gib -3 aus" bedeutet.

Mit dieser Syntax können wir unser Template ändern, um diese Leerzeilen
loszuwerden:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{- end }}
```

Zur Verdeutlichung passen wir das Obige an und ersetzen ein `*` für jedes
Leerzeichen, das nach dieser Regel gelöscht wird. Ein `*` am Ende der Zeile
zeigt ein Zeilenumbruchzeichen an, das entfernt würde:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}*
**{{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"*
**{{- end }}

```

Mit diesem Wissen können wir unser Template durch Helm ausführen und das
Ergebnis sehen:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: clunky-cat-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

Vorsicht bei den Entfernungsmodifikatoren. Es ist leicht, versehentlich so
etwas zu tun:

```yaml
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" -}}
  mug: "true"
  {{- end -}}

```

Das erzeugt `food: "PIZZA"mug: "true"`, weil es die Zeilenumbrüche auf beiden
Seiten entfernt hat.

> Für Details zur Leerzeichen-Steuerung in Templates siehe die [offizielle Go
> Template-Dokumentation](https://godoc.org/text/template)

Schließlich ist es manchmal einfacher, dem Template-System zu sagen, wie es für
Sie einrücken soll, anstatt zu versuchen, die Abstände der Template-Direktiven
zu meistern. Aus diesem Grund kann es manchmal nützlich sein, die `indent`-
Funktion zu verwenden (`{{ indent 2 "mug:true" }}`).

## Geltungsbereich ändern mit `with`

Die nächste Kontrollstruktur, die wir uns ansehen werden, ist die `with`-Aktion.
Diese steuert den Geltungsbereich von Variablen. Zur Erinnerung: `.` ist eine
Referenz auf _den aktuellen Geltungsbereich_. So sagt `.Values` dem Template,
dass es das `Values`-Objekt im aktuellen Geltungsbereich finden soll.

Die Syntax für `with` ähnelt einer einfachen `if`-Anweisung:

```
{{ with PIPELINE }}
  # restricted scope
{{ end }}
```

Geltungsbereiche können geändert werden. `with` kann es Ihnen ermöglichen, den
aktuellen Geltungsbereich (`.`) auf ein bestimmtes Objekt zu setzen. Zum
Beispiel haben wir mit `.Values.favorite` gearbeitet. Lassen Sie uns unsere
ConfigMap umschreiben, um den `.`-Geltungsbereich so zu ändern, dass er auf
`.Values.favorite` zeigt:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
```

Beachten Sie, dass wir die `if`-Bedingung aus der vorherigen Übung entfernt
haben, weil sie jetzt nicht mehr notwendig ist – der Block nach `with` wird
nur ausgeführt, wenn der Wert der `PIPELINE` nicht leer ist.

Beachten Sie, dass wir jetzt `.drink` und `.food` ohne Qualifizierung
referenzieren können. Das liegt daran, dass die `with`-Anweisung `.` so setzt,
dass es auf `.Values.favorite` zeigt. Der `.` wird nach `{{ end }}` auf seinen
vorherigen Geltungsbereich zurückgesetzt.

Aber Vorsicht! Innerhalb des eingeschränkten Geltungsbereichs können Sie nicht
mit `.` auf die anderen Objekte aus dem übergeordneten Geltungsbereich
zugreifen. Das folgende Beispiel wird fehlschlagen:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

Es wird einen Fehler erzeugen, weil `Release.Name` nicht innerhalb des
eingeschränkten Geltungsbereichs für `.` liegt. Wenn wir jedoch die letzten
beiden Zeilen vertauschen, funktioniert alles wie erwartet, weil der
Geltungsbereich nach `{{ end }}` zurückgesetzt wird.

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  release: {{ .Release.Name }}
```

Oder wir können `$` verwenden, um auf das Objekt `Release.Name` aus dem
übergeordneten Geltungsbereich zuzugreifen. `$` wird bei Beginn der
Template-Ausführung auf den Root-Geltungsbereich gemappt und ändert sich
während der Template-Ausführung nicht. Das Folgende würde ebenfalls
funktionieren:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $.Release.Name }}
  {{- end }}
```

Nachdem wir uns `range` angesehen haben, werden wir einen Blick auf
Template-Variablen werfen, die eine Lösung für das obige Geltungsbereichsproblem
bieten.

## Schleifen mit der `range`-Aktion

Viele Programmiersprachen unterstützen Schleifen mit `for`-Schleifen, `foreach`-
Schleifen oder ähnlichen funktionalen Mechanismen. In der Template-Sprache von
Helm ist die Methode zum Iterieren durch eine Sammlung der `range`-Operator.

Zunächst fügen wir eine Liste von Pizza-Belägen zu unserer `values.yaml`-Datei
hinzu:

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions
  - pineapple
```

Jetzt haben wir eine Liste (in Templates `slice` genannt) von `pizzaToppings`.
Wir können unser Template ändern, um diese Liste in unsere ConfigMap
auszugeben:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  toppings: |-
    {{- range .Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}

```

Wir können `$` verwenden, um auf die Liste `Values.pizzaToppings` aus dem
übergeordneten Geltungsbereich zuzugreifen. `$` wird bei Beginn der Template-
Ausführung auf den Root-Geltungsbereich gemappt und ändert sich während der
Template-Ausführung nicht. Das Folgende würde ebenfalls funktionieren:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  toppings: |-
    {{- range $.Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}
  {{- end }}
```

Schauen wir uns die `toppings:`-Liste genauer an. Die `range`-Funktion wird
durch die `pizzaToppings`-Liste "rangieren" (iterieren). Aber jetzt passiert
etwas Interessantes. Genau wie `with` den Geltungsbereich von `.` setzt, tut
dies auch ein `range`-Operator. Bei jedem Durchlauf durch die Schleife wird `.`
auf den aktuellen Pizza-Belag gesetzt. Das heißt, beim ersten Mal wird `.` auf
`mushrooms` gesetzt. In der zweiten Iteration wird es auf `cheese` gesetzt,
und so weiter.

Wir können den Wert von `.` direkt durch eine Pipeline senden, sodass wenn wir
`{{ . | title | quote }}` ausführen, es `.` an `title` (Großschreibungsfunktion)
und dann an `quote` sendet. Wenn wir dieses Template ausführen, ist die
Ausgabe:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-dragonfly-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  toppings: |-
    - "Mushrooms"
    - "Cheese"
    - "Peppers"
    - "Onions"
    - "Pineapple"
```

In diesem Beispiel haben wir etwas Trickreiches gemacht. Die Zeile
`toppings: |-` deklariert einen mehrzeiligen String. Unsere Belagsliste ist
also eigentlich keine YAML-Liste. Sie ist ein großer String. Warum sollten wir
das tun? Weil die Daten in ConfigMaps aus Schlüssel/Wert-Paaren bestehen, bei
denen sowohl der Schlüssel als auch der Wert einfache Strings sind. Um zu
verstehen, warum das so ist, schauen Sie sich die [Kubernetes ConfigMap-
Dokumentation](https://kubernetes.io/docs/concepts/configuration/configmap/)
an. Für uns spielt dieses Detail jedoch keine große Rolle.

> Die `|-`-Markierung in YAML nimmt einen mehrzeiligen String. Dies kann eine
> nützliche Technik sein, um große Datenblöcke in Ihre Manifeste einzubetten,
> wie hier gezeigt.

Manchmal ist es nützlich, schnell eine Liste innerhalb Ihres Templates zu
erstellen und dann über diese Liste zu iterieren. Helm-Templates haben eine
Funktion, die das einfach macht: `tuple`. In der Informatik ist ein Tupel eine
listenartige Sammlung fester Größe, aber mit beliebigen Datentypen. Dies
vermittelt ungefähr, wie ein `tuple` verwendet wird.

```yaml
  sizes: |-
    {{- range tuple "small" "medium" "large" }}
    - {{ . }}
    {{- end }}
```

Das Obige erzeugt:

```yaml
  sizes: |-
    - small
    - medium
    - large
```

Zusätzlich zu Listen und Tupeln kann `range` verwendet werden, um über
Sammlungen zu iterieren, die einen Schlüssel und einen Wert haben (wie eine
`map` oder `dict`). Wir werden sehen, wie das geht, im nächsten Abschnitt, wenn
wir Template-Variablen einführen.
