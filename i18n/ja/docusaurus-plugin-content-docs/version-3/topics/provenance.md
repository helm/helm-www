---
title: Helm の来歴と完全性
description: chart の完全性と出所を検証する方法について説明します。
sidebar_position: 5
---

Helm は、chart ユーザーがパッケージの完全性と出所を検証するための来歴検証ツールを備えています。PKI、GnuPG、および定評のあるパッケージマネージャーに基づいた業界標準のツールを使用して、署名ファイルの生成と検証を行えます。

## 概要

完全性は、chart と来歴レコードを比較することで確立されます。来歴レコードは _来歴ファイル_ に保存され、パッケージ化された chart と一緒に保存されます。たとえば、chart の名前が `myapp-1.2.3.tgz` の場合、その来歴ファイルは `myapp-1.2.3.tgz.prov` になります。

来歴ファイルはパッケージング時に生成され（`helm package --sign ...`）、複数のコマンド（特に `helm install --verify`）で検証できます。

## ワークフロー

このセクションでは、来歴データを効果的に使用するための一般的なワークフローについて説明します。

前提条件:

- バイナリ形式（ASCII-armored 形式ではない）の有効な PGP 鍵ペア
- `helm` コマンドラインツール
- GnuPG コマンドラインツール（オプション）
- Keybase コマンドラインツール（オプション）

**注意:** PGP 秘密鍵にパスフレーズが設定されている場合、`--sign` オプションをサポートするコマンドを実行するときにパスフレーズの入力を求められます。

新しい chart の作成方法は従来と同じです:

```console
$ helm create mychart
Creating mychart
```

パッケージ化の準備ができたら、`helm package` に `--sign` フラグを追加します。また、署名鍵の名前と、対応する秘密鍵を含むキーリングを指定します:

```console
$ helm package --sign --key 'John Smith' --keyring path/to/keyring.secret mychart
```

**注意:** `--key` 引数の値は、目的の鍵の `uid`（`gpg --list-keys` の出力に表示される）の部分文字列である必要があります。たとえば、名前やメールアドレスです。**フィンガープリントは使用できません。**

**TIP:** GnuPG ユーザーの場合、秘密キーリングは `~/.gnupg/secring.gpg` にあります。`gpg --list-secret-keys` を使用して、利用可能な鍵の一覧を表示できます。

**警告:** GnuPG v2 では、秘密キーリングがデフォルトの場所 `~/.gnupg/pubring.kbx` に新しい `kbx` 形式で保存されます。次のコマンドを使用して、キーリングを従来の gpg 形式に変換してください:

```console
$ gpg --export >~/.gnupg/pubring.gpg
$ gpg --export-secret-keys >~/.gnupg/secring.gpg
```

この時点で、`mychart-0.1.0.tgz` と `mychart-0.1.0.tgz.prov` の両方のファイルが作成されているはずです。両方のファイルを最終的に目的の chart リポジトリにアップロードします。

`helm verify` を使用して chart を検証できます:

```console
$ helm verify mychart-0.1.0.tgz
```

検証に失敗すると、次のようになります:

```console
$ helm verify topchart-0.1.0.tgz
Error: sha256 sum does not match for topchart-0.1.0.tgz: "sha256:1939fbf7c1023d2f6b865d137bbb600e0c42061c3235528b1e8c82f4450c12a7" != "sha256:5a391a90de56778dd3274e47d789a2c84e0e106e1a37ef8cfa51fd60ac9e623a"
```

インストール時に検証するには、`--verify` フラグを使用します。

```console
$ helm install --generate-name --verify mychart-0.1.0.tgz
```

署名済み chart に関連付けられた公開鍵を含むキーリングがデフォルトの場所にない場合は、`helm package` の例と同様に `--keyring PATH` でキーリングを指定する必要があります。

検証に失敗すると、chart がレンダリングされる前にインストールが中止されます。

### Keybase.io 認証情報の使用

