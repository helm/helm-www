---
title: "Glossar" 
description: "Benutzte Ausdrücke zur Beschreibung der Komponenten der Helm Architektur."
weight: 9
---

# Glossar

## Chart

Ein Helm Paket was Informationen zum Installieren eines Sets von Kubernetes Resourcen
in einem Kubernetes Cluster beinhaltet.

Charts enthalten eine `Chart.yaml` Datei als auch Vorlagen, Standardwerte
(`values.yaml`) und Abhängigkeiten.

Charts werden in einer gut definierten Verzeichnisstruktur entwickelt und dann in ein
Archiv gepackt, was sich _Chart Archiv_ nennt.

## Chart Archiv

Ein _Chart Archiv_ ist ein mit tar und gzip gepacktes (und optimalerweise signiertes) Chart.

## Chart Abhängigkeit (Subcharts)

Charts können voneinander abgängen. Es gibt zwei Wege, diese Abhängigkeit herzustellen:

- Weiche Abhängigkeit: Ein Chart funktioniert möglicherweise nicht ohne ein anderes Chart.
  Helm stellt für diesen Fall kein Werkzeug zur Verfügung. Abhängigkeiten müssen separat
  verwaltet werden.
- Harte Abhängigkeit: Ein Chart enthält (innerhalb des `charts/` Verzeichnis) ein
  anderes Chart, von dem es abhängt. In diesem Fall wird die Installation des Charts
  alle Abhängigkeiten mit installieren. Charts und seine Abhängigkeiten werden als
  Kollektion verwaltet.

Wenn ein Chart gepackt wird (mit `helm package`), werden alle harten Abhängigkeiten mit
gebündelt.

## Chart Version

