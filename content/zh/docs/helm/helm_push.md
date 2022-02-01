---
title: "Helm 推送"
---

## helm push

将chart推送到远程

### 简介

上传chart到注册表。

如果chart有其他相关文件，也会一起上传。

```shell
helm push [chart] [remote] [flags]
```

### 可选项

```shell
  -h, --help   help for push
```

### 从父命令继承的可选项

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

* [helm](helm.md) - 针对Kubernetes的Helm包管理器。
