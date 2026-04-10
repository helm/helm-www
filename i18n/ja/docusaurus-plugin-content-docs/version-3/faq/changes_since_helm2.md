---
title: Helm 2 からの変更点
sidebar_position: 1
---

## Helm 2 からの変更点

Helm 3 で導入された主要な変更点を網羅的に紹介します。

### Tiller の削除

Helm 2 の開発サイクル中に Tiller を導入しました。Tiller は共有クラスターで作業するチームにとって重要な役割を果たし、複数のオペレーターが同じ release セットを操作できるようにしました。

しかし、Kubernetes 1.6 でロールベースアクセス制御（RBAC）がデフォルトで有効化されたことにより、本番環境で Tiller を安全に運用することが難しくなりました。セキュリティポリシーは多岐にわたるため、Helm チームとしては寛容なデフォルト設定を提供する方針をとりました。これにより、初めてのユーザーはセキュリティ制御を深く学ばなくても Helm と Kubernetes を試すことができました。しかし、この寛容な設定により、ユーザーに意図しない広範な権限が付与される可能性がありました。DevOps エンジニアや SRE は、マルチテナントクラスターに Tiller をインストールする際に追加の運用手順を学ぶ必要がありました。

コミュニティメンバーがさまざまなシナリオでどのように Helm を使用しているかを聞いた結果、Tiller の release 管理システムには、クラスター内オペレーターに状態を維持させたり、Helm release 情報の中央ハブとして機能させたりする必要がないことがわかりました。代わりに、Kubernetes API サーバーから情報を取得し、クライアント側で chart をレンダリングし、インストール記録を Kubernetes に保存するだけで十分です。

Tiller の主な目的は Tiller なしでも達成できるため、Helm 3 に関する最初の決定の 1 つとして、Tiller を完全に削除しました。

Tiller がなくなったことで、Helm のセキュリティモデルは大幅に簡素化されました。Helm 3 は、最新の Kubernetes のセキュリティ、ID、認可機能をすべてサポートしています。Helm の権限は [kubeconfig ファイル](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)を使用して評価されます。クラスター管理者は、必要な粒度でユーザー権限を制限できます。release は引き続きクラスター内に記録され、Helm のその他の機能はそのまま維持されています。

### アップグレード戦略の改善: 3-way Strategic Merge Patch

Helm 2 では、2-way strategic merge patch を使用していました。アップグレード時には、最新の chart のマニフェストと提案された chart のマニフェスト（`helm upgrade` で指定されたもの）を比較し、この 2 つの差分から Kubernetes リソースに適用すべき変更を決定しました。`kubectl edit` などによる手動での変更は考慮されませんでした。そのため、リソースを以前の状態にロールバックできない場合がありました。Helm は最後に適用された chart のマニフェストのみを現在の状態として認識するため、chart の状態に変更がなければ、ライブ状態は変更されませんでした。

Helm 3 では、3-way strategic merge patch を使用しています。パッチを生成する際に、古いマニフェスト、ライブ状態、新しいマニフェストの 3 つを考慮します。

#### 例

この変更が及ぼす影響について、一般的な例をいくつか見ていきます。

##### ライブ状態が変更された場合のロールバック

チームが Helm を使用して Kubernetes の本番環境にアプリケーションをデプロイしたとします。chart には Deployment オブジェクトが含まれており、レプリカ数は 3 に設定されています:

```console
$ helm install myapp ./myapp
```

新しい開発者がチームに加わりました。最初の日に本番クラスターを観察している際、キーボードにコーヒーをこぼしてしまう事故が発生し、`kubectl scale` で本番環境の Deployment のレプリカ数を 3 から 0 に変更してしまいました。

```console
$ kubectl scale --replicas=0 deployment/myapp
```

チームの別の開発者が本番サイトのダウンに気づき、release を以前の状態にロールバックすることにしました:

```console
$ helm rollback myapp
```

何が起こるでしょうか？

Helm 2 では、古いマニフェストと新しいマニフェストを比較してパッチを生成します。これはロールバックなので、同じマニフェストです。Helm は、古いマニフェストと新しいマニフェストに差分がないため、変更の必要がないと判断します。レプリカ数はゼロのまま、問題が発生します。

