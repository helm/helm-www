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

- [helm-adopt](https://github.com/HamzaZo/helm-adopt) - A helm v3 plugin to adopt
  existing k8s resources into a new generated helm chart.
- [helm-chartsnap](https://github.com/jlandowner/helm-chartsnap) - Snapshot testing plugin for Helm charts.
- [Helm Diff](https://github.com/databus23/helm-diff) - Preview `helm upgrade`
  as a coloured diff
- [Helm Dt](https://github.com/vmware-labs/distribution-tooling-for-helm) - Plugin that helps distributing Helm charts across OCI registries and on Air gap environments
- [Helm Dashboard](https://github.com/komodorio/helm-dashboard) - GUI for Helm, visualize releases and repositories, manifest diffs
- [helm-gcs](https://github.com/hayorov/helm-gcs) - Plugin to manage repositories
  on Google Cloud Storage
- [helm-git](https://github.com/aslafy-z/helm-git) - Install charts and retrieve
  values files from your Git repositories
- [helm-k8comp](https://github.com/cststack/k8comp) - Plugin to create Helm
  Charts from hiera using k8comp
- [helm-mapkubeapis](https://github.com/helm/helm-mapkubeapis) - Update helm release
  metadata to replace deprecated or removed Kubernetes APIs
- [helm-monitor](https://github.com/ContainerSolutions/helm-monitor) - Plugin to
  monitor a release and rollback based on Prometheus/ElasticSearch query
- [helm-release-plugin](https://github.com/JovianX/helm-release-plugin) - Plugin for Release management, Update release values, pulls(re-creates) helm Charts from deployed releases, set helm release TTL.
- [helm-s3](https://github.com/hypnoglow/helm-s3) - Helm plugin that allows to
  use AWS S3 as a [private] chart repository
- [helm-schema-gen](https://github.com/karuppiah7890/helm-schema-gen) - Helm
  Plugin that generates values yaml schema for your Helm 3 charts
- [helm-secrets](https://github.com/jkroepke/helm-secrets) - Plugin to manage
  and store secrets safely (based on [sops](https://github.com/mozilla/sops))
- [helm-sigstore](https://github.com/sigstore/helm-sigstore) -
  Plugin for Helm to integrate the [sigstore](https://sigstore.dev/) ecosystem. Search, upload and verify signed Helm charts.
- [helm-tanka](https://github.com/Duologic/helm-tanka) - A Helm plugin for
  rendering Tanka/Jsonnet inside Helm charts.
- [hc-unit](https://github.com/xchapter7x/hcunit) - Plugin for unit testing
  charts locally using OPA (Open Policy Agent) & Rego
- [helm-unittest](https://github.com/quintush/helm-unittest) - Plugin for unit
  testing chart locally with YAML
- [helm-val](https://github.com/HamzaZo/helm-val) - A plugin to get
  values from a previous release.
- [helm-external-val](https://github.com/kuuji/helm-external-val) - A plugin that fetches helm values from external sources (configMaps, Secrets, etc.)
- [helm-images](https://github.com/nikhilsbhat/helm-images) - Helm plugin to fetch all possible images from the chart before deployment or from a deployed release
- [helm-drift](https://github.com/nikhilsbhat/helm-drift) - Helm plugin that identifies the configuration that has drifted from the Helm chart

We also encourage GitHub authors to use the
[helm-plugin](https://github.com/search?q=topic%3Ahelm-plugin&type=Repositories)
tag on their plugin repositories.

## Additional Tools

Tools layered on top of Helm.

- [Armada](https://airshipit.readthedocs.io/projects/armada/en/latest/) - Manage
  prefixed releases throughout various Kubernetes namespaces, and removes
  completed jobs for complex deployments
- [avionix](https://github.com/zbrookle/avionix) -
  Python interface for generating Helm
  charts and Kubernetes yaml, allowing for inheritance and less duplication of code
- [Botkube](https://botkube.io) - Run Helm commands directly from Slack,
  Discord, Microsoft Teams, and Mattermost.
- [Captain](https://github.com/alauda/captain) - A Helm3 Controller using
  HelmRequest and Release CRD
- [Chartify](https://github.com/appscode/chartify) - Generate Helm charts from
  existing Kubernetes resources.
- [ChartMuseum](https://github.com/helm/chartmuseum) - Helm Chart Repository
  with support for Amazon S3 and Google Cloud Storage
- [chart-registry](https://github.com/hangyan/chart-registry) - Helm Charts
  Hosts on OCI Registry
- [Codefresh](https://codefresh.io) - Kubernetes native CI/CD and management
  platform with UI dashboards for managing Helm charts and releases
- [Flux](https://fluxcd.io/docs/components/helm/) -
  Continuous and progressive delivery from Git to Kubernetes.
- [Helmfile](https://github.com/helmfile/helmfile) - Helmfile is a declarative
  spec for deploying helm charts
- [Helmper](https://github.com/ChristofferNissen/helmper) - Helmper helps you
  import Helm Charts - including all OCI artifacts(images), to your own OCI
  registries. Helmper also facilitates security scanning and patching of OCI
  images. Helmper utilizes Helm, Oras, Trivy, Copacetic and Buildkitd.
- [Helmsman](https://github.com/Praqma/helmsman) - Helmsman is a
  helm-charts-as-code tool which enables
  installing/upgrading/protecting/moving/deleting releases from version
  controlled desired state files (described in a simple TOML format)
- [HULL](https://github.com/vidispine/hull) - This library chart provides a 
  ready-to-use interface for specifying all Kubernetes objects directly in the `values.yaml`.
  It removes the need to write any templates for your charts and comes with many
  additional features to simplify Helm chart creation and usage.
- [Konveyor Move2Kube](https://konveyor.io/move2kube/) -
  Generate Helm charts for your
  existing projects.
- [Landscaper](https://github.com/Eneco/landscaper/) - "Landscaper takes a set
  of Helm Chart references with values (a desired state), and realizes this in a
  Kubernetes cluster."
- [Monocular](https://github.com/helm/monocular) - Web UI for Helm Chart
  repositories
- [Monokle](https://monokle.io) - Desktop tool for creating, debugging and deploying Kubernetes resources and Helm Charts
- [Orkestra](https://azure.github.io/orkestra/) - A cloud-native Release
  Orchestration and Lifecycle Management (LCM) platform for a related group of
  Helm releases and their subcharts
- [Tanka](https://tanka.dev/helm) - Grafana Tanka configures Kubernetes
  resources through Jsonnet with the ability to consume Helm Charts
- [Terraform Helm
  Provider](https://github.com/hashicorp/terraform-provider-helm) - The Helm
  provider for HashiCorp Terraform enables lifecycle management of Helm Charts
  with a declarative infrastructure-as-code syntax.  The Helm provider is often
  paired the other Terraform providers, like the Kubernetes provider, to create
  a common workflow across all infrastructure services.
- [VIM-Kubernetes](https://github.com/andrewstuart/vim-kubernetes) - VIM plugin
  for Kubernetes and Helm

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
