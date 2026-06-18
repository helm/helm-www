---
title: Einführung
description: Stellt das Helm Go SDK vor
sidebar_position: 1
---
Das Go SDK von Helm ermöglicht es benutzerdefinierter Software, Helm Charts und die Funktionalität von Helm für die Verwaltung von Kubernetes-Software-Deployments zu nutzen.
(Die Helm CLI ist im Grunde selbst nur ein solches Werkzeug!)

Derzeit wurde das SDK funktional von der Helm CLI getrennt.
Das SDK kann (und wird) von eigenständigen Tools verwendet.
Das Helm-Projekt hat sich zur API-Stabilität für das SDK verpflichtet.
Als Hinweis: Das SDK hat noch einige Ecken und Kanten aus der anfänglichen Arbeit zur Trennung von CLI und SDK. Das Helm-Projekt beabsichtigt, diese im Laufe der Zeit zu verbessern.

Die vollständige API-Dokumentation finden Sie unter [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3).

Im Folgenden finden Sie einen kurzen Überblick über einige der wichtigsten Paketarten und ein einfaches Beispiel.
Weitere Beispiele und einen umfangreicheren 'Treiber' finden Sie im Abschnitt [Beispiele](/sdk/examples.mdx).

## Überblick über die wichtigsten Pakete

- [pkg/action](https://pkg.go.dev/helm.sh/helm/v3/pkg/action):
  Enthält den Haupt-"Client" zur Durchführung von Helm-Aktionen.
  Dies ist dasselbe Paket, das die CLI im Hintergrund verwendet.
  Wenn Sie nur grundlegende Helm-Befehle aus einem anderen Go-Programm ausführen möchten, ist dieses Paket genau das Richtige.
- [pkg/chart](https://pkg.go.dev/helm.sh/helm/v3/pkg/chart), [pkg/chartutil](https://pkg.go.dev/helm.sh/helm/v3/pkg/chartutil):
  Methoden und Hilfsfunktionen zum Laden und Bearbeiten von Charts
- [pkg/cli](https://pkg.go.dev/helm.sh/helm/v3/pkg/cli) und seine Unterpakete:
  Enthält alle Handler für die Standard-Helm-Umgebungsvariablen. Die Unterpakete enthalten die Verarbeitung von Ausgabe- und Values-Dateien.
- [pkg/release](https://pkg.go.dev/helm.sh/helm/v3/pkg/release):
  Definiert das `Release`-Objekt und Status

Es gibt noch viele weitere Pakete – weitere Informationen finden Sie in der Dokumentation.

### Einfaches Beispiel
Dies ist ein einfaches Beispiel für ein `helm list` mit dem Go SDK.
Weitere umfangreichere Beispiele finden Sie im Abschnitt [Beispiele](/sdk/examples.mdx).

```go
package main

import (
    "log"
    "os"

    "helm.sh/helm/v3/pkg/action"
    "helm.sh/helm/v3/pkg/cli"
)

func main() {
    settings := cli.New()

    actionConfig := new(action.Configuration)
    // You can pass an empty string instead of settings.Namespace() to list
    // all namespaces
    if err := actionConfig.Init(settings.RESTClientGetter(), settings.Namespace(), os.Getenv("HELM_DRIVER"), log.Printf); err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    client := action.NewList(actionConfig)
    // Only list deployed
    client.Deployed = true
    results, err := client.Run()
    if err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    for _, rel := range results {
        log.Printf("%+v", rel)
    }
}

```


## Kompatibilität

Das Helm SDK folgt ausdrücklich den Rückwärtskompatibilitätsgarantien von Helm:

<https://github.com/helm/community/blob/main/hips/hip-0004.md>

Das bedeutet, dass inkompatible Änderungen nur bei Hauptversionen vorgenommen werden.
