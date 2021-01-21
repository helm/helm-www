---
title: "Helm补全 - fish"
---

## helm completion fish

为fish生成自动补全脚本

### 简介

为Helm生成针对于fish shell的自动补全脚本。

在当前shell会话中加载自动补全：
$ helm completion fish | source

为每个新的会话加载自动补全，执行一次：

$ helm completion fish > ~/.config/fish/completions/helm.fish

您需要启动一个新的shell使其生效

```shell
helm completion fish
```

### 可选项

```shell
  -h, --help              help for fish
      --no-descriptions   disable completion descriptions
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
      --registry-config string      path to the registry config file (default "~/.config/helm/registry.json")
      --repository-cache string     path to the file containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string    path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### 请参阅

* [helm completion](helm_completion.md) - 为指定的shell生成自动补全脚本
