---
title: Integrierte Objekte
description: Integrierte Objekte, die in Templates verfügbar sind.
sidebar_position: 3
---

Objekte werden von der Template-Engine an ein Template übergeben. Ihr Code kann
Objekte weitergeben (wir werden Beispiele sehen, wenn wir uns die `with`- und
`range`-Anweisungen ansehen). Es gibt sogar einige Möglichkeiten, neue Objekte
innerhalb Ihrer Templates zu erstellen, wie z.B. mit der `tuple`-Funktion, die
wir später sehen werden.

Objekte können einfach sein und nur einen Wert haben. Oder sie können andere
Objekte oder Funktionen enthalten. Zum Beispiel enthält das `Release`-Objekt
mehrere Objekte (wie `Release.Name`) und das `Files`-Objekt verfügt über einige
Funktionen.

Im vorherigen Abschnitt haben wir `{{ .Release.Name }}` verwendet, um den Namen
eines Release in ein Template einzufügen. `Release` ist eines der Top-Level-
Objekte, auf die Sie in Ihren Templates zugreifen können.

- `Release`: Dieses Objekt beschreibt das Release selbst. Es enthält mehrere
  Objekte:
  - `Release.Name`: Der Release-Name
  - `Release.Namespace`: Der Namespace, in den bereitgestellt wird (sofern das
    Manifest dies nicht überschreibt)
  - `Release.IsUpgrade`: Wird auf `true` gesetzt, wenn die aktuelle Operation
    ein Upgrade oder Rollback ist.
  - `Release.IsInstall`: Wird auf `true` gesetzt, wenn die aktuelle Operation
    eine Installation ist.
  - `Release.Revision`: Die Revisionsnummer für dieses Release. Bei der
    Installation ist dies 1, und sie wird mit jedem Upgrade und Rollback erhöht.
  - `Release.Service`: Der Dienst, der das aktuelle Template rendert. In Helm
    ist dies immer `Helm`.
- `Values`: Werte, die aus der `values.yaml`-Datei und aus vom Benutzer
  bereitgestellten Dateien an das Template übergeben werden. Standardmäßig ist
  `Values` leer.
- `Chart`: Der Inhalt der `Chart.yaml`-Datei. Alle Daten in `Chart.yaml` sind
  hier zugänglich. Zum Beispiel gibt `{{ .Chart.Name }}-{{ .Chart.Version }}`
  `mychart-0.1.0` aus.
  - Die verfügbaren Felder sind in der [Charts-Anleitung](/topics/charts.md#the-chartyaml-file)
    aufgelistet
- `Subcharts`: Dies ermöglicht den Zugriff auf den Scope (.Values, .Charts,
  .Releases usw.) von Subcharts für das übergeordnete Chart. Zum Beispiel greift
  `.Subcharts.mySubChart.myValue` auf den `myValue` im `mySubChart`-Chart zu.
- `Files`: Dies ermöglicht den Zugriff auf alle nicht-speziellen Dateien in
  einem Chart. Sie können damit zwar nicht auf Templates zugreifen, aber auf
  andere Dateien im Chart. Weitere Informationen finden Sie im Abschnitt
  [Zugriff auf Dateien](/chart_template_guide/accessing_files.md).
  - `Files.Get` ist eine Funktion zum Abrufen einer Datei nach Namen
    (`.Files.Get config.ini`)
  - `Files.GetBytes` ist eine Funktion zum Abrufen des Inhalts einer Datei als
    Byte-Array anstatt als String. Dies ist nützlich für Dinge wie Bilder.
  - `Files.Glob` ist eine Funktion, die eine Liste von Dateien zurückgibt, deren
    Namen dem angegebenen Shell-Glob-Muster entsprechen.
  - `Files.Lines` ist eine Funktion, die eine Datei Zeile für Zeile liest. Dies
    ist nützlich für die Iteration über jede Zeile in einer Datei.
  - `Files.AsSecrets` ist eine Funktion, die die Dateiinhalte als Base64-
    codierte Strings zurückgibt.
  - `Files.AsConfig` ist eine Funktion, die Dateiinhalte als YAML-Map zurückgibt.
- `Capabilities`: Dies liefert Informationen darüber, welche Fähigkeiten der
  Kubernetes-Cluster unterstützt.
  - `Capabilities.APIVersions` ist eine Sammlung von Versionen.
  - `Capabilities.APIVersions.Has $version` gibt an, ob eine Version (z.B.
    `batch/v1`) oder Ressource (z.B. `apps/v1/Deployment`) im Cluster verfügbar
    ist.
  - `Capabilities.KubeVersion` und `Capabilities.KubeVersion.Version` ist die
    Kubernetes-Version.
  - `Capabilities.KubeVersion.Major` ist die Kubernetes-Hauptversion.
  - `Capabilities.KubeVersion.Minor` ist die Kubernetes-Nebenversion.
  - `Capabilities.HelmVersion` ist das Objekt, das die Helm-Versionsdetails
    enthält; es entspricht der Ausgabe von `helm version`.
  - `Capabilities.HelmVersion.Version` ist die aktuelle Helm-Version im
    SemVer-Format.
  - `Capabilities.HelmVersion.GitCommit` ist der Helm-Git-SHA1.
  - `Capabilities.HelmVersion.GitTreeState` ist der Zustand des Helm-Git-Trees.
  - `Capabilities.HelmVersion.GoVersion` ist die Version des verwendeten
    Go-Compilers.
- `Template`: Enthält Informationen über das aktuelle Template, das ausgeführt
  wird
  - `Template.Name`: Ein namespace-qualifizierter Dateipfad zum aktuellen
    Template (z.B. `mychart/templates/mytemplate.yaml`)
  - `Template.BasePath`: Der namespace-qualifizierte Pfad zum Templates-
    Verzeichnis des aktuellen Charts (z.B. `mychart/templates`).

Die integrierten Werte beginnen immer mit einem Großbuchstaben. Dies entspricht
der Go-Namenskonvention. Wenn Sie Ihre eigenen Namen erstellen, können Sie eine
Konvention verwenden, die zu Ihrem Team passt. Einige Teams, wie viele, deren
Charts Sie auf [Artifact Hub](https://artifacthub.io/packages/search?kind=0)
finden können, verwenden nur Kleinbuchstaben am Anfang, um lokale Namen von
den integrierten zu unterscheiden. In dieser Anleitung folgen wir dieser
Konvention.
