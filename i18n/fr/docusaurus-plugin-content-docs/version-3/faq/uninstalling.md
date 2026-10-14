---
title: Désinstallation
sidebar_position: 3
default_lang_commit: 07caa4dd6e58a47e79ac2ec7949e57157f1a2b2a
---

## Désinstallation

### Je veux supprimer Helm de mon ordinateur. Où se trouvent tous ses fichiers ?

En plus du binaire `helm`, Helm stocke certains fichiers aux emplacements suivants :

- $XDG_CACHE_HOME
- $XDG_CONFIG_HOME
- $XDG_DATA_HOME

Le tableau suivant indique le dossier par défaut pour chacun de ces emplacements, selon le système d'exploitation :

| Système d'exploitation | Chemin du cache             | Chemin de configuration          | Chemin des données        |
|------------------------|-----------------------------|----------------------------------|---------------------------|
| Linux                  | `$HOME/.cache/helm `        | `$HOME/.config/helm `            | `$HOME/.local/share/helm` |
| macOS                  | `$HOME/Library/Caches/helm` | `$HOME/Library/Preferences/helm` | `$HOME/Library/helm `     |
| Windows                | `%TEMP%\helm  `             | `%APPDATA%\helm `                | `%APPDATA%\helm`          |
