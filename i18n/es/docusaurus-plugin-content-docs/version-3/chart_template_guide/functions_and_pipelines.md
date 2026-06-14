---
title: Funciones de Plantilla y Pipelines
description: Uso de funciones en plantillas.
sidebar_position: 5
---

Hasta ahora, hemos visto cómo colocar información en una plantilla. Pero esa
información se coloca en la plantilla sin modificar. A veces queremos
transformar los datos suministrados de una manera que nos sea más útil.

Comencemos con una mejor práctica: Al inyectar cadenas del objeto `.Values` en
la plantilla, debemos ponerlas entre comillas. Podemos hacer esto llamando a la
función `quote` en la directiva de plantilla:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ quote .Values.favorite.drink }}
  food: {{ quote .Values.favorite.food }}
```

Las funciones de plantilla siguen la sintaxis `functionName arg1 arg2...`. En el
fragmento anterior, `quote .Values.favorite.drink` llama a la función `quote` y
le pasa un solo argumento.

Helm tiene más de 60 funciones disponibles. Algunas de ellas están definidas por
el propio [lenguaje de plantillas de Go](https://godoc.org/text/template). La
mayoría de las demás son parte de la [biblioteca de plantillas
Sprig](https://masterminds.github.io/sprig/). Veremos muchas de ellas a medida
que avancemos a través de los ejemplos.

> Aunque hablamos del "lenguaje de plantillas de Helm" como si fuera específico
> de Helm, en realidad es una combinación del lenguaje de plantillas de Go,
> algunas funciones adicionales y una variedad de wrappers para exponer ciertos
> objetos a las plantillas. Muchos recursos sobre plantillas de Go pueden ser
> útiles mientras aprende sobre plantillas.

## Pipelines

Una de las características más poderosas del lenguaje de plantillas es su
concepto de _pipelines_. Inspirándose en un concepto de UNIX, los pipelines son
una herramienta para encadenar una serie de comandos de plantilla y expresar de
manera compacta una serie de transformaciones. En otras palabras, los pipelines
son una forma eficiente de realizar varias operaciones en secuencia. Reescribamos el
ejemplo anterior usando un pipeline.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | quote }}
```

En este ejemplo, en lugar de llamar a `quote ARGUMENT`, invertimos el orden.
"Enviamos" el argumento a la función usando un pipeline (`|`):
`.Values.favorite.drink | quote`. Usando pipelines, podemos encadenar varias
funciones juntas:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

> Invertir el orden es una práctica común en plantillas. Verá `.val | quote` más
> a menudo que `quote .val`. Cualquiera de las dos prácticas está bien.

Cuando se evalúa, esa plantilla producirá esto:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: trendsetting-p-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

Note que nuestra `pizza` original ahora se ha transformado a `"PIZZA"`.

Cuando se encadenan argumentos de esta manera, el resultado de la primera
evaluación (`.Values.favorite.drink`) se envía como el _último argumento de la
función_. Podemos modificar el ejemplo de bebida anterior para ilustrar con una
función que toma dos argumentos: `repeat COUNT STRING`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | repeat 5 | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

La función `repeat` repetirá la cadena dada el número de veces indicado, por lo
que obtendremos esta salida:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: melting-porcup-configmap
data:
  myvalue: "Hello World"
  drink: "coffeecoffeecoffeecoffeecoffee"
  food: "PIZZA"
```

## Uso de la función `default`

Una función que se usa con frecuencia en plantillas es la función `default`:
`default DEFAULT_VALUE GIVEN_VALUE`. Esta función le permite especificar un
valor por defecto dentro de la plantilla, en caso de que el valor sea omitido.
Usémosla para modificar el ejemplo de bebida anterior:

```yaml
drink: {{ .Values.favorite.drink | default "tea" | quote }}
```

Si ejecutamos esto de manera normal, obtendremos nuestro `coffee`:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: virtuous-mink-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

Ahora, eliminaremos la configuración de bebida favorita de `values.yaml`:

```yaml
favorite:
  #drink: coffee
  food: pizza
