---
title: helm show
---
显示chart信息

### 简介

该命令由多条子命令组成来显示chart的信息

### 可选项

```shell
  -h, --help   help for show
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
- [helm show all](/helm/helm_show_all.md) - 显示chart的所有信息
- [helm show chart](/helm/helm_show_chart.md) - 显示chart定义
- [helm show crds](/helm/helm_show_crds.md) - 显示chart的CRD
- [helm show readme](/helm/helm_show_readme.md) - 显示chart的README
- [helm show values](/helm/helm_show_values.md) - 显示chart的values
