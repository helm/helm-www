---
title: helm verify
---

verifica que un chart en la ruta dada ha sido firmado y es válido

### Sinopsis

Verifica que el chart especificado tenga un archivo de procedencia válido.

Los archivos de procedencia proporcionan verificación criptográfica de que un chart no ha sido manipulado y fue empaquetado por un proveedor de confianza.

Este comando permite verificar un chart local. Otros comandos proporcionan opciones '--verify' que ejecutan la misma validación. Para generar un paquete firmado, use el comando 'helm package --sign'.


```
helm verify PATH [flags]
```

### Opciones

```
  -h, --help             ayuda para verify
      --keyring string   llavero que contiene las claves públicas (por defecto "~/.gnupg/pubring.gpg")
```

### Opciones heredadas de los comandos padre

```
      --burst-limit int                 límite de throttling del lado del cliente (por defecto 100)
      --debug                           habilita la salida detallada
      --kube-apiserver string           la dirección y el puerto del servidor de API de Kubernetes
      --kube-as-group stringArray       grupo a suplantar para la operación, esta opción puede repetirse para especificar múltiples grupos.
      --kube-as-user string             nombre de usuario a suplantar para la operación
      --kube-ca-file string             el archivo de autoridad de certificación para la conexión al servidor de API de Kubernetes
      --kube-context string             nombre del contexto de kubeconfig a utilizar
      --kube-insecure-skip-tls-verify   si es true, no se verificará la validez del certificado del servidor de API de Kubernetes. Esto hará que sus conexiones HTTPS sean inseguras
      --kube-tls-server-name string     nombre del servidor a usar para la validación del certificado del servidor de API de Kubernetes. Si no se proporciona, se usa el nombre de host utilizado para contactar al servidor
      --kube-token string               token bearer utilizado para la autenticación
      --kubeconfig string               ruta al archivo kubeconfig
  -n, --namespace string                ámbito del namespace para esta solicitud
      --qps float32                     consultas por segundo utilizadas al comunicarse con la API de Kubernetes, sin incluir bursting
      --registry-config string          ruta al archivo de configuración del registro (por defecto "~/.config/helm/registry/config.json")
      --repository-cache string         ruta al directorio que contiene los índices de repositorios en caché (por defecto "~/.cache/helm/repository")
      --repository-config string        ruta al archivo que contiene los nombres y URLs de los repositorios (por defecto "~/.config/helm/repositories.yaml")
```

### VER TAMBIÉN

* [helm](./helm.md)	 - El gestor de paquetes Helm para Kubernetes.

###### Generado automáticamente por spf13/cobra el 14-Jan-2026
