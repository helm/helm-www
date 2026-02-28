---
title: helm create
---

создание нового чарта с указанным именем

### Краткое описание


Эта команда создаёт директорию чарта вместе со стандартными файлами и
директориями, используемыми в чарте.

Например, 'helm create foo' создаст структуру директорий, которая
выглядит примерно так:

    foo/
    ├── .helmignore   # Шаблоны для игнорирования при упаковке чартов Helm
    ├── Chart.yaml    # Информация о вашем чарте
    ├── values.yaml   # Значения по умолчанию для ваших шаблонов
    ├── charts/       # Чарты, от которых зависит данный чарт
    └── templates/    # Файлы шаблонов
        └── tests/    # Файлы тестов

'helm create' принимает путь в качестве аргумента. Если директории в указанном пути
не существуют, Helm попытается создать их. Если указанная
директория уже существует и в ней есть файлы, конфликтующие файлы
будут перезаписаны, но остальные файлы останутся нетронутыми.


```
helm create NAME [flags]
```

### Опции

```
  -h, --help             help for create
  -p, --starter string   the name or absolute path to Helm starter scaffold
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

* [helm](./helm.md)	 - менеджер пакетов Helm для Kubernetes

###### Автоматически сгенерировано spf13/cobra 14-Jan-2026
