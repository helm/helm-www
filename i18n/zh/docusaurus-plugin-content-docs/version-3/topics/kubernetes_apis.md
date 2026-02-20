---
title: "弃用的 Kubernetes API"
description: "介绍 Helm 中与 Kubernetes API 弃用相关的问题"
---

Kubernetes 是一个 API 驱动的系统，API 会随着时间推移而不断演进，以反映对问题理解的深入。这是系统及其 API 的常见做法。API 演进的一个重要组成部分是完善的弃用策略和通知机制，用于告知用户 API 的变更。换句话说，API 使用者需要提前知道在哪个版本中某个 API 会被移除或变更。这可以避免意外的破坏性变更对使用者造成影响。

[Kubernetes 弃用策略](https://kubernetes.io/docs/reference/using-api/deprecation-policy/)文档描述了 Kubernetes 如何处理 API 版本的变化。弃用策略规定了在发布弃用公告后，API 版本将被支持的时间范围。因此，关注弃用公告并了解 API 何时被移除非常重要，有助于将影响降到最低。

以下是一个公告示例：[Kubernetes 1.16 中弃用的 API 版本](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/)，在该版本发布的几个月之前就已公布。在此之前，这些 API 版本可能已经被标记为弃用。这说明 Kubernetes 有一套良好的策略来通知使用者 API 版本的支持情况。

Helm 模板在定义 Kubernetes 对象时需要指定一个 [Kubernetes API 组](https://kubernetes.io/docs/concepts/overview/kubernetes-api/#api-groups)，与 Kubernetes manifest 文件类似。API 版本在模板的 `apiVersion` 字段中指定，用于标识 Kubernetes 对象的 API 版本。这意味着 Helm 用户和 chart 维护者需要关注 Kubernetes API 版本的弃用时间，以及会在哪个 Kubernetes 版本中被移除。

## Chart 维护者

你应该审核 chart，检查是否使用了已弃用或已移除的 Kubernetes API 版本。如果发现不再支持的 API 版本，应更新为受支持的版本并发布新的 chart 版本。API 版本由 `kind` 和 `apiVersion` 字段定义。例如，以下是 Kubernetes 1.16 中被移除的 `Deployment` 对象 API 版本：

```yaml
apiVersion: apps/v1beta1
kind: Deployment
```

## Helm 用户

你应该审核所使用的 chart（类似于 [chart 维护者](#chart-维护者)的做法），识别其中使用了已弃用或已移除 API 版本的 chart。对于这些 chart，需要检查是否有使用受支持 API 版本的新版本，或者自行更新。

此外，你还需要审核已部署的 chart（即 Helm release），检查是否存在已弃用或已移除的 API 版本。可以使用 `helm get manifest` 命令获取 release 的详细信息。

将 Helm release 更新为受支持的 API 版本，具体操作取决于你的发现：

1. 如果只发现弃用（但尚未移除）的 API 版本：
    - 执行 `helm upgrade`，使用包含受支持 Kubernetes API 版本的 chart
    - 在升级描述中添加说明，提示不要回滚到此版本之前的 Helm release

2. 如果发现在某个 Kubernetes 版本中已被移除的 API 版本：
    - 如果你运行的 Kubernetes 版本中该 API 版本仍然可用（例如，你当前使用 Kubernetes 1.15，但发现使用的 API 将在 1.16 中被移除）：
      - 按照步骤 1 的流程操作
    - 否则（例如，你当前运行的 Kubernetes 版本中，`helm get manifest` 显示的某些 API 版本已不可用）：
      - 需要编辑存储在集群中的 release manifest，将 API 版本更新为受支持的版本。详见[更新 release manifest 的 API 版本](#更新-release-manifest-的-api-版本)

> 注意：在所有将 Helm release 更新为受支持 API 的场景中，都不应该将 release 回滚到包含受支持 API 版本的 release 之前的版本。

> 建议：最佳实践是在升级到移除这些 API 的 Kubernetes 集群版本之前，先将使用弃用 API 版本的 release 升级为受支持的 API 版本。

如果没有按照上述建议更新 release，在 API 版本已被移除的 Kubernetes 版本中尝试升级 release 时，会出现类似以下的错误：

```
Error: UPGRADE FAILED: current release manifest contains removed kubernetes api(s)
for this kubernetes version and it is therefore unable to build the kubernetes
objects for performing the diff. error from kubernetes: unable to recognize "":
no matches for kind "Deployment" in version "apps/v1beta1"
```

Helm 在这种情况下会失败，因为它尝试在当前已部署的 release（包含在此 Kubernetes 版本中已移除的 API）与你传入的使用更新/受支持 API 版本的 chart 之间创建差异补丁。失败的根本原因是：当 Kubernetes 移除某个 API 版本后，Kubernetes Go 客户端库将无法解析使用弃用 API 的对象，因此 Helm 在调用该库时会失败。不幸的是，Helm 无法从这种情况中恢复，也无法继续管理这样的 release。有关如何从这种情况中恢复的详细信息，请参阅[更新 release manifest 的 API 版本](#更新-release-manifest-的-api-版本)。

## 更新 release manifest 的 API 版本

manifest 是 Helm release 对象的一个属性，存储在集群中 Secret（默认）或 ConfigMap 的 data 字段中。data 字段包含一个经过 gzip 压缩并使用 base64 编码的对象（如果是 Secret，还会有额外的一层 base64 编码）。在 release 所在的命名空间中，每个 release 版本/修订都对应一个 Secret 或 ConfigMap。

你可以使用 Helm [mapkubeapis](https://github.com/helm/helm-mapkubeapis) 插件来将 release 更新为受支持的 API。详情请查看该插件的 readme 文档。

或者，你可以按照以下手动步骤更新 release manifest 的 API 版本。根据你的配置，选择 Secret 或 ConfigMap 后端对应的步骤。

- 获取与最新部署的 release 关联的 Secret 或 ConfigMap 名称：
  - Secret 后端：`kubectl get secret -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
  - ConfigMap 后端：`kubectl get configmap -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
- 获取最新部署 release 的详细信息：
  - Secret 后端：`kubectl get secret <release_secret_name> -n
    <release_namespace> -o yaml > release.yaml`
  - ConfigMap 后端：`kubectl get configmap <release_configmap_name> -n
    <release_namespace> -o yaml > release.yaml`
- 备份 release 以便出错时恢复：
  - `cp release.yaml release.bak`
  - 紧急情况下恢复：`kubectl apply -f release.bak -n
    <release_namespace>`
- 解码 release 对象：
  - Secret 后端：`cat release.yaml | grep -oP '(?<=release: ).*' | base64 -d
    | base64 -d | gzip -d > release.data.decoded`
  - ConfigMap 后端：`cat release.yaml | grep -oP '(?<=release: ).*' | base64
    -d | gzip -d > release.data.decoded`
- 修改 manifest 中的 API 版本。可以使用任意工具（如编辑器）进行修改。API 版本位于解码后的 release 对象 (`release.data.decoded`) 的 `manifest` 字段中
- 编码 release 对象：
  - Secret 后端：`cat release.data.decoded | gzip | base64 | base64`
  - ConfigMap 后端：`cat release.data.decoded | gzip | base64`
- 用新编码的 release 对象替换部署文件 (`release.yaml`) 中 `data.release` 属性的值
- 将文件应用到命名空间：`kubectl apply -f release.yaml -n
  <release_namespace>`
- 使用包含受支持 Kubernetes API 版本的 chart 执行 `helm upgrade`
- 在升级描述中添加说明，提示不要回滚到此版本之前的版本
