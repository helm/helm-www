---
title: 快速入门指南
description: 如何安装 Helm 并快速上手，包括发行版说明、常见问题和插件。
sidebar_position: 1
---

本指南介绍如何快速开始使用 Helm。

## 先决条件

想要成功且安全地使用 Helm，需要以下前置条件：

1. 一个 Kubernetes 集群
2. 确定安装时需要应用的安全配置（如有）
3. 安装和配置 Helm

### 安装或者使用现有的 Kubernetes 集群

- 使用 Helm，需要一个 Kubernetes 集群。对于 Helm 的最新版本，我们建议使用 Kubernetes 的最新稳定版，
  通常是次新的 minor 版本。
- 你还需要有一个本地已配置好的 `kubectl`。

查看 Helm 和对应支持的 Kubernetes 版本，可以参考 [Helm 版本支持策略](../topics/version_skew.md)。

## 安装 Helm

你可以通过 `homebrew` 下载二进制 Helm client 安装包，也可以通过 [GitHub 官方发布页面](https://github.com/helm/helm/releases) 下载。

更多安装方式请参阅 [安装指南](./install.md)。

## 初始化 Helm Chart 仓库

安装好 Helm 之后，你可以添加一个 chart 仓库。从 [Artifact Hub](https://artifacthub.io/packages/search?kind=0) 中查找可用的 Helm chart 仓库。

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

添加完成后，你可以列出可安装的 chart：

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... and many more
```

## 安装示例 Chart

你可以通过 `helm install` 命令安装 chart。 Helm 可以通过多种途径查找和安装 chart，
但最简单的是安装官方的 `bitnami` chart。

```console
$ helm repo update              # 确保获取最新的 chart 列表
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

在上面的例子中，`bitnami/mysql` 这个 chart 被发布，名字是 `mysql-1612624192`

运行 `helm show chart bitnami/mysql` 可以快速了解该 chart 的基本信息。
运行 `helm show all bitnami/mysql` 可以获取该 chart 的所有信息。

每当你执行 `helm install` 的时候，都会创建一个新的 release。
所以一个 chart 可以在同一个集群里被安装多次，每一个都可以独立管理和升级。

`helm install` 是一个拥有很多能力的强大的命令，更多信息详见 [使用 Helm](./using_helm.md)。

## 关于 Release

通过 Helm 你可以很容易看到哪些 chart 被发布了：

```console
$ helm list
NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

`helm list`（或 `helm ls`）命令会列出所有已部署的 release。

## 卸载 Release

你可以使用 `helm uninstall` 命令卸载 release：

```console
$ helm uninstall mysql-1612624192
release "mysql-1612624192" uninstalled
```

该命令会从 Kubernetes 卸载 `mysql-1612624192`，删除该 release 相关的所有资源以及 release 历史。

如果你在执行 `helm uninstall` 的时候提供 `--keep-history` 选项，Helm 将会保存 release 历史。
你可以通过命令查看该 release 的信息：

```console
$ helm status mysql-1612624192
Status: UNINSTALLED
...
```

因为 `--keep-history` 选项会让 Helm 跟踪你的 release（即使你卸载了它们），所以你可以审计集群历史，甚至使用
`helm rollback` 回滚 release。

## 查看帮助信息

如果你想了解更多可用的 Helm 命令，请使用 `helm help` 命令，或者在任意命令后添加 `-h` 选项：

```console
$ helm get -h
```
