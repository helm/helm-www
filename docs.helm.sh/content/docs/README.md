# Helm Docs Content

This is where you would normally find markdown files used by Hugo to generate the website docs content - but this directory is intentionally empty as the files are imported and generated from the external source during the site build task.

## Build Task

The [gulpfile](https://github.com/helm/helm-www/blob/master/docs.helm.sh/gulpfile.js#L112L118) clones the main Helm Repo, and imports the docs directly from there. 

## Editing Docs

The writing and editing of docs should take place at [the source](https://github.com/helm/helm). 