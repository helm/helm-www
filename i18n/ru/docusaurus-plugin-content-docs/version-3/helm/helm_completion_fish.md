---
title: helm completion fish
---

генерация скрипта автодополнения для fish

### Краткое описание


Генерирует скрипт автодополнения Helm для оболочки fish.

Для загрузки автодополнения в текущей сессии:

    helm completion fish | source

Для загрузки автодополнения во всех новых сессиях выполните однократно:

    helm completion fish > ~/.config/fish/completions/helm.fish

Чтобы изменения вступили в силу, необходимо перезапустить оболочку.


```
helm completion fish [flags]
```

### Опции

```
  -h, --help              help for fish
      --no-descriptions   disable completion descriptions
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

* [helm completion](./helm_completion.md)	 - генерация скриптов автодополнения для указанной оболочки

###### Автоматически сгенерировано spf13/cobra 14-Jan-2026
