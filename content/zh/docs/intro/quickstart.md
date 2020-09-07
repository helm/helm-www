---
title: "快速入门指南"
description: "如何安装和开始使用Helm，包括Helm的介绍、FAQs和Helm plugins"
weight: 1
---

本指南介绍如何快速开始使用Helm。

## Prerequisites

想成功和正确地使用Helm，需要以下前置条件。

1. 一个 Kubernetes 集群
2. Deciding what security configurations to apply to your installation, if any
3. 安装和配置Helm。

### 安装或者使用现有的Kubernetes集群

- 使用Helm，需要一个Kubernetes集群。对于Helm的最新版本，我们建议使用Kubernetes的最新稳定版，
  在大多数情况下，它是倒数第二个minor release。
- 您也应该有一个本地的 `kubectl`.

查看Helm和对应支持的Kubernetes版本，您可以参考 [Helm 版本支持策略](https://helm.sh/docs/topics/version_skew/) 

## 安装

您可以通过 `homebrew` 下载二进制Helm client安装包，也可以通过github下载 [github 官方发布页面](https://github.com/helm/helm/releases)

除此之外的更多安装方式详见 [安装指南]({{< ref "install.md" >}}).

## 初始化 Helm Chart 仓库

当您已经安装好了Helm之后，您可以添加一个chart 仓库。 一个常见的选择是添加Helm的官方仓库：

```console
$ helm repo add stable https://kubernetes-charts.storage.googleapis.com/
```

当添加完成，您将可以看到可以被您安装的charts列表：

```console
$ helm search repo stable
NAME                                    CHART VERSION   APP VERSION                     DESCRIPTION
stable/acs-engine-autoscaler            2.2.2           2.1.1                           DEPRECATED Scales worker nodes within agent pools
stable/aerospike                        0.2.8           v4.5.0.5                        A Helm chart for Aerospike in Kubernetes
stable/airflow                          4.1.0           1.10.4                          Airflow is a platform to programmatically autho...
stable/ambassador                       4.1.0           0.81.0                          A Helm chart for Datawire Ambassador
# ... and many more
```

## 安装示例Chart

您可以通过`helm install` 命令安装chart。 Helm可以通过多种途径查找和安装chart，
但最简单的是安装官方的`stable` charts。

```console
$ helm repo update              # 确定我们可以拿到最新的charts列表
$ helm install stable/mysql --generate-name
Released smiling-penguin
```

在上面的例子中，`stable/mysql`这个chart被release，名字是 `smiling-penguin`

您可以通过执行 `helm show  chart stable/mysql` 命令简单的了解到这个chart的基本信息。
或者您可以执行 `helm show all stable/mysql` 获取关于该chart的所有信息。

每当您执行 `helm install` 的时候，都会创建一个新的release。 
所以一个chart在同一个集群里面可以被安装多次，每一个都可以被独立的管理和升级。

`helm install` 是一个拥有很多能力的强大的命令，更多信息详见 [使用 Helm]({{< ref "using_helm.md">}})

## 关于Releases

通过Helm您可以很容易看到哪些chart被release了：

```console
$ helm ls
NAME             VERSION   UPDATED                   STATUS    CHART
smiling-penguin  1         Wed Sep 28 12:59:46 2016  DEPLOYED  mysql-0.1.0
```

`helm list` 命令会列出所有被部署的releases。

## 卸载一个Release

您可以使用`helm uninstall` 命令卸载你的release

```console
$ helm uninstall smiling-penguin
Removed smiling-penguin
```

该命令会从Kubernetes卸载 `smiling-penguin`， 它将删除和该release相关的所有相关资源（service、deployment、pod等等）甚至release history。

如果您在执行 `helm uninstall` 的时候提供 `--keep-history` 选项， Helm将会保存release history。
您可以通过命令查看该release的信息

```console
$ helm status smiling-penguin
Status: UNINSTALLED
...
```

因为 `--keep-history` 选项会让helm跟踪你的release（即使你卸载了他们）， 所以你可以审计集群历史甚至使用 `helm rollback` 回滚release。

## 查看帮助信息

如果您想通过Helm命令查看更多的有用的信息，请使用 `helm help` 命令，或者在任意命令后添加 `-h` 选项：

```console
$ helm get -h
```

