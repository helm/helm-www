---
title: "用語集" 
description: "Helm のアーキテクチャのコンポーネントを説明するために使用される用語。"
weight: 9
---

# 用語集

## チャート

Kubernetes リソースのセットを Kubernetes クラスターにインストールするのに
十分な情報が含まれている Helm パッケージ。

チャートには、`Chart.yaml` ファイル、テンプレート、デフォルト値 (`values.yaml`)、
依存関係が含まれています。

チャートは明確に定義されたディレクトリ構造で開発され、
_Chart アーカイブ_ と呼ばれるアーカイブ形式にパッケージ化されます。

## Chart アーカイブ

_Chart アーカイブ_ は、tar 形式で gzip 圧縮された (オプションで署名された) チャートです。

## チャートの依存関係 (サブチャート)

チャートは他のチャートに依存する場合があります。依存関係が発生する方法は2つあります。

- ソフトな依存関係: 別のチャートがクラスターにインストールされていないと、チャートが機能しない可能性があります。
  Helm はこの場合のツールを提供していません。
  この場合、依存関係は個別に管理できます。
- ハードな依存関係: チャートには、(`charts/` ディレクトリ内に) 依存する別のチャートが含まれる場合があります。
  この場合、チャートをインストールすると、
  その依存関係がすべてインストールされます。
  この場合、チャートとその依存関係はコレクションとして管理されます。

チャートが (`helm package` を介して) パッケージ化されると、
そのすべてのハードな依存関係がチャートにバンドルされます。

## チャートのバージョン

チャートは、[SemVer 2 仕様](https://semver.org) に従ってバージョン管理されています。
すべてのチャートにバージョン番号が必要です。

## Chart.yaml

チャートに関する情報は、`Chart.yaml` と呼ばれる特別なファイルに保存されます。
すべてのチャートにこのファイルが必要です。

## Helm (と helm)

Helm は Kubernetes のパッケージマネージャーです。
オペレーティングシステムのパッケージマネージャーを使用すると、OS にツールを簡単にインストールできます。
Helm を使用すると、アプリケーションやリソースを Kubernetes クラスターに簡単にインストールできます。

_Helm_ はプロジェクトの名前ですが、コマンドラインクライアントの名前も `helm` です。
慣例により、プロジェクトについて言うとき、_Helm_ は大文字です。
クライアントの場合、_helm_ は小文字です。

## Helm 設定ファイル (XDG)

Helm は構成ファイルを XDG ディレクトリに保存します。
これらのディレクトリは、`helm` が初めて実行されたときに作成されます。

## Kube Config (KUBECONFIG)

Helm クライアントは、_Kube config_ ファイル形式のファイルを使用して、
Kubernetes クラスターについて学習します。
デフォルトでは、Helm はこのファイルを `kubectl` が作成した場所 (`$HOME/.kube/config`) で見つけようとします。

## Lint (Linting)

チャートを _lint_ するには、それが Helm チャート標準の規則と要件に従っていることを検証します。
Helm はこれを行うためのツール、
特に `helm lint` コマンドを提供します。

## Provenance (Provenance ファイル)

Helm チャートには、チャートの出所とその内容に関する情報を提供する
_Provenance ファイル_ が添付されている場合があります。

Provenance ファイルは、Helm のセキュリティストーリーの一部です。
Provenance には、Chart アーカイブファイルの暗号化ハッシュ、Chart.yaml データ、
および署名ブロック (OpenPGP "clearsign" ブロック) が含まれています。
キーチェーンと組み合わせると、チャートユーザーは次のことができるようになります。

- チャートが信頼できる当事者によって署名されたことを検証する
- チャートのファイルが改ざんされていないことを検証する
- チャートのメタデータ (`Chart.yaml`) の内容を検証する
- チャートをその Provenance データにすばやく一致させる

Provenance ファイルには `.prov` 拡張子が付いており、
チャートリポジトリサーバーまたはその他の HTTP サーバーから提供できます。

## リリース

チャートがインストールされると、
Helm ライブラリはそのインストールを追跡するための _リリース_ を作成します。

1 つのチャートを同じクラスターに何度もインストールして、さまざまなリリースを作成できます。
たとえば、`helm install` を異なるリリース名で 3 回実行することで、
3 つの PostgreSQL データベースをインストールできます。

## リリース番号 (リリースバージョン)

A single release can be updated multiple times. A sequential counter is used to
track releases as they change. After a first `helm install`, a release will have
_release number_ 1. Each time a release is upgraded or rolled back, the release
number will be incremented.

## Rollback

A release can be upgraded to a newer chart or configuration. But since release
history is stored, a release can also be _rolled back_ to a previous release
number. This is done with the `helm rollback` command.

Importantly, a rolled back release will receive a new release number.

| Operation  | Release Number                                       |
|------------|------------------------------------------------------|
| install    | release 1                                            |
| upgrade    | release 2                                            |
| upgrade    | release 3                                            |
| rollback 1 | release 4 (but running the same config as release 1) |

The above table illustrates how release numbers increment across install,
upgrade, and rollback.

## Helm Library (or SDK)

The Helm Library (or SDK) refers to the Go code that interacts directly with the
Kubernetes API server to install, upgrade, query, and remove Kubernetes
resources. It can be imported into a project to use Helm as a client library
instead of a CLI.

## Repository (Repo, Chart Repository)

Helm charts may be stored on dedicated HTTP servers called _chart repositories_
(_repositories_, or just _repos_).

A chart repository server is a simple HTTP server that can serve an `index.yaml`
file that describes a batch of charts, and provides information on where each
chart can be downloaded from. (Many chart repositories serve the charts as well
as the `index.yaml` file.)

A Helm client can point to zero or more chart repositories. By default, Helm
clients are not configured with any chart repositories. Chart repositories can
be added at any time using the `helm repo add` command.

## Values (Values Files, values.yaml)

Values provide a way to override template defaults with your own information.

Helm Charts are "parameterized", which means the chart developer may expose
configuration that can be overridden at installation time. For example, a chart
may expose a `username` field that allows setting a user name for a service.

These exposed variables are called _values_ in Helm parlance.

Values can be set during `helm install` and `helm upgrade` operations, either by
passing them in directly, or by using a `values.yaml` file.
