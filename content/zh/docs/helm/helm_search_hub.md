---
title: "Helm Hub"
---

## helm search hub

在Helm Hub或Monocular实例中搜索chart

### 简介

在Helm Hub或Monocular实例中搜索Helm charts。

Helm Hub为公共可用的可分发的chart提供一种中心化搜索。由Helm项目组维护，可以访问：https://hub.helm.sh

Monocular是基于web的应用，支持从多个Helm Chart仓库中搜索和发现chart。是驱动Helm
Hub的代码库。可以访问：https://github.com/helm/monocular

```shell
helm search hub [keyword] [flags]
```

### 可选项

```shell
      --endpoint string      monocular instance to query for charts (default "https://hub.helm.sh")
  -h, --help                 help for hub
      --max-col-width uint   maximum column width for output table (default 50)
  -o, --output format        prints the output in the specified format. Allowed values: table, json, yaml (default table)
```

### 从父命令继承的命令

```shell
      --debug                       enable verbose output
      --kube-apiserver string       the address and the port for the Kubernetes API server
      --kube-as-group stringArray   Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --kube-as-user string         Username to impersonate for the operation
      --kube-context string         name of the kubeconfig context to use
      --kube-token string           bearer token used for authentication
      --kubeconfig string           path to the kubeconfig file
  -n, --namespace string            namespace scope for this request
      --registry-config string      path to the registry config file (default "~/.config/helm/registry.json")
      --repository-cache string     path to the file containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string    path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### 请参阅

* [helm search](helm_search.md) - helm中搜索关键字
