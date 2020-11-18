---
title: "使用Helm"
description: "阐述Helm的基础用法。"
weight: 3
---

该指南描述了使用Helm在Kubernetes集群中管理包的基本方法。
此刻假定您已经[安装](https://helm.sh/zh/docs/intro/install)了Helm客户端。

如果只是对一些快捷命令感兴趣，您可能希望从[快速开始指南](https://helm.sh/zh/docs/intro/quickstart)开始。
本章节将介绍Helm命令细节，以及如何使用他们。

## 三大概念

*Chart* 是一个Helm包，涵盖了需要在Kubernetes集群中运行应用，工具或者服务的资源定义。
把它想象成Kubernetes对应的Homebrew公式，Apt dpkg，或者是Yum RPM文件。

*仓库* 是归集和分享chart的地方。类似于Perl的 [CPAN 归档](https://www.cpan.org)或者[Fedora
包数据库](https://fedorahosted.org/pkgdb2/)，只针对于Kubernetes包。

*发布* 是在Kubernetes集群中运行的chart实例。一个chart经常在同一个集群中被重复安装。每次安装都会生成新的
_发布_。比如MySQL，如果想让两个数据库运行在集群中，可以将chart安装两次。每一个都会有自己的 _发布版本_，并有自己的 _发布名称_。

有了这些概念之后，就可以将Helm解释为：

Helm在Kubernetes中安装的每一个 _charts_，都会创建一个新的 _发布_，想查找新chart，可以在Helm chart _仓库_ 搜索。

## 'helm search'：查找chart

Helm有强大的搜索命令。可以搜索两类不同资源：

- `helm search hub` 搜索[Artifact Hub](https://artifacthub.io)，改仓库列出了来自不同仓库的大量chart。
- `helm search repo` 搜索已经(用 `helm repo add`)加入到本地helm客户端的仓库。该命名只搜索本地数据，不需要连接网络。

可以运行 `helm search hub` 搜索公共可用的chart：

```console
$ helm search hub wordpress
URL                                                 CHART VERSION APP VERSION DESCRIPTION
https://hub.helm.sh/charts/bitnami/wordpress        7.6.7         5.2.4       Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.6.3        v0.6.3      Presslabs WordPress Operator Helm Chart
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.7.1        v0.7.1      A Helm chart for deploying a WordPress site on ...
```

上述搜索从Artifact Hub中搜到了所有的 `wordpress` 的charts。

不过滤的话，`helm search hub` 会展示所有可用chart。

使用 `helm search repo` 可以找到所有已经添加到仓库的chart名称：

```console
$ helm repo add brigade https://brigadecore.github.io/charts
"brigade" has been added to your repositories
$ helm search repo brigade
NAME                          CHART VERSION APP VERSION DESCRIPTION
brigade/brigade               1.3.2         v1.2.1      Brigade provides event-driven scripting of Kube...
brigade/brigade-github-app    0.4.1         v0.2.1      The Brigade GitHub App, an advanced gateway for...
brigade/brigade-github-oauth  0.2.0         v0.20.0     The legacy OAuth GitHub Gateway for Brigade
brigade/brigade-k8s-gateway   0.1.0                     A Helm chart for Kubernetes
brigade/brigade-project       1.0.0         v1.0.0      Create a Brigade project
brigade/kashti                0.4.0         v0.4.0      A Helm chart for Kubernetes
```

Helm搜索使用字符串模糊匹配，因此输入部分名称也可以：

```console
$ helm search repo kash
NAME            CHART VERSION APP VERSION DESCRIPTION
brigade/kashti  0.4.0         v0.4.0      A Helm chart for Kubernetes
```

搜索是查找可用包的有效方式。一旦您找到了想要安装的包，使用 `helm install` 安装即可。

## 'helm install'：安装一个包

安装一个新包，使用 `helm install` 命令。最简单的方式有两个参数：查找到发布名称和chart名称。

```console
$ helm install happy-panda stable/mariadb
WARNING: This chart is deprecated
NAME: happy-panda
LAST DEPLOYED: Fri May  8 17:46:49 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
This Helm chart is deprecated

...

Services:

  echo Master: happy-panda-mariadb.default.svc.cluster.local:3306
  echo Slave:  happy-panda-mariadb-slave.default.svc.cluster.local:3306

Administrator credentials:

  Username: root
  Password : $(kubectl get secret --namespace default happy-panda-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode)

To connect to your database:

  1. Run a pod that you can use as a client:

      kubectl run happy-panda-mariadb-client --rm --tty -i --restart='Never' --image  docker.io/bitnami/mariadb:10.3.22-debian-10-r27 --namespace default --command -- bash

  2. To connect to master service (read/write):

      mysql -h happy-panda-mariadb.default.svc.cluster.local -uroot -p my_database

  3. To connect to slave service (read-only):

      mysql -h happy-panda-mariadb-slave.default.svc.cluster.local -uroot -p my_database

To upgrade this helm chart:

  1. Obtain the password as described on the 'Administrator credentials' section and set the 'rootUser.password' parameter as shown below:

      ROOT_PASSWORD=$(kubectl get secret --namespace default happy-panda-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode)
      helm upgrade happy-panda stable/mariadb --set rootUser.password=$ROOT_PASSWORD

```

现在`mariadb` chart已经安装。注意安装chart会创建一个新的发布对象。上述发布的名称是：`happy-panda`。
（如果想让Helm为你生成一个名称，去掉发布名称并加上`--generate-name`）

安装过程中，`helm`客户端会打印资源创建，发布状态以及额外需要额外处理的配置步骤等有效信息。

Helm不会等所有资源都运行了才推出。许多chart需要的Docker镜像大小超过了600M，并且在集群安装可能会花很长时间。

为了跟踪发布状态，或者再看看配置信息，可以使用 `helm status`：

```console
$ helm status happy-panda
NAME: happy-panda
LAST DEPLOYED: Fri May  8 17:46:49 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
This Helm chart is deprecated

...

Services:

  echo Master: happy-panda-mariadb.default.svc.cluster.local:3306
  echo Slave:  happy-panda-mariadb-slave.default.svc.cluster.local:3306

Administrator credentials:

  Username: root
  Password : $(kubectl get secret --namespace default happy-panda-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode)

To connect to your database:

  1. Run a pod that you can use as a client:

      kubectl run happy-panda-mariadb-client --rm --tty -i --restart='Never' --image  docker.io/bitnami/mariadb:10.3.22-debian-10-r27 --namespace default --command -- bash

  2. To connect to master service (read/write):

      mysql -h happy-panda-mariadb.default.svc.cluster.local -uroot -p my_database

  3. To connect to slave service (read-only):

      mysql -h happy-panda-mariadb-slave.default.svc.cluster.local -uroot -p my_database

To upgrade this helm chart:

  1. Obtain the password as described on the 'Administrator credentials' section and set the 'rootUser.password' parameter as shown below:

      ROOT_PASSWORD=$(kubectl get secret --namespace default happy-panda-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode)
      helm upgrade happy-panda stable/mariadb --set rootUser.password=$ROOT_PASSWORD
```

上述显示了发布的当前状态。

### 安装之前自定义chart

此处安装只会使用chartd默认配置。很多时候，您想使用自己的配置自定义chart。

使用 `helm show values` 查看chart的可配置项：

```console
$ helm show values stable/mariadb
Fetched stable/mariadb-0.3.0.tgz to /Users/mattbutcher/Code/Go/src/helm.sh/helm/mariadb-0.3.0.tgz
## Bitnami MariaDB image version
## ref: https://hub.docker.com/r/bitnami/mariadb/tags/
##
## Default: none
imageTag: 10.1.14-r3

## Specify a imagePullPolicy
## Default to 'Always' if imageTag is 'latest', else set to 'IfNotPresent'
## ref: https://kubernetes.io/docs/user-guide/images/#pre-pulling-images
##
# imagePullPolicy:

## Specify password for root user
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#setting-the-root-password-on-first-run
##
# mariadbRootPassword:

## Create a database user
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#creating-a-database-user-on-first-run
##
# mariadbUser:
# mariadbPassword:

## Create a database
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#creating-a-database-on-first-run
##
# mariadbDatabase:
# ...
```

可以在YAML格式文件中覆盖这些配置，然后在安装时调用这个文件。

```console
$ echo '{mariadbUser: user0, mariadbDatabase: user0db}' > config.yaml
$ helm install -f config.yaml stable/mariadb --generate-name
```

上述命令会创建一个名为`user0`的MariaDB默认用户，并授予该用户最新创建的`user0db`库的访问权限，但其他配置会使用chart的默认配置。

安装时有两种方式传递配置数据：

- `--values` (或`-f`)：指定一个重写的YAML文件。可以指定多个，最右边的文件优先
- `--set`: 使用命令行指定覆盖内容

如果两个都使用，`--set`的值会以高优先级合并到`--values`中。用`--set`指定的覆盖内容会在配置映射中保存。
`--set`配置的值可以只用`helm get values <release-name>`在给定的发布中看到。`--set`指定的值会被`helm upgrade`运行时`--reset-values`指定的值清空。

#### `--set`的格式和限制

`--set`选项附带0个或多个名字/值 对。最简单的使用方式是：`--set name=value`。 相对应的YAML是：

```yaml
name: value
```

多行可以使用`,`分隔，`--set a=b,c=d`则变为：

```yaml
a: b
c: d
```

还支持更负载的表达式，如：`--set outer.inner=value`会翻译成这样：

```yaml
outer:
  inner: value
```

列表可以用中括号括起来表示，比如：`--set name={a, b, c}`翻译为：

```yaml
name:
  - a
  - b
  - c
```

从Helm 2.5.0开始，可以使用数组索引语法访问列表项。比如`--set servers[0].port=80`变成了：

```yaml
servers:
  - port: 80
```

这种方式可以设置多个值，`--set servers[0].port=80,servers[0].host=example`变成了：

```yaml
servers:
  - port: 80
    host: example
```

有时需要在`--set`行使用特殊符号。可以使用反斜杠转义字符，`--set name=value1\,value2`会变成：

```yaml
name: "value1,value2"
```

类似的，可以转义点序列，当chart使用`toYaml`方法解析注释、标签和节点选择器时会很有用。
`--set nodeSelector."kubernetes\.io/role"=master`则会变成：

```yaml
nodeSelector:
  kubernetes.io/role: master
```

深度嵌套是数据结构很难使用`--set`表达。建议chart设计者设计`values.yaml`文件格式时考虑`--set`用法(查看[Values
文件](https://helm.sh/docs/chart_template_guide/values_files/)了解更多)。

### 更多安装方法

`helm install` 命令可以从以下这些源安装：

- chart仓库(如上所述)
- 本地chart包 (`helm install foo foo-0.1.1.tgz`)
- 解压的chart目录 (`helm install foo path/to/foo`)
- 完整URL(`helm install foo https://example.com/charts/foo-1.2.3.tgz`)

## 'helm upgrade' 和 'helm rollback'：升级版本和失败恢复

当chart新版本发布时，或者您想改变发布的配置，可以使用 `helm upgrade` 命令。

升级采用已有版本并根据您提供的信息进行升级。由于Kubernetes的chart会很大且很复杂，Helm会尝试执行最小增量升级。
这样只会升级自最新版发生改变的部分。

```console
$ helm upgrade -f panda.yaml happy-panda stable/mariadb
Fetched stable/mariadb-0.3.0.tgz to /Users/mattbutcher/Code/Go/src/helm.sh/helm/mariadb-0.3.0.tgz
happy-panda has been upgraded. Happy Helming!
Last Deployed: Wed Sep 28 12:47:54 2016
Namespace: default
Status: DEPLOYED
...
```

上面这个例子中，`happy-panda` 发布使用了同样的chart升级，但用了一个新的YAML文件：

```yaml
mariadbUser: user1
```

我们可以使用 `helm get values` 查看新内容是否生效。

```console
$ helm get values happy-panda
mariadbUser: user1
```

`helm get`在查看集群内的发布时很有用。正如我们上面看到的，显示了`panda.yaml`的新值已经部署到了集群。

现在，如果有内容在发布中未按计划执行，使用 `helm rollback [RELEASE] [REVISION]`能很容易回滚到上个版本。

```console
$ helm rollback happy-panda 1
```

上述回滚了happy-panda到第一个发布版本。 发布版本是增量修订。每次安装、升级或者回滚，修订号都会自增加1。
第一个版本号始终是1。我们可以使用 `helm history [RELEASE]` 查看某个版本的修订号。

## 安装/升级/回滚的有用项

有些可用项可以在Helm安装/升级/回滚时指定自定义行为。注意这不是完成cli参数列表。要查看所有参数的描述，运行 `helm
<command> --help` 即可。

- `--timeout`：等待Kubernetes命令完成的[Go持续时间](https://golang.org/pkg/time/#ParseDuration)值，默认是5m0s。
- `--wait`： 将发布标记为成功之前，要等所有的pod都已就绪，PVC已绑定，工作负载的pod有最小就绪数量（`需求`减去`最大不可用`），
以及服务有IP地址（和Ingress，如果是`LoadBalancer`）。等待时间与`--timeout`的值一样。如果达到超时时间，这个发布会被标记为`FAILED`。
注意：滚动更新策略中负载的`replicas`设置为1且`maxUnavailable`不是0时，`--wait`在有最小数量的就绪pod后会返回就绪状态。
- `--no-hooks`：跳过该命令的运行钩子。
- `--recreate-pods` (仅对`upgrade`和`rollback`可用)：这个参数会导致所有的pod重新部署(除了负载的pod)。
(Helm 3中已弃用)

## 'helm uninstall': 卸载一个发布

需要从集群中卸载发布时，使用 `helm uninstall` 命令：

```console
$ helm uninstall happy-panda
```

这会从集群中删除发布。可以使用 `helm list` 命令看到当前所有部署的发布：

```console
$ helm list
NAME            VERSION UPDATED                         STATUS          CHART
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
```

从上面的输出中，我们可以看到 `happy-panda` 发布已经卸载了。

在Helm之前的版本中，发布删除后，会保留删除记录，Helm 3中会同时删除。如果希望保留删除记录，使用 `helm uninstall --keep-history`。
使用 `helm list --uninstalled` 可以查看使用 `--keep-history` 保留的卸载记录。

`helm list --all` 参数会显示Helm保留的所有发布记录，包括失败项和删除项（如果指定了`--keep-history`）。

```console
$  helm list --all
NAME            VERSION UPDATED                         STATUS          CHART
happy-panda     2       Wed Sep 28 12:47:54 2016        UNINSTALLED     mariadb-0.3.0
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
kindred-angelf  2       Tue Sep 27 16:16:10 2016        UNINSTALLED     alpine-0.1.0
```

注意，由于发布默认是删除了的，则不能在回滚到该卸载版本。

## 'helm repo'：使用仓库

Helm 3不再提供默认的chart仓库。`helm repo` 提供一组添加，列举和删除仓库的命令。

可以用 `helm repo list` 命令看到配置了哪些仓库：

```console
$ helm repo list
NAME            URL
stable          https://charts.helm.sh/stable
mumoshu         https://mumoshu.github.io/charts
```

使用 `helm repo add` 添加新仓库：

```console
$ helm repo add dev https://example.com/dev-charts
```

由于chart仓库频繁变动，在任何时候，都可以通过运行 `helm repo update` 来确保Helm客户端是最新的。

仓库使用 `helm repo remove` 删除。

## 创建您自己的chart

[Chart开发指南](https://helm.sh/zh/docs/topics/charts)描述了如何开发自己的chart，但您可以使用`helm
create`命令快速创建：

```console
$ helm create deis-workflow
Creating deis-workflow
```

现在`./deis-workflow`目录生成了一个chart。可以编辑并创建自己模板。

编辑chart时，可以运行`helm int`验证格式是否正确。

当准备好打包分发时，使用 `helm package` 命令：

```console
$ helm package deis-workflow
deis-workflow-0.1.0.tgz
```

现在chart可以很容易地使用 `helm install` 安装了：

```console
$ helm install deis-workflow ./deis-workflow-0.1.0.tgz
...
```

打包的chart可以加入到chart仓库中。查看您chart仓库服务的文档了解如何上传。

注意：`stable`仓库是由[Kubernetes Charts GitHub库](https://github.com/helm/charts)管理。
该项目为您收录源码和（审计后的）包。

## 结论

本章节介绍了`helm`客户端的基本使用模式，包括搜索、安装、升级、和卸载。并涵盖了像
`helm status`，`helm get`和`helm repo`等实用命令。

有关这些命令的更多信息，请查看Helm的内置帮助命令：`helm help`。

在[下一章节](https://helm.sh/zh/docs/howto/charts_tips_and_tricks/)，会看到开发chart的过程。
