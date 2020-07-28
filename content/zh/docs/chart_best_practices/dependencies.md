---
title: "Dependencies"
description: "Covers best practices for Chart dependencies."
weight: 4
aliases: ["/docs/topics/chart_best_practices/dependencies/"]
---

This section of the guide covers best practices for `dependencies` declared in
`Chart.yaml`.

## Versions

Where possible, use version ranges instead of pinning to an exact version. The
suggested default is to use a patch-level version match:

```yaml
version: ~1.2.3
```

This will match version `1.2.3` and any patches to that release.  In other
words, `~1.2.3` is equivalent to `>= 1.2.3, < 1.3.0`

For the complete version matching syntax, please see the [semver
documentation](https://github.com/Masterminds/semver#checking-version-constraints).

### Repository URLs

Where possible, use `https://` repository URLs, followed by `http://` URLs.

If the repository has been added to the repository index file, the repository
name can be used as an alias of URL. Use `alias:` or `@` followed by repository
names.

File URLs (`file://...`) are considered a "special case" for charts that are
assembled by a fixed deployment pipeline. Charts that use `file://` are not
allowed in the official Helm repository.

## Conditions and Tags

Conditions or tags should be added to any dependencies that _are optional_.

The preferred form of a condition is:

```yaml
condition: somechart.enabled
```

Where `somechart` is the chart name of the dependency.

When multiple subcharts (dependencies) together provide an optional or swappable
feature, those charts should share the same tags.

For example, if both `nginx` and `memcached` together provide performance
optimizations for the main app in the chart, and are required to both be present
when that feature is enabled, then they should both have a tags section like
this:

```yaml
tags:
  - webaccelerator
```

This allows a user to turn that feature on and off with one tag.
