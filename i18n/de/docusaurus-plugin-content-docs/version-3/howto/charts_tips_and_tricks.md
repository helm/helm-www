---
title: "Chart-Entwicklung: Tipps und Tricks"
description: "Beschreibt Tipps und Tricks, die Helm Chart-Entwickler bei der Erstellung von produktionsreifen Charts gelernt haben."
sidebar_position: 1
---

Dieses Handbuch beschreibt Tipps und Tricks, die Helm Chart-Entwickler bei der Erstellung von produktionsreifen Charts gelernt haben.

## Kennen Sie Ihre Vorlagenfunktionen

Helm verwendet [Go Templates](https://godoc.org/text/template) für die Vorlagen Ihrer Ressourcendateien. Go liefert bereits einige eingebaute Funktionen mit, wir haben jedoch viele weitere hinzugefügt.

Zunächst haben wir alle Funktionen aus der [Sprig-Bibliothek](https://masterminds.github.io/sprig/) hinzugefügt, mit Ausnahme von `env` und `expandenv` aus Sicherheitsgründen.

Wir haben außerdem zwei spezielle Vorlagenfunktionen hinzugefügt: `include` und `required`. Die `include`-Funktion ermöglicht es Ihnen, eine andere Vorlage einzubinden und das Ergebnis an weitere Vorlagenfunktionen zu übergeben.

Das folgende Beispiel bindet eine Vorlage namens `mytpl` ein, wandelt das Ergebnis in Kleinbuchstaben um und setzt es in Anführungszeichen.

```yaml
value: {{ include "mytpl" . | lower | quote }}
```

Die `required`-Funktion ermöglicht es Ihnen, einen bestimmten Werteeintrag als erforderlich für das Vorlagenrendering zu deklarieren. Wenn der Wert leer ist, schlägt das Rendern fehl und gibt eine vom Entwickler definierte Fehlermeldung aus.

Das folgende Beispiel der `required`-Funktion deklariert einen Eintrag für `.Values.who` als erforderlich und gibt eine Fehlermeldung aus, wenn dieser fehlt:

```yaml
value: {{ required "A valid .Values.who entry required!" .Values.who }}
```

## Strings in Anführungszeichen setzen, Integers nicht

Wenn Sie mit Stringdaten arbeiten, sind Sie immer auf der sicheren Seite, wenn Sie Strings in Anführungszeichen setzen:

```yaml
name: {{ .Values.MyName | quote }}
```

Bei Integers hingegen sollten Sie die Werte _nicht_ in Anführungszeichen setzen. Das kann in vielen Fällen zu Parsing-Fehlern in Kubernetes führen.

```yaml
port: {{ .Values.Port }}
```

Dieser Hinweis gilt nicht für Umgebungsvariablen, die immer als String erwartet werden, auch wenn sie Integers repräsentieren:

```yaml
env:
  - name: HOST
    value: "http://host"
  - name: PORT
    value: "1234"
```

## Verwendung der 'include'-Funktion

Go bietet die Möglichkeit, über die eingebaute `template`-Direktive eine Vorlage in eine andere einzubinden. Die eingebaute Funktion kann jedoch nicht in Go Template Pipelines verwendet werden.

Um es zu ermöglichen, eine Vorlage einzubinden und dann eine Operation auf der Ausgabe dieser Vorlage durchzuführen, bietet Helm eine spezielle `include`-Funktion:

```
{{ include "toYaml" $value | indent 2 }}
```

Dies bindet eine Vorlage namens `toYaml` ein, übergibt ihr `$value` und leitet dann die Ausgabe dieser Vorlage an die `indent`-Funktion weiter.

Da YAML Einrückungen und Leerzeichen große Bedeutung beimisst, ist dies ein hervorragender Weg, Code-Snippets einzubinden und dabei die Einrückung im relevanten Kontext zu handhaben.

## Verwendung der 'required'-Funktion

Go bietet die Möglichkeit, Vorlagenoptionen zu setzen, um das Verhalten zu steuern, wenn auf eine Map mit einem nicht vorhandenen Schlüssel zugegriffen wird. Dies wird typischerweise mit `template.Options("missingkey=option")` gesetzt, wobei `option` die Werte `default`, `zero` oder `error` haben kann. Während das Setzen dieser Option auf error die Ausführung mit einem Fehler stoppt, würde dies für jeden fehlenden Schlüssel in der Map gelten. Es gibt jedoch Situationen, in denen Chart-Entwickler dieses Verhalten nur für bestimmte Werte in der `values.yaml`-Datei erzwingen möchten.

Die `required`-Funktion gibt Entwicklern die Möglichkeit, einen Werteeintrag als erforderlich für das Vorlagenrendering zu deklarieren. Wenn der Eintrag in `values.yaml` leer ist, wird die Vorlage nicht gerendert und gibt eine vom Entwickler bereitgestellte Fehlermeldung zurück.

Zum Beispiel:

```
{{ required "A valid foo is required!" .Values.foo }}
```

Das obige Beispiel rendert die Vorlage, wenn `.Values.foo` definiert ist, schlägt aber fehl, wenn `.Values.foo` nicht definiert ist.

## Verwendung der 'tpl'-Funktion

Die `tpl`-Funktion ermöglicht es Entwicklern, Strings innerhalb einer Vorlage als Vorlagen auszuwerten. Dies ist nützlich, um einen Vorlagenstring als Wert an ein Chart zu übergeben oder externe Konfigurationsdateien zu rendern. Syntax: `{{ tpl TEMPLATE_STRING VALUES }}`

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

## Erstellen von Image Pull Secrets

Image Pull Secrets sind im Wesentlichen eine Kombination aus _Registry_, _Benutzername_ und _Passwort_. Sie benötigen diese möglicherweise in einer Anwendung, die Sie bereitstellen, aber zum Erstellen müssen Sie `base64` mehrfach ausführen. Wir können eine Hilfsvorlage schreiben, um die Docker-Konfigurationsdatei als Payload für das Secret zu erstellen. Hier ist ein Beispiel:

Zunächst nehmen wir an, dass die Zugangsdaten in der `values.yaml`-Datei wie folgt definiert sind:

```yaml
imageCredentials:
  registry: quay.io
  username: someone
  password: sillyness
  email: someone@host.com
```

Dann definieren wir unsere Hilfsvorlage wie folgt:

```
{{- define "imagePullSecret" }}
{{- with .Values.imageCredentials }}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":%s,\"email\":\"%s\",\"auth\":\"%s\"}}}" .registry .username (.password | quote) .email (printf "%s:%s" .username .password | b64enc) | b64enc }}
{{- end }}
{{- end }}
```

Schließlich verwenden wir die Hilfsvorlage in einer größeren Vorlage, um das Secret-Manifest zu erstellen:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: {{ template "imagePullSecret" . }}
```

## Automatisches Rollout von Deployments

Häufig werden ConfigMaps oder Secrets als Konfigurationsdateien in Container injiziert, oder es gibt andere externe Abhängigkeitsänderungen, die ein Rollout der Pods erfordern. Abhängig von der Anwendung kann ein Neustart erforderlich sein, wenn diese bei einem nachfolgenden `helm upgrade` aktualisiert werden. Wenn sich jedoch die Deployment-Spezifikation selbst nicht geändert hat, läuft die Anwendung weiterhin mit der alten Konfiguration, was zu einer inkonsistenten Bereitstellung führt.

Die `sha256sum`-Funktion kann verwendet werden, um sicherzustellen, dass der Annotation-Abschnitt eines Deployments aktualisiert wird, wenn sich eine andere Datei ändert:

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
[...]
```

HINWEIS: Wenn Sie dies zu einem Library Chart hinzufügen, können Sie nicht auf Ihre Datei über `$.Template.BasePath` zugreifen. Stattdessen können Sie Ihre Definition mit `{{ include ("mylibchart.configmap") . | sha256sum }}` referenzieren.

Falls Sie Ihr Deployment immer neu ausrollen möchten, können Sie einen ähnlichen Annotation-Schritt wie oben verwenden, aber stattdessen einen zufälligen String einsetzen, sodass sich dieser immer ändert und ein Rollout des Deployments auslöst:

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        rollme: {{ randAlphaNum 5 | quote }}
[...]
```

Jeder Aufruf der Vorlagenfunktion generiert einen eindeutigen zufälligen String. Das bedeutet, wenn es notwendig ist, die von mehreren Ressourcen verwendeten zufälligen Strings zu synchronisieren, müssen sich alle relevanten Ressourcen in derselben Vorlagendatei befinden.

Beide Methoden ermöglichen es Ihrem Deployment, die eingebaute Update-Strategie-Logik zu nutzen, um Ausfallzeiten zu vermeiden.

HINWEIS: In der Vergangenheit haben wir die Verwendung des `--recreate-pods`-Flags als weitere Option empfohlen. Dieses Flag wurde in Helm 3 als veraltet markiert, zugunsten der oben beschriebenen deklarativen Methode.

## Helm anweisen, eine Ressource nicht zu deinstallieren

Manchmal gibt es Ressourcen, die nicht deinstalliert werden sollten, wenn Helm `helm uninstall` ausführt. Chart-Entwickler können einer Ressource eine Annotation hinzufügen, um das Deinstallieren zu verhindern.

```yaml
kind: Secret
metadata:
  annotations:
    helm.sh/resource-policy: keep
[...]
```

Die Annotation `helm.sh/resource-policy: keep` weist Helm an, das Löschen dieser Ressource zu überspringen, wenn eine Helm-Operation (wie `helm uninstall`, `helm upgrade` oder `helm rollback`) normalerweise zu ihrer Löschung führen würde. _Allerdings_ wird diese Ressource dann verwaist. Helm wird sie in keiner Weise mehr verwalten. Dies kann zu Problemen führen, wenn `helm install --replace` für ein Release verwendet wird, das bereits deinstalliert wurde, aber Ressourcen behalten hat.

## Verwendung von "Partials" und Template-Includes

Manchmal möchten Sie wiederverwendbare Teile in Ihrem Chart erstellen, sei es als Blöcke oder Template-Partials. Oft ist es sauberer, diese in eigenen Dateien zu halten.

Im `templates/`-Verzeichnis wird von keiner Datei, die mit einem Unterstrich (`_`) beginnt, erwartet, dass sie eine Kubernetes-Manifest-Datei ausgibt. Daher werden Hilfsvorlagen und Partials konventionsgemäß in einer `_helpers.tpl`-Datei platziert.

## Komplexe Charts mit vielen Abhängigkeiten

Viele Charts im CNCF [Artifact Hub](https://artifacthub.io/packages/search?kind=0) sind "Bausteine" zur Erstellung fortgeschrittener Anwendungen. Charts können jedoch auch verwendet werden, um Instanzen von großangelegten Anwendungen zu erstellen. In solchen Fällen kann ein einzelnes Umbrella-Chart mehrere Subcharts haben, von denen jedes als Teil des Ganzen fungiert.

Die aktuelle Best Practice für das Zusammenstellen einer komplexen Anwendung aus einzelnen Teilen ist die Erstellung eines Top-Level-Umbrella-Charts, das die globalen Konfigurationen exponiert, und dann die Verwendung des `charts/`-Unterverzeichnisses zum Einbetten jeder der Komponenten.

## YAML ist eine Obermenge von JSON

Laut der YAML-Spezifikation ist YAML eine Obermenge von JSON. Das bedeutet, dass jede gültige JSON-Struktur auch in YAML gültig sein sollte.

Dies hat einen Vorteil: Manchmal finden es Vorlagenentwickler einfacher, eine Datenstruktur mit einer JSON-ähnlichen Syntax auszudrücken, anstatt sich mit YAMLs Empfindlichkeit gegenüber Leerzeichen auseinanderzusetzen.

Als Best Practice sollten Vorlagen einer YAML-ähnlichen Syntax folgen, _es sei denn_, die JSON-Syntax reduziert das Risiko eines Formatierungsproblems erheblich.

## Vorsicht beim Generieren zufälliger Werte

Es gibt Funktionen in Helm, die es ermöglichen, zufällige Daten, kryptographische Schlüssel usw. zu generieren. Diese können problemlos verwendet werden. Beachten Sie jedoch, dass Vorlagen bei Upgrades erneut ausgeführt werden. Wenn ein Vorlagenlauf Daten generiert, die sich vom letzten Lauf unterscheiden, löst dies ein Update dieser Ressource aus.

## Installieren oder Aktualisieren eines Releases mit einem Befehl

Helm bietet die Möglichkeit, eine Installation oder ein Upgrade als einzelnen Befehl auszuführen. Verwenden Sie `helm upgrade` mit der `--install`-Option. Dies veranlasst Helm zu prüfen, ob das Release bereits installiert ist. Falls nicht, führt es eine Installation durch. Falls ja, wird das vorhandene Release aktualisiert.

```console
$ helm upgrade --install <release name> --values <values file> <chart directory>
```
