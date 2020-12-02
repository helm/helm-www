---
title: "Helm 依赖列表"
---

## helm dependency list

列举指定chart的依赖

### 简介

列举所有的chart中声明的依赖

该命令可以将chart包或chart目录作为输入，不会修改chart的内容。

如果chart不能加载会产生错误。

```shell
helm dependency list CHART [flags]
```

### 可选项

```shell
  -h, --help   help for list
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

- [helm dependency](helm_dependency.md) - 管理chart依赖
