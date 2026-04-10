---
title: helm dependency update
---

根据 Chart.yaml 更新 charts/ 目录

### 简介

将磁盘上的依赖更新为 Chart.yaml 指定的状态。

此命令验证 'Chart.yaml' 中指定的所需 chart 是否存在于 'charts/' 目录中且版本满足要求。它会拉取满足依赖的最新 chart，并清理旧依赖。

成功更新后，会生成一个锁定文件，可用于将依赖重新构建到精确版本。

依赖不一定需要在 'Chart.yaml' 中声明。因此，更新命令不会删除 chart，除非该 chart 在 Chart.yaml 中声明但版本不符。

```shell
helm dependency update CHART [flags]
```

### 可选项

```shell
      --ca-file string             使用此 CA 证书包验证启用 HTTPS 的服务器证书
      --cert-file string           使用此 SSL 证书文件标识 HTTPS 客户端
  -h, --help                       update 命令帮助
      --insecure-skip-tls-verify   跳过 chart 下载时的 TLS 证书验证
      --key-file string            使用此 SSL 密钥文件标识 HTTPS 客户端
      --keyring string             包含公钥的密钥环（默认 "~/.gnupg/pubring.gpg"）
      --password string            chart 仓库密码，用于定位请求的 chart
      --plain-http                 对 chart 下载使用不安全的 HTTP 连接
      --skip-refresh               不刷新本地仓库缓存
      --username string            chart 仓库用户名，用于定位请求的 chart
      --verify                     对下载的包进行签名验证
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

* [helm dependency](/helm/helm_dependency.md) - 管理 chart 依赖

###### 由 spf13/cobra 于 2026-01-14 自动生成
