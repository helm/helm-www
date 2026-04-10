---
title: Chart リポジトリの同期
description: ローカルとリモートの chart リポジトリを同期する方法について説明します。
sidebar_position: 2
---

*注: この例は、chart リポジトリとして機能する Google Cloud Storage（GCS）バケット専用です。*

## 前提条件
* [gsutil](https://cloud.google.com/storage/docs/gsutil) ツールをインストールします。*gsutil rsync 機能を多用します*
* Helm バイナリにアクセスできることを確認します
* _オプション: 誤ってデータを削除した場合に備えて、GCS バケットで[オブジェクトのバージョニング](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#top_of_page)を設定することを推奨します。_

## ローカル chart リポジトリディレクトリのセットアップ
[chart リポジトリガイド](/topics/chart_repository.md)で説明したように、ローカルディレクトリを作成し、パッケージ化された chart をそのディレクトリに配置します。

例:
```console
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
```

## 更新された index.yaml の生成
Helm を使用して、ディレクトリパスとリモートリポジトリの URL を `helm repo index` コマンドに渡し、更新された index.yaml ファイルを生成します。

```console
$ helm repo index fantastic-charts/ --url https://fantastic-charts.storage.googleapis.com
```
このコマンドは更新された index.yaml ファイルを生成し、`fantastic-charts/` ディレクトリに配置します。

## ローカルとリモートの chart リポジトリを同期する
`scripts/sync-repo.sh` を実行してディレクトリの内容を GCS バケットにアップロードします。ローカルディレクトリ名と GCS バケット名を引数として渡します。

例:
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
## chart リポジトリの更新
chart リポジトリの内容のローカルコピーを保持することを推奨します。また、`gsutil rsync` を使用してリモート chart リポジトリの内容をローカルディレクトリにコピーすることもできます。

例:
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

参考リンク:
* [gsutil rsync](https://cloud.google.com/storage/docs/gsutil/commands/rsync#description) ドキュメント
* [Chart リポジトリガイド](/topics/chart_repository.md)
* Google Cloud Storage の[オブジェクトのバージョニングと同時実行制御](https://cloud.google.com/storage/docs/gsutil/addlhelp/ObjectVersioningandConcurrencyControl#overview)ドキュメント
