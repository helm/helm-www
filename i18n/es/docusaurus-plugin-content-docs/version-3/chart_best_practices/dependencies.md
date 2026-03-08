---
title: Dependencias
description: Cubre las mejores prácticas para las dependencias de un Chart.
sidebar_position: 4
---

Esta sección de la guía cubre las mejores prácticas para las `dependencies` declaradas
en `Chart.yaml`.

## Versiones

Cuando sea posible, use rangos de versión en lugar de fijar una versión exacta. El
valor predeterminado sugerido es usar una coincidencia a nivel de parche:

```yaml
version: ~1.2.3
```

Esto coincidirá con la versión `1.2.3` y cualquier parche de esa release. En otras
palabras, `~1.2.3` es equivalente a `>= 1.2.3, < 1.3.0`

Para la sintaxis completa de coincidencia de versiones, consulte la [documentación
de semver](https://github.com/Masterminds/semver#checking-version-constraints).

### Versiones preliminares (Prerelease)

Las restricciones de versión anteriores no coincidirán con versiones preliminares.
Por ejemplo, `version: ~1.2.3` coincidirá con `version: ~1.2.4` pero no con
`version: ~1.2.3-1`. La siguiente configuración permite coincidir tanto con versiones
preliminares como a nivel de parche:

```yaml
version: ~1.2.3-0
```

### URLs de Repositorio

Cuando sea posible, use URLs de repositorio `https://`. Como segunda opción, use `http://`.

Si el repositorio se ha añadido al archivo de índice de repositorios, el nombre del
repositorio puede usarse como un alias de la URL. Use `alias:` o `@` seguido del
nombre del repositorio.

Las URLs de archivo (`file://...`) se consideran un "caso especial" para charts que
se ensamblan mediante un pipeline de despliegue fijo.

Al usar [plugins de descarga](/topics/plugins.md#downloader-plugins), el esquema de URL
será específico del plugin. Tenga en cuenta que un usuario del chart necesitará
tener instalado un plugin que soporte el esquema para actualizar o construir la
dependencia.

Helm no puede realizar operaciones de gestión de dependencias cuando el campo
`repository` se deja en blanco. En ese caso, Helm asumirá que la dependencia está
en un subdirectorio de la carpeta `charts` con el mismo nombre que la propiedad
`name` de la dependencia.

## Condiciones y Etiquetas

Se deben añadir condiciones o etiquetas a cualquier dependencia que _sea opcional_.
Tenga en cuenta que, por defecto, una `condition` es `true`.

La forma preferida de una condición es:

```yaml
condition: somechart.enabled
```

Donde `somechart` es el nombre del chart de la dependencia.

Cuando múltiples subcharts (dependencias) juntos proporcionan una característica
opcional o intercambiable, esos charts deben compartir las mismas etiquetas.

Por ejemplo, si tanto `nginx` como `memcached` juntos proporcionan optimizaciones
de rendimiento para la aplicación principal del chart, y se requiere que ambos
estén presentes cuando esa característica está habilitada, entonces ambos deben
tener una sección de etiquetas como esta:

```yaml
tags:
  - webaccelerator
```

Esto permite a un usuario activar o desactivar esa característica con una sola etiqueta.
