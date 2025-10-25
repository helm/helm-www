---
title: "Charts"
description: "Explica el formato del chart y proporciona una guía básica para crear charts con Helm."
sidebar_position: 1
---

Helm usa un formato de empaquetado llamado _charts_. Un chart es una colección
de archivos que describen un conjunto relacionado de recursos de Kubernetes. Se
puede usar un solo chart para implementar algo simple, como un pod de Memcached,
o algo complejo, como una pila de aplicaciones web completa con servidores HTTP,
bases de datos, cachés, etc.

Los charts se crean como archivos dispuestos en un árbol de directorios en
particular. Se pueden empaquetar en archivos versionados para ser desplegados.

Si desea descargar y ver los archivos de un chart publicado, sin instalarlo,
puede hacerlo con `helm pull chartrepo/chartname`.

Este documento explica el formato del chart y proporciona una guía básica para
crear charts con Helm.

## La Estructura de Archivos del Chart

Un chart se organiza como una colección de archivos dentro de un directorio. El
nombre del directorio es el nombre del chart (sin información de versiones). Por
lo tanto, un chart que describa WordPress se almacenaría en un directorio `wordpress/`.

Dentro de este directorio, Helm esperará una estructura que coincida con esto:

```text
wordpress/
  Chart.yaml          # Un archivo YAML que contiene información sobre el chart.
  LICENSE             # OPCIONAL: Un archivo de texto sin formato que contiene la licencia del chart.
  README.md           # OPCIONAL: Un archivo README legible por humanos
  values.yaml         # Los valores de configuración predeterminados para este chart
  values.schema.json  # OPCIONAL: Un esquema JSON para imponer una estructura en el archivo values.yaml
  charts/             # Un directorio que contiene los charts de los que depende este chart.
  crds/               # Custom Resource Definitions
  templates/          # Un directorio de plantillas que, cuando se combinan con valores, 
                      # generarán archivos de manifiesto de Kubernetes válidos.
  templates/NOTES.txt # OPCIONAL: Un archivo de texto sin formato que contiene breves notas de uso.
```

Helm se reserva el uso de los directorios `charts/`, `crds/` y `templates/`, y
de los nombres de archivo listados. Los demás archivos se dejarán como están.

## El Archivo Chart.yaml {#the-chartyaml-file}

El archivo `Chart.yaml` es requerido para un chart. Contiene los siguientes campos:

```yaml
apiVersion: La versión de la API de chart (requerido)
name: El nombre del chart (requerido)
version: An versión SemVer 2 (requerido)
kubeVersion: Un rango SemVer de versiones compatibles de Kubernetes (opcional)
description: Una descripción de una sola frase de este proyecto (opcional)
type: El tipo de chart (opcional)
keywords:
  - Una lista de palabras clave sobre este proyecto (opcional)
home: La URL de la página de inicio de este proyecto (opcional)
sources:
  - Una lista de URL al código fuente de este proyecto (opcional)
dependencies: # Una lista de los requisitos del chart. (opcional)
  - name: El nombre del chart (nginx)
    version: La versión del chart ("1.2.3")
    repository: (opcional) La URL del repositorio ("https://example.com/charts") o el alias ("@repo-name")
    condition: (opcional) Una ruta yaml que se resuelve en un booleano, que se usa para habilitar/deshabilitar charts (e.g. subchart1.enabled)
    tags: # (opcional)
      - Las etiquetas se pueden usar para agrupar charts para habilitar/deshabilitar en for conjunta
    import-values: # (opcional)
      - ImportValues contiene la asignación de valores de origen a la clave principal que se va a importar. Cada elemento puede ser una cadena o un par de elementos hijo/padre de la sublista.
    alias: (opcional) Alias que se utilizará para el chart. Útil cuando tiene que agregar el mismo chart varias veces
maintainers: # (opcional)
  - name: El nombre de los mantenedores (requerido para cada mantenedor)
    email: El correo electrónico de los mantenedores (opcional para cada mantenedor)
    url: Una URL para el mantenedor (opcional para cada mantenedor)
icon: Una URL a una imagen SVG o PNG que se utilizará como icono (opcional).
appVersion: La versión de la aplicación que contiene. (opcional). No es necesario que sea SemVer. Se recomienda encerrar en comillas.
deprecated: Si este chart está obsoleto (optional, boolean)
annotations:
  example: Una lista de anotaciones codificadas por nombre (opcional).
```

Otros campos se ignorarán silenciosamente.

### Charts y Versionado

