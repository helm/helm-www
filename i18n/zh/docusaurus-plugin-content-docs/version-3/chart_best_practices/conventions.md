---
title: 一般惯例
description: chart 的一般惯例。
sidebar_position: 1
---

最佳实践指南的这部分介绍 chart 的一般惯例。

## Chart 名称

chart 名称必须是小写字母和数字。单词之间 _可以_ 使用横杠（`-`）分隔：

示例：

```
drupal
nginx-lego
aws-cluster-autoscaler
```

chart 名称中不能使用大写字母或下划线，也不能使用点号。

## 版本号

Helm 尽可能使用 [SemVer 2](https://semver.org) 来表示版本号。（注意 Docker 镜像的 tag 不一定遵循 SemVer，因此被视为该规则的例外。）

当 SemVer 版本存储在 Kubernetes 标签中时，我们通常把 `+` 字符改成 `_`，因为标签不允许使用 `+` 作为值。

## 格式化 YAML

YAML 文件应该使用 _两个空格_ 缩进（绝不要使用 tab 键）。

## Helm 和 Chart 的用法

以下是 _Helm_ 和 _helm_ 的几个惯用方法：

- _Helm_ 是指整个项目
- `helm` 是指客户端命令
- `chart` 不是专有名词，不需要首字母大写
- 但 `Chart.yaml` 需要首字母大写，因为文件名区分大小写

若有疑问，使用 _Helm_（大写 'H'）。

## Chart 模板和 namespace

避免在 chart 模板的 `metadata` 部分定义 `namespace` 属性。渲染后的模板应该在调用 Kubernetes 客户端时通过 `--namespace` 参数指定要部署到的 namespace。Helm 会原样渲染模板并发送给 Kubernetes 客户端，无论是 Helm 本身还是其他程序（如 kubectl、flux、spinnaker 等）。
