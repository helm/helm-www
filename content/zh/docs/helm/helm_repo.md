---
title: "Helm Repo"
---

## helm repo

添加、列出、删除、更新和索引chart仓库

### 简介

改命令由于chart仓库交互的多条子命令组成

可以用来添加、删除、列举和索引chart仓库

### 可选项

```shell
  -h, --help   help for repo
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

* [helm](helm.md) - 针对Kubernetes的Helm包管理器
* [helm repo add](helm_repo_add.md) - 添加chart仓库
* [helm repo index](helm_repo_index.md) - 生成包含已打包chart目录的索引文件
* [helm repo list](helm_repo_list.md) - 列举chart仓库
* [helm repo remove](helm_repo_remove.md) - 删除一个或多个仓库
* [helm repo update](helm_repo_update.md) - 从chart仓库中更新本地本地可用chart的信息
