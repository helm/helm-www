---
title: Convenciones Generales
description: Convenciones generales para charts.
sidebar_position: 1
---

Esta parte de la Guía de Mejores Prácticas explica las convenciones generales.

## Nombres de Charts

Los nombres de los charts deben ser letras minúsculas y números. Las palabras
_pueden_ separarse con guiones (-):

Ejemplos:

```
drupal
nginx-lego
aws-cluster-autoscaler
```

No se pueden usar letras mayúsculas ni guiones bajos en los nombres de charts.
Los puntos no deben usarse en los nombres de charts.

## Números de Versión

Siempre que sea posible, Helm usa [SemVer 2](https://semver.org) para representar
números de versión. (Tenga en cuenta que las etiquetas de imágenes de Docker no
necesariamente siguen SemVer, y por lo tanto se consideran una desafortunada
excepción a la regla.)

Cuando las versiones SemVer se almacenan en etiquetas de Kubernetes, convencionalmente
se cambia el carácter `+` por un carácter `_`, ya que las etiquetas no permiten el
signo `+` como valor.

## Formato de YAML

Los archivos YAML deben indentarse usando _dos espacios_ (y nunca tabulaciones).

## Uso de las Palabras Helm y Chart

Existen algunas convenciones para el uso de las palabras _Helm_ y _helm_.

- _Helm_ se refiere al proyecto en su totalidad
- `helm` se refiere al comando del lado del cliente
- El término `chart` no necesita ser capitalizado, ya que no es un nombre propio
- Sin embargo, `Chart.yaml` sí necesita ser capitalizado porque el nombre del
  archivo distingue entre mayúsculas y minúsculas

Cuando tenga dudas, use _Helm_ (con 'H' mayúscula).

## Plantillas de Chart y Namespace

Evite definir la propiedad `namespace` en la sección `metadata` de sus plantillas
de chart. El namespace para aplicar las plantillas renderizadas debe especificarse
en la llamada a un cliente de Kubernetes mediante un flag como `--namespace`.
Helm renderiza sus plantillas tal cual y las envía al cliente de Kubernetes, ya
sea Helm mismo u otro programa (kubectl, flux, spinnaker, etc).
