---
title: helm uninstall
---

desinstala un release

### Sinopsis

Este comando recibe un nombre de release y lo desinstala.

Elimina todos los recursos asociados con la última versión del chart, así como el historial del release, liberándolo para uso futuro.

Use la opción '--dry-run' para ver qué releases serán desinstalados sin desinstalarlos realmente.


```
helm uninstall RELEASE_NAME [...] [flags]
```

### Opciones

```
      --cascade string       Debe ser "background", "orphan" o "foreground". Selecciona la estrategia de eliminación en cascada para los dependientes. Por defecto es background. (por defecto "background")
      --description string   añade una descripción personalizada
      --dry-run              simula una desinstalación
  -h, --help                 ayuda para uninstall
      --ignore-not-found     Trata "release no encontrado" como una desinstalación exitosa
      --keep-history         elimina todos los recursos asociados y marca el release como eliminado, pero retiene el historial del release
      --no-hooks             evita que los hooks se ejecuten durante la desinstalación
      --timeout duration     tiempo de espera para cualquier operación individual de Kubernetes (como Jobs para hooks) (por defecto 5m0s)
      --wait                 si se establece, esperará hasta que todos los recursos sean eliminados antes de finalizar. Esperará tanto tiempo como se especifique en --timeout
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

* [helm](/helm/helm.md)	 - El gestor de paquetes Helm para Kubernetes.

###### Generado automáticamente por spf13/cobra el 14-Jan-2026
