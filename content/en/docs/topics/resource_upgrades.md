---
title: "Resource Upgrades: three-way strategic merge patches"
description: "Describes Helm's approach to upgrades."
---

Helm uses a three-way strategic merge and patch process to update resources when upgrading a chart.

The three-way strategic merge allows Helm to upgrade resources that get modified out-of-band. Without 'over-writing' those modifications. Also allowing Helm to similarly rollback only Helm managed updates. For example, if a service mesh controller injects a side-car.

During an upgrade, Helm compares a resource's old manifest, its live state, and the new/updated manifest. Then generates a patch to apply.

Properties of a resource which are declared in the chart are always updated/reverted. Even if updated out-of-band. As helm "converges" to the declared state from the chart.

Helm can also replace existing resources on upgrades with the `--force` flag.

## Examples

Let's go through a few common examples for how this change impacts Helm's ability to manage resources

### Rolling back where live state has changed

Your team just deployed their application to production on Kubernetes using
Helm. The chart contains a Deployment object where the number of replicas is set
to three:

```console
$ helm install myapp ./myapp
```

A new developer joins the team. On their first day while observing the
production cluster, a horrible coffee-spilling-on-the-keyboard accident happens
and they `kubectl scale` the production deployment from three replicas down to
zero.

```console
$ kubectl scale --replicas=0 deployment/myapp
```

Another developer on your team notices that the production site is down and
decides to rollback the release to its previous state:

```console
$ helm rollback myapp
```

What happens?

Helm generates a patch using the old manifest, the live state, and
the new manifest. Helm recognizes that the old state was at three, the live
state is at zero and the new manifest wishes to change it back to three, so it
generates a patch to change the state back to three.

### Upgrades where live state has changed

Many service meshes and other controller-based applications inject data into
Kubernetes objects. This can be something like a sidecar, labels, or other
information. Previously if you had the given manifest rendered from a Chart:

```yaml
containers:
- name: server
  image: nginx:2.0.0
```

And the live state was modified by another application to

```yaml
containers:
- name: server
  image: nginx:2.0.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```

Now, you want to upgrade the `nginx` image tag to `2.1.0`. So, you upgrade to a
chart with the given manifest:

```yaml
containers:
- name: server
  image: nginx:2.1.0
```

What happens?

Helm generates a patch of the `containers` object between the old
manifest, the live state, and the new manifest. It notices that the new manifest
changes the image tag to `2.1.0`, but live state contains a sidecar container.

The cluster's live state is modified to look like the following:

```yaml
containers:
- name: server
  image: nginx:2.1.0
- name: my-injected-sidecar
  image: my-cool-mesh:1.0.0
```
