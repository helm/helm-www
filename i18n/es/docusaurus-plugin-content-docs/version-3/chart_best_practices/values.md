---
title: Valores
description: Se enfoca en cómo debe estructurar y usar sus values.
sidebar_position: 2
---

Esta parte de la guía de mejores prácticas cubre el uso de values. En esta sección,
ofrecemos recomendaciones sobre cómo estructurar y usar sus values, con énfasis
en el diseño del archivo `values.yaml` de un chart.

## Convenciones de Nomenclatura

Los nombres de variables deben comenzar con una letra minúscula y las palabras
deben separarse con camelCase:

Correcto:

```yaml
chicken: true
chickenNoodleSoup: true
```

Incorrecto:

```yaml
Chicken: true  # las mayúsculas iniciales pueden entrar en conflicto con las variables integradas
chicken-noodle-soup: true # no use guiones en el nombre
```

Tenga en cuenta que todas las variables integradas de Helm comienzan con una
letra mayúscula para distinguirlas fácilmente de los values definidos por el
usuario: `.Release.Name`, `.Capabilities.KubeVersion`.

## Values Planos o Anidados

YAML es un formato flexible, y los values pueden estar profundamente anidados
o ser planos.

Anidado:

```yaml
server:
  name: nginx
  port: 80
```

Plano:

```yaml
serverName: nginx
serverPort: 80
```

En la mayoría de los casos, se prefiere el formato plano sobre el anidado. Esto
se debe a que es más simple para los desarrolladores de plantillas y los usuarios.

Para una seguridad óptima, un value anidado debe verificarse en cada nivel:

```
{{ if .Values.server }}
  {{ default "none" .Values.server.name }}
{{ end }}
```

Por cada nivel de anidamiento, se debe realizar una verificación de existencia.
Pero para la configuración plana, estas verificaciones pueden omitirse, haciendo
la plantilla más fácil de leer y usar.

```
{{ default "none" .Values.serverName }}
```

Cuando hay una gran cantidad de variables relacionadas, y al menos una de ellas
es requerida, los values anidados pueden usarse para mejorar la legibilidad.

## Haga los Tipos Explícitos

Las reglas de conversión de tipos de YAML a veces son poco intuitivas. Por ejemplo,
`foo: false` no es lo mismo que `foo: "false"`. Los enteros grandes como
`foo: 12345678` se convertirán a notación científica en algunos casos.

La forma más fácil de evitar errores de conversión de tipos es ser explícito con
las cadenas e implícito con todo lo demás. O, en resumen, _entrecomille todas
las cadenas_.

A menudo, para evitar problemas de conversión de enteros, es ventajoso almacenar
sus enteros como cadenas también, y usar `{{ int $value }}` en la plantilla para
convertir de cadena a entero.

En la mayoría de los casos, las etiquetas de tipo explícitas son respetadas, por
lo que `foo: !!string 1234` tratará `1234` como una cadena. _Sin embargo_, el
analizador de YAML consume las etiquetas, por lo que la información de tipo se
pierde después de un análisis.

## Considere Cómo los Usuarios Usarán sus Values

Hay tres fuentes potenciales de values:

- El archivo `values.yaml` del chart
- Un archivo values proporcionado por `helm install -f` o `helm upgrade -f`
- Los values pasados con la opción `--set` o `--set-string` en `helm install` o
  `helm upgrade`

Al diseñar la estructura de sus values, tenga en cuenta que los usuarios de su
chart pueden querer sobrescribirlos mediante la opción `-f` o con la opción `--set`.

Dado que `--set` es menos expresivo, la primera recomendación para escribir su
archivo `values.yaml` es _facilitar la sobrescritura desde `--set`_.

Por esta razón, a menudo es mejor estructurar su archivo values usando mapas.

Difícil de usar con `--set`:

```yaml
servers:
  - name: foo
    port: 80
  - name: bar
    port: 81
```

Lo anterior no puede expresarse con `--set` en Helm `<=2.4`. En Helm 2.5, acceder
al puerto de foo es `--set servers[0].port=80`. No solo es más difícil para el
usuario descubrirlo, sino que es propenso a errores si en algún momento posterior
se cambia el orden de `servers`.

Fácil de usar:

```yaml
servers:
  foo:
    port: 80
  bar:
    port: 81
```

Acceder al puerto de foo es mucho más obvio: `--set servers.foo.port=80`.

## Documente `values.yaml`

Cada propiedad definida en `values.yaml` debe documentarse. La cadena de
documentación debe comenzar con el nombre de la propiedad que describe y luego
proporcionar al menos una descripción de una oración.

Incorrecto:

```yaml
# el nombre del host para el servidor web
serverHost: example
serverPort: 9191
```

Correcto:

```yaml
# serverHost es el nombre del host para el servidor web
serverHost: example
# serverPort es el puerto de escucha HTTP para el servidor web
serverPort: 9191
```

Comenzar cada comentario con el nombre del parámetro que documenta facilita la
búsqueda de documentación con grep y permitirá que las herramientas de
documentación correlacionen de manera confiable las cadenas de documentación
con los parámetros que describen.
