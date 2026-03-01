---
title: helm list
---

列举 release

### 简介

该命令列举指定 namespace 的所有 release（如果未指定 namespace，则使用当前 namespace 上下文）。

默认情况下，只列举已部署或失败的 release。使用 `--uninstalled` 和 `--all` 等参数可以更改此行为。这些参数可以组合使用：`--uninstalled --failed`。

默认情况下，列表按字母顺序排序。使用 `-d` 参数按发布日期排序。

如果使用 `--filter` 参数，它将被作为过滤器使用。过滤器是应用于 release 列表的正则表达式（Perl 兼容）。只有匹配过滤器的项目会被返回。

    $ helm list --filter 'ara[a-z]+'
    NAME                UPDATED                                  CHART
    maudlin-arachnid    2020-06-18 14:17:46.125134977 +0000 UTC  alpine-0.1.0

如果未找到结果，`helm list` 将返回退出码 0，但没有输出（或者在没有使用 `-q` 参数的情况下，只显示表头）。

默认情况下，最多返回 256 项。使用 `--max` 参数限制数量。将 `--max` 设置为 0 不会返回所有结果，而是返回服务器默认值，可能比 256 更多。配合使用 `--max` 和 `--offset` 参数可以翻页显示结果。


```
helm list [flags]
```

### 可选项

```
  -a, --all                  显示所有 release，不应用任何过滤器
  -A, --all-namespaces       列举所有 namespace 中的 release
  -d, --date                 按发布日期排序
      --deployed             显示已部署的 release。如果未指定其他参数，此选项会自动启用
      --failed               显示失败的 release
  -f, --filter string        正则表达式（Perl 兼容）。匹配该表达式的 release 将包含在结果中
  -h, --help                 list 的帮助信息
  -m, --max int              获取的最大 release 数量（默认 256）
      --no-headers           使用默认输出格式时不打印表头
      --offset int           列表中下一个 release 的索引，用于从起始值偏移
  -o, --output format        以指定格式打印输出。允许的值：table、json、yaml（默认 table）
      --pending              显示待处理的 release
  -r, --reverse              反转排序顺序
  -l, --selector string      用于过滤的选择器（标签查询），支持 '='、'==' 和 '!='（例如 -l key1=value1,key2=value2）。仅适用于 secret（默认）和 configmap 存储后端
  -q, --short                输出简短（静默）列表格式
      --superseded           显示已被取代的 release
      --time-format string   使用 golang 时间格式化程序格式化时间。示例：--time-format "2006-01-02 15:04:05Z0700"
      --uninstalled          显示已卸载的 release（如果使用了 'helm uninstall --keep-history'）
      --uninstalling         显示正在卸载中的 release
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
