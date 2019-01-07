# Helm.sh

[helm.sh](https://helm.sh) is the project website, providing information and links for the Helm Project.

* [Project: github.com/helm/helm](https://github.com/helm/helm)
* [Website: helm.sh](https://helm.sh/)

--

# Website Development

The site is built on top of [Jekyll](https://jekyllrb.com/), and uses [Gulp](https://gulpjs.com/) to build and manage the asset pipeline.

## Install Dependencies

You can install these dependencies via:

```
npm install -g gulp
bundle install && npm install
```

## Running the Site

Running `gulp` once will compile all of the sass, images and js for the site.
Then, with everything in place - you can run Jekyll locally via:

`bundle exec jekyll serve`

## Deployment

The helm.sh jekyll website is deployed to [blob storage](https://helmshprod.blob.core.windows.net/helm-sh/index.html) via Brigade, which runs a build and deploy pipeline outlined in the root [brigade.js](https://github.com/helm/helm-www/blob/master/brigade.js) of this repo.

Builds can be triggered via the [brigly](https://github.com/deis/brigly-actions) slackbot. Helm core members should have access to this bot and the storage account subscription.

You [can view](https://azure.github.io/kashti/#!/project/brigade-fb9a3793086c96c531b5cea078a84782e32410914cd059a026b2ad) build status and log details in kashti.

## How To Add A Blog Post

This is a quick start guide for creating new blog post entries. Blog posts are
created via pull requests. The following steps are used to add them.

1) Add a new file to the `_posts` directory whose name is the published date and the title. The files must be markdown formatted. See the existing titles for examples of the format
2) Add the header meta-data to the file using this format (note the permalink structure). Recommended but optional fields are `authorname` which should be name(s) and `author` which should be handle(s); these are displayed verbatim. `authorlink` is the link used by both `authorname` and `author`.
```yaml
---
layout: post
title: "A Fancy Title"
permalink: "/blog/2018/fancy-title/"
authorname: "Captain Awesome"
author: "@captainawesome"
authorlink: "https://example.com"
---
```
3) Add the content below the `---` as Markdown. The title does not need to be included in this section
4) Any images should be placed in the `/assets/images/blog/` directory. Images should be losslessly compressed to reduce their size. Tools, such as [ImageOptim](https://imageoptim.com/), can be used.


---


# docs.helm.sh

[docs.helm.sh](https://helm.sh) is the documentation website for Helm.

* Source: [github.com/helm/helm](https://github.com/helm/helm/tree/master/docs)
* Website: [docs.helm.sh](https://docs.helm.sh/)

--

## Website Development

The site is built on top of [Hugo](https://gohugo.io/), and uses [Gulp](https://gulpjs.com/) to build and manage the asset pipeline.

### Install Dependancies

This site uses [Hugo](https://gohugo.io), a static site generator. It can be installed via homebrew:

`brew update && brew install hugo`

then install the packages needed for Gulp to run:

```
npm install -g gulp
npm install
```

### Running the site

When these packages are installed, you can generate the Docs site by:

`hugo && hugo server --watch`

### Local Dev

The site uses Gulp to build and optimize the site assets. If you're work on the styles or scripts in the site, re-compile and reload your changes with:

`gulp && gulp watch`

## Structure

The documentation contents are pulled in from their home in the [helm/helm](https://github.com/helm/helm/tree/master/docs) repo, as part of the Gulp build process.

Gulp clones the files to the `/source` directory.
Hugo then targets the `/source/docs` directory to generate the website, applying the theme (html layouts and css/js assets) in `/themes/hugodocs`.

## Editing Docs

Edits to the Docs themselves should be carried out via pull requests on the [helm/helm](https://github.com/helm/helm/tree/master/docs) repo. This Docs site will then extract those files and publish them to [docs.helm.sh](https://docs.helm.sh).

## Deployment

The helm website is deployed to an ACS cluster using the [Deis team credentials](https://github.com/deis/deployment/tree/master/production/workflow). Helm core members and folks within ACS should have access to this subscription.

Normally the site is deployed via Jenkins CI when changes are merged to master, though this process is currently being updated. Manual deploys are possible using Deis Workflow and the above creds.
