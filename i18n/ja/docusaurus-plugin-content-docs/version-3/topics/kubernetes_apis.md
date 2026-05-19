---
title: 非推奨の Kubernetes API
description: Helm における非推奨の Kubernetes API について説明します
---

Kubernetes は API 駆動型のシステムであり、システムへの理解が深まるにつれて API も進化します。これはシステムとその API において一般的なプラクティスです。API を進化させるうえで重要なのは、適切な非推奨ポリシーとプロセスを整備し、API の変更内容をユーザーに通知することです。API の利用者は、どの API がいつ削除または変更されるのかを事前に把握する必要があります。これにより、予期しない破壊的変更を回避できます。

[Kubernetes の非推奨ポリシー](https://kubernetes.io/docs/reference/using-api/deprecation-policy/)には、Kubernetes が API バージョンの変更をどのように扱うかが記載されています。このポリシーでは、非推奨の発表後に各 API バージョンがサポートされる期間が定められています。非推奨の発表を把握し、API バージョンがいつ削除されるかを知っておくことが、影響を最小限に抑えるために重要です。

以下は、[Kubernetes 1.16 における非推奨 API バージョンの削除](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/)に関するアナウンスの例です。このアナウンスはリリースの数ヶ月前に告知されました。これらの API バージョンは、この発表より前にすでに非推奨として発表されていたものです。このように、API バージョンのサポート状況を利用者に適切に通知するポリシーが整備されています。

Helm テンプレートでは、Kubernetes オブジェクトを定義する際に [Kubernetes API グループ](https://kubernetes.io/docs/concepts/overview/kubernetes-api/#api-groups)を指定します。これは Kubernetes のマニフェストファイルと同様です。API グループはテンプレートの `apiVersion` フィールドで指定し、Kubernetes オブジェクトの API バージョンを識別します。Helm ユーザーと chart メンテナーは、Kubernetes API バージョンがいつ非推奨となり、どの Kubernetes バージョンで削除されるかを把握しておく必要があります。

## Chart メンテナー向け

chart を監査し、非推奨または特定の Kubernetes バージョンで削除された API バージョンがないか確認してください。サポートが終了した、または終了予定の API バージョンが見つかった場合は、サポートされているバージョンに更新し、新しいバージョンの chart をリリースしてください。API バージョンは `kind` と `apiVersion` フィールドで定義されます。以下は、Kubernetes 1.16 で削除された `Deployment` オブジェクトの API バージョンの例です。

```yaml
apiVersion: apps/v1beta1
kind: Deployment
```

## Helm ユーザー向け

使用している chart を監査し（[Chart メンテナー向け](#chart-メンテナー向け)と同様）、非推奨または特定の Kubernetes バージョンで削除された API バージョンがないか確認してください。該当する chart が見つかった場合は、サポートされている API バージョンを含む最新バージョンの chart を確認するか、自身で chart を更新してください。

さらに、デプロイ済みの chart（Helm release）についても監査し、非推奨または削除された API バージョンがないか確認する必要があります。`helm get manifest` コマンドを使用して release の詳細を取得できます。

サポートされている API への Helm release の更新方法は、調査結果に応じて以下のように異なります。

1. 非推奨の API バージョンのみが見つかった場合:
   - サポートされている Kubernetes API バージョンを含む chart で `helm upgrade` を実行します
   - アップグレード時の説明（description）に、現在のバージョンより前にはロールバックしないよう注意書きを追加します
2. 特定の Kubernetes バージョンで削除された API バージョンが見つかった場合:
   - API バージョンがまだ利用可能な Kubernetes バージョンを実行している場合（例: Kubernetes 1.15 を使用しており、Kubernetes 1.16 で削除される API を使用している場合）:
     - 手順 1 の方法に従います
   - すでに一部の API バージョンが利用不可となっている Kubernetes バージョンを実行している場合（例: `helm get manifest` で報告された API バージョンの一部が、現在の Kubernetes バージョンでは利用不可）:
     - クラスターに保存されている release マニフェストを編集し、API バージョンをサポートされている API に更新する必要があります。詳細は [Release マニフェストの API バージョンの更新](#release-マニフェストの-api-バージョンの更新)を参照してください

> 注意: サポートされている API で Helm release を更新した後は、その更新バージョンより前のリリースバージョンには絶対にロールバックしないでください。

> 推奨: ベストプラクティスとして、非推奨の API バージョンを使用している release は、それらの API バージョンが削除される Kubernetes バージョンへのアップグレード前に、サポートされている API バージョンに更新してください。

上記の推奨手順で release を更新しない場合、API バージョンが削除された Kubernetes バージョンで release をアップグレードしようとすると、以下のようなエラーが発生します。

```
Error: UPGRADE FAILED: current release manifest contains removed kubernetes api(s)
for this kubernetes version and it is therefore unable to build the kubernetes
objects for performing the diff. error from kubernetes: unable to recognize "":
no matches for kind "Deployment" in version "apps/v1beta1"
```

このエラーが発生する理由は、Helm が現在デプロイされている release と、更新後の chart との間で差分パッチを作成しようとするためです。現在の release には、この Kubernetes バージョンで削除された API が含まれています。根本的な原因は、Kubernetes が API バージョンを削除すると、Kubernetes Go クライアントライブラリが非推奨のオブジェクトを解析できなくなることです。その結果、Helm はライブラリの呼び出し時に失敗します。残念ながら、Helm はこの状況から回復できず、該当する release を管理できなくなります。この状況からの回復方法については、[Release マニフェストの API バージョンの更新](#release-マニフェストの-api-バージョンの更新)を参照してください。

## Release マニフェストの API バージョンの更新

マニフェストは Helm release オブジェクトのプロパティであり、クラスター内の Secret（デフォルト）または ConfigMap のデータフィールドに保存されます。データフィールドには、gzip 圧縮され base64 エンコードされたオブジェクトが含まれます（Secret の場合は追加の base64 エンコードがあります）。release の namespace 内には、release のバージョン/リビジョンごとに Secret/ConfigMap が存在します。

Helm の [mapkubeapis](https://github.com/helm/helm-mapkubeapis) プラグインを使用すると、release をサポートされている API に更新できます。詳細は readme を参照してください。

または、以下の手動手順に従って release マニフェストの API バージョンを更新することもできます。構成に応じて、Secret または ConfigMap バックエンドの手順に従ってください。

- 最新のデプロイ済み release に関連付けられた Secret または ConfigMap の名前を取得します:
  - Secret バックエンド: `kubectl get secret -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
  - ConfigMap バックエンド: `kubectl get configmap -l
    owner=helm,status=deployed,name=<release_name> --namespace
    <release_namespace> | awk '{print $1}' | grep -v NAME`
- 最新のデプロイ済み release の詳細を取得します:
  - Secret バックエンド: `kubectl get secret <release_secret_name> -n
    <release_namespace> -o yaml > release.yaml`
  - ConfigMap バックエンド: `kubectl get configmap <release_configmap_name> -n
    <release_namespace> -o yaml > release.yaml`
- 問題が発生した場合に復元できるよう、release をバックアップします:
  - `cp release.yaml release.bak`
  - 問題発生時は次のコマンドで復元します: `kubectl apply -f release.bak -n
    <release_namespace>`
- release オブジェクトをデコードします:
  - Secret バックエンド: `cat release.yaml | grep -oP '(?<=release: ).*' | base64 -d
    | base64 -d | gzip -d > release.data.decoded`
  - ConfigMap バックエンド: `cat release.yaml | grep -oP '(?<=release: ).*' | base64
    -d | gzip -d > release.data.decoded`
- マニフェストの API バージョンを変更します。任意のツール（エディタなど）を使用できます。変更対象は、デコードした release オブジェクト（`release.data.decoded`）の `manifest` フィールドです
- release オブジェクトをエンコードします:
  - Secret バックエンド: `cat release.data.decoded | gzip | base64 | base64`
  - ConfigMap バックエンド: `cat release.data.decoded | gzip | base64`
- デプロイ済み release ファイル（`release.yaml`）の `data.release` プロパティ値を、新しくエンコードした release オブジェクトで置き換えます
- ファイルを namespace に適用します: `kubectl apply -f release.yaml -n
  <release_namespace>`
- サポートされている Kubernetes API バージョンを含む chart で `helm upgrade` を実行します
- アップグレード時の説明（description）に、現在のバージョンより前にはロールバックしないよう注意書きを追加します
