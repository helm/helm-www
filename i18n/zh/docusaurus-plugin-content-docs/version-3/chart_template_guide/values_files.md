---
title: Values 文件
description: "--values参数操作说明"
sidebar_position: 4
---

在上一部分我们了解了Helm模板提供的内置对象。其中一个是`Values`对象。该对象提供了传递值到chart的方法，

其内容来自于多个位置：

- chart中的`values.yaml`文件
- 如果是子chart，就是父chart中的`values.yaml`文件
- 使用`-f`参数(`helm install -f myvals.yaml ./mychart`)传递到 `helm install` 或
`helm upgrade`的values文件
- 使用`--set` (比如`helm install --set foo=bar ./mychart`)传递的单个参数

以上列表有明确顺序：默认使用`values.yaml`，可以被父chart的`values.yaml`覆盖，继而被用户提供values文件覆盖，
最后会被`--set`参数覆盖，优先级为`values.yaml`最低，`--set`参数最高。

values文件是普通的YAML文件。现在编辑`mychart/values.yaml`然后编辑配置映射ConfigMap模板。

删除`values.yaml`中的默认内容，仅设置一个参数：

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

注意最后一行，`favoriteDrink`是`Values`的一个属性: `{{ .Values.favoriteDrink }}`。

看看是如何渲染的：

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

由于默认的`values.yaml`文件中设置了`favoriteDrink`的值为`coffee`，则这个显示在了模板中。
可以在调用`helm install`时设置`--set`，很容易就能覆盖这个值。

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

由于`--set`比默认的`values.yaml`文件优先级更高，模板就生成了`drink: slurm`。

values文件也可以包含更多结构化的内容。比如我们可以在`values.yaml`文件中创建一个`favorite`项，然后添加一些key：

```yaml
favorite:
  drink: coffee
  food: pizza
```

现在需要稍微修改一些模板：

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

虽然可以这样构造数据，但还是建议构建更加平坦的浅层树。以后想要给子chart赋值时，会看到如何使用树结构给value命名。

## 删除默认的key

如果需要从默认的value中删除key，可以将key设置为`null`，Helm将在覆盖的value合并时删除这个key。

比如，稳定的Drupal允许在配置自定义镜像时配置活动探针。默认值为`httpget`：

```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  initialDelaySeconds: 120
```

如果你想替换掉`httpGet`用`exec`重写活动探针，使用`--set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt]`，
Helm会把默认的key和重写的key合并在一起，从而生成以下YAML：

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

因为Kubernetes中不能声明多个活动探针句柄，从而会应用发布会失败。为了解决这个问题，Helm可以指定通过设定null来删除`livenessProbe.httpGet`：

```sh
helm install stable/drupal --set image=my-registry/drupal:0.1.0 --set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt] --set livenessProbe.httpGet=null
```

在这之前我们已经看到了几个内置对象，并用它们将信息传递到模板中。现在来模板引擎的另一部分：方法和管道。
