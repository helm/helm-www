---
title: Chart Tests
description: 描述如何运行和测试你的 chart。
sidebar_position: 3
---

chart 包含了多个协同工作的 Kubernetes 资源和组件。作为 chart 作者，你可能想编写一些测试来验证 chart 在安装时是否按预期工作。这些测试也可以帮助 chart 用户了解你的 chart 预期的功能。

Helm chart 中的**测试**位于 `templates/` 目录下，是一个 Job 定义，指定了一个要运行给定命令的容器。容器应该成功退出（exit 0）才算测试通过。Job 定义必须包含 Helm 测试钩子注解：`helm.sh/hook: test`。

注意在 Helm v3 之前，Job 定义需要包含以下 Helm 测试钩子注解之一：`helm.sh/hook: test-success` 或 `helm.sh/hook: test-failure`。`helm.sh/hook: test-success` 仍然作为 `helm.sh/hook: test` 的向后兼容替代方案被接受。

测试示例：

- 验证 values.yaml 文件中的配置是否被正确注入。
  - 确保用户名和密码正确工作
  - 确保错误的用户名和密码无法工作
- 验证服务已启动且负载均衡正常
- 等等。

你可以使用 `helm test <RELEASE_NAME>` 命令对一个 release 运行 Helm 中预定义的测试。对于 chart 用户来说，这是检验他们的 chart release（或应用程序）是否按预期工作的好方法。

## 测试示例

[helm create](/zh/docs/helm/helm_create/) 命令会自动创建一些目录和文件。要尝试 Helm 测试功能，首先创建一个示例 Helm chart。

```console
$ helm create demo
```

你现在可以在 demo Helm chart 中看到以下结构。

```
demo/
  Chart.yaml
  values.yaml
  charts/
  templates/
  templates/tests/test-connection.yaml
```

在 `demo/templates/tests/test-connection.yaml` 中，你会看到一个可以尝试的测试。可以在这里查看 Helm 测试 Pod 定义：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "demo.fullname" . }}-test-connection"
  labels:
    {{- include "demo.labels" . | nindent 4 }}
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['{{ include "demo.fullname" . }}:{{ .Values.service.port }}']
  restartPolicy: Never

```

## 对 Release 运行测试套件

首先，将 chart 安装到集群中以创建一个 release。你可能需要等待所有 Pod 变为 active 状态；如果在安装后立即测试，可能会出现暂时性失败，届时你需要重新测试。

```console
$ helm install demo demo --namespace default
$ helm test demo
NAME: demo
LAST DEPLOYED: Mon Feb 14 20:03:16 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE:     demo-test-connection
Last Started:   Mon Feb 14 20:35:19 2022
Last Completed: Mon Feb 14 20:35:23 2022
Phase:          Succeeded
[...]
```

## 注意事项

- 可以在单个 yaml 文件中定义多个测试，也可以将测试分布在 `templates/` 目录下的多个 yaml 文件中。
- 可以将测试套件嵌套放在 `tests/` 目录中（如 `<chart-name>/templates/tests/`）以获得更好的隔离。
- 测试是一种 [Helm 钩子](/zh/docs/topics/charts_hooks/)，因此 `helm.sh/hook-weight` 和 `helm.sh/hook-delete-policy` 等注解也可以用于测试资源。
