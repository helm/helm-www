---
title: "Helm获取Values"
---

## helm get values

下载命名版本的values文件

### 简介

该命令下载给定版本的values文件

```shell
helm get values RELEASE_NAME [flags]
```

### 可选项

```shell
  -a, --all             dump all (computed) values
  -h, --help            help for values
  -o, --output format   prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --revision int    get the named release with revision
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

* [helm get](helm_get.md) - 下载命名版本的扩展信息
