---
title: helm dependency update
---
基于Chart.yaml内容升级charts/

### 简介

更新磁盘上的依赖为Chart.yaml指定内容。

该命令验证存储在'charts/'目录中的'Chart.yaml'文件描述的所需chart以及所需版本。
它会拉取满足依赖的最新chart并清理旧依赖。

成功更新后，会生成一个锁定文件用来重新构建精确版本的依赖。

不需要在'Chart.yaml'中表示依赖。 因此，更新命令不会删除chart，除非是在Chart.yaml文件中的错误版本。

```shell
helm dependency update CHART [flags]
```

### 可选项

```shell
  -h, --help             help for update
      --keyring string   keyring containing public keys (default "~/.gnupg/pubring.gpg")
      --skip-refresh     do not refresh the local repository cache
      --verify           verify the packages against signatures
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

- [helm dependency](/helm/helm_dependency.md) - 管理chart依赖
