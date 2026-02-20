---
title: Subcharts y Valores Globales
description: Interacción con subcharts y valores globales.
sidebar_position: 11
---

Hasta este punto hemos trabajado solo con un chart. Pero los charts pueden tener
dependencias, llamadas _subcharts_, que también tienen sus propios values y
plantillas. En esta sección crearemos un subchart y veremos las diferentes
formas en que podemos acceder a los values desde las plantillas.

Antes de profundizar en el código, hay algunos detalles importantes que aprender
sobre los subcharts de aplicaciones.

1. Un subchart se considera "independiente", lo que significa que un subchart
   nunca puede depender explícitamente de su chart padre.
2. Por esa razón, un subchart no puede acceder a los values de su padre.
3. Un chart padre puede sobrescribir values para los subcharts.
4. Helm tiene un concepto de _valores globales_ que pueden ser accedidos por
   todos los charts.

> Estas limitaciones no necesariamente aplican a los [library charts](/topics/library_charts.md), que están diseñados para proporcionar funcionalidad auxiliar estandarizada.

A medida que recorramos los ejemplos en esta sección, muchos de estos conceptos
quedarán más claros.

## Creación de un Subchart

Para estos ejercicios, comenzaremos con el chart `mychart/` que creamos al
inicio de esta guía, y agregaremos un nuevo chart dentro de él.

```console
$ cd mychart/charts
$ helm create mysubchart
Creating mysubchart
$ rm -rf mysubchart/templates/*
```

Observe que, al igual que antes, eliminamos todas las plantillas base para poder
comenzar desde cero. En esta guía, nos enfocamos en cómo funcionan las plantillas,
no en gestionar dependencias. Sin embargo, la [Guía de Charts](/topics/charts.md)
tiene más información sobre cómo funcionan los subcharts.

## Agregar Values y una Plantilla al Subchart

A continuación, crearemos una plantilla simple y un archivo values para nuestro
chart `mysubchart`. Ya debería existir un `values.yaml` en
`mychart/charts/mysubchart`. Lo configuraremos así:

```yaml
dessert: cake
```

Luego, crearemos una nueva plantilla de ConfigMap en
`mychart/charts/mysubchart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
```

Como cada subchart es un _chart independiente_, podemos probar `mysubchart` por
sí solo:

```console
$ helm install --generate-name --dry-run --debug mychart/charts/mysubchart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart/charts/mysubchart
NAME:   newbie-elk
TARGET NAMESPACE:   default
CHART:  mysubchart 0.1.0
MANIFEST:
---
# Source: mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: newbie-elk-cfgmap2
data:
  dessert: cake
```

## Sobrescribir Values desde un Chart Padre

Nuestro chart original, `mychart`, ahora es el _chart padre_ de `mysubchart`.
Esta relación se basa completamente en el hecho de que `mysubchart` está dentro
de `mychart/charts`.

Como `mychart` es el padre, podemos especificar configuración en `mychart` y
hacer que esa configuración se pase a `mysubchart`. Por ejemplo, podemos
modificar `mychart/values.yaml` de esta forma:

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream
```

Observe las últimas dos líneas. Cualquier directiva dentro de la sección
`mysubchart` se pasará al chart `mysubchart`. Entonces, si ejecutamos
`helm install --generate-name --dry-run --debug mychart`, una de las cosas que
veremos es el ConfigMap de `mysubchart`:

```yaml
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: unhinged-bee-cfgmap2
data:
  dessert: ice cream
```

El valor en el nivel superior ahora ha sobrescrito el valor del subchart.

Hay un detalle importante que notar aquí. No cambiamos la plantilla de
`mychart/charts/mysubchart/templates/configmap.yaml` para que apunte a
`.Values.mysubchart.dessert`. Desde la perspectiva de esa plantilla, el valor
todavía está ubicado en `.Values.dessert`. A medida que el motor de plantillas
pasa los values, establece el ámbito. Así que para las plantillas de `mysubchart`,
solo los values específicamente para `mysubchart` estarán disponibles en `.Values`.

Sin embargo, a veces querrá que ciertos valores estén disponibles para todas las
plantillas. Esto se logra usando valores globales de chart.

## Valores Globales de Chart

Los valores globales son valores a los que se puede acceder desde cualquier chart
o subchart con exactamente el mismo nombre. Los globales requieren declaración
explícita. No se puede usar un valor no global existente como si fuera global.

El tipo de datos Values tiene una sección reservada llamada `Values.global` donde
se pueden establecer valores globales. Establezcamos uno en nuestro archivo
`mychart/values.yaml`.

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions

mysubchart:
  dessert: ice cream

global:
  salad: caesar
```

Debido a cómo funcionan los globales, tanto `mychart/templates/configmap.yaml`
como `mysubchart/templates/configmap.yaml` deberían poder acceder a ese valor
como `{{ .Values.global.salad }}`.

`mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  salad: {{ .Values.global.salad }}
```

`mysubchart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-cfgmap2
data:
  dessert: {{ .Values.dessert }}
  salad: {{ .Values.global.salad }}
```

Ahora, si ejecutamos una instalación en modo dry run, veremos el mismo valor en
ambas salidas:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-configmap
data:
  salad: caesar

---
# Source: mychart/charts/mysubchart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: silly-snake-cfgmap2
data:
  dessert: ice cream
  salad: caesar
```

Los globales son útiles para pasar información como esta, aunque requiere cierta
planificación para asegurarse de que las plantillas correctas estén configuradas
para usar globales.

## Compartir Plantillas con Subcharts

Los charts padres y los subcharts pueden compartir plantillas. Cualquier bloque
definido en cualquier chart está disponible para otros charts.

Por ejemplo, podemos definir una plantilla simple como esta:

```yaml
{{- define "labels" }}from: mychart{{ end }}
```

Recuerde que las etiquetas en las plantillas se _comparten globalmente_. Por lo
tanto, el chart `labels` puede incluirse desde cualquier otro chart.

Mientras que los desarrolladores de charts pueden elegir entre `include` y
`template`, una ventaja de usar `include` es que puede referenciar plantillas
dinámicamente:

```yaml
{{ include $mytemplate }}
```

Lo anterior desreferenciará `$mytemplate`. La función `template`, en contraste,
solo acepta un literal de cadena.

## Evitar el Uso de Blocks

El lenguaje de plantillas de Go proporciona una palabra clave `block` que permite
a los desarrolladores proporcionar una implementación por defecto que se
sobrescribe después. En los charts de Helm, los blocks no son la mejor herramienta
para sobrescribir porque si se proporcionan múltiples implementaciones del mismo
block, la seleccionada es impredecible.

Se recomienda usar `include` en su lugar.
