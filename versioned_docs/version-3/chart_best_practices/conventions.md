---
title: General Conventions
description: General conventions for charts.
sidebar_position: 1
---

This part of the Best Practices Guide explains general conventions.

## Chart Names

Chart names must follow DNS-1123 label conventions: only lowercase letters,
numbers, and dashes are allowed, names must start and end with a lowercase
letter or number, and names cannot exceed 63 characters:

Examples:

```
drupal
nginx-lego
aws-cluster-autoscaler
```

Invalid chart names include:
- Names with uppercase letters (e.g., `MyChart`)
- Names with underscores (e.g., `my_chart`)
- Names with dots (e.g., `my.chart`)
- Names starting with a dash (e.g., `-mychart`)
- Names ending with a dash (e.g., `mychart-`)
- Names longer than 63 characters

The `helm lint` command validates chart names against these rules.

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

## Chart templates and namespaces

Avoid defining the `namespace` property in the `metadata` section of your chart
templates. The namespace to apply rendered templates to should be
specified in the call to a Kubernetes client via the flag like `--namespace`.
Helm is rendering your templates as-is and sending them off to the
Kubernetes client, whether it be Helm itself or another
program (kubectl, flux, spinnaker, etc).
