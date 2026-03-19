---
title: helm template
---

本地渲染模板

### 简介

本地渲染 chart 模板并显示输出。

通常在集群中查找或检索到的任何值都会在本地模拟。另外，不会执行任何服务端对 chart 的有效性验证（例如检查某个 API 是否支持）。

```
helm template [NAME] [CHART] [flags]
```

### 可选项

```
  -a, --api-versions strings                       用于 Capabilities.APIVersions 的 Kubernetes api 版本
      --atomic                                     如果设置，安装过程在失败时删除已安装的内容。使用 --atomic 时会自动设置 --wait 参数
      --ca-file string                             使用此 CA 包验证启用 HTTPS 的服务器的证书
      --cert-file string                           使用此 SSL 证书文件标识 HTTPS 客户端
      --create-namespace                           如果 release namespace 不存在则创建
      --dependency-update                          如果缺少依赖项，在安装 chart 之前更新依赖项
      --description string                         添加自定义描述
      --devel                                      同时使用开发版本。等同于 version '>0.0.0-0'。如果设置了 --version，则忽略此项
      --disable-openapi-validation                 如果设置，安装过程不会根据 Kubernetes OpenAPI Schema 验证渲染的模板
      --dry-run string[="client"]                  模拟安装。如果设置 --dry-run 时未指定选项或指定为 '--dry-run=client'，则不会尝试连接集群。设置 '--dry-run=server' 允许尝试连接集群。
      --enable-dns                                 在渲染模板时启用 DNS 查询
      --force                                      通过替换策略强制更新资源
  -g, --generate-name                              生成名称（并省略 NAME 参数）
  -h, --help                                       template 的帮助信息
      --hide-notes                                 如果设置，不在安装输出中显示 notes。不影响 chart 元数据中的存在
      --include-crds                               在模板输出中包含 CRD
      --insecure-skip-tls-verify                   跳过 chart 下载的 TLS 证书检查
      --is-upgrade                                 设置 .Release.IsUpgrade 而不是 .Release.IsInstall
      --key-file string                            使用此 SSL 密钥文件标识 HTTPS 客户端
      --keyring string                             用于验证的公钥位置（默认 "~/.gnupg/pubring.gpg"）
      --kube-version string                        用于 Capabilities.KubeVersion 的 Kubernetes 版本
  -l, --labels stringToString                      将添加到 release 元数据的标签。应以逗号分隔。（默认 []）
      --name-template string                       指定用于命名 release 的模板
      --no-hooks                                   阻止在安装过程中运行 hook
      --output-dir string                          将执行的模板写入 output-dir 中的文件，而不是 stdout
      --pass-credentials                           将凭据传递给所有域
      --password string                            chart 仓库密码
      --plain-http                                 使用不安全的 HTTP 连接下载 chart
      --post-renderer postRendererString           用于后渲染的可执行文件路径。如果存在于 $PATH 中，将使用该二进制文件，否则将尝试在给定路径查找可执行文件
      --post-renderer-args postRendererArgsSlice   后渲染器的参数（可多次指定）（默认 []）
      --release-name                               在 output-dir 路径中使用 release 名称
      --render-subchart-notes                      如果设置，与父级一起渲染子 chart 的 notes
      --replace                                    重复使用给定名称，仅当该名称是仍保留在历史记录中的已删除 release 时。这在生产环境中不安全
      --repo string                                chart 仓库 URL
      --set stringArray                            在命令行上设置值（可以多次指定或用逗号分隔值：key1=val1,key2=val2）
      --set-file stringArray                       通过命令行从相应文件设置值（可以多次指定或用逗号分隔值：key1=path1,key2=path2）
      --set-json stringArray                       在命令行上设置 JSON 值（可以多次指定或用逗号分隔值：key1=jsonval1,key2=jsonval2）
      --set-literal stringArray                    在命令行上设置字面 STRING 值
      --set-string stringArray                     在命令行上设置 STRING 值（可以多次指定或用逗号分隔值：key1=val1,key2=val2）
  -s, --show-only stringArray                      仅显示从给定模板渲染的清单
      --skip-crds                                  如果设置，不会安装 CRD。默认情况下，如果 CRD 不存在则会安装
      --skip-schema-validation                     如果设置，禁用 JSON schema 验证
      --skip-tests                                 从模板输出中跳过测试
      --take-ownership                             如果设置，安装将忽略 helm 注解检查并接管现有资源的所有权
      --timeout duration                           等待任何单个 Kubernetes 操作（如 hook 的 Job）的时间（默认 5m0s）
      --username string                            chart 仓库用户名
      --validate                                   根据当前指向的 Kubernetes 集群验证清单。这与安装时执行的验证相同
  -f, --values strings                             在 YAML 文件或 URL 中指定值（可多次指定）
      --verify                                     使用前验证包
      --version string                             指定要使用的 chart 版本约束。可以是特定标签（如 1.1.1）或有效范围（如 ^2.0.0）。如果未指定，使用最新版本
      --wait                                       如果设置，将等待所有 Pod、PVC、Service 以及 Deployment、StatefulSet 或 ReplicaSet 的最小 Pod 数处于就绪状态，然后才将 release 标记为成功。等待时间与 --timeout 相同
      --wait-for-jobs                              如果设置且启用了 --wait，将等待所有 Job 完成后才将 release 标记为成功。等待时间与 --timeout 相同
```

### 从父命令继承的选项

```
      --burst-limit int                 客户端默认节流限制（默认 100）
      --debug                           启用详细输出
      --kube-apiserver string           Kubernetes API 服务器的地址和端口
      --kube-as-group stringArray       模拟操作的组，此参数可重复指定多个组
      --kube-as-user string             模拟操作的用户名
      --kube-ca-file string             Kubernetes API 服务器连接的证书颁发机构文件
      --kube-context string             要使用的 kubeconfig 上下文名称
      --kube-insecure-skip-tls-verify   如果为 true，则不会验证 Kubernetes API 服务器的证书有效性。这将使 HTTPS 连接不安全
      --kube-tls-server-name string     用于 Kubernetes API 服务器证书验证的服务器名称。如果未提供，则使用联系服务器的主机名
      --kube-token string               用于身份验证的 bearer token
      --kubeconfig string               kubeconfig 文件的路径
  -n, --namespace string                此请求的命名空间范围
      --qps float32                     与 Kubernetes API 通信时使用的每秒查询数，不包括突发
      --registry-config string          registry 配置文件的路径（默认 "~/.config/helm/registry/config.json"）
      --repository-cache string         包含缓存仓库索引的目录路径（默认 "~/.cache/helm/repository"）
      --repository-config string        包含仓库名称和 URL 的文件路径（默认 "~/.config/helm/repositories.yaml"）
```

### 请参阅

* [helm](./helm.md) - Kubernetes 的 Helm 包管理器

###### 由 spf13/cobra 于 2026-01-14 自动生成
