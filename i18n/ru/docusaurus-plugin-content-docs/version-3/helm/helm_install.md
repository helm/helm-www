---
title: helm install
---

установка чарта

### Краткое описание

Эта команда устанавливает чарт.

Аргументом команды install должна быть ссылка на чарт, путь к упакованному чарту,
путь к директории с распакованным чартом или URL-адрес.

Чтобы переопределить значения в чарте, используйте флаг '--values' и передайте файл
или используйте флаг '--set' для передачи конфигурации из командной строки. Для принудительного
задания строковых значений используйте '--set-string'. Флаг '--set-file' позволяет задавать
отдельные значения из файла, когда значение слишком длинное для командной строки
или генерируется динамически. Также можно использовать '--set-json' для задания JSON-значений
(скаляров/объектов/массивов) из командной строки.

    $ helm install -f myvalues.yaml myredis ./redis

или

    $ helm install --set name=prod myredis ./redis

или

    $ helm install --set-string long_int=1234567890 myredis ./redis

или

    $ helm install --set-file my_script=dothings.sh myredis ./redis

или

    $ helm install --set-json 'master.sidecars=[{"name":"sidecar","image":"myImage","imagePullPolicy":"Always","ports":[{"name":"portname","containerPort":1234}]}]' myredis ./redis


Флаг '--values'/'-f' можно указывать несколько раз. Приоритет отдаётся
последнему (самому правому) указанному файлу. Например, если оба файла myvalues.yaml и override.yaml
содержат ключ 'Test', значение из override.yaml будет иметь приоритет:

    $ helm install -f myvalues.yaml -f override.yaml  myredis ./redis

Флаг '--set' можно указывать несколько раз. Приоритет отдаётся
последнему (самому правому) указанному значению. Например, если для ключа 'foo'
заданы значения 'bar' и 'newbar', значение 'newbar' будет иметь приоритет:

    $ helm install --set foo=bar --set foo=newbar  myredis ./redis

Аналогично, в следующем примере 'foo' принимает значение '["four"]':

    $ helm install --set-json='foo=["one", "two", "three"]' --set-json='foo=["four"]' myredis ./redis

А в следующем примере 'foo' принимает значение '{"key1":"value1","key2":"bar"}':

    $ helm install --set-json='foo={"key1":"value1","key2":"value2"}' --set-json='foo.key2="bar"' myredis ./redis

Чтобы проверить сгенерированные манифесты релиза без фактической установки чарта,
можно комбинировать флаги --debug и --dry-run.

Флаг --dry-run выведет все сгенерированные манифесты чарта, включая Secrets,
которые могут содержать конфиденциальные данные. Чтобы скрыть Kubernetes Secrets,
используйте флаг --hide-secret. Используйте эти флаги с осторожностью.

Если указан флаг --verify, чарт ДОЛЖЕН иметь файл происхождения (provenance),
и этот файл ДОЛЖЕН пройти все проверки.

Существует шесть различных способов указать чарт для установки:

1. По ссылке на чарт: helm install mymaria example/mariadb
2. По пути к упакованному чарту: helm install mynginx ./nginx-1.2.3.tgz
3. По пути к директории с распакованным чартом: helm install mynginx ./nginx
4. По абсолютному URL: helm install mynginx https://example.com/charts/nginx-1.2.3.tgz
5. По ссылке на чарт и URL репозитория: helm install --repo https://example.com/charts/ mynginx nginx
6. Через OCI-реестры: helm install mynginx --version 1.2.3 oci://example.com/charts/nginx

ССЫЛКИ НА ЧАРТЫ

Ссылка на чарт — это удобный способ обращения к чарту в репозитории чартов.

При использовании ссылки на чарт с префиксом репозитория ('example/mariadb'), Helm ищет
в локальной конфигурации репозиторий чартов с именем 'example', а затем ищет
в этом репозитории чарт с именем 'mariadb'. Будет установлена последняя стабильная версия чарта,
если не указан флаг '--devel' для включения версий в разработке (alpha, beta и release candidate),
или если не указана конкретная версия с помощью флага '--version'.

