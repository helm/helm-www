---
title: helm status
---

muestra el estado del release especificado

### Sinopsis

Este comando muestra el estado de un release especificado.
El estado consiste en:
- fecha y hora del último despliegue
- namespace de Kubernetes en el que reside el release
- estado del release (puede ser: unknown, deployed, uninstalled, superseded, failed, uninstalling, pending-install, pending-upgrade o pending-rollback)
- revisión del release
- descripción del release (puede ser un mensaje de finalización o un mensaje de error, requiere habilitar --show-desc)
- lista de recursos que componen este release (requiere habilitar --show-resources)
- detalles de la última ejecución del conjunto de pruebas, si aplica
- notas adicionales proporcionadas por el chart


```
helm status RELEASE_NAME [flags]
```

### Opciones

```
  -h, --help             ayuda para status
  -o, --output format    imprime la salida en el formato especificado. Valores permitidos: table, json, yaml (por defecto table)
      --revision int     si se establece, muestra el estado del release especificado con esa revisión
      --show-desc        si se establece, muestra el mensaje de descripción del release especificado
      --show-resources   si se establece, muestra los recursos del release especificado
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
