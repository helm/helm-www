---
title: "Values"
description: "Focuses on how you should structure and use your values."
weight: 2
aliases: ["/docs/topics/chart_best_practices/values/"]
---

This part of the best practices guide covers using values. In this part of the
guide, we provide recommendations on how you should structure and use your
values, with focus on designing a chart's `values.yaml` file.

## Naming Conventions

Variable names should begin with a lowercase letter, and words should be
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

When there are a large number of related variables, and at least one of them is
non-optional, nested values may be used to improve readability.

## Make Types Clear

YAML's type coercion rules are sometimes counterintuitive. For example, `foo:
false` is not the same as `foo: "false"`. Large integers like `foo: 12345678`
will get converted to scientific notation in some cases.

The easiest way to avoid type conversion errors is to be explicit about strings,
and implicit about everything else. Or, in short, _quote all strings_.

Often, to avoid the integer casting issues, it is advantageous to store your
integers as strings as well, and use `{{ int $value }}` in the template to
convert from a string back to an integer.

In most cases, explicit type tags are respected, so `foo: !!string 1234` should
treat `1234` as a string. _However_, the YAML parser consumes tags, so the type
data is lost after one parse.

## Consider How Users Will Use Your Values

There are three potential sources of values:

- A chart's `values.yaml` file
- A values file supplied by `helm install -f` or `helm upgrade -f`
- The values passed to a `--set` or `--set-string` flag on `helm install` or
  `helm upgrade`

When designing the structure of your values, keep in mind that users of your
chart may want to override them via either the `-f` flag or with the `--set`
option.

Since `--set` is more limited in expressiveness, the first guidelines for
writing your `values.yaml` file is _make it easy to override from `--set`_.

For this reason, it's often better to structure your values file using maps.

Difficult to use with `--set`:

```yaml
servers:
  - name: foo
    port: 80
  - name: bar
    port: 81
```

The above cannot be expressed with `--set` in Helm `<=2.4`. In Helm 2.5,
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

## Document `values.yaml`

Every defined property in `values.yaml` should be documented. The documentation
string should begin with the name of the property that it describes, and then
give at least a one-sentence description.

Incorrect:

```yaml
# the host name for the webserver
serverHost: example
serverPort: 9191
```

Correct:

```yaml
# serverHost is the host name for the webserver
serverHost: example
# serverPort is the HTTP listener port for the webserver
serverPort: 9191
```

Beginning each comment with the name of the parameter it documents makes it easy
to grep out documentation, and will enable documentation tools to reliably
correlate doc strings with the parameters they describe.

### Nested Properties:

When documenting nested properties, use the "fully qualified" name of the property
as the documented name. Upper-level properties do not need to be documented except
in situations where the additional context will substantially increase the utility 
of the child documentation.

Correct:

```yaml
servers:
  foo:
    # servers.foo.port is the port for the foo server
    port: 80
  bar:
    # servers.bar.port is the port for the bar server
    port: 81
```

Correct:

```yaml
# servers are the upstream servers connected to by the quux service
servers:
  foo:
    # servers.foo.port is the port for the foo server
    port: 80
  bar:
    # servers.bar.port is the port for the bar server
    port: 81
```

Incorrect:

```yaml
# servers are the servers to connect to
servers:
  # foo is the foo server
  foo:
    # port is the port for the foo server
    port: 80
  # bar is the bar server
  bar:
    # port is the port for the bar server
    port: 81
```

This strikes a balance between preserving the natural readability of the values.yaml 
file and allowing for documentation tool use.

### Subchart Properties

When documenting subchart properties, defer to the subchart for property documentation
and instead aim to capture the reasoning behind providing the value overrides. Do not
add documentation where it does not provide value beyond the root documentation.

Correct:

```yaml
# see https://github.com/chartmarker/subchart/readme.md for detailed documentation
subchart:
  componentA:
    componentFeature:
      # disable componentFeature as it is not compatible with our implementation
      enabled: false
  componentB:
    replicas: 3
```

Correct:

```yaml
# see https://github.com/chartmarker/subchart/readme.md for detailed documentation
subchart:
  componentA:
    componentFeature:
      # disable componentFeature as it is not compatible with our implementation
      enabled: false
  componentB:
    # complicatedProperty is a value that controls something that is non-obvious and
    # should be documented at as low a level as possible. For additional information,
    # refer to https://github.com/chartmarker/subchart/readme.md#subchart.componentB.complicatedProperty
    complicatedProperty: "['foo', 'bar', 42, false]"
```

Incorrect:

```yaml
# subchart is the chart that deploys componentA and componentB
subchart:
  componentA:
    componentFeature:
      # enabled is the flag that controls whether componentA will be deployed
      enabled: false
  componentB:
    # replicas is the number of replicas of componentB that will be deployed
    replicas: 3
```

Attempting to replicate upstream documentation can create drift and possibly result in
incorrect chart documentation, and needless documentation can impair the overall
documentation readability while not providing any additional value.
