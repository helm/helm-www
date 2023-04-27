# Cheat Sheet - HELM

Helm cheatsheet con todos los comandos necesarios para gestionar una aplicación a través de Helm.

-----------------------------------------------------------------------------------------------------------------------------------------------
### Interpretaciones básicas/contexto

Chart:
- Es el nombre de una Chart en caso de que haya sido subida pero no arrancada.
- Es <nombre_repo>/<nombre_chart> en caso de que el repositorio se haya añadido pero la chart no se haya extraído.
- Es la URL/ruta absoluta a la chart.

Name:
- Es el nombre que quiere dar a su instalación actual de helm chart.

Release:
- Es el nombre que asignó a una instancia de instalación.

Revision:
- Es el valor del comando Helm history

Repo-name:
- El nombre de un repositorio.

DIR:
- Nombre del directorio/ruta

------------------------------------------------------------------------------------------------------------------------------------------------

### Gestión de Charts

```bash
helm create <name>                      # Crea un directorio de chart junto con los archivos y directorios comunes usados en una chart.
helm package <chart-path>               # Empaqueta una chart en un archivo chart versionado.
helm lint <chart>                       # Ejecuta pruebas para examinar una chart e identificar posibles problemas
helm show all <chart>                   # Inspeccionar una chart y listar su contenido
helm show values <chart>                # Muestra el contenido del archivo values.yaml.
helm pull <chart>                       # Descargar/extraer chart 
helm pull <chart> --untar=true          #  Si se establece en true, se desempaquetará la chart después de descargar
helm pull <chart> --verify              # Verificar el paquete antes de usarlo
helm pull <chart> --version <number>    # Se usa Default-latest, especifica una restricción de versión para la versión de la chart a usar
helm dependency list <chart>            # Mostrar una lista de las dependencias de una chart
``` 
--------------------------------------------------------------------------------------------------------------------------------------------------

### Instalar y desinstalar aplicaciones

```bash
helm install <name> <chart>                           # Instalar la chart con un nombre
helm install <name> <chart> --namespace <namespace>   # Instalar la chart en un namespace específico
helm install <name> <chart> --set key1=val1,key2=val2 # Establecer valores en la línea de comandos (se pueden especificar varios valores o separarlos con comas)
helm install <name> <chart> --values <yaml-file/url>  # Instalar la chart con los valores especificados
helm install <name> <chart> --dry-run --debug         # Ejecuta una instalación de prueba para validar la chart (p)
helm install <name> <chart> --verify                  # Verificar el paquete antes de usarlo 
helm install <name> <chart> --dependency-update       # actualizar dependencias si faltan antes de instalar la chart
helm uninstall <name>                                 # Desinstalar una release
```
------------------------------------------------------------------------------------------------------------------------------------------------
### Actualizar y revertir la aplicación (Rollback)

```bash
helm upgrade <release> <chart>                            # Actualizar una release
helm upgrade <release> <chart> --atomic                   # Si se establece, el proceso de actualización deshace los cambios realizados en caso de actualización fallida.
helm upgrade <release> <chart> --dependency-update        # Actualiza las dependencias si faltan antes de instalar la chart
helm upgrade <release> <chart> --version <version_number> # especifica una restricción de versión para la versión de la chart a usar
helm upgrade <release> <chart> --values                   # especificar valores en un archivo YAML o una URL (puede especificar múltiple
helm upgrade <release> <chart> --set key1=val1,key2=val2  # Establecer valores en la línea de comandos (puede especificar valores múltiples o separadose)
helm upgrade <release> <chart> --force                    # Forzar actualizaciones de recursos mediante una estrategia de reemplazo.
helm rollback <release> <revision>                        # Retroceder una versión a una revisión específica
helm rollback <release> <revision>  --cleanup-on-fail     # Permitir el borrado de nuevos recursos creados en este rollback cuando el rollback falla
``` 
------------------------------------------------------------------------------------------------------------------------------------------------
### Listar, añadir, eliminar y actualizar repositorios

```bash
helm repo add <repo-name> <url>   # Añadir un repositorio desde internet
helm repo list                    # Listar los repositorios de chart añadidas
helm repo update                  # Actualizar la información de las charts disponibles localmente desde los repositorios de charts.
helm repo remove <repo_name>      # Eliminar uno o más repositorios de charts
helm repo index <DIR>             # Leer el directorio actual y generar un fichero índice basado en las charts encontradas.
helm repo index <DIR> --merge     # Fusionar el índice generado con un archivo de índice existente.
helm search repo <keyword>        # Buscar en los repositorios una palabra clave en las charts
helm search hub <keyword>         # Buscar charts en Artifact Hub o en la propia instancia de hub.
```
-------------------------------------------------------------------------------------------------------------------------------------------------
### MonitorizaciónHelm Release

```bash
helm list                       # Lista todas las release. Usa el contexto del namespace actual si no se especifica.
helm list -all                  # Muestra todas las releases sin aplicar ningún filtro, puede usar -a
helm list -all-namespaces       # Muestra todas las releases de todos los namespaces, podemos usar -A
helm -l key1=value1,key2=value2 # Selector (label query) para filtrar, soporta '=', '==', y '!='
helm list --date                # Ordenar por fecha de publicación
helm list --deployed            # Muestra las releases desplegadas. Si no se especifica otra, se activará automáticamente
helm list --pending             # Muestra las releases pendientes
helm list --failed              # Muestra las releases fallidas
helm list --uninstalled         # Muestra las releases desinstaladas (si se uso 'helm uninstall --keep-history')
helm list --superseded          # Muestra las releases sustituidas
helm list -o yaml               # Imprime la salida en el formato especificado. Valores permitidos: table, json, yaml (por defecto table)
helm status <release>           # Este comando muestra el estado de una release con nombre.
helm status <release> --revision <number>   # si se establece, muestra el estado de la release nombrada con la revisión
helm history <release>          # Historial de revisiones para una release dada.
helm env                        # Imprime toda la información de entorno usada por Helm
```
-------------------------------------------------------------------------------------------------------------------------------------------------
### Descargar información de Release

```bash
helm get all <release>      # Una colección legible por humanos de información sobre las notas, hooks, valores suministrados, y fichero de manifiesto generado de la release dada.
helm get hooks <release>    # Este comando descarga los hooks para una release dada. Los hooks están formateados en YAML y separados por el separador YAML '---\n'.
helm get manifest <release> # Un manifiesto es una representación codificada en YAML de los recursos de Kubernetes que se generaron a partir de la(s) chart(s) de esta release. Si un chart depende de otras charts, esos recursos también se incluirán en el manifiesto.
helm get notes <release>    # Muestra las notas proporcionadas por la chart de una release con nombre.
helm get values <release>   # Descarga un archivo de valores para un lanzamiento dado. use -o para formatear la salida
```
-------------------------------------------------------------------------------------------------------------------------------------------------
### Gestión de plugins

```bash
helm plugin install <path/url1>     # Instalar plugins
helm plugin list                    # Ver una lista de todos los plugins instalados
helm plugin update <plugin>         # Actualizar plugins
helm plugin uninstall <plugin>      # Desinstalar un plugin
```
-------------------------------------------------------------------------------------------------------------------------------------------------
