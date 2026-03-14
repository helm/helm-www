---
title: 依赖
description: 涵盖 chart 依赖的最佳实践
sidebar_position: 4
---

本节介绍在 `Chart.yaml` 中声明 `dependencies` 的最佳实践。

## 版本

尽可能使用版本范围而不是固定版本。建议默认使用补丁级别的版本匹配：

```yaml
version: ~1.2.3
```

这会匹配 `1.2.3` 以及该版本的任何补丁。也就是说，`~1.2.3` 相当于 `>= 1.2.3, < 1.3.0`。

完整的版本匹配语法请参阅 [semver 文档](https://github.com/Masterminds/semver#checking-version-constraints)。

### 预发布版本

上述版本约束不会匹配预发布版本。例如，`version: ~1.2.3` 会匹配 `version: ~1.2.4`，但不会匹配 `version: ~1.2.3-1`。
以下写法可同时匹配预发布版本和补丁版本：

```yaml
version: ~1.2.3-0
```

### 仓库 URL

尽可能使用 `https://` 仓库 URL，其次是 `http://` URL。

如果仓库已添加到仓库索引文件中，可以使用仓库名称作为 URL 的别名。使用 `alias:` 或 `@` 后跟仓库名称。

文件 URL（`file://...`）被视为一种"特例"，用于通过固定部署流水线组装的 chart。

使用[下载器插件](../topics/plugins.md#downloader-plugins)时，URL 方案将特定于该插件。注意，chart 的用户需要安装支持该方案的插件才能更新或构建依赖。

当 `repository` 字段为空时，Helm 无法执行依赖管理操作。此时 Helm 会假定依赖位于 `charts` 文件夹的子目录中，目录名称与依赖的 `name` 属性相同。

## 条件和标签

条件或标签应添加到任何**可选**的依赖中。注意，`condition` 的默认值为 `true`。

条件的首选格式是：

```yaml
condition: somechart.enabled
```

其中 `somechart` 是依赖 chart 的名称。

当多个子 chart（依赖）共同提供可选或可替换的功能时，这些 chart 应共享相同的标签。

例如，如果 `nginx` 和 `memcached` 共同为主应用提供性能优化功能，且启用该功能时需要两者同时存在，则它们都应包含如下标签：

```yaml
tags:
  - webaccelerator
```

这样用户就可以通过一个标签来启用或禁用该功能。
