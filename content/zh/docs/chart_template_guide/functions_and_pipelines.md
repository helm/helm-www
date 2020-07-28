---
title: "Template Functions and Pipelines"
description: "Using functions in templates."
weight: 5
---

So far, we've seen how to place information into a template. But that
information is placed into the template unmodified. Sometimes we want to
transform the supplied data in a way that makes it more useable to us.

Let's start with a best practice: When injecting strings from the `.Values`
object into the template, we ought to quote these strings. We can do that by
calling the `quote` function in the template directive:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ quote .Values.favorite.drink }}
  food: {{ quote .Values.favorite.food }}
```

Template functions follow the syntax `functionName arg1 arg2...`. In the snippet
above, `quote .Values.favorite.drink` calls the `quote` function and passes it a
single argument.

Helm has over 60 available functions. Some of them are defined by the [Go
template language](https://godoc.org/text/template) itself. Most of the others
are part of the [Sprig template library](https://masterminds.github.io/sprig/).
We'll see many of them as we progress through the examples.

> While we talk about the "Helm template language" as if it is Helm-specific, it
> is actually a combination of the Go template language, some extra functions,
> and a variety of wrappers to expose certain objects to the templates. Many
> resources on Go templates may be helpful as you learn about templating.

## Pipelines

One of the powerful features of the template language is its concept of
_pipelines_. Drawing on a concept from UNIX, pipelines are a tool for chaining
together a series of template commands to compactly express a series of
transformations. In other words, pipelines are an efficient way of getting
several things done in sequence. Let's rewrite the above example using a
pipeline.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | quote }}
```

In this example, instead of calling `quote ARGUMENT`, we inverted the order. We
"sent" the argument to the function using a pipeline (`|`):
`.Values.favorite.drink | quote`. Using pipelines, we can chain several
functions together:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

> Inverting the order is a common practice in templates. You will see `.val |
> quote` more often than `quote .val`. Either practice is fine.

When evaluated, that template will produce this:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: trendsetting-p-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

Note that our original `pizza` has now been transformed to `"PIZZA"`.

When pipelining arguments like this, the result of the first evaluation
(`.Values.favorite.drink`) is sent as the _last argument to the function_. We
can modify the drink example above to illustrate with a function that takes two
arguments: `repeat COUNT STRING`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | repeat 5 | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

The `repeat` function will echo the given string the given number of times, so
we will get this for output:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: melting-porcup-configmap
data:
  myvalue: "Hello World"
  drink: "coffeecoffeecoffeecoffeecoffee"
  food: "PIZZA"
```

## Using the `default` function

One function frequently used in templates is the `default` function: `default
DEFAULT_VALUE GIVEN_VALUE`. This function allows you to specify a default value
inside of the template, in case the value is omitted. Let's use it to modify the
drink example above:

```yaml
drink: {{ .Values.favorite.drink | default "tea" | quote }}
```

If we run this as normal, we'll get our `coffee`:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: virtuous-mink-configmap
data:
  myvalue: "Hello World"
  drink: "coffee"
  food: "PIZZA"
```

Now, we will remove the favorite drink setting from `values.yaml`:

```yaml
favorite:
  #drink: coffee
  food: pizza
```

Now re-running `helm install --dry-run --debug fair-worm ./mychart` will produce
this YAML:

```yaml
# Source: mychart/templates/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fair-worm-configmap
data:
  myvalue: "Hello World"
  drink: "tea"
  food: "PIZZA"
```

In an actual chart, all static default values should live in the `values.yaml`,
and should not be repeated using the `default` command (otherwise they would be
redundant). However, the `default` command is perfect for computed values, which
can not be declared inside `values.yaml`. For example:

```yaml
drink: {{ .Values.favorite.drink | default (printf "%s-tea" (include "fullname" .)) }}
```

In some places, an `if` conditional guard may be better suited than `default`.
We'll see those in the next section.

Template functions and pipelines are a powerful way to transform information and
then insert it into your YAML. But sometimes it's necessary to add some template
logic that is a little more sophisticated than just inserting a string. In the
next section we will look at the control structures provided by the template
language.

## Using the `lookup` function

The `lookup` function can be used to _look up_ resources in a running cluster.
The synopsis of the lookup function is `lookup apiVersion, kind, namespace, name
-> resource or resource list`.

| parameter  | type   |
|------------|--------|
| apiVersion | string |
| kind       | string |
| namespace  | string |
| name       | string |

Both `name` and `namespace` are optional and can be passed as an empty string
(`""`).

The following combination of parameters are possible:

| Behavior                               | Lookup function                            |
|----------------------------------------|--------------------------------------------|
| `kubectl get pod mypod -n mynamespace` | `lookup "v1" "Pod" "mynamespace" "mypod"`  |
| `kubectl get pods -n mynamespace`      | `lookup "v1" "Pod" "mynamespace" ""`       |
| `kubectl get pods --all-namespaces`    | `lookup "v1" "Pod" "" ""`                  |
| `kubectl get namespace mynamespace`    | `lookup "v1" "Namespace" "" "mynamespace"` |
| `kubectl get namespaces`               | `lookup "v1" "Namespace" "" ""`            |

When `lookup` returns an object, it will return a dictionary. This dictionary
can be further navigated to extract specific values.

The following example will return the annotations present for the `mynamespace`
object:

```go
(lookup "v1" "Namespace" "" "mynamespace").metadata.annotations
```

When `lookup` returns a list of objects, it is possible to access the object
list via the `items` field:

```go
{{ range $index, $service := (lookup "v1" "Service" "mynamespace" "").items }}
    {{/* do something with each service */}}
{{ end }}
```

When no object is found, an empty value is returned. This can be used to check
for the existence of an object.

The `lookup` function uses Helm's existing Kubernetes connection configuration
to query Kubernetes. If any error is returned when interacting with calling the
API server (for example due to lack of permission to access a resource), helm's
template processing will fail.

Keep in mind that Helm is not supposed to contact the Kubernetes API Server
during a `helm template` or a `helm install|update|delete|rollback --dry-run`,
so the `lookup` function will return `nil` in such a case.

## Operators are functions

For templates, the operators (`eq`, `ne`, `lt`, `gt`, `and`, `or` and so on) are
all implemented as functions. In pipelines, operations can be grouped with
parentheses (`(`, and `)`).

Now we can turn from functions and pipelines to flow control with conditions,
loops, and scope modifiers.
