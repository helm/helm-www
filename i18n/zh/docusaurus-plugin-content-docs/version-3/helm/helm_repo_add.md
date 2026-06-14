---
title: helm repo add
---

添加 chart 仓库

```
helm repo add [NAME] [URL] [flags]
```

### 可选项

```
      --allow-deprecated-repos     默认情况下，此命令不允许添加已被永久删除的官方仓库。此选项可禁用该行为
      --ca-file string             使用此 CA 包验证启用 HTTPS 的服务器的证书
      --cert-file string           使用此 SSL 证书文件标识 HTTPS 客户端
      --force-update               如果仓库已存在则替换（覆盖）
  -h, --help                       add 的帮助信息
      --insecure-skip-tls-verify   跳过仓库的 TLS 证书检查
      --key-file string            使用此 SSL 密钥文件标识 HTTPS 客户端
      --no-update                  已忽略。以前用于禁用强制更新，现已被 force-update 取代
      --pass-credentials           将凭据传递给所有域
      --password string            chart 仓库密码
      --password-stdin             从标准输入读取 chart 仓库密码
      --timeout duration           等待索引文件下载完成的时间（默认 2m0s）
      --username string            chart 仓库用户名
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

* [helm repo](/helm/helm_repo.md) - 添加、列出、删除、更新和索引 chart 仓库

###### 由 spf13/cobra 于 2026-01-14 自动生成
