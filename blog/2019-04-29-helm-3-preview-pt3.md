---
title: "Helm 3 Preview: Charting Our Future – Part 3: Chart Repositories"
slug: "helm-3-preview-pt3"
authors: ["mattfisher"]
date: "2019-04-29"
---

This is part 3 of 7 of our *Helm 3 Preview: Charting Our Future* blog series, discussing chart repositories. (Check out our previous blog post on the gentle goodbye to Tiller [here](https://helm.sh/blog/helm-3-preview-pt2/).)

At a high level, a Chart Repository is a location where Charts can be stored and shared. The Helm client packs and ships Helm Charts to a Chart Repository. Simply put, a Chart Repository is a basic HTTP server that houses an index.yaml file and some packaged charts.<!-- truncate -->

While there are several benefits to the Chart Repository API meeting the most basic storage requirements, a few drawbacks have started to show:

- Chart Repositories have a very hard time abstracting most of the security implementations required in a production environment. Having a standard API for authentication and authorization is very important in production scenarios.
- Helm’s Chart provenance tools used for signing and verifying the integrity and origin of a chart are an optional piece of the Chart publishing process.
- In multi-tenant scenarios, the same Chart can be uploaded by another tenant, costing twice the storage cost to store the same content. Smarter chart repositories have been designed to handle this, but it’s not a part of the formal specification.
- Using a single index file for search, metadata information, and fetching Charts has made it difficult or clunky to design around in secure multi-tenant implementations.

Docker’s [Distribution project](https://github.com/docker/distribution) (also known as Docker Registry v2) is the successor to the Docker Registry project, and is the de-facto toolset to pack, ship, store, and deliver Docker images. Many major cloud vendors have a product offering of the Distribution project, and with so many vendors offering the same product, the Distribution project has benefited from many years of hardening, security best practices, and battle-testing, making it one of the most successful unsung heroes of the open source world.

But did you know that the Distribution project was designed to distribute any form of content, not just container images?

Thanks to the efforts of the [Open Container Initiative (or OCI for short)](https://www.opencontainers.org/), Helm Charts can be hosted on any instance of Distribution. The work is experimental, with login support and other features considered "table stakes" for Helm 3 yet to be finished, but we're very excited to learn from previous discoveries that the OCI and Distribution teams have made over the years, learning through their mentorship and guidance on what it means to run a highly available service at scale.

I wrote a more detailed deep-dive on some of the [upcoming changes to Helm Chart Repositories](https://blog.bacongobbler.com/post/2019-01-25-distributing-with-distribution/) if you'd like to read more on the subject.

You can check out the next blog [here](https://helm.sh/blog/helm-3-preview-pt4/) where we discuss release management in the next part of our *Helm 3 Preview: Charting Our Future* blog series over the course of 4 weeks.
