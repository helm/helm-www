---
title: Удаление
sidebar_position: 3
---

## Удаление

### Я хочу удалить локальную установку Helm. Где находятся все его файлы?

Помимо бинарного файла `helm`, Helm хранит файлы в следующих местах:

- $XDG_CACHE_HOME
- $XDG_CONFIG_HOME
- $XDG_DATA_HOME

В следующей таблице приведены пути по умолчанию для каждой из этих директорий в зависимости от операционной системы:

| Операционная система | Путь к кэшу                 | Путь к конфигурации              | Путь к данным             |
|----------------------|-----------------------------|----------------------------------|---------------------------|
| Linux                | `$HOME/.cache/helm `        | `$HOME/.config/helm `            | `$HOME/.local/share/helm` |
| macOS                | `$HOME/Library/Caches/helm` | `$HOME/Library/Preferences/helm` | `$HOME/Library/helm `     |
| Windows              | `%TEMP%\helm  `             | `%APPDATA%\helm `                | `%APPDATA%\helm`          |
