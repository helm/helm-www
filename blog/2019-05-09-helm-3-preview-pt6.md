---
title: "Helm 3 Preview: Charting Our Future – Part 6: Introducing Library Charts"
slug: "helm-3-preview-pt6"
authors: ["mattfisher"]
date: "2019-05-09"
---

This is part 6 of 7 of our *Helm 3 Preview: Charting Our Future* blog series on library charts. You can find our previous blog post on the Helm chart dependencies [here](https://helm.sh/blog/helm-3-preview-pt5/).

Helm 3 supports a class of chart called a "library chart". This is a chart that is shared by other charts, but does not create any release artifacts of its own. A library chart's templates can only declare `define` elements. Globally scoped non-define content is simply ignored. This allows users to re-use and share snippets of code that can be re-used across many charts, avoiding redundancy and keeping charts [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).<!-- truncate -->

Library charts are declared in the `dependencies` directive in Chart.yaml, and are installed and managed like any other chart.

```
dependencies:
  - name: mylib
    version: 1.x.x
    repository: quay.io
```

We're very excited to see the use cases this feature opens up for chart developers, as well as any best practices that arise from consuming library charts.

Click [here](https://helm.sh/blog/helm-3-preview-pt7/) to read the final part of our *Helm 3 Preview: Charting Our Future* blog series over the course of 4 weeks.
