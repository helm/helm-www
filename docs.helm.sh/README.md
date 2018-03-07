# docs.helm.sh

[docs.helm.sh](https://helm.sh) is the documentation website for Helm.

* [Project Docs: github.com/kubernetes/helm](https://github.com/kubernetes/helm/tree/master/docs)
* [Docs Website: docs.helm.sh](https://docs.helm.sh/)

--

## Website Development

The site is built on top of [Hugo](https://gohugo.io/), and uses [Gulp](https://gulpjs.com/) to build and manage the asset pipeline.

### Install Dependancies

This site uses [Hugo](https://gohugo.io), a static site generator. It can be installed via homebrew:

`brew update && brew install hugo`

then:

`npm install`

### Running the site

When these packages are installed, you can generate the Docs site by:

`hugo && hugo server --watch`

### Local Dev

The site uses Gulp to build and optimize the site assets. If you're work on the styles or scripts in the site, re-compile and reload your changes with:

`gulp && gulp watch`

## Structure

The documentation contents are pulled in from their home in the [kubernetes/helm](https://github.com/kubernetes/helm/tree/master/docs) repo, as part of the Gulp build process.

Gulp clones the files to the `/source` directory.
Hugo then targets the `/source/docs` directory to generate the website, applying the theme (html layouts and css/js assets) in `/themes/hugodocs`.

## Editing Docs

Edits to the Docs themselves should be carried out via pull requests on the [kubernetes/helm](https://github.com/kubernetes/helm/tree/master/docs) repo. This Docs site will then extract those files and publish them to [docs.helm.sh](https://docs.helm.sh).