Helm 3 では、古いマニフェスト、ライブ状態、新しいマニフェストを使用してパッチを生成します。Helm は、古い状態が 3、ライブ状態が 0、新しいマニフェストが 3 に戻したいことを認識し、状態を 3 に戻すパッチを生成します。

##### ライブ状態が変更された場合のアップグレード

多くのサービスメッシュやコントローラーベースのアプリケーションは、Kubernetes オブジェクトにデータを注入します。サイドカー、ラベル、その他の情報などです。chart からレンダリングされた次のようなマニフェストがあるとします:

```yaml
containers:
- name: server
  image: nginx:2.0.0
```

ライブ状態が別のアプリケーションによって以下のように変更されたとします:

```yaml
containers:
- name: server
  image: nginx:2.0.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

ここで、`nginx` の image タグを `2.1.0` にアップグレードしたいとします。次のマニフェストを持つ chart にアップグレードします:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

何が起こるでしょうか？

Helm 2 では、古いマニフェストと新しいマニフェストの間で `containers` オブジェクトのパッチを生成します。パッチ生成時にクラスターのライブ状態は考慮されません。

クラスターのライブ状態は次のように変更されます:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

サイドカー Pod がライブ状態から削除され、問題が発生します。

Helm 3 では、古いマニフェスト、ライブ状態、新しいマニフェストの間で `containers` オブジェクトのパッチを生成します。新しいマニフェストが image タグを `2.1.0` に変更しようとしていることを認識し、同時にライブ状態にサイドカーコンテナが含まれていることも認識します。

クラスターのライブ状態は次のように変更されます:

```yaml
containers:
- name: server
  image: nginx:2.1.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

### release 名が namespace にスコープ化

Tiller の削除に伴い、各 release の情報を保存する場所が必要でした。Helm 2 では、Tiller と同じ namespace に保存されていました。そのため、一度 release に名前が使用されると、異なる namespace にデプロイされていても、他の release がその名前を使用できませんでした。

Helm 3 では、特定の release に関する情報は release 自体と同じ namespace に保存されます。これにより、ユーザーは 2 つの異なる namespace で `helm install wordpress stable/wordpress` を実行でき、それぞれを現在の namespace コンテキストを変更して `helm list` で参照できます（例: `helm list --namespace foo`）。

この変更により、ネイティブのクラスター namespace との整合性が向上しました。`helm list` コマンドはデフォルトですべての release を一覧表示しなくなり、現在の Kubernetes コンテキストの namespace 内の release のみを一覧表示します（`kubectl config view --minify` を実行したときに表示される namespace）。Helm 2 と同様の動作を得るには、`helm list` に `--all-namespaces` フラグを指定する必要があります。

### Secret がデフォルトのストレージドライバに

