---
title: "Chart Tests"
description: "Describes how to run and test your charts."
aliases: ["/docs/chart_tests/"]
weight: 3
---

A chart contains a number of Kubernetes resources and components that work
together. As a chart author, you may want to write some tests that validate that
your chart works as expected when it is installed. These tests also help the
chart consumer understand what your chart is supposed to do.

A **test** in a helm chart lives under the `templates/` directory and is a job
definition that specifies a container with a given command to run. The container
should exit successfully (exit 0) for a test to be considered a success. The job
definition must contain the helm test hook annotation: `helm.sh/hook: test`.

Note that until Helm v3, the job definition needed to contain one of these helm
test hook annotations: `helm.sh/hook: test-success` or `helm.sh/hook: test-failure`.
`helm.sh/hook: test-success` is still accepted as a backwards-compatible
alternative to `helm.sh/hook: test`.

Example tests:

- Validate that your configuration from the values.yaml file was properly
  injected.
  - Make sure your username and password work correctly
  - Make sure an incorrect username and password does not work
- Assert that your services are up and correctly load balancing
- etc.

You can run the pre-defined tests in Helm on a release using the command `helm
test <RELEASE_NAME>`. For a chart consumer, this is a great way to check that
their release of a chart (or application) works as expected.

## Example Test

The [helm create](/docs/helm/helm_create) command will automatically create a number of folders and files. To try the helm test functionality, first create a demo helm chart. 

```console
$ helm create demo
```

You will now be able to see the following structure in your demo helm chart.

```
demo/
  Chart.yaml
  values.yaml
  charts/
  templates/
  templates/tests/test-connection.yaml
```

In `demo/templates/tests/test-connection.yaml` you'll see a test you can try. You can see the helm test pod definition here:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ include "demo.fullname" . }}-test-connection"
  labels:
    {{- include "demo.labels" . | nindent 4 }}
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: wget
      image: busybox
      command: ['wget']
      args: ['{{ include "demo.fullname" . }}:{{ .Values.service.port }}']
  restartPolicy: Never

```

## Steps to Run a Test Suite on a Release

First, install the chart on your cluster to create a release. You may have to
wait for all pods to become active; if you test immediately after this install,
it is likely to show a transitive failure, and you will want to re-test.

```console
$ helm install demo demo --namespace default
$ helm test demo
NAME: demo
LAST DEPLOYED: Mon Feb 14 20:03:16 2022
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE:     demo-test-connection
Last Started:   Mon Feb 14 20:35:19 2022
Last Completed: Mon Feb 14 20:35:23 2022
Phase:          Succeeded
[...]
```

## Notes

- You can define as many tests as you would like in a single yaml file or spread
  across several yaml files in the `templates/` directory.
- You are welcome to nest your test suite under a `tests/` directory like
  `<chart-name>/templates/tests/` for more isolation.
- A test is a [Helm hook](/docs/charts_hooks/), so annotations like
  `helm.sh/hook-weight` and `helm.sh/hook-delete-policy` may be used with test
  resources.
