---
title: "Política de Soporte de Versiones de Helm"
description: "Describe la política de lanzamiento de parches de Helm, así como la diferencia máxima de versiones soportada entre Helm y Kubernetes."
---

Este documento describe la diferencia máxima de versiones soportada entre Helm y
Kubernetes.

## Versiones Soportadas

Las versiones de Helm se expresan como `x.y.z`, donde `x` es la versión mayor,
`y` es la versión menor y `z` es la versión de parche, siguiendo la terminología
de [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

El proyecto Helm mantiene una rama de release para la versión menor más reciente.
Las correcciones aplicables, incluyendo correcciones de seguridad, se incorporan
a la rama de release, dependiendo de la severidad y la viabilidad. Para más
detalles, consulte la [política de releases de Helm](/topics/release_policy.md).

## Diferencia de Versiones Soportada

Cuando se lanza una nueva versión de Helm, se compila contra una versión menor
particular de Kubernetes. Por ejemplo, Helm 3.0.0 interactúa con Kubernetes
utilizando el cliente de Kubernetes 1.16.2, por lo que es compatible con
Kubernetes 1.16.

A partir de Helm 3, se asume que Helm es compatible con versiones `n-3` de
Kubernetes contra las que fue compilado. Debido a los cambios de Kubernetes
entre versiones menores, la política de soporte de Helm 2 es ligeramente más
estricta, asumiendo compatibilidad con versiones `n-1` de Kubernetes.

Por ejemplo, si está utilizando una versión de Helm 3 que fue compilada contra
las APIs del cliente de Kubernetes 1.17, entonces debería ser seguro usarla con
Kubernetes 1.17, 1.16, 1.15 y 1.14. Si está utilizando una versión de Helm 2 que
fue compilada contra las APIs del cliente de Kubernetes 1.16, entonces debería
ser seguro usarla con Kubernetes 1.16 y 1.15.

No se recomienda usar Helm con una versión de Kubernetes más nueva que la versión
contra la que fue compilado, ya que Helm no ofrece garantías de compatibilidad
hacia adelante.

Si elige usar Helm con una versión de Kubernetes que no soporta, lo hace bajo
su propia responsabilidad.

Consulte la siguiente tabla para determinar qué versión de Helm es compatible
con su clúster.

| Versión de Helm | Versiones de Kubernetes Soportadas |
|-----------------|------------------------------------|
| 3.20.x          | 1.35.x - 1.32.x                    |
| 3.19.x          | 1.34.x - 1.31.x                    |
| 3.18.x          | 1.33.x - 1.30.x                    |
| 3.17.x          | 1.32.x - 1.29.x                    |
| 3.16.x          | 1.31.x - 1.28.x                    |
| 3.15.x          | 1.30.x - 1.27.x                    |
| 3.14.x          | 1.29.x - 1.26.x                    |
| 3.13.x          | 1.28.x - 1.25.x                    |
| 3.12.x          | 1.27.x - 1.24.x                    |
| 3.11.x          | 1.26.x - 1.23.x                    |
| 3.10.x          | 1.25.x - 1.22.x                    |
| 3.9.x           | 1.24.x - 1.21.x                    |
| 3.8.x           | 1.23.x - 1.20.x                    |
| 3.7.x           | 1.22.x - 1.19.x                    |
| 3.6.x           | 1.21.x - 1.18.x                    |
| 3.5.x           | 1.20.x - 1.17.x                    |
| 3.4.x           | 1.19.x - 1.16.x                    |
| 3.3.x           | 1.18.x - 1.15.x                    |
| 3.2.x           | 1.18.x - 1.15.x                    |
| 3.1.x           | 1.17.x - 1.14.x                    |
| 3.0.x           | 1.16.x - 1.13.x                    |
| 2.16.x          | 1.16.x - 1.15.x                    |
| 2.15.x          | 1.15.x - 1.14.x                    |
| 2.14.x          | 1.14.x - 1.13.x                    |
| 2.13.x          | 1.13.x - 1.12.x                    |
| 2.12.x          | 1.12.x - 1.11.x                    |
| 2.11.x          | 1.11.x - 1.10.x                    |
| 2.10.x          | 1.10.x - 1.9.x                     |
| 2.9.x           | 1.10.x - 1.9.x                     |
| 2.8.x           | 1.9.x - 1.8.x                      |
| 2.7.x           | 1.8.x - 1.7.x                      |
| 2.6.x           | 1.7.x - 1.6.x                      |
| 2.5.x           | 1.6.x - 1.5.x                      |
| 2.4.x           | 1.6.x - 1.5.x                      |
| 2.3.x           | 1.5.x - 1.4.x                      |
| 2.2.x           | 1.5.x - 1.4.x                      |
| 2.1.x           | 1.5.x - 1.4.x                      |
| 2.0.x           | 1.4.x - 1.3.x                      |
