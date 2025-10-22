---
title: Chart Hooks
description: Describes how to work with chart hooks.
sidebar_position: 2
---

Helm provides a _hook_ mechanism to allow chart developers to intervene at
certain points in a release's life cycle. For example, you can use hooks to:

- Load a ConfigMap or Secret during install before any other charts are loaded.
- Execute a Job to back up a database before installing a new chart, and then
  execute a second job after the upgrade in order to restore data.
- Run a Job before deleting a release to gracefully take a service out of
  rotation before removing it.

Hooks work like regular templates, but they have special annotations that cause
Helm to utilize them differently. In this section, we cover the basic usage
pattern for hooks.

## The Available Hooks

The following hooks are defined:

| Annotation Value | Description                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `pre-install`    | Executes after templates are rendered, but before any resources are created in Kubernetes             |
| `post-install`   | Executes after all resources are loaded into Kubernetes                                               |
| `pre-delete`     | Executes on a deletion request before any resources are deleted from Kubernetes                       |
| `post-delete`    | Executes on a deletion request after all of the release's resources have been deleted                 |
| `pre-upgrade`    | Executes on an upgrade request after templates are rendered, but before any resources are updated     |
| `post-upgrade`   | Executes on an upgrade request after all resources have been upgraded                                 |
| `pre-rollback`   | Executes on a rollback request after templates are rendered, but before any resources are rolled back |
| `post-rollback`  | Executes on a rollback request after all resources have been modified                                 |
| `test`           | Executes when the Helm test subcommand is invoked ([view test docs](/topics/chart_tests.md))              |

_Note that the `crd-install` hook has been removed in favor of the `crds/`
directory in Helm 3._

## Hooks and the Release Lifecycle

Hooks allow you, the chart developer, an opportunity to perform operations at
strategic points in a release lifecycle. For example, consider the lifecycle for
a `helm install`. By default, the lifecycle looks like this:

1. User runs `helm install foo`
2. The Helm library install API is called
3. After some verification, the library renders the `foo` templates
4. The library loads the resulting resources into Kubernetes
5. The library returns the release object (and other data) to the client
6. The client exits

Helm defines two hooks for the `install` lifecycle: `pre-install` and
`post-install`. If the developer of the `foo` chart implements both hooks, the
lifecycle is altered like this:

1. User runs `helm install foo`
2. The Helm library install API is called
3. CRDs in the `crds/` directory are installed
4. After some verification, the library renders the `foo` templates
5. The library prepares to execute the `pre-install` hooks (loading hook
   resources into Kubernetes)
6. The library sorts hooks by weight (assigning a weight of 0 by default), 
   by resource kind and finally by name in ascending order.
7. The library then loads the hook with the lowest weight first (negative to
   positive)
8. The library waits until the hook is "Ready" (except for CRDs)
9. The library loads the resulting resources into Kubernetes. Note that if the
   `--wait` flag is set, the library will wait until all resources are in a
   ready state and will not run the `post-install` hook until they are ready.
10. The library executes the `post-install` hook (loading hook resources)
11. The library waits until the hook is "Ready"
12. The library returns the release object (and other data) to the client
13. The client exits

What does it mean to wait until a hook is ready? This depends on the resource
declared in the hook. If the resource is a `Job` or `Pod` kind, Helm will wait
until it successfully runs to completion. And if the hook fails, the release
will fail. This is a _blocking operation_, so the Helm client will pause while
the Job is run.

For all other kinds, as soon as Kubernetes marks the resource as loaded (added
or updated), the resource is considered "Ready". When many resources are
declared in a hook, the resources are executed serially. If they have hook
weights (see below), they are executed in weighted order. 
Starting from Helm 3.2.0 hook resources with same weight are installed in the same 
order as normal non-hook resources. Otherwise, ordering is
not guaranteed. (In Helm 2.3.0 and after, they are sorted alphabetically. That
behavior, though, is not considered binding and could change in the future.) It
is considered good practice to add a hook weight, and set it to `0` if weight is
not important.

### Hook resources are not managed with corresponding releases

The resources that a hook creates are currently not tracked or managed as part
of the release. Once Helm verifies that the hook has reached its ready state, it
will leave the hook resource alone. Garbage collection of hook resources when
the corresponding release is deleted may be added to Helm 3 in the future, so
any hook resources that must never be deleted should be annotated with
`helm.sh/resource-policy: keep`.

Practically speaking, this means that if you create resources in a hook, you
cannot rely upon `helm uninstall` to remove the resources. To destroy such
resources, you need to either [add a custom `helm.sh/hook-delete-policy`
annotation](#hook-deletion-policies) to the hook template file, or [set the time
to live (TTL) field of a Job
resource](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/).

## Writing a Hook

Hooks are just Kubernetes manifest files with special annotations in the
`metadata` section. Because they are template files, you can use all of the
normal template features, including reading `.Values`, `.Release`, and
`.Template`.

For example, this template, stored in `templates/post-install-job.yaml`,
declares a job to be run on `post-install`:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}"
  labels:
    app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
    app.kubernetes.io/instance: {{ .Release.Name | quote }}
    app.kubernetes.io/version: {{ .Chart.AppVersion }}
    helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
  annotations:
    # This is what defines this resource as a hook. Without this line, the
    # job is considered part of the release.
    "helm.sh/hook": post-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    metadata:
      name: "{{ .Release.Name }}"
      labels:
        app.kubernetes.io/managed-by: {{ .Release.Service | quote }}
        app.kubernetes.io/instance: {{ .Release.Name | quote }}
        helm.sh/chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
    spec:
      restartPolicy: Never
      containers:
      - name: post-install-job
        image: "alpine:3.3"
        command: ["/bin/sleep","{{ default "10" .Values.sleepyTime }}"]

```

What makes this template a hook is the annotation:

```yaml
annotations:
  "helm.sh/hook": post-install
```

One resource can implement multiple hooks:

```yaml
annotations:
  "helm.sh/hook": post-install,post-upgrade
```

Similarly, there is no limit to the number of different resources that may
implement a given hook. For example, one could declare both a secret and a
config map as a pre-install hook.

When subcharts declare hooks, those are also evaluated. There is no way for a
top-level chart to disable the hooks declared by subcharts.

It is possible to define a weight for a hook which will help build a
deterministic executing order. Weights are defined using the following
annotation:

```yaml
annotations:
  "helm.sh/hook-weight": "5"
```

Hook weights can be positive or negative numbers but must be represented as
strings. When Helm starts the execution cycle of hooks of a particular Kind it
will sort those hooks in ascending order.

### Hook deletion policies

It is possible to define policies that determine when to delete corresponding
hook resources. Hook deletion policies are defined using the following
annotation:

```yaml
annotations:
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

You can choose one or more defined annotation values:

| Annotation Value       | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| `before-hook-creation` | Delete the previous resource before a new hook is launched (default) |
| `hook-succeeded`       | Delete the resource after the hook is successfully executed          |
| `hook-failed`          | Delete the resource if the hook failed during execution              |

If no hook deletion policy annotation is specified, the `before-hook-creation`
behavior applies by default.
