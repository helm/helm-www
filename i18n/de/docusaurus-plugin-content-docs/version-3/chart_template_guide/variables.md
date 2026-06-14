---
title: Variablen
description: Verwendung von Variablen in Templates.
sidebar_position: 8
---

Nachdem wir nun mit Funktionen, Pipelines, Objekten und Kontrollstrukturen
vertraut sind, können wir uns einem der grundlegendsten Konzepte vieler
Programmiersprachen zuwenden: Variablen. In Templates werden sie weniger häufig
verwendet. Wir werden jedoch sehen, wie man sie nutzt, um Code zu vereinfachen
und `with` sowie `range` besser einzusetzen.

In einem früheren Beispiel haben wir gesehen, dass dieser Code fehlschlägt:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

`Release.Name` befindet sich nicht innerhalb des Gültigkeitsbereichs, der im
`with`-Block eingeschränkt ist. Um solche Gültigkeitsbereichsprobleme zu
umgehen, können Sie Objekte Variablen zuweisen, auf die unabhängig vom
aktuellen Gültigkeitsbereich zugegriffen werden kann.

In Helm Templates ist eine Variable eine benannte Referenz auf ein anderes
Objekt. Sie folgt der Form `$name`. Variablen werden mit einem speziellen
Zuweisungsoperator zugewiesen: `:=`. Wir können das obige Beispiel umschreiben,
um eine Variable für `Release.Name` zu verwenden.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- $relname := .Release.Name -}}
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $relname }}
  {{- end }}
```

Beachten Sie, dass wir vor dem Start des `with`-Blocks `$relname :=
.Release.Name` zuweisen. Innerhalb des `with`-Blocks verweist die Variable
`$relname` weiterhin auf den Release-Namen.

Das erzeugt folgende Ausgabe:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: viable-badger-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  release: viable-badger
```

Variablen sind besonders nützlich in `range`-Schleifen. Sie können bei
listenartigen Objekten verwendet werden, um sowohl den Index als auch den Wert
zu erfassen:

```yaml
  toppings: |-
    {{- range $index, $topping := .Values.pizzaToppings }}
      {{ $index }}: {{ $topping }}
    {{- end }}

```

Beachten Sie, dass zuerst `range` kommt, dann die Variablen, dann der
Zuweisungsoperator und schließlich die Liste. Dies weist den ganzzahligen Index
(beginnend bei Null) `$index` zu und den Wert `$topping`. Das erzeugt:

```yaml
  toppings: |-
      0: mushrooms
      1: cheese
      2: peppers
      3: onions
```

Bei Datenstrukturen, die sowohl einen Schlüssel als auch einen Wert haben,
können wir `range` verwenden, um beides zu erhalten. Zum Beispiel können wir
`.Values.favorite` so durchlaufen:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

Bei der ersten Iteration wird `$key` den Wert `drink` haben und `$val` den Wert
`coffee`, und bei der zweiten wird `$key` den Wert `food` haben und `$val` den
Wert `pizza`. Das erzeugt:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eager-rabbit-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

Variablen sind normalerweise nicht "global". Sie sind auf den Block beschränkt,
in dem sie deklariert werden. Früher haben wir `$relname` auf der obersten Ebene
des Templates zugewiesen. Diese Variable ist im gesamten Template gültig. Aber
in unserem letzten Beispiel sind `$key` und `$val` nur innerhalb des
`{{ range... }}{{ end }}`-Blocks gültig.

Es gibt jedoch eine Variable, die immer auf den Root-Kontext verweist: `$`.
Dies kann sehr nützlich sein, wenn Sie in einer range-Schleife iterieren und
den Release-Namen des Charts benötigen.

Ein Beispiel zur Veranschaulichung:

```yaml
{{- range .Values.tlsSecrets }}
---
apiVersion: v1
kind: Secret
metadata:
  name: {{ .name }}
  labels:
    # Many helm templates would use `.` below, but that will not work,
    # however `$` will work here
    app.kubernetes.io/name: {{ template "fullname" $ }}
    # I cannot reference .Chart.Name, but I can do $.Chart.Name
    helm.sh/chart: "{{ $.Chart.Name }}-{{ $.Chart.Version }}"
    app.kubernetes.io/instance: "{{ $.Release.Name }}"
    # Value from appVersion in Chart.yaml
    app.kubernetes.io/version: "{{ $.Chart.AppVersion }}"
    app.kubernetes.io/managed-by: "{{ $.Release.Service }}"
type: kubernetes.io/tls
data:
  tls.crt: {{ .certificate }}
  tls.key: {{ .key }}
{{- end }}
```

Bisher haben wir nur ein Template betrachtet, das in nur einer Datei deklariert
ist. Aber eine der mächtigen Funktionen der Helm Template-Sprache ist die
Möglichkeit, mehrere Templates zu deklarieren und sie gemeinsam zu verwenden.
Darauf werden wir im nächsten Abschnitt eingehen.
