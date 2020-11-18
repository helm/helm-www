---
title: "Helm Plugin"
---

## helm plugin

安装、列举或卸载Helm插件

### 简介

管理客户端插件。

### 可选项

```shell
  -h, --help   help for plugin
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
- [helm plugin install](helm_plugin_install.md) - 安装一个或多个Helm插件
- [helm plugin list](helm_plugin_list.md) - 列举已安装的Helm插件
- [helm plugin uninstall](helm_plugin_uninstall.md) - 卸载一个或多个Helm插件
- [helm plugin update](helm_plugin_update.md) - 升级一个或多个Helm插件
