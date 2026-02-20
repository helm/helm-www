---
title: 调试模板
description: 对部署失败的 chart 进行故障排除。
sidebar_position: 13
---

调试模板可能很棘手，因为渲染后的模板会发送给 Kubernetes API server，可能会因格式以外的原因拒绝 YAML 文件。

以下命令有助于调试：

- `helm lint` 是验证 chart 是否遵循最佳实践的首选工具。
- `helm template --debug` 可在本地测试 chart 模板的渲染。
- `helm install --dry-run --debug` 同样会在本地渲染 chart 而不实际安装，同时还会检查集群上是否存在冲突的资源。设置 `--dry-run=server` 会将 chart 中的任何 `lookup` 发送到服务器执行。
- `helm get manifest`：这是查看服务器上已安装模板的好方法。

当你的 YAML 文件解析失败，但你想知道生成了什么，一个简单的方式是注释掉模板中有问题的部分，然后重新运行 `helm install --dry-run --debug`：

```yaml
apiVersion: v2
# some: problem section
# {{ .Values.foo | quote }}
```

以上内容会被渲染，同时返回完整的注释：

```yaml
apiVersion: v2
# some: problem section
#  "bar"
```

这样可以快速查看生成的内容，而不会被 YAML 解析错误阻塞。
