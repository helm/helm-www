---
title: "Política de Calendario de Releases"
description: "Describe la política de calendario de releases de Helm."
---

Para beneficio de sus usuarios, Helm define y anuncia las fechas de release con
anticipación. Este documento describe la política que rige el calendario de
releases de Helm.

## Calendario de Releases

Puede consultar un calendario público con los próximos releases de Helm
[aquí](https://helm.sh/calendar/release).

## Versionado Semántico

Las versiones de Helm se expresan como `x.y.z`, donde `x` es la versión mayor,
`y` es la versión menor y `z` es la versión de parche, siguiendo la terminología
de [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

## Releases de Parche

Los releases de parche proporcionan a los usuarios correcciones de errores y
correcciones de seguridad. No contienen nuevas funcionalidades.

Normalmente, se realizará un nuevo release de parche relacionado con el último
release menor/mayor una vez al mes, el segundo miércoles de cada mes.

Se puede realizar un release de parche para corregir una regresión de alta
prioridad o un problema de seguridad en cualquier momento que sea necesario.

Un release de parche se cancelará por cualquiera de las siguientes razones:
- si no hay contenido nuevo desde el release anterior
- si la fecha del release de parche cae dentro de la semana anterior al primer release candidate (RC1) de un próximo release menor
- si la fecha del release de parche cae dentro de las cuatro semanas siguientes a un release menor

## Releases Menores

Los releases menores contienen correcciones de seguridad y errores, así como
nuevas funcionalidades. Son compatibles con versiones anteriores en cuanto a la
API y el uso del CLI.

Para alinearse con los releases de Kubernetes, se realizará un release menor de
Helm cada 4 meses (3 releases al año).

Se pueden realizar releases menores adicionales si es necesario, pero esto no
afectará el cronograma de un release futuro anunciado, a menos que falten menos
de 7 días para el release anunciado.

Al mismo tiempo que se publica un release, se anunciará la fecha del próximo
release menor y se publicará en la página web principal de Helm.

## Releases Mayores

Los releases mayores contienen cambios incompatibles. Estos releases son poco
frecuentes, pero a veces son necesarios para permitir que Helm continúe
evolucionando en nuevas direcciones importantes.

Los releases mayores pueden ser difíciles de planificar. Con esto en mente, solo
se elegirá y anunciará una fecha de release final una vez que esté disponible la
primera versión beta de dicho release.
