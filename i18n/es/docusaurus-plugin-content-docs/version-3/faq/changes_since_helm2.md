---
title: Cambios desde Helm 2
sidebar_position: 1
---

## Cambios desde Helm 2

Esta es una lista exhaustiva de todos los cambios principales introducidos en Helm 3.

### Eliminación de Tiller

Durante el ciclo de desarrollo de Helm 2, introdujimos Tiller. Tiller desempeñó un papel importante para los equipos que trabajaban en un clúster compartido: permitía que múltiples operadores interactuaran con el mismo conjunto de releases.

Con el control de acceso basado en roles (RBAC) habilitado por defecto en Kubernetes 1.6, asegurar Tiller para su uso en un escenario de producción se volvió más difícil de gestionar. Debido a la gran cantidad de posibles políticas de seguridad, nuestra postura fue proporcionar una configuración permisiva por defecto. Esto permitió a los usuarios principiantes comenzar a experimentar con Helm y Kubernetes sin tener que sumergirse de lleno en los controles de seguridad. Desafortunadamente, esta configuración permisiva podía otorgar a un usuario una amplia gama de permisos que no estaba destinado a tener. Los equipos de DevOps y SRE tenían que aprender pasos operativos adicionales al instalar Tiller en un clúster multi-tenant.

Después de escuchar cómo los miembros de la comunidad usaban Helm en ciertos escenarios, descubrimos que el sistema de gestión de releases de Tiller no necesitaba depender de un operador dentro del clúster para mantener el estado o actuar como un centro de información de releases de Helm. En su lugar, podíamos simplemente obtener información del servidor API de Kubernetes, renderizar los Charts del lado del cliente y almacenar un registro de la instalación en Kubernetes.

El objetivo principal de Tiller podía lograrse sin Tiller, por lo que una de las primeras decisiones que tomamos respecto a Helm 3 fue eliminar Tiller por completo.

Sin Tiller, el modelo de seguridad de Helm se simplifica radicalmente. Helm 3 ahora soporta todas las características modernas de seguridad, identidad y autorización de Kubernetes moderno. Los permisos de Helm se evalúan usando su [archivo kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/). Los administradores del clúster pueden restringir los permisos de los usuarios con la granularidad que consideren apropiada. Los releases aún se registran dentro del clúster, y el resto de la funcionalidad de Helm permanece sin cambios.

### Estrategia de actualización mejorada: parches de fusión estratégica de tres vías

Helm 2 utilizaba un parche de fusión estratégica de dos vías. Durante una actualización, comparaba el manifiesto del chart más reciente con el manifiesto del chart propuesto (el proporcionado durante `helm upgrade`). Comparaba las diferencias entre estos dos charts para determinar qué cambios debían aplicarse a los recursos en Kubernetes. Si se aplicaban cambios al clúster fuera de banda (como durante un `kubectl edit`), esos cambios no se consideraban. Esto resultaba en que los recursos no pudieran revertirse a su estado anterior: dado que Helm solo consideraba el manifiesto del último chart aplicado como su estado actual, si no había cambios en el estado del chart, el estado en vivo permanecía sin cambios.

En Helm 3, ahora utilizamos un parche de fusión estratégica de tres vías. Helm considera el manifiesto antiguo, su estado en vivo y el nuevo manifiesto al generar un parche.

#### Ejemplos

Veamos algunos ejemplos comunes de cómo este cambio impacta.

##### Reversión cuando el estado en vivo ha cambiado

Su equipo acaba de desplegar su aplicación en producción en Kubernetes usando Helm. El chart contiene un objeto Deployment donde el número de réplicas está configurado en tres:

```console
$ helm install myapp ./myapp
```

Un nuevo desarrollador se une al equipo. En su primer día, mientras observa el clúster de producción, ocurre un terrible accidente de café sobre el teclado y ejecutan `kubectl scale` en el deployment de producción, reduciendo de tres réplicas a cero.

```console
$ kubectl scale --replicas=0 deployment/myapp
```

Otro desarrollador de su equipo nota que el sitio de producción está caído y decide revertir el release a su estado anterior:

```console
$ helm rollback myapp
```

¿Qué sucede?

En Helm 2, generaría un parche comparando el manifiesto antiguo con el nuevo. Como esto es una reversión, es el mismo manifiesto. Helm determinaría que no hay nada que cambiar porque no hay diferencia entre el manifiesto antiguo y el nuevo. El conteo de réplicas continúa en cero. Cunde el pánico.

