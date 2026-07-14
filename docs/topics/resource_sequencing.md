---
title: Resource Sequencing
description: Control the deployment order of resources and subcharts using DAG-based sequencing.
sidebar_position: 3
---

Helm v4 introduces resource sequencing (HIP-0025), giving chart authors first-class mechanisms to define deployment order.
By default, Helm applies all rendered manifests to the cluster simultaneously.
Resource sequencing lets you deploy resources in ordered batches and wait for each batch to reach readiness before proceeding.

## Overview

Resource sequencing addresses a common challenge: applications often require their components to start in a specific order.
For example, a database must be running before an application that depends on it can start.
Previously, chart authors had to use hooks or build sequencing logic into the application itself.
Resource sequencing provides a simpler alternative using annotations and Chart.yaml fields.

When you enable sequencing with `--wait=ordered`, Helm builds two levels of dependency graphs:

1. **Subchart DAG** orders subcharts based on `depends-on` fields in Chart.yaml dependencies or the `helm.sh/depends-on/subcharts` annotation.
2. **Resource-group DAG** orders groups of resources within each chart based on `helm.sh/resource-group` and `helm.sh/depends-on/resource-groups` annotations.

Helm deploys resources in topological order and waits for each batch to reach readiness before proceeding to the next.

## Enabling Resource Sequencing

To enable sequenced deployment, use the `--wait=ordered` flag. It is available on `helm install`, `helm upgrade`, `helm rollback`, and `helm uninstall`:

```console
helm install my-release ./my-chart --wait=ordered
```

You can also specify a per-batch readiness timeout with `--readiness-timeout` on `install`, `upgrade`, and `rollback`:

```console
helm install my-release ./my-chart --wait=ordered --readiness-timeout 2m
```

The `--readiness-timeout` flag sets how long Helm waits for each resource group to become ready (default: 1 minute).
This value must not exceed the overall `--timeout` value; if it does, the command fails before deploying anything.

Readiness for each batch is determined by kstatus signals for the resource kind (Deployment, StatefulSet, Pod, and so on) or by custom readiness annotations when set.
Plain Jobs are an exception: Helm applies the per-batch readiness gate to them only when you also pass `--wait-for-jobs`.

## Resource Groups

Resource groups let you organize resources within a chart and define their deployment order.

### Assigning Resources to Groups

Use the `helm.sh/resource-group` annotation to assign a resource to a named group:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: database-service
  annotations:
    helm.sh/resource-group: database
spec:
  # ...
```

A resource can belong to only one group.
Multiple resources can belong to the same group, and Helm deploys all resources in a group together as a batch.

### Declaring Dependencies Between Groups

Use the `helm.sh/depends-on/resource-groups` annotation to declare that a resource depends on other resource groups being ready:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  annotations:
    helm.sh/resource-group: app
    helm.sh/depends-on/resource-groups: '["database", "cache"]'
spec:
  # ...
```

The value is a JSON array of resource group names, written as a quoted string.
Kubernetes annotation values must be strings, so wrap the array in single quotes; an unquoted YAML sequence is not accepted.
Every listed group is a prerequisite: Helm makes sure all resources in the `database` and `cache` groups are ready before it deploys resources in the `app` group.

### Example: Three-Tier Application

Consider an application with database, cache, and application tiers:

```yaml
# templates/database.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: {{ .Release.Name }}-db
  annotations:
    helm.sh/resource-group: database
spec:
  # ...
---
apiVersion: v1
kind: Service
metadata:
  name: {{ .Release.Name }}-db
  annotations:
    helm.sh/resource-group: database
spec:
  # ...
```

```yaml
# templates/cache.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-cache
  annotations:
    helm.sh/resource-group: cache
spec:
  # ...
```

```yaml
# templates/app.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-app
  annotations:
    helm.sh/resource-group: app
    helm.sh/depends-on/resource-groups: '["database", "cache"]'
spec:
  # ...
```

When you install with `--wait=ordered`, Helm deploys resources in this order:

1. Deploy `database` and `cache` groups in parallel (they have no dependencies on each other)
2. Wait for both groups to become ready
3. Deploy the `app` group
4. Wait for the `app` group to become ready

## Subchart Sequencing

You can also control the deployment order of subcharts.

### Using the depends-on Field in Chart.yaml

Add a `depends-on` field to dependency entries in your Chart.yaml:

```yaml
# Chart.yaml
apiVersion: v2
name: my-app
version: 1.0.0
dependencies:
  - name: nginx
    version: "18.3.1"
    repository: "oci://registry-1.docker.io/bitnamicharts"
  - name: rabbitmq
    version: "9.3.1"
    repository: "oci://registry-1.docker.io/bitnamicharts"
  - name: backend
    version: "1.0.0"
    depends-on:
      - nginx
      - rabbitmq
```

