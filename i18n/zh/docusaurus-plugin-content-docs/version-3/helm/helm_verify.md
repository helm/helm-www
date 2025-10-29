---
title: helm verify
---
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

* [helm](/helm/helm.md) - 针对Kubernetes的Helm包管理器
