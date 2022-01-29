---
title: "注册中心"
description: "描述如何使用 OCI 进行Chart的分发。"
weight: 7
---

Helm 3 支持 <a href="https://www.opencontainers.org/"
target="_blank">OCI</a> 用于包分发。 Chart包可以通过基于OCI的注册中心存储和分发。

## 激活对 OCI 的支持

在Helm v3.8.0之前，OCI支持被认为是*实验性的*，需要手动启用。从v3.8.0开始，默认启用。

为了在v3.8.0之前的版本中使用OCI实验性支持，请在环境变量中设置`HELM_EXPERIMENTAL_OCI`：

```console
export HELM_EXPERIMENTAL_OCI=1
```

## 运行一个注册中心

为测试目的启动注册中心是比较简单的。只要您安装了Docker，运行以下命令即可：

```console
docker run -dp 5000:5000 --restart=always --name registry registry
```

这样就会启动一个注册服务在 `localhost:5000`。

使用 `docker logs -f registry` 可以查看日志， `docker rm -f registry` 可以停止服务。

如果您希望持久化存储，可以在上面的命令中添加 `-v $(pwd)/registry:/var/lib/registry` 。

关于更多配置选项，请查看 [文档](https://docs.docker.com/registry/deploying/).

注意：macOS上，`5000`端口可能被"AirPlay Receiver"占用。您可以选择其他本地接口（比如：`-p 5001:5000`），或者在系统偏好设置中关闭AirPlay。

### 认证

如果您想启用注册中心认证，需要使用用户名和密码先创建 `auth.htpasswd` 文件：

```console
htpasswd -cB -b auth.htpasswd myuser mypass
```

然后启动服务，启动时挂载文件并设置 `REGISTRY_AUTH`环境变量：

```console
docker run -dp 5000:5000 --restart=always --name registry \
  -v $(pwd)/auth.htpasswd:/etc/docker/registry/auth.htpasswd \
  -e REGISTRY_AUTH="{htpasswd: {realm: localhost, path: /etc/docker/registry/auth.htpasswd}}" \
  registry
```

## 用于处理注册中心的命令

### `registry` 子命令

#### `login`

登录到注册中心 (手动输入密码)

```console
$ helm registry login -u myuser localhost:5000
Password:
Login succeeded
```

#### `logout`

从注册中心注销

```console
$ helm registry logout localhost:5000
Logout succeeded
```

### The `push` 子命令

上传chart到注册中心

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

#### `push`子命令的额外说明

`push`子命令只能用于`helm package`提前创建的`.tgz`文件。

使用`helm push`上传chart到OCI注册表时，引用必须以`oci://`开头，且不能包含基础名称或tag。

注册表引用基础名称是由chart名称推断而来，tag是由chart语义版本推断而来。这是目前的严格要求。([更多信息](#deprecated-features-and-strict-naming-policies))。

某些注册表（如果指定）要求事先创建仓库或者命名空间，或者两者都需要创建。否则，`helm push` 会出现错误。

如果您已经创建了一个[源文件](https://helm.sh/zh/docs/topics/provenance) (`.prov`),
且和`.tgz`文件在同一文件下，会通过`push`自动上传到注册表。会在 [Helm chart manifest](#helm-chart-manifest)生成一个额外的层。

[helm-push plugin](https://github.com/chartmuseum/helm-push)的用户 (用于上传chart到
[ChartMuseum](https://helm.sh/zh/docs/topics/provenance#chartmuseum-repository-server))可能会遇到问题，因为与内置的新的`push`插件有冲突。
从v0.10.0版本开始，该插件已被命名为`cm-push`。

### 其他命令

对`oci://`协议的支持同样适用于很多其他子命令。以下是完整列表：

- `helm pull`
- `helm show`
- `helm template`
- `helm install`
- `helm upgrade`

注册表的基础名称(chart name)*包含*了涉及chart下载的任意类型的操作。（相对于`helm push`被省略的位置）。

下面是一些基于OCI的chart使用上述子命令的示例：

```console
$ helm pull oci://localhost:5000/helm-charts/mychart --version 0.1.0
Pulled: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:0be7ec9fb7b962b46d81e4bb74fdcdb7089d965d3baca9f85d64948b05b402ff

$ helm show all oci://localhost:5000/helm-charts/mychart --version 0.1.0
apiVersion: v2
appVersion: 1.16.0
description: A Helm chart for Kubernetes
name: mychart
...

$ helm template myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
---
# Source: mychart/templates/serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
...

$ helm install myrelease oci://localhost:5000/helm-charts/mychart --version 0.1.0
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:11:40 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
...

$ helm upgrade myrelease oci://localhost:5000/helm-charts/mychart --version 0.2.0
Release "myrelease" has been upgraded. Happy Helming!
NAME: myrelease
LAST DEPLOYED: Wed Oct 27 15:12:05 2021
NAMESPACE: default
STATUS: deployed
REVISION: 2
NOTES:
...
```

## 指定依赖项

chart的依赖项可用从使用了`dependency update`命令的注册中心拉取。

`Chart.yaml`中给定的`repository`被指定为没有基础名称注册表引用：

```yaml
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```

这会在执行`dependency update`时获取`oci://localhost:5000/myrepo/mychart:2.7.0`。

## Helm chart manifest

在注册表中表示的Helm chart manifest示例（注意`mediaType`字段）：

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    }
  ]
}
```

下面的示例包含一个[源文件](https://helm.sh/zh/docs/topics/provenance)（注意额外层）：

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/vnd.cncf.helm.chart.content.v1.tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    },
    {
      "mediaType": "application/vnd.cncf.helm.chart.provenance.v1.prov",
      "digest": "sha256:3e207b409db364b595ba862cdc12be96dcdad8e36c59a03b7b3b61c946a5741a",
      "size": 643
    }
  ]
}
```

## 从chart仓库迁移

从经典 [chart 仓库](https://helm.sh/zh/docs/topics/chart_repository)（基于index.yaml）和使用
`helm pull`一样简单，然后使用`helm push`上传生成的`.tgz`文件到注册表。

## Deprecated features and strict naming policies

在Helm [3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0) 之前，Helm的OCI支持略有不同。

为了简化和稳定这个功能集，形成[HIP 6](https://github.com/helm/community/blob/main/hips/hip-0006.md)，
做了一些更改：

- 移除了`helm chart`子命令
- 删除了chart缓存（无`helm chart list`等）
- OCI 注册表引用现在要以`oci://`作为前缀
- 注册表引用的基础名称必须*始终*匹配chart名称
- 注册表引用的tag必须*始终*匹配chart的语义版本（即去掉了`latest`版本）
- chart层媒体类型从 `application/tar+gzip` 切换到了 `application/vnd.cncf.helm.chart.content.v1.tar+gzip`

感谢您的耐心，Helm团队将继续致力于稳定对OCI注册表的本地支持。
