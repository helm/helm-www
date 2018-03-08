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

The helm website is deployed to an ACS cluster using the [Deis team credentials](https://github.com/deis/deployment/tree/master/production/workflow). Helm core members and folks within ACS should have access to this subscription.

Normally the site is deployed via Jenkins CI when changes are merged to master, though this process is currently being updated. Manual deploys are possible using Deis Workflow and the above creds.
