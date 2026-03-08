---
title: Introduction
description: Présente le SDK Go de Helm
sidebar_position: 1
---
Le SDK Go de Helm permet aux logiciels personnalisés d'exploiter les charts Helm et les fonctionnalités de Helm pour gérer le déploiement de logiciels sur Kubernetes.
(En fait, la CLI Helm n'est qu'un exemple d'un tel outil !)

Actuellement, le SDK a été séparé fonctionnellement de la CLI Helm.
Le SDK peut être (et est) utilisé par des outils autonomes.
Le projet Helm s'est engagé à assurer la stabilité de l'API du SDK.
Attention : le SDK présente encore quelques imperfections héritées du travail initial de séparation entre la CLI et le SDK. Le projet Helm s'efforce de les améliorer progressivement.

La documentation complète de l'API est disponible sur [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3).

Un bref aperçu des principaux types de packages ainsi qu'un exemple simple sont présentés ci-dessous.
Consultez la section [Exemples](/sdk/examples.mdx) pour plus d'exemples et un exemple plus complet.

## Aperçu des packages principaux

- [pkg/action](https://pkg.go.dev/helm.sh/helm/v3/pkg/action) :
  Contient le "client" principal pour exécuter les actions Helm.
  C'est le même package que la CLI utilise en interne.
  Si vous avez simplement besoin d'exécuter des commandes Helm de base depuis un autre programme Go, c'est le package qu'il vous faut.
- [pkg/chart](https://pkg.go.dev/helm.sh/helm/v3/pkg/chart), [pkg/chartutil](https://pkg.go.dev/helm.sh/helm/v3/pkg/chartutil) :
  Méthodes et utilitaires pour charger et manipuler les charts.
- [pkg/cli](https://pkg.go.dev/helm.sh/helm/v3/pkg/cli) et ses sous-packages :
  Contient tous les handlers pour les variables d'environnement Helm standard. Ses sous-packages gèrent la sortie et le traitement des fichiers values.
- [pkg/release](https://pkg.go.dev/helm.sh/helm/v3/pkg/release) :
  Définit l'objet `Release` et ses statuts.

Il existe de nombreux autres packages. Consultez la documentation pour plus d'informations !

### Exemple simple
Voici un exemple simple d'exécution d'un `helm list` avec le SDK Go.
Consultez la section [Exemples](/sdk/examples.mdx) pour des exemples plus complets.

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


## Compatibilité

Le SDK Helm suit explicitement les garanties de rétrocompatibilité de Helm :

<https://github.com/helm/community/blob/main/hips/hip-0004.md>

Les ruptures de compatibilité ne sont introduites qu'entre versions majeures.
