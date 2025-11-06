---
title: Library Charts
description: Explains library charts and examples of usage
sidebar_position: 4
---

A library chart is a type of [Helm chart](/topics/charts.mdx)
that defines chart primitives or definitions which can be shared by Helm
templates in other charts. This allows users to share snippets of code that can
be re-used across charts, avoiding repetition and keeping charts
[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

The library chart was introduced in Helm 3 to formally recognize common or
helper charts that have been used by chart maintainers since Helm 2. By
including it as a chart type, it provides:
- A means to explicitly distinguish between common and application charts
- Logic to prevent installation of a common chart
- No rendering of templates in a common chart which may contain release
  artifacts
- Allow for dependent charts to use the importer's context

A chart maintainer can define a common chart as a library chart and now be
confident that Helm will handle the chart in a standard consistent fashion. It
also means that definitions in an application chart can be shared by changing
the chart type.

## Create a Simple Library Chart

As mentioned previously, a library chart is a type of [Helm chart](/topics/charts.mdx). This means that you can start off by creating a
scaffold chart:

```console
$ helm create mylibchart
Creating mylibchart
```

You will first remove all the files in `templates` directory as we will create
our own templates definitions in this example.

```console
$ rm -rf mylibchart/templates/*
```

The values file will not be required either.

```console
$ rm -f mylibchart/values.yaml
```

Before we jump into creating common code, lets do a quick review of some
relevant Helm concepts. A [named template](/chart_template_guide/named_templates.md) (sometimes called a partial
or a subtemplate) is simply a template defined inside of a file, and given a
name.  In the `templates/` directory, any file that begins with an underscore(_)
is not expected to output a Kubernetes manifest file. So by convention, helper
templates and partials are placed in a `_*.tpl` or `_*.yaml` files.

In this example, we will code a common ConfigMap which creates an empty
ConfigMap resource. We will define the common ConfigMap in file
`mylibchart/templates/_configmap.yaml` as follows:

```yaml
{{- define "mylibchart.configmap.tpl" -}}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data: {}
{{- end -}}
{{- define "mylibchart.configmap" -}}
{{- include "mylibchart.util.merge" (append . "mylibchart.configmap.tpl") -}}
{{- end -}}
```

The ConfigMap construct is defined in named template `mylibchart.configmap.tpl`.
It is a simple ConfigMap with an empty resource, `data`. Within this file there
is another named template called `mylibchart.configmap`. This named template
includes another named template `mylibchart.util.merge` which will take 2 named
templates as arguments, the template calling `mylibchart.configmap` and
`mylibchart.configmap.tpl`.

The helper function `mylibchart.util.merge` is a named template in
`mylibchart/templates/_util.yaml`. It is a handy util from [The Common Helm
Helper Chart](#the-common-helm-helper-chart) because it merges the 2 templates
and overrides any common parts in both:

```yaml
{{- /*
mylibchart.util.merge will merge two YAML templates and output the result.
This takes an array of three values:
- the top context
- the template name of the overrides (destination)
- the template name of the base (source)
*/}}
{{- define "mylibchart.util.merge" -}}
{{- $top := first . -}}
{{- $overrides := fromYaml (include (index . 1) $top) | default (dict ) -}}
{{- $tpl := fromYaml (include (index . 2) $top) | default (dict ) -}}
{{- toYaml (merge $overrides $tpl) -}}
{{- end -}}
```

This is important when a chart wants to use common code that it needs to
customize with its configuration.

Finally, lets change the chart type to `library`. This requires editing
`mylibchart/Chart.yaml` as follows:

```yaml
apiVersion: v2
name: mylibchart
description: A Helm chart for Kubernetes

# A chart can be either an 'application' or a 'library' chart.
#
# Application charts are a collection of templates that can be packaged into versioned archives
# to be deployed.
#
# Library charts provide useful utilities or functions for the chart developer. They're included as
# a dependency of application charts to inject those utilities and functions into the rendering
# pipeline. Library charts do not define any templates and therefore cannot be deployed.
# type: application
type: library

# This is the chart version. This version number should be incremented each time you make changes
# to the chart and its templates, including the app version.
version: 0.1.0

# This is the version number of the application being deployed. This version number should be
# incremented each time you make changes to the application and it is recommended to use it with quotes.
appVersion: "1.16.0"
```

The library chart is now ready to be shared and its ConfigMap definition to be
re-used.

Before moving on, it is worth checking if Helm recognizes the chart as a library
chart:

```console
$ helm install mylibchart mylibchart/
Error: library charts are not installable
```

## Use the Simple Library Chart

It is time to use the library chart. This means creating a scaffold chart again:

```console
$ helm create mychart
Creating mychart
```

Lets clean out the template files again as we want to create a ConfigMap only:

```console
$ rm -rf mychart/templates/*
```

When we want to create a simple ConfigMap in a Helm template, it could look
similar to the following:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name | printf "%s-%s" .Chart.Name }}
data:
  myvalue: "Hello World"
