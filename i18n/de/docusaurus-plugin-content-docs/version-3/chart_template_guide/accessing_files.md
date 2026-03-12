---
title: Zugriff auf Dateien innerhalb von Templates
description: Wie Sie auf Dateien innerhalb eines Templates zugreifen können.
sidebar_position: 10
---

Im vorherigen Abschnitt haben wir mehrere Möglichkeiten kennengelernt, benannte
Templates zu erstellen und darauf zuzugreifen. Dies erleichtert das Importieren
eines Templates aus einem anderen Template. Manchmal ist es jedoch wünschenswert,
eine _Datei zu importieren, die kein Template ist_ und deren Inhalt einzufügen,
ohne ihn durch die Template-Rendering-Engine zu senden.

Helm bietet Zugriff auf Dateien über das `.Files`-Objekt. Bevor wir mit den
Template-Beispielen beginnen, gibt es einige wichtige Hinweise zur Funktionsweise:

- Sie können zusätzliche Dateien zu Ihrem Helm Chart hinzufügen. Diese
  Dateien werden mitgebündelt. Seien Sie jedoch vorsichtig: Charts müssen
  aufgrund der Speicherbeschränkungen von Kubernetes-Objekten kleiner als 1 MB sein.
- Einige Dateien können aus Sicherheitsgründen nicht über das `.Files`-Objekt
  aufgerufen werden:
  - Dateien in `templates/` sind nicht zugänglich.
  - Dateien, die über `.helmignore` ausgeschlossen werden, sind nicht zugänglich.
  - Dateien außerhalb eines Helm-Anwendungs-[Subcharts](./subcharts_and_globals.md), einschließlich derjenigen des übergeordneten Charts, sind nicht zugänglich.
- Charts behalten keine UNIX-Modus-Informationen bei, sodass Datei-Berechtigungen
  keinen Einfluss auf die Verfügbarkeit einer Datei über das `.Files`-Objekt haben.

