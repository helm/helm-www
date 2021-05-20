---
title: "Fragen und Antworten"
weight: 8
---

# Fragen und Antworten

> Was sind die Kernunterschiede zwischen Helm 2 und Helm 3?
> Diese Seite bietet Antworten zu oft gestelten Fragen (FAQ)

**Wir möchten Ihre Hilfe**, um dieses Dokument besser zu machen. Um Informationen
hinzuzufügen, korrigieren oder zu löschen, [füllen Sie ein Issue aus](https://github.com/helm/helm-www/issues)
oder senden Sie einne Pull Request.

## Änderungen seit Helm 2

Hier ist eine Liste an grundlegenden Änderungen in Helm 3.

### Löschung von Tiller

Während des Helm 2 Entwicklungszyklus haben wir Tiller vorgestellt. Tiller
spielte eine wichtige Rolle für Teams in einem geteilten Cluster - es war
für mehrere unterschiedliche Operatoren möglich, mit demselben Set an Versionen
zu interagieren.

Mit rollenbasierter Zugriffskontrolle (RBAC), standardmässig aktiviert in Kubernetes 1.6,
sperrte Tiller immer mehr in Produktionsumgebungen aus, da die Verwaltung schwieriger
wurde. Durch die riesigen Änderungen der Sicherheitsregeln, war es unser Fokus,
eine permissive Standardkonfiguration zu liefern. Das erlaubte es Neulingen in Helm
und Kubernetes, schnell zu starten, ohne sich allzuviuel über Sicherheitskontrollen den
Kopf zu zerbrechen. Unglücklicherweise konnte diese permissive Konfiguration ein
breites Spektrum an Berechtigungen öffnen, ohne dass der Nutzer dies erwartete.
DevOps und SREs hatten zusätzliche Betriebsschritte zu lernen, um Tiller in einer
multi-mandant Cluster zu betreiben.

Nachdem wir von Gemeinschaftsmitgliedern gehört haben, wie sie Helm benutzen, fanden
wir, dass Tillers Versionsverwaltung nicht zum Clusterbetrieb oder als zentraler
Platz für Helm Versionsinformationen passte. Stattdessen können wir einfach die
Informationen von der Kubernetes-API abrufen, die Charts auf lokaler Seite rendern und
einen Eintrag der Installation in Kubernetes speichern.

Tillers primäre Ziel konnte ohne Tiller erreicht werden, so war es eine der ersten
Entscheidungen, die für Helm 3 getroffen wurden, Tiller komplett zu entfernen.

Ohne Tiller hat sich das Sicherheitsmodell von Helm radikal vereinfacht. Helm 3
unterstützt jetzt moderne Funktionen von Kubernetes zu Sicherheits, Identität und Authorisierung.
Helms Zugriffsrechte werden durch Evaluierung der [kubeconfig
Datei](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) getroffen.
Cluster Administratoren können Zugriffsrechte granular restriktieren.
Versionen werden weiter im Cluster gespeichert und die restliche Funktionalität
von Helm bleibt erhalten.

### Verbesserte Aktualisierungsstrategie: 3-Wege Vereinigung

Helm 2 hat eine 2-Wege Vereinigungsstrategie beutzt. Während der Aktualisierung
verglich es die letzten Chart Manifeste gegen das vorgeschlagene Chart Manifest
(welches zur Aktualisierung vorgeschlagen wurde). Es verglich die Unterschiede
zwischen den zwei Charts, um herauszufinden, welche Änderunen notwendig sind und
welche Resourcen im Kubernetescluster übertragen werden müssen.
Wenn Änderungen ausserhalb von Helm gemacht wurden (etwa mit `kubectl edit`),
waren diese Änderungen verloren. Das resultierte in Resourcen, die nicht zurückgerollt
werden konnten: weil Helm nur die letzte installierte Version kannte und wenn
es keine Änderungen im Chart Status gegeben hat, blieb der Livestatus unverändert.

In Helm 3 benutzen wir jetzt eine 3-Wege Vereinigungsstrategie. Helm beachtet das
alte Manifest, den Livestatus und das neue Manifest, um einen Patch zu generieren.

#### Beispiele

Lassen Sie uns durch ein paar übliche Beispiele gehen, um die Auswirkungen zu
sehen.

##### Zurückrollen wo sich der Livestatus geändert hat

Ihr Team hat gerade mit Helm ihre Applikation in die Produktion auf Kubernetes gebracht.
Das Chart beinhaltet ein Deployment Objekt, in dem die Nummer der Replicas auf
drei gesetzt ist:

```console
$ helm install myapp ./myapp
```

Ein neuer Entwickler tritt dem Team bei. An seinem ersten Arbeitstag tritt
beim Betrachten des Produktions-Clusters ein fürchterlicher Kaffee-auf-Tastatur-Unfall
ein und das Deployment wird von drei Replicas auf 0 skaliert.

```console
$ kubectl scale --replicas=0 deployment/myapp
```

Ein anderer Entwickler Ihres Teams stellt fest, dass die Produktionsseite aus ist und
entscheidet ein Zurückrollen der Version zum vorherigen Status:

```console
$ helm rollback myapp
```

Was passiert?

In Helm 2 würde ein Patch generiert, der das alte gegen das neue
Manifest vergleicht. Weil es ein Zurückrollen ist, ist es dasselbe
Manifest. Helm würde feststellen, dass es nichts zu ändern gibt, weil es
keinen Unterschied zwischen dem alten und den neuen Manifest gibt. Der
Replica Zähler würde weiter auf 0 stehenbleiben. Panik bricht aus.

In Helm 3 würde ein Patch generiert, der das alte Manifest, den Livestatus
und das neue Manifest vergleicht. Helm stellt fest, dass der alte Status
drei, der Livestatus 0 und das neue Manifest den Wunsch der Änderung zurück
zu drei hegt, sodass der Patch eine Änderung des Status zu drei generiert.

##### Aktualisierungen wo sich der Livestatus geändert hat

Viele Dienstenetze und andere kontroll-basierte Applikationen injizieren
Daten in Kubernetes Objekte. Das kann sowas sein wie ein Sidecar, Label oder
andere Informationen. Vorher haben Sie ein Manifest von einem Chart so
gerendert:

```yaml
containers:
- name: server
  image: nginx:2.0.0
```

Und der Livestatus wurde von einer anderen Applikation geändert zu:

```yaml
containers:
- name: server
  image: nginx:2.0.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

Jetzt möchten Sie den `nginx` Image Tag aktualisieren zu `2.1.0`. Um das
zu erreichen, akualisieren Sie das Chart mit diesem Manifest:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

Was passiert?

In Helm 2 generiert Helm einen Patch für das `containers` Objekt zwischen dem
alten und dem neuen Manifest. Der Cluster Livestatus wird bei der Patchgenerierung
nicht beachtet.

Der Cluster Livestatus wird in folgender Weise geändert:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

Der Sidcar Pod ist vom Livestatus gelöscht. Mehr Panik bricht aus.

In Helm 3 generiert Helm einen Patch des `containers` Objekts zwischen dem
alten Manifest, dem Livestatus und dem neuen Manifest. Es bemerkt, dass das
neue Manifest den Image Tag zu `2.1.0` ändern möchte, aber der Livestatus
einen Sidecar Container beinhaltet.

Der Cluster Livestatus wird in folgender Weise geändert:

```yaml
containers:
- name: server
  image: nginx:2.1.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

### Versionsnamen sind jetzt im Umfang des Namespace geändert

Nach der Löschung von Tiller müssen die Informationen über die Versionen
irgendwohin. In Helm 2 wurde das im selben Namespace wie Tiller gespeichert.
In der Praxis bedeutete das, dass ein Name von einer Version verwendet wurde,
keine andere Version konnte denselben Namen benutzen, auch wenn es in
unterschiedlichen Namespace installiert war.

In Helm 3 werden die Informationen über eine Version im selben Namespace
gespeichert, in dem die Version selber installiert ist. Das bedeutet, dass 
Benutzer jetzt `helm install wordpress stable/wordpress` in zwei Namespaces
benutzen könnnen und jedes wird bei `helm list` im Kontext des zugehörigen
Namespace angezeigt (z.B `helm list --namespace foo`).

Mit der grösseren Ausrichtung auf nativen Cluster Namespaces, listet das Kommando
`helm list` nicht länger alle Versionen standardmässig auf. Stattdessen listet
es nur die Versionen im derzeitigen Kubernetes Kontext auf (z.B. den Namespace
wenn Sie `kubectl config view --minify` eingeben). Das bedeutet also, dass Sie
die Option `--all-namespaces` zu `helm list` eingeben müssen, wie bei Helm 2.

### Secrets als der Standardspeichertreiber

In Helm 3 werden jetzt Secrets als der [Standardspeichertreiber](/docs/topics/advanced/#storage-backends)
benutzt. Helm 2 benutzte ConfigMaps als Standard, um Versionsinformationen zu
speichern. In Helm 2.7.0 wurde ein neues Speicher-Backend implementiert, was
jetzt in Helm 3 der Standard ist.

Die Änderung zu Secrets in Helm 3 als Standard erlaubt einen Schutz der Charts
in derselben Weise wie die Version der Secret Verschlüsselung in Kubernetes.

[Verschlüsseung von Secrets mit Rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)
wurde Standard als Alpha-Funktion in Kubernetes 1.7 und wurde stabil in
Kubernetes 1.13. Dies erlaubt Benutzer Versions Metadaten zu verschlüsseln
und es ist ein guter Startpunkt, um später sowas wie Vault zu benutzen.

### Go Import Pfadänderungen

In Helm 3 schaltete Helm den Go Importpfad von `k8s.io/helm` zu
`helm.sh/helm/v3`. Wenn Sie 3 Go client Bibliotheken verwenden, stellen
Sie die Änderung des Importpfads sicher.

### Capabilities

Die Verfügbarkeit des eingebauten `.Capabilities` Objekts wurde im Stadium
des Renderns vereinfacht.

[Eingebaute Objekte](/docs/chart_template_guide/builtin_objects/)

### Validierung der Chart Values mit JSONSchema

Ein JSON Schema kann jetzt den Chart Values auferlegt werden. Das stellt
sicher, dass die Werte, die der Nutzer eingegeben hat, dem Schemalayout
des Charts entsprechen, bessere Fehlermeldungen werden zur Verfügung
gestellt, wenn falsche Werte für das Chart eingegeben wurden.

Eine Validierung erfolgt bei folgenden Kommandos:

* `helm install`
* `helm upgrade`
* `helm template`
* `helm lint`

Sehen Sie die Dokumentation zu [Schema Dateien](/docs/topics/charts#schema-files) für
mehr Informationen.

### Konsolidierung von `requirements.yaml` in `Chart.yaml`

Das Chart Abhängigkeitssystem schwenkte von requirements.yaml und
requirements.lock zu Chart.yaml und Chart.lock. Wir empfehlen, dass neue
Charts für Helm 3 dem neuen Format folgen. Trotzdem versteht Helm 3
weiterhin die Chart APO Version 1 (`v1`) und wird vorhandene
`requirements.yaml` Dateien laden.

In Helm 2 sah eine `requirements.yaml` so aus:

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

In Helm 3 sehen die Abhängigkeiten genauso aus, stehen aber in
`Chart.yaml`:

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

Charts werden weiterhin in das `charts/` Verzeichnis heruntergeladen, Subcharts
geliefert nach `charts/` werden ohne Anpassungen weiter funktionieren.

### Name (oder --generate-name) ist jetzt zur Installation erforderlich

Wenn in Helm 2 kein Name angeben wurde, wurde einer autogeneriert. In der
Produktion war das eher störend als hilfreich. In Helm 3 gibt es eine Fehlermeldung,
wenn bei `helm install` kein Name angegeben wird.

Wer weiter einen autogenerierten Namen verwenden will, kann die Option
`--generate-name` für sich benutzen.

### Charts in OCI Registries hochladen

Dies ist eine experimentelle Funktion in Helm 3. Um sie zu benutzen, setzen Sie
die Umgebungsvariable `HELM_EXPERIMENTAL_OCI=1`.

Auf einem hohen Level, ein Chart Repository ist ein Ort, an dem Charts gespeichert
und geteilt werden können. Ein Helm Programm packt und schickt Helm Charts zu
einem Chart Repository. Einfach ausgedrückt ist das ein simpler HTTP Server, 
der eine index.yaml Datei hat und einige gepackte Charts.

Während es für die meisten einfachen Speicheranforderungen nur Vorteile bringt,
gibt es aber auch ein paar Nachteile:

- Chart Repositories fällt es sehr schwer, die Sicherheitsanforderungen an eine
  Produktionsumgebung zu erfüllen. Es ist sehr wichtig, eine Authentifizierung
  und Authorisierung für die Standard API zu haben.
- Helm Chart Herkunftswerkzeuge zum Signieren und Verifizieren der Integrität
  sind optional für den Veröffentlichungsprozess.
- In einer Mehrbenutzerumgebung kann dasselbe Chart von unterschiedlichen Nutzern
  hochgeladen werden, kostet doppelten Speicher für denselben Inhalt, aber
  das ist nicht Teil der Spezifikation.
- Die Benutzung einer einzigen Indexdatei zum Suchen, Metadataeninformationen und
  Herunterladen der Charts hat es kompliziert gemacht oder ist in einer sicheren
  Mehrbenutzerumgebung unmöglich.

Docker’s Distribution project (also known as Docker Registry v2) is the
successor to the Docker Registry project. Many major cloud vendors have a
product offering of the Distribution project, and with so many vendors offering
the same product, the Distribution project has benefited from many years of
hardening, security best practices, and battle-testing.

Please have a look at `helm help chart` and `helm help registry` for more
information on how to package a chart and push it to a Docker registry.

For more info, please see [this page](/docs/topics/registries/).

### Removal of `helm serve`

`helm serve` ran a local Chart Repository on your machine for development
purposes. However, it didn't receive much uptake as a development tool and had
numerous issues with its design. In the end, we decided to remove it and split
it out as a plugin.

For a similar experience to `helm serve`, have a look at the local filesystem
storage option in
[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)
and the [servecm plugin](https://github.com/jdolitsky/helm-servecm).


### Unterstützung für Chart Bibliotheken

Helm 3 unterstützt eine Klasse von Charts genannt "Chart Bibliotheken". Das ist
ein Chart, was von anderen Charts geteilt wird, aber keine eigenen Versionsartefakte
erstellt.
Eine Chart Bibliothek Vorlage kann nur `define` Elemente deklarieren. Global
nicht-`define` definierter Inhalt wird ignoriert. Das erlaubt Nutzern, Code oder
Codeschnippsel quer zwischen vielen Charts wiederzuverwenden und doppelten Code
zu vermeiden ([DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)).

Chart Bibliotheken sind in der Abhängigkeitsdirektive in der Chart.yaml deklariert
und werden installiert und verwaltet wie andere Charts.

```yaml
dependencies:
  - name: mylib
    version: 1.x.x
    repository: quay.io
```

Wir sind sehr stolz darauf, um Anwendungsfälle für diese Funktion von
Chartentwicklern und auch beste Beispiele der Nutzung zu sehen.

### Chart.yaml apiVersion erhöht

Mit der Vorstellung der Chartbibliotheken, der Konsilidierung der
requirements.yaml in Chart.yaml würden Programme in Helm 2 Format
nicht mehr funktionieren. So erhöhten wir die apiVersion in
Chart.yaml von `v1` zu `v2`.

`helm create` erstellt Charts jetzt in diesem neuen Format, so wurde
die Standard apiVersion ebenfalls erhöht.

Programme möchten beide Versionen unterstützen und sollten das Feld
`apiVersion` in Chart.yaml untersuchen, um zu verstehen, wie sie das
Paketformat parsen sollen.

### XDG Basis Verzeichnissupport

[Die Spezifikation zu XDG Basis Verzeichnissupport](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)
ist ein portabler Standard, der Konfigurationen, Daten und Zwischenspeicherdateien
definiert und wie sie im Dateisystem gespeichert werden sollen.

In Helm 2 speicherte Helm all diese Information in `~/.helm` (auch bekannt als
`helm home`), was mit der Umgebungsvariable `$HELM_HOME` geändert werden konnte,
oder auch durch die globale Funktion `--home`.

In Helm 3 respektiert Helm jetzt die folgenden Umgebungsvariablen nach der
XDG Basnow respects the following environment variables as per the XDG
Basis Verzeichnissupport Spezifikation:

- `$XDG_CACHE_HOME`
- `$XDG_CONFIG_HOME`
- `$XDG_DATA_HOME`

Helm Plugins beachten weiterhin für Abwärtskompatibiltät`$HELM_HOME` als Alias
für `$XDG_DATA_HOME`.

Verschiedene neue Umgebungsvariablen werden ebenfalls als Variablen des Plugins
eingeführt:

- `$HELM_PATH_CACHE` für den Pfad zum Zwischenspeicher
- `$HELM_PATH_CONFIG` für den Pfad zur Konfiguration
- `$HELM_PATH_DATA` für den Pfad zu den Daten

Helm Plugins, die Helm 3 unterstützen, sollten diese neuen Umgebungsvariablen
nutzen.

### Umbenennung von Kommandozeilenbefehle

Um sich in der Erwartungen zu anderen Paketmanagern anzupassen, wurde
`helm delete` umbenannt zu `helm uninstall`. `helm delete` funktioniert
weiterhin als ALias für `helm uninstall` und kann weiter verwendet werden.

In Helm 2 wurde die Option `--purge` bereitgestellt, um den Overhead von
Versionsinformationen aufzuräumen. Diese Funktion ist jetzt standardmässig
eingeschaltet. Um sie zu deaktivieren, gibt es die Option
`helm uninstall --keep-history`.

Zusätzlich wurden verschiedene andere Kommandos in ähnlicher Konvention
umbenannt:

- `helm inspect` -> `helm show`
- `helm fetch` -> `helm pull`

Diese Kommandos haben ihre alte Bedeutung als Alias beibehalten, sodass
sie die weiter benutzen können.

### Automatisch erstellter Namespace

Wenn eine Version in einem Namespace erstellt wird, der nicht existiert,
hat Helm2 diesen angelegt. Helm 3 folgt den Konventionen von anderen
Kubernetes Werkzeugen und gibt eine Fehlermeldung zurück, wenn der Namespace
nicht existiert. Helm 3 wird den Namespace mit der expliziten Option
`--create-namespace` anlegen.

### Was passierte mit .Chart.ApiVersion?

Helm folgt den typischen Konventionen des sogenannten `CamelCasing`,
also dem Grossschreiben von Akronymen. Wir hatten das irgendwo im Code,
wie mit `.Capabilities.APIVersions.Has`. In Helm v3 haben wir das
korrigiert zu `.Chart.ApiVersion`, um der Konvention zu folgen und
`.Chart.APIVersion` umzubenennen.

## Installieren

### Warum gibt es keine nativen Pakete von Helm für Fedora oder andere Linuxdistributionen?

Das Helm Projekt verwaltet keine Pakete für Betriebssysteme oder Umgebungen.
Die Helm Gemeinschaft stellt möglicherweise native Pakete zur Verfügung
und wenn es genug Aufmerksamkeit in der Gemeinschaft für ein Paket gibt,
wird es vielleicht gelistet. So war es als Homebrew Formular startete und gelistet
wurde. Wenn Sie interessiert sind, ein Paket zu verwalten, würden wir das 
sehr begrüssen.

### Warum stellt Ihr ein `curl ...|bash` Script zur Verfügung?

Es ist ein Script in unserem Verzeichnis (`scripts/get-helm-3`), was als
`curl ..|bash` ausgeführt werden kann. Die Übertragung ist durch HTTPS gesichert
und das Script macht einige Überprüfungen beim Abruf. Aber egal, dieses
Script hat alle Gefährlichkeiten eines Shellscripts.

Wir stellen es zur Verfügung, weil es nützlich ist, aber empfehlen den Nutzern,
es vor der ersten Ausführung gründlich zu lesen. Was wir wirklich möchten,
ist eine besser gepackte Version von Helm.

### Wie lege ich die Dateien vom Helm Programm woanders hin?

Helm benutzt die XDG Struktur zum Abspeichern von Dateien. Es gibt
Umgebungsvariablen, die diese Lokation überschreiben kann:

- `$XDG_CACHE_HOME`: Setzt eine alternative Lokation für Zwischenspeicherdateien.
- `$XDG_CONFIG_HOME`: Setzt eine alternative Lokation für Helm Konfiguration.
- `$XDG_DATA_HOME`: Setzt eine alternative Lokation für Helm Daten.

Beachten Sie, dass Sie existierende Repositories mit dem Kommando
`helm repo add...` neu hinzufügen müssen.


## Deinstallieren

### I möchte mein lokales Helm deinstallieren. Wo sind alle Dateien?

Neben dem eigentlichen `helm` Programm speichert Helm Dateien an folgenden
Orten:

- $XDG_CACHE_HOME
- $XDG_CONFIG_HOME
- $XDG_DATA_HOME

Die folgende Tabelle gibt die Standardspeicherorte je Betriebssystem an:

| Betriebssystem   | Zwischenspeicherpfad        | Konfigurationspfad               | Datenpfad                 |
|------------------|-----------------------------|----------------------------------|---------------------------|
| Linux            | `$HOME/.cache/helm `        | `$HOME/.config/helm `            | `$HOME/.local/share/helm` |
| macOS            | `$HOME/Library/Caches/helm` | `$HOME/Library/Preferences/helm` | `$HOME/Library/helm `     |
| Windows          | `%TEMP%\helm  `             | `%APPDATA%\helm `                | `%APPDATA%\helm`          |

## Fehlersuche

### Ich bekomme eine Warnung "Unable to get an update from the "stable" chart repository"

Starten Sie `helm repo list`. Wenn Ihr `stable` Repository zu `storage.googleapis.com` zeigt,
benötigen Sie eine Aktualisierung. Am 13.11.2020 wurde das Helm Chart Verzeichnis
[unsupported](https://github.com/helm/charts#deprecation-timeline), nachdem es ein Jahr lang
als veraltet gekennzeichnet wurde. Ein Archiv ist verfügbar auf
`https://charts.helm.sh/stable`, aber es bekommt keine Aktualisierungen mehr.

Sie können folgendes tun, um Ihr Repository zu reparieren:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Dasselbe gilt für das `incubator` Repository, dessen Archiv verfügbar ist bei
https://charts.helm.sh/incubator.
Zur Reparatur können Sie folgendes Kommando verwenden:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Ich bekomme die Warnung 'WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.'

Das alte Google Helm Chart Repository wurde ersetzt durch ein neues.

Starten Sie folgendes Kommando, um das dauerhaft zu beheben:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Wenn Sie einen ähnlichen Fehler für `incubator` bekommen, machen Sie folgendes:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Wenn ich ein Helm Repo hinzufüge, bekomme ich den Fehler 'Error: Repo "https://kubernetes-charts.storage.googleapis.com" is no longer available'

Das Helm Chart Repository wird nach [einem Jahr Abschaltperiode](https://github.com/helm/charts#deprecation-timeline)
nicht mehr unterstützt.
Archive für diese Verzeichnisse sind verfügbar unter `https://charts.helm.sh/stable`
und `https://charts.helm.sh/incubator`, aber es werden keine Aktualisierungen mehr
hinzugefügt. Das Kommando `helm repo add` wird das Hinzufügen der alten URLs nicht
erlauben, ausser man verwendet die Option `--use-deprecated-repos`.

### Auf GKE (Google Container Engine) bekomme ich "No SSH tunnels currently open"

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

Eine andere Variante des Fehler ist:

```
Unable to connect to the server: x509: certificate signed by unknown authority
```

Das Problem ist, dass Ihre lokale Kubernetes Konfigurationsdatei die richtigen
Anmeldeinformationen beinhalten muss.

Wenn Sie in GKE einen Cluster erstellen, werden Sie die Anmeldeinformation incl.
SSL Zertifikate bekommen. Diese müssen in einer Kubernetes Konfigurationsdatei
gespeichert werden (Default: `~/.kube/config`), sodass `kubectl` und `helm`
darauf zugreifen können.

### Nach der Migration von Helm 2 zeigt `helm list` nur sehr wenige oder gar keine Versionen an

Es scheint so, dass Sie einige Fakten übersehen haben, dass Helm 3
nur Versionen im Skope des Cluster Namespaces anzeigt. Das heisst, dass
Sie an allen Kommandos, die eine Version betreffen, diese Optionen
hinzufügen müssen:

* im derzeitigen Namespace mit aktivem Kontext bleiben (wie beschrieben im
  Kommando `kubectl config view --minify`),
* den richtigen Namespace angeben mit der Option `--namespace`/`-n` oder
* für das `helm list` Kommando die Option `--all-namespaces`/`-A` angeben

Dies wird zu allen Kommandos wie `helm ls`, `helm uninstall` und allen anderen
`helm` Befehlen referenziert zu einer Version hinzugefügt.

### In macOS kann man auf die Dateie `/etc/.mdns_debug` zugreifen. Warum?

Wir wissen davon, dass Helm auf macOS versucht, auf eine Datei namens
`/etc/.mdns_debug` zuzugreifen. Wenn die Datei existiert, hält Helm
ein Dateihandle offen, während es ausgeführt wird.

Das wird durch die macOS MDNS Bibliothek verursacht. Es erwartet, dass die
Datei zur Fehlersuche geladen wird (wenn verfügbar). Das Dateihandle sollte
nicht offen gehalten werden und der Fehler wurde bei Apple gemeldet.
Der Fehler liegt an macOS und nicht Helm.

Wenn Sie nicht möchten, dass Helm die Datei lädt, könnten Sie Helm selber
übersetzen als statische Bibliothek, dass das Hostnetzwerk nicht benutzt.
Wenn Sie das tun, wird sich die Dateigrösse von Helm stark vergrössern, aber
Sie sind das Problem los.

Der Fehler war ursächlich als Sicherheitsproblem gemeldet. Aber es hat sich
mittlerweile herausgestellt, dass es kein Problem darstellt.

### helm repo add schlägt fehl, wenn es schon mal benutzt war

In Helm 3.3.1 und davor gab das Kommando `helm repo add <reponame> <url>`
keine Ausgabe, wenn Sie versucht haben, dass Verzeichnis hinzuzufügen,
wenn es schon vorhanden war. Die Option
`--no-update` würde eine Fehlermeldung ausgeben, wenn das Verzeichnis
schon registriert war.

In Helm 3.3.2 und davor gibt es beim Versuch das Verzeichnis hinzuzufügen einen
Fehler:

`Error: repository name (reponame) already exists, please specify a different name`

Das Standardverhalten ist jetzt umgekehrt. `--no-update` wird jetzt ignoriert,
wenn Sie ein existierendes Verzeichnis ersetzen (überschreiben) wollen.
Sie können die Option `--force-update` verwenden.

Das ist wegen einer unterbrochenden Änerung für ein Sicherheitsupdate wie
erklärt ist in [Helm 3.3.2 release notes](https://github.com/helm/helm/releases/tag/v3.3.2).

### Kubernetes Programmprotokoll aktivieren

Die Ausgabe von Protokollmeldungen zur Fehlersuche können durch die
[klog](https://pkg.go.dev/k8s.io/klog) Option aktiviert werden.
Verwenden Sie die Option `-v` zur Stärke der Ausgabe.

Zum Beispiel:

```
helm list -v 6
```
