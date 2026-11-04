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
- `helm install --dry-run=client --debug` will also render your chart locally
  without installing it or connecting to the cluster. Setting `--dry-run=server`
  also checks for conflicting resources in the cluster and executes any `lookup`
  in your chart against the server.
- `helm get manifest`: This is a good way to see what templates are installed on
  the server.

When your YAML is failing to parse, but you want to see what is generated, one
easy way to retrieve the YAML is to comment out the problem section in the
template, and then re-run `helm install --dry-run=client --debug`:

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

The [`lookup` function](/chart_template_guide/functions_and_pipelines.mdx#using-the-lookup-function) queries Kubernetes resources during template rendering. To see its `NotFound` diagnostic messages, enable debug mode and connect to the API server with a server dry run:

```bash
helm install --dry-run=server --debug myrelease ./mychart
```

When the API server returns `NotFound` for a lookup, debug logging includes the apiVersion, kind, namespace, and name:

- **"lookup: resource not found"**: The API server returned `NotFound` for a single-object lookup such as `lookup "v1" "ConfigMap" "default" "my-config"`.
- **"lookup: resource list not found"**: The API server returned `NotFound` for a list lookup such as `lookup "v1" "ConfigMap" "default" ""`. A successful list with no matching resources returns an empty `items` list without this message.

Common reasons why `lookup` might return empty:

- The resource does not exist in the cluster
- Running `helm template` without cluster access (use `--dry-run=server` to connect)
- An incorrect name or namespace, which the API server reports as `NotFound`

Other API errors, such as an RBAC permission denial, cause template rendering to
fail rather than returning an empty result.
