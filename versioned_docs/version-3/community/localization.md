---
title: "Localizing Helm Documentation"
description: "Instructions for localizing the Helm documentation."
aliases: ["/docs/localization/"]
sidebar_position: 5
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

- In the `i18n` directory, there are subdirectories for each language code. The
  localized content for the language is in each subdirectory.
- Localized content in each 
- For each language, there is a `code.json` file for each language with
  phrases used on the website.   

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

The following describes the files/directories that are used to translate the docs content, blog content, and site elements in the Helm documentation site:

- `i18n/<language-code>` directory:
  - `code.json` used for translating React code in the site (including the landing page)
  - `i18n/<language-code>/docusaurus-plugin-content-blog` subdirectory with blog translations
  - `i18n/<language-code>/docusaurus-plugin-content-docs` subdirectory with:
     - Version subdirectories for docs content translations (eg `i18n/<language-code>/docusaurus-plugin-content-docs/version-3/`)
     - JSON files for each version of the docs with translations for the categories in the sidebar (eg, `current.json`, `version-3.json`, etc)
  - `i18n/docusaurus-theme-classic` subdirectory with `footer.json` and `navbar.json` files for translating the visible text in the site navbar and footer
- The `i18n` key in the `docusaurus.config.js` file lists all the locales and exposes config options for the locale dropdown in the site navbar

For more information, see [i18n - Introduction](https://docusaurus.io/docs/i18n/introduction) in the Docusaurus docs.

### Starting A New Language

For a tutorial that walks you through how to translate site content, see [i18n - Tutorial](https://docusaurus.io/docs/i18n/tutorial) in the Docusaurus docs.

To start a new language:

1. If you haven't already, install dependencies:

   ```
   yarn install --frozen-lockfile
   ```

1. Run the Docusaurus `write-translations` command. For example, to add the `fr` (French) locale: `yarn write-translations -- --locale fr`. This creates the required directory structure for the language and initializes the JSON translation files required to translate site elements like the navbar, footer, landing page, and sidebar.

    ```
    yarn write-translations --locale <language-code>
    ```

1. Do the minimum translations for the new language:
   1. Translate the `code.json` file.
   1. In the `i18n/docusaurus-theme-classic` subdirectory, translate the `footer.json` and `navbar.json` files.
   1. In the `docusaurus-plugin-content-blog/options.json`, translate the blog elements in the `options.json` file.
1. Add the language to the `i18n` key of the `docusaurus.config.js` file so that it appears in the dropdown in the navbar:
    ```yaml
    i18n: {
      defaultLocale: 'en',
      # add new language to this list of locales
      locales: ['en', 'de', 'es', 'fr', 'gr', 'ja', 'ko', 'pt', 'ru', 'uk', 'zh'],
      localeConfigs: {
        en: {
          htmlLang: 'en-us',
          label: 'English',
        },
        de: {
          label: 'Deutsch',
        },
      # new_lang {
      #   label: 'Navbar label',
      # }
      },
    },
    ```
1. (Optional) Translate docs or blog content. See _Translating_ below.
1. Test your changes by starting the localized site in dev mode, specifying the locale:

   ```
   yarn start --locale fr
   ```
   :::note
   Each locale is a distinct standalone single-page application. You can only preview one locale at a time. It is not possible to preview all locales at the same time.
   :::

### Translating

Before you translate docs content, review the following best practices and guidelines:
* Translation tools can help with the process. This includes machine
generated translations. Machine generated translations should be edited or
otherwise reviewing for grammar and meaning by a native language speaker before
publishing.
* Do not add an untranslated copy of an English file to `i18n/[LANG]/plugin-content-docs` or `i18n/[LANG]/plugin-content-blog`.
Once a language exists on the site, any untranslated pages will redirect to
English automatically. Translation takes time, and you always want to be
translating the most current version of the docs, not an outdated fork.
* Make sure you remove any `aliases` lines from the header section. A line like
`aliases: ["/docs/using_helm/"]` does not belong in the translations. Those
are redirections for old links which don't exist for new pages.
* Add anchor IDs to any headings using the format `## Example Heading {#example-anchor-id}`. The anchor IDs must be English language and match the anchor IDs of the corresponding heading in the English doc page. For example, `## 后端存储 {#storage-backends}` matches `## Storage backends {#storage-backends}`. This ensures that any anchor links to the headings still work in the translated version of the page. For more information, see [Anchor links to headings](https://github.com/helm/helm-www/blob/main/ARCHITECTURAL_DECISIONS.md#anchor-links-to-headings) in `ARCHITECTURAL_DECISIONS.md`.

To translate docs and blog content:
1. Make sure that target locale exists in the `i18n` directory. If it doesn't, see _Starting a New Language_ above.
1. Copy one or more markdown files that you want to translate from `/docs` or `/versioned_docs` to the appropriate version folder in `i18n/<language-code>/docusaurus-plugin-content-docs`.
     For example, to translate `versioned_docs/version-3/example.md` into Korean:
     ```sh
     cp versioned_docs/version-3/topics/example.md i18n/ko/docusaurus-plugin-content-docs/version-3/topics/example.md
     ```
1. Copy one or more markdown files that you want to translate from `/blog` to `i18n/<language-code>/docusaurus-plugin-content-blog`.
    For example, to translate `blog/2025-09-09-path-to-helm-v4.md` into Korean:
     ```sh
     cp blog/2025-09-09-path-to-helm-v4.md i18n/ko/docusaurus-plugin-content-blog/2025-09-09-path-to-helm-v4.md
     ```
1. If you haven't already, install dependencies:

   ```
   yarn install --frozen-lockfile
   ```

1. Test your changes by starting the localized site in dev mode, specifying the locale:

   ```
   yarn start --locale ko
   ```
   :::note
   Each locale is a distinct standalone single-page application. You can only preview one locale at a time. It is not possible to preview all locales at the same time.
   :::

## Navigating Between Languages

Users navigate between languages in the locale dropdown in the site navbar.
The `i18n` key in the site global `docusaurus.config.js` file is where language navigation is configured.
To add a new language, add the locale using the [two-letter
language code](./localization/#two-letter-language-code) defined above. Example:

```yaml
i18n: {
  defaultLocale: 'en',
  # add new language to this list of locales
  locales: ['en', 'de', 'es', 'fr', 'gr', 'ja', 'ko', 'pt', 'ru', 'uk', 'zh'],
  localeConfigs: {
    en: {
        htmlLang: 'en-us',
        label: 'English',
    },
    de: {
        label: 'Deutsch',
    },
    # new_lang {
    #   label: 'Navbar label',
    # }
  },
},
```