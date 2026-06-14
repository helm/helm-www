---
title: Templates
description: Ein genauerer Blick auf Best Practices rund um Templates.
sidebar_position: 3
---

Dieser Teil des Best-Practices-Leitfadens konzentriert sich auf Templates.

## Struktur von `templates/`

Das `templates/`-Verzeichnis sollte wie folgt strukturiert sein:

- Template-Dateien sollten die Erweiterung `.yaml` haben, wenn sie YAML-Ausgabe erzeugen.
  Die Erweiterung `.tpl` kann für Template-Dateien verwendet werden, die keinen
  formatierten Inhalt erzeugen.
- Template-Dateinamen sollten die Bindestrich-Schreibweise verwenden (`my-example-configmap.yaml`),
  nicht camelCase.
- Jede Ressourcendefinition sollte in einer eigenen Template-Datei sein.
- Template-Dateinamen sollten die Ressourcen-Art im Namen widerspiegeln, z.B.
  `foo-pod.yaml`, `bar-svc.yaml`

## Namen von definierten Templates

Definierte Templates (Templates, die innerhalb einer `{{ define }}`-Direktive erstellt werden) sind
global zugänglich. Das bedeutet, dass ein Chart und alle seine Subcharts Zugriff auf alle
mit `{{ define }}` erstellten Templates haben.

Aus diesem Grund sollten _alle Namen definierter Templates einen Namespace haben._

Richtig:

```yaml
{{- define "nginx.fullname" }}
{{/* ... */}}
{{ end -}}
```

Falsch:

```yaml
{{- define "fullname" -}}
{{/* ... */}}
{{ end -}}
```

Es wird dringend empfohlen, neue Charts mit dem Befehl `helm create` zu erstellen,
da die Template-Namen automatisch gemäß dieser Best Practice definiert werden.

## Formatierung von Templates

Templates sollten mit _zwei Leerzeichen_ eingerückt werden (niemals Tabs).

Template-Direktiven sollten Leerzeichen nach den öffnenden geschweiften Klammern und vor
den schließenden geschweiften Klammern haben:

Richtig:
```
{{ .foo }}
{{ print "foo" }}
{{- print "bar" -}}
```

Falsch:
```
{{.foo}}
{{print "foo"}}
{{-print "bar"-}}
```

Templates sollten Whitespace nach Möglichkeit trimmen:

```yaml
foo:
  {{- range .Values.items }}
  {{ . }}
  {{ end -}}
```

Blöcke (wie Kontrollstrukturen) können eingerückt werden, um den Fluss des
Template-Codes anzuzeigen.

```
{{ if $foo -}}
  {{- with .Bar }}Hello{{ end -}}
{{- end -}}
```

Da YAML jedoch eine Whitespace-orientierte Sprache ist, ist es oft nicht möglich,
dass die Code-Einrückung dieser Konvention folgt.

## Whitespace in generierten Templates

Die Menge an Whitespace in generierten Templates sollte minimal gehalten werden.
Insbesondere sollten nicht mehrere leere Zeilen nebeneinander erscheinen.
Gelegentliche leere Zeilen (besonders zwischen logischen Abschnitten) sind jedoch in Ordnung.

Das ist am besten:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example
  labels:
    first: first
    second: second
```

Das ist akzeptabel:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example

  labels:
    first: first
    second: second

```

Aber das sollte vermieden werden:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example





  labels:
    first: first

    second: second

```

## Kommentare (YAML-Kommentare vs. Template-Kommentare)

Sowohl YAML als auch Helm Templates haben Kommentarzeichen.

YAML-Kommentare:
```yaml
# This is a comment
type: sprocket
```

Template-Kommentare:
```yaml
{{- /*
This is a comment.
*/}}
type: frobnitz
```

Template-Kommentare sollten verwendet werden, wenn Funktionen eines Templates dokumentiert werden,
zum Beispiel um ein definiertes Template zu erklären:

```yaml
{{- /*
mychart.shortname provides a 6 char truncated version of the release name.
*/}}
{{ define "mychart.shortname" -}}
{{ .Release.Name | trunc 6 }}
{{- end -}}

```

Innerhalb von Templates können YAML-Kommentare verwendet werden, wenn es für Helm-Benutzer
nützlich ist, die Kommentare (möglicherweise) beim Debugging zu sehen.

```yaml
# This may cause problems if the value is more than 100Gi
memory: {{ .Values.maxMem | quote }}
```

Der obige Kommentar ist sichtbar, wenn der Benutzer `helm install --debug` ausführt, während
Kommentare in `{{- /* */}}`-Abschnitten nicht angezeigt werden.

Seien Sie vorsichtig beim Hinzufügen von `#` YAML-Kommentaren in Template-Abschnitten, die Helm-Werte enthalten, die von bestimmten Template-Funktionen benötigt werden könnten.

Wenn zum Beispiel die Funktion `required` im obigen Beispiel verwendet wird und `maxMem` nicht gesetzt ist, führt ein `#` YAML-Kommentar zu einem Rendering-Fehler.

Richtig: `helm template` rendert diesen Block nicht
```yaml
{{- /*
# This may cause problems if the value is more than 100Gi
memory: {{ required "maxMem must be set" .Values.maxMem | quote }}
*/ -}}
```

Falsch: `helm template` gibt zurück `Error: execution error at (templates/test.yaml:2:13): maxMem must be set`
```yaml
# This may cause problems if the value is more than 100Gi
# memory: {{ required .Values.maxMem "maxMem must be set" | quote }}
```

Lesen Sie [Templates debuggen](../chart_template_guide/debugging.md) für ein weiteres Beispiel dieses Verhaltens, wie YAML-Kommentare intakt bleiben.

## Verwendung von JSON in Templates und Template-Ausgabe

YAML ist eine Obermenge von JSON. In manchen Fällen kann die Verwendung einer JSON-Syntax
lesbarer sein als andere YAML-Darstellungen.

Zum Beispiel ist dieses YAML näher an der normalen YAML-Methode, Listen auszudrücken:

```yaml
arguments:
  - "--dirname"
  - "/foo"
```

Aber es ist einfacher zu lesen, wenn es im JSON-Listen-Stil zusammengefasst wird:

```yaml
arguments: ["--dirname", "/foo"]
```

Die Verwendung von JSON für bessere Lesbarkeit ist gut. JSON-Syntax sollte jedoch nicht
verwendet werden, um komplexere Strukturen darzustellen.

Bei reinem JSON, das in YAML eingebettet ist (wie bei der Init-Container-Konfiguration),
ist es natürlich angemessen, das JSON-Format zu verwenden.
