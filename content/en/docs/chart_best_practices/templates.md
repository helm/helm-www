---
title: "Templates"
description: "A closer look at best practices surrounding templates."
weight: 3
aliases: ["/docs/topics/chart_best_practices/templates/"]
---

This part of the Best Practices Guide focuses on templates.

## Structure of `templates/`

The `templates/` directory should be structured as follows:

- Template files should have the extension `.yaml` if they produce YAML output.
  The extension `.tpl` may be used for template files that produce no formatted
  content.
- Template file names should use dashed notation (`my-example-configmap.yaml`),
  not camelcase.
- Each resource definition should be in its own template file.
- Template file names should reflect the resource kind in the name. e.g.
  `foo-pod.yaml`, `bar-svc.yaml`

## Names of Defined Templates

Defined templates (templates created inside a `{{ define }} ` directive) are
globally accessible. That means that a chart and all of its subcharts will have
access to all of the templates created with `{{ define }}`.

For that reason, _all defined template names should be namespaced._

Correct:

```yaml
{{- define "nginx.fullname" -}}
{{/* ... */}}
{{- end }}
```

Incorrect:

```yaml
{{- define "fullname" -}}
{{/* ... */}}
{{- end }}
```

It is highly recommended that new charts are created via `helm create` command
as the template names are automatically defined as per this best practice.

## Formatting Templates

Template directives should have whitespace after the opening braces and before
the closing braces:

Correct:

```yaml
{{ print "foo" }}
{{- print "bar" }}
```

Incorrect:

```yaml
{{print "foo"}}
{{-print "bar"}}
```

Templates should chomp unnecessary whitespace. A good practice is to
systematically _chomp left_, but also _chomp right_ for initial content in a
defined template or a template file.

```yaml
myList:
  {{- range .Values.elements }}
  - {{ . }}
  {{- end }}
```

```yaml
{{- define "nginx.selectorLabels" -}}
app.kubernetes.io/name: {{ include "nginx.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
```

```yaml
{{- /* Initial content of a template file */ -}}
apiVersion: v1
```

Template logic should align indentation with associated content.

Correct:

```yaml
metadata:
  annotations:
    {{- if .Values.foo }}
    foo: true
    {{- end }}
    bar: true
    {{- with .Values.extraAnnotations }}
    {{- . | toYaml | nindent 4 }}
    {{- end }}
```

Incorrect:

```yaml
metadata:
  annotations:
{{- if .Values.foo }}
    foo: true
{{- end }}
    bar: true
{{- with .Values.extraAnnotations }}
{{- . | toYaml | indent 4 }}
{{- end }}
```

To align templates logic with associated content, the `nindent` function
together with left whitespace chomping is often required. `nindent` works
exactly like `indent` but prefixes a new line that can compensate for our left
whitespace chomping.

Correct:

```yaml
metadata:
  annotations:
    foo: true
    {{- with .Values.extraAnnotations }}
    {{- . | toYaml | nindent 4 }}
    {{- end }}
```

Incorrect:

```yaml
metadata:
  annotations:
    foo: true
{{- with .Values.extraAnnotations }}
{{- . | toYaml | indent 4 }}
{{- end }}
```

## Whitespace in Generated Templates

Generated content should be indented with increments of _two spaces_.

Correct:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example
  labels:
    first: first
    second: second
```

Incorrect:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
    name: example
    labels:
        first: first
        second: second
```

It is preferable to keep the amount of whitespace in generated templates to a
minimum. In particular, numerous blank lines should not appear adjacent to each
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

## Comments (YAML Comments vs. Template Comments)

Both YAML and Helm Templates have comment markers.

YAML comments:

```yaml
# This is a comment
type: sprocket
foo: bar # This is a comment, bar isn't
```

Helm template comments:

```yaml
{{- /* This is a comment (with chomping to the right). */ -}}
type: frobnitz

{{- /*
This is a multiline comment (with no chomping to the right).
*/}}
foo: bar
```

Template comments should be used when documenting features of a template, such
as explaining a defined template:

```yaml
{{- /*
mychart.shortname provides a 6 char truncated version of the release name.
*/}}
{{- define "mychart.shortname" -}}
{{ .Release.Name | trunc 6 }}
{{- end }}
```

Inside of templates, YAML comments may be used when it is useful for Helm users
to (possibly) see the comments during debugging.

```yaml
# This may cause problems if the value is more than 100Gi
memory: {{ .Values.maxMem | quote }}
```

The comment above is visible when the user runs `helm install --debug`, while
comments specified in `{{- /* */}}` sections are not.

When using template comments, watch out for a common syntax error.

Correct:

```yaml
{{- /* Correct spacing with whitespace chomping*/ -}}
{{/* Correct spacing without whitespace chomping */}}
```

Incorrect:

```yaml
{{-/* Incorrect spacing with whitespace chomping */-}}
{{ /* Incorrect spacing without whitespace chomping */ }}
```

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

Using JSON for increased legibility is good. However, JSON syntax should not be
used for representing more complex constructs.

When dealing with pure JSON embedded inside of YAML (such as init container
configuration), it is of course appropriate to use the JSON format.
