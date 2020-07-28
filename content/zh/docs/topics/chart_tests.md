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

Here is an example of a helm test pod definition in the [bitnami wordpress
chart](https://hub.helm.sh/charts/bitnami/wordpress). If you download a copy of
the chart, you can look at the files locally:

```console
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm pull bitnami/wordpress --untar
```

```
wordpress/
  Chart.yaml
  README.md
  values.yaml
  charts/
  templates/
  templates/tests/test-mariadb-connection.yaml
```

In `wordpress/templates/tests/test-mariadb-connection.yaml`, you'll see a test
you can try:

```yaml
{{- if .Values.mariadb.enabled }}
apiVersion: v1
kind: Pod
metadata:
  name: "{{ .Release.Name }}-credentials-test"
  annotations:
    "helm.sh/hook": test-success
spec:
  containers:
    - name: {{ .Release.Name }}-credentials-test
      image: {{ template "wordpress.image" . }}
      imagePullPolicy: {{ .Values.image.pullPolicy | quote }}
      {{- if .Values.securityContext.enabled }}
      securityContext:
        runAsUser: {{ .Values.securityContext.runAsUser }}
      {{- end }}
      env:
        - name: MARIADB_HOST
          value: {{ template "mariadb.fullname" . }}
        - name: MARIADB_PORT
          value: "3306"
        - name: WORDPRESS_DATABASE_NAME
          value: {{ default "" .Values.mariadb.db.name | quote }}
        - name: WORDPRESS_DATABASE_USER
          value: {{ default "" .Values.mariadb.db.user | quote }}
        - name: WORDPRESS_DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: {{ template "mariadb.fullname" . }}
              key: mariadb-password
      command:
        - /bin/bash
        - -ec
        - |
          mysql --host=$MARIADB_HOST --port=$MARIADB_PORT --user=$WORDPRESS_DATABASE_USER --password=$WORDPRESS_DATABASE_PASSWORD
  restartPolicy: Never
{{- end }}
```

## Steps to Run a Test Suite on a Release

First, install the chart on your cluster to create a release. You may have to
wait for all pods to become active; if you test immediately after this install,
it is likely to show a transitive failure, and you will want to re-test.

```console
$ helm install quirky-walrus wordpress --namespace default
$ helm test quirky-walrus
Pod quirky-walrus-credentials-test pending
Pod quirky-walrus-credentials-test pending
Pod quirky-walrus-credentials-test pending
Pod quirky-walrus-credentials-test succeeded
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 pending
Pod quirky-walrus-mariadb-test-dqas5 succeeded
NAME: quirky-walrus
LAST DEPLOYED: Mon Jun 22 17:24:31 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE:     quirky-walrus-mariadb-test-dqas5
Last Started:   Mon Jun 22 17:27:19 2020
Last Completed: Mon Jun 22 17:27:21 2020
Phase:          Succeeded
TEST SUITE:     quirky-walrus-credentials-test
Last Started:   Mon Jun 22 17:27:17 2020
Last Completed: Mon Jun 22 17:27:19 2020
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
