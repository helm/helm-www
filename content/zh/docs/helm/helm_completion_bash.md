---
title: "Helm补全 - bash"
---

## helm completion bash

为bash生成自动补全脚本

### 简介

为Helm生成针对于bash shell的自动补全脚本。

在当前shell会话中加载自动补全：

    source <(helm completion bash)

为每个新的会话加载自动补全，执行一次：

- Linux:

      helm completion bash | sudo tee /etc/bash_completion.d/helm

- MacOS:

      helm completion bash | sudo tee /usr/local/etc/bash_completion.d/helm

```shell
helm completion bash [flags]
```

### 可选项

```shell
  -h, --help              help for bash
      --no-descriptions   disable completion descriptions
```

### 从父命令继承的命令

```shell
      --burst-limit int                 client-side default throttling limit (default 100)
      --debug                           enable verbose output
      --kube-apiserver string           the address and the port for the Kubernetes API server
      --kube-as-group stringArray       group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --kube-as-user string             username to impersonate for the operation
      --kube-ca-file string             the certificate authority file for the Kubernetes API server connection
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

- [helm completion](helm_completion.md) - 为指定的shell生成自动补全脚本
