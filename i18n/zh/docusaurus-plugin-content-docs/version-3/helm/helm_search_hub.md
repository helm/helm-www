---
title: helm search hub
---
在Artifact Hub或自己的hub实例中搜索chart

### 简介

在Artifact Hub或自己的hub实例中搜索Helm charts。

Artifact Hub  是基于web页面的应用，支持CNCF项目的查找、安装和发布包及配置项，包括了公开发布的Helm chart。它是CNCF的沙盒项目。可以访问https://artifacthub.io/

[KEYWORD] 参数接受关键字字符串或者带引号的查询字符串。查询字符串的文档，请查看 https://artifacthub.github.io/hub/api/?urls.primaryName=Monocular%20compatible%20search%20API#/Monocular/get_api_chartsvc_v1_charts_search

之前的Helm版本使用Monocular实例作为默认的endpoint，因此为了向后兼容，Artifact
Hub兼容Monocular的搜索API。类似地，要设置endpoint参数时，指定的endpoint也必须兼容Monocular的搜索API。
注意，指定Monocular实例作为endpoint时，不支持字符串查询。更多API细节，请参考 https://github.com/helm/monocular

```shell
helm search hub [KEYWORD] [flags]
```

### 可选项

```shell
      --endpoint string      Hub instance to query for charts (default "https://hub.helm.sh")
  -h, --help                 help for hub
      --list-repo-url        print charts repository URL
      --max-col-width uint   maximum column width for output table (default 50)
  -o, --output format        prints the output in the specified format. Allowed values: table, json, yaml (default table)
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

* [helm search](/helm/helm_search.md) - helm中搜索关键字
