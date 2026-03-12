---
title: Chart
description: chart フォーマットの説明と、Helm で chart を構築するための基本的なガイダンスを提供します。
sidebar_position: 1
---

Helm は _chart_ と呼ばれるパッケージングフォーマットを使用します。chart は、関連する Kubernetes リソースを記述するファイル群です。単一の chart で、memcached pod のようなシンプルなものから、HTTP サーバー、データベース、キャッシュなどを含む完全な Web アプリケーションスタックまでデプロイできます。

chart は特定のディレクトリ構造で作成され、バージョン付きアーカイブとしてパッケージ化してデプロイできます。

公開された chart をインストールせずにダウンロードして中身を確認するには、`helm pull chartrepo/chartname` を使用します。

このドキュメントでは、chart フォーマットについて説明し、Helm で chart を構築するための基本的なガイダンスを提供します。

## Chart のファイル構造

chart は、ディレクトリ内のファイル群で構成されます。ディレクトリ名が chart の名前になります（バージョン情報は含みません）。たとえば、WordPress を記述する chart は `wordpress/` ディレクトリに格納されます。

このディレクトリ内で、Helm は以下のような構造を期待します:

```text
wordpress/
  Chart.yaml          # chart に関する情報を含む YAML ファイル
  LICENSE             # 任意: chart のライセンスを含むテキストファイル
  README.md           # 任意: 人間が読める README ファイル
  values.yaml         # この chart のデフォルト設定値
  values.schema.json  # 任意: values.yaml ファイルに構造を課すための JSON Schema
  charts/             # この chart が依存する chart を含むディレクトリ
  crds/               # Custom Resource Definition
  templates/          # values と組み合わせると、有効な Kubernetes マニフェストファイルを
                      # 生成するテンプレートのディレクトリ
  templates/NOTES.txt # 任意: 短い使用方法のメモを含むテキストファイル
```

Helm は `charts/`、`crds/`、`templates/` ディレクトリ、およびリストされたファイル名を予約しています。その他のファイルはそのまま残されます。

## Chart.yaml ファイル

`Chart.yaml` ファイルは chart に必須です。以下のフィールドが含まれます:

```yaml
apiVersion: chart API バージョン（必須）
name: chart の名前（必須）
version: chart のバージョン（必須）
kubeVersion: 互換性のある Kubernetes バージョンの SemVer 範囲（任意）
description: このプロジェクトの一文の説明（任意）
type: chart のタイプ（任意）
keywords:
  - このプロジェクトに関するキーワードのリスト（任意）
home: このプロジェクトのホームページの URL（任意）
sources:
  - このプロジェクトのソースコードへの URL のリスト（任意）
dependencies: # chart の依存関係のリスト（任意）
  - name: chart の名前（nginx）
    version: chart のバージョン（"1.2.3"）
    repository: （任意）リポジトリ URL（"https://example.com/charts"）またはエイリアス（"@repo-name"）
    condition: （任意）boolean に解決される yaml パスで、chart の有効化/無効化に使用（例: subchart1.enabled）
    tags: # （任意）
      - タグは chart をグループ化して一括で有効化/無効化するために使用できる
    import-values: # （任意）
      - ImportValues はソース値から親キーへのインポートマッピングを保持する。各項目は文字列または child/parent サブリスト項目のペア
    alias: （任意）chart に使用するエイリアス。同じ chart を複数回追加する必要がある場合に便利
maintainers: # （任意）
  - name: メンテナーの名前（各メンテナーに必須）
    email: メンテナーのメールアドレス（各メンテナーに任意）
    url: メンテナーの URL（各メンテナーに任意）
icon: アイコンとして使用される SVG または PNG 画像への URL（任意）
appVersion: これに含まれるアプリのバージョン（任意）。SemVer である必要はない。引用符推奨。
deprecated: この chart が非推奨かどうか（任意、boolean）
annotations:
  example: 名前をキーとしたアノテーションのリスト（任意）
```

