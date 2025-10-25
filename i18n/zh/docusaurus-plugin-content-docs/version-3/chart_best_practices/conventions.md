---
title: 一般惯例
description: chart的一般惯例
sidebar_position: 1
---

最佳实践的这部分阐述了一般惯例。

## Chart名称

chart名称必须是小写字母和数字。单词之间 _可以_ 使用横杠分隔(-)：

示例：

```yaml
drupal
nginx-lego
aws-cluster-autoscaler
```

chart名称中不能用大写字母也不能用下划线。点 . 符号也不行。

## 版本号

Helm尽可能使用[SemVer 2](https://semver.org)来表示版本号。（注意Docker镜像的tag不一定遵循SemVer，
因此被认为是一个不幸的例外规则。）

当SemVer版本存储在Kubernetes标签中时，我们通常把`+`字符改成`_`，因为标签不允许使用`+`作为值进行签名。

## 格式化YAML

YAML 文件应该按照 _双空格_ 缩进(绝不要使用tab键)。

## Helm 和 Chart的用法

以下是几个 _Helm_ 和 _helm_ 的惯用方法。

- _Helm_ 是指整个项目
- `helm` 是指客户端命令
- `chart` 不是专有名词，不需要首字母大写
- 但`Chart.yaml`需要首字母大写，因为文件名大小写敏感

若有疑问，使用 _Helm_ ('H'大写).
