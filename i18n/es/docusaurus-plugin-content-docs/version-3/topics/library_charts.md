---
title: "Charts de Bibliotecas"
description: "Explica los Charts de biblioteca y ejemplos de uso."
sidebar_position: 4
---

Un chart de biblioteca es un tipo de [chart de Helm](/topics/charts.md)
que define las primitivas o definiciones del chart que pueden ser compartidas por
las plantillas de Helm en otros charts. Esto permite a los usuarios compartir
fragmentos de código que se pueden reutilizar en los charts, evitando la repetición
y manteniendo los charts [DRY](https://es.wikipedia.org/wiki/No_te_repitas).

El chart de biblioteca se introdujo en Helm 3 para reconocer formalmente
los charts comunes o auxiliares que han sido utilizados por los mantenedores
de charts desde Helm 2. Al incluirlo como un tipo de chart, proporciona:

- Un medio para distinguir explícitamente entre charts comunes y de aplicación.
- Lógica para evitar la instalación de un chart común
- No se renderizan las plantillas en un chart común que puede contener un
  artefacto de un release

Un mantenedor de charts puede definir un chart común como un chart de biblioteca
y ahora estar seguro de que Helm manejará el chart de una manera estándar
consistente. También significa que las definiciones en un chart deaplicación
se pueden compartir cambiando el tipo de chart.

## Crear un Chart de Biblioteca Simple

Como se mencionó anteriormente, un chart de biblioteca es un tipo de [chart de
Helm](/topics/charts.md). Esto significa que puede comenzar
creando un chart de estantería:

```console
$ helm create mylibchart
Creating mylibchart
```

Primero eliminará todos los archivos en el directorio `templates` ya que crearemos
nuestras propias definiciones de plantillas en este ejemplo.

```console
$ rm -rf mylibchart/templates/*
```

El archivo values tampoco será necesario.

```console
$ rm -f mylibchart/values.yaml 
```

Antes de pasar a la creación de código común, hagamos una revisión rápida de algunos
conceptos relevantes de Helm. Una [plantilla con nombre](/chart_template_guide/named_templates.md) 
(a veces llamada parcial o subplantilla) es simplemente una plantilla definida
dentro de un archivo, y se le dio un nombre. En el directorio `templates/`, no se
espera que ningún archivo que comience con un guión bajo (_) genere un archivo de
manifiesto de Kubernetes. Entonces, por convención, las plantillas auxiliares y
los parciales se colocan en archivos `_*.tpl` o `_*.yaml`.

En este ejemplo, codificaremos un ConfigMap común que crea un recurso ConfigMap
vacío. Definiremos el ConfigMap común en el archivo `mylibchart/templates/_configmap.yaml`
de la siguiente manera:

```yaml
{{- define "mylibchart.configmap.tpl" -}}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data: {}
{{- end -}}
{{- define "mylibchart.configmap" -}}
{{- include "mylibchart.util.merge" (append . "mylibchart.configmap.tpl") -}}
{{- end -}}
```

La construcción ConfigMap se define en la plantilla denominada `mylibchart.configmap.tpl`.
Es un ConfigMap simple con un recurso vacío, `data`. Dentro de este archivo hay
otra plantilla con nombre llamada `mylibchart.configmap`. Esta plantilla con
nombre incluye otra plantilla con nombre `mylibchart.util.merge` que tomará 2
plantillas con nombre como argumentos, la plantilla que llama a `mylibchart.configmap`
y `mylibchart.configmap.tpl`.

La función auxiliar `mylibchart.util.merge` es una plantilla con nombre en
`mylibchart/templates/_util.yaml`. Es una utilidad útil de [El Chart de Utilidad
Común de Helm](#el-chart-de-utilidad-común-de-helm) porque combina las 2 plantillas
y sobreescribe cualquier parte común en ambas:

```yaml
{{- /*
mylibchart.util.merge convinará dos plantillas YAML y generará el resultado.
Esto toma un arreglo de tres valores:
- el contexto superior
- el nombre de la plantilla de las anulaciones (destino)
- el nombre de la plantilla de la base (fuente)
*/}}
{{- define "mylibchart.util.merge" -}}
{{- $top := first . -}}
{{- $overrides := fromYaml (include (index . 1) $top) | default (dict ) -}}
{{- $tpl := fromYaml (include (index . 2) $top) | default (dict ) -}}
{{- toYaml (merge $overrides $tpl) -}}
{{- end -}}
```

Esto es importante cuando un chart desea utilizar un código común que necesita
personalizar con su configuración.

Finalmente, cambiemos el tipo de chart a "biblioteca". Esto requiere editar
`mylibchart/Chart.yaml` de la siguiente manera:

```yaml
apiVersion: v2
name: mylibchart
description: A Helm chart for Kubernetes

# A chart can be either an 'application' or a 'library' chart.
#
# Application charts are a collection of templates that can be packaged into versioned archives
# to be deployed.
#
# Library charts provide useful utilities or functions for the chart developer. They're included as
# a dependency of application charts to inject those utilities and functions into the rendering
# pipeline. Library charts do not define any templates and therefore cannot be deployed.
# type: application
type: library

# This is the chart version. This version number should be incremented each time you make changes
# to the chart and its templates, including the app version.
version: 0.1.0

# This is the version number of the application being deployed. This version number should be
# incremented each time you make changes to the application and it is recommended to use it with quotes.
appVersion: "1.16.0"
```

El chart de biblioteca ahora está listo para ser compartido y su definición de
ConfigMap para ser reutilizada.

Antes de continuar, vale la pena verificar si Helm reconoce el chart como un chart
de biblioteca:

```console
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

## Utilice el Chart de Biblioteca Simple

Es hora de usar el chart de biblioteca. Esto significa volver a crear un chart
de estantería:

```console
$ helm create mychart
Creating mychart
```

Limpiemos los archivos de plantilla nuevamente, ya que solo queremos crear un ConfigMap:

```console
$ rm -rf mychart/templates/*
```

Cuando queremos crear un ConfigMap simple en una plantilla de Helm, podría tener
un aspecto similar al siguiente:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data:
  myvalue: "Hello World"
```

Sin embargo, vamos a reutilizar el código común ya creado en `mylibchart`. El
ConfigMap se puede crear en el archivo `mychart/templates/configmap.yaml` de
la siguiente manera:

```yaml
{{- include "mylibchart.configmap" (list . "mychart.configmap") -}}
{{- define "mychart.configmap" -}}
data:
  myvalue: "Hello World"
{{- end -}}
```

Puede ver que simplifica el trabajo que tenemos que hacer al heredar la definición
común de ConfigMap que agrega propiedades estándar para ConfigMap. En nuestra
plantilla agregamos la configuración, en este caso la clave de datos `myvalue`
y su valor. La configuración sobreescribe el recurso vacío del ConfigMap común.
Esto es factible debido a la función auxiliar `mylibchart.util.merge` que
mencionamos en la sección anterior.

Para poder usar el código común, necesitamos agregar `mylibchart` como dependencia.
Agregue lo siguiente al final del archivo `mychart/Chart.yaml`:

```yaml
# Mi código común en el chart de mi biblioteca
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

Esto incluye el chart de biblioteca como una dependencia dinámica del
sistema de archivos que se encuentra en la misma ruta principal que nuestro
chart de la aplicación. Como estamos incluyendo el chart de biblioteca como
una dependencia dinámica, necesitamos ejecutar la actualización de la dependencia
de helm. Helm copiará el chart de biblioteca en su directorio `charts/`.

```console
$ helm dependency update mychart/
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 1 charts
Deleting outdated charts
```

Ahora estamos listos para implementar nuestro chart. Antes de instalar, vale la
pena verificar primero la plantilla renderizada.

```console
$ helm install mydemo mychart/ --debug --dry-run
install.go:159: [debug] Original chart version: ""
install.go:176: [debug] CHART PATH: /root/test/helm-charts/mychart

NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:48:47 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: nginx
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: false
  hosts:
  - host: chart-example.local
    paths: []
  tls: []
mylibchart:
  global: {}
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 1
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  annotations: {}
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
```

Esto se parece al ConfigMap que queremos con la sobre escritura de datos de
`myvalue: Hello World`. Vamos a instalarlo:

```console
$ helm install mydemo mychart/
NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:52:40 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

Podemos recuperar el release y ver que se cargó la plantilla real.

```console
$ helm get manifest mydemo
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
  ```

## El Chart de Utilidad Común de Helm

Este [chart](https://github.com/helm/charts/tree/master/incubator/common) fue
el patrón original para los charts comunes. Proporciona utilidades que reflejan
las mejores prácticas del desarrollo de charts de Kubernetes. Lo mejor de todo
es que puede usarlo de inmediato cuando desarrolle sus charts para brindarle un
código compartido útil.

Aquí hay una forma rápida de usarlo. Para más detalles, eche un vistazo al
[README](https://github.com/helm/charts/blob/master/incubator/common/README.md).

Vuelva a crear un chart de estantería:

```console
$ helm create demo
Creating demo
```

Usemos el código común del chart de ayuda. Primero, edite el deployment
`demo/templates/deployment.yaml` de la siguiente manera:

```yaml
{{- template "common.deployment" (list . "demo.deployment") -}}
{{- define "demo.deployment" -}}
## Defina anulaciones para su deployment aquí, p. Ej.
spec:
  replicas: {{ .Values.replicaCount }}
{{- end -}}
```

Y ahora el archivo de servicio, `demo/templates/service.yaml` como sigue:

```yaml
{{- template "common.service" (list . "demo.service") -}}
{{- define "demo.service" -}}
## Defina aquí anulaciones para su Service, p. Ej.
# metadata:
#   labels:
#     custom: label
# spec:
#   ports:
#   - port: 8080
{{- end -}}
```

Estas plantillas muestran cómo heredar el código común del chart auxiliar
simplifica su codificación hasta su configuración o personalización de los recursos.

Para poder usar el código común, necesitamos agregar `common` como dependencia.
Agregue lo siguiente al final del archivo `demo/Chart.yaml`:

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"
```

Nota: Deberá agregar el repositorio `incubator` a la lista de repositorios
de Helm (`helm repo add`).

Como estamos incluyendo el chart como una dependencia dinámica, necesitamos
ejecutar `helm dependency update`. Helm copiará el chart auxiliar en su directorio
`charts/`.

Como el chart auxiliar está usando algunas construcciones de Helm 2, deberá agregar
lo siguiente a `demo/values.yaml` para permitir que se cargue la imagen `nginx`
ya que se actualizó en el chart de estantería de Helm 3:

```yaml
image:
  tag: 1.16.0
```

Ahora está listo, ¡así que a desplegarlo!
