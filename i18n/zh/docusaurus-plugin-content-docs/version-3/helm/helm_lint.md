---
title: helm lint
---

检查 chart 是否存在问题

### 简介

该命令使用一个 chart 路径并运行一系列测试来验证 chart 的格式是否正确。

如果 linter 遇到会导致 chart 安装失败的情况，会输出 [ERROR] 信息。如果遇到违反惯例或建议的问题，会输出 [WARNING] 信息。


```
helm lint PATH [flags]
```

### 可选项

```
  -h, --help                      lint 的帮助信息
      --kube-version string       用于能力检测和弃用检查的 Kubernetes 版本
      --quiet                     仅打印警告和错误
      --set stringArray           在命令行上设置值（可以指定多个或用逗号分隔值：key1=val1,key2=val2）
      --set-file stringArray      通过命令行从相应文件设置值（可以指定多个或用逗号分隔值：key1=path1,key2=path2）
      --set-json stringArray      在命令行上设置 JSON 值（可以指定多个或用逗号分隔值：key1=jsonval1,key2=jsonval2）
      --set-literal stringArray   在命令行上设置字面 STRING 值
      --set-string stringArray    在命令行上设置 STRING 值（可以指定多个或用逗号分隔值：key1=val1,key2=val2）
      --skip-schema-validation    如果设置，禁用 JSON schema 验证
      --strict                    将 lint 警告视为失败
  -f, --values strings            指定 YAML 文件或 URL 中的值（可以指定多个）
      --with-subcharts            对依赖的 chart 进行 lint
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