[Keybase.io](https://keybase.io) サービスを使用すると、暗号化 ID の信頼チェーンを簡単に確立できます。Keybase の認証情報を使用して chart に署名できます。

前提条件:

- 設定済みの Keybase.io アカウント
- ローカルにインストールされた GnuPG
- ローカルにインストールされた `keybase` CLI

#### パッケージへの署名

最初のステップは、Keybase の鍵をローカルの GnuPG キーリングにインポートすることです:

```console
$ keybase pgp export -s | gpg --import
```

このコマンドは、Keybase の鍵を OpenPGP 形式に変換し、ローカルの `~/.gnupg/secring.gpg` ファイルにインポートします。

`gpg --list-secret-keys` を実行して確認できます。

```console
$ gpg --list-secret-keys
/Users/mattbutcher/.gnupg/secring.gpg
-------------------------------------
sec   2048R/1FC18762 2016-07-25
uid                  technosophos (keybase.io/technosophos) <technosophos@keybase.io>
ssb   2048R/D125E546 2016-07-25
```

秘密鍵には次のような識別子文字列があります:

```
technosophos (keybase.io/technosophos) <technosophos@keybase.io>
```

これが鍵のフルネームです。

次に、`helm package` を使用して chart をパッケージ化し、署名できます。`--key` には、この名前文字列の少なくとも一部を使用してください。

```console
$ helm package --sign --key technosophos --keyring ~/.gnupg/secring.gpg mychart
```

その結果、`package` コマンドは `.tgz` ファイルと `.tgz.prov` ファイルの両方を生成します。

#### パッケージの検証

同様の手順で、他のユーザーの Keybase 鍵で署名された chart を検証することもできます。たとえば、`keybase.io/technosophos` によって署名されたパッケージを検証する場合は、`keybase` ツールを使用します:

```console
$ keybase follow technosophos
$ keybase pgp pull
```

上記の最初のコマンドは、ユーザー `technosophos` をフォローします。次に `keybase pgp pull` を実行すると、フォローしているすべてのアカウントの OpenPGP 鍵がダウンロードされ、GnuPG キーリング（`~/.gnupg/pubring.gpg`）に配置されます。

この時点で、`helm verify` または `--verify` フラグを持つコマンドを使用できるようになります:

```console
$ helm verify somechart-1.2.3.tgz
```

### chart が検証できない理由

検証が失敗する一般的な理由を以下に示します。

- `.prov` ファイルが見つからないか、破損しています。これは、何かが正しく設定されていないか、元のメンテナが来歴ファイルを作成しなかったことを示します。
- ファイルの署名に使用された鍵がキーリングにありません。これは、chart に署名したエンティティが、信頼すると表明した相手ではないことを示します。
- `.prov` ファイルの検証に失敗しました。これは、chart または来歴データに問題があることを示します。
- 来歴ファイル内のファイルハッシュがアーカイブファイルのハッシュと一致しません。これは、アーカイブが改ざんされたことを示します。

検証に失敗した場合は、そのパッケージを信頼しない理由があります。

## 来歴ファイル

来歴ファイルには、chart の YAML ファイルといくつかの検証情報が含まれています。来歴ファイルは自動的に生成されるように設計されています。

以下の来歴データが追加されます:

* chart ファイル（`Chart.yaml`）が含まれており、人間とツールの両方が chart の内容を簡単に確認できます。
* chart パッケージ（`.tgz` ファイル）の署名（Docker と同様の SHA256）が含まれており、chart パッケージの完全性を検証するために使用できます。
* 本文全体が OpenPGP で使用されるアルゴリズムで署名されています（暗号署名と検証を簡単にする新しい方法については [Keybase.io](https://keybase.io) を参照してください）。

これらの組み合わせにより、ユーザーは以下のことを保証されます:

* パッケージ自体が改ざんされていないこと（パッケージ `.tgz` のチェックサム）。
* このパッケージをリリースしたエンティティが既知であること（GnuPG/PGP 署名による）。

ファイルの形式は次のようになります:

```
Hash: SHA512

apiVersion: v2
appVersion: "1.16.0"
description: Sample chart
name: mychart
type: application
version: 0.1.0

...
files:
  mychart-0.1.0.tgz: sha256:d31d2f08b885ec696c37c7f7ef106709aaf5e8575b6d3dc5d52112ed29a9cb92
-----BEGIN PGP SIGNATURE-----

wsBcBAEBCgAQBQJdy0ReCRCEO7+YH8GHYgAAfhUIADx3pHHLLINv0MFkiEYpX/Kd
nvHFBNps7hXqSocsg0a9Fi1LRAc3OpVh3knjPfHNGOy8+xOdhbqpdnB+5ty8YopI
mYMWp6cP/Mwpkt7/gP1ecWFMevicbaFH5AmJCBihBaKJE4R1IX49/wTIaLKiWkv2
cR64bmZruQPSW83UTNULtdD7kuTZXeAdTMjAK0NECsCz9/eK5AFggP4CDf7r2zNi
hZsNrzloIlBZlGGns6mUOTO42J/+JojnOLIhI3Psd0HBD2bTlsm/rSfty4yZUs7D
qtgooNdohoyGSzR5oapd7fEvauRQswJxOA0m0V+u9/eyLR0+JcYB8Udi1prnWf8=
=aHfz
-----END PGP SIGNATURE-----
```

YAML セクションには 2 つのドキュメントが含まれています（`...\n` で区切られています）。最初のファイルは `Chart.yaml` の内容です。2 番目はチェックサムで、パッケージング時のファイル名とそのファイル内容の SHA-256 ダイジェストのマップです。

署名ブロックは標準の PGP 署名であり、[改ざん耐性](https://www.rossde.com/PGP/pgp_signatures.html)を提供します。

## Chart リポジトリ

Chart リポジトリは、Helm chart の集約された集合として機能します。

Chart リポジトリは、特定のリクエストを介して HTTP 経由で来歴ファイルを提供できる必要があり、chart と同じ URI パスで利用可能にする必要があります。

たとえば、パッケージのベース URL が `https://example.com/charts/mychart-1.2.3.tgz` の場合、来歴ファイルが存在する場合は `https://example.com/charts/mychart-1.2.3.tgz.prov` でアクセスできる必要があります。

エンドユーザーの観点から、`helm install --verify myrepo/mychart-1.2.3` を実行すると、追加のユーザー設定やアクションなしに chart と来歴ファイルの両方がダウンロードされます。

### OCI ベースのレジストリでの署名

chart を [OCI ベースのレジストリ](/topics/registries.md)に公開する場合、[`helm-sigstore` プラグイン](https://github.com/sigstore/helm-sigstore/)を使用して来歴を [sigstore](https://sigstore.dev/) に公開できます。[ドキュメントに記載されているとおり](https://github.com/sigstore/helm-sigstore/blob/main/USAGE.md)、来歴の作成と GPG 鍵による署名のプロセスは一般的ですが、`helm sigstore upload` コマンドを使用して来歴を不変の透明性ログに公開できます。

## 権威と真正性の確立

信頼チェーンシステムを扱う場合、署名者の権威を確立できることが重要です。言い換えれば、上記のシステムは、chart に署名した人を信頼するという事実に基づいています。つまり、署名者の公開鍵を信頼する必要があります。

Helm の設計上の決定の 1 つとして、Helm プロジェクトは信頼チェーンに必須の当事者として介入しないことにしました。すべての chart 署名者の「認証局」にはなりたくありません。代わりに、分散型モデルを強く支持しており、これが OpenPGP を基盤技術として選択した理由の一部です。そのため、権威の確立に関しては、Helm 2 ではこのステップをほぼ未定義のままにしています（この決定は Helm 3 にも引き継がれています）。

ただし、来歴システムの使用に興味がある方のために、いくつかのヒントと推奨事項を示します:

- [Keybase](https://keybase.io) プラットフォームは、信頼情報の公開集中リポジトリを提供します。
  - Keybase を使用して鍵を保存したり、他のユーザーの公開鍵を取得したりできます。
  - Keybase には充実したドキュメントも用意されています。
  - 検証していませんが、Keybase の「セキュアウェブサイト」機能を使用して Helm chart を配布できる可能性があります。
  - 基本的な考え方は、公式の「chart レビュアー」が自分の鍵で chart に署名し、その来歴ファイルを chart リポジトリにアップロードするというものです。
  - リポジトリの `index.yaml` ファイルに有効な署名鍵のリストを含めるというアイデアについて、検討が進められています。
