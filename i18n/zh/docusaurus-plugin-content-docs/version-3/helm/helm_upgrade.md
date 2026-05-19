---
title: helm upgrade
---

升级 release 版本

### 简介

该命令将 release 升级到新版本的 chart。

升级参数必须是 release 和 chart。chart 参数可以是：chart 引用（'example/mariadb'）、chart 目录路径、打包的 chart 或者完整的 URL。对于 chart 引用，除非使用 '--version' 参数指定，否则会使用最新版本。

要覆盖 chart 中的 values，使用 '--values' 参数传递一个文件，或者使用 '--set' 参数从命令行传递配置，要强制使用字符串值，使用 '--set-string'。当值本身对于命令行太长或者是动态生成的时候，可以使用 '--set-file' 设置单独的值。也可以在命令行使用 '--set-json' 参数设置 JSON 值（scalars/objects/arrays）。

可以多次指定 '--values'/'-f' 参数。最后（最右边）指定的文件优先级最高。例如，如果 myvalues.yaml 和 override.yaml 同时包含了名为 'Test' 的 key，override.yaml 中的值会优先使用：

    $ helm upgrade -f myvalues.yaml -f override.yaml redis ./redis

可以多次指定 '--set' 参数。最后（最右边）指定的优先级最高。例如，如果 'bar' 和 'newbar' 都设置了名为 'foo' 的 key，'newbar' 的值会优先使用：

    $ helm upgrade --set foo=bar --set foo=newbar redis ./redis

你也可以使用此命令通过 '--reuse-values' 参数更新现有 release 的 values。'RELEASE' 和 'CHART' 参数应设置为原始参数，现有的 values 会与通过 '--values'/'-f' 或 '--set' 参数设置的任何值合并。新值优先。

    $ helm upgrade --reuse-values --set foo=bar --set foo=newbar redis ./redis

--dry-run 参数会输出所有生成的 chart 清单，包括可能包含敏感值的 Secret。要隐藏 Kubernetes Secret，请使用 --hide-secret 参数。请仔细考虑如何以及何时使用这些参数。


```
helm upgrade [RELEASE] [CHART] [flags]
```

### 可选项

```
      --atomic                                     如果设置，升级过程在失败时回滚所做的更改。使用 --atomic 时会自动设置 --wait 参数
      --ca-file string                             使用此 CA 包验证启用 HTTPS 的服务器的证书
      --cert-file string                           使用此 SSL 证书文件标识 HTTPS 客户端
      --cleanup-on-fail                            允许在升级失败时删除此次升级中创建的新资源
      --create-namespace                           如果设置了 --install，当 release namespace 不存在时创建它
      --dependency-update                          如果缺少依赖项，在安装 chart 之前更新依赖项
      --description string                         添加自定义描述
      --devel                                      同时使用开发版本。等同于 version '>0.0.0-0'。如果设置了 --version，则忽略此项
      --disable-openapi-validation                 如果设置，升级过程不会根据 Kubernetes OpenAPI Schema 验证渲染的模板
      --dry-run string[="client"]                  模拟升级。如果设置 --dry-run 时未指定选项或指定为 '--dry-run=client'，则不会尝试连接集群。设置 '--dry-run=server' 允许尝试连接集群。
      --enable-dns                                 在渲染模板时启用 DNS 查询
      --force                                      通过替换策略强制更新资源
  -h, --help                                       upgrade 的帮助信息
      --hide-notes                                 如果设置，不在升级输出中显示 notes。不影响 chart 元数据中的存在
      --hide-secret                                同时使用 --dry-run 参数时隐藏 Kubernetes Secret
      --history-max int                            限制每个 release 保存的最大修订版本数。使用 0 表示无限制（默认 10）
      --insecure-skip-tls-verify                   跳过 chart 下载的 TLS 证书检查
  -i, --install                                    如果不存在同名的 release，则运行安装
      --key-file string                            使用此 SSL 密钥文件标识 HTTPS 客户端
      --keyring string                             用于验证的公钥位置（默认 "~/.gnupg/pubring.gpg"）
  -l, --labels stringToString                      将添加到 release 元数据的标签。应以逗号分隔。原始 release 标签将与升级标签合并。可以使用 null 取消标签设置。（默认 []）
      --no-hooks                                   禁用升级前/后的钩子
  -o, --output format                              以指定格式打印输出。允许的值：table、json、yaml（默认 table）
      --pass-credentials                           将凭据传递给所有域
      --password string                            chart 仓库密码
      --plain-http                                 对 chart 下载使用不安全的 HTTP 连接
      --post-renderer postRendererString           用于后渲染的可执行文件路径。如果它存在于 $PATH 中，将使用该二进制文件，否则将尝试在给定路径查找可执行文件
      --post-renderer-args postRendererArgsSlice   传递给后渲染器的参数（可指定多个）（默认 []）
      --render-subchart-notes                      如果设置，与父 chart 一起渲染子 chart 的 notes
      --repo string                                chart 仓库 URL
      --reset-then-reuse-values                    升级时，将 values 重置为 chart 内置的值，应用上一次 release 的值，并通过命令行的 --set 和 -f 合并任何覆盖值。如果指定了 '--reset-values' 或 '--reuse-values'，则忽略此项
      --reset-values                               升级时，将 values 重置为 chart 内置的值
      --reuse-values                               升级时，重用上一次 release 的 values，并通过命令行的 --set 和 -f 合并任何覆盖值。如果指定了 '--reset-values'，则忽略此项
      --set stringArray                            在命令行设置 values（可以指定多个或用逗号分隔值：key1=val1,key2=val2）
      --set-file stringArray                       通过命令行从相应文件设置 values（可以指定多个或用逗号分隔值：key1=path1,key2=path2）
      --set-json stringArray                       在命令行设置 JSON values（可以指定多个或用逗号分隔值：key1=jsonval1,key2=jsonval2）
      --set-literal stringArray                    在命令行设置字面 STRING 值
      --set-string stringArray                     在命令行设置 STRING values（可以指定多个或用逗号分隔值：key1=val1,key2=val2）
      --skip-crds                                  如果设置，当启用 install 参数执行升级时不会安装 CRD。默认情况下，当启用 install 参数执行升级时，如果 CRD 不存在则会安装
      --skip-schema-validation                     如果设置，禁用 JSON schema 验证
      --take-ownership                             如果设置，升级将忽略 helm 注解检查并接管现有资源的所有权
      --timeout duration                           等待任何单个 Kubernetes 操作的时间（如钩子的 Jobs）（默认 5m0s）
      --username string                            chart 仓库用户名
  -f, --values strings                             在 YAML 文件或 URL 中指定 values（可指定多个）
      --verify                                     使用前验证包
      --version string                             指定要使用的 chart 版本约束。此约束可以是特定标签（如 1.1.1）或引用有效范围（如 ^2.0.0）。如果未指定，则使用最新版本
      --wait                                       如果设置，将等待所有 Pod、PVC、Service 以及 Deployment、StatefulSet 或 ReplicaSet 的最小 Pod 数处于就绪状态后才将 release 标记为成功。等待时间与 --timeout 一致
      --wait-for-jobs                              如果设置且启用了 --wait，将等待所有 Job 完成后才将 release 标记为成功。等待时间与 --timeout 一致
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
