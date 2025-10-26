---
sidebar_position: 2
sidebar_label: "General Conventions"
slug: general-conventions
---

# General Conventions

This part of the Best Practices Guide explains general conventions.

## Chart Names

Chart names should use lower case letters and numbers, and start with a letter.

Hyphens (-) are allowed, but are known to be a little trickier to work with in Helm templates (see [issue #2192](https://github.com/helm/helm/issues/2192) for more information).

Here are a few examples of good chart names from the [Helm Community Charts](https://github.com/helm/charts):

```
drupal
cert-manager
oauth2-proxy
```

Neither uppercase letters nor underscores should be used in chart names. Dots should not be used in chart names.

The directory that contains a chart MUST have the same name as the chart. Thus, the chart `cert-manager` MUST be created in a directory called `cert-manager/`. This is not merely a stylistic detail, but a requirement of the Helm Chart format.

## Version Numbers

Wherever possible, Helm uses [SemVer 2](https://semver.org) to represent version numbers. (Note that Docker image tags do not necessarily follow SemVer, and are thus considered an unfortunate exception to the rule.)

When SemVer versions are stored in Kubernetes labels, we conventionally alter the `+` character to an `_` character, as labels do not allow the `+` sign as a value.

## Formatting YAML

YAML files should be indented using _two spaces_ (and never tabs).

## Usage of the Words Helm, Tiller, and Chart

There are a few small conventions followed for using the words Helm, helm, Tiller, and tiller.

- Helm refers to the project, and is often used as an umbrella term
- `helm` refers to the client-side command
- Tiller is the proper name of the backend
- `tiller` is the name of the binary run on the backend
- The term 'chart' does not need to be capitalized, as it is not a proper noun.

When in doubt, use _Helm_ (with an uppercase 'H').

## Restricting Tiller by Version

A `Chart.yaml` file can specify a `tillerVersion` SemVer constraint:

```yaml
name: mychart
version: 0.2.0
tillerVersion: ">=2.4.0"
```

This constraint should be set when templates use a new feature that was not
supported in older versions of Helm. While this parameter will accept sophisticated
SemVer rules, the best practice is to default to the form `>=2.4.0`, where `2.4.0`
is the version that introduced the new feature used in the chart.

This feature was introduced in Helm 2.4.0, so any version of Tiller older than
2.4.0 will simply ignore this field.
