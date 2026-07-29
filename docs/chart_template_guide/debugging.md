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

## Debugging the `lookup` function

The [`lookup` function](/chart_template_guide/functions_and_pipelines.mdx#using-the-lookup-function) queries Kubernetes resources during template rendering. When `lookup` returns an empty result, it can be difficult to determine why. To see diagnostic messages, enable debug mode:

```bash
helm install --debug myrelease ./mychart
```

With debug logging enabled, Helm logs the apiVersion, kind, namespace, and name when a lookup returns empty:

- **"lookup: resource not found"** — The specific resource was not found in the cluster (for single-object lookups like `lookup "v1" "ConfigMap" "default" "my-config"`)
- **"lookup: resource list not found"** — No resources matched the query (for list lookups like `lookup "v1" "ConfigMap" "default" ""`)

Common reasons why `lookup` might return empty:

- The resource does not exist in the cluster
- RBAC permissions prevent access to the resource
- Running `helm template` without cluster access (use `--dry-run=server` to connect)
- Incorrect apiVersion, kind, namespace, or name parameters
