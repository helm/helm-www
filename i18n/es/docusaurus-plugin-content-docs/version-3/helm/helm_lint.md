---
title: helm lint
---

examina un chart en busca de posibles problemas

### Sinopsis

Este comando toma una ruta a un chart y ejecuta una serie de pruebas para verificar que
el chart esté bien formado.

Si el linter encuentra problemas que harán fallar la instalación del chart,
emitirá mensajes [ERROR]. Si encuentra problemas que rompen con la convención
o las recomendaciones, emitirá mensajes [WARNING].


```
helm lint PATH [flags]
```

### Opciones

```
  -h, --help                      ayuda para lint
      --kube-version string       versión de Kubernetes usada para verificaciones de capacidades y deprecación
      --quiet                     imprime solo advertencias y errores
      --set stringArray           establece valores en la línea de comandos (puede especificar múltiples o separar valores con comas: key1=val1,key2=val2)
      --set-file stringArray      establece valores desde archivos respectivos especificados a través de la línea de comandos (puede especificar múltiples o separar valores con comas: key1=path1,key2=path2)
      --set-json stringArray      establece valores JSON en la línea de comandos (puede especificar múltiples o separar valores con comas: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray   establece un valor STRING literal en la línea de comandos
      --set-string stringArray    establece valores STRING en la línea de comandos (puede especificar múltiples o separar valores con comas: key1=val1,key2=val2)
      --skip-schema-validation    si está activado, deshabilita la validación de esquema JSON
      --strict                    falla si hay advertencias en el lint
  -f, --values strings            especifica valores en un archivo YAML o una URL (puede especificar múltiples)
      --with-subcharts            analiza también los charts dependientes
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
