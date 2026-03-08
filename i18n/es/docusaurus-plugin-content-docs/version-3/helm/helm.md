---
title: helm
slug: helm
---

El gestor de paquetes Helm para Kubernetes.

### Sinopsis

El gestor de paquetes de Kubernetes

Acciones comunes de Helm:

- helm search:    buscar charts
- helm pull:      descargar un chart a su directorio local para visualizarlo
- helm install:   subir el chart a Kubernetes
- helm list:      listar releases de charts

Variables de entorno:

| Nombre                             | Descripción                                                                                                       |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | establece una ubicación alternativa para almacenar archivos en caché.                                             |
| $HELM_CONFIG_HOME                  | establece una ubicación alternativa para almacenar la configuración de Helm.                                      |
| $HELM_DATA_HOME                    | establece una ubicación alternativa para almacenar datos de Helm.                                                 |
| $HELM_DEBUG                        | indica si Helm se está ejecutando en modo Debug o no                                                              |
| $HELM_DRIVER                       | establece el controlador de almacenamiento del backend. Los valores son: configmap, secret, memory, sql.          |
| $HELM_DRIVER_SQL_CONNECTION_STRING | establece la cadena de conexión que debe usar el controlador de almacenamiento SQL.                               |
| $HELM_MAX_HISTORY                  | establece el número máximo de historial de releases de Helm.                                                      |
| $HELM_NAMESPACE                    | establece el namespace usado para las operaciones de Helm.                                                        |
| $HELM_NO_PLUGINS                   | deshabilita plugins. Establezca HELM_NO_PLUGINS=1 para deshabilitar plugins.                                      |
| $HELM_PLUGINS                      | establece la ruta al directorio de plugins                                                                        |
| $HELM_REGISTRY_CONFIG              | establece la ruta al archivo de configuración del registro.                                                       |
| $HELM_REPOSITORY_CACHE             | establece la ruta al directorio de caché del repositorio                                                          |
| $HELM_REPOSITORY_CONFIG            | establece la ruta al archivo de repositorios.                                                                     |
| $KUBECONFIG                        | establece un archivo de configuración de Kubernetes alternativo (por defecto "~/.kube/config")                    |
| $HELM_KUBEAPISERVER                | establece el Endpoint del servidor API de Kubernetes para autenticación                                           |
| $HELM_KUBECAFILE                   | establece el archivo de autoridad certificadora de Kubernetes.                                                    |
| $HELM_KUBEASGROUPS                 | establece los grupos a usar para suplantación usando una lista separada por comas.                                |
| $HELM_KUBEASUSER                   | establece el nombre de usuario a suplantar para la operación.                                                     |
| $HELM_KUBECONTEXT                  | establece el nombre del contexto de kubeconfig.                                                                   |
| $HELM_KUBETOKEN                    | establece el Bearer KubeToken usado para autenticación.                                                           |
| $HELM_KUBEINSECURE_SKIP_TLS_VERIFY | indica si se debe omitir la validación del certificado del servidor API de Kubernetes (inseguro)                  |
| $HELM_KUBETLS_SERVER_NAME          | establece el nombre del servidor usado para validar el certificado del servidor API de Kubernetes                 |
| $HELM_BURST_LIMIT                  | establece el límite de ráfaga por defecto en caso de que el servidor contenga muchos CRDs (por defecto 100, -1 para deshabilitar) |
| $HELM_QPS                          | establece las consultas por segundo en casos donde un alto número de llamadas exceda la opción para valores de ráfaga más altos |

Helm almacena caché, configuración y datos basándose en el siguiente orden de configuración:

- Si una variable de entorno HELM_*_HOME está establecida, se usará
- De lo contrario, en sistemas que soportan la especificación de directorios base XDG, se usarán las variables XDG
- Cuando no se establece ninguna otra ubicación, se usará una ubicación por defecto basada en el sistema operativo

Por defecto, los directorios predeterminados dependen del sistema operativo. Los valores por defecto se listan a continuación:

| Sistema Operativo | Ruta de Caché             | Ruta de Configuración          | Ruta de Datos             |
|-------------------|---------------------------|--------------------------------|---------------------------|
| Linux             | $HOME/.cache/helm         | $HOME/.config/helm             | $HOME/.local/share/helm   |
| macOS             | $HOME/Library/Caches/helm | $HOME/Library/Preferences/helm | $HOME/Library/helm        |
| Windows           | %TEMP%\helm               | %APPDATA%\helm                 | %APPDATA%\helm            |


