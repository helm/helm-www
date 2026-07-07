---
title: "Installieren"
weight: 2
---

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

