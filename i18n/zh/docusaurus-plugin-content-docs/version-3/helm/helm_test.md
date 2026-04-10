---
title: helm test
---

执行 release 的测试

### 简介

test 命令执行 release 的测试。

该命令的参数是已部署 release 的名称。要运行的测试在已安装的 chart 中定义。


```
helm test [RELEASE] [flags]
```

### 可选项

```
      --filter strings     通过属性（当前为 "name"）使用 attribute=value 语法指定测试，或使用 '!attribute=value' 排除测试（可指定多个或用逗号分隔值：name=test1,name=test2）
  -h, --help               test 的帮助信息
      --hide-notes         如果设置，不在测试输出中显示 notes。不影响 chart 元数据中的存在
      --logs               转储测试 Pod 的日志（在所有测试完成后、清理之前运行）
      --timeout duration   等待任何单个 Kubernetes 操作的时间（如钩子的 Jobs）（默认 5m0s）
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

* [helm](/helm/helm.md) - 针对 Kubernetes 的 Helm 包管理器

###### 由 spf13/cobra 于 2026-01-14 自动生成
