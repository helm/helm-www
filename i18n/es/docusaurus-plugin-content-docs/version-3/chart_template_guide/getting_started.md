---
title: Primeros Pasos
description: Una guía rápida sobre plantillas de Chart.
sidebar_position: 2
---

En esta sección de la guía, crearemos un chart y luego agregaremos una primera
plantilla. El chart que creamos aquí se usará durante el resto de la guía.

Para comenzar, echemos un vistazo rápido a un chart de Helm.

## Charts

Como se describe en la [Guía de Charts](/topics/charts.md), los charts de Helm
están estructurados así:

```
mychart/
  Chart.yaml
  values.yaml
  charts/
  templates/
  ...
```

El directorio `templates/` es para archivos de plantilla. Cuando Helm evalúa un
chart, envía todos los archivos del directorio `templates/` a través del motor
de renderizado de plantillas. Luego recopila los resultados de esas plantillas
y los envía a Kubernetes.

El archivo `values.yaml` también es importante para las plantillas. Este archivo
contiene los _valores por defecto_ de un chart. Estos valores pueden ser
sobrescritos por los usuarios durante `helm install` o `helm upgrade`.

El archivo `Chart.yaml` contiene una descripción del chart. Puede acceder a él
desde dentro de una plantilla.

El directorio `charts/` _puede_ contener otros charts (que llamamos _subcharts_).
Más adelante en esta guía veremos cómo funcionan cuando se trata de renderizado
de plantillas.

## Un Chart Inicial

Para esta guía, crearemos un chart simple llamado `mychart`, y luego crearemos
algunas plantillas dentro del chart.

```console
$ helm create mychart
Creating mychart
```

### Un Vistazo Rápido a `mychart/templates/`

Si observa el directorio `mychart/templates/`, notará que ya hay algunos archivos
allí.

- `NOTES.txt`: El "texto de ayuda" para su chart. Se mostrará a los usuarios
  cuando ejecuten `helm install`.
