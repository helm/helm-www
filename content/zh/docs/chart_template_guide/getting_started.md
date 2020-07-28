---
title: "Getting Started"
weight: 2
description: "A quick guide on Chart templates."
aliases: ["/intro/getting_started/"]
---

In this section of the guide, we'll create a chart and then add a first
template. The chart we created here will be used throughout the rest of the
guide.

To get going, let's take a brief look at a Helm chart.

## Charts

As described in the [Charts Guide](../../topics/charts), Helm charts are
structured like this:

```
mychart/
  Chart.yaml
  values.yaml
  charts/
  templates/
  ...
```

The `templates/` directory is for template files. When Helm evaluates a chart,
it will send all of the files in the `templates/` directory through the template
rendering engine. It then collects the results of those templates and sends them
on to Kubernetes.

The `values.yaml` file is also important to templates. This file contains the
_default values_ for a chart. These values may be overridden by users during
`helm install` or `helm upgrade`.

The `Chart.yaml` file contains a description of the chart. You can access it
from within a template. The `charts/` directory _may_ contain other charts
(which we call _subcharts_). Later in this guide we will see how those work when
it comes to template rendering.

## A Starter Chart

For this guide, we'll create a simple chart called `mychart`, and then we'll
create some templates inside of the chart.

```console
$ helm create mychart
Creating mychart
```

### A Quick Glimpse of `mychart/templates/`

If you take a look at the `mychart/templates/` directory, you'll notice a few
files already there.

- `NOTES.txt`: The "help text" for your chart. This will be displayed to your
  users when they run `helm install`.
- `deployment.yaml`: A basic manifest for creating a Kubernetes
  [deployment](https://kubernetes.io/docs/user-guide/deployments/)
- `service.yaml`: A basic manifest for creating a [service
  endpoint](https://kubernetes.io/docs/user-guide/services/) for your deployment
- `_helpers.tpl`: A place to put template helpers that you can re-use throughout
  the chart

And what we're going to do is... _remove them all!_ That way we can work through
our tutorial from scratch. We'll actually create our own `NOTES.txt` and
`_helpers.tpl` as we go.

```console
$ rm -rf mychart/templates/*
```

When you're writing production grade charts, having basic versions of these
charts can be really useful. So in your day-to-day chart authoring, you probably
won't want to remove them.

## A First Template

The first template we are going to create will be a `ConfigMap`. In Kubernetes,
a ConfigMap is simply a container for storing configuration data. Other things,
like pods, can access the data in a ConfigMap.

Because ConfigMaps are basic resources, they make a great starting point for us.

Let's begin by creating a file called `mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

**TIP:** Template names do not follow a rigid naming pattern. However, we
recommend using the suffix `.yaml` for YAML files and `.tpl` for helpers.

The YAML file above is a bare-bones ConfigMap, having the minimal necessary
fields. In virtue of the fact that this file is in the `mychart/templates/`
directory, it will be sent through the template engine.

It is just fine to put a plain YAML file like this in the `mychart/templates/`
directory. When Helm reads this template, it will simply send it to Kubernetes
as-is.

With this simple template, we now have an installable chart. And we can install
it like this:

```console
$ helm install full-coral ./mychart
NAME: full-coral
LAST DEPLOYED: Tue Nov  1 17:36:01 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

Using Helm, we can retrieve the release and see the actual template that was
loaded.

```console
$ helm get manifest full-coral

---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart-configmap
data:
  myvalue: "Hello World"
```

The `helm get manifest` command takes a release name (`full-coral`) and prints
out all of the Kubernetes resources that were uploaded to the server. Each file
begins with `---` to indicate the start of a YAML document, and then is followed
by an automatically generated comment line that tells us what template file
generated this YAML document.

From there on, we can see that the YAML data is exactly what we put in our
`configmap.yaml` file.

Now we can uninstall our release: `helm uninstall full-coral`.

### Adding a Simple Template Call

Hard-coding the `name:` into a resource is usually considered to be bad
practice. Names should be unique to a release. So we might want to generate a
name field by inserting the release name.

**TIP:** The `name:` field is limited to 63 characters because of limitations to
the DNS system. For that reason, release names are limited to 53 characters.
Kubernetes 1.3 and earlier limited to only 24 characters (thus 14 character
names).

Let's alter `configmap.yaml` accordingly.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
```

The big change comes in the value of the `name:` field, which is now
`{{ .Release.Name }}-configmap`.

> A template directive is enclosed in `{{` and `}}` blocks.

The template directive `{{ .Release.Name }}` injects the release name into the
template. The values that are passed into a template can be thought of as
_namespaced objects_, where a dot (`.`) separates each namespaced element.

The leading dot before `Release` indicates that we start with the top-most
namespace for this scope (we'll talk about scope in a bit). So we could read
`.Release.Name` as "start at the top namespace, find the `Release` object, then
look inside of it for an object called `Name`".

The `Release` object is one of the built-in objects for Helm, and we'll cover it
in more depth later. But for now, it is sufficient to say that this will display
the release name that the library assigns to our release.

Now when we install our resource, we'll immediately see the result of using this
template directive:

```console
$ helm install clunky-serval ./mychart
NAME: clunky-serval
LAST DEPLOYED: Tue Nov  1 17:45:37 2016
NAMESPACE: default
STATUS: DEPLOYED
REVISION: 1
TEST SUITE: None
```

You can run `helm get manifest clunky-serval` to see the entire generated YAML.

Note that the config map inside kubernetes name is `clunky-serval-configmap`
instead of `mychart-configmap` previously.

At this point, we've seen templates at their most basic: YAML files that have
template directives embedded in `{{` and `}}`. In the next part, we'll take a
deeper look into templates. But before moving on, there's one quick trick that
can make building templates faster: When you want to test the template
rendering, but not actually install anything, you can use `helm install --debug
--dry-run goodly-guppy ./mychart`. This will render the templates. But instead
of installing the chart, it will return the rendered template to you so you can
see the output:

```console
$ helm install --debug --dry-run goodly-guppy ./mychart
install.go:149: [debug] Original chart version: ""
install.go:166: [debug] CHART PATH: /Users/ninja/mychart

NAME: goodly-guppy
LAST DEPLOYED: Thu Dec 26 17:24:13 2019
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
  create: true
  name: null
tolerations: []

HOOKS:
MANIFEST:
---
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: goodly-guppy-configmap
data:
  myvalue: "Hello World"

```

Using `--dry-run` will make it easier to test your code, but it won't ensure
that Kubernetes itself will accept the templates you generate. It's best not to
assume that your chart will install just because `--dry-run` works.

In the [Chart Template Guide](_index.md), we take the basic chart we defined
here and explore the Helm template language in detail. And we'll get started
with built-in objects.
