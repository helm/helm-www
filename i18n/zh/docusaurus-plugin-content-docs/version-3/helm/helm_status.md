---
title: helm status
---

显示指定 release 的状态

### 简介

该命令显示指定 release 的状态。
状态包括：
- 最后部署时间
- release 所在的 Kubernetes namespace
- release 状态（可以是：unknown、deployed、uninstalled、superseded、failed、uninstalling、pending-install、pending-upgrade 或 pending-rollback）
- release 的修订版本号
- release 的描述（可以是完成信息或错误信息，需要启用 --show-desc）
- release 包含的资源列表（需要启用 --show-resources）
- 最后一次测试套件运行的详细信息（如适用）
- chart 提供的附加说明


```
helm status RELEASE_NAME [flags]
```

### 可选项

```
  -h, --help             status 的帮助信息
  -o, --output format    以指定格式打印输出。允许的值：table、json、yaml（默认 table）
      --revision int     如果设置，显示指定 release 对应修订版本的状态
      --show-desc        如果设置，显示指定 release 的描述信息
      --show-resources   如果设置，显示指定 release 的资源
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

- [helm](/helm/helm.md) - 针对 Kubernetes 的 Helm 包管理器

###### 由 spf13/cobra 于 2026-01-14 自动生成
