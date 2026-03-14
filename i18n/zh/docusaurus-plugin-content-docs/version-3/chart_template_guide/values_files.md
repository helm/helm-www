---
title: Values 文件
description: "如何使用 --values 参数的说明"
sidebar_position: 4
---

在上一节中，我们了解了 Helm 模板提供的内置对象。其中一个是 `Values` 对象。该对象提供了访问传入 chart 的值的方式。其内容来自多个位置：

- chart 中的 `values.yaml` 文件
- 如果是子 chart，则是父 chart 中的 `values.yaml` 文件
- 使用 `-f` 参数（`helm install -f myvals.yaml ./mychart`）传递给 `helm install` 或 `helm upgrade` 的 values 文件
- 使用 `--set` 传递的单个参数（比如 `helm install --set foo=bar ./mychart`）

以上列表按优先级排列：`values.yaml` 是默认值，可以被父 chart 的 `values.yaml` 覆盖，继而被用户提供的 values 文件覆盖，最后被 `--set` 参数覆盖。

Values 文件是普通的 YAML 文件。接下来编辑 `mychart/values.yaml`，然后编辑我们的 ConfigMap 模板。

删除 `values.yaml` 中的默认内容，仅设置一个参数：

```yaml
favoriteDrink: coffee
```

现在可以在模板中使用它：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favoriteDrink }}
```

注意最后一行，我们将 `favoriteDrink` 作为 `Values` 的属性进行访问：`{{ .Values.favoriteDrink }}`。

看看渲染结果：

```console
$ helm install geared-marsupi ./mychart --dry-run --debug
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: geared-marsupi
LAST DEPLOYED: Wed Feb 19 23:21:13 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
favoriteDrink: coffee

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: geared-marsupi-configmap
data:
  myvalue: "Hello World"
  drink: coffee
```

由于默认的 `values.yaml` 文件中将 `favoriteDrink` 的值设置为 `coffee`，这个值就显示在了模板中。我们可以在调用 `helm install` 时添加 `--set` 参数来轻松覆盖这个值：

```console
$ helm install solid-vulture ./mychart --dry-run --debug --set favoriteDrink=slurm
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: solid-vulture
LAST DEPLOYED: Wed Feb 19 23:25:54 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
favoriteDrink: slurm

COMPUTED VALUES:
favoriteDrink: slurm

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: solid-vulture-configmap
data:
  myvalue: "Hello World"
  drink: slurm
```

由于 `--set` 比默认的 `values.yaml` 文件优先级更高，模板就生成了 `drink: slurm`。

Values 文件也可以包含更多结构化的内容。比如，我们可以在 `values.yaml` 文件中创建一个 `favorite` 部分，然后添加多个键：

```yaml
favorite:
  drink: coffee
  food: pizza
```

现在需要稍微修改一下模板：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink }}
  food: {{ .Values.favorite.food }}
```

虽然可以这样构造数据，但建议保持 values 树的浅层结构，尽量扁平化。当我们后续介绍如何给子 chart 赋值时，你会看到如何使用树结构为值命名。

## 删除默认的键

如果需要从默认值中删除某个键，可以将该键的值设置为 `null`，这样 Helm 会在合并覆盖值时移除这个键。

比如，稳定版的 Drupal chart 允许在配置自定义镜像时配置活动探针。以下是默认值：

```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  initialDelaySeconds: 120
```

如果你尝试使用 `--set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt]` 将 livenessProbe 处理器从 `httpGet` 覆盖为 `exec`，Helm 会将默认键和覆盖键合并在一起，生成以下 YAML：

```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  exec:
    command:
    - cat
    - docroot/CHANGELOG.txt
  initialDelaySeconds: 120
```

但 Kubernetes 不允许声明多个 livenessProbe 处理器，这会导致部署失败。为了解决这个问题，可以通过将 `livenessProbe.httpGet` 设置为 null 来让 Helm 删除它：

```sh
helm install stable/drupal --set image=my-registry/drupal:0.1.0 --set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt] --set livenessProbe.httpGet=null
```

至此，我们已经了解了几个内置对象，并使用它们将信息注入到模板中。接下来我们将了解模板引擎的另一方面：函数和管道。
