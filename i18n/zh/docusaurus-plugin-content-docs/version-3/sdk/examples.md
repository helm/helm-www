---
title: "示例"
description: "演示Helm SDK的各项功能"
weight: 4
---

本文档通过一系列示例来演示Helm SDK的使用方法，旨在展示各种SDK功能。

最后一个示例展示了 `main.go` 驱动程序（详见[驱动示例](#驱动程序)），该程序会执行下述操作，并包含所需的辅助函数。

所有示例代码均位于 [helm/helm-www/sdkexamples/](https://github.com/helm/helm-www/tree/main/sdkexamples) 目录下，并且可以完整运行。

## 操作

### 安装操作 (Install) {#install-action}

此示例演示如何安装指定的 chart/release，支持指定版本和自定义values：

{{< highlightexamplego file="sdkexamples/install.go" >}}

### 升级操作(Upgrade) {#upgrade-action}

此示例演示如何使用指定的 chart、版本和 values 升级已有的 release：

{{< highlightexamplego file="sdkexamples/upgrade.go" >}}

### 卸载操作

此示例演示如何卸载指定的 release：

{{< highlightexamplego file="sdkexamples/uninstall.go" >}}

### 列表操作

此示例会列出当前配置命名空间下的所有已发布 chart：

{{< highlightexamplego file="sdkexamples/list.go" >}}

### 拉取操作

此示例演示如何从 OCI 仓库拉取一个 chart：

{{< highlightexamplego file="sdkexamples/pull.go" >}}

## 驱动程序

此处的驱动示例展示了 Helm SDK 各项操作所需的辅助函数，并演示了如何实际使用上述示例，从OCI仓库拉取、安装、升级和卸载 `podinfo` chart。

{{< highlightexamplego file="sdkexamples/main.go" >}}
