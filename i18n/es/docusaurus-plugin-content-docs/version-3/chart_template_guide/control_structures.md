---
title: Control de Flujo
description: Una descripción rápida de la estructura de flujo dentro de las plantillas.
sidebar_position: 7
---

Las estructuras de control (llamadas "acciones" en la terminología de plantillas)
le permiten, como autor de plantillas, controlar el flujo de generación de una
plantilla. El lenguaje de plantillas de Helm proporciona las siguientes
estructuras de control:

- `if`/`else` para crear bloques condicionales
- `with` para especificar un ámbito
- `range`, que proporciona un bucle de estilo "for each"

Además de estas, proporciona algunas acciones para declarar y usar segmentos de
plantilla con nombre:

- `define` declara una nueva plantilla con nombre dentro de su plantilla
- `template` importa una plantilla con nombre
- `block` declara un tipo especial de área de plantilla rellenable

En esta sección, hablaremos sobre `if`, `with` y `range`. Los otros se cubren en
la sección "Plantillas con Nombre" más adelante en esta guía.

## If/Else

La primera estructura de control que veremos es para incluir condicionalmente
bloques de texto en una plantilla. Este es el bloque `if`/`else`.

La estructura básica de un condicional se ve así:

```
{{ if PIPELINE }}
  # Do something
{{ else if OTHER PIPELINE }}
  # Do something else
{{ else }}
  # Default case
{{ end }}
```

Observe que ahora estamos hablando de _pipelines_ en lugar de valores. Esto es
para aclarar que las estructuras de control pueden ejecutar un pipeline
completo, no solo evaluar un valor.

Un pipeline se evalúa como _falso_ si el valor es:

- un booleano falso
- un cero numérico
- una cadena vacía
- un `nil` (vacío o nulo)
- una colección vacía (`map`, `slice`, `tuple`, `dict`, `array`)

En todas las demás condiciones, la condición es verdadera.

Agreguemos un condicional simple a nuestro ConfigMap. Añadiremos otra
configuración si la bebida está establecida como coffee:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}mug: "true"{{ end }}
```

Como comentamos `drink: coffee` en nuestro último ejemplo, la salida no debería
incluir una bandera `mug: "true"`. Pero si agregamos esa línea de nuevo a
nuestro archivo `values.yaml`, la salida debería verse así:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

## Control de Espacios en Blanco

Mientras observamos los condicionales, deberíamos echar un vistazo rápido a
cómo se controlan los espacios en blanco en las plantillas. Tomemos el ejemplo
anterior y formatémoslo para que sea un poco más fácil de leer:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
    mug: "true"
  {{ end }}
```

Inicialmente, esto se ve bien. Pero si lo ejecutamos a través del motor de
plantillas, obtendremos un resultado desafortunado:

```console
$ helm install --dry-run --debug ./mychart
SERVER: "localhost:44134"
CHART PATH: /Users/mattbutcher/Code/Go/src/helm.sh/helm/_scratch/mychart
Error: YAML parse error on mychart/templates/configmap.yaml: error converting YAML to JSON: yaml: line 9: did not find expected key
```

¿Qué pasó? Generamos YAML incorrecto debido a los espacios en blanco anteriores.

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eyewitness-elk-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
    mug: "true"
```

`mug` tiene una sangría incorrecta. Simplemente quitemos la sangría de esa línea
y volvamos a ejecutar:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{ if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{ end }}
```

Cuando enviemos eso, obtendremos YAML válido, pero que todavía se ve un poco
extraño:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: telling-chimp-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"

  mug: "true"

