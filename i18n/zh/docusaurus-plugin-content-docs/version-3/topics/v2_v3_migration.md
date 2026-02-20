---
title: 从 Helm v2 迁移到 v3
description: 了解如何将 Helm v2 迁移到 v3。
sidebar_position: 13
---

本指南介绍如何将 Helm v2 迁移到 v3。在开始前，需要先安装 Helm v2 并在一个或多个集群中管理 release。

## Helm 3 变更概述

Helm 2 到 Helm 3 的完整变更列表请参阅 [FAQ 部分](/faq/changes_since_helm2.md)。以下是用户在迁移之前和迁移期间应该注意的一些变更概述：

1. 移除了 Tiller：
   - 用 client/library 架构（仅 `helm` 二进制文件）替换了 client/server 架构
   - 安全性现在基于单个用户（委托给 Kubernetes 用户集群安全机制）
   - release 现在作为集群内的 Secret 存储，且 release 对象的元数据格式也已更改
   - release 现在按 release 命名空间持久化，不再存储在 Tiller 命名空间中
2. 更新了 Chart 仓库：
   - `helm search` 现在支持本地仓库搜索和对 Artifact Hub 的搜索查询
3. Chart apiVersion 升级到 "v2"，以支持以下规范变更：
   - 动态链接的 chart 依赖移至 `Chart.yaml`（移除了 `requirements.yaml`，requirements --> dependencies）
   - Library chart（辅助/通用 chart）现在可以作为动态链接的 chart 依赖添加
   - Chart 有一个 `type` 元数据字段，用于定义 chart 类型是 `application` 还是 `library`。默认是 application，即可渲染和安装
   - Helm 2 chart（apiVersion=v1）仍然可以安装
4. 添加了 XDG 目录规范：
   - Helm home 目录被移除，改用 XDG 目录规范来存储配置文件
   - 不再需要初始化 Helm
   - 移除了 `helm init` 和 `helm home`
5. 其他变更：
   - Helm 安装/设置简化：
     - 仅需 Helm 客户端（helm 二进制文件）（无需 Tiller）
     - 开箱即用
   - 不再默认设置 `local` 或 `stable` 仓库
   - 移除了 `crd-install` hook，改用 chart 中的 `crds` 目录，其中定义的所有 CRD 将在渲染 chart 之前安装
   - 移除了 `test-failure` hook 注解值，且 `test-success` 已弃用。请使用 `test` 代替
   - 命令的删除/替换/新增：
       - delete --> uninstall：默认删除所有发布历史（之前需要 `--purge`）
       - fetch --> pull
       - home（已删除）
       - init（已删除）
       - install：需要 release 名称或 `--generate-name` 参数
       - inspect --> show
       - reset（已删除）
       - serve（已删除）
       - template：`-x`/`--execute` 参数重命名为 `-s`/`--show-only`
       - upgrade：添加了 `--history-max` 参数，用于限制每个 release 保存的最大修订版本数（0 表示不限制）
   - Helm 3 Go 库经历了大量变更，与 Helm 2 库不兼容
   - release 二进制文件现在托管在 `get.helm.sh`

## 迁移用例

迁移用例如下：

1. Helm v2 和 v3 管理同一集群：
   - 仅当你打算逐步淘汰 Helm v2 且不需要 v3 管理任何 v2 部署的 release 时，才建议使用此方案。所有新 release 都应通过 v3 部署，现有 v2 部署的 release 仅通过 v2 更新/删除
   - Helm v2 和 v3 可以很好地管理同一集群。两个 Helm 版本可以安装在同一系统上，也可以安装在不同系统上
   - 如果在同一系统上安装 Helm v3，需要执行额外步骤以确保两个客户端版本可以共存，直到准备好删除 Helm v2 客户端。重命名或将 Helm v3 二进制文件放在不同的文件夹中以避免冲突
   - 除此之外，由于以下区别，两个版本之间不会产生冲突：
     - v2 和 v3 的 release（历史）存储是相互独立的。变更包括用于存储的 Kubernetes 资源和资源中包含的 release 对象元数据。release 将按用户命名空间存储，而不是 Tiller 命名空间（例如，v2 默认的 Tiller 命名空间是 kube-system）。v2 在 Tiller 命名空间中使用 "ConfigMaps" 或 "Secrets"，所有权为 `TILLER`。v3 在用户命名空间中使用 "Secrets"，所有权为 `helm`。release 在 v2 和 v3 中都是增量的
     - 唯一可能出现的问题是，如果 chart 中定义了 Kubernetes 集群范围的资源（例如 `clusterroles.rbac`）。即使资源在命名空间中是唯一的，v3 部署也会因为资源冲突而失败
     - v3 配置不再使用 `$HELM_HOME`，改用 XDG 目录规范。它还会按需动态创建。因此它独立于 v2 配置。这仅适用于两个版本安装在同一系统上的情况

2. 将 Helm v2 迁移到 Helm v3：
   - 此用例适用于你希望用 Helm v3 管理现有 Helm v2 release 的情况
   - 需要注意的是 Helm v2 客户端：
     - 可以管理 1 个或多个 Kubernetes 集群
     - 可以为一个集群连接 1 个或多个 Tiller 实例
   - 这意味着在迁移时必须注意这一点，因为 release 是通过 Tiller 及其命名空间部署到集群中的。因此，你必须注意迁移 Helm v2 客户端实例所管理的每个集群和每个 Tiller 实例
   - 推荐的数据迁移路径如下：
     1. 备份 v2 数据
     2. 迁移 Helm v2 配置
     3. 迁移 Helm v2 release
     4. 当确信 Helm v3 按预期管理所有 Helm v2 数据（针对 Helm v2 客户端实例的所有集群和 Tiller 实例）后，清理 Helm v2 数据
   - 迁移过程可通过 Helm v3 的 [2to3](https://github.com/helm/helm-2to3) 插件自动完成

## 参考

- Helm v3 [2to3](https://github.com/helm/helm-2to3) 插件
- [博客文章](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)：通过示例说明 `2to3` 插件的用法
