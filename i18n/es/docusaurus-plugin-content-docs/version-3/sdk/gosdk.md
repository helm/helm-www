---
title: Introducción
description: Presenta el SDK de Go para Helm
sidebar_position: 1
---
El SDK de Go de Helm permite que software personalizado aproveche los charts de Helm y la funcionalidad de Helm para gestionar el despliegue de software en Kubernetes.
¡De hecho, la CLI de Helm es efectivamente una herramienta de este tipo!

Actualmente, el SDK ha sido funcionalmente separado de la CLI de Helm.
Y el SDK puede ser (y es) utilizado por herramientas independientes.
El proyecto Helm se ha comprometido con la estabilidad de la API del SDK.
Como advertencia, el SDK aún tiene algunas asperezas pendientes del trabajo inicial para separar la CLI y el SDK, que el proyecto Helm tiene como objetivo mejorar con el tiempo.

La documentación completa de la API se puede encontrar en [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3).

A continuación se presenta una breve descripción de algunos de los principales tipos de paquetes y un ejemplo sencillo.
Consulte la sección de [Ejemplos](/sdk/examples.mdx) para más ejemplos y un 'driver' (controlador) más completo.

## Descripción general de los paquetes principales

- [pkg/action](https://pkg.go.dev/helm.sh/helm/v3/pkg/action):
  Contiene el "cliente" principal para realizar acciones de Helm.
  Este es el mismo paquete que la CLI utiliza internamente.
  Si solo necesita ejecutar comandos básicos de Helm desde otro programa Go, este es el paquete indicado
- [pkg/chart](https://pkg.go.dev/helm.sh/helm/v3/pkg/chart), [pkg/chartutil](https://pkg.go.dev/helm.sh/helm/v3/pkg/chartutil):
  Métodos y helpers utilizados para cargar y manipular charts
- [pkg/cli](https://pkg.go.dev/helm.sh/helm/v3/pkg/cli) y sus subpaquetes:
  Contiene todos los handlers para las variables de entorno estándar de Helm y sus subpaquetes contienen el manejo de salida y archivos de valores
- [pkg/release](https://pkg.go.dev/helm.sh/helm/v3/pkg/release):
  Define el objeto `Release` y sus estados

¡Hay muchos más paquetes además de estos, así que consulte la documentación para más información!

### Ejemplo sencillo
Este es un ejemplo sencillo de cómo hacer un `helm list` usando el SDK de Go.
Consulte la sección de [Ejemplos](/sdk/examples.mdx) para ejemplos más completos.

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


## Compatibilidad

El SDK de Helm sigue explícitamente las garantías de compatibilidad hacia atrás de Helm:

<https://github.com/helm/community/blob/main/hips/hip-0004.md>

Es decir, los cambios que rompen la compatibilidad solo se realizarán en versiones mayores.
