---
title: Guía del Repositorio de Charts
description: Cómo crear y trabajar con repositorios de charts de Helm.
sidebar_position: 6
---

Esta sección explica cómo crear y trabajar con repositorios de charts de Helm.
En términos generales, un repositorio de charts es un lugar donde se pueden
almacenar y compartir charts empaquetados.

El repositorio comunitario distribuido de charts de Helm está ubicado en
[Artifact Hub](https://artifacthub.io/packages/search?kind=0) y acepta
participación. Pero Helm también permite crear y ejecutar su propio repositorio
de charts. Esta guía explica cómo hacerlo. Si está considerando crear un
repositorio de charts, puede considerar usar un
[registro OCI](/topics/registries.md) en su lugar.

## Prerrequisitos

* Completar la guía de [Inicio Rápido](/intro/quickstart.md)
* Leer el documento de [Charts](/topics/charts.md)

## Crear un repositorio de charts

Un _repositorio de charts_ es un servidor HTTP que aloja un archivo `index.yaml`
y opcionalmente algunos charts empaquetados. Cuando esté listo para compartir
sus charts, la forma preferida es subirlos a un repositorio de charts.

A partir de Helm 2.2.0, se admite la autenticación SSL del lado del cliente para
un repositorio. Otros protocolos de autenticación pueden estar disponibles como
plugins.

Debido a que un repositorio de charts puede ser cualquier servidor HTTP que
pueda servir archivos YAML y tar y pueda responder a solicitudes GET, dispone de
muchas opciones para alojar su propio repositorio de charts. Por ejemplo, puede
usar un bucket de Google Cloud Storage (GCS), un bucket de Amazon S3, GitHub
Pages, o incluso crear su propio servidor web.

### La estructura del repositorio de charts

Un repositorio de charts consiste en charts empaquetados y un archivo especial
llamado `index.yaml` que contiene un índice de todos los charts en el
repositorio. Frecuentemente, los charts que `index.yaml` describe también están
alojados en el mismo servidor, al igual que los
[archivos de procedencia](/topics/provenance.md).

Por ejemplo, el diseño del repositorio `https://example.com/charts` podría verse
así:

```
charts/
  |
  |- index.yaml
  |
  |- alpine-0.1.2.tgz
  |
  |- alpine-0.1.2.tgz.prov
```

En este caso, el archivo de índice contendría información sobre un chart, el
chart Alpine, y proporcionaría la URL de descarga
`https://example.com/charts/alpine-0.1.2.tgz` para ese chart.

No es necesario que un paquete de chart esté ubicado en el mismo servidor que el
archivo `index.yaml`. Sin embargo, hacerlo suele ser lo más fácil.

### El archivo de índice

El archivo de índice es un archivo yaml llamado `index.yaml`. Contiene algunos
metadatos sobre el paquete, incluyendo el contenido del archivo `Chart.yaml` de
un chart. Un repositorio de charts válido debe tener un archivo de índice. El
archivo de índice contiene información sobre cada chart en el repositorio de
charts. El comando `helm repo index` generará un archivo de índice basándose en
un directorio local dado que contiene charts empaquetados.

Este es un ejemplo de un archivo de índice:

```yaml
apiVersion: v1
entries:
  alpine:
    - created: 2016-10-06T16:23:20.499814565-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 99c76e403d752c84ead610644d4b1c2f2b453a74b921f422b9dcb8a7c8b559cd
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.2.0.tgz
      version: 0.2.0
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 515c58e5f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cd78727
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.1.0.tgz
      version: 0.1.0
  nginx:
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Create a basic nginx HTTP server
      digest: aaff4545f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cdffffff
      home: https://helm.sh/helm
      name: nginx
      sources:
      - https://github.com/helm/charts
      urls:
      - https://technosophos.github.io/tscharts/nginx-1.1.0.tgz
      version: 1.1.0
generated: 2016-10-06T16:23:20.499029981-06:00
```

## Alojamiento de Repositorios de Charts

Esta parte muestra varias formas de servir un repositorio de charts.

### Google Cloud Storage

El primer paso es **crear su bucket de GCS**. Llamaremos al nuestro
`fantastic-charts`.

![Crear un Bucket de GCS](/img/helm2/create-a-bucket.png)

A continuación, haga público su bucket **editando los permisos del bucket**.

![Editar Permisos](/img/helm2/edit-permissions.png)

Inserte esta línea para **hacer público su bucket**:

![Hacer Público el Bucket](/img/helm2/make-bucket-public.png)

¡Felicitaciones, ahora tiene un bucket de GCS vacío listo para servir charts!

Puede subir su repositorio de charts usando la herramienta de línea de comandos
de Google Cloud Storage, o usando la interfaz web de GCS. Un bucket público de
GCS puede ser accedido vía HTTPS simple en esta dirección:
`https://bucket-name.storage.googleapis.com/`.

### Cloudsmith

También puede configurar repositorios de charts usando Cloudsmith. Lea más sobre
repositorios de charts con Cloudsmith
[aquí](https://help.cloudsmith.io/docs/helm-chart-repository)

### JFrog Artifactory

De manera similar, también puede configurar repositorios de charts usando JFrog
Artifactory. Lea más sobre repositorios de charts con JFrog Artifactory
[aquí](https://www.jfrog.com/confluence/display/RTF/Helm+Chart+Repositories)

### Ejemplo de GitHub Pages

De manera similar, puede crear un repositorio de charts usando GitHub Pages.

GitHub le permite servir páginas web estáticas de dos formas diferentes:

- Configurando un proyecto para servir el contenido de su directorio `docs/`
- Configurando un proyecto para servir una rama específica

Tomaremos el segundo enfoque, aunque el primero es igual de fácil.

El primer paso será **crear su rama gh-pages**. Puede hacerlo localmente así:

```console
$ git checkout -b gh-pages
```

O vía navegador web usando el botón **Branch** en su repositorio de GitHub:

![Crear rama de GitHub Pages](/img/helm2/create-a-gh-page-button.png)

A continuación, querrá asegurarse de que su **rama gh-pages** esté configurada
como GitHub Pages, haga clic en **Settings** de su repositorio y desplácese
hacia abajo a la sección **GitHub pages** y configure como se muestra a
continuación:

![Crear rama de GitHub Pages](/img/helm2/set-a-gh-page.png)

Por defecto, **Source** generalmente se configura a **gh-pages branch**. Si esto
no está configurado por defecto, selecciónelo.

Puede usar un **dominio personalizado** si lo desea.

Y verifique que **Enforce HTTPS** esté marcado, para que se use **HTTPS** cuando
se sirvan los charts.

Con esta configuración puede usar su rama principal para almacenar el código de
sus charts, y la **rama gh-pages** como repositorio de charts, por ejemplo:
`https://USERNAME.github.io/REPONAME`. El repositorio de demostración [TS
Charts](https://github.com/technosophos/tscharts) está accesible en
`https://technosophos.github.io/tscharts/`.

Si ha decidido usar GitHub Pages para alojar el repositorio de charts, consulte
[Chart Releaser Action](/howto/chart_releaser_action.md). Chart Releaser
Action es un flujo de trabajo de GitHub Action para convertir un proyecto de
GitHub en un repositorio de charts de Helm autoalojado, usando la herramienta
CLI [helm/chart-releaser](https://github.com/helm/chart-releaser).

### Servidores web ordinarios

Para configurar un servidor web ordinario para servir charts de Helm, simplemente
necesita hacer lo siguiente:

- Poner su índice y charts en un directorio que el servidor pueda servir
- Asegurarse de que el archivo `index.yaml` sea accesible sin requisitos de
  autenticación
- Asegurarse de que los archivos `yaml` se sirvan con el tipo de contenido
  correcto (`text/yaml` o `text/x-yaml`)

Por ejemplo, si desea servir sus charts desde `$WEBROOT/charts`, asegúrese de
que haya un directorio `charts/` en su raíz web, y coloque el archivo de índice
y los charts dentro de esa carpeta.

### Servidor de Repositorio ChartMuseum

ChartMuseum es un servidor de repositorio de charts de Helm de código abierto
escrito en Go (Golang), con soporte para backends de almacenamiento en la nube,
incluyendo [Google Cloud Storage](https://cloud.google.com/storage/),
[Amazon S3](https://aws.amazon.com/s3/),
[Microsoft Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/),
[Alibaba Cloud OSS Storage](https://www.alibabacloud.com/product/oss),
[Openstack Object Storage](https://developer.openstack.org/api-ref/object-store/),
[Oracle Cloud Infrastructure Object Storage](https://cloud.oracle.com/storage),
[Baidu Cloud BOS Storage](https://cloud.baidu.com/product/bos.html),
[Tencent Cloud Object Storage](https://intl.cloud.tencent.com/product/cos),
[DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/),
[Minio](https://min.io/), y [etcd](https://etcd.io/).

También puede usar el servidor
[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)
para alojar un repositorio de charts desde un sistema de archivos local.

### Registro de Paquetes de GitLab

Con GitLab puede publicar charts de Helm en el Registro de Paquetes de su
proyecto. Lea más sobre cómo configurar un repositorio de paquetes helm con
GitLab [aquí](https://docs.gitlab.com/ee/user/packages/helm_repository/).

## Gestión de Repositorios de Charts

Ahora que tiene un repositorio de charts, la última parte de esta guía explica
cómo mantener charts en ese repositorio.

### Almacenar charts en su repositorio de charts

Ahora que tiene un repositorio de charts, subamos un chart y un archivo de
índice al repositorio. Los charts en un repositorio de charts deben estar
empaquetados (`helm package chart-name/`) y versionados correctamente (siguiendo
las directrices de [SemVer 2](https://semver.org/)).

Estos siguientes pasos componen un flujo de trabajo de ejemplo, pero puede usar
cualquier flujo de trabajo que prefiera para almacenar y actualizar charts en su
repositorio de charts.

Una vez que tenga un chart empaquetado listo, cree un nuevo directorio y mueva
su chart empaquetado a ese directorio.

```console
$ helm package docs/examples/alpine/
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
$ helm repo index fantastic-charts --url https://fantastic-charts.storage.googleapis.com
```

El último comando toma la ruta del directorio local que acaba de crear y la URL
de su repositorio de charts remoto y compone un archivo `index.yaml` dentro de
la ruta del directorio dado.

Ahora puede subir el chart y el archivo de índice a su repositorio de charts
usando una herramienta de sincronización o manualmente. Si está usando Google
Cloud Storage, consulte este
[flujo de trabajo de ejemplo](/howto/chart_repository_sync_example.md) usando
el cliente gsutil. Para GitHub, simplemente puede poner los charts en la rama de
destino apropiada.

### Agregar nuevos charts a un repositorio existente

Cada vez que desee agregar un nuevo chart a su repositorio, debe regenerar el
índice. El comando `helm repo index` reconstruirá completamente el archivo
`index.yaml` desde cero, incluyendo solo los charts que encuentre localmente.

Sin embargo, puede usar la bandera `--merge` para agregar incrementalmente
nuevos charts a un archivo `index.yaml` existente (una gran opción cuando
trabaja con un repositorio remoto como GCS). Ejecute `helm repo index --help`
para obtener más información.

Asegúrese de subir tanto el archivo `index.yaml` revisado como el chart. Y si
generó un archivo de procedencia, súbalo también.

### Compartir sus charts con otros

Cuando esté listo para compartir sus charts, simplemente comparta la URL de su
repositorio.

Desde allí, agregarán el repositorio a su cliente helm mediante el comando
`helm repo add [NAME] [URL]` con cualquier nombre que deseen usar para
referenciar el repositorio.

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

Si los charts están respaldados por autenticación básica HTTP, también puede
proporcionar el nombre de usuario y la contraseña aquí:

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

**Nota:** No se agregará un repositorio si no contiene un `index.yaml` válido.

**Nota:** Si su repositorio de helm utiliza, por ejemplo, un certificado
autofirmado, puede usar
`helm repo add --insecure-skip-tls-verify ...` para omitir la verificación de CA.

Después de eso, sus usuarios podrán buscar en sus charts. Después de que haya
actualizado el repositorio, pueden usar el comando `helm repo update` para
obtener la información más reciente de los charts.

*Bajo el capó, los comandos `helm repo add` y `helm repo update` obtienen el
archivo index.yaml y lo almacenan en el directorio
`$XDG_CACHE_HOME/helm/repository/cache/`. Aquí es donde la función `helm search`
encuentra información sobre los charts.*