Для просмотра списка репозиториев чартов используйте 'helm repo list'. Для поиска
чартов в репозитории используйте 'helm search'.


```
helm install [NAME] [CHART] [flags]
```

### Опции

```
      --atomic                                     if set, the installation process deletes the installation on failure. The --wait flag will be set automatically if --atomic is used
      --ca-file string                             verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string                           identify HTTPS client using this SSL certificate file
      --create-namespace                           create the release namespace if not present
      --dependency-update                          update dependencies if they are missing before installing the chart
      --description string                         add a custom description
      --devel                                      use development versions, too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored
      --disable-openapi-validation                 if set, the installation process will not validate rendered templates against the Kubernetes OpenAPI Schema
      --dry-run string[="client"]                  simulate an install. If --dry-run is set with no option being specified or as '--dry-run=client', it will not attempt cluster connections. Setting '--dry-run=server' allows attempting cluster connections.
      --enable-dns                                 enable DNS lookups when rendering templates
      --force                                      force resource updates through a replacement strategy
  -g, --generate-name                              generate the name (and omit the NAME parameter)
  -h, --help                                       help for install
      --hide-notes                                 if set, do not show notes in install output. Does not affect presence in chart metadata
      --hide-secret                                hide Kubernetes Secrets when also using the --dry-run flag
      --insecure-skip-tls-verify                   skip tls certificate checks for the chart download
      --key-file string                            identify HTTPS client using this SSL key file
      --keyring string                             location of public keys used for verification (default "~/.gnupg/pubring.gpg")
  -l, --labels stringToString                      Labels that would be added to release metadata. Should be divided by comma. (default [])
      --name-template string                       specify template used to name the release
      --no-hooks                                   prevent hooks from running during install
  -o, --output format                              prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --pass-credentials                           pass credentials to all domains
      --password string                            chart repository password where to locate the requested chart
      --plain-http                                 use insecure HTTP connections for the chart download
      --post-renderer postRendererString           the path to an executable to be used for post rendering. If it exists in $PATH, the binary will be used, otherwise it will try to look for the executable at the given path
      --post-renderer-args postRendererArgsSlice   an argument to the post-renderer (can specify multiple) (default [])
      --render-subchart-notes                      if set, render subchart notes along with the parent
      --replace                                    re-use the given name, only if that name is a deleted release which remains in the history. This is unsafe in production
      --repo string                                chart repository url where to locate the requested chart
      --set stringArray                            set values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --set-file stringArray                       set values from respective files specified via the command line (can specify multiple or separate values with commas: key1=path1,key2=path2)
      --set-json stringArray                       set JSON values on the command line (can specify multiple or separate values with commas: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    set a literal STRING value on the command line
      --set-string stringArray                     set STRING values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --skip-crds                                  if set, no CRDs will be installed. By default, CRDs are installed if not already present
      --skip-schema-validation                     if set, disables JSON schema validation
      --take-ownership                             if set, install will ignore the check for helm annotations and take ownership of the existing resources
      --timeout duration                           time to wait for any individual Kubernetes operation (like Jobs for hooks) (default 5m0s)
      --username string                            chart repository username where to locate the requested chart
  -f, --values strings                             specify values in a YAML file or a URL (can specify multiple)
      --verify                                     verify the package before using it
      --version string                             specify a version constraint for the chart version to use. This constraint can be a specific tag (e.g. 1.1.1) or it may reference a valid range (e.g. ^2.0.0). If this is not specified, the latest version is used
      --wait                                       if set, will wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful. It will wait for as long as --timeout
      --wait-for-jobs                              if set and --wait enabled, will wait until all Jobs have been completed before marking the release as successful. It will wait for as long as --timeout
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
