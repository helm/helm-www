---
title: "Helm Uninstall --cascade orphan Doesn't Keep What You Think"
slug: "helm-uninstall-cascade-orphan"
authors: ["adityareddy"]
date: "2026-11-17"
---

The `--cascade` flag on `helm uninstall` takes a value called `orphan`, and the name sounds like it leaves your chart's resources behind.
It doesn't.
The uninstall guide never said what `orphan` keeps, so it was left to a guess, and someone guessed wrong in public.

<!-- truncate -->

## The Report

In August 2024 someone opened [helm issue 13279](https://github.com/helm/helm/issues/13279).
They had a chart already released and wanted to uninstall the release without removing any of the resources it created.
So they ran `helm uninstall my-release --cascade orphan -n my-namespace` and expected everything to stay.

Not everything stayed.
The command worked as they wanted for resources with an `ownerReference` to a CustomResource.
ConfigMaps and ServiceAccounts without one were wiped.
They expected the command to delete nothing.
The workaround they landed on was a manual `kubectl delete secret -l owner=helm,name=my-release -n my-namespace`.
They were on Helm v3.14.0 and Minikube.

## What the Flag Does

`--cascade` sets the Kubernetes deletion propagation policy.
With `orphan`, Helm still deletes the resources listed in the release manifest, so Deployments, ConfigMaps, and Secrets are removed.
What Kubernetes keeps is their dependents.
Delete a Deployment this way and the ReplicaSets it created stay behind.

So the flag is about the children of the things Helm deletes.
The reporter was asking about the things themselves, which is a different layer, and nothing in the guide told them so.

## Keep a Chart Resource

If you want a resource to survive an uninstall, add the `helm.sh/resource-policy: keep` annotation to that resource's template in the chart.
It works per resource, so you choose which ones stay.
The annotation was already explained in the chart tips and tricks, under "Tell Helm Not To Uninstall a Resource".
Nothing in the uninstall guide pointed there.

I fixed that in [pull request 2333](https://github.com/helm/helm-www/pull/2333) on helm/helm-www, which was merged on 4 November 2026.
It adds 11 lines to `docs/intro/using_helm.mdx` and removes none.
The added text says what `--cascade orphan` preserves and gives the Deployment and ReplicaSet example.
It also links the keep annotation for anyone who wanted to retain chart resources.
It is only a docs change, because the command itself already behaved this way.
