---
title: Etiquetas y Anotaciones
description: Cubre las mejores prácticas para usar etiquetas y anotaciones en su Chart.
sidebar_position: 5
---

Esta parte de la Guía de Mejores Prácticas cubre las mejores prácticas para usar
etiquetas y anotaciones en su chart.

## ¿Es una Etiqueta o una Anotación?

Un elemento de metadatos debe ser una etiqueta bajo las siguientes condiciones:

- Es utilizado por Kubernetes para identificar este recurso
- Es útil exponerlo a los operadores con el propósito de consultar el sistema.

Por ejemplo, sugerimos usar `helm.sh/chart: NAME-VERSION` como etiqueta para que
los operadores puedan encontrar convenientemente todas las instancias de un chart
en particular.

Si un elemento de metadatos no se usa para consultas, debe establecerse como una
anotación en su lugar.

Los hooks de Helm siempre son anotaciones.

## Etiquetas Estándar

La siguiente tabla define etiquetas comunes que usan los charts de Helm. Helm
en sí nunca requiere que una etiqueta particular esté presente. Las etiquetas
marcadas como REC son recomendadas, y _deberían_ colocarse en un chart para
mantener consistencia global. Las marcadas como OPT son opcionales. Son idiomáticas
o de uso común, pero no se depende de ellas frecuentemente para propósitos
operacionales.

| Nombre | Estado | Descripción |
|--------|--------|-------------|
| `app.kubernetes.io/name` | REC | Debe ser el nombre de la aplicación, reflejando la aplicación completa. Usualmente se usa `{{ template "name" . }}` para esto. Es usado por muchos manifiestos de Kubernetes y no es específico de Helm. |
| `helm.sh/chart` | REC | Debe ser el nombre del chart y la versión: `{{ .Chart.Name }}-{{ .Chart.Version \| replace "+" "_" }}`. |
| `app.kubernetes.io/managed-by` | REC | Siempre debe establecerse como `{{ .Release.Service }}`. Sirve para encontrar todo lo gestionado por Helm. |
| `app.kubernetes.io/instance` | REC | Debe ser `{{ .Release.Name }}`. Ayuda a diferenciar entre diferentes instancias de la misma aplicación. |
| `app.kubernetes.io/version` | OPT | La versión de la aplicación, puede establecerse como `{{ .Chart.AppVersion }}`. |
| `app.kubernetes.io/component` | OPT | Es una etiqueta común para marcar los diferentes roles que pueden desempeñar los componentes en una aplicación. Por ejemplo, `app.kubernetes.io/component: frontend`. |
| `app.kubernetes.io/part-of` | OPT | Cuando se usan múltiples charts o piezas de software juntos para crear una aplicación. Por ejemplo, software de aplicación y una base de datos para producir un sitio web. Puede establecerse con la aplicación de nivel superior que se está soportando. |

Puede encontrar más información sobre las etiquetas de Kubernetes, con el prefijo
`app.kubernetes.io`, en la [documentación de Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/).
