---
title: 调试模板
description: 对部署失败的chart进行故障排除
sidebar_position: 14
---

调试模板可能很棘手，因为渲染后的模板发送给了Kubernetes API server，可能会以格式化以外的原因拒绝YAML文件。

以下命令有助于调试：

- `helm lint` 是验证chart是否遵循最佳实践的首选工具。
- `helm template --debug` 在本地测试渲染chart模板。
- `helm install --dry-run --debug`：我们已经看到过这个技巧了，这是让服务器渲染模板的好方法，然后返回生成的清单文件。
- `helm get manifest`: 这是查看安装在服务器上的模板的好方法。

当你的YAML文件解析失败，但你想知道生成了什么，检索YAML一个简单的方式是注释掉模板中有问题的部分，
然后重新运行 `helm install --dry-run --debug`：

```yaml
apiVersion: v2
# some: problem section
# {{ .Values.foo | quote }}
```

以上内容会被渲染同时返回完整的注释：

```yaml
apiVersion: v2
# some: problem section
#  "bar"
```

这样就提供了一种快速查看没有被YAML错误解析阻塞的生成内容的方式。
