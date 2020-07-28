---
title: "The History of the Project"
description: "Provides a high-level overview of the project's history."
aliases: ["/docs/history/"]
weight: 4
---

Helm 3 is a [CNCF project](https://www.cncf.io/projects/) in the [final stages
of
incubation](https://github.com/cncf/toc/blob/master/process/graduation_criteria.adoc).

Helm began as what is now known as [Helm
Classic](https://github.com/helm/helm-classic), a Deis project begun in 2015 and
introduced at the inaugural KubeCon.

In January of 2016, the project merged with a GCS tool called Kubernetes
Deployment Manager, and the project was moved under
[Kubernetes](https://kubernetes.io). As a result of the merging of codebases,
Helm 2.0 was released later that year. The key feature of Deployment Manager
that survived in Helm 2 was the server-side component, renamed from DM to Tiller
for the final Helm 2.0 release.

Helm was promoted from a Kubernetes subproject to a full-fledged CNCF project in
June, 2018. Helm formed a top-level governing body and several projects were
subsumed under the Helm project, including Monocular, the Helm Chart Repo, Chart
Museum, and later the Helm Hub.

When the Helm 3 development cycle began, Tiller was removed, bringing Helm
closer to its original vision of being a client tool. But Helm 3 continues to
track releases inside of the Kubernetes cluster, making it possible for teams to
work together on a common set of Helm releases.

Helm 3 was released in November 2019.