In this example, Helm installs `nginx` and `rabbitmq` first, waits for them to be ready, and then installs `backend`.
Each entry references a sibling subchart by its name, or by its alias when the dependency sets one.
A reference that matches no subchart, or that ambiguously matches more than one, is an error.

### Using the helm.sh/depends-on/subcharts Annotation

You can also use the `helm.sh/depends-on/subcharts` annotation in Chart.yaml:

```yaml
# Chart.yaml
apiVersion: v2
name: my-app
version: 1.0.0
annotations:
  helm.sh/depends-on/subcharts: '["backend", "rabbitmq"]'
dependencies:
  - name: nginx
    version: "18.3.1"
    repository: "oci://registry-1.docker.io/bitnamicharts"
  - name: rabbitmq
    version: "9.3.1"
    repository: "oci://registry-1.docker.io/bitnamicharts"
  - name: backend
    version: "1.0.0"
```

This annotation declares that the parent chart's resources depend on the listed subcharts being fully deployed first.
The two mechanisms express different relationships and can be combined: the per-dependency `depends-on` field orders one subchart relative to its siblings, while the `helm.sh/depends-on/subcharts` annotation orders the parent chart's own resources after the named subcharts.

## Custom Readiness Conditions

By default, Helm uses [kstatus](https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/README.md) to determine resource readiness.
You can override this behavior with custom JSONPath expressions.

### Defining Custom Readiness

Use these annotations to define custom success and failure conditions:

- `helm.sh/readiness-success`: A list of conditions where any being true marks the resource as ready
- `helm.sh/readiness-failure`: A list of conditions where any being true marks the resource as failed (takes precedence over success)

Each annotation value is a JSON array of expression strings, written as a quoted string so Kubernetes accepts it as an annotation value.
Helm evaluates the expressions with OR semantics: the resource is ready as soon as any success expression is true, and failed as soon as any failure expression is true.
Failure takes precedence, so Helm checks the failure conditions before the success conditions.

You must provide both annotations together to override the default readiness logic.
If you provide only one, Helm falls back to kstatus and emits a warning, and `helm lint` reports the mismatch as an error.

### JSONPath Expression Syntax

Expressions use the format:

```text
{<jsonpath_query>} <operator> <value>
```

Where:
- `<jsonpath_query>` is a Kubernetes JSONPath query rooted at the resource's `.status`. Helm rewrites a leading `.field` path to `.status.field`, so `{.phase}` and `{.status.phase}` are equivalent. The query must start with `.` or `[`.
- `<operator>` is one of: `==`, `!=`, `<`, `<=`, `>`, `>=`
- `<value>` is a scalar value. Quote string literals with escaped double quotes (for example, `{.phase} == \"Running\"`). The ordering operators (`<`, `<=`, `>`, `>=`) compare numbers only; using one against a non-numeric value never matches and is rejected by `helm lint`.

### Example: Job Readiness

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-init
  annotations:
    helm.sh/resource-group: init
    helm.sh/readiness-success: '["{.succeeded} >= 1"]'
    helm.sh/readiness-failure: '["{.failed} >= 1"]'
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: init
          image: my-init-image
          command: ["./init.sh"]
```

Helm considers this Job ready when `.status.succeeded >= 1` and failed if `.status.failed >= 1`.

### Example: Custom Controller Status

```yaml
apiVersion: mycontroller.io/v1
kind: Database
metadata:
  name: my-database
  annotations:
    helm.sh/resource-group: database
    helm.sh/readiness-success: '["{.phase} == \"Running\"", "{.ready} == true"]'
    helm.sh/readiness-failure: '["{.phase} == \"Failed\"", "{.phase} == \"Error\""]'
spec:
  # ...
```

## Viewing Sequencing in Templates

When you use `helm template` with `--wait=ordered`, the output includes delimiters showing resource group boundaries:

```console
helm template my-release ./my-chart --wait=ordered
```

Each batch is wrapped in `## START resource-group:` and `## END resource-group:` markers, followed by the group's manifests. The marker names the chart level and the group. Unsequenced manifests trail the last group with no markers:

```yaml
## START resource-group: my-chart database
---
# Source: my-chart/templates/database.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-release-db
  annotations:
    helm.sh/resource-group: database
# ...
## END resource-group: my-chart database
## START resource-group: my-chart app
---
# Source: my-chart/templates/app.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-release-app
  annotations:
    helm.sh/resource-group: app
# ...
## END resource-group: my-chart app
```

Helm strips the internal `helm.sh/depends-on/resource-groups` annotation from this output but keeps `helm.sh/resource-group`.
The `## START`/`## END` markers make this output a view of the deployment plan, not a manifest stream: do not pipe `helm template --wait=ordered` to `kubectl apply`.
For an apply pipeline, run plain `helm template` without `--wait=ordered`.

