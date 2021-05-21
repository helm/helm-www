---
title: "General Conventions"
description: "General conventions for charts."
weight: 1
aliases: ["/docs/topics/chart_best_practices/conventions/"]
---

This part of the Best Practices Guide explains general conventions.

## Chart Names

Chart names must be lower case letters and numbers. Words _may_ be separated
with dashes (-):

Examples:

```
drupal
nginx-lego
aws-cluster-autoscaler
```

Neither uppercase letters nor underscores can be used in chart names. Dots
should not be used in chart names.

## Version Numbers

Wherever possible, Helm uses [SemVer 2](https://semver.org) to represent version
numbers. (Note that Docker image tags do not necessarily follow SemVer, and are
thus considered an unfortunate exception to the rule.)

When SemVer versions are stored in Kubernetes labels, we conventionally alter
the `+` character to an `_` character, as labels do not allow the `+` sign as a
value.

## Formatting YAML

YAML files should be indented using _two spaces_ (and never tabs).

## Usage of the Words Helm and Chart

There are a few conventions for using the words _Helm_ and _helm_.

- _Helm_ refers to the project as a whole
- `helm` refers to the client-side command
- The term `chart` does not need to be capitalized, as it is not a proper noun
- However, `Chart.yaml` does need to be capitalized because the file name is
  case sensitive

When in doubt, use _Helm_ (with an uppercase 'H').
