---
title: helm search
---
helm中搜索关键字

### 简介

搜索提供了可以在已经添加的Artifact Hub和仓库等多个位置搜索Helm chart 的能力。

### 可选项

```shell
  -h, --help   help for search
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
* [helm search hub](/helm/helm_search_hub.md) - 在Artifact Hub或自己的hub实例中搜索chart
* [helm search repo](/helm/helm_search_repo.md) - 用chart中关键字搜索仓库