```

Observe que recibimos algunas líneas vacías en nuestro YAML. ¿Por qué? Cuando el
motor de plantillas se ejecuta, _elimina_ el contenido dentro de `{{` y `}}`,
pero deja el resto de los espacios en blanco exactamente como está.

YAML asigna significado a los espacios en blanco, por lo que gestionar los
espacios en blanco se vuelve bastante importante. Afortunadamente, las
plantillas de Helm tienen algunas herramientas para ayudar.

Primero, la sintaxis de llaves de las declaraciones de plantilla se puede
modificar con caracteres especiales para indicar al motor de plantillas que
recorte los espacios en blanco. `{{- ` (con el guion y el espacio agregados)
indica que se deben recortar los espacios en blanco a la izquierda, mientras que
` -}}` significa que se deben consumir los espacios en blanco a la derecha.
_¡Tenga cuidado! ¡Los saltos de línea también son espacios en blanco!_

> Asegúrese de que haya un espacio entre el `-` y el resto de su directiva.
> `{{- 3 }}` significa "recortar espacios en blanco a la izquierda e imprimir 3"
> mientras que `{{-3 }}` significa "imprimir -3".

Usando esta sintaxis, podemos modificar nuestra plantilla para eliminar esas
nuevas líneas:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"
  {{- end }}
```

Para ilustrar este punto, ajustemos lo anterior y sustituyamos un `*` por cada
espacio en blanco que se eliminará siguiendo esta regla. Un `*` al final de la
línea indica un carácter de nueva línea que se eliminaría

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | default "tea" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}*
**{{- if eq .Values.favorite.drink "coffee" }}
  mug: "true"*
**{{- end }}

```

Teniendo eso en cuenta, podemos ejecutar nuestra plantilla a través de Helm y
ver el resultado:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: clunky-cat-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  mug: "true"
```

Tenga cuidado con los modificadores de recorte. Es fácil hacer accidentalmente
cosas como esta:

```yaml
  food: {{ .Values.favorite.food | upper | quote }}
  {{- if eq .Values.favorite.drink "coffee" -}}
  mug: "true"
  {{- end -}}

```

Eso producirá `food: "PIZZA"mug: "true"` porque consume las nuevas líneas en
ambos lados.

> Para obtener detalles sobre el control de espacios en blanco en plantillas,
> consulte la [documentación oficial de plantillas de
> Go](https://godoc.org/text/template)

Finalmente, a veces es más fácil indicarle al sistema de plantillas cómo debe
aplicar la sangría en lugar de intentar dominar el espaciado de las directivas
de plantilla. Por esa razón, puede que a veces le resulte útil usar la función
`indent` (`{{ indent 2 "mug:true" }}`).

## Modificar el ámbito usando `with`

La siguiente estructura de control a analizar es la acción `with`. Esta controla
el ámbito de las variables. Recuerde que `.` es una referencia al _ámbito
actual_. Por lo tanto, `.Values` le indica a la plantilla que busque el objeto
`Values` en el ámbito actual.

La sintaxis de `with` es similar a una declaración `if` simple:

```
{{ with PIPELINE }}
  # restricted scope
{{ end }}
```

Los ámbitos se pueden cambiar. `with` le permite establecer el ámbito actual
(`.`) a un objeto particular. Por ejemplo, hemos estado trabajando con
`.Values.favorite`. Reescribamos nuestro ConfigMap para alterar el ámbito `.`
para que apunte a `.Values.favorite`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
```

Tenga en cuenta que eliminamos el condicional `if` del ejercicio anterior porque
ahora es innecesario - el bloque después de `with` solo se ejecuta si el valor
de `PIPELINE` no está vacío.

Observe que ahora podemos hacer referencia a `.drink` y `.food` sin calificarlos.
Esto se debe a que la declaración `with` establece `.` para que apunte a
`.Values.favorite`. El `.` se restablece a su ámbito anterior después de
`{{ end }}`.

Pero aquí hay una nota de precaución: Dentro del ámbito restringido, no podrá
acceder a los otros objetos del ámbito padre usando `.`. Por ejemplo, esto
fallará:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

Producirá un error porque `Release.Name` no está dentro del ámbito restringido
para `.`. Sin embargo, si intercambiamos las dos últimas líneas, todo funcionará
como se espera porque el ámbito se restablece después de `{{ end }}`.

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  release: {{ .Release.Name }}
```

O bien, podemos usar `$` para acceder al objeto `Release.Name` desde el ámbito
padre. `$` se asigna al ámbito raíz cuando comienza la ejecución de la plantilla
y no cambia durante la ejecución de la misma. Lo siguiente también funcionaría:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $.Release.Name }}
  {{- end }}
