# docs.helm.sh

[docs.helm.sh](https://helm.sh) is the documentation website for Helm.

* Source: [github.com/kubernetes/helm](https://github.com/kubernetes/helm/tree/master/docs)
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

The documentation contents are pulled in from their home in the [kubernetes/helm](https://github.com/kubernetes/helm/tree/master/docs) repo, as part of the Gulp build process.

Gulp clones the files to the `/source` directory.
Hugo then targets the `/source/docs` directory to generate the website, applying the theme (html layouts and css/js assets) in `/themes/hugodocs`.

## Editing Docs

Edits to the Docs themselves should be carried out via pull requests on the [kubernetes/helm](https://github.com/kubernetes/helm/tree/master/docs) repo. This Docs site will then extract those files and publish them to [docs.helm.sh](https://docs.helm.sh).

## Deployment

The helm website is deployed to an ACS cluster using the [Deis team credentials](https://github.com/deis/deployment/tree/master/production/workflow). Helm core members and folks within ACS should have access to this subscription.

Normally the site is deployed via Jenkins CI when changes are merged to master, though this process is currently being updated. Manual deploys are possible using Deis Workflow and the above creds.
