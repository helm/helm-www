---
title: helm create
---

crea un nuevo chart con el nombre proporcionado

### Sinopsis

Este comando crea un directorio de chart junto con los archivos y directorios comunes utilizados en un chart.

Por ejemplo, 'helm create foo' creará una estructura de directorios similar a esta:

    foo/
    ├── .helmignore   # Contiene patrones a ignorar al empaquetar charts de Helm.
    ├── Chart.yaml    # Información sobre su chart
    ├── values.yaml   # Los valores predeterminados para sus plantillas
    ├── charts/       # Charts de los que depende este chart
    └── templates/    # Los archivos de plantillas
        └── tests/    # Los archivos de pruebas

'helm create' toma una ruta como argumento. Si los directorios en la ruta proporcionada no existen, Helm intentará crearlos a medida que avanza. Si el destino proporcionado existe y hay archivos en ese directorio, los archivos en conflicto serán sobrescritos, pero los demás archivos se dejarán intactos.


```
helm create NAME [flags]
```

### Opciones

```
  -h, --help             ayuda para create
  -p, --starter string   el nombre o ruta absoluta al scaffold de inicio de Helm
```

### Opciones heredadas de los comandos padre

```
      --burst-limit int                 límite de limitación predeterminado del lado del cliente (predeterminado 100)
      --debug                           habilitar salida detallada
      --kube-apiserver string           la dirección y el puerto del servidor de API de Kubernetes
      --kube-as-group stringArray       grupo a suplantar para la operación, esta bandera puede repetirse para especificar múltiples grupos.
      --kube-as-user string             nombre de usuario a suplantar para la operación
      --kube-ca-file string             el archivo de autoridad de certificación para la conexión del servidor de API de Kubernetes
      --kube-context string             nombre del contexto de kubeconfig a usar
      --kube-insecure-skip-tls-verify   si es verdadero, el certificado del servidor de API de Kubernetes no será verificado. Esto hará que sus conexiones HTTPS sean inseguras
      --kube-tls-server-name string     nombre del servidor a usar para la validación del certificado del servidor de API de Kubernetes. Si no se proporciona, se usa el nombre de host usado para contactar al servidor
      --kube-token string               token bearer usado para autenticación
      --kubeconfig string               ruta al archivo kubeconfig
  -n, --namespace string                ámbito del namespace para esta solicitud
      --qps float32                     consultas por segundo usadas al comunicarse con la API de Kubernetes, sin incluir ráfagas
      --registry-config string          ruta al archivo de configuración del registro (predeterminado "~/.config/helm/registry/config.json")
      --repository-cache string         ruta al directorio que contiene los índices de repositorios en caché (predeterminado "~/.cache/helm/repository")
      --repository-config string        ruta al archivo que contiene los nombres y URLs de repositorios (predeterminado "~/.config/helm/repositories.yaml")
```

### VEA TAMBIÉN

* [helm](/helm/helm.md)	 - El gestor de paquetes Helm para Kubernetes.

###### Generado automáticamente por spf13/cobra el 14-Jan-2026
