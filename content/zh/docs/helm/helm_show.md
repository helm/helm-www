---
title: "Helm 展示"
---

## helm show

显示chart信息

### 简介

该命令由多条子命令组成来显示chart的信息

### 可选项

```shell
  -h, --help   help for show
```

### 从父命令继承的命令

```shell
      --debug                       enable verbose output
      --kube-apiserver string       the address and the port for the Kubernetes API server
      --kube-as-group stringArray   group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --kube-as-user string         username to impersonate for the operation
      --kube-ca-file string         the certificate authority file for the Kubernetes API server connection
      --kube-context string         name of the kubeconfig context to use
      --kube-token string           bearer token used for authentication
      --kubeconfig string           path to the kubeconfig file
  -n, --namespace string            namespace scope for this request
      --registry-config string      path to the registry config file (default "~/.config/helm/registry/config.json")
      --repository-cache string     path to the file containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string    path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### 请参阅

- [helm](helm.md) - 针对Kubernetes的Helm包管理器
- [helm show all](helm_show_all.md) - 显示chart的所有信息
- [helm show chart](helm_show_chart.md) - 显示chart定义
- [helm show crds](helm_show_crds.md) - 显示chart的CRD
- [helm show readme](helm_show_readme.md) - 显示chart的README
- [helm show values](helm_show_values.md) - 显示chart的values
