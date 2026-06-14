---
title: helm repo
---

добавление, просмотр, удаление, обновление и индексирование репозиториев чартов

### Краткое описание

Эта команда включает несколько подкоманд для работы с репозиториями чартов: добавление, удаление, просмотр списка и индексирование.


### Опции

```
  -h, --help   help for repo
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
* [helm repo add](./helm_repo_add.md)	 - добавление репозитория чартов
* [helm repo index](./helm_repo_index.md)	 - генерация индексного файла для директории с упакованными чартами
* [helm repo list](./helm_repo_list.md)	 - просмотр списка репозиториев чартов
* [helm repo remove](./helm_repo_remove.md)	 - удаление одного или нескольких репозиториев чартов
* [helm repo update](./helm_repo_update.md)	 - обновление информации о доступных чартах из репозиториев

###### Автоматически сгенерировано spf13/cobra 14-Jan-2026
