---
title: Migrating Charts from v2 to v3
description: Learn how to migrate Helm charts from apiVersion v2 to v3.
sidebar_position: 14
---

This guide covers changes when migrating charts from `apiVersion: v2` to `apiVersion: v3`. Chart API v3 is the new chart format introduced with Helm 4.

:::note
Charts with `apiVersion: v2` continue to work in Helm 4. Migration to v3 is optional but recommended for new charts.
:::

## Breaking Changes

### YAML Document Separator Handling

Chart API v3 changes how Helm handles YAML document separators (`---`) in templates.

**The problem**: When you use `{{-` (whitespace-trimming) after a document separator, Go templates strip the newline between `---` and your content:

```yaml
---
{{- include "mychart.service" . }}
```

This renders as `---apiVersion: v1\nkind: Service\n...` with the separator "glued" to the content.

**Chart v2 behavior**: Helm silently corrected this by detecting glued separators and splitting them anyway.

**Chart v3 behavior**: Helm no longer auto-corrects glued separators. The `---apiVersion` stays as part of the document body, causing YAML parsing errors.

#### How to fix affected templates

**Option 1: Remove the dash from the template directive**

Change `{{-` to `{{` so the newline after `---` is preserved:

```yaml
---
{{ include "mychart.service" . }}
```

**Option 2: Omit the explicit separator**

Helm automatically inserts separators between template outputs, so you often don't need manual `---` separators:

```yaml
{{- include "mychart.service" . }}
```

#### Identifying affected templates

Look for this pattern in your template files:

```yaml
---
{{- ...
```

Any template with `---` immediately followed by `{{-` on the next line may be affected.

## Subcharts and Mixed API Versions

Each chart is processed according to its own `apiVersion`. A v2 subchart included in a v3 parent chart keeps its lenient separator handling. Only charts that explicitly set `apiVersion: v3` use the stricter parsing.

## Related Resources

- [helm/helm#32036](https://github.com/helm/helm/issues/32036) - Original issue tracking this change
- [helm/helm#32185](https://github.com/helm/helm/pull/32185) - Implementation PR
