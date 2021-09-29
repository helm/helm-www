---
title: "弃用的 Kubernetes API"
description: "解释Helm不推荐使用的Kubernetes API"
---

Kubernetes是一个API驱动系统，且API会随着时间的推移而变化，以反映对问题理解的不断推移。这是系统及API的普遍做法。
API推移的一个重要部分时良好的弃用策略和通知用户更改API是如何实现的。换句话说，你的API使用者需要提前知道要发布的API
删除或更改了什么。这消除了重大改变对用户造成的恐惧。

[Kubernetes弃用策略](https://kubernetes.io/docs/reference/using-api/deprecation-policy/)
文档描述了如何处理API版本的变化。弃用策略声明了在弃用声明之后支持的API版本的时间范围。因此关注弃用声明并知道API何时被移除很重要。
有助于将影响降到最低。

这是一个声明示例， [针对Kubernetes 1.6弃用的API版本](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/)，
而且是在版本发布的几个月之前公布。在这之前，这些API版本可能已经宣布不再使用了。这表明一个好的策略可以通知用户API的版本支持。

Helm模板定义Kubernetes对象时指定了一个 [Kubernetes
API组](https://kubernetes.io/docs/concepts/overview/kubernetes-api/#api-groups)，类似于Kubernetes的manifest文件。
在模板的`apiVersion`字段指定并标识了Kubernetes对象的API版本。这意味着Helm用户和chart维护者需要关注Kubernetes的API版本
何时会被弃用且在哪个Kubernetes版本中被移除。

## Chart Maintainers

你应该审核chart，检查Kubernetes中已弃用或已删除的Kubernetes API版本。如果API版本不再被支持，应该更新为支持版本并发布新的
chart版本。API版本由`kind`和`apiVersion`字段定义。比如，Kubernetes 1.16 中有个被移除的`Deployment`对象API版本：

```yaml
apiVersion: apps/v1beta1
kind: Deployment
```

## Helm用户

你应该审核你使用的chart(类似于[chart维护者](#chart-maintainers))，并识别所有的chart中Kubernetes版本弃用或移除的API版本。
针对确定的chart，需要检查（有支持的API版本的）chart最新的版本，或者手动更新。

另外，你还需要审核已经部署的chart（即Helm版本）还有没有弃用或移除的API版本。可以使用`helm get manifest`获取详细信息。

将Helm更新为支持的API取决于你通过以下方式找到的：

1. 如果你只找到弃用的API版本，则：

    - 执行`helm upgrade`升级Kubernetes API版本支持的chart版本
    - 在升级中添加一个描述，在当前版本之前不执行Helm版本回滚

2. 如果你发现了在Kubernetes版本中被移除的API版本，则：

    - 如果你运行的Kubernetes版本中API版本依然可用（比如，你在Kubernetes 1.15 且你发现使用的API会在1.16中移除）：
      - 遵循第1步的步骤
    - 否则（比如，你运行的Kubernetes 版本中某些API版本通过`helm get manifest`显示不可用）：
      - 需要编辑存储在集群中的版本清单，更新API版本到支持的API。查看[更新版本清单的API版本](#updating-api-versions-of-a-release-manifest)

> 注意：在所有使用支持的API更新Helm版本的场景中，决不应该将发布版本回滚到API版本支持的之前的版本

> 建议：最佳实践是将正在使用的弃用版本升级到支持的API版本，在升级Kubernetes 集群之前删除这些API版本。

如果你没有按照之前的建议更新版本， 当升级的Kubernetes版本中API的版本已经移除，会出现类似下面的错误：

```console
Error: UPGRADE FAILED: current release manifest contains removed kubernetes api(s)
for this kubernetes version and it is therefore unable to build the kubernetes
objects for performing the diff. error from kubernetes: unable to recognize "":
no matches for kind "Deployment" in version "apps/v1beta1"
```

Helm在这个情况中会失败，因为试图它在当前部署的和你传了更新/支持的API版本的chart之间创建一个diff补丁（包含在这个Kubernetes
版本中删除的Kubernetes API）。失败的根本原因是，当Kubernetes删除了一个API版本时，Kubernetes的Go客户端库不再解析弃用的对象，
所以Helm调用库时会失败。不幸的是，Helm无法从这种情况下恢复，且无法再管理这样的版本。查看
[升级发布清单的API版本](#updating-api-versions-of-a-release-manifest) 获取更多如何从这种情况恢复的细节信息。

## Updating API Versions of a Release Manifest

清单manifest是Helm发布对象的一个特性，存储在集群中的密钥（默认）或配置映射的数据字段中。数据字段包含了一个base64编码的gzip压缩的对象
（对于密钥是一个额外的base 64 编码）。在版本的命名空间中每个版本或修订都对应一个密钥或配置映射。

可以使用Helm [mapkubeapis](https://github.com/helm/helm-mapkubeapis) 插件对支持API执行版本升级。查看readme获取更多信息。

或者，可以按照这些步骤手动执行发布清单的API版本升级。根据你的配置，应该遵循密钥或配置映射的后台步骤。

- 获取最近部署的版本的密钥或配置映射：
  - Secrets后台： `kubectl get secret -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
  - ConfigMap后台：  `kubectl get configmap -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
- 获取最新部署版本细节：
  - Secrets后台： `kubectl get secret <release_secret_name> -n
    <release_namespace> -o yaml > release.yaml`
  - ConfigMap后台： `kubectl get configmap <release_configmap_name> -n
    <release_namespace> -o yaml > release.yaml`
- 备份版本以便出错时恢复：
  - `cp release.yaml release.bak`
  - 在紧急情况下恢复： `kubectl apply -f release.bak -n
    <release_namespace>`
- 解码发布版本对象：
  - Secrets后台： `cat release.yaml | grep -oP '(?<=release: ).*' | base64 -d
    | base64 -d | gzip -d > release.data.decoded`
  - ConfigMap后台： `cat release.yaml | grep -oP '(?<=release: ).*' | base64
    -d | gzip -d > release.data.decoded`
- 修改清单的API版本。可以使用任意工具（如编辑器）修改。在你解码的发布对象的`manifest`字段。
  (`release.data.decoded`)
- 编码发布对象：
  - Secrets 后台： `cat release.data.decoded | gzip | base64 | base64`
  - ConfigMap 后台： `cat release.data.decoded | gzip | base64`
- 用新编码的发布对象替换部署的发布文件(`release.yaml`)中`data.release`的值
- 将文件部署到命名空间： `kubectl apply -f release.yaml -n
  <release_namespace>`
- 用支持Kubernetes API版本的chart执行 `helm upgrade`
- 在升级中添加一个描述，不要执行回滚到当前版本之前的版本
