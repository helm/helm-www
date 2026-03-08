---
title: Objetos Integrados
description: Objetos integrados disponibles para las plantillas.
sidebar_position: 3
---

El motor de plantillas pasa los objetos a la plantilla. Su código también puede
pasar objetos (veremos ejemplos al usar las sentencias `with` y `range`).
Incluso hay algunas formas de crear nuevos objetos dentro de sus plantillas,
como con la función `tuple` que veremos más adelante.

Los objetos pueden ser simples y contener un único valor. O pueden contener
otros objetos o funciones. Por ejemplo, el objeto `Release` contiene varios
objetos (como `Release.Name`) y el objeto `Files` tiene algunas funciones.

En la sección anterior, usamos `{{ .Release.Name }}` para insertar el nombre de
un release en una plantilla. `Release` es uno de los objetos de nivel superior
a los que puede acceder en sus plantillas.

- `Release`: Este objeto describe el release en sí. Tiene varios objetos dentro:
  - `Release.Name`: El nombre del release
  - `Release.Namespace`: El namespace donde se desplegará (si el manifiesto no
    lo sobrescribe)
  - `Release.IsUpgrade`: Se establece en `true` si la operación actual es una
    actualización o rollback.
  - `Release.IsInstall`: Se establece en `true` si la operación actual es una
    instalación.
  - `Release.Revision`: El número de revisión para este release. En la
    instalación, es 1, y se incrementa con cada actualización y rollback.
  - `Release.Service`: El servicio que está renderizando la plantilla actual.
    En Helm, siempre es `Helm`.
- `Values`: Valores pasados a la plantilla desde el archivo `values.yaml` y
  desde archivos proporcionados por el usuario. Por defecto, `Values` está vacío.
- `Chart`: El contenido del archivo `Chart.yaml`. Cualquier dato en `Chart.yaml`
  será accesible aquí. Por ejemplo, `{{ .Chart.Name }}-{{ .Chart.Version }}`
  imprimirá `mychart-0.1.0`.
  - Los campos disponibles están listados en la [Guía de Charts](/topics/charts.md#the-chartyaml-file)
- `Subcharts`: Proporciona acceso al scope (.Values, .Charts, .Releases, etc.)
  de los subcharts desde el chart padre. Por ejemplo,
  `.Subcharts.mySubChart.myValue` para acceder a `myValue` en el chart
  `mySubChart`.
- `Files`: Proporciona acceso a todos los archivos no especiales en un chart.
  Aunque no puede usarlo para acceder a plantillas, puede usarlo para acceder a
  otros archivos en el chart. Consulte la sección
  [Acceso a Archivos](/chart_template_guide/accessing_files.md) para más
  información.
  - `Files.Get` es una función para obtener un archivo por nombre
    (`.Files.Get config.ini`)
  - `Files.GetBytes` es una función para obtener el contenido de un archivo
    como un array de bytes en lugar de una cadena. Esto es útil para cosas como
    imágenes.
  - `Files.Glob` es una función que devuelve una lista de archivos cuyos
    nombres coinciden con el patrón glob de shell dado.
  - `Files.Lines` es una función que lee un archivo línea por línea. Esto es
    útil para iterar sobre cada línea de un archivo.
  - `Files.AsSecrets` es una función que devuelve los contenidos de los
    archivos como cadenas codificadas en Base 64.
  - `Files.AsConfig` es una función que devuelve los contenidos de los archivos
    como un mapa YAML.
- `Capabilities`: Proporciona información sobre las capacidades que soporta el
  clúster de Kubernetes.
  - `Capabilities.APIVersions` es un conjunto de versiones.
  - `Capabilities.APIVersions.Has $version` indica si una versión (por ejemplo,
    `batch/v1`) o recurso (por ejemplo, `apps/v1/Deployment`) está disponible
    en el clúster.
  - `Capabilities.KubeVersion` y `Capabilities.KubeVersion.Version` es la
    versión de Kubernetes.
  - `Capabilities.KubeVersion.Major` es la versión mayor de Kubernetes.
  - `Capabilities.KubeVersion.Minor` es la versión menor de Kubernetes.
  - `Capabilities.HelmVersion` es el objeto que contiene los detalles de la
    versión de Helm, es la misma salida de `helm version`.
  - `Capabilities.HelmVersion.Version` es la versión actual de Helm en formato
    semver.
  - `Capabilities.HelmVersion.GitCommit` es el sha1 de git de Helm.
  - `Capabilities.HelmVersion.GitTreeState` es el estado del árbol git de Helm.
  - `Capabilities.HelmVersion.GoVersion` es la versión del compilador Go
    utilizado.
- `Template`: Contiene información sobre la plantilla actual que se está
  ejecutando
  - `Template.Name`: Una ruta de archivo con namespace a la plantilla actual
    (por ejemplo, `mychart/templates/mytemplate.yaml`)
  - `Template.BasePath`: La ruta con namespace al directorio de plantillas del
    chart actual (por ejemplo, `mychart/templates`).

Los valores integrados siempre comienzan con una letra mayúscula. Esto sigue la
convención de nomenclatura de Go. Cuando cree sus propios nombres, puede usar la
convención que prefiera su equipo. Algunos equipos, como muchos cuyos charts
puede ver en [Artifact Hub](https://artifacthub.io/packages/search?kind=0),
eligen usar solo letras minúsculas iniciales para distinguir los nombres locales
de los integrados. En esta guía, seguimos esa convención.
