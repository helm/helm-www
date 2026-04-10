---
title: helm dependency
---

управление зависимостями чарта

### Краткое описание


Управление зависимостями чарта.

Чарты Helm хранят свои зависимости в каталоге 'charts/'. Для разработчиков чартов
часто удобнее управлять зависимостями в файле 'Chart.yaml', в котором объявляются
все зависимости.

Команды для работы с зависимостями оперируют этим файлом, упрощая синхронизацию
между желаемым и фактическим состоянием зависимостей в каталоге 'charts/'.

Например, этот Chart.yaml объявляет две зависимости:

    # Chart.yaml
    dependencies:
    - name: nginx
      version: "1.2.3"
      repository: "https://example.com/charts"
    - name: memcached
      version: "3.2.1"
      repository: "https://another.example.com/charts"


Поле 'name' должно содержать имя чарта, которое должно совпадать с именем
в файле 'Chart.yaml' соответствующего чарта.

Поле 'version' должно содержать семантическую версию или диапазон версий.

URL в поле 'repository' должен указывать на репозиторий чартов. Helm ожидает,
что при добавлении '/index.yaml' к URL он сможет получить индекс репозитория
чартов. Примечание: 'repository' может быть псевдонимом. Псевдоним должен
начинаться с 'alias:' или '@'.

Начиная с версии 2.2.0, в качестве репозитория можно указать путь к локальному
каталогу, содержащему зависимые чарты. Путь должен начинаться с префикса
"file://". Например:

    # Chart.yaml
    dependencies:
    - name: nginx
      version: "1.2.3"
      repository: "file://../dependency_chart/nginx"

При использовании локального чарта добавление репозитория через команду
"helm add repo" не требуется. Сопоставление версий также поддерживается
в этом случае.


### Параметры

```
  -h, --help   help for dependency
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

* [helm](/helm/helm.md)	 — менеджер пакетов Helm для Kubernetes.
* [helm dependency build](/helm/helm_dependency_build.md)	 — пересборка каталога charts/ на основе файла Chart.lock
* [helm dependency list](/helm/helm_dependency_list.md)	 — просмотр списка зависимостей указанного чарта
* [helm dependency update](/helm/helm_dependency_update.md)	 — обновление каталога charts/ на основе содержимого Chart.yaml

###### Автоматически сгенерировано spf13/cobra 14-Jan-2026
