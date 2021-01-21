---
title: "Helm 获取所有"
---

## helm get all

下载命名版本的所有信息

### 简介

该命令打印一个具有可读性的信息集合，包括注释，钩子，提供的values，以及给定版本生成的清单文件。

```shell
helm get all RELEASE_NAME [flags]
```

### 可选项

```shell
  -h, --help              help for all
      --revision int      get the named release with revision
      --template string   go template for formatting the output, eg: {{.Release.Name}}
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

* [helm get](helm_get.md) - 下载命名版本的扩展信息
