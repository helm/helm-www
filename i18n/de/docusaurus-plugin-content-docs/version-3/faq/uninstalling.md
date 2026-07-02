---
title: "Deinstallieren"
sidebar_position: 3
default_lang_commit: 07caa4dd6e58a47e79ac2ec7949e57157f1a2b2a
---

## Deinstallieren

### Ich möchte mein lokales Helm deinstallieren. Wo sind alle Dateien?

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

