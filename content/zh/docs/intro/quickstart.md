---
title: "快速入門指南"
description: "如何安裝和開始使用 Helm，包括 Helm 的介绍、FAQs 和 Helm 插件"
weight: 1
---

本指南介绍如何快速開始使用 Helm。

## 先決條件

想成功和正確地使用 Helm，需要達成以下前置條件。

1. 一個 Kubernetes 叢集
2. 確定你安裝版本的安全配置
3. 安裝和配置 Helm。

### 安裝或者使用現有的 Kubernetes 叢集

- 使用 Helm，需要一個 Kubernetes 叢集。對於 Helm 的最新版本，我们建議使用 Kubernetes 的最新穩定版，在大多數情况下，它是倒數第二個次版本。
- 您也應該有一個本地的 `kubectl`.

查看 Helm 和對應支持的 Kubernetes 版本，您可以参考 [Helm 版本支持策略](https://helm.sh/zh/docs/topics/version_skew/)。

## 安裝

您可以通過 `homebrew` 下载二進制 Helm client 版本，也可以通過 github 下载 [github 官方發佈頁面](https://github.com/helm/helm/releases)

除此之外的更多安裝方式詳見 [安裝指南](https://helm.sh/zh/docs/intro/install)。

## 初始化

當您已經安裝好了 Helm 之後，您可以添加一個 chart 倉庫。從[Artifact
Hub](https://artifacthub.io/packages/search?kind=0)中查找有效的 Helm chart 倉庫。

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
```

當添加完成，您將可以看到可以被您安裝的 charts 列表：

```console
$ helm search repo bitnami
NAME                             	CHART VERSION	APP VERSION  	DESCRIPTION
bitnami/bitnami-common           	0.0.9        	0.0.9        	DEPRECATED Chart with custom templates used in ...
bitnami/airflow                  	8.0.2        	2.0.0        	Apache Airflow is a platform to programmaticall...
bitnami/apache                   	8.2.3        	2.4.46       	Chart for Apache HTTP Server
bitnami/aspnet-core              	1.2.3        	3.1.9        	ASP.NET Core is an open-source framework create...
# ... and many more
```

## 安裝 Chart 範例

您可以通過`helm install` 命令安裝 chart。 Helm 可以通過多種途徑搜尋和安裝 chart，但最簡單的是安裝官方的`bitnami` charts。

```console
$ helm repo update              # 確定我們可以拿到最新的charts列表
$ helm install bitnami/mysql --generate-name
NAME: mysql-1612624192
LAST DEPLOYED: Sat Feb  6 16:09:56 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES: ...
```

在上面的範例中，`bitnami/mysql`这個 chart 被發佈，名字是 `mysql-1612624192`

您可以通過執行 `helm show chart bitnami/mysql` 命令簡單的了解到這個 chart 的基本訊息。
或者您可以執行 `helm show all bitnami/mysql` 獲取關於該 chart 的所有訊息。

每當您執行 `helm install` 的时候，都會創建一個新的發佈版本。
所以一個 chart 在同一個叢集裡面可以被安裝多次，每一個都可以被獨立的管理和升級。

`helm install` 是一個擁有很多能力的強大命令，更多資訊詳見 [使用 Helm](https://helm.sh/zh/docs/intro/using_helm)

## 關於版本發佈

通過 Helm 您可以很容易看到哪些 chart 被發佈了：

```console
$ helm list
NAME            	NAMESPACE	REVISION	UPDATED                             	STATUS  	CHART      	APP VERSION
mysql-1612624192	default  	1       	2021-02-06 16:09:56.283059 +0100 CET	deployed	mysql-8.3.0	8.0.23
```

`helm list` (或 `helm ls`) 命令會列出所有可被部署的版本。

## 刪除一個版本

您可以使用`helm uninstall` 命令刪除你的版本

```console
$ helm uninstall mysql-1612624192
release "mysql-1612624192" uninstalled
```

該命令會從 Kubernetes 卸载 `mysql-1612624192`， 它将删除和该版本相关的所有相关资源（service、deployment、
pod 等等）甚至版本历史。

如果您在执行 `helm uninstall` 的时候提供 `--keep-history` 选项， Helm 将会保存版本历史。
您可以通过命令查看该版本的信息

```console
$ helm status mysql-1612624192
Status: UNINSTALLED
...
```

因为 `--keep-history` 选项会让 helm 跟踪你的版本（即使你卸载了他们）， 所以你可以审计叢集历史甚至使用
`helm rollback` 回滚版本。

## 查看帮助信息

如果您想通过 Helm 命令查看更多的有用的信息，请使用 `helm help` 命令，或者在任意命令后添加 `-h` 选项：

```console
$ helm get -h
```
