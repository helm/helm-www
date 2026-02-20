---
title: Migración de Helm v2 a v3
description: Aprenda cómo migrar de Helm v2 a v3.
sidebar_position: 13
---

Esta guía muestra cómo migrar de Helm v2 a v3. Helm v2 debe estar instalado
y gestionando releases en uno o más clústeres.

## Resumen de Cambios en Helm 3

La lista completa de cambios de Helm 2 a 3 está documentada en la [sección de
preguntas frecuentes](/faq/changes_since_helm2.md). A continuación se presenta un
resumen de algunos de esos cambios que el usuario debe conocer antes y durante
la migración:

1. Eliminación de Tiller:
   - Reemplaza la arquitectura cliente/servidor por una arquitectura
     cliente/biblioteca (solo el binario `helm`)
   - La seguridad ahora se gestiona por usuario (delegada a la seguridad del
     clúster de Kubernetes del usuario)
   - Los releases ahora se almacenan como secrets dentro del clúster y los
     metadatos del objeto release han cambiado
   - Los releases se persisten por namespace del release y ya no en el namespace
     de Tiller
2. Repositorio de charts actualizado:
   - `helm search` ahora soporta tanto búsquedas en repositorios locales como
     consultas de búsqueda en Artifact Hub
3. Chart apiVersion actualizado a "v2" para los siguientes cambios de especificación:
   - Las dependencias de charts enlazadas dinámicamente se movieron a `Chart.yaml`
     (`requirements.yaml` eliminado y requirements --> dependencies)
   - Los library charts (charts auxiliares/comunes) ahora pueden añadirse como
     dependencias de charts enlazadas dinámicamente
   - Los charts tienen un campo de metadatos `type` para definir si el chart es
     de tipo `application` o `library`. Por defecto es application, lo que
     significa que es renderizable e instalable
   - Los charts de Helm 2 (apiVersion=v1) siguen siendo instalables
4. Especificación de directorios XDG añadida:
   - El directorio home de Helm eliminado y reemplazado por la especificación de
     directorios XDG para almacenar archivos de configuración
   - Ya no es necesario inicializar Helm
   - `helm init` y `helm home` eliminados
5. Cambios adicionales:
   - La instalación/configuración de Helm se simplifica:
     - Solo cliente Helm (binario helm) (sin Tiller)
     - Se ejecuta tal cual
   - Los repositorios `local` o `stable` no se configuran por defecto
   - El hook `crd-install` eliminado y reemplazado por el directorio `crds` en
     el chart donde todos los CRDs definidos se instalarán antes de cualquier
     renderizado del chart
   - El valor de anotación de hook `test-failure` eliminado, y `test-success`
     obsoleto. Use `test` en su lugar
   - Comandos eliminados/reemplazados/añadidos:
       - delete --> uninstall: elimina todo el historial del release por defecto
         (anteriormente necesitaba `--purge`)
       - fetch --> pull
       - home (eliminado)
       - init (eliminado)
       - install: requiere nombre del release o argumento `--generate-name`
       - inspect --> show
       - reset (eliminado)
       - serve (eliminado)
       - template: argumento `-x`/`--execute` renombrado a `-s`/`--show-only`
       - upgrade: Añadido argumento `--history-max` que limita el número máximo
         de revisiones guardadas por release (0 para sin límite)
   - La biblioteca Go de Helm 3 ha sufrido muchos cambios y es incompatible con
     la biblioteca de Helm 2
   - Los binarios de release ahora se alojan en `get.helm.sh`

## Casos de Uso de Migración

Los casos de uso de migración son los siguientes:

1. Helm v2 y v3 gestionando el mismo clúster:
   - Este caso de uso solo se recomienda si tiene la intención de eliminar
     gradualmente Helm v2 y no necesita que v3 gestione ningún release
     desplegado por v2. Todos los nuevos releases deben desplegarse con v3 y
     los releases existentes desplegados con v2 solo deben actualizarse/eliminarse
     con v2
   - Helm v2 y v3 pueden gestionar el mismo clúster sin problemas. Las versiones
     de Helm pueden instalarse en el mismo sistema o en sistemas separados
   - Si instala Helm v3 en el mismo sistema, necesita realizar un paso adicional
     para asegurar que ambas versiones del cliente puedan coexistir hasta que
     esté listo para eliminar el cliente de Helm v2. Renombre o coloque el
     binario de Helm v3 en una carpeta diferente para evitar conflictos
   - De lo contrario, no hay conflictos entre ambas versiones debido a las
     siguientes distinciones:
     - El almacenamiento de releases (historial) de v2 y v3 son independientes
       entre sí. Los cambios incluyen el recurso de Kubernetes para almacenamiento
       y los metadatos del objeto release contenidos en el recurso. Los releases
       también estarán en un namespace por usuario en lugar de usar el namespace
       de Tiller (por ejemplo, el namespace por defecto de Tiller en v2 es
       kube-system). v2 usa "ConfigMaps" o "Secrets" bajo el namespace de Tiller
       con propiedad `TILLER`. v3 usa "Secrets" en el namespace del usuario con
       propiedad `helm`. Los releases son incrementales tanto en v2 como en v3
     - El único problema podría ser si se definen recursos de Kubernetes con
       alcance de clúster (por ejemplo, `clusterroles.rbac`) en un chart. El
       despliegue de v3 fallaría aunque sea único en el namespace porque los
       recursos colisionarían
     - La configuración de v3 ya no usa `$HELM_HOME` y usa la especificación de
       directorios XDG en su lugar. También se crea sobre la marcha según sea
       necesario. Por lo tanto, es independiente de la configuración de v2. Esto
       aplica solo cuando ambas versiones están instaladas en el mismo sistema

2. Migrar Helm v2 a Helm v3:
   - Este caso de uso aplica cuando desea que Helm v3 gestione los releases
     existentes de Helm v2
   - Debe tenerse en cuenta que un cliente de Helm v2:
     - puede gestionar de 1 a muchos clústeres de Kubernetes
     - puede conectarse a de 1 a muchas instancias de Tiller para un clúster
   - Esto significa que debe tener esto en cuenta al migrar, ya que los releases
     se despliegan en los clústeres por Tiller y su namespace. Por lo tanto, debe
     ser consciente de la migración para cada clúster y cada instancia de Tiller
     que gestiona la instancia del cliente de Helm v2
   - La ruta de migración de datos recomendada es la siguiente:
     1. Hacer backup de los datos de v2
     2. Migrar la configuración de Helm v2
     3. Migrar los releases de Helm v2
     4. Cuando esté seguro de que Helm v3 está gestionando todos los datos de
        Helm v2 (para todos los clústeres e instancias de Tiller de la instancia
        del cliente de Helm v2) según lo esperado, limpie los datos de Helm v2
   - El proceso de migración está automatizado por el plugin
     [2to3](https://github.com/helm/helm-2to3) de Helm v3

## Referencia

   - Plugin [2to3](https://github.com/helm/helm-2to3) de Helm v3
   - [Artículo de blog](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)
     que explica el uso del plugin `2to3` con ejemplos
