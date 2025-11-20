---
title: Debugging Templates
description: Troubleshooting charts that are failing to deploy.
sidebar_position: 13
---

Debugging templates can be tricky because the rendered templates are sent to the
Kubernetes API server, which may reject the YAML files for reasons other than
formatting.

There are a few commands that can help you debug.

- `helm lint` is your go-to tool for verifying that your chart follows best
  practices
- `helm template --debug` will test rendering chart templates locally.  
- `helm install --dry-run --debug` will also render your chart locally without
installing it, but will also check if conflicting resources are already running
on the cluster. Setting `--dry-run=server` will additionally execute any
`lookup` in your chart towards the server.
- `helm get manifest`: This is a good way to see what templates are installed on
  the server.

When your YAML is failing to parse, but you want to see what is generated, one
easy way to retrieve the YAML is to comment out the problem section in the
template, and then re-run `helm install --dry-run --debug`:

```yaml
apiVersion: v2
# some: problem section
# {{ .Values.foo | quote }}
```

The above will be rendered and returned with the comments intact:

```yaml
apiVersion: v2
# some: problem section
#  "bar"
```

This provides a quick way of viewing the generated content without YAML parse
errors blocking.
