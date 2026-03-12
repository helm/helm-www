---
title: Abhängigkeiten
description: Behandelt Best Practices für Chart-Abhängigkeiten.
sidebar_position: 4
---

Dieser Teil des Best-Practices-Leitfadens behandelt die in `Chart.yaml` deklarierten `dependencies`.

## Versionen

Verwenden Sie nach Möglichkeit Versionsbereiche anstelle einer exakten Version. Der empfohlene Standard ist ein Patch-Level-Versionsabgleich:

```yaml
version: ~1.2.3
```

Dies entspricht Version `1.2.3` und allen Patches zu diesem Release. Mit anderen Worten: `~1.2.3` ist äquivalent zu `>= 1.2.3, < 1.3.0`

Die vollständige Syntax für den Versionsabgleich finden Sie in der [semver-Dokumentation](https://github.com/Masterminds/semver#checking-version-constraints).

### Prerelease-Versionen

Die oben genannten Versionsbeschränkungen gelten nicht für Prerelease-Versionen. Zum Beispiel stimmt `version: ~1.2.3` mit `version: ~1.2.4` überein, aber nicht mit `version: ~1.2.3-1`. Folgendes ermöglicht sowohl Prerelease- als auch Patch-Level-Abgleich:

```yaml
version: ~1.2.3-0
```

### Repository-URLs

Verwenden Sie nach Möglichkeit `https://`-Repository-URLs, gefolgt von `http://`-URLs.

Wenn das Repository zur Repository-Indexdatei hinzugefügt wurde, kann der Repository-Name als Alias für die URL verwendet werden. Verwenden Sie `alias:` oder `@` gefolgt vom Repository-Namen.

Datei-URLs (`file://...`) gelten als „Sonderfall" für Charts, die durch eine feste Deployment-Pipeline zusammengestellt werden.

Bei der Verwendung von [Downloader-Plugins](../topics/plugins.md#downloader-plugins) ist das URL-Schema spezifisch für das Plugin. Beachten Sie, dass ein Benutzer des Charts ein Plugin installiert haben muss, das das Schema unterstützt, um die Abhängigkeit zu aktualisieren oder zu erstellen.

Helm kann keine Abhängigkeitsverwaltungsoperationen für die Abhängigkeit durchführen, wenn das `repository`-Feld leer gelassen wird. In diesem Fall geht Helm davon aus, dass sich die Abhängigkeit in einem Unterverzeichnis des `charts`-Ordners befindet, wobei der Name mit der `name`-Eigenschaft der Abhängigkeit übereinstimmt.

## Conditions und Tags

Conditions oder Tags sollten zu allen Abhängigkeiten hinzugefügt werden, die _optional_ sind. Beachten Sie, dass eine `condition` standardmäßig den Wert `true` hat.

Die bevorzugte Form einer Condition ist:

```yaml
condition: somechart.enabled
```

Wobei `somechart` der Chart-Name der Abhängigkeit ist.

Wenn mehrere Subcharts (Abhängigkeiten) zusammen eine optionale oder austauschbare Funktion bereitstellen, sollten diese Charts dieselben Tags teilen.

Wenn zum Beispiel sowohl `nginx` als auch `memcached` zusammen Leistungsoptimierungen für die Hauptanwendung im Chart bieten und beide vorhanden sein müssen, wenn diese Funktion aktiviert ist, dann sollten beide einen Tags-Abschnitt wie diesen haben:

```yaml
tags:
  - webaccelerator
```

Dies ermöglicht es einem Benutzer, diese Funktion mit einem Tag ein- und auszuschalten.
