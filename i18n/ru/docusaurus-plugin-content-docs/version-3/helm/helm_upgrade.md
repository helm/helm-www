---
title: helm upgrade
---

обновление релиза до новой версии чарта

### Краткое описание

Эта команда обновляет релиз до новой версии чарта.

Аргументами команды upgrade должны быть релиз и чарт. Аргумент чарта
может быть: ссылкой на чарт ('example/mariadb'), путём к директории с чартом,
упакованным чартом или полным URL-адресом. Если не указан флаг '--version',
будет использоваться последняя версия чарта.

Чтобы переопределить значения в чарте, используйте флаг '--values' и передайте файл
или используйте флаг '--set' для передачи конфигурации из командной строки. Для принудительного
задания строковых значений используйте '--set-string'. Флаг '--set-file' позволяет задавать
отдельные значения из файла, когда значение слишком длинное для командной строки
или генерируется динамически. Также можно использовать '--set-json' для задания JSON-значений
(скаляров/объектов/массивов) из командной строки.

Флаг '--values'/'-f' можно указывать несколько раз. Приоритет отдаётся
последнему (самому правому) указанному файлу. Например, если оба файла myvalues.yaml и override.yaml
содержат ключ 'Test', значение из override.yaml будет иметь приоритет:

    $ helm upgrade -f myvalues.yaml -f override.yaml redis ./redis

Флаг '--set' можно указывать несколько раз. Приоритет отдаётся
последнему (самому правому) указанному значению. Например, если для ключа 'foo'
заданы значения 'bar' и 'newbar', значение 'newbar' будет иметь приоритет:

    $ helm upgrade --set foo=bar --set foo=newbar redis ./redis

С помощью этой команды также можно обновить значения существующего релиза,
используя флаг '--reuse-values'. Аргументы 'RELEASE' и 'CHART' должны соответствовать
исходным параметрам, и существующие значения будут объединены со значениями,
указанными через флаги '--values'/'-f' или '--set'. Приоритет отдаётся новым значениям.

    $ helm upgrade --reuse-values --set foo=bar --set foo=newbar redis ./redis

Флаг --dry-run выведет все сгенерированные манифесты чарта, включая Secrets,
которые могут содержать конфиденциальные данные. Чтобы скрыть Kubernetes Secrets,
используйте флаг --hide-secret. Используйте эти флаги с осторожностью.


```
helm upgrade [RELEASE] [CHART] [flags]
```

### Опции

```
      --atomic                                     if set, upgrade process rolls back changes made in case of failed upgrade. The --wait flag will be set automatically if --atomic is used
      --ca-file string                             verify certificates of HTTPS-enabled servers using this CA bundle
      --cert-file string                           identify HTTPS client using this SSL certificate file
      --cleanup-on-fail                            allow deletion of new resources created in this upgrade when upgrade fails
      --create-namespace                           if --install is set, create the release namespace if not present
      --dependency-update                          update dependencies if they are missing before installing the chart
      --description string                         add a custom description
      --devel                                      use development versions, too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored
      --disable-openapi-validation                 if set, the upgrade process will not validate rendered templates against the Kubernetes OpenAPI Schema
      --dry-run string[="client"]                  simulate an install. If --dry-run is set with no option being specified or as '--dry-run=client', it will not attempt cluster connections. Setting '--dry-run=server' allows attempting cluster connections.
      --enable-dns                                 enable DNS lookups when rendering templates
      --force                                      force resource updates through a replacement strategy
  -h, --help                                       help for upgrade
      --hide-notes                                 if set, do not show notes in upgrade output. Does not affect presence in chart metadata
      --hide-secret                                hide Kubernetes Secrets when also using the --dry-run flag
      --history-max int                            limit the maximum number of revisions saved per release. Use 0 for no limit (default 10)
      --insecure-skip-tls-verify                   skip tls certificate checks for the chart download
  -i, --install                                    if a release by this name doesn't already exist, run an install
      --key-file string                            identify HTTPS client using this SSL key file
      --keyring string                             location of public keys used for verification (default "~/.gnupg/pubring.gpg")
  -l, --labels stringToString                      Labels that would be added to release metadata. Should be separated by comma. Original release labels will be merged with upgrade labels. You can unset label using null. (default [])
      --no-hooks                                   disable pre/post upgrade hooks
  -o, --output format                              prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --pass-credentials                           pass credentials to all domains
      --password string                            chart repository password where to locate the requested chart
      --plain-http                                 use insecure HTTP connections for the chart download
      --post-renderer postRendererString           the path to an executable to be used for post rendering. If it exists in $PATH, the binary will be used, otherwise it will try to look for the executable at the given path
      --post-renderer-args postRendererArgsSlice   an argument to the post-renderer (can specify multiple) (default [])
      --render-subchart-notes                      if set, render subchart notes along with the parent
      --repo string                                chart repository url where to locate the requested chart
      --reset-then-reuse-values                    when upgrading, reset the values to the ones built into the chart, apply the last release's values and merge in any overrides from the command line via --set and -f. If '--reset-values' or '--reuse-values' is specified, this is ignored
      --reset-values                               when upgrading, reset the values to the ones built into the chart
      --reuse-values                               when upgrading, reuse the last release's values and merge in any overrides from the command line via --set and -f. If '--reset-values' is specified, this is ignored
      --set stringArray                            set values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --set-file stringArray                       set values from respective files specified via the command line (can specify multiple or separate values with commas: key1=path1,key2=path2)
      --set-json stringArray                       set JSON values on the command line (can specify multiple or separate values with commas: key1=jsonval1,key2=jsonval2)
      --set-literal stringArray                    set a literal STRING value on the command line
      --set-string stringArray                     set STRING values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --skip-crds                                  if set, no CRDs will be installed when an upgrade is performed with install flag enabled. By default, CRDs are installed if not already present, when an upgrade is performed with install flag enabled
      --skip-schema-validation                     if set, disables JSON schema validation
      --take-ownership                             if set, upgrade will ignore the check for helm annotations and take ownership of the existing resources
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
