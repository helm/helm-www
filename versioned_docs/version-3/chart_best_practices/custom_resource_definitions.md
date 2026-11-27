---
title: Custom Resource Definitions
description: How to handle creating and using CRDs.
sidebar_position: 7
---

This section of the Best Practices Guide deals with creating and using Custom
Resource Definition objects.

When working with Custom Resource Definitions (CRDs), it is important to
distinguish two different pieces:

- There is a declaration of a CRD. This is the YAML file that has the kind
  `CustomResourceDefinition`
- Then there are resources that _use_ the CRD. Say a CRD defines
  `foo.example.com/v1`. Any resource that has `apiVersion: example.com/v1` and
  kind `Foo` is a resource that uses the CRD.

## Install a CRD Declaration Before Using the Resource

Helm is optimized to load as many resources into Kubernetes as fast as possible.
By design, Kubernetes can take an entire set of manifests and bring them all
online (this is called the reconciliation loop).

But there's a difference with CRDs.

For a CRD, the declaration must be registered before any resources of that CRDs
kind(s) can be used. And the registration process sometimes takes a few seconds.

### Method 1: Let `helm` Do It For You

With the arrival of Helm 3, we removed the old `crd-install` hooks for a more
simple methodology. There is now a special directory called `crds` that you can
create in your chart to hold your CRDs. These CRDs are not templated, but will
be installed by default when running a `helm install` for the chart. If the CRD
already exists, it will be skipped with a warning. If you wish to skip the CRD
installation step, you can pass the `--skip-crds` flag.

#### Some caveats (and explanations)

There is no support at this time for upgrading or deleting CRDs using Helm. This
was an explicit decision after much community discussion due to the danger for
unintentional data loss. Furthermore, there is currently no community consensus
around how to handle CRDs and their lifecycle. As this evolves, Helm will add
support for those use cases.

The `--dry-run` flag of `helm install` and `helm upgrade` is not currently
supported for CRDs. The purpose of "Dry Run" is to validate that the output of
the chart will actually work if sent to the server. But CRDs are a modification
of the server's behavior. Helm cannot install the CRD on a dry run, so the
discovery client will not know about that Custom Resource (CR), and validation
will fail. You can alternatively move the CRDs to their own chart or use `helm
template` instead.

Another important point to consider in the discussion around CRD support is how
the rendering of templates is handled. One of the distinct disadvantages of the
`crd-install` method used in Helm 2 was the inability to properly validate
charts due to changing API availability (a CRD is actually adding another
available API to your Kubernetes cluster). If a chart installed a CRD, `helm` no
longer had a valid set of API versions to work against. This is also the reason
behind removing templating support from CRDs. With the new `crds` method of CRD
installation, we now ensure that `helm` has completely valid information about
the current state of the cluster.

### Method 2: Separate Charts

Another way to do this is to put the CRD definition in one chart, and then put
any resources that use that CRD in _another_ chart.

In this method, each chart must be installed separately. However, this workflow
may be more useful for cluster operators who have admin access to a cluster

## CRDs in the `templates/` Directory

Helm does not upgrade or delete CRDs in the `crds/` directory. A CRD in the
`templates/` directory is different: Helm manages it like any other resource in
the release. Helm updates it on `helm upgrade` and deletes it on
`helm uninstall`, or when an upgrade or rollback removes it from the release.
The `--skip-crds` flag has no effect on CRDs in `templates/`.

Deleting a CRD also deletes all of its custom resources across all namespaces in
the cluster. To prevent Helm from deleting a CRD in `templates/`, add the
`helm.sh/resource-policy: keep` annotation to it:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
  annotations:
    helm.sh/resource-policy: keep
spec:
  # ...
```

On `helm uninstall`, Helm reads this annotation from the release manifest, not
from the CRD in the cluster. If the release is already installed, upgrade it
with the annotated CRD before you uninstall it. For more information about this
annotation, see
[Tell Helm Not To Uninstall a Resource](/howto/charts_tips_and_tricks.md#tell-helm-not-to-uninstall-a-resource).
