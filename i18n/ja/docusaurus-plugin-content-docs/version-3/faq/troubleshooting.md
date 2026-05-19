---
title: トラブルシューティング
sidebar_position: 4
---

## トラブルシューティング

### 「"stable" chart リポジトリから更新を取得できません」という警告が表示される場合

`helm repo list` を実行してください。`stable` リポジトリが `storage.googleapis.com` の URL を指している場合、そのリポジトリを更新する必要があります。2020 年 11 月 13 日に、Helm Charts リポジトリは 1 年間の非推奨期間を経て[サポートを終了](https://github.com/helm/charts#deprecation-timeline)しました。アーカイブは `https://charts.helm.sh/stable` で利用可能ですが、今後の更新は行われません。

以下のコマンドを実行してリポジトリを修正してください:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

`incubator` リポジトリについても同様で、アーカイブは https://charts.helm.sh/incubator で利用可能です。以下のコマンドを実行して修正してください:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### 「WARNING: "kubernetes-charts.storage.googleapis.com" is deprecated for "stable" and will be deleted Nov. 13, 2020.」という警告が表示される場合

旧 Google Helm chart リポジトリは、新しい Helm chart リポジトリに置き換えられました。

以下のコマンドを実行して、この問題を恒久的に解決してください:

```console
$ helm repo add stable https://charts.helm.sh/stable --force-update  
```

`incubator` についても同様のエラーが発生する場合は、以下のコマンドを実行してください:

```console
$ helm repo add incubator https://charts.helm.sh/incubator --force-update  
```

### Helm リポジトリを追加しようとすると「Error: Repo "https://kubernetes-charts.storage.googleapis.com" is no longer available」というエラーが発生する場合

Helm Chart リポジトリは [1 年間の非推奨期間](https://github.com/helm/charts#deprecation-timeline)を経て、サポートを終了しました。これらのリポジトリのアーカイブは `https://charts.helm.sh/stable` および `https://charts.helm.sh/incubator` で利用可能ですが、今後の更新は行われません。`helm repo add` コマンドは、`--use-deprecated-repos` を指定しない限り、旧 URL の追加を許可しません。

### GKE (Google Container Engine) で「No SSH tunnels currently open」というエラーが発生する場合

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

このエラーメッセージの別のバリエーションとして、以下のようなものもあります:

```
Unable to connect to the server: x509: certificate signed by unknown authority
```

この問題は、ローカルの Kubernetes 設定ファイルに正しい認証情報が含まれていないことが原因です。

GKE でクラスターを作成すると、SSL 証明書や認証局などの認証情報が提供されます。これらの認証情報を Kubernetes 設定ファイル（デフォルト: `~/.kube/config`）に保存して、`kubectl` と `helm` がアクセスできるようにする必要があります。

### Helm 2 から移行後、`helm list` で一部のリリースしか表示されない（または全く表示されない）場合

Helm 3 では、release のスコープにクラスターの namespace を使用するようになったことを見落としている可能性があります。つまり、release を参照するすべてのコマンドで以下のいずれかを行う必要があります:

* アクティブな Kubernetes コンテキストの現在の namespace に依存する（`kubectl config view --minify` コマンドで確認できます）
* `--namespace`/`-n` フラグを使用して正しい namespace を指定する
* `helm list` コマンドの場合は、`--all-namespaces`/`-A` フラグを指定する

これは `helm ls`、`helm uninstall`、およびその他の release を参照するすべての `helm` コマンドに適用されます。

### macOS で Helm が `/etc/.mdns_debug` ファイルにアクセスするのはなぜですか？

macOS において、Helm が `/etc/.mdns_debug` という名前のファイルにアクセスしようとするケースがあることを認識しています。このファイルが存在する場合、Helm は実行中にファイルハンドルを開いたままにします。

これは macOS の MDNS ライブラリが原因です。このライブラリは、デバッグ設定を読み込むために（有効な場合）このファイルの読み込みを試みます。ファイルハンドルを開いたままにすべきではありませんが、この問題は Apple に報告されています。ただし、この動作を引き起こしているのは Helm ではなく macOS です。

Helm にこのファイルを読み込ませたくない場合は、ホストのネットワークスタックを使用しない静的ライブラリとして Helm をコンパイルできます。これにより Helm のバイナリサイズは増加しますが、ファイルが開かれることを防ぐことができます。

この問題は当初、潜在的なセキュリティ問題として報告されました。しかし、その後の調査で、この動作による欠陥や脆弱性は存在しないことが判明しています。

### 以前は動作していた `helm repo add` が失敗する場合

Helm 3.3.1 以前では、`helm repo add <reponame> <url>` コマンドは、既に存在するリポジトリを追加しようとしても何も出力しませんでした。`--no-update` フラグは、リポジトリが既に登録されている場合にエラーを発生させていました。

Helm 3.3.2 以降では、既存のリポジトリを追加しようとするとエラーが発生します:

`Error: repository name (reponame) already exists, please specify a different name`

デフォルトの動作が逆転しました。`--no-update` は無視されるようになり、既存のリポジトリを置き換える（上書きする）場合は、`--force-update` を使用します。

これはセキュリティ修正に伴う破壊的変更です。詳細は [Helm 3.3.2 リリースノート](https://github.com/helm/helm/releases/tag/v3.3.2)で説明されています。

### Kubernetes クライアントログの有効化

Kubernetes クライアントのデバッグ用ログメッセージを表示するには、[klog](https://pkg.go.dev/k8s.io/klog) フラグを使用します。`-v` フラグで詳細レベルを設定するだけで、ほとんどの場合は十分です。

例:

```
helm list -v 6
```

### Tiller のインストールが動作しなくなり、アクセスが拒否される場合

Helm のリリースは以前 <https://storage.googleapis.com/kubernetes-helm/> から提供されていました。["Announcing get.helm.sh"](https://helm.sh/blog/get-helm-sh/) で説明されているとおり、2019 年 6 月に公式の提供場所が変更されました。[GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller) では、すべての旧 Tiller イメージが利用可能です。

以前使用していたストレージバケットから旧バージョンの Helm をダウンロードしようとすると、以下のようなエラーが表示される場合があります:

```
<Error>
    <Code>AccessDenied</Code>
    <Message>Access denied.</Message>
    <Details>Anonymous caller does not have storage.objects.get access to the Google Cloud Storage object.</Details>
</Error>
```

[旧 Tiller イメージの場所](https://gcr.io/kubernetes-helm/tiller)は、2021 年 8 月にイメージの削除を開始しました。これらのイメージは [GitHub Container Registry](https://github.com/orgs/helm/packages/container/package/tiller) で利用可能です。例えば、バージョン v2.17.0 をダウンロードするには、以下を:

`https://storage.googleapis.com/kubernetes-helm/helm-v2.17.0-linux-amd64.tar.gz`

以下に置き換えます:

`https://get.helm.sh/helm-v2.17.0-linux-amd64.tar.gz`

Helm v2.17.0 で初期化するには:

`helm init —upgrade`

または、異なるバージョンが必要な場合は、--tiller-image フラグを使用してデフォルトの場所を上書きし、特定の Helm v2 バージョンをインストールします:

`helm init --tiller-image ghcr.io/helm/tiller:v2.16.9`

**注:** Helm メンテナーは、現在サポートされている Helm のバージョンへの移行を推奨しています。Helm v2.17.0 は Helm v2 の最終リリースであり、Helm v2 は [Helm 2 and the Charts Project Are Now Unsupported](https://helm.sh/blog/helm-2-becomes-unsupported/) で詳述されているとおり、2020 年 11 月以降サポートされていません。それ以降多くの CVE が Helm に対して報告されており、これらの脆弱性は Helm v3 で修正されていますが、Helm v2 では修正されません。[公開されている Helm のセキュリティアドバイザリ一覧](https://github.com/helm/helm/security/advisories?state=published)を確認し、今すぐ [Helm v3 への移行](/topics/v2_v3_migration.md)を計画してください。
