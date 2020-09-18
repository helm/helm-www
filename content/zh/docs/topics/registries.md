---
title: "注册中心"
description: "描述如何使用 OCI 进行Chart的分发。"
weight: 7
---

Helm 3 支持 <a href="https://www.opencontainers.org/"
target="_blank">OCI</a> 用于包分发。 Chart包可以通过基于OCI的注册中心存储和分发。

## 激活对 OCI 的支持

当前的对 OCI 的支持被认为具有*实验性*。

为了能使用下面描述的命令，需要在环境变量中设置 `HELM_EXPERIMENTAL_OCI`：

```console
export HELM_EXPERIMENTAL_OCI=1
```

## 运行一个注册中心

为测试目的启动注册中心是比较简单的。只要你安装了Docker，运行以下命令即可：
```console
docker run -dp 5000:5000 --restart=always --name registry registry
```

这样就会启动一个注册服务在 `localhost:5000`。

使用 `docker logs -f registry` 可以查看日志， `docker rm -f registry` 可以停止服务。

如果你希望持久化存储，可以在上面的命令中添加 `-v $(pwd)/registry:/var/lib/registry` 。

关于更多配置选项，请查看 [文档](https://docs.docker.com/registry/deploying/).

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

 `helm registry` 和 `helm chart` 下的命令都可以用来操作注册中心和本地缓存。

###  `registry` 子命令

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

### The `chart` 子命令

#### `save`

保存chart目录到本地缓存

```console
$ helm chart save mychart/ localhost:5000/myrepo/mychart:2.7.0
ref:     localhost:5000/myrepo/mychart:2.7.0
digest:  1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
size:    2.4 KiB
name:    mychart
version: 0.1.0
2.7.0: saved
```

#### `list`

列举出所有的chart

```console
$ helm chart list
REF                                                     NAME                    VERSION DIGEST  SIZE            CREATED
localhost:5000/myrepo/mychart:2.7.0                     mychart                 2.7.0   84059d7 454 B           27 seconds
localhost:5000/stable/acs-engine-autoscaler:2.2.2       acs-engine-autoscaler   2.2.2   d8d6762 4.3 KiB         2 hours
localhost:5000/stable/aerospike:0.2.1                   aerospike               0.2.1   4aff638 3.7 KiB         2 hours
localhost:5000/stable/airflow:0.13.0                    airflow                 0.13.0  c46cc43 28.1 KiB        2 hours
localhost:5000/stable/anchore-engine:0.10.0             anchore-engine          0.10.0  3f3dcd7 34.3 KiB        2 hours
...
```

#### `export`

导出chart到目录

```console
$ helm chart export localhost:5000/myrepo/mychart:2.7.0
ref:     localhost:5000/myrepo/mychart:2.7.0
digest:  1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
size:    2.4 KiB
name:    mychart
version: 0.1.0
Exported chart to mychart/
```

#### `push`

推送chart到远程

```console
$ helm chart push localhost:5000/myrepo/mychart:2.7.0
The push refers to repository [localhost:5000/myrepo/mychart]
ref:     localhost:5000/myrepo/mychart:2.7.0
digest:  1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
size:    2.4 KiB
name:    mychart
version: 0.1.0
2.7.0: pushed to remote (1 layer, 2.4 KiB total)
```

#### `remove`

从缓存中移除chart

```console
$ helm chart remove localhost:5000/myrepo/mychart:2.7.0
2.7.0: removed
```

#### `pull`

从远程拉取chart

```console
$ helm chart pull localhost:5000/myrepo/mychart:2.7.0
2.7.0: Pulling from localhost:5000/myrepo/mychart
ref:     localhost:5000/myrepo/mychart:2.7.0
digest:  1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
size:    2.4 KiB
name:    mychart
version: 0.1.0
Status: Downloaded newer chart for localhost:5000/myrepo/mychart:2.7.0
```

## 我的chart在哪里?

使用上述命令存储的chart会被缓存到文件系统中。

[OCI 镜像设计规范](https://github.com/opencontainers/image-spec/blob/master/image-layout.md) 严格遵守文件系统布局的。例如：
```console
$ tree ~/Library/Caches/helm/
/Users/myuser/Library/Caches/helm/
└── registry
    ├── cache
    │   ├── blobs
    │   │   └── sha256
    │   │       ├── 1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617
    │   │       ├── 31fb454efb3c69fafe53672598006790122269a1b3b458607dbe106aba7059ef
    │   │       └── 8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111
    │   ├── index.json
    │   ├── ingest
    │   └── oci-layout
    └── config.json
```

index.json示例， 包含了所有的Helm chart manifests的参考：
```console
$ cat ~/Library/Caches/helm/registry/cache/index.json  | jq
{
  "schemaVersion": 2,
  "manifests": [
    {
      "mediaType": "application/vnd.oci.image.manifest.v1+json",
      "digest": "sha256:31fb454efb3c69fafe53672598006790122269a1b3b458607dbe106aba7059ef",
      "size": 354,
      "annotations": {
        "org.opencontainers.image.ref.name": "localhost:5000/myrepo/mychart:2.7.0"
      }
    }
  ]
}
```

Helm chart manifest示例 (注意 `mediaType` 字段):
```console
$ cat ~/Library/Caches/helm/registry/cache/blobs/sha256/31fb454efb3c69fafe53672598006790122269a1b3b458607dbe106aba7059ef | jq
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.cncf.helm.config.v1+json",
    "digest": "sha256:8ec7c0f2f6860037c19b54c3cfbab48d9b4b21b485a93d87b64690fdb68c2111",
    "size": 117
  },
  "layers": [
    {
      "mediaType": "application/tar+gzip",
      "digest": "sha256:1b251d38cfe948dfc0a5745b7af5ca574ecb61e52aed10b19039db39af6e1617",
      "size": 2487
    }
  ]
}
```

## 从chart仓库迁移

从经典 [chart 仓库](https://helm.sh/docs/topics/chart_repository.md)
（基于index.yaml的仓库） 尽量简单地 `helm fetch` (Helm 2 CLI), `helm
chart save`, `helm chart push`。
