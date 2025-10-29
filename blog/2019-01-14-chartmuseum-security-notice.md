---
title: "ChartMuseum Vulnerability: Authorization Bypass [CVE-2019-1000009]"
slug: "chartmuseum-security-notice-2019"
date: "2019-01-14"
---

Security researcher Bernard Wagner of [Entersekt](https://www.entersekt.com/) discovered a vulnerability in ChartMuseum, impacting **all versions of ChartMuseum between ChartMuseum >=0.1.0 and < 0.8.1**. A specially crafted chart could be uploaded that caused the uploaded archive to be saved outside of the intended location.

When ChartMuseum is configured for multitenancy the specially crafted chart could be uploaded to one tenant but saved in the location of another tenant. This includes overwriting a chart at a version in the other tenant.
<!-- truncate -->

Additionally, if ChartMuseum is configured to use a file system the uploaded Chart archive may be uploaded to locations outside of the storage directory. It could be uploaded to any place the ChartMuseum application binary has write permission to.

We are unaware of any public exploits caused by this issue.

## Details

When a chart archive is uploaded the name of the chart, as listed in the `Chart.yaml` file, is used when creating the path location to save the file. The name is joined with the directory or object storage prefix path. The chart name was not sanitized or validated. This allowed directory traversal characters, such as `../..`, to be used in the name and affect the directory the archive file is saved within.

When the Helm client creates a chart archive, via the `helm package` command, it validates that the chart name and encapsulating directory match. It will not generate a chart archive with directory traversal characters.

## Fix

Update to ChartMuseum >= 0.8.1

To prevent this from happening, ChartMuseum now checks the name of the chart to make sure there are no directory traversal characters in the name before using it to save the archive. If the name contains directory traversal characters the API will return a _400 Bad Request_ response and message to signify the name issue.
