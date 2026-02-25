---
title: helm version
---

muestra la información de versión del cliente

### Sinopsis

Muestra la versión de Helm.

Este comando imprimirá una representación de la versión de Helm.
La salida tendrá un aspecto similar a este:

version.BuildInfo{Version:"v3.2.1", GitCommit:"fe51cd1e31e6a202cba7dead9552a6d418ded79a", GitTreeState:"clean", GoVersion:"go1.13.10"}

- Version es la versión semántica de la release.
- GitCommit es el SHA del commit a partir del cual se construyó esta versión.
- GitTreeState es "clean" si no hay cambios locales en el código cuando se
  construyó este binario, y "dirty" si el binario fue construido a partir
  de código modificado localmente.
- GoVersion es la versión de Go que se utilizó para compilar Helm.

Cuando utilice la opción --template, las siguientes propiedades están disponibles
para usar en la plantilla:

- .Version contiene la versión semántica de Helm
- .GitCommit es el commit de git
- .GitTreeState es el estado del árbol de git cuando se construyó Helm
- .GoVersion contiene la versión de Go con la que se compiló Helm

Por ejemplo, --template='Version: {{.Version}}' produce 'Version: v3.2.1'.


```
helm version [flags]
```

### Opciones

```
  -h, --help              ayuda para version
      --short             muestra solo el número de versión
      --template string   plantilla para el formato de la cadena de versión
```

### Opciones heredadas de comandos padre

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
      --qps float32                     consultas por segundo utilizadas al comunicarse con la API de Kubernetes, sin incluir ráfagas
      --registry-config string          ruta al archivo de configuración del registro (por defecto "~/.config/helm/registry/config.json")
      --repository-cache string         ruta al directorio que contiene los índices de repositorios en caché (por defecto "~/.cache/helm/repository")
      --repository-config string        ruta al archivo que contiene los nombres y URLs de los repositorios (por defecto "~/.config/helm/repositories.yaml")
```

### VEA TAMBIÉN

* [helm](./helm.md)	 - El gestor de paquetes Helm para Kubernetes.

###### Generado automáticamente por spf13/cobra el 14-Jan-2026
