---
title: "Related Projects and Documentation"
description: "third-party tools, plugins and documentation provided by the community!"
weight: 3
aliases: ["/docs/related/"]
---

The Helm community has produced many extra tools, plugins, and documentation
about Helm. We love to hear about these projects.

If you have anything you'd like to add to this list, please open an
[issue](https://github.com/helm/helm-www/issues) or [pull
request](https://github.com/helm/helm-www/pulls).

## Helm Plugins

- [Helm Diff](https://github.com/databus23/helm-diff) - Preview `helm upgrade`
  as a coloured diff
- [helm-gcs](https://github.com/nouney/helm-gcs) - Plugin to manage repositories
  on Google Cloud Storage
- [helm-monitor](https://github.com/ContainerSolutions/helm-monitor) - Plugin to
  monitor a release and rollback based on Prometheus/ElasticSearch query
- [helm-k8comp](https://github.com/cststack/k8comp) - Plugin to create Helm
  Charts from hiera using k8comp
- [helm-unittest](https://github.com/lrills/helm-unittest) - Plugin for unit
  testing chart locally with YAML
- [hc-unit](https://github.com/xchapter7x/hcunit) - Plugin for unit testing
  charts locally using OPA (Open Policy Agent) & Rego
- [helm-s3](https://github.com/hypnoglow/helm-s3) - Helm plugin that allows to
  use AWS S3 as a [private] chart repository
- [helm-schema-gen](https://github.com/karuppiah7890/helm-schema-gen) - Helm
  Plugin that generates values yaml schema for your Helm 3 charts
- [helm-secrets](https://github.com/jkroepke/helm-secrets) - Plugin to manage
  and store secrets safely (based on [sops](https://github.com/mozilla/sops)) 

We also encourage GitHub authors to use the
[helm-plugin](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories)
tag on their plugin repositories.

## Additional Tools

Tools layered on top of Helm.

- [Chartify](https://github.com/appscode/chartify) - Generate Helm charts from
  existing Kubernetes resources.
- [VIM-Kubernetes](https://github.com/andrewstuart/vim-kubernetes) - VIM plugin
  for Kubernetes and Helm
- [Landscaper](https://github.com/Eneco/landscaper/) - "Landscaper takes a set
  of Helm Chart references with values (a desired state), and realizes this in a
  Kubernetes cluster."
- [Helmfile](https://github.com/roboll/helmfile) - Helmfile is a declarative
  spec for deploying helm charts
- [Helmsman](https://github.com/Praqma/helmsman) - Helmsman is a
  helm-charts-as-code tool which enables
  installing/upgrading/protecting/moving/deleting releases from version
  controlled desired state files (described in a simple TOML format)
- [Terraform Helm
  Provider](https://github.com/hashicorp/terraform-provider-helm) - The Helm
  provider for HashiCorp Terraform enables lifecycle management of Helm Charts
  with a declarative infrastructure-as-code syntax.  The Helm provider is often
  paired the other Terraform providers, like the Kubernetes provider, to create
  a common workflow across all infrastructure services.
- [Monocular](https://github.com/helm/monocular) - Web UI for Helm Chart
  repositories
- [Armada](https://airshipit.readthedocs.io/projects/armada/en/latest/) - Manage
  prefixed releases throughout various Kubernetes namespaces, and removes
  completed jobs for complex deployments
- [ChartMuseum](https://github.com/helm/chartmuseum) - Helm Chart Repository
  with support for Amazon S3 and Google Cloud Storage
- [Codefresh](https://codefresh.io) - Kubernetes native CI/CD and management
  platform with UI dashboards for managing Helm charts and releases
- [Captain](https://github.com/alauda/captain) - A Helm3 Controller using
  HelmRequest and Release CRD
- [chart-registry](https://github.com/hangyan/chart-registry) - Helm Charts
  Hosts on OCI Registry

## Helm Included

Platforms, distributions, and services that include Helm support.

- [Kubernetic](https://kubernetic.com/) - Kubernetes Desktop Client
- [Jenkins X](https://jenkins-x.io/) - open source automated CI/CD for
  Kubernetes which uses Helm for
  [promoting](https://jenkins-x.io/docs/getting-started/promotion/) applications
  through environments via GitOps

## Misc

Grab bag of useful things for Chart authors and Helm users.

- [Await](https://github.com/saltside/await) - Docker image to "await" different
  conditions--especially useful for init containers. [More
  Info](https://blog.slashdeploy.com/2017/02/16/introducing-await/)
