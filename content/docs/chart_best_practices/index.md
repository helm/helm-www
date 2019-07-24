# The Chart Best Practices Guide

This guide covers the Helm Team's considered best practices for creating charts.
It focuses on how charts should be structured.

We focus primarily on best practices for charts that may be publicly deployed.
We know that many charts are for internal-use only, and authors of such charts
may find that their internal interests override our suggestions here.

## Table of Contents

- [General Conventions](./#general-conventions): Learn about general chart conventions.
- [Values Files](./#values): See the best practices for structuring `values.yaml`.
- [Templates](./#templates): Learn some of the best techniques for writing templates.
- [Requirements](./#requirements-files): Follow best practices for `requirements.yaml` files.
- [Labels and Annotations](./#labels-and-annotations): Helm has a _heritage_ of labeling and annotating.
- Kubernetes Resources:
	- [Pods and Pod Specs](./#pods-and-podtemplates): See the best practices for working with pod specifications.
	- [Role-Based Access Control](./#role-based-access-control): Guidance on creating and using service accounts, roles, and role bindings.
	- [Custom Resource Definitions](./#custom-resource-definitions): Custom Resource Definitions (CRDs) have their own associated best practices.


# General Conventions

This part of the Best Practices Guide explains general conventions.

## Chart Names

Chart names should use lower case letters and numbers, and start with a letter.

Hyphens (-) are allowed, but are known to be a little trickier to work with in Helm templates (see [issue #2192](https://github.com/helm/helm/issues/2192) for more information).

Here are a few examples of good chart names from the [Helm Community Charts](https://github.com/helm/charts):

```
drupal
cert-manager
oauth2-proxy
```

Neither uppercase letters nor underscores should be used in chart names. Dots should not be used in chart names.

The directory that contains a chart MUST have the same name as the chart. Thus, the chart `cert-manager` MUST be created in a directory called `cert-manager/`. This is not merely a stylistic detail, but a requirement of the Helm Chart format.

## Version Numbers

Wherever possible, Helm uses [SemVer 2](https://semver.org) to represent version numbers. (Note that Docker image tags do not necessarily follow SemVer, and are thus considered an unfortunate exception to the rule.)

When SemVer versions are stored in Kubernetes labels, we conventionally alter the `+` character to an `_` character, as labels do not allow the `+` sign as a value.

## Formatting YAML

YAML files should be indented using _two spaces_ (and never tabs).

## Usage of the Words Helm, Tiller, and Chart

There are a few small conventions followed for using the words Helm, helm, Tiller, and tiller.

- Helm refers to the project, and is often used as an umbrella term
- `helm` refers to the client-side command
- Tiller is the proper name of the backend
- `tiller` is the name of the binary run on the backend
- The term 'chart' does not need to be capitalized, as it is not a proper noun.

When in doubt, use _Helm_ (with an uppercase 'H').

## Restricting Tiller by Version

A `Chart.yaml` file can specify a `tillerVersion` SemVer constraint:

```yaml
name: mychart
version: 0.2.0
tillerVersion: ">=2.4.0"
```

This constraint should be set when templates use a new feature that was not
supported in older versions of Helm. While this parameter will accept sophisticated
SemVer rules, the best practice is to default to the form `>=2.4.0`, where `2.4.0`
is the version that introduced the new feature used in the chart.

This feature was introduced in Helm 2.4.0, so any version of Tiller older than
2.4.0 will simply ignore this field.

# Values

This part of the best practices guide covers using values. In this part of the
guide, we provide recommendations on how you should structure and use your
values, with focus on designing a chart's `values.yaml` file.

## Naming Conventions

Variables names should begin with a lowercase letter, and words should be
separated with camelcase:

Correct:

```yaml
chicken: true
chickenNoodleSoup: true
```

Incorrect:

```yaml
Chicken: true  # initial caps may conflict with built-ins
chicken-noodle-soup: true # do not use hyphens in the name
```

Note that all of Helm's built-in variables begin with an uppercase letter to
easily distinguish them from user-defined values: `.Release.Name`,
`.Capabilities.KubeVersion`.

## Flat or Nested Values

YAML is a flexible format, and values may be nested deeply or flattened.

Nested:

```yaml
server:
  name: nginx
  port: 80
```

Flat:

```yaml
serverName: nginx
serverPort: 80
```

In most cases, flat should be favored over nested. The reason for this is that
it is simpler for template developers and users.


For optimal safety, a nested value must be checked at every level:

```
{{ if .Values.server }}
  {{ default "none" .Values.server.name }}
{{ end }}
```

For every layer of nesting, an existence check must be done. But for flat
configuration, such checks can be skipped, making the template easier to read
and use.

```
{{ default "none" .Values.serverName }}
```

When there are a large number of related variables, and at least one of them
is non-optional, nested values may be used to improve readability.

## Make Types Clear

YAML's type coercion rules are sometimes counterintuitive. For example,
`foo: false` is not the same as `foo: "false"`. Large integers like `foo: 12345678`
will get converted to scientific notation in some cases.

The easiest way to avoid type conversion errors is to be explicit about strings,
and implicit about everything else. Or, in short, _quote all strings_.

Often, to avoid the integer casting issues, it is advantageous to store your
integers as strings as well, and use `{{ int $value }}` in the template to convert
from a string back to an integer.

In most cases, explicit type tags are respected, so `foo: !!string 1234` should
treat `1234` as a string. _However_, the YAML parser consumes tags, so the type
data is lost after one parse.

## Consider How Users Will Use Your Values

There are four potential sources of values:

- A chart's `values.yaml` file
- A values file supplied by `helm install -f` or `helm upgrade -f`
- The values passed to a `--set` or `--set-string` flag on `helm install` or `helm upgrade`
- The content of a file passed to `--set-file` flag on `helm install` or `helm upgrade`

When designing the structure of your values, keep in mind that users of your
chart may want to override them via either the `-f` flag or with the `--set`
option.

Since `--set` is more limited in expressiveness, the first guidelines for writing
your `values.yaml` file is _make it easy to override from `--set`_.

For this reason, it's often better to structure your values file using maps.

Difficult to use with `--set`:

```yaml
servers:
  - name: foo
    port: 80
  - name: bar
    port: 81
```

The above cannot be expressed with `--set` in Helm `<=2.4`. In Helm 2.5, the
accessing the port on foo is `--set servers[0].port=80`. Not only is it harder
for the user to figure out, but it is prone to errors if at some later time the
order of the `servers` is changed.

Easy to use:

```yaml
servers:
  foo:
    port: 80
  bar:
    port: 81
```

Accessing foo's port is much more obvious: `--set servers.foo.port=80`.

## Document 'values.yaml'

Every defined property in 'values.yaml' should be documented. The documentation string should begin with the name of the property that it describes, and then give at least a one-sentence description.

Incorrect:

```
# the host name for the webserver
serverHost = example
serverPort = 9191
```

Correct:

```
# serverHost is the host name for the webserver
serverHost = example
# serverPort is the HTTP listener port for the webserver
serverPort = 9191

```

Beginning each comment with the name of the parameter it documents makes it easy to grep out documentation, and will enable documentation tools to reliably correlate doc strings with the parameters they describe.

# Templates

This part of the Best Practices Guide focuses on templates.

## Structure of templates/

The templates directory should be structured as follows:

- Template files should have the extension `.yaml` if they produce YAML output. The
  extension `.tpl` may be used for template files that produce no formatted content.
- Template file names should use dashed notation (`my-example-configmap.yaml`), not camelcase.
- Each resource definition should be in its own template file.
- Template file names should reflect the resource kind in the name. e.g. `foo-pod.yaml`,
  `bar-svc.yaml`

## Names of Defined Templates

Defined templates (templates created inside a `{{ define }} ` directive) are
globally accessible. That means that a chart and all of its subcharts will have
access to all of the templates created with `{{ define }}`.

For that reason, _all defined template names should be namespaced._

Correct:

```yaml
{{- define "nginx.fullname" }}
{{/* ... */}}
{{ end -}}
```

Incorrect:

```yaml
{{- define "fullname" -}}
{{/* ... */}}
{{ end -}}
```
It is highly recommended that new charts are created via `helm create` command as the template names are automatically defined as per this best practice.

## Formatting Templates

Templates should be indented using _two spaces_ (never tabs).

Template directives should have whitespace after the opening  braces and before the
closing braces:

Correct:
```
{{ .foo }}
{{ print "foo" }}
{{- print "bar" -}}
```

Incorrect:
```
{{.foo}}
{{print "foo"}}
{{-print "bar"-}}
```

Templates should chomp whitespace where possible:

```
foo:
  {{- range .Values.items }}
  {{ . }}
  {{ end -}}
```

Blocks (such as control structures) may be indented to indicate flow of the template code.

```
{{ if $foo -}}
  {{- with .Bar }}Hello{{ end -}}
{{- end -}} 
```

However, since YAML is a whitespace-oriented language, it is often not possible for code indentation to follow that convention.

## Whitespace in Generated Templates

It is preferable to keep the amount of whitespace in generated templates to
a minimum. In particular, numerous blank lines should not appear adjacent to each
other. But occasional empty lines (particularly between logical sections) is
fine.

This is best:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example
  labels:
    first: first
    second: second
```

This is okay:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example

  labels:
    first: first
    second: second

```

But this should be avoided:

```yaml
apiVersion: batch/v1
kind: Job

metadata:
  name: example





  labels:
    first: first

    second: second

```

## Resource Naming in Templates

Hard-coding the `name:` into a resource is usually considered to be bad practice.
Names should be unique to a release. So we might want to generate a name field
by inserting the release name - for example:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ .Release.Name }}-myservice
```

Or if there is only one resource of this kind then we could use .Release.Name or the template fullname function defined in \_helpers.tpl (which uses release name):

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ template "fullname" . }}
```

However, there may be cases where it is known that there won't be naming conflicts from a fixed name.
In these cases a fixed name might make it easier for an application to find a resource such as a Service.
If the option for fixed names is needed then one way to manage this might be to make the setting of the name explicit by using a service.name value from the values.yaml if provided:

```yaml
apiVersion: v1
kind: Service
metadata:
  {{- if .Values.service.name }}
    name: {{ .Values.service.name }}
  {{- else }}
    name: {{ template "fullname" . }}
  {{- end }}
```

## Comments (YAML Comments vs. Template Comments)

Both YAML and Helm Templates have comment markers.

YAML comments:
```yaml
# This is a comment
type: sprocket
```

Template Comments:
```yaml
{{- /*
This is a comment.
*/ -}}
type: frobnitz
```

Template comments should be used when documenting features of a template, such as explaining a defined template:

```yaml
{{- /*
mychart.shortname provides a 6 char truncated version of the release name.
*/ -}}
{{ define "mychart.shortname" -}}
{{ .Release.Name | trunc 6 }}
{{- end -}}

```

Inside of templates, YAML comments may be used when it is useful for Helm users to (possibly) see the comments during debugging.

```
# This may cause problems if the value is more than 100Gi
memory: {{ .Values.maxMem | quote }}
```

The comment above is visible when the user runs `helm install --debug`, while
comments specified in `{{- /* */ -}}` sections are not.

## Use of JSON in Templates and Template Output

YAML is a superset of JSON. In some cases, using a JSON syntax can be more
readable than other YAML representations.

For example, this YAML is closer to the normal YAML method of expressing lists:

```yaml
arguments: 
  - "--dirname"
  - "/foo"
```

But it is easier to read when collapsed into a JSON list style:

```yaml
arguments: ["--dirname", "/foo"]
```

Using JSON for increased legibility is good. However, JSON syntax should not
be used for representing more complex constructs.

When dealing with pure JSON embedded inside of YAML (such as init container
configuration), it is of course appropriate to use the JSON format.

# Requirements Files

This section of the guide covers best practices for `requirements.yaml` files.

## Versions

Where possible, use version ranges instead of pinning to an exact version. The suggested default is to use a patch-level version match:

```yaml
version: ~1.2.3
```

This will match version `1.2.3` and any patches to that release.  In other words, `~1.2.3` is equivalent to `>= 1.2.3, < 1.3.0`

For the complete version matching syntax, please see the [semver documentation](https://github.com/Masterminds/semver#checking-version-constraints)

### Repository URLs

Where possible, use `https://` repository URLs, followed by `http://` URLs.

If the repository has been added to the repository index file, the repository name can be used as an alias of URL. Use `alias:` or `@` followed by repository names.

File URLs (`file://...`) are considered a "special case" for charts that are assembled by a fixed deployment pipeline. Charts that use `file://` in a `requirements.yaml` file are not allowed in the official Helm repository.

## Conditions and Tags

Conditions or tags should be added to any dependencies that _are optional_.

The preferred form of a condition is:

```yaml
condition: somechart.enabled
```

Where `somechart` is the chart name of the dependency.

When multiple subcharts (dependencies) together provide an optional or swappable feature, those charts should share the same tags.

For example, if both `nginx` and `memcached` together provided performance optimizations for the main app in the chart, and were required to both be present when that feature is enabled, then they might both have a
tags section like this:

```
tags:
  - webaccelerator
```

This allows a user to turn that feature on and off with one tag.

# Labels and Annotations

This part of the Best Practices Guide discusses the best practices for using
labels and annotations in your chart.

## Is it a Label or an Annotation?

An item of metadata should be a label under the following conditions:

- It is used by Kubernetes to identify this resource
- It is useful to expose to operators for the purpose of querying the system.

For example, we suggest using `helm.sh/chart: NAME-VERSION` as a label so that operators
can conveniently find all of the instances of a particular chart to use.

If an item of metadata is not used for querying, it should be set as an annotation
instead.

Helm hooks are always annotations.

## Standard Labels

The following table defines common labels that Helm charts use. Helm itself never requires that a particular label be present. Labels that are marked REC
are recommended, and _should_ be placed onto a chart for global consistency. Those marked OPT are optional. These are idiomatic or commonly in use, but are not relied upon frequently for operational purposes.

Name|Status|Description
-----|------|----------
`app.kubernetes.io/name` | REC | This should be the app name, reflecting the entire app. Usually `{{ template "name" . }}` is used for this. This is used by many Kubernetes manifests, and is not Helm-specific.
`helm.sh/chart` | REC | This should be the chart name and version: `{{ .Chart.Name }}-{{ .Chart.Version \| replace "+" "_" }}`.
`app.kubernetes.io/managed-by` | REC | This should always be set to `{{ .Release.Service }}`. It is for finding all things managed by Tiller.
`app.kubernetes.io/instance` | REC | This should be the `{{ .Release.Name }}`. It aids in differentiating between different instances of the same application.
`app.kubernetes.io/version` | OPT | The version of the app and can be set to `{{ .Chart.AppVersion }}`.
`app.kubernetes.io/component` | OPT | This is a common label for marking the different roles that pieces may play in an application. For example, `app.kubernetes.io/component: frontend`.
`app.kubernetes.io/part-of` | OPT | When multiple charts or pieces of software are used together to make one application. For example, application software and a database to produce a website. This can be set to the top level application being supported.

You can find more information on the Kubernetes labels, prefixed with `app.kubernetes.io`, in the [Kubernetes documentation](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/).

# Pods and PodTemplates

This part of the Best Practices Guide discusses formatting the Pod and PodTemplate
portions in chart manifests.

The following (non-exhaustive) list of resources use PodTemplates:

- Deployment
- ReplicationController
- ReplicaSet
- DaemonSet
- StatefulSet

## Images

A container image should use a fixed tag or the SHA of the image. It should not use the tags `latest`, `head`, `canary`, or other tags that are designed to be "floating".


Images _may_ be defined in the `values.yaml` file to make it easy to swap out images.

```
image: {{ .Values.redisImage | quote }}
```

An image and a tag _may_ be defined in `values.yaml` as two separate fields:

```
image: "{{ .Values.redisImage }}:{{ .Values.redisTag }}"
```

## ImagePullPolicy

`helm create` sets the `imagePullPolicy` to `IfNotPresent` by default by doing the following in your `deployment.yaml`:

```yaml
imagePullPolicy: {{ .Values.image.pullPolicy }}
```

And `values.yaml`:

```yaml
pullPolicy: IfNotPresent
```

Similarly, Kubernetes defaults the `imagePullPolicy` to `IfNotPresent` if it is not defined at all. If you want a value other than `IfNotPresent`, simply update the value in `values.yaml` to your desired value.


## PodTemplates Should Declare Selectors

All PodTemplate sections should specify a selector. For example:

```yaml
selector:
  matchLabels:
      app.kubernetes.io/name: MyName
template:
  metadata:
    labels:
      app.kubernetes.io/name: MyName
```

This is a good practice because it makes the relationship between the set and
the pod.

But this is even more important for sets like Deployment.
Without this, the _entire_ set of labels is used to select matching pods, and
this will break if you use labels that change, like version or release date.



# Custom Resource Definitions

This section of the Best Practices Guide deals with creating and using Custom Resource Definition
objects.

When working with Custom Resource Definitions (CRDs), it is important to distinguish
two different pieces:

- There is a declaration of a CRD. This is the YAML file that has the kind `CustomResourceDefinition`
- Then there are resources that _use_ the CRD. Say a CRD defines `foo.example.com/v1`. Any resource
  that has `apiVersion: example.com/v1` and kind `Foo` is a resource that uses the CRD.

## Install a CRD Declaration Before Using the Resource

Helm is optimized to load as many resources into Kubernetes as fast as possible.
By design, Kubernetes can take an entire set of manifests and bring them all
online (this is called the reconciliation loop).

But there's a difference with CRDs.

For a CRD, the declaration must be registered before any resources of that CRDs
kind(s) can be used. And the registration process sometimes takes a few seconds.

### Method 1: Separate Charts

One way to do this is to put the CRD definition in one chart, and then put any
resources that use that CRD in _another_ chart.

In this method, each chart must be installed separately.

### Method 2: Crd-install Hooks

To package the two together, add a `crd-install` hook to the CRD definition so
that it is fully installed before the rest of the chart is executed.

Note that if you create the CRD with a `crd-install` hook, that CRD definition
will not be deleted when `helm delete` is run.

# Role-Based Access Control

This part of the Best Practices Guide discusses the creation and formatting of RBAC resources in chart manifests.

RBAC resources are:

- ServiceAccount (namespaced)
- Role (namespaced)
- ClusterRole 
- RoleBinding (namespaced)
- ClusterRoleBinding

## YAML Configuration

RBAC and ServiceAccount configuration should happen under separate keys. They are separate things. Splitting these two concepts out in the YAML disambiguates them and make this clearer.

```yaml
rbac:
  # Specifies whether RBAC resources should be created
  create: true

serviceAccount:
  # Specifies whether a ServiceAccount should be created
  create: true
  # The name of the ServiceAccount to use.
  # If not set and create is true, a name is generated using the fullname template
  name:
```

This structure can be extended for more complex charts that require multiple ServiceAccounts.

```yaml
serviceAccounts:
  client:
    create: true
    name:
  server: 
    create: true
    name:
```

## RBAC Resources Should be Created by Default

`rbac.create` should be a boolean value controlling whether RBAC resources are created.  The default should be `true`.  Users who wish to manage RBAC access controls themselves can set this value to `false` (in which case see below).

## Using RBAC Resources

`serviceAccount.name` should set to the name of the ServiceAccount to be used by access-controlled resources created by the chart.  If `serviceAccount.create` is true, then a ServiceAccount with this name should be created.  If the name is not set, then a name is generated using the `fullname` template, If `serviceAccount.create` is false, then it should not be created, but it should still be associated with the same resources so that manually-created RBAC resources created later that reference it will function correctly.  If `serviceAccount.create` is false and the name is not specified, then the default ServiceAccount is used.

The following helper template should be used for the ServiceAccount.

```yaml
{{/*
Create the name of the service account to use
*/}}
{{- define "mychart.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "mychart.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}
```
