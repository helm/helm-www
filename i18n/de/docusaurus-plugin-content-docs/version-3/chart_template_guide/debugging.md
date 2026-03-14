---
title: Templates debuggen
description: Fehlerbehebung bei Charts, die nicht bereitgestellt werden können.
sidebar_position: 13
---

Das Debuggen von Templates kann schwierig sein, da die gerenderten Templates an
den Kubernetes-API-Server gesendet werden, der die YAML-Dateien aus anderen
Gründen als der Formatierung ablehnen kann.

Es gibt einige Befehle, die Ihnen beim Debuggen helfen können.

- `helm lint` ist Ihr bevorzugtes Werkzeug, um zu überprüfen, ob Ihr Chart den
  Best Practices entspricht
- `helm template --debug` testet das Rendern von Chart-Templates lokal.
- `helm install --dry-run --debug` rendert Ihr Chart ebenfalls lokal ohne es zu
installieren, prüft aber auch, ob bereits konfliktbehaftete Ressourcen auf dem
Cluster laufen. Mit `--dry-run=server` werden zusätzlich alle `lookup`-Aufrufe
in Ihrem Chart gegen den Server ausgeführt.
- `helm get manifest`: Dies ist eine gute Möglichkeit zu sehen, welche Templates
  auf dem Server installiert sind.

Wenn Ihr YAML nicht geparst werden kann, Sie aber sehen möchten, was generiert
wird, ist eine einfache Möglichkeit, das YAML abzurufen, den problematischen
Abschnitt im Template auszukommentieren und dann `helm install --dry-run --debug`
erneut auszuführen:

```yaml
apiVersion: v2
# some: problem section
# {{ .Values.foo | quote }}
```

Der obige Code wird gerendert und mit den Kommentaren intakt zurückgegeben:

```yaml
apiVersion: v2
# some: problem section
#  "bar"
```

Dies bietet eine schnelle Möglichkeit, den generierten Inhalt anzuzeigen, ohne
von YAML-Parse-Fehlern aufgehalten zu werden.
