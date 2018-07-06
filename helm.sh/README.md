# Helm.sh

[helm.sh](https://helm.sh) is the project website, providing information and links for the Helm Project.

* [Project: github.com/kubernetes/helm](https://github.com/kubernetes/helm)
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
