---
title: helm search repo
---

busca charts por palabra clave en los repositorios

### Sinopsis

Lee todos los repositorios configurados en el sistema y busca coincidencias. La búsqueda en estos repositorios utiliza los metadatos almacenados en el sistema.

Mostrará las últimas versiones estables de los charts encontrados. Si especifica la opción --devel, la salida incluirá versiones preliminares. Si desea buscar usando una restricción de versión, use --version.

Ejemplos:

    # Buscar versiones de release estables que coincidan con la palabra clave "nginx"
    $ helm search repo nginx

    # Buscar versiones de release que coincidan con la palabra clave "nginx", incluyendo versiones preliminares
    $ helm search repo nginx --devel

    # Buscar la última versión estable de nginx-ingress con una versión mayor de 1
    $ helm search repo nginx-ingress --version ^1.0.0

Los repositorios se gestionan con los comandos 'helm repo'.


```
helm search repo [keyword] [flags]
```

### Opciones

```
      --devel                usar versiones de desarrollo (alpha, beta y release candidate) también. Equivalente a version '>0.0.0-0'. Si se establece --version, esto se ignora
      --fail-on-no-result    la búsqueda falla si no se encuentran resultados
  -h, --help                 ayuda para repo
      --max-col-width uint   ancho máximo de columna para la tabla de salida (por defecto 50)
  -o, --output format        imprime la salida en el formato especificado. Valores permitidos: table, json, yaml (por defecto table)
  -r, --regexp               usar expresiones regulares para buscar en los repositorios que ha añadido
      --version string       buscar usando restricciones de versionado semántico en los repositorios que ha añadido
  -l, --versions             mostrar el listado largo, con cada versión de cada chart en su propia línea, para los repositorios que ha añadido
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

* [helm search](./helm_search.md)	 - busca una palabra clave en charts

###### Generado automáticamente por spf13/cobra el 14-Jan-2026
