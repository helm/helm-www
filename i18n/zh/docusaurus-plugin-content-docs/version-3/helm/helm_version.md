---
title: helm version
---
打印客户端版本信息

### 简介

显示Helm的版本。

该命令会打印Helm的版本描述，输出如下：

version.BuildInfo{Version:"v3.2.1", GitCommit:"fe51cd1e31e6a202cba7dead9552a6d418ded79a",
GitTreeState:"clean", GoVersion:"go1.13.10"}

- 版本是发布的语义化版本。
- GitCommit是用于生成此版本提交的SHA
- 如果构建二级制包是没有本地代码修改，GitTreeState就是"干净的"
- GoVersion是用于编译Helm的Go版本

当使用--template参数时，下列属性在模板中是可用的：

- .Version 包含了Helm的语义化版本
- .GitCommit 是git的提交
- .GitTreeState 是Helm构建时的git树结构
- .GoVersion 包含Helm编译时使用的Go版本

比如， --template='Version: {{.Version}}' 输出 'Version: v3.2.1'。

```shell
helm version [flags]
```

### 可选项

```shell
  -h, --help              help for version
      --short             print the version number
      --template string   template for version string format
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

- [helm](/helm/helm.md) - 针对Kubernetes的Helm包管理器
