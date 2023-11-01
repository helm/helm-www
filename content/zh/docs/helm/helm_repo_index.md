---
title: "Helm 仓库索引"
---

## helm repo index

基于包含打包chart的目录，生成索引文件

### 简介

读取当前目录，并根据找到的 chart 生成索引文件。

这个工具用来为chart仓库创建一个'index.yaml'文件，使用'--url'参数创建一个chart的绝对URL。

要合并生成的索引和已经存在的索引文件时，使用'--merge'参数。在这个场景中，在当前目录中找到的chart会合并到已有索引中，
本地chart的优先级高于已有chart。

```shell
helm repo index [DIR] [flags]
```

### 可选项

```shell
  -h, --help           help for index
      --merge string   merge the generated index into the given index
      --url string     url of chart repository
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

* [helm repo](helm_repo.md) - 添加、列出、删除、更新和索引chart仓库
