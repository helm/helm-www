---
title: 本地化Helm文档
description: 本地化Helm文档的说明。
sidebar_position: 5
---

本指南介绍如何本地化Helm文档。

## 入门

翻译工作使用与文档稿件相同的过程。翻译通过[pull
requests](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)
提供给 [helm-www](https://github.com/helm/helm-www) 仓库并由管理站点的团队审查。

### 双字母语言代码

语言代码文档由[ISO 639-1标准](https://www.loc.gov/standards/iso639-2/php/code_list.php)组织。
比如，韩国的双字母代码是 `ko`。

在内容和配置中可以找到使用的语音码。三个例子如下：

- `content` 目录中的子目录以语言码命名且本地化内容在对应的目录中。 主要在每个语言码目录的 `docs`子目录中。
- `i18n`目录包含一个网站使用的每种语言的配置文件。文件按照 `[LANG].toml` 形式命名，`[LANG]` 是双字母语言码。
- 顶层`config.toml`文件中，有按语言码组织的导航和其他详细信息的配置。

英文使用语言码 `en`，是翻译的默认语言和资源。

### Fork, Branch, Change, Pull Request

贡献翻译从[helm-www仓库](https://github.com/helm/helm-www)
[创建fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)开始。在你的fork中提交更改。

默认情况下，fork将在名为master的默认分支上工作。请使用分支提交更改并创建pull requests。如果你不熟悉分支，可以
[阅读GitHub文档](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-branches)。

一旦有了分支，就可以添加翻译，将内容本地化为一种语言。

注意，Helm使用一个[Developers Certificate of Origin](https://developercertificate.org/)。
所有的提交需要signoff。提交时可以使用 `-s` 或 `--signoff` 参数使用你Git配置的用户和邮箱签署这个提交。
更多细节请查看 [CONTRIBUTING.md](https://github.com/helm/helm-www/blob/main/CONTRIBUTING.md#sign-your-work)
文件。

准备好之后，创建一个 [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)
将翻译提交到helm-www仓库。

一旦创建了pull request，维护者会进行审查。过程细节查看 [CONTRIBUTING.md](https://github.com/helm/helm-www/blob/main/CONTRIBUTING.md)。

## 翻译内容

本地化所有的Helm内容是一项巨大的任务。开始很小的改动是可以的。翻译会随着时间扩展。

### 开始一个新语言

开始新语言时有些最低要求，包括：

- 添加`content/[LANG]/docs`目录，包含`_index.md` 文件。这是顶层的文档落地页。
- `[LANG].toml` 文件在`i18n`目录中。可以复制`en.toml`文件作为起点。
- 在 `config.toml`文件中添加一部分用于展示新语言。可以用已有语言作为起点。

### 翻译

已翻译内容需要保留在 `content/[LANG]/docs` 目录中。应该有相同的URL作为英文源。
比如，将intro翻译为韩文时拷贝英文是有用的：

```sh
mkdir -p content/ko/docs/intro
cp content/en/docs/intro/install.md content/ko/docs/intro/install.md
```

这个新文件中的内容可以翻译成其他语言。

不要在`content/[LANG]/`中添加未翻译的英文文件拷贝。语言存在之后，任何未翻译的页面
都会自动重定向到英文。翻译需要时间，应该翻译最新版本的文档，而不是过时的fork。

确保从头部删除`aliases`行。像 `aliases: ["/docs/using_helm/"]` 不属于翻译。
这些是旧链接的重定向，新页面不存在这些链接。

注意翻译工具可以帮助完成这个过程。包括机器翻译内容。机器翻译内容在发布之前应该由说母语的人编辑或者审查语法和语义。

## 在语言之间切换

![Screen Shot 2020-05-11 at 11 24 22
AM](https://user-images.githubusercontent.com/686194/81597103-035de600-937a-11ea-9834-cd9dcef4e914.png)

站点全局
[config.toml](https://github.com/helm/helm-www/blob/main/config.toml#L83L89)
文件可以配置语言导航。

添加新语言，可以使用上面定义的双字母语言码添加一组参数。比如：

```toml
# Korean
[languages.ko]
title = "Helm"
description = "Helm - The Kubernetes Package Manager."
contentDir = "content/ko"
languageName = "한국어 Korean"
weight = 1
```

## 解析内部链接

翻译的内容有时会包含跳转到其他页面的链接，但只存在于其他语言中。就会出现
[build errors](https://app.netlify.com/sites/helm-merge/deploys)。比如：

```shell
12:45:31 PM: htmltest started at 12:45:30 on app
12:45:31 PM: ========================================================================
12:45:31 PM: ko/docs/chart_template_guide/accessing_files/index.html
12:45:31 PM:   hash does not exist --- ko/docs/chart_template_guide/accessing_files/index.html --> #basic-example
12:45:31 PM: ✘✘✘ failed in 197.566561ms
12:45:31 PM: 1 error in 212 documents
```

为了解决这个问题，你需要检查翻译中的内部链接。

- 锚点链接需要反映翻译的 `id` 值
- 内部页面链接需要修复

对于不存在的内部页， _(或者还未被翻译的)_，站点不会构建，直到修复错误。应急的话可以指向
另一个已经存在的语言：

`< relref path="/docs/topics/library_charts.md" lang="en" >`

查看 [语言之间的交叉引用](https://gohugo.io/content-management/cross-references/#link-to-another-language-version)
获取更多信息。
