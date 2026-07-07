---
title: "Helm 依赖"
---

## helm dependency

管理chart依赖

### 简介

管理chart依赖

Helm chart将依赖存储在'charts/'。对于chart开发者，管理依赖比声明了所有依赖的'Chart.yaml'文件更容易。

依赖命令对该文件进行操作，使得存储在'charts/'目录的需要的依赖和实际依赖之间同步变得很容易。

比如Chart.yaml声明了两个依赖：

```yaml
# Chart.yaml
dependencies:
- name: nginx
  version: "1.2.3"
  repository: "https://example.com/charts"
- name: memcached
  version: "3.2.1"
  repository: "https://another.example.com/charts"
```

'name'是chart名称，必须匹配'Chart.yaml'文件中名称。

'version'字段应该包含一个语义化的版本或版本范围。

'repository'的URL应该指向Chart仓库。Helm希望通过附加'/index.yaml'到URL，应该能检索chart库索引。
注意：'repository'不能是别名。别名必须以'alias:'或'@'开头。

从2.2.0开始，仓库可以被定义为本地存储的依赖chart的目录路径。路径应该以"file://"前缀开头，比如：

```yaml
# Chart.yaml
dependencies:
- name: nginx
  version: "1.2.3"
  repository: "file://../dependency_chart/nginx"
```

如果在本地检索依赖chart，不需要使用"helm add repo"将仓库加入到helm。该示例中也支持版本匹配。

### 可选项

```shell
  -h, --help   help for dependency
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

* [helm](helm.md) - 针对Kubernetes的Helm包管理器
* [helm dependency build](helm_dependency_build.md) - 基于Chart.lock文件重新构建charts/目录
* [helm dependency list](helm_dependency_list.md) - 列出给定chart的依赖
* [helm dependency update](helm_dependency_update.md) - 基于Chart.yaml内容升级charts/
