---
title: OCI ベースのレジストリの使用
description: OCI を使用した chart の配布方法について説明します。
sidebar_position: 7
---

Helm 3 以降、[OCI](https://www.opencontainers.org/) をサポートするコンテナレジストリを使用して chart パッケージを保存・共有できます。Helm v3.8.0 以降、OCI サポートはデフォルトで有効になっています。


## v3.8.0 より前の OCI サポート

OCI サポートは Helm v3.8.0 で実験的機能から一般提供（GA）に昇格しました。それ以前のバージョンでは OCI サポートの動作が異なります。v3.8.0 より前に OCI サポートを使用していた場合は、各バージョンの変更点を確認してください。

### v3.8.0 より前の OCI サポートの有効化

Helm v3.8.0 より前では、OCI サポートは*実験的*機能であり、明示的に有効化する必要があります。

v3.8.0 より前のバージョンで OCI サポートを有効にするには、環境変数 `HELM_EXPERIMENTAL_OCI` を設定します。例:

```console
export HELM_EXPERIMENTAL_OCI=1
```

### v3.8.0 での OCI 機能の廃止と動作変更

[Helm v3.8.0](https://github.com/helm/helm/releases/tag/v3.8.0) のリリースで、以下の機能と動作が以前のバージョンと異なっています:

- 依存関係で chart を OCI として設定する場合、他の依存関係と同様にバージョンを範囲指定できます。
- ビルド情報を含むセマンティックバージョンタグをプッシュして使用できます。OCI レジストリはタグ文字として `+` をサポートしていません。Helm はタグとして保存する際に `+` を `_` に変換します。
- `helm registry login` コマンドは、認証情報の保存において Docker CLI と同じ構造に従うようになりました。レジストリ設定の同じ場所を Helm と Docker CLI の両方に渡すことができます。

### v3.7.0 での OCI 機能の廃止と動作変更

[Helm v3.7.0](https://github.com/helm/helm/releases/tag/v3.7.0) のリリースには、OCI サポートの [HIP 6](https://github.com/helm/community/blob/main/hips/hip-0006.md) の実装が含まれていました。その結果、以下の機能と動作が以前のバージョンと異なっています:

- `helm chart` サブコマンドは削除されました。
- chart キャッシュは削除されました（`helm chart list` などはありません）。
- OCI レジストリ参照には常に `oci://` プレフィックスが必要です。
- レジストリ参照のベース名は*常に* chart の名前と一致する必要があります。
- レジストリ参照のタグは*常に* chart のセマンティックバージョンと一致する必要があります（`latest` タグは使用できません）。
- chart レイヤーのメディアタイプが `application/tar+gzip` から `application/vnd.cncf.helm.chart.content.v1.tar+gzip` に変更されました。


## OCI ベースのレジストリの使用

### OCI ベースレジストリにおける Helm リポジトリ

[Helm リポジトリ](/topics/chart_repository.md)は、パッケージ化された Helm chart を格納・配布する方法です。OCI ベースのレジストリには複数の Helm リポジトリを含めることができ、各リポジトリには複数のパッケージ化された Helm chart を含めることができます。

### ホステッドレジストリの使用

OCI 対応のホスト型コンテナレジストリがいくつかあります。例:

- [Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html)
- [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-helm-repos#push-chart-to-registry-as-oci-artifact)
- [Cloudsmith](https://help.cloudsmith.io/docs/oci-repository)
- [Docker Hub](https://docs.docker.com/docker-hub/oci-artifacts/)
- [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs/helm/manage-charts)
- [Harbor](https://goharbor.io/docs/main/administration/user-defined-oci-artifact/)
- [IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-registry_helm_charts)
- [JFrog Artifactory](https://jfrog.com/help/r/jfrog-artifactory-documentation/helm-oci-repositories)
- [RepoFlow](https://docs.repoflow.io/PackageTypes/helm#oci-helm-support)
  

ホステッドコンテナレジストリプロバイダーのドキュメントに従って、OCI サポート付きのレジストリを作成・設定してください。

**注意:** ローカル環境で [Docker Registry](https://docs.docker.com/registry/deploying/) や [`zot`](https://github.com/project-zot/zot) などの OCI レジストリを実行することも可能です。ただし、ローカル環境での実行はテスト目的に限定してください。

### sigstore を使用した OCI ベース chart の署名

[`helm-sigstore`](https://github.com/sigstore/helm-sigstore) プラグインを使用すると、コンテナイメージの署名と同じツールで [Sigstore](https://sigstore.dev/) を使用して Helm chart に署名できます。これは、従来の [chart リポジトリ](/topics/chart_repository.md)でサポートされている [GPG ベースの provenance](/topics/provenance.md) の代替手段です。

`helm sigstore` プラグインの使用方法の詳細は、[プロジェクトのドキュメント](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md)を参照してください。

## レジストリ操作用のコマンド

### `registry` サブコマンド

#### `login`

レジストリにログインします（パスワードを手動入力）

```console
$ helm registry login -u myuser localhost:5000
Password:
Login succeeded
```

#### `logout`

レジストリからログアウトします

```console
$ helm registry logout localhost:5000
Logout succeeded
```

### `push` サブコマンド

OCI ベースのレジストリに chart をアップロードします:

```console
$ helm push mychart-0.1.0.tgz oci://localhost:5000/helm-charts
Pushed: localhost:5000/helm-charts/mychart:0.1.0
Digest: sha256:ec5f08ee7be8b557cd1fc5ae1a0ac985e8538da7c93f51a51eff4b277509a723
```

`push` サブコマンドは、事前に `helm package` で作成した `.tgz` ファイルに対してのみ使用できます。

`helm push` を使用して chart を OCI レジストリにアップロードする場合、参照には `oci://` プレフィックスを付ける必要があり、ベース名やタグを含めてはいけません。

レジストリ参照のベース名は chart の名前から推測され、タグは chart のセマンティックバージョンから推測されます。これは現在、厳格な要件です。

一部のレジストリでは、リポジトリや namespace（指定する場合）を事前に作成しておく必要があります。そうしないと、`helm push` 操作中にエラーが発生します。

[provenance ファイル](/topics/provenance.md)（`.prov`）を作成済みで、chart の `.tgz` ファイルと同じディレクトリにある場合、`push` 時に自動的にレジストリにアップロードされます。これにより、[Helm chart マニフェスト](#helm-chart-manifest)に追加のレイヤーが作成されます。

[helm-push プラグイン](https://github.com/chartmuseum/helm-push)（[ChartMuseum](/topics/chart_repository.md#chartmuseum-repository-server) に chart をアップロードするためのプラグイン）のユーザーは、このプラグインが新しい組み込みの `push` と競合するため、問題が発生する可能性があります。バージョン v0.10.0 以降、このプラグインは `cm-push` に名前が変更されました。

### その他のサブコマンド

`oci://` プロトコルは、他のさまざまなサブコマンドでもサポートされています。以下は完全なリストです:

- `helm pull`
- `helm push`
- `helm show `
- `helm template`
- `helm install`
- `helm upgrade`

chart のダウンロードを伴うアクションでは、レジストリ参照のベース名（chart 名）を含めます（`helm push` ではベース名を省略）。

以下は、上記のサブコマンドを OCI ベースの chart に対して使用する例です:

```
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

## 依存関係の指定

chart の依存関係は、`dependency update` サブコマンドを使用してレジストリから取得できます。

`Chart.yaml` 内の各エントリの `repository` は、ベース名を除いたレジストリ参照として指定します:

```
dependencies:
  - name: mychart
    version: "2.7.0"
    repository: "oci://localhost:5000/myrepo"
```
`dependency update` を実行すると、`oci://localhost:5000/myrepo/mychart:2.7.0` が取得されます。

## Helm chart マニフェスト

レジストリに表示される Helm chart マニフェストの例です（`mediaType` フィールドに注目してください）:
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

以下の例には [provenance ファイル](/topics/provenance.md)が含まれています（追加のレイヤーに注目してください）:

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

## chart リポジトリからの移行

従来の [chart リポジトリ](/topics/chart_repository.md)（index.yaml ベースのリポジトリ）からの移行は、`helm pull` を使用してから、生成された `.tgz` ファイルを `helm push` でレジストリにアップロードするだけです。
