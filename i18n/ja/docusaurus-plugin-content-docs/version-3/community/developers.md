---
title: "開発者ガイド"
description: "Helmを開発するための環境をセットアップする方法を説明します。"
weight: 1
---

このガイドでは、Helmで開発するための環境をセットアップする方法について説明します。

## 必要な環境

- Goの最新バージョン
- kubectlおよびKubernetesクラスター (optional)
- Git

## Helmをビルドする

Makeを使用してプログラムを構築します。最も簡単な方法は次のとおりです:

```console
$ make
```

注意: `$GOPATH/src/helm.sh/helm` のパスにて実行されていない場合、このコマンドは失敗します。 また、`build`
が関連するパッケージが見つけられないため、`helm.sh`ディレクトリをシンボリックリンクにしてはいけません。

このコマンドは必要に応じて依存関係をインストールし、`vendor/`ツリーを再ビルドしたのち、configurationを検証します。 その後に`helm`をコンパイルして`bin/helm`に配置します。

Helmをローカルで実行するには、`bin/helm`を実行してください。

- Helmは、macOSおよびAlpineを含んだほとんどのLinuxディストリビューションで動作することが知られています。

## テストの実行

すべてのテスト(`vendor/`のテストを除く)を実行するには、`make test`を実行してください。 前提条件として、[golangci-lint](https://golangci-lint.run)
をインストールする必要があります 。

## コントリビューションガイドライン

私たちはコントリビューションを歓迎します。 このプロジェクトは、（a)
コードの品質を高く保ち（b）プロジェクトの一貫性を保ち（c）コントリビューションがオープンソースの法的要件に従うことを保証するため、いくつかのガイドラインを設定しました。
私たちの目的はコントリビューターに負担をかけることではなく、ユーザーが利益を得ることができるようにエレガントで高品質なオープンソースコードを構築することです。

CONTRIBUTINGガイドを読み、理解していることを確認してください。

https://github.com/helm/helm/blob/main/CONTRIBUTING.md

### コードの構造

Helmプロジェクトのコードは、以下のように構成されています。

- 個々のプログラムは`cmd/`にあります。`cmd/`内のコードはライブラリ再利用を目的として設計されていません。
- 共有ライブラリは`pkg/`にあります。
- `scripts/`ディレクトリには多数のユーティリティスクリプトがあります。これらのほとんどはCI/CDパイプラインによって使用されます。

Goの依存関係管理は流動的であり、Helmのライフサイクルの過程で変更される可能性があります。 依存関係を手動で管理 _しない_ ことをお勧めします。 その代わりに、プロジェクトの`Makefile`に依存して管理を行うことをお勧めします。
Helm 3では、Goバージョン1.13以降を使用することをお勧めします。

### ドキュメントの作成

Helm 3以降、ドキュメントは独自のリポジトリに移動されました。 新しい機能を作成する場合は付属のドキュメントを作成して、[helm-www](https://github.com/helm/helm-www)にsubmitしてください。

例外: [Helm CLI output (英語)](https://helm.sh/docs/helm/) は `helm` のバイナリ自体から生成されます。
このoutputを生成する方法については[Updating the Helm CLI Reference Docs](https://github.com/helm/helm-www#updating-the-helm-cli-reference-docs)
をご覧ください。 翻訳された場合、CLI出力は生成されず`/content/<lang>/docs/helm`に生成されます。

### Git 規約

バージョン管理システムにはGitを使用しています。
`main`ブランチは現在の開発候補の中心です。 リリースにはタグが付けられます。

GitHubのPull Requests（PRs）を介してコードの変更を受け付けています。 これを行うためのワークフローの一例は次のとおりです。

1. `$GOPATH/src` に移動して `mkdir helm.sh; cd helm.sh` を実行し、 `github.com/helm/helm`
   のリポジトリを`git clone` します。
2. リポジトリをあなたのGitHubアカウントにフォークします
3. あなたのリポジトリを`$GOPATH/src/helm.sh/helm`のリモートとして追加します。
4. 新しい作業ブランチ (`git checkout -b feat/my-feature`) 作成し、そのブランチで作業を行います。
5. レビューの準備ができましたら、あなたのブランチをGitHubにプッシュして新しいプルリクエストを開いてください。

Git commit messagesに関しては[Semantic Commit Messages](https://karma-runner.github.io/0.13/dev/git-commit-msg.html)
に従います
:

```
fix(helm): add --foo flag to 'helm install'

When 'helm install --foo bar' is run, this will print "foo" in the
output regardless of the outcome of the installation.

Closes #1234
```

一般的なコミットタイプ:

- fix: バグまたはエラーを修正
- feat: 新機能を追加
- docs: ドキュメントを変更
- test: テストを改善する
- ref: 既存のコードのリファクタリング

一般的なスコープ:

- helm: The Helm CLI
- pkg/lint: lintパッケージ。どのパッケージでも同様の規則に従ってください
- `*`: 2つ以上のスコープ

さらに読む:

- [Deis Guidelines](https://github.com/deis/workflow/blob/master/src/contributing/submitting-a-pull-request.md)
  がこのセクションのインスピレーションになりました。
- Karma Runner はthe semantic commit messageの考えを [定義しています](https://karma-runner.github.io/0.13/dev/git-commit-msg.html)。

### Go 規約

Go coding style standardsに厳密に従っています。だいたいの場合`go fmt`を実行すればコードが美しくなります。

また、`go lint`および`gometalinter`によって推奨される規則に従います。
`make test-style`を実行してスタイルの適合性をテストしてください。

さらに読む:

- Effective Go では[formattingを導入しています](https://golang.org/doc/effective_go.html#formatting).
- The Go Wiki には
  [formatting](https://github.com/golang/go/wiki/CodeReviewComments)に関して素晴らしい記事があります。

`make test`ターゲットを実行すると、単体テストが実行されるだけでなく、スタイルテストも実行されます。
`make test`ターゲットが失敗する場合は、それが文体に起因するものであったとしても、あなたのPRがマージに向けた準備ができていないと判断されます。
