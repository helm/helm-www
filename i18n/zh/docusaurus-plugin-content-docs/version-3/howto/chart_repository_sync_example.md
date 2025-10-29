---
title: 同步你的Chart仓库
description: 描述如何同步本地和远程仓库
sidebar_position: 2
---

*注意： 该示例是专门针对Google Cloud Storage (GCS)提供的chart仓库。*

## 先决条件

* 安装[gsutil](https://cloud.google.com/storage/docs/gsutil)工具。 *我们非常依赖gsutil rsync功能*
* 确保可以使用Helm程序
* _可选：我们推荐在你的GCS中设置[对象版本](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#top_of_page)以防不小心删除了什么。_

## 设置本地chart仓库目录

就像我们在[chart仓库指南](https://helm.sh/zh/docs/topics/chart_repository)做的，创建一个本地目录，并将打包好的chart放在该目录中。

例如：

```console
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
```

## 生成新的index.yaml

使用Helm生成新的index.yaml文件，通过将目录路径和远程仓库url传递给`helm repo index`命令：

```console
$ helm repo index fantastic-charts/ --url https://fantastic-charts.storage.googleapis.com
```

这会生成新的index.yaml文件并放在`fantastic-charts/`目录。

## 同步本地和远程仓库

使用`scripts/sync-repo.sh`命令上传GCS目录中的内容并传入本地目录名和GCS名。

例如:

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

## 更新你的chart仓库

您需要保留chart仓库内容的本地副本或使用`gsutil rsync`拷贝远程chart仓库内容到本地目录。

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

帮助链接：

* [gsutil rsync文档](https://cloud.google.com/storage/docs/gsutil/commands/rsync#description)
* [Chart仓库指南](https://helm.sh/zh/docs/topics/chart_repository)
* Google Cloud Storage的[对象版本控制和并发控制](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#overview)
