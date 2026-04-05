---
title: Troubleshooting
sidebar_position: 4
---

## Troubleshooting

### I am getting a "server-side apply failed" error

Helm 4 uses [server-side apply](https://kubernetes.io/docs/reference/using-api/server-side-apply/) (SSA) by default when installing and upgrading releases.
When a server-side apply operation fails, you see an error like:

```
Error: INSTALLATION FAILED: server-side apply failed for object default/my-deployment apps/v1, Kind=Deployment: <error details>
```

Common causes include:

- **Duplicate keys in manifests**: Your chart contains duplicate entries for the same key (for example, duplicate environment variable names in a container spec).
  The Kubernetes API server rejects manifests with duplicate keys when using SSA.
- **Field ownership conflicts**: Another controller or process manages the same fields that your chart is trying to update.
  SSA tracks which manager owns each field, and conflicts occur when multiple managers try to set the same field.

To resolve server-side apply errors:

1. **Fix the chart** (recommended): Remove duplicate keys from your chart templates.
   For duplicate environment variables, use a dictionary pattern or conditional logic to ensure each key appears only once.

2. **Use `--force-conflicts`**: If another manager owns fields that your chart needs to update, add `--force-conflicts` to override the conflict and take ownership:

   ```console
   $ helm upgrade my-release my-chart --force-conflicts
   ```

3. **Disable server-side apply**: As a workaround, you can disable SSA for the operation:

   ```console
   $ helm install my-release my-chart --server-side=false
   ```

   This reverts to client-side apply, which does not enforce field ownership or reject duplicate keys.
   However, you lose the benefits of server-side field management.

For more information about server-side apply, see [HIP-0023](/community/hips/hip-0023) and the [Kubernetes SSA documentation](https://kubernetes.io/docs/reference/using-api/server-side-apply/).
