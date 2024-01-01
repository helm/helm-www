---
title: "Examples"
description: "Explains various advanced features for Helm power users"
aliases: ["/docs/advanced_helm_techniques"]
weight: 2
---

This document runs though a series of examples of using the Helm SDK

# Actions

These examples are meant to be fully working. The code lives in the `sdkexamples` directory. The below driver runs through each example:

{{< highlightexamplego file="sdkexamples/main.go" >}}

## Install Action

This example installs the given chart/release, for the given version and values.

{{< highlightexamplego file="sdkexamples/install.go" >}}

## Upgrade Action

This example upgrades the given release, with the given chart, version and values.

{{< highlightexamplego file="sdkexamples/upgrade.go" >}}

## Uninstall Action

{{< highlightexamplego file="sdkexamples/uninstall.go" >}}

## List Action

{{< highlightexamplego file="sdkexamples/list.go" >}}

## Pull Action

{{< highlightexamplego file="sdkexamples/list.go" >}}
