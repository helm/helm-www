---
title: helm rollback
---

revierte un release a una revisión anterior

### Sinopsis

Este comando revierte un release a una revisión anterior.

El primer argumento del comando rollback es el nombre de un release, y el segundo es un número de revisión (versión). Si se omite este argumento o se establece en 0, se revertirá al release anterior.

Para ver los números de revisión, ejecute 'helm history RELEASE'.


```
helm rollback <RELEASE> [REVISION] [flags]
```

### Opciones

```
      --cleanup-on-fail    permite eliminar nuevos recursos creados en este rollback cuando el rollback falla
      --dry-run            simula un rollback
      --force              fuerza la actualización de recursos mediante eliminación/recreación si es necesario
  -h, --help               ayuda para rollback
      --history-max int    limita el número máximo de revisiones guardadas por release. Use 0 para sin límite (por defecto 10)
      --no-hooks           evita que los hooks se ejecuten durante el rollback
      --recreate-pods      realiza el reinicio de pods para el recurso si es aplicable
      --timeout duration   tiempo de espera para cualquier operación individual de Kubernetes (como Jobs para hooks) (por defecto 5m0s)
      --wait               si se establece, esperará hasta que todos los Pods, PVCs, Services, y el número mínimo de Pods de un Deployment, StatefulSet o ReplicaSet estén en estado ready antes de marcar el release como exitoso. Esperará tanto tiempo como --timeout
      --wait-for-jobs      si se establece y --wait está habilitado, esperará hasta que todos los Jobs se hayan completado antes de marcar el release como exitoso. Esperará tanto tiempo como --timeout
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
