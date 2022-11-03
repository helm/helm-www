---
title: "Helm 补全"
---

## helm completion

为指定的shell生成自动补全脚本

### 简介

为Helm生成针对于指定shell的自动补全脚本

### 可选项

```shell
  -h, --help   help for completion
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
- [helm completion bash](helm_completion_bash.md) - 为bash生成自动补全脚本
- [helm completion fish](helm_completion_fish.md) - 为fish生成自动补全脚本
- [helm completion powershell](helm_completion_powershell.md) - 为powershell生成自动补全脚本
- [helm completion zsh](helm_completion_zsh.md) - 为zsh生成自动补全脚本
