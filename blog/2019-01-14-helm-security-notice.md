---
title: "Helm Vulnerability: Client Unpacking Chart that Contains Malicious Content [CVE-2019-1000008]"
slug: "helm-security-notice-2019"
authors: ["mattbutcher"]
date: "2019-01-14"
---

Security researcher Bernard Wagner of [Entersekt](https://www.entersekt.com/) discovered a vulnerability in the Helm client, impacting **all versions of Helm between Helm >=2.0.0 and < 2.12.2**. Two Helm client commands may be coerced into unpacking unsafe content from a maliciously designed chart.

A specially crafted chart may be able to unpack content into locations on the filesystem outside of the chart’s path, potentially overwriting existing files.
<!-- truncate -->

No version of Tiller is known to be impacted. This is a client-only issue.

The following Helm commands may unsafely unpack malformed charts onto a local folder: `helm fetch --untar` and `helm lint some.tgz`.


We are unaware of any public exploits caused by this issue.

## Details

During unpacking operations, file names were not checked to see if they contained references to parent directories. Normally, this does not impact Helm’s operation because file names are only used as in-memory names. However, two operations were found to export files directly to disk without sanitizing the file names. The `helm lint` command may unpack a tar archive into a temporary directory, and `helm fetch --untar` will unpack an archive into a user-supplied directory. In both cases, not all file names were correctly sanitized.

No Tiller version is impacted. This vulnerability does not render clusters vulnerable to attack. Tiller does not store unpacked charts. All charts are loaded in-memory, and paths are resolved as string names, not as locations on a file system.

## Workarounds

Unpack charts with the appropriate `tar` command, and do not use the `--untar` flag on `helm fetch`. Do not run `helm lint` on tars. Unpack them manually and run `helm lint` on the unpacked directory.

## Fix

Update to Helm >= 2.12.2.

As of Helm 2.12.2, the unpacking operation disallows paths that could be used to store files outside of the present working directory. This is considered a bug fix, rather than a breaking change, because there is no way to produce such malformed packages from within Helm or from standard chart-building tools.

From Helm 2.12.2 onward, charts that contain files that are not relative to the current working directory will fail to load, even when loaded into memory.
