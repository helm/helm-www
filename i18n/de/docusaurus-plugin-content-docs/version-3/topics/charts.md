---
title: Charts
description: Erklärt das Chart-Format und bietet grundlegende Anleitungen zum Erstellen von Charts mit Helm.
sidebar_position: 1
---

Helm verwendet ein Paketformat namens _Charts_. Ein Chart ist eine Sammlung von Dateien, die zusammengehörige Kubernetes-Ressourcen beschreiben. Mit einem einzelnen Chart lässt sich etwas Einfaches wie ein Memcached-Pod bereitstellen, aber auch etwas Komplexes wie ein vollständiger Web-App-Stack mit HTTP-Servern, Datenbanken, Caches usw.

Charts werden als Dateien in einer bestimmten Verzeichnisstruktur angelegt und können in versionierte Archive verpackt werden.

Wenn Sie die Dateien eines veröffentlichten Charts herunterladen und ansehen möchten, ohne es zu installieren, können Sie dies mit `helm pull chartrepo/chartname` tun.

Dieses Dokument erklärt das Chart-Format und bietet grundlegende Anleitungen zum Erstellen von Charts mit Helm.

## Die Chart-Dateistruktur

Ein Chart ist als Sammlung von Dateien innerhalb eines Verzeichnisses organisiert. Der Verzeichnisname entspricht dem Namen des Charts (ohne Versionsinformationen). Ein Chart, das WordPress beschreibt, würde also in einem `wordpress/`-Verzeichnis gespeichert werden.

Innerhalb dieses Verzeichnisses erwartet Helm eine Struktur wie diese:

```text
wordpress/
  Chart.yaml          # A YAML file containing information about the chart
  LICENSE             # OPTIONAL: A plain text file containing the license for the chart
  README.md           # OPTIONAL: A human-readable README file
  values.yaml         # The default configuration values for this chart
  values.schema.json  # OPTIONAL: A JSON Schema for imposing a structure on the values.yaml file
  charts/             # A directory containing any charts upon which this chart depends.
  crds/               # Custom Resource Definitions
  templates/          # A directory of templates that, when combined with values,
                      # will generate valid Kubernetes manifest files.
  templates/NOTES.txt # OPTIONAL: A plain text file containing short usage notes
```

Helm reserviert die Verwendung der Verzeichnisse `charts/`, `crds/` und `templates/` sowie der aufgelisteten Dateinamen. Andere Dateien bleiben unverändert.

## Die Chart.yaml-Datei

Die `Chart.yaml`-Datei ist für ein Chart erforderlich. Sie enthält die folgenden Felder:

```yaml
apiVersion: The chart API version (required)
name: The name of the chart (required)
version: The version of the chart (required)
kubeVersion: A SemVer range of compatible Kubernetes versions (optional)
description: A single-sentence description of this project (optional)
type: The type of the chart (optional)
keywords:
  - A list of keywords about this project (optional)
home: The URL of this projects home page (optional)
sources:
  - A list of URLs to source code for this project (optional)
dependencies: # A list of the chart requirements (optional)
  - name: The name of the chart (nginx)
    version: The version of the chart ("1.2.3")
    repository: (optional) The repository URL ("https://example.com/charts") or alias ("@repo-name")
    condition: (optional) A yaml path that resolves to a boolean, used for enabling/disabling charts (e.g. subchart1.enabled )
    tags: # (optional)
      - Tags can be used to group charts for enabling/disabling together
    import-values: # (optional)
      - ImportValues holds the mapping of source values to parent key to be imported. Each item can be a string or pair of child/parent sublist items.
    alias: (optional) Alias to be used for the chart. Useful when you have to add the same chart multiple times
maintainers: # (optional)
  - name: The maintainers name (required for each maintainer)
    email: The maintainers email (optional for each maintainer)
    url: A URL for the maintainer (optional for each maintainer)
icon: A URL to an SVG or PNG image to be used as an icon (optional).
appVersion: The version of the app that this contains (optional). Needn't be SemVer. Quotes recommended.
deprecated: Whether this chart is deprecated (optional, boolean)
annotations:
  example: A list of annotations keyed by name (optional).
```

