---
title: 介绍
description: 介绍Helm Go SDK
sidebar_position: 1
---

Helm 的 Go SDK 使自定义软件能够利用 Helm charts 和 Helm 的功能来管理 Kubernetes 软件部署
（事实上，Helm CLI 本质上就是这样一个工具！）

目前，SDK 已经在功能上与 Helm CLI 分离。
SDK 可以（并且正在）被独立工具使用。
Helm 项目已承诺为 SDK 提供 API 稳定性。
值得注意的是，SDK 在将 CLI 和 SDK 分离的初始工作中仍有一些未完善之处。Helm 项目旨在随着时间的推移进行改进。

完整的 API 文档可以在 [https://pkg.go.dev/helm.sh/helm/v3](https://pkg.go.dev/helm.sh/helm/v3) 找到。

下面简要概述了一些主要类型的包和一个简单示例。
有关更多示例和功能更完整的"驱动程序"，请参阅[示例](/sdk/examples.mdx)部分。

## 主要包概览

- [pkg/action](https://pkg.go.dev/helm.sh/helm/v3/pkg/action):
  包含执行 Helm 操作的主要"客户端"。
  这与 CLI 在底层使用的包相同。
  如果您只需要从另一个 Go 程序执行基本的 Helm 命令，这个包适合您
- [pkg/chart](https://pkg.go.dev/helm.sh/helm/v3/pkg/chart), [pkg/chartutil](https://pkg.go.dev/helm.sh/helm/v3/pkg/chartutil):
  用于加载和操作 charts 的方法和辅助函数
- [pkg/cli](https://pkg.go.dev/helm.sh/helm/v3/pkg/cli) 及其子包:
  包含标准 Helm 环境变量的所有处理程序，其子包包含输出和 values 文件处理
- [pkg/release](https://pkg.go.dev/helm.sh/helm/v3/pkg/release):
  定义 `Release` 对象和状态

除了这些之外还有很多包，请查看文档以获取更多信息！

### 简单示例
这是使用 Go SDK 执行 `helm list` 的简单示例。
有关功能更完整的示例，请参阅[示例](/sdk/examples.mdx)部分。

```go
package main

import (
    "log"
    "os"

    "helm.sh/helm/v3/pkg/action"
    "helm.sh/helm/v3/pkg/cli"
)

func main() {
    settings := cli.New()

    actionConfig := new(action.Configuration)
    // 您可以传递空字符串而不是 settings.Namespace() 来列出所有命名空间
    if err := actionConfig.Init(settings.RESTClientGetter(), settings.Namespace(), os.Getenv("HELM_DRIVER"), log.Printf); err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    client := action.NewList(actionConfig)
    // 仅列出已部署的
    client.Deployed = true
    results, err := client.Run()
    if err != nil {
        log.Printf("%+v", err)
        os.Exit(1)
    }

    for _, rel := range results {
        log.Printf("%+v", rel)
    }
}

```

## 兼容性

Helm SDK 明确遵循 Helm 向后兼容性保证：

<https://github.com/helm/community/blob/main/hips/hip-0004.md>

也就是说，破坏性更改只会在主要版本中进行。
