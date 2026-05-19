---
title: helm search
---

поиск по ключевому слову в чартах

### Краткое описание

Search позволяет искать Helm чарты в разных местах их хранения, включая
Artifact Hub и добавленные вами репозитории. Используйте подкоманды search
для поиска чартов в разных источниках.


### Опции

```
  -h, --help   help for search
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
* [helm search hub](./helm_search_hub.md)	 - поиск чартов в Artifact Hub или вашем собственном экземпляре hub
* [helm search repo](./helm_search_repo.md)	 - поиск чартов по ключевому слову в репозиториях

###### Автоматически сгенерировано spf13/cobra 14-Jan-2026
