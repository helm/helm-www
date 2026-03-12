---
title: Desinstalação
sidebar_position: 3
---

## Desinstalação

### Quero remover minha instalação local do Helm. Onde estão todos os seus arquivos?

Além do binário `helm`, o Helm armazena alguns arquivos nos seguintes locais:

- $XDG_CACHE_HOME
- $XDG_CONFIG_HOME
- $XDG_DATA_HOME

A tabela a seguir mostra a pasta padrão para cada um desses locais, por sistema operacional:

| Sistema Operacional | Caminho do Cache            | Caminho de Configuração          | Caminho de Dados          |
|---------------------|-----------------------------|----------------------------------|---------------------------|
| Linux               | `$HOME/.cache/helm `        | `$HOME/.config/helm `            | `$HOME/.local/share/helm` |
| macOS               | `$HOME/Library/Caches/helm` | `$HOME/Library/Preferences/helm` | `$HOME/Library/helm `     |
| Windows             | `%TEMP%\helm  `             | `%APPDATA%\helm `                | `%APPDATA%\helm`          |
