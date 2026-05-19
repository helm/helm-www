---
title: Der Helm Plugins Leitfaden
description: Erklärt, wie Sie Plugins verwenden und erstellen können, um die Funktionalität von Helm zu erweitern.
sidebar_position: 12
---

Ein Helm Plugin ist ein Werkzeug, das über die `helm` CLI aufgerufen werden kann,
aber nicht Teil des integrierten Helm-Quellcodes ist.

Bestehende Plugins finden Sie im Bereich [Verwandte Projekte](/community/related#helm-plugins)
oder durch eine Suche auf [GitHub](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories).

Dieser Leitfaden erklärt, wie Sie Plugins verwenden und erstellen.

## Überblick

Helm Plugins sind Erweiterungswerkzeuge, die sich nahtlos in Helm integrieren. Sie
bieten eine Möglichkeit, die Kernfunktionalität von Helm zu erweitern, ohne dass
jede neue Funktion in Go geschrieben und dem Kern-Tool hinzugefügt werden muss.

Helm Plugins haben folgende Eigenschaften:

- Sie können einer Helm-Installation hinzugefügt und daraus entfernt werden, ohne
  das Kern-Tool zu beeinflussen.
- Sie können in jeder Programmiersprache geschrieben werden.
- Sie integrieren sich in Helm und erscheinen in `helm help` und an anderen Stellen.

Helm Plugins befinden sich in `$HELM_PLUGINS`. Den aktuellen Wert dieses Pfads,
einschließlich des Standardwerts wenn er nicht in der Umgebung gesetzt ist, können
Sie mit dem Befehl `helm env` ermitteln.

Das Helm Plugin-Modell basiert teilweise auf dem Plugin-Modell von Git. Daher
wird `helm` manchmal als _Porcelain_-Schicht (Benutzeroberfläche) bezeichnet,
während Plugins die _Plumbing_-Schicht (Basiswerkzeuge) darstellen. Das bedeutet:
Helm stellt die Benutzererfahrung und die übergeordnete Verarbeitungslogik bereit,
während die Plugins die "Detailarbeit" zur Ausführung einer gewünschten Aktion
übernehmen.

## Ein Plugin installieren

Plugins werden mit dem Befehl `$ helm plugin install <pfad|url>` installiert. Sie
können einen Pfad zu einem Plugin auf Ihrem lokalen Dateisystem oder eine URL
eines entfernten VCS-Repositories angeben. Der Befehl `helm plugin install` klont
oder kopiert das Plugin vom angegebenen Pfad/URL nach `$HELM_PLUGINS`. Wenn Sie
von einem VCS installieren, können Sie die Version mit dem Argument `--version`
angeben.

```console
$ helm plugin install https://github.com/adamreese/helm-env
```

Wenn Sie eine Plugin-Tar-Distribution haben, entpacken Sie das Plugin einfach in
das Verzeichnis `$HELM_PLUGINS`. Sie können Tarball-Plugins auch direkt von einer
URL installieren mit `helm plugin install https://domain/path/to/plugin.tar.gz`

## Die Plugin-Dateistruktur

Ein Plugin ähnelt in vieler Hinsicht einem Chart. Jedes Plugin hat ein
übergeordnetes Verzeichnis mit einer `plugin.yaml`-Datei. Weitere Dateien können
vorhanden sein, aber nur die `plugin.yaml`-Datei ist erforderlich.

```console
$HELM_PLUGINS/
  |- last/
      |- plugin.yaml
```

## Die plugin.yaml-Datei

Die plugin.yaml-Datei ist für ein Plugin erforderlich. Sie enthält folgende Felder:

```yaml
name: The name of the plugin (REQUIRED)
version: A SemVer 2 version (REQUIRED)
usage: Single line usage text shown in help
description: Long description shown in places like helm help
ignoreFlags: Ignore flags passed in from Helm
platformCommand: # Configure command to run based on the platform
  - os: OS match, can be empty or omitted to match all OS'
    arch: Architecture match, can be empty or omitted to match all architectures
    command: Plugin command to execute
    args: Plugin command arguments
command: (DEPRECATED) Plugin command, use platformCommand instead
platformHooks: # Configure plugin lifecycle hooks based on the platform
  install: # Install lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin install command to execute
      args: Plugin install command arguments
  update: # Update lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin update command to execute
      args: Plugin update command arguments
  delete: # Delete lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin delete command to execute
      args: Plugin delete command arguments
hooks: # (Deprecated) Plugin lifecycle hooks, use platformHooks instead
  install: Command to install plugin
  update: Command to update plugin
  delete: Command to delete plugin
downloaders: # Configure downloaders capability
  - command: Command to invoke
    protocols:
      - Protocol schema supported
```

### Das Feld `name`

Das `name` ist der Name des Plugins. Wenn Helm dieses Plugin ausführt, verwendet
es diesen Namen (z. B. wird `helm NAME` dieses Plugin aufrufen).

_`name` sollte mit dem Verzeichnisnamen übereinstimmen._ In unserem Beispiel oben
bedeutet das, dass das Plugin mit `name: last` in einem Verzeichnis namens `last`
enthalten sein sollte.

Einschränkungen für `name`:

- `name` darf keinen der bestehenden `helm` Top-Level-Befehle duplizieren.
- `name` muss auf die ASCII-Zeichen a-z, A-Z, 0-9, `_` und `-` beschränkt sein.

### Das Feld `version`

Das `version` ist die SemVer 2-Version des Plugins. `usage` und `description`
werden beide zur Generierung des Hilfetextes eines Befehls verwendet.

### Das Feld `ignoreFlags`

Der Schalter `ignoreFlags` weist Helm an, _keine_ Flags an das Plugin zu übergeben.
Wenn also ein Plugin mit `helm myplugin --foo` aufgerufen wird und `ignoreFlags:
true` gesetzt ist, wird `--foo` stillschweigend verworfen.

### Das Feld `platformCommand`

Das `platformCommand` konfiguriert den Befehl, den das Plugin bei Aufruf ausführt.
Sie können nicht sowohl `platformCommand` als auch `command` setzen, da dies zu
einem Fehler führt. Die folgenden Regeln gelten für die Auswahl des auszuführenden
Befehls:

- Wenn `platformCommand` vorhanden ist, wird es verwendet.
  - Wenn sowohl `os` als auch `arch` mit der aktuellen Plattform übereinstimmen,
  wird die Suche beendet und der Befehl verwendet.
  - Wenn `os` übereinstimmt und `arch` leer ist, wird der Befehl verwendet.
  - Wenn sowohl `os` als auch `arch` leer sind, wird der Befehl verwendet.
  - Wenn keine Übereinstimmung vorliegt, beendet sich Helm mit einem Fehler.
- Wenn `platformCommand` nicht vorhanden ist und das veraltete `command` vorhanden
ist, wird es verwendet.
  - Wenn der Befehl leer ist, beendet sich Helm mit einem Fehler.

### Das Feld `platformHooks`

Das `platformHooks` konfiguriert die Befehle, die das Plugin für Lifecycle-Events
ausführt. Sie können nicht sowohl `platformHooks` als auch `hooks` setzen, da dies
zu einem Fehler führt. Die folgenden Regeln gelten für die Auswahl des Hook-Befehls:

- Wenn `platformHooks` vorhanden ist, wird es verwendet und die Befehle für das
Lifecycle-Event werden verarbeitet.
  - Wenn sowohl `os` als auch `arch` mit der aktuellen Plattform übereinstimmen,
  wird die Suche beendet und der Befehl verwendet.
  - Wenn `os` übereinstimmt und `arch` leer ist, wird der Befehl verwendet.
  - Wenn sowohl `os` als auch `arch` leer sind, wird der Befehl verwendet.
  - Wenn keine Übereinstimmung vorliegt, überspringt Helm das Event.
- Wenn `platformHooks` nicht vorhanden ist und das veraltete `hooks` vorhanden ist,
wird der Befehl für das Lifecycle-Event verwendet.
  - Wenn der Befehl leer ist, überspringt Helm das Event.

## Ein Plugin erstellen

Hier ist das Plugin-YAML für ein einfaches Plugin, das den letzten Release-Namen
abruft:

```yaml
name: last
version: 0.1.0
usage: get the last release name
description: get the last release name
ignoreFlags: false
platformCommand:
  - command: ${HELM_BIN}
    args:
      - list
      - --short
      - --max=1
      - --date
      - -r
```

Plugins können zusätzliche Skripte und ausführbare Dateien benötigen.
Skripte können im Plugin-Verzeichnis enthalten sein und ausführbare Dateien können
über einen Hook heruntergeladen werden. Das folgende Beispiel zeigt ein Plugin:

```console
$HELM_PLUGINS/
  |- myplugin/
    |- scripts/
      |- install.ps1
      |- install.sh
    |- plugin.yaml
```

```yaml
name: myplugin
version: 0.1.0
usage: example plugin
description: example plugin
ignoreFlags: false
platformCommand:
  - command: ${HELM_PLUGIN_DIR}/bin/myplugin
  - os: windows
    command: ${HELM_PLUGIN_DIR}\bin\myplugin.exe
platformHooks:
  install:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
  update:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
      args:
        - -u
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
        - -Update
```

Umgebungsvariablen werden interpoliert, bevor das Plugin ausgeführt wird. Das
obige Muster zeigt die bevorzugte Methode, um anzugeben, wo sich das Plugin-Programm
befindet.

### Plugin-Befehle

Es gibt einige Strategien für die Arbeit mit Plugin-Befehlen:

- Wenn ein Plugin eine ausführbare Datei enthält, sollte die ausführbare Datei für
  einen `platformCommand:` im Plugin-Verzeichnis verpackt oder über einen Hook
  installiert werden.
- Die Zeile `platformCommand:` oder `command:` wird vor der Ausführung alle
  Umgebungsvariablen expandieren. `$HELM_PLUGIN_DIR` zeigt auf das Plugin-Verzeichnis.
- Der Befehl selbst wird nicht in einer Shell ausgeführt. Sie können also kein
  Shell-Skript in einer Zeile schreiben.
- Helm injiziert viele Konfigurationen in Umgebungsvariablen. Schauen Sie in die
  Umgebung, um zu sehen, welche Informationen verfügbar sind.
- Helm macht keine Annahmen über die Sprache des Plugins. Sie können es in der
  Sprache Ihrer Wahl schreiben.
- Befehle sind dafür verantwortlich, spezifische Hilfetexte für `-h` und
  `--help` zu implementieren. Helm verwendet `usage` und `description` für
  `helm help` und `helm help myplugin`, behandelt aber nicht `helm myplugin --help`.

### Ein lokales Plugin testen

Zuerst müssen Sie Ihren `HELM_PLUGINS`-Pfad finden. Führen Sie dazu den folgenden
Befehl aus:

``` bash
helm env
```

Wechseln Sie in das Verzeichnis, auf das `HELM_PLUGINS` gesetzt ist.

Jetzt können Sie einen symbolischen Link zu Ihrer Build-Ausgabe Ihres Plugins
hinzufügen – in diesem Beispiel haben wir es für `mapkubeapis` gemacht.

``` bash
ln -s ~/GitHub/helm-mapkubeapis ./helm-mapkubeapis
```

## Downloader Plugins

Standardmäßig kann Helm Charts über HTTP/S herunterladen. Seit Helm 2.4.0 können
Plugins eine spezielle Fähigkeit haben, Charts aus beliebigen Quellen
herunterzuladen.

Plugins deklarieren diese spezielle Fähigkeit in der `plugin.yaml`-Datei (auf
oberster Ebene):

```yaml
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

Wenn ein solches Plugin installiert ist, kann Helm mit dem Repository über das
angegebene Protokollschema interagieren, indem es den `command` aufruft. Das
spezielle Repository wird ähnlich wie reguläre Repositories hinzugefügt:
`helm repo add favorite myprotocol://example.com/` Die Regeln für spezielle
Repositories sind die gleichen wie für reguläre: Helm muss in der Lage sein,
die `index.yaml`-Datei herunterzuladen, um die Liste der verfügbaren Charts zu
ermitteln und zwischenzuspeichern.

Der definierte Befehl wird mit folgendem Schema aufgerufen: `command certFile
keyFile caFile full-URL`. Die SSL-Anmeldeinformationen stammen aus der
Repository-Definition, die in `$HELM_REPOSITORY_CONFIG` gespeichert ist
(d. h. `$HELM_CONFIG_HOME/repositories.yaml`). Ein Downloader-Plugin soll den
Rohinhalt auf stdout ausgeben und Fehler auf stderr melden.

Der Downloader-Befehl unterstützt auch Unterbefehle oder Argumente, sodass Sie
beispielsweise `bin/mydownloader subcommand -d` in der `plugin.yaml` angeben
können. Dies ist nützlich, wenn Sie dieselbe ausführbare Datei für den
Haupt-Plugin-Befehl und den Downloader-Befehl verwenden möchten, aber mit einem
unterschiedlichen Unterbefehl für jeden.

## Umgebungsvariablen

Wenn Helm ein Plugin ausführt, übergibt es die äußere Umgebung an das Plugin
und injiziert auch einige zusätzliche Umgebungsvariablen.

Variablen wie `KUBECONFIG` werden für das Plugin gesetzt, wenn sie in der
äußeren Umgebung gesetzt sind.

Die folgenden Variablen sind garantiert gesetzt:

- `HELM_PLUGINS`: Der Pfad zum Plugins-Verzeichnis.
- `HELM_PLUGIN_NAME`: Der Name des Plugins, wie von `helm` aufgerufen. So hat
  `helm myplug` den Kurznamen `myplug`.
- `HELM_PLUGIN_DIR`: Das Verzeichnis, das das Plugin enthält.
- `HELM_BIN`: Der Pfad zum `helm`-Befehl (wie vom Benutzer ausgeführt).
- `HELM_DEBUG`: Zeigt an, ob das Debug-Flag von Helm gesetzt wurde.
- `HELM_REGISTRY_CONFIG`: Der Speicherort für die Registry-Konfiguration (falls
  verwendet). Beachten Sie, dass die Verwendung von Helm mit Registries eine
  experimentelle Funktion ist.
- `HELM_REPOSITORY_CACHE`: Der Pfad zu den Repository-Cache-Dateien.
- `HELM_REPOSITORY_CONFIG`: Der Pfad zur Repository-Konfigurationsdatei.
- `HELM_NAMESPACE`: Der Namespace, der dem `helm`-Befehl übergeben wurde
  (üblicherweise mit dem Flag `-n`).
- `HELM_KUBECONTEXT`: Der Name des Kubernetes-Konfigurationskontexts, der dem
  `helm`-Befehl übergeben wurde.

Zusätzlich wird, wenn eine Kubernetes-Konfigurationsdatei explizit angegeben wurde,
diese als Variable `KUBECONFIG` gesetzt.

## Hinweis zur Flag-Verarbeitung

Bei der Ausführung eines Plugins analysiert Helm globale Flags für den eigenen
Gebrauch. Keines dieser Flags wird an das Plugin weitergegeben.
- `--burst-limit`: Dies wird zu `$HELM_BURST_LIMIT` konvertiert
- `--debug`: Wenn dies angegeben ist, wird `$HELM_DEBUG` auf `1` gesetzt
- `--kube-apiserver`: Dies wird zu `$HELM_KUBEAPISERVER` konvertiert
- `--kube-as-group`: Diese werden zu `$HELM_KUBEASGROUPS` konvertiert
- `--kube-as-user`: Dies wird zu `$HELM_KUBEASUSER` konvertiert
- `--kube-ca-file`: Dies wird zu `$HELM_KUBECAFILE` konvertiert
- `--kube-context`: Dies wird zu `$HELM_KUBECONTEXT` konvertiert
- `--kube-insecure-skip-tls-verify`: Dies wird zu `$HELM_KUBEINSECURE_SKIP_TLS_VERIFY` konvertiert
- `--kube-tls-server-name`: Dies wird zu `$HELM_KUBETLS_SERVER_NAME` konvertiert
- `--kube-token`: Dies wird zu `$HELM_KUBETOKEN` konvertiert
- `--kubeconfig`: Dies wird zu `$KUBECONFIG` konvertiert
- `--namespace` und `-n`: Dies wird zu `$HELM_NAMESPACE` konvertiert
- `--qps`: Dies wird zu `$HELM_QPS` konvertiert
- `--registry-config`: Dies wird zu `$HELM_REGISTRY_CONFIG` konvertiert
- `--repository-cache`: Dies wird zu `$HELM_REPOSITORY_CACHE` konvertiert
- `--repository-config`: Dies wird zu `$HELM_REPOSITORY_CONFIG` konvertiert

Plugins _sollten_ Hilfetext anzeigen und dann beenden für `-h` und `--help`. In
allen anderen Fällen können Plugins Flags nach Bedarf verwenden.

## Shell-Autovervollständigung bereitstellen

Seit Helm 3.2 kann ein Plugin optional Unterstützung für die Shell-Autovervollständigung
als Teil des bestehenden Autovervollständigungsmechanismus von Helm bereitstellen.

### Statische Autovervollständigung

Wenn ein Plugin eigene Flags und/oder Unterbefehle bereitstellt, kann es Helm
darüber informieren, indem eine `completion.yaml`-Datei im Stammverzeichnis des
Plugins vorhanden ist. Die `completion.yaml`-Datei hat folgende Form:

```yaml
name: <pluginName>
flags:
- <flag 1>
- <flag 2>
validArgs:
- <arg value 1>
- <arg value 2>
commands:
  name: <commandName>
  flags:
  - <flag 1>
  - <flag 2>
  validArgs:
  - <arg value 1>
  - <arg value 2>
  commands:
     <and so on, recursively>
```

Hinweise:

1. Alle Abschnitte sind optional, sollten aber angegeben werden, wenn zutreffend.
1. Flags sollten nicht das Präfix `-` oder `--` enthalten.
1. Sowohl kurze als auch lange Flags können und sollten angegeben werden. Ein
   kurzes Flag muss nicht mit seiner entsprechenden Langform verknüpft sein,
   aber beide Formen sollten aufgelistet werden.
1. Flags müssen nicht in einer bestimmten Reihenfolge sein, müssen aber an der
   richtigen Stelle in der Unterbefehl-Hierarchie der Datei aufgelistet werden.
1. Die bestehenden globalen Flags von Helm werden bereits vom Autovervollständigungsmechanismus
   von Helm behandelt, daher müssen Plugins die folgenden Flags nicht angeben:
   `--debug`, `--namespace` oder `-n`, `--kube-context` und `--kubeconfig`,
   oder andere globale Flags.
1. Die `validArgs`-Liste bietet eine statische Liste möglicher Vervollständigungen
   für den ersten Parameter nach einem Unterbefehl. Es ist nicht immer möglich,
   eine solche Liste im Voraus bereitzustellen (siehe Abschnitt [Dynamische
   Vervollständigung](#dynamische-vervollständigung) unten), in diesem Fall kann
   der `validArgs`-Abschnitt weggelassen werden.

Die `completion.yaml`-Datei ist vollständig optional. Wenn sie nicht bereitgestellt
wird, bietet Helm einfach keine Shell-Autovervollständigung für das Plugin (es sei
denn, das Plugin unterstützt [Dynamische Vervollständigung](#dynamische-vervollständigung)).
Das Hinzufügen einer `completion.yaml`-Datei ist abwärtskompatibel und beeinflusst
das Verhalten des Plugins bei Verwendung älterer Helm-Versionen nicht.

Als Beispiel hat das [`fullstatus
Plugin`](https://github.com/marckhouzam/helm-fullstatus), das keine Unterbefehle
hat, aber dieselben Flags wie der Befehl `helm status` akzeptiert, folgende
`completion.yaml`-Datei:

```yaml
name: fullstatus
flags:
- o
- output
- revision
```

Ein komplexeres Beispiel für das [`2to3
Plugin`](https://github.com/helm/helm-2to3) hat folgende `completion.yaml`-Datei:

```yaml
name: 2to3
commands:
- name: cleanup
  flags:
  - config-cleanup
  - dry-run
  - l
  - label
  - release-cleanup
  - s
  - release-storage
  - tiller-cleanup
  - t
  - tiller-ns
  - tiller-out-cluster
- name: convert
  flags:
  - delete-v2-releases
  - dry-run
  - l
  - label
  - s
  - release-storage
  - release-versions-max
  - t
  - tiller-ns
  - tiller-out-cluster
- name: move
  commands:
  - name: config
    flags:
    - dry-run
```

### Dynamische Vervollständigung

Ebenfalls seit Helm 3.2 können Plugins ihre eigene dynamische Shell-Autovervollständigung
bereitstellen. Dynamische Shell-Autovervollständigung ist die Vervollständigung von
Parameter- oder Flag-Werten, die nicht im Voraus definiert werden können. Zum
Beispiel die Vervollständigung der Namen von Helm Releases, die derzeit im Cluster
verfügbar sind.

Damit das Plugin dynamische Autovervollständigung unterstützt, muss es eine
**ausführbare** Datei namens `plugin.complete` in seinem Stammverzeichnis
bereitstellen. Wenn das Helm-Vervollständigungsskript dynamische Vervollständigungen
für das Plugin benötigt, führt es die Datei `plugin.complete` aus und übergibt ihr
die Befehlszeile, die vervollständigt werden muss. Die ausführbare Datei
`plugin.complete` muss die Logik enthalten, um zu bestimmen, welche die korrekten
Vervollständigungsoptionen sind, und diese auf die Standardausgabe ausgeben, damit
sie vom Helm-Vervollständigungsskript verwendet werden können.

Die Datei `plugin.complete` ist vollständig optional. Wenn sie nicht bereitgestellt
wird, bietet Helm einfach keine dynamische Autovervollständigung für das Plugin.
Das Hinzufügen einer `plugin.complete`-Datei ist abwärtskompatibel und beeinflusst
das Verhalten des Plugins bei Verwendung älterer Helm-Versionen nicht.

Die Ausgabe des `plugin.complete`-Skripts sollte eine durch Zeilenumbrüche getrennte
Liste sein, wie:

```console
rel1
rel2
rel3
```

Wenn `plugin.complete` aufgerufen wird, wird die Plugin-Umgebung genauso gesetzt
wie beim Aufruf des Haupt-Skripts des Plugins. Daher sind die Variablen
`$HELM_NAMESPACE`, `$HELM_KUBECONTEXT` und alle anderen Plugin-Variablen bereits
gesetzt, und ihre entsprechenden globalen Flags wurden entfernt.

Die Datei `plugin.complete` kann in jeder ausführbaren Form vorliegen; es kann ein
Shell-Skript, ein Go-Programm oder jede andere Art von Programm sein, das Helm
ausführen kann. Die Datei `plugin.complete` ***muss*** ausführbare Berechtigungen
für den Benutzer haben. Die Datei `plugin.complete` ***muss*** mit einem Erfolgscode
(Wert 0) beenden.

In einigen Fällen erfordert die dynamische Vervollständigung das Abrufen von
Informationen aus dem Kubernetes-Cluster. Zum Beispiel erfordert das Plugin
`helm fullstatus` einen Release-Namen als Eingabe. Im `fullstatus`-Plugin kann
sein `plugin.complete`-Skript, um Vervollständigungen für aktuelle Release-Namen
bereitzustellen, einfach `helm list -q` ausführen und das Ergebnis ausgeben.

Wenn es gewünscht ist, dieselbe ausführbare Datei für die Plugin-Ausführung und
für die Plugin-Vervollständigung zu verwenden, kann das `plugin.complete`-Skript
so gestaltet werden, dass es die ausführbare Hauptdatei des Plugins mit einem
speziellen Parameter oder Flag aufruft. Wenn die ausführbare Hauptdatei des Plugins
den speziellen Parameter oder das Flag erkennt, weiß sie, dass sie die Vervollständigung
ausführen soll. In unserem Beispiel könnte `plugin.complete` wie folgt implementiert
werden:

```sh
#!/usr/bin/env sh

# "$@" is the entire command-line that requires completion.
# It is important to double-quote the "$@" variable to preserve a possibly empty last parameter.
$HELM_PLUGIN_DIR/status.sh --complete "$@"
```

Das eigentliche Skript des `fullstatus`-Plugins (`status.sh`) muss dann nach dem
Flag `--complete` suchen und, wenn gefunden, die entsprechenden Vervollständigungen
ausgeben.

### Tipps und Tricks

1. Die Shell filtert automatisch Vervollständigungsoptionen heraus, die nicht mit
   der Benutzereingabe übereinstimmen. Ein Plugin kann daher alle relevanten
   Vervollständigungen zurückgeben, ohne diejenigen zu entfernen, die nicht mit
   der Benutzereingabe übereinstimmen. Wenn die Befehlszeile beispielsweise
   `helm fullstatus ngin<TAB>` ist, kann das `plugin.complete`-Skript *alle*
   Release-Namen (des `default`-Namespace) ausgeben, nicht nur die, die mit `ngin`
   beginnen; die Shell behält nur diejenigen, die mit `ngin` beginnen.
1. Um die Unterstützung für dynamische Vervollständigung zu vereinfachen,
   insbesondere bei einem komplexen Plugin, können Sie Ihr `plugin.complete`-Skript
   Ihr Haupt-Plugin-Skript aufrufen lassen und Vervollständigungsoptionen anfordern.
   Siehe den Abschnitt [Dynamische Vervollständigung](#dynamische-vervollständigung)
   oben für ein Beispiel.
1. Um die dynamische Vervollständigung und die `plugin.complete`-Datei zu debuggen,
   können Sie Folgendes ausführen, um die Vervollständigungsergebnisse zu sehen:
    - `helm __complete <pluginName> <arguments to complete>`. Zum Beispiel:
    - `helm __complete fullstatus --output js<ENTER>`,
    - `helm __complete fullstatus -o json ""<ENTER>`
