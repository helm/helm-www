---
title: "Helm 卸载"
---

## helm uninstall

卸载版本

### 简介

该命令使用版本名称卸载版本

会删除与最新版本chart相关的所有资源以及发布历史，释放以供将来使用

使用'--dry-run'参数查看哪些版本将在不实际卸载的情况下能够被卸载

```shell
helm uninstall RELEASE_NAME [...] [flags]
```

### 可选项

```shell
      --description string   add a custom description
      --dry-run              simulate a uninstall
  -h, --help                 help for uninstall
      --keep-history         remove all associated resources and mark the release as deleted, but retain the release history
      --no-hooks             prevent hooks from running during uninstallation
      --timeout duration     time to wait for any individual Kubernetes operation (like Jobs for hooks) (default 5m0s)
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

* [helm](helm.md) - 针对Kubernetes的Helm包管理器
