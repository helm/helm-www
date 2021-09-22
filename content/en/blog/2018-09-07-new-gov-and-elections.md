---
title: "New Governance And Elections"
slug: "new-gov-and-elections"
aliases: "/blog/2018-09-07-new-gov-and-elections/"
authorname: "Matt Farina"
authorlink: "https://mattfarina.com"
date: "2018-09-07"
---

Being a top level incubating CNCF project requires having a governance structure to ensure that there is a publicly documented process for making decisions regarding the project and the community. While Helm was under Kubernetes, we relied on Kubernetes governance. As part of the transition to CNCF, the Helm project is required to have its own governance structure. To handle this we set up a [provisional governance](https://github.com/helm/community/blob/aa0586011786dfbc3993e7edd959a841241c96e3/governance/provisional-governance.md) with a goal of creating a long term one. After a few months we are happy to announce that the new governance structure has been written and approved.  <!--more-->

The gist of the new governance is that it organizes those responsible into a couple groups (org and project maintainers), spells out their responsibilities, and provides for decision making processes. You can read all the details in the [governance doc (here)](https://github.com/helm/community/blob/main/governance/governance.md).

## Two Types of Maintainers

The new governance has two types of maintainers. **Project Maintainers** are those who maintain the code, documentation, websites, and so forth. There are currently several groups of maintainers for Helm core, Charts, ChartMuseum, Monocular, and Web/Docs. These are the same people who have been maintaining this work.

The second type of maintainer is the **Helm Org Maintainer**. These individuals are responsible for elements such as the scope, vision, brand, code of conduct, owning security issues, finances, and other aspects of this nature.

## Next Step: Selecting Helm Org Maintainers

The next step in the process is to select the initial Helm Org Maintainers. To handle this selection we are using the documented process in the governance. _Anyone who has contributed to the Helm GitHub organization can nominate one of the Project Maintainers to be a Helm Org Maintainer._ This includes the Project Maintainers of Helm core, Charts, ChartMuseum, etc. The nomination period will be open for three weeks (closing on 9/28 at 12pm PT). We wanted Helm Org Maintainers to be project maintainers so that they have shown they are vested in Helm by their actions.

After that the project maintainers will vote. How that vote works will depend on the number of nominated individuals, who they work for as no one company can have a majority of members, and some other rules.

To provide for a diverse representation from the projects in the initial selection of Helm Org Maintainers the selected folks will include 3 Representatives from the Helm core project, 2 Representative from the Charts project, and 2 Representatives representing another Helm project. The initial election will create a total of 7 Helm Org Maintainers. The length of their terms is open ended and how changes happen is documented in the governance.

If you have questions about the process, or how to nominate someone, please use the [Helm mailing list](https://lists.cncf.io/g/cncf-helm).
