---
title: Custom Resource Definitions
description: Cómo manejar la creación y uso de CRDs.
sidebar_position: 7
---

Esta sección de la Guía de Mejores Prácticas trata sobre la creación y uso de
objetos Custom Resource Definition.

Al trabajar con Custom Resource Definitions (CRDs), es importante distinguir
dos partes diferentes:

- Existe una declaración de un CRD. Este es el archivo YAML que tiene el kind
  `CustomResourceDefinition`
- Luego existen recursos que _usan_ el CRD. Por ejemplo, un CRD define
  `foo.example.com/v1`. Cualquier recurso que tenga `apiVersion: example.com/v1`
  y kind `Foo` es un recurso que usa el CRD.

## Instalar una Declaración de CRD Antes de Usar el Recurso

Helm está optimizado para cargar tantos recursos en Kubernetes tan rápido como
sea posible. Por diseño, Kubernetes puede tomar un conjunto completo de
manifiestos y ponerlos todos en línea (esto se llama el ciclo de reconciliación).

Pero hay una diferencia con los CRDs.

Para un CRD, la declaración debe registrarse antes de que se puedan usar
recursos de ese tipo de CRD. Y el proceso de registro a veces tarda unos
segundos.

### Método 1: Deje que `helm` lo Haga por Usted

Con la llegada de Helm 3, eliminamos los antiguos hooks `crd-install` por una
metodología más simple. Ahora hay un directorio especial llamado `crds` que
puede crear en su chart para contener sus CRDs. Estos CRDs no son plantillas,
pero se instalarán por defecto al ejecutar `helm install` para el chart. Si el
CRD ya existe, se omitirá con una advertencia. Si desea omitir el paso de
instalación de CRD, puede pasar el flag `--skip-crds`.

#### Algunas advertencias (y explicaciones)

Actualmente no hay soporte para actualizar o eliminar CRDs usando Helm. Esta
fue una decisión explícita después de mucha discusión en la comunidad debido
al peligro de pérdida de datos no intencional. Además, actualmente no hay
consenso en la comunidad sobre cómo manejar los CRDs y su ciclo de vida. A
medida que esto evolucione, Helm añadirá soporte para esos casos de uso.

El flag `--dry-run` de `helm install` y `helm upgrade` actualmente no es
compatible con CRDs. El propósito de "Dry Run" es validar que la salida del
chart realmente funcionará si se envía al servidor. Pero los CRDs son una
modificación del comportamiento del servidor. Helm no puede instalar el CRD en
un dry run, por lo que el cliente de descubrimiento no conocerá ese Custom
Resource (CR), y la validación fallará. Alternativamente, puede mover los CRDs
a su propio chart o usar `helm template` en su lugar.

Otro punto importante a considerar en la discusión sobre el soporte de CRDs es
cómo se maneja el renderizado de plantillas. Una de las desventajas claras del
método `crd-install` usado en Helm 2 era la incapacidad de validar
correctamente los charts debido a la disponibilidad cambiante de la API (un CRD
en realidad está añadiendo otra API disponible a su clúster de Kubernetes). Si
un chart instalaba un CRD, `helm` ya no tenía un conjunto válido de versiones
de API con el cual trabajar. Esta es también la razón detrás de eliminar el
soporte de plantillas de los CRDs. Con el nuevo método `crds` de instalación de
CRDs, ahora aseguramos que `helm` tenga información completamente válida sobre
el estado actual del clúster.

### Método 2: Charts Separados

Otra forma de hacer esto es poner la definición del CRD en un chart, y luego
poner cualquier recurso que use ese CRD en _otro_ chart.

En este método, cada chart debe instalarse por separado. Sin embargo, este
flujo de trabajo puede ser más útil para operadores de clúster con acceso de
administrador.
