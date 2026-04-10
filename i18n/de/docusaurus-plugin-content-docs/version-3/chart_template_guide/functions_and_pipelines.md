---
title: Template-Funktionen und Pipelines
description: Verwendung von Funktionen in Templates.
sidebar_position: 5
---

Bisher haben wir gesehen, wie man Informationen in ein Template einfügt. Aber
diese Informationen werden unverändert in das Template eingefügt. Manchmal
möchten wir die übergebenen Daten so transformieren, dass sie für uns
nützlicher werden.

Beginnen wir mit einer Best Practice: Wenn wir Strings aus dem `.Values`-Objekt
in das Template einfügen, sollten wir diese Strings in Anführungszeichen setzen.
Dazu rufen wir die `quote`-Funktion in der Template-Anweisung auf:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ quote .Values.favorite.drink }}
  food: {{ quote .Values.favorite.food }}
```

Template-Funktionen folgen der Syntax `funktionsName arg1 arg2...`. Im obigen
Beispiel ruft `quote .Values.favorite.drink` die `quote`-Funktion auf und
übergibt ihr ein einzelnes Argument.

Helm verfügt über mehr als 60 Funktionen. Einige davon sind durch die
[Go-Template-Sprache](https://godoc.org/text/template) selbst definiert. Die
meisten anderen stammen aus der [Sprig Template-Bibliothek](https://masterminds.github.io/sprig/).
Wir werden viele davon kennenlernen, während wir die Beispiele durcharbeiten.

> Obwohl wir von der "Helm-Template-Sprache" sprechen, als wäre sie
> Helm-spezifisch, ist sie tatsächlich eine Kombination aus der
> Go-Template-Sprache, einigen zusätzlichen Funktionen und verschiedenen
> Wrappern, um bestimmte Objekte für die Templates verfügbar zu machen. Viele
> Ressourcen über Go-Templates können beim Erlernen des Templating hilfreich
> sein.

## Pipelines

Eine der leistungsstarken Funktionen der Template-Sprache ist ihr Konzept der
_Pipelines_. Basierend auf einem Konzept aus UNIX sind Pipelines ein Werkzeug,
um eine Reihe von Template-Befehlen zu verketten und so eine Folge von
Transformationen kompakt auszudrücken. Mit anderen Worten: Pipelines sind eine
effiziente Methode, um mehrere Dinge nacheinander zu erledigen. Schreiben wir
das obige Beispiel mit einer Pipeline um.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | quote }}
```

In diesem Beispiel haben wir, anstatt `quote ARGUMENT` aufzurufen, die
Reihenfolge umgekehrt. Wir haben das Argument mit einer Pipeline (`|`) an die
Funktion "gesendet": `.Values.favorite.drink | quote`. Mit Pipelines können wir
mehrere Funktionen verketten:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

> Die Umkehrung der Reihenfolge ist eine gängige Praxis in Templates. Sie werden
> `.val | quote` häufiger sehen als `quote .val`. Beide Varianten sind in
> Ordnung.

Wenn dieses Template ausgewertet wird, ergibt sich folgendes:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: trendsetting-p-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

Beachten Sie, dass unser ursprüngliches `pizza` jetzt zu `"PIZZA"` transformiert
wurde.

Wenn Argumente auf diese Weise durch eine Pipeline geleitet werden, wird das
Ergebnis der ersten Auswertung (`.Values.favorite.drink`) als _letztes Argument
an die Funktion_ übergeben. Wir können das Getränke-Beispiel oben anpassen, um
dies mit einer Funktion zu veranschaulichen, die zwei Argumente akzeptiert:
`repeat COUNT STRING`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | repeat 5 | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

Die `repeat`-Funktion wiederholt den gegebenen String die angegebene Anzahl von
Malen, sodass wir folgende Ausgabe erhalten:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: melting-porcup-configmap
data:
  myvalue: "Hello World"
  drink: "coffeecoffeecoffeecoffeecoffee"
  food: "PIZZA"
```

## Verwendung der `default`-Funktion

Eine häufig in Templates verwendete Funktion ist die `default`-Funktion:
`default STANDARDWERT GEGEBENER_WERT`. Mit dieser Funktion können Sie einen
Standardwert im Template festlegen, falls der Wert nicht angegeben wird.
Verwenden wir sie, um das Getränke-Beispiel anzupassen:

```yaml
drink: {{ .Values.favorite.drink | default "tea" | quote }}
```

Wenn wir dies normal ausführen, erhalten wir unseren `coffee`:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: virtuous-mink-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

Nun entfernen wir die Einstellung für das Lieblingsgetränk aus `values.yaml`:

```yaml
favorite:
  #drink: coffee
  food: pizza
