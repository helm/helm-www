---
title: "값"
description: "값을 구성하고 사용하는 방법을 집중적으로 다룬다."
weight: 2
---

이 부분은 모범사례 가이드의 일부로서 값(values)을 사용하는 방법을 다룬다.
여기서는 차트의 `values.yaml` 파일을 설계하는 데 초점을 맞추고, 값을 어떻게 구성하고 사용할지에 대한 권고사항을 제시한다.

## 네이밍 컨벤션

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

## 평평한(flat) 값, 중첩된(nested) 값

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

## 자료형을 명확히 하자

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

## 사용자가 값을 어떻게 사용할지를 고려하자

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

## `values.yaml`을 문서화하자

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
