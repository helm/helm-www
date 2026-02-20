---
title: helm dependency
---

管理 chart 依赖

### 简介

管理 chart 依赖。

Helm chart 将依赖存储在 'charts/' 目录中。对于 chart 开发者，在 'Chart.yaml' 中声明所有依赖通常更方便管理。

依赖命令针对该文件进行操作，使得 'charts/' 目录中声明的依赖和实际存储的依赖之间轻松保持同步。

例如，以下 Chart.yaml 声明了两个依赖：

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

'name' 是 chart 名称，必须与该 chart 的 'Chart.yaml' 文件中的名称相匹配。

'version' 字段应包含语义化版本号或版本范围。

'repository' URL 应指向 Chart 仓库。Helm 会在 URL 后附加 '/index.yaml' 来获取 chart 仓库索引。注意：'repository' 可以是别名。别名必须以 'alias:' 或 '@' 开头。

从 2.2.0 开始，仓库可以定义为本地存储的依赖 chart 的目录路径。路径需以 "file://" 开头，例如：

```yaml
# Chart.yaml
dependencies:
- name: nginx
  version: "1.2.3"
  repository: "file://../dependency_chart/nginx"
```

如果依赖 chart 从本地获取，则不需要通过 "helm add repo" 将仓库添加到 helm 中。此场景也支持版本匹配。

### 可选项

```shell
  -h, --help   dependency 命令帮助
```

### 从父命令继承的选项

```shell
      --burst-limit int                 客户端默认限流值（默认 100）
      --debug                           启用详细输出
      --kube-apiserver string           Kubernetes API 服务器的地址和端口
      --kube-as-group stringArray       操作时模拟的用户组，可重复使用此参数指定多个组
      --kube-as-user string             操作时模拟的用户名
      --kube-ca-file string             Kubernetes API 服务器连接使用的证书颁发机构文件
      --kube-context string             使用的 kubeconfig 上下文名称
      --kube-insecure-skip-tls-verify   如果为 true，将不会验证 Kubernetes API 服务器的证书有效性，这会使 HTTPS 连接不安全
      --kube-tls-server-name string     用于 Kubernetes API 服务器证书验证的服务器名称，如果未提供，则使用连接服务器时的主机名
      --kube-token string               用于身份验证的 bearer 令牌
      --kubeconfig string               kubeconfig 文件路径
  -n, --namespace string                此请求的命名空间范围
      --qps float32                     与 Kubernetes API 通信时使用的每秒查询数，不包括突发请求
      --registry-config string          registry 配置文件路径（默认 "~/.config/helm/registry/config.json"）
      --repository-cache string         包含已缓存仓库索引的目录路径（默认 "~/.cache/helm/repository"）
      --repository-config string        包含仓库名称和 URL 的文件路径（默认 "~/.config/helm/repositories.yaml"）
```

### 请参阅

* [helm](/helm/helm.md) - Kubernetes 的 Helm 包管理器
* [helm dependency build](/helm/helm_dependency_build.md) - 根据 Chart.lock 文件重新构建 charts/ 目录
* [helm dependency list](/helm/helm_dependency_list.md) - 列出指定 chart 的依赖
* [helm dependency update](/helm/helm_dependency_update.md) - 根据 Chart.yaml 内容更新 charts/ 目录

###### 由 spf13/cobra 于 2026-01-14 自动生成
