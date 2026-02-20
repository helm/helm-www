---
title: helm repo index
---

基于包含打包 chart 的目录生成索引文件

### 简介

读取当前目录，根据找到的 chart 生成索引文件，并将结果写入当前目录下的 'index.yaml' 文件。

这个工具用于为 chart 仓库创建 'index.yaml' 文件。使用 `--url` 参数可设置 chart 的绝对 URL。

要将生成的索引与已有索引文件合并，使用 `--merge` 参数。此时，当前目录中找到的 chart 会合并到 `--merge` 指定的索引文件中，本地 chart 优先于已有 chart。

```
helm repo index [DIR] [flags]
```

### 可选项

```
  -h, --help           index 的帮助信息
      --json           以 JSON 格式输出
      --merge string   将生成的索引合并到指定的索引文件
      --url string     chart 仓库的 URL
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
