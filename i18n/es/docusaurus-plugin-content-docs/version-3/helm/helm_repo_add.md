---
title: helm repo add
---

añade un repositorio de charts

```
helm repo add [NAME] [URL] [flags]
```

### Opciones

```
      --allow-deprecated-repos     por defecto, este comando no permite añadir repositorios oficiales que han sido eliminados permanentemente. Esta opción deshabilita ese comportamiento
      --ca-file string             verifica certificados de servidores HTTPS usando este paquete de CA
      --cert-file string           identifica el cliente HTTPS usando este archivo de certificado SSL
      --force-update               reemplaza (sobrescribe) el repositorio si ya existe
  -h, --help                       ayuda para add
      --insecure-skip-tls-verify   omite las verificaciones de certificado TLS para el repositorio
      --key-file string            identifica el cliente HTTPS usando este archivo de clave SSL
      --no-update                  Ignorado. Anteriormente, deshabilitaba las actualizaciones forzadas. Está obsoleto por force-update.
      --pass-credentials           pasa las credenciales a todos los dominios
      --password string            contraseña del repositorio de charts
      --password-stdin             lee la contraseña del repositorio de charts desde stdin
      --timeout duration           tiempo de espera para que se complete la descarga del archivo de índice (por defecto 2m0s)
      --username string            nombre de usuario del repositorio de charts
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

* [helm repo](./helm_repo.md)	 - añade, lista, elimina, actualiza e indexa repositorios de charts

###### Generado automáticamente por spf13/cobra el 14-Jan-2026
