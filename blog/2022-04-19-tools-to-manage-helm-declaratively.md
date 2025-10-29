---
title: "Tools You Can Use To Manage Your Helm Releases Declaratively"
slug: "tools-to-manage-helm-declaratively"
authors: ["scottrigby", "mattfarina"]
date: "2022-04-19"
---

We regularly get questions from people who want tools or methods to manage their Helm releases in an environment. This post provides some insight and direction to help people get started.

<!-- truncate -->

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

* [Flux Helm Controller](https://fluxcd.io/docs/components/helm/) - [Flux](https://fluxcd.io/) is a collection of projects that enable GitOps. One of the components provides a GitOps method to manage Helm releases. Flux natively supports Helm.
* [Argo CD](https://github.com/argoproj/argo-cd) - The [Argo](https://argoproj.github.io/) project defines itself as providing "Open source tools for Kubernetes to run workflows, manage clusters, and do GitOps right." Argo CD is focused on declarative continuous delivery and has the ability to work with Helm charts.

### Other Projects

There are many projects beyond the CNCF projects you can use to help you manage your Helm releases. The following set is an example and not exhaustive.

* [Helmfile](https://github.com/helmfile/helmfile) - A declarative spec for deploying Helm charts.
* [Captain](https://github.com/alauda/captain) - A Helm controller.
* [Terraform Helm provider](https://github.com/hashicorp/terraform-provider-helm) - Enables you to manage Helm charts through Terraform.
* [Orkestra](https://azure.github.io/orkestra/) - Built on other tools in this list, Orkestra adds a robust dependency graph for a related group of Helm releases and their subcharts, as well as a reverse DAG for specifying dependency requirements for rollbacks.
* [Fleet](https://github.com/rancher/fleet) - A GitOps tool chain that works with Kubernetes manifests, Helm charts, and Kustomize.

### High-Level Tool Comparison

There are some differences between the tools we've looked at so far. The following table provides some insight into their differences. This is not exhaustive and you should evaluate any tools you use yourself.

| | Retains Helm release info | Supports Helm hooks | OCI support | Does not require Helm binary |
| -- | -- | -- | -- | -- |
| Flux Helm controller | ✅ | ✅ | 🚫[^1] | ✅ |
| Argo CD | 🚫 | :warning:[^2] | ✅[^3] | 🚫 |
| Helmfile | ✅ | :warning:[^4] | :warning:[^5] | 🚫[^6] |
| Captain | ✅ | ✅ | :warning:[^7] | ✅ |
| Terraform Helm provider | ✅ | :warning:[^8] | ✅ | ✅ |
| Orkestra | ✅ | ✅ | 🚫[^9] | ✅ |
| Fleet | ✅ | ✅ | 🚫[^10] | ✅ |

_Note, this comparison is from when the blog post was published. Projects change over time and the feature set may change over time. You should evaluate the projects in their current state before choosing one._

## Conclusion

If you want to use a configuration manager with your Helm and Kubernetes configuration there are many choices. While the Helm project doesn't endorse one project over another, we do suggest using a configuration manager when it's appropriate.

[^1]: Because Flux makes full use of the Helm SDK, as of Helm v3.8.0 Flux is now unblocked to add OCI artifact integration (Flux team members helped finish bringing OCI support out of experimental into a full feature in Helm). [RFC-0002](https://github.com/fluxcd/flux2/tree/main/rfcs/0002-helm-oci) is now marked as implementable, and work on this is now in progress for Flux. You can follow this fluxcd/source-controller issue [#669](https://github.com/fluxcd/source-controller/issues/669) for progress.
[^2]: Because Argo does not retain Helm release information, there is an [attempt to map](https://argo-cd.readthedocs.io/en/stable/user-guide/helm/#helm-hooks) Helm hooks to ArgoCD hooks, however, there are far fewer Argo hooks and unmappable concepts such as no differentiation between install and upgrade. You can work around this by writing your charts specifically for ArgoCD, however hooks in commonly used community charts will not work.
[^3]: ArgoCD shells out to the Helm CLI, only to render templates. This has allowed Argo to turn on Helm CLI's OCI feature before it was finished, for the same reason that it can not support Helm features beyond templating. Because of this, OCI is not part of the ArgoCD source architecture.
[^4]: Helmfile has a custom concept of hooks, not necessarily mapped to Helm hooks. See readme [hooks section](https://github.com/helmfile/helmfile#hooks) and [this issue](https://github.com/roboll/helmfile/issues/1291) for clarification and work in progress.
[^5]: Helmfile has experimental OCI support, without explicitly explaining to users that it sets `HELM_EXPERIMENTAL_OCI=1` before shelling out to the Helm CLI. See [#2112](https://github.com/roboll/helmfile/issues/2112) and [#2111](https://github.com/roboll/helmfile/issues/2111).
[^6]: Helmfile parameterizes the Helm binary (default: `helm`).
[^7]: Captain relies on a related project [alauda/oci-chartrepo](https://github.com/alauda/oci-chartrepo) to mix concepts of using oci registry as helm chart repo.
[^8]: Terraform Helm provider has [some issues](https://github.com/hashicorp/terraform-provider-helm/issues/683) with Helm hooks and wait configurations.
[^9]: Orkestra leverages Flux Helm Controller to reconcile the releases. See the note above about Flux Helm controller OCI status. Once a full implementation is released in Flux, Orkestra will also support OCI.
[^10]: Fleet uses the Helm SDK. Once it uses a version of the Helm SDK that supports OCI registries, Fleet will inherit support.
