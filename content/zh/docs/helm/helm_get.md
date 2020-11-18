---
title: "Helm Get"
---

## helm get

下载命名发布的扩展信息

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

- [helm](helm.md) - 针对Kubernetes的Helm包管理器
- [helm get all](helm_get_all.md) - 下载命名版本的所有信息
- [helm get hooks](helm_get_hooks.md) - 下载命名版本的所有钩子
- [helm get manifest](helm_get_manifest.md) - 下载命名版本的清单
- [helm get notes](helm_get_notes.md) - 下载命名版本的注释
- [helm get values](helm_get_values.md) - 下载命名版本的values文件
