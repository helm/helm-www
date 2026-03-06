---
title: helm version
---

вывод информации о версии клиента

### Краткое описание

Показывает версию Helm.

Эта команда выводит информацию о версии Helm.
Вывод будет выглядеть примерно так:

version.BuildInfo{Version:"v3.2.1", GitCommit:"fe51cd1e31e6a202cba7dead9552a6d418ded79a", GitTreeState:"clean", GoVersion:"go1.13.10"}

- Version — это семантическая версия релиза.
- GitCommit — это SHA коммита, из которого была собрана эта версия.
- GitTreeState имеет значение "clean", если при сборке бинарного файла не было локальных изменений кода, и "dirty", если бинарный файл был собран из локально изменённого кода.
- GoVersion — это версия Go, которая использовалась для компиляции Helm.

При использовании флага --template доступны следующие свойства для использования в шаблоне:

- .Version содержит семантическую версию Helm
- .GitCommit — это git-коммит
- .GitTreeState — это состояние git-дерева на момент сборки Helm
- .GoVersion содержит версию Go, с которой был скомпилирован Helm

Например, --template='Version: {{.Version}}' выведет 'Version: v3.2.1'.


```
helm version [flags]
```

### Опции

```
  -h, --help              help for version
      --short             print the version number
      --template string   template for version string format
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

* [helm](./helm.md)	 - Менеджер пакетов Helm для Kubernetes.

###### Автоматически сгенерировано spf13/cobra 14-Jan-2026
