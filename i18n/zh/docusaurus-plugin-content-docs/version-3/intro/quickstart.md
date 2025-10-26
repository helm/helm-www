---
title: 快速入门指南
description: 如何安装和开始使用Helm，包括Helm的介绍、FAQs和Helm插件
sidebar_position: 1
---

本指南介绍如何快速开始使用Helm。

## 先决条件

想成功和正确地使用Helm，需要以下前置条件。

1. 一个 Kubernetes 集群
2. 确定你安装版本的安全配置
3. 安装和配置Helm。

### 安装或者使用现有的Kubernetes集群

- 使用Helm，需要一个Kubernetes集群。对于Helm的最新版本，我们建议使用Kubernetes的最新稳定版，
  在大多数情况下，它是倒数第二个次版本。
- 您也应该有一个本地的 `kubectl`.

查看Helm和对应支持的Kubernetes版本，您可以参考 [Helm
版本支持策略](https://helm.sh/zh/docs/topics/version_skew/)。

## 安装

您可以通过 `homebrew` 下载二进制Helm client安装包，也可以通过github下载 [github 官方发布页面](https://github.com/helm/helm/releases)

除此之外的更多安装方式详见 [安装指南](https://helm.sh/zh/docs/intro/install)。

## 初始化

当您已经安装好了Helm之后，您可以添加一个chart 仓库。从[Artifact
Hub](https://artifacthub.io/packages/search?kind=0)中查找有效的Helm chart仓库。

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

当添加完成，您将可以看到可以被您安装的charts列表：

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... and many more
```

## 安装Chart示例

您可以通过`helm install` 命令安装chart。 Helm可以通过多种途径查找和安装chart，
但最简单的是安装官方的`bitnami` charts。

```console
$ helm repo update              # 确定我们可以拿到最新的charts列表
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

在上面的例子中，`bitnami/mysql`这个chart被发布，名字是 `mysql-1612624192`

您可以通过执行 `helm show  chart bitnami/mysql` 命令简单的了解到这个chart的基本信息。
或者您可以执行 `helm show all bitnami/mysql` 获取关于该chart的所有信息。

每当您执行 `helm install` 的时候，都会创建一个新的发布版本。
所以一个chart在同一个集群里面可以被安装多次，每一个都可以被独立的管理和升级。

`helm install` 是一个拥有很多能力的强大的命令，更多信息详见 [使用 Helm](https://helm.sh/zh/docs/intro/using_helm)

## 关于版本发布

通过Helm您可以很容易看到哪些chart被发布了：

```console
$ helm list
NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

`helm list` (或 `helm ls`) 命令会列出所有可被部署的版本。

## 卸载一个版本

您可以使用`helm uninstall` 命令卸载你的版本

```console
$ helm uninstall mysql-1612624192
release "mysql-1612624192" uninstalled
```

该命令会从Kubernetes卸载 `mysql-1612624192`， 它将删除和该版本相关的所有相关资源（service、deployment、
pod等等）甚至版本历史。

如果您在执行 `helm uninstall` 的时候提供 `--keep-history` 选项， Helm将会保存版本历史。
您可以通过命令查看该版本的信息

```console
$ helm status mysql-1612624192
Status: UNINSTALLED
...
```

因为 `--keep-history` 选项会让helm跟踪你的版本（即使你卸载了他们）， 所以你可以审计集群历史甚至使用
`helm rollback` 回滚版本。

## 查看帮助信息

如果您想通过Helm命令查看更多的有用的信息，请使用 `helm help` 命令，或者在任意命令后添加 `-h` 选项：

```console
$ helm get -h
```
