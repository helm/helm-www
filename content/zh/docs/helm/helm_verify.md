---
title: "Helm 验证"
---

## helm verify

验证给定路径的chart已经被签名且有效

### 简介

验证指定的chart有合法的源文件。

源文件提供了加密验证保证chart未被篡改，且由可信提供商打包。

该命令用于验证本地chart，其他一些命令提供'--verify'参数执行同样的验证。要生成一个签名包，使用'helm package --sign'命令。

```shell
helm verify PATH [flags]
```

### 可选项

```shell
  -h, --help             help for verify
      --keyring string   keyring containing public keys (default "~/.gnupg/pubring.gpg")
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

* [helm](helm.md) - 针对Kubernetes的Helm包管理器
