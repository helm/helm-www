---
title: "Helm 3 Preview: Charting Our Future – Part 4: Release Management"
slug: "helm-3-preview-pt4"
authors: ["mattfisher"]
date: "2019-05-02"
---

This is part 4 of 7 of our *Helm 3 Preview: Charting Our Future* blog series on release management. (Check out our previous blog post on the Helm chart repositories [here](https://helm.sh/blog/helm-3-preview-pt3/.).

In Helm 3, an application's state is tracked in-cluster by a pair of objects:<!-- truncate -->

- The release object: represents an instance of an application
- The release version secret: represents an application's desired state at a particular instance of time (the release of a new version, for example)

A `helm install` creates a release object and a release version secret. A `helm upgrade` requires an existing release object (which it may modify) and creates a new release version secret that contains the new values and rendered manifest.

The release object contains information about a release, where a release is a particular installation of a named chart and values. This object describes the top-level metadata about a release. The release object persists for the duration of an application lifecycle, and is the owner of all release version secrets, as well as of all objects that are directly created by the Helm chart.

The release version secret ties a release to a series of revisions (install, upgrades, rollbacks, delete).

In Helm 2, revisions were merely incremental. `helm install` created v1, a subsequent upgrade created v2, and so on. The release and release version secret were collapsed into a single object known as a revision. Revisions were stored in the same namespace as Tiller, meaning that each release name was "globally" namespaced; as a result, only one instance of a name could be used.

For Helm 3, a release has one or more release version secrets associated with it. The release object always describes the current release deployed to Kubernetes. Each release version secret describes just one version of that release. An upgrade operation, for example, will create a new release version secret, and then modify the release object to point to this new version. Rollback operations can use older release version secrets to roll back a release to a previous state.

With Tiller gone, Helm 3 stores release data in the same namespace as the release's destination. This change allows one to install a chart with the same release name in another namespace, and data is persisted between cluster upgrades/reboots in etcd. You can install Wordpress into namespace "foo" as well as namespace "bar", and both releases can be referred to as "wordpress".

Speaking of Charts...read the next blog [here](https://helm.sh/blog/helm-3-preview-pt5/) where we discuss changes to chart dependencies in our *Helm 3 Preview: Charting Our Future* blog series over the course of 4 weeks.
