---
title: "Helm补全 - bash"
---

## helm completion bash

为bash生成自动补全脚本

### 简介

为Helm生成针对于bash shell的自动补全脚本。

在当前shell会话中加载自动补全：
$ source <(helm completion bash)

为每个新的会话加载自动补全，执行一次：

Linux:
  $ helm completion bash > /etc/bash_completion.d/helm

MacOS:
  $ helm completion bash > /usr/local/etc/bash_completion.d/helm

```shell
helm completion bash
```

### 可选项

```shell
  -h, --help   help for bash
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

* [helm completion](helm_completion.md) - 为指定的shell生成自动补全脚本
