---
title: Απεγκατάσταση
sidebar_position: 3
---

## Απεγκατάσταση

### Θέλω να διαγράψω το τοπικό μου Helm. Πού βρίσκονται όλα τα αρχεία του;

Πέρα από το binary `helm`, το Helm αποθηκεύει ορισμένα αρχεία στις ακόλουθες τοποθεσίες:

- $XDG_CACHE_HOME
- $XDG_CONFIG_HOME
- $XDG_DATA_HOME

Ο παρακάτω πίνακας δείχνει τον προεπιλεγμένο φάκελο για καθεμία από αυτές, ανά λειτουργικό σύστημα:

| Λειτουργικό Σύστημα | Διαδρομή Cache              | Διαδρομή Ρυθμίσεων               | Διαδρομή Δεδομένων          |
|---------------------|-----------------------------|----------------------------------|-----------------------------|
| Linux               | `$HOME/.cache/helm `        | `$HOME/.config/helm `            | `$HOME/.local/share/helm`   |
| macOS               | `$HOME/Library/Caches/helm` | `$HOME/Library/Preferences/helm` | `$HOME/Library/helm `       |
| Windows             | `%TEMP%\helm  `             | `%APPDATA%\helm `                | `%APPDATA%\helm`            |
