---
title: 创建 NOTES.txt 文件
description: 如何向 chart 用户提供说明。
sidebar_position: 10
---

本节介绍 Helm 为 chart 用户提供操作说明的工具。`helm install` 或 `helm upgrade` 完成后，Helm 可以打印一段对用户有帮助的信息，这些信息可以通过模板灵活自定义。

要为 chart 添加安装说明，只需创建 `templates/NOTES.txt` 文件。这个文件是纯文本，但会像模板一样被处理，所有常规的模板函数和对象都可以使用。

下面创建一个简单的 `NOTES.txt` 文件：

```
Thank you for installing {{ .Chart.Name }}.

Your release is named {{ .Release.Name }}.

To learn more about the release, try:

  $ helm status {{ .Release.Name }}
  $ helm get all {{ .Release.Name }}

```

现在运行 `helm install rude-cardinal ./mychart`，会在底部看到如下信息：

```
RESOURCES:
==> v1/Secret
NAME                   TYPE      DATA      AGE
rude-cardinal-secret   Opaque    1         0s

==> v1/ConfigMap
NAME                      DATA      AGE
rude-cardinal-configmap   3         0s


NOTES:
Thank you for installing mychart.

Your release is named rude-cardinal.

To learn more about the release, try:

  $ helm status rude-cardinal
  $ helm get all rude-cardinal
```

通过 `NOTES.txt` 可以方便地向用户展示新安装 chart 的使用说明。虽然不是必须的，但强烈建议创建 `NOTES.txt` 文件。
