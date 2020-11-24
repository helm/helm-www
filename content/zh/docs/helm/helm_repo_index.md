---
title: "Helm Repo Index"
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

* [helm repo](helm_repo.md) - 添加、列出、删除、更新和索引chart仓库
