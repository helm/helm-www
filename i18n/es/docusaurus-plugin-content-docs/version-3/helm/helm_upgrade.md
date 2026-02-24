---
title: helm upgrade
---

actualiza un release a una nueva versión de un chart

### Sinopsis

Este comando actualiza un release a una nueva versión de un chart.

Los argumentos de upgrade deben ser un release y un chart. El argumento chart puede ser: una referencia de chart ('example/mariadb'), una ruta a un directorio de chart, un chart empaquetado, o una URL completamente cualificada. Para referencias de chart, se especificará la última versión a menos que se establezca la opción '--version'.

Para sobrescribir valores en un chart, use la opción '--values' y proporcione un archivo, o use la opción '--set' y pase la configuración desde la línea de comandos. Para forzar valores de tipo string, use '--set-string'. Puede usar '--set-file' para establecer valores individuales desde un archivo cuando el valor es demasiado largo para la línea de comandos o se genera dinámicamente. También puede usar '--set-json' para establecer valores JSON (escalares/objetos/arrays) desde la línea de comandos.

Puede especificar la opción '--values'/'-f' múltiples veces. Se dará prioridad al último archivo especificado. Por ejemplo, si tanto myvalues.yaml como override.yaml contienen una clave llamada 'Test', el valor en override.yaml tendrá precedencia:

    $ helm upgrade -f myvalues.yaml -f override.yaml redis ./redis

Puede especificar la opción '--set' múltiples veces. Se dará prioridad al último valor especificado. Por ejemplo, si se asignan los valores 'bar' y 'newbar' a una clave llamada 'foo', el valor 'newbar' tendrá precedencia:

    $ helm upgrade --set foo=bar --set foo=newbar redis ./redis

También puede actualizar los valores de un release existente con este comando mediante la opción '--reuse-values'. Los argumentos 'RELEASE' y 'CHART' deben establecerse a los parámetros originales, y los valores existentes se fusionarán con cualquier valor establecido mediante las opciones '--values'/'-f' o '--set'. La prioridad se da a los nuevos valores.

    $ helm upgrade --reuse-values --set foo=bar --set foo=newbar redis ./redis

La opción --dry-run mostrará todos los manifiestos de chart generados, incluyendo Secrets que pueden contener valores sensibles. Para ocultar los Secrets de Kubernetes use la opción --hide-secret. Por favor considere cuidadosamente cómo y cuándo usar estas opciones.


```
helm upgrade [RELEASE] [CHART] [flags]
```

### Opciones

