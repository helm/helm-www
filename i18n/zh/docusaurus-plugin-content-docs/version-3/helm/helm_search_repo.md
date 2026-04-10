---
title: helm search repo
---

使用关键字搜索仓库中的 chart

### 简介

该命令会读取系统上配置的所有仓库，并查找匹配项。搜索基于系统中存储的仓库元数据。

该命令会显示找到的 chart 的最新稳定版本。如果指定了 `--devel` 参数，输出会包含预发布版本。如果要使用版本约束进行搜索，请使用 `--version`。

示例：

    # 搜索与关键字 "nginx" 匹配的稳定发布版本
    $ helm search repo nginx

    # 搜索与关键字 "nginx" 匹配的发布版本，包括预发布版本
    $ helm search repo nginx --devel

    # 搜索 nginx-ingress 主版本号为 1 的最新稳定版本
    $ helm search repo nginx-ingress --version ^1.0.0

仓库使用 `helm repo` 命令管理。


```
helm search repo [keyword] [flags]
```

### 可选项

```
      --devel                同时使用开发版本（alpha、beta 和候选发布版本）。等同于 version '>0.0.0-0'。如果设置了 --version，则忽略此项
      --fail-on-no-result    如果没有搜索结果则返回失败
  -h, --help                 repo 的帮助信息
      --max-col-width uint   输出表格的最大列宽（默认 50）
  -o, --output format        以指定格式输出。允许的值：table、json、yaml（默认 table）
  -r, --regexp               使用正则表达式搜索已添加的仓库
      --version string       在已添加的仓库中使用语义化版本约束进行搜索
  -l, --versions             在已添加的仓库中显示详细列表，每个 chart 的每个版本单独一行
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

* [helm search](/helm/helm_search.md) - 在 chart 中搜索关键字

###### 由 spf13/cobra 于 2026-01-14 自动生成
