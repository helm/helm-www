---
title: "Helm 2 and the Charts Project Are Now Unsupported"
slug: "helm-2-becomes-unsupported"
authorname: "Matt Butcher"
author: "@technosophos"
authorlink: "https://technosophos.com"
date: "2020-11-13"
---

A year ago, we [introduced Helm 3](https://helm.sh/blog/helm-3-released/), a major evolution in Helm's development. And we [announced](https://helm.sh/blog/2019-10-22-helm-2150-released/) at that time that Helm 2 would receive patches and security updates for a year.

Here we are, one year later. Friday the 13th, 2020 seems like a fitting day to end support for a major version. And today, we are announcing the official end of support for Helm 2. The charts repository is also now read-only, with no further changes.

From this point forward, the Helm team will devote all of its energy to Helm 3 and our ecosystem tools.

In practice, this means the following:

- **Helm 2** will receive no more updates (not even security patches).
- The **Helm Charts** [GitHub project](https://github.com/helm/charts) will receive no more updates.
- The Helm **Stable and Incubator charts** repositories have been moved to an archive. See [our blog post](https://helm.sh/blog/new-location-stable-incubator-charts/) for more.
- **Helm 3** will [continue](https://github.com/helm/helm/releases) to add new features, fix bugs, and address security issues.
- [Other Helm projects](https://github.com/helm) like our **GitHub actions** will continue feature development as well.
- **Artifact Hub** is now the official location for [finding Helm charts](https://artifacthub.io/).

We strongly discourage continued use of Helm 2, as it will be receiving no future security updates or patches. But if you need more time to migrate, we strongly encourage you to upgrade to Helm [2.17.0](https://github.com/helm/helm/releases/tag/v2.17.0), which has the final patches. For more, [check out the migration documentation](https://helm.sh/docs/topics/v2_v3_migration/).

Finally, I would like to close with a heartfelt word of thanks to the dedicated people who have contributed to Helm and Charts over the years.