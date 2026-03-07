---
title: Helm の使い方
description: Helm の基本について説明します。
sidebar_position: 3
---

このガイドでは、Helm を使用して Kubernetes クラスター上のパッケージを管理する基本について説明します。Helm クライアントが既に[インストール済み](/intro/install.md)であることを前提としています。

コマンドをいくつか素早く試したい場合は、[クイックスタートガイド](/intro/quickstart.md)から始めてください。この章では Helm コマンドの詳細を説明し、Helm の使用方法を解説します。

## 3つの重要な概念

*chart* は Helm パッケージです。Kubernetes クラスター内でアプリケーション、ツール、またはサービスを実行するために必要なすべてのリソース定義が含まれています。Homebrew の formula、Apt の dpkg、Yum の RPM ファイルに相当する Kubernetes 版と考えてください。

*repository* は chart を収集して共有できる場所です。Perl の [CPAN アーカイブ](https://www.cpan.org)や [Fedora Package Database](https://src.fedoraproject.org/) に似ていますが、Kubernetes パッケージを対象としています。

*release* は Kubernetes クラスターで実行されている chart のインスタンスです。1つの chart を同じクラスターに何度もインストールできます。インストールするたびに新しい _release_ が作成されます。たとえば MySQL chart を考えてみます。クラスターで2つのデータベースを実行したい場合、その chart を2回インストールできます。それぞれに独自の _release_ があり、独自の _release 名_ が付けられます。

これらの概念を踏まえると、Helm を次のように説明できます。

Helm は _chart_ を Kubernetes にインストールし、インストールごとに新しい _release_ を作成します。新しい chart を見つけるには、Helm chart _repository_ を検索します。

## 'helm search': chart を見つける

Helm には強力な検索コマンドがあります。2種類のソースを検索できます。

- `helm search hub` は [Artifact Hub](https://artifacthub.io) を検索します。Artifact Hub には多数のリポジトリから Helm chart が集められています。
- `helm search repo` は (`helm repo add` で) ローカルの Helm クライアントに追加したリポジトリを検索します。この検索はローカルデータに対して行われるため、パブリックネットワーク接続は不要です。

`helm search hub` を実行すると、公開されている chart を見つけることができます。

```console
$ helm search hub wordpress
URL                                                 CHART VERSION APP VERSION DESCRIPTION
https://hub.helm.sh/charts/bitnami/wordpress        7.6.7         5.2.4       Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.6.3        v0.6.3      Presslabs WordPress Operator Helm Chart
https://hub.helm.sh/charts/presslabs/wordpress-...  v0.7.1        v0.7.1      A Helm chart for deploying a WordPress site on ...
```

上記は Artifact Hub 上のすべての `wordpress` chart を検索しています。

フィルターを指定しない場合、`helm search hub` は利用可能なすべての chart を表示します。

`helm search hub` は [artifacthub.io](https://artifacthub.io/) 上の URL を表示しますが、実際の Helm リポジトリは表示しません。`helm search hub --list-repo-url` を使用すると、実際の Helm リポジトリ URL が表示されます。これは新しいリポジトリを追加する際に便利です: `helm repo add [NAME] [URL]`。

`helm search repo` を使用すると、既に追加したリポジトリ内の chart 名を検索できます。

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

Helm の検索はあいまい文字列マッチングアルゴリズムを使用するため、単語やフレーズの一部を入力できます。

```console
$ helm search repo kash
NAME            CHART VERSION APP VERSION DESCRIPTION
brigade/kashti  0.4.0         v0.4.0      A Helm chart for Kubernetes
```

検索は利用可能なパッケージを見つける良い方法です。インストールしたいパッケージが見つかったら、`helm install` でインストールできます。

## 'helm install': パッケージをインストールする

新しいパッケージをインストールするには、`helm install` コマンドを使用します。最もシンプルな形式では、2つの引数を取ります。任意の release 名と、インストールする chart の名前です。

```console
$ helm install happy-panda bitnami/wordpress
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

これで `wordpress` chart がインストールされました。chart をインストールすると新しい _release_ オブジェクトが作成されます。上記の release は `happy-panda` という名前です。(Helm に名前を自動生成させたい場合は、release 名を省略して `--generate-name` を使用してください。)

インストール中、`helm` クライアントは作成されたリソース、release の状態、追加の設定手順など、有用な情報を出力します。

Helm は以下の順序でリソースをインストールします。

- Namespace
- NetworkPolicy
- ResourceQuota
- LimitRange
- PodSecurityPolicy
- PodDisruptionBudget
- ServiceAccount
- Secret
- SecretList
- ConfigMap
- StorageClass
- PersistentVolume
- PersistentVolumeClaim
- CustomResourceDefinition
- ClusterRole
- ClusterRoleList
- ClusterRoleBinding
- ClusterRoleBindingList
- Role
- RoleList
- RoleBinding
- RoleBindingList
- Service
- DaemonSet
- Pod
- ReplicationController
- ReplicaSet
- Deployment
- HorizontalPodAutoscaler
- StatefulSet
- Job
- CronJob
- Ingress
- APIService
- MutatingWebhookConfiguration
- ValidatingWebhookConfiguration

Helm はすべてのリソースが実行状態になるまで待機してから終了するわけではありません。多くの chart は 600MB を超える Docker イメージを必要とし、クラスターへのインストールに時間がかかる場合があります。

release の状態を追跡したり、設定情報を再度確認するには、`helm status` を使用します。

```console
$ helm status happy-panda
NAME: happy-panda
LAST DEPLOYED: Tue Jan 26 10:27:17 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    happy-panda-wordpress.default.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL by running these commands:

  NOTE: It may take a few minutes for the LoadBalancer IP to be available.
        Watch the status with: 'kubectl get svc --namespace default -w happy-panda-wordpress'

   export SERVICE_IP=$(kubectl get svc --namespace default happy-panda-wordpress --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
   echo "WordPress URL: http://$SERVICE_IP/"
   echo "WordPress Admin URL: http://$SERVICE_IP/admin"

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

  echo Username: user
  echo Password: $(kubectl get secret --namespace default happy-panda-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)
```

上記は release の現在の状態を表示しています。

### インストール前に chart をカスタマイズする

ここで説明した方法でインストールすると、その chart のデフォルト設定オプションのみが使用されます。多くの場合、好みの設定を使用するように chart をカスタマイズしたいでしょう。

chart で設定可能なオプションを確認するには、`helm show values` を使用します。

```console
$ helm show values bitnami/wordpress
## Global Docker image parameters
## Please, note that this will override the image parameters, including dependencies, configured to use the global value
## Current available global Docker image parameters: imageRegistry and imagePullSecrets
##
# global:
#   imageRegistry: myRegistryName
#   imagePullSecrets:
#     - myRegistryKeySecretName
#   storageClass: myStorageClass

## Bitnami WordPress image version
## ref: https://hub.docker.com/r/bitnami/wordpress/tags/
##
image:
  registry: docker.io
  repository: bitnami/wordpress
  tag: 5.6.0-debian-10-r35
  [..]
```

YAML 形式のファイルでこれらの設定を上書きし、インストール時にそのファイルを渡すことができます。

```console
$ echo '{mariadb.auth.database: user0db, mariadb.auth.username: user0}' > values.yaml
$ helm install -f values.yaml bitnami/wordpress --generate-name
```

上記は `user0` という名前のデフォルト MariaDB ユーザーを作成し、新しく作成された `user0db` データベースへのアクセスを許可しますが、その chart の他のデフォルト設定はすべてそのまま使用します。

インストール時に設定データを渡す方法は2つあります。

- `--values` (または `-f`): 上書きする値を指定した YAML ファイルを指定します。複数回指定でき、最も右のファイルが優先されます。
- `--set`: コマンドラインで上書きする値を指定します。

両方を使用した場合、`--set` の値は `--values` にマージされ、`--set` が優先されます。`--set` で指定された上書きは Secret に永続化されます。`--set` された値は `helm get values <release-name>` で特定の release について確認できます。`--set` された値は `--reset-values` を指定して `helm upgrade` を実行することでクリアできます。

#### `--set` の形式と制限

`--set` オプションは0個以上の名前/値ペアを取ります。最もシンプルな形式は `--set name=value` です。これに相当する YAML は次のとおりです。

```yaml
name: value
```

複数の値は `,` 文字で区切ります。`--set a=b,c=d` は次のようになります。

```yaml
a: b
c: d
```

より複雑な式もサポートされています。たとえば、`--set outer.inner=value` は次のように変換されます。
```yaml
outer:
  inner: value
```

リストは値を `{` と `}` で囲んで表現できます。たとえば、`--set name={a, b, c}` は次のように変換されます。

```yaml
name:
  - a
  - b
  - c
```

特定の名前/キーを `null` または空の配列 `[]` に設定できます。たとえば、`--set name=[],a=null` は次のように変換されます。

```yaml
name:
  - a
  - b
  - c
a: b
```

を

```yaml
name: []
a: null
```

に変換します。

Helm 2.5.0 以降、配列インデックス構文を使用してリストアイテムにアクセスできます。たとえば、`--set servers[0].port=80` は次のようになります。

```yaml
servers:
  - port: 80
```

この方法で複数の値を設定できます。`--set servers[0].port=80,servers[0].host=example` は次のようになります。

```yaml
servers:
  - port: 80
    host: example
```

`--set` 行で特殊文字を使用する必要がある場合があります。バックスラッシュを使用して文字をエスケープできます。`--set name=value1\,value2` は次のようになります。

```yaml
name: "value1,value2"
```

同様に、ドットシーケンスもエスケープできます。これは chart が `toYaml` 関数を使用してアノテーション、ラベル、ノードセレクターを解析する場合に便利です。`--set nodeSelector."kubernetes\.io/role"=master` の構文は次のようになります。

```yaml
nodeSelector:
  kubernetes.io/role: master
```

深くネストされたデータ構造は `--set` で表現するのが難しい場合があります。chart の設計者は `values.yaml` ファイルの形式を設計する際に `--set` の使用を考慮することをお勧めします (詳細は [Values ファイル](/chart_template_guide/values_files.md)を参照してください)。

### その他のインストール方法

`helm install` コマンドは複数のソースからインストールできます。

- chart repository (上記で見たとおり)
- ローカルの chart アーカイブ (`helm install foo foo-0.1.1.tgz`)
- 展開済みの chart ディレクトリ (`helm install foo path/to/foo`)
- 完全な URL (`helm install foo https://example.com/charts/foo-1.2.3.tgz`)

## 'helm upgrade' と 'helm rollback': release のアップグレードと障害からの回復

chart の新しいバージョンがリリースされたとき、または release の設定を変更したいときは、`helm upgrade` コマンドを使用します。

アップグレードは既存の release を取得し、指定した情報に従ってアップグレードします。Kubernetes chart は大きく複雑になる可能性があるため、Helm は最も影響の少ないアップグレードを実行しようとします。前回の release 以降に変更されたものだけを更新します。

```console
$ helm upgrade -f panda.yaml happy-panda bitnami/wordpress
```

上記の場合、`happy-panda` release は同じ chart でアップグレードされますが、新しい YAML ファイルが使用されます。

```yaml
mariadb.auth.username: user1
```

`helm get values` を使用して、新しい設定が有効になったかどうかを確認できます。

```console
$ helm get values happy-panda
mariadb:
  auth:
    username: user1
```

`helm get` コマンドはクラスター内の release を確認するのに役立つツールです。上記のように、`panda.yaml` の新しい値がクラスターにデプロイされたことがわかります。

release 中に何か予定どおりにいかなかった場合、`helm rollback [RELEASE] [REVISION]` を使用して以前の release に簡単にロールバックできます。

```console
$ helm rollback happy-panda 1
```

上記は happy-panda を最初の release バージョンにロールバックします。release バージョンは増分リビジョンです。インストール、アップグレード、またはロールバックが発生するたびに、リビジョン番号が1ずつ増加します。最初のリビジョン番号は常に1です。`helm history [RELEASE]` を使用して、特定の release のリビジョン番号を確認できます。

## install/upgrade/rollback に役立つオプション

install/upgrade/rollback 時の Helm の動作をカスタマイズするために指定できる便利なオプションがいくつかあります。これは CLI フラグの完全なリストではありません。すべてのフラグの説明を見るには、`helm <command> --help` を実行してください。

- `--timeout`: Kubernetes コマンドが完了するまで待機する [Go duration](https://golang.org/pkg/time/#ParseDuration) 値。デフォルトは `5m0s` です。
- `--wait`: すべての Pod が準備完了状態になり、PVC がバインドされ、Deployment が準備完了状態の最小 Pod 数 (`Desired` - `maxUnavailable`) を持ち、Service が IP アドレス (および `LoadBalancer` の場合は Ingress) を持つまで待機してから、release を成功とマークします。`--timeout` 値まで待機します。タイムアウトに達すると、release は `FAILED` としてマークされます。注: ローリング更新戦略の一部として Deployment の `replicas` が 1 に設定され、`maxUnavailable` が 0 に設定されていない場合、`--wait` は準備完了状態の最小 Pod 条件を満たしているため、準備完了として返します。
- `--no-hooks`: コマンドの hook の実行をスキップします。
- `--recreate-pods` (`upgrade` と `rollback` でのみ使用可能): このフラグはすべての Pod を再作成します (Deployment に属する Pod を除く)。(Helm 3 では非推奨)

## 'helm uninstall': release をアンインストールする

クラスターから release をアンインストールするときは、`helm uninstall` コマンドを使用します。

```console
$ helm uninstall happy-panda
```

これにより、release がクラスターから削除されます。`helm list` コマンドで現在デプロイされているすべての release を確認できます。

```console
$ helm list
NAME            VERSION UPDATED                         STATUS          CHART
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
```

上記の出力から、`happy-panda` release がアンインストールされたことがわかります。

以前のバージョンの Helm では、release が削除されると削除の記録が残りました。Helm 3 では、削除により release レコードも削除されます。削除された release のレコードを保持したい場合は、`helm uninstall --keep-history` を使用してください。`helm list --uninstalled` を使用すると、`--keep-history` フラグでアンインストールされた release のみが表示されます。

`helm list --all` フラグは、失敗したアイテムや削除されたアイテム (`--keep-history` が指定されている場合) のレコードを含む、Helm が保持しているすべての release レコードを表示します。

```console
$  helm list --all
NAME            VERSION UPDATED                         STATUS          CHART
happy-panda     2       Wed Sep 28 12:47:54 2016        UNINSTALLED     wordpress-10.4.5.6.0
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
kindred-angelf  2       Tue Sep 27 16:16:10 2016        UNINSTALLED     alpine-0.1.0
```

release がデフォルトで削除されるようになったため、アンインストールされたリソースをロールバックすることはできなくなりました。

## 'helm repo': repository を操作する

Helm 3 にはデフォルトの chart repository が付属しなくなりました。`helm repo` コマンドグループは、repository を追加、一覧表示、削除するコマンドを提供します。

`helm repo list` で設定されている repository を確認できます。

```console
$ helm repo list
NAME            URL
stable          https://charts.helm.sh/stable
mumoshu         https://mumoshu.github.io/charts
```

新しい repository は `helm repo add [NAME] [URL]` で追加できます。

```console
$ helm repo add dev https://example.com/dev-charts
```

chart repository は頻繁に変更されるため、`helm repo update` を実行して Helm クライアントを最新の状態に保つことができます。

repository は `helm repo remove` で削除できます。

## 独自の chart を作成する

[Chart 開発ガイド](/topics/charts.md)で独自の chart を開発する方法を説明しています。`helm create` コマンドを使用すると、すぐに始めることができます。

```console
$ helm create deis-workflow
Creating deis-workflow
```

これで `./deis-workflow` に chart ができました。編集して独自のテンプレートを作成できます。

chart を編集する際に、`helm lint` を実行してフォーマットが正しいかどうかを検証できます。

chart を配布用にパッケージ化するときは、`helm package` コマンドを実行します。

```console
$ helm package deis-workflow
deis-workflow-0.1.0.tgz
```

そして、その chart は `helm install` で簡単にインストールできます。

```console
$ helm install deis-workflow ./deis-workflow-0.1.0.tgz
...
```

パッケージ化された chart は chart repository にロードできます。詳細は [Helm chart repository](/topics/chart_repository.md) のドキュメントを参照してください。

## まとめ

この章では、検索、インストール、アップグレード、アンインストールなど、`helm` クライアントの基本的な使用パターンについて説明しました。`helm status`、`helm get`、`helm repo` などの便利なユーティリティコマンドについても説明しました。

これらのコマンドの詳細については、Helm の組み込みヘルプ `helm help` を参照してください。

[次の章](/howto/charts_tips_and_tricks.md)では、chart を開発するプロセスについて説明します。
