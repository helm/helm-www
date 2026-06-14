---
title: APIs de Kubernetes Obsoletas
description: Explica las APIs de Kubernetes obsoletas en Helm
---

Kubernetes es un sistema basado en APIs y estas evolucionan con el tiempo para
adaptarse a una mejor comprensión del problema que resuelven. Esta es una
práctica común en sistemas y sus APIs. Una parte importante de esta evolución es
tener una buena política y proceso de deprecación para informar a los usuarios
sobre cómo se implementan los cambios. En otras palabras, los consumidores de su
API necesitan saber con anticipación en qué release se eliminará o cambiará una
API. Esto evita sorpresas y cambios incompatibles para los consumidores.

La [política de deprecación de
Kubernetes](https://kubernetes.io/docs/reference/using-api/deprecation-policy/)
documenta cómo Kubernetes maneja los cambios en sus versiones de API. La política
establece el plazo durante el cual las versiones de API serán soportadas después
de un anuncio de deprecación. Por lo tanto, es importante conocer los anuncios
de deprecación y saber cuándo se eliminarán las versiones de API para minimizar
el impacto.

Este es un ejemplo de un anuncio [para la eliminación de versiones de API
obsoletas en Kubernetes
1.16](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/) que fue
publicado unos meses antes del release. Estas versiones de API ya habrían sido
anunciadas como obsoletas previamente. Esto demuestra que existe una buena
política que informa a los consumidores sobre el soporte de versiones de API.

Las plantillas de Helm especifican un [grupo de API de
Kubernetes](https://kubernetes.io/docs/concepts/overview/kubernetes-api/#api-groups)
al definir un objeto de Kubernetes, similar a un archivo de manifiesto de
Kubernetes. Se especifica en el campo `apiVersion` de la plantilla e identifica
la versión de API del objeto de Kubernetes. Esto significa que los usuarios de
Helm y los mantenedores de charts deben conocer cuándo las versiones de API de
Kubernetes han sido declaradas obsoletas y en qué versión de Kubernetes serán
eliminadas.

## Mantenedores de Charts

Debe auditar sus charts verificando las versiones de API de Kubernetes que están
obsoletas o han sido eliminadas en alguna versión de Kubernetes. Las versiones
de API que están por dejar de ser soportadas o que ya no lo son deben
actualizarse a la versión soportada y publicar una nueva versión del chart. La
versión de API se define mediante los campos `kind` y `apiVersion`. Por ejemplo,
aquí hay una versión de API de objeto `Deployment` eliminada en Kubernetes 1.16:

```yaml
apiVersion: apps/v1beta1
kind: Deployment
```

## Usuarios de Helm

Debe auditar los charts que utiliza (similar a los [mantenedores de
charts](#mantenedores-de-charts)) e identificar cualquier chart donde las
versiones de API estén obsoletas o hayan sido eliminadas en alguna versión de
Kubernetes. Para los charts identificados, verifique si existe una versión más
reciente del chart (con versiones de API soportadas) o actualice el chart usted
mismo.

Además, debe auditar los charts desplegados (es decir, los releases de Helm)
verificando nuevamente si hay versiones de API obsoletas o eliminadas. Puede
hacerlo obteniendo los detalles de un release con el comando `helm get manifest`.

Los pasos para actualizar un release de Helm a APIs soportadas dependen de lo
que encuentre:

1. Si encuentra solo versiones de API obsoletas:
  - Realice un `helm upgrade` con una versión del chart que tenga versiones de
    API de Kubernetes soportadas
  - Agregue una descripción en la actualización indicando que no debe revertirse
    a una versión de Helm anterior a esta
2.  Si encuentra alguna versión de API que haya sido eliminada en una versión de
    Kubernetes:
  - Si está ejecutando una versión de Kubernetes donde las versiones de API aún
    están disponibles (por ejemplo, está en Kubernetes 1.15 y encontró que usa
    APIs que serán eliminadas en Kubernetes 1.16):
    - Siga el procedimiento del paso 1
  - De lo contrario (por ejemplo, ya está ejecutando una versión de Kubernetes
    donde algunas versiones de API reportadas por `helm get manifest` ya no
    están disponibles):
    - Necesita editar el manifiesto del release almacenado en el clúster para
      actualizar las versiones de API. Consulte [Actualización de Versiones de
      API de un Manifiesto de
      Release](#actualización-de-versiones-de-api-de-un-manifiesto-de-release)
      para más detalles

> Nota: En todos los casos de actualización de un release de Helm con APIs
soportadas, nunca debe revertir el release a una versión anterior a la versión
con las APIs soportadas.

> Recomendación: La mejor práctica es actualizar los releases que usan versiones
de API obsoletas a versiones soportadas antes de actualizar a un clúster de
Kubernetes que elimine esas versiones de API.

Si no actualiza un release como se sugirió anteriormente, obtendrá un error
similar al siguiente al intentar actualizar un release en una versión de
Kubernetes donde sus versiones de API han sido eliminadas:

```
Error: UPGRADE FAILED: current release manifest contains removed kubernetes api(s)
for this kubernetes version and it is therefore unable to build the kubernetes
objects for performing the diff. error from kubernetes: unable to recognize "":
no matches for kind "Deployment" in version "apps/v1beta1"
```

Helm falla en este escenario porque intenta crear un parche diff entre el
release desplegado actualmente (que contiene las APIs de Kubernetes eliminadas
en esta versión) y el chart que está pasando con las versiones de API
actualizadas/soportadas. La razón subyacente es que cuando Kubernetes elimina
una versión de API, la biblioteca cliente de Go de Kubernetes ya no puede
analizar los objetos obsoletos, por lo que Helm falla al llamar a la biblioteca.
Desafortunadamente, Helm no puede recuperarse de esta situación y ya no puede
gestionar dicho release. Consulte [Actualización de Versiones de API de un
Manifiesto de
Release](#actualización-de-versiones-de-api-de-un-manifiesto-de-release) para
más detalles sobre cómo recuperarse de este escenario.

## Actualización de Versiones de API de un Manifiesto de Release

El manifiesto es una propiedad del objeto release de Helm que se almacena en el
campo de datos de un Secret (por defecto) o ConfigMap en el clúster. El campo de
datos contiene un objeto comprimido con gzip codificado en base 64 (hay una
codificación base 64 adicional para un Secret). Existe un Secret/ConfigMap por
cada versión/revisión del release en el namespace del release.

Puede usar el plugin [mapkubeapis](https://github.com/helm/helm-mapkubeapis) de
Helm para actualizar un release a APIs soportadas. Consulte el readme para más
detalles.

Alternativamente, puede seguir estos pasos manuales para actualizar las
versiones de API de un manifiesto de release. Dependiendo de su configuración,
seguirá los pasos para el backend de Secret o ConfigMap.

- Obtenga el nombre del Secret o ConfigMap asociado con el último release
  desplegado:
  - Backend de Secrets: `kubectl get secret -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
  - Backend de ConfigMap: `kubectl get configmap -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
- Obtenga los detalles del último release desplegado:
  - Backend de Secrets: `kubectl get secret <release_secret_name> -n
    <release_namespace> -o yaml > release.yaml`
  - Backend de ConfigMap: `kubectl get configmap <release_configmap_name> -n
    <release_namespace> -o yaml > release.yaml`
- Haga una copia de seguridad del release en caso de que necesite restaurarlo si
  algo sale mal:
  - `cp release.yaml release.bak`
  - En caso de emergencia, restaure: `kubectl apply -f release.bak -n
    <release_namespace>`
- Decodifique el objeto release:
  - Backend de Secrets:`cat release.yaml | grep -oP '(?<=release: ).*' | base64 -d
    | base64 -d | gzip -d > release.data.decoded`
  - Backend de ConfigMap: `cat release.yaml | grep -oP '(?<=release: ).*' | base64
    -d | gzip -d > release.data.decoded`
- Cambie las versiones de API de los manifiestos. Puede usar cualquier
  herramienta (por ejemplo, un editor) para hacer los cambios. Esto está en el
  campo `manifest` de su objeto release decodificado (`release.data.decoded`)
- Codifique el objeto release:
  - Backend de Secrets: `cat release.data.decoded | gzip | base64 | base64`
  - Backend de ConfigMap: `cat release.data.decoded | gzip | base64`
- Reemplace el valor de la propiedad `data.release` en el archivo del release
  desplegado (`release.yaml`) con el nuevo objeto release codificado
- Aplique el archivo al namespace: `kubectl apply -f release.yaml -n
  <release_namespace>`
- Realice un `helm upgrade` con una versión del chart que tenga versiones de API
  de Kubernetes soportadas
- Agregue una descripción en la actualización indicando que no debe revertirse a
  una versión de Helm anterior a esta