<!-- (see https://github.com/jonschlinkert/markdown-toc) -->

<!-- toc -->

- [Einfaches Beispiel](#einfaches-beispiel)
- [Pfad-Hilfsfunktionen](#pfad-hilfsfunktionen)
- [Glob-Muster](#glob-muster)
- [ConfigMap- und Secrets-Hilfsfunktionen](#configmap--und-secrets-hilfsfunktionen)
- [Kodierung](#kodierung)
- [Zeilen](#zeilen)

<!-- tocstop -->

## Einfaches Beispiel

Mit diesen Hinweisen im Hinterkopf schreiben wir nun ein Template, das drei
Dateien in unsere ConfigMap einliest. Zunächst fügen wir drei Dateien zum
Chart hinzu und platzieren sie direkt im Verzeichnis `mychart/`.

`config1.toml`:

```toml
message = "Hello from config 1"
```

`config2.toml`:

```toml
message = "This is config 2"
```

`config3.toml`:

```toml
message = "Goodbye from config 3"
```

Jede dieser Dateien ist eine einfache TOML-Datei (ähnlich den klassischen
Windows-INI-Dateien). Da wir die Namen dieser Dateien kennen, können wir eine
`range`-Funktion verwenden, um sie zu durchlaufen und ihren Inhalt in unsere
ConfigMap einzufügen.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  {{- $files := .Files }}
  {{- range tuple "config1.toml" "config2.toml" "config3.toml" }}
  {{ . }}: |-
    {{ $files.Get . }}
  {{- end }}
```

Diese ConfigMap verwendet mehrere Techniken, die in den vorherigen Abschnitten
besprochen wurden. Zum Beispiel erstellen wir eine Variable `$files`, um eine
Referenz auf das `.Files`-Objekt zu speichern. Wir verwenden auch die
`tuple`-Funktion, um eine Liste von Dateien zu erstellen, die wir durchlaufen.
Dann geben wir jeden Dateinamen aus (`{{ . }}: |-`), gefolgt vom Inhalt der
Datei `{{ $files.Get . }}`.

Das Ausführen dieses Templates erzeugt eine einzelne ConfigMap mit dem Inhalt
aller drei Dateien:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: quieting-giraf-configmap
data:
  config1.toml: |-
    message = "Hello from config 1"

  config2.toml: |-
    message = "This is config 2"

  config3.toml: |-
    message = "Goodbye from config 3"
```

## Pfad-Hilfsfunktionen

Bei der Arbeit mit Dateien kann es sehr nützlich sein, einige Standardoperationen
auf den Dateipfaden selbst auszuführen. Um dabei zu helfen, importiert Helm viele
Funktionen aus dem Go-Paket [path](https://golang.org/pkg/path/) für Ihre Nutzung.
Sie sind alle mit denselben Namen wie im Go-Paket zugänglich, jedoch mit einem
Kleinbuchstaben am Anfang. Zum Beispiel wird `Base` zu `base`, usw.

Die importierten Funktionen sind:
- Base
- Dir
- Ext
- IsAbs
- Clean

## Glob-Muster

Wenn Ihr Chart wächst, werden Sie möglicherweise feststellen, dass Sie Ihre
Dateien besser organisieren müssen. Deshalb bieten wir eine Methode
`Files.Glob(pattern string)` an, die beim Extrahieren bestimmter Dateien mit
der vollen Flexibilität von [Glob-Mustern](https://godoc.org/github.com/gobwas/glob)
hilft.

`.Glob` gibt einen `Files`-Typ zurück, sodass Sie alle `Files`-Methoden auf dem
zurückgegebenen Objekt aufrufen können.

Stellen Sie sich zum Beispiel folgende Verzeichnisstruktur vor:

```
foo/:
  foo.txt foo.yaml

bar/:
  bar.go bar.conf baz.yaml
```

Sie haben mehrere Optionen mit Globs:

```yaml
{{ $currentScope := .}}
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
    {{- with $currentScope}}
        {{ .Files.Get $path }}
    {{- end }}
{{ end }}
```

Oder

```yaml
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
      {{ $.Files.Get $path }}
{{ end }}
```

## ConfigMap- und Secrets-Hilfsfunktionen

(Verfügbar ab Helm 2.0.2 und später)

Es ist sehr üblich, Dateiinhalte sowohl in ConfigMaps als auch in Secrets zu
platzieren, um sie zur Laufzeit in Ihre Pods einzubinden. Um dabei zu helfen,
bieten wir einige Hilfsmethoden auf dem `Files`-Typ an.

Für eine bessere Organisation ist es besonders nützlich, diese Methoden in
Verbindung mit der `Glob`-Methode zu verwenden.

Mit der Verzeichnisstruktur aus dem [Glob](#glob-muster)-Beispiel oben:

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: conf
data:
{{ (.Files.Glob "foo/*").AsConfig | indent 2 }}
---
apiVersion: v1
kind: Secret
metadata:
  name: very-secret
type: Opaque
data:
{{ (.Files.Glob "bar/*").AsSecrets | indent 2 }}
```

## Kodierung

Sie können eine Datei importieren und das Template sie base64-kodieren lassen,
um eine erfolgreiche Übertragung sicherzustellen:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ .Release.Name }}-secret
type: Opaque
data:
  token: |-
    {{ .Files.Get "config1.toml" | b64enc }}
```

Das obige Beispiel nimmt dieselbe `config1.toml`-Datei, die wir zuvor verwendet
haben, und kodiert sie:

```yaml
# Source: mychart/templates/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: lucky-turkey-secret
type: Opaque
data:
  token: |-
    bWVzc2FnZSA9ICJIZWxsbyBmcm9tIGNvbmZpZyAxIgo=
```

## Zeilen

Manchmal ist es wünschenswert, auf jede Zeile einer Datei in Ihrem Template
zuzugreifen. Wir bieten dafür eine praktische `Lines`-Methode.

Sie können `Lines` mit einer `range`-Funktion durchlaufen:

```yaml
data:
  some-file.txt: {{ range .Files.Lines "foo/bar.txt" }}
    {{ . }}{{ end }}
```

Es gibt keine Möglichkeit, Dateien von außerhalb des Charts während
`helm install` zu übergeben. Wenn Sie möchten, dass Benutzer Daten bereitstellen,
müssen diese über `helm install -f` oder `helm install --set` geladen werden.

Damit schließen wir unseren Einblick in die Werkzeuge und Techniken zum
Schreiben von Helm-Templates ab. Im nächsten Abschnitt werden wir sehen, wie Sie
eine spezielle Datei, `templates/NOTES.txt`, verwenden können, um den Benutzern
Ihres Charts Anweisungen nach der Installation zu senden.
