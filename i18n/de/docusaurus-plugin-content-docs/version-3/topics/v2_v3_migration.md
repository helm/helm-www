---
title: Migration von Helm v2 auf v3
description: Erfahren Sie, wie Sie Helm v2 auf v3 migrieren.
sidebar_position: 13
---

Diese Anleitung zeigt, wie Sie Helm v2 auf v3 migrieren. Helm v2 muss installiert sein
und Releases in einem oder mehreren Clustern verwalten.

## Übersicht der Änderungen in Helm 3

Die vollständige Liste der Änderungen von Helm 2 auf 3 ist im Abschnitt
[FAQ](/faq/changes_since_helm2.md) dokumentiert. Im Folgenden finden Sie eine
Zusammenfassung einiger Änderungen, die ein Benutzer vor und während der Migration
beachten sollte:

1. Entfernung von Tiller:
   - Die Client/Server-Architektur wird durch eine Client/Library-Architektur ersetzt
     (nur noch das `helm`-Binary)
   - Sicherheit basiert nun auf Benutzerbasis (delegiert an die Kubernetes-
     Cluster-Sicherheit)
   - Releases werden jetzt als In-Cluster-Secrets gespeichert und die Metadaten des
     Release-Objekts haben sich geändert
   - Releases werden pro Release-Namespace persistiert und nicht mehr im
     Tiller-Namespace
2. Aktualisiertes Chart-Repository:
   - `helm search` unterstützt jetzt sowohl lokale Repository-Suchen als auch
     Suchanfragen an Artifact Hub
3. Chart apiVersion auf "v2" angehoben für folgende Spezifikationsänderungen:
   - Dynamisch verknüpfte Chart-Abhängigkeiten wurden nach `Chart.yaml` verschoben
     (`requirements.yaml` entfernt und requirements --> dependencies)
   - Library-Charts (Hilfs-/Common-Charts) können jetzt als dynamisch verknüpfte
     Chart-Abhängigkeiten hinzugefügt werden
   - Charts haben ein `type`-Metadatenfeld, das definiert, ob das Chart ein
     `application`- oder `library`-Chart ist. Standardmäßig ist es application,
     was bedeutet, dass es renderbar und installierbar ist
   - Helm 2-Charts (apiVersion=v1) sind weiterhin installierbar
4. XDG-Verzeichnisspezifikation hinzugefügt:
   - Helm home wurde entfernt und durch die XDG-Verzeichnisspezifikation zum Speichern
     von Konfigurationsdateien ersetzt
   - Helm muss nicht mehr initialisiert werden
   - `helm init` und `helm home` wurden entfernt
5. Weitere Änderungen:
   - Die Installation/Einrichtung von Helm wurde vereinfacht:
     - Nur noch Helm-Client (helm-Binary) (kein Tiller)
     - Sofort einsatzbereit
   - `local`- oder `stable`-Repositories werden standardmäßig nicht eingerichtet
   - Der `crd-install`-Hook wurde entfernt und durch das `crds`-Verzeichnis im Chart
     ersetzt, in dem alle CRDs definiert werden, die vor dem Rendern des Charts
     installiert werden
   - Der Hook-Annotationswert `test-failure` wurde entfernt, und `test-success` ist
     veraltet. Verwenden Sie stattdessen `test`
   - Entfernte/ersetzte/hinzugefügte Befehle:
       - delete --> uninstall: Entfernt standardmäßig die gesamte Release-Historie
         (früher war `--purge` erforderlich)
       - fetch --> pull
       - home (entfernt)
       - init (entfernt)
       - install: Erfordert einen Release-Namen oder das Argument `--generate-name`
       - inspect --> show
       - reset (entfernt)
       - serve (entfernt)
       - template: Das Argument `-x`/`--execute` wurde in `-s`/`--show-only` umbenannt
       - upgrade: Das Argument `--history-max` wurde hinzugefügt, das die maximale
         Anzahl der gespeicherten Revisionen pro Release begrenzt (0 für kein Limit)
   - Die Helm 3-Go-Bibliothek hat viele Änderungen durchlaufen und ist nicht mit der
     Helm 2-Bibliothek kompatibel
   - Release-Binaries werden jetzt auf `get.helm.sh` gehostet