Charts sind versioniert nach [SemVer 2 Spezifikation](https://semver.org). Eine Versionsnummer
ist für jedes Chart erforderlich.

## Chart.yaml

Informationen über ein Chart werden in einer speziellen Datei namens `Chart.yaml` gespeichert.
Jedes Chart muss diese Datei haben.

## Helm (und helm)

Helm ist der Paket Manager für Kubernetes. Wie ein Paket Manager für das
Betriebssystem das Installieren einfacher macht, kann man mit Helm einfacher
Applikationen und Resourcen in Kubernetes Cluster installieren.

Da _Helm_ der Name des Projekts ist, trägt das Kommandozeilenprogramm denselben
Namen. Wenn wir vom Projekt sprechen, wird _Helm_ gross geschrieben. Sprechen
wir vom Kommandozeilenprogramm, schreiben wie _helm_ klein.

## Helm Konfigurationsdateien (XDG)

Helm speichert seine Konfigurationsdateien in XDG Verzeichnissen. Diese
Verzeichnisse werden erstellt, wenn helm zum ersten mal läuft.

## Kube Config (KUBECONFIG)

Das Helm Programm lernt Kubernetes Clusters durch die Benutzung des _Kube
config_ Dateiformats. Standardmässig erwartet Helm, diese Datei an einem Platz
zu finden, wo kubectl es erstellt hat (`$HOME/.kube/config`).

## Lint (Linting)

Ein Chart mit _lint_ zu validieren, ist die Überprüfung, ob es den Konventionen
und Anforderungen des Helm Chart Standards genügt. Helm stellt Werkzeuge zur
Verfügung, allen voran das `helm lint` Kommando.

## Provenance (Provenance file)

Helm charts können von einem _provenance file_ begleitet sein, welches
Informationen bereitstellt, wo das Chart herkommt und was es beinhaltet.

Herkunftsdateien (Provenance files) sind ein Teil der Helm Sicherheit. Eine
_provenance_ beinhaltet einen kryptographischen Hash der Chart Archiv Datei,
der Chart.yaml Datei und eines Signaturblockes (ein OpenPGP "clearsign" Block).
Wenn dies an eine Schlüsselkette gekoppelt ist, können Benutzer:

- validieren, von welchem vertrauenswürdigen Partner das Chart signiert wurde
- validieren, dass die Chart Datei nicht manipuliert wurde
- den Inhalt der Chart Metadaten validieren (`Chart.yaml`)
- schnell vergleichen, dass das Chart mit seinen Herkunftsdaten übereinstimmt

Herkunftsdateien haben die Erweiterungen `.prov` und können von einem Chart
Verzeichnis Server oder einem anderen HTTP Server ausgeliefert werden.

## Release (Version)

Wenn ein Chart installiert ist, erstellt die Helmbibliothek ein Version (_release_),
um nachzuvollziehen, was installiert wurde.

Ein einzelnes Chart wird möglicherweise mehrmals in denselben Cluster installiert
und erstellt unterschiedliche Versionen. Zum Beispiel, ein Chart kann drei
PostgreSQL Datenbanken mit demselben Kommando  `helm install` dreimal mit
unterschiedlchen Versionsnamen installieren.

## Release Number (Release Version)

Eine eintelne Version kann mehrmals aktualisiert werden. Ein sequentieller Zähler
wird benutzt, um die Versionen nachzuvollziehen. Nach einem ersten `helm install`
hat eine Version die _release number_ 1. Nach jeder Aktualisierung oder jedem
Zurückrollen wird die Versionsnummer erhöht.

## Rollback (Zurückrollen)

Eine Version kann zu einem neuen Chart oder einer neuen Konfiguration
aktualisiert werden. Wenn die Versionshistorie gespeichert ist,
kann eine Version zu einer vorherigen auch zurückgerollt werden (_rolles back_).
Das passiert mit dem `helm rollback` Kommando.

Wichtig zu wissen, dass eine zurückgerollte Version eine neue Versionsnummer
generiert.

| Operation  | Release Number                                       |
|------------|------------------------------------------------------|
| install    | release 1                                            |
| upgrade    | release 2                                            |
| upgrade    | release 3                                            |
| rollback 1 | release 4 (but running the same config as release 1) |

Die obige Tabelle zeigt, wie Versionsnummern bei jeder Aktion wie Installieren,
Aktualisieren und Zurückrollen erhöht werden.

## Helm Library (Helm Bibltiothek oder SDK)

Die Helm Bibliothek (Library oder SDK) referenziert zum Go Code, der direkt
mit dem Kubernetes API Server zum Installieren, Aktualisieren, Abfragen und
Löschen von Kubernetes Resourcen interagiert. Sie kann zum Import in ein
Projekt benutzt werden, um Helm in einer Bibliothek anstatt des
Kommandozeilenwerkzeugs zu verwenden.

## Repository (Verzeichnis, Repo, Chart Repository)

Helm Charts sind gespeichert in dedizierten HTTP Servern namens
_chart repositories_ (_Verzeichnis_, _Repositories_ oder einfach _repos_).

Ein Chart Repository Server ist ein einfacher HTTP Server, der eine index.yaml
Datei ausliefern kann, die eine Anzahl Charts beschreibt und Informationen
bereitstellt, wo das Chart herunterzuladen ist.
(Viele Chart Repositories liefern die Charts zusammen mit der `index.yam` Datei
aus.)

Ein Helm Programm kann zu null oder mehreren Chart Verzeichnissen zeigen.
Standardmässig sind keine Verzeichnisse konfiguriert. Chart Verzeichnisse
können mit dem Kommando `helm repo add`  hinzugefügt werden.

## Values (Values/Werte Dateien, values.yaml)

Values (Werte) stellen einen Weg zur Verfügung, um Standards aus den Vorlagen
zu überschreiben.

Helm Charts sind "parametisiert", was bedeutet, dass die Chart Entwickler
Konfigurationen nach aussen führen, die zur Installationszeit überschrieben
werden können. Zum Beispiel, ein Chart führt ein `username` Feld nach aussen,
was das Setzen eines Benutzernamens für diesen Dienst erlaubt.

Diese nach aussen geführten Variablen werden in Helm _values_ genannt.

Values können während `helm install` und `helm upgrade` gesetzt werden, entweder
direkt beim Aufruf oder in einer `values.yaml` Datei.
