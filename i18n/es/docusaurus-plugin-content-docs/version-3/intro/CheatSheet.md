---
title: Guía Rápida
description: Guía rápida de comandos de Helm
sidebar_position: 4
---

Guía rápida de Helm con todos los comandos necesarios para gestionar una aplicación a través de Helm.

-----------------------------------------------------------------------------------------------------------------------------------------------
### Interpretaciones básicas/contexto

Chart:
- Es el nombre de su chart en caso de que haya sido descargada y descomprimida.
- Es <nombre_repo>/<nombre_chart> en caso de que el repositorio se haya añadido pero la chart no se haya descargado.
- Es la URL/ruta absoluta a la chart.

Name:
- Es el nombre que desea dar a su instalación actual de Helm chart.

Release:
- Es el nombre que asignó a una instancia de instalación.

Revision:
- Es el valor del comando Helm history.

Repo-name:
- El nombre de un repositorio.

DIR:
- Nombre del directorio/ruta.

------------------------------------------------------------------------------------------------------------------------------------------------

### Gestión de Charts

```bash
helm create <name>                      # Crea un directorio de chart junto con los archivos y directorios comunes usados en una chart.
helm package <chart-path>               # Empaqueta una chart en un archivo chart versionado.
helm lint <chart>                       # Ejecuta pruebas para examinar una chart e identificar posibles problemas.
helm show all <chart>                   # Inspecciona una chart y lista su contenido.
helm show values <chart>                # Muestra el contenido del archivo values.yaml.
helm pull <chart>                       # Descarga una chart.
helm pull <chart> --untar=true          # Si se establece en true, descomprime la chart después de descargarla.
helm pull <chart> --verify              # Verifica el paquete antes de usarlo.
helm pull <chart> --version <number>    # Por defecto se usa la última versión; especifica una restricción de versión para la chart.
helm dependency list <chart>            # Muestra una lista de las dependencias de una chart.
```
--------------------------------------------------------------------------------------------------------------------------------------------------

### Instalar y desinstalar aplicaciones

```bash
helm install <name> <chart>                           # Instala la chart con un nombre.
helm install <name> <chart> --namespace <namespace>   # Instala la chart en un namespace específico.
helm install <name> <chart> --set key1=val1,key2=val2 # Establece valores en la línea de comandos (puede especificar varios o separarlos con comas).
helm install <name> <chart> --values <yaml-file/url>  # Instala la chart con los valores especificados.
helm install <name> <chart> --dry-run --debug         # Ejecuta una instalación de prueba para validar la chart (p).
helm install <name> <chart> --verify                  # Verifica el paquete antes de usarlo.
helm install <name> <chart> --dependency-update       # Actualiza dependencias si faltan antes de instalar la chart.
helm uninstall <name>                                 # Desinstala una release del namespace actual (por defecto).
helm uninstall <release-name> --namespace <namespace> # Desinstala una release del namespace especificado.
```
------------------------------------------------------------------------------------------------------------------------------------------------
### Actualizar y revertir la aplicación (Rollback)

```bash
helm upgrade <release> <chart>                            # Actualiza una release.
helm upgrade <release> <chart> --rollback-on-failure      # Si se establece, el proceso de actualización revierte los cambios en caso de fallo.
helm upgrade <release> <chart> --dependency-update        # Actualiza las dependencias si faltan antes de instalar la chart.
helm upgrade <release> <chart> --version <version_number> # Especifica una restricción de versión para la chart a usar.
helm upgrade <release> <chart> --values                   # Especifica valores en un archivo YAML o una URL (puede especificar múltiples).
helm upgrade <release> <chart> --set key1=val1,key2=val2  # Establece valores en la línea de comandos (puede especificar múltiples o separados).
helm upgrade <release> <chart> --force                    # Fuerza la actualización de recursos mediante una estrategia de reemplazo.
helm rollback <release> <revision>                        # Revierte una release a una revisión específica.
helm rollback <release> <revision>  --cleanup-on-fail     # Permite eliminar nuevos recursos creados en este rollback si el rollback falla.
```
------------------------------------------------------------------------------------------------------------------------------------------------
### Listar, añadir, eliminar y actualizar repositorios

```bash
helm repo add <repo-name> <url>   # Añade un repositorio desde internet.
helm repo list                    # Lista los repositorios de charts añadidos.
helm repo update                  # Actualiza la información local de charts disponibles desde los repositorios.
helm repo remove <repo_name>      # Elimina uno o más repositorios de charts.
helm repo index <DIR>             # Lee el directorio actual y genera un archivo de índice basado en las charts encontradas.
helm repo index <DIR> --merge     # Fusiona el índice generado con un archivo de índice existente.
helm search repo <keyword>        # Busca una palabra clave en los charts de los repositorios.
helm search hub <keyword>         # Busca charts en Artifact Hub o en su propia instancia de hub.
```
-------------------------------------------------------------------------------------------------------------------------------------------------
### Monitorización de Helm Release

```bash
helm list                       # Lista todas las releases del namespace especificado; usa el namespace actual si no se especifica.
helm list --all                 # Muestra todas las releases sin aplicar ningún filtro, puede usar -a.
helm list --all-namespaces      # Lista releases en todos los namespaces, puede usar -A.
helm list -l key1=value1,key2=value2 # Selector (label query) para filtrar, soporta '=', '==', y '!='.
helm list --date                # Ordena por fecha de release.
helm list --deployed            # Muestra las releases desplegadas. Si no se especifica otra opción, se activa automáticamente.
helm list --pending             # Muestra las releases pendientes.
helm list --failed              # Muestra las releases fallidas.
helm list --uninstalled         # Muestra las releases desinstaladas (si se usó 'helm uninstall --keep-history').
helm list --superseded          # Muestra las releases sustituidas.
helm list -o yaml               # Imprime la salida en el formato especificado. Valores permitidos: table, json, yaml (por defecto table).
helm status <release>           # Muestra el estado de una release con nombre.
helm status <release> --revision <number>   # Si se establece, muestra el estado de la release nombrada con la revisión.
helm history <release>          # Historial de revisiones para una release dada.
helm env                        # Imprime toda la información de entorno usada por Helm.
```
-------------------------------------------------------------------------------------------------------------------------------------------------
### Descargar información de Release

```bash
helm get all <release>      # Una colección legible de información sobre las notas, hooks, valores suministrados y archivo de manifiesto generado de la release dada.
helm get hooks <release>    # Descarga los hooks para una release dada. Los hooks están formateados en YAML y separados por el separador YAML '---\n'.
helm get manifest <release> # Un manifiesto es una representación codificada en YAML de los recursos de Kubernetes generados a partir de la(s) chart(s) de esta release. Si una chart depende de otras charts, esos recursos también se incluirán en el manifiesto.
helm get notes <release>    # Muestra las notas proporcionadas por la chart de una release con nombre.
helm get values <release>   # Descarga un archivo de valores para una release dada. Use -o para formatear la salida.
```
-------------------------------------------------------------------------------------------------------------------------------------------------
### Gestión de plugins

```bash
helm plugin install <path/url>      # Instala plugins.
helm plugin list                    # Muestra una lista de todos los plugins instalados.
helm plugin update <plugin>         # Actualiza plugins.
helm plugin uninstall <plugin>      # Desinstala un plugin.
```
-------------------------------------------------------------------------------------------------------------------------------------------------
