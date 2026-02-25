---
title: helm package
---

empaqueta un directorio de chart en un archivo de chart

### Sinopsis

Este comando empaqueta un chart en un archivo de chart versionado. Si se proporciona una ruta, buscará un chart en esa ubicación (que debe contener un archivo Chart.yaml) y luego empaquetará ese directorio.

Los repositorios de paquetes de Helm utilizan archivos de chart versionados.

Para firmar un chart, use la opción '--sign'. En la mayoría de los casos, también debería proporcionar '--keyring ruta/a/claves/secretas' y '--key nombre_clave'.

  $ helm package --sign ./mychart --key mykey --keyring ~/.gnupg/secring.gpg

Si no se especifica '--keyring', Helm normalmente usa el llavero público por defecto, a menos que su entorno esté configurado de otra manera.


```
helm package [CHART_PATH] [...] [flags]
```

### Opciones

```
      --app-version string         establece el appVersion en el chart a esta versión
      --ca-file string             verifica certificados de servidores habilitados con HTTPS usando este paquete de CA
      --cert-file string           identifica el cliente HTTPS usando este archivo de certificado SSL
  -u, --dependency-update          actualiza las dependencias desde "Chart.yaml" al directorio "charts/" antes de empaquetar
  -d, --destination string         ubicación donde escribir el chart (por defecto ".")
  -h, --help                       ayuda para package
      --insecure-skip-tls-verify   omite las verificaciones del certificado TLS para la descarga del chart
      --key string                 nombre de la clave a usar al firmar. Se usa si --sign es true
      --key-file string            identifica el cliente HTTPS usando este archivo de clave SSL
      --keyring string             ubicación del llavero público (por defecto "~/.gnupg/pubring.gpg")
      --passphrase-file string     ubicación del archivo que contiene la frase de contraseña para la clave de firma. Use "-" para leer desde stdin.
      --password string            contraseña del repositorio de charts donde ubicar el chart solicitado
      --plain-http                 usa conexiones HTTP inseguras para la descarga del chart
      --sign                       usa una clave privada PGP para firmar este paquete
      --username string            nombre de usuario del repositorio de charts donde ubicar el chart solicitado
      --version string             establece la versión del chart a esta versión semver
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
