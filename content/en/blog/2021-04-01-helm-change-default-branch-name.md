---
title: "Helm 2 and the Charts Project Are Now Unsupported"
slug: "helm-2-becomes-unsupported"
authorname: "Martin Hickey"
author: "@hickeyma"
authorlink: "https://hickeyma.github.io/"
date: "2021-04-01"
---

In today’s technology world, we are constantly striving to be more inclusive of all people in our world. We use words in common vocabulary that have problematic histories and cause offence to people. In the Helm community, we strive to be as inclusive as possible, which means we need to make changes when and where necessary. The Helm maintainers have therefore voted to change the name of the default [Helm core](https://github.com/helm/helm) GitHub repository branch. We would like to thank John Lockman for initially starting the discussion with the community.

What Does This Mean?

This means that the default branch will change from `master` to `main`. As a user, this will not have an impact on you using the repository directly. GitHub will automatically redirect links on GitHub that contain the old branch name to the equivalent link on the renamed branch. There is however a need for you to update your local clone of the repository.

From your local clone of the repository, run the following commands to update the name of the default branch.

```bash
git branch -m master main
git fetch origin
git branch -u origin/main main
git remote set-head origin -a
```

That is it and you can continue on using and contributing to Helm without any interruption.
