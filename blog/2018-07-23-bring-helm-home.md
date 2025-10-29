---
title: "Bringing Helm Home"
slug: "bringing-helm-home"
authors: ["mattbutcher"]
date: "2018-07-23"
---

Earlier this summer, we announced that [Helm joined the CNCF](https://www.cncf.io/blog/2018/06/01/cncf-to-host-helm/) as an official incubating project. Part of that transition involves moving the Helm project out of the Kubernetes GitHub org and into its org. We’re excited to announce that we’ve completed that process. As of last week, we have moved the Helm code repository to [https://github.com/helm/helm](https://github.com/helm/helm).  <!-- truncate -->

Fun fact: This is the same GitHub repository where the Helm project first started. When we started Helm in 2015, we created the Helm organization in GitHub. But thanks to the enthusiastic support of the Kubernetes community, we migrated the entire codebase into the Kubernetes org in 2016. As a separate CNCF project with its own vibrant and growing ecosystem, it makes sense to once again have Helm back home in its own GitHub org.

Since the first beta release of Helm 2.0, we have pledged to keep Helm stable for users and developers alike. Before moving Helm into its new GitHub home, we tested to make sure that this would not break existing builds or existing tooling. Thanks to GitHub’s excellent support for repository moving, we believe we have maintained our stability promise.

Along with the main Helm source code repo, we have moved a few other Helm related repositories including [Charts](https://github.com/helm/charts), [Monocular](https://github.com/helm/monocular), [Community](https://github.com/helm/community), [ChartMuseum](https://github.com/helm/chartmuseum), and other Helm projects all under the official CNCF Helm GitHub org. This means the community can find all Helm related items under one GitHub org.

This isn’t our only big news since joining CNCF. Helm 3 is now underway, as developers begin adding new features. And soon we will announce a minor process change that will simplify the process of becoming a Helm contributor as we switch from requiring a CLA to a DCO.
