---
title: "Chart 模板指南"
weight: 5
aliases: ["/topics/chart_template_guide/"]
---

# Chart 模板开发指南

本指南对 Helm 的 chart 模板进行了介绍，其重点是模板语言。

Helm 模板是由一系列的清单文件组成，他们是 Kubernetes 能够解析的 YAML 格式资源文件。
这里我们将看到模板是如何组成的，模板是如何使用的，该怎样编写 Go 模板，以及如何进行调试。

本指南需要关注以下几个概念：

- Helm 模板语言
- 使用 values
- 使用模板的技巧

本指南是了解Helm模板的内容语言。其他指南提供介绍性材料、示例和最佳实践指南。