Ab [v3.3.2](https://github.com/helm/helm/releases/tag/v3.3.2) sind zusätzliche Felder nicht erlaubt. Der empfohlene Ansatz ist, benutzerdefinierte Metadaten in `annotations` hinzuzufügen.

### Charts und Versionierung

Jedes Chart muss eine Versionsnummer haben. Eine Version sollte dem [SemVer 2](https://semver.org/spec/v2.0.0.html)-Standard folgen, wird aber nicht strikt erzwungen. Im Gegensatz zu Helm Classic verwenden Helm v2 und spätere Versionen Versionsnummern als Release-Markierungen. Pakete in Repositories werden durch Name plus Version identifiziert.

Beispielsweise wird ein `nginx`-Chart, dessen Versionsfeld auf `version: 1.2.3` gesetzt ist, wie folgt benannt:

```text
nginx-1.2.3.tgz
```

Komplexere SemVer-2-Namen werden ebenfalls unterstützt, wie z.B. `version: 1.2.3-alpha.1+ef365`. Nicht-SemVer-Namen sind jedoch vom System explizit nicht erlaubt. Eine Ausnahme bilden Versionen im Format `x` oder `x.y`. Wenn beispielsweise ein führendes v vorhanden ist oder eine Version ohne alle 3 Teile angegeben wird (z.B. v1.2), wird versucht, sie in eine gültige semantische Version umzuwandeln (z.B. v1.2.0).

**HINWEIS:** Während Helm Classic und Deployment Manager beide sehr GitHub-orientiert waren, wenn es um Charts ging, verlässt sich Helm v2 und später weder auf GitHub noch erfordert es Git. Folglich verwendet es überhaupt keine Git-SHAs zur Versionierung.

Das `version`-Feld in der `Chart.yaml` wird von vielen Helm-Tools verwendet, einschließlich der CLI. Beim Generieren eines Pakets verwendet der `helm package`-Befehl die Version, die er in der `Chart.yaml` findet, als Token im Paketnamen. Das System geht davon aus, dass die Versionsnummer im Chart-Paketnamen mit der Versionsnummer in der `Chart.yaml` übereinstimmt. Eine Nichterfüllung dieser Annahme führt zu einem Fehler.

### Das `apiVersion`-Feld

Das `apiVersion`-Feld sollte für Helm-Charts, die mindestens Helm 3 erfordern, `v2` sein. Charts, die frühere Helm-Versionen unterstützen, haben `apiVersion` auf `v1` gesetzt und können weiterhin von Helm 3 installiert werden.

Änderungen von `v1` zu `v2`:

- Ein `dependencies`-Feld, das Chart-Abhängigkeiten definiert, die sich bei `v1`-Charts in einer separaten `requirements.yaml`-Datei befanden (siehe [Chart-Abhängigkeiten](#chart-abhängigkeiten)).
- Das `type`-Feld, das zwischen Application- und Library-Charts unterscheidet (siehe [Chart-Typen](#chart-typen)).

### Das `appVersion`-Feld

Beachten Sie, dass das `appVersion`-Feld nicht mit dem `version`-Feld zusammenhängt. Es dient zur Angabe der Version der Anwendung. Beispielsweise könnte das `drupal`-Chart ein `appVersion: "8.2.1"` haben, was angibt, dass die im Chart enthaltene Drupal-Version (standardmäßig) `8.2.1` ist. Dieses Feld ist informativ und hat keinen Einfluss auf Chart-Versionsberechnungen. Es wird dringend empfohlen, die Version in Anführungszeichen zu setzen. Dies zwingt den YAML-Parser, die Versionsnummer als String zu behandeln. Ohne Anführungszeichen kann es in einigen Fällen zu Parsing-Problemen kommen. Beispielsweise interpretiert YAML `1.0` als Gleitkommawert und einen Git-Commit-SHA wie `1234e10` als wissenschaftliche Notation.

Ab Helm v3.5.0 setzt `helm create` das standardmäßige `appVersion`-Feld in Anführungszeichen.

### Das `kubeVersion`-Feld

Das optionale `kubeVersion`-Feld kann SemVer-Einschränkungen für unterstützte Kubernetes-Versionen definieren. Helm validiert die Versionseinschränkungen bei der Installation des Charts und schlägt fehl, wenn der Cluster eine nicht unterstützte Kubernetes-Version verwendet.

Versionseinschränkungen können aus durch Leerzeichen getrennten UND-Vergleichen bestehen, wie z.B.:
```
>= 1.13.0 < 1.15.0
```
Diese können wiederum mit dem ODER-Operator `||` kombiniert werden, wie im folgenden Beispiel:
```
>= 1.13.0 < 1.14.0 || >= 1.14.1 < 1.15.0
```
In diesem Beispiel ist die Version `1.14.0` ausgeschlossen, was sinnvoll sein kann, wenn ein Bug in bestimmten Versionen das ordnungsgemäße Funktionieren des Charts verhindert.

Neben Versionseinschränkungen mit den Operatoren `=` `!=` `>` `<` `>=` `<=` werden folgende Kurzschreibweisen unterstützt:

 * Bindestrich-Bereiche für geschlossene Intervalle, wobei `1.1 - 2.3.4` äquivalent zu `>= 1.1 <= 2.3.4` ist.
 * Wildcards `x`, `X` und `*`, wobei `1.2.x` äquivalent zu `>= 1.2.0 < 1.3.0` ist.
 * Tilde-Bereiche (Patch-Versionsänderungen erlaubt), wobei `~1.2.3` äquivalent zu `>= 1.2.3 < 1.3.0` ist.
 * Caret-Bereiche (Minor-Versionsänderungen erlaubt), wobei `^1.2.3` äquivalent zu `>= 1.2.3 < 2.0.0` ist.

Für eine detaillierte Erklärung der unterstützten SemVer-Einschränkungen siehe [Masterminds/semver](https://github.com/Masterminds/semver).

### Charts als veraltet markieren

Bei der Verwaltung von Charts in einem Chart Repository ist es manchmal notwendig, ein Chart als veraltet zu markieren. Das optionale `deprecated`-Feld in `Chart.yaml` kann verwendet werden, um ein Chart als veraltet zu kennzeichnen. Wenn die **neueste** Version eines Charts im Repository als veraltet markiert ist, wird das Chart insgesamt als veraltet betrachtet. Der Chart-Name kann später wiederverwendet werden, indem eine neuere Version veröffentlicht wird, die nicht als veraltet markiert ist. Der Workflow für das Veraltmarkieren von Charts ist:

1. Aktualisieren Sie die `Chart.yaml` des Charts, um es als veraltet zu markieren, und erhöhen Sie die Version
2. Veröffentlichen Sie die neue Chart-Version im Chart Repository
3. Entfernen Sie das Chart aus dem Quell-Repository (z.B. git)

### Chart-Typen

Das `type`-Feld definiert den Typ des Charts. Es gibt zwei Typen: `application` und `library`. Application ist der Standardtyp und das Standard-Chart, das vollständig betrieben werden kann. Das [Library-Chart](/topics/library_charts.md) stellt Dienstprogramme oder Funktionen für den Chart-Builder bereit. Ein Library-Chart unterscheidet sich von einem Application-Chart dadurch, dass es nicht installierbar ist und normalerweise keine Ressourcenobjekte enthält.

**Hinweis:** Ein Application-Chart kann als Library-Chart verwendet werden. Dies wird aktiviert, indem der Typ auf `library` gesetzt wird. Das Chart wird dann als Library-Chart gerendert, wobei alle Dienstprogramme und Funktionen genutzt werden können. Alle Ressourcenobjekte des Charts werden nicht gerendert.

## Chart LICENSE, README und NOTES

Charts können auch Dateien enthalten, die die Installation, Konfiguration, Verwendung und Lizenz eines Charts beschreiben.

Eine LICENSE ist eine Klartextdatei, die die [Lizenz](https://en.wikipedia.org/wiki/Software_license) für das Chart enthält. Das Chart kann eine Lizenz enthalten, da es möglicherweise Programmierlogik in den Templates hat und daher nicht nur Konfiguration wäre. Es kann auch separate Lizenz(en) für die vom Chart installierte Anwendung geben, falls erforderlich.

Eine README für ein Chart sollte in Markdown formatiert sein (README.md) und sollte im Allgemeinen enthalten:

- Eine Beschreibung der Anwendung oder des Dienstes, den das Chart bereitstellt
- Alle Voraussetzungen oder Anforderungen zum Ausführen des Charts
- Beschreibungen der Optionen in `values.yaml` und Standardwerte
- Alle anderen Informationen, die für die Installation oder Konfiguration des Charts relevant sein könnten

Wenn Hubs und andere Benutzeroberflächen Details über ein Chart anzeigen, werden diese Informationen aus dem Inhalt der `README.md`-Datei gezogen.

Das Chart kann auch eine kurze Klartextdatei `templates/NOTES.txt` enthalten, die nach der Installation und beim Anzeigen des Status eines Release ausgegeben wird. Diese Datei wird als [Template](#templates-und-values) ausgewertet und kann verwendet werden, um Nutzungshinweise, nächste Schritte oder andere für ein Release des Charts relevante Informationen anzuzeigen. Beispielsweise könnten Anweisungen zum Verbinden mit einer Datenbank oder zum Zugriff auf eine Web-UI bereitgestellt werden. Da diese Datei beim Ausführen von `helm install` oder `helm status` nach STDOUT ausgegeben wird, wird empfohlen, den Inhalt kurz zu halten und für weitere Details auf die README zu verweisen.

## Chart-Abhängigkeiten

In Helm kann ein Chart von einer beliebigen Anzahl anderer Charts abhängen. Diese Abhängigkeiten können dynamisch über das `dependencies`-Feld in `Chart.yaml` verknüpft oder im `charts/`-Verzeichnis abgelegt und manuell verwaltet werden.

### Abhängigkeiten mit dem `dependencies`-Feld verwalten

Die vom aktuellen Chart benötigten Charts werden als Liste im `dependencies`-Feld definiert.

```yaml
dependencies:
  - name: apache
    version: 1.2.3
    repository: https://example.com/charts
  - name: mysql
    version: 3.2.1
    repository: https://another.example.com/charts
```

- Das `name`-Feld ist der Name des gewünschten Charts.
- Das `version`-Feld ist die Version des gewünschten Charts.
- Das `repository`-Feld ist die vollständige URL zum Chart Repository. Beachten Sie, dass Sie dieses Repository auch lokal mit `helm repo add` hinzufügen müssen.
- Sie können auch den Namen des Repos anstelle der URL verwenden

```console
$ helm repo add fantastic-charts https://charts.helm.sh/incubator
```

```yaml
dependencies:
  - name: awesomeness
    version: 1.0.0
    repository: "@fantastic-charts"
```

Sobald Sie Abhängigkeiten definiert haben, können Sie `helm dependency update` ausführen, und es wird Ihre Abhängigkeitsdatei verwenden, um alle angegebenen Charts in Ihr `charts/`-Verzeichnis herunterzuladen.

```console
$ helm dep up foochart
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "local" chart repository
...Successfully got an update from the "stable" chart repository
...Successfully got an update from the "example" chart repository
...Successfully got an update from the "another" chart repository
Update Complete. Happy Helming!
Saving 2 charts
Downloading apache from repo https://example.com/charts
Downloading mysql from repo https://another.example.com/charts
```

Wenn `helm dependency update` Charts abruft, speichert es diese als Chart-Archive im `charts/`-Verzeichnis. Im obigen Beispiel würde man also die folgenden Dateien im charts-Verzeichnis erwarten:

```text
charts/
  apache-1.2.3.tgz
  mysql-3.2.1.tgz
```

#### Das Alias-Feld in Abhängigkeiten

Zusätzlich zu den anderen oben genannten Feldern kann jeder Abhängigkeitseintrag das optionale Feld `alias` enthalten.

Das Hinzufügen eines Alias für ein abhängiges Chart fügt ein Chart unter Verwendung des Alias als Namen der neuen Abhängigkeit in die Abhängigkeiten ein.

Sie können `alias` in Fällen verwenden, in denen Sie auf ein Chart mit anderen Namen zugreifen müssen.

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-1
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-2
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
```

Im obigen Beispiel erhalten wir insgesamt 3 Abhängigkeiten für `parentchart`:

```text
subchart
new-subchart-1
new-subchart-2
```

Der manuelle Weg, dies zu erreichen, wäre das Kopieren und Einfügen desselben Charts im `charts/`-Verzeichnis mehrfach mit verschiedenen Namen.

#### Tags- und Condition-Felder in Abhängigkeiten

Zusätzlich zu den anderen oben genannten Feldern kann jeder Abhängigkeitseintrag die optionalen Felder `tags` und `condition` enthalten.

Alle Charts werden standardmäßig geladen. Wenn `tags`- oder `condition`-Felder vorhanden sind, werden sie ausgewertet und verwendet, um das Laden der Charts zu steuern, auf die sie angewendet werden.

Condition - Das condition-Feld enthält einen oder mehrere YAML-Pfade (durch Kommas getrennt). Wenn dieser Pfad in den Values des übergeordneten Charts existiert und zu einem booleschen Wert aufgelöst wird, wird das Chart basierend auf diesem booleschen Wert aktiviert oder deaktiviert. Nur der erste gültige gefundene Pfad in der Liste wird ausgewertet, und wenn keine Pfade existieren, hat die Condition keine Auswirkung.

Tags - Das tags-Feld ist eine YAML-Liste von Labels, die mit diesem Chart verknüpft werden. In den Values des übergeordneten Charts können alle Charts mit Tags aktiviert oder deaktiviert werden, indem das Tag und ein boolescher Wert angegeben werden.

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart1.enabled,global.subchart1.enabled
    tags:
      - front-end
      - subchart1
  - name: subchart2
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart2.enabled,global.subchart2.enabled
    tags:
      - back-end
      - subchart2
```

```yaml
# parentchart/values.yaml

subchart1:
  enabled: true
tags:
  front-end: false
  back-end: true
```

Im obigen Beispiel würden alle Charts mit dem Tag `front-end` deaktiviert werden, aber da der `subchart1.enabled`-Pfad in den Values des übergeordneten Charts zu 'true' ausgewertet wird, überschreibt die Condition das `front-end`-Tag und `subchart1` wird aktiviert.

Da `subchart2` mit `back-end` getaggt ist und dieses Tag zu `true` ausgewertet wird, wird `subchart2` aktiviert. Beachten Sie auch, dass, obwohl `subchart2` eine Condition angegeben hat, es keinen entsprechenden Pfad und Wert in den Values des übergeordneten Charts gibt, sodass diese Condition keine Auswirkung hat.

##### Verwendung der CLI mit Tags und Conditions

Der `--set`-Parameter kann wie gewohnt verwendet werden, um Tag- und Condition-Werte zu ändern.

```console
helm install --set tags.front-end=true --set subchart2.enabled=false
```

##### Auflösung von Tags und Conditions

- **Conditions (wenn in Values gesetzt) überschreiben immer Tags.** Der erste existierende Condition-Pfad gewinnt, und nachfolgende für dieses Chart werden ignoriert.
- Tags werden als 'wenn eines der Tags des Charts true ist, dann aktiviere das Chart' ausgewertet.
- Tag- und Condition-Werte müssen in den Values des obersten übergeordneten Charts gesetzt werden.
- Der `tags:`-Schlüssel in Values muss ein Schlüssel auf oberster Ebene sein. Globale und verschachtelte `tags:`-Tabellen werden derzeit nicht unterstützt.

#### Importieren von Child-Values über Abhängigkeiten

In einigen Fällen ist es wünschenswert, dass die Values eines untergeordneten Charts an das übergeordnete Chart weitergegeben und als gemeinsame Standardwerte geteilt werden. Ein zusätzlicher Vorteil der Verwendung des `exports`-Formats ist, dass es zukünftigen Tools ermöglicht, benutzerdefinierbare Werte zu inspizieren.

Die Schlüssel, die die zu importierenden Werte enthalten, können im `dependencies`-Feld des übergeordneten Charts im Feld `import-values` als YAML-Liste angegeben werden. Jedes Element in der Liste ist ein Schlüssel, der aus dem `exports`-Feld des untergeordneten Charts importiert wird.

Um Werte zu importieren, die nicht im `exports`-Schlüssel enthalten sind, verwenden Sie das [child-parent](#verwendung-des-child-parent-formats)-Format. Beispiele für beide Formate werden unten beschrieben.

##### Verwendung des exports-Formats

Wenn die `values.yaml`-Datei eines untergeordneten Charts ein `exports`-Feld auf Root-Ebene enthält, können dessen Inhalte direkt in die Values des übergeordneten Charts importiert werden, indem die zu importierenden Schlüssel wie im folgenden Beispiel angegeben werden:

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    import-values:
      - data
```

```yaml
# child's values.yaml file

exports:
  data:
    myint: 99
```

Da wir den Schlüssel `data` in unserer Importliste angeben, sucht Helm im `exports`-Feld des untergeordneten Charts nach dem `data`-Schlüssel und importiert dessen Inhalt.

Die endgültigen Values des übergeordneten Charts würden unser exportiertes Feld enthalten:

```yaml
# parent's values

myint: 99
```

Bitte beachten Sie, dass der übergeordnete Schlüssel `data` nicht in den endgültigen Values des übergeordneten Charts enthalten ist. Wenn Sie den übergeordneten Schlüssel angeben müssen, verwenden Sie das 'child-parent'-Format.

##### Verwendung des child-parent-Formats

Um auf Werte zuzugreifen, die nicht im `exports`-Schlüssel der Values des untergeordneten Charts enthalten sind, müssen Sie den Quellschlüssel der zu importierenden Werte (`child`) und den Zielpfad in den Values des übergeordneten Charts (`parent`) angeben.

Das `import-values` im folgenden Beispiel weist Helm an, alle Werte, die unter dem `child:`-Pfad gefunden werden, zu nehmen und sie in die Values des übergeordneten Charts unter dem in `parent:` angegebenen Pfad zu kopieren.

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    ...
    import-values:
      - child: default.data
        parent: myimports
```

Im obigen Beispiel werden Werte, die unter `default.data` in den Values von subchart1 gefunden werden, in den `myimports`-Schlüssel in den Values des übergeordneten Charts importiert, wie unten beschrieben:

```yaml
# parent's values.yaml file

myimports:
  myint: 0
  mybool: false
  mystring: "helm rocks!"
```

```yaml
# subchart1's values.yaml file

default:
  data:
    myint: 999
    mybool: true
```

Die resultierenden Values des übergeordneten Charts wären:

```yaml
# parent's final values

myimports:
  myint: 999
  mybool: true
  mystring: "helm rocks!"
```

Die endgültigen Values des übergeordneten Charts enthalten jetzt die aus subchart1 importierten Felder `myint` und `mybool`.

### Abhängigkeiten manuell über das `charts/`-Verzeichnis verwalten

Wenn mehr Kontrolle über Abhängigkeiten gewünscht wird, können diese Abhängigkeiten explizit ausgedrückt werden, indem die abhängigen Charts in das `charts/`-Verzeichnis kopiert werden.

Eine Abhängigkeit sollte ein entpacktes Chart-Verzeichnis sein, aber sein Name darf nicht mit `_` oder `.` beginnen. Solche Dateien werden vom Chart-Loader ignoriert.

Wenn beispielsweise das WordPress-Chart vom Apache-Chart abhängt, wird das Apache-Chart (in der korrekten Version) im `charts/`-Verzeichnis des WordPress-Charts bereitgestellt:

```yaml
wordpress:
  Chart.yaml
  # ...
  charts/
    apache/
      Chart.yaml
      # ...
    mysql/
      Chart.yaml
      # ...
```

Das obige Beispiel zeigt, wie das WordPress-Chart seine Abhängigkeit von Apache und MySQL ausdrückt, indem es diese Charts in sein `charts/`-Verzeichnis einschließt.

**TIPP:** _Um eine Abhängigkeit in Ihr `charts/`-Verzeichnis zu laden, verwenden Sie den Befehl `helm pull`._

### Betriebsaspekte bei der Verwendung von Abhängigkeiten

Die obigen Abschnitte erklären, wie Chart-Abhängigkeiten angegeben werden, aber wie wirkt sich dies auf die Chart-Installation mit `helm install` und `helm upgrade` aus?

Angenommen, ein Chart namens "A" erstellt die folgenden Kubernetes-Objekte:

- namespace "A-Namespace"
- statefulset "A-StatefulSet"
- service "A-Service"

Darüber hinaus ist A von Chart B abhängig, das folgende Objekte erstellt:

- namespace "B-Namespace"
- replicaset "B-ReplicaSet"
- service "B-Service"

Nach der Installation/dem Upgrade von Chart A wird ein einzelnes Helm-Release erstellt/geändert. Das Release erstellt/aktualisiert alle oben genannten Kubernetes-Objekte in der folgenden Reihenfolge:

- A-Namespace
- B-Namespace
- A-Service
- B-Service
- B-ReplicaSet
- A-StatefulSet

Der Grund dafür ist, dass Helm bei der Installation/dem Upgrade von Charts die Kubernetes-Objekte aus den Charts und allen ihren Abhängigkeiten:

- in einer einzigen Menge zusammenfasst,
- nach Typ und dann nach Name sortiert,
- in dieser Reihenfolge erstellt/aktualisiert.

Daher wird ein einzelnes Release mit allen Objekten für das Chart und seine Abhängigkeiten erstellt.

Die Installationsreihenfolge von Kubernetes-Typen wird durch die Aufzählung InstallOrder in kind_sorter.go gegeben (siehe [die Helm-Quelldatei](https://github.com/helm/helm/blob/484d43913f97292648c867b56768775a55e4bba6/pkg/releaseutil/kind_sorter.go)).

## Templates und Values

Helm-Chart-Templates werden in der [Go-Template-Sprache](https://golang.org/pkg/text/template/) geschrieben, mit etwa 50 zusätzlichen Template-Funktionen [aus der Sprig-Bibliothek](https://github.com/Masterminds/sprig) und einigen anderen [spezialisierten Funktionen](/howto/charts_tips_and_tricks.md).

Alle Template-Dateien werden im `templates/`-Ordner eines Charts gespeichert. Wenn Helm die Charts rendert, übergibt es jede Datei in diesem Verzeichnis an die Template-Engine.

Values für die Templates werden auf zwei Arten bereitgestellt:

- Chart-Entwickler können eine Datei namens `values.yaml` innerhalb eines Charts bereitstellen. Diese Datei kann Standardwerte enthalten.
- Chart-Benutzer können eine YAML-Datei bereitstellen, die Values enthält. Diese kann bei der Befehlszeile mit `helm install` angegeben werden.

Wenn ein Benutzer benutzerdefinierte Values bereitstellt, überschreiben diese Values die Werte in der `values.yaml`-Datei des Charts.

### Template-Dateien

Template-Dateien folgen den Standardkonventionen für das Schreiben von Go-Templates (siehe [die text/template Go-Paket-Dokumentation](https://golang.org/pkg/text/template/) für Details). Eine Beispiel-Template-Datei könnte etwa so aussehen:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

Das obige Beispiel, lose basierend auf [https://github.com/deis/charts](https://github.com/deis/charts), ist ein Template für einen Kubernetes Replication Controller. Es kann die folgenden vier Template-Values verwenden (normalerweise in einer `values.yaml`-Datei definiert):

- `imageRegistry`: Die Quell-Registry für das Docker-Image.
- `dockerTag`: Das Tag für das Docker-Image.
- `pullPolicy`: Die Kubernetes-Pull-Policy.
- `storage`: Das Storage-Backend, dessen Standard auf `"minio"` gesetzt ist.

Alle diese Werte werden vom Template-Autor definiert. Helm schreibt keine Parameter vor oder erfordert sie.

Um viele funktionierende Charts zu sehen, schauen Sie sich den CNCF [Artifact Hub](https://artifacthub.io/packages/search?kind=0) an.

### Vordefinierte Values

Values, die über eine `values.yaml`-Datei (oder über das `--set`-Flag) bereitgestellt werden, sind über das `.Values`-Objekt in einem Template zugänglich. Es gibt aber auch andere vordefinierte Daten, auf die Sie in Ihren Templates zugreifen können.

Die folgenden Values sind vordefiniert, in jedem Template verfügbar und können nicht überschrieben werden. Wie bei allen Values sind die Namen _case-sensitive_.

- `Release.Name`: Der Name des Release (nicht des Charts)
- `Release.Namespace`: Der Namespace, in dem das Chart released wurde.
- `Release.Service`: Der Dienst, der das Release durchgeführt hat.
- `Release.IsUpgrade`: Dies ist auf true gesetzt, wenn die aktuelle Operation ein Upgrade oder Rollback ist.
- `Release.IsInstall`: Dies ist auf true gesetzt, wenn die aktuelle Operation eine Installation ist.
- `Chart`: Der Inhalt der `Chart.yaml`. So ist die Chart-Version als `Chart.Version` und die Maintainer als `Chart.Maintainers` erhältlich.
- `Files`: Ein Map-ähnliches Objekt, das alle nicht-speziellen Dateien im Chart enthält. Dies gibt Ihnen keinen Zugriff auf Templates, aber auf zusätzliche Dateien, die vorhanden sind (es sei denn, sie werden mit `.helmignore` ausgeschlossen). Dateien können mit `{{ index .Files "file.name" }}` oder mit der `{{.Files.Get name }}`-Funktion zugegriffen werden. Sie können auch auf den Inhalt der Datei als `[]byte` mit `{{ .Files.GetBytes }}` zugreifen.
- `Capabilities`: Ein Map-ähnliches Objekt, das Informationen über die Kubernetes-Versionen (`{{ .Capabilities.KubeVersion }}`) und die unterstützten Kubernetes-API-Versionen (`{{ .Capabilities.APIVersions.Has "batch/v1" }}`) enthält.

**HINWEIS:** Alle unbekannten `Chart.yaml`-Felder werden verworfen. Sie sind innerhalb des `Chart`-Objekts nicht zugänglich. Daher kann `Chart.yaml` nicht verwendet werden, um beliebig strukturierte Daten an das Template zu übergeben. Die Values-Datei kann jedoch dafür verwendet werden.

### Values-Dateien

Unter Berücksichtigung des Templates im vorherigen Abschnitt würde eine `values.yaml`-Datei, die die notwendigen Werte bereitstellt, so aussehen:

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "s3"
```

Eine Values-Datei ist im YAML-Format. Ein Chart kann eine Standard-`values.yaml`-Datei enthalten. Der Helm-Install-Befehl ermöglicht es einem Benutzer, Werte zu überschreiben, indem zusätzliche YAML-Werte bereitgestellt werden:

```console
$ helm install --generate-name --values=myvals.yaml wordpress
```

Wenn Werte auf diese Weise übergeben werden, werden sie in die Standard-Values-Datei gemergt. Betrachten Sie beispielsweise eine `myvals.yaml`-Datei, die so aussieht:

```yaml
storage: "gcs"
```

Wenn dies mit der `values.yaml` im Chart gemergt wird, ist der resultierende generierte Inhalt:

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "gcs"
```

Beachten Sie, dass nur das letzte Feld überschrieben wurde.

**HINWEIS:** Die Standard-Values-Datei innerhalb eines Charts _muss_ `values.yaml` heißen. Aber Dateien, die auf der Befehlszeile angegeben werden, können beliebig benannt werden.

**HINWEIS:** Wenn das `--set`-Flag bei `helm install` oder `helm upgrade` verwendet wird, werden diese Werte einfach clientseitig in YAML konvertiert.

**HINWEIS:** Wenn erforderliche Einträge in der Values-Datei existieren, können sie im Chart-Template mit der ['required'-Funktion](/howto/charts_tips_and_tricks.md) als erforderlich deklariert werden.

Alle diese Werte sind dann innerhalb von Templates über das `.Values`-Objekt zugänglich:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

### Scope, Abhängigkeiten und Values

Values-Dateien können Werte für das Top-Level-Chart sowie für alle Charts deklarieren, die im `charts/`-Verzeichnis dieses Charts enthalten sind. Anders ausgedrückt: Eine Values-Datei kann Werte sowohl an das Chart als auch an seine Abhängigkeiten liefern. Das demonstrative WordPress-Chart oben hat beispielsweise sowohl `mysql` als auch `apache` als Abhängigkeiten. Die Values-Datei könnte Werte an all diese Komponenten liefern:

```yaml
title: "My WordPress Site" # Sent to the WordPress template

mysql:
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  port: 8080 # Passed to Apache
```

Charts auf einer höheren Ebene haben Zugriff auf alle Variablen, die darunter definiert sind. So kann das WordPress-Chart auf das MySQL-Passwort als `.Values.mysql.password` zugreifen. Charts auf niedrigerer Ebene können jedoch nicht auf Dinge in übergeordneten Charts zugreifen, sodass MySQL nicht auf die `title`-Eigenschaft zugreifen kann. Ebenso wenig kann es auf `apache.port` zugreifen.

Values sind mit Namespaces versehen, aber Namespaces werden gekürzt. Für das WordPress-Chart kann es also auf das MySQL-Passwortfeld als `.Values.mysql.password` zugreifen. Für das MySQL-Chart wurde jedoch der Scope der Values reduziert und das Namespace-Präfix entfernt, sodass es das Passwortfeld einfach als `.Values.password` sieht.

#### Globale Values

Ab Version 2.0.0-Alpha.2 unterstützt Helm spezielle "globale" Values. Betrachten Sie diese modifizierte Version des vorherigen Beispiels:

```yaml
title: "My WordPress Site" # Sent to the WordPress template

global:
  app: MyWordPress

mysql:
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  port: 8080 # Passed to Apache
```

Das Obige fügt einen `global`-Abschnitt mit dem Wert `app: MyWordPress` hinzu. Dieser Wert ist für _alle_ Charts als `.Values.global.app` verfügbar.

Beispielsweise können die `mysql`-Templates auf `app` als `{{ .Values.global.app }}` zugreifen, ebenso das `apache`-Chart. Effektiv wird die Values-Datei oben so regeneriert:

```yaml
title: "My WordPress Site" # Sent to the WordPress template

global:
  app: MyWordPress

mysql:
  global:
    app: MyWordPress
  max_connections: 100 # Sent to MySQL
  password: "secret"

apache:
  global:
    app: MyWordPress
  port: 8080 # Passed to Apache
```

So lässt sich eine Top-Level-Variable mit allen Subcharts teilen, was für Dinge wie das Setzen von `metadata`-Eigenschaften wie Labels nützlich ist.

Wenn ein Subchart eine globale Variable deklariert, wird diese _abwärts_ (an die Subcharts des Subcharts) übergeben, aber nicht _aufwärts_ an das übergeordnete Chart. Ein Subchart kann die Values des übergeordneten Charts nicht beeinflussen.

Globale Variablen von übergeordneten Charts haben Vorrang vor den globalen Variablen von Subcharts.

### Schema-Dateien

Manchmal möchte ein Chart-Maintainer eine Struktur für seine Values definieren. Dies kann durch die Definition eines Schemas in der `values.schema.json`-Datei erfolgen. Ein Schema wird als [JSON Schema](https://json-schema.org/) dargestellt. Es könnte etwa so aussehen:

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "properties": {
    "image": {
      "description": "Container Image",
      "properties": {
        "repo": {
          "type": "string"
        },
        "tag": {
          "type": "string"
        }
      },
      "type": "object"
    },
    "name": {
      "description": "Service name",
      "type": "string"
    },
    "port": {
      "description": "Port",
      "minimum": 0,
      "type": "integer"
    },
    "protocol": {
      "type": "string"
    }
  },
  "required": [
    "protocol",
    "port"
  ],
  "title": "Values",
  "type": "object"
}
```

Dieses Schema wird auf die Values angewendet, um sie zu validieren. Die Validierung erfolgt, wenn einer der folgenden Befehle aufgerufen wird:

- `helm install`
- `helm upgrade`
- `helm lint`
- `helm template`

Ein Beispiel für eine `values.yaml`-Datei, die die Anforderungen dieses Schemas erfüllt, könnte so aussehen:

```yaml
name: frontend
protocol: https
port: 443
```

Beachten Sie, dass das Schema auf das endgültige `.Values`-Objekt angewendet wird, nicht nur auf die `values.yaml`-Datei. Das bedeutet, dass die folgende `yaml`-Datei gültig ist, wenn das Chart mit der entsprechenden `--set`-Option installiert wird, wie unten gezeigt.

```yaml
name: frontend
protocol: https
```

```console
helm install --set port=443
```

Außerdem wird das endgültige `.Values`-Objekt gegen *alle* Subchart-Schemas geprüft. Das bedeutet, dass Einschränkungen in einem Subchart nicht durch ein übergeordnetes Chart umgangen werden können. Dies funktioniert auch umgekehrt - wenn ein Subchart eine Anforderung hat, die in der `values.yaml`-Datei des Subcharts nicht erfüllt ist, *muss* das übergeordnete Chart diese Einschränkungen erfüllen, um gültig zu sein.

Die Schema-Validierung kann mit der unten gezeigten Option deaktiviert werden. Dies ist besonders nützlich in Air-Gapped-Umgebungen, wenn die JSON-Schema-Datei eines Charts Remote-Referenzen enthält.
```console
helm install --skip-schema-validation
```

### Referenzen

Beim Schreiben von Templates, Values und Schema-Dateien gibt es mehrere Standardreferenzen, die Ihnen helfen werden.

- [Go-Templates](https://godoc.org/text/template)
- [Zusätzliche Template-Funktionen](https://godoc.org/github.com/Masterminds/sprig)
- [Das YAML-Format](https://yaml.org/spec/)
- [JSON Schema](https://json-schema.org/)

## Custom Resource Definitions (CRDs)

Kubernetes bietet einen Mechanismus zum Deklarieren neuer Arten von Kubernetes-Objekten. Mit CustomResourceDefinitions (CRDs) können Kubernetes-Entwickler benutzerdefinierte Ressourcentypen deklarieren.

In Helm 3 werden CRDs als eine spezielle Art von Objekt behandelt. Sie werden vor dem Rest des Charts installiert und unterliegen einigen Einschränkungen.

CRD-YAML-Dateien sollten im `crds/`-Verzeichnis innerhalb eines Charts platziert werden. Mehrere CRDs (getrennt durch YAML-Start- und End-Marker) können in derselben Datei platziert werden. Helm versucht, _alle_ Dateien im CRD-Verzeichnis in Kubernetes zu laden.

CRD-Dateien _können nicht als Template verwendet werden_. Sie müssen einfache YAML-Dokumente sein.

Wenn Helm ein neues Chart installiert, lädt es die CRDs hoch, pausiert, bis die CRDs vom API-Server verfügbar gemacht werden, und startet dann die Template-Engine, rendert den Rest des Charts und lädt ihn in Kubernetes hoch. Aufgrund dieser Reihenfolge sind CRD-Informationen im `.Capabilities`-Objekt in Helm-Templates verfügbar, und Helm-Templates können neue Instanzen von Objekten erstellen, die in CRDs deklariert wurden.

Wenn Ihr Chart beispielsweise eine CRD für `CronTab` im `crds/`-Verzeichnis hat, können Sie Instanzen der `CronTab`-Art im `templates/`-Verzeichnis erstellen:

```text
crontabs/
  Chart.yaml
  crds/
    crontab.yaml
  templates/
    mycrontab.yaml
```

Die `crontab.yaml`-Datei muss die CRD ohne Template-Direktiven enthalten:

```yaml
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
```

Dann kann das Template `mycrontab.yaml` eine neue `CronTab` erstellen (unter Verwendung von Templates wie üblich):

```yaml
apiVersion: stable.example.com
kind: CronTab
metadata:
  name: {{ .Values.name }}
spec:
   # ...
```

Helm stellt sicher, dass die `CronTab`-Art installiert wurde und vom Kubernetes-API-Server verfügbar ist, bevor es mit der Installation der Dinge in `templates/` fortfährt.

### Einschränkungen bei CRDs

Im Gegensatz zu den meisten Objekten in Kubernetes werden CRDs global installiert. Aus diesem Grund verfolgt Helm einen sehr vorsichtigen Ansatz bei der Verwaltung von CRDs. CRDs unterliegen den folgenden Einschränkungen:

- CRDs werden niemals neu installiert. Wenn Helm feststellt, dass die CRDs im `crds/`-Verzeichnis bereits vorhanden sind (unabhängig von der Version), versucht Helm nicht, sie zu installieren oder zu aktualisieren.
- CRDs werden bei Upgrades oder Rollbacks niemals installiert. Helm erstellt CRDs nur bei Installationsoperationen.
- CRDs werden niemals gelöscht. Das Löschen einer CRD löscht automatisch alle Inhalte der CRD über alle Namespaces im Cluster hinweg. Folglich löscht Helm keine CRDs.

Operatoren, die CRDs aktualisieren oder löschen möchten, werden ermutigt, dies manuell und mit großer Vorsicht zu tun.

## Verwendung von Helm zur Verwaltung von Charts

Das `helm`-Tool verfügt über mehrere Befehle für die Arbeit mit Charts.

Es kann ein neues Chart für Sie erstellen:

```console
$ helm create mychart
Created mychart/
```

Sobald Sie ein Chart bearbeitet haben, kann `helm` es für Sie in ein Chart-Archiv verpacken:

```console
$ helm package mychart
Archived mychart-0.1.-.tgz
```

Sie können `helm` auch verwenden, um Probleme mit der Formatierung oder den Informationen Ihres Charts zu finden:

```console
$ helm lint mychart
No issues found
```

## Chart Repositories

Ein _Chart Repository_ ist ein HTTP-Server, der ein oder mehrere verpackte Charts hostet. Während `helm` zur Verwaltung lokaler Chart-Verzeichnisse verwendet werden kann, ist bei der gemeinsamen Nutzung von Charts der bevorzugte Mechanismus ein Chart Repository.

Jeder HTTP-Server, der YAML-Dateien und tar-Dateien bereitstellen und GET-Anfragen beantworten kann, kann als Repository-Server verwendet werden. Das Helm-Team hat einige Server getestet, darunter Google Cloud Storage mit aktiviertem Website-Modus und S3 mit aktiviertem Website-Modus.

Ein Repository zeichnet sich hauptsächlich durch das Vorhandensein einer speziellen Datei namens `index.yaml` aus, die eine Liste aller vom Repository bereitgestellten Pakete enthält, zusammen mit Metadaten, die das Abrufen und Verifizieren dieser Pakete ermöglichen.

Auf der Client-Seite werden Repositories mit den `helm repo`-Befehlen verwaltet. Helm bietet jedoch keine Tools zum Hochladen von Charts auf Remote-Repository-Server. Dies liegt daran, dass dies erhebliche Anforderungen an einen implementierenden Server stellen und somit die Hürde für die Einrichtung eines Repositorys erhöhen würde.

## Chart Starter Packs

Der `helm create`-Befehl nimmt eine optionale `--starter`-Option an, mit der Sie ein "Starter-Chart" angeben können. Die Starter-Option hat auch einen kurzen Alias `-p`.

Beispiele für die Verwendung:

```console
helm create my-chart --starter starter-name
helm create my-chart -p starter-name
helm create my-chart -p /absolute/path/to/starter-name
```

Starter sind einfach reguläre Charts, befinden sich aber in `$XDG_DATA_HOME/helm/starters`. Als Chart-Entwickler können Sie Charts erstellen, die speziell für die Verwendung als Starter konzipiert sind. Solche Charts sollten mit den folgenden Überlegungen entworfen werden:

- Die `Chart.yaml` wird vom Generator überschrieben.
- Benutzer werden erwarten, den Inhalt eines solchen Charts zu modifizieren, daher sollte die Dokumentation angeben, wie Benutzer dies tun können.
- Alle Vorkommen von `<CHARTNAME>` werden durch den angegebenen Chart-Namen ersetzt, sodass Starter-Charts als Vorlagen verwendet werden können, außer in einigen Variablendateien. Wenn Sie beispielsweise benutzerdefinierte Dateien im `vars`-Verzeichnis oder bestimmte `README.md`-Dateien verwenden, wird `<CHARTNAME>` darin NICHT ersetzt. Zusätzlich wird die Chart-Beschreibung nicht vererbt.

Derzeit ist die einzige Möglichkeit, ein Chart zu `$XDG_DATA_HOME/helm/starters` hinzuzufügen, es manuell dorthin zu kopieren. In der Dokumentation Ihres Charts sollten Sie diesen Prozess möglicherweise erklären.
