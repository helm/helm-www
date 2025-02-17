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

### Prerelease versions

The above versioning constraints will not match on pre-release versions.
For example `version: ~1.2.3` will match `version: ~1.2.4` but not `version: ~1.2.3-1`.
The following provides a pre-release as well as patch-level matching:

```yaml
version: ~1.2.3-0
```

### Repository URLs

Where possible, use `https://` repository URLs, followed by `http://` URLs.

If the repository has been added to the repository index file, the repository
name can be used as an alias of URL. Use `alias:` or `@` followed by repository
names.

File URLs (`file://...`) are considered a "special case" for charts that are
assembled by a fixed deployment pipeline.

When using [downloader plugins]({{< ref "../topics/plugins#downloader-plugins" >}})
the URL scheme will be specific to the plugin. Note, a user of the chart will
need to have a plugin supporting the scheme installed to update or build the
dependency.

Helm cannot perform dependency management operations on the dependency when the
`repository` field is left blank. In that case Helm will assume the dependency
is in a sub-directory of the `charts` folder with the name being the same as the
`name` property for the dependency.

## Conditions and Tags

Conditions or tags should be added to any dependencies that _are optional_. Note that by default a `condition` is `true`.

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