Cada chart debe tener un número de versión. Una versión debe seguir el estándar
[SemVer 2](https://semver.org/spec/v2.0.0.html). A diferencia de Helm Classic,
Helm v2 y versiones posteriores utilizan números de versión como marcadores de
versión. Los paquetes en repositorios son identificado por el nombre más la versión.

Por ejemplo, un chart `nginx` cuyo campo de versión se establece en
`versión: 1.2.3` se denominará:

```text
nginx-1.2.3.tgz
```

También se admiten nombres SemVer 2 más complejos, como `versión: 1.2.3-alpha.1+ef365`.
Pero el sistema rechaza explícitamente los nombres que no son SemVer.

**NOTA:** Mientras que Helm Classic y Deployment Manager estaban muy orientados
a GitHub cuando se trataba de charts, Helm v2 y versiones posteriores no dependen
ni requieren GitHub o incluso Git. En consecuencia, no utiliza Git SHA para el
control de versiones.

El campo `version` dentro de `Chart.yaml` es utilizado por muchas de las
herramientas de Helm, incluida el CLI. Al generar un paquete, el comando
`helm package` usará la versión que encuentre en el archivo `Chart.yaml`
como un token en el nombre del paquete. El sistema asume que el número de versión
en el nombre del paquete del chart coincide con el número de versión en
`Chart.yaml`. El incumplimiento de esta suposición provocará un error.

### El Campo `apiVersion`

El campo `apiVersion` debe ser `v2` para los charts de Helm que requieren al menos
Helm 3. Los charts que admiten versiones anteriores de Helm tienen el campo `apiVersion`
establecido en `v1` y aún se pueden instalar en Helm 3.

Cambios de `v1` a `v2`:

- Un campo `dependencies` que define las dependencias del chart, que se encontraba
  en el archivo `requirements.yaml` para los charts `v1` (consulte [Dependencias
  del chart](#dependencias-del-chart)).
- El campo `type`, discriminando charts de aplicaciones y bibliotecas (consulte
  [Tipos de Charts](#tipos-de-chart)).

### El Campo `appVersion`

Tenga en cuenta que el campo `appVersion` no está relacionado con el campo `version`.
Es una forma de especificar la versión de la aplicación. Por ejemplo, el chart
`drupal` puede tener una `appVersion: "8.2.1"`, lo que indica que la versión de
Drupal incluida en el chart (por defecto) es `8.2.1`. Este campo es informativo
y no tiene ningún impacto en los cálculos de la versión del chart. Se recomienda
encarecidamente envolver la versión entre comillas. Esto obliga al analizador YAML
a tratar el número de versión como una cadena. Dejarlo sin comillas puede provocar
problemas de análisis en algunos casos. Por ejemplo, YAML interpreta `1.0` como un
valor de punto flotante y un SHA de confirmación de git como `1234e10` como
notación científica.

A partir de Helm v3.5.0, `helm create` envuelve el campo predeterminado
`appVersion` entre comillas.

### El Campo `kubeVersion`

El campo opcional `kubeVersion` puede definir restricciones de SemVer en las
versiones compatibles de Kubernetes. Helm validará las restricciones de versión
al instalar el chart y fallará si el clúster ejecuta una versión de Kubernetes
no compatible.

Las restricciones de versión pueden comprender comparaciones AND separadas por
espacios, como

```text
>= 1.13.0 < 1.15.0
```

que pueden combinarse con el operador OR `||` como en el siguiente ejemplo

```text
>= 1.13.0 < 1.14.0 || >= 1.14.1 < 1.15.0
```

En este ejemplo, se excluye la versión `1.14.0`, lo que puede tener sentido si
se sabe que un error en ciertas versiones impide que el chart se ejecute correctamente.

Aparte de las restricciones de versión que emplean operadores `=` `! =` `>` `<`
`> =` `<=`, se admiten las siguientes notaciones abreviadas

 * rangos de guiones para intervalos cerrados, donde `1.1 - 2.3.4` es equivalente
  a `>= 1.1 <= 2.3.4`.
 * comodines `x`, `X` y `*`, donde `1.2.x` es equivalente a `> = 1.2.0 <1.3.0`.
 * rangos de tilde (se permiten cambios en la versión del parche), donde `~1.2.3`
   es equivalente a `>= 1.2.3 < 1.3.0`.
 * intervalos de intercalación (se permiten cambios menores en la versión), donde
   `^1.2.3` es equivalente a `>= 1.2.3 < 2.0.0`.

Para obtener una explicación detallada de las restricciones semver admitidas, consulte
[Masterminds/semver](https://github.com/Masterminds/semver).

### Deprecando Charts

Al administrar charts en un repositorio de charts, a veces es necesario deprecar
un chart. El campo opcional `deprecated` en `Chart.yaml` se puede utilizar para
marcar un chart como deprecado. Si la **última** versión de un chart en el
repositorio está marcada como deprecado, entonces el chart en su conjunto se
considera deprecado. El nombre del chart se puede reutilizar más tarde publicando
una versión más reciente que no esté marcada como deprecado. El flujo de trabajo
para charts obsoletos es:

1. Actualizar el archivo `Chart.yaml` del chart para marcar el chart como deprecado,
   subiendo la versión
2. Publicar la nueva versión del chart en el repositorio de charts.
3. Eliminar el chart del repositorio de origen (p. Ej., git)

### Tipos de Chart

El campo `type` define el tipo de chart. Hay dos tipos: `application` (aplicación)
y `library` (biblioteca). Aplicación es el tipo predeterminado y es el chart estándar
con el que se puede operar completamente. El [chart de biblioteca](/topics/library_charts.md)
proporciona utilidades o funciones para el generador de charts. Un chart de biblioteca
se diferencia de un chart de aplicación porque no se puede instalar y, por lo
general, no contiene ningún objeto de recurso.

**Nota:** Se puede utilizar un chart de aplicación como chart de biblioteca. Esto
se habilita estableciendo el tipo en `library`. Luego, el chart se renderizará
como un chart de biblioteca en el que se pueden aprovechar todas las utilidades
y funciones. Todos los objetos de recursos del chart no se renderizarán.

## Archivos LICENSE, README y NOTES del Chart

Los Charts también pueden contener archivos que describen la instalación,
configuración, uso y licencia de un chart.

Un archivo LICENSE es un archivo de texto sin formato que contiene la
[licencia](https://en.wikipedia.org/wiki/Software_license) para el chart. El
chart puede contener una licencia, ya que puede tener lógica de programación en
las plantillas y, por lo tanto, no sería solo configuración. También puede haber
licencias separadas para la aplicación instalada por el chart, si es necesario.

Un archivo README para un chart debe tener el formato Markdown (README.md) y
generalmente debe contener:

- Una descripción de la aplicación o servicio que proporciona el chart.
- Cualquier requisito previo o requisito para ejecutar el chart.
- Descripciones de opciones en `values.yaml` y valores predeterminados
- Cualquier otra información que pueda ser relevante para la instalación o
   configuración del chart

Cuando los concentradores y otras interfaces de usuario muestran detalles sobre
un chart, ese detalle se extrae del contenido del archivo `README.md`.

El chart también puede contener un archivo corto de texto sin formato `templates/NOTES.txt`
que se imprimirá después de la instalación y al ver el estado de un release. Este
archivo se evalúa como una [plantilla](#plantillas-y-valores) y se puede utilizar
para mostrar notas de uso, próximos pasos o cualquier otra información relevante
para una publicación del chart. Por ejemplo, se pueden proporcionar instrucciones
para conectarse a una base de datos o acceder a una interfaz de usuario web. Dado
que este archivo se imprime en STDOUT cuando se ejecuta `helm install` o `helm status`,
se recomienda mantener breve el contenido y señalar el archivo README para obtener
más detalles.

## Dependencias del Chart

En Helm, un chart puede depender de cualquier número de otros charts. Estas
dependencias se pueden vincular dinámicamente usando el campo `dependencies` en
`Chart.yaml` o se pueden traer al directorio `charts/` y administrar manualmente.

### Administrar Dependencias con el Campo `dependencies`

Los chart requeridos por el chart actual se definen como una lista en el campo
`dependencias`.

```yaml
dependencies:
  - name: apache
    version: 1.2.3
    repository: https://example.com/charts
  - name: mysql
    version: 3.2.1
    repository: https://another.example.com/charts
```

- El campo `name` es el nombre del chart que desea.
- El campo `version` es la versión del chart que desea.
- El campo `repository` es la URL completa del repositorio de charts. Tenga en
  cuenta que usted también debe usar `helm repo add` para agregar ese repositorio
  localmente.
- Puede usar el nombre del repositorio en lugar de la URL

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
```

```yaml
dependencies:
  - name: awesomeness
    version: 1.0.0
    repository: "@fantastic-charts"
```

Una vez que haya definido las dependencias, puede ejecutar `helm dependency update`
y usará su archivo de dependencia para descargar todos los chart especificados
en su directorio `charts/` por usted.

```console
$ helm dep up foochart
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "local" chart repository
...Successfully got an update from the "stable" chart repository
...Successfully got an update from the "example" chart repository
...Successfully got an update from the "another" chart repository
Update Complete. Happy Helming!
Saving 2 charts
Downloading apache from repo https://example.com/charts
Downloading mysql from repo https://another.example.com/charts
```

Cuando `helm dependency update` recupera charts, los almacenará como archivos
de chart en el directorio `charts/`. Entonces, para el ejemplo anterior, uno
esperaría ver los siguientes archivos en el directorio de charts:

```text
charts/
  apache-1.2.3.tgz
  mysql-3.2.1.tgz
```

#### El Campo Alias en dependencies

Además de los otros campos anteriores, cada entrada de requisitos puede contener
el campo opcional `alias`.

Agregar un alias para un chart de dependencia colocaría un chart en dependencias
usando alias como nombre de la nueva dependencia.

Se puede usar un `alias` en los casos en que necesiten acceder a un chart con otro
nombre(s).

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-1
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-2
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
```

En el ejemplo anterior obtendremos 3 dependencias en total para `parentchart`:

```text
subchart
new-subchart-1
new-subchart-2
```

La forma manual de lograr esto es copiando y pegando el mismo chart en el directorio
`charts/` varias veces con diferentes nombres.

#### Campos de Tags and Condition en dependencies

Además de los otros campos anteriores, cada entrada de requisitos puede contener
los campos opcionales `tags` y `condition`.

Todos los charts se cargan de forma predeterminada. Si los campos `tags` o `condition`
están presentes, se evaluarán y usarán para controlar la carga de los charts a
los que se aplican.

Condition: el campo condition contiene una o más rutas YAML (delimitadas por
comas). Si esta ruta existe en los valores del padre superior y se resuelve en
un valor booleano, el chart se habilitará o deshabilitará en función de ese
valor booleano. Solo se evalúa la primera ruta válida que se encuentra en la
lista y, si no existen rutas, la condición no tiene ningún efecto.

Tags: el campo tag es una lista YAML de etiquetas para asociar con este chart. En
los valores padres superiores, todos los charts con etiquetas se pueden habilitar
o deshabilitar especificando la etiqueta y un valor booleano.

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart1.enabled, global.subchart1.enabled
    tags:
      - front-end
      - subchart1
  - name: subchart2
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart2.enabled,global.subchart2.enabled
    tags:
      - back-end
      - subchart2
```

```yaml
# parentchart/values.yaml

subchart1:
  enabled: true
tags:
  front-end: false
  back-end: true
```

En el ejemplo anterior, todos los chart con la etiqueta `front-end` estarían deshabilitados,
pero dado que la ruta `subchart1.enabled` se evalúa como 'true' en los valores del
padre, la condición anulará la etiqueta `front-end` y `subchart1` estará habilitado.

Dado que `subchart2` está etiquetado con `back-end` y esa etiqueta se evalúa como
`true`, se habilitará `subchart2`. También tenga en cuenta que aunque `subchart2`
tiene una condición especificada, no hay una ruta y un valor correspondientes en
los valores de los padres, por lo que la condición no tiene ningún efecto.

##### Utilizar el CLI con Etiquetas y Condiciones

El parámetro `--set` se puede utilizar como de costumbre para alterar los valores
de tags (etiquetas) y conditions (condiciones).

```console
helm install --set tags.front-end=true --set subchart2.enabled=false
```

##### Resolución de Etiquetas y Condiciones

- **Las condiciones (cuando se establecen en values) siempre sobreescriben a
  las etiquetas.** La primera ruta de condición que existe gana y las siguientes
  para ese chart se ignoran.
- Las etiquetas se evalúan como 'si alguna de las etiquetas del chart es
  verdadera, habilite el chart'.
- Los valores de etiquetas y condiciones deben establecerse en los values
  del chart padre superior.
- The `tags:` key in values must be a top level key. Globals and nested `tags:`
  tables are not currently supported.
- La clave `tags:` en values debe ser una clave de nivel superior. Los `tags:`
  globales y anidados no son soportados actualmente.

#### Importar values hijos via dependencias

En algunos casos, es deseable permitir que los valores de un chart secundario
se propaguen al chart principal y se compartan como valores predeterminados
comunes. Un beneficio adicional de usar el formato de `exports` es que permitirá
que las herramientas futuras introspecten los valores configurables por el usuario.

Las claves que contienen los valores que se van a importar se pueden especificar
en la sección `dependencies` del chart principal en el campo `import-values`
mediante una lista YAML. Cada elemento de la lista es una clave que se importa
del campo `exports` del chart secundario.

Para importar valores que no están contenidos en la clave `exports`, use el
formato [hijo-padre](#usando-el-formato-padre-hijo). A continuación se describen
ejemplos de ambos formatos.

##### Usando el formato de exportación

If a child chart's `values.yaml` file contains an `exports` field at the root,
its contents may be imported directly into the parent's values by specifying the
keys to import as in the example below:

Si el archivo `values.yaml` de un chart secundario contiene un campo de `exports`
en la raíz, su contenido se puede importar directamente a los values del padre
especificando las claves para importar como en el siguiente ejemplo:

```yaml
# archivo Chart.yaml del padre

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    import-values:
      - data
```

```yaml
# archivo value.yaml del hijo

exports:
  data:
    myint: 99
```

Dado que estamos especificando la clave `data` en nuestra lista de importación,
Helm busca en el campo `exports` del chart secundario la clave `data` e importa
su contenido.

El values final del padres contendrían nuestro campo exportado:

```yaml
# values del padre

myint: 99
```

Tenga en cuenta que la clave principal `data` no está contenida en el values
final del padre. Si necesita especificar la clave principal, utilice el formato 'hijo-padre'.

##### Usando el formato padre-hijo

Para acceder a los valores que no están contenidos en la clave `exports` del values
del chart hijo, deberá especificar la clave de origen del values que se
importarán (`child`) y la ruta de destino en el values del chart padre (`parent`).

The `import-values` in the example below instructs Helm to take any values found
at `child:` path and copy them to the parent's values at the path specified in
`parent:`

Los `import-values` en el siguiente ejemplo le indican a Helm que tome los valores
encontrados en la ruta `child:` y los copie a los valores del padre en la ruta
especificada en `parent:`

```yaml
# archivo Chart.yaml del padre

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    ...
    import-values:
      - child: default.data
        parent: myimports
```

En el ejemplo anterior, los valores que se encuentran en `default.data` en los
valores del subchart1 se importarán a la clave `myimports` en los values del chart
padre como se detalla a continuación:

```yaml
# archivo values.yaml del padre

myimports:
  myint: 0
  mybool: false
  mystring: "helm rocks!"
```

```yaml
# archivo values.yaml subchart1

default:
  data:
    myint: 999
    mybool: true
```

El values del chart padre resultantes sería:

```yaml
# vales final del padre

myimports:
  myint: 999
  mybool: true
  mystring: "helm rocks!"
```

El values final del padre ahora contienen los campos `myint` y `mybool`
importados de subchart1.

### Administrar Dependencias manualmente a través del directorio `charts/`

Si se desea más control sobre las dependencias, estas dependencias se pueden
expresar explícitamente copiando los charts de dependencias en el directorio
`charts/`.

Una dependencia puede ser un archivo de chart (`foo-1.2.3.tgz`) o un directorio
de chart descomprimido. Pero su nombre no puede comenzar con `_` o `.`. El cargador
de chart ignora estos archivos.

Por ejemplo, si el chart de WordPress depende del chart de Apache, el chart de Apache
(de la versión correcta) se proporciona en el directorio `charts/` del chart de WordPress:

```yaml
wordpress:
  Chart.yaml
  # ...
  charts/
    apache/
      Chart.yaml
      # ...
    mysql/
      Chart.yaml
      # ...
```

El ejemplo anterior muestra cómo el chart de WordPress expresa su dependencia
de Apache y MySQL al incluir esos charts dentro de su directorio `charts /`.

**CONSEJO:** _Para colocar una dependencia en su directorio `charts/`, use el
comando `helm pull`_

### Aspectos operativos del uso de dependencias

Las secciones anteriores explican cómo especificar las dependencias del chart,
pero ¿cómo afecta esto a la instalación del chart usando `helm install` y
`helm upgrade`?

Supongamos que un chart llamado "A" crea los siguientes objetos de Kubernetes

- namespace "A-Namespace"
- statefulset "A-StatefulSet"
- service "A-Service"

Además, A depende del chart B que crea los objetos

- namespace "B-Namespace"
- replicaset "B-ReplicaSet"
- service "B-Service"

Después de la instalación/actualización del chart A, se crea/modifica un único
release de Helm. El release creará/actualizará todos los objetos de Kubernetes
anteriores en el siguiente orden:

- A-Namespace
- B-Namespace
- A-Service
- B-Service
- B-ReplicaSet
- A-StatefulSet

Esto se debe a que cuando Helm instala/actualiza charts, los objetos de Kubernetes
de los charts y todas sus dependencias son

- agregado en un solo conjunto; luego
- ordenados por tipo seguido de nombre; y entonces
- creado/actualizado en ese orden.

Por lo tanto, se crea un único release con todos los objetos del charts y sus dependencias.

El orden de instalación de los tipos de Kubernetes viene dado por la enumeración
InstallOrder en kind_sorter.go (ver [el archivo fuente de Helm](https://github.com/helm/helm/blob/484d43913f97292648c867b56768775a55e4bba6/pkg/releaseutil/kind_sorter.go)).

## Plantillas y Valores

Las plantillas de Charts de Helm están escritas en el [lenguaje Go
template](https://golang.org/pkg/text/template/), con la adición de unas 50
funciones de plantilla complementarias [de la biblioteca Sprig](https://github.com/Masterminds/sprig)
y algunas otras [funciones especializadas](/howto/charts_tips_and_tricks.md).

Todos los archivos de plantilla se almacenan en la carpeta `templates/` de un chart.
Cuando Helm renderiza los charts, pasará todos los archivos de ese directorio a
través del motor de plantillas.

Los valores de las plantillas se proporcionan de dos formas:

- Los desarrolladores de charts pueden proporcionar un archivo llamado `values.yaml`
  dentro de un chart. Este archivo puede contener valores predeterminados.
- Los usuarios de charts pueden proporcionar un archivo YAML que contenga valores.
  Esto se puede proporcionar en la línea de comandos con `helm install`.

Cuando un usuario proporciona valores personalizados, estos valores sobreescribirán
los valores del archivo `values.yaml` del chart.

### Archivos de Plantillas

Los archivos de plantilla siguen las convenciones estándar para escribir plantillas
de Go (consulte [la documentación del paquete de text/template de Go](https://golang.org/pkg/text/template/)
para obtener más detalles). Un archivo de plantilla de ejemplo podría verse así:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

El ejemplo anterior, basado ligeramente en
[https://github.com/deis/charts](https://github.com/deis/charts), es una plantilla
para un controlador de replicación de Kubernetes. Puede utilizar los siguientes
cuatro valores de plantilla (normalmente definidos en un archivo `values.yaml`):

- `imageRegistry`: El registro de origen de la imagen de Docker.
- `dockerTag`: La etiqueta para image de Docker.
- `pullPolicy`: La política de pull de The Kubernetes.
- `storage`: El backend de almacenamiento, cuyo valor predeterminado es `"minio"`

Todos estos valores los define el autor de la plantilla. Helm no requiere ni
dicta parámetros.

Para ver muchos charts operativos, consulte [Artifact
Hub](https://artifacthub.io/packages/search?kind=0) de la CNCF.

### Valores Predefinidos

Los valores que se proporcionan a través de un archivo `values.yaml` (o mediante
la bandera `--set`) son accesibles desde el objeto `.Values` en una plantilla.
Pero hay otros datos predefinidos a los que puede acceder en tus plantillas.

Los siguientes valores están predefinidos, están disponibles para todas las
plantillas y no se pueden sobreescribir. Como ocurre con todos los valores,
los nombres son _sensibles a mayúsculas y minúsculas_.

- `Release.Name`: El nombre del release (no del chart)
- `Release.Namespace`: El namespace donde el chart fue deplegado.
- `Release.Service`: El servicio que realizó el lanzamiento.
- `Release.IsUpgrade`: Se establece en true (verdadero) si la operación actual
  es una actualización o una reversión.
- `Release.IsInstall`: Se establece en true (verdadero) si la operación actual
  es una instalación.
- `Chart`: El contenido de `Chart.yaml`. Por lo tanto, la versión del chart se
  puede obtener como `Chart.Version` y los mantenedores están en `Chart.Maintainers`.
- `Files`: Un objeto similar a un mapa que contiene todos los archivos no especiales
  del chart. Esto no le dará acceso a las plantillas, pero le dará acceso a archivos
  adicionales que están presentes (a menos que estén excluidos usando `.helmignore`).
  Se puede acceder al archivo usando `{{ index .Files "file.name" }}` o usando la
  función `{{ .Files.Get name }}`. También puede acceder al contenido del archivo
  como `[]byte` usando `{{ .Files.GetBytes }}`
- `Capabilities`: Un objeto similar a un mapa que contiene información sobre las
  versiones de Kubernetes (`{{ .Capabilities.KubeVersion }}`) y las versiones
  compatibles de la API de Kubernetes (`{{ .Capabilities.APIVersions.Has "batch/v1" }}`)

**NOTA:** Se eliminarán todos los campos desconocidos de `Chart.yaml`. No serán
accesibles dentro del objeto `Chart`. Por lo tanto, `Chart.yaml` no se puede usar
para pasar datos estructurados arbitrariamente a la plantilla. Sin embargo, el
archivo de values se puede usar para eso.

### Archivos values

Teniendo en cuenta la plantilla de la sección anterior, un archivo `values.yaml`
que proporciona los valores necesarios se vería así:

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "s3"
```

Un archivo values tiene el formato YAML. Un chart puede incluir un archivo
`values.yaml` predeterminado. El comando de instalación de Helm permite al usuario
sobreescribir valores al proporcionar valores YAML adicionales:

```console
$ helm install --generate-name --values=myvals.yaml wordpress
```

Cuando los valores se pasan de esta manera, se fusionarán en el archivo de values
predeterminado. Por ejemplo, considere un archivo `myvals.yaml` que se ve así:

```yaml
storage: "gcs"
```

Cuando se fusiona con `values.yaml` del chart, el contenido generado resultante será:

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "gcs"
```

Tenga en cuenta que solo se sobreescribó el último campo.

**NOTA:** El archivo de valores predeterminados incluido dentro de un chart
_debe_ llamarse `values.yaml`. Pero los archivos especificados en la línea de
comandos pueden tener cualquier nombre.

**NOTA:** Si la marca `--set` se usa en `helm install` o `helm upgrade`, esos valores
simplemente se convierten a YAML en el lado del cliente.

**NOTA:** Si existen entradas obligatorias en el archivo values, se pueden declarar
según sea necesario en la plantilla del chart mediante la [función
'required'](/howto/charts_tips_and_tricks.md)

Cualquiera de estos valores es accesible dentro de las plantillas usando el objeto
`.Values`:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

### Alcance, Dependencias y Valores

Los archivos de valores pueden declarar valores para el chart de nivel superior,
así como para cualquiera de los charts que se incluyen en el directorio `charts/`
de ese chart. O, para expresarlo de otra manera, un archivo de valores puede
proporcionar valores al chart, así como a cualquiera de sus dependencias. Por ejemplo,
el chart de demostración de WordPress anterior tiene tanto `mysql` como `apache`
como dependencias. El archivo de valores podría proporcionar valores a todos estos
componentes:

```yaml
title: "My WordPress Site" # Enviado a la plantilla de WordPress

mysql:
  max_connections: 100 # Enviado a MySQL
  password: "secret"

apache:
  port: 8080 # Enviado a Apache
```

Los charts de un nivel superior tienen acceso a todas las variables definidas a
nivel inferior. Entonces, el chart de WordPress puede acceder a la contraseña de
MySQL como `.Values.mysql.password`. Pero los charts de nivel inferior no pueden
acceder a elementos de los charts padres, por lo que MySQL no podrá acceder a la
propiedad `title`. Tampoco, en ese caso, puede acceder a `apache.port`.

Los valores son dependientes del espacio de nombres, pero los espacios de nombres
se podan. Entonces, para el chart de WordPress, puede acceder al campo de contraseña
de MySQL como `.Values.mysql.password`. Pero para el chart MySQL, el alcance de
los valores se ha reducido y el prefijo del espacio de nombres eliminado, por lo
que verá el campo de contraseña simplemente como `.Values.password`.

#### Valores Globales

A partir de 2.0.0-Alpha.2, Helm admite un valor "global" especial. Considere esta
versión modificada del ejemplo anterior:

```yaml
title: "My WordPress Site" # Enviado a la plantilla de WordPress

global:
  app: MyWordPress

mysql:
  max_connections: 100 # Enviado a MySQL
  password: "secret"

apache:
  port: 8080 # Enviado a Apache
```

Lo anterior agrega una sección `global` con el valor `app: MyWordPress`. Este
valor está disponible para _todos_ los charts como `.Values.global.app`.

Por ejemplo, las plantillas `mysql` pueden acceder a `app` como
`{{ .Values.global.app }}`, y también el chart `apache`. Efectivamente, el
archivo de valores anterior se regenera así:

```yaml
title: "My WordPress Site" # Enviado a la plantilla de WordPress

global:
  app: MyWordPress

mysql:
  global:
    app: MyWordPress
  max_connections: 100 # Enviado a MySQL
  password: "secret"

apache:
  global:
    app: MyWordPress
  port: 8080 # Enviado a Apache
```

Esto proporciona una forma de compartir una variable de nivel superior con todos
los sub-charts, lo cual es útil para cosas como establecer propiedades de `metadatos`
como etiquetas.

Si un sub-chart declara una variable global, ese global se pasará _hacia abajo_
(a los sub-charts del sub-chart), pero no _hacia arriba_ al chart padre. No hay
forma de que un sub-chart influya en los valores del chart padre.

Además, las variables globales de los charts padres tienen prioridad sobre las
variables globales de los subcharts.

### Archivos de Esquema {#schema-files}

A veces, un mantenedor de charts puede querer definir una estructura sobre sus
valores. Esto se puede hacer definiendo un esquema en el archivo
`values.schema.json`. Un esquema se representa como un
[JSON Schema](https://json-schema.org/). Podría verse algo como esto:

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "properties": {
    "image": {
      "description": "Container Image",
      "properties": {
        "repo": {
          "type": "string"
        },
        "tag": {
          "type": "string"
        }
      },
      "type": "object"
    },
    "name": {
      "description": "Service name",
      "type": "string"
    },
    "port": {
      "description": "Port",
      "minimum": 0,
      "type": "integer"
    },
    "protocol": {
      "type": "string"
    }
  },
  "required": [
    "protocol",
    "port"
  ],
  "title": "Values",
  "type": "object"
}
```

Este esquema se aplicará a los valores para validarlo. La validación se produce
cuando se invoca cualquiera de los siguientes comandos:

- `helm install`
- `helm upgrade`
- `helm lint`
- `helm template`

Un ejemplo de un archivo `values.yaml` que cumpla con los requisitos de este
esquema podría verse así:

```yaml
name: frontend
protocol: https
port: 443
```

Tenga en cuenta que el esquema se aplica al objeto final `.Values`, y no solo al
archivo `values.yaml`. Esto significa que el siguiente archivo `yaml` es válido,
dado que el chart se instala con la opción `--set` apropiada que se muestra a continuación.

```yaml
name: frontend
protocol: https
```

```console
helm install --set port=443
```

Además, el objeto `.Values` final se verifica con *todos* los esquemas de los sub-charts.
Esto significa que un chart padre no puede eludir las restricciones de un sub-chart.
Esto también funciona al revés: si un subchart tiene un requisito que no se cumple
en el archivo `values.yaml` del subchart, el chart padre *debe* satisfacer esas
restricciones para ser válido.

### Referencias

Cuando se trata de escribir plantillas, valores y archivos de esquema, existen
varias referencias estándar que le ayudarán.

- [Plantillas de Go](https://godoc.org/text/template)
- [Funciones extras de plantillas](https://godoc.org/github.com/Masterminds/sprig)
- [El formato YAML](https://yaml.org/spec/)
- [JSON Schema](https://json-schema.org/)

## Custom Resource Definitions (CRDs)

Kubernetes proporciona un mecanismo para declarar nuevos tipos de objetos de Kubernetes.
Con CustomResourceDefinitions (CRD), los desarrolladores de Kubernetes pueden declarar
tipos de recursos personalizados.

En Helm 3, los CRD se tratan como un tipo especial de objeto. Se instalan antes
que el resto de la tabla y están sujetos a algunas limitaciones.

Los archivos CRD YAML deben colocarse en el directorio `crds/` dentro de un chart.
Se pueden colocar varios CRD (separados por marcadores de inicio y finalización YAML)
en el mismo archivo. Helm intentará cargar _todos_ los archivos del directorio
CRD en Kubernetes.

Los archivos CRD _no pueden tener plantilla_. Deben ser documentos YAML simples.

Cuando Helm instala un nuevo chart, cargará los CRD, se detendrá hasta que el
servidor de API los ponga a disposición, y luego iniciará el motor de plantillas,
renderizará el resto del chart y lo cargará en Kubernetes. Debido a este orden,
la información de CRD está disponible en el objeto `.Capabilities` en las
plantillas de Helm, y las plantillas de Helm pueden crear nuevas instancias de
objetos que fueron declarados en los CRD.

For example, if your chart had a CRD for `CronTab` in the `crds/` directory, you
may create instances of the `CronTab` kind in the `templates/` directory:

Por ejemplo, si su chart tenía un CRD para `CronTab` en el directorio `crds/`,
puede crear instancias del tipo `CronTab` en el directorio `templates/`:

```text
crontabs/
  Chart.yaml
  crds/
    crontab.yaml
  templates/
    mycrontab.yaml
```

El archivo `crontab.yaml` debe contener el CRD sin directivas de plantilla:

```yaml
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
```

Luego, la plantilla `mycrontab.yaml` puede crear un nuevo `CronTab` (usando
plantillas como de costumbre):

```yaml
apiVersion: stable.example.com
kind: CronTab
metadata:
  name: {{ .Values.name }}
spec:
   # ...
```

Helm se asegurará de que el tipo `CronTab` se haya instalado y esté disponible
en el servidor API de Kubernetes antes de continuar con la instalación de las cosas 
en `templates/`.

### Limitaciones de los CRDs

A diferencia de la mayoría de los objetos de Kubernetes, los CRD se instalan
globalmente. Por esa razón, Helm adopta un enfoque muy cauteloso en la gestión
de CRD. Los CRD están sujetos a las siguientes limitaciones:

- Los CRD nunca se reinstalan. Si Helm determina que los CRD en el directorio `crds/`
  ya están presentes (independientemente de la versión), Helm no intentará
  instalarlos ni actualizarlos.
- Los CRD nunca se instalan en la actualización o reversión. Helm solo creará
  CRD en las operaciones de instalación.
- Los CRD nunca se eliminan. La eliminación de un CRD elimina automáticamente
  todo el contenido del CRD en todos los espacios de nombres del clúster.
  En consecuencia, Helm no eliminará los CRD.

Se recomienda a los operadores que deseen actualizar o eliminar CRD que lo hagan
manualmente y con mucho cuidado.

## Uso de Helm para Administrar Charts

La herramienta `helm` tiene varios comandos para trabajar con charts.

Puede crear un nuevo chart para usted:

```console
$ helm create mychart
Created mychart/
```

Una vez que haya editado un chart, `helm` puede empaquetarlo en un archivo de
charts para usted:

```console
$ helm package mychart
Archived mychart-0.1.-.tgz
```

También puede usar `helm` para ayudarlo a encontrar problemas con el formato o
la información de su chart:

```console
$ helm lint mychart
No issues found
```

## Repositorios de Chart

Un _repositorio de charts_ es un servidor HTTP que alberga uno o más charts
empaquetados. Si bien `helm` se puede usar para administrar directorios de
charts locales, cuando se trata de compartir charts, el mecanismo preferido es
un repositorio de charts.

Cualquier servidor HTTP que pueda servir archivos YAML y tar y que pueda responder
solicitudes GET se puede utilizar como servidor de repositorio. El equipo de Helm
ha probado algunos servidores, incluido Google Cloud Storage con el modo de sitio
web habilitado y S3 con el modo de sitio web habilitado.

Un repositorio se caracteriza principalmente por la presencia de un archivo
especial llamado `index.yaml` que tiene una lista de todos los paquetes
proporcionados por el repositorio, junto con metadatos que permiten recuperar y
verificar esos paquetes.

En el lado del cliente, los repositorios se administran con los comandos `helm repo`.
Sin embargo, Helm no proporciona herramientas para cargar charts en servidores
de repositorios remotos. Esto se debe a que hacerlo agregaría requisitos
sustanciales a un servidor de implementación y, por lo tanto, elevaría la barrera
para configurar un repositorio.

## Paquetes de Inicio de Charts

El comando `helm create` toma una opción opcional `--starter` que le permite
especificar un "chart de inicio".

Los paquetes de inicio son charts regulares, pero se encuentran en
`$XDG_DATA_HOME/helm/starters`. Como desarrollador de charts, puede crear charts
que estén diseñados específicamente para usarse como iniciadores. Dichos charts
deben diseñarse teniendo en cuenta las siguientes consideraciones:

- El generador sobrescribirá el archivo `Chart.yaml`.
- Los usuarios esperarán modificar el contenido de dicho chart, por lo que la
  documentación debe indicar cómo pueden hacerlo los usuarios.
- Todas las apariciones de `<CHARTNAME>` serán reemplazadas con el nombre de chart
  especificado para que los charts de inicio se puedan usar como plantillas.

Actualmente, la única forma de agregar un chart a `$XDG_DATA_HOME/helm/starters`
es copiarlo manualmente allí. En la documentación de su chart, es posible que
desee explicar ese proceso.
