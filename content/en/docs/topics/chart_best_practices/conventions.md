---
title: "General Conventions"
description: "general conventions for charts."
---

This part of the Best Practices Guide explains general conventions.

## Chart Names

Chart names should be lower case letters and numbers. Words _may_ be separated with dashes (-):

Examples:

```
drupal
nginx-lego
aws-cluster-autoscaler
```

Neither uppercase letters nor underscores should be used in chart names. Dots should not be used in chart names.

The directory that contains a chart MUST have the same name as the chart. Thus, the chart `nginx-lego` MUST be created in a directory called `nginx-lego/`. This is not merely a stylistic detail, but a requirement of the Helm Chart format.

## Version Numbers

Wherever possible, Helm uses [SemVer 2](http://semver.org) to represent version numbers. (Note that Docker image tags do not necessarily follow SemVer, and are thus considered an unfortunate exception to the rule.)

When SemVer versions are stored in Kubernetes labels, we conventionally alter the `+` character to an `_` character, as labels do not allow the `+` sign as a value.

## Formatting YAML

YAML files should be indented using _two spaces_ (and never tabs).

## Usage of the Words Helm and Chart

There are a few small conventions followed for using the words Helm and helm.

- Helm refers to the project, and is often used as an umbrella term
- `helm` refers to the client-side command
- The term 'chart' does not need to be capitalized, as it is not a proper noun.

When in doubt, use _Helm_ (with an uppercase 'H').
