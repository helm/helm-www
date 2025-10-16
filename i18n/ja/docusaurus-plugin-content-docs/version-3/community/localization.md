---
title: "Helm ドキュメントの国際化"
description: "Helm ドキュメントを国際化するための手順。"
weight: 5
---

このガイドでは Helm ドキュメントをどのように国際化するかを説明します。

## はじめに

翻訳への貢献にはドキュメントへの貢献と同様のプロセスを用います。翻訳は [helm-www](https://github.com/helm/helm-www) git リポジトリへの[プルリクエスト](https://help.github.com/ja/github/collaborating-with-issues-and-pull-requests/about-pull-requests)によって供給され、プルリクエストはウェブサイトの管理チームによってレビューされます。

### 2文字言語コード

ドキュメントは [ISO 639-1
標準](https://www.loc.gov/standards/iso639-2/php/code_list.php) 言語コードによって管理されます。例えば、韓国語の2文字コードは `ko` です。

コンテンツや設定でこの言語コードが使われます。3つ例を示します。

- `content` ディレクトリ内で言語コードがサブディレクトリとして存在し、国際化されたコンテンツがそれぞれのディレクトリに入っています。
- `i18n` ディレクトリはそれぞれの言語について、ウェブサイトで使用されるフレーズについての設定ファイルを保有しています。それらのファイルは `[LANG]` がその言語の2文字コードとなるような `[LANG].toml` というパターンで命名されています。
- トップレベルの `config.toml` ファイルではナビゲーションやその他の詳細が言語コードごとに管理されています。

言語コード `en` を持つ英語が、デフォルトの言語および翻訳元として用いられます。

### フォーク、ブランチ、変更、プルリクエスト

翻訳に貢献するために、まずは Github の [helm-www リポジトリ](https://github.com/helm/helm-www)の[フォークを作る](https://help.github.com/ja/github/getting-started-with-github/fork-a-repo)ことから始めましょう。あなたはまずあなたのフォークに変更をコミットすることから始めるでしょう。

初期状態であなたのフォークは `main` として知られるデフォルトブランチに設定されているでしょう。あなたの変更を開発するあるいはプルリクエストを作成するためにブランチを使用してください。もしブランチについて不慣れなら[それらについて Github ドキュメントで読む](https://help.github.com/ja/github/collaborating-with-issues-and-pull-requests/about-branches)ことができます。

ブランチを作成出来たら、翻訳を追加したり、コンテンツを国際化したりしましょう。

注：helm は [Developers Certificate of
Origin](https://developercertificate.org/) を利用しています。すべてのコミットは署名されている必要があります。コミットを作成する際に `-s` か `--signoff` フラグを用いることで、あなたの Git に設定されている名前とメールアドレスを用いてコミットに署名することができます。詳細については [CONTRIBUTING.md](https://github.com/helm/helm-www/blob/main/CONTRIBUTING.md#sign-your-work) をご覧ください。

準備ができたら、[プルリクエスト](https://help.github.com/ja/github/collaborating-with-issues-and-pull-requests/about-pull-requests) を作成し、helm-www リポジトリに反映しましょう。

作成されたプルリクエストは管理者によってレビューされます。その過程についての詳細は [CONTRIBUTING.md](https://github.com/helm/helm-www/blob/main/CONTRIBUTING.md) を参照してください。

## コンテンツの翻訳

全ての Helm コンテンツを国際化するのは大きな仕事です。小さなことから初めて大丈夫です。時間をかけて翻訳を拡大することができます。

### 新たな言語を開始する

新たな言語を開始するには以下の最低要件が必要です。

- `_index.md` ファイルを含む `content/[LANG]/docs` ディレクトリを追加する。これはドキュメントランディングページの最上位です。
- `i18n` ディレクトリに `[LANG].toml` ファイルを作成する。まずは開始地点として `en.toml` ファイルをコピーすることができます。
- 新たな言語を公開するため、`config.toml` ファイルにその言語のセクションを追加する。既に存在する言語のセクションを開始地点とすることができます。

### 翻訳

翻訳されたコンテンツは `content/[LANG]/docs` ディレクトリ内に存在する必要があります。それらは英語ソースと同じURLを持ちます。例えば、イントロダクションを韓国語に翻訳するなら以下のように英語ソースをコピーすると便利です。

```sh
mkdir -p content/ko/docs/intro
cp content/en/docs/intro/install.md content/ko/docs/intro/install.md
```

新しいファイルの内容を別の言語に翻訳することができます。

翻訳されていない英語ファイルのコピーを `content/[LANG]/` に追加しないでください。言語がその場所に存在する場合、未翻訳のページは自動的に英語にリダイレクトされます。翻訳には時間がかかるので、常に古いフォークではなく最新のドキュメントを翻訳するようにしてください。

全ての `aliases` 行をヘッダーセクションから削除するよう気をつけてください。`aliases: ["/docs/using_helm/"]` のような行は翻訳では持ちません。それらは新たなページには存在しない古いリンクへのリダイレクトです。

注：翻訳ツールが助けになるかもしれません。それには機械翻訳が含まれています。機械翻訳は公開前に編集される、またはネイティブ話者によって文法や意味をレビューされる必要があります。

## 言語間のナビゲーション

![Screen Shot 2020-05-11 at 11 24 22
AM](https://user-images.githubusercontent.com/686194/81597103-035de600-937a-11ea-9834-cd9dcef4e914.png)

サイトグローバルな　[config.toml](https://github.com/helm/helm-www/blob/main/config.toml#L83L89) ファイルで言語ナビゲーションが設定されています。

新たな言語を追加するには、上で定義した新たな[2文字言語コード](./localization/#2文字言語コード)を追加する必要があります。例：

```
# Korean
[languages.ko]
title = "Helm"
description = "Helm - The Kubernetes Package Manager."
contentDir = "content/ko"
languageName = "한국어 Korean"
weight = 1
```

## 内部リンクの解決

翻訳されたコンテンツは時々別言語にしか存在しないページへのリンクを含んでいるでしょう。これによって[ビルドエラー](https://app.netlify.com/sites/helm-merge/deploys)が発生します。例：

```
12:45:31 PM: htmltest started at 12:45:30 on app
12:45:31 PM: ========================================================================
12:45:31 PM: ko/docs/chart_template_guide/accessing_files/index.html
12:45:31 PM:   hash does not exist --- ko/docs/chart_template_guide/accessing_files/index.html --> #basic-example
12:45:31 PM: ✘✘✘ failed in 197.566561ms
12:45:31 PM: 1 error in 212 documents
```

これを解決するために、あなたのコンテンツの内部リンクを確認する必要があります。

* アンカーリンクは翻訳された `id` の値を反映する必要があります。
* 内部リンクを修正する必要があります。

存在しない _（もしくはまだ翻訳されていない）_ 内部ページについては、修正がされるまでサイトがビルドされません。代わりに、下記のようにコンテンツが _存在する_ 別の言語にURLを向けることができます。


`< relref path="/docs/topics/library_charts.md" lang="en" >`

詳細については [言語間相互リファレンスについての Hugo ドキュメント](https://gohugo.io/content-management/cross-references/#link-to-another-language-version) をご覧ください。
