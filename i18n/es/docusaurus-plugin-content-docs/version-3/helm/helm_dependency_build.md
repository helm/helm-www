---
title: helm dependency build
---

reconstruye el directorio charts/ basándose en el archivo Chart.lock

### Sinopsis


Reconstruye el directorio charts/ a partir del archivo Chart.lock.

Este comando se utiliza para reconstruir las dependencias de un chart al estado especificado en
el archivo de bloqueo. Esto no volverá a resolver las dependencias, como lo hace 'helm dependency update'.

Si no se encuentra ningún archivo de bloqueo, 'helm dependency build' replicará el comportamiento
de 'helm dependency update'.


```
helm dependency build CHART [flags]
```

### Opciones

```
      --ca-file string             verifica certificados de servidores habilitados para HTTPS usando este paquete de CA
      --cert-file string           identifica al cliente HTTPS usando este archivo de certificado SSL
  -h, --help                       ayuda para build
      --insecure-skip-tls-verify   omite las verificaciones de certificado tls para la descarga del chart
      --key-file string            identifica al cliente HTTPS usando este archivo de clave SSL
      --keyring string             llavero que contiene claves públicas (por defecto "~/.gnupg/pubring.gpg")
      --password string            contraseña del repositorio de charts donde localizar el chart solicitado
      --plain-http                 usa conexiones HTTP inseguras para la descarga del chart
      --skip-refresh               no actualiza la caché local del repositorio
      --username string            nombre de usuario del repositorio de charts donde localizar el chart solicitado
      --verify                     verifica los paquetes contra las firmas
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

* [helm dependency](/helm/helm_dependency.md)	 - gestiona las dependencias de un chart

###### Generado automáticamente por spf13/cobra el 14-Jan-2026
