---
title: "Helm の使い方"
description: "Helm の基本について説明します。"
weight: 3
---

このガイドでは、Helm を使用して Kubernetes クラスタ上のパッケージを管理する基本について説明します。
Helm クライアントが既に [インストール済み]({{< ref "install.md" >}}) であると
想定しています。

いくつかのクイックコマンドを実行したいだけの場合は、
[クイックスタートガイド]({{< ref "quickstart.md" >}}) から始めてください。
この章では、Helm コマンドの詳細について説明し、Helm の使用方法を説明します。

## 3つの大きな概念

*チャート* は Helm パッケージです。
これには、Kubernetes クラスタ内でアプリケーション、ツール、またはサービスを実行するために必要なすべてのリソース定義が含まれています。
Kubernetes に置ける Homebrew の式、Apt dpkg、
または Yum RPM ファイルに相当するようなものと考えてください。

*リポジトリ* は、チャートを収集して共有できる場所です。
Perl の [CPAN アーカイブ](https://www.cpan.org) や [Fedora パッケージデータベース](https://src.fedoraproject.org/)に似ていますが、
Kubernetes パッケージが対象です。

*リリース* は、Kubernetes クラスタで実行されているチャートのインスタンスです。
多くの場合、1つのチャートを同じクラスターに何度もインストールできます。
そして、それがインストールされるたびに、新しい _リリース_ が作成されます。
MySQL チャートを考えてみましょう。クラスターで2つのデータベースを実行する場合は、そのチャートを2回インストールできます。
それぞれに独自の _リリース_ があり、次に独自の _リリース名_ が付けられます。

これらの概念を念頭に置いて、Helm を次のように説明できます。

Helm は _チャート_ を Kubernetes にインストールし、インストールごとに新しい _リリース_ を作成します。
また、新しいチャートを見つけるには、Helm チャート _リポジトリ_ を検索できます。

## 'helm search': チャートを見つける

Helm には強力な検索コマンドが付属しています。
2つの異なるタイプのソースの検索に使用できます。

- `helm search hub` は、[Helm Hub](https://hub.helm.sh) を検索します。
  これは、多数の異なるリポジトリの Helm チャートで構成されています。
- `helm search repo` は、(`helm repo add` で) ローカルの helm クライアントに追加したリポジトリを検索します。
  この検索はローカルデータ上で行われ、
  パブリックネットワーク接続は必要ありません。

`helm search hub` を実行すると、公開されているチャートを見つけることができます。

```console
$ helm search hub wordpress
URL                                               	CHART VERSION	APP VERSION	DESCRIPTION
https://hub.helm.sh/charts/bitnami/wordpress      	7.6.7        	5.2.4      	Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/presslabs/wordpress-...	v0.6.3       	v0.6.3     	Presslabs WordPress Operator Helm Chart
https://hub.helm.sh/charts/presslabs/wordpress-...	v0.7.1       	v0.7.1     	A Helm chart for deploying a WordPress site on ...
```

上記は Helm Hub 上のすべての `wordpress` チャートを検索します。

フィルターなしの場合、`helm search hub` は利用可能なすべてのチャートを表示します。

`helm search repo` を使用すると、すでに追加したリポジトリでチャートの名前を見つけることができます。

```console
$ helm repo add brigade https://brigadecore.github.io/charts
"brigade" has been added to your repositories
$ helm search repo brigade
NAME                        	CHART VERSION	APP VERSION	DESCRIPTION
brigade/brigade             	1.3.2        	v1.2.1     	Brigade provides event-driven scripting of Kube...
brigade/brigade-github-app  	0.4.1        	v0.2.1     	The Brigade GitHub App, an advanced gateway for...
brigade/brigade-github-oauth	0.2.0        	v0.20.0    	The legacy OAuth GitHub Gateway for Brigade
brigade/brigade-k8s-gateway 	0.1.0        	           	A Helm chart for Kubernetes
brigade/brigade-project     	1.0.0        	v1.0.0     	Create a Brigade project
brigade/kashti              	0.4.0        	v0.4.0     	A Helm chart for Kubernetes
```

Helm の検索はあいまい文字列マッチングアルゴリズムを使用するため、単語やフレーズの一部を入力できます。

```console
$ helm search repo kash
NAME          	CHART VERSION	APP VERSION	DESCRIPTION
brigade/kashti	0.4.0        	v0.4.0     	A Helm chart for Kubernetes
```

検索は、利用可能なパッケージを見つけるための良い方法です。
インストールするパッケージが見つかったら、`helm install` を使用してインストールできます。

## 'helm install': パッケージのインストール

新しいパッケージをインストールするには、`helm install` コマンドを使用します。
簡単に言うと、2つの引数を取ります。選択するリリース名と、インストールするチャートの名前です。

```console
$ helm install happy-panda stable/mariadb
WARNING: This chart is deprecated
NAME: happy-panda
LAST DEPLOYED: Fri May  8 17:46:49 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
This Helm chart is deprecated

...

Services:

  echo Master: happy-panda-mariadb.default.svc.cluster.local:3306
  echo Slave:  happy-panda-mariadb-slave.default.svc.cluster.local:3306

Administrator credentials:

  Username: root
  Password : $(kubectl get secret --namespace default happy-panda-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode)

To connect to your database:

  1. Run a pod that you can use as a client:

      kubectl run happy-panda-mariadb-client --rm --tty -i --restart='Never' --image  docker.io/bitnami/mariadb:10.3.22-debian-10-r27 --namespace default --command -- bash

  2. To connect to master service (read/write):

      mysql -h happy-panda-mariadb.default.svc.cluster.local -uroot -p my_database

  3. To connect to slave service (read-only):

      mysql -h happy-panda-mariadb-slave.default.svc.cluster.local -uroot -p my_database

To upgrade this helm chart:

  1. Obtain the password as described on the 'Administrator credentials' section and set the 'rootUser.password' parameter as shown below:

      ROOT_PASSWORD=$(kubectl get secret --namespace default happy-panda-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode)
      helm upgrade happy-panda stable/mariadb --set rootUser.password=$ROOT_PASSWORD

```

これで `mariadb` チャートがインストールされました。
チャートをインストールすると、新しい _release_ オブジェクトが作成されることに注意してください。上記のリリースは `happy-panda` という名前です。
(Helm で名前を生成する場合は、リリース名を省略して `--generate-name` を使用します。)

インストール中に、`helm` クライアントは、作成されたリソース、リリースの状態、
さらに実行できる、または実行すべき追加の構成手順があるかどうかに関する
有用な情報を出力します。

Helm は、終了する前にすべてのリソースが実行されるまで待機しません。
多くのチャートには 600M を超えるサイズの Docker イメージが必要であり、
クラスターへのインストールに長い時間がかかる場合があります。

リリースの状態を追跡したり、設定情報を再度読み取るには、
`helm status` を使用できます。

```console
$ helm status happy-panda                
NAME: happy-panda
LAST DEPLOYED: Fri May  8 17:46:49 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
This Helm chart is deprecated

...

Services:

  echo Master: happy-panda-mariadb.default.svc.cluster.local:3306
  echo Slave:  happy-panda-mariadb-slave.default.svc.cluster.local:3306

Administrator credentials:

  Username: root
  Password : $(kubectl get secret --namespace default happy-panda-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode)

To connect to your database:

  1. Run a pod that you can use as a client:

      kubectl run happy-panda-mariadb-client --rm --tty -i --restart='Never' --image  docker.io/bitnami/mariadb:10.3.22-debian-10-r27 --namespace default --command -- bash

  2. To connect to master service (read/write):

      mysql -h happy-panda-mariadb.default.svc.cluster.local -uroot -p my_database

  3. To connect to slave service (read-only):

      mysql -h happy-panda-mariadb-slave.default.svc.cluster.local -uroot -p my_database

To upgrade this helm chart:

  1. Obtain the password as described on the 'Administrator credentials' section and set the 'rootUser.password' parameter as shown below:

      ROOT_PASSWORD=$(kubectl get secret --namespace default happy-panda-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode)
      helm upgrade happy-panda stable/mariadb --set rootUser.password=$ROOT_PASSWORD
```

上記はリリースの現在の状態を示しています。

### インストール前のチャートのカスタマイズ

ここにある方法でインストールすると、
このチャートのデフォルトの構成オプションのみが使用されます。
多くの場合、好みの構成を使用するようにチャートをカスタマイズする必要があります。

チャートで設定可能なオプションを確認するには、`helm show values` を使用します。

```console
$ helm show values stable/mariadb
Fetched stable/mariadb-0.3.0.tgz to /Users/mattbutcher/Code/Go/src/helm.sh/helm/mariadb-0.3.0.tgz
## Bitnami MariaDB image version
## ref: https://hub.docker.com/r/bitnami/mariadb/tags/
##
## Default: none
imageTag: 10.1.14-r3

## Specify a imagePullPolicy
## Default to 'Always' if imageTag is 'latest', else set to 'IfNotPresent'
## ref: https://kubernetes.io/docs/user-guide/images/#pre-pulling-images
##
# imagePullPolicy:

## Specify password for root user
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#setting-the-root-password-on-first-run
##
# mariadbRootPassword:

## Create a database user
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#creating-a-database-user-on-first-run
##
# mariadbUser:
# mariadbPassword:

## Create a database
## ref: https://github.com/bitnami/bitnami-docker-mariadb/blob/master/README.md#creating-a-database-on-first-run
##
# mariadbDatabase:
# ...
```

次に、YAML 形式のファイルでこれらの設定を上書きし、
インストール中にそのファイルを渡すことができます。

```console
$ echo '{mariadbUser: user0, mariadbDatabase: user0db}' > config.yaml
$ helm install -f config.yaml stable/mariadb --generate-name
```

上記は `user0` という名前のデフォルトの MariaDB ユーザーを作成し、
このユーザーに新しく作成された `user0db` データベースへのアクセスを許可しますが、
そのチャートの残りのデフォルトはすべて受け入れます。

インストール中に構成データを渡す方法は2つあります。

- `--values` (または `-f`): 上書きする YAML ファイルを指定します。
  これは複数回指定でき、一番右のファイルが優先されます
- `--set`: コマンドラインで上書きする値を指定します

両方が使用される場合、`--set` 値はより高い優先度で `--values` にマージされます。
`--set` で指定されたオーバーライドは ConfigMap に永続化されます。
`--set` されている値は、`helm get values <リリース名>`を使用して、
特定のリリースで表示できます。
`--set` になっている値は、`--reset-values` を指定して `helm upgrade` を実行することでクリアできます。

#### `--set` の形式と制限

`--set` オプションは0個以上の名前と値のペアを取ります。
簡単に言うと、`--set name=value` のように使用されます。これに相当する YAML は次のとおりです。

```yaml
name: value
```

複数の値は、`,` 文字で区切られます。したがって、`--set a=b,c=d` は次のようになります。

```yaml
a: b
c: d
```

より複雑な式がサポートされています。
たとえば、`--set outer.inner=value` は次のように変換されます。
```yaml
outer:
  inner: value
```

リストは、`{` と `}` で値を囲むことで表現できます。
たとえば、`--set name={a, b, c}` は次のように変換されます。

```yaml
name:
  - a
  - b
  - c
```

Helm 2.5.0 以降では、配列インデックス構文を使用してリストアイテムにアクセスできます。
たとえば、`--set servers[0].port=80` は次のようになります。

```yaml
servers:
  - port: 80
```

この方法で複数の値を設定できます。
`--set servers[0].port=80,servers[0].host=example` という行は次のようになります：

```yaml
servers:
  - port: 80
    host: example
```

`--set` 行で特殊文字を使用する必要がある場合があります。バックスラッシュを使用して文字をエスケープできます。
`--set name=value1\,value2` は次のようになります。

```yaml
name: "value1,value2"
```

同様に、ドットシーケンスをエスケープすることもできます。
これは、チャートが `toYaml` 関数を使用して
注釈、ラベル、ノードセレクターを解析するときに役立つ場合があります。
`--set nodeSelector."kubernetes\.io/role"=master` の構文は次のようになります。

```yaml
nodeSelector:
  kubernetes.io/role: master
```

深くネストされたデータ構造は、`--set` を使用して表現するのが難しい場合があります。
チャートの設計者は、`values.yaml` ファイルのフォーマットを設計するときに、
`--set` の使用法を検討することをお勧めします。

### その他のインストール方法

`helm install` コマンドはいくつかのソースからインストールできます。

- チャートリポジトリ (上記で見たように)
- ローカルチャートアーカイブ (`helm install foo foo-0.1.1.tgz`)
- 展開されたチャートディレクトリ (`helm install foo path/to/foo`)
- 完全な URL (`helm install foo https://example.com/charts/foo-1.2.3.tgz`)

## 'helm upgrade' と 'helm rollback': リリースのアップグレードと障害時の回復

チャートの新しいバージョンがリリースされたとき、またはリリースの構成を変更したいときは、
`helm upgrade` コマンドを使用できます。

アップグレードでは、既存のリリースを取得し、提供された情報に従ってアップグレードします。
Kubernetes チャートは大きく複雑になる可能性があるため、
Helm は最も侵襲性の低いアップグレードを実行しようとします。
最後のリリース以降に変更されたもののみを更新します。

```console
$ helm upgrade -f panda.yaml happy-panda stable/mariadb
Fetched stable/mariadb-0.3.0.tgz to /Users/mattbutcher/Code/Go/src/helm.sh/helm/mariadb-0.3.0.tgz
happy-panda has been upgraded. Happy Helming!
Last Deployed: Wed Sep 28 12:47:54 2016
Namespace: default
Status: DEPLOYED
...
```

上記の場合、`happy-panda` リリースは同じチャートでアップグレードされますが、
新しい YAML ファイルが使用されます。

```yaml
mariadbUser: user1
```

`helm get values` を使用して、新しい設定が有効になったかどうかを確認できます。

```console
$ helm get values happy-panda
mariadbUser: user1
```

`helm get` コマンドは、クラスター内のリリースを確認するのに役立つツールです。
上記のように、`panda.yaml` からの新しい値が
クラスターにデプロイされたことを示しています。

さて、リリース中に何かが計画どおりに進まなかった場合、
`helm rollback [RELEASE] [REVISION]` を使用して前のリリースに簡単にロールバックできます。

```console
$ helm rollback happy-panda 1
```

上記は、happy-panda を最初のリリースバージョンにロールバックします。
リリースバージョンは増分リビジョンです。
インストール、アップグレード、またはロールバックが発生するたびに、リビジョン番号は1ずつ増加します。
最初のリビジョン番号は常に1です。
また、`helm history [RELEASE]` を使用して、特定のリリースのリビジョン番号を確認できます。

## インストール/アップグレード/ロールバックに役立つオプション

インストール/アップグレード/ロールバック中の Helm の動作をカスタマイズするために指定できる
他の便利なオプションがいくつかあります。
これは cli フラグの完全なリストではないことに注意してください。
すべてのフラグの説明を表示するには、`helm <command> --help` を実行します。

- `--timeout`: Kubernetes コマンドが完了するまで待機する秒単位の値
  デフォルトは `5m0s` です
- `--wait`: リリースが成功したとマークする前に、すべてのポッドが準備完了状態になり、
  PVC がバインドされ、デプロイメントには準備ができた状態の最小 (`Desired` - `maxUnavailable`) ポッドがあり、
  サービスに IP アドレス (および `LoadBalancer` の場合は Ingress) があるまで待ちます。
  `--timeout` 値が出るまで待機します。
  タイムアウトに達すると、リリースは `FAILED` としてマークされます。
  注: Deployment のローリング更新戦略の一環として、Deployment の `replicas` が 1 に設定され、
  `maxUnavailable` が 0 に設定されていない場合、
  `--wait` は、準備完了状態の最小ポッドを満たしているため、準備完了として戻ります。
- `--no-hooks`: これは、コマンドの実行中のフックをスキップします
- `--recreate-pods` (`upgrade` と `rollback` でのみ使用可能): このフラグにより、すべてのポッドが再作成されます 
  (デプロイメントに属するポッドを除く)。
  (Helm 3 では非推奨)

## 'helm uninstall': リリースのアンインストール

クラスターからリリースをアンインストールするときは、
`helm uninstall` コマンドを使用します。

```console
$ helm uninstall happy-panda
```

これにより、リリースがクラスターから削除されます。
`helm list` コマンドを使用すると、現在デプロイされているすべてのリリースを確認できます。

```console
$ helm list
NAME            VERSION UPDATED                         STATUS          CHART
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
```

上記の出力から、`happy-panda` リリースが
アンインストールされたことがわかります。

Helm の以前のバージョンでは、リリースが削除されると、その削除の記録が残りました。 
Helm 3 では、削除によりリリースレコードも削除されます。
削除リリースレコードを保持する場合は、`helm uninstall --keep-history` を使用します。
`helm list --uninstalled` を使用すると、
`--keep-history` フラグでアンインストールされたリリースのみが表示されます。

`helm list --all` フラグは、Helm が保持しているすべてのリリースレコードを表示します。
これには、失敗したアイテムや削除されたアイテムのレコードも含まれます (`--keep-history` が指定されている場合)。

```console
$  helm list --all
NAME            VERSION UPDATED                         STATUS          CHART
happy-panda     2       Wed Sep 28 12:47:54 2016        UNINSTALLED     mariadb-0.3.0
inky-cat        1       Wed Sep 28 12:59:46 2016        DEPLOYED        alpine-0.1.0
kindred-angelf  2       Tue Sep 27 16:16:10 2016        UNINSTALLED     alpine-0.1.0
```

リリースはデフォルトで削除されるようになったため、
アンインストールされたリソースをロールバックすることはできなくなりました。

## 'helm repo': リポジトリの操作

Helm 3 には、デフォルトのチャートリポジトリが付属しなくなりました。
`helm repo` コマンドグループは、リポジトリを追加、一覧表示、削除するコマンドを提供します。

`helm repo list` を使用して、設定されているリポジトリを確認できます。

```console
$ helm repo list
NAME            URL
stable          https://charts.helm.sh/stable
mumoshu         https://mumoshu.github.io/charts
```

そして、新しいリポジトリは `helm repo add` で追加できます。

```console
$ helm repo add dev https://example.com/dev-charts
```

チャートリポジトリは頻繁に変更されるため、
`helm repo update` を実行することで、いつでも Helm クライアントが最新であることを確認できます。

リポジトリは `helm repo remove` で削除できます。

## 独自のチャートを作成する

[チャート開発ガイド](https://helm.sh/docs/topics/charts/) は、独自のチャートを開発する方法を説明しています。
ただし、`helm create` コマンドを使用すると、すぐに開始できます。

```console
$ helm create deis-workflow
Creating deis-workflow
```

今、`./deis-workflow` にチャートがあるとします。
それを編集して、独自のテンプレートを作成できます。

チャートを編集するとき、`helm lint` を実行することにより、
チャートが整形式であることを検証できます。

チャートを配布用にパッケージ化するときは、
`helm package` コマンドを実行できます。

```console
$ helm package deis-workflow
deis-workflow-0.1.0.tgz
```

そして、そのチャートは `helm install` によって簡単にインストールできます。

```console
$ helm install deis-workflow ./deis-workflow-0.1.0.tgz
...
```

パッケージ化されたチャートは、チャートリポジトリにロードできます。
アップロード方法については、チャートリポジトリサーバーのドキュメントをご覧ください。

注: `stable` リポジトリは [Kubernetes Charts GitHub リポジトリ](https://github.com/helm/charts) で管理されています。
そのプロジェクトは、チャートのソースコードを受け入れ、
(監査後に) それらをパッケージ化します。

## まとめ

この章では、検索、インストール、アップグレード、アンインストールなど、
`helm` クライアントの基本的な使用パターンについて説明しました。
また、`helm status`、`helm get`、`helm repo` などの便利なユーティリティコマンドについても説明しています。

これらのコマンドの詳細については、
Helm の組み込みヘルプである `helm help` をご覧ください。

次の章では、チャートを作成するプロセスについて説明します。
