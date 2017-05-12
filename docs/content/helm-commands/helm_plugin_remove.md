+++
title = "helm plugin remove"
weight = "27"

tags = ["commands"]
section = "helm-commands"
categories = ["helm-commands"]
type = "page"

slug = "helm-plugin-remove"

[menu.main]
  url = "helm-plugin-remove"
  parent = "helm-commands"

+++

## helm plugin remove

remove one or more Helm plugins

### Synopsis


remove one or more Helm plugins

```
helm plugin remove <plugin>...
```

### Options inherited from parent commands

```
      --debug                     enable verbose output
      --home string               location of your Helm config. Overrides $HELM_HOME (default "~/.helm")
      --host string               address of tiller. Overrides $HELM_HOST
      --kube-context string       name of the kubeconfig context to use
      --tiller-namespace string   namespace of tiller (default "kube-system")
```

### SEE ALSO
* [helm plugin](#helm-plugin)	 - add, list, or remove Helm plugins