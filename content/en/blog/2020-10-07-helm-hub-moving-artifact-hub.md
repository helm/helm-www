---
title: "Helm Hub Moving To Artifact Hub"
slug: "helm-hub-moving-to-artifact-hub"
authorname: "Matt Farina"
author: "@mattfarina"
authorlink: "https://mattfarina.com"
date: "2020-10-07"
---

Today, we are happy to announce that the Helm Hub is moving to the [Artifact Hub](https://artifacthub.io/). That means, when you go to the Helm Hub you will be redirected to the Artifact Hub.

## What This Means For You

If you search the Helm Hub or list your charts in the Helm Hub you might wonder, what does this mean for me?

The Artifact Hub lists all of the same charts the Helm Hub has listed. It provides search that is faster and includes [faceted search](https://en.wikipedia.org/wiki/Faceted_search). You should be able to discover charts in a similar way to what you did before. Searching continues to work with the Helm CLI, as well.

There is more in the Artifact Hub than just searching for charts. You can get notifications via email or web hook when a chart is updated. You can find other artifacts and see related artifacts. The Artifact Hub provides more than the Helm Hub did.

If you listed your chart repositories in the Helm Hub and didn't already have them listed in the Artifact Hub, they were automatically brought over. The Artifact Hub provides a means to claim your repository as well as list new ones. When listing a repository you can connect it to a user account or a multi-user organization.

## Why We Are Doing This

The Helm Hub was built on the Monocular project. This project was built to handle a limited number of Helm repositories and was designed for a slightly different use case than a public listing of as many chart repositories as possible. It served the Helm project well but has begun to show some limitations as the number of Helm charts and repositories grew. We knew we needed to do something about this problem with the Helm Hub.

The Artifact Hub came along as we were starting to experience growth issues. Instead of operating our own instance of the Artifact Hub or writing our own software to handle the scaling issues, we are deferring to the Artifact Hub to handle chart discovery and management. The Artifact Hub supports and promotes more of the CNCF ecosystem than just charts.

## Questions, Concerns, or Issues

If you experience issues with the changeover please let us know. There are a few ways you can do this:

1. If the issue is claiming your chart repository on the Artifact Hub from the migration, please file an issue on the [Helm Hub repository](https://github.com/helm/hub).
2. Experiencing a problem with the Artifact Hub site, then you can file an issue with the [Artifact Hub project](https://github.com/artifacthub/hub). It is a CNCF project and open source.
3. Having problems using the Helm CLI to search the Artifact Hub? You can file an issue with [Helm](https://github.com/helm/helm). Note, URLs for charts will still begin with `hub.helm.sh`, by default, when found in search.
