---
title: helm pull
---

descarga un chart de un repositorio y (opcionalmente) lo desempaqueta en un directorio local

### Sinopsis

Recupera un paquete de un repositorio de paquetes y lo descarga localmente.

Es útil para obtener paquetes e inspeccionarlos, modificarlos o reempaquetarlos. También puede usarse para realizar una verificación criptográfica de un chart sin instalarlo.

Hay opciones para desempaquetar el chart después de la descarga. Esto creará un directorio para el chart y lo descomprimirá en ese directorio.

Si se especifica la opción --verify, el chart solicitado DEBE tener un archivo de procedencia y DEBE pasar el proceso de verificación. Cualquier fallo en este proceso generará un error y el chart no se guardará localmente.


```
helm pull [chart URL | repo/chartname] [...] [flags]
```

### Opciones

```
      --ca-file string             verifica certificados de servidores habilitados con HTTPS usando este paquete de CA
      --cert-file string           identifica el cliente HTTPS usando este archivo de certificado SSL
  -d, --destination string         ubicación donde escribir el chart. Si se especifica junto con untardir, untardir se agrega a esta ruta (por defecto ".")
      --devel                      incluye versiones de desarrollo. Equivalente a version '>0.0.0-0'. Si se establece --version, esta opción se ignora.
  -h, --help                       ayuda para pull
      --insecure-skip-tls-verify   omite las verificaciones del certificado TLS para la descarga del chart
      --key-file string            identifica el cliente HTTPS usando este archivo de clave SSL
      --keyring string             ubicación de las claves públicas usadas para verificación (por defecto "~/.gnupg/pubring.gpg")
      --pass-credentials           pasa credenciales a todos los dominios
      --password string            contraseña del repositorio de charts donde ubicar el chart solicitado
      --plain-http                 usa conexiones HTTP inseguras para la descarga del chart
      --prov                       descarga el archivo de procedencia, pero no realiza verificación
      --repo string                URL del repositorio de charts donde ubicar el chart solicitado
      --untar                      si se establece a true, desempaquetará el chart después de descargarlo
      --untardir string            si se especifica untar, esta opción indica el nombre del directorio donde se expandirá el chart (por defecto ".")
      --username string            nombre de usuario del repositorio de charts donde ubicar el chart solicitado
      --verify                     verifica el paquete antes de usarlo
      --version string             especifica una restricción de versión para la versión del chart a usar. Esta restricción puede ser una etiqueta específica (p. ej. 1.1.1) o puede referenciar un rango válido (p. ej. ^2.0.0). Si no se especifica, se usa la última versión
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
