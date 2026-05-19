---
title: Eine NOTES.txt-Datei erstellen
description: Wie Sie Ihren Chart-Benutzern Anweisungen bereitstellen.
sidebar_position: 10
---

In diesem Abschnitt betrachten wir das Helm-Werkzeug zur Bereitstellung von
Anweisungen für Ihre Chart-Benutzer. Am Ende eines `helm install` oder
`helm upgrade` kann Helm einen Block mit hilfreichen Informationen für Benutzer
ausgeben. Diese Informationen sind mithilfe von Templates flexibel anpassbar.

Um Installationshinweise zu Ihrem Chart hinzuzufügen, erstellen Sie einfach eine
`templates/NOTES.txt`-Datei. Diese Datei enthält reinen Text, wird aber wie
ein Template verarbeitet und hat Zugriff auf alle normalen Template-Funktionen
und -Objekte.

Erstellen wir eine einfache `NOTES.txt`-Datei:

```
Thank you for installing {{ .Chart.Name }}.

Your release is named {{ .Release.Name }}.

To learn more about the release, try:

  $ helm status {{ .Release.Name }}
  $ helm get all {{ .Release.Name }}

```

Wenn wir jetzt `helm install rude-cardinal ./mychart` ausführen, sehen wir diese
Nachricht am Ende:

```
RESOURCES:
==> v1/Secret
NAME                   TYPE      DATA      AGE
rude-cardinal-secret   Opaque    1         0s

==> v1/ConfigMap
NAME                      DATA      AGE
rude-cardinal-configmap   3         0s


NOTES:
Thank you for installing mychart.

Your release is named rude-cardinal.

To learn more about the release, try:

  $ helm status rude-cardinal
  $ helm get all rude-cardinal
```

Die Verwendung von `NOTES.txt` auf diese Weise ist eine hervorragende
Möglichkeit, Ihren Benutzern detaillierte Informationen zur Nutzung ihres neu
installierten Charts zu geben. Wir empfehlen dringend, eine `NOTES.txt`-Datei
zu erstellen, auch wenn diese nicht zwingend erforderlich ist.
