---
title: 依赖
description: 涵盖chart依赖的最佳实践
sidebar_position: 4
---

最佳实践的这部分阐述`Chart.yaml`中声明的`dependencies`。

## 版本

如果有可能的话，使用版本范围而不是某个固定的版本。建议的默认设置时使用补丁级别版本的匹配：

```yaml
version: ~1.2.3
```

这样会匹配 `1.2.3`以及该版本的任何补丁，也就是说，`~1.2.3`相当于`>= 1.2.3, < 1.3.0`

关于完整的版本匹配语法，请参照[语义版本文档](https://github.com/Masterminds/semver#checking-version-constraints)。

### 预发布版本

上述版本约束不适用于预发布版本。比如 `version: ~1.2.3` 可以匹配 `version: ~1.2.4` 但不能匹配 `version: ~1.2.3-1`。
预发布及补丁级别匹配如下：

```yaml
version: ~1.2.3-0
```

### 仓库URL

如果可能的话，使用 `https://` 仓库URL，而不是`http://` URL。

如果这个仓库已经被添加到仓库索引文件中，仓库名称可以作为URL的别名。使用`alias:` 或 `@` 后跟仓库名称。

文件URL(`file://...`) 被认为是一种有固定部署管道组装的chart的“特例”。

当使用[下载器插件](https://helm.sh/zh/docs/topics/plugins#下载插件)时，URL会使用特定于插件的方案。
注意，chart的用户需要安装一个支持该方案的插件来更新或构建依赖关系。

当`repository`字段为空时，Helm无法对依赖项执行依赖管理操作。在这种场景下，Helm假定依赖关系位于`charts`
文件夹的子目录中，名称与依赖关系的`name`属性相同。

## 条件和标签

条件和标签可以被添加到任意 _可选的_ 依赖中。

条件的首先格式是：

```yaml
condition: somechart.enabled
```

`somechart`是依赖的chart名称。

当多个子chart（依赖）一起提供可选或可交换的特性时，这些chart应该共享相同的标签。

比如，如果`nginx` 和 `memcached`在chart中一起提供性能优化，且需要在使用该功能时同时存在，则都应该有如下的标签部分：

```yaml
tags:
  - webaccelerator
```

这允许用户使用一个标签打开和关闭该功能。
