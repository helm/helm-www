---
title: Desinstalación
sidebar_position: 3
---

## Desinstalación

### Quiero eliminar mi Helm local. ¿Dónde están todos sus archivos?

Además del binario `helm`, Helm almacena algunos archivos en las siguientes ubicaciones:

- $XDG_CACHE_HOME
- $XDG_CONFIG_HOME
- $XDG_DATA_HOME

La siguiente tabla muestra la carpeta predeterminada para cada una de estas, según el sistema operativo:

| Sistema Operativo | Ruta de Caché               | Ruta de Configuración            | Ruta de Datos             |
|-------------------|-----------------------------|----------------------------------|---------------------------|
| Linux             | `$HOME/.cache/helm`        | `$HOME/.config/helm`            | `$HOME/.local/share/helm` |
| macOS             | `$HOME/Library/Caches/helm` | `$HOME/Library/Preferences/helm` | `$HOME/Library/helm`     |
| Windows           | `%TEMP%\helm`             | `%APPDATA%\helm`                | `%APPDATA%\helm`          |