## Anwendungsfälle für die Migration

Es gibt folgende Anwendungsfälle:

1. Helm v2 und v3 verwalten denselben Cluster:
   - Dieser Anwendungsfall wird nur empfohlen, wenn Sie beabsichtigen, Helm v2
     schrittweise auslaufen zu lassen und v3 keine von v2 bereitgestellten Releases
     verwalten soll. Alle neuen Releases sollten von v3 bereitgestellt werden, und
     bestehende, von v2 bereitgestellte Releases sollten nur von v2 aktualisiert/
     entfernt werden
   - Helm v2 und v3 können problemlos denselben Cluster verwalten. Die Helm-Versionen
     können auf demselben oder auf separaten Systemen installiert werden
   - Wenn Sie Helm v3 auf demselben System installieren, müssen Sie einen zusätzlichen
     Schritt durchführen, um sicherzustellen, dass beide Client-Versionen koexistieren
     können, bis Sie bereit sind, den Helm v2-Client zu entfernen. Benennen Sie das
     Helm v3-Binary um oder legen Sie es in einem anderen Ordner ab, um Konflikte zu
     vermeiden
   - Andernfalls gibt es keine Konflikte zwischen beiden Versionen aufgrund der
     folgenden Unterschiede:
     - Die Release-(Historie-)Speicherung von v2 und v3 ist voneinander unabhängig.
       Die Änderungen umfassen die Kubernetes-Ressource für die Speicherung und die
       Release-Objekt-Metadaten in der Ressource. Releases werden auch pro
       Benutzer-Namespace gespeichert und nicht mehr im Tiller-Namespace (z.B. war der
       Standard-Tiller-Namespace in v2 kube-system). v2 verwendet "ConfigMaps" oder
       "Secrets" im Tiller-Namespace mit `TILLER`-Ownership. v3 verwendet "Secrets"
       im Benutzer-Namespace mit `helm`-Ownership. Releases sind sowohl in v2 als auch
       in v3 inkrementell
     - Das einzige Problem könnte auftreten, wenn clusterweite Kubernetes-Ressourcen
       (z.B. `clusterroles.rbac`) in einem Chart definiert sind. Das v3-Deployment
       würde dann fehlschlagen, selbst wenn es im Namespace eindeutig ist, da die
       Ressourcen kollidieren würden
     - Die v3-Konfiguration verwendet nicht mehr `$HELM_HOME` und nutzt stattdessen
       die XDG-Verzeichnisspezifikation. Sie wird auch bei Bedarf automatisch erstellt.
       Sie ist daher unabhängig von der v2-Konfiguration. Dies gilt nur, wenn beide
       Versionen auf demselben System installiert sind

2. Migration von Helm v2 auf Helm v3:
   - Dieser Anwendungsfall gilt, wenn Sie möchten, dass Helm v3 bestehende Helm v2-
     Releases verwaltet
   - Beachten Sie, dass ein Helm v2-Client:
     - 1 bis viele Kubernetes-Cluster verwalten kann
     - sich mit 1 bis vielen Tiller-Instanzen pro Cluster verbinden kann
   - Das bedeutet, dass Sie dies bei der Migration berücksichtigen müssen, da Releases
     von Tiller und dessen Namespace in Cluster bereitgestellt werden. Sie müssen daher
     die Migration für jeden Cluster und jede Tiller-Instanz berücksichtigen, die von
     der Helm v2-Client-Instanz verwaltet wird
   - Der empfohlene Migrationspfad für Daten ist wie folgt:
     1. v2-Daten sichern
     2. Helm v2-Konfiguration migrieren
     3. Helm v2-Releases migrieren
     4. Wenn Sie sicher sind, dass Helm v3 alle Helm v2-Daten (für alle Cluster und
        Tiller-Instanzen der Helm v2-Client-Instanz) wie erwartet verwaltet, können Sie
        die Helm v2-Daten bereinigen
   - Der Migrationsprozess wird durch das Helm v3-Plugin
     [2to3](https://github.com/helm/helm-2to3) automatisiert

## Referenzen

- Helm v3 [2to3](https://github.com/helm/helm-2to3) Plugin
- [Blogbeitrag](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/), der die
  Verwendung des `2to3`-Plugins mit Beispielen erklärt
