---
title: helm dependency
---

gestiona las dependencias de un chart

### Sinopsis


Gestiona las dependencias de un chart.

Los charts de Helm almacenan sus dependencias en 'charts/'. Para los desarrolladores
de charts, a menudo es más fácil gestionar las dependencias en 'Chart.yaml', que
declara todas las dependencias.

Los comandos de dependencia operan sobre ese archivo, facilitando la sincronización
entre las dependencias deseadas y las dependencias reales almacenadas en el
directorio 'charts/'.

Por ejemplo, este Chart.yaml declara dos dependencias:

    # Chart.yaml
    dependencies:
    - name: nginx
      version: "1.2.3"
      repository: "https://example.com/charts"
    - name: memcached
      version: "3.2.1"
      repository: "https://another.example.com/charts"


El 'name' debe ser el nombre de un chart, donde ese nombre debe coincidir con el
nombre en el archivo 'Chart.yaml' de ese chart.

El campo 'version' debe contener una versión semántica o un rango de versiones.

La URL del 'repository' debe apuntar a un repositorio de charts. Helm espera que,
al añadir '/index.yaml' a la URL, pueda obtener el índice del repositorio de charts.
Nota: 'repository' puede ser un alias. El alias debe comenzar con 'alias:' o '@'.

A partir de la versión 2.2.0, el repository puede definirse como la ruta al directorio
de los charts de dependencia almacenados localmente. La ruta debe comenzar con el
prefijo "file://". Por ejemplo,

    # Chart.yaml
    dependencies:
    - name: nginx
      version: "1.2.3"
      repository: "file://../dependency_chart/nginx"

Si el chart de dependencia se obtiene localmente, no es necesario añadir el
repositorio a helm mediante "helm add repo". También se admite la coincidencia
de versiones en este caso.


### Opciones

```
  -h, --help   ayuda para dependency
```

### Opciones heredadas de comandos padre

```
      --burst-limit int                 límite de throttling del lado del cliente (por defecto 100)
      --debug                           habilita salida detallada
      --kube-apiserver string           la dirección y el puerto del servidor de API de Kubernetes
      --kube-as-group stringArray       grupo a suplantar para la operación, esta opción puede repetirse para especificar múltiples grupos.
      --kube-as-user string             nombre de usuario a suplantar para la operación
      --kube-ca-file string             el archivo de autoridad de certificación para la conexión al servidor de API de Kubernetes
      --kube-context string             nombre del contexto de kubeconfig a usar
      --kube-insecure-skip-tls-verify   si es true, no se verificará la validez del certificado del servidor de API de Kubernetes. Esto hará que sus conexiones HTTPS sean inseguras
      --kube-tls-server-name string     nombre del servidor a usar para la validación del certificado del servidor de API de Kubernetes. Si no se proporciona, se usa el nombre de host utilizado para contactar al servidor
      --kube-token string               token bearer usado para autenticación
      --kubeconfig string               ruta al archivo kubeconfig
  -n, --namespace string                ámbito del namespace para esta solicitud
      --qps float32                     consultas por segundo utilizadas al comunicarse con la API de Kubernetes, sin incluir ráfagas
      --registry-config string          ruta al archivo de configuración del registro (por defecto "~/.config/helm/registry/config.json")
      --repository-cache string         ruta al directorio que contiene los índices de repositorios en caché (por defecto "~/.cache/helm/repository")
      --repository-config string        ruta al archivo que contiene los nombres y URLs de repositorios (por defecto "~/.config/helm/repositories.yaml")
```

### VEA TAMBIÉN

* [helm](/helm/helm.md)	 - El gestor de paquetes Helm para Kubernetes.
* [helm dependency build](/helm/helm_dependency_build.md)	 - reconstruye el directorio charts/ basándose en el archivo Chart.lock
* [helm dependency list](/helm/helm_dependency_list.md)	 - lista las dependencias del chart dado
* [helm dependency update](/helm/helm_dependency_update.md)	 - actualiza charts/ basándose en el contenido de Chart.yaml

###### Generado automáticamente por spf13/cobra el 14-Jan-2026
