---
title: Plantillas con Nombre
description: Cómo definir plantillas con nombre.
sidebar_position: 9
---

Ha llegado el momento de ir más allá de una sola plantilla y comenzar a crear
otras. En esta sección, veremos cómo definir _plantillas con nombre_ en un
archivo y luego usarlas en otros lugares. Una _plantilla con nombre_ (a veces
llamada _parcial_ o _subplantilla_) es simplemente una plantilla definida dentro
de un archivo a la que se le asigna un nombre. Veremos dos formas de crearlas y
varias formas diferentes de usarlas.

En la sección de [Estructuras de Control](./control_structures.md) presentamos
tres acciones para declarar y gestionar plantillas: `define`, `template` y
`block`. En esta sección, cubriremos esas tres acciones y también presentaremos
una función especial `include` que funciona de manera similar a la acción
`template`.

Es importante recordar al nombrar plantillas: **los nombres de las plantillas
son globales**. Si declara dos plantillas con el mismo nombre, la que se cargue
en último lugar será la que se use. Como las plantillas en subcharts se compilan
junto con las plantillas de nivel superior, debe tener cuidado de nombrar sus
plantillas con _nombres específicos del chart_.

Una convención de nomenclatura popular es prefijar cada plantilla definida con
el nombre del chart: `{{ define "mychart.labels" }}`. Al usar el nombre
específico del chart como prefijo, podemos evitar cualquier conflicto que pueda
surgir debido a dos charts diferentes que implementan plantillas con el mismo
nombre.

Este comportamiento también se aplica a diferentes versiones de un chart. Si
tiene `mychart` versión `1.0.0` que define una plantilla de cierta manera, y
`mychart` versión `2.0.0` que modifica la plantilla con nombre existente, se
usará la que se cargó en último lugar. Puede solucionar este problema agregando
también una versión en el nombre del chart: `{{ define "mychart.v1.labels" }}` y
`{{ define "mychart.v2.labels" }}`.

## Parciales y archivos `_`

Hasta ahora, hemos usado un solo archivo, y ese archivo contenía una sola
plantilla. Pero el lenguaje de plantillas de Helm le permite crear plantillas
con nombre incrustadas, a las que se puede acceder por nombre desde cualquier
otro lugar.

Antes de entrar en los detalles de cómo escribir esas plantillas, hay una
convención de nomenclatura de archivos que merece mención:

* La mayoría de los archivos en `templates/` se tratan como si contuvieran
  manifiestos de Kubernetes
* `NOTES.txt` es una excepción
* Pero los archivos cuyo nombre comienza con un guion bajo (`_`) se asumen como
  que _no_ contienen un manifiesto. Estos archivos no se renderizan como
  definiciones de objetos de Kubernetes, pero están disponibles en todas las
  demás plantillas del chart para su uso.

Estos archivos se usan para almacenar parciales y helpers. De hecho, cuando
creamos `mychart` por primera vez, vimos un archivo llamado `_helpers.tpl`. Ese
archivo es la ubicación predeterminada para parciales de plantillas.

## Declarar y usar plantillas con `define` y `template`

La acción `define` nos permite crear una plantilla con nombre dentro de un
archivo de plantilla. Su sintaxis es la siguiente:

```yaml
{{- define "MY.NAME" }}
  # body of template here
{{- end }}
```

Por ejemplo, podemos definir una plantilla para encapsular un bloque de
etiquetas de Kubernetes:

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

Ahora podemos incrustar esta plantilla dentro de nuestro ConfigMap existente, y
luego incluirla con la acción `template`:

```yaml
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

Cuando el motor de plantillas lee este archivo, almacenará la referencia a
`mychart.labels` hasta que se llame a `template "mychart.labels"`. Luego
renderizará esa plantilla en línea. Así que el resultado se verá así:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: running-panda-configmap
  labels:
    generator: helm
    date: 2016-11-02
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

Nota: un `define` no produce salida a menos que se llame con template, como en
este ejemplo.

Por convención, los charts de Helm colocan estas plantillas dentro de un archivo
de parciales, generalmente `_helpers.tpl`. Movamos esta función allí:

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
{{- end }}
```

Por convención, las funciones `define` deben tener un bloque de documentación
simple (`{{/* ... */}}`) que describa lo que hacen.

