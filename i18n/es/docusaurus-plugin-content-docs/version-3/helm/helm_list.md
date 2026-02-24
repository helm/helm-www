---
title: helm list
---

lista los releases

### Sinopsis

Este comando lista todos los releases para un namespace especificado (usa el contexto del namespace actual si no se especifica ninguno).

Por defecto, solo lista los releases que están desplegados o fallidos. Opciones como
'--uninstalled' y '--all' alterarán este comportamiento. Estas opciones se pueden combinar:
'--uninstalled --failed'.

Por defecto, los elementos se ordenan alfabéticamente. Use la opción '-d' para ordenar por
fecha de release.

Si se proporciona la opción --filter, se tratará como un filtro. Los filtros son
expresiones regulares (compatibles con Perl) que se aplican a la lista de releases.
Solo se devolverán los elementos que coincidan con el filtro.

    $ helm list --filter 'ara[a-z]+'
    NAME                UPDATED                                  CHART
    maudlin-arachnid    2020-06-18 14:17:46.125134977 +0000 UTC  alpine-0.1.0

Si no se encuentran resultados, 'helm list' finalizará con código 0, pero sin salida (o en
caso de no usar la opción '-q', solo mostrará los encabezados).

Por defecto, se pueden devolver hasta 256 elementos. Para limitar esto, use la opción '--max'.
Establecer '--max' en 0 no devolverá todos los resultados. En su lugar, devolverá el
valor predeterminado del servidor, que puede ser mucho mayor que 256. Combinar la opción '--max'
con la opción '--offset' permite paginar los resultados.


```
helm list [flags]
```

### Opciones

```
  -a, --all                  muestra todos los releases sin ningún filtro aplicado
  -A, --all-namespaces       lista releases en todos los namespaces
  -d, --date                 ordena por fecha de release
      --deployed             muestra releases desplegados. Si no se especifica otro, se habilitará automáticamente
      --failed               muestra releases fallidos
  -f, --filter string        una expresión regular (compatible con Perl). Cualquier release que coincida con la expresión se incluirá en los resultados
  -h, --help                 ayuda para list
  -m, --max int              número máximo de releases a obtener (por defecto 256)
      --no-headers           no imprime encabezados cuando se usa el formato de salida predeterminado
      --offset int           siguiente índice de release en la lista, usado para desplazarse desde el valor inicial
  -o, --output format        imprime la salida en el formato especificado. Valores permitidos: table, json, yaml (por defecto table)
      --pending              muestra releases pendientes
  -r, --reverse              invierte el orden de clasificación
  -l, --selector string      Selector (consulta de etiquetas) para filtrar, soporta '=', '==', y '!='.(ej. -l key1=value1,key2=value2). Funciona solo para backends de almacenamiento secret (por defecto) y configmap.
  -q, --short                formato de listado corto (silencioso)
      --superseded           muestra releases reemplazados
      --time-format string   formatea la hora usando el formateador de tiempo de golang. Ejemplo: --time-format "2006-01-02 15:04:05Z0700"
      --uninstalled          muestra releases desinstalados (si se usó 'helm uninstall --keep-history')
      --uninstalling         muestra releases que están siendo desinstalados actualmente
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

* [helm](./helm.md)	 - El gestor de paquetes Helm para Kubernetes.

###### Generado automáticamente por spf13/cobra el 14-Jan-2026
