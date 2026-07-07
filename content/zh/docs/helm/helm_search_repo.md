---
title: "Helm 搜索仓库"
---

## helm search repo

用chart中关键字搜索仓库

### 简介

搜索会读取系统上配置的所有仓库，并查找匹配。搜索这些仓库会使用存储在系统中的元数据。

它会展示找到最新稳定版本的chart。如果指定了--devel参数，输出会包括预发布版本。

示例：

```shell
# Search for stable release versions matching the keyword "nginx"
$ helm search repo nginx

# Search for release versions matching the keyword "nginx", including pre-release versions
$ helm search repo nginx --devel

# Search for the latest stable release for nginx-ingress with a major version of 1
$ helm search repo nginx-ingress --version ^1.0.0
```

仓库使用'helm repo'命令管理。

```shell
helm search repo [keyword] [flags]
```

### 可选项

```shell
      --devel                use development versions (alpha, beta, and release candidate releases), too. Equivalent to version '>0.0.0-0'. If --version is set, this is ignored
  -h, --help                 help for repo
      --max-col-width uint   maximum column width for output table (default 50)
  -o, --output format        prints the output in the specified format. Allowed values: table, json, yaml (default table)
  -r, --regexp               use regular expressions for searching repositories you have added
      --version string       search using semantic versioning constraints on repositories you have added
  -l, --versions             show the long listing, with each version of each chart on its own line, for repositories you have added
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

* [helm search](helm_search.md) - helm中搜索关键字
