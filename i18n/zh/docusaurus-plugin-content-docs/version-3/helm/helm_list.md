---
title: helm list
---
列举发布版本

### 简介

该命令会列举出指定命名空间的所有发布版本，(如果没有指定命名空间，会使用当前命名空间)。

默认情况下，只会列举出部署的或者失败的发布，像'--uninstalled'或者'--all'会修改默认行为。这些参数可以组合使用：'--uninstalled
--failed'。

默认情况下，列表按字母排序。使用'-d'参数按照日期排序。

如果使用--filter参数，会作为一个过滤器。过滤器是应用于发布列表的正则表达式(兼容Perl)。只有过滤器匹配的才会返回。

```shell
$ helm list --filter 'ara[a-z]+'
NAME                UPDATED                                  CHART
maudlin-arachnid    2020-06-18 14:17:46.125134977 +0000 UTC  alpine-0.1.0
```

如果未找到结果，'helm list'会退出，但是没有输出(或者使用'-q'，只返回头部）。

默认情况下，最多返回256项，使用'--max'限制数量，'--max'设置为0不会返回所有结果，而是返回服务器默认值，可能要比256更多。
同时使用'--max'和'--offset'参数可以翻页显示。

```shell
helm list [flags]
```

### 可选项

```shell
  -a, --all                  show all releases without any filter applied
  -A, --all-namespaces       list releases across all namespaces
  -d, --date                 sort by release date
      --deployed             show deployed releases. If no other is specified, this will be automatically enabled
      --failed               show failed releases
  -f, --filter string        a regular expression (Perl compatible). Any releases that match the expression will be included in the results
  -h, --help                 help for list
  -m, --max int              maximum number of releases to fetch (default 256)
      --no-headers           don't print headers when using the default output format
      --offset int           next release index in the list, used to offset from start value
  -o, --output format        prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --pending              show pending releases
  -r, --reverse              reverse the sort order
  -l, --selector string      Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2). Works only for secret(default) and configmap storage backends.
  -q, --short                output short (quiet) listing format
      --superseded           show superseded releases
      --time-format string   format time using golang time formatter. Example: --time-format "2006-01-02 15:04:05Z0700"
      --uninstalled          show uninstalled releases (if 'helm uninstall --keep-history' was used)
      --uninstalling         show releases that are currently being uninstalled
```

### 从父命令继承的命令

```shell
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
      --registry-config string          path to the registry config file (default "~/.config/helm/registry/config.json")
      --repository-cache string         path to the file containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string        path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### 请参阅

* [helm](/helm/helm.md) - 针对Kubernetes的Helm包管理器
