---
title: "Técnicas avanzadas de Helm"
description: "Explica varias características avanzadas para usuarios de Helm"
aliases: ["/docs/advanced_helm_techniques"]
weight: 9
---

Esta sección explica varias características avanzadas y técnicas para usar Helm.
La información de esta sección está pensada para "usuarios avanzados" de Helm que quieren personalización avanzada y manipulación de sus Charts y releases. Cada una de estas funciones avanzadas tiene sus propias desventajas y advertencias, por lo que cada una debe usarse con cuidado y con un profundo conocimiento de Helm. O en otras palabras, recuerde el [principio de Peter Parker](https://en.wikipedia.org/wiki/With_great_power_comes_great_responsibility)

## Post renderizado
El post renderizado da a los instaladores de charts la capacidad de manipular manualmente, configurar y/o validar manifiestos renderizados antes de que sean instalados por Helm. Esto permite a los usuarios con necesidades de configuración avanzada poder usar herramientas como [`kustomize`](https://kustomize.io) para aplicar cambios de configuración sin necesidad de un fork a un chart público o requerir que los mantenedores de charts especifiquen hasta la última opción de configuración para una pieza de software. También hay casos de uso para inyectar herramientas comunes y side cars en entornos empresariales o análisis de los manifiestos antes del despliegue.

### Prerrequisitos
- Helm 3.1+

### Uso
Un post-renderizador puede ser cualquier ejecutable que acepte manifiestos Kubernetes renderizados en STDIN y devuelva manifiestos Kubernetes válidos en STDOUT. Debe devolver un código de salida distinto de 0 en caso de fallo. Esta es la única "API" entre los dos componentes. Permite una gran flexibilidad en lo que puede hacer con su proceso de post renderizado.

Un post renderizador puede ser usado con `install`, `upgrade`, y `template`. Para utilizar un post renderizador, utilice la flag `--post-renderer` con una ruta al ejecutable del renderizador que desea utilizar:

```shell
$ helm install mychart stable/wordpress --post-renderer ./path/to/executable
```

Si la ruta no contiene ningún separador, buscará en $PATH, de lo contrario resolverá cualquier ruta relativa a una ruta absoluta.

Si desea utilizar varios post-renderizadores, llámelos a todos desde un script o juntos en cualquier herramienta en binario. En bash, sería tan simple como `renderer1 | renderer2 | renderer3`.

[Aquí](https://github.com/thomastaylor312/advanced-helm-demos/tree/master/post-render) tienes un ejemplo de uso de `kustomize` como post renderer.

### Advertencias
Cuando se usan post renderers, hay varias cosas importantes a tener en cuenta. La más importante de ellas es que cuando se utiliza un post renderizador, todas las personas que modifican esa release **DEBEN** utilizar el mismo renderizador con el fin de tener construcciones repetibles. Esta característica está construida a propósito para permitir a cualquier usuario cambiar el renderizador utilizado o dejar de usarlo, pero esto debe hacerse deliberadamente para evitar la modificación accidental o pérdida de datos.

Otra nota importante se refiere a la seguridad. Si estás utilizando un post-renderizador, debe asegurarse de que proviene de una fuente fiable. El uso de renderizadores no fiables o no verificados NO es recomendable, ya que tienen acceso completo a las plantillas renderizadas, que a menudo contienen secretos.

### Renderizadores personalizados de entradas
El paso de post renderizado ofrece aún más flexibilidad cuando se utiliza en el Go SDK. Cualquier post renderizador sólo necesita implementar la siguiente interfaz Go:

```go
type PostRenderer interface {
    // Run expects a single buffer filled with Helm rendered manifests. It
    // expects the modified results to be returned on a separate buffer or an
    // error if there was an issue or failure while running the post render step
    Run(renderedManifests *bytes.Buffer) (modifiedManifests *bytes.Buffer, err error)
}
```

Para más información sobre el uso del Go SDK, puede seguir en la siguiente [sección Go SDK](#go-sdk)

## Go SDK
Helm 3 debutó con un Go SDK completamente reestructurado para una mejor experiencia cuando se construye software y herramientas que aprovechan Helm. La documentación completa se puede encontrar en [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3), pero a continuación tienes una breve descripción de algunos de los paquetes más comunes y un ejemplo sencillo.

### Resumen de paquetes
Esta es una lista de los paquetes más utilizados con una explicación sencilla sobre cada uno de ellos:

- `pkg/action`: Contiene el "cliente" principal para realizar acciones de Helm. Este es el mismo paquete que usa el CLI. Si sólo necesitas ejecutar comandos básicos de Helm desde otro programa Go, este paquete es para ti.
- `pkg/{chart,chartutil}`:  Métodos y ayudantes usados para cargar y manipular charts.
- `pkg/cli` y sus subpaquetes: Contiene todos los manejadores para las variables de entorno estándar de Helm y sus subpaquetes contienen el manejo de ficheros de salida y valores.
- `pkg/release`: Define el objeto `Release` y sus estados.

Obviamente hay muchos más paquetes además de estos, ¡así que revise la documentación para más información!

### Ejemplo simple
Este es un ejemplo simple para hacer un `helm list` usando el Go SDK:

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

## Backends de almacenamiento
Helm 3 cambió el almacenamiento por defecto de la información de la release a Secrets en el namespace de la release. Helm 2 por defecto almacena la información de la release como ConfigMaps en el namespace de la instancia de Tiller. Las subsecciones siguientes muestran cómo configurar diferentes backends. Esta configuración se basa en la variable de entorno `HELM_DRIVER`. Se puede establecer a uno de los valores:
`[configmap, secret, sql]`.

### Backend de almacenamiento ConfigMap
Para habilitar el backend ConfigMap, necesitarás establecer la variable de entorno `HELM_DRIVER` a `configmap`.

Puedes establecerla en un shell de la siguiente manera:

```shell
export HELM_DRIVER=configmap
```

Si quieres cambiar del backend por defecto al backend ConfigMap, tendrás que hacer la migración por tu cuenta. Puedes recuperar la información de la release con el siguiente comando:

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```

**NOTAS DE PRODUCCIÓN**: La información de lanzamiento incluye el contenido de charts y archivos de valores y, por lo tanto, podría contener datos confidenciales (como contraseñas, claves privadas y otras credenciales) que deben protegerse del acceso no autorizado. Al gestionar la autorización de Kubernetes, por ejemplo con [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/), es posible conceder un acceso más amplio a los recursos ConfigMap, al tiempo que se restringe el acceso a los recursos Secret. Por ejemplo, el rol predeterminado [user-facing
role](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles)
"view" otorga acceso a la mayoría de los recursos, pero no a los Secrets. Además, los secretos pueden configurarse para [almacenamiento cifrado](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/). Por favor, tenlo en cuenta si decides cambiar al backend ConfigMap, ya que podría exponer los datos sensibles de tu aplicación.

### backend de almacenamiento SQL
Existe un backend de almacenamiento SQL ***beta*** que almacena la información de liberación en una base de datos SQL.

El uso de este tipo de almacenamiento es especialmente útil si la información de publicación pesa más de 1 MB (en cuyo caso, no puede almacenarse en ConfigMaps/Secrets debido a los límites internos del almacenamiento de valores clave etcd subyacente de Kubernetes).

Para habilitar el backend SQL, tendrás que desplegar una base de datos SQL y establecer la variable de entorno `HELM_DRIVER` en `sql`. Los detalles de la base de datos se establecen con la variable de entorno `HELM_DRIVER_SQL_CONNECTION_STRING`.

Puedes configurarlo en un shell de la siguiente manera:

```shell
export HELM_DRIVER=sql
export HELM_DRIVER_SQL_CONNECTION_STRING=postgresql://helm-postgres:5432/helm?user=helm&password=changeme
```

> Nota: En este momento sólo soporta PostgreSQL.

**NOTAS DE PRODUCCIÓN**: Se recomienda:
- Preparar la base de datos para la producción. Para PostgreSQL, consulta la documentación [Administración del servidor](https://www.postgresql.org/docs/12/admin.html) para más detalles
- Habilitar [gestión de permisos](/docs/permissions_sql_storage_backend/) para reflejar Kubernetes RBAC y obtener información sobre la versión

Si desea cambiar del backend por defecto al backend SQL, tendrá que hacer la migración por su cuenta. Puede recuperar la información de lanzamiento con el siguiente comando:

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```
