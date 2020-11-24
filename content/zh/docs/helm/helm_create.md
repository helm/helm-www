---
title: "Helm创建"
---

## helm create

使用给定名称创建新的chart

### 简介

该命令创建chart目录和chart用到的公共文件目录

比如'helm create foo'会创建一个目录结构看起来像这样：

```shell
foo/
├── .helmignore   # Contains patterns to ignore when packaging Helm charts.
├── Chart.yaml    # Information about your chart
├── values.yaml   # The default values for your templates
├── charts/       # Charts that this chart depends on
└── templates/    # The template files
    └── tests/    # The test files
```

'helm create'使用一个目录作为参数。如果给定目录路径不存在，Helm会自动创建。如果给定目录存在且非空，冲突文件会被覆盖，其他文件会被保留。

```shell
helm create NAME [flags]
```

### 可选项

```shell
  -h, --help             help for create
  -p, --starter string   the name or absolute path to Helm starter scaffold
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
