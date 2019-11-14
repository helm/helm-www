---
title: "Helm 3.0.0 has been released!"
slug: "helm-3-released"
authorname: "Matthew Fisher"
author: "@bacongobbler"
authorlink: "https://blog.bacongobbler.com"
date: "2019-11-13"
---

The Helm Team is proud to announce the first stable release of Helm 3.

Helm 3 is the latest major release of the CLI tool. Helm 3 builds upon the success of Helm 2, continuing to meet the needs of the evolving ecosystem.

The internal implementation of Helm 3 has changed considerably from Helm 2. The most apparent change is the removal of Tiller, but it's worth checking out the other changes by diving into the new release. A rich set of new features have been added as a result of the community's input and requirements. Some features have been deprecated or refactored in ways that make them incompatible with Helm 2. Some new experimental features have also been introduced, including OCI support.

Additionally, the Helm Go SDK has been refactored for general use. The goal is to share and re-use code we've open sourced with the broader Go community. We are actively looking for feedback from other engineers integrating Helm in their own projects, and would love to hear from you in the [#helm-dev Kubernetes Slack channel](https://slack.k8s.io/).

Here are some Helm 3 resources:

- [Documentation](https://helm.sh/docs/)
- [FAQ: Changes since Helm 2](https://helm.sh/docs/faq/#changes-since-helm-2)
- [Installing Helm](https://helm.sh/docs/intro/install/)
- [Documentation on Helm 2 to Helm 3 migration](https://helm.sh/docs/topics/v2_v3_migration/)
- [Plugin to help migrate from Helm 2 to Helm 3](https://github.com/helm/helm-2to3)
- Chat with developers and contributors in the [#helm-users Kubernetes Slack channel](https://slack.k8s.io/)
- Please report bugs at <https://github.com/helm/helm/issues>

## What is Helm?

Helm gives teams the tools they need to collaborate when creating, installing, and managing applications inside of Kubernetes.

With Helm, you can...

- Find prepackaged software (charts) to install and use
- Easily create and host your own packages
- Install packages into any Kubernetes cluster
- Query the cluster to see what packages are installed and running
- Update, delete, rollback, or view the history of installed packages

Helm makes it easy to run applications inside Kubernetes.

## Let's see it!

Assuming you have a Kubernetes cluster running and a correctly configured `kubectl`, working with Helm is a piece of cake.

Helm makes it easy to search for new charts by adding repositories hosted by the community.

```bash
$ helm repo add nginx https://helm.nginx.com/stable
```

Once you've added a few repositories, you can search for charts:

```bash
$ helm search repo nginx-ingress
NAME                    CHART VERSION   APP VERSION     DESCRIPTION
nginx/nginx-ingress     0.3.7           1.5.7           NGINX Ingress Controller
```

Helm gives you a quick way to install that chart with `helm install`:

```bash
$ helm install my-ingress-controller nginx/nginx-ingress
```

If we inspect the cluster with `kubectl`:

```bash
$ kubectl get deployments
```

We have an ingress controller running! We can just as easily remove it with `helm uninstall my-ingress-controller`.

Okay. You've tried some charts. You've customized a few. And now you're ready to build your own. Helm makes that part easy, too.

```bash
$ helm create diy
Creating diy
```

Now you have a new chart named `diy`. You could go to that directory and edit it, run `helm template` to view the rendered output, or install it with `helm install`.

Want to submit it upstream to the [Helm Hub](https://hub.helm.sh/)? Please do! Make sure to follow the documentation on [adding your own repositories](https://github.com/helm/hub/blob/master/Repositories.md) to the Helm Hub.

## What changed in Helm 3?

You may be asking yourself at this point:

> How did the workflow change from Helm 2? If I run those commands with Helm 2, will I see the same output?

Helm 2 described a workflow for creating, installing, and managing charts. Helm 3 builds upon that workflow, changing the underlying infrastructure to meet the needs of the evolving ecosystem.

If you're comfortable with Helm 2, you'll feel right at home with Helm 3.

To learn more about what changed under the hood, [check out the FAQ](https://helm.sh/docs/faq/) in the documentation. A list of changes and explanations for the changes involved are provided there.

## The Future of Helm

The core maintainers are really excited to release Helm 3.0. Helm's next phase of development will see new features targeted toward stability and enhancements to existing features. Features on the road map include:

- Enhanced functionality for `helm test`
- Improvements to Helm's OCI integration
- Enhanced functionality for the Go client libraries

### Helm 2 Support Plan

In the Helm 2.15.0 release announcement, we shared details about the future plans for Helm 2. You can read more about those plans in [the announcement post](https://helm.sh/blog/2019-10-22-helm-2150-released/).

## Relation of Helm 3 to Helm 1 and 2

In November 2015, the first version of Helm was released at the first KubeCon. Modeled on the macOS software installer [Homebrew](https://brew.sh/), Helm 1 (known by the team as "Helm Classic") was designed to help individual developers create packages of Kubernetes resources and deploy them into a cluster.

A few months later (January 2016), Deis’ core Helm team joined forces with Google, Skippbox, and (shortly thereafter) Bitnami to produce a new version of Helm that shifted emphasis from individuals to teams. Along the way, we applied many of the lessons we’d learned. The result was a tool designed to not only make teamwork a central value, but also meet the needs of a burgeoning community of Kubernetes users who are installing sophisticated applications.

In June 2018, Helm [joined the Cloud Native Computing Foundation](https://helm.sh/blog/helm-enters-the-cncf/). Helm 3 became a joint community effort, with core maintainers including members from Microsoft, Samsung SDS, IBM, and Blood Orange. Since the first alpha release, Helm 3 has seen contributions from 37 different members of the community, spanning across many time zones. The end result is a tool that reflects the needs of its community as those change and evolve over time.

## Conclusion

We set out to build a tool that is an on-ramp to Kubernetes. We wanted to make it easier for the Kubernetes user to create, share, and run production-grade workloads.

Over 500 community members have contributed code to the Helm CLI since its inception. Thousands of community members actively maintain charts on the Helm Hub. There are a countless number of active community members. This is a credit to the colossal efforts of the Kubernetes community which has transformed this project from a simple Deis installer into a power tool for all Kubernetes users.

Thank you all, and see you on GitHub!

- The Helm Team :heart: