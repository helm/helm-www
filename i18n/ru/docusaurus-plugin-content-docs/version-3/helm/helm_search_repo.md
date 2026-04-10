---
title: helm search repo
---

поиск чартов по ключевому слову в репозиториях

### Краткое описание

Эта команда просматривает все репозитории, настроенные в системе,
и ищет совпадения. Поиск по этим репозиториям использует метаданные,
сохранённые в системе.

Команда отображает последние стабильные версии найденных чартов. При указании
флага --devel в результаты будут включены предварительные версии.
Для поиска с ограничением версии используйте флаг --version.

Примеры:

    # Поиск стабильных версий по ключевому слову "nginx"
    $ helm search repo nginx

    # Поиск версий по ключевому слову "nginx", включая предварительные версии
    $ helm search repo nginx --devel

    # Поиск последней стабильной версии nginx-ingress с мажорной версией 1
    $ helm search repo nginx-ingress --version ^1.0.0

Репозитории управляются командами 'helm repo'.


```
helm search repo [keyword] [flags]
```

### Опции

```
      --devel                use development versions (alpha, beta, and release candidate releases), too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored
      --fail-on-no-result    search fails if no results are found
  -h, --help                 help for repo
      --max-col-width uint   maximum column width for output table (default 50)
  -o, --output format        prints the output in the specified format. Allowed values: table, json, yaml (default table)
  -r, --regexp               use regular expressions for searching repositories you have added
      --version string       search using semantic versioning constraints on repositories you have added
  -l, --versions             show the long listing, with each version of each chart on its own line, for repositories you have added
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

* [helm search](./helm_search.md)	 - поиск по ключевому слову в чартах

###### Автоматически сгенерировано spf13/cobra 14-Jan-2026
