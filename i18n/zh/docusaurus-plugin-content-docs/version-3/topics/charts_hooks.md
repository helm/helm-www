---
title: Chart 钩子
description: 描述如何使用 chart 钩子。
sidebar_position: 2
---

Helm 提供了钩子（hook）机制，允许 chart 开发者在 release 生命周期的特定节点进行干预。例如，你可以使用钩子来：

- 在安装过程中，于其他 chart 加载之前先加载一个 ConfigMap 或 Secret。
- 在安装新 chart 之前执行一个 Job 来备份数据库，然后在升级完成后执行另一个 Job 来恢复数据。
- 在删除 release 之前执行一个 Job，以便优雅地将服务从轮转中移除。

钩子的工作方式与普通模板类似，但它们带有特殊的注解，使 Helm 以不同方式处理它们。本节介绍钩子的基本使用模式。

## 可用的钩子

定义了以下钩子：

| 注解值           | 描述                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| `pre-install`    | 在模板渲染后、Kubernetes 中创建任何资源之前执行                                                   |
| `post-install`   | 在所有资源加载到 Kubernetes 后执行                                                               |
| `pre-delete`     | 在删除请求时、从 Kubernetes 删除任何资源之前执行                                                  |
| `post-delete`    | 在删除请求时、release 的所有资源已删除后执行                                                      |
| `pre-upgrade`    | 在升级请求时、模板渲染后、任何资源更新之前执行                                                     |
| `post-upgrade`   | 在升级请求时、所有资源升级完成后执行                                                              |
| `pre-rollback`   | 在回滚请求时、模板渲染后、任何资源回滚之前执行                                                     |
| `post-rollback`  | 在回滚请求时、所有资源修改完成后执行                                                              |
| `test`           | 在调用 Helm test 子命令时执行（[查看 test 文档](/zh/docs/topics/chart_tests/)）                   |

_注意：`crd-install` 钩子已在 Helm 3 中移除，改用 `crds/` 目录。_

## 钩子和 Release 生命周期

钩子允许 chart 开发者在 release 生命周期的关键节点执行操作。例如，考虑 `helm install` 的生命周期。默认情况下，生命周期如下：

1. 用户运行 `helm install foo`
2. 调用 Helm 库的安装 API
3. 经过一些验证后，库渲染 `foo` 的模板
4. 库将生成的资源加载到 Kubernetes
5. 库将 release 对象（和其他数据）返回给客户端
6. 客户端退出

Helm 为 `install` 生命周期定义了两个钩子：`pre-install` 和 `post-install`。如果 `foo` chart 的开发者实现了这两个钩子，生命周期会变成这样：

1. 用户运行 `helm install foo`
2. 调用 Helm 库的安装 API
3. 安装 `crds/` 目录中的 CRD
4. 经过一些验证后，库渲染 `foo` 的模板
5. 库准备执行 `pre-install` 钩子（将钩子资源加载到 Kubernetes）
6. 库按权重对钩子排序（默认权重为 0），然后按资源类型排序，最后按名称升序排列
7. 库先加载权重最小的钩子（从负到正）
8. 库等待钩子进入 "Ready" 状态（CRD 除外）
9. 库将生成的资源加载到 Kubernetes。注意，如果设置了 `--wait` 参数，库会等待所有资源进入就绪状态，并且在资源就绪之前不会执行 `post-install` 钩子。
10. 库执行 `post-install` 钩子（加载钩子资源）
11. 库等待钩子进入 "Ready" 状态
12. 库将 release 对象（和其他数据）返回给客户端
13. 客户端退出

等待钩子就绪是什么意思？这取决于钩子中声明的资源类型。如果资源是 `Job` 或 `Pod` 类型，Helm 会等待它成功运行完成。如果钩子失败，release 也会失败。这是一个*阻塞操作*，因此 Helm 客户端会在 Job 运行期间暂停。

