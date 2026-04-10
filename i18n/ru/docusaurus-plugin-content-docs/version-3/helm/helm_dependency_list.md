---
title: helm dependency list
---

вывод списка зависимостей для указанного чарта

### Краткое описание

Выводит все зависимости, объявленные в чарте.

Команда принимает на вход как архивы чартов, так и каталоги с чартами.
Содержимое чарта не изменяется.

Если чарт не удаётся загрузить, команда завершится с ошибкой.


```
helm dependency list CHART [flags]
```

### Параметры

```
  -h, --help                 help for list
      --max-col-width uint   maximum column width for output table (default 80)
```

### Параметры, унаследованные от родительских команд

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

* [helm dependency](/helm/helm_dependency.md) — управление зависимостями чарта

###### Автоматически сгенерировано spf13/cobra 14-Jan-2026