## Inspecting the Plan with helm dag

The `helm dag` command prints the sequencing plan for a chart without touching a cluster.
It renders the chart locally with a client-side dry run, then shows the subchart batches, the resource-group batches for each chart level, and any unsequenced resources, in the order that `helm install --wait=ordered` would deploy them.
Use it to verify ordering while you author a chart.

```console
$ helm dag ./my-chart
Chart: sequenced-chart
  Subchart batches:
    Batch 1: worker
  Resource-group batches:
    Batch 1: databases
    Batch 2: app
  Unsequenced (deployed last): ConfigMap/unsequenced-config
  Chart: sequenced-chart/charts/worker
    Subchart batches: (none)
    Resource-group batches:
      Batch 1: bootstrap
```

Cycles in either graph are reported as errors.
Because the plan is computed from a local render, `helm dag` accepts the usual chart-loading flags, including `--values`/`--set`, `--kube-version`, `--api-versions`, and `--dependency-update`.
Hooks are excluded from the plan, matching how sequencing treats them at install time.

## Lint Rules for Sequencing

Helm lint detects common sequencing issues. Hook resources are skipped, so sequencing annotations on a hook never trigger these checks.

| Issue | Severity | Description |
|-------|----------|-------------|
| Circular dependencies | Error | Resource groups or subcharts that form a cycle (A depends on B, B depends on A) |
| Unknown references | Error | Dependencies on resource groups or subcharts that don't exist or are disabled |
| Group demotion | Error | A group whose members would be moved to the unsequenced batch because of a missing dependency |
| Partial readiness | Error | Resources with only `helm.sh/readiness-success` or only `helm.sh/readiness-failure`, or with a malformed JSONPath expression |
| Duplicate group assignment | Error | A single resource assigned to two different groups |
| Malformed subchart annotation | Error | Invalid JSON in `helm.sh/depends-on/subcharts` |
| Isolated groups | Warning | A group with no dependencies and no dependents, which is deployed unsequenced |

Run `helm lint` to check for these issues:

```console
$ helm lint ./my-chart
==> Linting ./my-chart
[ERROR] templates/app.yaml: resource group 'nonexistent' referenced in depends-on/resource-groups does not exist
[ERROR] templates/: circular dependency detected: database -> cache -> database

Error: 1 chart(s) linted, 1 chart(s) failed
```

## Execution Order

### Install and Upgrade

When you specify `--wait=ordered`:

1. Build the subchart dependency graph
2. For each batch of subcharts (in topological order):
   a. Build the resource-group graph for each chart in the batch
   b. For each batch of resource groups (in topological order):
      - Deploy all resources in the group
      - Wait for readiness (kstatus or custom JSONPath)
   c. Deploy unsequenced resources (those without annotations or with invalid references)
3. Store sequencing information in the release

### Rollback and Uninstall

Rollback and uninstall process resource groups in reverse topological order.
Helm removes resources starting from the groups that had the most dependencies, working backward to the groups with no dependencies.

If you created a release with `--wait=ordered`, rollback and uninstall operations respect that sequencing.
Releases created without sequencing use the traditional single-batch approach.

## Unsequenced Resources

Helm deploys unsequenced resources after all sequenced groups complete.
This includes resources that lack sequencing annotations, reference a non-existent group, carry invalid annotation values, or belong to an isolated group.
An isolated group is one with no dependencies and no dependents when other groups exist: a lone `helm.sh/resource-group` with no `depends-on` relationships does not get its own sequenced batch, so it is deployed last with the other unsequenced resources.
Helm emits warnings for resources that carry sequencing annotations but fall into the unsequenced batch, so watch the output (or run `helm lint`) to catch misconfiguration.

## Relationship to Hooks

Resource sequencing operates independently from [hooks](/topics/charts_hooks.md).
Helm excludes hook resources (those with `helm.sh/hook` annotations) from sequencing.
Hooks continue to use `helm.sh/hook-weight` for ordering, and Helm ignores sequencing annotations on hook resources.

Use hooks when you need to:
- Run tasks before or after specific lifecycle events (install, upgrade, delete)
- Execute Jobs that are not part of the release

Use resource sequencing when you need to:
- Control the startup order of application components
- Ensure dependencies are running before dependent resources start
- Coordinate deployment across subcharts

## Backward Compatibility

Charts without sequencing annotations behave identically to previous Helm versions.
Helm deploys all resources in a single batch without readiness ordering.

Sequencing is only active when:
- You specify the `--wait=ordered` flag
- The chart contains sequencing annotations or Chart.yaml `depends-on` fields

Releases store whether sequencing was used.
This ensures that upgrades, rollbacks, and uninstalls respect the original installation method.
