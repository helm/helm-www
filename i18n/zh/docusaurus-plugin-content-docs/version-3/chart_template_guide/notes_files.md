---
title: 创建一个NOTES.txt文件
description: 如何向chart用户提供说明。
sidebar_position: 11
---

该部分会介绍为chart用户提供说明的Helm工具。在`helm install` 或 `helm upgrade`命令的最后，Helm会打印出对用户有用的信息。
使用模板可以高度自定义这部分信息。

要在chart添加安装说明，只需创建`templates/NOTES.txt`文件即可。该文件是纯文本，但会像模板一样处理，
所有正常的模板函数和对象都是可用的。

让我们创建一个简单的`NOTES.txt`文件：

```yaml
Thank you for installing {{ .Chart.Name }}.

Your release is named {{ .Release.Name }}.

To learn more about the release, try:

  $ helm status {{ .Release.Name }}
  $ helm get all {{ .Release.Name }}

```

现在如果我们执行`helm install rude-cardinal ./mychart` 会在底部看到：

```yaml
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

使用`NOTES.txt`这种方式是给用户提供关于如何使用新安装的chart细节信息的好方法。尽管并不是必需的，强烈建议创建一个`NOTES.txt`文件。