```

Wenn wir jetzt `helm install --dry-run --debug fair-worm ./mychart` erneut
ausführen, wird folgendes YAML erzeugt:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fair-worm-configmap
data:
  myvalue: "Hello World"
  drink: "tea"
  food: "PIZZA"
```

In einem echten Chart sollten alle statischen Standardwerte in der
`values.yaml` definiert sein und nicht mit dem `default`-Befehl wiederholt
werden (da sie sonst redundant wären). Der `default`-Befehl ist jedoch ideal für
berechnete Werte, die nicht in `values.yaml` deklariert werden können. Zum
Beispiel:

```yaml
drink: {{ .Values.favorite.drink | default (printf "%s-tea" (include "fullname" .)) }}
```

An manchen Stellen ist eine `if`-Bedingung möglicherweise besser geeignet als
`default`. Diese werden wir im nächsten Abschnitt kennenlernen.

Template-Funktionen und Pipelines sind eine leistungsstarke Möglichkeit,
Informationen zu transformieren und dann in Ihr YAML einzufügen. Aber manchmal
ist es notwendig, Template-Logik hinzuzufügen, die etwas anspruchsvoller ist als
nur das Einfügen eines Strings. Im nächsten Abschnitt betrachten wir die
Kontrollstrukturen, die die Template-Sprache bietet.

## Verwendung der `lookup`-Funktion

Die `lookup`-Funktion kann verwendet werden, um Ressourcen in einem laufenden
Cluster _nachzuschlagen_. Die Syntax der lookup-Funktion ist
`lookup apiVersion, kind, namespace, name -> resource or resource list`.

| Parameter  | Typ    |
|------------|--------|
| apiVersion | string |
| kind       | string |
| namespace  | string |
| name       | string |

Sowohl `name` als auch `namespace` sind optional und können als leerer String
(`""`) übergeben werden. Bei Namespace-spezifischen Ressourcen müssen jedoch
beide Parameter angegeben werden.

Folgende Parameterkombinationen sind möglich:

| Verhalten                              | Lookup-Funktion                            |
|----------------------------------------|--------------------------------------------|
| `kubectl get pod mypod -n mynamespace` | `lookup "v1" "Pod" "mynamespace" "mypod"`  |
| `kubectl get pods -n mynamespace`      | `lookup "v1" "Pod" "mynamespace" ""`       |
| `kubectl get pods --all-namespaces`    | `lookup "v1" "Pod" "" ""`                  |
| `kubectl get namespace mynamespace`    | `lookup "v1" "Namespace" "" "mynamespace"` |
| `kubectl get namespaces`               | `lookup "v1" "Namespace" "" ""`            |

Wenn `lookup` ein Objekt zurückgibt, wird es als Dictionary zurückgegeben.
Dieses Dictionary kann weiter navigiert werden, um spezifische Werte zu
extrahieren.

Das folgende Beispiel gibt die Annotationen zurück, die für das
`mynamespace`-Objekt vorhanden sind:

```go
(lookup "v1" "Namespace" "" "mynamespace").metadata.annotations
```

Wenn `lookup` eine Liste von Objekten zurückgibt, kann über das Feld `items` auf
die Objektliste zugegriffen werden:

```go
{{ range $index, $service := (lookup "v1" "Service" "mynamespace" "").items }}
    {{/* do something with each service */}}
{{ end }}
```

Wenn kein Objekt gefunden wird, wird ein leerer Wert zurückgegeben. Dies kann
verwendet werden, um die Existenz eines Objekts zu prüfen.

Die `lookup`-Funktion verwendet Helms bestehende Kubernetes-Verbindungs-
konfiguration, um Kubernetes abzufragen. Wenn beim Aufruf des API-Servers ein
Fehler zurückgegeben wird (z.B. aufgrund fehlender Berechtigungen zum Zugriff
auf eine Ressource), schlägt die Template-Verarbeitung von Helm fehl.

Beachten Sie, dass Helm den Kubernetes API-Server nicht während einer
`helm template|install|upgrade|delete|rollback --dry-run`-Operation kontaktieren
soll. Um `lookup` gegen einen laufenden Cluster zu testen, sollte stattdessen
`helm template|install|upgrade|delete|rollback --dry-run=server` verwendet
werden, um die Cluster-Verbindung zu ermöglichen.

## Operatoren sind Funktionen

Für Templates sind die Operatoren (`eq`, `ne`, `lt`, `gt`, `and`, `or` usw.)
alle als Funktionen implementiert. In Pipelines können Operationen mit Klammern
(`(` und `)`) gruppiert werden.

Nun können wir von Funktionen und Pipelines zur Flusskontrolle mit Bedingungen,
Schleifen und Scope-Modifikatoren übergehen.
