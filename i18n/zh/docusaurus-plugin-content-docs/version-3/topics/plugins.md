---
title: Helm插件指南
description: 介绍如何使用和创建插件来扩展Helm功能。
sidebar_position: 12
---

Helm插件是一个可以通过`helm` CLI访问的工具，但不是Helm的内置代码。

已有插件可以搜索[GitHub](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories)。

该指南描述如何使用和创建插件。

## 概述

Helm插件是与Helm无缝集成的附加工具。插件提供一种扩展Helm核心特性集的方法，但不需要每个新的特性都用Go编写并加入核心工具中。

Helm插件有以下特性：

- 可以在不影响Helm核心工具的情况下添加和移除。
- 可以用任意编程语言编写。
- 与Helm集成，并展示在`helm help`和其他地方。

Helm插件存在与`$HELM_PLUGINS`。你可以找到该变量的当前值，包括不设置环境变量的默认值，使用`helm env`命令。

Helm插件模型部分基于Git的插件模型。为此，你有时可能听到`helm`已插件为基础被用作_porcelain_ 层。这是一种Helm提供用户体验和顶级处理逻辑的简写方式。
而插件执行所需操作的“细节工作”。

## 安装一个插件

插件使用 `$ helm plugin install <path|url>` 命令安装插件。你可以在本地文件系统上传一个路径或远程仓库url给插件。The `helm plugin install`
命令会克隆或拷贝给定路径的插件到 `$HELM_PLUGINS`。

```console
$ helm plugin install https://github.com/adamreese/helm-env
```

如果是插件tar包，仅需解压插件到`$HELM_PLUGINS`目录。也可以用tar包的url直接安装：
`helm plugin install https://domain/path/to/plugin.tar.gz`。

## 构建插件

在很多方面，插件类似于chart。每个插件有个顶级目录和一个`plugin.yaml`文件。

```console
$HELM_PLUGINS/
  |- last/
      |
      |- plugin.yaml
      |- last.sh

```

上述示例中，`last`插件包含在`last`目录中。有两个文件：`plugin.yaml`（必需）和一个可执行脚本，`last.sh`（可选）。

插件的核心是一个简单的YAML文件`plugin.yaml`。下面是一个插件YAML，用于获取最新的release名称：

```yaml
name: "last"
version: "0.1.0"
usage: "get the last release name"
description: "get the last release name"
ignoreFlags: false
command: "$HELM_BIN --host $TILLER_HOST list --short --max 1 --date -r"
platformCommand:
  - os: linux
    arch: i386
    command: "$HELM_BIN list --short --max 1 --date -r"
  - os: linux
    arch: amd64
    command: "$HELM_BIN list --short --max 1 --date -r"
  - os: windows
    arch: amd64
    command: "$HELM_BIN list --short --max 1 --date -r"
```

`name`是插件名称。当Helm执行此插件时使用此名称。（比如，`helm NAME`会调用此插件）。

上述示例中，_`name`应该匹配目录名称_，意味着`last`目录中应该包含 `name: last` 插件。

`name`的限制：

- `name` 无法复用现有的 `helm` 顶级命令。
- `name` 的字符必须限制为ASCII a-z， A-Z， 0-9， `_` 和 `-`。

`version` 是插件的语义化2的版本。 `usage` 和 `description` 用于生成命令的帮助文本。

`ignoreFlags` 开关告诉 Helm _不要_ 给插件传递的参数。因此如果一个插件使用 `helm myplugin --foo`调用且
`ignoreFlags: true`，那么`--foo`会被悄悄忽略。

最后，尤其重要的是 `platformCommand` 或 `command` 是插件调用时执行的命令。`platformCommand` 部分定义了命令在
系统/架构的特定变体。以下规则用于决定使用哪个命令：

- 如果`platformCommand`存在，会优先被搜索。
- 如果`os` 和 `arch` 匹配了当前平台，搜索会停止并使用命令。
- 如果`os`匹配且没有匹配 `arch` ，命令会被使用。
- 如果没有匹配`platformCommand`，会使用默认的`command`。
- 如果没有匹配 `platformCommand` 且不存在 `command`，Helm会报错退出。

环境变量会在插件执行前被插入。上述模式说明了表示插件所在位置的首选方法。

有一些使用插件命令的策略：