```
      --atomic                                     si se establece, el proceso de upgrade revierte los cambios realizados en caso de un upgrade fallido. La opción --wait se establecerá automáticamente si se usa --atomic
      --ca-file string                             verifica certificados de servidores habilitados con HTTPS usando este paquete de CA
      --cert-file string                           identifica el cliente HTTPS usando este archivo de certificado SSL
      --cleanup-on-fail                            permite eliminar nuevos recursos creados en este upgrade cuando el upgrade falla
      --create-namespace                           si --install está establecido, crea el namespace del release si no está presente
      --dependency-update                          actualiza las dependencias si faltan antes de instalar el chart
      --description string                         añade una descripción personalizada
      --devel                                      usa también versiones de desarrollo. Equivalente a version '>0.0.0-0'. Si --version está establecido, esto se ignora
      --disable-openapi-validation                 si se establece, el proceso de upgrade no validará las plantillas renderizadas contra el esquema OpenAPI de Kubernetes
      --dry-run string[="client"]                  simula una instalación. Si --dry-run se establece sin especificar opción o como '--dry-run=client', no intentará conexiones al clúster. Establecer '--dry-run=server' permite intentar conexiones al clúster.
      --enable-dns                                 habilita búsquedas DNS al renderizar plantillas
      --force                                      fuerza actualizaciones de recursos mediante una estrategia de reemplazo
  -h, --help                                       ayuda para upgrade
      --hide-notes                                 si se establece, no muestra las notas en la salida del upgrade. No afecta su presencia en los metadatos del chart
      --hide-secret                                oculta los Secrets de Kubernetes cuando también se usa la opción --dry-run
      --history-max int                            limita el número máximo de revisiones guardadas por release. Use 0 para sin límite (por defecto 10)
      --insecure-skip-tls-verify                   omite verificaciones de certificado TLS para la descarga del chart
  -i, --install                                    si un release con este nombre no existe, ejecuta una instalación
      --key-file string                            identifica el cliente HTTPS usando este archivo de clave SSL
      --keyring string                             ubicación de las claves públicas usadas para verificación (por defecto "~/.gnupg/pubring.gpg")
  -l, --labels stringToString                      etiquetas que se añadirán a los metadatos del release. Deben separarse por coma. Las etiquetas originales del release se fusionarán con las etiquetas del upgrade. Puede eliminar una etiqueta usando null. (por defecto [])
      --no-hooks                                   deshabilita los hooks pre/post upgrade
  -o, --output format                              imprime la salida en el formato especificado. Valores permitidos: table, json, yaml (por defecto table)
      --pass-credentials                           pasa credenciales a todos los dominios
      --password string                            contraseña del repositorio de charts donde localizar el chart solicitado
      --plain-http                                 usa conexiones HTTP inseguras para la descarga del chart
      --post-renderer postRendererString           la ruta a un ejecutable que se usará para post-renderizado. Si existe en $PATH, se usará el binario, de lo contrario intentará buscar el ejecutable en la ruta proporcionada
      --post-renderer-args postRendererArgsSlice   un argumento para el post-renderer (puede especificar múltiples) (por defecto [])
      --render-subchart-notes                      si se establece, renderiza las notas del subchart junto con el padre
      --repo string                                URL del repositorio de charts donde localizar el chart solicitado
      --reset-then-reuse-values                    al actualizar, restablece los valores a los incorporados en el chart, aplica los valores del último release y fusiona cualquier sobrescritura de la línea de comandos mediante --set y -f. Si se especifica '--reset-values' o '--reuse-values', esto se ignora
      --reset-values                               al actualizar, restablece los valores a los incorporados en el chart
      --reuse-values                               al actualizar, reutiliza los valores del último release y fusiona cualquier sobrescritura de la línea de comandos mediante --set y -f. Si se especifica '--reset-values', esto se ignora
      --set stringArray                            establece valores en la línea de comandos (puede especificar múltiples o separar valores con comas: key1=val1,key2=val2)
      --set-file stringArray                       establece valores desde los archivos respectivos especificados mediante la línea de comandos (puede especificar múltiples o separar valores con comas: key1=path1,key2=path2)
      --set-json stringArray                       establece valores JSON en la línea de comandos (puede especificar múltiples o separar valores con comas: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    establece un valor STRING literal en la línea de comandos
      --set-string stringArray                     establece valores STRING en la línea de comandos (puede especificar múltiples o separar valores con comas: key1=val1,key2=val2)
      --skip-crds                                  si se establece, no se instalarán CRDs cuando se realice un upgrade con la opción install habilitada. Por defecto, los CRDs se instalan si no están presentes, cuando se realiza un upgrade con la opción install habilitada
      --skip-schema-validation                     si se establece, deshabilita la validación de esquema JSON
      --take-ownership                             si se establece, el upgrade ignorará la verificación de anotaciones de helm y tomará posesión de los recursos existentes
      --timeout duration                           tiempo de espera para cualquier operación individual de Kubernetes (como Jobs para hooks) (por defecto 5m0s)
      --username string                            nombre de usuario del repositorio de charts donde localizar el chart solicitado
  -f, --values strings                             especifica valores en un archivo YAML o una URL (puede especificar múltiples)
      --verify                                     verifica el paquete antes de usarlo
      --version string                             especifica una restricción de versión para la versión del chart a usar. Esta restricción puede ser una etiqueta específica (ej. 1.1.1) o puede hacer referencia a un rango válido (ej. ^2.0.0). Si no se especifica, se usa la última versión
      --wait                                       si se establece, esperará hasta que todos los Pods, PVCs, Services, y el número mínimo de Pods de un Deployment, StatefulSet o ReplicaSet estén en estado ready antes de marcar el release como exitoso. Esperará tanto tiempo como --timeout
      --wait-for-jobs                              si se establece y --wait está habilitado, esperará hasta que todos los Jobs se hayan completado antes de marcar el release como exitoso. Esperará tanto tiempo como --timeout
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
