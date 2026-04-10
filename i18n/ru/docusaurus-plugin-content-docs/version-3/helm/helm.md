---
title: helm
slug: helm
---

Пакетный менеджер Helm для Kubernetes.

### Краткое описание

Пакетный менеджер для Kubernetes

Основные действия в Helm:

- helm search:    поиск чартов
- helm pull:      загрузка чарта в локальную директорию для просмотра
- helm install:   установка чарта в Kubernetes
- helm list:      вывод списка релизов чартов

Переменные окружения:

| Имя                                | Описание                                                                                                   |
|------------------------------------|------------------------------------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | альтернативное расположение для хранения кэшированных файлов.                                              |
| $HELM_CONFIG_HOME                  | альтернативное расположение для хранения конфигурации Helm.                                                |
| $HELM_DATA_HOME                    | альтернативное расположение для хранения данных Helm.                                                      |
| $HELM_DEBUG                        | указывает, запущен ли Helm в режиме отладки                                                                |
| $HELM_DRIVER                       | драйвер хранилища. Возможные значения: configmap, secret, memory, sql.                                     |
| $HELM_DRIVER_SQL_CONNECTION_STRING | строка подключения для SQL-драйвера хранилища.                                                             |
| $HELM_MAX_HISTORY                  | максимальное количество записей в истории релизов helm.                                                    |
| $HELM_NAMESPACE                    | пространство имён для операций helm.                                                                       |
| $HELM_NO_PLUGINS                   | отключение плагинов. Установите HELM_NO_PLUGINS=1 для отключения.                                          |
| $HELM_PLUGINS                      | путь к директории с плагинами                                                                              |
| $HELM_REGISTRY_CONFIG              | путь к файлу конфигурации реестра.                                                                         |
| $HELM_REPOSITORY_CACHE             | путь к директории с кэшем репозиториев                                                                     |
| $HELM_REPOSITORY_CONFIG            | путь к файлу с репозиториями.                                                                              |
| $KUBECONFIG                        | альтернативный файл конфигурации Kubernetes (по умолчанию "~/.kube/config")                                |
| $HELM_KUBEAPISERVER                | адрес сервера API Kubernetes для аутентификации                                                            |
| $HELM_KUBECAFILE                   | файл центра сертификации Kubernetes.                                                                       |
| $HELM_KUBEASGROUPS                 | группы для имперсонации, через запятую.                                                                    |
| $HELM_KUBEASUSER                   | имя пользователя для имперсонации.                                                                         |
| $HELM_KUBECONTEXT                  | имя контекста kubeconfig.                                                                                  |
| $HELM_KUBETOKEN                    | Bearer-токен для аутентификации.                                                                           |
| $HELM_KUBEINSECURE_SKIP_TLS_VERIFY | указывает, следует ли пропустить проверку сертификата сервера API Kubernetes (небезопасно)                 |
| $HELM_KUBETLS_SERVER_NAME          | имя сервера для проверки сертификата сервера API Kubernetes                                                |
| $HELM_BURST_LIMIT                  | лимит burst по умолчанию при большом количестве CRD на сервере (по умолчанию 100, -1 для отключения)       |
| $HELM_QPS                          | количество запросов в секунду при большом числе вызовов, превышающих лимит burst                           |

Helm хранит кэш, конфигурацию и данные в соответствии со следующим порядком приоритета:

- Если установлена переменная окружения HELM_*_HOME, она будет использоваться
- Иначе, в системах, поддерживающих спецификацию XDG base directory, используются переменные XDG
- Если другое расположение не задано, используется расположение по умолчанию для операционной системы

По умолчанию директории зависят от операционной системы. Значения по умолчанию приведены ниже:

| Операционная система | Путь к кэшу               | Путь к конфигурации            | Путь к данным             |
|----------------------|---------------------------|--------------------------------|---------------------------|
| Linux                | $HOME/.cache/helm         | $HOME/.config/helm             | $HOME/.local/share/helm   |
| macOS                | $HOME/Library/Caches/helm | $HOME/Library/Preferences/helm | $HOME/Library/helm        |
| Windows              | %TEMP%\helm               | %APPDATA%\helm                 | %APPDATA%\helm            |


### Опции

```
      --burst-limit int                 client-side default throttling limit (default 100)
      --debug                           enable verbose output
  -h, --help                            help for helm
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

### СМ. ТАКЖЕ

* [helm completion](/helm/helm_completion.md)	 - генерация скриптов автодополнения для указанной оболочки
* [helm create](/helm/helm_create.md)	 - создание нового чарта с указанным именем
* [helm dependency](/helm/helm_dependency.md)	 - управление зависимостями чарта
* [helm env](/helm/helm_env.md)	 - информация об окружении клиента helm
* [helm get](/helm/helm_get.md)	 - получение расширенной информации об именованном релизе
* [helm history](/helm/helm_history.md)	 - получение истории релиза
* [helm install](/helm/helm_install.md)	 - установка чарта
* [helm lint](/helm/helm_lint.md)	 - проверка чарта на возможные проблемы
* [helm list](/helm/helm_list.md)	 - вывод списка релизов
* [helm package](/helm/helm_package.md)	 - упаковка директории чарта в архив чарта
* [helm plugin](/helm/helm_plugin.md)	 - установка, вывод списка или удаление плагинов Helm
* [helm pull](/helm/helm_pull.md)	 - загрузка чарта из репозитория и (опционально) распаковка в локальную директорию
* [helm push](/helm/helm_push.md)	 - отправка чарта на удалённый сервер
* [helm registry](/helm/helm_registry.md)	 - вход или выход из реестра
* [helm repo](/helm/helm_repo.md)	 - добавление, вывод списка, удаление, обновление и индексация репозиториев чартов
* [helm rollback](/helm/helm_rollback.md)	 - откат релиза к предыдущей ревизии
* [helm search](/helm/helm_search.md)	 - поиск по ключевому слову в чартах
* [helm show](/helm/helm_show.md)	 - показ информации о чарте
* [helm status](/helm/helm_status.md)	 - отображение статуса именованного релиза
* [helm template](/helm/helm_template.md)	 - локальный рендеринг шаблонов
* [helm test](/helm/helm_test.md)	 - запуск тестов для релиза
* [helm uninstall](/helm/helm_uninstall.md)	 - удаление релиза
* [helm upgrade](/helm/helm_upgrade.md)	 - обновление релиза
* [helm verify](/helm/helm_verify.md)	 - проверка подписи и валидности чарта по указанному пути
* [helm version](/helm/helm_version.md)	 - вывод информации о версии клиента

###### Автоматически сгенерировано spf13/cobra 14-Jan-2026
