---
title: 組み込みオブジェクト
description: テンプレートで利用可能な組み込みオブジェクトについて説明します。
sidebar_position: 3
---

オブジェクトはテンプレートエンジンからテンプレートに渡されます。コード内でオブジェクトを受け渡すこともできます（`with` 文や `range` 文で例を見ていきます）。また、`tuple` 関数など、テンプレート内で新しいオブジェクトを作成する方法もいくつかあります。

オブジェクトは単純なもので、単一の値だけを持つこともあります。あるいは、他のオブジェクトや関数を含むこともできます。たとえば、`Release` オブジェクトは複数のオブジェクト（`Release.Name` など）を含み、`Files` オブジェクトはいくつかの関数を持っています。

前のセクションでは、`{{ .Release.Name }}` を使用して release 名をテンプレートに挿入しました。`Release` は、テンプレート内でアクセスできるトップレベルオブジェクトの一つです。

- `Release`: release 自体を表すオブジェクトです。内部にいくつかのオブジェクトを持っています:
  - `Release.Name`: release 名
  - `Release.Namespace`: release 先の namespace（マニフェストで上書きされない場合）
  - `Release.IsUpgrade`: 現在の操作がアップグレードまたはロールバックの場合、`true` に設定されます。
  - `Release.IsInstall`: 現在の操作がインストールの場合、`true` に設定されます。
  - `Release.Revision`: この release のリビジョン番号。インストール時は 1 で、アップグレードやロールバックごとに増加します。
  - `Release.Service`: 現在のテンプレートをレンダリングしているサービス。Helm では常に `Helm` です。
- `Values`: `values.yaml` ファイルおよびユーザー指定のファイルからテンプレートに渡される値。デフォルトでは `Values` は空です。
- `Chart`: `Chart.yaml` ファイルの内容。`Chart.yaml` 内のすべてのデータにアクセスできます。たとえば、`{{ .Chart.Name }}-{{ .Chart.Version }}` は `mychart-0.1.0` のように出力されます。
  - 利用可能なフィールドの一覧は [Chart ガイド](/topics/charts.md#the-chartyaml-file) を参照してください。
- `Subcharts`: サブチャートのスコープ（.Values、.Charts、.Releases など）に親 chart からアクセスできます。たとえば、`.Subcharts.mySubChart.myValue` で `mySubChart` chart 内の `myValue` にアクセスできます。
- `Files`: chart 内の特殊ファイル以外のすべてのファイルにアクセスできます。テンプレートへのアクセスには使用できませんが、chart 内の他のファイルにアクセスするために使用できます。詳細は[ファイルへのアクセス](/chart_template_guide/accessing_files.md)のセクションを参照してください。
  - `Files.Get` は名前でファイルを取得する関数です（`.Files.Get config.ini`）。
  - `Files.GetBytes` はファイルの内容を文字列ではなくバイト配列として取得する関数です。画像などに便利です。
  - `Files.Glob` は指定したシェルの glob パターンに一致する名前のファイルリストを返す関数です。
  - `Files.Lines` はファイルを1行ずつ読み込む関数です。ファイル内の各行を反復処理するのに便利です。
  - `Files.AsSecrets` はファイルの内容を Base 64 エンコードされた文字列として返す関数です。
  - `Files.AsConfig` はファイルの内容を YAML マップとして返す関数です。
- `Capabilities`: Kubernetes クラスターがサポートする機能に関する情報を提供します。
  - `Capabilities.APIVersions` はバージョンのセットです。
  - `Capabilities.APIVersions.Has $version` は、バージョン（例: `batch/v1`）またはリソース（例: `apps/v1/Deployment`）がクラスターで利用可能かどうかを示します。
  - `Capabilities.KubeVersion` と `Capabilities.KubeVersion.Version` は Kubernetes のバージョンです。
  - `Capabilities.KubeVersion.Major` は Kubernetes のメジャーバージョンです。
  - `Capabilities.KubeVersion.Minor` は Kubernetes のマイナーバージョンです。
  - `Capabilities.HelmVersion` は Helm のバージョン詳細を含むオブジェクトで、`helm version` の出力と同じです。
  - `Capabilities.HelmVersion.Version` は semver 形式の現在の Helm バージョンです。
  - `Capabilities.HelmVersion.GitCommit` は Helm の git sha1 です。
  - `Capabilities.HelmVersion.GitTreeState` は Helm の git ツリーの状態です。
  - `Capabilities.HelmVersion.GoVersion` は使用されている Go コンパイラのバージョンです。
- `Template`: 現在実行中のテンプレートに関する情報を含みます。
  - `Template.Name`: 現在のテンプレートへの namespace を含むファイルパス（例: `mychart/templates/mytemplate.yaml`）
  - `Template.BasePath`: 現在の chart の templates ディレクトリへの namespace を含むパス（例: `mychart/templates`）。

組み込み値は常に大文字で始まります。これは Go の命名規則に従っています。独自の名前を作成する場合は、チームに合った規則を自由に使用できます。[Artifact Hub](https://artifacthub.io/packages/search?kind=0) で見られる多くの chart を作成しているチームのように、一部のチームでは、組み込みの名前とローカルの名前を区別するために、小文字で始めることを選択しています。このガイドでは、その規則に従います。
