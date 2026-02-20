---
title: Solución de Problemas
sidebar_position: 4
---

## Solución de Problemas

### Recibo una advertencia sobre "Unable to get an update from the "stable" chart repository"

Ejecute `helm repo list`. Si muestra que su repositorio `stable` apunta a una URL de `storage.googleapis.com`, necesitará actualizar ese repositorio. El 13 de noviembre de 2020, el repositorio de Helm Charts [dejó de tener soporte](https://github.com/helm/charts#deprecation-timeline) después de un período de deprecación de un año. Se ha puesto a disposición un archivo en `https://charts.helm.sh/stable`, pero ya no recibirá actualizaciones.

Puede ejecutar el siguiente comando para corregir su repositorio:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Lo mismo aplica para el repositorio `incubator`, que tiene un archivo disponible en https://charts.helm.sh/incubator. Puede ejecutar el siguiente comando para repararlo:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Recibo la advertencia 'WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.'

El antiguo repositorio de charts de Google Helm ha sido reemplazado por un nuevo repositorio de charts de Helm.

Ejecute el siguiente comando para solucionar esto de forma permanente:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

Si recibe un error similar para `incubator`, ejecute este comando:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Al agregar un repositorio de Helm, recibo el error 'Error: Repo "https://kubernetes-charts.storage.googleapis.com" is no longer available'

Los repositorios de Helm Charts ya no tienen soporte después de [un período de deprecación de un año](https://github.com/helm/charts#deprecation-timeline). Los archivos de estos repositorios están disponibles en `https://charts.helm.sh/stable` y `https://charts.helm.sh/incubator`, sin embargo ya no recibirán actualizaciones. El comando `helm repo add` no le permitirá agregar las URLs antiguas a menos que especifique `--use-deprecated-repos`.

### En GKE (Google Container Engine) recibo "No SSH tunnels currently open"

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

Otra variación del mensaje de error es:

```
Unable to connect to the server: x509: certificate signed by unknown authority
```

El problema es que su archivo de configuración local de Kubernetes debe tener las credenciales correctas.

Cuando crea un clúster en GKE, este le proporcionará credenciales, incluyendo certificados SSL y autoridades de certificación. Estos deben almacenarse en un archivo de configuración de Kubernetes (por defecto: `~/.kube/config`) para que `kubectl` y `helm` puedan acceder a ellos.

### Después de migrar desde Helm 2, `helm list` muestra solo algunas (o ninguna) de mis releases

Es posible que no haya notado que Helm 3 ahora utiliza namespaces del clúster para delimitar las releases. Esto significa que para todos los comandos que hacen referencia a una release debe:

* confiar en el namespace actual en el contexto activo de Kubernetes (como lo describe el comando `kubectl config view --minify`),
* especificar el namespace correcto usando el flag `--namespace`/`-n`, o
* para el comando `helm list`, especificar el flag `--all-namespaces`/`-A`

Esto aplica a `helm ls`, `helm uninstall` y todos los demás comandos de `helm` que hacen referencia a una release.


### En macOS, se accede al archivo `/etc/.mdns_debug`. ¿Por qué?

Existe un caso conocido en macOS donde Helm intentará acceder a un archivo llamado `/etc/.mdns_debug`. Si el archivo existe, Helm mantiene el handle del archivo abierto mientras se ejecuta.

Esto es causado por la biblioteca MDNS de macOS. Esta intenta cargar ese archivo para leer la configuración de depuración (si está habilitada). El handle del archivo probablemente no debería mantenerse abierto, y este problema ha sido reportado a Apple. Sin embargo, es macOS, no Helm, quien causa este comportamiento.

Si no desea que Helm cargue este archivo, puede compilar Helm como una biblioteca estática que no use la pila de red del host. Hacer esto aumentará el tamaño del binario de Helm, pero evitará que el archivo se abra.

Este problema fue inicialmente señalado como un posible problema de seguridad. Pero desde entonces se ha determinado que no hay ninguna falla o vulnerabilidad causada por este comportamiento.

### helm repo add falla cuando antes funcionaba

En Helm 3.3.1 y versiones anteriores, el comando `helm repo add <reponame> <url>` no mostraba salida si intentaba agregar un repositorio que ya existía. El flag `--no-update` generaba un error si el repositorio ya estaba registrado.

En Helm 3.3.2 y versiones posteriores, intentar agregar un repositorio existente producirá un error:

`Error: repository name (reponame) already exists, please specify a different name`

El comportamiento predeterminado ahora está invertido. `--no-update` ahora se ignora, mientras que si desea reemplazar (sobrescribir) un repositorio existente, puede usar `--force-update`.

Esto es debido a un cambio importante para una corrección de seguridad, como se explica en las [notas de la versión de Helm 3.3.2](https://github.com/helm/helm/releases/tag/v3.3.2).

### Habilitar el registro del cliente de Kubernetes

Puede habilitar los mensajes de registro para depurar el cliente de Kubernetes usando los flags de [klog](https://pkg.go.dev/k8s.io/klog). Usar el flag `-v` para establecer el nivel de verbosidad será suficiente para la mayoría de los casos.

Por ejemplo:

```
helm list -v 6
```

### Las instalaciones de Tiller dejaron de funcionar y se deniega el acceso

Las versiones de Helm solían estar disponibles en <https://storage.googleapis.com/kubernetes-helm/>. Como se explica en ["Announcing get.helm.sh"](https://helm.sh/blog/get-helm-sh/), la ubicación oficial cambió en junio de 2019. [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller) pone a disposición todas las imágenes antiguas de Tiller.


Si está intentando descargar versiones antiguas de Helm del bucket de almacenamiento que usaba en el pasado, puede encontrar que faltan:

```
<Error>
    <Code>AccessDenied</Code>
    <Message>Access denied.</Message>
    <Details>Anonymous caller does not have storage.objects.get access to the Google Cloud Storage object.</Details>
</Error>
```

La [ubicación heredada de imágenes de Tiller](https://gcr.io/kubernetes-helm/tiller) comenzó la eliminación de imágenes en agosto de 2021. Hemos puesto estas imágenes disponibles en la ubicación de [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller). Por ejemplo, para descargar la versión v2.17.0, reemplace:

`https://storage.googleapis.com/kubernetes-helm/helm-v2.17.0-linux-amd64.tar.gz`

con:

`https://get.helm.sh/helm-v2.17.0-linux-amd64.tar.gz`

Para inicializar con Helm v2.17.0:

`helm init —upgrade`

O si necesita una versión diferente, use el flag --tiller-image para anular la ubicación predeterminada e instalar una versión específica de Helm v2:

`helm init --tiller-image ghcr.io/helm/tiller:v2.16.9`

**Nota:** Los mantenedores de Helm recomiendan migrar a una versión de Helm actualmente soportada. Helm v2.17.0 fue la versión final de Helm v2; Helm v2 no tiene soporte desde noviembre de 2020, como se detalla en [Helm 2 and the Charts Project Are Now Unsupported](https://helm.sh/blog/helm-2-becomes-unsupported/). Se han señalado muchos CVE contra Helm desde entonces, y esos exploits están parcheados en Helm v3 pero nunca serán parcheados en Helm v2. Consulte la [lista actual de avisos de seguridad publicados de Helm](https://github.com/helm/helm/security/advisories?state=published) y haga un plan para [migrar a Helm v3](/es/topics/v2_v3_migration.md) hoy.
