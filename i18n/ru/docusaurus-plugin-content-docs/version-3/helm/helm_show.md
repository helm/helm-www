---
title: helm show
---

отображение информации о чарте

### Краткое описание

Эта команда состоит из нескольких подкоманд для отображения информации о чарте


### Опции

```
  -h, --help   help for show
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
* [helm show all](./helm_show_all.md)	 - показать всю информацию о чарте
* [helm show chart](./helm_show_chart.md)	 - показать определение чарта
* [helm show crds](./helm_show_crds.md)	 - показать CRD чарта
* [helm show readme](./helm_show_readme.md)	 - показать README чарта
* [helm show values](./helm_show_values.md)	 - показать values чарта

###### Автоматически сгенерировано spf13/cobra 14-Jan-2026
