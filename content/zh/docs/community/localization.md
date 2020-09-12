---
title: "本地化 Helm 文档"
description: "本指南说明了如何本地化 Helm 文档。"
aliases: ["/docs/localization/"]
weight: 5
---

本指南说明了如何本地化 Helm 文档。

## 开始

协助翻译的方式与为文档提交贡献的方式相同。
翻译通过 [拉取请求](https://help.github.com/zh/github/collaborating-with-issues-and-pull-requests/about-pull-requests) 提交到 [helm-www](https://github.com/helm/helm-www) git 仓库，
拉取请求由社区管理者负责审核。

### 两字母语言代码

文档根据 [ISO 639-1 标准](https://www.loc.gov/standards/iso639-2/php/code_list.php) 中对语言代码的规定进行组织。
例如，中文的两字母语言代码为`zh`。

在 `content` 和 `configuration` 中你会找到一些已经在使用的语言代码。这里有3个例子。

- 在 `content` 目录中，子目录名称是语言代码，该语言的翻译文本就位于这个子目录中。
  主要内容存放在 `docs` 子目录。
- `i18n` 目录包含每种语言的配置文件，这些配置文件配置了网站上的常用单词。
  配置文件命名为`[LANG].toml`。其中，`[LANG]`是语言的2字母代码。
- 在根目录的config.toml文件中，有用于导航和由语言代码组织的其他详细信息。

默认语言和翻译标准是英语，其语言代码为 `en` 。

### 复刻（Fork）, 分支（Branch）, 更改（Change）, 推送请求（Pull Request）

要进行翻译，首先要在GitHub上[复刻](https://docs.github.com/cn/github/getting-started-with-github/fork-a-repo)[helm-www仓库](https://github.com/helm/helm-www），
并将所做的更改提交到复刻的仓库中。

默认情况下，您的复刻将被设置为在默认的master分支上工作。请使用分支功能进行开发并创建拉取请求。如果您不熟悉分支，可以[在GitHub文档中阅读有关分支的信息]（https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-branches）。

拥有分支后，请进行更改以添加翻译并将内容本地化为特定语言。

请注意，Helm使用[开发者原创认证]（https://developercertificate.org/）。所有提交都需要签名。
进行提交时，您可以使用 `-s` 或 `--signoff` 标志，使用Git配置的姓名和电子邮件地址对提交进行签名。
更多详细信息，请参见[CONTRIBUTING.md]（https://github.com/helm/helm-www/blob/master/CONTRIBUTING.md#sign-your-work）文件。

准备就绪后，创建一个[拉取请求]（https://help.github.com/cn/github/collaborating-with-issues-and-pull-requests/about-pull-requests），将翻译送回到helm-www存储库。

创建拉取请求后，一名维护者将对其进行审核。有关该过程的详细信息，请参见[CONTRIBUTING.md]（https://github.com/helm/helm-www/blob/master/CONTRIBUTING.md）文件。

## 翻译内容

翻译 Helm 的所有内容将是一个巨大的工程。您可以从翻译一小部分开始。正所谓，千里之行，始于足下。

### 开始一门新的语言

如果您要将内容翻译为一门新的语言，我们有最低要求，它包括：

- 创建 `content/[LANG]/docs` 目录并包含一个 `_index.md` 文件。这是整个文档的入口页面。
- 在 `i18n` 目录下创建一个 `[LANG].toml` 文件。你可以复制 `en.toml` 文件的内容作为参考。
- 在 `config.toml` 文件中在为该语言中添加一个配置片段，可以参考已有的语言配置片段。

### 翻译中
翻译后的内容需要位于 `content/[LANG]/docs`”目录中。它的网址应与英语来源相同。例如，翻译
韩语简介，复制对应的英语简介可能会有帮助，你可以这样做：

```sh
mkdir -p content/ko/docs/intro
cp content/en/docs/intro/install.md content/ko/docs/intro/install.md
```

然后可以将新文件中的内容翻译成其他语言。

注意，翻译工具可以帮助完成此过程。这包括机器生成的翻译。
但是，在发布之前，应由母语使用者编辑机器生成的翻译，或以其他方式检查语法和含义。


## 在语言之间导航

![Screen Shot 2020-05-11 at 11 24 22
AM](https://user-images.githubusercontent.com/686194/81597103-035de600-937a-11ea-9834-cd9dcef4e914.png)

站点的全局
[config.toml](https://github.com/helm/helm-www/blob/master/config.toml#L83L89)
文件配置了语言的路径导航。

要添加一门新语言，请先用前文所述 [两字母语言代码](./localization/#两字母语言代码) 添加一系列参数表，例如：

```
# Chinese
[languages.zh]
title = "Helm"
description = "Helm - Kubernetes 包管理器"
contentDir = "content/zh"
languageName = "中文 Chinese"
weight = 1
```

## 解决内部链接错误

翻译的内容有时会包含指向仅以另一种语言存在的页面链接。
这将导致网站[构建错误]（https://app.netlify.com/sites/helm-merge/deploys）。报错信息类似于：

```
12:45:31 PM: htmltest started at 12:45:30 on app
12:45:31 PM: ========================================================================
12:45:31 PM: ko/docs/chart_template_guide/accessing_files/index.html
12:45:31 PM:   hash does not exist --- ko/docs/chart_template_guide/accessing_files/index.html --> #basic-example
12:45:31 PM: ✘✘✘ failed in 197.566561ms
12:45:31 PM: 1 error in 212 documents
```

要解决此问题，您需要检查内容中的内部链接。

* 锚链接需要反映翻译后的 `id` 值
* 内部页面链接需要修复

对于不存在_（或尚未翻译）_的内部页面，只有更正后才能构建网站。作为备用，链接可以指向内容_确实已经_存在的另一种语言，如：

`< relref path="/docs/topics/library_charts.md" lang="en" >`

请参阅 [Hugo 关于语言之间的交叉引用文档](https://gohugo.io/content-management/cross-references/#link-to-another-language-version) 以了解更多。