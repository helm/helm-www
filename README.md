![https://raw.githubusercontent.com/helm/helm-www/master/themes/helm/static/img/apple-touch-icon.png](https://raw.githubusercontent.com/helm/helm-www/master/themes/helm/static/img/apple-touch-icon.png)


This is an archival version of the Helm website, displaying documentation and information for Helm V2 - [v2.helm.sh](https://v2.helm.sh/)

---

## How To Add A Blog Post

This is a quick start guide for creating new blog post entries. Blog posts are
created via pull requests. The following steps are used to add them.

1) Add a new file to the `_posts` directory whose name is the published date and the title. The files must be markdown formatted. See the existing titles for examples of the format
2) Add the header meta-data to the file using this format (note the permalink structure). Recommended but optional fields are `authorname` which should be name(s); these are displayed verbatim. `authorlink` is the link used by `authorname`.
```yaml
---
title: "A Fancy Title"
slug: "fancy-title"
authorname: "Captain Awesome"
authorlink: "https://example.com"
date: "yyyy-mm-dd"
---
```
3) Add the content below the `---` as Markdown. The title does not need to be included in this section
4) Any images should be placed in the `/img/blog/` directory. Images should be losslessly compressed to reduce their size. Tools, such as [ImageOptim](https://imageoptim.com/), can be used.
5) To summarize content on the blog index page, insert a `<!--more-->` break in your markdown. This will truncate the content with a _Read More_ link.

---

## How to Edit The Helm Docs

For **Helm 2** (and prior releases), all documentation is located in the main [helm/helm repo](https://github.com/helm/helm/tree/dev-v2/docs) under the `dev-v2` branch. Please [go here](https://github.com/helm/helm/tree/dev-v2/docs) to make edits and open PRs on those docs.

This website extracts the doc files from `helm/helm` and publishes them to the website during the `gulp` build process. With the release of Helm 3, this version of the site will be maintained at [v2.helm.sh](https://v2.helm.sh/)

For **Helm 3**, all documentation files have been moved to this website at `content/docs/`. You can directly edit [the docs](https://github.com/helm/helm-www/tree/master/content/docs), pull requests are welcome!

---

# Website Development

The site is built on top of [Hugo](https://gohugo.io/) with a custom theme, and uses [Gulp](https://gulpjs.com/) to build and manage the asset pipeline, and to fetch and arrange the docs for publishing.

### Installation

Hugo can be installed via `brew update && brew install hugo`
Then install the packages needed for Gulp to run:

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

Main Templates:

```
themes/helm/layouts/index.html  < site homepage
themes/helm/layouts/docs/       < docs homepage
themes/helm/layouts/blog/       < blog layouts
```

Markdown:

```
/content/blog/                  < posts go here
/content/docs/                  < docs are imported to here
```

The documentation content is pulled in from their home in the [helm/helm](https://github.com/helm/helm/tree/master/docs) repo, as part of the Gulp build process.

Gulp clones the files to the `/source` directory, makes some edits (to hugo-ify markdown and fix some url issues), exporting the compiled docs to `/content/docs`.

Hugo then targets the `/content/docs` directory to generate the website, applying the theme (html layouts and css/js assets) in `/themes/hugo`.

Note that if adding new pages that need to appear in the sidebar, you'll need to list them in `config.toml`.

---

## Deployment

The helm website is continuousy deployed to Netlify via merges to master. The Netlify account is administered by CNCF and Helm maintainer personnel.

v2.helm.sh logs:

[![Netlify Status](https://api.netlify.com/api/v1/badges/ae8c7a84-1600-4a90-bc29-27c80d5a28f3/deploy-status)](https://app.netlify.com/sites/v2-helm/deploys)
