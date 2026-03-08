---
title: helm install
---

instala un chart

### Sinopsis

Este comando instala un archivo de chart.

El argumento de instalación debe ser una referencia de chart, una ruta a un chart empaquetado, una ruta a un directorio de chart desempaquetado o una URL.

Para sobrescribir valores en un chart, use la opción '--values' y proporcione un archivo, o use la opción '--set' y pase la configuración desde la línea de comandos. Para forzar un valor de tipo string, use '--set-string'. Puede usar '--set-file' para establecer valores individuales desde un archivo cuando el valor es demasiado largo para la línea de comandos o se genera dinámicamente. También puede usar '--set-json' para establecer valores JSON (escalares/objetos/arrays) desde la línea de comandos.

    $ helm install -f myvalues.yaml myredis ./redis

o

    $ helm install --set name=prod myredis ./redis

o

    $ helm install --set-string long_int=1234567890 myredis ./redis

o

    $ helm install --set-file my_script=dothings.sh myredis ./redis

o

    $ helm install --set-json 'master.sidecars=[{"name":"sidecar","image":"myImage","imagePullPolicy":"Always","ports":[{"name":"portname","containerPort":1234}]}]' myredis ./redis


Puede especificar la opción '--values'/'-f' múltiples veces. Se dará prioridad al último archivo especificado (el más a la derecha). Por ejemplo, si tanto myvalues.yaml como override.yaml contienen una clave llamada 'Test', el valor establecido en override.yaml tendrá precedencia:

    $ helm install -f myvalues.yaml -f override.yaml  myredis ./redis

Puede especificar la opción '--set' múltiples veces. Se dará prioridad al último valor especificado (el más a la derecha). Por ejemplo, si se asignan los valores 'bar' y 'newbar' a una clave llamada 'foo', el valor 'newbar' tendrá precedencia:

    $ helm install --set foo=bar --set foo=newbar  myredis ./redis

De manera similar, en el siguiente ejemplo 'foo' se establece como '["four"]':

    $ helm install --set-json='foo=["one", "two", "three"]' --set-json='foo=["four"]' myredis ./redis

Y en el siguiente ejemplo, 'foo' se establece como '{"key1":"value1","key2":"bar"}':

    $ helm install --set-json='foo={"key1":"value1","key2":"value2"}' --set-json='foo.key2="bar"' myredis ./redis

Para verificar los manifiestos generados de un release sin instalar el chart, se pueden combinar las opciones --debug y --dry-run.

La opción --dry-run mostrará todos los manifiestos de chart generados, incluyendo Secrets que pueden contener valores sensibles. Para ocultar los Secrets de Kubernetes use la opción --hide-secret. Por favor considere cuidadosamente cómo y cuándo usar estas opciones.

Si --verify está establecido, el chart DEBE tener un archivo de procedencia, y el archivo de procedencia DEBE pasar todos los pasos de verificación.

Existen seis formas diferentes de expresar el chart que desea instalar:

1. Por referencia de chart: helm install mymaria example/mariadb
2. Por ruta a un chart empaquetado: helm install mynginx ./nginx-1.2.3.tgz
3. Por ruta a un directorio de chart desempaquetado: helm install mynginx ./nginx
4. Por URL absoluta: helm install mynginx https://example.com/charts/nginx-1.2.3.tgz
5. Por referencia de chart y URL de repositorio: helm install --repo https://example.com/charts/ mynginx nginx
6. Por registros OCI: helm install mynginx --version 1.2.3 oci://example.com/charts/nginx

REFERENCIAS DE CHART

Una referencia de chart es una forma conveniente de referenciar un chart en un repositorio de charts.

Cuando usa una referencia de chart con un prefijo de repositorio ('example/mariadb'), Helm buscará en la configuración local un repositorio de charts llamado 'example', y luego buscará un chart en ese repositorio cuyo nombre sea 'mariadb'. Instalará la última versión estable de ese chart a menos que especifique la opción '--devel' para incluir también versiones de desarrollo (alpha, beta y release candidate), o proporcione un número de versión con la opción '--version'.

Para ver la lista de repositorios de charts, use 'helm repo list'. Para buscar charts en un repositorio, use 'helm search'.


```
helm install [NAME] [CHART] [flags]
```

### Opciones

