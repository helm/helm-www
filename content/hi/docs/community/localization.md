---
title: "Localizing Helm Documentation"
description: "Instructions for localizing the Helm documentation."
aliases: ["/docs/localization/"]
weight: 5
---

This guide explains how to localize the Helm documentation.

## Getting Started

Contributions for translations use the same process as contributions for
documentation. Translations are supplied through [pull
requests](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)
to the [helm-www](https://github.com/helm/helm-www) git repository and pull
requests are reviewed by the team that manages the website.

### Two-letter Language Code

Documentation is organized by the [ISO 639-1
standard](https://www.loc.gov/standards/iso639-2/php/code_list.php) for the
language codes. For example, the two-letter code for Korean is `ko`.

In content and configuration you will find the language code in use. Here are 3
examples:

- In the `content` directory the language codes are the subdirectories and the
  localized content for the language is in each directory. Primarily in the
  `docs` subdirectory of each language code directory.
- The `i18n` directory contains a configuration file for each language with
  phrases used on the website. The files are named with the pattern `[LANG].toml`
  where `[LANG]` is the two letter language code.
- In the top level `config.toml` file there is configuration for navigation and
  other details organized by language code.

English, with a language code of `en`, is the default language and source for
translations.

### Fork, Branch, Change, Pull Request

To contribute translations start by [creating a
fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)
of the [helm-www repository](https://github.com/helm/helm-www) on GitHub. You
will start by committing the changes to your fork.

By default your fork will be set to work on the default branch known as `main`.
Please use branches to develop your changes and create pull requests. If you are
unfamiliar with branches you can [read about them in the GitHub
documentation](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-branches).

Once you have a branch make changes to add translations and localize the content
to a language.

Note, Helm uses a [Developers Certificate of
Origin](https://developercertificate.org/). All commits need to have signoff.
When making a commit you can use the `-s` or `--signoff` flag to use your Git
configured name and email address to signoff on the commit. More details are
available in the
[CONTRIBUTING.md](https://github.com/helm/helm-www/blob/main/CONTRIBUTING.md#sign-your-work)
file.

When you are ready, create a [pull
request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)
with the translation back to the helm-www repository.

Once a pull request has been created one of the maintainers will review it.
Details on that process are in the
[CONTRIBUTING.md](https://github.com/helm/helm-www/blob/main/CONTRIBUTING.md)
file.

## Translating Content

Localizing all of the Helm content is a large task. It is ok to start small. The
translations can be expanded over time.

### Starting A New Language

When starting a new language there is a minimum needed. This includes:

- Adding a `content/[LANG]/docs` directory containing an `_index.md` file. This
  is the top level documentation landing page.
- Creating a `[LANG].toml` file in the `i18n` directory. Initially you can copy
  the `en.toml` file as a starting point.
- Adding a section for the language to the `config.toml` file to expose the new
  language. An existing language section can serve as a starting point.

### Translating

Translated content needs to reside in the `content/[LANG]/docs` directory. It
should have the same URL as the English source. For example, to translate the
intro into Korean it can be useful to copy the english source like:

```sh
mkdir -p content/ko/docs/intro
cp content/en/docs/intro/install.md content/ko/docs/intro/install.md
```

The content in the new file can then be translated into the other language.

Do not add an untranslated copy of an English file to `content/[LANG]/`.
Once a language exists on the site, any untranslated pages will redirect to
English automatically. Translation takes time, and you always want to be
translating the most current version of the docs, not an outdated fork.

Make sure you remove any `aliases` lines from the header section. A line like
`aliases: ["/docs/using_helm/"]` does not belong in the translations. Those
are redirections for old links which don't exist for new pages.

Note, translation tools can help with the process. This includes machine
generated translations. Machine generated translations should be edited or
otherwise reviewing for grammar and meaning by a native language speaker before
publishing.


## Navigating Between Languages

![Screen Shot 2020-05-11 at 11 24 22
AM](https://user-images.githubusercontent.com/686194/81597103-035de600-937a-11ea-9834-cd9dcef4e914.png)

The site global
[config.toml](https://github.com/helm/helm-www/blob/main/config.toml#L83L89)
file is where language navigation is configured.

To add a new language, add a new set of parameters using the [two-letter
language code](./localization/#two-letter-language-code) defined above. Example:

```
# Korean
[languages.ko]
title = "Helm"
description = "Helm - The Kubernetes Package Manager."
contentDir = "content/ko"
languageName = "한국어 Korean"
weight = 1
```

## Resolving Internal Links

Translated content will sometimes include links to pages that only exist in
another language. This will result in site [build
errors](https://app.netlify.com/sites/helm-merge/deploys). Example:

```
12:45:31 PM: htmltest started at 12:45:30 on app
12:45:31 PM: ========================================================================
12:45:31 PM: ko/docs/chart_template_guide/accessing_files/index.html
12:45:31 PM:   hash does not exist --- ko/docs/chart_template_guide/accessing_files/index.html --> #basic-example
12:45:31 PM: ✘✘✘ failed in 197.566561ms
12:45:31 PM: 1 error in 212 documents
```

To resolve this, you need to check your content for internal links.

* anchor links need to reflect the translated `id` value
* internal page links need to be fixed

For internal pages that do not exist _(or have not been translated yet)_, the
site will not build until a correction is made. As a fallback, the url can point
to another language where that content _does_ exist as follows:

`< relref path="/docs/topics/library_charts.md" lang="en" >`

See the [Hugo Docs on cross references between
languages](https://gohugo.io/content-management/cross-references/#link-to-another-language-version)
for more info.
