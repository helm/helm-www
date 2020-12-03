---
title: "Helm 验证"
---

## helm lint

验证chart是否存在问题

### 简介

该命令使用一个chart路径并运行一系列的测试来验证chart的格式是否正确。

如果遇到引起chart安装失败的情况，会触发[ERROR]信息，如果遇到违反惯例或建议的问题，会触发[WARNING]。

```shell
helm lint PATH [flags]
```

### 可选项

```shell
  -h, --help                     help for lint
      --set stringArray          set values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --set-file stringArray     set values from respective files specified via the command line (can specify multiple or separate values with commas: key1=path1,key2=path2)
      --set-string stringArray   set STRING values on the command line (can specify multiple or separate values with commas: key1=val1,key2=val2)
      --strict                   fail on lint warnings
  -f, --values strings           specify values in a YAML file or a URL (can specify multiple)
      --with-subcharts           lint dependent charts
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
