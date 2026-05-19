---
title: Helm 2 以来的变化
sidebar_position: 1
---

## Helm 2 以来的变化

本文详细列出了 Helm 3 引入的所有主要变化。

### 移除 Tiller

在 Helm 2 的开发周期中，我们引入了 Tiller。Tiller 在团队共享集群时发挥了重要作用——它使多个不同的操作人员能够与同一组 release 交互。

随着 Kubernetes 1.6 默认启用基于角色的访问控制（RBAC），在生产环境中锁定 Tiller 的使用变得更加困难。由于可能存在大量的安全策略配置，我们的立场是提供一个宽松的默认配置。这使得新用户无需深入了解安全控制就能开始尝试 Helm 和 Kubernetes。但遗憾的是，这种宽松的配置可能会赋予用户超出预期的广泛权限。DevOps 和 SRE 在多租户集群中安装 Tiller 时需要学习额外的操作步骤。

在了解了社区成员在某些场景中如何使用 Helm 之后，我们发现 Tiller 的 release 管理系统不需要依赖集群内的操作器来维护状态或充当 Helm release 信息的中心枢纽。相反，我们可以直接从 Kubernetes API server 获取信息，在客户端渲染 chart，并在 Kubernetes 中存储安装记录。

Tiller 的主要功能可以在没有 Tiller 的情况下实现，因此我们在 Helm 3 中做出的首要决定之一就是完全移除 Tiller。