- `deployment.yaml`: Un manifiesto básico para crear un
  [deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
  de Kubernetes
- `service.yaml`: Un manifiesto básico para crear un [endpoint de
  servicio](https://kubernetes.io/docs/concepts/services-networking/service/)
  para su deployment
- `_helpers.tpl`: Un lugar para colocar helpers de plantilla que puede reutilizar
  en todo el chart

Y lo que vamos a hacer es... _¡eliminarlos todos!_ De esta manera podemos
trabajar en nuestro tutorial desde cero. En realidad, crearemos nuestros propios
`NOTES.txt` y `_helpers.tpl` a medida que avancemos.

```console
$ rm -rf mychart/templates/*
```

Cuando esté escribiendo charts de nivel de producción, tener versiones básicas
de estos archivos puede ser muy útil. Así que en su trabajo diario de creación
de charts, probablemente no querrá eliminarlos.

## Una Primera Plantilla

La primera plantilla que vamos a crear será un `ConfigMap`. En Kubernetes, un
ConfigMap es simplemente un objeto para almacenar datos de configuración. Otras
cosas, como los pods, pueden acceder a los datos en un ConfigMap.

Debido a que los ConfigMaps son recursos básicos, son un excelente punto de
partida para nosotros.

Comencemos creando un archivo llamado `mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

**TIP:** Los nombres de plantilla no siguen un patrón de nomenclatura rígido.
Sin embargo, recomendamos usar la extensión `.yaml` para archivos YAML y `.tpl`
para helpers.

El archivo YAML anterior es un ConfigMap básico, con los campos mínimos
necesarios. Por el hecho de que este archivo está en el directorio
`mychart/templates/`, será enviado a través del motor de plantillas.

Está perfectamente bien colocar un archivo YAML simple como este en el
directorio `mychart/templates/`. Cuando Helm lea esta plantilla, simplemente la
enviará a Kubernetes tal cual.

Con esta plantilla simple, ahora tenemos un chart instalable. Y podemos
instalarlo así:

```console
$ helm install full-coral ./mychart
NAME: full-coral
LAST DEPLOYED: Tue Nov  1 17:36:01 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

Usando Helm, podemos recuperar el release y ver la plantilla real que fue
cargada.

```console
$ helm get manifest full-coral

---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

El comando `helm get manifest` toma un nombre de release (`full-coral`) e
imprime todos los recursos de Kubernetes que fueron subidos al servidor. Cada
archivo comienza con `---` para indicar el inicio de un documento YAML, y luego
es seguido por una línea de comentario generada automáticamente que nos dice
qué archivo de plantilla generó este documento YAML.

A partir de ahí, podemos ver que los datos YAML son exactamente lo que pusimos
en nuestro archivo `configmap.yaml`.

Ahora podemos desinstalar nuestro release: `helm uninstall full-coral`.

### Agregando una Llamada de Plantilla Simple

Codificar el `name:` directamente en un recurso generalmente se considera una
mala práctica. Los nombres deben ser únicos para un release. Por lo tanto,
podríamos querer generar un campo de nombre insertando el nombre del release.

**TIP:** El campo `name:` está limitado a 63 caracteres debido a limitaciones
del sistema DNS. Por esa razón, los nombres de release están limitados a 53
caracteres. Kubernetes 1.3 y versiones anteriores estaban limitados a solo 24
caracteres (por lo tanto, nombres de 14 caracteres).

Modifiquemos `configmap.yaml` en consecuencia.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
```

El gran cambio viene en el valor del campo `name:`, que ahora es
`{{ .Release.Name }}-configmap`.

> Una directiva de plantilla está encerrada en bloques `{{` y `}}`.

La directiva de plantilla `{{ .Release.Name }}` inyecta el nombre del release en
la plantilla. Los valores que se pasan a una plantilla pueden pensarse como
_objetos con namespace_, donde un punto (`.`) separa cada elemento del namespace.

El punto inicial antes de `Release` indica que comenzamos con el namespace de
nivel superior para este alcance (hablaremos sobre el alcance en un momento).
Así que podríamos leer `.Release.Name` como "comenzar en el namespace superior,
encontrar el objeto `Release`, luego buscar dentro de él un objeto llamado
`Name`".

El objeto `Release` es uno de los objetos integrados de Helm, y lo cubriremos
con más profundidad más adelante. Pero por ahora, es suficiente decir que esto
mostrará el nombre del release que la biblioteca asigna a nuestro release.

Ahora cuando instalemos nuestro recurso, veremos inmediatamente el resultado de
usar esta directiva de plantilla:

```console
$ helm install clunky-serval ./mychart
NAME: clunky-serval
LAST DEPLOYED: Tue Nov  1 17:45:37 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

Puede ejecutar `helm get manifest clunky-serval` para ver todo el YAML generado.

Note que el nombre del ConfigMap dentro de Kubernetes es
`clunky-serval-configmap` en lugar de `mychart-configmap` como antes.

En este punto, hemos visto las plantillas en su forma más básica: archivos YAML
que tienen directivas de plantilla incrustadas en `{{` y `}}`. En la siguiente
parte, veremos más a fondo las plantillas. Pero antes de continuar, hay un
truco rápido que puede hacer que la construcción de plantillas sea más rápida:
Cuando quiera probar el renderizado de plantillas, pero no instalar nada
realmente, puede usar `helm install --debug --dry-run goodly-guppy ./mychart`.
Esto renderizará las plantillas. Pero en lugar de instalar el chart, le
devolverá la plantilla renderizada para que pueda ver la salida:

```console
$ helm install --debug --dry-run goodly-guppy ./mychart
install.go:149: [debug] Original chart version: ""
install.go:166: [debug] CHART PATH: /Users/ninja/mychart

NAME: goodly-guppy
LAST DEPLOYED: Thu Dec 26 17:24:13 2019
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
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: goodly-guppy-configmap
data:
  myvalue: "Hello World"

```

Usar `--dry-run` hará más fácil probar su código, pero no garantizará que
Kubernetes acepte las plantillas que genere. Es mejor no asumir que su chart se
instalará solo porque `--dry-run` funciona.

En la [Guía de Plantillas de Chart](/chart_template_guide/index.mdx), tomamos el
chart básico que definimos aquí y exploramos el lenguaje de plantillas de Helm
en detalle. Y comenzaremos con los objetos integrados.
