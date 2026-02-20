---
title: helm rollback
---

将 release 回滚到之前的修订版本

### 简介

该命令将 release 回滚到之前的修订版本。

回滚命令的第一个参数是 release 的名称，第二个参数是修订（版本）号。如果省略此参数或设置为 0，将回滚到上一个修订版本。

要查看修订号，运行 'helm history RELEASE'。

```
helm rollback <RELEASE> [REVISION] [flags]
```

### 可选项

```
      --cleanup-on-fail    允许在回滚失败时删除此次回滚中创建的新资源
      --dry-run            模拟回滚
      --force              如有需要，通过删除/重建策略强制更新资源
  -h, --help               rollback 的帮助信息
      --history-max int    限制每个 release 保存的最大修订版本数。使用 0 表示无限制（默认 10）
      --no-hooks           阻止回滚期间运行钩子
      --recreate-pods      如果适用，对资源执行 Pod 重启
      --timeout duration   等待任何单个 Kubernetes 操作的时间（如钩子的 Jobs）（默认 5m0s）
      --wait               如果设置，将等待所有 Pod、PVC、Service 以及 Deployment、StatefulSet 或 ReplicaSet 的最小 Pod 数处于就绪状态后才将 release 标记为成功。等待时间与 --timeout 一致
      --wait-for-jobs      如果设置且启用了 --wait，将等待所有 Job 完成后才将 release 标记为成功。等待时间与 --timeout 一致
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
      --qps float32                     与 Kubernetes API 通信时使用的每秒查询数，不包括突发流量
      --registry-config string          registry 配置文件的路径（默认 "~/.config/helm/registry/config.json"）
      --repository-cache string         包含缓存的仓库索引的目录路径（默认 "~/.cache/helm/repository"）
      --repository-config string        包含仓库名称和 URL 的文件路径（默认 "~/.config/helm/repositories.yaml"）
```

### 请参阅

* [helm](helm.md) - Kubernetes 的 Helm 包管理器

###### 由 spf13/cobra 于 2026-01-14 自动生成
