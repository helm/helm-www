---
title: "Lookup Function"
description: "Looking values from resources in a running cluster"
weight: 17
---

The `lookup` can be used to reources from resources in a running cluster.
The sinopsys of the lookup function is:
`lookup apiVersion(string, not-empty), kind (string, not-empty), namespace(string, can be empty), name(string, can be empty) -> resource map[string]interface{}`

Name and namespace are optional and can be passed an empty string `""`. The following combination of parameters are possible:

| Namespaced Resource | Namespace | Name | Behavior |
|:---:|:---:|:---:|:---:|
| yes | non-empty | non-empty | `kubectl get type name -n namespace` |
| yes | non-empty | empty | `kubectl get type -n namespace`, this returns a list |
| yes | empty | non-empty | `kubectl get type --all-namespaces` name is ignored, this returns a list |
| yes | empty | empty | `kubectl get type --all-namespaces`, this returns a list |
| no | non-empty | non-empty | `kubectl get type name`, namespace is ignored |
| no | non-empty | empty | `kubectl get type`, namespace is ignored, this returns a list |
| no | empty | non-empty | `kubectl get type name` |
| no | empty | empty | `kubectl get type`, this returns a list |

When the function call is designed to return an object, it will return a `map[string]interface{}` obtained from the parsing the json of the returned resource. This structure can the be further navigated to extract specific values, for example:

```go
(lookup "v1" "Namespace" "" "mynamespace").metadata.annotations
```

will return the annotations of the `mynamespace` namespace.

When the function call is designed to return a list of objects, it is possible to access the arrays of returned object via the `items` field:

```go
range (lookup "v1" "Service" "mynamespace" "").items
... do something with each service
```

When no object is found, either a empty object is returned or a list with 0 elements, either case can be a way to check for the existence of an object. For example here is a template that checks for the existence of a namespace before creating it.

```go
{{ if (lookup "v1" "Namespace" "" .Release.Namespace) != nil }}
apiVersion: v1
kind: Namespace
metadata:
  name: {{ .Release.Namespace }}
{{ end }}
```

The lookup function uses helm's existing Kubernetes connection configuration to query Kubernetes, if any error is returned when interacting with calling the master API (for example due to lack of permission to access a resource), helm's template processing will fail.
