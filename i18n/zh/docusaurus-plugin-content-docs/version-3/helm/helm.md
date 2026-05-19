---
title: helm
slug: helm
---

针对 Kubernetes 的 Helm 包管理器。

### 简介

Kubernetes 包管理器

Helm 常用操作：

- helm search:    搜索 chart
- helm pull:      下载 chart 到本地目录查看
- helm install:   安装 chart 到 Kubernetes
- helm list:      列出 release

环境变量：
| 名称                               | 描述                                                                             |
|------------------------------------|---------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | 设置一个存储缓存文件的可选位置                                                     |
| $HELM_CONFIG_HOME                  | 设置一个存储Helm配置的可选位置                                                     |
| $HELM_DATA_HOME                    | 设置一个存储Helm数据的可选位置                                                     |
| $HELM_DEBUG                        | 表示Helm是否在Debug模式下运行                                                     |
| $HELM_DRIVER                       | 设置后台存储驱动，可选值包括：configmap、secret、memory、sql                           |
| $HELM_DRIVER_SQL_CONNECTION_STRING | 设置 SQL 存储驱动使用的连接字符串                                                      |
| $HELM_MAX_HISTORY                  | 设置 release 历史记录的最大数量                                                           |
| $HELM_NAMESPACE                    | 设置用于helm操作的命名空间                                                         |
| $HELM_NO_PLUGINS                   | 禁用插件，HELM_NO_PLUGINS=1 表示禁用插件                                           |
| $HELM_PLUGINS                      | 设置插件目录路径                                                                  |
| $HELM_REGISTRY_CONFIG              | 设置注册配置文件的路径                                                             |
| $HELM_REPOSITORY_CACHE             | 设置仓库缓存目录路径                                                               |
| $HELM_REPOSITORY_CONFIG            | 设置仓库文件的路径                                                                 |
| $KUBECONFIG                        | 设置 Kubernetes 的备用配置文件（默认 "~/.kube/config"）                               |
| $HELM_KUBEAPISERVER                | 设置用于身份认证的Kubernetes API服务端                                             |
| $HELM_KUBECAFILE                   | 设置Kubernetes证书机构文件                                                         |
| $HELM_KUBEASGROUPS                 | 使用逗号分隔的列表设置用于模拟的组                                                   |
| $HELM_KUBEASUSER                   | 为操作设置要模拟的用户名                                                            |
| $HELM_KUBECONTEXT                  | 设置kubeconfig上下文的名称                                                         |
| $HELM_KUBETOKEN                    | 设置用于身份验证的 Bearer KubeToken                                                   |
| $HELM_KUBEINSECURE_SKIP_TLS_VERIFY | 设置 Kubernetes API 服务的证书验证是否跳过（不安全）                             |
| $HELM_KUBETLS_SERVER_NAME          | 设置用于验证 Kubernetes API 服务器证书的服务器名称                                      |
| $HELM_BURST_LIMIT                  | 设置当 Kubernetes 服务包含大量 CRD 时的默认突发上限值（默认 100，-1 表示禁用）                           |
| $HELM_QPS                          | 设置当高频调用超出较高突发限制时的每秒查询数                                        |

Helm 基于以下配置顺序存储缓存，配置和添加数据：

- 如果设置了 HELM_*_HOME 环境变量，则使用该变量
- 否则，在支持XDG基本目录规范的系统上，会使用XDG变量
- 当没有设置其他位置时，将根据操作系统使用默认位置

默认情况下，默认目录取决于操作系统，默认值如下：

| 操作系统          | 缓存路径                  | 配置路径                        | 数据路径               |
|------------------|---------------------------|--------------------------------|-------------------------|
| Linux            | $HOME/.cache/helm         | $HOME/.config/helm             | $HOME/.local/share/helm |
| macOS            | $HOME/Library/Caches/helm | $HOME/Library/Preferences/helm | $HOME/Library/helm      |
| Windows          | %TEMP%\helm               | %APPDATA%\helm                 | %APPDATA%\helm          |

### 可选项

```shell
      --burst-limit int                 client-side default throttling limit (default 100)
      --debug                           enable verbose output
  -h, --help                            help for helm
      --kube-apiserver string           the address and the port for the Kubernetes API server
      --kube-as-group stringArray       group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --kube-as-user string             username to impersonate for the operation
      --kube-ca-file string             the certificate authority file for the Kubernetes API server connection
      --kube-context string             name of the kubeconfig context to use
      --kube-insecure-skip-tls-verify   if true, the Kubernetes API server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kube-tls-server-name string     server name to use for Kubernetes API server certificate validation. If it is not provided, the hostname used to contact the server is used
      --kube-token string               bearer token used for authentication
      --kubeconfig string               path to the kubeconfig file
  -n, --namespace string                namespace scope for this request
      --qps float32                     queries per second used when communicating with the Kubernetes API, not including bursting
      --registry-config string          path to the registry config file (default "~/.config/helm/registry/config.json")
      --repository-cache string         path to the directory containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string        path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### 另请参阅

- [helm completion](/helm/helm_completion.md) - 为指定的 shell 生成自动补全脚本
- [helm create](/helm/helm_create.md) - 使用给定的名称创建 chart
- [helm dependency](/helm/helm_dependency.md) - 管理 chart 依赖
- [helm env](/helm/helm_env.md) - Helm 客户端环境信息
- [helm get](/helm/helm_get.md) - 下载指定 release 的扩展信息
- [helm history](/helm/helm_history.md) - 获取 release 历史
- [helm install](/helm/helm_install.md) - 安装 chart
- [helm lint](/helm/helm_lint.md) - 验证 chart 是否存在问题
- [helm list](/helm/helm_list.md) - 列出 release
- [helm package](/helm/helm_package.md) - 将 chart 目录打包
- [helm plugin](/helm/helm_plugin.md) - 安装、列举或卸载 Helm 插件
- [helm pull](/helm/helm_pull.md) - 从仓库下载 chart 并（可选）在本地目录中打开
- [helm push](/helm/helm_push.md) - 推送 chart 到远程
- [helm registry](/helm/helm_registry.md) - 登录或登出 registry
- [helm repo](/helm/helm_repo.md) - 添加、列出、删除、更新和索引 chart 仓库
- [helm rollback](/helm/helm_rollback.md) - 将 release 回滚到上一个版本
- [helm search](/helm/helm_search.md) - 在 chart 中搜索关键字
- [helm show](/helm/helm_show.md) - 显示 chart 信息
- [helm status](/helm/helm_status.md) - 显示指定 release 的状态
- [helm template](/helm/helm_template.md) - 本地渲染模板
- [helm test](/helm/helm_test.md) - 运行 release 的测试
- [helm uninstall](/helm/helm_uninstall.md) - 卸载 release
- [helm upgrade](/helm/helm_upgrade.md) - 升级 release
- [helm verify](/helm/helm_verify.md) - 验证给定路径的 chart 已经被签名且是合法的
- [helm version](/helm/helm_version.md) - 打印客户端版本信息

###### 由 spf13/cobra 于 2026-01-14 自动生成
