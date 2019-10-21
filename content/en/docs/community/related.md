---
title: "Related Projects and Documentation"
description: "third-party tools, plugins and documentation provided by the community!"
weight: 3
---

The Helm community has produced many extra tools, plugins, and documentation about
Helm. We love to hear about these projects. If you have anything you'd like to
add to this list, please open an [issue](https://github.com/helm/helm/issues)
or [pull request](https://github.com/helm/helm/pulls).

## Article, Blogs, How-Tos, and Extra Documentation

- [Using Helm to Deploy to Kubernetes](https://daemonza.github.io/2017/02/20/using-helm-to-deploy-to-kubernetes/)
- [Honestbee's Helm Chart Conventions](https://gist.github.com/so0k/f927a4b60003cedd101a0911757c605a)
- [Deploying Kubernetes Applications with Helm](http://cloudacademy.com/blog/deploying-kubernetes-applications-with-helm/)
- [Releasing backward-incompatible changes: Kubernetes, Jenkins, Prometheus Operator, Helm and Traefik](https://medium.com/@enxebre/releasing-backward-incompatible-changes-kubernetes-jenkins-plugin-prometheus-operator-helm-self-6263ca61a1b1#.e0c7elxhq)
- [CI/CD with Kubernetes, Helm & Wercker ](http://www.slideshare.net/Diacode/cicd-with-kubernetes-helm-wercker-madscalability)
- [The missing CI/CD Kubernetes component: Helm package manager](https://hackernoon.com/the-missing-ci-cd-kubernetes-component-helm-package-manager-1fe002aac680#.691sk2zhu)
- [The Workflow "Umbrella" Helm Chart](https://deis.com/blog/2017/workflow-chart-assembly)
- [GitLab, Consumer Driven Contracts, Helm and Kubernetes](https://medium.com/@enxebre/gitlab-consumer-driven-contracts-helm-and-kubernetes-b7235a60a1cb#.xwp1y4tgi)
- [Writing a Helm Chart](https://www.influxdata.com/packaged-kubernetes-deployments-writing-helm-chart/)
- [Creating a Helm Plugin in 3 Steps](http://technosophos.com/2017/03/21/creating-a-helm-plugin.html)

## Video, Audio, and Podcast

- [CI/CD with Jenkins, Kubernetes, and Helm](https://www.youtube.com/watch?v=NVoln4HdZOY): AKA "The Infamous Croc Hunter Video".
- [KubeCon2016: Delivering Kubernetes-Native Applications by Michelle Noorali](https://www.youtube.com/watch?v=zBc1goRfk3k&index=49&list=PLj6h78yzYM2PqgIGU1Qmi8nY7dqn9PCr4)
- [Helm with Michelle Noorali and Matthew Butcher](https://gcppodcast.com/post/episode-50-helm-with-michelle-noorali-and-matthew-butcher/): The official Google CloudPlatform Podcast interviews Michelle and Matt about Helm.

## Helm Plugins

- [Technosophos's Helm Plugins](https://github.com/technosophos/helm-plugins) - Plugins for GitHub, Keybase, and GPG
- [helm-template](https://github.com/technosophos/helm-template) - Debug/render templates client-side
- [Helm Value Store](https://github.com/skuid/helm-value-store) - Plugin for working with Helm deployment values
- [Helm Diff](https://github.com/databus23/helm-diff) - Preview `helm upgrade` as a coloured diff
- [helm-env](https://github.com/adamreese/helm-env) - Plugin to show current environment
- [helm-last](https://github.com/adamreese/helm-last) - Plugin to show the latest release
- [helm-nuke](https://github.com/adamreese/helm-nuke) - Plugin to destroy all releases
- [App Registry](https://github.com/app-registry/helm-plugin) - Plugin to manage charts via the [App Registry specification](https://github.com/app-registry/spec)
- [helm-secrets](https://github.com/futuresimple/helm-secrets) - Plugin to manage and store secrets safely
- [helm-edit](https://github.com/mstrzele/helm-edit) - Plugin for editing release's values
- [helm-gcs](https://github.com/nouney/helm-gcs) - Plugin to manage repositories on Google Cloud Storage
- [helm-github](https://github.com/sagansystems/helm-github) - Plugin to install Helm Charts from Github repositories
- [helm-monitor](https://github.com/ContainerSolutions/helm-monitor) - Plugin to monitor a release and rollback based on Prometheus/ElasticSearch query
- [helm-k8comp](https://github.com/cststack/k8comp) - Plugin to create Helm Charts from hiera using k8comp
- [helm-hashtag](https://github.com/balboah/helm-hashtag) - Plugin for tracking docker tag hash digests as values
- [helm-unittest](https://github.com/lrills/helm-unittest) - Plugin for unit testing chart locally with YAML

We also encourage GitHub authors to use the [helm-plugin](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories)
tag on their plugin repositories.

## Additional Tools

Tools layered on top of Helm.

- [Quay App Registry](https://coreos.com/blog/quay-application-registry-for-kubernetes.html) - Open Kubernetes application registry, including a Helm access client
- [Chartify](https://github.com/appscode/chartify) - Generate Helm charts from existing Kubernetes resources.
- [VIM-Kubernetes](https://github.com/andrewstuart/vim-kubernetes) - VIM plugin for Kubernetes and Helm
- [Landscaper](https://github.com/Eneco/landscaper/) - "Landscaper takes a set of Helm Chart references with values (a desired state), and realizes this in a Kubernetes cluster."
- [Helmfile](https://github.com/roboll/helmfile) - Helmfile is a declarative spec for deploying helm charts
- [Autohelm](https://github.com/reactiveops/autohelm) - Autohelm is _another_ simple declarative spec for deploying helm charts. Written in python and supports git urls as a source for helm charts.
- [Helmsman](https://github.com/Praqma/helmsman) - Helmsman is a helm-charts-as-code tool which enables installing/upgrading/protecting/moving/deleting releases from version controlled desired state files (described in a simple TOML format).  
- [Schelm](https://github.com/databus23/schelm) - Render a Helm manifest to a directory
- [Drone.io Helm Plugin](http://plugins.drone.io/ipedrazas/drone-helm/) - Run Helm inside of the Drone CI/CD system
- [Cog](https://github.com/ohaiwalt/cog-helm) - Helm chart to deploy Cog on Kubernetes
- [Monocular](https://github.com/helm/monocular) - Web UI for Helm Chart repositories
- [Helm Chart Publisher](https://github.com/luizbafilho/helm-chart-publisher) - HTTP API for publishing Helm Charts in an easy way
- [Armada](https://github.com/att-comdev/armada) - Manage prefixed releases throughout various Kubernetes namespaces, and removes completed jobs for complex deployments. Used by the [Openstack-Helm](https://github.com/openstack/openstack-helm) team.
- [ChartMuseum](https://github.com/chartmuseum/chartmuseum) - Helm Chart Repository with support for Amazon S3 and Google Cloud Storage
- [Codefresh](https://codefresh.io) - Kubernetes native CI/CD and management platform with UI dashboards for managing Helm charts and releases
- [Captain](https://github.com/alauda/captain) - A Helm3 Controller using HelmRequest and Release CRD

## Helm Included

Platforms, distributions, and services that include Helm support.

- [Kubernetic](https://kubernetic.com/) - Kubernetes Desktop Client
- [Cabin](http://www.skippbox.com/cabin/) - Mobile App for Managing Kubernetes
- [Qstack](https://qstack.com)
- [Fabric8](https://fabric8.io) - Integrated development platform for Kubernetes
- [Jenkins X](http://jenkins-x.io/) - open source automated CI/CD for Kubernetes which uses Helm for [promoting](http://jenkins-x.io/about/features/#promotion) applications through [environments via GitOps](http://jenkins-x.io/about/features/#environments)

## Misc

Grab bag of useful things for Chart authors and Helm users

- [Await](https://github.com/saltside/await) - Docker image to "await" different conditions--especially useful for init containers. [More Info](http://blog.slashdeploy.com/2017/02/16/introducing-await/)
