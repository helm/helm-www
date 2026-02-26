---
title: Values-Dateien
description: Anleitung zur Verwendung des --values-Flags.
sidebar_position: 4
---

Im vorherigen Abschnitt haben wir die eingebauten Objekte betrachtet, die Helm
Templates bieten. Eines dieser eingebauten Objekte ist `Values`. Dieses Objekt
bietet Zugriff auf Werte, die in das Chart übergeben werden. Der Inhalt stammt
aus mehreren Quellen:

- Die `values.yaml`-Datei im Chart
- Falls es sich um ein Subchart handelt, die `values.yaml`-Datei des
  übergeordneten Charts
- Eine Values-Datei, die mit dem `-f`-Flag an `helm install` oder `helm upgrade`
  übergeben wird (`helm install -f myvals.yaml ./mychart`)
- Einzelne Parameter, die mit `--set` übergeben werden (z.B. `helm install --set foo=bar
  ./mychart`)

Die obige Liste ist nach Priorität geordnet: `values.yaml` ist die
Standardeinstellung, die von der `values.yaml` eines übergeordneten Charts
überschrieben werden kann, welche wiederum von einer benutzerdefinierten
Values-Datei überschrieben werden kann, die ihrerseits von `--set`-Parametern
überschrieben werden kann.

Values-Dateien sind einfache YAML-Dateien. Bearbeiten wir `mychart/values.yaml`
und anschließend unser ConfigMap-Template.

Nach dem Entfernen der Standardwerte in `values.yaml` setzen wir nur einen
Parameter:

```yaml
favoriteDrink: coffee
```

Jetzt können wir diesen Wert in einem Template verwenden:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favoriteDrink }}
```

Beachten Sie, dass wir in der letzten Zeile auf `favoriteDrink` als Attribut von
`Values` zugreifen: `{{ .Values.favoriteDrink }}`.

Sehen wir uns das Ergebnis an:

```console
$ helm install geared-marsupi ./mychart --dry-run --debug
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: geared-marsupi
LAST DEPLOYED: Wed Feb 19 23:21:13 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
favoriteDrink: coffee

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: geared-marsupi-configmap
data:
  myvalue: "Hello World"
  drink: coffee
```

Da `favoriteDrink` in der Standard-`values.yaml`-Datei auf `coffee` gesetzt ist,
wird dieser Wert im Template angezeigt. Wir können dies einfach überschreiben,
indem wir ein `--set`-Flag bei unserem `helm install`-Aufruf hinzufügen:

```console
$ helm install solid-vulture ./mychart --dry-run --debug --set favoriteDrink=slurm
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: solid-vulture
LAST DEPLOYED: Wed Feb 19 23:25:54 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
favoriteDrink: slurm

COMPUTED VALUES:
favoriteDrink: slurm

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: solid-vulture-configmap
data:
  myvalue: "Hello World"
  drink: slurm
```

Da `--set` eine höhere Priorität als die Standard-`values.yaml`-Datei hat,
erzeugt unser Template `drink: slurm`.

Values-Dateien können auch strukturiertere Inhalte enthalten. Zum Beispiel
könnten wir einen `favorite`-Abschnitt in unserer `values.yaml`-Datei erstellen
und dort mehrere Schlüssel hinzufügen:

```yaml
favorite:
  drink: coffee
  food: pizza
```

Nun müssten wir das Template leicht anpassen:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink }}
  food: {{ .Values.favorite.food }}
```

Obwohl diese Art der Datenstrukturierung möglich ist, empfehlen wir, Ihre
Values-Bäume flach zu halten. Wenn wir uns mit der Zuweisung von Werten an
Subcharts beschäftigen, werden wir sehen, wie Werte mit einer Baumstruktur
benannt werden.

## Löschen eines Standardschlüssels

Falls Sie einen Schlüssel aus den Standardwerten entfernen müssen, können Sie
den Wert des Schlüssels auf `null` setzen. Helm entfernt dann den Schlüssel bei
der Zusammenführung der überschriebenen Werte.

Beispielsweise erlaubt das Stable Drupal Chart die Konfiguration der
Liveness-Probe, falls Sie ein benutzerdefiniertes Image konfigurieren. Hier sind
die Standardwerte:
```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  initialDelaySeconds: 120
```

Wenn Sie versuchen, den livenessProbe-Handler mit
`--set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt]` auf `exec` statt
`httpGet` zu überschreiben, führt Helm die Standard- und überschriebenen
Schlüssel zusammen, was zu folgendem YAML führt:
```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  exec:
    command:
    - cat
    - docroot/CHANGELOG.txt
  initialDelaySeconds: 120
```

Kubernetes würde dann jedoch einen Fehler melden, da Sie nicht mehr als einen
livenessProbe-Handler deklarieren können. Um dies zu umgehen, können Sie Helm
anweisen, `livenessProbe.httpGet` zu löschen, indem Sie es auf null setzen:
```sh
helm install stable/drupal --set image=my-registry/drupal:0.1.0 --set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt] --set livenessProbe.httpGet=null
```

Bisher haben wir mehrere eingebaute Objekte kennengelernt und verwendet, um
Informationen in Templates einzufügen. Als Nächstes betrachten wir einen
weiteren Aspekt der Template-Engine: Funktionen und Pipelines.
