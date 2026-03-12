---
title: Helm Architektur
description: Beschreibt die Architektur von Helm auf hoher Ebene.
sidebar_position: 8
---

# Helm Architektur

Dieses Dokument beschreibt die Architektur von Helm auf hoher Ebene.

## Der Zweck von Helm

Helm ist ein Werkzeug zur Verwaltung von Kubernetes-Paketen, die _Charts_ genannt werden. Helm kann Folgendes:

- Neue Charts von Grund auf erstellen
- Charts in Chart-Archive (tgz-Dateien) paketieren
- Mit Chart-Repositories interagieren, in denen Charts gespeichert sind
- Charts in einem bestehenden Kubernetes-Cluster installieren und deinstallieren
- Den Release-Zyklus von Charts verwalten, die mit Helm installiert wurden

Für Helm gibt es drei wichtige Konzepte:

1. Das _Chart_ ist ein Bündel von Informationen, die zur Erstellung einer Instanz einer Kubernetes-Anwendung erforderlich sind.
2. Die _Config_ enthält Konfigurationsinformationen, die mit einem paketierten Chart zusammengeführt werden können, um ein installierbares Objekt zu erstellen.
3. Ein _Release_ ist eine laufende Instanz eines _Charts_, kombiniert mit einer bestimmten _Config_.

## Komponenten

Helm ist eine ausführbare Anwendung, die aus zwei verschiedenen Teilen besteht:

**Der Helm Client** ist ein Kommandozeilen-Client für Endbenutzer. Der Client ist für Folgendes verantwortlich:

- Lokale Chart-Entwicklung
- Verwaltung von Repositories
- Verwaltung von Releases
- Schnittstelle zur Helm-Bibliothek
  - Senden von Charts zur Installation
  - Anfordern von Upgrades oder Deinstallationen bestehender Releases

**Die Helm Bibliothek** stellt die Logik für die Ausführung aller Helm-Operationen bereit. Sie kommuniziert mit dem Kubernetes API-Server und bietet folgende Funktionalität:

- Kombination eines Charts und einer Config zu einem Release
- Installation von Charts in Kubernetes und Bereitstellung des resultierenden Release-Objekts
- Aktualisierung und Deinstallation von Charts durch Interaktion mit Kubernetes

Die eigenständige Helm-Bibliothek kapselt die Helm-Logik, sodass sie von verschiedenen Clients genutzt werden kann.

## Implementierung

Der Helm Client und die Bibliothek sind in der Programmiersprache Go geschrieben.

Die Bibliothek verwendet die Kubernetes-Client-Bibliothek zur Kommunikation mit Kubernetes. Derzeit verwendet diese Bibliothek REST+JSON. Sie speichert Informationen in Secrets innerhalb von Kubernetes. Sie benötigt keine eigene Datenbank.

Konfigurationsdateien werden, wenn möglich, in YAML geschrieben.
