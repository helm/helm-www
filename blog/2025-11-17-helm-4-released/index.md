---
title: "Helm 4 Released"
slug: "helm-4-released"
authors: ["mattfarina"]
date: "2025-11-17"
---

On Wednesday November 12th, during the [Helm 4 presentation at KubeCon + CloudNativeCon](https://sched.co/27Nme), [Helm v4.0.0](https://github.com/helm/helm/releases/tag/v4.0.0) was released. This is the first new major version of Helm in 6 years. <!-- truncate -->

## What's New

Helm v3 has served the Kubernetes community well for many years. During that time we saw new ways to use Helm, new applications installed via charts, the rise of [Artifact Hub](https://artifacthub.io/), and numerous tools that build on top of Helm. We also saw where we wanted to add features but the internal architecture of Helm didn't provide a path forward without breaking public APIs in the SDK. Helm 4 makes those changes to enable new features now and into the future.

Some of the new features include:

- Redesigned plugin system that supports Web Assembly based plugins
- Post-renderers are now plugins
- Server side apply is now supported
- Improved resource watching, to support waiting, based on kstatus
- Local Content-based caching (e.g. for charts)
- Logging via slog enabling SDK logging to integrate with modern loggers
- Reproducible/Idempotent builds of chart archives
- Updated SDK API including support for multiple chart API versions (new experimental v3 chart API version coming soon)

You can learn about more of the changes in the [Helm 4 Overview](/docs/overview).

## Helm v3 Support

When a major version of software comes out, it takes awhile to make the transition. Helm v3 will continue to be supported to enable a clean transition period. The dates of continued support are:

* Bug fixes until July 8th 2026.
* Security fixes until November 11th 2026.

Helm releases updates on Wednesdays (typically the 2nd Wednesday in a month) and these dates correspond with release schedule dates. During this time there will be **_NO_** features backported other than updates to the Kubernetes client libraries that enable support of new Kubernetes versions.

## Learn More

You can learn about the Helm changes in the [overview](/docs/overview) or find all the changes in the [full changelog](/docs/changelog). The documentation shares many more details as you can find all the ways Helm has stayed the same and the new features you can take advantage of.
