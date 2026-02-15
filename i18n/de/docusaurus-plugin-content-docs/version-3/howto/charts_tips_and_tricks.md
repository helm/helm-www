---
title: "Chart Entwicklung Tipps und Tricks"
description: "Bespricht Tipps und Tricks,die Helm Chart Entwickler bei der Entwicklung von produktionsreifer Charts gelernt haben."
sidebar_position: 1
---

Dieses Handbuch bespricht Tipps und Tricks, die Helm Chart Entwickler bei der Entwicklung von produktionsreifen Charts gelernt haben.

## Kenne Deine Vorlagenfunktionen

Helm benutzt [Go Templates](https://godoc.org/text/template) für Vorlagen Ihrer
Resourcedateien. Wobei Go schon einige eingebauten Funktionen mitbringt, haben wir
noch viele andere hinzugefügt.

Als erstes haben wir alle Funktionen in der [Sprig
Bibliothek](https://masterminds.github.io/sprig/) hinzugefügt.

Wir haben auch zwei spezielle Vorlagenfunktionen hinzugefügt: `include` und `required`. Die
`include` Funktion erlaubt Ihnen das Hinzufügen anderer Vorlagen und das Zusammenfügen des
Ergebnisses in einer anderen Vorlagenfunktion.

Zum Beispiel diese Vorlage inkludiert eine Vorlage namens `mytpl`,
dann wandelt es diese in Kleinschreibung um und quotet diese mit doppelten Anführungszeichen.

```yaml
value: {{ include "mytpl" . | lower | quote }}
```

Die `required` Function erlaubt Ihnen die Deklaration eines Wertes als notwendig für das 
Vorlagenrendering. Wenn der Wert leer ist, wird das Vorlagenrendern fehlschlagen und dem
Benutzer eine Fehlermeldung ausgeben.

Das folgende Beispiel der `required` Funktion deklariert einen Eintrag für
`.Values.who`, der notwendig ist und gibt einen Fehler aus, wenn dieser fehlt:

```yaml
value: {{ required "A valid .Values.who entry required!" .Values.who }}
```

## Strings quoten, Integers nicht quoten

Wenn Sie mit Strings arbeiten, sind Sie mit Quoten immer auf der sicheren Seite:

```yaml
name: {{ .Values.MyName | quote }}
```

Aber wenn Sie mit Integers arbeiten _quoten Sie nicht die Werte._ Das kann in vielen
Fällen zu Fehlern in Kubernetes führen.

```yaml
port: {{ .Values.Port }}
```

Dieser Hinweis gilt nicht für Umgebungsvariablen, die immer als String erwartet werden,
auch wenn sie Integers repräsentieren:

```yaml
env:
  - name: HOST
    value: "http://host"
  - name: PORT
    value: "1234"
```

## Benutzen der 'include' Funktion

Go hat die Möglichkeit über eine eingebaute Funktion `template` zwei Vorlagen zu
verbinden. Leider kann diese eingebaute Funktion nicht in Go Vorlagen Pipelines
verwendet werden.

Um das zu ermöglichen, eine Vorlage zu inkludieren und die Vorlagenausgabe weiter
zu bearbeiten, hat Helm eine spezielle `include` Funktion:

```
{{ include "toYaml" $value | indent 2 }}
```

Dies inkludiert eine Vorlage namens `toYaml`, gibt das `$value` mit und
gibt dann die Ausgabe der Vorlage an die `indent` Funktion weiter.

Da YAML Einrückungen und Leerzeichen viel Bedeutung zumisst, ist das ein
grossartiger Weg um Codeschnippsel zu inkludieren, aber die Einrückungen
im relevaten Kontext zu halten.

## Benutzung der 'required' Funktion

Go stellt einen Weg zur Verfügung, um Vorlagenoptionen zu setzen und so das
Verhalten zu beeinflussen, wenn eine Map mit einem Schlüssel indiziert wird,
der in der Map nicht vorhanden ist. Das ist typischerweise gesetzt mit
`template.Options("missingkey=option")`, wobei `option` `default` sein kann,
`zero` oder `error`. Wenn diese Option zu error gesetzt ist, wird die Ausführung
gestoppt, wennimmer der Wert leer ist. Es gibt Situationen, wenn Chart Entwickler
dieses Verhalten für bestimmte Werte in der `values.yaml` Datei hervorrufen möchten.

Die `required` Funktion gibt Entwicklern die Möglichkeit, einen Werteintrag zu
deklarieren, der für das Vorlagenrendern notwendig ist. Wenn der Wert in `values.yaml`
leer ist, wird die Vorlage nicht gerendert und eine Fehlermeldung wird vom Entwickler
bereitgestellt.

Zum Beispiel:

```
{{ required "A valid foo is required!" .Values.foo }}
```

Das oben wird eine Vorlage rendern, wenn `.Values.foo` definiert ist, aber fehlschlagen,
wenn `.Values.foo` nicht definiert ist.

## Benutzen der 'tpl' Funktion

Die `tpl` Funktion erlaubt Entwicklern Strings als Vorlagen in Vorlagen zu evaluieren.
Das ist nützlich, um einen Vorlagenstring als Wert zu einem Chart oder zum Rendern
einer externen Konfigurationsdatei zu verwenden. Syntax: `{{ tpl TEMPLATE_STRING VALUES }}`

Beispiele:

```yaml
# values
template: "{{ .Values.name }}"
name: "Tom"

# template
{{ tpl .Values.template . }}

# output
Tom
```

Rendern einer externen Konfigurationsdatei:

```yaml
# external configuration file conf/app.conf
firstName={{ .Values.firstName }}
lastName={{ .Values.lastName }}

# values
firstName: Peter
lastName: Parker

# template
{{ tpl (.Files.Get "conf/app.conf") . }}

# output
firstName=Peter
lastName=Parker
```

## Erstellen eines Image Pull Secrets
Image Pull Secrets sind eine Kombination aus _registry_, _username_ und
_password_.  Sie brauchen sie vielleicht in einer Applikation, die Sie
bereitstellen möchten, aber zum Erstellen brauchen Sie öfters `base64`.
Wir können eine Hilfsvorlage erstellen, um die Docker Konfigurationsdatei
mit einem Secret Payload zu erstellen. Hier kommt das Beispiel:

Zuerst nehmen wir an, dass die Zugangsdaten in der `values.yaml` Datei definiert
sind, wie:

```yaml
imageCredentials:
  registry: quay.io
  username: someone
  password: sillyness
  email: someone@host.com
```

Wir definieren dann unsere Hilfsvorlage wie folgt:

```
{{- define "imagePullSecret" }}
{{- with .Values.imageCredentials }}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":%s,\"email\":\"%s\",\"auth\":\"%s\"}}}" .registry .username (.password | quote) .email (printf "%s:%s" .username .password | b64enc) | b64enc }}
{{- end }}
{{- end }}
```

Zum Schluss verwenden wir die Hilfsvorlage in einer grösseren Vorlage, um
das Secret Manifest zu erstellen:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: {{ template "imagePullSecret" . }}
```

## Automatisierte Bereitstellungen

Sehr oft werden ConfigMaps oder Secrets als Konfigurationsdateien in Container injiziert
oder dort sind andere externe Abhängigkeiten, was einen Pod Restart erforderlich macht.
Abhängig von der Applikation sollte ein Restart eine Aktualsierung durch `helm upgrade`
auslösen, aber die Deployment-Spezifikation selber ändert sich nicht und lässt die alte
Konfiguration als Ergebnis inkonsistent in der Bereitstellung.

Die `sha256sum` Funktion kann benutzt werden, um in der Annotation Sektion des Deployments
dieses zu aktualisieren, wenn sich die Datei geändert hat.


```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
[...]
```

In einem Ereignis, wenn Sie sowieso Ihr Deployment neu starten wollen, können
Sie einen ähnlichen Schritt mit der Annotation gehen wie oben, aber diese
mit einem zufälligen String ersetzen, sodass es immer eine Änderung gibt und
diese einen Restart der Bereitstellung hervorruft:

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        rollme: {{ randAlphaNum 5 | quote }}
[...]
```

Jede Benutzung dieser Vorlagenfunktion wird einen einzigartigen zufälligen
String generieren. Das bedeutet, wenn dieser zufällige String mit mehreren
Resourcen synchronisiert werden soll, müssen sich alle relevanten Resourcen
in derselben Vorlagendatei befinden.

Beide Methoden helfen Ihnen, Ihre Aktualisierungsstrategie zu planen und Ausfälle
zu verhindern.

HINWEIS: In der Vergangenheit empfohlen wir die Benutzung der Option
`--recreate-pods`. Diese Option ist als veraltet markiert und in Helm 3
favorisieren wir die Methoden oben.

## Helm anweisen, keine Resourcen zu installieren

Manchmal sollen Resourcen von Helm nicht deinstalliert werden, wenn Helm
läuft mit `helm uninstall`. Chart Entwickler können eine Annotation zu einer
Resource hinzufügen, um das zu verhindern.

```yaml
kind: Secret
metadata:
  annotations:
    "helm.sh/resource-policy": keep
[...]
```

(Als notwendig markieren)

Die Annotation `"helm.sh/resource-policy": keep` instruiert Helm, das Löschen
dieser Resource  bei Kommandos wie `helm uninstall`, `helm upgrade` oder
`helm rollback` zu übergehen, was normalerweise zum Löschen führen würde.
Helm wird diese nicht länger verwalten. Das kann zu Problemen führen,
etwa bei `helm install --replace` bei einer Version, die schon deinstalliert
ist, aber diese Resourcen behalten hat.

## Benutzung von "Partials" und inkludierten Vorlagen

Manchmal möchten Sie Teile Ihres Charts wiederverwenden, in einem Block
oder Vorlagenteile. Oft ist es sauberer, die in einer eigenen Datei
vorzuhalten.

Im `templates/` Verzeichnis werden Dateien, die mit einem Unterstrich
beginnen (`_`), nicht als Ausgabedateien für Kubernetes Manifeste betrachtet.
Mit dieser Konvention, werden Hilfsvorlagen und Teile in eine
`_helpers.tpl` Datei platziert.

## Komplexe Charts mit vielen Abhängigkeiten

Viele Charts im CNCF [Artifact
Hub](https://artifacthub.io/packages/search?kind=0) sind "building blocks" zum
Erstellen erweiterter Applikationen. Aber Charts werden verwendet, zum Aufbau
von Instanzen hochskalierbarer Anwendungen. In diesem Fall kann ein Schirm-Chart
viele Unter-Charts haben, jede mit einer Funktion als Teil des Ganzen.

Die derzeitige Praxis zum Komponieren einer komplexten Applikation von
einzelnen Teilen ist ein Schirm-Chart auf höchster Stufe mit exponierten
globalen Konfigurationswerten und dann benutzen des `charts/` Unterverzeichnis
zum Einschluss aller Komponenten.
 
## YAML als Überschreibung von JSON

Entsprechend der Beschreibung der YAML Spezifikation ist YAML eine Überschreibung
von JSON. Das bedeutet, dass jede valide JSON Struktur auch valide in YAML ist.

Dies hat Vorteile: Manchmal finden es Vorlagenentwickler einfacher eine
Datenstruktur in JSON-ähnlicher Syntax anzugeben, anstatt sich mit dem leerzeichensensitiven
YAML abzugeben.

Als bewährte Methode sollten Vorlagen einer YAML-ähnlichen Syntax folgen, unabhängig vom JSON.
Die Syntax reduziert das Risiko eines Formatierungsproblems erheblich.

## Vorsicht bei zufallsgenerierten Werten

Es gibt Funktionen in Helm, die zufällige Daten generieren, kryptographische Schlüssel usw..
Das ist gut so, aber achten Sie darauf, dass diese bem Aktualisieren und Rendern nochmal
ausgeführt werden. Wenn eine Vorage unterschiedliche Daten wie beim letzten Lauf generiert,
triggert das eine Aktualisierung der Resource.

## Installieren oder Aktualisieren einer Version mit einem Kommando

Helm stellt einen Weg zur Verfügung, um Installation und Aktualisierung in einem Kommando
aufzurufen. Benutzen Sie `helm upgrade` mit dem `--install` Kommando. Das veranlasst Helm
erst nachzuschauen, ob eine Version schon installiert ist, bevor es sie installiert.
Wenn sie vorhanden ist, wird Helm die existierende Version aktualisieren.

```console
$ helm upgrade --install <release name> --values <values file> <chart directory>
```
