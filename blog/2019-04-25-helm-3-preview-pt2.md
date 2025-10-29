---
title: "Helm 3 Preview: Charting Our Future – Part 2: A Gentle Farewell to Tiller"
slug: "helm-3-preview-pt2"
authors: ["mattfisher"]
date: "2019-04-25"
---

This is part 2 of 7 of our *Helm 3 Preview: Charting Our Future* blog series. (Check out our previous blog post on the history of Helm [here](https://helm.sh/blog/helm-3-preview-pt1/).)

During the Helm 2 development cycle, we introduced Tiller as part of our integration with Google's Deployment Manager. Tiller played an important role for teams working on a shared cluster - it made it possible for multiple different operators to interact with the same set of releases.<!-- truncate -->

With role-based access controls (RBAC) enabled by default in Kubernetes 1.6, locking down Tiller for use in a production scenario became more difficult to manage. Due to the vast number of possible security policies, our stance was to provide a permissive default configuration. This allowed first-time users to start experimenting with Helm and Kubernetes without having to dive headfirst into the security controls. Unfortunately, this permissive configuration could grant a user a broad range of permissions they weren't intended to have. DevOps and SREs had to learn additional operational steps when installing Tiller into a multi-tenant cluster.

After hearing how community members were using Helm in certain scenarios, we found that Tiller's release management system did not need to rely upon an in-cluster operator to maintain state or act as a central hub for Helm release information. Instead, we could simply fetch information from the Kubernetes API server, render the Charts client-side, and store a record of the installation in Kubernetes.

Tiller’s primary goal could be accomplished without Tiller, so one of the first decisions we made regarding Helm 3 was to completely remove Tiller.

With Tiller gone, the security model for Helm is radically simplified. Helm 3 now supports all the modern security, identity, and authorization features of modern Kubernetes. Helm's permissions are evaluated using your [kubeconfig file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/). Cluster administrators can restrict user permissions at whatever granularity they see fit. Releases are still recorded in-cluster, and the rest of Helm's functionality remains.

Read the next blog post [here](https://helm.sh/blog/helm-3-preview-pt3/) where we discuss chart repositories in the next part of our *Helm 3 Preview: Charting Our Future* blog series over the course of 4 weeks.
 