对于其他类型的资源，一旦 Kubernetes 将资源标记为已加载（已添加或已更新），该资源就被视为 "Ready"。当一个钩子中声明了多个资源时，这些资源会串行执行。如果它们有钩子权重（见下文），则按权重顺序执行。从 Helm 3.2.0 开始，具有相同权重的钩子资源会按照与普通非钩子资源相同的顺序安装。否则，执行顺序不做保证。（在 Helm 2.3.0 及之后版本中，它们按字母顺序排序。但这一行为并非强制绑定，未来可能会改变。）最佳实践是添加钩子权重，如果权重不重要则设为 `0`。

### 钩子资源不随对应 release 管理

钩子创建的资源目前不作为 release 的一部分进行跟踪或管理。一旦 Helm 确认钩子已达到就绪状态，就不再管理该钩子资源。在未来的 Helm 3 版本中可能会添加删除对应 release 时的钩子资源垃圾回收功能，因此任何不能被删除的钩子资源都应该添加注解 `helm.sh/resource-policy: keep`。

实际上，这意味着如果你在钩子中创建了资源，就不能依赖 `helm uninstall` 来删除这些资源。要销毁这些资源，你需要在钩子模板文件中[添加自定义的 `helm.sh/hook-delete-policy` 注解](#钩子删除策略)，或者[设置 Job 资源的生存时间（TTL）字段](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/)。

## 编写钩子

钩子就是在 `metadata` 部分带有特殊注解的 Kubernetes 清单文件。由于它们是模板文件，你可以使用所有常规的模板功能，包括读取 `.Values`、`.Release` 和 `.Template`。

例如，下面这个存储在 `templates/post-install-job.yaml` 中的模板，声明了一个在 `post-install` 时运行的 Job：

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}"
  labels:
    app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
    app.kubernetes.io/instance: {{ .Release.Name | quote }}
    app.kubernetes.io/version: {{ .Chart.AppVersion }}
    helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
  annotations:
    # This is what defines this resource as a hook. Without this line, the
    # job is considered part of the release.
    "helm.sh/hook": post-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    metadata:
      name: "{{ .Release.Name }}"
      labels:
        app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
        app.kubernetes.io/instance: {{ .Release.Name | quote }}
        helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
    spec:
      restartPolicy: Never
      containers:
      - name: post-install-job
        image: "alpine:3.3"
        command: ["/bin/sleep","{{ default "10" .Values.sleepyTime }}"]

```

使这个模板成为钩子的是以下注解：

```yaml
annotations:
  "helm.sh/hook": post-install
```

一个资源可以实现多个钩子：

```yaml
annotations:
  "helm.sh/hook": post-install,post-upgrade
```

同样，实现某个钩子的资源数量也没有限制。例如，可以同时将一个 Secret 和一个 ConfigMap 声明为 pre-install 钩子。

当子 chart 声明钩子时，这些钩子也会被执行。顶级 chart 无法禁用子 chart 声明的钩子。

可以为钩子定义权重，以帮助建立确定性的执行顺序。权重使用以下注解定义：

```yaml
annotations:
  "helm.sh/hook-weight": "5"
```

钩子权重可以是正数或负数，但必须以字符串形式表示。当 Helm 开始执行特定类型的钩子时，会按升序对这些钩子进行排序。

### 钩子删除策略

可以定义策略来决定何时删除对应的钩子资源。钩子删除策略使用以下注解定义：

```yaml
annotations:
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

你可以选择一个或多个已定义的注解值：

| 注解值                 | 描述                                            |
| ---------------------- | ----------------------------------------------- |
| `before-hook-creation` | 在启动新钩子之前删除之前的资源（默认）             |
| `hook-succeeded`       | 在钩子成功执行后删除资源                          |
| `hook-failed`          | 如果钩子执行失败，删除资源                        |

如果未指定钩子删除策略注解，则默认使用 `before-hook-creation` 行为。
