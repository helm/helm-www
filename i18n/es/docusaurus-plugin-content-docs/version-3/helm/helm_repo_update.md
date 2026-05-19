---
title: helm repo update
---

actualiza la información local de los charts disponibles en los repositorios

### Sinopsis

Este comando obtiene la información más reciente sobre charts desde los repositorios de charts correspondientes.
La información se almacena en caché localmente, donde es utilizada por comandos como 'helm search'.

Opcionalmente puede especificar una lista de repositorios que desea actualizar.
	$ helm repo update <repo_name> ...
Para actualizar todos los repositorios, use 'helm repo update'.


```
helm repo update [REPO1 [REPO2 ...]] [flags]
```

### Opciones

```
      --fail-on-repo-update-fail   la actualización falla si alguna de las actualizaciones de repositorio falla
  -h, --help                       ayuda para update
      --timeout duration           tiempo de espera para que se complete la descarga del archivo de índice (por defecto 2m0s)
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
