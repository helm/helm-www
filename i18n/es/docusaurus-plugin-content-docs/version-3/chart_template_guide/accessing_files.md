---
title: Acceso a Archivos en las Plantillas
description: Cómo acceder a archivos desde dentro de una plantilla.
sidebar_position: 10
---

En la sección anterior vimos varias formas de crear y acceder a plantillas con
nombre. Esto facilita importar una plantilla desde dentro de otra plantilla.
Pero a veces es deseable importar un _archivo que no es una plantilla_ e
inyectar su contenido sin enviarlo a través del renderizador de plantillas.

Helm proporciona acceso a archivos a través del objeto `.Files`. Antes de
continuar con los ejemplos de plantillas, hay algunas cosas que tener en cuenta
sobre cómo funciona esto:

- Puede agregar archivos adicionales a su chart de Helm. Estos archivos se
  empaquetarán junto con el chart. Sin embargo, tenga cuidado: los charts deben
  ser menores de 1M debido a las limitaciones de almacenamiento de los objetos
  de Kubernetes.
- No se puede acceder a algunos archivos a través del objeto `.Files`,
  generalmente por razones de seguridad.
  - No se puede acceder a los archivos en `templates/`.
  - No se puede acceder a los archivos excluidos usando `.helmignore`.
  - No se puede acceder a archivos fuera de un [subchart](./subcharts_and_globals.md) de una aplicación Helm, incluyendo los del padre.
- Los charts no preservan la información del modo UNIX, por lo que los permisos
  a nivel de archivo no tendrán impacto en la disponibilidad de un archivo
  cuando se trata del objeto `.Files`.

<!-- (see https://github.com/jonschlinkert/markdown-toc) -->

<!-- toc -->

- [Ejemplo básico](#ejemplo-básico)
- [Helpers de ruta](#helpers-de-ruta)
- [Patrones glob](#patrones-glob)
- [Funciones de utilidad para ConfigMap y Secrets](#funciones-de-utilidad-para-configmap-y-secrets)
- [Codificación](#codificación)
- [Líneas](#líneas)

<!-- tocstop -->

## Ejemplo básico

Con estas consideraciones en mente, escribamos una plantilla que lea tres
archivos en nuestro ConfigMap. Para empezar, agregaremos tres archivos al chart,
colocando los tres directamente dentro del directorio `mychart/`.

`config1.toml`:

```toml
message = "Hello from config 1"
```

`config2.toml`:

```toml
message = "This is config 2"
```

`config3.toml`:

```toml
message = "Goodbye from config 3"
```

Cada uno de estos es un archivo TOML simple (piense en los archivos INI de
Windows antiguos). Conocemos los nombres de estos archivos, así que podemos usar
una función `range` para recorrerlos e inyectar su contenido en nuestro
ConfigMap.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  {{- $files := .Files }}
  {{- range tuple "config1.toml" "config2.toml" "config3.toml" }}
  {{ . }}: |-
    {{ $files.Get . }}
  {{- end }}
```

Este ConfigMap utiliza varias de las técnicas discutidas en secciones
anteriores. Por ejemplo, creamos una variable `$files` para mantener una
referencia al objeto `.Files`. También usamos la función `tuple` para crear una
lista de archivos que recorremos. Luego imprimimos cada nombre de archivo
(`{{ . }}: |-`) seguido del contenido del archivo `{{ $files.Get . }}`.

Ejecutar esta plantilla producirá un único ConfigMap con el contenido de los
tres archivos:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: quieting-giraf-configmap
data:
  config1.toml: |-
    message = "Hello from config 1"

  config2.toml: |-
    message = "This is config 2"

  config3.toml: |-
    message = "Goodbye from config 3"
```

## Helpers de ruta

Al trabajar con archivos, puede ser muy útil realizar algunas operaciones
estándar sobre las rutas de archivos. Para ayudar con esto, Helm importa muchas
de las funciones del paquete [path](https://golang.org/pkg/path/) de Go para su
uso. Todas son accesibles con los mismos nombres que en el paquete de Go, pero
con la primera letra en minúscula. Por ejemplo, `Base` se convierte en `base`,
etc.

Las funciones importadas son:
- Base
- Dir
- Ext
- IsAbs
- Clean

## Patrones glob

A medida que su chart crece, puede encontrar que tiene una mayor necesidad de
organizar sus archivos, por lo que proporcionamos un método
`Files.Glob(pattern string)` para ayudar a extraer ciertos archivos con toda la
flexibilidad de los [patrones glob](https://godoc.org/github.com/gobwas/glob).

`.Glob` devuelve un tipo `Files`, por lo que puede llamar a cualquiera de los
métodos de `Files` en el objeto devuelto.

Por ejemplo, imagine la siguiente estructura de directorios:

```
foo/:
  foo.txt foo.yaml

bar/:
  bar.go bar.conf baz.yaml
```

Tiene múltiples opciones con Globs:


```yaml
{{ $currentScope := .}}
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
    {{- with $currentScope}}
        {{ .Files.Get $path }}
    {{- end }}
{{ end }}
```

O

```yaml
{{ range $path, $_ :=  .Files.Glob  "**.yaml" }}
      {{ $.Files.Get $path }}
{{ end }}
```

## Funciones de utilidad para ConfigMap y Secrets

(Disponible en Helm 2.0.2 y posterior)

Es muy común querer colocar el contenido de archivos tanto en ConfigMaps como en
Secrets, para montarlos en sus pods en tiempo de ejecución. Para ayudar con
esto, proporcionamos un par de métodos de utilidad en el tipo `Files`.

Para una mayor organización, es especialmente útil usar estos métodos en
conjunto con el método `Glob`.

Dada la estructura de directorios del ejemplo de [Glob](#patrones-glob)
anterior:

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: conf
data:
{{ (.Files.Glob "foo/*").AsConfig | indent 2 }}
---
apiVersion: v1
kind: Secret
metadata:
  name: very-secret
type: Opaque
data:
{{ (.Files.Glob "bar/*").AsSecrets | indent 2 }}
```

## Codificación

Puede importar un archivo y hacer que la plantilla lo codifique en base-64 para
asegurar una transmisión exitosa:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ .Release.Name }}-secret
type: Opaque
data:
  token: |-
    {{ .Files.Get "config1.toml" | b64enc }}
```

El ejemplo anterior tomará el mismo archivo `config1.toml` que usamos antes y lo
codificará:

```yaml
# Source: mychart/templates/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: lucky-turkey-secret
type: Opaque
data:
  token: |-
    bWVzc2FnZSA9ICJIZWxsbyBmcm9tIGNvbmZpZyAxIgo=
```

## Líneas

A veces es deseable acceder a cada línea de un archivo en su plantilla.
Proporcionamos un método conveniente `Lines` para esto.

Puede recorrer `Lines` usando una función `range`:

```yaml
data:
  some-file.txt: {{ range .Files.Lines "foo/bar.txt" }}
    {{ . }}{{ end }}
```

No hay forma de pasar archivos externos al chart durante `helm install`. Por lo
tanto, si está pidiendo a los usuarios que proporcionen datos, estos deben
cargarse usando `helm install -f` o `helm install --set`.

Esta discusión concluye nuestra inmersión en las herramientas y técnicas para
escribir plantillas de Helm. En la siguiente sección veremos cómo puede usar un
archivo especial, `templates/NOTES.txt`, para enviar instrucciones
post-instalación a los usuarios de su chart.
