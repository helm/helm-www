---
title: Видалення
sidebar_position: 3
default_lang_commit: 07caa4dd6e58a47e79ac2ec7949e57157f1a2b2a
---

## Видалення {#uninstalling}

### Я хочу видалити свій локальний Helm. Де зберігаються всі його файли? {#i-want-to-uninstall-my-local-helm-where-are-all-of-its-files}

Разом з бінарним файлом `helm`, Helm зберігає деякі файли в наступних розташуваннях:

- $XDG_CACHE_HOME
- $XDG_CONFIG_HOME
- $XDG_DATA_HOME

Наступна таблиця показує стандартні теки для кожного з цих розташувань, за операційними системами:

| Операційна система | Шлях до кешу                | Шлях до конфігурацій             | Шлях до даних               |
|--------------------|-----------------------------|----------------------------------|-----------------------------|
| Linux              | `$HOME/.cache/helm`         | `$HOME/.config/helm`             | `$HOME/.local/share/helm`   |
| macOS              | `$HOME/Library/Caches/helm` | `$HOME/Library/Preferences/helm` | `$HOME/Library/helm`        |
| Windows            | `%TEMP%\helm`               | `%APPDATA%\helm`                 | `%APPDATA%\helm`            |
