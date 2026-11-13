---
title: Resource Upgrades
description: How Helm 3 patches and replaces Kubernetes resources during an upgrade.
sidebar_position: 14
---

This page covers how Helm 3 changes existing resources during `helm upgrade`.
`helm rollback` works the same way, with the selected revision as the target.

## How Resources Are Updated

During `helm upgrade`, Helm renders the chart and compares its resources with the current release.
It creates resources that do not exist in the cluster, updates existing resources, and deletes resources that are no longer in the chart.
Helm does not delete resources that have the `helm.sh/resource-policy: keep` annotation.
For more information about this annotation, see [Chart Development Tips and Tricks](/howto/charts_tips_and_tricks.md).
Chart hooks are not updated this way.
For more information about how Helm creates and deletes hooks, see [Chart Hooks](/topics/charts_hooks.md).

For built-in Kubernetes types such as Deployments, Helm creates a three-way strategic merge patch from:

1. The old manifest stored in the release.
2. The live resource in the cluster.
3. The new manifest rendered for the upgrade.

A field that the new manifest sets gets that value, even if someone changed it in the cluster.
For example, if the chart sets `replicas: 3` and someone scales the live Deployment to zero, an upgrade restores three replicas.
A field that was in the old manifest but not in the new one is removed from the live resource.
A change made outside Helm stays in place when the field is in neither manifest.

Lists follow the merge rules of their Kubernetes type.
For example, a Deployment's containers merge by name, so a container added outside Helm stays after an image update.
Lists without a merge key, such as a container's `args`, are replaced as a whole.

For custom resources, Helm creates a JSON merge patch from the old and new manifests only, without the live resource.
A field that the chart did not change keeps its live value, even if someone changed it outside Helm.
A list that the chart changed replaces the entire live list, including entries added outside Helm.

Helm does not upgrade CustomResourceDefinitions in the chart's `crds/` directory.
For more information, see [Custom Resource Definitions](/chart_best_practices/custom_resource_definitions.md).

## Example: Upgrade a Deployment Changed Outside Helm

To run this example, you need Helm 3 and a test cluster.

1. Create a chart with a Deployment:

   ```shell
   mkdir -p upgrade-demo/templates
   cat > upgrade-demo/Chart.yaml <<'EOF'
   apiVersion: v2
   name: upgrade-demo
   version: 0.1.0
   EOF
   cat > upgrade-demo/values.yaml <<'EOF'
   image: nginx:1.27.5
   selector: upgrade-demo
   EOF
   cat > upgrade-demo/templates/deployment.yaml <<'EOF'
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: upgrade-demo
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: {{ .Values.selector }}
     template:
       metadata:
         labels:
           app: {{ .Values.selector }}
       spec:
         containers:
           - name: server
             image: {{ .Values.image }}
   EOF
   helm install upgrade-demo ./upgrade-demo --namespace upgrade-demo --create-namespace
   ```

2. Scale the Deployment and add a container to its Pod template outside Helm:

   ```shell
   kubectl scale deployment upgrade-demo --replicas=0 --namespace upgrade-demo
   kubectl patch deployment upgrade-demo --namespace upgrade-demo --type=strategic \
     --patch '{"spec":{"template":{"spec":{"containers":[{"name":"helper","image":"busybox:1.37.0","command":["sleep","3600"]}]}}}}'
   ```

3. Upgrade the chart's image and check the result:

   ```shell
   helm upgrade upgrade-demo ./upgrade-demo --namespace upgrade-demo --set image=nginx:1.28.0
   kubectl get deployment upgrade-demo --namespace upgrade-demo \
     -o jsonpath='{.spec.replicas}{"\n"}{range .spec.template.spec.containers[*]}{.name}={.image}{"\n"}{end}'
   ```

   The replica count is back to three, the server image changes, and the helper container stays.
   Container order can vary:

   ```text
   3
   helper=busybox:1.37.0
   server=nginx:1.28.0
   ```

## Replace Resources With `--force`

With `helm upgrade --force`, Helm replaces each existing resource with a Kubernetes API `PUT` request instead of a patch.
The request carries only the rendered object, so changes made outside Helm are lost, and fields that the chart leaves out can return to their default values.
Helm does not delete and recreate the resource, so Kubernetes still rejects changes to immutable fields.

1. Continuing the example, replace the Deployment:

   ```shell
   helm upgrade upgrade-demo ./upgrade-demo --namespace upgrade-demo --force --set image=nginx:1.28.0
   kubectl get deployment upgrade-demo --namespace upgrade-demo \
     -o jsonpath='{range .spec.template.spec.containers[*]}{.name}={.image}{"\n"}{end}'
   ```

   Only the chart's container remains:

   ```text
   server=nginx:1.28.0
   ```

   It is still the same Deployment object, but the changed Pod template starts a new rollout.

2. Try to change the Deployment's selector, which is immutable:

   ```shell
   helm upgrade upgrade-demo ./upgrade-demo --namespace upgrade-demo --force \
     --set image=nginx:1.28.0 --set selector=changed
   ```

   The upgrade fails with a `field is immutable` error for `spec.selector`, and the existing Deployment stays in place.

3. Remove the example release and namespace:

   ```shell
   helm uninstall upgrade-demo --namespace upgrade-demo
   kubectl delete namespace upgrade-demo
   ```

For more information about how this differs from Helm 2, see [Changes Since Helm 2](/faq/changes_since_helm2.md).
