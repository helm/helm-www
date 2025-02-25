---
title: "Celebrating Helm's CNCF Graduation"
slug: "celebrating-helms-cncf-graduation"
authorname: "Matt Butcher"
author: "@technosophos"
authorlink: "https://twitter.com/technosophos"
date: "2020-04-30"
twittertype: "summary_large_image"
twitterimage: "blog/images/helmgraduation-twitter.png"
---

![../images/helmgraduation.png](/blog/images/helmgraduation.png)

Today we are happy to see Helm [reach the final stage of the CNCF ladder](https://www.cncf.io/announcement/2020/04/30/cloud-native-computing-foundation-announces-helm-graduation/). Helm has moved from the incubating level to the graduated level as a [CNCF project](https://www.cncf.io/projects/), alongside Kubernetes and other select projects.

Given Helm's humble beginnings as a hackathon project at Deis, a small startup, we are ecstatic to see our little baby all grown up. And we have certainly learned a lot about coding, community, and organizational politics over the last five years. But those are not the big reasons why we are celebrating Helm's graduation.

Several months after Helm got started, we became a sub-project of Kubernetes itself. It was early 2016, and in short order we had gone from a side project to a viable package manager in the Kubernetes ecosystem. While Kubernetes had focused on the SRE and DevOps story, not masking complexity, Helm took a different approach. During a meeting in February of 2016, [Michelle Noorali](https://twitter.com/michellenoorali) wrote the following phrase on our whiteboard: "Zero to dopamine in five minutes." That was our Helm mantra: We saw an opportunity to make Kubernetes more approachable to newcomers. If we did things right, users could install Helm and then within minutes be installing production-grade off-the-shelf components.

These days, Helm is [used by over 70% of Kubernetes users](https://www.cncf.io/wp-content/uploads/2020/03/CNCF_Survey_Report.pdf), from college students to major cloud providers. But we are most proud when we hear stories of Kubernetes newcomers getting up and running quickly because of Helm.

Be that as it may, Helm's graduation marks a second distinction. Since the first commits to Helm, we called it "the package manager for Kubernetes," meaning that our overall design focus would be enabling redistribution, installation, upgrade, and deletion of bundles of Kubernetes resource definitions. Our goal was to be for Kubernetes what homebrew is to macOS, apt-get is to Debian/Ubuntu, and Chocolatey is to Windows.

At the time, it seemed like a modest goal. After all, Kubernetes (at version 1.2) had very few users. But Kubernetes exploded in popularity. A few notable companies began running it in production. Then major cloud providers built hosted Kubernetes offerings. And then large enterprises known for focusing on stability rather than shininess also began using Kubernetes in earnest. This was an acid test for Helm. Could we meet the needs of hundreds of thousands of users, all with different goals and desires? It appears so.

The term "graduation" confers the idea that a notable set of requirements has been completed. While we are thrilled to have a tremendous user base, CNCF publishes a list of criteria designed to test for enterprise-readiness. Stability, security, healthy governance, strong community -- these things are an absolute necessity if a large open source project is to succeed.

CNCF states that [projects](https://www.cncf.io/projects/) can only graduate when they demonstrate that they are ready for the mainstream majority of users. The list of criteria for moving from incubation to graduation defines what it means to be a stable open source project. Helm took the graduation criteria to heart. Helm didn't just pass our security review, we did so with flying colors. We didn't just qualify for the [CII badge](https://bestpractices.coreinfrastructure.org/en), we scored a [198% on the certification test](https://bestpractices.coreinfrastructure.org/en/projects?q=helm%20package%20manager). While we only needed two committers from two different companies, we have many, many contributors from all over the globe. And over the years we have repeatedly demonstrated our commitment to open and fair governance.

And so we stand at this milestone. We completed the last requirement for graduation: the CNCF Technical Oversight Committee (TOC) has voted by supermajority in agreement that Helm is now a top-level project.

So what changes are in store for Helm in the future? Process-wise, things will remain as they already are. We will continue our unwavering commitment to stability and compatibility from major version to major version. We have begun the very earliest investigations into what Helm 4 may have in store. And we are (as always) eager to welcome new participants into our community, from helpful users who want to share their experiences through seasoned experts who wish to contribute substantial time to the upkeep of the project. Moreover, we are excited for the [CNCF's Artifact Hub](https://devclass.com/2020/03/12/cncf-starts-new-artifact-hub/) project, which we believe will truly bring together several major movements within CNCF. We are excited to continue working with CNCF's community.

We would like to continue our tradition of ending our Helm articles with a huge thank-you to the tens of thousands of community members who have, in ways small and large, contributed to the success of Helm. Here's to many more years of providing that "zero to dopamine in five minutes" experience to all Kubernetes users!


