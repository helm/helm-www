---
title: Helm 架构
description: 从较高层面描述 Helm 架构。
sidebar_position: 8
---

# Helm 架构

本文从较高层面描述 Helm 的架构。

## Helm 的用途

Helm 是一个管理 Kubernetes 包的工具，这种包称为 _chart_。Helm 可以完成以下任务：

- 从头创建新的 chart
- 将 chart 打包成归档文件（tgz）
- 与存储 chart 的仓库进行交互
- 在现有的 Kubernetes 集群中安装和卸载 chart
- 管理使用 Helm 安装的 chart 的 release 周期

Helm 有三个重要概念：

1. _chart_ 是创建 Kubernetes 应用实例所需的一组信息。
2. _config_ 包含配置信息，可以合并到已打包的 chart 中，用于创建可发布的对象。
3. _release_ 是 _chart_ 与特定 _config_ 结合后的运行实例。

## 组件

Helm 是一个可执行程序，由两个不同的部分组成：

**Helm 客户端** 是面向终端用户的命令行客户端，负责以下工作：

- 本地 chart 开发
- 管理仓库
- 管理 release
- 与 Helm 库交互
  - 发送要安装的 chart
  - 发送升级或卸载现有 release 的请求

**Helm 库** 提供执行所有 Helm 操作的逻辑。它与 Kubernetes API 服务器交互，并提供以下功能：

- 将 chart 和配置结合以构建 release
- 将 chart 安装到 Kubernetes 中，并提供相应的 release 对象
- 通过与 Kubernetes 交互来升级和卸载 chart

独立的 Helm 库封装了 Helm 逻辑，以便不同的客户端可以使用它。

## 实现

Helm 客户端和库使用 Go 编程语言编写。

该库使用 Kubernetes 客户端库与 Kubernetes 通信。目前，该库使用 REST+JSON。它将信息存储在 Kubernetes 的 Secret 中，不需要自己的数据库。

配置文件尽可能使用 YAML 编写。
