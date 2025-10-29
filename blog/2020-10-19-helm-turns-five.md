---
title: " Helm Turns 5, and GitHub Gives the Gift of Charts"
slug: "helm-turns-five"
authors: ["mattbutcher", "mattfarina"]
date: "2020-10-19"
---

![Happy 5th Birthday Helm](images/happy-5th.png)

Five years ago, in a hackathon at Deis (who has since been acquired by Microsoft) Helm was born.<!-- truncate -->

```
commit ecad6e2ef9523a0218864ec552bbfc724f0b9d3d
Author: Matt Butcher <mbutcher@engineyard.com>
Date:   Mon Oct 19 17:43:26 2015 -0600

    initial add
```

[This commit](https://github.com/helm/helm-classic/commit/ecad6e2ef9523a0218864ec552bbfc724f0b9d3d) can be found on the helm-classic Git repository where the codebase for Helm v1 is located. This is the original Helm, before it merged with Deployment Manager and was folded into Kubernetes. This is where it all began.

Since day one, the Helm project has relied upon GitHub for source control, pull request management, and issue tracking. As a graduated CNCF project, the Helm org now manages dozens of GitHub repositories.

But when it came to hosting the packaged charts, we stored them in an object storage bucket hosted on Google Cloud. This historical decision reflects that at that time Google was one of the principal contributors to Helm.

Recently, Google’s time of supporting the official Helm chart repository has come to a close. We are grateful for Google’s hosting the Helm chart repository these last few years. But this event has given us an opportunity to further integrate our chart development pipeline with GitHub.

![Hello Github Octocat!](images/octocat.png)

So for today’s birthday celebration, we would like to announce that the Helm `stable` and `incubator` chart repositories will be directly hosted out of GitHub. Furthermore, GitHub Actions will power the pipeline for publishing charts. And thanks to GitHub’s blazingly fast network, chart downloads are faster than ever!

We have even published official Helm GitHub Actions in the GitHub marketplace. Check out [Helm Chart Releaser](https://github.com/marketplace/actions/helm-chart-releaser) for a way to host Helm charts in GitHub.

While Helm 2 is at the end of its support, we did also move the [official Tiller Docker images](https://github.com/orgs/helm/packages) to GitHub’s container registry.

We are deeply appreciative of GitHub’s tooling and their support for open source projects of all sizes.

Happy Birthday, Helm!
