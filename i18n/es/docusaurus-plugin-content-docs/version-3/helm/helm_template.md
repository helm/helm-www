---
title: helm template
---

renderiza plantillas localmente

### Sinopsis

Renderiza las plantillas del chart localmente y muestra la salida.

Cualquier valor que normalmente se buscaría o recuperaría en el clúster será
simulado localmente. Además, no se realiza ninguna validación del chart
del lado del servidor (por ejemplo, si una API es compatible).


```
helm template [NAME] [CHART] [flags]
```

### Opciones

```
  -a, --api-versions strings                       versiones de la API de Kubernetes utilizadas para Capabilities.APIVersions
      --atomic                                     si se establece, el proceso de instalación elimina la instalación en caso de fallo. La opción --wait se establece automáticamente si se usa --atomic
      --ca-file string                             verifica certificados de servidores con HTTPS habilitado usando este bundle de CA
      --cert-file string                           identifica el cliente HTTPS usando este archivo de certificado SSL
      --create-namespace                           crea el namespace del release si no está presente
      --dependency-update                          actualiza las dependencias si faltan antes de instalar el chart
      --description string                         añade una descripción personalizada
      --devel                                      usa también versiones de desarrollo. Equivalente a version '>0.0.0-0'. Si se establece --version, esto se ignora
      --disable-openapi-validation                 si se establece, el proceso de instalación no validará las plantillas renderizadas contra el esquema OpenAPI de Kubernetes
      --dry-run string[="client"]                  simula una instalación. Si --dry-run se establece sin especificar una opción o como '--dry-run=client', no intentará conexiones al clúster. Establecer '--dry-run=server' permite intentar conexiones al clúster.
      --enable-dns                                 habilita búsquedas DNS al renderizar plantillas
      --force                                      fuerza actualizaciones de recursos a través de una estrategia de reemplazo
  -g, --generate-name                              genera el nombre (y omite el parámetro NAME)
  -h, --help                                       ayuda para template
      --hide-notes                                 si se establece, no muestra las notas en la salida. No afecta su presencia en los metadatos del chart
      --include-crds                               incluye CRDs en la salida renderizada
      --insecure-skip-tls-verify                   omite verificaciones de certificado TLS para la descarga del chart
      --is-upgrade                                 establece .Release.IsUpgrade en lugar de .Release.IsInstall
      --key-file string                            identifica el cliente HTTPS usando este archivo de clave SSL
      --keyring string                             ubicación de las claves públicas usadas para verificación (por defecto "~/.gnupg/pubring.gpg")
      --kube-version string                        versión de Kubernetes usada para Capabilities.KubeVersion
  -l, --labels stringToString                      etiquetas que se añadirían a los metadatos del release. Deben separarse con comas. (por defecto [])
      --name-template string                       especifica la plantilla usada para nombrar el release
      --no-hooks                                   evita que los hooks se ejecuten durante la instalación
      --output-dir string                          escribe las plantillas ejecutadas en archivos en output-dir en lugar de stdout
      --pass-credentials                           pasa credenciales a todos los dominios
      --password string                            contraseña del repositorio de charts donde localizar el chart solicitado
      --plain-http                                 usa conexiones HTTP inseguras para la descarga del chart
      --post-renderer postRendererString           la ruta a un ejecutable para usar en post-renderizado. Si existe en $PATH, se usará el binario, de lo contrario intentará buscar el ejecutable en la ruta especificada
      --post-renderer-args postRendererArgsSlice   un argumento para el post-renderer (puede especificar múltiples) (por defecto [])
      --release-name                               usa el nombre del release en la ruta de output-dir.
      --render-subchart-notes                      si se establece, renderiza las notas del subchart junto con el padre
      --replace                                    reutiliza el nombre dado, solo si ese nombre es un release eliminado que permanece en el historial. Esto es inseguro en producción
      --repo string                                URL del repositorio de charts donde localizar el chart solicitado
      --set stringArray                            establece valores en la línea de comandos (puede especificar múltiples o separar valores con comas: key1=val1,key2=val2)
      --set-file stringArray                       establece valores desde los archivos respectivos especificados en la línea de comandos (puede especificar múltiples o separar valores con comas: key1=path1,key2=path2)
      --set-json stringArray                       establece valores JSON en la línea de comandos (puede especificar múltiples o separar valores con comas: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    establece un valor STRING literal en la línea de comandos
      --set-string stringArray                     establece valores STRING en la línea de comandos (puede especificar múltiples o separar valores con comas: key1=val1,key2=val2)
  -s, --show-only stringArray                      solo muestra manifiestos renderizados desde las plantillas especificadas
      --skip-crds                                  si se establece, no se instalarán CRDs. Por defecto, los CRDs se instalan si no están presentes
      --skip-schema-validation                     si se establece, deshabilita la validación del esquema JSON
      --skip-tests                                 omite las pruebas en la salida renderizada
      --take-ownership                             si se establece, install ignorará la verificación de anotaciones de helm y tomará posesión de los recursos existentes
      --timeout duration                           tiempo de espera para cualquier operación individual de Kubernetes (como Jobs para hooks) (por defecto 5m0s)
      --username string                            nombre de usuario del repositorio de charts donde localizar el chart solicitado
      --validate                                   valida sus manifiestos contra el clúster de Kubernetes al que está apuntando actualmente. Esta es la misma validación que se realiza en una instalación
  -f, --values strings                             especifica valores en un archivo YAML o una URL (puede especificar múltiples)
      --verify                                     verifica el paquete antes de usarlo
      --version string                             especifica una restricción de versión para la versión del chart a usar. Esta restricción puede ser una etiqueta específica (ej. 1.1.1) o puede referenciar un rango válido (ej. ^2.0.0). Si no se especifica, se usa la última versión
      --wait                                       si se establece, esperará hasta que todos los Pods, PVCs, Services y el número mínimo de Pods de un Deployment, StatefulSet o ReplicaSet estén en estado ready antes de marcar el release como exitoso. Esperará tanto como --timeout
      --wait-for-jobs                              si se establece y --wait está habilitado, esperará hasta que todos los Jobs se hayan completado antes de marcar el release como exitoso. Esperará tanto como --timeout
```

