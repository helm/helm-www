---
layout: post
title: "New Governance And Elections"
permalink: "/blog/new-gov-and-elections/"
author: "Matt Farina"
authorlink: "https://mattfarina.com"
---

When Helm moved from being under Kubernetes to a CNCF project there was a need to create a governance structure. While under Kubernetes we relied on Kubernetes governance. To handle this we setup a [provincial governance](https://github.com/helm/community/blob/aa0586011786dfbc3993e7edd959a841241c96e3/governance/provisional-governance.md) with a goal of creating a long term one. After a few months we are happy to announce that the new governance structure as been written and approved.

The gist of the new governance is that it organizes those responsible into a couple groups (org and project maintainers), spells out their responsibilities, and provides for decision making processes. You can read all the details in the [governance doc (here)](https://github.com/helm/community/blob/master/governance/governance.md).

## Selecting Org Maintainers

The next step is to select the initial set of Org Maintainers. These individuals are responsible for elements such as the scope, vision, brand, code of conduct, owning security issues, finances, and other aspects of this nature. The project maintainers, as they have long been, are responsible for the technical decisions with regard to the codebases.

To handle this selection we are using the documented process in the governance. _Anyone who has contributed to the Helm GitHub organization can nominate one of the Project Maintainers to be an Org Maintainer._ This includes the Project Maintainers of Helm core, Charts, ChartMuseum, etc. The nomination period will be open for three weeks (closing on 9/28 at 12pm PT). We wanted org maintainers to be project maintainers so that they have shown they are vested in Helm by their actions.

After that the project maintainers will vote. How that vote works will depend on the number of nominated individuals, who they work for as no one company can have a majority of members, and some other rules.

To provide for a diverse representation from the projects in the initial selection of Org Maintainers the selected folks will include 3 Representatives from the Helm core project, 2 Representative from the Charts project, and 2 Representatives from another Helm project. The initial election will create a total of 7 Org Maintainers. The length of their terms is open ended and how changes happen is documented in the governance.

If there are any questions about the process or to nominate someone please use the [Helm mailing list](https://lists.cncf.io/g/cncf-helm).