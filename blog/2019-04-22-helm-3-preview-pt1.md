---
title: "Helm 3 Preview: Charting Our Future – Part 1: A History of Helm"
slug: "helm-3-preview-pt1"
authors: ["mattfisher"]
date: "2019-04-22"
---
On October 15th, 2015, the project now known as Helm was born. Only one year later, the Helm community joined the Kubernetes organization as Helm 2 was fast approaching. In June 2018, the Helm community [joined the CNCF](https://www.cncf.io/blog/2018/06/01/cncf-to-host-helm/) as an incubating project. Fast forward to today, and Helm 3 is nearing its first alpha release.

In this series of seven blog posts over the next four weeks, I'll provide some history on Helm's beginnings, illustrate how we got where we are today, showcase some of the new features available for the first alpha release of Helm 3, and explain how we move forward from here.<!-- truncate -->

In order, I'll discuss:

1. The history of the creation of Helm
2. A Gentle Farewell to Tiller
3. Chart Repositories
4. Release Management
5. Changes to Chart Dependencies
6. Library Charts
7. What’s Next?

### A History of Helm

Let's get started. Part 1 of 7 of our *Helm 3 Preview: Charting Our Future* blog series is about the history of how Helm was created and evolved.

#### Helm was Born

Helm 1 began as an open source project created by Deis. We were a small startup company [acquired by Microsoft in the spring of 2017](https://blogs.microsoft.com/blog/2017/04/10/microsoft-acquire-deis-help-companies-innovate-containers/). Our other open source project - also called Deis - had a tool called [`deisctl`](https://github.com/deis/deis/tree/master/deisctl) that was used for (among other things) installing and operating the Deis platform on a [Fleet cluster](https://github.com/coreos/fleet). Fleet was one of the first "container orchestrator" platforms to exist at the time.

In mid-2015, we decided to shift gears, and the foundation of Deis (now re-named "Deis Workflow") moved from Fleet to Kubernetes. One of the first things we had to rewrite was the installation tool, `deisctl`. We used this tool to install and manage Deis Workflow on a Fleet cluster.

Modeled after package managers like Homebrew, apt, and yum, the focus of Helm 1 was to make it easy for users to package and install their applications on Kubernetes. We officially announced Helm in 2015 at the inaugural KubeCon in San Francisco.

Our first attempt at Helm worked, but had its fair share of limitations. It took a set of Kubernetes manifests - sprinkled with generators as YAML front-matter - and loaded the generated results into Kubernetes.

For example, to substitute a field in a YAML file, one would add the following to a manifest:

```
#helm:generate sed -i -e s|ubuntu-debootstrap|fluffy-bunny| my/pod.yaml
```

Makes you really happy that template languages exist today, eh?

For many reasons, this early Kubernetes installer required a hard-coded list of manifest files and performed only a small fixed sequence of events. It was painful enough to use that the Deis Workflow R&D team was having a tough time replatforming their product around it, but the seed of an idea was there. Our first attempt was a very successful learning opportunity: we learned that we were passionate about building pragmatic solutions that solved real day-to-day problems for our users.

Learning from our past mistakes, we started designing Helm 2.

#### Designing Helm 2

As 2015 wound to a close, a team from Google reached out to the Helm team. They, too, had been working on a similar tool for Kubernetes. Deployment Manager for Kubernetes was a port of an existing tool they used for Google Cloud Platform. Would we be interested, they asked, in spending a few days talking about similarities and differences?

In January 2016, the Helm and Deployment Manager teams sat down in Seattle to share some ideas. We walked out with a bold plan: merge the projects to create Helm 2. Along with Deis and Google, [SkippBox](https://github.com/skippbox) joined the development team, and we started work on Helm 2.

Our goal was to maintain Helm's ease of use, but add the following:

- Chart templates for customization
- In-cluster management for teams
- A first-class chart repository
- A stable and signable package format
- A strong commitment to semantic versioning and retaining backward compatibility version-to-version

To accomplish these goals, we added a second component to the Helm ecosystem. This in-cluster component was called Tiller, and it handled installing and managing Helm charts.

Since the release of Helm 2 in 2016, Kubernetes added several major features. Role-Based Access Control (RBAC) was added and eventually replaced Attribute-Based Access Control (ABAC). Many new resource types were introduced (Deployments were still in beta at the time). Custom Resource Definitions (then called Third Party Resources, or TPRs) were invented. And most importantly, a set of best practices emerged.

Throughout all of these changes, Helm continued to serve the needs of Kubernetes users. After 3 years and many new feature additions, it became a good idea to introduce some major changes to the code base so that Helm would continue to meet the needs of this evolving ecosystem.

This brings us to Helm 3 --  check out our next blog post [here](https://helm.sh/blog/helm-3-preview-pt2/) where we discuss the fate of Tiller in our *Helm 3 Preview: Charting Our Future* blog series over the course of 4 weeks. 

