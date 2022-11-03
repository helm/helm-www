---
title: "Helm"
---

## helm

针对Kubernetes的Helm包管理器。

### 简介

Kubernetes包管理器

Helm的一般操作：

- helm search:    &emsp;&emsp;搜索chart
- helm pull:      &emsp;&emsp;&emsp;下载chart到本地目录查看
- helm install:   &emsp;&emsp;上传chart到Kubernetes
- helm list:      &emsp;&emsp;&emsp;&ensp;列出已发布的chart

环境变量：
| 名称                               | 描述                                                                             |
|------------------------------------|---------------------------------------------------------------------------------|
| $HELM_CACHE_HOME                   | 设置一个存储缓存文件的可选位置                                                     |
| $HELM_CONFIG_HOME                  | 设置一个存储Helm配置的可选位置                                                     |
| $HELM_DATA_HOME                    | 设置一个存储Helm数据的可选位置                                                     |
| $HELM_DEBUG                        | 表示Helm是否在Debug模式系运行                                                     |
| $HELM_DRIVER                       | 设置后台存储驱动，可选值包括：configmap, secret, memory, sql                           |
| $HELM_DRIVER_SQL_CONNECTION_STRING | 设置SQL存储驱动使用连接字符串                                                      |
| $HELM_MAX_HISTORY                  | 设置发布历史记录的最大值                                                           |
| $HELM_NAMESPACE                    | 设置用于helm操作的命名空间                                                         |
| $HELM_NO_PLUGINS                   | 禁用插件，HELM_NO_PLUGINS=1 表示禁用插件                                           |
| $HELM_PLUGINS                      | 设置插件目录路径                                                                  |
| $HELM_REGISTRY_CONFIG              | 设置注册配置文件的路径                                                             |
| $HELM_REPOSITORY_CACHE             | 设置仓库缓存目录路径                                                               |
| $HELM_REPOSITORY_CONFIG            | 设置仓库文件的路径                                                                 |
| $KUBECONFIG                        | 设置Kubernetes的可选配置文件(默认是"~/.kube/config")                               |
| $HELM_KUBEAPISERVER                | 设置用于身份认证的Kubernetes API服务端                                             |
| $HELM_KUBECAFILE                   | 设置Kubernetes证书机构文件                                                         |
| $HELM_KUBEASGROUPS                 | 使用逗号分隔的列表设置用于模拟的组                                                   |
| $HELM_KUBEASUSER                   | 为操作设置要模拟的用户名                                                            |
| $HELM_KUBECONTEXT                  | 设置kubeconfig上下文的名称                                                         |
| $HELM_KUBETOKEN                    | 设置用于身份验证的不记名KubeToken                                                   |
| $HELM_KUBEINSECURE_SKIP_TLS_VERIFY | 设置 Kubernetes API 服务的证书验证是否跳过（不安全）                             |
| $HELM_KUBETLS_SERVER_NAME          | 设置用于验证 Kubernetes API 服务器证书的服务器名称                                      |
| $HELM_BURST_LIMIT                  | 设置当 kubernetes 服务包含很大量CRD时的默认上限值（默认100, -1是不可用）                           |

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
      --registry-config string          path to the registry config file (default "~/.config/helm/registry/config.json")
      --repository-cache string         path to the file containing cached repository indexes (default "~/.cache/helm/repository")
      --repository-config string        path to the file containing repository names and URLs (default "~/.config/helm/repositories.yaml")
```

### 另请参阅

- [helm completion](helm_completion.md) - 为指定的shell生成自动补全脚本
- [helm create](helm_create.md) - 使用给定的名称创建chart
- [helm dependency](helm_dependency.md) - 管理chart依赖
- [helm env](helm_env.md) - helm客户端环境信息
- [helm get](helm_get.md) - 下载命名版本的扩展信息
- [helm history](helm_history.md) - 检索发布历史
- [helm install](helm_install.md) - 安装chart
- [helm lint](helm_lint.md) - 验证chart是否存在问题
- [helm list](helm_list.md) - 列举发布版本
- [helm package](helm_package.md) - 将chart目录打包
- [helm plugin](helm_plugin.md) - 安装、列举或卸载Helm插件
- [helm pull](helm_pull.md) - 从仓库下载chart并（可选）在本地目录中打开
- [helm push](helm_push.md) - 推送chart到远程
- [helm registry](helm_registry.md) - 从注册表登录或登出
- [helm repo](helm_repo.md) - 添加、列出、删除、更新和索引chart仓库
- [helm rollback](helm_rollback.md) - 回滚发布到上一个版本
- [helm search](helm_search.md) - helm中搜索关键字
- [helm show](helm_show.md) - 显示chart信息
- [helm status](helm_status.md) - 显示命名版本的状态
- [helm template](helm_template.md) - 本地渲染模板
- [helm test](helm_test.md) - 执行发布的测试
- [helm uninstall](helm_uninstall.md) - 卸载版本
- [helm upgrade](helm_upgrade.md) - 升级版本
- [helm verify](helm_verify.md) - 验证给定路径的chart已经被签名且是合法的
- [helm version](helm_version.md) - 打印客户端版本信息
