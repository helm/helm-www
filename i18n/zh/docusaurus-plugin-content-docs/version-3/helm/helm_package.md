---
title: helm package
---

将 chart 目录打包成 chart 归档文件

### 简介

该命令将 chart 打包成一个版本化的 chart 归档文件。如果给定路径，将会在该路径中查找 chart（必须包含 Chart.yaml 文件）然后将该目录打包。

版本化的 chart 归档文件用于 Helm 包仓库。

要签名一个 chart，使用 `--sign` 参数。在大多数场景中，还需要提供 `--keyring path/to/secret/keys` 和 `--key keyname`。

  $ helm package --sign ./mychart --key mykey --keyring ~/.gnupg/secring.gpg

如果未指定 `--keyring`，除非环境有其他配置，否则 Helm 通常会使用公共密钥环。

```
helm package [CHART_PATH] [...] [flags]
```

### 可选项

```
      --app-version string         设置 chart 的 appVersion 为此版本
      --ca-file string             使用此 CA 证书包验证启用 HTTPS 的服务器证书
      --cert-file string           使用此 SSL 证书文件标识 HTTPS 客户端
  -u, --dependency-update          打包前从 "Chart.yaml" 更新依赖到 "charts/" 目录
  -d, --destination string         chart 写入位置（默认 "."）
  -h, --help                       package 命令帮助
      --insecure-skip-tls-verify   跳过 chart 下载时的 TLS 证书检查
      --key string                 签名时使用的密钥名称，在 --sign 为 true 时使用
      --key-file string            使用此 SSL 密钥文件标识 HTTPS 客户端
      --keyring string             公共密钥环位置（默认 "~/.gnupg/pubring.gpg"）
      --passphrase-file string     包含签名密钥密码短语的文件位置，使用 "-" 从标准输入读取
      --password string            定位所请求 chart 的仓库密码
      --plain-http                 chart 下载时使用不安全的 HTTP 连接
      --sign                       使用 PGP 私钥签名此包
      --username string            定位所请求 chart 的仓库用户名
      --version string             设置 chart 的版本为此 semver 版本
```

### 从父命令继承的选项

```
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

###### 由 spf13/cobra 于 2026-01-14 自动生成
