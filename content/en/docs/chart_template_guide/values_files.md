---
title: "Values Files"
description: "Instructions on how to use the --values flag."
weight: 4
---

In the previous section we looked at the built-in objects that Helm templates
offer. One of the built-in objects is `Values`. This object provides access to
values passed into the chart. Its contents come from multiple sources:

- The `values.yaml` file in the chart
- If this is a subchart, the `values.yaml` file of a parent chart
- A values file if passed into `helm install` or `helm upgrade` with the `-f`
  flag (`helm install -f myvals.yaml ./mychart`)
- Individual parameters passed with `--set` (such as `helm install --set foo=bar
  ./mychart`)

The list above is in order of specificity: `values.yaml` is the default, which
can be overridden by a parent chart's `values.yaml`, which can in turn be
overridden by a user-supplied values file, which can in turn be overridden by
`--set` parameters.

Values files are plain YAML files. Let's edit `mychart/values.yaml` and then
edit our ConfigMap template.

Removing the defaults in `values.yaml`, we'll set just one parameter:

```yaml
favoriteDrink: coffee
```

Now we can use this inside of a template:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favoriteDrink }}
```

Notice on the last line we access `favoriteDrink` as an attribute of `Values`:
`{{ .Values.favoriteDrink }}`.

Let's see how this renders.

```console
$ helm install geared-marsupi ./mychart --dry-run --debug
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: geared-marsupi
LAST DEPLOYED: Wed Feb 19 23:21:13 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
favoriteDrink: coffee

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: geared-marsupi-configmap
data:
  myvalue: "Hello World"
  drink: coffee
```

Because `favoriteDrink` is set in the default `values.yaml` file to `coffee`,
that's the value displayed in the template. We can easily override that by
adding a `--set` flag in our call to `helm install`:

```console
$ helm install solid-vulture ./mychart --dry-run --debug --set favoriteDrink=slurm
install.go:158: [debug] Original chart version: ""
install.go:175: [debug] CHART PATH: /home/bagratte/src/playground/mychart

NAME: solid-vulture
LAST DEPLOYED: Wed Feb 19 23:25:54 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
favoriteDrink: slurm

COMPUTED VALUES:
favoriteDrink: slurm

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: solid-vulture-configmap
data:
  myvalue: "Hello World"
  drink: slurm
```

Since `--set` has a higher precedence than the default `values.yaml` file, our
template generates `drink: slurm`.

Values files can contain more structured content, too. For example, we could
create a `favorite` section in our `values.yaml` file, and then add several keys
there:

```yaml
favorite:
  drink: coffee
  food: pizza
```

Now we would have to modify the template slightly:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink }}
  food: {{ .Values.favorite.food }}
```

While structuring data this way is possible, the recommendation is that you keep
your values trees shallow, favoring flatness. When we look at assigning values
to subcharts, we'll see how values are named using a tree structure.

## Deleting a default key

If you need to delete a key from the default values, you may override the value
of the key to be `null`, in which case Helm will remove the key from the
overridden values merge.

For example, the stable Drupal chart allows configuring the liveness probe, in
case you configure a custom image. Here are the default values:
```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  initialDelaySeconds: 120
```

If you try to override the livenessProbe handler to `exec` instead of `httpGet`
using `--set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt]`, Helm will
coalesce the default and overridden keys together, resulting in the following
YAML:
```yaml
livenessProbe:
  httpGet:
    path: /user/login
    port: http
  exec:
    command:
    - cat
    - docroot/CHANGELOG.txt
  initialDelaySeconds: 120
```

However, Kubernetes would then fail because you can not declare more than one
livenessProbe handler. To overcome this, you may instruct Helm to delete the
`livenessProbe.httpGet` by setting it to null:
```sh
helm install stable/drupal --set image=my-registry/drupal:0.1.0 --set livenessProbe.exec.command=[cat,docroot/CHANGELOG.txt] --set livenessProbe.httpGet=null
```

## Overriding indexes between values files
In most cases, lists get overridden between different value files layers as they get merged together. For example, the following in base values:
```yml
# values.yaml
myList:
- one
- two
- three
```
when combined with these additional values passed in through `-f`
```yml
# -f more-values.yaml
myList:
- new
```
will result in:
```yml
# Computed Values
```yml
# values.yaml
myList:
- new
```

If we want to instead do a targeted override of an existing list index, we can use the `--index-override` flag as of helm `3.16`:

```yml
# base values yaml
volumeMounts:
- name: foo
  mountPath: "/etc/foo"
  readOnly: true
- name: second
  mountPath: "/mnt/second"
  readOnly: true
```

```yml
# overlay values
volumeMounts[1]:
- name: second
  mountPath: "/etc/new-place"
  readOnly: false
```

```yml
# computed values
volumeMounts:
- name: foo
  mountPath: "/etc/foo"
  readOnly: true
- name: second
  mountPath: "/etc/new-place"
  readOnly: false
```

### Limitations
There are some key restrictions on the override behavior offered by the `--index-override` flag:
- The provided index must be valid within the underlying list (not out of bounds, not invalid such as `[]`)
  - In the example above, only `volumeMounts[0]` and `volumeMounts[1]` would be valid override keys
- The base key must be present in a lower layer
  - In the example above would be invalid if the base layer did not contain `volumeMounts`
- Overrides can not be set in the same layer as the plain key
  - In the example above, it would be invalid to provide the plain `volumeMounts` key within the overlay values file


At this point, we've seen several built-in objects, and used them to inject
information into a template. Now we will take a look at another aspect of the
template engine: functions and pipelines.