### Opciones heredadas de comandos padre

```
      --burst-limit int                 límite de throttling del lado del cliente (por defecto 100)
      --debug                           habilita la salida detallada
      --kube-apiserver string           la dirección y el puerto del servidor de API de Kubernetes
      --kube-as-group stringArray       grupo a suplantar para la operación, esta opción puede repetirse para especificar múltiples grupos.
      --kube-as-user string             nombre de usuario a suplantar para la operación
      --kube-ca-file string             el archivo de autoridad de certificación para la conexión al servidor de API de Kubernetes
      --kube-context string             nombre del contexto de kubeconfig a utilizar
      --kube-insecure-skip-tls-verify   si es true, no se verificará la validez del certificado del servidor de API de Kubernetes. Esto hará que sus conexiones HTTPS sean inseguras
      --kube-tls-server-name string     nombre del servidor a usar para la validación del certificado del servidor de API de Kubernetes. Si no se proporciona, se usa el nombre de host utilizado para contactar al servidor
      --kube-token string               token bearer utilizado para la autenticación
      --kubeconfig string               ruta al archivo kubeconfig
  -n, --namespace string                ámbito del namespace para esta solicitud
      --qps float32                     consultas por segundo utilizadas al comunicarse con la API de Kubernetes, sin incluir ráfagas
      --registry-config string          ruta al archivo de configuración del registro (por defecto "~/.config/helm/registry/config.json")
      --repository-cache string         ruta al directorio que contiene los índices de repositorios en caché (por defecto "~/.cache/helm/repository")
      --repository-config string        ruta al archivo que contiene los nombres y URLs de los repositorios (por defecto "~/.config/helm/repositories.yaml")
```

### VEA TAMBIÉN

* [helm](./helm.md)	 - El gestor de paquetes Helm para Kubernetes.

###### Generado automáticamente por spf13/cobra el 14-Jan-2026
