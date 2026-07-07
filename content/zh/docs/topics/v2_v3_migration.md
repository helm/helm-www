---
title: "Helm v2 迁移到 v3"
description: "了解如何将Helm v2 迁移到v3。"
weight: 13
---

该指南介绍如何将Helm v2迁移到v3。Helm v2需要被安装且在一个或多个集群中管理版本。

## Helm 3变化概述

Helm 2 to 3完整的变化列表在 [FAQ 部分](https://v3.helm.sh/docs/faq/#changes-since-helm-2)。
以下是用户在迁移之前应该要注意的一些改变的概述：

1. 移除了Tiller:
   - 用client/library结构（仅仅`helm`）替换了 client/server
   - 安全性现在是每个用户的基础（委托给了Kubernetes用户集群安全）
   - 发布版本现在作为集群内的密钥存储且改变了发布对象的元数据
   - 发布版本是在版本命名空间的基础上持久化的并且不再是Tiller的命名空间
2. 升级了Chart仓库：
   - `helm search` 现在支持本地仓库搜索和Artifact Hub查询
3. 对于以下更新的规范，Chart的apiVersion升级到了"v2"：
   - 动态依赖的chart依赖移动到了`Chart.yaml`
     (删除了`requirements.yaml` 且 requirements --> dependencies)
   - 库chart (辅助/公共库) 现在可以添加为动态链接的chart依赖
   - Chart有个`type`元数据字段将chart定义为`application`或`library`的chart。默认是可渲染和安装的应用
   - Helm 2 的chart (apiVersion=v1) 依然可用
4. 添加了XDG目录规范：
   - Helm根目录针对存储配置文件删除和替换了XDG目录规范
   - 不再需要初始化Helm
   - 移除了`helm init` 和 `helm home`
5. 其他更改：
   - 简化了Helm的安装和设置：
     - 仅针对Helm客户端 (二进制)
     - 按照已有范式运行
   - 不再默认设置`local`或`stable`仓库
   - 删除了`crd-install`钩子并用chart中的`crds`目录替换了，在渲染chart之前会安装所有的crd
   - 删除了`test-failure`钩子注释值，且弃用了`test-success`。使用`test`代替
   - 删除/替换/添加的命令：
       - delete --> uninstall : 默认删除所有的发布记录（之前需要`--purge`）
       - fetch --> pull
       - home (已删除)
       - init (已删除)
       - install: 需要发布名称或者`--generate-name` 参数
       - inspect --> show
       - reset (已删除)
       - serve (已删除)
       - template: `-x`/`--execute` 参数重命名为 `-s`/`--show-only`
       - upgrade: 添加了参数 `--history-max`，限制每个版本保存的最大记录数量（0表示不限制）
   - Helm 3 Go库经历了很多变化，不再兼容Helm 2库
   - 发行版二进制包现在托管在 `get.helm.sh`

## 迁移用例

迁移用例如下：

1. Helm v2和v3 来管理相同的集群：
   - 只有打算逐步淘汰Helm v2时，才建议使用此用例，且不需要使用v3管理任何v2部署的发布。所有的新发布都应该使用v3部署且现有v2部署的只能用v2删除和升级
   - Helm v2 和 v3 可以很欢快地管理同一个集群。Helm 版本可以安装在相同或单独的系统上。
   - 如果将Helm v3安装在相同的系统上，需要执行额外的步骤来保证两个客户端版本可以共存，直到删除Helm v2客户端。重命名或者将Helm
     v3执行文件放在不同的文件夹中以避免冲突
   - 否则由于以下区别两个版本不存在冲突：
     - v2 和 v3 发布（历史）存储是独立的。修改包括存储的Kubernetes资源和包含在资源中的发布对象元数据。发布版本会在每个用户命名空间而不是
       Tiller命名空间（比如，v2默认的命名空间kube-system）。v2使用Tiller命名空间中的"ConfigMaps"或"Secrets"和
       `TILLER`所有权。v3在用户命名空间中使用"Secrets"和`helm`所有权。发布版本在v2和v3中都是增量的。
     - 唯一的问题是如果Kubernetes集群范围内的资源(比如`clusterroles.rbac`)定义在chart中。即使资源在命名空间中是唯一的，
       因为冲突v3部署会失败。
     - v3配置不再使用`$HELM_HOME`并使用XDG目录规范代替。还可以根据需要动态创建。因此它独立于v2配置。这仅适用于两个版本安装在同一个系统上的情况。

2. 将Helm v2迁移到Helm v3：
   - 此案例适用于你希望用Helm v3管理现有Helm v2版本时
   - 需要注意的是Helm v2 客户端：
     - 可以管理1个或多个Kubernetes集群
     - 可以为一个集权连接1个或多个Tiller实例
   - 这意味着你必须注意当通过Tiller和它的命名空间迁移部署在集群中的发布。因此你必须注意使用Helm v2客户端实例管理的每个集群和Tiller实例的迁移
   - 推荐的数据迁移步骤如下：
     1. 备份v2数据
     2. 迁移Helm v2配置
     3. 迁移Helm v2发布
     4. 当确信Helm v3按预期管理所有的Helm v2 数据时（针对Helm v2 客户端实例的所有集群和Tiller实例）
   - 迁移过程有Helm v3的[2to3](https://github.com/helm/helm-2to3)插件自动完成

## 参考

- Helm v3 [2to3](https://github.com/helm/helm-2to3) 插件
- [post](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/) 附带示例阐述了 `2to3`插件的使用