```
      --atomic                                     si se establece, el proceso de instalación elimina la instalación en caso de fallo. La opción --wait se establecerá automáticamente si se usa --atomic
      --ca-file string                             verifica certificados de servidores habilitados con HTTPS usando este paquete de CA
      --cert-file string                           identifica el cliente HTTPS usando este archivo de certificado SSL
      --create-namespace                           crea el namespace del release si no está presente
      --dependency-update                          actualiza las dependencias si faltan antes de instalar el chart
      --description string                         añade una descripción personalizada
      --devel                                      usa también versiones de desarrollo. Equivalente a version '>0.0.0-0'. Si --version está establecido, esto se ignora
      --disable-openapi-validation                 si se establece, el proceso de instalación no validará las plantillas renderizadas contra el esquema OpenAPI de Kubernetes
      --dry-run string[="client"]                  simula una instalación. Si --dry-run se establece sin especificar opción o como '--dry-run=client', no intentará conexiones al clúster. Establecer '--dry-run=server' permite intentar conexiones al clúster.
      --enable-dns                                 habilita búsquedas DNS al renderizar plantillas
      --force                                      fuerza actualizaciones de recursos mediante una estrategia de reemplazo
  -g, --generate-name                              genera el nombre (y omite el parámetro NAME)
  -h, --help                                       ayuda para install
      --hide-notes                                 si se establece, no muestra las notas en la salida de instalación. No afecta su presencia en los metadatos del chart
      --hide-secret                                oculta los Secrets de Kubernetes cuando también se usa la opción --dry-run
      --insecure-skip-tls-verify                   omite verificaciones de certificado TLS para la descarga del chart
      --key-file string                            identifica el cliente HTTPS usando este archivo de clave SSL
      --keyring string                             ubicación de las claves públicas usadas para verificación (por defecto "~/.gnupg/pubring.gpg")
  -l, --labels stringToString                      etiquetas que se añadirán a los metadatos del release. Deben separarse por coma. (por defecto [])
      --name-template string                       especifica la plantilla usada para nombrar el release
      --no-hooks                                   evita que se ejecuten los hooks durante la instalación
  -o, --output format                              imprime la salida en el formato especificado. Valores permitidos: table, json, yaml (por defecto table)
      --pass-credentials                           pasa credenciales a todos los dominios
      --password string                            contraseña del repositorio de charts donde localizar el chart solicitado
      --plain-http                                 usa conexiones HTTP inseguras para la descarga del chart
      --post-renderer postRendererString           la ruta a un ejecutable que se usará para post-renderizado. Si existe en $PATH, se usará el binario, de lo contrario intentará buscar el ejecutable en la ruta proporcionada
      --post-renderer-args postRendererArgsSlice   un argumento para el post-renderer (puede especificar múltiples) (por defecto [])
      --render-subchart-notes                      si se establece, renderiza las notas del subchart junto con el padre
      --replace                                    reutiliza el nombre dado, solo si ese nombre es un release eliminado que permanece en el historial. Esto es inseguro en producción
      --repo string                                URL del repositorio de charts donde localizar el chart solicitado
      --set stringArray                            establece valores en la línea de comandos (puede especificar múltiples o separar valores con comas: key1=val1,key2=val2)
      --set-file stringArray                       establece valores desde los archivos respectivos especificados mediante la línea de comandos (puede especificar múltiples o separar valores con comas: key1=path1,key2=path2)
      --set-json stringArray                       establece valores JSON en la línea de comandos (puede especificar múltiples o separar valores con comas: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    establece un valor STRING literal en la línea de comandos
      --set-string stringArray                     establece valores STRING en la línea de comandos (puede especificar múltiples o separar valores con comas: key1=val1,key2=val2)
      --skip-crds                                  si se establece, no se instalarán CRDs. Por defecto, los CRDs se instalan si no están presentes
      --skip-schema-validation                     si se establece, deshabilita la validación de esquema JSON
      --take-ownership                             si se establece, la instalación ignorará la verificación de anotaciones de helm y tomará posesión de los recursos existentes
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
      --qps float32                     consultas por segundo usadas al comunicarse con la API de Kubernetes, sin incluir ráfagas
      --registry-config string          ruta al archivo de configuración del registro (por defecto "~/.config/helm/registry/config.json")
      --repository-cache string         ruta al directorio que contiene los índices de repositorios en caché (por defecto "~/.cache/helm/repository")
      --repository-config string        ruta al archivo que contiene los nombres y URLs de repositorios (por defecto "~/.config/helm/repositories.yaml")
```

### VEA TAMBIÉN

* [helm](./helm.md)	 - El gestor de paquetes Helm para Kubernetes.

###### Generado automáticamente por spf13/cobra el 14-Jan-2026