Aunque esta definición está en `_helpers.tpl`, todavía se puede acceder a ella
desde `configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

Como se mencionó anteriormente, **los nombres de las plantillas son globales**.
Como resultado, si dos plantillas se declaran con el mismo nombre, la última que
aparezca será la que se use. Dado que las plantillas en subcharts se compilan
junto con las plantillas de nivel superior, es mejor nombrar sus plantillas con
_nombres específicos del chart_. Una convención de nomenclatura popular es
prefijar cada plantilla definida con el nombre del chart:
`{{ define "mychart.labels" }}`.

## Establecer el ámbito de una plantilla

En la plantilla que definimos anteriormente, no usamos ningún objeto. Solo
usamos funciones. Modifiquemos nuestra plantilla definida para incluir el nombre
del chart y la versión del chart:

```yaml
{{/* Generate basic labels */}}
{{- define "mychart.labels" }}
  labels:
    generator: helm
    date: {{ now | htmlDate }}
    chart: {{ .Chart.Name }}
    version: {{ .Chart.Version }}
{{- end }}
```

Si renderizamos esto, obtendremos un error como este:

```console
$ helm install --dry-run moldy-jaguar ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [unknown object type "nil" in ConfigMap.metadata.labels.chart, unknown object type "nil" in ConfigMap.metadata.labels.version]
```

Para ver qué se renderizó, vuelva a ejecutar con `--disable-openapi-validation`:
`helm install --dry-run --disable-openapi-validation moldy-jaguar ./mychart`.
El resultado no será el que esperamos:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: moldy-jaguar-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart:
    version:
```

¿Qué pasó con el nombre y la versión? No estaban en el ámbito de nuestra
plantilla definida. Cuando se renderiza una plantilla con nombre (creada con
`define`), recibirá el ámbito pasado por la llamada `template`. En nuestro
ejemplo, incluimos la plantilla así:

```yaml
{{- template "mychart.labels" }}
```

No se pasó ningún ámbito, por lo que dentro de la plantilla no podemos acceder a
nada en `.`. Esto es fácil de arreglar. Basta con pasar un ámbito a la plantilla:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  {{- template "mychart.labels" . }}
```

Observe que pasamos `.` al final de la llamada `template`. También podríamos
pasar `.Values` o `.Values.favorite` o cualquier ámbito que deseemos. Pero lo
que queremos es el ámbito de nivel superior. En el contexto de la plantilla con
nombre, `$` se referirá al ámbito que pasó y no a algún ámbito global.

Ahora, cuando ejecutamos esta plantilla con `helm install --dry-run --debug
plinking-anaco ./mychart`, obtenemos esto:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: plinking-anaco-configmap
  labels:
    generator: helm
    date: 2021-03-06
    chart: mychart
    version: 0.1.0
```

Ahora `{{ .Chart.Name }}` se resuelve a `mychart`, y `{{ .Chart.Version }}` se
resuelve a `0.1.0`.

## La función `include`

Digamos que hemos definido una plantilla simple que se ve así:

```yaml
{{- define "mychart.app" -}}
app_name: {{ .Chart.Name }}
app_version: "{{ .Chart.Version }}"
{{- end -}}
```

Ahora supongamos que quiero insertar esto tanto en la sección `labels:` de mi
plantilla como en la sección `data:`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
    {{ template "mychart.app" . }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ template "mychart.app" . }}
```

Si renderizamos esto, obtendremos un error como este:

```console
$ helm install --dry-run measly-whippet ./mychart
Error: unable to build kubernetes objects from release manifest: error validating "": error validating data: [ValidationError(ConfigMap): unknown field "app_name" in io.k8s.api.core.v1.ConfigMap, ValidationError(ConfigMap): unknown field "app_version" in io.k8s.api.core.v1.ConfigMap]
```

Para ver qué se renderizó, vuelva a ejecutar con `--disable-openapi-validation`:
`helm install --dry-run --disable-openapi-validation measly-whippet ./mychart`.
La salida no será la que esperamos:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: measly-whippet-configmap
  labels:
    app_name: mychart
app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
app_name: mychart
app_version: "0.1.0"
```

Observe que la indentación de `app_version` es incorrecta en ambos lugares.
¿Por qué? Porque la plantilla que se sustituye tiene el texto alineado a la
izquierda. Como `template` es una acción, y no una función, no hay forma de
pasar la salida de una llamada `template` a otras funciones; los datos
simplemente se insertan en línea.

Para solucionar este caso, Helm proporciona una alternativa a `template` que
importará el contenido de una plantilla al pipeline actual donde puede pasarse
a otras funciones en el pipeline.

Aquí está el ejemplo anterior, corregido para usar `indent` para indentar la
plantilla `mychart.app` correctamente:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
{{ include "mychart.app" . | indent 4 }}
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
{{ include "mychart.app" . | indent 2 }}
```

Ahora el YAML producido está correctamente indentado para cada sección:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-mole-configmap
  labels:
    app_name: mychart
    app_version: "0.1.0"
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
  app_name: mychart
  app_version: "0.1.0"
```

> Es preferible usar `include` en lugar de `template` en las plantillas de Helm
> simplemente para que el formato de salida pueda manejarse mejor en documentos
> YAML.

A veces queremos importar contenido, pero no como plantillas. Es decir, queremos
importar archivos literalmente. Podemos lograr esto accediendo a los archivos a
través del objeto `.Files` descrito en la siguiente sección.
