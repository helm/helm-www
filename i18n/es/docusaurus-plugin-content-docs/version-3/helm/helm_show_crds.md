---
title: helm show crds
---

muestra los CRDs del chart

### Sinopsis

Este comando inspecciona un chart (directorio, archivo o URL) y muestra el contenido
de los archivos CustomResourceDefinition


```
helm show crds [CHART] [flags]
```

### Opciones

```
      --ca-file string             verifica certificados de servidores HTTPS usando este paquete de CA
      --cert-file string           identifica al cliente HTTPS usando este archivo de certificado SSL
      --devel                      usa también versiones de desarrollo. Equivalente a version '>0.0.0-0'. Si se establece --version, esto se ignora
  -h, --help                       ayuda para crds
      --insecure-skip-tls-verify   omite las verificaciones de certificado TLS para la descarga del chart
      --key-file string            identifica al cliente HTTPS usando este archivo de clave SSL
      --keyring string             ubicación de las claves públicas usadas para verificación (por defecto "~/.gnupg/pubring.gpg")
      --pass-credentials           pasa credenciales a todos los dominios
      --password string            contraseña del repositorio de charts donde localizar el chart solicitado
      --plain-http                 usa conexiones HTTP inseguras para la descarga del chart
      --repo string                URL del repositorio de charts donde localizar el chart solicitado
      --username string            nombre de usuario del repositorio de charts donde localizar el chart solicitado
      --verify                     verifica el paquete antes de usarlo
      --version string             especifica una restricción de versión para la versión del chart a usar. Esta restricción puede ser una etiqueta específica (ej. 1.1.1) o puede hacer referencia a un rango válido (ej. ^2.0.0). Si no se especifica, se usa la última versión
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

* [helm show](./helm_show.md)	 - muestra información de un chart

###### Generado automáticamente por spf13/cobra el 14-Ene-2026
