---
title: "Helm v2 Deprecation Timeline"
slug: "helm-v2-deprecation-timeline"
authors: ["bridgetkromhout"]
date: "2020-08-12"
---


_[with a nod to Lewis Carroll...](https://www.jabberwocky.com/carroll/walrus.html)_

    “The time has come,” the maintainers said,
      “To talk of software fates:
    Of upgrades -- and shipping Helm v3 --
      Of bugfixes -- and k8s --”

[Helm v3 was released in November 2019](/blog/helm-3-released/), the result of ongoing community effort to evolve Helm to meet the community’s needs. With a streamlined client-only experience, a renewed focus on security, and tighter integration with Kubernetes APIs, Helm v3 continues to provide production-tested package management for Kubernetes. And as a [graduated CNCF project](/blog/celebrating-helms-cncf-graduation/), Helm is a key part of the cloud native ecosystem.
<!-- truncate -->

We recognize that rolling out a major version change in production requires time. The Helm maintainers committed to providing bugfixes for Helm v2 until May 2020 (which they [extended to August 2020](/blog/covid-19-extending-helm-v2-bug-fixes/)) and security patches for Helm v2 until November 2020. And now the bugfix window is closing; [Helm v2.16.10](https://github.com/helm/helm/releases/tag/v2.16.10) will be the final bugfix release and 2.17.0 will follow with the [download location updated](https://github.com/helm/helm/issues/8346).

## What does this mean for Helm users?

_After August 13, 2020, you will see these changes:_
- If you’re still using Helm v2, you will want to [migrate to Helm v3](/blog/migrate-from-helm-v2-to-helm-v3/) now. Helm 3.2.4 is widely used and production-ready. While largely backwards-compatible, there are specific changes you’ll want to be aware of when carrying out your migration.
- Starting now, ongoing support of Helm v2 is limited to the next three months of security patches. That means we will no longer be accepting pull requests for anything but verified security issues.
- The `stable` and `incubator` repos will be de-listed from the Helm Hub, [introduced in December 2018](/blog/intro-helm-hub/). Find your preferred repositories on [Helm Hub](https://hub.helm.sh) to add them to your configs, and [track the migration of charts to their new decentralized locations](https://github.com/helm/charts/issues/21103).


_After November 13, 2020, you will see these changes:_
- No further Helm v2 releases (even for security patches)
- No further updates to [Helm v2 documentation](https://v2.helm.sh/docs), which will remain available for the present time but may be discontinued
- Existing and new issues/PRs that are v2-specific will be closed
- [Transitioning Helm release and chart hosting ownership to CNCF](https://github.com/helm/community/issues/114)

| | |
| - | - |
| To Be Removed | Replacement |
| Download links for the Helm v2 client through Google Cloud Storage | Client downloads through [get.helm.sh](/blog/get-helm-sh/)|
| Docker image for Tiller stored in Google Container Registry | We will distribute a Tiller image that will be [made available at an alternative location](https://github.com/helm/helm/issues/8346) which can be updated with helm init --tiller-image. |
| Google Cloud buckets for the stable and incubator chart repositories | “Stable” and “incubator” repositories discontinued; https://github.com/helm/charts marked as obsolete |

The community has found Helm v3 to be a vastly improved experience, and community resources like the [helm-2to3 plugin](https://github.com/helm/helm-2to3) are available to assist you in your essential migration. Please ensure that you migrate to Helm v3 before the November 13th deadline, as operating software which no longer receives security patches is a risk best avoided.

We want to take this moment to thank everyone in the community who has used Helm or contributed an issue or pull request to help improve it. Many great ideas that don’t fit into Helm itself have much success as [related ecosystem projects](/community/related). Every time you submit updates to the docs, you’re helping others get started and be more effective with Helm. Thank you all!
