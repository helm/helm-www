---
title: 自定义资源定义
description: 如何创建和使用 CRD。
sidebar_position: 7
---

最佳实践指南的这部分介绍如何创建和使用自定义资源定义（CRD）对象。

使用自定义资源定义（CRD）时，需要区分两个不同的部分：

- CRD 的声明。这是一个 kind 为 `CustomResourceDefinition` 的 YAML 文件。
- 使用 CRD 的资源。假设 CRD 定义了 `foo.example.com/v1`，那么任何 `apiVersion: example.com/v1` 且 kind 为 `Foo` 的资源都是使用该 CRD 的资源。

## 在使用资源之前安装 CRD 声明

Helm 被优化为尽可能快地将尽可能多的资源加载到 Kubernetes 中。按照设计，Kubernetes 可以获取一整套清单并将其全部上线（这称为协调循环）。

但 CRD 有所不同。

对于 CRD，声明必须在使用该 CRD 类型的任何资源之前完成注册。而注册过程有时需要几秒钟。

### 方法1：让 `helm` 帮你完成

随着 Helm 3 的到来，我们移除了旧的 `crd-install` 钩子，采用了更简单的方法。现在可以在 chart 中创建一个名为 `crds` 的特殊目录来存放 CRD。这些 CRD 不会被模板化，但在运行 `helm install` 时会默认安装。如果 CRD 已存在，会显示警告并跳过。如果希望跳过 CRD 安装步骤，可以使用 `--skip-crds` 参数。

#### 注意事项（和说明）

目前不支持使用 Helm 升级或删除 CRD。由于存在意外数据丢失的风险，这是经过多次社区讨论后做出的明确决定。目前社区对于如何处理 CRD 及其生命周期还没有达成共识。随着这一过程的演进，Helm 将逐步支持这些用例。

`helm install` 和 `helm upgrade` 的 `--dry-run` 参数目前不支持 CRD。"模拟运行"的目的是验证 chart 输出在发送到服务器时是否真正有效。但 CRD 会修改服务器的行为。Helm 无法在模拟运行时安装 CRD，因此 discovery 客户端无法识别该自定义资源（CR），导致验证失败。你可以将 CRD 移动到单独的 chart 中，或者使用 `helm template` 代替。

在讨论 CRD 支持时，另一个需要考虑的重要问题是模板渲染的处理方式。Helm 2 中使用 `crd-install` 方法的一个明显缺点是，由于 API 可用性的变化，无法正确验证 chart（CRD 实际上是向 Kubernetes 集群添加了另一个可用的 API）。如果 chart 安装了 CRD，`helm` 就不再拥有一组有效的 API 版本可供使用。这也是从 CRD 移除模板支持的原因。通过新的 `crds` 目录安装 CRD 的方法，我们现在可以确保 `helm` 拥有关于集群当前状态的完全有效的信息。

### 方法2：独立 chart

另一种方法是将 CRD 定义放在一个 chart 中，然后将使用该 CRD 的所有资源放在 _另一个_ chart 中。

这种方法需要分别安装每个 chart。但是，对于拥有集群管理员访问权限的集群运维人员来说，这种工作流可能更有用。
