---
title: helm uninstall
---

卸载 release

### 简介

该命令使用 release 名称卸载 release。

会删除与该 release 最后一次部署的 chart 相关的所有资源，以及发布历史，释放以供将来使用。

使用 `--dry-run` 参数查看哪些 release 将被卸载，而不实际执行卸载操作。

```
helm uninstall RELEASE_NAME [...] [flags]
```

### 可选项

```
      --cascade string       必须是 "background"、"orphan" 或 "foreground"。选择依赖资源的级联删除策略。默认是 background。
      --description string   添加自定义描述
      --dry-run              模拟卸载
  -h, --help                 uninstall 的帮助信息
      --ignore-not-found     将 "release not found" 视为卸载成功
      --keep-history         删除所有关联资源并将 release 标记为已删除，但保留发布历史
      --no-hooks             卸载时禁止钩子运行
      --timeout duration     等待任何单个 Kubernetes 操作的时间（如钩子的 Jobs）（默认 5m0s）
      --wait                 如果设置，将等待所有资源删除后再返回。等待时间与 --timeout 一致
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
  -n, --namespace string                此请求的命名空间范围
      --qps float32                     与 Kubernetes API 通信时使用的每秒查询数，不包括突发
      --registry-config string          registry 配置文件的路径（默认 "~/.config/helm/registry/config.json"）
      --repository-cache string         包含缓存仓库索引的目录路径（默认 "~/.cache/helm/repository"）
      --repository-config string        包含仓库名称和 URL 的文件路径（默认 "~/.config/helm/repositories.yaml"）
```

### 请参阅

* [helm](./helm.md) - Kubernetes 的 Helm 包管理器

###### 由 spf13/cobra 于 2026-01-14 自动生成
