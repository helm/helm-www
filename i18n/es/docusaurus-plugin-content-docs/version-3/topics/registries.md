---
title: Uso de registros basados en OCI
description: Describe cómo usar OCI para la distribución de Charts.
sidebar_position: 7
---

A partir de Helm 3, puede usar registros de contenedores con soporte [OCI](https://www.opencontainers.org/) para almacenar y compartir paquetes de charts. A partir de Helm v3.8.0, el soporte OCI está habilitado por defecto.


## Soporte OCI antes de v3.8.0

El soporte OCI pasó de experimental a disponibilidad general con Helm v3.8.0. En versiones anteriores de Helm, el soporte OCI se comportaba de manera diferente. Si estaba usando el soporte OCI antes de Helm v3.8.0, es importante entender qué ha cambiado con las diferentes versiones de Helm.

### Habilitar el soporte OCI antes de v3.8.0

Antes de Helm v3.8.0, el soporte OCI es *experimental* y debe ser habilitado.

Para habilitar el soporte experimental de OCI en versiones de Helm anteriores a v3.8.0, configure `HELM_EXPERIMENTAL_OCI` en su entorno. Por ejemplo:

```console
export HELM_EXPERIMENTAL_OCI=1
```

### Deprecación de características y cambios de comportamiento de OCI con v3.8.0

Con el lanzamiento de [Helm v3.8.0](https://github.com/helm/helm/releases/tag/v3.8.0), las siguientes características y comportamientos son diferentes de versiones anteriores de Helm:

- Al establecer un chart en las dependencias como OCI, la versión se puede establecer como un rango al igual que otras dependencias.
- Las etiquetas SemVer que incluyen información de compilación se pueden enviar y usar. Los registros OCI no admiten `+` como carácter de etiqueta. Helm traduce el `+` a `_` cuando se almacena como etiqueta.
- El comando `helm registry login` ahora sigue la misma estructura que la CLI de Docker para almacenar credenciales. La misma ubicación para la configuración del registro se puede pasar tanto a Helm como a la CLI de Docker.

### Deprecación de características y cambios de comportamiento de OCI con v3.7.0

Con el lanzamiento de [Helm v3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0) se incluyó la implementación de [HIP 6](https://github.com/helm/community/blob/main/hips/hip-0006.md) para el soporte OCI. Como resultado, las siguientes características y comportamientos son diferentes de versiones anteriores de Helm:

- El subcomando `helm chart` ha sido eliminado.
- El caché de charts ha sido eliminado (no más `helm chart list`, etc.).
- Las referencias a registros OCI ahora siempre llevan el prefijo `oci://`.
- El nombre base de la referencia del registro *siempre* debe coincidir con el nombre del chart.
- La etiqueta de la referencia del registro *siempre* debe coincidir con la versión semántica del chart (es decir, no hay etiquetas `latest`).
- El tipo de medio de la capa del chart cambió de `application/tar+gzip` a `application/vnd.cncf.helm.chart.content.v1.tar+gzip`.


## Uso de un registro basado en OCI

### Repositorios Helm en registros basados en OCI

Un [repositorio Helm](/topics/chart_repository.md) es una forma de alojar y distribuir charts de Helm empaquetados. Un registro basado en OCI puede contener cero o más repositorios Helm y cada uno de esos repositorios puede contener cero o más charts de Helm empaquetados.

### Usar registros alojados

Existen varios registros de contenedores alojados con soporte OCI que puede usar para sus charts de Helm. Por ejemplo:

- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-helm-repos#push-chart-to-registry-as-oci-artifact)
- [Cloudsmith](https://help.cloudsmith.io/docs/oci-repository)
- [Docker Hub](https://docs.docker.com/docker-hub/oci-artifacts/)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/helm/manage-charts)
- [Harbor](https://goharbor.io/docs/main/administration/user-defined-oci-artifact/)
- [IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_helm_charts)
- [JFrog Artifactory](https://jfrog.com/help/r/jfrog-artifactory-documentation/helm-oci-repositories)
- [RepoFlow](https://docs.repoflow.io/PackageTypes/helm#oci-helm-support)
  

Siga la documentación del proveedor de su registro de contenedores alojado para crear y configurar un registro con soporte OCI.

**Nota:** Puede ejecutar [Docker Registry](https://docs.docker.com/registry/deploying/) o [`zot`](https://github.com/project-zot/zot), que son registros basados en OCI, en su equipo de desarrollo. Ejecutar un registro basado en OCI en su equipo de desarrollo solo debe usarse con fines de prueba.

### Uso de sigstore para firmar charts basados en OCI

El plugin [`helm-sigstore`](https://github.com/sigstore/helm-sigstore) permite usar [Sigstore](https://sigstore.dev/) para firmar charts de Helm con las mismas herramientas usadas para firmar imágenes de contenedores. Esto proporciona una alternativa a la [procedencia basada en GPG](/topics/provenance.md) soportada por los [repositorios de charts](/topics/chart_repository.md) clásicos.

Para más detalles sobre el uso del plugin `helm sigstore`, consulte [la documentación de ese proyecto](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md).

## Comandos para trabajar con registros

### El subcomando `registry`

#### `login`

Iniciar sesión en un registro (con entrada manual de contraseña)

```console
$ helm registry login -u myuser localhost:5000
Password:
Login succeeded
```

#### `logout`

Cerrar sesión de un registro

```console
$ helm registry logout localhost:5000
Logout succeeded
```

### El subcomando `push`

Subir un chart a un registro basado en OCI:

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

El subcomando `push` solo puede usarse con archivos `.tgz` creados previamente usando `helm package`.

Al usar `helm push` para subir un chart a un registro OCI, la referencia debe tener el prefijo `oci://` y no debe contener el nombre base ni la etiqueta.

El nombre base de la referencia del registro se infiere del nombre del chart, y la etiqueta se infiere de la versión semántica del chart. Actualmente esto es un requisito estricto.

Ciertos registros requieren que el repositorio y/o namespace (si se especifica) se cree de antemano. De lo contrario, se producirá un error durante la operación `helm push`.

Si ha creado un [archivo de procedencia](/topics/provenance.md) (`.prov`), y está presente junto al archivo `.tgz` del chart, se subirá automáticamente al registro en el `push`. Esto añade una capa adicional en [el manifiesto del chart de Helm](#manifiesto-de-chart-de-helm).

Los usuarios del [plugin helm-push](https://github.com/chartmuseum/helm-push) (para subir charts a [ChartMuseum](/topics/chart_repository.md#chartmuseum-repository-server)) pueden experimentar problemas, ya que el plugin entra en conflicto con el nuevo `push` integrado. A partir de la versión v0.10.0, el plugin ha sido renombrado a `cm-push`.

### Otros subcomandos

El soporte para el protocolo `oci://` también está disponible en varios otros subcomandos. Aquí está la lista completa:

- `helm pull`
- `helm push`
- `helm show `
- `helm template`
- `helm install`
- `helm upgrade`

El nombre base (nombre del chart) de la referencia del registro *sí* se incluye para cualquier tipo de acción que involucre la descarga del chart (a diferencia de `helm push` donde se omite).

Aquí hay algunos ejemplos del uso de los subcomandos listados anteriormente con charts basados en OCI:

```
$ helm pull oci://localhost:5000/helm-charts/mychart --version 0.1.0
Pulled: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:0be7ec9fb7b962b46d81e4bb74fdcdb7089d965d3baca9f85d64948b05b402ff

$ helm show all oci://localhost:5000/helm-charts/mychart --version 0.1.0
apiVersion: v2
appVersion: 1.16.0
description: A Helm chart for Kubernetes
name: mychart
...

$ helm template myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
---
# Source: mychart/templates/serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
...

$ helm install myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...

$ helm upgrade myrelease oci://localhost:5000/helm-charts/mychart --version 0.2.0
Release "myrelease" has been upgraded. Happy Helming!
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:12:05 2021
NAMESPACE: default
STATUS: deployed
REVISION: 2
NOTES:
...
```

## Instalar charts con digest

Instalar un chart con un digest es más seguro que con una etiqueta porque los digests son inmutables. El digest se especifica en el URI del chart:

```
$ helm install myrelease oci://localhost:5000/helm-charts/mychart@sha256:52ccaee6d4dd272e54bfccda77738b42e1edf0e4a20c27e23f0b6c15d01aef79
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...
```

## Especificar dependencias

Las dependencias de un chart se pueden descargar de un registro usando el subcomando `dependency update`.

El `repository` para una entrada dada en `Chart.yaml` se especifica como la referencia del registro sin el nombre base:

```
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```
Esto descargará `oci://localhost:5000/myrepo/mychart:2.7.0` cuando se ejecute `dependency update`.

## Manifiesto de chart de Helm

Ejemplo de manifiesto de chart de Helm tal como se representa en un registro (note los campos `mediaType`):
```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    }
  ]
}
```

El siguiente ejemplo contiene un [archivo de procedencia](/topics/provenance.md) (note la capa adicional):

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    },
    {
      "mediaType": "application/vnd.cncf.helm.chart.provenance.v1.prov",
      "digest": "sha256:3e207b409db364b595ba862cdc12be96dcdad8e36c59a03b7b3b61c946a5741a",
      "size": 643
    }
  ]
}
```

## Migrar desde repositorios de charts

Migrar desde [repositorios de charts](/topics/chart_repository.md) clásicos (repositorios basados en index.yaml) es tan simple como usar `helm pull` y luego usar `helm push` para subir los archivos `.tgz` resultantes a un registro.
