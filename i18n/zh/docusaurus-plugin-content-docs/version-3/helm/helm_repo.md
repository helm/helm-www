---
title: helm repo
---

添加、列出、删除、更新和索引 chart 仓库

### 简介

该命令包含多个子命令，用于与 chart 仓库交互。

可用于添加、删除、列举和索引 chart 仓库。

### 可选项

```
  -h, --help   repo 的帮助信息
```

### 从父命令继承的选项

```
      --burst-limit int                 客户端默认限流值（默认 100）
      --debug                           启用详细输出
      --kube-apiserver string           Kubernetes API 服务器的地址和端口
      --kube-as-group stringArray       操作时模拟的组，此参数可重复指定多个组
      --kube-as-user string             操作时模拟的用户名
      --kube-ca-file string             Kubernetes API 服务器连接的证书颁发机构文件
      --kube-context string             要使用的 kubeconfig 上下文名称
      --kube-insecure-skip-tls-verify   如果设置为 true，将不会验证 Kubernetes API 服务器的证书。这会使你的 HTTPS 连接不安全
      --kube-tls-server-name string     用于 Kubernetes API 服务器证书验证的服务器名称。如果未提供，则使用联系服务器时的主机名
      --kube-token string               用于身份验证的 bearer token
      --kubeconfig string               kubeconfig 文件的路径
  -n, --namespace string                此请求的命名空间范围
      --qps float32                     与 Kubernetes API 通信时的每秒查询数，不包括突发
      --registry-config string          registry 配置文件的路径（默认 "~/.config/helm/registry/config.json"）
      --repository-cache string         包含缓存仓库索引的目录路径（默认 "~/.cache/helm/repository"）
      --repository-config string        包含仓库名称和 URL 的文件路径（默认 "~/.config/helm/repositories.yaml"）
```

### 请参阅

* [helm](/helm/helm.md) - Kubernetes 的 Helm 包管理器
* [helm repo add](/helm/helm_repo_add.md) - 添加 chart 仓库
* [helm repo index](/helm/helm_repo_index.md) - 基于包含打包 chart 的目录，生成索引文件
* [helm repo list](/helm/helm_repo_list.md) - 列举 chart 仓库
* [helm repo remove](/helm/helm_repo_remove.md) - 删除一个或多个仓库
* [helm repo update](/helm/helm_repo_update.md) - 从 chart 仓库中更新本地可用 chart 的信息

###### 由 spf13/cobra 于 2026-01-14 自动生成