```

Ahora volver a ejecutar `helm install --dry-run --debug fair-worm ./mychart`
producirá este YAML:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fair-worm-configmap
data:
  myvalue: "Hello World"
  drink: "tea"
  food: "PIZZA"
```

En un chart real, todos los valores por defecto estáticos deben estar en el
`values.yaml`, y no deben repetirse usando el comando `default` (de lo contrario
serían redundantes). Sin embargo, el comando `default` es perfecto para valores
calculados, que no pueden declararse dentro de `values.yaml`. Por ejemplo:

```yaml
drink: {{ .Values.favorite.drink | default (printf "%s-tea" (include "fullname" .)) }}
```

En algunos lugares, una condición `if` puede ser más adecuada que `default`.
Veremos eso en la siguiente sección.

Las funciones y pipelines de plantilla son una forma poderosa de transformar
información y luego insertarla en su YAML. Pero a veces es necesario agregar
algo de lógica de plantilla que sea un poco más sofisticada que simplemente
insertar una cadena. En la siguiente sección veremos las estructuras de control
proporcionadas por el lenguaje de plantillas.

## Uso de la función `lookup`

La función `lookup` se puede usar para _buscar_ recursos en un clúster en
ejecución. La sinopsis de la función lookup es `lookup apiVersion, kind,
namespace, name -> resource or resource list`.

| parámetro  | tipo   |
|------------|--------|
| apiVersion | string |
| kind       | string |
| namespace  | string |
| name       | string |

Tanto `name` como `namespace` son opcionales y pueden pasarse como una cadena
vacía (`""`). Sin embargo, si está trabajando con un recurso con ámbito de
namespace, tanto `name` como `namespace` deben especificarse.

Las siguientes combinaciones de parámetros son posibles:

| Comportamiento                         | Función lookup                             |
|----------------------------------------|--------------------------------------------|
| `kubectl get pod mypod -n mynamespace` | `lookup "v1" "Pod" "mynamespace" "mypod"`  |
| `kubectl get pods -n mynamespace`      | `lookup "v1" "Pod" "mynamespace" ""`       |
| `kubectl get pods --all-namespaces`    | `lookup "v1" "Pod" "" ""`                  |
| `kubectl get namespace mynamespace`    | `lookup "v1" "Namespace" "" "mynamespace"` |
| `kubectl get namespaces`               | `lookup "v1" "Namespace" "" ""`            |

Cuando `lookup` devuelve un objeto, devolverá un diccionario. Este diccionario
se puede navegar posteriormente para extraer valores específicos.

El siguiente ejemplo devolverá las anotaciones presentes para el objeto
`mynamespace`:

```go
(lookup "v1" "Namespace" "" "mynamespace").metadata.annotations
```

Cuando `lookup` devuelve una lista de objetos, es posible acceder a la lista de
objetos a través del campo `items`:

```go
{{ range $index, $service := (lookup "v1" "Service" "mynamespace" "").items }}
    {{/* do something with each service */}}
{{ end }}
```

Cuando no se encuentra ningún objeto, se devuelve un valor vacío. Esto se puede
usar para verificar la existencia de un objeto.

La función `lookup` usa la configuración de conexión de Kubernetes existente de
Helm para consultar Kubernetes. Si se devuelve algún error al interactuar con
el servidor de API (por ejemplo, debido a falta de permiso para acceder a un
recurso), el procesamiento de plantillas de Helm fallará.

Tenga en cuenta que Helm no está diseñado para contactar al servidor de API de
Kubernetes durante una operación `helm template|install|upgrade|delete|rollback --dry-run`.
Para probar `lookup` contra un clúster en ejecución, debe usar
`helm template|install|upgrade|delete|rollback --dry-run=server` en su lugar,
lo que permite la conexión al clúster.

## Los operadores son funciones

Para las plantillas, los operadores (`eq`, `ne`, `lt`, `gt`, `and`, `or` y
demás) están todos implementados como funciones. En pipelines, las operaciones
se pueden agrupar con paréntesis (`(` y `)`).

Ahora podemos pasar de funciones y pipelines al control de flujo con
condiciones, bucles y modificadores de alcance.
