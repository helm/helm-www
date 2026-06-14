---
title: Chart リポジトリガイド
description: Helm chart リポジトリの作成と操作方法について説明します。
sidebar_position: 6
---

このセクションでは、Helm chart リポジトリの作成と操作方法について説明します。chart リポジトリとは、パッケージ化された chart を保存・共有するための場所です。

分散型のコミュニティ Helm chart リポジトリは [Artifact Hub](https://artifacthub.io/packages/search?kind=0) にあり、参加を歓迎しています。Helm では独自の chart リポジトリを作成・運用することも可能です。このガイドではその方法を説明します。chart リポジトリの作成を検討している場合は、[OCI レジストリ](/topics/registries.md)の使用も検討してください。

## 前提条件

* [クイックスタート](/intro/quickstart.md)ガイドを完了してください
* [Chart](/topics/charts.md) ドキュメントを読んでください

## Chart リポジトリの作成

_chart リポジトリ_ は、`index.yaml` ファイルと、任意でいくつかのパッケージ化された chart をホストする HTTP サーバーです。chart を共有する準備ができたら、chart リポジトリにアップロードするのが推奨される方法です。

Helm 2.2.0 以降、リポジトリへのクライアント側 SSL 認証がサポートされています。その他の認証プロトコルはプラグインとして利用できる場合があります。

chart リポジトリは YAML ファイルと tar ファイルを提供し、GET リクエストに応答できる任意の HTTP サーバーで構成できるため、独自の chart リポジトリをホストする方法には多くの選択肢があります。たとえば、Google Cloud Storage（GCS）バケット、Amazon S3 バケット、GitHub Pages を使用したり、独自の Web サーバーを作成したりできます。

### Chart リポジトリの構造

chart リポジトリは、パッケージ化された chart と、リポジトリ内のすべての chart のインデックスを含む `index.yaml` という特別なファイルで構成されます。`index.yaml` が記述する chart は、同じサーバー上にホストされていることが多く、[来歴ファイル](/topics/provenance.md)も同様です。

たとえば、リポジトリ `https://example.com/charts` のレイアウトは以下のようになります:

```
charts/
  |
  |- index.yaml
  |
  |- alpine-0.1.2.tgz
  |
  |- alpine-0.1.2.tgz.prov
```

この場合、インデックスファイルには Alpine という 1 つの chart に関する情報が含まれ、その chart のダウンロード URL `https://example.com/charts/alpine-0.1.2.tgz` を提供します。

chart パッケージが `index.yaml` ファイルと同じサーバーに配置されている必要はありませんが、そうすることが最も簡単な場合が多いです。

### インデックスファイル

インデックスファイルは `index.yaml` という名前の YAML ファイルです。chart の `Chart.yaml` ファイルの内容を含むパッケージに関するメタデータが含まれます。有効な chart リポジトリにはインデックスファイルが必要です。インデックスファイルには、chart リポジトリ内の各 chart に関する情報が含まれます。`helm repo index` コマンドは、パッケージ化された chart を含むローカルディレクトリに基づいてインデックスファイルを生成します。

以下はインデックスファイルの例です:

```yaml
apiVersion: v1
entries:
  alpine:
    - created: 2016-10-06T16:23:20.499814565-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 99c76e403d752c84ead610644d4b1c2f2b453a74b921f422b9dcb8a7c8b559cd
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.2.0.tgz
      version: 0.2.0
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Deploy a basic Alpine Linux pod
      digest: 515c58e5f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cd78727
      home: https://helm.sh/helm
      name: alpine
      sources:
      - https://github.com/helm/helm
      urls:
      - https://technosophos.github.io/tscharts/alpine-0.1.0.tgz
      version: 0.1.0
  nginx:
    - created: 2016-10-06T16:23:20.499543808-06:00
      description: Create a basic nginx HTTP server
      digest: aaff4545f79d8b2913a10cb400ebb6fa9c77fe813287afbacf1a0b897cdffffff
      home: https://helm.sh/helm
      name: nginx
      sources:
      - https://github.com/helm/charts
      urls:
      - https://technosophos.github.io/tscharts/nginx-1.1.0.tgz
      version: 1.1.0
generated: 2016-10-06T16:23:20.499029981-06:00
```

## Chart リポジトリのホスティング

このセクションでは、chart リポジトリを提供するいくつかの方法を紹介します。

### Google Cloud Storage

最初のステップは、**GCS バケットを作成する**ことです。ここでは `fantastic-charts` という名前にします。

![GCS バケットを作成する](/img/helm2/create-a-bucket.png)

次に、**バケットの権限を編集**してバケットを公開します。

![権限を編集](/img/helm2/edit-permissions.png)

この行を追加して、**バケットを公開**します:

![バケットを公開する](/img/helm2/make-bucket-public.png)

これで、chart を配信するための空の GCS バケットの準備が整いました。

Google Cloud Storage コマンドラインツールまたは GCS Web UI を使用して chart リポジトリをアップロードできます。公開 GCS バケットには、次のアドレスでシンプルな HTTPS 経由でアクセスできます: `https://bucket-name.storage.googleapis.com/`

### Cloudsmith

Cloudsmith を使用して chart リポジトリをセットアップすることもできます。Cloudsmith での chart リポジトリについては、[こちら](https://help.cloudsmith.io/docs/helm-chart-repository)を参照してください。

### JFrog Artifactory

同様に、JFrog Artifactory を使用して chart リポジトリをセットアップすることもできます。JFrog Artifactory での chart リポジトリについては、[こちら](https://www.jfrog.com/confluence/display/RTF/Helm+Chart+Repositories)を参照してください。

### GitHub Pages の例

同様の方法で、GitHub Pages を使用して chart リポジトリを作成できます。

GitHub では、2 つの異なる方法で静的 Web ページを提供できます:

- プロジェクトの `docs/` ディレクトリの内容を提供するように設定する
- プロジェクトの特定のブランチを提供するように設定する

ここでは 2 番目のアプローチを使用しますが、1 番目も同様に簡単です。

最初のステップは、**gh-pages ブランチを作成する**ことです。ローカルで以下のように実行できます:

```console
$ git checkout -b gh-pages
```

または、GitHub リポジトリの **Branch** ボタンを使用して Web ブラウザ経由で作成できます:

![GitHub Pages ブランチを作成する](/img/helm2/create-a-gh-page-button.png)

次に、**gh-pages ブランチ** が GitHub Pages として設定されていることを確認します。リポジトリの **Settings** をクリックし、**GitHub pages** セクションまでスクロールして、以下のように設定します:

![GitHub Pages ブランチを作成する](/img/helm2/set-a-gh-page.png)

デフォルトでは **Source** は通常 **gh-pages branch** に設定されます。デフォルトで設定されていない場合は、選択してください。

必要に応じて、**カスタムドメイン**を使用することもできます。

また、**Enforce HTTPS** がチェックされていることを確認してください。これにより、chart が提供される際に **HTTPS** が使用されます。

このセットアップでは、デフォルトブランチを chart のコード保存に使用し、**gh-pages ブランチ**を chart リポジトリとして使用できます。例: `https://USERNAME.github.io/REPONAME`。デモンストレーション用の [TS Charts](https://github.com/technosophos/tscharts) リポジトリは `https://technosophos.github.io/tscharts/` でアクセスできます。

GitHub Pages を使用して chart リポジトリをホストする場合は、[Chart Releaser Action](/howto/chart_releaser_action.md) を確認してください。Chart Releaser Action は、[helm/chart-releaser](https://github.com/helm/chart-releaser) CLI ツールを使用して、GitHub プロジェクトをセルフホスト型の Helm chart リポジトリに変換する GitHub Action ワークフローです。

### 通常の Web サーバー

Helm chart を提供するために通常の Web サーバーを設定するには、以下の作業が必要です:

- インデックスと chart をサーバーが提供できるディレクトリに配置する
- `index.yaml` ファイルが認証なしでアクセスできることを確認する
- `yaml` ファイルが正しいコンテンツタイプ（`text/yaml` または `text/x-yaml`）で提供されることを確認する

たとえば、`$WEBROOT/charts` から chart を提供したい場合は、Web ルートに `charts/` ディレクトリがあることを確認し、そのフォルダ内にインデックスファイルと chart を配置します。

### ChartMuseum リポジトリサーバー

ChartMuseum は Go（Golang）で書かれたオープンソースの Helm Chart リポジトリサーバーで、[Google Cloud Storage](https://cloud.google.com/storage/)、[Amazon S3](https://aws.amazon.com/s3/)、[Microsoft Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)、[Alibaba Cloud OSS Storage](https://www.alibabacloud.com/product/oss)、[Openstack Object Storage](https://developer.openstack.org/api-ref/object-store/)、[Oracle Cloud Infrastructure Object Storage](https://cloud.oracle.com/storage)、[Baidu Cloud BOS Storage](https://cloud.baidu.com/product/bos.html)、[Tencent Cloud Object Storage](https://intl.cloud.tencent.com/product/cos)、[DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/)、[Minio](https://min.io/)、[etcd](https://etcd.io/) などのクラウドストレージバックエンドをサポートしています。

[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage) サーバーを使用して、ローカルファイルシステムから chart リポジトリをホストすることもできます。

### GitLab Package Registry

GitLab では、プロジェクトの Package Registry で Helm chart を公開できます。GitLab で Helm パッケージリポジトリをセットアップする方法については、[こちら](https://docs.gitlab.com/ee/user/packages/helm_repository/)を参照してください。

## Chart リポジトリの管理

chart リポジトリができたので、このガイドの最後のパートでは、そのリポジトリで chart を管理する方法を説明します。

### Chart リポジトリに chart を保存する

chart リポジトリができたので、chart とインデックスファイルをリポジトリにアップロードしましょう。chart リポジトリ内の chart は、パッケージ化（`helm package chart-name/`）され、正しくバージョニングされている必要があります（[SemVer 2](https://semver.org/) ガイドラインに従います）。

以下の手順はワークフローの例ですが、chart リポジトリへの chart の保存・更新には好みのワークフローを使用できます。

パッケージ化された chart の準備ができたら、新しいディレクトリを作成し、パッケージ化された chart をそのディレクトリに移動します。

```console
$ helm package docs/examples/alpine/
$ mkdir fantastic-charts
$ mv alpine-0.1.0.tgz fantastic-charts/
$ helm repo index fantastic-charts --url https://fantastic-charts.storage.googleapis.com
```

最後のコマンドは、作成したローカルディレクトリのパスとリモート chart リポジトリの URL を受け取り、指定されたディレクトリパス内に `index.yaml` ファイルを生成します。

これで、同期ツールまたは手動で chart とインデックスファイルを chart リポジトリにアップロードできます。Google Cloud Storage を使用している場合は、gsutil クライアントを使用した[ワークフロー例](/howto/chart_repository_sync_example.md)を確認してください。GitHub の場合は、適切な宛先ブランチに chart を配置するだけです。

### 既存のリポジトリに新しい chart を追加する

リポジトリに新しい chart を追加するたびに、インデックスを再生成する必要があります。`helm repo index` コマンドは、ローカルで見つかった chart のみを含めて、`index.yaml` ファイルを最初から完全に再構築します。

ただし、`--merge` フラグを使用して、既存の `index.yaml` ファイルに新しい chart を増分的に追加できます（GCS などのリモートリポジトリで作業する場合に便利なオプションです）。詳細は `helm repo index --help` を実行してください。

更新された `index.yaml` ファイルと chart の両方をアップロードしてください。来歴ファイルを生成した場合は、それもアップロードしてください。

### Chart を他のユーザーと共有する

chart を共有する準備ができたら、リポジトリの URL を他のユーザーに伝えるだけです。

相手は、リポジトリを参照するために使用したい任意の名前で、`helm repo add [NAME] [URL]` コマンドを使用して Helm クライアントにリポジトリを追加します。

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

chart が HTTP ベーシック認証で保護されている場合は、ユーザー名とパスワードも指定できます:

```console
$ helm repo add fantastic-charts https://fantastic-charts.storage.googleapis.com --username my-username --password my-password
$ helm repo list
fantastic-charts    https://fantastic-charts.storage.googleapis.com
```

**注:** 有効な `index.yaml` が含まれていない場合、リポジトリは追加されません。

**注:** Helm リポジトリが自己署名証明書を使用している場合などは、`helm repo add --insecure-skip-tls-verify ...` を使用して CA 検証をスキップできます。

その後、ユーザーは chart を検索できるようになります。リポジトリを更新した後は、`helm repo update` コマンドを使用して最新の chart 情報を取得できます。

*内部的には、`helm repo add` と `helm repo update` コマンドは index.yaml ファイルを取得し、`$XDG_CACHE_HOME/helm/repository/cache/` ディレクトリに保存します。`helm search` 機能は、ここから chart に関する情報を検索します。*