Helm 3 では、Secret が[デフォルトのストレージドライバ](/topics/advanced.md#storage-backends)になりました。Helm 2 では、release 情報を保存するためにデフォルトで ConfigMap を使用していました。Helm 2.7.0 で Secret を使用する新しいストレージバックエンドが実装され、Helm 3 からデフォルトになりました。

Helm 3 でデフォルトを Secret に変更することで、Kubernetes の Secret 暗号化機能と組み合わせて chart の追加的なセキュリティ保護が可能になります。

[静止時の Secret 暗号化](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)は Kubernetes 1.7 でアルファ機能として利用可能になり、Kubernetes 1.13 で安定版になりました。これにより、ユーザーは Helm release のメタデータを静止時に暗号化でき、将来的に Vault などへの拡張の出発点となります。

### Go import パスの変更

Helm 3 では、Go import パスが `k8s.io/helm` から `helm.sh/helm/v3` に変更されました。Helm 3 の Go クライアントライブラリにアップグレードする場合は、import パスを変更してください。

### Capabilities

レンダリング段階で利用できる `.Capabilities` ビルトインオブジェクトが簡素化されました。

[ビルトインオブジェクト](/chart_template_guide/builtin_objects.md)

### JSONSchema による chart 値の検証

chart 値に JSON Schema を適用できるようになりました。これにより、ユーザーが提供する値が chart メンテナーの定義したスキーマに従っていることが保証され、不正な値を指定した場合にはより良いエラーレポートが提供されます。

検証は以下のコマンドの実行時に行われます:

* `helm install`
* `helm upgrade`
* `helm template`
* `helm lint`

詳細は [Schema ファイル](/topics/charts.md#schema-files)のドキュメントを参照してください。

### `requirements.yaml` の `Chart.yaml` への統合

chart の依存関係管理システムが requirements.yaml と requirements.lock から Chart.yaml と Chart.lock に移行しました。Helm 3 向けの新しい chart は新しいフォーマットを使用することを推奨します。ただし、Helm 3 は Chart API バージョン 1（`v1`）も引き続き理解し、既存の `requirements.yaml` ファイルを読み込むことができます。

Helm 2 での `requirements.yaml` は次のようになっていました:

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

Helm 3 では、依存関係は同じように表現されますが、`Chart.yaml` に記述します:

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

chart は引き続き `charts/` ディレクトリにダウンロードされるため、`charts/` ディレクトリにベンダリングされたサブチャートは変更なしで動作します。

### インストール時に名前（または --generate-name）が必須に

Helm 2 では、名前が指定されない場合、自動生成された名前が付けられました。本番環境では、これは便利な機能というよりも厄介な問題となることがわかりました。Helm 3 では、`helm install` で名前が指定されない場合、エラーが発生します。

名前を自動生成したい場合は、`--generate-name` フラグを使用してください。

### OCI レジストリへの chart プッシュ

これは Helm 3 で導入された実験的機能です。使用するには、環境変数 `HELM_EXPERIMENTAL_OCI=1` を設定してください。

大まかに言うと、Chart リポジトリは chart を保存および共有できる場所です。Helm クライアントは Helm chart をパッケージ化して Chart リポジトリに送信します。簡単に言えば、Chart リポジトリは index.yaml ファイルといくつかのパッケージ化された chart を格納する基本的な HTTP サーバーです。

Chart リポジトリ API は最も基本的なストレージ要件を満たしていますが、いくつかの欠点が明らかになってきました:

- Chart リポジトリでは、本番環境で必要なセキュリティ実装を抽象化することが困難です。本番シナリオでは、認証と認可のための標準 API が非常に重要です。
- chart の署名と整合性・出所の検証に使用される Helm の chart 来歴ツールは、chart 公開プロセスのオプション部分です。
- マルチテナントシナリオでは、同じ chart が別のテナントによってアップロードされる可能性があり、同じコンテンツを保存するのに 2 倍のストレージコストがかかります。よりスマートな chart リポジトリはこれに対処するように設計されていますが、正式な仕様の一部ではありません。
- 検索、メタデータ情報、chart の取得に単一のインデックスファイルを使用することで、安全なマルチテナント実装の設計が困難になっています。

Docker の Distribution プロジェクト（Docker Registry v2 とも呼ばれる）は、Docker Registry プロジェクトの後継です。多くの主要クラウドベンダーが Distribution プロジェクトの製品を提供しており、長年にわたる堅牢化、セキュリティベストプラクティス、実戦での検証の恩恵を受けてきました。

chart をパッケージ化して Docker レジストリにプッシュする方法の詳細については、`helm help chart` と `helm help registry` を参照してください。

詳細は[このページ](/topics/registries.md)を参照してください。

### `helm serve` の削除

`helm serve` は、開発目的でローカルマシン上で Chart リポジトリを実行するコマンドでした。しかし、開発ツールとしてあまり普及せず、設計上の問題が多数ありました。最終的に、これを削除してプラグインとして分離することにしました。

`helm serve` と同様の体験を得るには、[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage) のローカルファイルシステムストレージオプションと [servecm プラグイン](https://github.com/jdolitsky/helm-servecm)を参照してください。


### ライブラリ chart のサポート

Helm 3 は「ライブラリ chart」と呼ばれる chart のクラスをサポートしています。ライブラリ chart は他の chart で共有されますが、独自の release アーティファクトを作成しません。ライブラリ chart のテンプレートは `define` 要素のみを宣言できます。グローバルスコープの `define` 以外のコンテンツは無視されます。これにより、多くの chart で再利用できるコードスニペットを共有でき、冗長性を回避して chart を [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)（Don't Repeat Yourself）に保つことができます。

ライブラリ chart は Chart.yaml の dependencies ディレクティブで宣言され、他の chart と同様にインストールおよび管理されます。

```yaml
dependencies:
  - name: mylib
    version: 1.x.x
    repository: quay.io
```

この機能が chart 開発者にどのようなユースケースを開くか、またライブラリ chart を使用する際のベストプラクティスがどのように生まれるかを楽しみにしています。

### Chart.yaml の apiVersion の変更

ライブラリ chart のサポートの導入と requirements.yaml の Chart.yaml への統合により、Helm 2 のパッケージフォーマットを理解するクライアントはこれらの新機能を理解できません。そのため、Chart.yaml の apiVersion を `v1` から `v2` に引き上げました。

`helm create` は新しいフォーマットを使用して chart を作成するようになったため、デフォルトの apiVersion もそちらに変更されました。

両方のバージョンの Helm chart をサポートしたいクライアントは、Chart.yaml の `apiVersion` フィールドを調べてパッケージフォーマットの解析方法を決定する必要があります。

### XDG Base Directory のサポート

[XDG Base Directory 仕様](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)は、設定、データ、キャッシュファイルをファイルシステムのどこに保存すべきかを定義するポータブルな標準です。

Helm 2 では、すべての情報を `~/.helm`（俗称「helm home」）に保存していました。これは `$HELM_HOME` 環境変数または `--home` グローバルフラグで変更できました。

Helm 3 では、XDG Base Directory 仕様に従って以下の環境変数を使用します:

- `$XDG_CACHE_HOME`
- `$XDG_CONFIG_HOME`
- `$XDG_DATA_HOME`

Helm プラグインには、`$HELM_HOME` をスクラッチパッド環境として使用するプラグインとの後方互換性のために、`$HELM_HOME` が `$XDG_DATA_HOME` のエイリアスとして引き続き渡されます。

この変更に対応するために、プラグイン環境にいくつかの新しい環境変数も渡されるようになりました:

- `$HELM_PATH_CACHE`: キャッシュパス
- `$HELM_PATH_CONFIG`: 設定パス
- `$HELM_PATH_DATA`: データパス

Helm 3 をサポートする Helm プラグインは、これらの新しい環境変数の使用を検討してください。

### CLI コマンドの名前変更

他のパッケージマネージャーとの用語の整合性を高めるため、`helm delete` は `helm uninstall` に名前変更されました。`helm delete` は `helm uninstall` のエイリアスとして引き続き保持されているため、どちらの形式でも使用できます。

Helm 2 では、release の台帳を削除するために `--purge` フラグを指定する必要がありました。この機能は現在デフォルトで有効になっています。以前の動作を維持するには、`helm uninstall --keep-history` を使用してください。

また、同じ規則に合わせるためにいくつかの他のコマンドも名前変更されました:

- `helm inspect` → `helm show`
- `helm fetch` → `helm pull`

これらのコマンドも以前の動詞がエイリアスとして保持されているため、どちらの形式でも引き続き使用できます。

### namespace の自動作成

存在しない namespace に release を作成する場合、Helm 2 は namespace を作成しました。Helm 3 は他の Kubernetes ツールの動作に従い、namespace が存在しない場合はエラーを返します。Helm 3 で namespace を作成するには、明示的に `--create-namespace` フラグを指定してください。

### .Chart.ApiVersion はどうなったか？

Helm は、頭字語を大文字にするという CamelCase の一般的な規則に従っています。これは `.Capabilities.APIVersions.Has` など、コードの他の場所でも行っています。Helm v3 では、このパターンに従うように `.Chart.ApiVersion` を修正し、`.Chart.APIVersion` に名前変更しました。
