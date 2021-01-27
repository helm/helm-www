---
title: "Helm高级技术"
description: "为Helm的高级用户说明各种高级特性"
weight: 9
---

这部分解释说明了使用Helm的各种高级特性和技术。
这部分旨在为Helm的高级用户提供高度自定义和操作chart及发布的信息。每个高级特性都会有它自己的权衡利弊，
因此每个使用它们的都要有Helm的深度知识并小心使用。或者换言之，
谨记 [Peter Parker 原则](https://en.wikipedia.org/wiki/With_great_power_comes_great_responsibility)

## 后置渲染
后置渲染允许在通过Helm安装chart之前手动使用、配置或者验证渲染的manifest。
这允许有高级配置需求的用户可以使用诸如[`kustomize`](https://kustomize.io) 来配置更改而不需要fork一个公共
chart或要求chart维护人员为每个软件指定每个最新的配置项。 
这里同样有一些示例用来在企业环境中注入常用工具和sidecar或者在部署前对manifest进行分析。

### 前提条件
- Helm 3.1+

### 使用
后置渲染器是在STDIN能够接受渲染后的Kubernetes manifest并能在STDOUT返回有效的Kubernetes manifest，
可以是任意可执行文件。它应该在出现失败事件时返回非0退出码。这是两个组件之间的唯一API。允许在你的后置渲染过程中有很好的灵活性。

后置渲染器可以和`install`、`upgrade`以及`template`一起使用。使用后置渲染器时，使用`--post-renderer` 
参数并指定要使用的渲染器可执行文件的路径：

```shell
$ helm install mychart stable/wordpress --post-renderer ./path/to/executable
```

如果路径中不包含任何分隔符，就会在$PATH中搜索，否则就会把相对路径转换成全路径。

如果需要使用多个后置渲染器，在一个脚本中调用它们，或者在构建任何二进制工具时调用它们。
在bash中，就像 `renderer1 | renderer2 | renderer3` 一样简单。

你可以在 [这里](https://github.com/thomastaylor312/advanced-helm-demos/tree/master/post-render) 
查看作为一个后置渲染器使用 `kustomize` 的示例。

### 警告
在使用后置渲染器时，以下这些事需要注意：使用后置渲染器时最重要的是，
所有人在修改版本时**必须** 使用同样的渲染器来保证可重复的构建。
这个功能是专门为允许任何用户切换他们正在使用或停止使用的渲染器而构建的， 但是这个应该谨慎操作，以避免意外修改或数据丢失。

另一个重要的注意事项就是安全，如果您正在使用一个后置渲染器，要保证它来自一个可信源（对于其他任意可执行文件也是如此）。
不推荐使用不可靠的或者未核实的可访问所有渲染器模板的渲染器，渲染器模板经常会包含隐私数据。

### 自定义后置渲染
使用Go SDK时后置渲染器甚至可以提供更多的灵活性。任意后置渲染器只需要执行下面的Go接口：

```go
type PostRenderer interface {
    // Run expects a single buffer filled with Helm rendered manifests. It
    // expects the modified results to be returned on a separate buffer or an
    // error if there was an issue or failure while running the post render step
    Run(renderedManifests *bytes.Buffer) (modifiedManifests *bytes.Buffer, err error)
}
```

有关Go SDK的更多信息，请查看 [Go SDK 部分](#go-sdk)

## Go SDK
Helm 3 首次发布了完全重组的Go SDK，以便在构建利用Helm的软件和工具时有更好的体验。完整的文档可以在 [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3) 查看，下面将要简要介绍一些常用的软件包和一个简单的示例。

### 包概览
对每个最常用的包的简要说明列表：

- `pkg/action`: 包含执行Helm操作的主要客户端。和CLI处理过程中使用的是同一个包。如果你仅仅需要执行来自另一个Go程序的最基本的Helm命令，这个包会很适合你
- `pkg/{chart,chartutil}`: 加载和控制chart时使用的方法和帮助内容
- `pkg/cli` 和它的子包： 包含标准Helm环境变量所有的处理程序以及子包涵盖了输出和正在处理的value文件
- `pkg/release`: 定义了 `Release` 对象和状态值

显然除了这些还有更多的包，查看SDK文档获取更多内容！

### 简要示例
这是一个使用Go SDK的 `helm list` 的简单示例：

```go
package main

import (
    "log"
    "os"

    "helm.sh/helm/v3/pkg/action"
    "helm.sh/helm/v3/pkg/cli"
)

func main() {
    settings := cli.New()

    actionConfig := new(action.Configuration)
    // You can pass an empty string instead of settings.Namespace() to list
    // all namespaces
    if err := actionConfig.Init(settings.RESTClientGetter(), settings.Namespace(), os.Getenv("HELM_DRIVER"), log.Printf); err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    client := action.NewList(actionConfig)
    // Only list deployed
    client.Deployed = true
    results, err := client.Run()
    if err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    for _, rel := range results {
        log.Printf("%+v", rel)
    }
}

```

## 后端存储

Helm 3 改变了存储命名空间版本秘钥的默认版本信息。Helm 2 默认将版本信息作为ConfigMap存储在命名空间的Tiller实例中。
下面小节部分会演示如果配置不同的后端。配置是基于 `HELM_DRIVER` 环境变量。它会被设置成这几个值其中之一：`[configmap, secret, sql]`。

### ConfigMap 后端存储

要使ConfigMap 后端生效， 你需要在 `configmap` 设置环境变量 `HELM_DRIVER`。

你可以在shell中类似下面这样设置：

```shell
export HELM_DRIVER=configmap
```

如果你想从默认后端切到ConfigMap后端，你必须自己进行迁移。你可以使用以下命令找回版本信息：

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```

**产品说明**: 发布信息包含chart和values文件的内容，因此可能包含敏感数据（比如密码，私钥，和其他认证）需要防止未经授权访问。 管理Kubernetes授权时使用 [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)， 当限制访问私密资源是，它可能会授予ConfigMap 资源广泛的访问权限。对于实例，默认的 [面向用户角色](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles) “视图” 授予大多数资源的访问权限，但是不允许访问私密数据。此外，私密数据会针对于 [加密存储](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/) 进行配置。切换到ConfigMap后端时要记得这一点，因为它可能会暴露你应用程序的敏感数据。

### SQL 后台存储

这是个 ***beta*** 版SQL存储后端，在SQL数据库中存储了版本信息。

如果你的版本信息内容超过1MB这种存储后端会特别有用（在这种场景中，它无法存储在ConfigMaps/Secrets中，因为Kubernetes内部的etcd key-value存储有限制。

要启用SQL后端，你需要部署SQL数据库并设置环境变量`HELM_DRIVER`到`sql`。DB的细节用环境变量`HELM_DRIVER_SQL_CONNECTION_STRING`设置。

你可以在shell中设置如下：

```shell
export HELM_DRIVER=sql
export HELM_DRIVER_SQL_CONNECTION_STRING=postgresql://helm-postgres:5432/helm?user=helm&password=changeme
```

> 注意：目前只支持PostgreSQL。

**产品说明**: 建议如下：

- 确保你的数据库产品可以使用。对于PostgreSQL，请参考
[Server Administration](https://www.postgresql.org/docs/12/admin.html) 文档了解更多细节内容
- 为版本信息启用 [权限管理](https://helm.sh/zh/docs/topics/permissions_sql_storage_backend/)镜像到
Kubernetes RBAC

如果你想从默认后端切到SQL后端，你必须自己完成迁移，你可以使用以下命令找回版本信息：

```shell
kubectl get secret --all-namespaces -l "owner=helm"
```
