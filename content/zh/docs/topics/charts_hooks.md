---
title: "Chart Hook"
description: "详述如何使用chart hook"
weight: 2
---

Helm 提供了一个 _hook_ 机制允许chart开发者在发布生命周期的某些点进行干预。比如你可以使用hook用于：

- 安装时在加载其他chart之前加载配置映射或密钥
- 安装新chart之前执行备份数据库的任务，然后在升级之后执行第二个任务用于存储数据。
- 在删除发布之前执行一个任务以便在删除服务之前退出滚动。

钩子的工作方式与常规模板类似，但因为Helm对其不同的使用方式，会有一些特殊的注释。这部分会讲述钩子的基本使用模式。

## 可用的钩子

定义了以下钩子：

| 注释值            | 描述                                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `pre-install`    | 在模板渲染之后，Kubernetes资源创建之前执行                                                               |
| `post-install`   | 在所有资源加载到Kubernetes之后执行                                                                      |
| `pre-delete`     | 在Kubernetes删除之前，执行删除请求                                                                      |
| `post-delete`    | 在所有的版本资源删除之后执行删除请求                                                                     |
| `pre-upgrade`    | 在模板渲染之后，资源更新之前执行一个升级请求                                                              |
| `post-upgrade`   | 所有资源升级之后执行一个升级请求                                                                         |
| `pre-rollback`   | 在模板渲染之后，资源回滚之前，执行一个回滚请求                                                            |
| `post-rollback`  | 在所有资源被修改之后执行一个回滚请求                                                                     |
| `test`           | 调用Helm test子命令时执行 ([test文档](https://helm.sh/zh/docs/topics/chart_tests/))                     |

_注意`crd-install`钩子已被移除以支持Helm 3的`crds/`目录。_

## 钩子和发布生命周期

钩子允许你在发布生命周期的关键节点上有机会执行操作。比如，考虑`helm install`的生命周期。默认的，生命周期看起来是这样：

1. 用户执行`helm install foo`
2. Helm库调用安装API
3. 在一些验证之后，库会渲染`foo`模板
4. 库会加载结果资源到Kubernetes
5. 库会返回发布对象（和其他数据）给客户端
6. 客户端退出

Helm 为`install`周期定义了两个钩子：`pre-install`和`post-install`。如果`foo` chart的开发者两个钩子都执行，
周期会被修改为这样：

1. 用户返回 `helm install foo`
2. Helm库调用安装API
3. 在 `crds/`目录中的CRD会被安装
4. 在一些验证之后，库会渲染`foo`模板
5. 库准备执行`pre-install`钩子(将hook资源加载到Kubernetes中)
6. 库按照权重对钩子排序(默认将权重指定为0)，然后在资源种类排序，最后按名称正序排列。
7. 库先加载最小权重的钩子(从负到正)
8. 库会等到钩子是 "Ready"状态(CRD除外)
9. 库将生成的资源加载到Kubernetes中。注意如果设置了`--wait`参数，库会等所有资源是ready状态，
   且所有资源准备就绪后才会执行`post-install`钩子。
10. 库执行`post-install`钩子(加载钩子资源)。
11. 库会等到钩子是"Ready"状态
12. 库会返回发布对象(和其他数据)给客户端
13. 客户端退出

&emsp;&emsp;等钩子准备好是什么意思？ 这取决于钩子声明的资源。如果资源是 `Job` 或 `Pod`类型，Helm会等到直到他成功运行完成。
如果钩子失败，发布就会失败。这是一个 _阻塞操作_,所以Helm客户端会在这个任务执行时暂停。

&emsp;&emsp;针对其他种类，一旦Kubernetes将资源标记为已加载(已添加或已更新)，资源会被认为是"Ready"。 当一个钩子中声明了很多资源时，
资源会串行执行。如果有钩子权重，会按照权重顺序执行。从Helm 3.2.0开始，具有相同权重的钩子资源会和普通非钩子资源以相同的顺序安装。
否则，顺序就无法保证。（Helm 2.3.0及之后，它们按照字母排序。不过该行为并不会绑定，将来可能会改变。）增加钩子权重被认为是很好的做法，
如果权重不重要，可以设置为`0`。

### 钩子资源不使用对应版本管理

钩子创建的资源无法作为发布的一部分进行跟踪和管理。一旦Helm验证hook达到ready状态，将不使用钩子资源。
当对应发布删除后，钩子资源的垃圾回收会在将来添加到Helm 3中，因此不能被删除的钩子资源应该添加注释：
`helm.sh/resource-policy: keep`。

实际上，如果你在钩子中创建了资源，不能依靠`helm uninstall`去删除资源。要删除这些资源，要么在钩子模板文件中[添加一个自定义的`helm.sh/hook-delete-policy`
注释](#hook-deletion-policies)，要么[设置任务资源的生存时间（TTL）字段](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/)。

## 编写一个钩子

钩子就是在`metadata`部分指定了特殊注释的Kubernetes清单文件。因为是模板文件，你可以使用所有的普通模板特性，包括读取 `.Values`，
`.Release`，和 `.Template`。

比如这个模板，存储在`templates/post-install-job.yaml`，声明了一个要运行在`post-install`上的任务：

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

使模板称为钩子的是注释：

```yaml
annotations:
  "helm.sh/hook": post-install
```

一个资源可以实现多个钩子：

```yaml
annotations:
  "helm.sh/hook": post-install,post-upgrade
```

类似的，执行一个给定钩子的不同资源的数量也没有限制。比如，一个pre-install钩子可以同时声明密钥和配置映射。

当子chart声明钩子时，这些也会被评估。顶级chart无法禁用子chart声明的钩子。

可以为钩子定义权重，这有助于建立一个确定性的执行顺序。权重使用以下注释定义：

```yaml
annotations:
  "helm.sh/hook-weight": "5"
```

钩子权重可以正数也可以是负数，但一定要是字符串。Helm开始执行特定种类的钩子时，会正序排列这些钩子。

### Hook deletion policies

可以定义策略来决定何时删除对应的钩子资源。钩子的删除策略使用以下注释定义：

```yaml
annotations:
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

可以选择一个或多个定义的注释值：

| 注释值                 | 描述                                                                  |
| ---------------------- | -------------------------------------------------------------------- |
| `before-hook-creation` | 新钩子启动前删除之前的资源 (默认)                                       |
| `hook-succeeded`       | 钩子成功执行之后删除资源                                               |
| `hook-failed`          | 如果钩子执行失败，删除资源                                             |

如果没有指定钩子删除策略的注释，默认使用`before-hook-creation`。