En Helm 3, el parche se genera usando el manifiesto antiguo, el estado en vivo y el nuevo manifiesto. Helm reconoce que el estado antiguo era tres, el estado en vivo es cero y el nuevo manifiesto desea cambiarlo de vuelta a tres, por lo que genera un parche para cambiar el estado de vuelta a tres.

##### Actualizaciones cuando el estado en vivo ha cambiado

Muchas service meshes y otras aplicaciones basadas en controladores inyectan datos en los objetos de Kubernetes. Esto puede ser algo como un sidecar, etiquetas u otra información. Anteriormente, si tenía el siguiente manifiesto renderizado desde un Chart:

```yaml
containers:
- name: server
  image: nginx:2.0.0
```

Y el estado en vivo fue modificado por otra aplicación a:

```yaml
containers:
- name: server
  image: nginx:2.0.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

Ahora, desea actualizar la etiqueta de imagen de `nginx` a `2.1.0`. Entonces, actualiza a un chart con el siguiente manifiesto:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

¿Qué sucede?

En Helm 2, Helm genera un parche del objeto `containers` entre el manifiesto antiguo y el nuevo. El estado en vivo del clúster no se considera durante la generación del parche.

El estado en vivo del clúster se modifica para verse así:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

El pod sidecar se elimina del estado en vivo. Cunde más pánico.

En Helm 3, Helm genera un parche del objeto `containers` entre el manifiesto antiguo, el estado en vivo y el nuevo manifiesto. Nota que el nuevo manifiesto cambia la etiqueta de imagen a `2.1.0`, pero el estado en vivo contiene un contenedor sidecar.

El estado en vivo del clúster se modifica para verse así:

```yaml
containers:
- name: server
  image: nginx:2.1.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

### Los nombres de releases ahora tienen alcance de namespace

Con la eliminación de Tiller, la información sobre cada release tenía que almacenarse en algún lugar. En Helm 2, esto se almacenaba en el mismo namespace que Tiller. En la práctica, esto significaba que una vez que un nombre era usado por un release, ningún otro release podía usar ese mismo nombre, incluso si se desplegaba en un namespace diferente.

En Helm 3, la información sobre un release particular ahora se almacena en el mismo namespace que el propio release. Esto significa que los usuarios ahora pueden ejecutar `helm install wordpress stable/wordpress` en dos namespaces separados, y cada uno puede consultarse con `helm list` cambiando el contexto del namespace actual (por ejemplo, `helm list --namespace foo`).

Con esta mayor alineación a los namespaces nativos del clúster, el comando `helm list` ya no lista todos los releases por defecto. En su lugar, listará solo los releases en el namespace de su contexto actual de Kubernetes (es decir, el namespace mostrado cuando ejecuta `kubectl config view --minify`). Esto también significa que debe proporcionar la flag `--all-namespaces` a `helm list` para obtener un comportamiento similar al de Helm 2.

### Secrets como driver de almacenamiento predeterminado

