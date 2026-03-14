---
title: helm create
---

使用给定名称创建新的 chart

### 简介

该命令创建 chart 目录和 chart 中常用的文件及目录。

例如，`helm create foo` 会创建如下目录结构：

```
foo/
├── .helmignore   # 打包 Helm chart 时要忽略的文件模式
├── Chart.yaml    # chart 的信息
├── values.yaml   # 模板的默认值
├── charts/       # 该 chart 依赖的 chart
└── templates/    # 模板文件
    └── tests/    # 测试文件
```

`helm create` 使用路径作为参数。如果给定路径中的目录不存在，Helm 会自动创建。如果给定目录已存在且其中有文件，冲突文件会被覆盖，其他文件保持不变。

```shell
helm create NAME [flags]
```

### 可选项

```shell
  -h, --help             create 命令帮助
  -p, --starter string   Helm starter scaffold 的名称或绝对路径
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

* [helm](/helm/helm.md) - Kubernetes 的 Helm 包管理器

###### 由 spf13/cobra 于 2026-01-14 自动生成
