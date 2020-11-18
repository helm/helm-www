---
title: "Helm 状态"
---

## helm status

显示已命名发布的状态

### 简介

该命令显示已命名发布的状态，状态包括：

- 最后部署时间
- 发布版本所在的k8s命名空间
- 发布状态(可以是： unknown, deployed, uninstalled, superseded, failed, uninstalling,
pending-install, pending-upgrade 或 pending-rollback)
- 发布版本修订
- 发布版本描述(可以是完成信息或错误信息，需要用--show-desc启用)
- 列举版本包含的资源，按类型排序
- 最后一次测试套件运行的详细信息（如果使用）
- chart提供的额外的注释

```shell
helm status RELEASE_NAME [flags]
```

### 可选项

```shell
  -h, --help            help for status
  -o, --output format   prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --revision int    if set, display the status of the named release with revision
      --show-desc       if set, display the description message of the named release
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
