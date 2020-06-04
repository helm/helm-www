---
title: "의존성"
description: "차트 의존성에 관한 모범사례를 다룬다."
weight: 4
aliases: ["/docs/topics/chart_best_practices/dependencies/"]
---

이 부분은 가이드의 일부로서 `Chart.yaml`에서 선언되는 `dependencies`에 과한 모범사례를 다룬다.

## 버전

Where possible, use version ranges instead of pinning to an exact version. The
suggested default is to use a patch-level version match:

```yaml
version: ~1.2.3
```

This will match version `1.2.3` and any patches to that release.  In other
words, `~1.2.3` is equivalent to `>= 1.2.3, < 1.3.0`

For the complete version matching syntax, please see the [semver
documentation](https://github.com/Masterminds/semver#checking-version-constraints).

### 리포지터리 URL

Where possible, use `https://` repository URLs, followed by `http://` URLs.

If the repository has been added to the repository index file, the repository
name can be used as an alias of URL. Use `alias:` or `@` followed by repository
names.

File URLs (`file://...`) are considered a "special case" for charts that are
assembled by a fixed deployment pipeline. Charts that use `file://` are not
allowed in the official Helm repository.

#### OCI 레지스트리에서 호스팅되는 차트에 대한 실험적 기능지원

If you have [enabled experimental OCI support](/docs/registries/), you can specify
an OCI reference (`oci://registry/group/image:tag`) for the repository URL.

When specifying an OCI reference, you may omit the `version` argument if your
repository URL contains an image tag (`oci://nginx:1.10`). If you do not specify
a tag on the URL, the `version` will be used as the tag. This means that OCI URLs
**do not support SemVer constraints**, only tagged versions are supported.

If you specify both a tag and a version, the tag takes precedence and the version
is ignored.

## 조건과 태그

Conditions or tags should be added to any dependencies that _are optional_.

The preferred form of a condition is:

```yaml
condition: somechart.enabled
```

Where `somechart` is the chart name of the dependency.

When multiple subcharts (dependencies) together provide an optional or swappable
feature, those charts should share the same tags.

For example, if both `nginx` and `memcached` together provided performance
optimizations for the main app in the chart, and were required to both be
present when that feature is enabled, then they might both have a tags section
like this:

```yaml
tags:
  - webaccelerator
```

This allows a user to turn that feature on and off with one tag.
