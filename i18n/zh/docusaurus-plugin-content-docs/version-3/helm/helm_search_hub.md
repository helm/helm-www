---
title: helm search hub
---

在 Artifact Hub 或自定义 hub 实例中搜索 chart

### 简介

在 Artifact Hub 或自定义 hub 实例中搜索 Helm chart。

Artifact Hub 是一个基于 Web 的应用，支持查找、安装和发布 CNCF 项目的包和配置，包括公开发布的 Helm chart。它是 CNCF 的沙盒项目。可以访问 https://artifacthub.io/ 浏览。

[KEYWORD] 参数接受关键字字符串或带引号的富查询字符串。富查询选项的文档，请参阅
https://artifacthub.github.io/hub/api/?urls.primaryName=Monocular%20compatible%20search%20API#/Monocular/get_api_chartsvc_v1_charts_search

之前的 Helm 版本使用 Monocular 实例作为默认 `endpoint`，因此为了向后兼容，Artifact Hub 兼容 Monocular 搜索 API。类似地，设置 `endpoint` 参数时，指定的 endpoint 也必须实现兼容 Monocular 的搜索 API。
注意，指定 Monocular 实例作为 `endpoint` 时，不支持富查询。更多 API 细节，请参阅 https://github.com/helm/monocular


```
helm search hub [KEYWORD] [flags]
```

### 可选项

```
      --endpoint string      要查询 chart 的 hub 实例（默认 "https://hub.helm.sh"）
      --fail-on-no-result    如果没有搜索结果则返回失败
  -h, --help                 hub 的帮助信息
      --list-repo-url        输出 chart 仓库的 URL
      --max-col-width uint   输出表格的最大列宽（默认 50）
  -o, --output format        以指定格式输出。允许的值：table、json、yaml（默认 table）
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
