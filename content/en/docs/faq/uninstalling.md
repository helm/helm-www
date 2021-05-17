---
title: "Uninstalling"
weight: 3
aliases: [
  "/docs/topics/faq/uninstalling",
  "/docs/faq/uninstalling"
]
---

## Uninstalling

### I want to delete my local Helm. Where are all its files?

Along with the `helm` binary, Helm stores some files in the following locations:

- $XDG_CACHE_HOME
- $XDG_CONFIG_HOME
- $XDG_DATA_HOME

The following table gives the default folder for each of these, by OS:

| Operating System | Cache Path                  | Configuration Path               | Data Path                 |
|------------------|-----------------------------|----------------------------------|---------------------------|
| Linux            | `$HOME/.cache/helm `        | `$HOME/.config/helm `            | `$HOME/.local/share/helm` |
| macOS            | `$HOME/Library/Caches/helm` | `$HOME/Library/Preferences/helm` | `$HOME/Library/helm `     |
| Windows          | `%TEMP%\helm  `             | `%APPDATA%\helm `                | `%APPDATA%\helm`          |

