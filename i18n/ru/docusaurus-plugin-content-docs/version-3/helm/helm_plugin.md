---
title: helm plugin
---

установка, просмотр и удаление плагинов Helm

### Краткое описание

Управление клиентскими плагинами Helm.


### Опции

```
  -h, --help   help for plugin
```

### Опции, унаследованные от родительских команд

```
      --burst-limit int                 client-side default throttling limit (default 100)
      --debug                           enable verbose output
      --kube-apiserver string           the address and the port for the Kubernetes API server
      --kube-as-group stringArray       group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --kube-as-user string             username to impersonate for the operation
      --kube-ca-file string             the certificate authority file for the Kubernetes API server connection
      --kube-context string             name of the kubeconfig context to use
      --kube-insecure-skip-tls-verify   if true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kube-tls-server-name string     server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used
      --kube-token string               bearer token used for authentication
      --kubeconfig string               path to the kubeconfig file
  -n, --namespace string                namespace scope for this request
      --qps float32                     queries per second used when communicating with the Kubernetes API, not including bursting
      --registry-config string          path to the registry config file (default "~/.config/helm/registry/config.json")
      --repository-cache string         path to the directory containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string        path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### Смотрите также

* [helm](./helm.md)	 - менеджер пакетов Helm для Kubernetes.
* [helm plugin install](./helm_plugin_install.md)	 - установка плагина Helm
* [helm plugin list](./helm_plugin_list.md)	 - просмотр списка установленных плагинов Helm
* [helm plugin uninstall](./helm_plugin_uninstall.md)	 - удаление одного или нескольких плагинов Helm
* [helm plugin update](./helm_plugin_update.md)	 - обновление одного или нескольких плагинов Helm

###### Автоматически сгенерировано spf13/cobra 14-Jan-2026
