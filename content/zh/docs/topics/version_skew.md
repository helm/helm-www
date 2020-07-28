---
title: "Helm Version Support Policy"
description: "Describes Helm's patch release policy as well as the maximum version skew supported between Helm and Kubernetes."
---

This document describes the maximum version skew supported between Helm and
Kubernetes.

## Supported Versions

Helm versions are expressed as `x.y.z`, where `x` is the major version, `y` is
the minor version, and z is the patch version, following [Semantic
Versioning](https://semver.org/spec/v2.0.0.html) terminology.

The Helm project maintains a release branch for the most recent minor release.
Applicable fixes, including security fixes, are cherry-picked into the release
branch, depending on severity and feasibility. Patch releases are cut from that
branch as needed. This decision is owned by the release maintainer.

## Supported Version Skew

When a new version of Helm is released, it is compiled against a particular
minor version of Kubernetes. For example, Helm 3.0.0 interacts with Kubernetes
using the Kubernetes 1.16.2 client, so it is compatible with Kubernetes 1.16.

As of Helm 3, Helm is assumed to be compatible with `n-3` versions of Kubernetes
it was compiled against. Due to Kubernetes' changes between minor versions, Helm
2's support policy is slightly stricter, assuming to be compatible with `n-1`
versions of Kubernetes.

For example, if you are using a version of Helm 3 that was compiled against the
Kubernetes 1.17 client APIs, then it should be safe to use with Kubernetes 1.17,
1.16, 1.15, and 1.14. If you are using a version of Helm 2 that was compiled
against the Kubernetes 1.16 client APIs, then it should be safe to use with
Kubernetes 1.16 and 1.15.

It is not recommended to use Helm with a version of Kubernetes that is newer
than the version it was compiled against, as Helm does not make any forward
compatiblility guarantees.

If you choose to use Helm with a version of Kubernetes that it does not support,
you are using it at your own risk.

Please refer to the table below to determine what version of Helm is compatible
with your cluster.

| Helm Version | Supported Kubernetes Versions |
|--------------|-------------------------------|
| 3.2.x        | 1.18.x - 1.15.x               |
| 3.1.x        | 1.17.x - 1.14.x               |
| 3.0.x        | 1.16.x - 1.13.x               |
| 2.16.x       | 1.16.x - 1.15.x               |
| 2.15.x       | 1.15.x - 1.14.x               |
| 2.14.x       | 1.14.x - 1.13.x               |
| 2.13.x       | 1.13.x - 1.12.x               |
| 2.12.x       | 1.12.x - 1.11.x               |
| 2.11.x       | 1.11.x - 1.10.x               |
| 2.10.x       | 1.10.x - 1.9.x                |
| 2.9.x        | 1.10.x - 1.9.x                |
| 2.8.x        | 1.9.x - 1.8.x                 |
| 2.7.x        | 1.8.x - 1.7.x                 |
| 2.6.x        | 1.7.x - 1.6.x                 |
| 2.5.x        | 1.6.x - 1.5.x                 |
| 2.4.x        | 1.6.x - 1.5.x                 |
| 2.3.x        | 1.5.x - 1.4.x                 |
| 2.2.x        | 1.5.x - 1.4.x                 |
| 2.1.x        | 1.5.x - 1.4.x                 |
| 2.0.x        | 1.4.x - 1.3.x                 |
