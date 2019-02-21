![https://helm.sh/assets/images/apple-touch-icon.png](https://helm.sh/assets/images/apple-touch-icon.png)

[helm.sh](https://helm.sh) provides information and resources for the [Helm Project](https://github.com/helm/helm).

---

## How To Add A Blog Post

This is a quick start guide for creating new blog post entries. Blog posts are
created via pull requests. The following steps are used to add them.

1) Add a new file to the `_posts` directory whose name is the published date and the title. The files must be markdown formatted. See the existing titles for examples of the format
2) Add the header meta-data to the file using this format (note the permalink structure). Recommended but optional fields are `authorname` which should be name(s); these are displayed verbatim. `authorlink` is the link used by `authorname`.
```yaml
---
layout: post
title: "A Fancy Title"
permalink: "/blog/2018/fancy-title/"
authorname: "Captain Awesome"
authorlink: "https://example.com"
date: "yyyy-mm-dd"
---
```
3) Add the content below the `---` as Markdown. The title does not need to be included in this section
4) Any images should be placed in the `/assets/images/blog/` directory. Images should be losslessly compressed to reduce their size. Tools, such as [ImageOptim](https://imageoptim.com/), can be used.
5) To summarize content on the blog index page, insert a `<!--more-->` break in your markdown. This will truncate the content with a _Read More_ link. 

---

## How to Edit The Helm Docs

Edits to the Docs themselves should be carried out via pull requests on the [helm/helm](https://github.com/helm/helm/tree/master/docs) main repo.  
This site will then extract those files during the build process, and publish them to [docs.helm.sh](https://docs.helm.sh).

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

---

## Deployment

The helm website is continuousy deployed to Netlify via merges to master. The Netlify account is administered by CNCF and Helm maintainer personnel.

Previously, the site was pushed to blob storage using brigade - it would be nice to wire this up to a Netlify webhook so that our bot could deploy on demand too.
