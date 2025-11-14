---
sidebar_position: 1
sidebar_label: Helm 4 概览
---

# Helm 4 概览

Helm v4 代表了从 v3 的重大进化，引入了破坏性变更、新的架构模式和增强功能，同时保持对 chart 的向后兼容性。

有关计划的 Helm 4 发布阶段的更多信息，请参阅 [Helm v4 之路](https://helm.sh/blog/path-to-helm-v4/)。

## 新功能

本节概述了 Helm 4 的新功能，包括破坏性变更、主要新功能和其他改进。有关完整的技术详细信息，请参阅[完整变更日志](https://helm.sh/docs/changelog/)。

### 摘要

- **新功能**：基于 Wasm 的插件、kstatus 监视器、OCI 摘要支持、多文档值、JSON 参数
- **架构变更**：插件系统完全重新设计、包重构、CLI 标志重命名、迁移到版本化包、chart v3 支持、基于内容的缓存
- **现代化**：slog 迁移、Go 1.24 更新、依赖清理
- **安全性**：增强的 OCI/registry 支持、TLS 改进

### 破坏性变更

#### Post-renderer 实现为插件
Post-renderer 现在实现为插件。通过此更改，不再可能直接将可执行文件传递给 `helm render --post-renderer`，而必须传递插件名称。这可能需要更新现有的任何 post-renderer 工作流程。

### 新功能

#### 插件系统大修
Helm 4 引入了可选的基于 WebAssembly 的运行时，以增强安全性和扩展功能。现有插件继续工作，但新运行时为插件自定义开放了更多 Helm 核心行为。Helm 4 推出了三种插件类型：CLI 插件、getter 插件和 post-renderer 插件，以及一个支持新插件类型以自定义其他核心功能的系统。请参阅 [HIP-0026 插件系统](https://github.com/helm/community/blob/main/hips/hip-0026.md) 和 [Helm 4 示例插件](https://github.com/scottrigby/h4-example-plugins)。

:::tip
现有插件像以前一样工作。新的 WebAssembly 运行时是可选的，但建议使用以增强安全性。
:::

#### 更好的资源监控
新的 kstatus 集成显示部署的详细状态。使用复杂应用程序进行测试，看看它是否能更好地捕获问题。

#### 增强的 OCI 支持
通过摘要安装 chart 以获得更好的供应链安全性。例如，`helm install myapp oci://registry.example.com/charts/app@sha256:abc123...`。不会安装摘要不匹配的 chart。

#### 多文档值
将复杂值拆分到多个 YAML 文件中。非常适合测试不同的环境配置。

#### 服务器端应用
当多个工具管理相同资源时，更好的冲突解决。在有操作器（operators）或其他控制器（controllers）的环境中进行测试。

#### 自定义模板函数
通过插件扩展 Helm 的模板功能。非常适合组织特定的模板需求。

#### Post-Renderer 作为插件
Post-renderer 实现为插件，提供更好的集成和更多功能。

#### 稳定的 SDK API
API 破坏性变更现已完成。测试它，破坏它，给我们反馈！API 还支持其他 chart 版本，为即将推出的 Charts v3 中的新功能开辟了可能性。

#### Charts v3

即将推出。v2 chart 继续不变地工作。

### 改进

#### 性能
更快的依赖解析和新的基于内容的 chart 缓存。

#### 错误消息
更清晰、更有用的错误输出。

#### Registry 身份验证
对私有 registry 更好的 OAuth 和令牌支持。

#### CLI 标志重命名

一些常见的 CLI 标志被重命名：
- `--atomic` → `--rollback-on-failure`
- `--force` → `--force-replace`

更新使用这些重命名 CLI 标志的任何自动化。

## 升级到 Helm 4

虽然我们努力让 Helm 4 对每个人都坚如磐石，但 Helm 4 是全新的。为此，在升级之前，我们在下面添加了一些提示，用于在使用现有工作流程测试 Helm 4 时要注意的特定事项。一如既往，我们欢迎关于什么正常工作、什么被破坏了、以及什么可以改进的所有反馈。

### 高优先级
* 测试您现有的 chart 和发布，以验证在v4依然正常工作。
* 测试所有 3 种插件类型（CLI、getter、post-renderer）。
* 尝试使用新运行时构建 WebAssembly 插件（请参阅[示例插件](https://github.com/scottrigby/h4-example-plugins)）
* SDK 用户：测试现在稳定的 API。尝试破坏它并分享您的反馈。
* 测试您的 CI/CD 管道并修复重命名 CLI 标志的任何脚本错误。
* 测试您的 post-renderer 集成。
* 在您的 OCI 工作流程中测试 registry 身份验证和 chart 安装。

### 其他
* 测试其他新功能，包括多文档值、基于摘要的安装和自定义模板函数。
* 使用大型、复杂的 chart 测试 Helm 4 的性能，看看对于您的工作负载是否明显更快。
* 尝试故意破坏事物，看看更新的错误消息是否有用。

### 反馈
* 您希望看到添加哪些其他插件类型来自定义 Helm 核心功能？
* 随着 API 支持其他 chart 版本，您希望在 Charts v3 中看到哪些新功能？

## 如何提供反馈

发现问题？有建议？我们希望在 11 月发布之前听到您的意见：

### GitHub Issues

查看 Helm 仓库中的[开放问题和功能请求列表](https://github.com/helm/helm/issues)。对现有项目添加评论，或[创建新的](https://github.com/helm/helm/issues/new/choose)问题和请求。

### 社区 Slack

加入 [Kubernetes Slack](https://slack.kubernetes.io/) 频道：
- `#helm-dev` 用于开发讨论
- `#helm-users` 用于用户支持和测试反馈

### 每周开发会议

每周四上午 9:30 PT 在 [Zoom](https://zoom.us/j/696660622?pwd=MGsraXZ1UkVlTkJLc1B5U05KN053QT09) 上与维护者进行实时讨论。

有关更多选项，请参阅 Helm 社区[沟通详情](https://github.com/helm/community/blob/main/communication.md)。
