---
title: "Tools You Can Use To Manage Your Helm Releases Declaratively"
slug: "tools-to-manage-helm-declaratively"
authorname: "Scott Rigby, Matt Farina"
author: "@scottrigby, @mattfarina"
authorlink: "https://helm.sh"
date: "2022-03-17"
---

We regularly get questions from people who want tools or methods to manage their Helm releases in an environment. This post provides some insight and direction to help people get started.

<!--more-->

## Why Helm Doesn't Have Tools To Do This

You might wonder, why doesn't Helm provide tools to do this out of the box?

Helm is a package manager. We often compare it to package managers for other platforms like apt, yum, zipper, homebrew, and others. All of these projects, Helm included, keep their scope within the realm of package management.

Managing how instances of packages are run in an environment is a separate concern and one people have varying ideas about. For example, some people use Ansible, others use Terraform, some use both, and some use something entirely different. Different tools can even use different methods (e.g. some are push based and others pull based). _All of these are able work with the same package managers._

The Helm project strives to provide a package manager that works well with various other tools that can use a variety of different methods to manage releases.

## Declarative and Imperative

In the Kubernetes space we talk about _declarative_ management. If you're not familiar with the concept, here is a brief explanation.

With declarative management you _declare_ to the _system_ what you want the end state to look like. For example, that you want X number of instances of your workload to be running. The system then works to make this a reality and usually reports status on the progress of making the declared status a reality. Over time, the way the system makes the declared state a reality can change without the need for what you declare or the status of the progress to change.

Imperative management has to do with telling the system what to do step by step. Instead of declaring what you want you tell the system each step to take to achieve the end goal.

Kubernetes provides a means to do both [declarative and imperative management of resources](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/). As the Kubernetes community tends to prefer declarative management, when possible, the rest of this post is going to focus on declarative tools you can use with Helm.

## Tools

The Kubernetes ecosystem has produced numerous projects of various styles to help you declaratively manage your Helm releases. To illustrate the options we will look at sister projects to Helm in the Cloud Native Computing Foundation (CNCF) and some more general open source projects. You can find more options in the [CNCF Landscape](https://landscape.cncf.io/).

### CNCF Projects

The scope of this section is limited to [graduated and incubating](https://www.cncf.io/projects/) CNCF projects. There are over 100 CNCF projects and many of them are [sandbox projects](https://www.cncf.io/sandbox-projects/). You can learn more about the differences between types of projects in the [maturity level explanation](https://www.cncf.io/projects/#maturity-levels). The following projects are worth looking at:

* [Flux Helm Controller](https://fluxcd.io/docs/components/helm/) - [Flux](https://fluxcd.io/) is a collection of projects that enable GitOps. One of the components provides a GitOps method to manage Helm releases.
* [Argo CD](https://github.com/argoproj/argo-cd) - The [Argo](https://argoproj.github.io/) project defines itself as providing "Open source tools for Kubernetes to run workflows, manage clusters, and do GitOps right." Argo CD is focused on declarative continuous delivery and has the ability to work with Helm charts.

### Other Projects

There are many projects beyond the CNCF projects you can use to help you manage your Helm releases. The following set is an example and not exhaustive.

* [Helmfile](https://github.com/roboll/helmfile)
* [Captain](https://github.com/alauda/captain)
* [Helm Provider for Terraform](https://github.com/hashicorp/terraform-provider-helm)

### High-Level Tool Comparison

There are some differences between the tools we've looked at so far. The following table provides some insight into their differences. This is not exhaustive and you should evaluate any tools you use yourself.

| | Retains Helm release info | Supports Helm hooks | OCI support |
| -- | -- | -- | -- |
| Helmfile | ✅ | ❓[^1] | 🚫 |
| Terraform Helm provider | ✅ | ✅[^2] | 🚫[^3] |
| Captain Helm controller | ✅ | ❓[^4] | 🚫[^5] |
| Flux Helm controller | ✅ | ✅  | 🚫[^6] |
| ArgoCD | 🚫 | 🚫[^7] | ✅[^8] |

[^1]: Has a custom concept of hooks, not necessarily mapped to Helm hooks. See readme [hooks section](https://github.com/roboll/helmfile#hooks) and [this issue](https://github.com/roboll/helmfile/issues/1291) for clarification and work in progress.
[^2]: Note there are [some issues](https://github.com/hashicorp/terraform-provider-helm/issues/683) with Helm hooks and wait configurations
[^3]: See hashicorp/terraform-provider-helm issues [#633](https://github.com/hashicorp/terraform-provider-helm/issues/633), [#666](https://github.com/hashicorp/terraform-provider-helm/issues/666), [#827](https://github.com/hashicorp/terraform-provider-helm/issues/827), [#765](https://github.com/hashicorp/terraform-provider-helm/issues/765), and [#655](https://github.com/hashicorp/terraform-provider-helm/issues/655).
[^4]: This is not a very widely used project, so unclear which or how well Helm hooks are supported. Scott may want to have another chat with the maintainer (TO-DO: fold in this [reminder code](https://github.com/alauda/captain/blob/master/pkg/helm/printer.go#L23) in a simple way)
[^5]: Relies on a related project [alauda/oci-chartrepo](https://github.com/alauda/oci-chartrepo) to mix concepts of using oci registry as helm chart repo
[^6]: Because Flux makes full use of the Helm SDK, as of Helm v3.8.0 Flux is now unblocked to add OCI artifact integration (Flux team members helped finish bringing OCI support out of experimental into a full feature in Helm). Work on this is in progress for Flux. You can follow this [canonical issue](https://github.com/fluxcd/source-controller/issues/124) for progress. See the current [design doc](https://hackmd.io/HS9ZqSCWQNqSefdaWFylJQ?view) for details.
[^7]: Because Argo does not retain Helm release information, there is an [attempt to map](https://argo-cd.readthedocs.io/en/stable/user-guide/helm/#helm-hooks) Helm hooks to ArgoCD hooks, however, there are far fewer Argo hooks and unmappable concepts such as no differentiation between install and upgrade. You can work around this by writing your charts specifically for ArgoCD, however hooks in commonly used community charts will not work.
[^8]: ArgoCD shells out to the Helm CLI, only to render templates. This has allowed Argo to turn on Helm CLI's OCI feature before it was finished, for the same reason that it can not support Helm features beyond templating. Because of this, OCI is not part of the ArgoCD source architecture.

