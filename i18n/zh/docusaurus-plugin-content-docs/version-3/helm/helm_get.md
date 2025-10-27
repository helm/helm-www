---
title: helm get
---
下载发布的扩展信息

### 简介

该命令有多个子命令组成，用来获取发布版本的扩展信息，包括：

- 生成版本的值
- 生成的清单文件
- 发布的chart提供的注释
- 与版本关联的钩子

### 可选项

```shell
  -h, --help   help for get
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

- [helm](/helm/helm.md) - 针对Kubernetes的Helm包管理器
- [helm get all](/helm/helm_get_all.md) - 下载命名版本的所有信息
- [helm get hooks](/helm/helm_get_hooks.md) - 下载命名版本的所有钩子
- [helm get manifest](/helm/helm_get_manifest.md) - 下载命名版本的清单
- [helm get notes](/helm/helm_get_notes.md) - 下载命名版本的注释
- [helm get values](/helm/helm_get_values.md) - 下载命名版本的values文件
