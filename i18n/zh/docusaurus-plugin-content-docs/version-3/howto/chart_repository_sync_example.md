---
title: 同步你的 Chart 仓库
description: 介绍如何同步本地和远程 chart 仓库。
sidebar_position: 2
---

*注意：该示例演示如何使用 Google Cloud Storage (GCS) bucket 托管 chart 仓库。*

## 先决条件

* 安装 [gsutil](https://cloud.google.com/storage/docs/gsutil) 工具。*我们非常依赖 gsutil rsync 功能*
* 确保可以使用 Helm
* _可选：建议为 GCS bucket 启用[对象版本控制](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#top_of_page)，以防不小心删除了文件。_

## 设置本地 chart 仓库目录

参考 [chart 仓库指南](/zh/docs/topics/chart_repository)创建本地目录，并将打包好的 chart 放在该目录中。

例如：

```console
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
```

## 生成更新的 index.yaml

使用 Helm 生成更新的 index.yaml 文件，将目录路径和远程仓库 URL 传递给 `helm repo index` 命令：

```console
$ helm repo index fantastic-charts/ --url https://fantastic-charts.storage.googleapis.com
```

这会生成更新的 index.yaml 文件并放在 `fantastic-charts/` 目录中。

## 同步本地和远程仓库

运行 `scripts/sync-repo.sh` 脚本将目录内容上传到 GCS bucket，传入本地目录名和 bucket 名称作为参数。

例如：

```console
$ pwd
/Users/me/code/go/src/helm.sh/helm
$ scripts/sync-repo.sh fantastic-charts/ fantastic-charts
Getting ready to sync your local directory (fantastic-charts/) to a remote repository at gs://fantastic-charts
Verifying Prerequisites....
Thumbs up! Looks like you have gsutil. Let's continue.
Building synchronization state...
Starting synchronization
Would copy file://fantastic-charts/alpine-0.1.0.tgz to gs://fantastic-charts/alpine-0.1.0.tgz
Would copy file://fantastic-charts/index.yaml to gs://fantastic-charts/index.yaml
Are you sure you would like to continue with these changes?? [y/N]} y
Building synchronization state...
Starting synchronization
Copying file://fantastic-charts/alpine-0.1.0.tgz [Content-Type=application/x-tar]...
Uploading   gs://fantastic-charts/alpine-0.1.0.tgz:              740 B/740 B
Copying file://fantastic-charts/index.yaml [Content-Type=application/octet-stream]...
Uploading   gs://fantastic-charts/index.yaml:                    347 B/347 B
Congratulations your remote chart repository now matches the contents of fantastic-charts/
```

## 更新你的 chart 仓库

保留 chart 仓库的本地副本，或使用 `gsutil rsync` 将远程内容同步到本地目录。

例如：

```console
$ gsutil rsync -d -n gs://bucket-name local-dir/    # the -n flag does a dry run
Building synchronization state...
Starting synchronization
Would copy gs://bucket-name/alpine-0.1.0.tgz to file://local-dir/alpine-0.1.0.tgz
Would copy gs://bucket-name/index.yaml to file://local-dir/index.yaml

$ gsutil rsync -d gs://bucket-name local-dir/       # performs the copy actions
Building synchronization state...
Starting synchronization
Copying gs://bucket-name/alpine-0.1.0.tgz...
Downloading file://local-dir/alpine-0.1.0.tgz:                        740 B/740 B
Copying gs://bucket-name/index.yaml...
Downloading file://local-dir/index.yaml:                              346 B/346 B
```

相关链接：

* [gsutil rsync 文档](https://cloud.google.com/storage/docs/gsutil/commands/rsync#description)
* [Chart 仓库指南](/zh/docs/topics/chart_repository)
* Google Cloud Storage 的[对象版本控制和并发控制](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#overview)
