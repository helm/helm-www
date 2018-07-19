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
2) Add the header meta-data to the file. It should be in the format (note the permalink structure):
```yaml
---
layout: post
title: "A Fancy Title"
permalink: "/blog/2018/fancy-title/"
author: "Captain Awesome"
authorlink: "https://example.com"
---
```
3) Add the content below the `---` as Markdown. The title does not need to be included in this section
4) Any images should be placed in the `/assets/images/blog/` directory. Images should be losslessly compressed to reduce their size. Tools, such as [ImageOptim](https://imageoptim.com/), can be used.