En Helm 3, los Secrets ahora se utilizan como [driver de almacenamiento predeterminado](/topics/advanced.md#storage-backends). Helm 2 usaba ConfigMaps por defecto para almacenar información de releases. En Helm 2.7.0, se implementó un nuevo backend de almacenamiento que usa Secrets para almacenar información de releases, y ahora es el predeterminado desde Helm 3.

Cambiar a Secrets como predeterminado en Helm 3 permite seguridad adicional para proteger los charts junto con el lanzamiento del cifrado de Secrets en Kubernetes.

[El cifrado de secrets en reposo](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/) estuvo disponible como característica alfa en Kubernetes 1.7 y se volvió estable en Kubernetes 1.13. Esto permite a los usuarios cifrar los metadatos de releases de Helm en reposo, por lo que es un buen punto de partida que puede expandirse posteriormente usando algo como Vault.

### Cambios en la ruta de importación de Go

En Helm 3, Helm cambió la ruta de importación de Go de `k8s.io/helm` a `helm.sh/helm/v3`. Si tiene la intención de actualizar a las bibliotecas cliente de Go de Helm 3, asegúrese de cambiar sus rutas de importación.

### Capabilities

El objeto incorporado `.Capabilities` disponible durante la etapa de renderizado ha sido simplificado.

[Objetos incorporados](/chart_template_guide/builtin_objects.md)

### Validación de valores de Chart con JSONSchema

Ahora se puede imponer un JSON Schema sobre los valores del chart. Esto asegura que los valores proporcionados por el usuario sigan el esquema establecido por el mantenedor del chart, proporcionando mejor reportes de errores cuando el usuario proporciona un conjunto incorrecto de valores para un chart.

La validación ocurre cuando se invocan cualquiera de los siguientes comandos:

* `helm install`
* `helm upgrade`
* `helm template`
* `helm lint`

Consulte la documentación sobre [archivos de esquema](/topics/charts.md#schema-files) para más información.

### Consolidación de `requirements.yaml` en `Chart.yaml`

El sistema de gestión de dependencias de Charts se movió de requirements.yaml y requirements.lock a Chart.yaml y Chart.lock. Recomendamos que los nuevos charts destinados a Helm 3 usen el nuevo formato. Sin embargo, Helm 3 aún entiende la versión 1 del API de Chart (`v1`) y cargará archivos `requirements.yaml` existentes.

En Helm 2, así se veía un `requirements.yaml`:

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

En Helm 3, la dependencia se expresa de la misma manera, pero ahora desde su `Chart.yaml`:

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

Los charts aún se descargan y colocan en el directorio `charts/`, por lo que los subcharts incluidos en el directorio `charts/` continuarán funcionando sin modificaciones.

### El nombre (o --generate-name) ahora es requerido en install

En Helm 2, si no se proporcionaba un nombre, se generaba uno automáticamente. En producción, esto resultó ser más una molestia que una característica útil. En Helm 3, Helm lanzará un error si no se proporciona un nombre con `helm install`.

Para aquellos que aún deseen que se les genere un nombre automáticamente, pueden usar la flag `--generate-name` para crear uno.

### Publicación de Charts en registros OCI

Esta es una característica experimental introducida en Helm 3. Para usarla, configure la variable de entorno `HELM_EXPERIMENTAL_OCI=1`.

A alto nivel, un repositorio de Charts es una ubicación donde los Charts pueden almacenarse y compartirse. El cliente de Helm empaqueta y envía Charts de Helm a un repositorio de Charts. Simplemente, un repositorio de Charts es un servidor HTTP básico que aloja un archivo index.yaml y algunos charts empaquetados.

Aunque hay varios beneficios en que el API del repositorio de Charts cumpla con los requisitos de almacenamiento más básicos, han comenzado a mostrarse algunas desventajas:

- Los repositorios de Charts tienen mucha dificultad para abstraer la mayoría de las implementaciones de seguridad requeridas en un entorno de producción. Tener un API estándar para autenticación y autorización es muy importante en escenarios de producción.
- Las herramientas de procedencia de Charts de Helm utilizadas para firmar y verificar la integridad y origen de un chart son una parte opcional del proceso de publicación de Charts.
- En escenarios multi-tenant, el mismo Chart puede ser subido por otro tenant, costando el doble de almacenamiento para guardar el mismo contenido. Se han diseñado repositorios de charts más inteligentes para manejar esto, pero no es parte de la especificación formal.
- Usar un único archivo de índice para búsqueda, información de metadatos y obtención de Charts ha hecho difícil o torpe diseñar alrededor de esto en implementaciones seguras multi-tenant.

El proyecto Distribution de Docker (también conocido como Docker Registry v2) es el sucesor del proyecto Docker Registry. Muchos grandes proveedores de nube tienen un producto basado en el proyecto Distribution, y con tantos proveedores ofreciendo el mismo producto, el proyecto Distribution se ha beneficiado de muchos años de endurecimiento, mejores prácticas de seguridad y pruebas de batalla.

Por favor, consulte `helm help chart` y `helm help registry` para más información sobre cómo empaquetar un chart y publicarlo en un registro Docker.

Para más información, consulte [esta página](/topics/registries.md).

### Eliminación de `helm serve`

`helm serve` ejecutaba un repositorio de Charts local en su máquina para propósitos de desarrollo. Sin embargo, no tuvo mucha adopción como herramienta de desarrollo y tenía numerosos problemas con su diseño. Al final, decidimos eliminarlo y separarlo como un plugin.

Para una experiencia similar a `helm serve`, consulte la opción de almacenamiento en sistema de archivos local en [ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage) y el [plugin servecm](https://github.com/jdolitsky/helm-servecm).

### Soporte para charts de biblioteca

Helm 3 soporta una clase de chart llamada "chart de biblioteca". Este es un chart que es compartido por otros charts, pero no crea ningún artefacto de release propio. Las plantillas de un chart de biblioteca solo pueden declarar elementos `define`. El contenido de alcance global no-`define` simplemente se ignora. Esto permite a los usuarios reutilizar y compartir fragmentos de código que pueden usarse en muchos charts, evitando redundancia y manteniendo los charts [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

Los charts de biblioteca se declaran en la directiva dependencies en Chart.yaml, y se instalan y gestionan como cualquier otro chart.

```yaml
dependencies:
  - name: mylib
    version: 1.x.x
    repository: quay.io
```

Estamos muy emocionados de ver los casos de uso que esta característica abre para los desarrolladores de charts, así como las mejores prácticas que surjan del consumo de charts de biblioteca.

### Incremento del apiVersion de Chart.yaml

Con la introducción del soporte para charts de biblioteca y la consolidación de requirements.yaml en Chart.yaml, los clientes que entendían el formato de paquete de Helm 2 no entenderán estas nuevas características. Por lo tanto, incrementamos el apiVersion en Chart.yaml de `v1` a `v2`.

`helm create` ahora crea charts usando este nuevo formato, por lo que el apiVersion predeterminado también se incrementó ahí.

Los clientes que deseen soportar ambas versiones de charts de Helm deben inspeccionar el campo `apiVersion` en Chart.yaml para entender cómo analizar el formato del paquete.

### Soporte para XDG Base Directory

[La especificación XDG Base Directory](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html) es un estándar portable que define dónde deben almacenarse los archivos de configuración, datos y caché en el sistema de archivos.

En Helm 2, Helm almacenaba toda esta información en `~/.helm` (conocido cariñosamente como `helm home`), que podía cambiarse configurando la variable de entorno `$HELM_HOME`, o usando la flag global `--home`.

En Helm 3, Helm ahora respeta las siguientes variables de entorno según la especificación XDG Base Directory:

- `$XDG_CACHE_HOME`
- `$XDG_CONFIG_HOME`
- `$XDG_DATA_HOME`

Los plugins de Helm aún reciben `$HELM_HOME` como un alias de `$XDG_DATA_HOME` para compatibilidad hacia atrás con plugins que buscan usar `$HELM_HOME` como un entorno de trabajo temporal.

Varias variables de entorno nuevas también se pasan al entorno del plugin para acomodar este cambio:

- `$HELM_PATH_CACHE` para la ruta de caché
- `$HELM_PATH_CONFIG` para la ruta de configuración
- `$HELM_PATH_DATA` para la ruta de datos

Los plugins de Helm que busquen soportar Helm 3 deberían considerar usar estas nuevas variables de entorno en su lugar.

### Renombrado de comandos CLI

Para alinear mejor la terminología con otros gestores de paquetes, `helm delete` fue renombrado a `helm uninstall`. `helm delete` aún se conserva como un alias de `helm uninstall`, por lo que cualquiera de las dos formas puede usarse.

En Helm 2, para purgar el registro de releases, se tenía que proporcionar la flag `--purge`. Esta funcionalidad ahora está habilitada por defecto. Para mantener el comportamiento anterior, use `helm uninstall --keep-history`.

Adicionalmente, varios otros comandos fueron renombrados para acomodar las mismas convenciones:

- `helm inspect` -> `helm show`
- `helm fetch` -> `helm pull`

Estos comandos también han conservado sus verbos anteriores como aliases, por lo que puede continuar usándolos en cualquiera de las dos formas.

### Creación automática de namespaces

Al crear un release en un namespace que no existe, Helm 2 creaba el namespace. Helm 3 sigue el comportamiento de otras herramientas de Kubernetes y devuelve un error si el namespace no existe. Helm 3 creará el namespace si especifica explícitamente la flag `--create-namespace`.

### ¿Qué pasó con .Chart.ApiVersion?

Helm sigue la convención típica de CamelCasing que es capitalizar un acrónimo. Hemos hecho esto en otros lugares del código, como con `.Capabilities.APIVersions.Has`. En Helm v3, corregimos `.Chart.ApiVersion` para seguir este patrón, renombrándolo a `.Chart.APIVersion`.
