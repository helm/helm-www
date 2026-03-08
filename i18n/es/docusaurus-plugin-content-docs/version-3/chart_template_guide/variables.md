---
title: Variables
description: Uso de variables en plantillas.
sidebar_position: 8
---

Con funciones, pipelines, objetos y estructuras de control ya dominados, podemos
abordar una de las ideas más básicas en muchos lenguajes de programación: las
variables. En las plantillas, se usan con menos frecuencia. Pero veremos cómo
usarlas para simplificar el código y aprovechar mejor `with` y `range`.

En un ejemplo anterior, vimos que este código fallará:

```yaml
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ .Release.Name }}
  {{- end }}
```

`Release.Name` no está dentro del ámbito restringido en el bloque `with`.
Una forma de solucionar los problemas de ámbito es asignar objetos a variables
a las que se puede acceder independientemente del ámbito actual.

En las plantillas de Helm, una variable es una referencia con nombre a otro
objeto. Sigue la forma `$nombre`. Las variables se asignan con un operador de
asignación especial: `:=`. Podemos reescribir lo anterior para usar una variable
para `Release.Name`.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- $relname := .Release.Name -}}
  {{- with .Values.favorite }}
  drink: {{ .drink | default "tea" | quote }}
  food: {{ .food | upper | quote }}
  release: {{ $relname }}
  {{- end }}
```

Observe que antes de comenzar el bloque `with`, asignamos `$relname :=
.Release.Name`. Ahora, dentro del bloque `with`, la variable `$relname` todavía
apunta al nombre del release.

Ejecutar eso producirá lo siguiente:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: viable-badger-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
  release: viable-badger
```

Las variables son particularmente útiles en los bucles `range`. Se pueden usar
en objetos tipo lista para capturar tanto el índice como el valor:

```yaml
  toppings: |-
    {{- range $index, $topping := .Values.pizzaToppings }}
      {{ $index }}: {{ $topping }}
    {{- end }}

```

Tenga en cuenta que `range` va primero, luego las variables, luego el operador
de asignación y finalmente la lista. Esto asignará el índice entero (comenzando
desde cero) a `$index` y el valor a `$topping`. Ejecutarlo producirá:

```yaml
  toppings: |-
      0: mushrooms
      1: cheese
      2: peppers
      3: onions
```

Para estructuras de datos que tienen tanto una clave como un valor, podemos usar
`range` para obtener ambos. Por ejemplo, podemos recorrer `.Values.favorite`
de esta manera:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  {{- range $key, $val := .Values.favorite }}
  {{ $key }}: {{ $val | quote }}
  {{- end }}
```

Ahora, en la primera iteración, `$key` será `drink` y `$val` será `coffee`,
y en la segunda, `$key` será `food` y `$val` será `pizza`. Ejecutar lo anterior
generará esto:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: eager-rabbit-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "pizza"
```

Las variables normalmente no son "globales". Tienen un ámbito limitado al bloque
en el que se declaran. Anteriormente, asignamos `$relname` en el nivel superior
de la plantilla. Esa variable estará en el ámbito de toda la plantilla. Pero en
nuestro último ejemplo, `$key` y `$val` solo estarán en el ámbito dentro del
bloque `{{ range... }}{{ end }}`.

Sin embargo, hay una variable que siempre apuntará al contexto raíz: `$`.
Esto puede ser muy útil cuando está iterando en un range y necesita conocer
el nombre del release del chart.

Un ejemplo que ilustra esto:
```yaml
{{- range .Values.tlsSecrets }}
---
apiVersion: v1
kind: Secret
metadata:
  name: {{ .name }}
  labels:
    # Muchas plantillas de helm usarían `.` a continuación, pero eso no funcionará,
    # sin embargo `$` funcionará aquí
    app.kubernetes.io/name: {{ template "fullname" $ }}
    # No puedo referenciar .Chart.Name, pero puedo hacer $.Chart.Name
    helm.sh/chart: "{{ $.Chart.Name }}-{{ $.Chart.Version }}"
    app.kubernetes.io/instance: "{{ $.Release.Name }}"
    # Valor de appVersion en Chart.yaml
    app.kubernetes.io/version: "{{ $.Chart.AppVersion }}"
    app.kubernetes.io/managed-by: "{{ $.Release.Service }}"
type: kubernetes.io/tls
data:
  tls.crt: {{ .certificate }}
  tls.key: {{ .key }}
{{- end }}
```

Hasta ahora hemos visto solo una plantilla declarada en un solo archivo. Pero una
de las características más poderosas del lenguaje de plantillas de Helm es su
capacidad para declarar múltiples plantillas y usarlas juntas. Lo veremos en la
siguiente sección.