```

Después de ver `range`, examinaremos las variables de plantilla, que ofrecen una
solución al problema de ámbito anterior.

## Iterando con la acción `range`

Muchos lenguajes de programación tienen soporte para iterar usando bucles `for`,
bucles `foreach` o mecanismos funcionales similares. En el lenguaje de
plantillas de Helm, la forma de iterar a través de una colección es usar el
operador `range`.

Para comenzar, agreguemos una lista de ingredientes de pizza a nuestro archivo
`values.yaml`:

```yaml
favorite:
  drink: coffee
  food: pizza
pizzaToppings:
  - mushrooms
  - cheese
  - peppers
  - onions
  - pineapple
```

Ahora tenemos una lista (llamada `slice` en plantillas) de `pizzaToppings`.
Podemos modificar nuestra plantilla para imprimir esta lista en nuestro
ConfigMap:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  {{- end }}
  toppings: |-
    {{- range .Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}

```

Podemos usar `$` para acceder a la lista `Values.pizzaToppings` desde el ámbito
padre. `$` se asigna al ámbito raíz cuando comienza la ejecución de la plantilla
y no cambia durante la ejecución de la misma. Lo siguiente también funcionaría:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  toppings: |-
    {{- range $.Values.pizzaToppings }}
    - {{ . | title | quote }}
    {{- end }}
  {{- end }}
```

Examinemos más de cerca la lista `toppings:`. La función `range` "recorrerá"
(iterará a través de) la lista `pizzaToppings`. Pero ahora sucede algo
interesante. Al igual que `with` establece el ámbito de `.`, también lo hace un
operador `range`. Cada vez que pasa por el bucle, `.` se establece en el
ingrediente de pizza actual. Es decir, la primera vez, `.` se establece en
`mushrooms`. En la segunda iteración se establece en `cheese`, y así
sucesivamente.

Podemos enviar el valor de `.` directamente a través de un pipeline, así que
cuando hacemos `{{ . | title | quote }}`, enviamos `.` a `title` (función de
capitalización de título) y luego a `quote`. Si ejecutamos esta plantilla, la
salida será:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: edgy-dragonfly-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  toppings: |-
    - "Mushrooms"
    - "Cheese"
    - "Peppers"
    - "Onions"
    - "Pineapple"
```

Ahora, en este ejemplo hemos hecho algo ingenioso. La línea `toppings: |-`
declara una cadena multilínea. Así que nuestra lista de ingredientes en realidad
no es una lista YAML. Es una gran cadena. ¿Por qué haríamos esto? Porque los
datos en el campo `data` de ConfigMaps están compuestos por pares clave/valor,
donde tanto la clave como el valor son cadenas simples. Para entender por qué
este es el caso, consulte la [documentación de ConfigMap de
Kubernetes](https://kubernetes.io/docs/concepts/configuration/configmap/).
Sin embargo, para nosotros, este detalle no importa mucho.

> El marcador `|-` en YAML toma una cadena multilínea. Esta puede ser una técnica
> útil para incrustar grandes bloques de datos dentro de sus manifiestos, como
> se ejemplifica aquí.

A veces es útil poder crear rápidamente una lista dentro de su plantilla y luego
iterar sobre esa lista. Las plantillas de Helm tienen una función para facilitar
esto: `tuple`. En ciencias de la computación, una tupla es una colección similar
a una lista de tamaño fijo, pero con tipos de datos arbitrarios. Esto transmite
aproximadamente la forma en que se usa un `tuple`.

```yaml
  sizes: |-
    {{- range tuple "small" "medium" "large" }}
    - {{ . }}
    {{- end }}
```

Lo anterior producirá esto:

```yaml
  sizes: |-
    - small
    - medium
    - large
```

Además de listas y tuplas, `range` se puede usar para iterar sobre colecciones
que tienen una clave y un valor (como un `map` o `dict`). Veremos cómo hacer
esto en la siguiente sección cuando introduzcamos las variables de plantilla.