```

We are however going to re-use the common code already created in `mylibchart`.
The ConfigMap can be created in the file `mychart/templates/configmap.yaml` as
follows:

```yaml
{{- include "mylibchart.configmap" (list . "mychart.configmap") -}}
{{- define "mychart.configmap" -}}
data:
  myvalue: "Hello World"
{{- end -}}
```

You can see that it simplifies the work we have to do by inheriting the common
ConfigMap definition which adds standard properties for ConfigMap. In our
template we add the configuration, in this case the data key `myvalue` and its
value. The configuration override the empty resource of the common ConfigMap.
This is feasible because of the helper function `mylibchart.util.merge` we
mentioned in the previous section.

To be able to use the common code, we need to add `mylibchart` as a dependency.
Add the following to the end of the file `mychart/Chart.yaml`:

```yaml
# My common code in my library chart
dependencies:
- name: mylibchart
  version: 0.1.0
  repository: file://../mylibchart
```

This includes the library chart as a dynamic dependency from the filesystem
which is at the same parent path as our application chart. As we are including
the library chart as a dynamic dependency, we need to run `helm dependency
update`. It will copy the library chart into your `charts/` directory.

```console
$ helm dependency update mychart/
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 1 charts
Deleting outdated charts
```

We are now ready to deploy our chart. Before installing, it is worth checking
the rendered template first.

```console
$ helm install mydemo mychart/ --debug --dry-run
install.go:159: [debug] Original chart version: ""
install.go:176: [debug] CHART PATH: /root/test/helm-charts/mychart

NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:48:47 2020
NAMESPACE: default
STATUS: pending-install
REVISION: 1
TEST SUITE: None
USER-SUPPLIED VALUES:
{}

COMPUTED VALUES:
affinity: {}
fullnameOverride: ""
image:
  pullPolicy: IfNotPresent
  repository: nginx
imagePullSecrets: []
ingress:
  annotations: {}
  enabled: false
  hosts:
  - host: chart-example.local
    paths: []
  tls: []
mylibchart:
  global: {}
nameOverride: ""
nodeSelector: {}
podSecurityContext: {}
replicaCount: 1
resources: {}
securityContext: {}
service:
  port: 80
  type: ClusterIP
serviceAccount:
  annotations: {}
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
```

This looks like the ConfigMap we want with data override of `myvalue: Hello
World`. Lets install it:

```console
$ helm install mydemo mychart/
NAME: mydemo
LAST DEPLOYED: Tue Mar  3 17:52:40 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

We can retrieve the release and see that the actual template was loaded.

```console
$ helm get manifest mydemo
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
data:
  myvalue: Hello World
kind: ConfigMap
metadata:
  labels:
    app: mychart
    chart: mychart-0.1.0
    release: mydemo
  name: mychart-mydemo
  ```

## Library Chart Benefits
Because of their inability to act as standalone charts, library charts can leverage the following functionality:
- The `.Files` object references the file paths on the parent chart, rather than the path local to the library chart
- The `.Values` object is the same as the parent chart, in contrast to application [subcharts](/chart_template_guide/subcharts_and_globals.md) which receive the section of values configured under their header in the parent.


## The Common Helm Helper Chart

```markdown
Note: The Common Helm Helper Chart repo on Github is no longer actively maintained, and the repo has been deprecated and archived.
```

This [chart](https://github.com/helm/charts/tree/master/incubator/common) was
the original pattern for common charts. It provides utilities that reflect best
practices of Kubernetes chart development. Best of all it can be used off the
bat by you when developing your charts to give you handy shared code.

Here is a quick way to use it. For more details, have a look at the
[README](https://github.com/helm/charts/blob/master/incubator/common/README.md).

Create a scaffold chart again:

```console
$ helm create demo
Creating demo
```

Lets use the common code from the helper chart. First, edit deployment
`demo/templates/deployment.yaml` as follows:

```yaml
{{- template "common.deployment" (list . "demo.deployment") -}}
{{- define "demo.deployment" -}}
## Define overrides for your Deployment resource here, e.g.
apiVersion: apps/v1
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "demo.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "demo.selectorLabels" . | nindent 8 }}

{{- end -}}
```

And now the service file, `demo/templates/service.yaml` as follows:

```yaml
{{- template "common.service" (list . "demo.service") -}}
{{- define "demo.service" -}}
## Define overrides for your Service resource here, e.g.
# metadata:
#   labels:
#     custom: label
# spec:
#   ports:
#   - port: 8080
{{- end -}}
```

These templates show how inheriting the common code from the helper chart
simplifies your coding down to your configuration or customization of the
resources.

To be able to use the common code, we need to add `common` as a dependency. Add
the following to the end of the file `demo/Chart.yaml`:

```yaml
dependencies:
- name: common
  version: "^0.0.5"
  repository: "https://charts.helm.sh/incubator/"
```

Note: You will need to add the `incubator` repo to the Helm repository list
(`helm repo add`).

As we are including the chart as a dynamic dependency, we need to run `helm
dependency update`. It will copy the helper chart into your `charts/` directory.

As helper chart is using some Helm 2 constructs, you will need to add the
following to `demo/values.yaml` to enable the `nginx` image to be loaded as this
was updated in Helm 3 scaffold chart:

```yaml
image:
  tag: 1.16.0
```

You can test that the chart templates are correct prior to deploying using the `helm lint` and `helm template` commands.

If it's good to go, deploy away using `helm install`!

