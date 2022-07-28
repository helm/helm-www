---
title: "常見問答(FAQ)"
weight: 8
---

# 常見問答

> Helm 2 和 Helm 3 的主要區別是什么?  
> 此頁面為最常見的問題以提供幫助。

**我們喜歡您的幫助** 使得該文件變的更好。添加、修改或移除信息,
[提問題](https://github.com/helm/helm-www/issues)或者向我们提交 pull request。

## 從 Helm 2 發生的變化

這裡會展示一個對 Helm3 主要引入的變化的詳細列表。

### 移除了 Tiller

在 Helm 2 的开发周期中，我们引入了 Tiller。Tiller 在团队协作中共享集群时扮演了重要角色。
它使得不同的操作员与相同的版本进行交互称为了可能。

Kubernetes 1.6 默认使用了基于角色的访问控制（RBAC），在生产环境对 Tiller 的锁定使用变得难于管理。
由于大量可能的安全策略，我们的立场是提供一个自由的默认配置。这样可以允许新手用户可以乐于尝试 Helm
和 Kubernetes 而不需要深挖安全控制。 不幸的是这种自由的配置会授予用户他们不该有的权限。DevOps 和 SRE
在安装多用户集群时不得不去学习额外的操作步骤。

在听取了社区成员在特定场景使用 Helm 之后，我们发现 Tiller 的版本管理系统不需要依赖于集群内部用户去维护
状态或者作为一个 Helm 版本信息的中心 hub。取而代之的是，我们可以简单地从 Kubernetes API server 获取信息，
在 Chart 客户端处理并在 Kubernetes 中存储安装记录。

Tiller 的首要目标可以在没有 Tiller 的情况下实现，因此针对于 Helm 3 我们做的首要决定之一就是完全移除 Tiller。

随着 Tiller 的消失，Helm 的安全模块从根本上被简化。Helm 3 现在支持所有 Kubernetes 流行的安全、
身份和授权特性。Helm 的权限通过你的
[kubeconfig 文件](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)进行评估。
集群管理员可以限制用户权限，只要他们觉得合适，
无论什么粒度都可以做到。版本发布记录和 Helm 的剩余保留功能仍然会被记录在集群中。

### 改进升级策略: 三路策略合并补丁

Helm 2 使用了一种双路策略合并补丁。在升级过程中，会对比最近一次的 chart manifest 和提出的
chart manifest(通过`helm upgrade`提供)。升级会对比两个 chart 的不同来决定哪些更改会应用到 Kubernetes 资源中。
如果更改是集群外带的（比如通过`kubectl edit`），则不会被考虑。结果就是资源不会回滚到之前的状态：
因为 Helm 只考虑最后一次应用的 chart manifest 作为它的当前状态，如果 chart 状态没有更改，则资源的活动状态不会更改。

现在 Helm 3 中，我们使用一种三路策略来合并补丁。Helm 在生成一个补丁时会考虑之前老的 manifest 的活动状态。

#### 示例

让我们通过一些常见的例子来看看变化带来的影响。

##### 回滚已经改变的活动状态

你的团队正好在 Kubernetes 上使用 Helm 部署了生产环境应用。chart 包含了一个部署对象使用了三套副本：

```console
$ helm install myapp ./myapp
```

一个开发新人加入了团队。当他们第一点观察生产环境集群时，发生了一个像是咖啡洒在了键盘上一样的严重事故，
他们使用 `kubectl scale` 对生产环境部署进行缩容，将副本数从 3 降到了 0 。

```console
$ kubectl scale --replicas=0 deployment/myapp
```

团队里面的另一个人看到线上环境已经挂了就决定回滚这个版本到之前的状态：

```console
$ helm rollback myapp
```

发生了什么？

在 Helm 2 中，会生成一个补丁并对比老的 manifest 和新的 manifest。因为这是一个回滚，manifest 是一样的。
Helm 会认为新老 manifest 没有区别，因此没有需要更改的内容。副本统计数量继续保持为 0。恐慌就接踵而至。

在 Helm 3 中，是用老的 manifest 生成新的补丁，活动状态和新的 manifest。
Helm 意识到老的状态是 3，而现有活动状态是 0，并且新的 manifest 希望改回 3，因此会生成一个补丁将状态改回 3。

##### 活动状态已更改的情况下升级

很多服务网格和其他基于 controller 的应用向 Kubernetes 对象中注入数据。比如 sidecar、label 和其他信息。
之前如果你从 Chart 渲染给定的 manifest 如下:

```yaml
containers:
  - name: server
    image: nginx:2.0.0
```

并且另一个应用修改活动状态如下：

```yaml
containers:
  - name: server
    image: nginx:2.0.0
  - name: my-injected-sidecar
    image: my-cool-mesh:1.0.0
```

现在你想升级`nginx`镜像到`2.1.0`。因此用指定的 manifest 升级 chart：

```yaml
containers:
  - name: server
    image: nginx:2.1.0
```

发生了什么？

在 Helm 2 中，Helm 在新老 manifest 之间生成了一个`containers`对象的补丁。
生成补丁的过程中不考虑集群的活动状态。

集群的活动状态被修改成了这样:

```yaml
containers:
  - name: server
    image: nginx:2.1.0
```

sidecar pod 从活动状态中移除了。更多的恐慌袭来。

在 Helm 3 中，Helm 在新的 manifest、活动状态和老 manifest 之间生成了一个`containers`对象的补丁。
会注意到新的 manifest 将镜像 tag 更新为`2.1.0`, 但是活动状态中包含了一个 sidecar 容器。

集群的活动状态被修改成了下面这样：

```yaml
containers:
  - name: server
    image: nginx:2.1.0
  - name: my-injected-sidecar
    image: my-cool-mesh:1.0.0
```

### 发布名称现在限制在 namespace 范围内

随着 Tiller 的移除， 每个版本的信息需要保存在某个地方。
在 Helm 2 中，是存储在 Tiller 相同的命名空间中。
实际上这意味着一个发布版本使用一个名称，其他发布不能使用相同的名称，
即使在不同的命名空间中也不行。

在 Helm 3 中，特定的版本信息作为发布本身存储在相同的命名空间中。
意味着用户现在可以在两个分开的命名空间中使用`helm install wordpress stable/wordpress`，
并且每个都能使用 `helm list` 改变当前命名空间。 (例如 `helm list --namespace foo`)。

与本地集群命名空间更好的一致性，使得 `helm list` 命令不再需要默认列出所有发布版本的列表。
取而代之的是，仅仅会在命名空间中列出当前 kubernetes 上下文的版本。
(也就是说运行`kubectl config view --minify`时会显示命名空间). 也就意味着您在执行`helm list`时必须提供
`--all-namespaces` 标识才能获得和 Helm 2 同样的结果。

### 作为默认存储器的密钥

在 Helm 3 中, 密钥被作为[默认存储驱动](https://helm.sh/zh/docs/topics/advanced#后端存储)使用。
Helm 2 默认使用 ConfigMaps 记录版本信息。在 Helm 2.7.0 中，新的存储后台使用密钥来存储版本信息，
现在是 Helm 3 的默认设置。

Helm 3 默认允许更改密钥作为额外的安全措施在 Kubernetes 中和密钥加密一起保护 chart。

[静态加密密钥](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)
在 Kubernetes 1.7 中作为 alpha 特性可以使用了，在 Kubernetes 1.13 中变成了稳定特性。
这允许用户静态加密 Helm 的发布元数据，同时也是一个类似 Vault 的以后可扩展的良好起点。

### 更改了 Go 的 path 导入

在 Helm 3 中，Helm 将 Go 的 import 路径从`k8s.io/helm`切换到了`helm.sh/helm/v3`。如果你打算
升级到 Helm 3 的 Go 客户端库，确保你已经更改了 import 路径。

### Capabilities

`.Capabilities`内置对象会在已经简化的渲染阶段生效。

[内置对象](https://helm.sh/zh/docs/chart_template_guide/builtin_objects/)

### 使用 Json 格式验证 Chart Values

chart values 现在可以使用 JSON 结构了。这保证用户提供 value 可以按照 chart 维护人员设置的结构排列，
并且当用户提供了错误的 chart value 时会有更好错误提示。

当调用以下命令时会进行 JSON 格式验证：

- `helm install`
- `helm upgrade`
- `helm template`
- `helm lint`

查看 [格式文档](https://docs.helm.sh/zh/docs/topics/charts#架构文件) 了解更多信息。

### 将 `requirements.yaml` 合并到了 `Chart.yaml`

Chart 依赖体系从 requirements.yaml 和 requirements.lock 移动到 Chart.yaml
和 Chart.lock。我们推荐在 Helm 3 的新 chart 中使用新格式。不过 Helm 3 依然可以识别
Chart API 版本 1 (`v1`) 并且会加载已有的 `requirements.yaml` 文件。

Helm 2 中，`requirements.yaml` 看起来是这样的:

```yaml
dependencies:
  - name: mariadb
    version: 5.x.x
    repository: https://charts.helm.sh/stable
    condition: mariadb.enabled
    tags:
      - database
```

Helm 3 中， 依赖使用了同样的表达方式，现在`Chart.yaml`是这样的：

```yaml
dependencies:
  - name: mariadb
    version: 5.x.x
    repository: https://charts.helm.sh/stable
    condition: mariadb.enabled
    tags:
      - database
```

Chart 会依然下载和放置在 `charts/` 目录， 因此 `charts/` 目录中的子 chart 不作修改即可继续工作。

### Name (或者 --generate-name) 安装时是必需的

Helm 2 中，如果没有提供名称， 会自动生成一个名称。在生产环境，这被证明是一个麻烦事而不是一个有用的特性。
而在 Helm 3 中，如果 `helm install` 没有提供 name，会抛异常。

如果仍然需要一个自动生成的名称，您可以使用 `--generate-name` 创建。

### 推送 Chart 到 OCI 注册中心

这是一个 Helm 3 中的实验性特性。使用时需要设置环境变量 `HELM_EXPERIMENTAL_OCI=1`。

Chart 仓库在较高层次上是一个存储和分发 Chart 的地址。Helm 客户端打包并将 Chart 推送到 Chart 仓库中。
简单来说，Chart 仓库就是一个基本的 HTTP 服务器用来存放 index.yaml 文件和打包的 chart。

Chart 仓库 API 满足最基本的需求有一些好处，但是有些缺点开始显现出来：

- Chart 仓库很难在生产环境抽象出大部分的安全性实现。在生产环境有一个认证和授权的标准 API 就显得格外重要。
- Helm Chart 的初始化工具用来签名和验证 chart 的完整性和来源，在 chart 的发布过程中是可选的。
- 在多客户场景中，同一个 chart 可以被其他客户上传，同样的内容会被存储两次。chart 仓库可以更加智能地处理
  这个问题，但并不是正式规范的一部分。
- 在安全的多客户实现中使用单一的索引文件进行搜索、元数据信息存放和获取 chart 会变得困难和笨拙。

Docker 的分发项目（也称作 Docker 注册中心 v2）是 Docker 注册项目的继承者。 很多主要的云供应商都提供项目
分发，很多供应商都提供相同的产品， 这个分发项目得益于多年的强化、安全性实践和对抗测试。

请查看 `helm help chart` 和 `helm help registry` 了解如何打包 chart 并推送到 Docker 注册中心的更多信息。

更多信息请查看 [注册中心](https://docs.helm.sh/zh/docs/topics/registries/)页面。

### 移除了`helm serve`

`helm serve` 命令可以在你本地机器运行一个 Chart 仓库用于开发目的。
然而作为一个开发工具并没有受到太多利用，并且设计上有很多问题。最终我们决定移除它，
拆分成了一个插件。

对于 `helm serve` 的类似经历，可以查看本地文件系统存储选项在
[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)
和 [servecm plugin](https://github.com/jdolitsky/helm-servecm).

### Library chart 支持

Helm 3 支持的一类 chart 称为 “library chart”。 这是一个被其他 chart 共享的 chart，
但是它自己不能创建发布组件。library chart 的模板只能声明 `define` 元素。 全局范围
内的非`define`内容会被简单忽略。这允许用户复用和共享可在多个 chart 中重复使用的代码片段。
避免冗余和保留 chart [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)。

Library chart 在 Chart.yaml 的依赖指令中声明，安装和管理与其他 chart 一致。

```yaml
dependencies:
  - name: mylib
    version: 1.x.x
    repository: quay.io
```

我们很高兴对开发者开放了这个特性的使用案例，以及 library charts 使用的最佳实践。

### Chart.yaml api 版本切换

随着对 library chart 的支持以及 requirements.yaml 合并到 Chart.yaml，客户端可以识别 Helm 2 的包格式而不理解
这些新特性。因此我们将 Chart.yaml 的 apiVersion 从 `v1` 切换到了 `v2`。

`helm create` 现在使用使用新格式创建 chart，默认的 apiVersion 也切换到了这里。

客户端希望同时支持两个版本，进而能够检查 Chart.yaml 的`apiVersion`字段去理解如何解析包格式。

### XDG 基本目录支持

[XDG 基本目录规范](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)
是一个定义了配置、数据和缓存文件应该存储在文件系统什么位置的可移植标准。

Helm 2 中，Helm 将所有的信息存储在 `~/.helm` (被亲切地称为`helm home`)，可以通过设置 `$HELM_HOME`
环境变量修改，或者使用全局参数 `--home`。

Helm 3 中，Helm 现在遵守 XDG 基本目录规范使用以下环境变量：

- `$XDG_CACHE_HOME`
- `$XDG_CONFIG_HOME`
- `$XDG_DATA_HOME`

Helm 插件仍然使用 `$HELM_HOME` 作为 `$XDG_DATA_HOME` 的别名，以便希望将`$HELM_HOME`作为过渡环境的变量来保证向后兼容性。

一些新的环境变量也通过插件环境变量来兼容以下更改：

- `$HELM_PATH_CACHE` 针对缓存路径
- `$HELM_PATH_CONFIG` 针对配置路径
- `$HELM_PATH_DATA` 针对 data 路径

如果 Helm 插件期望支持 Helm 3，建议使用新的环境变量。

### CLI 命令重新命名

为了更好地从包管理器中调整不当措辞，`helm delete`被重命名为`helm uninstall`。
`helm delete` 依然作为 `helm uninstall` 的别名保留， 因此其他格式也能使用。

Helm 2 中为了清除版本清单，必须提供`--purge`参数。这个功能现在是默认使用的。
为保留之前的操作行为，要使用 `helm uninstall --keep-history`。

另外，其他一些重命名的命令提供了以下约定：

- `helm inspect` -> `helm show`
- `helm fetch` -> `helm pull`

这些命令都保留了老的动词作为别名，因此您能够使用任意一种格式。

### 自动创建 namespace

当用命名空间创建版本时，命名空间不存在，Helm 2 会创建一个命名空间。
Helm 3 中沿用了其他 Kubernetes 工具的形式，如果命名空间不存在，就返回错误。
如果您明确指定 `--create-namespace` 参数，Helm 3 会创建一个命名空间。

### .Chart.ApiVersion 是怎么回事?

Helm 针对缩略语遵循驼峰命名的典型惯例。我们已经在代码的其他位置做了处理，比如
`.Capabilities.APIVersions.Has`。Helm v3 中，我们将 `.Chart.ApiVersion`
更正成了`.Chart.APIVersion`。

## 安装

### 为什么没有针对 Fedora 和其他 Linux 发行版的 Helm 原生包?

Helm 项目不维护针对操作系统和环境的包。Helm 社区如果觉得需要提供原生包时，可以提供原生包。
这是 Homebrew 开始列出的方案。如果您有兴趣维护一个包，我们会很高兴的。

### 为什么会提供 `curl ...|bash` 脚本?

我们的仓库(`scripts/get-helm-3`)中有个脚本可以作为 `curl ..|bash` 脚本执行。
使用 HTTPS 传输，The transfers are all protected by HTTPS, 并且这个脚本对它获取到包做一些审核。
然而这个脚本有任何 shell 脚本的所有常见危险。

我们提供这个脚本因为它很好用，但是我们建议用户先仔细阅读这个脚本。不过我们真正想要的是更好的 Helm 打包版本。

### 我如何将 Helm 客户端文件放置在其他位置而不是默认位置?

Helm 使用 XDG 结构存储文件。这些环境变量可以用来覆盖默认位置:

- `$XDG_CACHE_HOME`: 设置另一个存储缓存文件的位置。
- `$XDG_CONFIG_HOME`: 设置另一个存储 Helm 配置的位置。
- `$XDG_DATA_HOME`: 设置另一个存储 Helm 数据的位置。

注意，如果有已经存在的仓库，您需要使用 `helm repo add...` 重新添加。

## 卸载

### 我想删除我本地 Helm. 全部文件在什么位置？

连同 `helm` 二进制文件一起，Helm 将文件存储在以下位置：

- $XDG_CACHE_HOME
- $XDG_CONFIG_HOME
- $XDG_DATA_HOME

下面这个表格按照操作系统给出了对应的默认文件夹位置：

| Operating System | Cache Path                  | Configuration Path               | Data Path                 |
| ---------------- | --------------------------- | -------------------------------- | ------------------------- |
| Linux            | `$HOME/.cache/helm`         | `$HOME/.config/helm`             | `$HOME/.local/share/helm` |
| macOS            | `$HOME/Library/Caches/helm` | `$HOME/Library/Preferences/helm` | `$HOME/Library/helm`      |
| Windows          | `%TEMP%\helm`               | `%APPDATA%\helm`                 | `%APPDATA%\helm`          |

## 故障排除

### 在 GKE (Google Container Engine) 我遇到了 "No SSH tunnels currently open"

```consol
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

另一个错误消息的形式：

```consol
Unable to connect to the server: x509: certificate signed by unknown authority
```

这个问题是说您本地的 Kubernetes 配置文件需要有正确的证书。

当你在 GKE 上创建集群时，它会为您提供一个证书，包括 SSL 证书和证书颁发机构。
这些需要放在 Kubernetes 配置文件中（默认位置: `~/.kube/config`），保证 `kubectl` 和 `helm` 可以访问他们。

### 从 Helm 2 迁移后， `helm list` 仅显示部分（或者不显示）我的发布版本

您很可能忽略了一个事实：Helm 3 现在使用集群的命名空间来确定版本范围。 这意味着所有涉及版本的命令您都必须：

- 在活动的 kubernetes 上下文中需要依赖当前的命名空间 (如 `kubectl config view --minify` 命令所述)，
- 使用 `--namespace`/`-n` 参数指定正确命名空间，或者
- 对于 `helm list` 命令，指定 `--all-namespaces`/`-A` 参数

这适用于 `helm ls`、 `helm uninstall` 以及其他所有涉及版本的 `helm` 命令。

### 为什么在 macOS 上`/etc/.mdns_debug`文件可以访问？

我们了解到 macOS 上的一个案例是 Helm 会试图访问`/etc/.mdns_debug`文件。
如果文件存在，Helm 会在文件句柄执行的时候保持打开状态。

这是因为 macOS 的 MDNS 库。它尝试去加载这个文件读取 debug 设置（如果已经启用）。
这个文件句柄可能不会保持打开，且这个问题已经报告给了苹果。 然而这种行为是 macOS 导致的，并不是 Helm。

如果你不想让 Helm 加载这个文件，你可以将 Helm 编译成一个静态库而不使用主机网络堆栈。
这样做会导致 Helm 的二进制文件大小膨胀，但是会阻止这个文件打开。

这个问题最初被标记为潜在的安全问题。但后来已经确定，这种行为不存在任何缺陷或漏洞。

### helm 仓库使用时添加仓库失败

在 Helm 3.3.1 及之前版本，`helm repo add <reponame> <url>`在你添加已经存在的仓库时不会输入内容。
如果仓库已经存在，`--no-update` 参数会报错。

在 Helm3.3.2 及之后版本，试图添加一个已存在的仓库时会报以下错误：

`Error: repository name (reponame) already exists, please specify a different name`

现在这个默认行为是相反的。`--no-update` 现在被忽略。当您想替换（覆盖）已有仓库时，您可以使用 `--force-update`。

这是由于一个安全修复做出的重大更改，详情见[Helm 3.3.2 release notes](https://github.com/helm/helm/releases/tag/v3.3.2)。

### 开启 Kubernetes 客户端日志

调试 Kubernetes 客户端打印日志时，可以使用[klog](https://pkg.go.dev/k8s.io/klog) 参数。使用`-v`可以设置日志级别应用于大多数场景。

例如：

```consol
helm list -v 6
```

### Tiller 停止安装且无法访问

Helm 发布之前可以从 <https://storage.googleapis.com/kubernetes-helm/> 获取。如["Announcing
get.helm.sh"](https://helm.sh/blog/get-helm-sh/)中所述，官方地址 2019 年 6 月已变更。
[GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller)
可以获取所有旧的 Tiller 镜像。

如果你想从原来的存储位置下载 Helm 旧版本，你会发现找不到了：

```console
<Error>
    <Code>AccessDenied</Code>
    <Message>Access denied.</Message>
    <Details>Anonymous caller does not have storage.objects.get access to the Google Cloud Storage object.</Details>
</Error>
```

[原有 Tiller 镜像地址](https://gcr.io/kubernetes-helm/tiller) 会在 2021 年 8 月开始删除镜像。我们已经增加了可用地址在
[GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller)。
比如下载 v2.17.0，用

`https://get.helm.sh/helm-v2.17.0-linux-amd64.tar.gz` 替换

`https://storage.googleapis.com/kubernetes-helm/helm-v2.17.0-linux-amd64.tar.gz`

使用 Helm v2.17.0 初始化：

`helm init —upgrade`

或者如果需要另一个版本，使用 --tiller-image 替换默认位置安装特定的 Helm v2 版本：

`helm init --tiller-image ghcr.io/helm/tiller:v2.16.9`

**注意** Helm 维护人员建议迁移到当前支持的 Helm 版本。Helm v2.17.0 是 Helm 2 的最终版本；Helm
v2 自 2020 年 11 月起便不再支持，具体细节请查看[Helm 2 和 Charts Project 已不再支持](https://helm.sh/blog/helm-2-becomes-unsupported/)。
自那以后，Helm 已经被发现很多的 CVE，这些漏洞已经在 Helm v3 修复，但不会再给 Helm v2 打补丁。现在查看
[Helm 当前已发布的建议列表](https://github.com/helm/helm/security/advisories?state=published)并计划
[迁移到 Helm v3](https://helm.sh/docs/topics/v2_v3_migration/#helm)吧。
