---
title: "Release-Zeitplan-Richtlinie"
description: "Beschreibt Helms Release-Zeitplan-Richtlinie."
---

Helm gibt Veröffentlichungstermine im Voraus bekannt, damit Anwender besser planen
können. Dieses Dokument beschreibt die Richtlinie für Helms Release-Zeitplan.

## Release-Kalender

Ein öffentlicher Kalender mit den anstehenden Helm-Releases ist [hier](https://helm.sh/calendar/release) verfügbar.

## Semantische Versionierung

Helm-Versionen werden als `x.y.z` ausgedrückt, wobei `x` die Hauptversion, `y` die
Nebenversion und `z` die Patch-Version ist. Dies entspricht der Terminologie der
[Semantischen Versionierung](https://semver.org/spec/v2.0.0.html).

## Patch-Releases

Patch-Releases bieten Benutzern Fehlerbehebungen und Sicherheitskorrekturen. Sie
enthalten keine neuen Funktionen.

Ein neues Patch-Release für die aktuelle Neben-/Hauptversion wird normalerweise
einmal im Monat am zweiten Mittwoch jedes Monats veröffentlicht.

Ein Patch-Release zur Behebung einer kritischen Regression oder eines
Sicherheitsproblems kann jederzeit bei Bedarf erfolgen.

Ein Patch-Release wird aus einem der folgenden Gründe abgesagt:
- wenn seit dem letzten Release kein neuer Inhalt hinzugekommen ist
- wenn das Patch-Release-Datum innerhalb einer Woche vor dem ersten Release Candidate (RC1) einer anstehenden Nebenversion liegt
- wenn das Patch-Release-Datum innerhalb von vier Wochen nach einer Nebenversion liegt

## Nebenversionen

Nebenversionen enthalten Sicherheits- und Fehlerbehebungen sowie neue Funktionen.
Sie sind rückwärtskompatibel in Bezug auf die API und die CLI-Nutzung.

Um sich mit Kubernetes-Releases abzustimmen, wird eine Helm-Nebenversion alle
4 Monate veröffentlicht (3 Releases pro Jahr).

Zusätzliche Nebenversionen können bei Bedarf veröffentlicht werden, beeinflussen
aber nicht den Zeitplan eines angekündigten zukünftigen Releases, es sei denn,
das angekündigte Release liegt weniger als 7 Tage entfernt.

Gleichzeitig mit der Veröffentlichung eines Releases wird das Datum der nächsten
Nebenversion angekündigt und auf Helms Hauptwebseite veröffentlicht.

## Hauptversionen

Hauptversionen enthalten Breaking Changes. Solche Releases sind selten, aber
manchmal notwendig, damit sich Helm in wichtigen neuen Richtungen weiterentwickeln
kann.

Hauptversionen können schwierig zu planen sein. Daher wird ein finales
Veröffentlichungsdatum erst gewählt und angekündigt, wenn die erste Beta-Version
eines solchen Releases verfügbar ist.