### Opciones

```
      --burst-limit int                 límite de throttling del lado del cliente por defecto (por defecto 100)
      --debug                           habilita salida detallada
  -h, --help                            ayuda para helm
      --kube-apiserver string           la dirección y el puerto del servidor API de Kubernetes
      --kube-as-group stringArray       grupo a suplantar para la operación, esta opción puede repetirse para especificar múltiples grupos.
      --kube-as-user string             nombre de usuario a suplantar para la operación
      --kube-ca-file string             el archivo de autoridad certificadora para la conexión del servidor API de Kubernetes
      --kube-context string             nombre del contexto de kubeconfig a usar
      --kube-insecure-skip-tls-verify   si es verdadero, el certificado del servidor API de Kubernetes no será verificado. Esto hará que sus conexiones HTTPS sean inseguras
      --kube-tls-server-name string     nombre del servidor a usar para la validación del certificado del servidor API de Kubernetes. Si no se proporciona, se usa el nombre de host utilizado para contactar al servidor
      --kube-token string               bearer token usado para autenticación
      --kubeconfig string               ruta al archivo kubeconfig
  -n, --namespace string                ámbito de namespace para esta solicitud
      --qps float32                     consultas por segundo usadas al comunicarse con la API de Kubernetes, sin incluir ráfagas
      --registry-config string          ruta al archivo de configuración del registro (por defecto "~/.config/helm/registry/config.json")
      --repository-cache string         ruta al directorio que contiene los índices de repositorio en caché (por defecto "~/.cache/helm/repository")
      --repository-config string        ruta al archivo que contiene nombres y URLs de repositorios (por defecto "~/.config/helm/repositories.yaml")
```

### VEA TAMBIÉN

* [helm completion](/helm/helm_completion.md)	 - genera scripts de autocompletado para el shell especificado
* [helm create](/helm/helm_create.md)	 - crea un nuevo chart con el nombre dado
* [helm dependency](/helm/helm_dependency.md)	 - gestiona las dependencias de un chart
* [helm env](/helm/helm_env.md)	 - información del entorno del cliente Helm
* [helm get](/helm/helm_get.md)	 - descarga información extendida de un release nombrado
* [helm history](/helm/helm_history.md)	 - obtiene el historial de releases
* [helm install](/helm/helm_install.md)	 - instala un chart
* [helm lint](/helm/helm_lint.md)	 - examina un chart en busca de posibles problemas
* [helm list](/helm/helm_list.md)	 - lista releases
* [helm package](/helm/helm_package.md)	 - empaqueta un directorio de chart en un archivo de chart
* [helm plugin](/helm/helm_plugin.md)	 - instala, lista o desinstala plugins de Helm
* [helm pull](/helm/helm_pull.md)	 - descarga un chart de un repositorio y (opcionalmente) lo desempaqueta en el directorio local
* [helm push](/helm/helm_push.md)	 - sube un chart a un servidor remoto
* [helm registry](/helm/helm_registry.md)	 - inicia o cierra sesión en un registro
* [helm repo](/helm/helm_repo.md)	 - añade, lista, elimina, actualiza e indexa repositorios de charts
* [helm rollback](/helm/helm_rollback.md)	 - revierte un release a una revisión anterior
* [helm search](/helm/helm_search.md)	 - busca una palabra clave en charts
* [helm show](/helm/helm_show.md)	 - muestra información de un chart
* [helm status](/helm/helm_status.md)	 - muestra el estado del release nombrado
* [helm template](/helm/helm_template.md)	 - renderiza plantillas localmente
* [helm test](/helm/helm_test.md)	 - ejecuta pruebas para un release
* [helm uninstall](/helm/helm_uninstall.md)	 - desinstala un release
* [helm upgrade](/helm/helm_upgrade.md)	 - actualiza un release
* [helm verify](/helm/helm_verify.md)	 - verifica que un chart en la ruta dada ha sido firmado y es válido
* [helm version](/helm/helm_version.md)	 - imprime la información de versión del cliente

###### Generado automáticamente por spf13/cobra el 14-Ene-2026