移除 Tiller 后，Helm 的安全模型得到了根本简化。Helm 3 现在支持现代 Kubernetes 的所有安全、身份认证和授权功能。Helm 的权限通过 [kubeconfig 文件](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 进行评估。集群管理员可以根据需要在任意粒度上限制用户权限。release 仍然记录在集群内，Helm 的其余功能保持不变。

### 改进的升级策略：三方战略合并补丁

Helm 2 使用两方战略合并补丁。在升级过程中，它会比较最近一次 chart 的 manifest 与新 chart 的 manifest（即 `helm upgrade` 时提供的 manifest）。它通过比较这两个 chart 的差异来确定需要对 Kubernetes 中的资源进行哪些更改。如果通过带外方式对集群进行了更改（例如通过 `kubectl edit`），这些更改不会被考虑。这导致资源无法回滚到之前的状态：因为 Helm 只将最后应用的 chart manifest 视为当前状态，如果 chart 状态没有变化，实际运行状态也不会被修改。

在 Helm 3 中，我们现在使用三方战略合并补丁。Helm 在生成补丁时会同时考虑旧的 manifest、实际运行状态和新的 manifest。

#### 示例

让我们通过几个常见示例来说明这一变化的影响。

##### 实际运行状态已更改时的回滚

你的团队刚刚使用 Helm 在 Kubernetes 上将应用部署到生产环境。chart 中的 Deployment 对象的副本数设置为三个：

```console
$ helm install myapp ./myapp
```

一位新开发人员加入了团队。在他们入职第一天观察生产集群时，发生了一起可怕的咖啡洒在键盘上的事故，他们不小心将生产 deployment 的副本数从三个 `kubectl scale` 到了零：

```console
$ kubectl scale --replicas=0 deployment/myapp
```

团队中的另一位开发人员注意到生产站点宕机了，决定将 release 回滚到之前的状态：

```console
$ helm rollback myapp
```

会发生什么？

在 Helm 2 中，它会比较旧 manifest 和新 manifest 来生成补丁。由于这是回滚，所以是同一个 manifest。Helm 会认为旧 manifest 和新 manifest 没有区别，因此无需更改。副本数继续保持为零。问题来了。

在 Helm 3 中，补丁是使用旧 manifest、实际运行状态和新 manifest 生成的。Helm 识别出旧状态是三个副本，实际运行状态是零，而新 manifest 希望将其改回三个，因此它会生成一个补丁将状态改回三个副本。

##### 实际运行状态已更改时的升级

许多服务网格和其他基于控制器的应用会向 Kubernetes 对象注入数据。这可能是 sidecar、标签或其他信息。假设你有一个从 chart 渲染的 manifest：

```yaml
containers:
- name: server
  image: nginx:2.0.0
```

而实际运行状态已被另一个应用修改为：

```yaml
containers:
- name: server
  image: nginx:2.0.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

现在，你想将 `nginx` 镜像标签升级到 `2.1.0`。于是你升级到一个包含以下 manifest 的 chart：

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

会发生什么？

在 Helm 2 中，Helm 会根据旧 manifest 和新 manifest 生成 `containers` 对象的补丁。在生成补丁时不会考虑集群的实际运行状态。

集群的实际运行状态会被修改为：

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

sidecar 容器从实际运行状态中被移除。麻烦大了。

在 Helm 3 中，Helm 会根据旧 manifest、实际运行状态和新 manifest 生成 `containers` 对象的补丁。它注意到新 manifest 将镜像标签更改为 `2.1.0`，同时实际运行状态包含一个 sidecar 容器。

集群的实际运行状态会被修改为：

```yaml
containers:
- name: server
  image: nginx:2.1.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

### Release 名称现在限定在 namespace 范围内

随着 Tiller 的移除，每个 release 的信息需要存储在某个地方。在 Helm 2 中，这些信息存储在与 Tiller 相同的 namespace 中。实际上，这意味着一旦某个名称被某个 release 使用，其他 release 就无法使用该名称，即使它部署在不同的 namespace 中。

在 Helm 3 中，特定 release 的信息现在存储在与 release 本身相同的 namespace 中。这意味着用户现在可以在两个不同的 namespace 中分别 `helm install wordpress stable/wordpress`，并且可以通过切换当前 namespace 上下文来使用 `helm list` 查看各自的 release（例如 `helm list --namespace foo`）。

由于与原生集群 namespace 更好地对齐，`helm list` 命令默认不再列出所有 release。相反，它只会列出当前 Kubernetes 上下文所在 namespace 中的 release（即运行 `kubectl config view --minify` 时显示的 namespace）。这也意味着你必须在 `helm list` 中提供 `--all-namespaces` 参数才能获得与 Helm 2 类似的行为。

### Secrets 作为默认存储驱动

在 Helm 3 中，Secrets 现在被用作[默认存储驱动](/topics/advanced.md#storage-backends)。Helm 2 默认使用 ConfigMaps 来存储 release 信息。在 Helm 2.7.0 中，实现了一个使用 Secrets 存储 release 信息的新存储后端，这在 Helm 3 中成为了默认设置。

将 Secrets 作为 Helm 3 的默认设置，结合 Kubernetes 中 Secret 加密的发布，可以为保护 chart 提供额外的安全性。

[静态加密 Secrets](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/) 在 Kubernetes 1.7 中作为 Alpha 功能提供，并在 Kubernetes 1.13 中成为稳定版。这允许用户对 Helm release 元数据进行静态加密，因此这是一个很好的起点，以后可以扩展到使用 Vault 等工具。

### Go 导入路径变更

在 Helm 3 中，Helm 将 Go 导入路径从 `k8s.io/helm` 更改为 `helm.sh/helm/v3`。如果你打算升级到 Helm 3 Go 客户端库，请确保更改你的导入路径。

### Capabilities

在渲染阶段可用的 `.Capabilities` 内置对象已被简化。

[内置对象](/chart_template_guide/builtin_objects.md)

### 使用 JSONSchema 验证 Chart Values

现在可以对 chart values 施加 JSON Schema。这确保用户提供的 values 符合 chart 维护者制定的 schema，在用户为 chart 提供不正确的 values 时提供更好的错误报告。

当调用以下任何命令时会进行验证：

* `helm install`
* `helm upgrade`
* `helm template`
* `helm lint`

有关更多信息，请参阅 [Schema 文件](/topics/charts.md#schema-files) 文档。

### 将 `requirements.yaml` 合并到 `Chart.yaml`

chart 依赖管理系统从 requirements.yaml 和 requirements.lock 迁移到了 Chart.yaml 和 Chart.lock。我们建议用于 Helm 3 的新 chart 使用新格式。但是，Helm 3 仍然可以理解 Chart API 版本 1（`v1`），并会加载现有的 `requirements.yaml` 文件。

在 Helm 2 中，`requirements.yaml` 如下所示：

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

在 Helm 3 中，依赖项以相同的方式表达，但现在位于 `Chart.yaml` 中：

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

chart 仍然会被下载并放置在 `charts/` 目录中，因此已经放入 `charts/` 目录的子 chart 将继续正常工作，无需修改。

### 安装时现在必须提供名称（或 --generate-name）

在 Helm 2 中，如果未提供名称，则会生成一个自动名称。在生产环境中，这被证明更多是一个麻烦而不是有用的功能。在 Helm 3 中，如果 `helm install` 未提供名称，Helm 将抛出错误。

对于仍然希望自动生成名称的用户，可以使用 `--generate-name` 参数。

### 推送 Chart 到 OCI 注册中心

这是 Helm 3 中引入的实验性功能。要使用此功能，请设置环境变量 `HELM_EXPERIMENTAL_OCI=1`。

从宏观角度来看，chart 仓库是存储和共享 chart 的地方。Helm 客户端将 Helm chart 打包并发布到 chart 仓库。简单来说，chart 仓库是一个托管了 index.yaml 文件和一些打包 chart 的基本 HTTP 服务器。

虽然 chart 仓库 API 在满足最基本的存储需求方面有几个优点，但一些缺点已经开始显现：

- chart 仓库很难抽象出生产环境中所需的大多数安全实现。在生产场景中，拥有一个标准的认证和授权 API 非常重要。
- Helm 用于签名和验证 chart 完整性和来源的 chart 来源工具是 chart 发布流程中的可选部分。
- 在多租户场景中，同一个 chart 可能被另一个租户上传，导致存储相同内容需要两倍的存储成本。更智能的 chart 仓库已经被设计来处理这个问题，但这不是正式规范的一部分。
- 使用单个索引文件进行搜索、元数据信息和获取 chart，使得在安全的多租户实现中设计起来变得困难或笨拙。

Docker 的 Distribution 项目（也称为 Docker Registry v2）是 Docker Registry 项目的继任者。许多主要云厂商都提供 Distribution 项目的产品，随着如此多的厂商提供相同的产品，Distribution 项目受益于多年的加固、安全最佳实践和实战测试。

请查看 `helm help chart` 和 `helm help registry` 了解有关如何打包 chart 并推送到 Docker 注册中心的更多信息。

有关更多信息，请参阅[此页面](/topics/registries.md)。

### 移除 `helm serve`

`helm serve` 在你的机器上运行一个本地 chart 仓库用于开发目的。然而，它作为开发工具并未获得太多采用，而且在设计上存在诸多问题。最终，我们决定移除它并将其拆分为一个插件。

如需获得类似 `helm serve` 的体验，请查看 [ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage) 中的本地文件系统存储选项和 [servecm 插件](https://github.com/jdolitsky/helm-servecm)。

### Library chart 支持

Helm 3 支持一类称为"library chart"的 chart。这是一种被其他 chart 共享但本身不创建任何 release 产物的 chart。library chart 的模板只能声明 `define` 元素。全局作用域的非 `define` 内容会被忽略。这允许用户复用和共享可在多个 chart 中使用的代码片段，避免冗余并保持 chart 的 [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) 原则。

library chart 在 Chart.yaml 的 dependencies 指令中声明，并像任何其他 chart 一样进行安装和管理。

```yaml
dependencies:
  - name: mylib
    version: 1.x.x
    repository: quay.io
```

我们非常期待看到此功能为 chart 开发者带来的用例，以及使用 library chart 时产生的最佳实践。

### Chart.yaml apiVersion 升级

随着 library chart 支持的引入以及 requirements.yaml 合并到 Chart.yaml，理解 Helm 2 包格式的客户端将无法理解这些新功能。因此，我们将 Chart.yaml 中的 apiVersion 从 `v1` 升级到 `v2`。

`helm create` 现在会使用这种新格式创建 chart，因此默认的 apiVersion 也相应升级。

希望支持两个版本 Helm chart 的客户端应该检查 Chart.yaml 中的 `apiVersion` 字段来了解如何解析包格式。

### XDG 基础目录支持

[XDG 基础目录规范](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html) 是一个可移植的标准，定义了配置、数据和缓存文件应该存储在文件系统的哪个位置。

在 Helm 2 中，Helm 将所有这些信息存储在 `~/.helm`（亲切地称为 `helm home`），可以通过设置 `$HELM_HOME` 环境变量或使用全局参数 `--home` 来更改。

在 Helm 3 中，Helm 现在按照 XDG 基础目录规范遵循以下环境变量：

- `$XDG_CACHE_HOME`
- `$XDG_CONFIG_HOME`
- `$XDG_DATA_HOME`

Helm 插件仍然会收到 `$HELM_HOME` 作为 `$XDG_DATA_HOME` 的别名，以便向后兼容那些将 `$HELM_HOME` 用作临时环境的插件。

为了适应这一变化，还有几个新的环境变量被传递到插件环境中：

- `$HELM_PATH_CACHE` 用于缓存路径
- `$HELM_PATH_CONFIG` 用于配置路径
- `$HELM_PATH_DATA` 用于数据路径

希望支持 Helm 3 的 Helm 插件应该考虑使用这些新的环境变量。

### CLI 命令重命名

为了更好地与其他包管理器的用语保持一致，`helm delete` 被重命名为 `helm uninstall`。`helm delete` 仍然保留为 `helm uninstall` 的别名，因此两种形式都可以使用。

在 Helm 2 中，要清除 release 记录，需要提供 `--purge` 参数。此功能现在默认启用。要保留之前的行为，请使用 `helm uninstall --keep-history`。

此外，还有其他几个命令被重命名以适应相同的约定：

- `helm inspect` -> `helm show`
- `helm fetch` -> `helm pull`

这些命令也保留了旧名称作为别名，因此你可以继续使用任一形式。

### 自动创建 namespace

当在不存在的 namespace 中创建 release 时，Helm 2 会创建该 namespace。Helm 3 遵循其他 Kubernetes 工具的行为，如果 namespace 不存在则返回错误。如果你明确指定 `--create-namespace` 参数，Helm 3 会创建该 namespace。

### .Chart.ApiVersion 发生了什么变化？

Helm 遵循驼峰命名的典型约定，即将首字母缩写词大写。我们在代码的其他地方也这样做了，例如 `.Capabilities.APIVersions.Has`。在 Helm v3 中，我们纠正了 `.Chart.ApiVersion` 以遵循这一模式，将其重命名为 `.Chart.APIVersion`。