- 如果插件中包含可执行文件，可执行文件针对于 `platformCommand:`或`command:`命令，应该打包到插件目录中。
- `platformCommand:` 或者 `command:` 行会在执行之前展开任何环境变量。`$HELM_PLUGIN_DIR`会指向插件目录。
- 命令本身不是在shell中执行的。 所以不能一行一个shell脚本。
- Helm在环境变量中插入很多配置。查看环境变量获取可用信息。
- Helm对插件语言不做任何假设。你想写什么写什么。
- `-h` 和 `--help`命令负责实现特定的帮助文本。Helm会在`helm help` 和 `helm help myplugin`中使用`usage`
  和 `description`，但不处理`helm myplugin --help`。

## 下载插件

默认情况下，Helm能够使用HTTP/S拉取chart。从Helm 2.4.0开始，插件有一种能力从任意来源下载chart。

插件应该在`plugin.yaml`（顶层的）文件中声明这个特殊能力：

```yaml
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

如果这个插件已经安装，Helm可以通过调用`command`可以使用指定的协议方案与存储仓库进行交互。
特殊仓库的添加与常规仓库类似：`helm repo add favorite myprotocol://example.com/`。
特殊仓库的的规则也和常规仓库相同：为了发现和缓存chart的可用列表，Helm必须下载`index.yaml`文件。

已定义的命令可以通过以下结构调用： `command certFile keyFile caFile full-URL`。SSL证书有仓库定义，存储在
`$HELM_REPOSITORY_CONFIG`(即：`$HELM_CONFIG_HOME/repositories.yaml`)。
下载器插件将原始内容使用stdout输出并使用stderr报告错误。

下载器命令也支持子命令和参数，允许在`plugin.yaml`指定，比如`bin/mydownloader subcommand -d`。
如果你想在相同的可执行文件中执行主要的插件命令和下载器命令，这就变得很有用，但每个命令都有不同的子命令。

## 环境变量

当Helm执行插件时，会传递外部环境变量给插件，且会加入一些额外的环境变量。

像 `KUBECONFIG` 这样的变量，如果是在外部环境中设置的，则是为插件设置的。

要保证设置以下变量：

- `HELM_PLUGINS`: 插件目录路径。
- `HELM_PLUGIN_NAME`: `helm`调用的插件名称。
- `HELM_PLUGIN_DIR`: 包含插件的目录。
- `HELM_BIN`: （当前用户的）`helm`命令的路径。
- `HELM_DEBUG`: 表示helm是否设置了debug。
- `HELM_REGISTRY_CONFIG`: 注册配置的位置（如果启用）。注意Helm使用注册中心是实验特性。
- `HELM_REPOSITORY_CACHE`: 缓存文件路径。
- `HELM_REPOSITORY_CONFIG`: 配置文件路径。
- `HELM_NAMESPACE`: `helm`命令指定的命名空间（一般使用`-n`参数）。
- `HELM_KUBECONTEXT`: `helm`命令给定的Kubernetes配置上下文的名称。

另外，如果明确指定Kubernetes配置文件，需要配置成 `KUBECONFIG`变量。

## 参数解析说明

当执行插件时，Helm会解析自己的全局参数。这些参数都不会传递给插件。

- `--debug`: 如果指定， `$HELM_DEBUG` 设置为 `1`
- `--registry-config`: 链接到了 `$HELM_REGISTRY_CONFIG`
- `--repository-cache`: 链接到了 `$HELM_REPOSITORY_CACHE`
- `--repository-config`: 链接到了 `$HELM_REPOSITORY_CONFIG`
- `--namespace` 和 `-n`: 链接到了 `$HELM_NAMESPACE`
- `--kube-context`: 链接到了 `$HELM_KUBECONTEXT`
- `--kubeconfig`: 链接到了 `$KUBECONFIG`

插件 _应该_ 使用`-h` 和 `--help`显示帮助文本然后退出。在所有其他情况下，插件根据需要使用参数。

## 提供shell自动补全

从Helm 3.2开始，作为Helm现有的自动补全机制的一部分，插件可以选择性提供对shell自动补全的支持。

### 静态自动补全

如果插件提供了自己的参数或者子命令，可以通过位于插件根目录的`completion.yaml`文件通知 Helm。
`completion.yaml`格式如下：

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
     <and so on, recursively>
