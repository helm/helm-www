---
title: "Announcing get.helm.sh"
slug: "get-helm-sh"
authors: ["mattfisher"]
date: "2019-06-10"
---

The Helm Client has long been available to download from Google Cloud Storage at the bucket <https://kubernetes-helm.storage.googleapis.com>. This bucket in Google Cloud has been used by Helm since before Kubernetes was part of the CNCF. The first release hosted on this bucket was Helm v2.0.0-alpha.5!

Google has long been gracious in providing funding for this location. Since Helm started using it, Helm (as part of Kubernetes) moved into the CNCF, and then moved out from under the Kubernetes umbrella, becoming a sister project to Kubernetes within the CNCF.<!-- truncate -->

The CNCF is in the process of taking over the infrastructure for Kubernetes. It was time for Helm to move from a location funded by Google to one funded by the CNCF. Google Cloud buckets cannot be transferred between projects, which meant we could not transfer the bucket over to a CNCF account. We needed to move to a new location as part of the move.

## Where are we now?

The Helm project now publishes client downloads to <https://get.helm.sh>. All Helm releases from Helm v2.0.0-alpha.5 onwards are available for download, as well as the latest Helm 3 alpha.1 release.

For backwards compatibility concerns, new releases of Helm 2 will continue to be published at the old URL, however we strongly encourage users to migrate.

Going forward, this is the only location where you will find Helm 3; they are not being uploaded to the old storage bucket. Helm 3.0.0-alpha.1 builds are available there now.

## What do I need to do?

If you're using the old URL in your CI pipeline, you can replace <https://kubernetes-helm.storage.googleapis.com/kubernetes-helm> with <https://get.helm.sh>.

If you're using [the get script](https://helm.sh/docs/using_helm/#from-script), it is now [pulling from the new URL](https://github.com/helm/helm/blob/2ca025d48222d6fa188653e2ca5eda6ed799145c/scripts/get#L114), so no changes on your end are required.

All the download URLs in our [GitHub releases](https://github.com/helm/helm/releases) have also been changed to use the new URL.

## What's under the hood?

`get.helm.sh` has three main components:

1. [Azure Blob Storage](https://azure.microsoft.com/en-ca/services/storage/blobs/)
1. [Azure CDN](https://azure.microsoft.com/en-ca/services/cdn/)
1. The domain name `get.helm.sh`

In our release pipeline, Helm 2 and Helm 3 downloads are [uploaded to Azure Blob Storage](https://github.com/helm/helm/commit/022c8869bee37d02cf01507c11c6cfc6d58a1eca) (Helm 2 downloads are also [uploaded to Google Cloud Storage](https://github.com/helm/helm/commit/95775d0c60804b3d3674510e1f57a30ca8074ddd) for backwards compatibility). Azure CDN serves that content, which is fronted with a custom domain name.

## Why the new location?

As part of the move, we started considering some new features the community has been asking for:

### An official helm.sh URL

During this transition, we wanted to ensure that we won't disrupt users a second time, asking them to change their deployment pipelines to point to a new location. We decided to place a URL we control in front of the storage provider. This way, we do not need to ask users to switch URLs again in the future. If the underlying storage provider needs to change at some point in the future, we can have the URL point at the new location without this level of disruption going forward.

### Content delivery at the edge

<https://get.helm.sh> is fronted by [Azure CDN](https://azure.microsoft.com/en-ca/services/cdn/), a Content Delivery Network that is globally available. This should provide faster downloads to those distributed around the world, not just to those located in the Eastern United States.

It also provides availability in regions that were previously unavailable, such as...

### Availability in China

China is a large market for the CNCF, and therefore a large market for Helm. Google Cloud Storage is not accessible in China, so users in that region interested in using Helm have set up mirrors to work around this problem.

This is an area of concern in particular around adoption: As a user, I am now relying on an unofficial mirror to fetch my downloads, which comes with a certain level of risk I would not be subject to if I were fetching from the official release page like every other user.

Azure CDN [can serve content to users in China](https://docs.microsoft.com/en-us/azure/cdn/cdn-china-delivery) using point-of-presence (POP) locations near China. With Helm downloads now available in China, we are seeing just how popular Helm is in that area thanks to...

### Download metrics

One of the questions that keep popping up in our minds was how users are consuming Helm on a daily basis. The core maintainers were interested in answering the following questions:

- what versions of Helm are being used?
- what regions of the world are using Helm today?
- How long does it take for the community to migrate over to a new version of Helm?
- How many users are downloading Helm 3 vs Helm 2?

Our new CDN provides a rich set of metrics can provide answers to these questions.

While these metrics are only available to core maintainers at this time, we are discussing how we can share these metrics with the community similar to <https://devstats.cncf.io/>.

## Caveat: Tiller and Chart downloads

Please note that this change is only for the Helm client downloads. Tiller has not moved from Google Container Registry, and the stable and incubator Helm chart repositories are still hosted on Google Cloud.


If you have any questions about this change, please let us know. More information on this change can be found under [issue #5663](https://github.com/helm/helm/issues/5663).
