---
title: helm get
---

descarga información extendida de un release especificado

### Sinopsis


Este comando consta de múltiples subcomandos que pueden usarse para
obtener información extendida sobre el release, incluyendo:

- Los valores utilizados para generar el release
- El archivo de manifiesto generado
- Las notas proporcionadas por el chart del release
- Los hooks asociados con el release
- Los metadatos del release


### Opciones

```
  -h, --help   ayuda para get
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

* [helm](/helm/helm.md)	 - El gestor de paquetes Helm para Kubernetes.
* [helm get all](/helm/helm_get_all.md)	 - descarga toda la información de un release especificado
* [helm get hooks](/helm/helm_get_hooks.md)	 - descarga todos los hooks de un release especificado
* [helm get manifest](/helm/helm_get_manifest.md)	 - descarga el manifiesto de un release especificado
* [helm get metadata](/helm/helm_get_metadata.md)	 - obtiene los metadatos de un release dado
* [helm get notes](/helm/helm_get_notes.md)	 - descarga las notas de un release especificado
* [helm get values](/helm/helm_get_values.md)	 - descarga el archivo de valores de un release especificado

###### Generado automáticamente por spf13/cobra el 14-Jan-2026
