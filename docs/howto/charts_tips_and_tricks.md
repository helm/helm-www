---
title: Chart Development Tips and Tricks
description: Covers some of the tips and tricks Helm chart developers have learned while building production-quality charts.
sidebar_position: 1
---

This guide covers some of the tips and tricks Helm chart developers have learned
while building production-quality charts.

## Know Your Template Functions

Helm uses [Go templates](https://godoc.org/text/template) for templating your
resource files. While Go ships several built-in functions, we have added many
others.

First, we added all of the functions in the [Sprig
library](https://masterminds.github.io/sprig/), except `env` and `expandenv`, for security reasons.

We also added two special template functions: `include` and `required`. The
`include` function allows you to bring in another template, and then pass the
results to other template functions.

For example, this template snippet includes a template called `mytpl`, then
lowercases the result, then wraps that in double quotes.

```yaml
value: {{ include "mytpl" . | lower | quote }}
```

The `required` function allows you to declare a particular values entry as
required for template rendering.  If the value is empty, the template rendering
will fail with a user submitted error message.

The following example of the `required` function declares an entry for
`.Values.who` is required, and will print an error message when that entry is
missing:

```yaml
value: {{ required "A valid .Values.who entry required!" .Values.who }}
```

## Quote Strings, Don't Quote Integers

When you are working with string data, you are always safer quoting the strings
than leaving them as bare words:

```yaml
name: {{ .Values.MyName | quote }}
```

But when working with integers _do not quote the values._ That can, in many
cases, cause parsing errors inside of Kubernetes.

```yaml
port: {{ .Values.Port }}
```

This remark does not apply to env variables values which are expected to be
string, even if they represent integers:

```yaml
env:
  - name: HOST
    value: "http://host"
  - name: PORT
    value: "1234"
```

## Using the 'include' Function

Go provides a way of including one template in another using a built-in
`template` directive. However, the built-in function cannot be used in Go
template pipelines.

To make it possible to include a template, and then perform an operation on that
template's output, Helm has a special `include` function:

```
{{ include "toYaml" $value | indent 2 }}
```

The above includes a template called `toYaml`, passes it `$value`, and then
passes the output of that template to the `indent` function.

Because YAML ascribes significance to indentation levels and whitespace, this is
one great way to include snippets of code, but handle indentation in a relevant
context.

## Using the 'required' function

Go provides a way for setting template options to control behavior when a map is
indexed with a key that's not present in the map. This is typically set with
`template.Options("missingkey=option")`, where `option` can be `default`,
`zero`, or `error`. While setting this option to error will stop execution with
an error, this would apply to every missing key in the map. There may be
situations where a chart developer wants to enforce this behavior for select
values in the `values.yaml` file.

The `required` function gives developers the ability to declare a value entry as
required for template rendering. If the entry is empty in `values.yaml`, the
template will not render and will return an error message supplied by the
developer.

For example:

```
{{ required "A valid foo is required!" .Values.foo }}
```

The above will render the template when `.Values.foo` is defined, but will fail
to render and exit when `.Values.foo` is undefined.

## Using the 'tpl' Function

The `tpl` function allows developers to evaluate strings as templates inside a
template. This is useful to pass a template string as a value to a chart or
render external configuration files. Syntax: `{{ tpl TEMPLATE_STRING VALUES }}`

Examples:

```yaml
# values
template: "{{ .Values.name }}"
name: "Tom"

# template
{{ tpl .Values.template . }}

# output
Tom
```

Rendering an external configuration file:

```yaml
# external configuration file conf/app.conf
firstName={{ .Values.firstName }}
lastName={{ .Values.lastName }}

# values
firstName: Peter
lastName: Parker

# template
{{ tpl (.Files.Get "conf/app.conf") . }}

# output
firstName=Peter
lastName=Parker
```

## Creating Image Pull Secrets
Image pull secrets are essentially a combination of _registry_, _username_, and
_password_.  You may need them in an application you are deploying, but to
create them requires running `base64` a couple of times.  We can write a helper
template to compose the Docker configuration file for use as the Secret's
payload.  Here is an example:

First, assume that the credentials are defined in the `values.yaml` file like
so:
```yaml
imageCredentials:
  registry: quay.io
  username: someone
  password: sillyness
  email: someone@host.com
```

We then define our helper template as follows:
```
{{- define "imagePullSecret" }}
{{- with .Values.imageCredentials }}
{{- printf "{\"auths\":{\"%s\":{\"username\":\"%s\",\"password\":\"%s\",\"email\":\"%s\",\"auth\":\"%s\"}}}" .registry .username .password .email (printf "%s:%s" .username .password | b64enc) | b64enc }}
{{- end }}
{{- end }}
```

Finally, we use the helper template in a larger template to create the Secret
manifest:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: {{ template "imagePullSecret" . }}
```

## Automatically Roll Deployments

Often times ConfigMaps or Secrets are injected as configuration files in
containers or there are other external dependency changes that require rolling
pods. Depending on the application a restart may be required should those be
updated with a subsequent `helm upgrade`, but if the deployment spec itself
didn't change the application keeps running with the old configuration resulting
in an inconsistent deployment.

The `sha256sum` function can be used to ensure a deployment's annotation section
is updated if another file changes:

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
[...]
```

NOTE: If you're adding this to a library chart you won't be able to access your
file in `$.Template.BasePath`. Instead you can reference your definition with
`{{ include ("mylibchart.configmap") . | sha256sum }}`.

In the event you always want to roll your deployment, you can use a similar
annotation step as above, instead replacing with a random string so it always
changes and causes the deployment to roll:

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        rollme: {{ randAlphaNum 5 | quote }}
[...]
```

Each invocation of the template function will generate a unique random string.
This means that if it's necessary to sync the random strings used by multiple
resources, all relevant resources will need to be in the same template file.

Both of these methods allow your Deployment to leverage the built in update
strategy logic to avoid taking downtime.

NOTE: In the past we recommended using the `--recreate-pods` flag as another
option. This flag has been marked as deprecated in Helm 3 in favor of the more
declarative method above.

## Tell Helm Not To Uninstall a Resource

Sometimes there are resources that should not be uninstalled when Helm runs a
`helm uninstall`. Chart developers can add an annotation to a resource to
prevent it from being uninstalled.

```yaml
kind: Secret
metadata:
  annotations:
    helm.sh/resource-policy: keep
[...]
```

The annotation `helm.sh/resource-policy: keep` instructs Helm to skip deleting
this resource when a helm operation (such as `helm uninstall`, `helm upgrade` or
`helm rollback`) would result in its deletion. _However_, this resource becomes
orphaned. Helm will no longer manage it in any way. This can lead to problems if
using `helm install --replace` on a release that has already been uninstalled,
but has kept resources.

## Using "Partials" and Template Includes

Sometimes you want to create some reusable parts in your chart, whether they're
blocks or template partials. And often, it's cleaner to keep these in their own
files.

In the `templates/` directory, any file that begins with an underscore(`_`) is
not expected to output a Kubernetes manifest file. So by convention, helper
templates and partials are placed in a `_helpers.tpl` file.

## Complex Charts with Many Dependencies

Many of the charts in the CNCF [Artifact
Hub](https://artifacthub.io/packages/search?kind=0) are "building blocks" for
creating more advanced applications. But charts may be used to create instances
of large-scale applications. In such cases, a single umbrella chart may have
multiple subcharts, each of which functions as a piece of the whole.

The current best practice for composing a complex application from discrete
parts is to create a top-level umbrella chart that exposes the global
configurations, and then use the `charts/` subdirectory to embed each of the
components.

## YAML is a Superset of JSON

According to the YAML specification, YAML is a superset of JSON. That means that
any valid JSON structure ought to be valid in YAML.

This has an advantage: Sometimes template developers may find it easier to
express a datastructure with a JSON-like syntax rather than deal with YAML's
whitespace sensitivity.

As a best practice, templates should follow a YAML-like syntax _unless_ the JSON
syntax substantially reduces the risk of a formatting issue.

## Be Careful with Generating Random Values

There are functions in Helm that allow you to generate random data,
cryptographic keys, and so on. These are fine to use. But be aware that during
upgrades, templates are re-executed. When a template run generates data that
differs from the last run, that will trigger an update of that resource.

## Install or Upgrade a Release with One Command

Helm provides a way to perform an install-or-upgrade as a single command. Use
`helm upgrade` with the `--install` command. This will cause Helm to see if the
release is already installed. If not, it will run an install. If it is, then the
existing release will be upgraded.

```console
$ helm upgrade --install <release name> --values <values file> <chart directory>
```
