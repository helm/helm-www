---
title: "Helm 2to3 is Now Unsupported"
slug: "helm2to3-becomes-unsupported"
authorname: "Martin Hickey"
author: "@hickeyma"
authorlink: "https://helm.sh"
date: "2024-07-16"
---

Over four years ago, we [introduced Helm 3](https://helm.sh/blog/helm-3-released/), a major evolution in Helm's development. And we [announced](https://helm.sh/blog/2019-10-22-helm-2150-released/) at that time that Helm 2 would receive patches and security updates for a year. We also provided a [migration path to Helm 3 from Helm 2](https://helm.sh/docs/topics/v2_v3_migration/) and a tool [helm-2to3](https://github.com/helm/helm-2to3) to automate migration.

One year later, [Helm 2 became unsupported](https://helm.sh/blog/helm-2-becomes-unsupported/).

Here we are, over 3 years since Helm 2 became unsupported. It would be expected that all users should be migrated to Helm 3 by this time. Following consensus among the Helm org maintainers, we are announcing today the official end of support for the [helm-2to3](https://github.com/helm/helm-2to3) tool.

In practice, this means that **Helm 2to3** will receive no more updates (not even security patches).

We strongly discourage the use of the [helm-2to3](https://github.com/helm/helm-2to3) tool moving forward, as it will be receiving no future security updates or patches. We hope that it has been a useful tool to aid in the migration from Helm 2 to 3.
