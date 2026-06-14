---
title: helm search hub
---

busca charts en Artifact Hub o en su propia instancia de hub

### Sinopsis

Busca charts de Helm en Artifact Hub o en su propia instancia de hub.

Artifact Hub es una aplicación web que permite encontrar, instalar y publicar paquetes y configuraciones para proyectos de CNCF, incluyendo charts de Helm disponibles públicamente. Es un proyecto sandbox de la Cloud Native Computing Foundation. Puede explorar el hub en https://artifacthub.io/

El argumento [KEYWORD] acepta una cadena de palabra clave o una cadena entre comillas con opciones de consulta avanzada. Para documentación sobre las opciones de consulta avanzada, consulte https://artifacthub.github.io/hub/api/?urls.primaryName=Monocular%20compatible%20search%20API#/Monocular/get_api_chartsvc_v1_charts_search

Las versiones anteriores de Helm utilizaban una instancia de Monocular como 'endpoint' predeterminado, por lo que Artifact Hub es compatible con la API de búsqueda de Monocular para mantener la compatibilidad con versiones anteriores. De manera similar, al establecer la opción 'endpoint', el endpoint especificado también debe implementar un endpoint de API de búsqueda compatible con Monocular. Tenga en cuenta que al especificar una instancia de Monocular como 'endpoint', las consultas avanzadas no son compatibles. Para detalles de la API, consulte https://github.com/helm/monocular


```
helm search hub [KEYWORD] [flags]
```

### Opciones

```
      --endpoint string      instancia de Hub a consultar para charts (por defecto "https://hub.helm.sh")
      --fail-on-no-result    la búsqueda falla si no se encuentran resultados
  -h, --help                 ayuda para hub
      --list-repo-url        imprime la URL del repositorio de charts
      --max-col-width uint   ancho máximo de columna para la tabla de salida (por defecto 50)
  -o, --output format        imprime la salida en el formato especificado. Valores permitidos: table, json, yaml (por defecto table)
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
