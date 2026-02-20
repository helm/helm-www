---
title: Helm プラグインガイド
description: Helm の機能を拡張するプラグインの使い方と作成方法を紹介します。
sidebar_position: 12
---

Helm プラグインは、`helm` CLI からアクセスできるツールですが、Helm 本体のコードベースには含まれていません。

既存のプラグインは、[関連プロジェクト](/community/related#helm-plugins)セクションや [GitHub](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories) で検索して見つけることができます。

このガイドでは、プラグインの使い方と作成方法を説明します。

## 概要

Helm プラグインは、Helm とシームレスに統合されるアドオンツールです。Helm のコア機能を拡張する手段を提供しますが、すべての新機能を Go で記述してコアツールに追加する必要はありません。

Helm プラグインには以下の特徴があります:

- コアの Helm ツールに影響を与えることなく、Helm インストールに追加・削除できます。
- 任意のプログラミング言語で記述できます。
- Helm と統合され、`helm help` やその他の場所に表示されます。

Helm プラグインは `$HELM_PLUGINS` に配置されます。この値は、環境変数が設定されていない場合のデフォルト値を含めて、`helm env` コマンドで確認できます。

Helm のプラグインモデルは、Git のプラグインモデルを部分的にベースにしています。そのため、`helm` を _porcelain_（磁器）層、プラグインを _plumbing_（配管）と呼ぶことがあります。これは、Helm がユーザー向けのインターフェースと全体的な処理ロジックを提供し、プラグインが目的のアクションを実行する「詳細な作業」を担当することを端的に表しています。

## プラグインのインストール

プラグインは `$ helm plugin install <path|url>` コマンドでインストールします。ローカルファイルシステム上のプラグインへのパスか、リモート VCS リポジトリの URL を指定できます。`helm plugin install` コマンドは、指定されたパス/URL のプラグインを `$HELM_PLUGINS` にクローンまたはコピーします。VCS からインストールする場合は、`--version` 引数でバージョンを指定できます。

```console
$ helm plugin install https://github.com/adamreese/helm-env
```

プラグインの tar 配布物がある場合は、`$HELM_PLUGINS` ディレクトリに解凍するだけです。`helm plugin install https://domain/path/to/plugin.tar.gz` を実行すると、URL から tarball プラグインを直接インストールすることもできます。

## プラグインのファイル構造

多くの点で、プラグインは chart に似ています。各プラグインには、`plugin.yaml` ファイルを含むトップレベルディレクトリがあります。その他のファイルも存在できますが、必須なのは `plugin.yaml` ファイルのみです。

```console
$HELM_PLUGINS/
  |- last/
      |- plugin.yaml
```

## plugin.yaml ファイル

plugin.yaml ファイルはプラグインに必須です。以下のフィールドが含まれます:

```yaml
name: The name of the plugin (REQUIRED)
version: A SemVer 2 version (REQUIRED)
usage: Single line usage text shown in help
description: Long description shown in places like helm help
ignoreFlags: Ignore flags passed in from Helm
platformCommand: # Configure command to run based on the platform
  - os: OS match, can be empty or omitted to match all OS'
    arch: Architecture match, can be empty or omitted to match all architectures
    command: Plugin command to execute
    args: Plugin command arguments
command: (DEPRECATED) Plugin command, use platformCommand instead
platformHooks: # Configure plugin lifecycle hooks based on the platform
  install: # Install lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin install command to execute
      args: Plugin install command arguments
  update: # Update lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin update command to execute
      args: Plugin update command arguments
  delete: # Delete lifecycle commands
    - os: OS match, can be empty or omitted to match all OS'
      arch: Architecture match, can be empty or omitted to match all architectures
      command: Plugin delete command to execute
      args: Plugin delete command arguments
hooks: # (Deprecated) Plugin lifecycle hooks, use platformHooks instead
  install: Command to install plugin
  update: Command to update plugin
  delete: Command to delete plugin
downloaders: # Configure downloaders capability
  - command: Command to invoke
    protocols:
      - Protocol schema supported
```

### `name` フィールド

`name` はプラグインの名前です。Helm がこのプラグインを実行するとき、この名前が使用されます（例: `helm NAME` でこのプラグインが呼び出されます）。

_`name` はディレクトリ名と一致する必要があります。_ 上記の例では、`name: last` を持つプラグインは `last` という名前のディレクトリに格納する必要があります。

`name` の制約:

- `name` は既存の `helm` トップレベルコマンドと重複できません。
- `name` は ASCII 文字 a-z、A-Z、0-9、`_`、`-` に制限されます。

### `version` フィールド

`version` はプラグインの SemVer 2 バージョンです。`usage` と `description` は両方ともコマンドのヘルプテキスト生成に使用されます。

### `ignoreFlags` フィールド

`ignoreFlags` スイッチは、Helm にフラグをプラグインに渡さ _ない_ よう指示します。プラグインが `helm myplugin --foo` で呼び出され、`ignoreFlags: true` の場合、`--foo` は静かに破棄されます。

### `platformCommand` フィールド

`platformCommand` は、プラグインが呼び出されたときに実行するコマンドを設定します。`platformCommand` と `command` の両方を設定するとエラーになります。使用するコマンドを決定する際には、以下のルールが適用されます:

- `platformCommand` が存在する場合、それが使用されます。
  - `os` と `arch` の両方が現在のプラットフォームに一致する場合、検索は停止し、そのコマンドが使用されます。
  - `os` が一致し、`arch` が空の場合、そのコマンドが使用されます。
  - `os` と `arch` の両方が空の場合、そのコマンドが使用されます。
  - 一致するものがない場合、Helm はエラーで終了します。
- `platformCommand` が存在せず、非推奨の `command` が存在する場合、それが使用されます。
  - コマンドが空の場合、Helm はエラーで終了します。

### `platformHooks` フィールド

`platformHooks` は、ライフサイクルイベントに対してプラグインが実行するコマンドを設定します。`platformHooks` と `hooks` の両方を設定するとエラーになります。使用するフックコマンドを決定する際には、以下のルールが適用されます:

- `platformHooks` が存在する場合、それが使用され、ライフサイクルイベントのコマンドが処理されます。
  - `os` と `arch` の両方が現在のプラットフォームに一致する場合、検索は停止し、そのコマンドが使用されます。
  - `os` が一致し、`arch` が空の場合、そのコマンドが使用されます。
  - `os` と `arch` の両方が空の場合、そのコマンドが使用されます。
  - 一致するものがない場合、Helm はそのイベントをスキップします。
- `platformHooks` が存在せず、非推奨の `hooks` が存在する場合、ライフサイクルイベントのコマンドが使用されます。
  - コマンドが空の場合、Helm はそのイベントをスキップします。

## プラグインのビルド

最後の release 名を取得するシンプルなプラグインの plugin YAML を以下に示します:

```yaml
name: last
version: 0.1.0
usage: get the last release name
description: get the last release name
ignoreFlags: false
platformCommand:
  - command: ${HELM_BIN}
    args:
      - list
      - --short
      - --max=1
      - --date
      - -r
```

プラグインには追加のスクリプトや実行可能ファイルが必要な場合があります。
スクリプトはプラグインディレクトリに含めることができ、実行可能ファイルはフックを介してダウンロードできます。以下はプラグインの例です:

```console
$HELM_PLUGINS/
  |- myplugin/
    |- scripts/
      |- install.ps1
      |- install.sh
    |- plugin.yaml
```

```yaml
name: myplugin
version: 0.1.0
usage: example plugin
description: example plugin
ignoreFlags: false
platformCommand:
  - command: ${HELM_PLUGIN_DIR}/bin/myplugin
  - os: windows
    command: ${HELM_PLUGIN_DIR}\bin\myplugin.exe
platformHooks:
  install:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
  update:
    - command: ${HELM_PLUGIN_DIR}/scripts/install.sh
      args:
        - -u
    - os: windows
      command: pwsh
      args:
        - -c
        - ${HELM_PLUGIN_DIR}\scripts\install.ps1
        - -Update
```

環境変数はプラグインの実行前に展開されます。上記のパターンは、プラグインの実行ファイルの場所を指定する推奨パターンです。

### プラグインコマンド

プラグインコマンドを扱うためのいくつかの戦略があります:

- プラグインに実行可能ファイルが含まれる場合、`platformCommand:` 用の実行可能ファイルはプラグインディレクトリにパッケージ化するか、フックを介してインストールする必要があります。
- `platformCommand:` または `command:` 行は、実行前に環境変数が展開されます。`$HELM_PLUGIN_DIR` はプラグインディレクトリを指します。
- コマンド自体はシェルで実行されません。したがって、シェルスクリプトを 1 行で記述することはできません。
- Helm は多くの設定を環境変数に注入します。利用可能な情報については環境を確認してください。
- Helm はプラグインの言語について何も仮定しません。好みの言語で記述できます。
- コマンドは `-h` と `--help` 用の特定のヘルプテキストを実装する責任があります。Helm は `helm help` と `helm help myplugin` に対して `usage` と `description` を使用しますが、`helm myplugin --help` は処理しません。

### ローカルプラグインのテスト

まず、`HELM_PLUGINS` パスを見つける必要があります。以下のコマンドを実行してください:

``` bash
helm env
```

カレントディレクトリを `HELM_PLUGINS` が設定されているディレクトリに変更します。

これで、プラグインのビルド出力へのシンボリックリンクを追加できます。この例では `mapkubeapis` の場合を示しています。

``` bash
ln -s ~/GitHub/helm-mapkubeapis ./helm-mapkubeapis
```

## ダウンローダープラグイン

デフォルトでは、Helm は HTTP/S を使用して chart を取得できます。Helm 2.4.0 以降、プラグインは任意のソースから chart をダウンロードする特別な機能を持つことができます。

プラグインは、この特別な機能を `plugin.yaml` ファイル（トップレベル）で宣言します:

```yaml
downloaders:
- command: "bin/mydownloader"
  protocols:
  - "myprotocol"
  - "myprotocols"
```

このようなプラグインがインストールされている場合、Helm は指定されたプロトコルスキームを使用して `command` を呼び出し、リポジトリとやり取りできます。特別なリポジトリは、通常のリポジトリと同様に追加します: `helm repo add favorite myprotocol://example.com/`。特別なリポジトリのルールは通常のリポジトリと同じです: Helm は利用可能な chart のリストを検出してキャッシュするために `index.yaml` ファイルをダウンロードできる必要があります。

定義されたコマンドは次のスキームで呼び出されます: `command certFile keyFile caFile full-URL`。SSL 認証情報は、`$HELM_REPOSITORY_CONFIG`（つまり、`$HELM_CONFIG_HOME/repositories.yaml`）に保存されているリポジトリ定義から取得されます。ダウンローダープラグインは、生のコンテンツを標準出力にダンプし、エラーを標準エラー出力に報告することが期待されます。

ダウンローダーコマンドはサブコマンドや引数もサポートしており、`plugin.yaml` で `bin/mydownloader subcommand -d` のように指定できます。これは、メインプラグインコマンドとダウンローダーコマンドで同じ実行可能ファイルを使用したいが、それぞれに異なるサブコマンドを使用したい場合に便利です。

## 環境変数

Helm がプラグインを実行するとき、外部環境をプラグインに渡し、さらにいくつかの追加環境変数を注入します。

`KUBECONFIG` などの変数は、外部環境で設定されている場合、プラグインに設定されます。

以下の変数は常に設定されることが保証されています:

- `HELM_PLUGINS`: プラグインディレクトリへのパス。
- `HELM_PLUGIN_NAME`: `helm` によって呼び出されたプラグインの名前。`helm myplug` の場合、短縮名は `myplug` になります。
- `HELM_PLUGIN_DIR`: プラグインが格納されているディレクトリ。
- `HELM_BIN`: `helm` コマンドへのパス（ユーザーが実行したもの）。
- `HELM_DEBUG`: helm でデバッグフラグが設定されているかどうかを示します。
- `HELM_REGISTRY_CONFIG`: レジストリ設定の場所（使用している場合）。Helm でのレジストリの使用は実験的な機能です。
- `HELM_REPOSITORY_CACHE`: リポジトリキャッシュファイルへのパス。
- `HELM_REPOSITORY_CONFIG`: リポジトリ設定ファイルへのパス。
- `HELM_NAMESPACE`: `helm` コマンドに指定された namespace（通常は `-n` フラグを使用）。
- `HELM_KUBECONTEXT`: `helm` コマンドに指定された Kubernetes 設定コンテキストの名前。

さらに、Kubernetes 設定ファイルが明示的に指定されている場合、`KUBECONFIG` 変数として設定されます。

## フラグ解析に関する注意

プラグインを実行するとき、Helm は自身が使用するためにグローバルフラグを解析します。これらのフラグはプラグインに渡されません。
- `--burst-limit`: `$HELM_BURST_LIMIT` に変換されます
- `--debug`: これが指定されると、`$HELM_DEBUG` が `1` に設定されます
- `--kube-apiserver`: `$HELM_KUBEAPISERVER` に変換されます
- `--kube-as-group`: `$HELM_KUBEASGROUPS` に変換されます
- `--kube-as-user`: `$HELM_KUBEASUSER` に変換されます
- `--kube-ca-file`: `$HELM_KUBECAFILE` に変換されます
- `--kube-context`: `$HELM_KUBECONTEXT` に変換されます
- `--kube-insecure-skip-tls-verify`: `$HELM_KUBEINSECURE_SKIP_TLS_VERIFY` に変換されます
- `--kube-tls-server-name`: `$HELM_KUBETLS_SERVER_NAME` に変換されます
- `--kube-token`: `$HELM_KUBETOKEN` に変換されます
- `--kubeconfig`: `$KUBECONFIG` に変換されます
- `--namespace` と `-n`: `$HELM_NAMESPACE` に変換されます
- `--qps`: `$HELM_QPS` に変換されます
- `--registry-config`: `$HELM_REGISTRY_CONFIG` に変換されます
- `--repository-cache`: `$HELM_REPOSITORY_CACHE` に変換されます
- `--repository-config`: `$HELM_REPOSITORY_CONFIG` に変換されます

プラグインは `-h` と `--help` に対してヘルプテキストを表示して終了 _すべきです_。その他のすべての場合、プラグインは適切にフラグを使用できます。

## シェル自動補完の提供

Helm 3.2 以降、プラグインは Helm の既存の自動補完メカニズムの一部として、オプションでシェル自動補完をサポートできます。

### 静的自動補完

プラグインが独自のフラグやサブコマンドを提供する場合、プラグインのルートディレクトリに `completion.yaml` ファイルを配置することで、Helm に通知できます。`completion.yaml` ファイルの形式は以下のとおりです:

```yaml
name: <pluginName>
flags:
- <flag 1>
- <flag 2>
validArgs:
- <arg value 1>
- <arg value 2>
commands:
  name: <commandName>
  flags:
  - <flag 1>
  - <flag 2>
  validArgs:
  - <arg value 1>
  - <arg value 2>
  commands:
     <and so on, recursively>
```

注意事項:

1. すべてのセクションはオプションですが、該当する場合は記述してください。
1. フラグには `-` または `--` プレフィックスを含めないでください。
1. 短いフラグと長いフラグの両方を指定できます（また、指定すべきです）。短いフラグは対応する長い形式に関連付ける必要はありませんが、両方の形式をリストする必要があります。
1. フラグは特定の順序で並べる必要はありませんが、ファイルのサブコマンド階層の正しい位置にリストする必要があります。
1. Helm の既存のグローバルフラグは Helm の自動補完メカニズムですでに処理されているため、プラグインは `--debug`、`--namespace` または `-n`、`--kube-context`、`--kubeconfig`、およびその他のグローバルフラグを指定する必要はありません。
1. `validArgs` リストは、サブコマンドの後に続く最初のパラメータに対して可能な補完の静的リストを提供します。このようなリストを事前に提供できない場合もあります（以下の[動的補完](#動的補完)セクションを参照）。その場合、`validArgs` セクションは省略できます。

`completion.yaml` ファイルは完全にオプションです。提供されていない場合、Helm はプラグインに対してシェル自動補完を提供しません（プラグインが[動的補完](#動的補完)をサポートしている場合を除く）。また、`completion.yaml` ファイルを追加しても後方互換性があり、古いバージョンの Helm を使用している場合でもプラグインの動作に影響しません。

例として、[`fullstatus` プラグイン](https://github.com/marckhouzam/helm-fullstatus)はサブコマンドを持ちませんが、`helm status` コマンドと同じフラグを受け入れます。その `completion.yaml` ファイルは以下のとおりです:

```yaml
name: fullstatus
flags:
- o
- output
- revision
```

より複雑な例として、[`2to3` プラグイン](https://github.com/helm/helm-2to3)の `completion.yaml` ファイルは以下のとおりです:

```yaml
name: 2to3
commands:
- name: cleanup
  flags:
  - config-cleanup
  - dry-run
  - l
  - label
  - release-cleanup
  - s
  - release-storage
  - tiller-cleanup
  - t
  - tiller-ns
  - tiller-out-cluster
- name: convert
  flags:
  - delete-v2-releases
  - dry-run
  - l
  - label
  - s
  - release-storage
  - release-versions-max
  - t
  - tiller-ns
  - tiller-out-cluster
- name: move
  commands:
  - name: config
    flags:
    - dry-run
```

### 動的補完

Helm 3.2 以降、プラグインは独自の動的シェル自動補完を提供できます。動的シェル自動補完は、事前に定義できないパラメータ値やフラグ値の補完です。たとえば、クラスター上で現在利用可能な Helm release 名の補完などです。

プラグインが動的自動補完をサポートするには、ルートディレクトリに `plugin.complete` という**実行可能**ファイルを提供する必要があります。Helm の補完スクリプトがプラグインに対して動的補完を必要とする場合、`plugin.complete` ファイルを実行し、補完が必要なコマンドラインを渡します。`plugin.complete` 実行可能ファイルは、適切な補完候補を決定し、Helm の補完スクリプトが使用するために標準出力に出力するロジックを持つ必要があります。

`plugin.complete` ファイルは完全にオプションです。提供されていない場合、Helm はプラグインに対して動的自動補完を提供しません。また、`plugin.complete` ファイルを追加しても後方互換性があり、古いバージョンの Helm を使用している場合でもプラグインの動作に影響しません。

`plugin.complete` スクリプトの出力は、以下のような改行区切りのリストである必要があります:

```console
rel1
rel2
rel3
```

`plugin.complete` が呼び出されると、プラグインのメインスクリプトが呼び出されるときと同様にプラグイン環境が設定されます。したがって、`$HELM_NAMESPACE`、`$HELM_KUBECONTEXT`、およびその他すべてのプラグイン変数はすでに設定されており、対応するグローバルフラグは削除されています。

`plugin.complete` ファイルは任意の実行可能形式にできます。シェルスクリプト、Go プログラム、または Helm が実行できるその他の種類のプログラムにできます。`plugin.complete` ファイルは、ユーザーに対する実行権限を持って ***いなければなりません***。`plugin.complete` ファイルは成功コード（値 0）で終了 ***しなければなりません***。

場合によっては、動的補完で Kubernetes クラスターから情報を取得する必要があります。たとえば、`helm fullstatus` プラグインは入力として release 名を必要とします。`fullstatus` プラグインでは、`plugin.complete` スクリプトが現在の release 名の補完を提供するために、単純に `helm list -q` を実行して結果を出力できます。

プラグインの実行とプラグインの補完に同じ実行可能ファイルを使用したい場合、`plugin.complete` スクリプトは特別なパラメータやフラグを付けてメインプラグイン実行可能ファイルを呼び出すことができます。メインプラグイン実行可能ファイルが特別なパラメータやフラグを検出すると、補完を実行することがわかります。この例では、`plugin.complete` を以下のように実装できます:

```sh
#!/usr/bin/env sh

# "$@" is the entire command-line that requires completion.
# It is important to double-quote the "$@" variable to preserve a possibly empty last parameter.
$HELM_PLUGIN_DIR/status.sh --complete "$@"
```

`fullstatus` プラグインの実際のスクリプト（`status.sh`）は `--complete` フラグを探し、見つかった場合は適切な補完を出力する必要があります。

### ヒントとコツ

1. シェルはユーザー入力に一致しない補完候補を自動的にフィルタリングします。したがって、プラグインはユーザー入力に一致しないものを削除せずに、関連するすべての補完を返すことができます。たとえば、コマンドラインが `helm fullstatus ngin<TAB>` の場合、`plugin.complete` スクリプトは（`default` namespace の）*すべての* release 名を出力できます。`ngin` で始まるものだけではありません。シェルは `ngin` で始まるものだけを残します。
1. 動的補完サポートを簡素化するために、特に複雑なプラグインの場合、`plugin.complete` スクリプトでメインプラグインスクリプトを呼び出して補完候補を要求できます。上記の[動的補完](#動的補完)セクションの例を参照してください。
1. 動的補完と `plugin.complete` ファイルをデバッグするには、以下を実行して補完結果を確認できます:
    - `helm __complete <pluginName> <arguments to complete>`。例:
    - `helm __complete fullstatus --output js<ENTER>`
    - `helm __complete fullstatus -o json ""<ENTER>`
