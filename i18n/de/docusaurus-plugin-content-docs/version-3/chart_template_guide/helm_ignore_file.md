---
title: Die .helmignore-Datei
description: Die `.helmignore`-Datei wird verwendet, um Dateien anzugeben, die Sie nicht in Ihr Helm Chart aufnehmen möchten.
sidebar_position: 12
---

Die `.helmignore`-Datei wird verwendet, um Dateien anzugeben, die Sie nicht in
Ihr Helm Chart aufnehmen möchten.

Wenn diese Datei existiert, ignoriert der Befehl `helm package` beim Paketieren
Ihrer Anwendung alle Dateien, die den in der `.helmignore`-Datei angegebenen
Mustern entsprechen.

So können Sie verhindern, dass unnötige oder sensible Dateien und Verzeichnisse
in Ihr Helm Chart aufgenommen werden.

Die `.helmignore`-Datei unterstützt Unix-Shell-Glob-Matching, relatives
Pfad-Matching und Negation (mit ! vorangestellt). Pro Zeile wird nur ein Muster
berücksichtigt.

Hier ist ein Beispiel für eine `.helmignore`-Datei:

```
# comment

# Match any file or path named .helmignore
.helmignore

# Match any file or path named .git
.git

# Match any text file
*.txt

# Match only directories named mydir
mydir/

# Match only text files in the top-level directory
/*.txt

# Match only the file foo.txt in the top-level directory
/foo.txt

# Match any file named ab.txt, ac.txt, or ad.txt
a[b-d].txt

# Match any file under subdir matching temp*
*/temp*

*/*/temp*
temp?
```

Einige bemerkenswerte Unterschiede zu .gitignore:
- Die '**'-Syntax wird nicht unterstützt.
- Die verwendete Globbing-Bibliothek ist Go's 'filepath.Match', nicht fnmatch(3)
- Nachstehende Leerzeichen werden immer ignoriert (es gibt keine Escape-Sequenz, um sie zu erhalten)
- Es gibt keine Unterstützung für '\!' als spezielle führende Sequenz.
- Die Datei schließt sich nicht standardmäßig selbst aus – Sie müssen einen expliziten Eintrag für `.helmignore` hinzufügen


**Helfen Sie uns**, dieses Dokument zu verbessern. Um Informationen
hinzuzufügen, zu korrigieren oder zu entfernen, [erstellen Sie ein
Issue](https://github.com/helm/helm-www/issues) oder senden Sie uns einen Pull
Request.
