---
title: "よくある質問"
weight: 8
---

> Helm 2 と Helm 3 の主な違いはなんですか？
> このページでは、最もよくある質問に答えることで、理解の助けとなる事柄を説明します。

このドキュメントを改善する**あなたの助けを歓迎します**。情報の追加、訂正、削除などを行うには、[issue を作る](https://github.com/helm/helm-www/issues)か、pull request を送ってください。

## Helm 2 からの変更点

以下に、Helm 3 で導入されたすべての主要な変更の包括的なリストを示します。

### Tiller の削除


Helm 2 の開発サイクルの中で、私たちは Tiller を導入しました。Tiller は共有クラスターで作業をするチームに対して重要な役割を果たしました。Tillerのおかげで複数の異なるオペレータが同じリリースセットとやり取りできるようになったのです。

ロールベースアクセス制御 (RBAC) が Kubernetes 1.6 でデフォルトで有効になると、Tiller を本番環境で使用し続けるのはしだいに管理が難しくなっていきました。セキュリティポリシーには非常に多くの可能性があるため、私たちはデフォルトでパーミッシブな設定にする立場を取りました。このおかげで、初めてのユーザーはセキュリティ制御に頭を悩ませずに Helm と Kubernetes を試せるようになりました。残念ながらこのパーミッシブな設定は、本来は持つべきではないユーザーに広範な権限を与えてしまう可能性があります。DevOps や SRE がマルチテナントのクラスターに Tiller をインストールするときには、追加のオペレーションのステップを学ばなければなりませんでした。

コミュニティメンバーの特定のシナリオ下での Helm の使い方について調査をした結果、Tiller のリリース管理システムがステートを保持して Helm のリリース情報のセントラルハブとして動作するためには、クラスタ内のオペレータに依存する必要はなかったことがわかりました。

Tiller の主目的は Tiller がなくても実現できたことがわかったため、Helm 3 に関して私たちが下した最初の決定は Tiller を完全に取り除くことでした。

Tiller を取り除くと、Helm セキュリティモデルは著しく単純化されました。このおかげで Helm 3 は、最近の Kubernetes が持つモダンなセキュリティ、ID、認証の機能のすべてをサポートできるようになりました。Helm の権限は [kubeconfig
file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) を使用して評価されます。クラスタ管理者は要求に合った任意の粒度でユーザー権限を制限できます。リリースは今でもクラスター内に保存され、Helm の他の機能もそのまま変わりません。

### アップグレード戦略の改善: 3方向戦略的マージパッチ (3-way Strategic Merge Patches)

Helm 2 では、2方向戦略的マージパッチが使用されていました。アップグレード時には、最新のチャートのマニフェストと (`helm upgrade` 中に) 与えられたチャートのマニフェストを比較します。Helm 2 はこの2つのチャート間で変更を比較して、Kubernetes 内のリソースに適用する必要がある変更を決定します。もしクラスターへの変更がチャート外で (たとえば `kubectl edit` などで) 適用されていた場合、この変更は考慮されません。その結果、リソースは過去の状態にロールバックできなくなります。Helm は最後に適用されたチャートのマニフェストだけを最新状態とみなすため、チャートの状態に変更がなければ、現在の状態は変更されていないと判断されるためです。

Helm 3 では、新しく3方向戦略的マージパッチが使われるようになります。パッチの生成をするときに、Helm は古いマニフェスト、その現在の状態、新しいマニフェストを考慮します。

#### 例

Let's go through a few common examples what this change impacts.

##### 実際の状態が変更した時点へのロールバック

Your team just deployed their application to production on Kubernetes using
Helm. The chart contains a Deployment object where the number of replicas is set
to three:

```console
$ helm install myapp ./myapp
```

A new developer joins the team. On their first day while observing the
production cluster, a horrible coffee-spilling-on-the-keyboard accident happens
and they `kubectl scale` the production deployment from three replicas down to
zero.

```console
$ kubectl scale --replicas=0 deployment/myapp
```

Another developer on your team notices that the production site is down and
decides to rollback the release to its previous state:

```console
$ helm rollback myapp
```

What happens?

In Helm 2, it would generate a patch, comparing the old manifest against the new
manifest. Because this is a rollback, it's the same manifest. Helm would
determine that there is nothing to change because there is no difference between
the old manifest and the new manifest. The replica count continues to stay at
zero. Panic ensues.

In Helm 3, the patch is generated using the old manifest, the live state, and
the new manifest. Helm recognizes that the old state was at three, the live
state is at zero and the new manifest wishes to change it back to three, so it
generates a patch to change the state back to three.

##### 実際の状態が変更した時点へのアップグレード

Many service meshes and other controller-based applications inject data into
Kubernetes objects. This can be something like a sidecar, labels, or other
information. Previously if you had the given manifest rendered from a Chart:

```yaml
containers:
- name: server
  image: nginx:2.0.0
```

And the live state was modified by another application to

```yaml
containers:
- name: server
  image: nginx:2.0.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

Now, you want to upgrade the `nginx` image tag to `2.1.0`. So, you upgrade to a
chart with the given manifest:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

What happens?

In Helm 2, Helm generates a patch of the `containers` object between the old
manifest and the new manifest. The cluster's live state is not considered during
the patch generation.

The cluster's live state is modified to look like the following:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

The sidecar pod is removed from live state. More panic ensues.

In Helm 3, Helm generates a patch of the `containers` object between the old
manifest, the live state, and the new manifest. It notices that the new manifest
changes the image tag to `2.1.0`, but live state contains a sidecar container.

The cluster's live state is modified to look like the following:

```yaml
containers:
- name: server
  image: nginx:2.1.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

### リリース名が名前空間でスコープされるようになった

Tiller の削除に伴い、各リリースの情報はどこか別の場所に移動する必要が出てきました。Helm 2 では、リリースの情報は Tiller と同じ名前空間に保存されていました。実際には、一度でもリリースで名前が使われてしまうと、たとえ他の名前空間にデプロイしたとしても、他のリリースが同じ名前を使えないということです。

Helm 3 では、特定のリリースの情報は新しくリリース自体と同じ名前空間に保存されるようになりました。つまり、これからはユーザーが `helm install wrodpress stable/wordpress` というコマンドを2つの別の名前空間で実行できるようになったということです。それぞれのリリースは、現在の名前空間のコンテキストを切り替えることで (例: `helm list --namespace foo`)、`helm list` を使用して参照できます。

ネイティブのクラスターの名前空間に大きく近づけたことにより、`helm list` コマンドはデフォルトではすべてのリリースを一覧しなくなりました。代わりに、現在の Kubernetes のコンテキストの名前空間 (たとえば、`kubectl config view --minify` などを実行すると表示される名前空間) の中にあるリリースだけが表示されるようになります。Helm 2 に近い動作にするには、`helm list` に `--all-namespaces` フラッグを与える必要があります。

### Secret がデフォルトのストレージドライバーになった

Helm 3 からは、Secret が[デフォルトのストレージドライバー](/ja/docs/topics/advanced/#ストレージバックエンド)として使われるようになりました。Helm 2 では、ConfigMap がデフォルトでリリース情報を保存するために使用されていました。Helm 2.7.0 でリリース情報を保存するために Secret を使用する新しいストレージバックエンドが実装され、Helm 3 からはデフォルトで使用されるようになりました。

Helm 3 で Secret がデフォルトに変更されたことで、Kubernetes のリリースの Secret の暗号化と組み合わせて、チャートを保護する際のセキュリティが強化できます。

Kubernetesでのシークレット暗号化のリリースに関連してチャートを保護する際のセキュリティが強化されます。

[Secret の保存時の暗号化](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)は Kubernetes 1.7 でアルファ版の機能として利用可能になり、Kubernetes 1.13 で安定版になりました。これを利用することで、ユーザーは Helm のリリースのメタデータを保存時に暗号化できるようになるため、あとで Vault などを利用する場合によい出発地点となります。

### Go の import path の変更

Helm 3 では、Helm は Go のインポートパスを `k8s.io/helm` から `helm.sh/helm/v3` に変更しました。Helm 3 の Go クライアントライブラリをアップグレードする場合には、手元のインポートパスも変更するようにしてください。

### Capabilities

レンダリングステージで利用可能な `.Capabilities` 組み込みオブジェクトが簡略されました。

[ビルトインオブジェクト](/docs/chart_template_guide/builtin_objects/)

### チャートの Values の JSONSchema による検証

チャートの値に JSON Schema で制約を与えられるようになりました。これにより、ユーザーから与えられた値がチャートのメンテナが作ったスキーマに従っていることが保証されるため、ユーザーが間違った値をチャートに与えた場合によりよいエラー報告を行えるようになります。

検証は次のいずれかのコマンドが呼ばれたときに行われます。

* `helm install`
* `helm upgrade`
* `helm template`
* `helm lint`

詳しい情報は、ドキュメントの [Schema files](/docs/topics/charts#schema-files) をご覧ください。

### `requirements.yaml` の `Chart.yaml` への統合

チャートの依存関係の管理システムは、requirements.yaml と
requirements.lock から、Chart.yaml と Chart.lock に変更されました。私たちは、Helm 3 向けの新しいチャートは新しいフォーマットを使用することを推奨します。しかし、Helm 3 は現在でも Chart API バージョン 1 (`v1`) も理解できるため、既存の `requirements.yaml` ファイルを読み込みます。

Helm 2 の `requirements.yaml` は以下のような形式でした。

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

Helm 3 でも依存関係は同じように表現されますが、`Chart.yaml` 以下に移動されます。

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://charts.helm.sh/stable
  condition: mariadb.enabled
  tags:
    - database
```

現在でもチャートは `charts/` ディレクトリに配置されるため、`charts/` ディレクトリに追加されたサブチャートは修正なしで動作し続けます。

### Name (または --generate-name) がインストール時に必須となった

Helm 2 では、名前が与えられなかった場合に、自動生成された名前が設定されるようになっていました。本番環境では、この機能は役に立つ場合よりも迷惑になる場合のほうが多いことがわかりました。そのため、Helm 3 では、`helm install` に名前が与えられなかった場合には Helm がエラーを返します。

まだ名前の自動生成が必要なユーザーは、`--generate-name` フラグを使用すると名前を自動生成できます。

### チャートを OCI レジストリに push する

これは Helm 3 で導入された実験的な機能です。使用するには、環境変数 `HELM_EXPERIMENTAL_OCI=1` を設定してください。

At a high level, a Chart Repository is a location where Charts can be stored and
shared. The Helm client packs and ships Helm Charts to a Chart Repository.
Simply put, a Chart Repository is a basic HTTP server that houses an index.yaml
file and some packaged charts.

While there are several benefits to the Chart Repository API meeting the most
basic storage requirements, a few drawbacks have started to show:

- Chart Repositories have a very hard time abstracting most of the security
  implementations required in a production environment. Having a standard API
  for authentication and authorization is very important in production
  scenarios.
- Helm’s Chart provenance tools used for signing and verifying the integrity and
  origin of a chart are an optional piece of the Chart publishing process.
- In multi-tenant scenarios, the same Chart can be uploaded by another tenant,
  costing twice the storage cost to store the same content. Smarter chart
  repositories have been designed to handle this, but it’s not a part of the
  formal specification.
- Using a single index file for search, metadata information, and fetching
  Charts has made it difficult or clunky to design around in secure multi-tenant
  implementations.

Docker’s Distribution project (also known as Docker Registry v2) is the
successor to the Docker Registry project. Many major cloud vendors have a
product offering of the Distribution project, and with so many vendors offering
the same product, the Distribution project has benefited from many years of
hardening, security best practices, and battle-testing.

Please have a look at `helm help chart` and `helm help registry` for more
information on how to package a chart and push it to a Docker registry.

For more info, please see [this page](/docs/topics/registries/).

### `helm serve` の廃止

`helm serve` ran a local Chart Repository on your machine for development
purposes. However, it didn't receive much uptake as a development tool and had
numerous issues with its design. In the end, we decided to remove it and split
it out as a plugin.

For a similar experience to `helm serve`, have a look at the local filesystem
storage option in
[ChartMuseum](https://chartmuseum.com/docs/#using-with-local-filesystem-storage)
and the [servecm plugin](https://github.com/jdolitsky/helm-servecm).


### ライブラリチャートのサポート

Helm 3 supports a class of chart called a “library chart”. This is a chart that
is shared by other charts, but does not create any release artifacts of its own.
A library chart’s templates can only declare `define` elements. Globally scoped
non-`define` content is simply ignored. This allows users to re-use and share
snippets of code that can be re-used across many charts, avoiding redundancy and
keeping charts [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

Library charts are declared in the dependencies directive in Chart.yaml, and are
installed and managed like any other chart.

```yaml
dependencies:
  - name: mylib
    version: 1.x.x
    repository: quay.io
```

We’re very excited to see the use cases this feature opens up for chart
developers, as well as any best practices that arise from consuming library
charts.

### Chart.yaml apiVersion のバージョンアップ

With the introduction of library chart support and the consolidation of
requirements.yaml into Chart.yaml, clients that understood Helm 2's package
format won't understand these new features. So, we bumped the apiVersion in
Chart.yaml from `v1` to `v2`.

`helm create` now creates charts using this new format, so the default
apiVersion was bumped there as well.

Clients wishing to support both versions of Helm charts should inspect the
`apiVersion` field in Chart.yaml to understand how to parse the package format.

### XDG のベースディレクトリのサポート

[XDG ベースディレクトリの仕様](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)は、ファイルシステム上の設定、データ、キャッシュの各ファイルの格納場所を定めたポータブルな標準です。

In Helm 2, Helm stored all this information in `~/.helm` (affectionately known
as `helm home`), which could be changed by setting the `$HELM_HOME` environment
variable, or by using the global flag `--home`.

In Helm 3, Helm now respects the following environment variables as per the XDG
Base Directory Specification:

- `$XDG_CACHE_HOME`
- `$XDG_CONFIG_HOME`
- `$XDG_DATA_HOME`

Helm plugins are still passed `$HELM_HOME` as an alias to `$XDG_DATA_HOME` for
backwards compatibility with plugins looking to use `$HELM_HOME` as a scratchpad
environment.

Several new environment variables are also passed in to the plugin's environment
to accommodate this change:

- `$HELM_PATH_CACHE` for the cache path
- `$HELM_PATH_CONFIG` for the config path
- `$HELM_PATH_DATA` for the data path

Helm plugins looking to support Helm 3 should consider using these new
environment variables instead.

### CLI コマンドの名前変更

In order to better align the verbiage from other package managers, `helm delete`
was re-named to `helm uninstall`. `helm delete` is still retained as an alias to
`helm uninstall`, so either form can be used.

In Helm 2, in order to purge the release ledger, the `--purge` flag had to be
provided. This functionality is now enabled by default. To retain the previous
behavior, use `helm uninstall --keep-history`.

Additionally, several other commands were re-named to accommodate the same
conventions:

- `helm inspect` -> `helm show`
- `helm fetch` -> `helm pull`

These commands have also retained their older verbs as aliases, so you can
continue to use them in either form.

### 名前空間の自動生成

When creating a release in a namespace that does not exist, Helm 2 created the
namespace.  Helm 3 follows the behavior of other Kubernetes tooling and returns
an error if the namespace does not exist.  Helm 3 will create the namespace if
you explicitly specify `--create-namespace` flag.

### .Chart.ApiVersion に何が起こりましたか？

Helm follows the typical convention for CamelCasing which is to capitalize an
acronym. We have done this elsewhere in the code, such as with
`.Capabilities.APIVersions.Has`. In Helm v3, we corrected `.Chart.ApiVersion`
to follow this pattern, renaming it to `.Chart.APIVersion`.

## インストール

### Fedora などの Linux ディストリビューション向けの Helm のネイティブパッケージが存在しないのはなぜですか？

The Helm project does not maintain packages for operating systems and
environments. The Helm community may provide native packages and if the Helm
project is made aware of them they will be listed. This is how the Homebrew
formula was started and listed. If you're interested in maintaining a package,
we'd love it.

### なぜ `curl ...|bash` で実行するスクリプトを提供しているのですか？

There is a script in our repository (`scripts/get-helm-3`) that can be executed
as a `curl ..|bash` script. The transfers are all protected by HTTPS, and the
script does some auditing of the packages it fetches. However, the script has
all the usual dangers of any shell script.

We provide it because it is useful, but we suggest that users carefully read the
script first. What we'd really like, though, are better packaged releases of
Helm.

### Helm クライアントのファイルをデフォルト以外の場所に配置するにはどうすればいいですか？

Helm uses the XDG structure for storing files. There are environment variables
you can use to override these locations:

- `$XDG_CACHE_HOME`: set an alternative location for storing cached files.
- `$XDG_CONFIG_HOME`: set an alternative location for storing Helm
  configuration.
- `$XDG_DATA_HOME`: set an alternative location for storing Helm data.

Note that if you have existing repositories, you will need to re-add them with
`helm repo add...`.

## アンインストール

### ローカルの Helm を削除したいです。Helm の全ファイルはどこにありますか？ 

Along with the `helm` binary, Helm stores some files in the following locations:

- $XDG_CACHE_HOME
- $XDG_CONFIG_HOME
- $XDG_DATA_HOME

The following table gives the default folder for each of these, by OS:

| Operating System | Cache Path                  | Configuration Path               | Data Path                 |
|------------------|-----------------------------|----------------------------------|---------------------------|
| Linux            | `$HOME/.cache/helm `        | `$HOME/.config/helm `            | `$HOME/.local/share/helm` |
| macOS            | `$HOME/Library/Caches/helm` | `$HOME/Library/Preferences/helm` | `$HOME/Library/helm `     |
| Windows          | `%TEMP%\helm  `             | `%APPDATA%\helm `                | `%APPDATA%\helm`          |

## トラブルシューティング

### GKE (Google Container Engine) 上で "No SSH tunnels currently open" というメッセージが表示されました

```
Error: Error forwarding ports: error upgrading connection: No SSH tunnels currently open. Were the targets able to accept an ssh-key for user "gke-[redacted]"?
```

エラーメッセージの変種には次のようなものもあります。

```
Unable to connect to the server: x509: certificate signed by unknown authority
```

The issue is that your local Kubernetes config file must have the correct
credentials.

When you create a cluster on GKE, it will give you credentials, including SSL
certificates and certificate authorities. These need to be stored in a
Kubernetes config file (Default: `~/.kube/config` so that `kubectl` and `helm`
can access them.

### Helm 2 からのマイグレーション後、`helm list` リリースの一部 (または全部) が表示されません

It is likely that you have missed the fact that Helm 3 now uses cluster
namespaces throughout to scope releases. This means that for all commands
referencing a release you must either:

* rely on the current namespace in the active kubernetes context (as described
  by the `kubectl config view --minify` command),
* specify the correct namespace using the `--namespace`/`-n` flag, or
* for the `helm list` command, specify the `--all-namespaces`/`-A` flag

This applies to `helm ls`, `helm uninstall`, and all other `helm` commands
referencing a release.

### macOS 上で `/etc/.mdns_debug` というファイルへのアクセスがあります。なぜですか？

We are aware of a case on macOS where Helm will try to access a file named
`/etc/.mdns_debug`. If the file exists, Helm holds the file handle open while it
executes.

This is caused by macOS's MDNS library. It attempts to load that file to read
debugging settings (if enabled). The file handle probably should not be held open, and
this issue has been reported to Apple. However, it is macOS, not Helm, that causes this
behavior.

If you do not want Helm to load this file, you may be able to compile Helm to as
a static library that does not use the host network stack. Doing so will inflate the
binary size of Helm, but will prevent the file from being open.

This issue was originally flagged as a potential security problem. But it has since
been determined that there is no flaw or vulnerability caused by this behavior.

### 以前は動作していた helm repo add が失敗する

In helm 3.3.1 and before, the command `helm repo add <reponame> <url>` will give
no output if you attempt to add a repo which already exists. The flag
`--no-update` would raise an error if the repo was already registered.

In helm 3.3.2 and beyond, an attempt to add an existing repo will error:

`Error: repository name (reponame) already exists, please specify a different name`

The default behavior is now reversed. `--no-update` is now ignored, while if you
want to replace (overwrite) an existing repo, you can use `--force-update`.

This is due to a breaking change for a security fix as explained in the [Helm
3.3.2 release notes](https://github.com/helm/helm/releases/tag/v3.3.2).
