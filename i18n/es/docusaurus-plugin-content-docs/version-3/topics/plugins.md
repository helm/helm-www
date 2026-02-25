---
title: Guía de Plugins de Helm
description: Introduce cómo usar y crear plugins para extender la funcionalidad de Helm.
sidebar_position: 12
---

Un plugin de Helm es una herramienta a la que se puede acceder a través del CLI
de `helm`, pero que no forma parte del código base incorporado de Helm.

Los plugins existentes se pueden encontrar en la sección [relacionados](/community/related#helm-plugins)
o buscando en [GitHub](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories).

Esta guía explica cómo usar y crear plugins.

## Descripción General

Los plugins de Helm son herramientas complementarias que se integran perfectamente
con Helm. Proporcionan una forma de extender el conjunto de características principales
de Helm, sin requerir que cada nueva característica sea escrita en Go y añadida
a la herramienta principal.

Los plugins de Helm tienen las siguientes características:

- Se pueden agregar y eliminar de una instalación de Helm sin afectar la
  herramienta principal de Helm.
- Pueden ser escritos en cualquier lenguaje de programación.
- Se integran con Helm y aparecerán en `helm help` y otros lugares.

Los plugins de Helm residen en `$HELM_PLUGINS`. Puede encontrar el valor actual
de esta variable, incluyendo el valor predeterminado cuando no está configurada
en el entorno, usando el comando `helm env`.

El modelo de plugins de Helm está parcialmente basado en el modelo de plugins de
Git. Por esa razón, a veces puede escuchar que `helm` se denomina la capa de
_porcelana_, mientras que los plugins son la _fontanería_. Esta es una forma
abreviada de sugerir que Helm proporciona la experiencia del usuario y la lógica
de procesamiento de alto nivel, mientras que los plugins hacen el "trabajo de
detalle" de realizar una acción deseada.

## Instalar un Plugin

Los plugins se instalan usando el comando `$ helm plugin install <path|url>`. Puede
pasar una ruta a un plugin en su sistema de archivos local o una URL de un
repositorio VCS remoto. El comando `helm plugin install` clona o copia el plugin
en la ruta/URL proporcionada en `$HELM_PLUGINS`. Si está instalando desde un VCS,
puede especificar la versión con el argumento `--version`.

```console
$ helm plugin install https://github.com/adamreese/helm-env
```

Si tiene una distribución tar de un plugin, simplemente descomprima el plugin en
el directorio `$HELM_PLUGINS`. También puede instalar plugins tarball
directamente desde una URL usando `helm plugin install
https://domain/path/to/plugin.tar.gz`

## Estructura de Archivos del Plugin

En muchos aspectos, un plugin es similar a un chart. Cada plugin tiene un directorio
de nivel superior que contiene un archivo `plugin.yaml`. Pueden estar presentes
archivos adicionales, pero solo el archivo `plugin.yaml` es requerido.

```console
$HELM_PLUGINS/
  |- last/
      |- plugin.yaml
```

## El Archivo plugin.yaml

El archivo plugin.yaml es requerido para un plugin. Contiene los siguientes campos:

```yaml
name: The name of the plugin (REQUIRED)
version: A SemVer 2 version (REQUIRED)
usage: Single line usage text shown in help
description: Long description shown in places like helm help
ignoreFlags: Ignore flags passed in from Helm
platformCommand: # Configure command to run based on the platform
  - os: OS match, can be empty or omitted to match all OS'
    arch: Architecture match, can be empty or omitted to match all architectures
    command: Plugin command to execute
    args: Plugin command arguments
command: (DEPRECATED) Plugin command, use platformCommand instead
platformHooks: # Configure plugin lifecycle hooks based on the platform
  install: # Install lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin install command to execute
      args: Plugin install command arguments
  update: # Update lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin update command to execute
      args: Plugin update command arguments
  delete: # Delete lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin delete command to execute
      args: Plugin delete command arguments
hooks: # (Deprecated) Plugin lifecycle hooks, use platformHooks instead
  install: Command to install plugin
  update: Command to update plugin
  delete: Command to delete plugin
downloaders: # Configure downloaders capability
  - command: Command to invoke
    protocols:
      - Protocol schema supported
```

### El Campo `name`

El `name` es el nombre del plugin. Cuando Helm ejecuta este plugin, este es el
nombre que usará (por ejemplo, `helm NAME` invocará este plugin).

_`name` debe coincidir con el nombre del directorio._ En nuestro ejemplo anterior,
eso significa que el plugin con `name: last` debe estar contenido en un directorio
llamado `last`.

Restricciones sobre `name`:

- `name` no puede duplicar uno de los comandos de nivel superior existentes de `helm`.
- `name` debe estar restringido a los caracteres ASCII a-z, A-Z, 0-9, `_` y `-`.

### El Campo `version`

El `version` es la versión SemVer 2 del plugin. `usage` y `description` se
utilizan para generar el texto de ayuda de un comando.

### El Campo `ignoreFlags`

El interruptor `ignoreFlags` le indica a Helm que _no_ pase banderas al plugin.
Por lo tanto, si un plugin se llama con `helm myplugin --foo` e `ignoreFlags: true`,
entonces `--foo` se descarta silenciosamente.

### El Campo `platformCommand`

El campo `platformCommand` configura el comando que el plugin ejecutará cuando
sea invocado. No puede establecer tanto `platformCommand` como `command`, ya que
esto resultará en un error. Se aplicarán las siguientes reglas para decidir qué
comando usar:

- Si `platformCommand` está presente, se usará.
  - Si tanto `os` como `arch` coinciden con la plataforma actual, la búsqueda se
  detendrá y se usará el comando.
  - Si `os` coincide y `arch` está vacío, se usará el comando.
  - Si tanto `os` como `arch` están vacíos, se usará el comando.
  - Si no hay coincidencia, Helm saldrá con un error.
- Si `platformCommand` no está presente y el obsoleto `command` está presente,
se usará.
  - Si el comando está vacío, Helm saldrá con un error.

### El Campo `platformHooks`

El campo `platformHooks` configura los comandos que el plugin ejecutará para
eventos del ciclo de vida. No puede establecer tanto `platformHooks` como `hooks`,
ya que esto resultará en un error. Se aplicarán las siguientes reglas para decidir
qué comando de hook usar:

- Si `platformHooks` está presente, se usará y se procesarán los comandos para
el evento del ciclo de vida.
  - Si tanto `os` como `arch` coinciden con la plataforma actual, la búsqueda se
  detendrá y se usará el comando.
  - Si `os` coincide y `arch` está vacío, se usará el comando.
  - Si tanto `os` como `arch` están vacíos, se usará el comando.
  - Si no hay coincidencia, Helm omitirá el evento.
- Si `platformHooks` no está presente y el obsoleto `hooks` está presente, se
usará el comando para el evento del ciclo de vida.
  - Si el comando está vacío, Helm omitirá el evento.

## Construir un Plugin

Aquí está el YAML del plugin para un plugin simple que ayuda a obtener el nombre
del último release:

```yaml
name: last
version: 0.1.0
usage: get the last release name
description: get the last release name
ignoreFlags: false
platformCommand:
  - command: ${HELM_BIN}
    args:
      - list
      - --short
      - --max=1
      - --date
      - -r
```

Los plugins pueden requerir scripts y ejecutables adicionales.
Los scripts pueden incluirse en el directorio del plugin y los ejecutables pueden
descargarse mediante un hook. El siguiente es un ejemplo de plugin:

```console
$HELM_PLUGINS/
  |- myplugin/
    |- scripts/
      |- install.ps1
      |- install.sh
    |- plugin.yaml
```

```yaml
name: myplugin
version: 0.1.0
usage: example plugin
description: example plugin
ignoreFlags: false
platformCommand:
  - command: ${HELM_PLUGIN_DIR}/bin/myplugin
  - os: windows
    command: ${HELM_PLUGIN_DIR}\bin\myplugin.exe
platformHooks:
  install:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
  update:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
      args:
        - -u
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
        - -Update
```

Las variables de entorno se interpolan antes de que el plugin se ejecute. El
patrón anterior ilustra la forma preferida de indicar dónde reside el programa
del plugin.

### Comandos del Plugin

Hay algunas estrategias para trabajar con comandos de plugins:

- Si un plugin incluye un ejecutable, el ejecutable para un `platformCommand:` o
  debe estar empaquetado en el directorio del plugin o instalado mediante un hook.
- La línea `platformCommand:` o `command:` tendrá todas las variables de entorno
  expandidas antes de la ejecución. `$HELM_PLUGIN_DIR` apuntará al directorio
  del plugin.
- El comando en sí no se ejecuta en un shell. Por lo tanto, no puede escribir
  un script de shell en una sola línea.
- Helm inyecta mucha configuración en variables de entorno. Examine el entorno
  para ver qué información está disponible.
- Helm no hace suposiciones sobre el lenguaje del plugin. Puede escribirlo en el
  lenguaje que prefiera.
- Los comandos son responsables de implementar texto de ayuda específico para `-h`
  y `--help`. Helm usará `usage` y `description` para `helm help` y `helm
  help myplugin`, pero no manejará `helm myplugin --help`.

### Probar un Plugin Local

Primero necesita encontrar la ruta de su `HELM_PLUGINS`. Para hacerlo, ejecute el
siguiente comando:

``` bash
helm env
```

Cambie su directorio actual al directorio donde está configurado `HELM_PLUGINS`.

Ahora puede agregar un enlace simbólico a la salida de compilación de su plugin.
En este ejemplo lo hicimos para `mapkubeapis`.

``` bash
ln -s ~/GitHub/helm-mapkubeapis ./helm-mapkubeapis
```

## Plugins de Descarga

Por defecto, Helm puede descargar Charts usando HTTP/S. A partir de Helm 2.4.0,
los plugins pueden tener una capacidad especial para descargar Charts desde
fuentes arbitrarias.

Los plugins deben declarar esta capacidad especial en el archivo `plugin.yaml`
(nivel superior):

```yaml
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

Si dicho plugin está instalado, Helm puede interactuar con el repositorio usando
el esquema de protocolo especificado invocando el `command`. El repositorio
especial debe agregarse de manera similar a los regulares: `helm repo add favorite
myprotocol://example.com/`. Las reglas para los repositorios especiales son las
mismas que para los regulares: Helm debe poder descargar el archivo `index.yaml`
para descubrir y almacenar en caché la lista de Charts disponibles.

El comando definido se invocará con el siguiente esquema: `command certFile
keyFile caFile full-URL`. Las credenciales SSL provienen de la definición del
repositorio, almacenada en `$HELM_REPOSITORY_CONFIG`
(es decir, `$HELM_CONFIG_HOME/repositories.yaml`). Se espera que un plugin de
descarga envíe el contenido sin procesar a stdout e informe errores en stderr.

El comando de descarga también admite subcomandos o argumentos, lo que le permite
especificar, por ejemplo, `bin/mydownloader subcommand -d` en el `plugin.yaml`.
Esto es útil si desea usar el mismo ejecutable para el comando principal del
plugin y el comando de descarga, pero con un subcomando diferente para cada uno.

## Variables de Entorno

Cuando Helm ejecuta un plugin, pasa el entorno externo al plugin y también
inyecta algunas variables de entorno adicionales.

Variables como `KUBECONFIG` se configuran para el plugin si están configuradas
en el entorno externo.

Se garantiza que las siguientes variables estarán configuradas:

- `HELM_PLUGINS`: La ruta al directorio de plugins.
- `HELM_PLUGIN_NAME`: El nombre del plugin, como fue invocado por `helm`. Así que
  `helm myplug` tendrá el nombre corto `myplug`.
- `HELM_PLUGIN_DIR`: El directorio que contiene el plugin.
- `HELM_BIN`: La ruta al comando `helm` (como fue ejecutado por el usuario).
- `HELM_DEBUG`: Indica si la bandera de depuración fue establecida por helm.
- `HELM_REGISTRY_CONFIG`: La ubicación de la configuración del registro (si se
  usa). Tenga en cuenta que el uso de Helm con registros es una característica
  experimental.
- `HELM_REPOSITORY_CACHE`: La ruta a los archivos de caché del repositorio.
- `HELM_REPOSITORY_CONFIG`: La ruta al archivo de configuración del repositorio.
- `HELM_NAMESPACE`: El namespace dado al comando `helm` (generalmente usando
  la bandera `-n`).
- `HELM_KUBECONTEXT`: El nombre del contexto de configuración de Kubernetes dado
  al comando `helm`.

Adicionalmente, si se especificó explícitamente un archivo de configuración de
Kubernetes, se establecerá como la variable `KUBECONFIG`.

## Una Nota sobre el Análisis de Banderas

Al ejecutar un plugin, Helm analizará las banderas globales para su propio uso.
Ninguna de estas banderas se pasa al plugin.
- `--burst-limit`: Esto se convierte a `$HELM_BURST_LIMIT`
- `--debug`: Si se especifica, `$HELM_DEBUG` se establece en `1`
- `--kube-apiserver`: Esto se convierte a `$HELM_KUBEAPISERVER`
- `--kube-as-group`: Estas se convierten a `$HELM_KUBEASGROUPS`
- `--kube-as-user`: Esto se convierte a `$HELM_KUBEASUSER`
- `--kube-ca-file`: Esto se convierte a `$HELM_KUBECAFILE`
- `--kube-context`: Esto se convierte a `$HELM_KUBECONTEXT`
- `--kube-insecure-skip-tls-verify`: Esto se convierte a `$HELM_KUBEINSECURE_SKIP_TLS_VERIFY`
- `--kube-tls-server-name`: Esto se convierte a `$HELM_KUBETLS_SERVER_NAME`
- `--kube-token`: Esto se convierte a `$HELM_KUBETOKEN`
- `--kubeconfig`: Esto se convierte a `$KUBECONFIG`
- `--namespace` y `-n`: Esto se convierte a `$HELM_NAMESPACE`
- `--qps`: Esto se convierte a `$HELM_QPS`
- `--registry-config`: Esto se convierte a `$HELM_REGISTRY_CONFIG`
- `--repository-cache`: Esto se convierte a `$HELM_REPOSITORY_CACHE`
- `--repository-config`: Esto se convierte a `$HELM_REPOSITORY_CONFIG`

Los plugins _deberían_ mostrar texto de ayuda y luego salir para `-h` y `--help`.
En todos los demás casos, los plugins pueden usar banderas según sea apropiado.

## Proporcionar Auto-completado de Shell

A partir de Helm 3.2, un plugin puede opcionalmente proporcionar soporte para
auto-completado de shell como parte del mecanismo de auto-completado existente
de Helm.

### Auto-completado Estático

Si un plugin proporciona sus propias banderas y/o subcomandos, puede informar a
Helm de ellos teniendo un archivo `completion.yaml` ubicado en el directorio raíz
del plugin. El archivo `completion.yaml` tiene la siguiente forma:

```yaml
name: <pluginName>
flags:
- <flag 1>
- <flag 2>
validArgs:
- <arg value 1>
- <arg value 2>
commands:
  name: <commandName>
  flags:
  - <flag 1>
  - <flag 2>
  validArgs:
  - <arg value 1>
  - <arg value 2>
  commands:
     <and so on, recursively>
```

Notas:

1. Todas las secciones son opcionales pero deben proporcionarse si son aplicables.
1. Las banderas no deben incluir el prefijo `-` o `--`.
1. Se pueden y deben especificar tanto banderas cortas como largas. Una bandera
   corta no necesita estar asociada con su forma larga correspondiente, pero ambas
   formas deben listarse.
1. Las banderas no necesitan estar ordenadas de ninguna manera, pero deben listarse
   en el punto correcto de la jerarquía de subcomandos del archivo.
1. Las banderas globales existentes de Helm ya son manejadas por el mecanismo de
   auto-completado de Helm, por lo tanto los plugins no necesitan especificar las
   siguientes banderas `--debug`, `--namespace` o `-n`, `--kube-context`, y
   `--kubeconfig`, ni ninguna otra bandera global.
1. La lista `validArgs` proporciona una lista estática de posibles completados
   para el primer parámetro después de un subcomando. No siempre es posible
   proporcionar dicha lista por adelantado (consulte la sección [Completado
   Dinámico](#completado-dinámico) a continuación), en cuyo caso la sección
   `validArgs` puede omitirse.

El archivo `completion.yaml` es completamente opcional. Si no se proporciona,
Helm simplemente no proporcionará auto-completado de shell para el plugin (a
menos que el plugin soporte [Completado Dinámico](#completado-dinámico)).
Además, agregar un archivo `completion.yaml` es compatible con versiones anteriores
y no afectará el comportamiento del plugin cuando se usen versiones anteriores
de helm.

Como ejemplo, para el plugin [`fullstatus`](https://github.com/marckhouzam/helm-fullstatus)
que no tiene subcomandos pero acepta las mismas banderas que el comando
`helm status`, el archivo `completion.yaml` es:

```yaml
name: fullstatus
flags:
- o
- output
- revision
```

Un ejemplo más complejo para el plugin [`2to3`](https://github.com/helm/helm-2to3),
tiene un archivo `completion.yaml` de:

```yaml
name: 2to3
commands:
- name: cleanup
  flags:
  - config-cleanup
  - dry-run
  - l
  - label
  - release-cleanup
  - s
  - release-storage
  - tiller-cleanup
  - t
  - tiller-ns
  - tiller-out-cluster
- name: convert
  flags:
  - delete-v2-releases
  - dry-run
  - l
  - label
  - s
  - release-storage
  - release-versions-max
  - t
  - tiller-ns
  - tiller-out-cluster
- name: move
  commands:
  - name: config
    flags:
    - dry-run
```

### Completado Dinámico

También a partir de Helm 3.2, los plugins pueden proporcionar su propio
auto-completado dinámico de shell. El auto-completado dinámico de shell es el
completado de valores de parámetros o valores de banderas que no pueden definirse
por adelantado. Por ejemplo, el completado de los nombres de releases de helm
actualmente disponibles en el clúster.

Para que el plugin soporte el completado dinámico, debe proporcionar un archivo
**ejecutable** llamado `plugin.complete` en su directorio raíz. Cuando el script
de completado de Helm requiere completados dinámicos para el plugin, ejecutará
el archivo `plugin.complete`, pasándole la línea de comandos que necesita ser
completada. El ejecutable `plugin.complete` deberá tener la lógica para determinar
cuáles son las opciones de completado apropiadas y enviarlas a la salida estándar
para ser consumidas por el script de completado de Helm.

El archivo `plugin.complete` es completamente opcional. Si no se proporciona,
Helm simplemente no proporcionará auto-completado dinámico para el plugin.
Además, agregar un archivo `plugin.complete` es compatible con versiones anteriores
y no afectará el comportamiento del plugin cuando se usen versiones anteriores
de helm.

La salida del script `plugin.complete` debe ser una lista separada por nuevas
líneas como:

```console
rel1
rel2
rel3
```

Cuando se llama a `plugin.complete`, el entorno del plugin se configura igual que
cuando se llama al script principal del plugin. Por lo tanto, las variables
`$HELM_NAMESPACE`, `$HELM_KUBECONTEXT` y todas las demás variables del plugin ya
estarán configuradas, y sus banderas globales correspondientes habrán sido
eliminadas.

El archivo `plugin.complete` puede estar en cualquier forma ejecutable; puede ser
un script de shell, un programa Go o cualquier otro tipo de programa que Helm
pueda ejecutar. El archivo `plugin.complete` ***debe*** tener permisos de
ejecución para el usuario. El archivo `plugin.complete` ***debe*** salir con un
código de éxito (valor 0).

En algunos casos, el completado dinámico requerirá obtener información del clúster
de Kubernetes. Por ejemplo, el plugin `helm fullstatus` requiere un nombre de
release como entrada. En el plugin `fullstatus`, para que su script
`plugin.complete` proporcione completado para los nombres de releases actuales,
simplemente puede ejecutar `helm list -q` y mostrar el resultado.

Si se desea usar el mismo ejecutable para la ejecución del plugin y para el
completado del plugin, el script `plugin.complete` puede configurarse para llamar
al ejecutable principal del plugin con algún parámetro o bandera especial; cuando
el ejecutable principal del plugin detecte el parámetro o bandera especial, sabrá
que debe ejecutar el completado. En nuestro ejemplo, `plugin.complete` podría
implementarse así:

```sh
#!/usr/bin/env sh

# "$@" is the entire command-line that requires completion.
# It is important to double-quote the "$@" variable to preserve a possibly empty last parameter.
$HELM_PLUGIN_DIR/status.sh --complete "$@"
```

El script real del plugin `fullstatus` (`status.sh`) debe entonces buscar la
bandera `--complete` y, si la encuentra, mostrar los completados apropiados.

### Consejos y Trucos

1. El shell filtrará automáticamente las opciones de completado que no coincidan
   con la entrada del usuario. Por lo tanto, un plugin puede devolver todos los
   completados relevantes sin eliminar los que no coinciden con la entrada del
   usuario. Por ejemplo, si la línea de comandos es `helm fullstatus ngin<TAB>`,
   el script `plugin.complete` puede mostrar *todos* los nombres de releases (del
   namespace `default`), no solo los que comienzan con `ngin`; el shell solo
   mantendrá los que comienzan con `ngin`.
1. Para simplificar el soporte de completado dinámico, especialmente si tiene un
   plugin complejo, puede hacer que su script `plugin.complete` llame a su script
   principal del plugin y solicite opciones de completado. Consulte la sección
   [Completado Dinámico](#completado-dinámico) anterior para ver un ejemplo.
1. Para depurar el completado dinámico y el archivo `plugin.complete`, puede
   ejecutar lo siguiente para ver los resultados de completado:
    - `helm __complete <pluginName> <arguments to complete>`. Por ejemplo:
    - `helm __complete fullstatus --output js<ENTER>`,
    - `helm __complete fullstatus -o json ""<ENTER>`
