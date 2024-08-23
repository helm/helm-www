---
title: "Désinstallation"
weight: 3
---

## Désinstallation

### Je souhaite supprimer Helm. Où sont tous ses fichiers ? 

En plus du binaire `helm`, Helm stocke certains fichiers aux emplacements suivants :

- `$XDG_CACHE_HOME`
- `$XDG_CONFIG_HOME`
- `$XDG_DATA_HOME`

Le tableau suivant fournis la liste des emplacements par défaut pour chacun des ces dossiers, par système d'exploitation :

| Système d'Exploitation | Emplacement du Cache     | Emplacement de la Configuration | Emplacement des Données |
|------------------------|--------------------------|---------------------------------|-------------------------|
| Linux                  | `$HOME/.cache/helm `       | `$HOME/.config/helm `              | `$HOME/.local/share/helm`  |
| macOS                  | `$HOME/Library/Caches/helm` | `$HOME/Library/Preferences/helm`    | `$HOME/Library/helm `      |
| Windows                | `%TEMP%\helm  `            | `%APPDATA%\helm `                 | `%APPDATA%\helm`          |
