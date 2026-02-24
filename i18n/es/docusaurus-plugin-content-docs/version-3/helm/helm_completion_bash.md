---
title: helm completion bash
---

genera el script de autocompletado para bash

### Sinopsis

Genera el script de autocompletado de Helm para el shell bash.

Para cargar los autocompletados en su sesión de shell actual:

    source <(helm completion bash)

Para cargar los autocompletados en cada nueva sesión, ejecute una vez:
- Linux:

      helm completion bash > /etc/bash_completion.d/helm

- MacOS:

      helm completion bash > /usr/local/etc/bash_completion.d/helm


```
helm completion bash [flags]
```

### Opciones

```
  -h, --help              ayuda para bash
      --no-descriptions   deshabilitar descripciones de autocompletado
```

### Opciones heredadas de comandos padre

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

* [helm completion](/helm/helm_completion.md)	 - genera scripts de autocompletado para el shell especificado

###### Generado automáticamente por spf13/cobra el 14-Jan-2026
