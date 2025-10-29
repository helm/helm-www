---
title: "Helm Vulnerability: Client Loading and Packaging Chart Directory Containing Malicious Symlinked Content [CVE-2019-18658]"
authors: ["mattfarina"]
date: "2019-10-30"
---

Part of the process for Helm to become a graduated CNCF project is to complete an independent and third party security audit with the results being published. As part of the audit of Helm 3 a security issue was found that also impacts Helm v2. [Cure53](https://cure53.de/) performed the audit and found the issue. More about the audit will be covered in a future post.

The vulnerability found impacts **all versions of Helm between Helm >=2.0.0 and < 2.15.2**. Helm commands that deal with loading a chart as a directory or packaging a chart provide an opportunity for a maliciously designed chart to include content not intended in the chart or to execute a denial of service (DOS) on the computer performing the packaging via the use of symlinks.<!-- truncate -->

No version of Tiller is known to be impacted. This is a client-only issue.

The following Helm commands may unsafely handle malformed charts: `helm package`, `helm install`, `helm upgrade`, and `helm dependency build`.

We are unaware of any public exploits caused by this issue.

## Details

Helm charts can include symlinks. This feature provides a means of symlinking chart dependencies together when stored in a filesystem. Two types of symlinks can cause vulnerabilities.

1. A symlink to a specially crafted file on the targets system. For example, a file containing sensitive information. When someone runs `helm package` this symlinked file will be copied into the archive without any notification. When the packaged file is moved elsewhere, such as to a Helm repository, the sensitive file will be sent along.
2. A symlink to a special file, such as a device driver. For example, a symlink to `/dev/urandom`. This would cause a command like `helm install` or `helm package` to continuously read from `/dev/urandom` as it tries to create the payload.

No Tiller version is impacted. This vulnerability does not render clusters vulnerable to attack. Tiller does not load chart directories.

## Workarounds

A process work around can be used to mitigate the vulnerability. Do not load chart directories or package charts whose contents you do not trust or in an environment with sensitive information.

## Fix

Update to Helm >= 2.15.2.

As of Helm 2.15.2, Helm will log to output all of the symlinked files referenced when packaging a chart and it will return an error while failing to load chart directories containing symlinks to irregular files (e.g., device or unix socket).
