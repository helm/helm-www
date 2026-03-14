---
title: Resource Upgrades
description: Describes how Helm updates Kubernetes resources during upgrades and rollbacks.
sidebar_position: 18
---

Helm uses a **three-way strategic merge patch** when upgrading or rolling back
releases. It compares three sources to generate the patch:

1. The **old manifest** stored in the last release
2. The **live state** of the resource in the cluster
3. The **new manifest** from the chart being applied

This means out-of-band changes (such as `kubectl edit` or injected sidecars)
are preserved when they do not conflict with the new manifest.

## Examples

### Rolling back where live state has changed

Suppose your chart sets `replicas: 3`, but someone scales the Deployment to
zero with `kubectl scale`:

```console
$ helm install myapp ./myapp
$ kubectl scale --replicas=0 deployment/myapp
$ helm rollback myapp
```

Because Helm compares the old manifest (3 replicas), the live state (0
replicas), and the new manifest (3 replicas), it generates a patch that
restores the replica count to three.

### Upgrades that preserve injected sidecars

A service mesh injects a sidecar container into your pod. When you upgrade the
chart to change the `nginx` image tag:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

Helm sees that the live state has an additional `my-injected-sidecar` container
not present in either the old or new manifest, so it keeps the sidecar while
applying the image change.

## CRDs and JSON merge patch

The strategic merge patch described above only applies to **built-in Kubernetes
types** that have schema metadata defining list merge keys. For **Custom
Resource Definitions (CRDs)** and other unstructured objects, Helm falls back
to a standard **JSON merge patch**.

JSON merge patch replaces arrays wholesale rather than merging them by key.
This means:

- List fields in CRDs (such as container lists or rule lists) are **overwritten
  entirely** with the values from the new manifest
- Injected items that are not present in the chart manifest will be removed on
  upgrade

If your CRDs have array fields that are modified by controllers or other
processes, consider using `--force` (see below) or managing those resources
outside of Helm.

## The `--force` flag

When `helm upgrade --force` is used, Helm skips the merge patch entirely and
performs a full **resource replacement** via the Kubernetes API. This is useful
when a patch cannot be applied (for example, when an immutable field has
changed), but carries risks:

- The resource is replaced in place, which may cause a brief disruption
- Immutable fields (such as a Service's `clusterIP` or a PVC's storage class)
  will cause the replacement to fail if they differ from the live state
- It cannot be combined with `--server-side-apply`

Use `--force` as a last resort when normal patching fails.
