---
title: helm pull
---

从仓库下载 chart 并（可选）在本地目录解压

### 简介

从包仓库中检索包并下载到本地。

此命令用于获取包以便检查、修改或重新打包。还可以用于在不安装 chart 的情况下对 chart 进行加密验证。

下载 chart 后有解压选项，会为 chart 创建一个目录并解压到该目录中。

如果指定了 `--verify` 参数，请求的 chart 必须有出处文件，且必须通过验证。任意部分的失败都会导致错误，且 chart 不会在本地保存。

```shell
helm pull [chart URL | repo/chartname] [...] [flags]
```

### 可选项

```shell
      --ca-file string             使用此 CA 证书包验证启用 HTTPS 的服务器证书
      --cert-file string           使用此 SSL 证书文件标识 HTTPS 客户端
  -d, --destination string         chart 写入位置。如果同时指定了 untardir，则 untardir 会附加到此路径（默认 "."）
      --devel                      同时使用开发版本。等价于版本 '>0.0.0-0'。如果设置了 --version，则忽略此参数
  -h, --help                       pull 命令帮助
      --insecure-skip-tls-verify   跳过 chart 下载时的 TLS 证书验证
      --key-file string            使用此 SSL 密钥文件标识 HTTPS 客户端
      --keyring string             用于验证的公钥位置（默认 "~/.gnupg/pubring.gpg"）
      --pass-credentials           将凭据传递给所有域
      --password string            chart 仓库密码
      --plain-http                 对 chart 下载使用不安全的 HTTP 连接
      --prov                       获取出处文件，但不执行验证
      --repo string                chart 仓库 URL
      --untar                      如果设置为 true，下载后解压 chart
      --untardir string            如果指定了 untar，此参数指定 chart 解压到的目录名称（默认 "."）
      --username string            chart 仓库用户名
      --verify                     使用前验证包
      --version string             指定 chart 版本约束。可以是特定标签（如 1.1.1）或有效范围（如 ^2.0.0）。如果未指定，使用最新版本
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

* [helm](/helm/helm.md) - Kubernetes 的 Helm 包管理器。

###### 由 spf13/cobra 于 2026-01-14 自动生成
