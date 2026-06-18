---
title: helm pull
---

скачивание чарта из репозитория с возможностью локальной распаковки

### Краткое описание


Загружает пакет из репозитория пакетов и сохраняет его локально.

Полезно для получения пакетов, чтобы изучить, изменить или перепаковать их.
Также позволяет выполнить криптографическую проверку чарта без его установки.

Есть опции для распаковки чарта после загрузки. При этом создаётся директория
для чарта, в которую он распаковывается.

Если указан флаг --verify, запрашиваемый чарт ДОЛЖЕН иметь файл provenance
и ДОЛЖЕН пройти проверку. Любая ошибка приведёт к прерыванию операции,
и чарт не будет сохранён локально.


```
helm pull [chart URL | repo/chartname] [...] [flags]
```

### Опции

```
      --ca-file string             verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string           identify HTTPS client using this SSL certificate file
  -d, --destination string         location to write the chart. If this and untardir are specified, untardir is appended to this (default ".")
      --devel                      use development versions, too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored.
  -h, --help                       help for pull
      --insecure-skip-tls-verify   skip tls certificate checks for the chart download
      --key-file string            identify HTTPS client using this SSL key file
      --keyring string             location of public keys used for verification (default "~/.gnupg/pubring.gpg")
      --pass-credentials           pass credentials to all domains
      --password string            chart repository password where to locate the requested chart
      --plain-http                 use insecure HTTP connections for the chart download
      --prov                       fetch the provenance file, but don't perform verification
      --repo string                chart repository url where to locate the requested chart
      --untar                      if set to true, will untar the chart after downloading it
      --untardir string            if untar is specified, this flag specifies the name of the directory into which the chart is expanded (default ".")
      --username string            chart repository username where to locate the requested chart
      --verify                     verify the package before using it
      --version string             specify a version constraint for the chart version to use. This constraint can be a specific tag (e.g. 1.1.1) or it may reference a valid range (e.g. ^2.0.0). If this is not specified, the latest version is used
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

###### Автоматически сгенерировано spf13/cobra 14-Jan-2026
