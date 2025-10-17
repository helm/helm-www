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
- 列举版本包含的资源（使用--show-resources显示）
- 最后一次测试套件运行的详细信息（如果使用）
- chart提供的额外的注释

```shell
helm status RELEASE_NAME [flags]
```

### 可选项

```shell
  -h, --help             help for status
  -o, --output format    prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --revision int     if set, display the status of the named release with revision
      --show-desc        if set, display the description message of the named release
      --show-resources   if set, display the resources of the named release
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

- [helm](helm.md) - 针对Kubernetes的Helm包管理器
