---
title: Plantillas
description: Mejores prácticas para trabajar con plantillas.
sidebar_position: 3
---

Esta parte de la Guía de Mejores Prácticas se enfoca en plantillas.

## Estructura de `templates/`

El directorio `templates/` debe estructurarse de la siguiente manera:

- Los archivos de plantilla deben tener la extensión `.yaml` si producen salida
  YAML. La extensión `.tpl` puede usarse para archivos de plantilla que no
  producen contenido con formato.
- Los nombres de archivos de plantilla deben usar notación con guiones
  (`my-example-configmap.yaml`), no camelCase.
- Cada definición de recurso debe estar en su propio archivo de plantilla.
- Los nombres de archivos de plantilla deben reflejar el tipo de recurso en el
  nombre, por ejemplo: `foo-pod.yaml`, `bar-svc.yaml`

## Nombres de Plantillas Definidas

Las plantillas definidas (plantillas creadas dentro de una directiva `{{ define }}`)
son accesibles globalmente. Esto significa que un chart y todos sus subcharts
tendrán acceso a todas las plantillas creadas con `{{ define }}`.

Por esa razón, _todos los nombres de plantillas definidas deben incluir un prefijo
de espacio de nombres (namespace)._

Correcto:

```yaml
{{- define "nginx.fullname" }}
{{/* ... */}}
{{ end -}}
```

Incorrecto:

```yaml
{{- define "fullname" -}}
{{/* ... */}}
{{ end -}}
```
Se recomienda encarecidamente que los nuevos charts se creen mediante el comando
`helm create`, ya que los nombres de las plantillas se definen automáticamente
según esta mejor práctica.

## Formato de Plantillas

Las plantillas deben indentarse usando _dos espacios_ (nunca tabulaciones).

Las directivas de plantilla deben tener espacio en blanco después de las llaves
de apertura y antes de las llaves de cierre:

Correcto:
```
{{ .foo }}
{{ print "foo" }}
{{- print "bar" -}}
```

Incorrecto:
```
{{.foo}}
{{print "foo"}}
{{-print "bar"-}}
```

Las plantillas deben recortar espacios en blanco donde sea posible:

```yaml
foo:
  {{- range .Values.items }}
  {{ . }}
  {{ end -}}
```

Los bloques (como las estructuras de control) pueden indentarse para indicar el
flujo del código de la plantilla.

```
{{ if $foo -}}
  {{- with .Bar }}Hello{{ end -}}
{{- end -}}
```

Sin embargo, dado que YAML es un lenguaje orientado a espacios en blanco, a
menudo no es posible que la indentación del código siga esa convención.

## Espacios en Blanco en Plantillas Generadas

Es preferible mantener la cantidad de espacios en blanco en las plantillas
generadas al mínimo. En particular, no deben aparecer numerosas líneas en blanco
adyacentes entre sí. Pero líneas vacías ocasionales (particularmente entre
secciones lógicas) están bien.

Esto es lo mejor:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example
  labels:
    first: first
    second: second
```

Esto está bien:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example

  labels:
    first: first
    second: second

```

Pero esto debe evitarse:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example





  labels:
    first: first

    second: second

```

## Comentarios (Comentarios YAML vs. Comentarios de Plantilla)

Tanto YAML como las plantillas de Helm tienen marcadores de comentarios.

Comentarios YAML:
```yaml
# Esto es un comentario
type: sprocket
```

Comentarios de Plantilla:
```yaml
{{- /*
Esto es un comentario.
*/}}
type: frobnitz
```

Los comentarios de plantilla deben usarse para documentar características de una
plantilla, como explicar una plantilla definida:

```yaml
{{- /*
mychart.shortname proporciona una versión truncada de 6 caracteres del nombre del release.
*/}}
{{ define "mychart.shortname" -}}
{{ .Release.Name | trunc 6 }}
{{- end -}}

```

Dentro de las plantillas, los comentarios YAML pueden usarse cuando es útil que
los usuarios de Helm (posiblemente) vean los comentarios durante la depuración.

```yaml
# Esto puede causar problemas si el valor es mayor que 100Gi
memory: {{ .Values.maxMem | quote }}
```

El comentario anterior es visible cuando el usuario ejecuta `helm install --debug`,
mientras que los comentarios especificados en secciones `{{- /* */}}` no lo son.

Tenga cuidado al agregar comentarios YAML `#` en secciones de plantilla que
contengan values de Helm que pueden ser requeridos por ciertas funciones de
plantilla.

Por ejemplo, si la función `required` se introduce en el ejemplo anterior y
`maxMem` no está establecido, entonces un comentario YAML `#` introducirá un
error de renderizado.

Correcto: `helm template` no renderiza este bloque
```yaml
{{- /*
# Esto puede causar problemas si el valor es mayor que 100Gi
memory: {{ required "maxMem must be set" .Values.maxMem | quote }}
*/ -}}
```

Incorrecto: `helm template` devuelve `Error: execution error at (templates/test.yaml:2:13): maxMem must be set`
```yaml
# Esto puede causar problemas si el valor es mayor que 100Gi
# memory: {{ required .Values.maxMem "maxMem must be set" | quote }}
```

Revise [Depuración de Plantillas](../chart_template_guide/debugging.md) para
otro ejemplo de este comportamiento de cómo los comentarios YAML permanecen
intactos.

## Uso de JSON en Plantillas y Salida de Plantillas

YAML es un superconjunto de JSON. En algunos casos, usar sintaxis JSON puede ser
más legible que otras representaciones YAML.

Por ejemplo, este YAML está más cerca del método normal de YAML para expresar
listas:

```yaml
arguments:
  - "--dirname"
  - "/foo"
```

Pero es más fácil de leer cuando se colapsa en un estilo de lista JSON:

```yaml
arguments: ["--dirname", "/foo"]
```

Usar JSON para mejorar la legibilidad es bueno. Sin embargo, la sintaxis JSON
no debe usarse para representar estructuras más complejas.

Al trabajar con JSON puro incrustado dentro de YAML (como la configuración de
contenedores init), es apropiado usar el formato JSON.
