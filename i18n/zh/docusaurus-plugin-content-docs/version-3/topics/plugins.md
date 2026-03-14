---
title: Helm 插件指南
description: 介绍如何使用和创建插件来扩展 Helm 功能。
sidebar_position: 12
---

Helm 插件是一个可以通过 `helm` CLI 访问的工具，但不是 Helm 的内置代码。

已有插件可以在 [相关项目](/community/related#helm-plugins) 部分找到，也可以搜索 [GitHub](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories)。

本指南介绍如何使用和创建插件。

## 概述

Helm 插件是与 Helm 无缝集成的附加工具。插件提供一种扩展 Helm 核心特性集的方法，但不需要每个新的特性都用 Go 编写并加入核心工具中。

Helm 插件有以下特性：

- 可以在不影响 Helm 核心工具的情况下添加和移除。
- 可以用任意编程语言编写。
- 与 Helm 集成，并展示在 `helm help` 和其他地方。

Helm 插件位于 `$HELM_PLUGINS`。你可以使用 `helm env` 命令找到该变量的当前值，包括未在环境中设置时的默认值。

Helm 插件模型部分基于 Git 的插件模型。为此，你有时可能听到 `helm` 被称为 _porcelain_ 层，而插件是 _plumbing_ 层。这是一种简写方式，表示 Helm 提供用户体验和顶层处理逻辑，而插件执行所需操作的"细节工作"。

## 安装插件

使用 `helm plugin install <path|url>` 命令安装插件。你可以传入本地文件系统上的插件路径或远程 VCS 仓库的 URL。`helm plugin install` 命令会将给定路径/URL 的插件克隆或复制到 `$HELM_PLUGINS`。如果从 VCS 安装，可以使用 `--version` 参数指定版本。

```console
$ helm plugin install https://github.com/adamreese/helm-env
```

如果是插件 tar 包，只需将插件解压到 `$HELM_PLUGINS` 目录。也可以直接从 URL 安装 tar 包插件：`helm plugin install https://domain/path/to/plugin.tar.gz`

## 插件文件结构

在很多方面，插件类似于 chart。每个插件都有一个包含 `plugin.yaml` 文件的顶级目录。可能存在其他文件，但只有 `plugin.yaml` 文件是必需的。

```console
$HELM_PLUGINS/
  |- last/
      |- plugin.yaml
```

## plugin.yaml 文件

plugin.yaml 文件是插件的必需文件。它包含以下字段：

```yaml
name: 插件名称（必需）
version: SemVer 2 版本号（必需）
usage: 在帮助中显示的单行使用说明
description: 在 helm help 等位置显示的详细描述
ignoreFlags: 忽略从 Helm 传入的参数
platformCommand: # 根据平台配置要执行的命令
  - os: 操作系统匹配，可以为空或省略以匹配所有操作系统
    arch: 架构匹配，可以为空或省略以匹配所有架构
    command: 要执行的插件命令
    args: 插件命令参数
command: （已弃用）插件命令，请改用 platformCommand
platformHooks: # 根据平台配置插件生命周期钩子
  install: # 安装生命周期命令
    - os: 操作系统匹配，可以为空或省略以匹配所有操作系统
      arch: 架构匹配，可以为空或省略以匹配所有架构
      command: 要执行的插件安装命令
      args: 插件安装命令参数
  update: # 更新生命周期命令
    - os: 操作系统匹配，可以为空或省略以匹配所有操作系统
      arch: 架构匹配，可以为空或省略以匹配所有架构
      command: 要执行的插件更新命令
      args: 插件更新命令参数
  delete: # 删除生命周期命令
    - os: 操作系统匹配，可以为空或省略以匹配所有操作系统
      arch: 架构匹配，可以为空或省略以匹配所有架构
      command: 要执行的插件删除命令
      args: 插件删除命令参数
hooks: # （已弃用）插件生命周期钩子，请改用 platformHooks
  install: 安装插件的命令
  update: 更新插件的命令
  delete: 删除插件的命令
downloaders: # 配置下载器能力
  - command: 要调用的命令
    protocols:
      - 支持的协议方案
```

### `name` 字段

`name` 是插件的名称。当 Helm 执行此插件时使用此名称（例如，`helm NAME` 会调用此插件）。

_`name` 应该匹配目录名称。_ 在上面的例子中，这意味着 `name: last` 的插件应该包含在名为 `last` 的目录中。

`name` 的限制：

- `name` 不能与现有的 `helm` 顶级命令重复。
- `name` 的字符必须限制为 ASCII a-z、A-Z、0-9、`_` 和 `-`。

### `version` 字段

`version` 是插件的 SemVer 2 版本。`usage` 和 `description` 都用于生成命令的帮助文本。

### `ignoreFlags` 字段

`ignoreFlags` 开关告诉 Helm _不要_ 将参数传递给插件。因此，如果插件使用 `helm myplugin --foo` 调用且 `ignoreFlags: true`，那么 `--foo` 会被静默丢弃。

### `platformCommand` 字段

`platformCommand` 配置插件被调用时将执行的命令。你不能同时设置 `platformCommand` 和 `command`，否则会导致错误。以下规则用于决定使用哪个命令：

- 如果 `platformCommand` 存在，它将被使用。
  - 如果 `os` 和 `arch` 都匹配当前平台，搜索将停止并使用该命令。
  - 如果 `os` 匹配且 `arch` 为空，将使用该命令。
  - 如果 `os` 和 `arch` 都为空，将使用该命令。
  - 如果没有匹配，Helm 会报错退出。
- 如果 `platformCommand` 不存在但已弃用的 `command` 存在，将使用 `command`。
  - 如果命令为空，Helm 会报错退出。

### `platformHooks` 字段

`platformHooks` 配置插件针对生命周期事件将执行的命令。你不能同时设置 `platformHooks` 和 `hooks`，否则会导致错误。以下规则用于决定使用哪个钩子命令：

- 如果 `platformHooks` 存在，它将被使用，并处理生命周期事件的命令。
  - 如果 `os` 和 `arch` 都匹配当前平台，搜索将停止并使用该命令。
  - 如果 `os` 匹配且 `arch` 为空，将使用该命令。
  - 如果 `os` 和 `arch` 都为空，将使用该命令。
  - 如果没有匹配，Helm 将跳过该事件。
- 如果 `platformHooks` 不存在但已弃用的 `hooks` 存在，将使用生命周期事件的命令。
  - 如果命令为空，Helm 将跳过该事件。

## 构建插件

下面是一个简单插件的 YAML，用于获取最后一个 release 名称：

```yaml
name: last
version: 0.1.0
usage: get the last release name
description: get the last release name
ignoreFlags: false
platformCommand:
  - command: ${HELM_BIN}
    args:
      - list
      - --short
      - --max=1
      - --date
      - -r
```

插件可能需要额外的脚本和可执行文件。脚本可以包含在插件目录中，可执行文件可以通过钩子下载。以下是一个示例插件：

```console
$HELM_PLUGINS/
  |- myplugin/
    |- scripts/
      |- install.ps1
      |- install.sh
    |- plugin.yaml
```

```yaml
name: myplugin
version: 0.1.0
usage: example plugin
description: example plugin
ignoreFlags: false
platformCommand:
  - command: ${HELM_PLUGIN_DIR}/bin/myplugin
  - os: windows
    command: ${HELM_PLUGIN_DIR}\bin\myplugin.exe
platformHooks:
  install:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
  update:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
      args:
        - -u
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
        - -Update
```

环境变量会在插件执行前被插值。上述模式说明了表示插件程序所在位置的首选方法。

### 插件命令

以下是使用插件命令的一些策略：

- 如果插件包含可执行文件，`platformCommand:` 的可执行文件应该打包在插件目录中或通过钩子安装。
- `platformCommand:` 或 `command:` 行会在执行前展开所有环境变量。`$HELM_PLUGIN_DIR` 会指向插件目录。
- 命令本身不是在 shell 中执行的。所以你不能写成一行 shell 脚本。
- Helm 在环境变量中注入了大量配置。查看环境变量以了解可用信息。
- Helm 对插件的语言不做任何假设。你可以用任何你喜欢的语言编写。
- 命令负责实现 `-h` 和 `--help` 的特定帮助文本。Helm 会在 `helm help` 和 `helm help myplugin` 中使用 `usage` 和 `description`，但不会处理 `helm myplugin --help`。

### 测试本地插件

首先你需要找到你的 `HELM_PLUGINS` 路径，运行以下命令：

``` bash
helm env
```

切换到 `HELM_PLUGINS` 设置的目录。

现在你可以添加一个指向插件构建输出的符号链接，在这个例子中我们为 `mapkubeapis` 创建链接。

``` bash
ln -s ~/GitHub/helm-mapkubeapis ./helm-mapkubeapis
```

## 下载器插件

默认情况下，Helm 可以使用 HTTP/S 拉取 Chart。从 Helm 2.4.0 开始，插件有一种特殊能力可以从任意来源下载 Chart。

插件应该在 `plugin.yaml` 文件（顶层）中声明这个特殊能力：

```yaml
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

如果安装了这样的插件，Helm 可以通过调用 `command` 使用指定的协议方案与仓库进行交互。特殊仓库的添加与常规仓库类似：`helm repo add favorite myprotocol://example.com/`。特殊仓库的规则与常规仓库相同：Helm 必须能够下载 `index.yaml` 文件以发现和缓存可用 Chart 的列表。

已定义的命令将使用以下格式调用：`command certFile keyFile caFile full-URL`。SSL 证书来自仓库定义，存储在 `$HELM_REPOSITORY_CONFIG`（即 `$HELM_CONFIG_HOME/repositories.yaml`）。下载器插件应将原始内容输出到 stdout，并在 stderr 报告错误。

下载器命令也支持子命令或参数，允许你在 `plugin.yaml` 中指定，例如 `bin/mydownloader subcommand -d`。如果你想为主插件命令和下载器命令使用相同的可执行文件，但每个使用不同的子命令，这将非常有用。

## 环境变量

当 Helm 执行插件时，会将外部环境传递给插件，并且会注入一些额外的环境变量。

像 `KUBECONFIG` 这样的变量，如果在外部环境中设置了，则会为插件设置。

以下变量保证会被设置：

- `HELM_PLUGINS`：插件目录的路径。
- `HELM_PLUGIN_NAME`：由 `helm` 调用的插件名称。所以 `helm myplug` 的短名称是 `myplug`。
- `HELM_PLUGIN_DIR`：包含插件的目录。
- `HELM_BIN`：`helm` 命令的路径（如用户执行的那样）。
- `HELM_DEBUG`：表示 helm 是否设置了 debug 标志。
- `HELM_REGISTRY_CONFIG`：注册表配置的位置（如果使用）。注意，Helm 与注册表的使用是实验性功能。
- `HELM_REPOSITORY_CACHE`：仓库缓存文件的路径。
- `HELM_REPOSITORY_CONFIG`：仓库配置文件的路径。
- `HELM_NAMESPACE`：给 `helm` 命令的命名空间（通常使用 `-n` 标志）。
- `HELM_KUBECONTEXT`：给 `helm` 命令的 Kubernetes 配置上下文名称。

另外，如果明确指定了 Kubernetes 配置文件，它将被设置为 `KUBECONFIG` 变量。

## 参数解析说明

当执行插件时，Helm 会解析全局标志供自己使用。这些标志都不会传递给插件。
- `--burst-limit`：转换为 `$HELM_BURST_LIMIT`
- `--debug`：如果指定，`$HELM_DEBUG` 设置为 `1`
- `--kube-apiserver`：转换为 `$HELM_KUBEAPISERVER`
- `--kube-as-group`：转换为 `$HELM_KUBEASGROUPS`
- `--kube-as-user`：转换为 `$HELM_KUBEASUSER`
- `--kube-ca-file`：转换为 `$HELM_KUBECAFILE`
- `--kube-context`：转换为 `$HELM_KUBECONTEXT`
- `--kube-insecure-skip-tls-verify`：转换为 `$HELM_KUBEINSECURE_SKIP_TLS_VERIFY`
- `--kube-tls-server-name`：转换为 `$HELM_KUBETLS_SERVER_NAME`
- `--kube-token`：转换为 `$HELM_KUBETOKEN`
- `--kubeconfig`：转换为 `$KUBECONFIG`
- `--namespace` 和 `-n`：转换为 `$HELM_NAMESPACE`
- `--qps`：转换为 `$HELM_QPS`
- `--registry-config`：转换为 `$HELM_REGISTRY_CONFIG`
- `--repository-cache`：转换为 `$HELM_REPOSITORY_CACHE`
- `--repository-config`：转换为 `$HELM_REPOSITORY_CONFIG`

插件 _应该_ 对 `-h` 和 `--help` 显示帮助文本然后退出。在所有其他情况下，插件可以根据需要使用参数。

## 提供 shell 自动补全

从 Helm 3.2 开始，作为 Helm 现有自动补全机制的一部分，插件可以选择性地提供 shell 自动补全支持。

### 静态自动补全

如果插件提供了自己的标志和/或子命令，可以通过在插件根目录中放置 `completion.yaml` 文件来通知 Helm。`completion.yaml` 文件格式如下：

```yaml
name: <pluginName>
flags:
- <flag 1>
- <flag 2>
validArgs:
- <arg value 1>
- <arg value 2>
commands:
  name: <commandName>
  flags:
  - <flag 1>
  - <flag 2>
  validArgs:
  - <arg value 1>
  - <arg value 2>
  commands:
     <以此类推，递归>
```

注意：

1. 所有部分都是可选的，但应在适用时提供。
2. 标志不应包含 `-` 或 `--` 前缀。
3. 可以且应该指定短标志和长标志。短标志不需要与其对应的长格式关联，但两种形式都应列出。
4. 标志不需要以任何方式排序，但需要列在文件子命令层次结构的正确位置。
5. Helm 现有的全局标志已由 Helm 的自动补全机制处理，因此插件不需要指定以下标志：`--debug`、`--namespace` 或 `-n`、`--kube-context` 和 `--kubeconfig`，或任何其他全局标志。
6. `validArgs` 列表提供了子命令后第一个参数的可能补全的静态列表。并非总是能事先提供这样的列表（参见下面的[动态补全](#动态补全)部分），在这种情况下可以省略 `validArgs` 部分。

`completion.yaml` 文件是完全可选的。如果没有提供，Helm 将不会为插件提供 shell 自动补全功能（除非插件支持[动态补全](#动态补全)）。另外，添加 `completion.yaml` 文件是向后兼容的，不会影响在旧版 helm 中使用插件的行为。

例如，对于 [`fullstatus 插件`](https://github.com/marckhouzam/helm-fullstatus)，它没有子命令但接受与 `helm status` 命令相同的标志，`completion.yaml` 文件是：

```yaml
name: fullstatus
flags:
- o
- output
- revision
```

一个更复杂的例子是 [`2to3 插件`](https://github.com/helm/helm-2to3)，它的 `completion.yaml` 文件是：

```yaml
name: 2to3
commands:
- name: cleanup
  flags:
  - config-cleanup
  - dry-run
  - l
  - label
  - release-cleanup
  - s
  - release-storage
  - tiller-cleanup
  - t
  - tiller-ns
  - tiller-out-cluster
- name: convert
  flags:
  - delete-v2-releases
  - dry-run
  - l
  - label
  - s
  - release-storage
  - release-versions-max
  - t
  - tiller-ns
  - tiller-out-cluster
- name: move
  commands:
  - name: config
    flags:
    - dry-run
```

### 动态补全

同样从 Helm 3.2 开始，插件可以提供自己的动态 shell 自动补全。动态 shell 自动补全是对无法事先定义的参数值或标志值的补全。例如，补全集群中当前可用的 helm release 名称。

对于支持动态自动补全的插件，必须在其根目录中提供一个名为 `plugin.complete` 的**可执行**文件。当 Helm 补全脚本需要插件的动态补全时，它将执行 `plugin.complete` 文件，传递需要补全的命令行。`plugin.complete` 可执行文件需要有逻辑来确定正确的补全选项，并将它们输出到标准输出以供 Helm 补全脚本使用。

`plugin.complete` 文件是完全可选的。如果没有提供，Helm 将不会为插件提供动态自动补全。另外，添加 `plugin.complete` 文件是向后兼容的，不会影响在旧版 helm 中使用插件的行为。

`plugin.complete` 脚本的输出应该是以换行分隔的列表，例如：

```console
rel1
rel2
rel3
```

当调用 `plugin.complete` 时，插件环境的设置与调用插件主脚本时相同。因此，变量 `$HELM_NAMESPACE`、`$HELM_KUBECONTEXT` 和所有其他插件变量都已设置，并且它们对应的全局标志会被移除。

`plugin.complete` 文件可以是任何可执行形式；它可以是 shell 脚本、Go 程序或任何其他 Helm 可以执行的程序。`plugin.complete` 文件 ***必须*** 对用户具有可执行权限。`plugin.complete` 文件 ***必须*** 以成功代码（值 0）退出。

在某些情况下，动态补全需要从 Kubernetes 集群获取信息。例如，`helm fullstatus` 插件需要 release 名称作为输入。在 `fullstatus` 插件中，它的 `plugin.complete` 脚本要提供当前 release 名称的补全，只需运行 `helm list -q` 并输出结果即可。

如果希望插件执行和插件补全使用相同的可执行文件，可以让 `plugin.complete` 脚本使用某些特殊参数或标志调用主插件可执行文件；当主插件可执行文件检测到特殊参数或标志时，它就知道要运行补全。在我们的例子中，`plugin.complete` 可以这样实现：

```sh
#!/usr/bin/env sh

# "$@" is the entire command-line that requires completion.
# It is important to double-quote the "$@" variable to preserve a possibly empty last parameter.
$HELM_PLUGIN_DIR/status.sh --complete "$@"
```

`fullstatus` 插件的实际脚本（`status.sh`）必须查找 `--complete` 标志，如果找到，则打印出正确的补全。

### 提示和技巧

1. Shell 会自动过滤掉与用户输入不匹配的补全选项。因此，插件可以返回所有相关的补全，而不需要移除与用户输入不匹配的选项。例如，如果命令行是 `helm fullstatus ngin<TAB>`，`plugin.complete` 脚本可以打印 *所有*（`default` 命名空间的）release 名称，而不仅仅是以 `ngin` 开头的；shell 只会保留以 `ngin` 开头的。
2. 为了简化动态补全支持，特别是如果你有一个复杂的插件，你可以让 `plugin.complete` 脚本调用你的主插件脚本并请求补全选项。参见上面的[动态补全](#动态补全)部分的例子。
3. 要调试动态补全和 `plugin.complete` 文件，可以运行以下命令查看补全结果：
    - `helm __complete <pluginName> <arguments to complete>`。例如：
    - `helm __complete fullstatus --output js<ENTER>`，
    - `helm __complete fullstatus -o json ""<ENTER>`