[v3.3.2](https://github.com/helm/helm/releases/tag/v3.3.2) 以降、追加のフィールドは許可されていません。カスタムメタデータを追加する場合は `annotations` に追加することを推奨します。

### Chart とバージョニング

すべての chart にはバージョン番号が必要です。バージョンは [SemVer 2](https://semver.org/spec/v2.0.0.html) 標準に従う必要がありますが、厳密には強制されません。Helm Classic とは異なり、Helm v2 以降ではバージョン番号をリリースマーカーとして使用します。リポジトリ内のパッケージは名前とバージョンで識別されます。

たとえば、version フィールドが `version: 1.2.3` に設定された `nginx` chart は以下のように名前が付けられます:

```text
nginx-1.2.3.tgz
```

より複雑な SemVer 2 の名前もサポートされています（例: `version: 1.2.3-alpha.1+ef365`）。ただし、非 SemVer 名はシステムによって明示的に禁止されています。例外として、`x` または `x.y` 形式のバージョンは許可されます。
たとえば、先頭に v がある場合や、3 つのパーツすべてがないバージョン（例: v1.2）がある場合、有効なセマンティックバージョンに強制変換されます（例: v1.2.0）。

**注:** Helm Classic と Deployment Manager は chart に関して GitHub 指向でしたが、Helm v2 以降は GitHub や Git に依存も要求もしません。そのため、バージョニングに Git SHA をまったく使用しません。

`Chart.yaml` 内の `version` フィールドは、CLI を含む多くの Helm ツールで使用されます。パッケージを生成する際、`helm package` コマンドは `Chart.yaml` で見つけたバージョンをパッケージ名のトークンとして使用します。システムは、chart パッケージ名のバージョン番号が `Chart.yaml` のバージョン番号と一致することを想定しています。この想定を満たさないとエラーが発生します。

### `apiVersion` フィールド

`apiVersion` フィールドは、Helm 3 以上を必要とする Helm chart では `v2` にする必要があります。以前の Helm バージョンをサポートする chart は `apiVersion` が `v1` に設定されており、Helm 3 でもインストール可能です。

`v1` から `v2` への変更点:

- `v1` chart では別の `requirements.yaml` ファイルにあった chart 依存関係を定義する `dependencies` フィールド（[Chart 依存関係](#chart-依存関係)を参照）。
- application chart と library chart を区別する `type` フィールド（[Chart タイプ](#chart-タイプ)を参照）。

### `appVersion` フィールド

`appVersion` フィールドは `version` フィールドとは関係ありません。これはアプリケーションのバージョンを指定するためのフィールドです。たとえば、`drupal` chart には `appVersion: "8.2.1"` があり、chart に含まれる Drupal のバージョン（デフォルト）が `8.2.1` であることを示しています。このフィールドは情報提供用であり、chart バージョンの計算には影響しません。バージョンを引用符で囲むことを強く推奨します。これにより YAML パーサーがバージョン番号を文字列として扱います。引用符で囲まないと、パースの問題が発生する場合があります。たとえば、YAML は `1.0` を浮動小数点値として、`1234e10` のような git commit SHA を指数表記として解釈します。

Helm v3.5.0 以降、`helm create` はデフォルトの `appVersion` フィールドを引用符で囲むようになりました。

### `kubeVersion` フィールド

任意の `kubeVersion` フィールドでは、サポートされる Kubernetes バージョンの semver 制約を定義できます。Helm は chart をインストールする際にバージョン制約を検証し、クラスターがサポートされていない Kubernetes バージョンで実行されている場合は失敗します。

バージョン制約には、以下のようなスペースで区切られた AND 比較を含めることができます:
```
>= 1.13.0 < 1.15.0
```
これらは以下の例のように OR 演算子 `||` と組み合わせることができます:
```
>= 1.13.0 < 1.14.0 || >= 1.14.1 < 1.15.0
```
この例では、バージョン `1.14.0` が除外されています。これは、特定のバージョンのバグにより chart が正しく動作しないことがわかっている場合に有用です。

演算子 `=` `!=` `>` `<` `>=` `<=` を使用したバージョン制約の他に、以下の省略記法がサポートされています:

 * ハイフン範囲（閉区間）: `1.1 - 2.3.4` は `>= 1.1 <= 2.3.4` と同等です。
 * ワイルドカード `x`、`X`、`*`: `1.2.x` は `>= 1.2.0 < 1.3.0` と同等です。
 * チルダ範囲（パッチバージョンの変更を許可）: `~1.2.3` は `>= 1.2.3 < 1.3.0` と同等です。
 * キャレット範囲（マイナーバージョンの変更を許可）: `^1.2.3` は `>= 1.2.3 < 2.0.0` と同等です。

サポートされる semver 制約の詳細については、[Masterminds/semver](https://github.com/Masterminds/semver) を参照してください。

### Chart の非推奨化

Chart リポジトリで chart を管理する際、chart を非推奨にする必要がある場合があります。`Chart.yaml` の任意の `deprecated` フィールドを使用して、chart を非推奨としてマークできます。リポジトリ内の chart の**最新**バージョンが非推奨としてマークされている場合、chart 全体が非推奨と見なされます。非推奨としてマークされていない新しいバージョンを公開することで、chart 名を再利用できます。chart を非推奨にするワークフローは以下のとおりです:

1. chart の `Chart.yaml` を更新して chart を非推奨としてマークし、バージョンをバンプする
2. Chart リポジトリで新しい chart バージョンをリリースする
3. ソースリポジトリ（例: git）から chart を削除する

### Chart タイプ

`type` フィールドは chart のタイプを定義します。タイプは `application` と `library` の 2 種類です。application がデフォルトタイプで、完全に操作可能な標準的な chart です。[library chart](/topics/library_charts.md) は chart ビルダー向けのユーティリティや関数を提供します。library chart は application chart とは異なり、インストールできず、通常はリソースオブジェクトを含みません。

**注:** application chart を library chart として使用することもできます。type を `library` に設定すると有効になります。すべてのユーティリティと関数を活用できる library chart としてレンダリングされますが、chart のすべてのリソースオブジェクトはレンダリングされません。

## Chart の LICENSE、README、NOTES

chart には、インストール、設定、使用方法、ライセンスを説明するファイルも含めることができます。

LICENSE は、chart の[ライセンス](https://en.wikipedia.org/wiki/Software_license)を含むテキストファイルです。chart にはテンプレート内にプログラミングロジックが含まれる場合があり、設定のみではないため、ライセンスを含めることができます。必要に応じて、chart によってインストールされるアプリケーションの個別のライセンスも含めることができます。

chart の README は Markdown（README.md）でフォーマットする必要があり、一般的に以下を含めます:

- chart が提供するアプリケーションまたはサービスの説明
- chart を実行するための前提条件や要件
- `values.yaml` のオプションとデフォルト値の説明
- chart のインストールや設定に関連するその他の情報

ハブやその他のユーザーインターフェースで chart の詳細を表示する際、その詳細は `README.md` ファイルの内容から取得されます。

chart には、インストール後や release のステータスを表示する際に出力される短いテキストの `templates/NOTES.txt` ファイルも含めることができます。このファイルは[テンプレート](#テンプレートと-values)として評価され、使用方法のメモ、次のステップ、または release に関連するその他の情報を表示するために使用できます。たとえば、データベースへの接続方法や Web UI へのアクセス方法の説明を提供できます。このファイルは `helm install` または `helm status` の実行時に STDOUT に出力されるため、内容は簡潔にし、詳細は README を参照するようにすることを推奨します。

## Chart 依存関係

Helm では、chart は任意の数の他の chart に依存できます。これらの依存関係は、`Chart.yaml` の `dependencies` フィールドを使用して動的にリンクするか、`charts/` ディレクトリに手動で配置して管理できます。

### `dependencies` フィールドによる依存関係の管理

現在の chart が必要とする chart は、`dependencies` フィールドにリストとして定義します。

```yaml
dependencies:
  - name: apache
    version: 1.2.3
    repository: https://example.com/charts
  - name: mysql
    version: 3.2.1
    repository: https://another.example.com/charts
```

- `name` フィールドは必要な chart の名前です。
- `version` フィールドは必要な chart のバージョンです。
- `repository` フィールドは chart リポジトリへの完全な URL です。ローカルにそのリポジトリを追加するには `helm repo add` も使用する必要があります。
- URL の代わりにリポジトリ名を使用することもできます

```console
$ helm repo add fantastic-charts https://charts.helm.sh/incubator
```

```yaml
dependencies:
  - name: awesomeness
    version: 1.0.0
    repository: "@fantastic-charts"
```

依存関係を定義したら、`helm dependency update` を実行すると、依存ファイルを使用して指定されたすべての chart を `charts/` ディレクトリにダウンロードできます。

```console
$ helm dep up foochart
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "local" chart repository
...Successfully got an update from the "stable" chart repository
...Successfully got an update from the "example" chart repository
...Successfully got an update from the "another" chart repository
Update Complete. Happy Helming!
Saving 2 charts
Downloading apache from repo https://example.com/charts
Downloading mysql from repo https://another.example.com/charts
```

`helm dependency update` が chart を取得すると、`charts/` ディレクトリに chart アーカイブとして保存されます。上記の例では、charts ディレクトリに以下のファイルが存在することになります:

```text
charts/
  apache-1.2.3.tgz
  mysql-3.2.1.tgz
```

#### 依存関係の alias フィールド

上記の他のフィールドに加えて、各依存関係エントリには任意の `alias` フィールドを含めることができます。

依存関係 chart にエイリアスを追加すると、エイリアスを新しい依存関係の名前として使用して chart を依存関係に配置します。

別の名前で chart にアクセスする必要がある場合に `alias` を使用できます。

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-1
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    alias: new-subchart-2
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
```

上記の例では、`parentchart` に対して合計 3 つの依存関係が取得されます:

```text
subchart
new-subchart-1
new-subchart-2
```

これを手動で行う方法は、`charts/` ディレクトリに異なる名前で同じ chart を複数回コピー＆ペーストすることです。

#### 依存関係の tags と condition フィールド

上記の他のフィールドに加えて、各依存関係エントリには任意の `tags` と `condition` フィールドを含めることができます。

すべての chart はデフォルトでロードされます。`tags` または `condition` フィールドが存在する場合、それらが評価され、適用される chart のロードを制御するために使用されます。

condition - condition フィールドは 1 つ以上の YAML パス（カンマ区切り）を保持します。このパスが最上位の親の values に存在し、boolean 値に解決される場合、その boolean 値に基づいて chart が有効または無効になります。リスト内で見つかった最初の有効なパスのみが評価され、パスが存在しない場合、condition は効果がありません。

tags - tags フィールドは、この chart に関連付けるラベルの YAML リストです。最上位の親の values で、タグと boolean 値を指定することで、タグを持つすべての chart を有効または無効にできます。

```yaml
# parentchart/Chart.yaml

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart1.enabled,global.subchart1.enabled
    tags:
      - front-end
      - subchart1
  - name: subchart2
    repository: http://localhost:10191
    version: 0.1.0
    condition: subchart2.enabled,global.subchart2.enabled
    tags:
      - back-end
      - subchart2
```

```yaml
# parentchart/values.yaml

subchart1:
  enabled: true
tags:
  front-end: false
  back-end: true
```

上記の例では、タグ `front-end` を持つすべての chart が無効になりますが、親の values で `subchart1.enabled` パスが 'true' と評価されるため、condition が `front-end` タグをオーバーライドし、`subchart1` が有効になります。

`subchart2` はタグ `back-end` を持ち、そのタグが `true` と評価されるため、`subchart2` が有効になります。また、`subchart2` には condition が指定されていますが、親の values に対応するパスと値がないため、その condition は効果がありません。

##### CLI での tags と conditions の使用

`--set` パラメータを通常どおり使用して、tag と condition の値を変更できます。

```console
helm install --set tags.front-end=true --set subchart2.enabled=false
```

##### tags と condition の解決

- **conditions（values で設定されている場合）は常に tags をオーバーライドします。** 存在する最初の condition パスが優先され、その chart の後続のパスは無視されます。
- tags は「chart のタグのいずれかが true の場合、chart を有効にする」として評価されます。
- tags と conditions の値は最上位の親の values で設定する必要があります。
- values の `tags:` キーはトップレベルキーである必要があります。グローバルおよびネストされた `tags:` テーブルは現在サポートされていません。

#### dependencies による子の values のインポート

場合によっては、子 chart の values を親 chart に伝播させ、共通のデフォルトとして共有することが望ましい場合があります。`exports` フォーマットを使用する追加の利点は、将来のツールがユーザー設定可能な値を調査できるようになることです。

インポートする値を含むキーは、親 chart の `dependencies` の `import-values` フィールドで YAML リストを使用して指定できます。リストの各項目は、子 chart の `exports` フィールドからインポートされるキーです。

`exports` キーに含まれていない値をインポートするには、[child-parent](#child-parent-フォーマットの使用) フォーマットを使用してください。両方のフォーマットの例を以下に示します。

##### exports フォーマットの使用

子 chart の `values.yaml` ファイルのルートに `exports` フィールドがある場合、以下の例のようにインポートするキーを指定することで、その内容を親の values に直接インポートできます:

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart
    repository: http://localhost:10191
    version: 0.1.0
    import-values:
      - data
```

```yaml
# child's values.yaml file

exports:
  data:
    myint: 99
```

インポートリストでキー `data` を指定しているため、Helm は子 chart の `exports` フィールドで `data` キーを探し、その内容をインポートします。

最終的な親の values にはエクスポートされたフィールドが含まれます:

```yaml
# parent's values

myint: 99
```

親キー `data` は親の最終 values に含まれないことに注意してください。親キーを指定する必要がある場合は、'child-parent' フォーマットを使用してください。

##### child-parent フォーマットの使用

子 chart の values の `exports` キーに含まれていない値にアクセスするには、インポートする値のソースキー（`child`）と親 chart の values の宛先パス（`parent`）を指定する必要があります。

以下の例の `import-values` は、`child:` パスにある値を取得し、`parent:` で指定されたパスの親の values にコピーするよう Helm に指示しています:

```yaml
# parent's Chart.yaml file

dependencies:
  - name: subchart1
    repository: http://localhost:10191
    version: 0.1.0
    ...
    import-values:
      - child: default.data
        parent: myimports
```

上記の例では、subchart1 の values の `default.data` にある値が、以下に詳述するように親 chart の values の `myimports` キーにインポートされます:

```yaml
# parent's values.yaml file

myimports:
  myint: 0
  mybool: false
  mystring: "helm rocks!"
```

```yaml
# subchart1's values.yaml file

default:
  data:
    myint: 999
    mybool: true
```

親 chart の結果の values は以下のようになります:

```yaml
# parent's final values

myimports:
  myint: 999
  mybool: true
  mystring: "helm rocks!"
```

親の最終 values には、subchart1 からインポートされた `myint` と `mybool` フィールドが含まれるようになりました。

### `charts/` ディレクトリによる手動の依存関係管理

依存関係をより細かく制御したい場合、依存関係 chart を `charts/` ディレクトリにコピーすることで明示的に表現できます。

依存関係は展開された chart ディレクトリである必要がありますが、名前は `_` または `.` で始めることはできません。そのようなファイルは chart ローダーによって無視されます。

たとえば、WordPress chart が Apache chart に依存している場合、Apache chart（正しいバージョン）が WordPress chart の `charts/` ディレクトリに配置されます:

```yaml
wordpress:
  Chart.yaml
  # ...
  charts/
    apache/
      Chart.yaml
      # ...
    mysql/
      Chart.yaml
      # ...
```

上記の例は、WordPress chart が Apache と MySQL への依存関係を、`charts/` ディレクトリ内にそれらの chart を含めることでどのように表現しているかを示しています。

**ヒント:** _依存関係を `charts/` ディレクトリにドロップするには、`helm pull` コマンドを使用してください_

### 依存関係使用時の操作面

上記のセクションでは chart 依存関係の指定方法を説明しましたが、`helm install` や `helm upgrade` を使用した chart のインストールにどのように影響するのでしょうか？

"A" という名前の chart が以下の Kubernetes オブジェクトを作成するとします:

- namespace "A-Namespace"
- statefulset "A-StatefulSet"
- service "A-Service"

さらに、A は以下のオブジェクトを作成する chart B に依存しています:

- namespace "B-Namespace"
- replicaset "B-ReplicaSet"
- service "B-Service"

chart A のインストール/アップグレード後、単一の Helm release が作成/変更されます。この release は、上記のすべての Kubernetes オブジェクトを以下の順序で作成/更新します:

- A-Namespace
- B-Namespace
- A-Service
- B-Service
- B-ReplicaSet
- A-StatefulSet

これは、Helm が chart とそのすべての依存関係をインストール/アップグレードする際に、Kubernetes オブジェクトが以下のように処理されるためです:

- 単一のセットに集約される
- タイプ順、次に名前順でソートされる
- その順序で作成/更新される

したがって、chart とその依存関係のすべてのオブジェクトを含む単一の release が作成されます。

Kubernetes タイプのインストール順序は、kind_sorter.go の InstallOrder 列挙型で指定されています（[Helm ソースファイル](https://github.com/helm/helm/blob/484d43913f97292648c867b56768775a55e4bba6/pkg/releaseutil/kind_sorter.go)を参照）。

## テンプレートと Values

Helm Chart テンプレートは [Go テンプレート言語](https://golang.org/pkg/text/template/)で記述され、[Sprig ライブラリ](https://github.com/Masterminds/sprig)の 50 以上のアドオンテンプレート関数といくつかの[特殊な関数](/howto/charts_tips_and_tricks.md)が追加されています。

すべてのテンプレートファイルは chart の `templates/` フォルダに格納されます。Helm が chart をレンダリングする際、そのディレクトリ内のすべてのファイルがテンプレートエンジンを通過します。

テンプレートの values は 2 つの方法で提供されます:

- chart 開発者は chart 内に `values.yaml` というファイルを提供できます。このファイルにはデフォルト値を含めることができます。
- chart ユーザーは values を含む YAML ファイルを提供できます。これはコマンドラインで `helm install` を使用して提供できます。

ユーザーがカスタム values を提供すると、それらの値は chart の `values.yaml` ファイルの値をオーバーライドします。

### テンプレートファイル

テンプレートファイルは Go テンプレートを記述するための標準的な規約に従います（詳細は [text/template Go パッケージドキュメント](https://golang.org/pkg/text/template/)を参照）。テンプレートファイルの例は以下のようになります:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

上記の例は [https://github.com/deis/charts](https://github.com/deis/charts) に緩く基づいており、Kubernetes レプリケーションコントローラのテンプレートです。以下の 4 つのテンプレート値を使用できます（通常は `values.yaml` ファイルで定義されます）:

- `imageRegistry`: Docker イメージのソースレジストリ。
- `dockerTag`: docker イメージのタグ。
- `pullPolicy`: Kubernetes のプルポリシー。
- `storage`: ストレージバックエンド。デフォルトは `"minio"` に設定されています。

これらの値はすべてテンプレート作成者によって定義されています。Helm はパラメータを要求したり指定したりしません。

動作する多くの chart を見るには、CNCF [Artifact Hub](https://artifacthub.io/packages/search?kind=0) をチェックしてください。

### 事前定義された Values

`values.yaml` ファイル（または `--set` フラグ）を通じて提供される values は、テンプレート内の `.Values` オブジェクトからアクセスできます。ただし、テンプレートでアクセスできる他の事前定義されたデータもあります。

以下の values は事前定義されており、すべてのテンプレートで利用可能で、オーバーライドできません。すべての values と同様に、名前は_大文字と小文字を区別_します。

- `Release.Name`: release の名前（chart ではない）
- `Release.Namespace`: chart がリリースされた namespace。
- `Release.Service`: release を実行したサービス。
- `Release.IsUpgrade`: 現在の操作がアップグレードまたはロールバックの場合、これは true に設定されます。
- `Release.IsInstall`: 現在の操作がインストールの場合、これは true に設定されます。
- `Chart`: `Chart.yaml` の内容。したがって、chart バージョンは `Chart.Version` で取得でき、メンテナーは `Chart.Maintainers` にあります。
- `Files`: chart 内のすべての非特殊ファイルを含むマップのようなオブジェクト。これはテンプレートへのアクセスは提供しませんが、存在する追加ファイルへのアクセスを提供します（`.helmignore` を使用して除外されていない限り）。ファイルは `{{ index .Files "file.name" }}` または `{{.Files.Get name }}` 関数を使用してアクセスできます。`{{ .Files.GetBytes }}` を使用してファイルの内容を `[]byte` としてアクセスすることもできます。
- `Capabilities`: Kubernetes のバージョン（`{{ .Capabilities.KubeVersion }}`）やサポートされている Kubernetes API バージョン（`{{ .Capabilities.APIVersions.Has "batch/v1" }}`）に関する情報を含むマップのようなオブジェクト。

**注:** 不明な `Chart.yaml` フィールドは削除されます。`Chart` オブジェクト内でアクセスできません。したがって、`Chart.yaml` を使用して任意の構造化データをテンプレートに渡すことはできません。ただし、values ファイルはそのために使用できます。

### values ファイル

前のセクションのテンプレートを考慮すると、必要な values を提供する `values.yaml` ファイルは以下のようになります:

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "s3"
```

values ファイルは YAML でフォーマットされます。chart にはデフォルトの `values.yaml` ファイルを含めることができます。Helm install コマンドでは、追加の YAML 値を提供することで値をオーバーライドできます:

```console
$ helm install --generate-name --values=myvals.yaml wordpress
```

この方法で values が渡されると、デフォルトの values ファイルにマージされます。たとえば、以下のような `myvals.yaml` ファイルを考えてみましょう:

```yaml
storage: "gcs"
```

これが chart の `values.yaml` とマージされると、生成される内容は以下のようになります:

```yaml
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "gcs"
```

最後のフィールドのみがオーバーライドされたことに注意してください。

**注:** chart 内に含まれるデフォルトの values ファイルは、`values.yaml` という名前である_必要があります_。ただし、コマンドラインで指定するファイルは任意の名前にできます。

**注:** `helm install` または `helm upgrade` で `--set` フラグを使用すると、それらの値はクライアント側で単純に YAML に変換されます。

**注:** values ファイルに必須のエントリが存在する場合、chart テンプレートで ['required' 関数](/howto/charts_tips_and_tricks.md)を使用して必須として宣言できます。

これらの values はすべて、`.Values` オブジェクトを使用してテンプレート内でアクセスできます:

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{ .Values.imageRegistry }}/postgres:{{ .Values.dockerTag }}
          imagePullPolicy: {{ .Values.pullPolicy }}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{ default "minio" .Values.storage }}
```

### スコープ、依存関係、Values

values ファイルは、トップレベル chart の値と、その chart の `charts/` ディレクトリに含まれる chart の値を宣言できます。言い換えると、values ファイルは chart とその依存関係のいずれにも値を提供できます。たとえば、上記のデモ用 WordPress chart には `mysql` と `apache` が依存関係としてあります。values ファイルはこれらすべてのコンポーネントに値を提供できます:

```yaml
title: "My WordPress Site" # WordPress テンプレートに送信される

mysql:
  max_connections: 100 # MySQL に送信される
  password: "secret"

apache:
  port: 8080 # Apache に渡される
```

上位レベルの chart は、下位で定義されたすべての変数にアクセスできます。したがって、WordPress chart は MySQL のパスワードに `.Values.mysql.password` としてアクセスできます。ただし、下位レベルの chart は親 chart のものにアクセスできないため、MySQL は `title` プロパティにアクセスできません。同様に、`apache.port` にもアクセスできません。

values は名前空間化されていますが、名前空間はプルーニングされます。したがって、WordPress chart は MySQL のパスワードフィールドに `.Values.mysql.password` としてアクセスできます。しかし、MySQL chart では values のスコープが縮小され、名前空間プレフィックスが削除されるため、パスワードフィールドは単に `.Values.password` として見えます。

#### グローバル Values

2.0.0-Alpha.2 以降、Helm は特別な「グローバル」値をサポートしています。前の例の修正版を考えてみましょう:

```yaml
title: "My WordPress Site" # WordPress テンプレートに送信される

global:
  app: MyWordPress

mysql:
  max_connections: 100 # MySQL に送信される
  password: "secret"

apache:
  port: 8080 # Apache に渡される
```

上記は `app: MyWordPress` という値を持つ `global` セクションを追加しています。この値は `.Values.global.app` として_すべての_ chart で利用可能です。

たとえば、`mysql` テンプレートは `app` に `{{ .Values.global.app}}` としてアクセスでき、`apache` chart も同様です。実質的に、上記の values ファイルは以下のように再生成されます:

```yaml
title: "My WordPress Site" # WordPress テンプレートに送信される

global:
  app: MyWordPress

mysql:
  global:
    app: MyWordPress
  max_connections: 100 # MySQL に送信される
  password: "secret"

apache:
  global:
    app: MyWordPress
  port: 8080 # Apache に渡される
```

これにより、1 つのトップレベル変数をすべてのサブチャートと共有できます。これは `metadata` プロパティ（ラベルなど）の設定に便利です。

サブチャートがグローバル変数を宣言した場合、そのグローバルは（サブチャートのサブチャートに）_下方向_に渡されますが、親 chart には_上方向_に渡されません。サブチャートが親 chart の値に影響を与える方法はありません。

また、親 chart のグローバル変数はサブチャートのグローバル変数よりも優先されます。

### スキーマファイル

chart メンテナーは、values に構造を定義したい場合があります。これは `values.schema.json` ファイルでスキーマを定義することで実現できます。スキーマは [JSON Schema](https://json-schema.org/) として表現されます。以下のようになります:

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "properties": {
    "image": {
      "description": "Container Image",
      "properties": {
        "repo": {
          "type": "string"
        },
        "tag": {
          "type": "string"
        }
      },
      "type": "object"
    },
    "name": {
      "description": "Service name",
      "type": "string"
    },
    "port": {
      "description": "Port",
      "minimum": 0,
      "type": "integer"
    },
    "protocol": {
      "type": "string"
    }
  },
  "required": [
    "protocol",
    "port"
  ],
  "title": "Values",
  "type": "object"
}
```

このスキーマは values に適用され、検証が行われます。検証は以下のコマンドが実行されたときに行われます:

- `helm install`
- `helm upgrade`
- `helm lint`
- `helm template`

このスキーマの要件を満たす `values.yaml` ファイルの例は以下のようになります:

```yaml
name: frontend
protocol: https
port: 443
```

スキーマは `values.yaml` ファイルだけでなく、最終的な `.Values` オブジェクトに適用されることに注意してください。つまり、以下の `yaml` ファイルは、以下に示す適切な `--set` オプションで chart がインストールされた場合に有効です。

```yaml
name: frontend
protocol: https
```

```console
helm install --set port=443
```

さらに、最終的な `.Values` オブジェクトは*すべて*のサブチャートスキーマに対してチェックされます。これは、サブチャートの制限が親 chart によって回避できないことを意味します。これは逆方向にも機能します - サブチャートの `values.yaml` ファイルで満たされていない要件がある場合、親 chart はそれらの制限を満たす*必要があります*。

スキーマ検証は以下のオプションを設定することで無効にできます。
これは、chart の JSON Schema ファイルにリモート参照が含まれているエアギャップ環境で特に便利です。
```console
helm install --skip-schema-validation
```

### リファレンス

テンプレート、values、スキーマファイルを記述する際に役立ついくつかの標準的なリファレンスがあります。

- [Go templates](https://godoc.org/text/template)
- [Extra template functions](https://godoc.org/github.com/Masterminds/sprig)
- [The YAML format](https://yaml.org/spec/)
- [JSON Schema](https://json-schema.org/)

## Custom Resource Definition（CRD）

Kubernetes は、新しい種類の Kubernetes オブジェクトを宣言するメカニズムを提供しています。CustomResourceDefinition（CRD）を使用すると、Kubernetes 開発者はカスタムリソースタイプを宣言できます。

Helm 3 では、CRD は特別な種類のオブジェクトとして扱われます。chart の残りの部分より前にインストールされ、いくつかの制限があります。

CRD YAML ファイルは chart 内の `crds/` ディレクトリに配置する必要があります。複数の CRD（YAML の開始マーカーと終了マーカーで区切られた）を同じファイルに配置できます。Helm は CRD ディレクトリ内の_すべて_のファイルを Kubernetes にロードしようとします。

CRD ファイルは_テンプレート化できません_。プレーンな YAML ドキュメントである必要があります。

Helm が新しい chart をインストールする際、CRD をアップロードし、API サーバーによって CRD が利用可能になるまで一時停止し、その後テンプレートエンジンを起動して chart の残りをレンダリングし、Kubernetes にアップロードします。この順序のため、CRD 情報は Helm テンプレートの `.Capabilities` オブジェクトで利用可能であり、Helm テンプレートは CRD で宣言されたオブジェクトの新しいインスタンスを作成できます。

たとえば、chart の `crds/` ディレクトリに `CronTab` の CRD がある場合、`templates/` ディレクトリで `CronTab` kind のインスタンスを作成できます:

```text
crontabs/
  Chart.yaml
  crds/
    crontab.yaml
  templates/
    mycrontab.yaml
```

`crontab.yaml` ファイルには、テンプレートディレクティブなしで CRD が含まれている必要があります:

```yaml
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
```

その後、テンプレート `mycrontab.yaml` は新しい `CronTab` を作成できます（通常どおりテンプレートを使用）:

```yaml
apiVersion: stable.example.com
kind: CronTab
metadata:
  name: {{ .Values.name }}
spec:
   # ...
```

Helm は、`templates/` 内のものをインストールする前に、`CronTab` kind がインストールされ、Kubernetes API サーバーから利用可能であることを確認します。

### CRD の制限

Kubernetes のほとんどのオブジェクトとは異なり、CRD はグローバルにインストールされます。そのため、Helm は CRD の管理に非常に慎重なアプローチを取ります。CRD には以下の制限があります:

- CRD は再インストールされません。Helm が `crds/` ディレクトリの CRD がすでに存在すると判断した場合（バージョンに関係なく）、Helm はインストールやアップグレードを試みません。
- CRD はアップグレードやロールバック時にインストールされません。Helm はインストール操作時のみ CRD を作成します。
- CRD は削除されません。CRD を削除すると、クラスター内のすべての namespace にある CRD のすべてのコンテンツが自動的に削除されます。そのため、Helm は CRD を削除しません。

CRD をアップグレードまたは削除したいオペレーターは、手動で十分注意して行うことを推奨します。

## Helm を使用した Chart の管理

`helm` ツールには chart を操作するためのいくつかのコマンドがあります。

新しい chart を作成できます:

```console
$ helm create mychart
Created mychart/
```

chart を編集したら、`helm` で chart アーカイブにパッケージ化できます:

```console
$ helm package mychart
Archived mychart-0.1.-.tgz
```

`helm` を使用して chart のフォーマットや情報の問題を見つけることもできます:

```console
$ helm lint mychart
No issues found
```

## Chart リポジトリ

_chart リポジトリ_は、1 つ以上のパッケージ化された chart をホストする HTTP サーバーです。`helm` はローカルの chart ディレクトリを管理するために使用できますが、chart を共有する際は chart リポジトリが推奨されるメカニズムです。

YAML ファイルと tar ファイルを提供でき、GET リクエストに応答できる任意の HTTP サーバーをリポジトリサーバーとして使用できます。Helm チームは、Web サイトモードを有効にした Google Cloud Storage や、Web サイトモードを有効にした S3 など、いくつかのサーバーをテストしています。

リポジトリは主に、リポジトリが提供するすべてのパッケージのリストと、それらのパッケージを取得して検証するためのメタデータを持つ `index.yaml` という特別なファイルの存在によって特徴付けられます。

クライアント側では、リポジトリは `helm repo` コマンドで管理されます。ただし、Helm はリモートリポジトリサーバーに chart をアップロードするためのツールを提供していません。これは、実装するサーバーに大きな要件を追加し、リポジトリの設定の障壁を上げるためです。

## Chart スターターパック

`helm create` コマンドには、「スターター chart」を指定できる任意の `--starter` オプションがあります。また、starter オプションには短いエイリアス `-p` があります。

使用例:

```console
helm create my-chart --starter starter-name
helm create my-chart -p starter-name
helm create my-chart -p /absolute/path/to/starter-name
```

スターターは通常の chart ですが、`$XDG_DATA_HOME/helm/starters` に配置されています。chart 開発者は、スターターとして使用するために特別に設計された chart を作成できます。そのような chart は以下の考慮事項を念頭に置いて設計する必要があります:

- `Chart.yaml` はジェネレーターによって上書きされます。
- ユーザーはそのような chart の内容を変更することを期待しているため、ドキュメントでユーザーがどのように変更できるかを示す必要があります。
- `<CHARTNAME>` のすべての出現箇所は指定された chart 名に置き換えられるため、スターター chart をテンプレートとして使用できます。ただし、一部の変数ファイルは例外です。たとえば、`vars` ディレクトリ内のカスタムファイルや特定の `README.md` ファイルを使用する場合、それらの内部では `<CHARTNAME>` は置き換えられません。また、chart の説明は継承されません。

現在、`$XDG_DATA_HOME/helm/starters` に chart を追加する唯一の方法は、手動でコピーすることです。chart のドキュメントで、そのプロセスを説明することを推奨します。
