---
title: "Helm Repo Remove"
---

## helm repo remove

删除一个或多个仓库

### 简介

删除一个或多个仓库

```shell
helm repo remove [REPO1 [REPO2 ...]] [flags]
```

### 可选项

```shell
  -h, --help   help for remove
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
