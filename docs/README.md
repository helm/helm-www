# Running the site

## Install Dependancies

This site uses [Hugo](https://gohugo.io), a static site generator. It can be installed via homebrew:

`brew update && brew install hugo`

then:

`npm install`

When these packages are installed, you can generate the Docs site by:

`hugo server`

## Local Dev

The site uses Gulp to build and optimize the site assets. If you're work on the styles or scripts in the site, re-compile and reload your changes with:

`gulp watch`

## Structure

The `/content` directory contains all of the Docs in markdown format, extracted from their home in the [kubernetes/helm](https://github.com/kubernetes/helm/tree/master/docs) repo.

When Hugo generates the site, these markdown files are spun into a site structure via the theme (html layouts and css/js assets) in `/themes/hugodocs`.

## Editing Docs

Edits to the Docs themselves should be carried out via pull requests on the [kubernetes/helm](https://github.com/kubernetes/helm/tree/master/docs) repo.  
The Docs site will then extract those files and publish them.