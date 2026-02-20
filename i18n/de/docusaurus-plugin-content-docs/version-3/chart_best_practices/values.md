---
title: Values
description: Beschreibt, wie Sie Ihre Values strukturieren und verwenden sollten.
sidebar_position: 2
---

Dieser Teil des Best-Practices-Leitfadens behandelt die Verwendung von Values. Hier geben wir Empfehlungen, wie Sie Ihre Values strukturieren und verwenden sollten, mit Fokus auf die Gestaltung der `values.yaml`-Datei eines Charts.

## Namenskonventionen

Variablennamen sollten mit einem Kleinbuchstaben beginnen, und Wörter sollten in camelCase getrennt werden:

Richtig:

```yaml
chicken: true
chickenNoodleSoup: true
```

Falsch:

```yaml
Chicken: true  # initial caps may conflict with built-ins
chicken-noodle-soup: true # do not use hyphens in the name
```

Alle integrierten Helm-Variablen beginnen mit einem Großbuchstaben, um sie leicht von benutzerdefinierten Values zu unterscheiden: `.Release.Name`, `.Capabilities.KubeVersion`.

## Flache oder verschachtelte Values

YAML ist ein flexibles Format, und Values können tief verschachtelt oder flach strukturiert sein.

Verschachtelt:

```yaml
server:
  name: nginx
  port: 80
```

Flach:

```yaml
serverName: nginx
serverPort: 80
```

In den meisten Fällen ist eine flache Struktur vorzuziehen. Der Grund: Sie ist für Template-Entwickler und Benutzer einfacher.

Für optimale Sicherheit muss ein verschachtelter Wert auf jeder Ebene überprüft werden:

```
{{ if .Values.server }}
  {{ default "none" .Values.server.name }}
{{ end }}
```

Für jede Verschachtelungsebene muss eine Existenzprüfung durchgeführt werden. Bei einer flachen Konfiguration können solche Prüfungen entfallen, was das Template lesbarer und einfacher zu verwenden macht.

```
{{ default "none" .Values.serverName }}
```

Wenn es eine große Anzahl verwandter Variablen gibt und mindestens eine davon erforderlich ist, können verschachtelte Values zur Verbesserung der Lesbarkeit verwendet werden.

## Typen explizit angeben

Die Typumwandlungsregeln von YAML sind manchmal nicht intuitiv. Zum Beispiel ist `foo: false` nicht dasselbe wie `foo: "false"`. Große Ganzzahlen wie `foo: 12345678` werden in manchen Fällen in wissenschaftliche Notation umgewandelt.

Der einfachste Weg, Typkonvertierungsfehler zu vermeiden, ist, Strings explizit zu kennzeichnen und bei allem anderen implizit zu bleiben. Kurz gesagt: _Alle Strings in Anführungszeichen setzen_.

Oft ist es vorteilhaft, Ganzzahlen ebenfalls als Strings zu speichern und im Template `{{ int $value }}` zu verwenden, um sie wieder in eine Ganzzahl umzuwandeln.

In den meisten Fällen werden explizite Typ-Tags korrekt interpretiert, sodass `foo: !!string 1234` den Wert `1234` als String behandelt. _Allerdings_ verarbeitet der YAML-Parser Tags intern, sodass die Typinformation nach einem Parse-Vorgang verloren geht.

## Bedenken Sie die Nutzung durch Anwender

Es gibt drei potenzielle Quellen für Values:

- Die `values.yaml`-Datei eines Charts
- Eine Values-Datei, die mit `helm install -f` oder `helm upgrade -f` übergeben wird
- Die Werte, die über die Flags `--set` oder `--set-string` bei `helm install` oder `helm upgrade` übergeben werden

Bedenken Sie beim Entwurf der Struktur Ihrer Values, dass Benutzer diese möglicherweise über das `-f`-Flag oder mit der `--set`-Option überschreiben möchten.

Da `--set` weniger flexibel ist, lautet die erste Richtlinie für das Schreiben Ihrer `values.yaml`-Datei: _Machen Sie das Überschreiben über `--set` einfach_.

Aus diesem Grund ist es oft besser, Ihre Values-Datei mit Maps zu strukturieren.

Schwierig mit `--set` zu verwenden:

```yaml
servers:
  - name: foo
    port: 80
  - name: bar
    port: 81
```

Das Obige lässt sich mit `--set` in Helm `<=2.4` nicht ausdrücken. In Helm 2.5 erfolgt der Zugriff auf den Port von foo mit `--set servers[0].port=80`. Das ist nicht nur schwieriger für den Benutzer herauszufinden, sondern auch fehleranfällig, falls die Reihenfolge der `servers` zu einem späteren Zeitpunkt geändert wird.

Einfach zu verwenden:

```yaml
servers:
  foo:
    port: 80
  bar:
    port: 81
```

Der Zugriff auf den Port von foo ist viel offensichtlicher: `--set servers.foo.port=80`.

## Dokumentieren Sie `values.yaml`

Jede definierte Eigenschaft in `values.yaml` sollte dokumentiert werden. Der Dokumentationsstring sollte mit dem Namen der beschriebenen Eigenschaft beginnen und dann mindestens eine Satzbeschreibung enthalten.

Falsch:

```yaml
# the host name for the webserver
serverHost: example
serverPort: 9191
```

Richtig:

```yaml
# serverHost is the host name for the webserver
serverHost: example
# serverPort is the HTTP listener port for the webserver
serverPort: 9191
```

Jeden Kommentar mit dem Namen des Parameters zu beginnen, erleichtert das Durchsuchen der Dokumentation und ermöglicht es Dokumentationswerkzeugen, Dokumentationsstrings zuverlässig mit den beschriebenen Parametern zu verknüpfen.
