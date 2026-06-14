---
title: helm get
---

下载指定 release 的扩展信息

### 简介

该命令由多个子命令组成，用于获取 release 的扩展信息，包括：

- 用于生成该 release 的 values
- 生成的清单文件
- chart 提供的 NOTES
- 与该 release 关联的 hook
- 该 release 的元数据


### 可选项

```
  -h, --help   get 的帮助信息
```

### 从父命令继承的选项

```
      --burst-limit int                 客户端默认限流值（默认 100）
      --debug                           启用详细输出
      --kube-apiserver string           Kubernetes API 服务器的地址和端口
      --kube-as-group stringArray       模拟操作的组，此参数可以重复指定多个组
      --kube-as-user string             模拟操作的用户名
      --kube-ca-file string             Kubernetes API 服务器连接的证书颁发机构文件
      --kube-context string             要使用的 kubeconfig 上下文名称
      --kube-insecure-skip-tls-verify   如果为 true，将不检查 Kubernetes API 服务器证书的有效性。这会使你的 HTTPS 连接不安全
      --kube-tls-server-name string     用于 Kubernetes API 服务器证书验证的服务器名称。如果未提供，则使用联系服务器的主机名
      --kube-token string               用于身份验证的 bearer token
      --kubeconfig string               kubeconfig 文件的路径
  -n, --namespace string                此请求的 namespace 范围
      --qps float32                     与 Kubernetes API 通信时使用的每秒查询数，不包括突发
      --registry-config string          registry 配置文件的路径（默认 "~/.config/helm/registry/config.json"）
      --repository-cache string         包含缓存仓库索引的目录路径（默认 "~/.cache/helm/repository"）
      --repository-config string        包含仓库名称和 URL 的文件路径（默认 "~/.config/helm/repositories.yaml"）
```

### 请参阅

- [helm](/helm/helm.md) - Kubernetes 的 Helm 包管理器
- [helm get all](/helm/helm_get_all.md) - 下载指定 release 的所有信息
- [helm get hooks](/helm/helm_get_hooks.md) - 下载指定 release 的所有 hook
- [helm get manifest](/helm/helm_get_manifest.md) - 下载指定 release 的清单
- [helm get metadata](/helm/helm_get_metadata.md) - 获取指定 release 的元数据
- [helm get notes](/helm/helm_get_notes.md) - 下载指定 release 的 NOTES
- [helm get values](/helm/helm_get_values.md) - 下载指定 release 的 values 文件

###### 由 spf13/cobra 于 2026-01-14 自动生成
