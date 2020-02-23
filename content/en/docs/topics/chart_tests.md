---
title: "Chart Tests"
description: "Describes how to run and test your charts."
aliases: ["/docs/chart_tests/"]
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

- Validate that your configuration from the values.yaml file was properly injected.
  - Make sure your username and password work correctly
  - Make sure an incorrect username and password does not work
- Assert that your services are up and correctly load balancing
- etc.

You can run the pre-defined tests in Helm on a release using the command `helm test <RELEASE_NAME>`. For a chart consumer, this is a great way to sanity check that their release of a chart (or application) works as expected.

## Example Test

Here is an example of a helm test pod definition in an example mariadb chart:

```
mariadb/
  Chart.yaml
  README.md
  values.yaml
  charts/
  templates/
  templates/tests/test-mariadb-connection.yaml
```

In `mariadb/templates/tests/test-mariadb-connection.yaml`:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}-credentials-test"
  annotations:
    "helm.sh/hook": test
spec:
  template:
    spec:
      containers:
      - name: main
        image: {{ .Values.image }}
        env:
        - name: MARIADB_HOST
          value: {{ template "mariadb.fullname" . }}
        - name: MARIADB_PORT
          value: "3306"
        - name: WORDPRESS_DATABASE_NAME
          value: {{ default "" .Values.mariadb.mariadbDatabase | quote }}
        - name: WORDPRESS_DATABASE_USER
          value: {{ default "" .Values.mariadb.mariadbUser | quote }}
        - name: WORDPRESS_DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: {{ template "mariadb.fullname" . }}
              key: mariadb-password
        command: ["sh", "-c", "mysql --host=$MARIADB_HOST --port=$MARIADB_PORT --user=$WORDPRESS_DATABASE_USER --password=$WORDPRESS_DATABASE_PASSWORD"]
      restartPolicy: Never
```

## Steps to Run a Test Suite on a Release

1. `$ helm install quirky-walrus mariadb --namespace default`
2. `$ helm test quirky-walrus`

```cli
NAME: quirky-walrus
LAST DEPLOYED: Mon Feb 13 13:50:43 2019
NAMESPACE: default
STATUS: deployed
REVISION: 0
TEST SUITE:     quirky-walrus-credentials-test
Last Started:   Mon Feb 13 13:51:07 2019
Last Completed: Mon Feb 13 13:51:18 2019
Phase:          Succeeded
```

## Notes

- You can define as many tests as you would like in a single yaml file or spread
  across several yaml files in the `templates/` directory.
- You are welcome to nest your test suite under a `tests/` directory like
  `<chart-name>/templates/tests/` for more isolation.
- A test is a [Helm hook](/docs/charts_hooks/), so annotations like `helm.sh/hook-weight`
  and `helm.sh/hook-delete-policy` may be used with test resources.