```

注意：

1. 所有部分都是可选的，应该在适用时提供。
2. 参数不该包含`-` 或 `--`前缀。
3. 可以而且应该指定端的和长的参数。短参数不需要与其对应的长格式关联，但是都应被列出。
4. 参数不需要以任何方式排序，但是需要列举在文件子命令层次结构的正确位置。
5. Helm现有的全局参数已经由Helm的自动补全机制处理，因此插件不需要指定以下参数：`--debug`，`--namespace`或`-n`，
   `--kube-context`，以及`--kubeconfig`，或者其他全局参数。
6. `validArgs`列表提供了一个以下子命令的第一个参数可能补全的静态列表。并不总是能事先提供这样一份清单。
   (查看下面的[动态补全](#dynamic-completion)部分)，这种情况下`validArgs`部分可以省略。

`completion.yaml`文件是完全可选的。如果没有提供，Helm不会为插件提供shell自动补全功能(除非插件支持 [动态补全](#dynamic-completion))。
并且，添加`completion.yaml`文件是向后兼容的，而且不会影响到插件使用helm旧版本的操作。

举个例子，针对[`fullstatus plugin`](https://github.com/marckhouzam/helm-fullstatus)，没有子命令但是接受
与`helm status`命令相同的参数，`completion.yaml`文件如下：

```yaml
name: fullstatus
flags:
- o
- output
- revision
```

一个使用[`2to3 plugin`](https://github.com/helm/helm-2to3)更复杂的例子，`completion.yaml`文件如下：

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

### Dynamic completion

也是从Helm 3.2开始，插件可以提供它们自己的动态shell补全。动态补全是补全事先没有定义的参数值或标签值。比如说，补全集群中现在可用的helm发布的名称。

对于支持动态补全的插件，必须在根目录中提供一个命名为`plugin.complete`的**可执行**文件。当Helm的自动补全脚本需要为这个插件动态补全时，会执行
`plugin.complete`文件，传递需要补全的命令行。`plugin.complete`可执行文件需要有判断核实补全选项的逻辑并将其通过Helm补全脚本输出到标准输出。

`plugin.complete`文件是完全可选的。如果没有提供，Helm不会为插件提供动态自动补全。并且，添加`plugin.complete`文件是向后兼容的，
而且不会影响到插件使用Helm旧版本的操作。

`plugin.complete`脚本的输出应该是以行分隔的列表，例如：

```console
rel1
rel2
rel3
```

当调用`plugin.complete`时，插件环境的设置与调用插件的主脚本时一样。因此，变量 `$HELM_NAMESPACE`，`$HELM_KUBECONTEXT`，
以及所有其他插件变量都已经设置好了，且它们对应的全局标志会被移除。

`plugin.complete`文件可以是任何可执行格式；可以是shell脚本，Go程序，或者任何其他Helm可以执行的类型。`plugin.complete`文件
***必须***有对用户的可执行权限。`plugin.complete`文件 ***必须*** 以成功码退出（0）。

在有些场景中，动态补全需要从Kubernetes集群中获取信息。比如，`helm fullstatus`插件需要发布名称作为输入。在`fullstatus`插件中，
针对它的`plugin.complete`脚本提供当前发布名称的补全，执行`helm list -q`即可输出结果。

如果想插件执行和插件补全使用同一个可执行文件，`plugin.complete`脚本可以使用特殊的参数或标签调用主插件执行文件；当主插件执行文件检测到特殊的参数或标签，
它就知道应该执行补全。在以下示例中，`plugin.complete`执行如下：

```sh
#!/usr/bin/env sh

# "$@" is the entire command-line that requires completion.
# It is important to double-quote the "$@" variable to preserve a possibly empty last parameter.
$HELM_PLUGIN_DIR/status.sh --complete "$@"
```

`fullstatus`脚本的实际脚本(`status.sh`)必须查找`--complete`，如果存在，打印出合适的补全。

### 提示和技巧

1. 脚本会自动过滤掉不匹配输入的补全。因此，插件会返回所有相关的补全，而不删除与用户输入不匹配的补全。比如，如果命令行是
   `helm fullstatus ngin<TAB>`，不仅仅是以`ngin`开头的，`plugin.complete` 脚本可以打印 *所有* （`default`默认命名空间）的发布名称，
    脚本只会保留以`ngin`开头的。
2. 为了简化动态补全支持，尤其是如果你有个复杂的插件，你可以有你的`plugin.complete`脚本调用你的主插件脚本并请求补全选项。查看上面
   [动态补全](#dynamic-completion)的例子。
3. 要调试动态补全和`plugin.complete`文件，可以运行以下命令查看补全效果：
    - `helm __complete <pluginName> <arguments to complete>`。比如：
    - `helm __complete fullstatus --output js<ENTER>`，
    - `helm __complete fullstatus -o json ""<ENTER>`
