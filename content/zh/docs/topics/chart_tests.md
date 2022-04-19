---
title: "Chart Test"
description: "描述如何执行和测试你的chart"
weight: 3
---

&emsp;&emsp;chart包含了很多一起工作的Kubernetes资源和组件。作为一个chart作者，你可能想写一些测试验证chart安装时是否按照预期工作。
这些测试同时可以帮助chart用户理解你的chart在做什么。

**test** 在helm chart中放在 `templates/`目录，并且是一个指定了容器和给定命令的任务。如果测试通过，容器应该成功退出 (exit 0)
任务的定义必须包含helm测试钩子的注释：`helm.sh/hook: test`。

注意Helm v3中，任务定义需要包含helm的测试钩子注释之一：`helm.sh/hook: test-success` 或者 `helm.sh/hook: test-failure`。
`helm.sh/hook: test-success` 仍然向后兼容，也可以是 `helm.sh/hook: test`。

示例测试以下内容：

- 验证你values.yaml文件中的配置可以正确注入。
  - 确保你的用户名和密码是对的
  - 确保不正确的用户名和密码不会工作
- 判断你的服务只启动的并且正确地负载均衡
- 等等。

你可以在Helm的一个版本中运行预定义的测试，执行 `helm test <RELEASE_NAME>`。对于chart用户来说，
这是验证chart发布（或应用）可以正常运行的很好的方式。

## Example Test

这是一个helm对[bitnami wordpress chart](https://hub.helm.sh/charts/bitnami/wordpress)的pod定义的测试。
如果你下载了一个chart的拷贝，可以在本地看到以下文件：

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm pull bitnami/wordpress --untar
```

```console
wordpress/
  Chart.yaml
  README.md
  values.yaml
  charts/
  templates/
  templates/tests/test-mariadb-connection.yaml
```

在`wordpress/templates/tests/test-mariadb-connection.yaml`中，会看到一个test，可以试试：

```yaml
{{- if .Values.mariadb.enabled }}
apiVersion: v1
kind: Pod
metadata:
  name: "{{ .Release.Name }}-credentials-test"
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: {{ .Release.Name }}-credentials-test
      image: {{ template "wordpress.image" . }}
      imagePullPolicy: {{ .Values.image.pullPolicy | quote }}
      {{- if .Values.securityContext.enabled }}
      securityContext:
        runAsUser: {{ .Values.securityContext.runAsUser }}
      {{- end }}
      env:
        - name: MARIADB_HOST
          value: {{ template "mariadb.fullname" . }}
        - name: MARIADB_PORT
          value: "3306"
        - name: WORDPRESS_DATABASE_NAME
          value: {{ default "" .Values.mariadb.db.name | quote }}
        - name: WORDPRESS_DATABASE_USER
          value: {{ default "" .Values.mariadb.db.user | quote }}
        - name: WORDPRESS_DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: {{ template "mariadb.fullname" . }}
              key: mariadb-password
      command:
        - /bin/bash
        - -ec
        - |
          mysql --host=$MARIADB_HOST --port=$MARIADB_PORT --user=$WORDPRESS_DATABASE_USER --password=$WORDPRESS_DATABASE_PASSWORD
  restartPolicy: Never
{{- end }}
```

## 运行一个发布版本测试套件的步骤

首先，安装chart到你的集群中创建一个版本。需要等待所有的pod变成active的状态；如果安装之后立即执行test，
可能会出现相应的失败，你不得不再执行一次test。

```console
$ helm install quirky-walrus wordpress --namespace default
$ helm test quirky-walrus
Pod quirky-walrus-credentials-test pending
Pod quirky-walrus-credentials-test pending
Pod quirky-walrus-credentials-test pending
Pod quirky-walrus-credentials-test succeeded
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 succeeded
NAME: quirky-walrus
LAST DEPLOYED: Mon Jun 22 17:24:31 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE:     quirky-walrus-mariadb-test-dqas5
Last Started:   Mon Jun 22 17:27:19 2020
Last Completed: Mon Jun 22 17:27:21 2020
Phase:          Succeeded
TEST SUITE:     quirky-walrus-credentials-test
Last Started:   Mon Jun 22 17:27:17 2020
Last Completed: Mon Jun 22 17:27:19 2020
Phase:          Succeeded
[...]
```

## 注意

- 你可以在单个yaml文件中定义尽可能多的测试或者分布在`templates/`目录中的多个yaml文件中。
- 为了更好地隔离，欢迎你将测试套件嵌套放在`tests/`目录中，类似`<chart-name>/templates/tests/`。
- 一个test就是一个[Helm 钩子](https://helm.sh/zh/docs/topics/charts_hooks)，所以类似于
`helm.sh/hook-weight`和`helm.sh/hook-delete-policy`的注释可以用于测试资源。
