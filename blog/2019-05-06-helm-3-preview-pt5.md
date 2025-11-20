---
title: "Helm 3 Preview: Charting Our Future – Part 5: Changes to Chart Dependencies"
slug: "helm-3-preview-pt5"
authors: ["mattfisher"]
date: "2019-05-06"
---

This is part 5 of 7 of our *Helm 3 Preview: Charting Our Future* blog series about chart dependencies and some subtle differences between Helm 2 and Helm 3. (Check out our previous blog post on release management [here](https://helm.sh/blog/helm-3-preview-pt4/).)

Charts that were packaged (with `helm package`) for use with Helm 2 can be installed with Helm 3, but the chart development workflow received an overhaul, so some changes are necessary to continue developing charts with Helm 3. One of the components that changed was the chart dependency management system.<!-- truncate -->

The Chart dependency management system moved from requirements.yaml and requirements.lock to Chart.yaml and Chart.lock, meaning that charts that relied on the `helm dependency` command will need some tweaking to work in Helm 3.

Let's take a look at an example. Let's add a dependency to a chart in Helm 2 and then look at how that changed in Helm 3.

In Helm 2, this is how a requirements.yaml looked:

```
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://kubernetes-charts.storage.googleapis.com/
  condition: mariadb.enabled
  tags:
    - database
```

In Helm 3, the same dependency is expressed in your Chart.yaml:

```
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://kubernetes-charts.storage.googleapis.com/
  condition: mariadb.enabled
  tags:
    - database
```

Charts are still downloaded and placed in the charts/ directory, so subcharts vendored into the charts/ directory will continue to work without modification.

Click [here](https://helm.sh/blog/helm-3-preview-pt6/) to read the next blog where we introduce library charts in the next part of our *Helm 3 Preview: Charting Our Future* blog series over the course of 4 weeks.
