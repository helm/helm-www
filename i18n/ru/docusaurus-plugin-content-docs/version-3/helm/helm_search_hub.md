---
title: helm search hub
---

поиск чартов в Artifact Hub или вашем собственном экземпляре hub

### Краткое описание

Эта команда выполняет поиск Helm чартов в Artifact Hub или вашем собственном
экземпляре hub.

Artifact Hub — это веб-приложение для поиска, установки и публикации пакетов
и конфигураций для проектов CNCF, включая публично доступные Helm чарты.
Это проект-песочница Cloud Native Computing Foundation. Вы можете просмотреть
hub по адресу https://artifacthub.io/

В качестве аргумента [KEYWORD] можно указать строку ключевого слова или строку
в кавычках с расширенными параметрами запроса. Документацию по расширенным
параметрам запроса см. на
https://artifacthub.github.io/hub/api/?urls.primaryName=Monocular%20compatible%20search%20API#/Monocular/get_api_chartsvc_v1_charts_search

Предыдущие версии Helm использовали экземпляр Monocular в качестве значения по
умолчанию для 'endpoint'. Для обратной совместимости Artifact Hub поддерживает
API поиска Monocular. При установке флага 'endpoint' указанная конечная точка
также должна реализовывать совместимый с Monocular API поиска. Обратите внимание:
при указании экземпляра Monocular в качестве 'endpoint' расширенные запросы
не поддерживаются. Подробности см. на https://github.com/helm/monocular


```
helm search hub [KEYWORD] [flags]
```

### Опции

```
      --endpoint string      Hub instance to query for charts (default "https://hub.helm.sh")
      --fail-on-no-result    search fails if no results are found
  -h, --help                 help for hub
      --list-repo-url        print charts repository URL
      --max-col-width uint   maximum column width for output table (default 50)
  -o, --output format        prints the output in the specified format. Allowed values: table, json, yaml (default table)
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
