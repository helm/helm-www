---
title: "自定义资源"
description: "如何创建和使用CRD"
weight: 7
---

最佳实践的这部分处理创建和使用自定义资源。

当使用自定义资源时(CRD)，区分两个不同的部分很重要：

- CRD的声明。是一个具有`CustomResourceDefinition`类型的yaml文件。
- 有些资源 _使用_ CRD. 假设CRD定义了`foo.example.com/v1`。任何有`apiVersion: example.com/v1`和
  `Foo`类的资源都可以使用CRD。

## 使用资源之前安装CRD声明

Helm被优化为尽可能快地将尽可能多的资源加载到Kubernetes中。按照设计，Kubernetes可以获取一整套清单并将其全部上线
（称之为协调循环）。

但CRD与此不同。

对于CRD来说，声明必须在所有的CRD类型资源使用之前被注册。注册过程可能需要几秒钟。

### 方法1: 使用 `helm`

随着Helm 3的到来，我们去掉了旧的`crd-install`钩子以便获取更简单的方法。现在可以在chart中创建一个名为`crds`的特殊目录来保存CRD。
这些CRD没有模板化，但是运行`helm install`时可以为chart默认安装。如果CRD已经存在，会显示警告并跳过。如果希望跳过CRD安装步骤，
可以使用`--skip-crds`参数。

#### 注意事项（和说明）

目前不支持使用Helm升级或删除CRD。由于数据意外丢失的风险，这是经过多次社区讨论后作出的明确决定。对于如何处理CRD及其生命周期，
目前社区还未达成共识。随着过程的发展，Helm会逐渐支持这些场景。

执行`helm install` 和 `helm upgrade`时的`--dry-run`参数目前不支持CRD。“模拟运行”的目的是检测chart的输出是否在发送到服务器时实际有效。
但是CRD是对服务器行为的修改。Helm无法在模拟运行时安装CRD，因此客户端无法知道自定义资源(CR)，验证就会失败。
你可以将CRD移动到自己的chart中或者使用`helm template`代替。

在讨论CRD支持时需要考虑的另一个重要点是如何处理模板的渲染。Helm 2中使用`crd-install`的一个明显缺点是，
由于API可用性的变化导致无法有效验证chart（CRD实际上是向Kubernetes集群添加了另一个可用API）。 如果chart安装了CRD，
`helm`不再有一组有效的API版本可供使用。这也是从CRD删除模板支持的原因。有了CRD安装的新方法`crds`，我们现在可以确保`helm`拥有当前集群状态的完全有效的信息。

### 方法2： 分隔chart

另一个方法是将CRD定义放入chart中，然后将所有使用该CRD的资源放到 _另一个_ chart中。

这个方法要将每个chart分开安装，但对于具有集群管理员访问权限的操作员，这种工作流可能更有用。
