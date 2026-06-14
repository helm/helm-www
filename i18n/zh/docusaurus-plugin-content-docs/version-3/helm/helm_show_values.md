---
title: helm show values
---

显示 chart 的 values

### 简介

该命令检查 chart（目录、文件或 URL）并显示 values.yaml 文件的内容


```
helm show values [CHART] [flags]
```

### 可选项

```
      --ca-file string             使用此 CA 包验证启用 HTTPS 的服务器的证书
      --cert-file string           使用此 SSL 证书文件标识 HTTPS 客户端
      --devel                      同时使用开发版本。等同于 version '>0.0.0-0'。如果设置了 --version，则忽略此项
  -h, --help                       values 的帮助信息
      --insecure-skip-tls-verify   跳过 chart 下载的 TLS 证书检查
      --jsonpath string            提供 JSONPath 表达式来过滤输出
      --key-file string            使用此 SSL 密钥文件标识 HTTPS 客户端
      --keyring string             用于验证的公钥位置（默认 "~/.gnupg/pubring.gpg"）
      --pass-credentials           将凭据传递给所有域
      --password string            chart 仓库密码
      --plain-http                 对 chart 下载使用不安全的 HTTP 连接
      --repo string                chart 仓库 URL
      --username string            chart 仓库用户名
      --verify                     使用前验证此包
      --version string             指定 chart 版本约束。可以是特定 tag（如 1.1.1）或引用有效范围（如 ^2.0.0）。如果未指定，使用最新版本
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

* [helm show](/helm/helm_show.md) - 显示 chart 信息

###### 由 spf13/cobra 于 2026-01-14 自动生成
